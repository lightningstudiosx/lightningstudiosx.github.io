// The Sandwich, built entirely from code: no photos, no scans, no downloaded models.
// Every crumb hole, lettuce vein, tomato seed and ham fold is generated here.
// Usage: const s = buildSandwich(THREE, { quality: 'high' | 'low' });
//   s.root      a THREE.Group with the whole sandwich on its plate
//   s.layers    [{ key, group, meshes, cap, anchor }] from the bottom up
//   s.plate     the plate mesh
// Units are centimetres.

export function buildSandwich(THREE, opts = {}) {
  const LOW = opts.quality === 'low';
  const TS = LOW ? 512 : 1024;          // main texture size
  const TS2 = LOW ? 256 : 512;          // smaller textures
  const SEG = LOW ? 0.55 : 1;           // geometry detail

  /* ---------- random numbers and noise ---------- */
  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  // value noise that tiles every `period` units
  function noise2(seed, period = 256) {
    const r = rng(seed), g = new Float32Array(period * period);
    for (let i = 0; i < g.length; i++) g[i] = r();
    return (x, y) => {
      const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
      const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
      const X0 = ((xi % period) + period) % period, Y0 = ((yi % period) + period) % period;
      const X1 = (X0 + 1) % period, Y1 = (Y0 + 1) % period;
      const a = g[Y0 * period + X0], b = g[Y0 * period + X1], c = g[Y1 * period + X0], d = g[Y1 * period + X1];
      return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
    };
  }
  function fbm(n, x, y, oct = 4) {
    let s = 0, a = 0.5, f = 1, t = 0;
    for (let i = 0; i < oct; i++) { s += a * n(x * f, y * f); t += a; f *= 2; a *= 0.5; }
    return s / t;
  }
  // tileable cellular (Worley) noise on a cx by cy grid; writes f1, f2 and the cell's random value into out
  function worley(seed, cx, cy) {
    const r = rng(seed), n = cx * cy, px = new Float32Array(n), py = new Float32Array(n), pv = new Float32Array(n);
    for (let i = 0; i < n; i++) { px[i] = r(); py[i] = r(); pv[i] = r(); }
    return (u, v, out) => {
      const x = u * cx, y = v * cy, xi = Math.floor(x), yi = Math.floor(y);
      let f1 = 9, f2 = 9, id = 0, bx = 0, by = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const gx = xi + dx, gy = yi + dy;
        const k = (((gy % cy) + cy) % cy) * cx + (((gx % cx) + cx) % cx);
        const ex = gx + px[k] - x, ey = gy + py[k] - y, d = ex * ex + ey * ey;
        if (d < f1) { f2 = f1; f1 = d; id = k; bx = ex; by = ey; } else if (d < f2) f2 = d;
      }
      out.f1 = Math.sqrt(f1); out.f2 = Math.sqrt(f2); out.v = pv[id]; out.dx = bx; out.dy = by;
      return out;
    };
  }
  const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const mix = (a, b, t) => a + (b - a) * t;

  /* ---------- texture painting ---------- */
  function canvasOf(size) { const c = document.createElement('canvas'); c.width = c.height = size; return c; }
  // paint every pixel with fn(u, v) -> [r, g, b] (0-255); optional bump fn(u, v) -> 0..1
  function paint(size, fn, bumpFn) {
    const c = canvasOf(size), ctx = c.getContext('2d'), img = ctx.createImageData(size, size), d = img.data;
    let bc, bctx, bimg, bd;
    if (bumpFn) { bc = canvasOf(size); bctx = bc.getContext('2d'); bimg = bctx.createImageData(size, size); bd = bimg.data; }
    const col = [0, 0, 0];
    for (let j = 0; j < size; j++) for (let i = 0; i < size; i++) {
      const u = (i + 0.5) / size, v = (j + 0.5) / size, k = (j * size + i) * 4;
      fn(u, v, col);
      d[k] = col[0]; d[k + 1] = col[1]; d[k + 2] = col[2]; d[k + 3] = 255;
      if (bumpFn) { const b = Math.max(0, Math.min(255, bumpFn(u, v) * 255)); bd[k] = bd[k + 1] = bd[k + 2] = b; bd[k + 3] = 255; }
    }
    ctx.putImageData(img, 0, 0);
    if (bumpFn) bctx.putImageData(bimg, 0, 0);
    return { color: c, bump: bc };
  }
  function tex(canvas, srgb = true, repeat = 1) {
    const t = new THREE.CanvasTexture(canvas);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat, repeat);
    t.anisotropy = 8;
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  // bread crumb: a soft matrix full of irregular gas holes of many sizes (yeast bubbles set by baking)
  const crumb = (() => {
    const W1 = worley(11, 72, 58), W2 = worley(12, 156, 124), W3 = worley(13, 26, 21), n = noise2(5, 64), wn = noise2(6, 8), o = {};
    const LX = -0.6, LY = -0.8;                      // light comes from the top-left of the texture
    let lastD = 0;
    // one scale of holes: returns depth 0..1 and adds wall shading
    function holes(W, u, v, density, rmin, rmax, res) {
      W(u, v, o); if (o.v > density) return;
      const r = rmin + (rmax - rmin) * (o.v / density);
      const d = 1 - smooth(r * 0.4, r, o.f1); if (d <= 0) return;
      const len = Math.hypot(o.dx, o.dy) || 1, facing = (o.dx * LX + o.dy * LY) / len;   // which side of the hole wall we're on
      if (d > res.d) { res.d = d; res.lit = facing * smooth(r * 0.35, r * 0.85, o.f1); res.c = 1 - o.f1 / r; }
    }
    const res = { d: 0, lit: 0, c: 0 };
    return paint(TS, (u, v, out) => {
      const wu = u + (fbm(wn, u * 8, v * 8, 3) - 0.5) * 0.02, wv = v + (fbm(wn, u * 8 + 3.3, v * 8 + 1.7, 3) - 0.5) * 0.02;
      res.d = 0; res.lit = 0; res.c = 0;
      holes(W3, wu, wv, 0.07, 0.22, 0.38, res);
      holes(W1, wu, wv, 0.5, 0.22, 0.46, res);
      holes(W2, wu, wv, 0.72, 0.2, 0.44, res);
      const g = (fbm(n, u * 64, v * 64, 3) - 0.5) * 12 + (fbm(n, u * 192 + 5, v * 192, 2) - 0.5) * 14, t = res.d;
      // matrix colour, then the hole: darker toward its centre, lighter on the wall that faces the light
      let R = 248 + g, G = 237 + g, B = 208 + g * 0.7;
      const deep = 0.55 + 0.45 * res.c, wall = res.lit * 0.5;
      R = mix(R, mix(206, 164, deep) + wall * 46, t); G = mix(G, mix(186, 140, deep) + wall * 44, t); B = mix(B, mix(150, 104, deep) + wall * 38, t);
      out[0] = R; out[1] = G; out[2] = B; lastD = t * (0.6 + 0.4 * res.c);
    }, () => 1 - lastD * 0.85);
  })();

  // crust: smooth golden brown with faint freckles
  const crust = (() => {
    const n = noise2(21, 64), n2 = noise2(22, 64);
    let b = 0;
    return paint(TS2, (u, v, out) => {
      const f = fbm(n, u * 8, v * 8, 5), s = fbm(n2, u * 48, v * 48, 3);
      const fr = smooth(0.64, 0.86, s) * 0.16, lt = smooth(0.3, 0.12, s) * 0.08;
      b = 0.5 + (f - 0.5) * 0.6 + (s - 0.5) * 0.4;
      out[0] = mix(204, 158, f) * (1 - fr) + lt * 60; out[1] = mix(134, 92, f) * (1 - fr) + lt * 40; out[2] = mix(66, 40, f) * (1 - fr) + lt * 20;
    }, () => b);
  })();

  // lettuce seen from above: a pale rib, veins branching off it, darker frilly edges
  const lettuce = (() => {
    const n = noise2(31, 64), n2 = noise2(32, 64);
    let b = 0;
    return paint(TS2, (u, v, out) => {
      const x = u - 0.5, y = v - 0.5, r = Math.hypot(x, y) * 2;
      const rib = Math.abs(y + 0.04 * Math.sin(x * 9));
      const ribW = 0.035 * (1.1 - Math.abs(x) * 1.4);
      const isRib = 1 - smooth(ribW * 0.6, ribW, rib);
      const vein = 1 - smooth(0.0, 0.05, Math.abs(((x * 1.0 + rib * 1.35) * 11 + fbm(n, u * 6, v * 6) * 1.2) % 1 - 0.5) * 2 - 0.86);
      const veinFine = 1 - smooth(0.0, 0.08, Math.abs(((x * 0.6 - rib * 2.2) * 31 + fbm(n2, u * 12, v * 12) * 2) % 1 - 0.5) * 2 - 0.9);
      const mott = fbm(n, u * 40, v * 40, 4);
      const edge = smooth(0.45, 1.0, r);
      let R = mix(132, 58, edge), G = mix(200, 132, edge), B = mix(70, 34, edge);
      R += (mott - 0.5) * 22; G += (mott - 0.5) * 26; B += (mott - 0.5) * 12;
      const lv = Math.max(vein * 0.55, veinFine * 0.25) * (1 - isRib);
      R = mix(R, 214, lv * 0.6); G = mix(G, 236, lv * 0.6); B = mix(B, 160, lv * 0.6);
      R = mix(R, 222, isRib); G = mix(G, 238, isRib); B = mix(B, 168, isRib);
      out[0] = R; out[1] = G; out[2] = B;
      b = 0.5 + isRib * 0.35 + lv * 0.25 + (fbm(n2, u * 24, v * 24, 3) - 0.5) * 0.4;
    }, () => b);
  })();

  // tomato slice face: skin ring, flesh, jelly chambers with seeds, a pale core
  const tomato = (() => {
    const S = TS2, c = canvasOf(S), ctx = c.getContext('2d'), R = S * 0.5;
    const r = rng(41);
    ctx.fillStyle = '#9c140a'; ctx.fillRect(0, 0, S, S);
    const g = ctx.createRadialGradient(R, R, 0, R, R, R);
    g.addColorStop(0, '#f08066'); g.addColorStop(0.3, '#e2402a'); g.addColorStop(0.93, '#d42c19'); g.addColorStop(0.965, '#b81d10'); g.addColorStop(1, '#8e1208');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(R, R, R * 0.995, 0, Math.PI * 2); ctx.fill();
    const N = 4, a0 = r() * Math.PI;
    for (let k = 0; k < N; k++) {
      const a = a0 + k * Math.PI * 2 / N, w = Math.PI * 2 / N * 0.36;
      ctx.save(); ctx.translate(R, R); ctx.rotate(a);
      const path = new Path2D();
      const rin = R * 0.27, rout = R * 0.76;
      path.moveTo(Math.cos(-w) * rin, Math.sin(-w) * rin);
      path.quadraticCurveTo(Math.cos(-w * 1.25) * R * 0.55, Math.sin(-w * 1.25) * R * 0.55, Math.cos(-w * 0.95) * rout, Math.sin(-w * 0.95) * rout);
      path.quadraticCurveTo(rout * 1.08, 0, Math.cos(w * 0.95) * rout, Math.sin(w * 0.95) * rout);
      path.quadraticCurveTo(Math.cos(w * 1.25) * R * 0.55, Math.sin(w * 1.25) * R * 0.55, Math.cos(w) * rin, Math.sin(w) * rin);
      path.closePath();
      const jg = ctx.createRadialGradient(R * 0.5, 0, 0, R * 0.5, 0, R * 0.36);
      jg.addColorStop(0, 'rgba(250,160,90,0.95)'); jg.addColorStop(0.6, 'rgba(240,110,60,0.92)'); jg.addColorStop(1, 'rgba(225,70,40,0.9)');
      ctx.fillStyle = jg; ctx.fill(path);
      ctx.strokeStyle = 'rgba(200,40,24,0.65)'; ctx.lineWidth = S * 0.006; ctx.stroke(path);
      // seeds, mostly along the inner wall of each chamber
      for (let s = 0; s < 11; s++) {
        const t = (s / 10 - 0.5) * 1.5 * w, rr = R * (0.36 + r() * 0.2 + Math.abs(t) * 0.25);
        const x = Math.cos(t) * rr, y = Math.sin(t) * rr;
        ctx.save(); ctx.translate(x, y); ctx.rotate(t + 1.3 + r() * 0.6);
        ctx.fillStyle = 'rgba(255,236,170,0.55)'; ctx.beginPath(); ctx.ellipse(0, 0, S * 0.017, S * 0.011, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f2dc96'; ctx.beginPath(); ctx.ellipse(0, 0, S * 0.011, S * 0.0065, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    }
    // core fibres
    ctx.save(); ctx.translate(R, R);
    ctx.globalAlpha = 0.35; ctx.strokeStyle = '#ffd0b8'; ctx.lineWidth = S * 0.003;
    for (let k = 0; k < 40; k++) { const a = r() * Math.PI * 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * R * 0.25, Math.sin(a) * R * 0.25); ctx.stroke(); }
    ctx.restore();
    // grain
    const img = ctx.getImageData(0, 0, S, S), d = img.data, n = noise2(42, 64);
    for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) { const k = (j * S + i) * 4, f = (fbm(n, i / S * 48, j / S * 48, 3) - 0.5) * 26; d[k] += f; d[k + 1] += f * 0.6; d[k + 2] += f * 0.5; }
    ctx.putImageData(img, 0, 0);
    return { color: c };
  })();

  // cheddar: mottled orange with tiny crystals
  const cheese = (() => {
    const n = noise2(51, 64), r = rng(52), W = worley(53, 40, 40), o = {};
    let b = 0;
    return paint(TS2, (u, v, out) => {
      const f = fbm(n, u * 12, v * 12, 4); W(u, v, o);
      const cry = o.v < 0.07 ? (1 - smooth(0.02, 0.09, o.f1)) : 0;
      out[0] = 238 + (f - 0.5) * 12 + cry * 14; out[1] = 146 + (f - 0.5) * 22 + cry * 60; out[2] = 30 + (f - 0.5) * 14 + cry * 90;
      b = 0.5 + (f - 0.5) * 0.5 + cry * 0.3;
    }, () => b);
  })();

  // ham: pink with marbling and a pale fat rim (rim drawn in the shader-free way: by radius)
  function hamTexture(outline, uvSize, seed) {
    const n = noise2(seed, 64), n2 = noise2(seed + 1, 64);
    let b = 0;
    return paint(TS2, (u, v, out) => {
      const x = (u - 0.5) * uvSize, z = (v - 0.5) * uvSize, t = Math.atan2(z, x), rho = Math.hypot(x, z) / outline((t + Math.PI * 2) % (Math.PI * 2));
      const warp = fbm(n, u * 5, v * 5, 4) * 4;
      const m = Math.abs(Math.sin((u * 6 + v * 2.5 + warp) * Math.PI));
      const marble = 1 - smooth(0.0, 0.07, m);
      const tone = fbm(n2, u * 20, v * 20, 4);
      let R = 214 + (tone - 0.5) * 26, G = 108 + (tone - 0.5) * 26, B = 108 + (tone - 0.5) * 20;
      R = mix(R, 236, marble * 0.6); G = mix(G, 168, marble * 0.6); B = mix(B, 162, marble * 0.6);
      const fat = smooth(0.955, 0.985, rho) * smooth(-0.2, 0.5, Math.sin(t + seed * 2.1));
      R = mix(R, 240, fat); G = mix(G, 204, fat); B = mix(B, 196, fat);
      out[0] = R; out[1] = G; out[2] = B;
      b = 0.5 + marble * 0.2 + fat * 0.3 + (tone - 0.5) * 0.3;
    }, () => b);
  }

  /* ---------- geometry: a closed, puffy slab around any outline ---------- */
  // o.outline(t) radius at angle t; o.rings rho values 0..1; o.nT angle steps;
  // o.half(rho) half thickness; o.lift(x, z, rho, t) height of the middle; o.rimFrom: rho where group 1 starts;
  // o.uvSize: world size covered by the face texture; o.rimUV: world size covered by the rim texture
  function slab(o) {
    const nT = Math.max(24, Math.round(o.nT * SEG)), R = o.rings, nR = R.length;
    const iRim = o.rimFrom == null ? nR : R.findIndex(r => r >= o.rimFrom - 1e-9);
    const P = [], UV = [], CO = [], idx0 = [], idx1 = [];
    const ts = [], rT = [];
    for (let j = 0; j <= nT; j++) { const t = j / nT * Math.PI * 2; ts.push(t); rT.push(o.outline(t % (Math.PI * 2))); }
    // perimeter for rim u coordinate
    const L = [0];
    for (let j = 1; j <= nT; j++) L.push(L[j - 1] + Math.hypot(Math.cos(ts[j]) * rT[j] - Math.cos(ts[j - 1]) * rT[j - 1], Math.sin(ts[j]) * rT[j] - Math.sin(ts[j - 1]) * rT[j - 1]));
    const H0 = o.half(R[Math.min(iRim, nR - 1)]);
    function add(i, j, s, rim) {
      const rho = R[i], t = ts[j], r = rT[j] * rho, x = Math.cos(t) * r, z = Math.sin(t) * r;
      const y = o.lift(x, z, rho, t) + s * o.half(rho);
      P.push(x, y, z);
      if (rim) {
        const dist = (rho - R[iRim]) * rT[j] + (H0 - o.half(rho));
        UV.push(L[j] / o.rimUV, 0.5 - s * dist / o.rimUV);
      } else UV.push(x / o.uvSize + 0.5, z / o.uvSize + 0.5);
      if (o.color) { const c = o.color(x, z, rho, t, s); CO.push(c[0], c[1], c[2]); }
      return P.length / 3 - 1;
    }
    for (const s of [1, -1]) {
      const A = [], B = [];
      for (let i = 0; i < nR; i++) {
        A[i] = [];
        if (i === 0) { A[0][0] = add(0, 0, s, false); continue; }
        for (let j = 0; j < nT; j++) A[i][j] = add(i, j, s, false);
        if (i >= iRim) { B[i] = []; for (let j = 0; j <= nT; j++) B[i][j] = add(i, j, s, true); }
      }
      for (let i = 0; i < nR - 1; i++) {
        const rim = i >= iRim;
        for (let j = 0; j < nT; j++) {
          const jn = j + 1;
          if (i === 0) { const c = A[0][0], a = A[1][j], b = A[1][jn % nT]; if (s > 0) idx0.push(c, b, a); else idx0.push(c, a, b); continue; }
          let a, b, c, d, arr;
          if (rim) { a = B[i][j]; b = B[i + 1][j]; c = B[i + 1][jn]; d = B[i][jn]; arr = idx1; }
          else { a = A[i][j]; b = A[i + 1][j]; c = A[i + 1][jn % nT]; d = A[i][jn % nT]; arr = idx0; }
          if (s > 0) arr.push(a, c, b, a, d, c); else arr.push(a, b, c, a, c, d);
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(UV, 2));
    if (o.color) g.setAttribute('color', new THREE.Float32BufferAttribute(CO, 3));
    g.setIndex(idx0.concat(idx1));
    g.addGroup(0, idx0.length, 0);
    if (idx1.length) g.addGroup(idx0.length, idx1.length, 1);
    g.computeVertexNormals();
    g.computeBoundingSphere();
    return g;
  }
  // rings packed tighter near the edge, where the shape curves
  function rings(nIn, nEdge, edgeFrom) {
    const r = [];
    for (let i = 0; i <= nIn; i++) r.push(edgeFrom * i / nIn);
    for (let i = 1; i <= nEdge; i++) { const u = i / nEdge; r.push(edgeFrom + (1 - edgeFrom) * (1 - Math.pow(1 - u, 1.6))); }
    return r;
  }
  const squircle = (t, h, n) => h / Math.pow(Math.pow(Math.abs(Math.cos(t)), n) + Math.pow(Math.abs(Math.sin(t)), n), 1 / n);
  const edgeProfile = (H, from, p = 4) => rho => rho <= from ? H : H * Math.pow(Math.max(0, 1 - Math.pow((rho - from) / (1 - from), p)), 1 / p);

  /* ---------- the bread shape (shared by both slices and used for drooping) ---------- */
  function breadR(t) {
    let r = squircle(t, 5.4, 5);
    const da = Math.atan2(Math.sin(t - 1.5 * Math.PI), Math.cos(t - 1.5 * Math.PI));   // 0 on the domed (-z) side
    if (Math.abs(da) < Math.PI / 2) r += 0.75 * Math.pow(Math.cos(da), 6);
    r += 0.24 * Math.exp(-Math.pow(Math.abs(da) - 0.78, 2) / 0.02);
    return r;
  }
  const breadRAt = (x, z) => breadR((Math.atan2(z, x) + Math.PI * 2) % (Math.PI * 2));
  const overhang = (x, z, k = 0.97) => Math.max(0, Math.hypot(x, z) - breadRAt(x, z) * k);
  const geoNoise = noise2(77, 256);

  /* ---------- materials ---------- */
  const M = {};
  const crumbMap = tex(crumb.color, true, 1), crumbBump = tex(crumb.bump, false, 1);
  const crustMap = tex(crust.color, true, 1), crustBump = tex(crust.bump, false, 1);
  M.crumb = new THREE.MeshPhysicalMaterial({ map: crumbMap, bumpMap: crumbBump, bumpScale: 5, roughness: 0.95 });
  M.crust = new THREE.MeshPhysicalMaterial({ map: crustMap, bumpMap: crustBump, bumpScale: 3, roughness: 0.62, vertexColors: true, clearcoat: 0.08, clearcoatRoughness: 0.7 });
  M.mayo = new THREE.MeshPhysicalMaterial({ color: '#f6eed2', roughness: 0.28, clearcoat: 0.6, clearcoatRoughness: 0.25 });
  M.lettuce = new THREE.MeshPhysicalMaterial({ map: tex(lettuce.color), bumpMap: tex(lettuce.bump, false), bumpScale: 4, roughness: 0.4, clearcoat: 0.5, clearcoatRoughness: 0.3, vertexColors: true });
  M.lettuceEdge = M.lettuce;
  M.tomato = new THREE.MeshPhysicalMaterial({ map: tex(tomato.color), roughness: 0.3, clearcoat: 0.85, clearcoatRoughness: 0.18 });
  M.tomatoSkin = new THREE.MeshPhysicalMaterial({ color: '#b3170b', roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.08 });
  M.cheese = new THREE.MeshPhysicalMaterial({ map: tex(cheese.color), bumpMap: tex(cheese.bump, false), bumpScale: 1.5, roughness: 0.45, clearcoat: 0.15, clearcoatRoughness: 0.5 });
  M.olive = new THREE.MeshPhysicalMaterial({ color: '#6f7d22', roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.05 });
  M.pimento = new THREE.MeshPhysicalMaterial({ color: '#c8231a', roughness: 0.3, clearcoat: 0.8 });
  M.pick = new THREE.MeshStandardMaterial({ color: '#e5cd9c', roughness: 0.75 });
  M.plate = new THREE.MeshPhysicalMaterial({ color: '#fbfbfa', roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.06 });

  // flat colours for the cut faces (shown when the sandwich is sliced)
  const capCrumb = new THREE.MeshStandardMaterial({ map: (() => { const t = crumbMap.clone(); t.repeat.set(40 / 12, 40 / 12); t.needsUpdate = true; return t; })(), roughness: 0.95 });
  const CAPS = {
    bread: capCrumb,
    mayo: new THREE.MeshStandardMaterial({ color: '#f3e9c6', roughness: 0.3 }),
    lettuce: new THREE.MeshStandardMaterial({ color: '#9fcf5c', roughness: 0.4 }),
    tomato: new THREE.MeshStandardMaterial({ color: '#e0442b', roughness: 0.25 }),
    cheese: new THREE.MeshStandardMaterial({ color: '#f5ab3a', roughness: 0.45 }),
    ham: new THREE.MeshStandardMaterial({ color: '#e59a96', roughness: 0.4 }),
  };

  const shadowy = m => { m.castShadow = true; m.receiveShadow = true; return m; };
  const layers = [];
  const root = new THREE.Group();

  /* ---------- 1 + 7: bread ---------- */
  function breadSlice(baseY, top, seed) {
    const H = 0.62, from = 0.95;
    const nz = noise2(seed, 256);
    const g = slab({
      outline: breadR, nT: 220, rings: [0, 0.2, 0.4, 0.6, 0.75, 0.85, 0.91, 0.935, 0.95, 0.962, 0.972, 0.981, 0.988, 0.994, 0.998, 1],
      half: edgeProfile(H, from, 4), rimFrom: 0.935, uvSize: 12, rimUV: 6,
      lift: (x, z, rho) => baseY + (fbm(nz, x * 0.35 + 9, z * 0.35 + 4, 3) - 0.5) * 0.07 + (top ? 0.13 * (1 - rho * rho) : 0.03 * (1 - rho * rho)),
      color: (x, z) => { const k = 1 - 0.32 * smooth(-1.5, -5.6, z); return [k, k * 0.95, k * 0.9]; },
    });
    return shadowy(new THREE.Mesh(g, [M.crumb, M.crust]));
  }

  /* ---------- 2: mayo ---------- */
  function mayoLayer(baseY) {
    const g = slab({
      outline: t => squircle(t, 4.95, 5) + 0.12 * Math.sin(7 * t + 1) + 0.08 * Math.sin(13 * t + 2.2) + 0.05 * Math.sin(29 * t),
      nT: 180, rings: rings(4, 5, 0.86), half: edgeProfile(0.05, 0.86, 2), uvSize: 12, rimUV: 6,
      lift: (x, z) => baseY + (fbm(geoNoise, x * 0.35 + 9, z * 0.35 + 4, 3) - 0.5) * 0.07 + (fbm(geoNoise, x * 1.3 + 50, z * 1.3, 2) - 0.5) * 0.05,
    });
    return shadowy(new THREE.Mesh(g, M.mayo));
  }

  /* ---------- 3: lettuce (pressed flat under the tomatoes, frilly where it hangs out) ---------- */
  const TOMATOES = [{ x: 0.25, z: -2.45, r: 2.85, a: 0.4 }, { x: -0.2, z: 2.55, r: 2.75, a: 1.9 }];
  const TOM_Y = 1.86, TOM_H = 0.27;
  function lettuceLayer(baseY, ox, oz, rot, seed, scale = 1) {
    const nz = noise2(seed, 256), c = Math.cos(rot), s = Math.sin(rot);
    const R0 = 6.3 * scale;
    const outline = t => R0 * (1 + 0.06 * Math.sin(3 * t + 0.4 + seed) + 0.045 * Math.sin(5 * t + 1.3) + 0.03 * Math.sin(11 * t + 2) + 0.018 * Math.sin(23 * t + 0.5));
    const g = slab({
      outline, nT: 300, rings: rings(10, 12, 0.5), half: edgeProfile(0.035, 0.96, 2), uvSize: R0 * 2.1, rimUV: 4,
      lift: (x, z, rho, t) => {
        const wx = ox + x * c - z * s, wz = oz + x * s + z * c;   // sandwich coordinates
        let y = baseY + (fbm(nz, x * 0.5, z * 0.5, 3) - 0.5) * 0.08;
        const A = 0.36 * Math.pow(smooth(0.45, 1, rho), 1.3);
        y += A * (0.6 * Math.sin(21 * t + 3 * rho + 1.3 + seed) + 0.4 * Math.sin(37 * t + 2.1) + 0.35 * (fbm(nz, x * 1.5 + 30, z * 1.5, 3) - 0.5));
        const d = overhang(wx, wz, 0.96);
        y -= 0.42 * Math.pow(d, 1.25) + 0.12 * d;
        for (const T of TOMATOES) { const dd = Math.hypot(wx - T.x, wz - T.z); if (dd < T.r + 0.35) y = Math.min(y, TOM_Y - TOM_H - 0.045 - Math.max(0, dd - T.r) * 0.25); }
        return y;
      },
      color: (x, z, rho) => { const k = 0.85 + 0.15 * (1 - smooth(0.6, 1, rho)); return [k, k, k]; },
    });
    const m = shadowy(new THREE.Mesh(g, M.lettuce));
    m.position.set(ox, 0, oz); m.rotation.y = -rot;
    return m;
  }

  /* ---------- 4: tomato slices ---------- */
  function tomatoSlice(T, seed) {
    const nz = noise2(seed, 256);
    const outline = t => T.r * (1 + 0.025 * Math.sin(5 * t + seed) + 0.02 * Math.sin(3 * t + 1));
    const g = slab({
      outline, nT: 140, rings: [0, 0.3, 0.6, 0.85, 0.94, 0.97, 0.985, 0.995, 1], half: edgeProfile(TOM_H, 0.94, 3), rimFrom: 0.97,
      uvSize: T.r * 2.02, rimUV: 3,
      lift: (x, z) => TOM_Y + (fbm(nz, x * 0.6, z * 0.6, 2) - 0.5) * 0.05 + x * 0.012,
    });
    const m = shadowy(new THREE.Mesh(g, [M.tomato, M.tomatoSkin]));
    m.position.set(T.x, 0, T.z); m.rotation.y = T.a;
    return m;
  }

  /* ---------- 5: cheese (a square slice turned 45°, corners drooping) ---------- */
  function cheeseLayer(baseY) {
    const rot = Math.PI / 4 + 0.05, c = Math.cos(rot), s = Math.sin(rot);
    const g = slab({
      outline: t => squircle(t, 5.15, 9) * 0.995 + 0.025 * Math.sin(9 * t), nT: 200, rings: rings(8, 5, 0.94), half: edgeProfile(0.1, 0.94, 3),
      uvSize: 11, rimUV: 11,
      lift: (x, z) => { const wx = x * c - z * s, wz = x * s + z * c, d = overhang(wx, wz, 0.99); return baseY - 0.3 * Math.pow(d, 1.6) - 0.22 * d + (fbm(geoNoise, x * 0.7, z * 0.7 + 20, 2) - 0.5) * 0.04; },
    });
    const m = shadowy(new THREE.Mesh(g, M.cheese));
    m.rotation.y = -rot;
    return m;
  }

  /* ---------- 6: ham, three folded slices ---------- */
  function hamSlice(baseY, ox, oz, rot, seed) {
    const c = Math.cos(rot), s = Math.sin(rot), R0 = 5.05;
    const outline = t => R0 * (1 + 0.05 * Math.sin(2 * t + seed) + 0.03 * Math.sin(5 * t + seed * 2) + 0.015 * Math.sin(11 * t));
    const nz = noise2(seed * 7, 256);
    const g = slab({
      outline, nT: 220, rings: rings(10, 6, 0.9), half: edgeProfile(0.07, 0.95, 2), uvSize: R0 * 2.3, rimUV: 6,
      lift: (x, z, rho) => {
        const wx = ox + x * c - z * s, wz = oz + x * s + z * c;
        let y = baseY + 0.14 * Math.sin(1.25 * x + seed) * (0.45 + 0.55 * rho) + 0.05 * Math.sin(2.7 * z + seed * 3) * rho + (fbm(nz, x * 0.8, z * 0.8, 2) - 0.5) * 0.05;
        const d = overhang(wx, wz, 0.99);
        y -= 0.45 * Math.pow(d, 1.4) + 0.3 * d;
        return y;
      },
    });
    const ht = hamTexture(outline, R0 * 2.3, 60 + seed);
    const hm = new THREE.MeshPhysicalMaterial({ map: tex(ht.color), bumpMap: tex(ht.bump, false), bumpScale: 2, roughness: 0.42, clearcoat: 0.12, clearcoatRoughness: 0.4 });
    const m = shadowy(new THREE.Mesh(g, hm));
    m.position.set(ox, 0, oz); m.rotation.y = -rot;
    return m;
  }

  /* ---------- 8: olive on a toothpick ---------- */
  function oliveLayer() {
    const grp = new THREE.Group(), X = -1.9, Z = -1.35;
    const stick = shadowy(new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 6.0, 12), M.pick)); stick.position.set(X, 3.3, Z);
    const tipTop = shadowy(new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.45, 12), M.pick)); tipTop.position.set(X, 6.52, Z);
    const olive = shadowy(new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), M.olive)); olive.scale.set(0.62, 0.8, 0.62); olive.position.set(X, 5.34, Z);
    const pim = shadowy(new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), M.pimento)); pim.scale.set(0.27, 0.13, 0.27); pim.position.set(X, 6.09, Z);
    grp.add(stick, tipTop, olive, pim);
    return grp;
  }

  /* ---------- assemble ---------- */
  function addLayer(key, meshes, cap, anchor) {
    const group = new THREE.Group(); meshes.forEach(m => group.add(m));
    root.add(group);
    layers.push({ key, group, meshes, cap, anchor });
  }
  const B1 = 0.62, TOP = 3.74;
  const bot = breadSlice(B1, false, 3);
  addLayer('bottomBread', [bot], CAPS.bread, { outside: [5.45, 0.5, 1.45], cut: [0, 0.6, -3.0] });
  addLayer('mayo', [mayoLayer(1.27)], CAPS.mayo, { outside: [3.9, 1.33, 2.6], cut: [0, 1.31, 4.3] });
  addLayer('lettuce', [lettuceLayer(1.45, 0.25, -0.2, 0.3, 1)], CAPS.lettuce, { outside: [-2.4, 1.1, 5.7], cut: [0, 1.5, -5.0] });
  addLayer('tomato', TOMATOES.map((T, i) => tomatoSlice(T, 10 + i)), CAPS.tomato, { outside: [-0.2, 1.86, 5.25], cut: [0, 1.86, -2.4] });
  addLayer('cheese', [cheeseLayer(2.26)], CAPS.cheese, { outside: [6.5, 1.55, 0.35], cut: [0, 2.27, 3.1] });
  addLayer('ham', [hamSlice(2.57, -0.4, 0.3, 0.2, 1), hamSlice(2.7, 0.5, -0.35, 1.4, 2), hamSlice(2.83, 0.05, 0.35, 2.6, 3)], CAPS.ham, { outside: [5.3, 2.62, -2.2], cut: [0, 2.7, 0.2] });
  const top = breadSlice(TOP, true, 9); top.rotation.y = 0.05; top.position.set(0.1, 0, -0.06);
  addLayer('topBread', [top], CAPS.bread, { outside: [1.8, 4.42, 1.6], cut: [0, 3.75, 2.4] });
  const ol = oliveLayer();
  addLayer('olive', [ol], null, { outside: [-1.45, 5.3, -0.9], cut: [-1.45, 5.3, -0.9] });

  /* ---------- the plate and some crumbs ---------- */
  const prof = [[0, 0], [8.6, 0], [9.6, 0.08], [10.6, 0.32], [11.5, 0.8], [11.85, 0.95], [11.98, 0.9], [11.8, 0.72], [10.4, 0.06], [8.8, -0.18], [8.4, -0.3], [7.7, -0.3], [7.55, -0.2], [0, -0.2]]
    .map(([r, y]) => new THREE.Vector2(r, y));
  const plate = new THREE.Mesh(new THREE.LatheGeometry(prof, Math.round(128 * SEG)), M.plate);
  plate.position.y = -0.012; plate.receiveShadow = true;
  root.add(plate);
  const crumbs = new THREE.Group(); root.add(crumbs);
  const crumbGeo = new THREE.IcosahedronGeometry(1, 1);
  { const p = crumbGeo.attributes.position, r = rng(91); for (let i = 0; i < p.count; i++) { const k = 0.7 + r() * 0.5; p.setXYZ(i, p.getX(i) * k, p.getY(i) * k * 0.7, p.getZ(i) * k); } crumbGeo.computeVertexNormals(); }
  function addCrumb(x, z, y = 0.05, s = 0.12) {
    const m = new THREE.Mesh(crumbGeo, Math.random() < 0.7 ? M.crumb : M.crust.clone());
    if (m.material !== M.crumb) { m.material.vertexColors = false; }
    m.scale.setScalar(s * (0.6 + Math.random() * 0.8)); m.position.set(x, y, z); m.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
    m.castShadow = true; crumbs.add(m); return m;
  }
  { const r = rng(5); for (let i = 0; i < 9; i++) { const a = r() * Math.PI * 2, d = 6.4 + r() * 3.2; addCrumb(Math.cos(a) * d, Math.sin(a) * d, 0.06, 0.08 + r() * 0.08); } }

  return {
    root, layers, plate, crumbs, addCrumb, materials: M, breadR,
    dispose() { root.traverse(o => { if (o.geometry) o.geometry.dispose(); }); },
  };
}
