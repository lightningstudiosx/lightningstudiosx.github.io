// ⚙️ Settings for kai.fun: pick a look (Normal, Cardboard, Crayon, Chalkboard, Inverted, Gravity) and switch kid-friendly mode.
// Cardboard, Crayon and Chalkboard also redraw every game picture in that style (restyle() below);
// Gravity drops every game tile into a heap with a little physics engine.
// The saved choices are applied before the page paints by a tiny script in <head>; this file builds
// the button and menu, and the SVG filters the Crayon look uses for its wobbly waxy lines.
(function () {
  var root = document.documentElement;
  var LOOKS = [
    { id: 'normal', name: 'Normal' },
    { id: 'cardboard', name: 'Cardboard' },
    { id: 'crayon', name: 'Crayon' },
    { id: 'chalkboard', name: 'Chalkboard' },
    { id: 'inverted', name: 'Inverted' },
    { id: 'gravity', name: 'Gravity' }
  ];

  // ---- SVG filters for the crayon look: a slight wobble, then waxy speckles where the paper shows through
  var svgNS = 'http://www.w3.org/2000/svg';
  var defs = document.createElementNS(svgNS, 'svg');
  defs.setAttribute('aria-hidden', 'true');
  defs.setAttribute('width', '0');
  defs.setAttribute('height', '0');
  defs.style.position = 'absolute';
  defs.innerHTML =
    crayonFilter('kf-crayon-line', 0.03, 5, 0.9, '-2.4 1.75') +
    crayonFilter('kf-crayon-text', 0.05, 2.5, 1.1, '-2 1.55') +
    crayonFilter('kf-crayon-soft', 0.04, 2, 1.0, '-1.6 1.5') +
    crayonFilter('kf-chalk-line', 0.04, 4, 1.6, '-2.2 1.45') +
    crayonFilter('kf-chalk-text', 0.06, 2.5, 1.8, '-1.5 1.25');
  document.body.appendChild(defs);

  function crayonFilter(id, wobbleFreq, wobble, grainFreq, alpha) {
    return '<filter id="' + id + '" x="-6%" y="-6%" width="112%" height="112%">' +
      '<feTurbulence type="fractalNoise" baseFrequency="' + wobbleFreq + '" numOctaves="2" seed="4" result="wob"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="wob" scale="' + wobble + '" xChannelSelector="R" yChannelSelector="G" result="drawn"/>' +
      '<feTurbulence type="fractalNoise" baseFrequency="' + grainFreq + '" numOctaves="2" seed="9" result="grain"/>' +
      '<feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ' + alpha + '" result="wax"/>' +
      '<feComposite in="drawn" in2="wax" operator="in"/>' +
      '</filter>';
  }

  // ---- button + menu
  var btn = document.createElement('button');
  btn.id = 'kfSettingsBtn';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Settings');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'kfSettings');
  btn.textContent = '⚙️';

  var menu = document.createElement('div');
  menu.id = 'kfSettings';
  menu.hidden = true;
  menu.setAttribute('role', 'dialog');
  menu.setAttribute('aria-label', 'Settings');
  menu.innerHTML =
    '<h3>Settings</h3>' +
    '<div class="lab">Look</div>' +
    '<div class="looks">' + LOOKS.map(function (l) {
      return '<button type="button" class="look" data-look="' + l.id + '"><span class="sw ' + l.id + '"></span>' + l.name + '</button>';
    }).join('') + '</div>' +
    '<div class="lab">Family</div>' +
    '<label class="toggle"><input type="checkbox" id="kfKid"> Kid-friendly mode</label>' +
    '<div class="hint">Hides Make Blue Crystals, the joke pop-up ads and the hiring tile.</div>';
  document.body.append(btn, menu);

  function currentLook() {
    for (var i = 0; i < LOOKS.length; i++) if (root.classList.contains('theme-' + LOOKS[i].id)) return LOOKS[i].id;
    return 'normal';
  }
  function setLook(id) {
    LOOKS.forEach(function (l) { root.classList.remove('theme-' + l.id); });
    if (id !== 'normal') root.classList.add('theme-' + id);
    try { localStorage.setItem('kaifun_theme', id); } catch (e) { /* private mode */ }
    sync();
    dispatchEvent(new Event('resize'));          // lets the SCRAMBLE button re-seat itself
    restyle(id);
    if (id === 'gravity') gravityOn(); else gravityOff();
  }
  function setKid(on) {
    root.classList.toggle('kid-mode', on);
    try { localStorage.setItem('kaifun_kidmode', on ? '1' : '0'); } catch (e) { /* private mode */ }
    if (on) document.querySelectorAll('.kfad').forEach(function (a) { a.remove(); });
    sync();
    dispatchEvent(new Event('resize'));
  }
  function sync() {
    var cur = currentLook();
    menu.querySelectorAll('.look').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.look === cur ? 'true' : 'false'); });
    menu.querySelector('#kfKid').checked = root.classList.contains('kid-mode');
  }
  function open(show) {
    menu.hidden = !show;
    btn.setAttribute('aria-expanded', show ? 'true' : 'false');
  }

  btn.addEventListener('click', function (e) { e.stopPropagation(); open(menu.hidden); });
  menu.addEventListener('click', function (e) {
    e.stopPropagation();
    var b = e.target.closest('.look');
    if (b) setLook(b.dataset.look);
  });
  menu.querySelector('#kfKid').addEventListener('change', function (e) { setKid(e.target.checked); });
  document.addEventListener('click', function () { if (!menu.hidden) open(false); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { open(false); btn.focus(); } });
  sync();
  // ================================================================================================
  // game pictures redrawn in the look's style (done in the browser, lazily, as tiles come into view)
  // ================================================================================================
  var FX = { chalkboard: chalkFx, crayon: crayonFx, cardboard: cardboardFx };
  var made = {}, io = null, jobs = [], working = false;
  function gameImgs() { return [].slice.call(document.querySelectorAll('main.games > .game-tile img')); }
  function restyle(look) {
    if (io) { io.disconnect(); io = null; }
    jobs = [];
    var imgs = gameImgs();
    imgs.forEach(function (img) {
      if (!img.dataset.orig) img.dataset.orig = img.getAttribute('src');
      if (!FX[look] && img.getAttribute('src') !== img.dataset.orig) img.src = img.dataset.orig;
    });
    if (!FX[look] || !('IntersectionObserver' in window)) return;
    io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); paint(e.target, look); } });
    }, { rootMargin: '900px 0px' });
    imgs.forEach(function (img) { io.observe(img); });
  }
  function paint(img, look) {
    var key = look + '|' + img.dataset.orig;
    if (made[key]) { img.src = made[key]; return; }
    jobs.push(function (next) {
      if (currentLook() !== look) return next();
      var src = new Image();
      src.onload = function () {
        try {
          render(src, look, function (url) { made[key] = url; if (currentLook() === look) img.src = url; next(); });
        } catch (e) { next(); }   // e.g. a picture from another site that we may not read
      };
      src.onerror = function () { next(); };
      src.src = img.dataset.orig;
    });
    pump();
  }
  function pump() {
    if (working || !jobs.length) return;
    working = true;
    var job = jobs.shift();
    setTimeout(function () { job(function () { working = false; pump(); }); }, 0);
  }
  function render(src, look, done) {
    var nw = src.naturalWidth || 640, nh = src.naturalHeight || 320;
    var W = Math.min(nw, 720), H = Math.max(1, Math.round(nh * W / nw));
    var c = document.createElement('canvas'); c.width = W; c.height = H;
    var x = c.getContext('2d', { willReadFrequently: true });
    x.fillStyle = look === 'chalkboard' ? '#26382e' : '#ffffff'; x.fillRect(0, 0, W, H);
    x.drawImage(src, 0, 0, W, H);
    var d = x.getImageData(0, 0, W, H);
    FX[look](d.data, W, H);
    x.putImageData(d, 0, 0);
    if (c.toBlob) c.toBlob(function (b) { done(b ? URL.createObjectURL(b) : c.toDataURL('image/jpeg', 0.86)); }, 'image/jpeg', 0.86);
    else done(c.toDataURL('image/jpeg', 0.86));
  }
  // shared helpers: brightness, and edge strength (Sobel) on a softened copy of it
  function analyse(p, W, H) {
    var n = W * H, L = new Float32Array(n), B = new Float32Array(n), E = new Float32Array(n), i, xx, yy;
    for (i = 0; i < n; i++) L[i] = 0.299 * p[i * 4] + 0.587 * p[i * 4 + 1] + 0.114 * p[i * 4 + 2];
    for (yy = 0; yy < H; yy++) for (xx = 0; xx < W; xx++) {
      var s = 0, k = 0;
      for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
        var X = xx + dx, Y = yy + dy; if (X >= 0 && Y >= 0 && X < W && Y < H) { s += L[Y * W + X]; k++; }
      }
      B[yy * W + xx] = s / k;
    }
    for (yy = 1; yy < H - 1; yy++) for (xx = 1; xx < W - 1; xx++) {
      i = yy * W + xx;
      var gx = B[i - W + 1] + 2 * B[i + 1] + B[i + W + 1] - B[i - W - 1] - 2 * B[i - 1] - B[i + W - 1];
      var gy = B[i + W - 1] + 2 * B[i + W] + B[i + W + 1] - B[i - W - 1] - 2 * B[i - W] - B[i - W + 1];
      E[i] = Math.sqrt(gx * gx + gy * gy);
    }
    return { L: L, E: E };
  }
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  // CHALK: dark things become the board, light and colourful things become pastel chalk scribbled in
  // diagonal strokes, and every edge gets a powdery white chalk line
  function chalkFx(p, W, H) {
    var E = analyse(p, W, H).E;
    for (var y = 0, i = 0; y < H; y++) for (var x = 0; x < W; x++, i++) {
      var o = i * 4, r = p[o], g = p[o + 1], b = p[o + 2], n = Math.random();
      var mx = Math.max(r, g, b), mn = Math.min(r, g, b), v = mx / 255, sat = mx ? (mx - mn) / mx : 0;
      var hatch = 0.58 + 0.42 * Math.sin((x + y) * 0.85 + n * 1.6);
      var fill = clamp((v - 0.16) / 0.7) * (0.55 + 0.35 * sat) * hatch * (0.6 + 0.4 * n);
      var edge = clamp((E[i] - 28) / 75) * (0.62 + 0.38 * n);
      var br = 38 + (n - 0.5) * 8, bg = 56 + (n - 0.5) * 8, bb = 46 + (n - 0.5) * 8;   // the board
      var fr = r * 0.62 + 97, fg = g * 0.62 + 97, fb = b * 0.62 + 97;                    // pastel chalk
      var er = r * 0.3 + 175, eg = g * 0.3 + 174, eb = b * 0.3 + 167;                    // chalk line
      var R = br + (fr - br) * fill, G = bg + (fg - bg) * fill, Bl = bb + (fb - bb) * fill;
      p[o] = R + (er - R) * edge; p[o + 1] = G + (eg - G) * edge; p[o + 2] = Bl + (eb - Bl) * edge;
    }
  }
  // CRAYON: fewer, brighter colours, paper showing through the wax, and a dark crayon line on edges
  function crayonFx(p, W, H) {
    var a = analyse(p, W, H), E = a.E, L = a.L, c = [0, 0, 0];
    for (var y = 0, i = 0; y < H; y++) for (var x = 0; x < W; x++, i++) {
      var o = i * 4, n = Math.random(), m = (p[o] + p[o + 1] + p[o + 2]) / 3;
      for (var k = 0; k < 3; k++) { var v = m + (p[o + k] - m) * 1.3; c[k] = Math.round(clamp(v / 255) * 5) / 5 * 255; }
      var stroke = 0.5 + 0.5 * Math.sin(x * 0.55 - y * 0.95 + n * 2.2);
      if (n * 0.7 + stroke * 0.3 < 0.02 + 0.2 * (L[i] / 255)) {               // paper peeking through the wax
        c[0] = c[0] * 0.25 + 190; c[1] = c[1] * 0.25 + 187; c[2] = c[2] * 0.25 + 181;
      }
      var edge = clamp((E[i] - 40) / 90) * (0.55 + 0.45 * n) * 0.65;
      p[o] = c[0] * (1 - edge); p[o + 1] = c[1] * (1 - edge); p[o + 2] = c[2] * (1 - edge);
    }
  }
  // CARDBOARD: printed onto brown kraft: ink multiplied into the board, a little faded and grainy
  function cardboardFx(p, W, H) {
    for (var y = 0, i = 0; y < H; y++) for (var x = 0; x < W; x++, i++) {
      var o = i * 4, n = Math.random(), m = (p[o] + p[o + 1] + p[o + 2]) / 3;
      var fib = 0.92 + 0.1 * n + 0.04 * Math.sin(x * 0.9);                      // kraft fibres + corrugation
      var kc = [205 * fib, 165 * fib, 118 * fib], miss = n < 0.025 + 0.04 * (m / 255);              // a few specks the ink missed
      for (var k = 0; k < 3; k++) {
        var v = m + (p[o + k] - m) * 0.75;                                     // a bit faded
        v = Math.round(v / 255 * 4) / 4 * 255;                                // screen-printed tones
        p[o + k] = miss ? kc[k] : Math.min(255, kc[k] * (v / 255) * 1.18);
      }
    }
  }

  // ================================================================================================
  // GRAVITY: every game tile becomes a physics body and falls into a heap at the bottom of the list
  // ================================================================================================
  var grav = null, lastW = innerWidth, gravTimer = 0;
  function loadMatter(cb) {
    if (window.Matter) return cb(window.Matter);
    var sc = document.getElementById('kfMatter');
    if (!sc) {
      sc = document.createElement('script'); sc.id = 'kfMatter';
      sc.src = 'https://cdn.jsdelivr.net/npm/matter-js@0.20.0/build/matter.min.js';
      document.head.appendChild(sc);
    }
    sc.addEventListener('load', function () { cb(window.Matter); });
    sc.addEventListener('error', function () { cb(null); });
  }
  function gravityOff() {
    if (!grav) return;
    grav.stop = true; cancelAnimationFrame(grav.raf);
    grav.tiles.forEach(function (t) { t.style.transform = ''; });
    grav.grid.style.paddingBottom = '';
    grav = null;
  }
  function gravityOn() {
    gravityOff();
    var grid = document.querySelector('main.games'); if (!grid) return;
    var me = grav = { stop: false, grid: grid, tiles: [] };
    loadMatter(function (M) {
      if (grav !== me || me.stop) return;
      var tiles = [].filter.call(grid.querySelectorAll(':scope > .game-tile'), function (t) { t.style.transform = ''; return t.offsetParent !== null; });
      me.tiles = tiles;
      if (!tiles.length) return;
      var R = tiles.map(function (t) { return { t: t, x: t.offsetLeft + t.offsetWidth / 2, y: t.offsetTop + t.offsetHeight / 2, w: t.offsetWidth, h: t.offsetHeight }; });
      var bottom = Math.max.apply(null, R.map(function (r) { return r.y + r.h / 2; }));
      var top = Math.min.apply(null, R.map(function (r) { return r.y - r.h / 2; }));
      var left = Math.min.apply(null, R.map(function (r) { return r.x - r.w / 2; })) - 8;
      var right = Math.max.apply(null, R.map(function (r) { return r.x + r.w / 2; })) + 8;
      var extra = Math.round((bottom - top) * 0.1) + 80;                       // room for everything to drop into
      grid.style.paddingBottom = extra + 'px';
      var floor = bottom + extra;
      if (!M) {                                                                // no physics engine: just drop the whole stack
        tiles.forEach(function (t) { t.style.transform = 'translateY(' + extra + 'px)'; });
        return;
      }
      var eng = M.Engine.create({ enableSleeping: true });
      eng.gravity.y = 1.15;
      var tall = (floor - top) + 4000;
      M.Composite.add(eng.world, [
        M.Bodies.rectangle((left + right) / 2, floor + 100, right - left + 400, 200, { isStatic: true, friction: 0.9 }),
        M.Bodies.rectangle(left - 100, floor - tall / 2, 200, tall, { isStatic: true }),
        M.Bodies.rectangle(right + 100, floor - tall / 2, 200, tall, { isStatic: true })
      ]);
      var bodies = R.map(function (r) {
        var b = M.Bodies.rectangle(r.x, r.y, r.w, r.h, { angle: (Math.random() - 0.5) * 0.1, friction: 0.5, frictionStatic: 0.9, restitution: 0.12, chamfer: { radius: 12 } });
        M.Body.setVelocity(b, { x: (Math.random() - 0.5) * 3, y: Math.random() * 2 });
        M.Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.03);
        return b;
      });
      M.Composite.add(eng.world, bodies);
      me.bodies = bodies;
      var t0 = performance.now(), last = t0;
      (function step(now) {
        if (me.stop) return;
        var dt = Math.min(50, now - last); last = now;
        for (var s = 0; s < 2; s++) M.Engine.update(eng, Math.max(1, dt / 2));
        var asleep = true;
        bodies.forEach(function (b, k) {
          var r = R[k]; if (!b.isSleeping) asleep = false;
          r.t.style.transform = 'translate(' + (b.position.x - r.x).toFixed(1) + 'px,' + (b.position.y - r.y).toFixed(1) + 'px) rotate(' + b.angle.toFixed(4) + 'rad)';
        });
        me.settled = asleep;
        if (asleep || now - t0 > 25000) return;                                 // settled: stop using the CPU
        me.raf = requestAnimationFrame(step);
      })(t0);
    });
  }
  addEventListener('resize', function () {
    if (currentLook() !== 'gravity' || innerWidth === lastW) return;           // phones fire resize when scrolling
    lastW = innerWidth; clearTimeout(gravTimer); gravTimer = setTimeout(gravityOn, 350);
  });
  window.KFLooks = { setLook: setLook, made: made, grav: function () { return grav; } };
  var start = currentLook();
  restyle(start);
  if (start === 'gravity') { if (document.readyState === 'complete') gravityOn(); else addEventListener('load', function () { setTimeout(gravityOn, 200); }); }
})();
