// ⚙️ Settings for kai.fun: pick a look (Normal, Cardboard, Crayon) and switch kid-friendly mode.
// The saved choices are applied before the page paints by a tiny script in <head>; this file builds
// the button and menu, and the SVG filters the Crayon look uses for its wobbly waxy lines.
(function () {
  var root = document.documentElement;
  var LOOKS = [
    { id: 'normal', name: 'Normal' },
    { id: 'cardboard', name: 'Cardboard' },
    { id: 'crayon', name: 'Crayon' }
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
    crayonFilter('kf-crayon-soft', 0.04, 2, 1.0, '-1.6 1.5');
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
})();
