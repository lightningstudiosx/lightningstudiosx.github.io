// ⚙️ Settings for kai.fun: pick a look (Normal, Cardboard, Crayon, Chalkboard, Inverted, Gravity, Kai mode, Dark, Deleted.Fun,
// 150 party) and switch kid-friendly mode.
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
    { id: 'gravity', name: 'Gravity' },
    { id: 'kai', name: 'Kai mode' },
    { id: 'candle', name: 'Dark' },
    { id: 'deleted', name: 'Deleted.Fun' },
    { id: 'party', name: '150 party' },
    { id: 'threed', name: '3D' },
    { id: 'parallax', name: 'Parallax' },
    { id: 'nogames', name: 'No games' },
    { id: 'og', name: 'OG kai.fun' },
    { id: 'veryog', name: 'VERY OG' }, { id: 'underwater', name: 'Underwater' },
    { id: 'win98', name: 'Windows 98' }, { id: 'museum', name: 'Museum' }
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
    fxSwitch(id);
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

  // ================================================================================================
  // LIVE EFFECTS for Kai mode, Dark (a candle), Deleted.Fun and the 150 games party
  // ================================================================================================
  var fxStop = null;
  function fxSwitch(id) {
    if (fxStop) { try { fxStop(); } catch (e) { /* ignore */ } fxStop = null; }
    if (FXL[id]) fxStop = FXL[id]();
  }
  var gameTiles = function () { return [].slice.call(document.querySelectorAll('main.games > .game-tile')); };
  var FXL = {
    // every tile gets a little Kai face whose googly eyes follow your mouse
    kai: function () {
      var faces = gameTiles().map(function (t) {
        var f = document.createElement('span'); f.className = 'kf-kaiface'; f.setAttribute('aria-hidden', 'true');
        f.innerHTML = '<i><b></b></i><i><b></b></i><u></u>'; t.appendChild(f); return f;
      });
      var mx = innerWidth / 2, my = innerHeight / 3, raf = 0, dead = false;
      function look() {
        raf = 0; if (dead) return;
        faces.forEach(function (f) {
          var r = f.getBoundingClientRect(); if (r.bottom < -40 || r.top > innerHeight + 40) return;
          [].forEach.call(f.querySelectorAll('b'), function (p) {
            var e = p.parentNode.getBoundingClientRect(), dx = mx - (e.left + e.width / 2), dy = my - (e.top + e.height / 2), d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 90) * 4.5;
            p.style.transform = 'translate(' + (dx / d * k).toFixed(1) + 'px,' + (dy / d * k).toFixed(1) + 'px)';
          });
        });
      }
      function move(e) { mx = e.clientX; my = e.clientY; if (!raf) raf = requestAnimationFrame(look); }
      function scroll() { if (!raf) raf = requestAnimationFrame(look); }
      addEventListener('pointermove', move); addEventListener('scroll', scroll, { passive: true }); look();
      return function () { dead = true; cancelAnimationFrame(raf); removeEventListener('pointermove', move); removeEventListener('scroll', scroll); faces.forEach(function (f) { f.remove(); }); };
    },
    // the lights go out: only a flickering candle that follows you lights the page
    candle: function () {
      var dark = document.createElement('div'); dark.id = 'kfDark';
      var c = document.createElement('div'); c.id = 'kfCandle'; c.setAttribute('aria-hidden', 'true'); c.innerHTML = '<span class="glow"></span><span class="flame"></span><span class="wick"></span><span class="wax"></span>';
      document.body.append(dark, c);
      var x = innerWidth / 2, y = innerHeight * 0.45, raf = 0;
      function put(e) { x = e.clientX; y = e.clientY; }
      function tick(now) {
        var fl = 1 + Math.sin(now / 83) * 0.035 + Math.sin(now / 31) * 0.02 + (Math.random() - 0.5) * 0.04;
        var R = (Math.min(innerWidth, innerHeight) * 0.2 + 80) * fl;
        dark.style.background = 'radial-gradient(circle ' + R.toFixed(0) + 'px at ' + x + 'px ' + (y - 34) + 'px, rgba(255,170,60,.10) 0%, rgba(20,8,0,.45) 42%, rgba(0,0,0,.93) 78%, #000 100%)';
        c.style.transform = 'translate(' + (x - 13) + 'px,' + (y - 50) + 'px)';
        raf = requestAnimationFrame(tick);
      }
      addEventListener('pointermove', put); addEventListener('pointerdown', put); raf = requestAnimationFrame(tick);
      return function () { cancelAnimationFrame(raf); removeEventListener('pointermove', put); removeEventListener('pointerdown', put); dark.remove(); c.remove(); };
    },
    // Deleted.Fun: dust drifting through a forgotten website
    deleted: function () {
      var bits = [];
      for (var i = 0; i < 28; i++) {
        var d = document.createElement('span'); d.className = 'kf-dust';
        d.style.left = (Math.random() * 100).toFixed(1) + 'vw';
        d.style.animationDuration = (14 + Math.random() * 18).toFixed(1) + 's';
        d.style.animationDelay = (-Math.random() * 30).toFixed(1) + 's';
        document.body.appendChild(d); bits.push(d);
      }
      ['tl', 'br'].forEach(function (k) { var w = document.createElement('span'); w.className = 'kf-web ' + k; document.body.appendChild(w); bits.push(w); });
      return function () { bits.forEach(function (b) { b.remove(); }); };
    },
    // 150 games party: a banner, confetti raining down and balloons you can pop
    party: function () {
      var made = [];
      var count = document.getElementById('gameCount');
      var banner = document.createElement('div'); banner.id = 'kfParty';
      banner.innerHTML = '<div class="flags" aria-hidden="true"></div><div class="big">🎉 150 GAMES! 🎉</div><div class="small">Thanks for playing every single one.</div>';
      if (count && count.parentNode) count.parentNode.insertBefore(banner, count.nextSibling); made.push(banner);
      var cv = document.createElement('canvas'); cv.id = 'kfConfetti'; document.body.appendChild(cv); made.push(cv);
      var x = cv.getContext('2d'), dpr = Math.min(2, devicePixelRatio || 1), P = [], raf = 0, last = performance.now();
      var COLS = ['#ff5a4a', '#ffd23d', '#4aa9d8', '#6fb85c', '#9b7fd4', '#ff7ab6', '#ff9f1c'];
      function size() { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; }
      size(); addEventListener('resize', size);
      for (var i = 0; i < 110; i++) P.push({ x: Math.random() * innerWidth, y: Math.random() * innerHeight - innerHeight, v: 40 + Math.random() * 70, s: 5 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - 0.5) * 6, c: COLS[i % COLS.length], w: Math.random() * 6 });
      function tick(now) {
        var dt = Math.min(0.05, (now - last) / 1000); last = now;
        x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, innerWidth, innerHeight);
        P.forEach(function (p) {
          p.y += p.v * dt; p.x += Math.sin(now / 700 + p.w) * 25 * dt; p.r += p.vr * dt;
          if (p.y > innerHeight + 20) { p.y = -20; p.x = Math.random() * innerWidth; }
          x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; x.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2 * (0.4 + 0.6 * Math.abs(Math.sin(p.r * 2)))); x.restore();
        });
        raf = requestAnimationFrame(tick);
      }
      raf = requestAnimationFrame(tick);
      var bt = setInterval(function () {
        if (document.hidden) return;
        var b = document.createElement('button'); b.className = 'kf-balloon'; b.type = 'button'; b.setAttribute('aria-label', 'Pop the balloon');
        b.style.left = (5 + Math.random() * 85).toFixed(1) + 'vw'; b.style.setProperty('--c', COLS[Math.floor(Math.random() * COLS.length)]);
        b.style.animationDuration = (9 + Math.random() * 5).toFixed(1) + 's';
        b.onclick = function (e) { e.preventDefault(); e.stopPropagation(); b.classList.add('pop'); setTimeout(function () { b.remove(); }, 260); };
        b.addEventListener('animationend', function (e) { if (e.animationName === 'kfFloat') b.remove(); });
        document.body.appendChild(b);
      }, 2600);
      return function () { cancelAnimationFrame(raf); clearInterval(bt); removeEventListener('resize', size); made.forEach(function (m) { m.remove(); }); [].forEach.call(document.querySelectorAll('.kf-balloon'), function (b) { b.remove(); }); };
    },
    // 3D: every tile is a thick card that tilts towards your mouse
    threed: function () {
      var raf = 0, mx = innerWidth / 2, my = innerHeight / 2, dead = false;
      function apply() {
        raf = 0; if (dead) return;
        gameTiles().forEach(function (t) {
          var r = t.getBoundingClientRect(); if (r.bottom < -150 || r.top > innerHeight + 150) return;
          var dx = (mx - (r.left + r.width / 2)) / innerWidth, dy = (my - (r.top + r.height / 2)) / innerHeight;
          t.style.setProperty('--rx', (-dy * 26).toFixed(2) + 'deg'); t.style.setProperty('--ry', (dx * 26).toFixed(2) + 'deg');
        });
      }
      function move(e) { if (e.clientX != null) { mx = e.clientX; my = e.clientY; } if (!raf) raf = requestAnimationFrame(apply); }
      addEventListener('pointermove', move); addEventListener('scroll', move, { passive: true }); apply();
      return function () { dead = true; cancelAnimationFrame(raf); removeEventListener('pointermove', move); removeEventListener('scroll', move); gameTiles().forEach(function (t) { t.style.removeProperty('--rx'); t.style.removeProperty('--ry'); }); };
    },
    // parallax: tiles float at different depths and drift past each other; background layers move slower
    parallax: function () {
      var bg = document.createElement('div'); bg.id = 'kfPara'; bg.setAttribute('aria-hidden', 'true');
      var shapes = ['●', '★', '▲', '◆', '✦', '■'], cols = ['#ff6b5e', '#4aa9d8', '#6fb85c', '#f5b829', '#9b7fd4', '#ff7ab6'];
      var layers = [0.12, 0.3, 0.55].map(function (k, li) {
        var L = document.createElement('div'); L.className = 'kf-layer'; L.dataset.k = k;
        for (var i = 0; i < 16; i++) {
          var s = document.createElement('span'); s.textContent = shapes[(i + li) % shapes.length];
          s.style.left = ((i * 61 + li * 23) % 100) + 'vw'; s.style.top = ((i * 137 + li * 59) % 300) + 'vh';
          s.style.fontSize = (22 + li * 22 + (i % 3) * 10) + 'px'; s.style.color = cols[(i + li * 2) % cols.length]; s.style.opacity = 0.22 + li * 0.14;
          L.appendChild(s);
        }
        bg.appendChild(L); return L;
      });
      document.body.prepend(bg);
      var tiles = gameTiles(), depth = tiles.map(function (t, i) { return 0.55 + ((i * 37) % 10) / 10; });   // 0.55 .. 1.45
      tiles.forEach(function (t, i) { t.style.zIndex = Math.round(depth[i] * 10); });
      var raf = 0, mx = 0, my = 0, dead = false;
      function apply() {
        raf = 0; if (dead) return; var sy = scrollY, mid = innerHeight / 2;
        layers.forEach(function (L) { var k = +L.dataset.k; L.style.transform = 'translate(' + (mx * k * 40).toFixed(1) + 'px,' + (-sy * k).toFixed(1) + 'px)'; });
        tiles.forEach(function (t, i) {
          var r = t.getBoundingClientRect(), base = parseFloat(t.dataset.kfY || 0), top = r.top - base;
          if (top > innerHeight + 300 || top + r.height < -300) return;
          var d = depth[i] - 1, y = (top + r.height / 2 - mid) * d * 0.35, x = mx * d * 36;
          t.dataset.kfY = y; t.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) scale(' + (0.94 + depth[i] * 0.06).toFixed(3) + ')';
          t.style.filter = d < -0.25 ? 'blur(' + (-d * 2.2).toFixed(1) + 'px) saturate(.85)' : '';
        });
      }
      function scroll() { if (!raf) raf = requestAnimationFrame(apply); }
      function move(e) { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; scroll(); }
      addEventListener('scroll', scroll, { passive: true }); addEventListener('pointermove', move); addEventListener('resize', scroll); apply();
      return function () {
        dead = true; cancelAnimationFrame(raf);
        removeEventListener('scroll', scroll); removeEventListener('pointermove', move); removeEventListener('resize', scroll); bg.remove();
        tiles.forEach(function (t) { t.style.transform = ''; t.style.filter = ''; t.style.zIndex = ''; delete t.dataset.kfY; });
      };
    },
    // no games: the games are gone. There is only homework.
    nogames: function () {
      var board = document.createElement('section'); board.id = 'kfBoard';
      var lines = [['3x + 7 = 22   →   x = ?', '#1f5fd1'], ['a² + b² = c²', '#141414'], ['x = (−b ± √(b² − 4ac)) ÷ 2a', '#2f8a2a'], ['∫ 2x dx = x² + C', '#141414'],
        ['sin²θ + cos²θ = 1', '#1f5fd1'], ['12 × 12 = 144', '#2f8a2a'], ['(x + 3)(x − 3) = x² − 9', '#141414'], ['E = mc²', '#1f5fd1']];
      board.innerHTML = '<div class="wb"><div class="eqs">' + lines.map(function (l, i) { return '<div class="eq" style="color:' + l[1] + ';animation-delay:' + (i * 0.45).toFixed(2) + 's">' + l[0] + '</div>'; }).join('') + '</div>' +
        '<div class="hw" style="animation-delay:' + (lines.length * 0.45 + 0.2).toFixed(2) + 's">DO YOUR HOMEWORK.</div>' +
        '<div class="sign" style="animation-delay:' + (lines.length * 0.45 + 1.1).toFixed(2) + 's">No games until it’s done. – the management</div>' +
        '<div class="tray"><i style="--c:#1f5fd1"></i><i style="--c:#c0281a"></i><i style="--c:#2f8a2a"></i><i style="--c:#141414"></i><b></b></div></div>' +
        '<div class="done"><button type="button" id="kfHwBtn">✋ I finished my homework</button><div id="kfHwQ"></div></div>';
      var games = document.querySelector('main.games');
      if (games && games.parentNode) games.parentNode.insertBefore(board, games); else document.body.appendChild(board);
      board.querySelector('#kfHwBtn').onclick = function () {
        var a = 2 + Math.floor(Math.random() * 11), b = 2 + Math.floor(Math.random() * 11), c = 1 + Math.floor(Math.random() * 20), kind = Math.floor(Math.random() * 3), q, ans;
        if (kind === 0) { q = a + ' × ' + b + ' = ?'; ans = a * b; }
        else if (kind === 1) { q = a + ' + ' + b + ' × ' + c + ' = ?'; ans = a + b * c; }
        else { q = a + 'x + ' + c + ' = ' + (a * b + c) + '   x = ?'; ans = b; }
        var box = board.querySelector('#kfHwQ');
        box.innerHTML = '<div class="q">Prove it: ' + q + '</div><input type="number" inputmode="numeric" id="kfHwIn" aria-label="Your answer"> <button type="button" id="kfHwGo">Check</button><div class="r" id="kfHwR"></div>';
        var input = box.querySelector('#kfHwIn'); input.focus();
        var check = function () {
          if (+input.value === ans) { box.querySelector('#kfHwR').textContent = 'Fine. Go play. 🎮'; setTimeout(function () { setLook('normal'); }, 900); }
          else { box.querySelector('#kfHwR').textContent = 'Nope. Keep working. ✏️'; input.select(); }
        };
        box.querySelector('#kfHwGo').onclick = check;
        input.addEventListener('keydown', function (e) { if (e.key === 'Enter') check(); });
      };
      return function () { board.remove(); };
    },
    // OG kai.fun: the old front page (kai-fun.html) - every game as a plain card with an emoji, a name and a line about it
    og: function () { return retro('og'); },
    // VERY OG kai.fun: "A collection of interactive games", pastel cards, nine at a time, and a "Next row of games" button
    veryog: function () { return retro('veryog'); },
    // underwater: light rays, seaweed, fish swimming past, bubbles rising (and trailing your cursor), floating tiles
    underwater: function () {
      var sea = document.createElement('div'); sea.id = 'kfSea'; sea.setAttribute('aria-hidden', 'true');
      var html = '<div class="rays"></div>';
      for (var i = 0; i < 14; i++) {
        var h = 90 + ((i * 53) % 130), x = (i * 7.3 + (i % 3) * 2) % 100, col = ['#1f8a5a', '#2fae6a', '#16704a', '#3cbf7a'][i % 4];
        html += '<svg class="weed" style="left:' + x.toFixed(1) + 'vw;height:' + h + 'px;animation-duration:' + (3 + (i % 4) * 0.7).toFixed(1) + 's;animation-delay:-' + (i * 0.37).toFixed(2) + 's" viewBox="0 0 40 200" preserveAspectRatio="none"><path d="M20 200 C 2 160, 38 130, 20 95 C 4 62, 34 36, 20 0" stroke="' + col + '" stroke-width="10" fill="none" stroke-linecap="round"/></svg>';
      }
      html += '<div class="sand"></div>';
      sea.innerHTML = html; document.body.prepend(sea);
      var made = [sea], timers = [];
      var FISH = ['🐟', '🐠', '🐡', '🐟', '🐠', '🦈', '🐙', '🪼', '🐢', '🦑'];
      function fish() {
        if (document.hidden) return;
        var f = document.createElement('span'), left = Math.random() < 0.5, kind = FISH[Math.floor(Math.random() * FISH.length)];
        f.className = 'kf-fish'; f.textContent = kind; f.setAttribute('aria-hidden', 'true');
        f.style.top = (8 + Math.random() * 80).toFixed(1) + 'vh'; f.style.fontSize = (kind === '🦈' ? 70 : 26 + Math.random() * 26).toFixed(0) + 'px';
        f.style.animationName = left ? 'kfSwimR' : 'kfSwimL'; f.style.animationDuration = (kind === '🦈' ? 9 : 12 + Math.random() * 12).toFixed(1) + 's';
        if (!left) f.style.setProperty('--flip', '1'); else f.style.setProperty('--flip', '-1');   // the emoji face left; turn them to face where they swim
        f.addEventListener('animationend', function () { f.remove(); });
        document.body.appendChild(f);
      }
      function bubble(x, y, size, slow) {
        var b = document.createElement('span'); b.className = 'kf-bubble'; b.setAttribute('aria-hidden', 'true');
        b.style.left = x + 'px'; b.style.top = y + 'px'; b.style.width = b.style.height = size + 'px';
        b.style.animationDuration = (slow ? 6 + Math.random() * 6 : 2 + Math.random() * 1.5).toFixed(1) + 's';
        b.addEventListener('animationend', function () { b.remove(); });
        document.body.appendChild(b);
      }
      timers.push(setInterval(fish, 2300));
      timers.push(setInterval(function () { if (!document.hidden) bubble(Math.random() * innerWidth, innerHeight + 10, 6 + Math.random() * 14, true); }, 450));
      fish(); setTimeout(fish, 900);
      var lastB = 0;
      function trail(e) { var now = performance.now(); if (now - lastB < 70) return; lastB = now; bubble(e.clientX - 4 + Math.random() * 8, e.clientY - 6, 5 + Math.random() * 7, false); }
      addEventListener('pointermove', trail);
      return function () {
        timers.forEach(clearInterval); removeEventListener('pointermove', trail);
        made.forEach(function (m) { m.remove(); });
        [].forEach.call(document.querySelectorAll('.kf-fish, .kf-bubble'), function (x) { x.remove(); });
      };
    },
    // Windows 98: games are desktop icons (double-click to open), a Start menu, a taskbar clock and the odd error box
    win98: function () {
      var made = [], timers = [], header = document.querySelector('header'), grid = document.querySelector('main.games');
      function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
      function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
      // the header becomes a window with a title bar
      var tbar = el('div', 'kf-tbar', '<span class="tt">🌐 Kai.fun - Games and Stuff</span><span class="wb"><button type="button" data-w="min" aria-label="Minimize">_</button><button type="button" data-w="max" aria-label="Maximize">□</button><button type="button" data-w="x" aria-label="Close">×</button></span>');
      if (header) { header.prepend(tbar); made.push(tbar); }
      // every game becomes an icon
      var tiles = gameTiles();
      tiles.forEach(function (t, i) {
        var label = t.getAttribute('aria-label') || (t.querySelector('img') || {}).alt || (t.querySelector('h2') || {}).textContent || 'Game', title = label.split(':')[0].trim();
        var img = t.querySelector('img'), ico = el('span', 'kf-ico');
        var pic = el('span', 'pic');
        if (img) pic.style.backgroundImage = 'url("' + (img.dataset.orig || img.getAttribute('src')) + '")';
        else pic.textContent = emojiFor(label, i);
        if (!img) pic.classList.add('emo');
        ico.appendChild(pic); ico.appendChild(el('span', 'lbl', esc(title)));
        t.appendChild(ico); made.push(ico);
      });
      // single click selects, double click opens (taps and the keyboard open straight away)
      var sel = null, lastT = 0, lastPtr = 'mouse';
      function down(e) { lastPtr = e.pointerType || 'mouse'; }
      function click(e) {
        var t = e.target.closest('main.games > .game-tile');
        if (!t) { if (sel && !e.target.closest('#kfStart, .kf-taskbar, .kf-dlg')) { sel.classList.remove('kf-sel'); sel = null; } return; }
        if (e.detail === 0 || lastPtr === 'touch') return;
        var now = performance.now();
        if (sel === t && now - lastT < 550) return;   // second click of a double click: let it open
        e.preventDefault();
        if (sel) sel.classList.remove('kf-sel');
        sel = t; t.classList.add('kf-sel'); lastT = now;
      }
      function dbl(e) { var t = e.target.closest('main.games > .game-tile'); if (t) location.href = t.href; }
      addEventListener('pointerdown', down, true); document.addEventListener('click', click, true); if (grid) grid.addEventListener('dblclick', dbl);
      // the taskbar
      var bar = el('div', 'kf-taskbar', '<button type="button" class="start" aria-haspopup="true" aria-expanded="false"><span class="logo">😊</span>Start</button><span class="sep"></span>' +
        '<button type="button" class="task on">🌐 Kai.fun - Games and Stuff</button><span class="tray"><span aria-hidden="true">🔊</span><span class="clock"></span></span>');
      var start = el('div', '', '<div class="side"><b>Kai.fun</b>98</div><div class="items">' +
        '<button type="button" data-a="rand"><i>🎲</i>Random game</button><button type="button" data-a="scr"><i>🔀</i>Scramble</button>' +
        '<button type="button" data-a="top"><i>🏆</i>Top visitors</button><button type="button" data-a="news"><i>📰</i>Newsletter</button>' +
        '<button type="button" data-a="make"><i>🛠️</i>Make your own game</button><button type="button" data-a="look"><i>🎨</i>Change look...</button>' +
        '<hr><button type="button" data-a="off"><i>⏻</i>Shut Down...</button></div>');
      start.id = 'kfStart'; start.hidden = true;
      document.body.append(bar, start); made.push(bar, start);
      var sb = bar.querySelector('.start'), task = bar.querySelector('.task'), clock = bar.querySelector('.clock');
      function tick() { var d = new Date(), h = d.getHours(), m = d.getMinutes(); clock.textContent = ((h + 11) % 12 + 1) + ':' + (m < 10 ? '0' : '') + m + ' ' + (h < 12 ? 'AM' : 'PM'); }
      tick(); timers.push(setInterval(tick, 5000));
      function menu(show) { start.hidden = !show; sb.classList.toggle('on', show); sb.setAttribute('aria-expanded', show ? 'true' : 'false'); }
      sb.onclick = function (e) { e.stopPropagation(); menu(start.hidden); };
      function closeMenu(e) { if (!start.hidden && !e.target.closest('#kfStart')) menu(false); }
      document.addEventListener('click', closeMenu);
      function link(re) { var a = [].filter.call(document.querySelectorAll('#kfvBar a, footer a'), function (x) { return re.test(x.textContent + ' ' + x.getAttribute('href')); })[0]; return a && a.href; }
      start.onclick = function (e) {
        var b = e.target.closest('button[data-a]'); if (!b) return; e.stopPropagation(); menu(false);
        var a = b.dataset.a;
        if (a === 'rand') { var t = tiles[Math.floor(Math.random() * tiles.length)]; if (t) location.href = t.href; }
        else if (a === 'scr') { var s = document.getElementById('scrambleBtn'); if (s) s.click(); }
        else if (a === 'top') location.href = link(/visitor/i) || 'visitors.html';
        else if (a === 'news') { var n = link(/newsletter/i); if (n) location.href = n; }
        else if (a === 'make') location.href = 'maker.html';
        else if (a === 'look') { var g = document.getElementById('kfSettingsBtn'); if (g) g.click(); }
        else if (a === 'off') shutDown();
      };
      // window buttons
      tbar.onclick = function (e) {
        var b = e.target.closest('button[data-w]'); if (!b) return;
        if (b.dataset.w === 'min') { header.classList.add('kf-min'); task.classList.remove('on'); }
        else if (b.dataset.w === 'max') header.classList.toggle('kf-max');
        else dialog('Kai.fun', '⛔', 'Kai.fun cannot be closed.<br>It is too fun.', ['OK']);
      };
      task.onclick = function () { var m = header.classList.toggle('kf-min'); task.classList.toggle('on', !m); };
      // error boxes
      var dlgs = [];
      function dialog(title, icon, text, buttons, details) {
        var d = el('div', 'kf-dlg', '<div class="kf-tbar"><span class="tt">' + esc(title) + '</span><span class="wb"><button type="button" data-x aria-label="Close">×</button></span></div>' +
          '<div class="body"><span class="ic">' + icon + '</span><div class="msg">' + text + '</div></div>' +
          (details ? '<pre class="det" hidden>' + esc(details) + '</pre>' : '') +
          '<div class="btns">' + buttons.map(function (b) { return '<button type="button">' + esc(b) + '</button>'; }).join('') + (details ? '<button type="button" data-d>Details &gt;&gt;</button>' : '') + '</div>');
        d.setAttribute('role', 'alertdialog');
        d.style.left = Math.max(8, innerWidth / 2 - 180 + (Math.random() * 160 - 80)) + 'px';
        d.style.top = Math.max(8, innerHeight / 2 - 110 + (Math.random() * 120 - 60)) + 'px';
        d.onclick = function (e) {
          var b = e.target.closest('button'); if (!b) return; e.stopPropagation();
          if (b.hasAttribute('data-d')) { var p = d.querySelector('.det'); p.hidden = !p.hidden; b.innerHTML = p.hidden ? 'Details &gt;&gt;' : '&lt;&lt; Details'; return; }
          d.remove(); dlgs.splice(dlgs.indexOf(d), 1);
        };
        // drag it by the title bar
        var tb = d.querySelector('.kf-tbar');
        tb.addEventListener('pointerdown', function (e) {
          if (e.target.closest('button')) return;
          var ox = e.clientX - d.offsetLeft, oy = e.clientY - d.offsetTop; tb.setPointerCapture(e.pointerId);
          function mv(ev) { d.style.left = (ev.clientX - ox) + 'px'; d.style.top = Math.max(0, ev.clientY - oy) + 'px'; }
          function up() { tb.removeEventListener('pointermove', mv); tb.removeEventListener('pointerup', up); }
          tb.addEventListener('pointermove', mv); tb.addEventListener('pointerup', up);
        });
        document.body.appendChild(d); dlgs.push(d);
        var first = d.querySelector('.btns button'); if (first) first.focus({ preventScroll: true });
        return d;
      }
      var ERRS = [
        ['Kai.fun', '❌', 'Kai.fun has performed an illegal operation and will be shut down.<br><br>If the problem persists, play more games.', ['Close'], 'KAIFUN caused an invalid page fault in\nmodule FUN.DLL at 0137:bff7a3c2.\nRegisters:\nEAX=00000150 CS=0137 EIP=bff7a3c2\nBANANAS=00000000  FUN=FFFFFFFF\nBytes at CS:EIP:\n4b 41 49 2e 46 55 4e 21 21 21'],
        ['Kai.exe', '⚠️', 'Kai.exe is not responding.<br><br>Kai is probably making another game.', ['End Task', 'Wait']],
        ['Low on fun', '⚠️', 'Your computer is running low on fun.<br><br>Close some homework and try again.', ['OK']],
        ['Kai.fun', '❓', 'You have been playing games for a long time.<br><br>Do you want to keep playing?', ['Yes', 'Yes']],
        ['System', 'ℹ️', 'A fatal exception 0E has occurred at 0028:C0011E36.<br><br>Just kidding. Everything is fine.', ['OK']],
        ['Banana.sys', '🍌', 'The banana driver could not be found.<br><br>The monkeys have been notified.', ['OK', 'Cancel']],
        ['Kai.fun Update', '💾', 'Kai.fun found 1 new game.<br><br>(There is always a new game.)', ['Install', 'Later']]
      ], ek = Math.floor(Math.random() * ERRS.length);
      function errBox() {
        if (document.hidden || dlgs.length || !start.hidden) return;
        var r = ERRS[ek++ % ERRS.length]; dialog(r[0], r[1], r[2], r[3], r[4]);
      }
      timers.push(setTimeout(function () { errBox(); timers.push(setInterval(errBox, 75000)); }, 22000));
      // shutting down
      var off = null;
      function shutDown() {
        off = el('div', 'kf-off', '<p>It\'s now safe to turn off<br>your computer.</p><small>(click anywhere to turn it back on)</small>');
        off.onclick = function () { off.classList.add('boot'); off.innerHTML = '<p class="b">Starting Kai.fun 98...</p>'; setTimeout(function () { if (off) { off.remove(); off = null; } }, 1300); };
        document.body.appendChild(off);
      }
      return function () {
        timers.forEach(function (t) { clearInterval(t); clearTimeout(t); });
        removeEventListener('pointerdown', down, true); document.removeEventListener('click', click, true); document.removeEventListener('click', closeMenu);
        if (grid) grid.removeEventListener('dblclick', dbl);
        made.forEach(function (m) { m.remove(); }); dlgs.forEach(function (d) { d.remove(); }); if (off) off.remove();
        if (sel) sel.classList.remove('kf-sel'); if (header) header.classList.remove('kf-min', 'kf-max');
      };
    },
    // Museum: every game is a framed painting with a spotlight and a plaque, and wall panels introduce each gallery
    museum: function () {
      var made = [], grid = document.querySelector('main.games'), sub = document.querySelector('.subtitle'), word = document.querySelector('.wordmark');
      var oldSub = sub ? sub.textContent : '';
      function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
      function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
      var the = el('div', 'kf-mthe', 'The'); if (word && word.parentNode) { word.parentNode.insertBefore(the, word); made.push(the); }
      if (sub) sub.textContent = 'Museum of Games and Stuff · Admission free · Est. 2025';
      var tiles = gameTiles();
      var MED = ['HTML, CSS and JavaScript', 'Pixels on glass', 'Mixed media: code, emoji and hope', 'JavaScript on canvas', 'Code and snacks', 'Digital fun on a screen', 'Ones and zeros, mostly ones'];
      var NOTE = [
        function (t, d) { return '“' + t + '” is widely regarded as a masterpiece of the form. The artist’s statement reads, in full: “' + d + '.”'; },
        function (t) { return 'Here Kai explores the tension between fun and even more fun. Visitors have been known to stand before “' + t + '” for hours.'; },
        function () { return 'Donated anonymously. Scholars still argue about what it means; children understand it at once.'; },
        function (t, d) { return 'A bold piece. Note the pixels: every one placed with love, or at least with JavaScript. ' + cap(d) + '.'; },
        function (t, d) { return 'Please do not lick the painting. (This has happened.) ' + cap(d) + '.'; },
        function () { return 'On loan from the artist’s laptop. Insured for one (1) banana.'; },
        function () { return 'One of the museum’s most-visited works. Some say it is better than the Mona Lisa. The Mona Lisa has not commented.'; },
        function (t) { return 'Early critics dismissed “' + t + '” as “just a game”. They were right, and that is the point.'; },
        function (t, d) { return 'The artist was asked what this work means. The answer: “' + d + '.” Then the artist went to get a snack.'; },
        function () { return 'Restored in 2026 after a visitor pressed it too hard. Please click gently.'; }
      ];
      function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }
      function hash(s) { var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
      tiles.forEach(function (t, i) {
        var label = t.getAttribute('aria-label') || (t.querySelector('img') || {}).alt || (t.querySelector('h2') || {}).textContent || 'Untitled', parts = label.split(':');
        var title = parts[0].trim(), desc = parts.slice(1).join(':').trim().replace(/[.!]+$/, ''), h = hash(title);
        var d = desc ? desc.charAt(0).toLowerCase() + desc.slice(1) : 'it is a game';
        var p = el('span', 'kf-plaque', '<b>' + esc(title) + '</b><span class="by">Kai, ' + (i < 45 ? '2026' : '2025') + '</span><span class="med">' + MED[h % MED.length] + '</span><span class="note">' + esc(NOTE[(h >>> 3) % NOTE.length](title, d)) + '</span>');
        p.setAttribute('aria-hidden', 'true');
        t.appendChild(p); made.push(p);
      });
      // the wall panels: one at the entrance, one for each gallery, and the gift shop at the end
      var G = [
        ['New Acquisitions', 'The museum’s newest works, still warm from the artist’s keyboard. Some of them may still have bugs. The bugs are part of the art.'],
        ['The Permanent Collection', 'These works have hung here long enough to be called classics. Several were made on a school night.'],
        ['The Hall of Small Joys', 'Tiny games about tiny things. The curators recommend clicking all of them, in any order, as fast as possible.'],
        ['The Physics Wing', 'Things fall, bounce, wobble and roll in this gallery. Gravity was not consulted.'],
        ['The Gallery of Questionable Decisions', 'Every work in this room began with the words “what if”. Most of them should not exist. We are glad they do.'],
        ['The Brain Room', 'Puzzles, words and numbers. Thinking is allowed in this gallery, but not required.'],
        ['The Hall of Loud Colours', 'Sunglasses are available at the front desk. They are not.'],
        ['The Quiet Room', 'Please keep your voice down in this gallery. Some of the works are very loud anyway.'],
        ['The Basement Archive', 'Older pieces, rescued from the depths of the artist’s files. Handle with care. Or don’t; they are games.'],
        ['The Experimental Wing', 'In this wing the artist tried things. Some of the things worked.'],
        ['The Snack Gallery', 'A celebration of food in games. Do not eat the exhibits.'],
        ['The Hall of Things That Shouldn’t Work', 'Engineers have studied these pieces for years. Nobody knows how they run.'],
        ['The Long Corridor', 'You are now very deep inside the museum. Leave a trail of breadcrumbs.'],
        ['The Final Rooms', 'Almost the end of the collection. The artist is already making more, so it is never really the end.']
      ];
      var ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'];
      var EVERY = 12, panels = [];
      function panel(cls, html) { var p = el('section', 'kf-panel ' + cls, html); panels.push(p); made.push(p); return p; }
      if (grid && tiles.length) {
        grid.insertBefore(panel('entry', '<div class="k">Welcome</div><h3>The Kai.fun Museum of Games and Stuff</h3><p>The permanent collection holds <b>every game Kai has ever made</b>, all by a single artist. Every piece in this building is a game, and every game can be played. Please do not touch the art. (You may click the art.)</p><div class="f">Galleries I–' + ROMAN[Math.min(ROMAN.length, Math.ceil(tiles.length / EVERY)) - 1] + ' · Gift shop at the exit · Photography allowed</div>'), tiles[0]);
        for (var k = 0; k * EVERY < tiles.length; k++) {
          var g = G[Math.min(k, G.length - 1)], from = k * EVERY + 1, to = Math.min(tiles.length, (k + 1) * EVERY);
          grid.insertBefore(panel('g' + (k % 3), '<div class="k">Gallery ' + (ROMAN[k] || k + 1) + '</div><h3>' + g[0] + '</h3><p>' + g[1] + '</p><div class="f">Works ' + from + '–' + to + ' · Please do not touch the art</div>'), tiles[k * EVERY]);
        }
        var last = tiles[tiles.length - 1];
        var shop = panel('shop', '<div class="k">Exit</div><h3>🛍️ Exit through the gift shop</h3><p>Thank you for visiting. Everything in the gift shop is free.</p><div class="shopl"><a href="maker.html">🛠️ Make your own game</a><a href="visitors.html">🏆 Top visitors</a><a href="#" data-n>📰 Newsletter</a></div>');
        var nl = [].filter.call(document.querySelectorAll('#kfvBar a'), function (x) { return /newsletter/i.test(x.textContent); })[0];
        var na = shop.querySelector('[data-n]'); if (nl) na.href = nl.href; else na.remove();
        last.parentNode.insertBefore(shop, last.nextSibling);
      }
      // the floor and the velvet rope along the bottom of the screen
      var floor = el('div', ''); floor.id = 'kfMuseum'; floor.setAttribute('aria-hidden', 'true'); document.body.appendChild(floor); made.push(floor);
      function rope() {
        var w = innerWidth, n = Math.max(2, Math.round(w / 230)), step = w / n, s = '<svg width="' + w + '" height="64" viewBox="0 0 ' + w + ' 64">';
        function px(j) { return Math.min(w - 9, Math.max(9, j * step)); }
        for (var i = 0; i < n; i++) { var a = px(i), b = px(i + 1), m = (a + b) / 2; s += '<path d="M' + a + ' 16 Q' + m + ' 40 ' + b + ' 16" stroke="#8e1b25" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M' + a + ' 14 Q' + m + ' 37 ' + b + ' 14" stroke="#c0394a" stroke-width="2" fill="none" opacity=".7"/>'; }
        for (var j = 0; j <= n; j++) { var x = px(j); s += '<rect x="' + (x - 3) + '" y="10" width="6" height="44" rx="2" fill="#b8913d"/><circle cx="' + x + '" cy="10" r="7" fill="#e3c46e" stroke="#8a6a24"/><ellipse cx="' + x + '" cy="56" rx="15" ry="5" fill="#8a6a24"/>'; }
        floor.innerHTML = s + '</svg>';
      }
      rope(); addEventListener('resize', rope);
      dispatchEvent(new Event('resize'));
      return function () { removeEventListener('resize', rope); made.forEach(function (m) { m.remove(); }); if (sub) sub.textContent = oldSub; dispatchEvent(new Event('resize')); };
    },
  };

  // ---- the two retro front pages share this: they swap each picture tile for a text card
  var EMO = [['chess', '♟️'], ['banana', '🍌'], ['monke', '🐒'], ['monkey', '🐒'], ['pizza', '🍕'], ['cat', '🐱'], ['dog', '🐶'], ['space', '🚀'], ['star', '⭐'], ['black hole', '🕳️'], ['planet', '🪐'],
    ['water', '💧'], ['bottle', '🍼'], ['fish', '🐟'], ['music', '🎵'], ['piano', '🎹'], ['draw', '✏️'], ['paint', '🎨'], ['art', '🖼️'], ['word', '🔤'], ['type', '⌨️'], ['letter', '✉️'],
    ['math', '➗'], ['number', '🔢'], ['card', '🃏'], ['dice', '🎲'], ['wiki', '📚'], ['book', '📖'], ['map', '🗺️'], ['world', '🌍'], ['flag', '🏳️'], ['car', '🏎️'], ['race', '🏁'],
    ['ball', '⚽'], ['golf', '⛳'], ['pinball', '🎱'], ['pong', '🏓'], ['light', '🚦'], ['tower', '🗼'], ['build', '🧱'], ['block', '🧱'], ['robot', '🤖'], ['ai', '🤖'], ['zombie', '🧟'],
    ['ghost', '👻'], ['snow', '⛄'], ['weather', '🌦️'], ['sun', '☀️'], ['fire', '🔥'], ['cheese', '🧀'], ['food', '🍔'], ['cook', '🍳'], ['toast', '🍞'], ['egg', '🥚'], ['time', '⏳'],
    ['clock', '⏰'], ['loading', '⏳'], ['wait', '⏳'], ['puzzle', '🧩'], ['maze', '🌀'], ['secret', '🔐'], ['vault', '🔐'], ['money', '💰'], ['coin', '🪙'], ['dollar', '💵'], ['job', '💼'],
    ['hire', '📋'], ['terminal', '💻'], ['code', '💻'], ['computer', '💻'], ['browser', '🕵️'], ['snitch', '🕵️'], ['fossil', '🦴'], ['dino', '🦖'], ['frog', '🐸'], ['bird', '🐦'], ['bee', '🐝'],
    ['bug', '🐛'], ['penguin', '🐧'], ['duck', '🦆'], ['sword', '⚔️'], ['fight', '🥊'], ['boss', '👾'], ['war', '⚔️'], ['country', '🏛️'], ['lunch', '🥪'], ['sandwich', '🥪'], ['candy', '🍬'],
    ['slide', '🛝'], ['jump', '🦘'], ['run', '🏃'], ['dance', '💃'], ['human', '🧍'], ['people', '👥'], ['face', '🙂'], ['eye', '👁️'], ['mirror', '🪞'], ['twin', '👯'], ['infinity', '♾️'], ['file', '📁']];
  function emojiFor(text, i) {
    var t = ' ' + text.toLowerCase() + ' ';
    for (var k = 0; k < EMO.length; k++) if (t.indexOf(EMO[k][0]) >= 0) return EMO[k][1];
    return ['🎮', '🕹️', '👾', '🎯', '🎲', '🏆', '⚡', '🌈'][i % 8];
  }
  function retro(kind) {
    var made = [], grid = document.querySelector('main.games'), header = document.querySelector('header'), sub = document.querySelector('.subtitle'), word = document.querySelector('.wordmark');
    var oldSub = sub ? sub.textContent : '';
    var mark = document.createElement('span'); mark.className = 'kf-retromark'; mark.textContent = 'Kai.fun';
    if (word) { word.appendChild(mark); made.push(mark); }
    if (sub && kind === 'veryog') sub.textContent = 'A collection of interactive games';
    var tiles = gameTiles().filter(function (t) { return !/workfor\./.test(t.getAttribute('href') || ''); });
    tiles.forEach(function (t, i) {
      if (!t.querySelector('img, iframe')) return;   // already a text card
      var label = t.getAttribute('aria-label') || (t.querySelector('img') || {}).alt || 'A game', parts = label.split(':'), title = parts[0].trim(), desc = parts.slice(1).join(':').trim();
      var card = document.createElement('span'); card.className = 'kf-retro';
      card.innerHTML = '<span class="emoji"></span><span class="t"></span><span class="d"></span>';
      card.querySelector('.emoji').textContent = emojiFor(label, i);
      card.querySelector('.t').textContent = title;
      card.querySelector('.d').textContent = desc ? desc.charAt(0).toLowerCase() + desc.slice(1) : '';
      t.appendChild(card); made.push(card);
    });
    var cleanup = function () {};
    if (kind === 'veryog') {
      // nine at a time; the button moves along one row of three
      var start = 0, btn = document.createElement('button'); btn.type = 'button'; btn.id = 'kfNextRow'; btn.textContent = 'Next row of games →';
      if (header) header.appendChild(btn); made.push(btn);
      var show = function () { tiles.forEach(function (t, i) { var k = (i - start + tiles.length) % tiles.length; t.classList.toggle('kf-off', k >= 9); t.style.order = k < 9 ? k : ''; }); dispatchEvent(new Event('resize')); };
      btn.onclick = function () { start = (start + 3) % tiles.length; show(); };
      show();
      cleanup = function () { tiles.forEach(function (t) { t.classList.remove('kf-off'); t.style.order = ''; }); };
    }
    return function () { cleanup(); made.forEach(function (m) { m.remove(); }); if (sub) sub.textContent = oldSub; dispatchEvent(new Event('resize')); };
  }

  window.KFLooks = { setLook: setLook, made: made, grav: function () { return grav; } };
  var start = currentLook();
  restyle(start);
  fxSwitch(start);
  if (start === 'gravity') { if (document.readyState === 'complete') gravityOn(); else addEventListener('load', function () { setTimeout(gravityOn, 200); }); }
})();
