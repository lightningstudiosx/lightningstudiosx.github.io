// SCRAMBLE: a chunky button resting on top of the 3rd game from the right in the top row.
// Press it and two 3D hands reach in over the page, swirl the game tiles around like dominoes
// on a table, shuffle every game into a new spot, then pick one up and hand it to you.
// The hands are built from code with three.js (already on the page for the sandwich) and cast
// real shadows onto the page. Tiles are reordered with CSS `order`, never moved in the DOM, so the
// live iframe tiles don't reload.

const grid = document.querySelector('main.games');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let busy = false;

// ------------------------------------------------------------------ the button
const btn = document.createElement('button');
btn.id = 'scrambleBtn';
btn.type = 'button';
btn.innerHTML = '<span class="scr-face">SCRAMBLE</span>';
btn.setAttribute('aria-label', 'Scramble: shuffle every game and get handed a new one to play');
grid.appendChild(btn);

const tiles = () => [...grid.querySelectorAll(':scope > .game-tile')];
const shown = () => tiles().filter(t => t.offsetParent !== null);

function placeButton() {
  const list = shown();
  if (!list.length) return;
  const top = Math.min(...list.map(t => t.offsetTop));
  const row = list.filter(t => Math.abs(t.offsetTop - top) < 4).sort((a, b) => a.offsetLeft - b.offsetLeft);
  const target = row.length >= 3 ? row[row.length - 3] : row[0];
  btn.style.left = (target.offsetLeft + target.offsetWidth / 2) + 'px';
  btn.style.top = target.offsetTop + 'px';
}
placeButton();
addEventListener('resize', placeButton);
addEventListener('load', placeButton);
new ResizeObserver(placeButton).observe(grid);
btn.addEventListener('click', () => scramble());
// The hands work in screen space, so hold the page still while they move tiles around.
const holdScroll = e => { if (busy && !(card && card.open)) e.preventDefault(); };
addEventListener('wheel', holdScroll, { passive: false });
addEventListener('touchmove', holdScroll, { passive: false });
addEventListener('keydown', e => {
  if (busy && !(card && card.open) && [' ', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) e.preventDefault();
});

// ------------------------------------------------------------------ small helpers
const wait = ms => new Promise(r => setTimeout(r, ms));
const easeInOut = k => k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const easeOut = k => 1 - Math.pow(1 - k, 3);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function shuffled(n) {
  const a = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function gameName(tile) {
  const label = tile.getAttribute('aria-label');
  if (label) return label.split(':')[0].trim();
  const img = tile.querySelector('img');
  return img ? img.alt : tile.textContent.trim();
}

function inView(r, margin = 0) {
  return r.top >= margin && r.left >= 0 && r.bottom <= innerHeight - margin && r.right <= innerWidth && r.width > 0;
}

// ------------------------------------------------------------------ three.js hands
let H = null; // the hand rig, built on first use

async function ensureHands() {
  if (H) return H;
  const THREE = await import('three');
  const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');
  const { RoundedBoxGeometry } = await import('three/addons/geometries/RoundedBoxGeometry.js');

  const canvas = document.createElement('canvas');
  canvas.id = 'scrHands';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.92;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(renderer), 0.04).texture;
  const camera = new THREE.PerspectiveCamera(35, 1, 10, 10000);

  scene.add(new THREE.HemisphereLight(0xfff1e6, 0x5a3a2c, 0.4));
  const key = new THREE.DirectionalLight(0xffeedd, 2.9);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.bias = -0.0006;
  key.shadow.normalBias = 0.6;
  key.shadow.radius = 6;
  scene.add(key, key.target);
  const rim = new THREE.DirectionalLight(0xffd9c4, 0.7);
  scene.add(rim);

  // The page itself: an invisible plane that only shows the hands' shadows.
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.ShadowMaterial({ opacity: 0.3 }));
  floor.receiveShadow = true;
  scene.add(floor);

  // --- skin: fine pore/crease bump texture, made on a canvas
  const skinCanvas = document.createElement('canvas');
  skinCanvas.width = skinCanvas.height = 256;
  const g = skinCanvas.getContext('2d');
  const img = g.createImageData(256, 256);
  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 256; x++) {
      let v = 128 + (Math.random() - 0.5) * 34;
      if (Math.random() < 0.015) v -= 55;                       // pores
      v += Math.sin((x * 0.9 + y * 0.35) * 0.55) * 6;           // faint creases
      const i = (y * 256 + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = clamp(v, 0, 255);
      img.data[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  const bump = new THREE.CanvasTexture(skinCanvas);
  bump.wrapS = bump.wrapT = THREE.RepeatWrapping;
  bump.repeat.set(3, 3);

  // Warm, slightly translucent-looking skin: a red emissive undertone fakes light scattering
  // under the surface, and a low sheen gives the soft rim real skin has.
  const skinMat = (color, blush) => new THREE.MeshPhysicalMaterial({
    color, roughness: 0.56, metalness: 0, bumpMap: bump, bumpScale: 0.045,
    emissive: new THREE.Color(blush), emissiveIntensity: 0.22, envMapIntensity: 0.55,
    sheen: 0.28, sheenColor: new THREE.Color(0xff7d5c), sheenRoughness: 0.6, clearcoat: 0.08, clearcoatRoughness: 0.55
  });
  const SKIN = skinMat(0xc98767, 0x5a1a0c);
  const SKIN_WARM = skinMat(0xc77560, 0x6e1d10);   // fingertips and knuckles run a little redder
  const NAIL = new THREE.MeshPhysicalMaterial({ color: 0xe8b3a4, envMapIntensity: 0.7, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.08 });
  const NAIL_TIP = new THREE.MeshPhysicalMaterial({ color: 0xf4e6dc, envMapIntensity: 0.6, roughness: 0.3, clearcoat: 0.6 });
  const SLEEVE = new THREE.MeshPhysicalMaterial({ color: 0x2d3f63, roughness: 0.88, sheen: 1, sheenColor: new THREE.Color(0x7d96c2), sheenRoughness: 0.8 });
  const CUFF = new THREE.MeshPhysicalMaterial({ color: 0xf4f1ea, roughness: 0.8, sheen: 0.6, sheenColor: new THREE.Color(0xffffff) });

  function mesh(geo, mat, parent) {
    const m = new THREE.Mesh(geo, mat);
    m.castShadow = true;
    parent.add(m);
    return m;
  }

  // Palm: a rounded box sculpted narrower at the wrist, domed on the back, padded underneath.
  function palmGeometry() {
    const geo = new RoundedBoxGeometry(8.2, 9.6, 2.6, 6, 1.2);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const t = (y + 4.8) / 9.6;
      x *= 0.84 + 0.16 * Math.sin(t * Math.PI * 0.5);
      const across = 1 - Math.pow(x / 4.1, 2);
      if (z > 0) z += 0.55 * across * (0.6 + 0.4 * t);
      else z -= 0.35 * across * (1 - Math.abs(y) / 4.8);
      z -= 0.25 * Math.pow(x / 4.1, 2);                       // slight cup
      p.setXYZ(i, x, y, z);
    }
    geo.computeVertexNormals();
    return geo;
  }

  function buildHand(mirror) {
    const root = new THREE.Group();
    const flip = new THREE.Group();
    if (mirror) flip.scale.x = -1;
    root.add(flip);
    const pivot = new THREE.Group();
    pivot.position.y = -5.2;                                   // root origin = palm centre
    flip.add(pivot);

    mesh(palmGeometry(), SKIN, pivot).position.y = 4.8;
    // thenar (thumb muscle) and hypothenar pads soften the palm edges
    const pad = new THREE.SphereGeometry(1, 20, 14);
    const thenar = mesh(pad, SKIN, pivot);
    thenar.position.set(-2.7, 3.0, -0.35);
    thenar.scale.set(2.1, 3.2, 1.45);
    const hypo = mesh(pad, SKIN, pivot);
    hypo.position.set(3.3, 3.6, -0.3);
    hypo.scale.set(1.3, 3.5, 1.25);

    // forearm, shirt sleeve and cuff
    const arm = mesh(new THREE.CylinderGeometry(2.75, 3.35, 17, 32), SKIN, pivot);
    arm.position.y = -8.2;
    arm.scale.set(1.32, 1, 0.78);
    const wristBone = mesh(pad, SKIN, pivot);
    wristBone.position.set(2.9, -0.6, 0.2);
    wristBone.scale.set(0.7, 0.7, 0.6);
    const sleeve = mesh(new THREE.CylinderGeometry(5.1, 5.6, 34, 36), SLEEVE, pivot);
    sleeve.position.y = -28;
    sleeve.scale.set(1.2, 1, 0.86);
    const cuff = mesh(new THREE.CylinderGeometry(5.0, 5.15, 3.2, 36), CUFF, pivot);
    cuff.position.y = -11.4;
    cuff.scale.set(1.2, 1, 0.86);

    const fingers = [];
    function digit(x, y, z, lens, radii, splay, tilt, parent) {
      const base = new THREE.Group();
      base.position.set(x, y, z);
      base.rotation.z = splay;
      base.rotation.x = tilt;
      parent.add(base);
      const joints = [base];
      let holder = base;
      let tipMarker = null;
      lens.forEach((len, i) => {
        const r = radii[i];
        const last = i === lens.length - 1;
        const seg = mesh(new THREE.CapsuleGeometry(r, len, 8, 18), last ? SKIN_WARM : SKIN, holder);
        seg.position.y = len / 2;
        seg.scale.z = 0.86;
        if (last) {
          const nail = mesh(new THREE.SphereGeometry(1, 20, 12), NAIL, holder);
          nail.position.set(0, len * 0.55 + r * 0.25, r * 0.74);
          nail.scale.set(r * 0.74, len * 0.5 + r * 0.25, r * 0.2);
          nail.rotation.x = -0.12;
          const tip = mesh(new THREE.SphereGeometry(1, 16, 8), NAIL_TIP, holder);
          tip.position.set(0, len + r * 0.62, r * 0.6);
          tip.scale.set(r * 0.66, r * 0.2, r * 0.16);
          tipMarker = new THREE.Object3D();
          tipMarker.position.set(0, len + r, 0);
          holder.add(tipMarker);
        } else {
          // knuckle wrinkles / joint bulge on the back of the finger
          const bulge = mesh(new THREE.SphereGeometry(1, 14, 10), SKIN_WARM, holder);
          bulge.position.set(0, len, r * 0.42);
          bulge.scale.set(r * 0.78, r * 0.55, r * 0.5);
          const next = new THREE.Group();
          next.position.y = len;
          holder.add(next);
          holder = next;
          joints.push(next);
        }
      });
      return { joints, splay, tilt, get tip() { return tipMarker; } };
    }

    // index, middle, ring, little (right hand, back of hand toward the camera, thumb on -x)
    const spec = [
      [-2.95, 9.2, 0.25, [4.1, 2.5, 2.0], [0.86, 0.78, 0.7], 0.07],
      [-0.98, 9.6, 0.3, [4.5, 2.9, 2.1], [0.9, 0.81, 0.72], 0.0],
      [1.0, 9.35, 0.25, [4.2, 2.7, 2.0], [0.84, 0.76, 0.68], -0.06],
      [2.9, 8.5, 0.15, [3.3, 2.0, 1.8], [0.74, 0.67, 0.6], -0.15]
    ];
    for (const [x, y, z, lens, radii, splay] of spec) {
      fingers.push(digit(x, y, z, lens, radii, splay, 0, pivot));
      const knuckle = mesh(new THREE.SphereGeometry(1, 16, 12), SKIN_WARM, pivot);
      knuckle.position.set(x, y - 0.35, 0.95);
      knuckle.scale.set(radii[0] * 0.95, radii[0] * 0.8, 0.55);
      // extensor tendon running from the knuckle toward the wrist
      const tendon = mesh(new THREE.CapsuleGeometry(0.22, 5.2, 4, 8), SKIN, pivot);
      tendon.position.set(x * 0.72, y - 3.6, 1.18);
      tendon.rotation.z = x * 0.045;
    }
    const thumb = digit(-3.3, 2.0, -0.35, [3.7, 3.0, 2.5], [1.22, 1.0, 0.92], 0.95, -0.25, pivot);
    thumb.joints[0].rotation.y = -0.55;

    return { root, fingers, thumb };
  }

  const right = buildHand(false);
  const left = buildHand(true);
  scene.add(right.root, left.root);

  H = { THREE, renderer, scene, camera, key, rim, floor, canvas, right, left, w: 0, h: 0, dist: 0, scale: 14 };
  resizeHands();
  addEventListener('resize', resizeHands);
  return H;
}

function resizeHands() {
  if (!H) return;
  const w = innerWidth, h = innerHeight;
  H.w = w;
  H.h = h;
  H.renderer.setSize(w, h, false);
  H.camera.aspect = w / h;
  H.dist = (h / 2) / Math.tan(H.camera.fov * Math.PI / 360);
  H.camera.position.set(0, 0, H.dist);
  H.camera.near = 20;
  H.camera.far = H.dist + 3000;
  H.camera.updateProjectionMatrix();
  H.floor.scale.set(w * 1.6, h * 1.6, 1);
  H.key.position.set(-w * 0.35, h * 0.55, 1500);
  const c = H.key.shadow.camera;
  c.left = -w;
  c.right = w;
  c.top = h;
  c.bottom = -h;
  c.near = 100;
  c.far = 5000;
  c.updateProjectionMatrix();
  H.rim.position.set(w * 0.5, -h * 0.4, 600);
  H.scale = clamp(Math.min(w, h) * 0.026, 8, 19);              // pixels per centimetre of hand
}

// Hand "actors": where each hand is on screen and how its fingers are posed.
const actor = (side) => ({ side, x: 0, y: 0, z: 260, rz: 0, rx: 0.12, curl: 0.15, spread: 0, point: 0, swirlAmp: 0, swirlDir: side === 'R' ? 1 : -1, swirlPhase: Math.random() * 6 });
const R = actor('R'), L = actor('L');
let tweens = [];
let loopOn = false, t0 = 0;

function tween(a, to, ms, ease = easeInOut) {
  return new Promise(resolve => {
    const from = {};
    for (const k in to) from[k] = a[k];
    tweens.push({ a, from, to, ms, start: performance.now(), ease, resolve });
  });
}

function stepTweens(now) {
  tweens = tweens.filter(tw => {
    const k = Math.min(1, (now - tw.start) / tw.ms);
    const e = tw.ease(k);
    for (const key in tw.to) tw.a[key] = tw.from[key] + (tw.to[key] - tw.from[key]) * e;
    if (k >= 1) {
      tw.resolve();
      return false;
    }
    return true;
  });
}

/** Screen position of a hand right now, including its swirling motion. */
function handScreen(a, time) {
  const th = a.swirlPhase + time * 5.6 * a.swirlDir;
  return {
    x: a.x + a.swirlAmp * Math.cos(th),
    y: a.y + a.swirlAmp * Math.sin(th) * 0.75,
    th,
    vx: -Math.sin(th) * a.swirlDir,
    vy: Math.cos(th) * 0.75 * a.swirlDir
  };
}

function applyHand(rig, a, time) {
  const s = H.scale;
  const p = handScreen(a, time);
  const z = a.z + Math.sin(time * 2.1 + (a.side === 'R' ? 0 : 1.7)) * 3;   // breathing
  const k = (H.dist - z) / H.dist;                                         // perspective correction
  rig.root.position.set((p.x - H.w / 2) * k, (H.h / 2 - p.y) * k, z);
  rig.root.scale.setScalar(s);
  rig.root.rotation.set(a.rx, a.side === 'R' ? -0.18 : 0.18, a.rz + a.swirlAmp * 0.0016 * Math.sin(p.th * 2), 'ZYX');

  const wiggle = a.swirlAmp > 1 ? Math.sin(p.th * 2) * 0.06 : 0;
  rig.fingers.forEach((f, i) => {
    const c = (i === 0 ? a.curl * (1 - a.point) : a.curl) + wiggle * (i % 2 ? 1 : -1);
    f.joints[0].rotation.x = -c * 1.3;
    f.joints[1].rotation.x = -c * 1.65 - 0.05;
    f.joints[2].rotation.x = -c * 1.05 - 0.04;
    f.joints[0].rotation.z = f.splay * (1 + a.spread * 1.8);
  });
  const tc = a.point ? Math.max(a.curl, 0.5) : a.curl;
  rig.thumb.joints[0].rotation.z = rig.thumb.splay - tc * 0.45 + a.spread * 0.2;
  rig.thumb.joints[1].rotation.x = -tc * 0.8;
  rig.thumb.joints[2].rotation.x = -tc * 1.1;
}

/** Screen position of a hand's index fingertip if the hand were posed as `a`. */
function indexTipScreen(rig, a) {
  applyHand(rig, a, (performance.now() - t0) / 1000);
  rig.root.updateMatrixWorld(true);
  const v = new H.THREE.Vector3();
  rig.fingers[0].tip.getWorldPosition(v);
  v.project(H.camera);
  return { x: (v.x + 1) / 2 * H.w, y: (1 - v.y) / 2 * H.h };
}

/** Moves a target pose so the index fingertip lands on (tx, ty). */
function aimIndexTip(rig, current, target, tx, ty) {
  const saved = { ...current };
  const trial = { ...current, ...target, swirlAmp: 0 };
  for (let i = 0; i < 3; i++) {
    const tip = indexTipScreen(rig, trial);
    trial.x += tx - tip.x;
    trial.y += ty - tip.y;
  }
  applyHand(rig, saved, (performance.now() - t0) / 1000);
  return { ...target, x: trial.x, y: trial.y };
}

function startLoop() {
  if (loopOn) return;
  loopOn = true;
  t0 = performance.now();
  H.canvas.style.display = 'block';
  const frame = (now) => {
    if (!loopOn) return;
    stepTweens(now);
    const time = (now - t0) / 1000;
    applyHand(H.right, R, time);
    applyHand(H.left, L, time);
    if (frameHook) frameHook(time);
    H.renderer.render(H.scene, H.camera);
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

function stopLoop() {
  loopOn = false;
  if (H) H.canvas.style.display = 'none';
}

// ------------------------------------------------------------------ tile motion
// While the hands work, each tile already sits in its new slot (CSS order) and a transform
// offset holds it wherever it really is on screen. The hands push those offsets around:
// dragging tiles under their palms, raking them into a pile, and sliding each one into place.
let frameHook = null;
const motion = new Map();            // tile -> { b: new slot rect, ox, oy, rot, wasVisible, willBeVisible }
const held = new Map();              // hand side -> { t, m, gx, gy } for a tile being slid by that hand

function setTile(t, m) {
  t.style.transform = `translate(${m.ox.toFixed(1)}px,${m.oy.toFixed(1)}px) rotate(${m.rot.toFixed(2)}deg)`;
}

function centerOf(m) {
  return { x: m.b.left + m.b.width / 2 + m.ox, y: m.b.top + m.b.height / 2 + m.oy };
}

/** Applies the new order, but keeps every on-screen tile visually where it was. */
function beginPhysicalShuffle() {
  const list = tiles();
  const first = new Map(list.map(t => [t, t.getBoundingClientRect()]));
  list.forEach(t => {
    t.style.transition = 'none';
    t.style.transform = '';
  });
  const order = nextOrder && nextOrder.length === list.length ? nextOrder : shuffled(list.length);
  nextOrder = null;
  list.forEach((t, i) => { t.style.order = String(order[i]); });
  placeButton();
  motion.clear();
  const h = innerHeight;
  for (const t of list) {
    if (t.offsetParent === null) continue;
    const a = first.get(t), b = t.getBoundingClientRect();
    const wasVisible = a.bottom > 0 && a.top < h;
    const willBeVisible = b.bottom > 0 && b.top < h;
    if (!wasVisible && !willBeVisible) continue;              // never on screen: it just moves
    const m = { b, ox: a.left - b.left, oy: a.top - b.top, rot: 0, wasVisible, willBeVisible };
    motion.set(t, m);
    setTile(t, m);
  }
}

/** Frame hook: tiles under a pressing palm get dragged along with it. */
function dragUnderPalms() {
  const prev = {};
  return (time) => {
    const reach = H.scale * 10;
    const hands = [R, L].map(a => {
      const p = handScreen(a, time);
      const last = prev[a.side];
      prev[a.side] = p;
      return { a, p, dx: last ? p.x - last.x : 0, dy: last ? p.y - last.y : 0 };
    });
    for (const [t, m] of motion) {
      if (!m.wasVisible) continue;
      const c = centerOf(m);
      let moved = false;
      for (const hd of hands) {
        if (hd.a.z > 110 || (!hd.dx && !hd.dy)) continue;
        const f = clamp(1.25 - Math.hypot(c.x - hd.p.x, c.y - hd.p.y) / reach, 0, 1);
        if (f > 0) {
          m.ox += hd.dx * f;
          m.oy += hd.dy * f;
          m.rot = clamp(m.rot + hd.dx * f * 0.06, -14, 14);
          moved = true;
        }
      }
      if (moved) {
        t.style.zIndex = '7';
        setTile(t, m);
      }
    }
  };
}

/** Frame hook: a tile being slid stays under the fingers of the hand holding it. */
function followHolds(time) {
  for (const [side, hd] of held) {
    const p = handScreen(side === 'R' ? R : L, time);
    const m = hd.m;
    m.ox = p.x + hd.gx - (m.b.left + m.b.width / 2);
    m.oy = p.y + hd.gy - (m.b.top + m.b.height / 2);
    m.rot *= 0.88;                                         // it straightens out as it is dragged
    setTile(hd.t, m);
  }
}

/** The hands rake every tile on screen down into a pile at the bottom edge. */
async function rakeIntoPile(topY) {
  const w = innerWidth, h = innerHeight, s = H.scale;
  frameHook = null;
  await Promise.all([
    tween(R, { swirlAmp: 0, x: w * 0.68, y: topY, z: 110, spread: 0.5, curl: 0.05, rz: 0.15 }, 380),
    tween(L, { swirlAmp: 0, x: w * 0.32, y: topY, z: 110, spread: 0.5, curl: 0.05, rz: -0.15 }, 380)
  ]);
  await Promise.all([tween(R, { z: 50 }, 130), tween(L, { z: 50 }, 130)]);

  const rakeMs = 700, bottom = h + s * 8;
  tween(R, { y: bottom, z: 60, x: w * 0.72 }, rakeMs, k => k * k);
  tween(L, { y: bottom, z: 60, x: w * 0.28 }, rakeMs, k => k * k);
  for (const [t, m] of motion) {
    let tx, ty, rot;
    if (m.willBeVisible) {
      // waits in the pile, peeking up from the bottom edge
      tx = clamp(m.b.left + m.ox + (Math.random() - 0.5) * 160, w * 0.02, w * 0.98 - m.b.width) - m.b.left;
      ty = h - 34 - Math.random() * 26 - m.b.top;
      rot = (Math.random() - 0.5) * 18;
    } else {
      tx = m.ox + (Math.random() - 0.5) * 120;
      ty = h + 90 + Math.random() * 140 - m.b.top;
      rot = m.rot + (Math.random() - 0.5) * 24;
    }
    if (!m.wasVisible) {
      // comes from somewhere off screen: slip it in just under the bottom edge first
      m.ox = tx;
      m.oy = h + 40 - m.b.top;
      setTile(t, m);
      void t.offsetWidth;
    }
    const cy = centerOf(m).y;
    const delay = clamp((cy - topY) / (bottom - topY), 0, 1) * rakeMs * 0.7;
    t.style.zIndex = '7';
    t.style.transition = `transform ${Math.round(rakeMs * 0.65)}ms cubic-bezier(.45,0,.7,1) ${Math.round(delay)}ms`;
    Object.assign(m, { ox: tx, oy: ty, rot });
    setTile(t, m);
  }
  await wait(rakeMs + 150);
  for (const [t, m] of [...motion]) {
    t.style.transition = 'none';
    if (!m.willBeVisible) {
      // it left the screen; drop it straight into its new (off-screen) slot
      t.style.transform = '';
      t.style.zIndex = '';
      motion.delete(t);
    }
  }
}

/** One hand slides a tile from the pile into its new slot. */
async function slideHome(a, t, m, speed) {
  const c = centerOf(m);
  await tween(a, { x: c.x, y: c.y + m.b.height * 0.1, z: 115, curl: 0.12, spread: 0.35, rz: a.side === 'R' ? 0.3 : -0.3, rx: 0.05 }, 220 * speed);
  await tween(a, { z: 46, curl: 0.24, spread: 0.12 }, 75);
  const hp = handScreen(a, (performance.now() - t0) / 1000);
  const now = centerOf(m);
  const gx = now.x - hp.x, gy = now.y - hp.y;
  t.style.transition = 'none';
  t.style.zIndex = '8';
  held.set(a.side, { t, m, gx, gy });
  await tween(a, { x: m.b.left + m.b.width / 2 - gx, y: m.b.top + m.b.height / 2 - gy, z: 54 }, 330 * speed);
  held.delete(a.side);
  t.style.transition = 'transform 170ms cubic-bezier(.3,1.6,.5,1)';
  Object.assign(m, { ox: 0, oy: 0, rot: 0 });
  setTile(t, m);
  setTimeout(() => { t.style.zIndex = ''; }, 190);
  await tween(a, { z: 108, curl: 0.1, spread: 0.3 }, 70);
}

/** Both hands deal the new games from the pile into their slots; the rest slide in by themselves. */
async function dealFromPile() {
  const w = innerWidth, h = innerHeight;
  frameHook = followHolds;
  const jobs = [...motion].sort((p, q) => (p[1].b.top - q[1].b.top) || (p[1].b.left - q[1].b.left));
  const byHand = jobs.filter(([, m]) => m.b.top + m.b.height * 0.6 < h - 50 && m.b.bottom > 40).slice(0, 8);
  const queues = { L: [], R: [] };
  for (const job of byHand) {
    const cx = job[1].b.left + job[1].b.width / 2;
    const middle = Math.abs(cx - w / 2) < job[1].b.width * 0.3;
    const side = middle ? (queues.L.length <= queues.R.length ? 'L' : 'R') : (cx < w / 2 ? 'L' : 'R');
    queues[side].push(job);
  }
  while (queues.L.length > queues.R.length + 1) queues.R.push(queues.L.pop());
  while (queues.R.length > queues.L.length + 1) queues.L.push(queues.R.pop());
  const run = async (a, list) => {
    for (let i = 0; i < list.length; i++) await slideHome(a, list[i][0], list[i][1], Math.max(0.55, 1 - i * 0.12));
  };
  await Promise.all([run(R, queues.R), run(L, queues.L)]);
  frameHook = null;

  const rest = jobs.filter(job => !byHand.includes(job));
  rest.forEach(([t, m], i) => {
    t.style.transition = `transform 480ms cubic-bezier(.2,.85,.3,1) ${i * 50}ms`;
    Object.assign(m, { ox: 0, oy: 0, rot: 0 });
    setTile(t, m);
  });
  if (rest.length) await wait(520 + rest.length * 50);
  for (const t of tiles()) {
    t.style.transition = '';
    t.style.transform = '';
    t.style.zIndex = '';
  }
  motion.clear();
}

/** Give every tile a new random place (CSS order) and glide it there (FLIP). */
let nextOrder = null;

/** Decides the next shuffle early and starts loading the images of tiles that will land on screen. */
function planShuffle() {
  const list = tiles();
  nextOrder = shuffled(list.length);
  const cols = Math.max(1, Math.round(grid.clientWidth / ((list[0] && list[0].offsetWidth) || 410)));
  const onScreen = cols * (Math.ceil(innerHeight / 210) + 2);
  list.forEach((t, i) => {
    if (nextOrder[i] < onScreen) t.querySelectorAll('img[loading="lazy"]').forEach(img => { img.loading = 'eager'; });
  });
}

function reorderTiles(animate) {
  const list = tiles();
  const first = new Map(list.map(t => [t, t.getBoundingClientRect()]));
  const firstRot = new Map(list.map(t => [t, (t.style.transform.match(/rotate\(([-\d.]+)deg\)/) || [0, 0])[1]]));
  list.forEach(t => {
    t.style.transition = 'none';
    t.style.transform = '';
  });
  const order = nextOrder && nextOrder.length === list.length ? nextOrder : shuffled(list.length);
  nextOrder = null;
  list.forEach((t, i) => { t.style.order = String(order[i]); });
  placeButton();
  if (!animate) return Promise.resolve();

  const moves = list.map(t => {
    const a = first.get(t), b = t.getBoundingClientRect();
    const visible = (a.bottom > -100 && a.top < innerHeight + 100) || (b.bottom > -100 && b.top < innerHeight + 100);
    return { t, dx: a.left - b.left, dy: a.top - b.top, visible };
  });
  moves.forEach(m => {
    if (m.visible) m.t.style.transform = `translate(${m.dx}px,${m.dy}px) rotate(${firstRot.get(m.t)}deg)`;
  });
  void grid.offsetWidth;
  moves.forEach(m => {
    if (!m.visible) return;
    const delay = Math.random() * 180;
    m.t.style.transition = `transform 820ms cubic-bezier(.2,.85,.25,1) ${delay}ms`;
    m.t.style.transform = '';
  });
  return wait(1020).then(() => list.forEach(t => {
    t.style.transition = '';
    t.style.transform = '';
  }));
}

// ------------------------------------------------------------------ the "here's your game" card
let card = null;

function buildCard() {
  const shade = document.createElement('div');
  shade.id = 'scrShade';
  const panel = document.createElement('div');
  panel.id = 'scrPanel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-labelledby', 'scrName');
  panel.innerHTML =
    '<div class="scr-kicker">the hands have chosen</div>' +
    '<div class="scr-name" id="scrName"></div>' +
    '<div class="scr-btns">' +
    '<a class="scr-play" href="#">&#9654; PLAY IT</a>' +
    '<button type="button" class="scr-again">SCRAMBLE AGAIN</button>' +
    '<button type="button" class="scr-close" aria-label="Close">&#10005;</button>' +
    '</div>';
  document.body.append(shade, panel);
  shade.addEventListener('click', () => dismiss());
  panel.querySelector('.scr-close').addEventListener('click', () => dismiss());
  panel.querySelector('.scr-again').addEventListener('click', () => scramble());
  addEventListener('keydown', e => { if (e.key === 'Escape' && card && card.open) dismiss(); });
  return { shade, panel, open: false, clone: null, tile: null };
}

function makeClone(tile) {
  const r = tile.getBoundingClientRect();
  const c = tile.cloneNode(true);
  c.removeAttribute('id');
  c.removeAttribute('href');
  c.setAttribute('aria-hidden', 'true');
  c.tabIndex = -1;
  c.querySelectorAll('iframe').forEach(f => f.remove());
  c.querySelectorAll('img').forEach(i => { i.style.visibility = 'visible'; i.loading = 'eager'; });
  c.classList.add('scr-clone');
  Object.assign(c.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', transform: '', transition: 'none' });
  document.body.appendChild(c);
  return { c, r };
}

function cardLayout(ratio) {
  const w = innerWidth, h = innerHeight;
  const cw = Math.min(620, w * 0.8);
  const ch = cw * ratio;
  const panelH = 132;
  const top = Math.max(16, (h - ch - 18 - panelH) / 2 - 10);
  return { cw, ch, left: (w - cw) / 2, top, panelTop: top + ch + 18 };
}

function showPanel(tile, layout) {
  card.panel.querySelector('.scr-name').textContent = gameName(tile);
  const play = card.panel.querySelector('.scr-play');
  play.href = tile.getAttribute('href');
  Object.assign(card.panel.style, { left: layout.left + 'px', top: layout.panelTop + 'px', width: layout.cw + 'px' });
  card.panel.classList.add('on');
  card.open = true;
  setTimeout(() => play.focus({ preventScroll: true }), 60);
}

async function dismiss() {
  if (!card || !card.open || busy) return;
  card.open = false;
  card.panel.classList.remove('on');
  card.shade.classList.remove('on');
  const tile = card.tile, clone = card.clone;
  card.tile = card.clone = null;
  if (H && loopOn) {
    await Promise.all([
      tween(R, { x: innerWidth + H.scale * 16, y: innerHeight + H.scale * 14, z: 260, curl: 0.15, spread: 0 }, 520, easeInOut),
      tween(L, { x: -H.scale * 16, y: innerHeight + H.scale * 14, z: 260, point: 0, curl: 0.15 }, 520, easeInOut),
      clone ? flyCloneHome(clone, tile) : Promise.resolve()
    ]);
    stopLoop();
  } else if (clone) {
    await flyCloneHome(clone, tile);
  }
  if (tile) {
    tile.classList.add('scr-picked');
    setTimeout(() => tile.classList.remove('scr-picked'), 2400);
  }
}

function flyCloneHome(clone, tile) {
  const r = tile.getBoundingClientRect();
  clone.style.transition = 'left .5s cubic-bezier(.5,0,.3,1), top .5s cubic-bezier(.5,0,.3,1), width .5s, height .5s, opacity .5s';
  Object.assign(clone.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', opacity: inView(r) ? '1' : '0' });
  return wait(520).then(() => {
    tile.style.visibility = '';
    clone.remove();
  });
}

// ------------------------------------------------------------------ the whole performance
async function scramble() {
  if (busy) return;
  busy = true;
  btn.disabled = true;
  try {
    card = card || buildCard();
    if (card.open) {
      card.open = false;
      card.panel.classList.remove('on');
      if (card.clone) {
        await flyCloneHome(card.clone, card.tile);
        card.clone = card.tile = null;
      }
    }

    // bring the grid into view
    const gridTop = grid.getBoundingClientRect().top + scrollY;
    if (Math.abs(scrollY - (gridTop - 90)) > 140) {
      scrollTo({ top: Math.max(0, gridTop - 90), behavior: reduceMotion ? 'auto' : 'smooth' });
      await wait(reduceMotion ? 50 : 520);
    }

    if (reduceMotion) {
      planShuffle();
      await reorderTiles(false);
      await present(pickTile(), false);
      return;
    }

    planShuffle();
    btn.classList.add('loading');
    try {
      await ensureHands();
    } catch (e) {
      console.warn('hands could not be made here', e);
    }
    btn.classList.remove('loading');
    if (!H) {
      await reorderTiles(true);
      await present(pickTile(), false);
      return;
    }

    const w = innerWidth, h = innerHeight, s = H.scale;
    const gr = grid.getBoundingClientRect();
    const areaTop = clamp(gr.top, 0, h), areaBottom = clamp(gr.bottom, 0, h);
    const midY = (areaTop + areaBottom) / 2 + 20;
    const lx = clamp(gr.left + gr.width * 0.3, w * 0.2, w * 0.45), rx = clamp(gr.left + gr.width * 0.7, w * 0.55, w * 0.8);

    Object.assign(R, { x: w + s * 16, y: h + s * 14, z: 280, rz: 0.75, rx: 0.12, curl: 0.3, spread: 0, point: 0, swirlAmp: 0 });
    Object.assign(L, { x: -s * 16, y: h + s * 14, z: 280, rz: -0.75, rx: 0.12, curl: 0.3, spread: 0, point: 0, swirlAmp: 0 });
    startLoop();

    // 1. reach in
    await Promise.all([
      tween(R, { x: rx, y: midY, z: 170, rz: 0.4, curl: 0.12, spread: 0.25 }, 720),
      tween(L, { x: lx, y: midY, z: 170, rz: -0.4, curl: 0.12, spread: 0.25 }, 760)
    ]);
    // 2. press down flat on the table
    await Promise.all([
      tween(R, { z: 70, spread: 0.7, curl: 0.04, rx: 0.02 }, 240),
      tween(L, { z: 70, spread: 0.7, curl: 0.04, rx: 0.02 }, 240)
    ]);
    // 3. new places are decided now; the hands physically move every tile there
    beginPhysicalShuffle();
    // 4. swirl: whatever is under a palm gets dragged around with it
    const amp = clamp(Math.min(w, h) * 0.11, 50, 150);
    frameHook = dragUnderPalms();
    tween(R, { swirlAmp: amp }, 350);
    tween(L, { swirlAmp: amp }, 350);
    await wait(1050);
    // 5. rake everything into a pile at the bottom, then deal the new games out of it
    await rakeIntoPile(clamp(areaTop + 40, 40, h * 0.3));
    await dealFromPile();

    // 6. pick a game and hand it over
    await present(pickTile(), true);
  } finally {
    busy = false;
    btn.disabled = false;
  }
}

function pickTile() {
  const all = shown().filter(t => !/workfor\./.test(t.getAttribute('href') || ''));
  const visible = all.filter(t => inView(t.getBoundingClientRect(), 4));
  const pool = visible.length ? visible : all;
  return pool[Math.floor(Math.random() * pool.length)];
}

async function present(tile, withHands) {
  const { c: clone, r } = makeClone(tile);
  tile.style.visibility = 'hidden';
  card.tile = tile;
  card.clone = clone;
  const layout = cardLayout(r.height / r.width);
  card.shade.classList.add('on');

  if (!withHands) {
    clone.style.transition = 'left .45s ease, top .45s ease, width .45s ease, height .45s ease';
    Object.assign(clone.style, { left: layout.left + 'px', top: layout.top + 'px', width: layout.cw + 'px', height: layout.ch + 'px' });
    await wait(460);
    showPanel(tile, layout);
    return;
  }

  const s = H.scale;
  // right hand hovers over the tile, then grips its right edge
  const gripX = r.right - r.width * 0.12, gripY = r.top + r.height * 0.55;
  await tween(R, { x: gripX + s * 3.5, y: gripY + s * 1.5, z: 150, rz: 0.95, curl: 0.05, spread: 0.3, rx: 0.1 }, 620);
  await tween(R, { z: 40, curl: 0.5, spread: 0 }, 260);
  clone.classList.add('lifted');

  // carry it to the middle of the screen as it grows into a card; left hand points at PLAY
  const handX = layout.left + layout.cw + s * 2.2, handY = layout.top + layout.ch * 0.58;
  // the PLAY button's lower-left corner, measured once the panel is laid out
  card.panel.querySelector('.scr-name').textContent = gameName(tile);
  Object.assign(card.panel.style, { left: layout.left + 'px', top: layout.panelTop + 'px', width: layout.cw + 'px' });
  const pb = card.panel.querySelector('.scr-play').getBoundingClientRect();
  // On narrow screens the hand comes in from the side so it doesn't cover the buttons under PLAY.
  const narrow = innerWidth < 600;
  const pointPose = aimIndexTip(
    H.left, L,
    { z: 110, rz: narrow ? -1.35 : -0.85, point: 1, curl: 0.85, spread: 0, rx: 0.18, x: pb.left - s * 8, y: pb.bottom + s * (narrow ? 2 : 10) },
    pb.left + pb.width * (narrow ? 0.12 : 0.3),
    pb.bottom - 10 - pb.height * (narrow ? 0.5 : 0.2)   // the hidden panel sits 10px low
  );
  clone.style.transition = 'left .8s cubic-bezier(.45,0,.25,1), top .8s cubic-bezier(.45,0,.25,1), width .8s cubic-bezier(.45,0,.25,1), height .8s cubic-bezier(.45,0,.25,1)';
  Object.assign(clone.style, { left: layout.left + 'px', top: layout.top + 'px', width: layout.cw + 'px', height: layout.ch + 'px' });
  await Promise.all([
    tween(R, { x: handX, y: handY, z: 90, rz: 1.2, curl: 0.55 }, 800),
    tween(L, pointPose, 820)
  ]);
  clone.classList.remove('lifted');
  showPanel(tile, layout);
}
