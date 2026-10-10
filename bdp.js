/* The Billion Dollar Puzzle — shared piece engine.
   Loaded by every page on Kai.fun with <script src="bdp.js" defer></script>.
   It never blocks or changes the page: it only watches and, when the time is right, drops a piece. */
(function () {
'use strict';
if (window.BDP) return;
const N = 8, CELL = 200, SIZE = N * CELL, TOTAL = N * N;
const KEY = 'bdp_v1';
const ART = 'billion-art.svg';

/* ---------- storage ---------- */
function load() { try { const j = JSON.parse(localStorage.getItem(KEY) || 'null'); if (j && typeof j === 'object') { j.found = j.found || {}; j.placed = j.placed || {}; return j; } } catch (e) {} return { found: {}, placed: {} }; }
function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }

/* ---------- seeded rng ---------- */
function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

/* ---------- where each piece lives (page -> piece id + how it hides) ----------
   stored lightly scrambled so it isn't readable at a glance */
const RAW = 'W1siaW5kZXguaHRtbCIsInNjcm9sbCJdLFsia2FpaXNtLmh0bWwiLCJ0eXBlIiwia2FpeW8iXSxbImZhbW91cy5odG1sIiwic3RheSIsNDVdLFsiaW5jcmVtZW50YWwuaHRtbCIsImNpcmNsZSJdLFsibXVzZXVtLmh0bWwiLCJpZGxlIiw0MF0sWyJkZXNrLmh0bWwiLCJjb3JuZXIiLCJ0bCJdLFsiZWxldmF0b3IuaHRtbCIsImNsb2NrIiwzXSxbIm1vbmtlLXR5Y29vbi5odG1sIiwiYXdheSJdLFsid2lraWNvbm5lY3QuaHRtbCIsInNlbGVjdCJdLFsic29rcy5odG1sIiwidHlwZSIsInNlbGwiXSxbImNvbmZpcm0uaHRtbCIsImNsaWNrcyIsNDBdLFsidGVybWluYWwuaHRtbCIsInR5cGUiLCJwaWVjZSJdLFsiZGljZS5odG1sIiwic2hha2UiXSxbIm1vbmV5Lmh0bWwiLCJlZGdlIl0sWyJib2IuaHRtbCIsImlkbGUiLDYwXSxbImNoZXNzMi5odG1sIiwicmNsaWNrIiwzXSxbImNhbGN1bGF0aW9ucy5odG1sIiwidHlwZSIsImJpbGxpb24iXSxbIm1hcHMuaHRtbCIsImNvcm5lciIsImJsIl0sWyJ3aGVuLmh0bWwiLCJjbG9jayIsN10sWyJqb2VndWVzc3IuaHRtbCIsInR5cGUiLCJqb2UiXSxbImJhYmVsaXguaHRtbCIsInN0YXkiLDkwXSxbIm1pbWljLmh0bWwiLCJob2xkIiw0XSxbImRldmljYWJpbGl0eS5odG1sIiwicmVzaXplIl0sWyJzbWlsZWRleC5odG1sIiwiZGJsIiw1XSxbImRlbGV0ZWQuaHRtbCIsInNjcm9sbCJdLFsiYWl0cmFpbmVyLmh0bWwiLCJ0eXBlIiwic2VjcmV0Il0sWyJjdWJlLmh0bWwiLCJjaXJjbGUiXSxbInBhdXNlLmh0bWwiLCJhd2F5Il0sWyJ3aHl0Zi5odG1sIiwiaWRsZSIsMzBdLFsic2xpZGVzaG93Lmh0bWwiLCJrb25hbWkiXSxbImxvYWRpbmcuaHRtbCIsInN0YXkiLDE4MF0sWyJjbGljay1mb3ItYmFjb24uaHRtbCIsImNsaWNrcyIsMTAwXSxbIndvYmJsZS5odG1sIiwic2hha2UiXSxbIndpa2lwZWRpYS5odG1sIiwiY29weSJdLFsic2VhcmNoLmh0bWwiLCJ0eXBlIiwiZ29sZCJdLFsiYmlnZmlsZS5odG1sIiwiY29ybmVyIiwidHIiXSxbImJsZW5kZXIuaHRtbCIsImRibCIsM10sWyJob3VyZ2xhc3MuaHRtbCIsImlkbGUiLDkwXSxbImRlc21vcmUuaHRtbCIsInNlbGVjdCJdLFsic3BsaXQuaHRtbCIsInJjbGljayIsMl0sWyJ0b2FzdGluZy5odG1sIiwiY2xpY2tzIiw2MF0sWyJldWNsaWQuaHRtbCIsImtvbmFtaSJdLFsidXBkYXRlcy5odG1sIiwic2Nyb2xsIl0sWyJzdGlja21hbi1jYWZlLmh0bWwiLCJob2xkIiwzXSxbImthaS5odG1sIiwiY29ybmVyIiwibCJdLFsibGFuZy5odG1sIiwidHlwZSIsImthaWhhbmEiXSxbInNjcmlwdC5odG1sIiwiY2lyY2xlIl0sWyJjb2RlLmh0bWwiLCJjb25zb2xlIl0sWyJ0aW1lLmh0bWwiLCJjbG9jayIsNV0sWyJwZWRpYS5odG1sIiwic2VsZWN0Il0sWyJhbnRoZW0uaHRtbCIsInN0YXkiLDgwXSxbInRlc3QuaHRtbCIsImNvcHkiXSxbIndvcmxkZWRpdC5odG1sIiwiem9vbSJdLFsiam9ic2ltLmh0bWwiLCJpZGxlIiw0NV0sWyJmcmFtZXBlcmZlY3RzLmh0bWwiLCJjbGlja3MiLDYwXSxbInNjYW5pZnkuaHRtbCIsImNvcm5lciIsImIiXSxbImhhbmRjaGVzcy5odG1sIiwicmNsaWNrIiwzXSxbInNva3Mtb2xkLmh0bWwiLCJ0eXBlIiwibW9vbiJdLFsiY2hlc3MyLW9sZC5odG1sIiwicmVzaXplIl0sWyJleWVjaGVzcy5odG1sIiwiaWRsZSIsMjBdLFsiZGlnLmh0bWwiLCJjbGlja3MiLDUwXSxbImFpb2x5bXBpY3MuaHRtbCIsImVkZ2UiXSxbInBsYXlncm91bmQuaHRtbCIsImNvbnNvbGUiXSxbImthaS1mdW4uaHRtbCIsImNvcm5lciIsInIiXV0=';
const LIST = JSON.parse(atob(RAW));
// which board slot each page's piece belongs to — a fixed shuffle so neighbours on the site aren't neighbours on the board
const order = [...Array(TOTAL).keys()]; { const r = mulberry(20261010); for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; } }
const PIECES = LIST.map(([page, type, arg], i) => ({ id: order[i], page, type, arg, code: type === 'console' ? String(10000 + hash('bdp-code|' + page) % 90000) : null }));
const byPage = new Map(PIECES.map(p => [p.page, p]));
const byId = new Map(PIECES.map(p => [p.id, p]));
const TOUCH = (() => { try { return matchMedia('(pointer:coarse)').matches; } catch (e) { return false; } })();
const KEYBOARDY = ['type', 'konami', 'zoom', 'edge', 'copy'];

/* ---------- jigsaw geometry (shared by every page and the board) ---------- */
const er = mulberry(1000000000);
const HE = [], VE = []; // horizontal edges [r][c] between rows r,r+1 ; vertical edges [r][c] between cols c,c+1
for (let r = 0; r < N - 1; r++) { HE.push([]); for (let c = 0; c < N; c++) HE[r].push({ s: er() < 0.5 ? 1 : -1, m: 0.44 + er() * 0.12, k: 0.88 + er() * 0.22 }); }
for (let r = 0; r < N; r++) { VE.push([]); for (let c = 0; c < N - 1; c++) VE[r].push({ s: er() < 0.5 ? 1 : -1, m: 0.44 + er() * 0.12, k: 0.88 + er() * 0.22 }); }
// knob in edge space: x along edge (0..1), y = bump height (positive = toward the edge's normal)
function knob(e) {
  const m = e.m, k = e.k, w = 0.12 * k, h = 0.2 * k;
  return [[[m - w - 0.02, 0], [m - w + 0.03, 0.02], [m - w + 0.01, h * 0.55]], [[m - w - 0.03, h * 1.15], [m + w + 0.03, h * 1.15], [m + w - 0.01, h * 0.55]], [[m + w - 0.03, 0.02], [m + w + 0.02, 0], [1, 0]]];
}
function edgeSegs(x0, y0, dx, dy, nx, ny, e) { // returns cubic segments in global coords, from start to end
  const P = (u, v) => [x0 + dx * u * CELL + nx * v * e.s * CELL, y0 + dy * u * CELL + ny * v * e.s * CELL];
  return [{ L: P(knob(e)[0][0][0] - 0.0001 + 0.0001, 0) }].concat(knob(e).map(seg => ({ C: seg.map(([u, v]) => P(u, v)) })));
}
function hEdge(r, c) { return edgeSegs(c * CELL, (r + 1) * CELL, 1, 0, 0, 1, HE[r][c]); }
function vEdge(r, c) { return edgeSegs((c + 1) * CELL, r * CELL, 0, 1, 1, 0, VE[r][c]); }
function reverse(segs, start) { // segs drawn from `start`; return segments drawn backwards ending at `start`
  const pts = [start]; for (const s of segs) pts.push(s.L ? s.L : s.C[2]);
  const out = [];
  for (let i = segs.length - 1; i >= 0; i--) { const s = segs[i], to = pts[i]; out.push(s.L ? { L: to } : { C: [s.C[1], s.C[0], to] }); }
  return out;
}
const f = n => Math.round(n * 100) / 100;
function piecePath(id) {
  const r = Math.floor(id / N), c = id % N, x = c * CELL, y = r * CELL;
  let d = `M${x},${y}`; const add = segs => { for (const s of segs) d += s.L ? `L${f(s.L[0])},${f(s.L[1])}` : `C${s.C.map(p => f(p[0]) + ',' + f(p[1])).join(' ')}`; };
  if (r === 0) d += `L${x + CELL},${y}`; else add(hEdge(r - 1, c));
  if (c === N - 1) d += `L${x + CELL},${y + CELL}`; else add(vEdge(r, c));
  if (r === N - 1) d += `L${x},${y + CELL}`; else add(reverse(hEdge(r, c), [x, y + CELL]));
  if (c === 0) d += `L${x},${y}`; else add(reverse(vEdge(r, c - 1), [x, y]));
  return d + 'Z';
}
function bbox(id) { const r = Math.floor(id / N), c = id % N, m = CELL * 0.3; return { x: c * CELL - m, y: r * CELL - m, w: CELL + 2 * m, h: CELL + 2 * m }; }
function pieceSVG(id, px, opts = {}) {
  const b = bbox(id), cid = 'bdpc' + id + '_' + Math.floor(Math.random() * 1e6), path = piecePath(id);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${b.x} ${b.y} ${b.w} ${b.h}" width="${px}" height="${px}" style="display:block;overflow:visible"><defs><clipPath id="${cid}"><path d="${path}"/></clipPath></defs>` +
    `<path d="${path}" fill="#1d4d2e" transform="translate(6,8)" opacity=".45"/>` +
    `<g clip-path="url(#${cid})"><rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" fill="#e9dfb8"/><image href="${opts.art || ART}" x="0" y="0" width="${SIZE}" height="${SIZE}" preserveAspectRatio="none"/></g>` +
    `<path d="${path}" fill="none" stroke="${opts.stroke || '#3b2a08'}" stroke-width="${opts.sw || 5}" stroke-linejoin="round"/></svg>`;
}

/* ---------- hints ---------- */
const HINTS = {
  scroll: () => 'go past the end. then keep going.',
  type: a => `spell it: ${a.toUpperCase().split('').map((ch, i) => i === 0 || i === a.length - 1 ? ch : '_').join(' ')}`,
  stay: s => `stay a while. ${s} seconds, maybe.`,
  circle: () => 'draw a circle. a real one.',
  idle: s => `do absolutely nothing for ${s} seconds.`,
  corner: a => ({ tl: 'top left', tr: 'top right', bl: 'bottom left', br: 'bottom right', l: 'the left edge', r: 'the right edge', t: 'the top edge', b: 'the bottom edge' }[a] + ', if you squint.'),
  clock: d => `only shows when the minute ends in ${d}.`,
  away: () => 'leave. come back.',
  select: () => 'highlight some words.',
  clicks: n => `click. a lot. like ${n} times.`,
  shake: () => 'shake it. fast, side to side.',
  edge: () => 'try to leave through the top.',
  rclick: n => `the other click, ${n} times.`,
  hold: s => `press and hold for ${s} seconds.`,
  resize: () => 'change the shape of the window.',
  dbl: n => `double-click empty space, ${n} times.`,
  konami: () => 'a very old code. up, up…',
  copy: () => 'steal some words.',
  console: () => 'the developers know. so does the keypad.',
  zoom: () => 'look closer. no, closer.'
};
function hint(id) { const p = byId.get(id); if (!p) return ''; let h = HINTS[p.type](p.arg); if (TOUCH && KEYBOARDY.includes(p.type)) h += ' (on a phone: press and hold anywhere for 3 seconds)'; return h; }

/* ---------- public API (used by the board and the vault) ---------- */
const BDP = window.BDP = {
  N, CELL, SIZE, TOTAL, ART, PIECES, piecePath, bbox, pieceSVG, hint,
  pageOf: id => (byId.get(id) || {}).page,
  state: load,
  setPlaced(id, v) { const s = load(); if (v) s.placed[id] = 1; else delete s.placed[id]; save(s); },
  found: () => Object.keys(load().found).map(Number),
  collect(id) { const s = load(); if (!s.found[id]) { s.found[id] = Date.now(); save(s); return true; } return false; },
  claimCode(code) { const p = PIECES.find(x => x.code && x.code === String(code).trim()); if (!p) return null; BDP.collect(p.id); return p.id; },
  keyFor(s) { const ids = Object.keys(s.found).map(Number).sort((a, b) => a - b).join(','); return (hash('vault|' + ids + '|kai.fun') ^ 0x5bd1e995) >>> 0; },
  isComplete() { const s = load(); return Object.keys(s.found).length === TOTAL && Object.keys(s.placed).length === TOTAL; },
  unlock() { const s = load(); if (Object.keys(s.found).length !== TOTAL || Object.keys(s.placed).length !== TOTAL) return false; s.key = BDP.keyFor(s); s.done = s.done || Date.now(); save(s); return true; },
  isUnlocked() { const s = load(); return Object.keys(s.found).length === TOTAL && Object.keys(s.placed).length === TOTAL && s.key === BDP.keyFor(s); }
};

/* ---------- the hiding (runs on every page except the board/vault) ---------- */
const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
const me = byPage.get(page);
if (!me || document.documentElement.hasAttribute('data-bdp-off')) return;
if (me.type === 'console') { try { console.log('%c🧩 THE BILLION DOLLAR PUZZLE%c\nthis page\'s piece is not on the page.\nkeypad code: ' + me.code, 'font:900 16px sans-serif;color:#b8860b', 'font:13px monospace'); } catch (e) {} return; }
if (load().found[me.id]) return;

let host, root, shown = false;
function ensureHost() {
  if (host) return;
  host = document.createElement('div'); host.setAttribute('aria-live', 'polite');
  host.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2147483000';
  root = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;
  root.innerHTML = `<style>
    .pc{position:fixed;width:86px;height:86px;pointer-events:auto;cursor:pointer;filter:drop-shadow(0 6px 10px rgba(0,0,0,.35));transition:transform .25s;animation:in .7s cubic-bezier(.2,1.6,.4,1) both, bob 2.6s ease-in-out .7s infinite;-webkit-tap-highlight-color:transparent;border:0;background:none;padding:0}
    .pc:hover{transform:scale(1.12) rotate(-6deg)}
    .pc.peek{width:44px;height:44px;opacity:.85;animation:none}
    .pc.peek:hover{opacity:1}
    .pc.go{animation:fly .9s cubic-bezier(.5,-.3,.6,1) forwards}
    @keyframes in{from{transform:scale(0) rotate(-40deg);opacity:0}to{transform:none;opacity:1}}
    @keyframes bob{50%{translate:0 -6px;rotate:4deg}}
    @keyframes fly{to{transform:translate(var(--fx),var(--fy)) scale(.2) rotate(360deg);opacity:0}}
    .toast{position:fixed;left:50%;bottom:max(18px,env(safe-area-inset-bottom));transform:translate(-50%,160%);pointer-events:auto;background:#14321f;color:#f6e7b0;border:3px solid #d4a72c;border-radius:16px;padding:12px 16px 12px 12px;display:flex;gap:12px;align-items:center;box-shadow:0 10px 30px rgba(0,0,0,.4),inset 0 0 0 2px #0c2215;font:700 15px/1.3 Georgia,'Times New Roman',serif;max-width:min(92vw,460px);transition:transform .5s cubic-bezier(.2,1.4,.4,1)}
    .toast.on{transform:translate(-50%,0)}
    .toast b{display:block;font:900 12px/1.2 system-ui,sans-serif;letter-spacing:.18em;color:#d4a72c;text-transform:uppercase;margin-bottom:3px}
    .toast a{color:#ffe08a}
  </style>`;
  (document.body || document.documentElement).appendChild(host);
}
function spot() { const r = mulberry(hash(page)); return { x: 0.12 + r() * 0.72, y: 0.2 + r() * 0.55 }; }
function show(where) {
  if (shown) return; shown = true; ensureHost();
  const b = document.createElement('button'); b.className = 'pc'; b.setAttribute('aria-label', 'A puzzle piece! Take it');
  b.innerHTML = pieceSVG(me.id, '100%');
  if (where && where.peek) {
    b.classList.add('peek'); const s = 44, o = -18;
    const pos = { tl: [o, o + 0], tr: ['r', o], bl: [o, 'b'], br: ['r', 'b'], l: [o, '50%'], r: ['r', '50%'], t: ['50%', o], b: ['50%', 'b'] }[where.peek];
    b.style.left = pos[0] === 'r' ? `calc(100% - ${s + o}px)` : pos[0] === '50%' ? `calc(50% - ${s / 2}px)` : pos[0] + 'px';
    b.style.top = pos[1] === 'b' ? `calc(100% - ${s + o}px)` : pos[1] === '50%' ? `calc(50% - ${s / 2}px)` : pos[1] + 'px';
  } else {
    const p = where && where.x != null ? where : spot();
    b.style.left = `clamp(8px, calc(${(p.x * 100).toFixed(1)}% - 43px), calc(100% - 94px))`;
    b.style.top = `clamp(8px, calc(${(p.y * 100).toFixed(1)}% - 43px), calc(100% - 94px))`;
  }
  b.addEventListener('click', e => { e.stopPropagation(); take(b); });
  root.appendChild(b);
}
function take(b) {
  BDP.collect(me.id);
  const r = b.getBoundingClientRect();
  b.style.setProperty('--fx', (innerWidth / 2 - r.left - r.width / 2) + 'px'); b.style.setProperty('--fy', (innerHeight - 60 - r.top) + 'px');
  b.classList.add('go'); setTimeout(() => b.remove(), 950);
  const n = BDP.found().length, t = document.createElement('div'); t.className = 'toast';
  t.innerHTML = `<span style="width:52px;height:52px;flex:none">${pieceSVG(me.id, 52, { sw: 7 })}</span><span><b>Piece found · ${n} of ${TOTAL}</b>${n === TOTAL ? 'That was the last one. Every piece is yours.' : 'Someone hid a piece of something big here.'} <a href="billion.html">The Billion Dollar Puzzle →</a></span>`;
  root.appendChild(t); requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('on')));
  setTimeout(() => { t.classList.remove('on'); setTimeout(() => t.remove(), 600); }, 6500);
  teardown();
}

/* ---------- triggers ---------- */
const offs = [];
const on = (t, ev, fn, o) => { t.addEventListener(ev, fn, o || { passive: true }); offs.push(() => t.removeEventListener(ev, fn, o || { passive: true })); };
const timers = [];
function teardown() { offs.splice(0).forEach(f => f()); timers.splice(0).forEach(clearInterval); }
const inField = el => el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
let lastPt = null; on(window, 'pointerdown', e => { lastPt = { x: e.clientX / innerWidth, y: e.clientY / innerHeight }; });
const near = () => lastPt ? { x: Math.min(0.85, Math.max(0.12, lastPt.x)), y: Math.min(0.8, Math.max(0.15, lastPt.y - 0.12)) } : null;

function holdTrigger(sec, cb) {
  let t0 = 0, sx = 0, sy = 0, iv = 0;
  on(window, 'pointerdown', e => { t0 = performance.now(); sx = e.clientX; sy = e.clientY; clearInterval(iv); iv = setInterval(() => { if (t0 && performance.now() - t0 >= sec * 1000) { clearInterval(iv); t0 = 0; cb(near()); } }, 100); timers.push(iv); });
  on(window, 'pointermove', e => { if (t0 && Math.hypot(e.clientX - sx, e.clientY - sy) > 18) { t0 = 0; clearInterval(iv); } });
  ['pointerup', 'pointercancel'].forEach(ev => on(window, ev, () => { t0 = 0; clearInterval(iv); }));
}
function visibleSeconds(sec, cb, resetOnInput) {
  let acc = 0, last = performance.now();
  const iv = setInterval(() => { const now = performance.now(); if (!document.hidden) acc += (now - last) / 1000; last = now; if (acc >= sec) { clearInterval(iv); cb(); } }, 500); timers.push(iv);
  if (resetOnInput) ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart', 'scroll'].forEach(ev => on(window, ev, () => { acc = 0; }, { passive: true, capture: true }));
}
const T = {
  corner: a => show({ peek: a }),
  stay: s => visibleSeconds(s, () => show()),
  idle: s => visibleSeconds(s, () => show(), true),
  clock: d => { const chk = () => { if (new Date().getMinutes() % 10 === d) show(); }; chk(); const iv = setInterval(chk, 5000); timers.push(iv); },
  away: () => { let left = false, t0 = document.title; on(document, 'visibilitychange', () => { if (document.hidden) { left = true; try { document.title = '🧩 come back…'; } catch (e) {} } else if (left) { try { document.title = t0; } catch (e) {} show(); } }); },
  clicks: n => { let c = 0; on(window, 'pointerdown', () => { if (++c >= n) show(near()); }, { passive: true, capture: true }); },
  dbl: n => { let c = 0; on(window, 'dblclick', e => { const t = e.target; if (!(t && t.closest && t.closest('button,a,input,textarea,select,canvas,[contenteditable],[role=button]'))) { if (++c >= n) show(near()); } }, { passive: true, capture: true }); },
  rclick: n => { let c = 0; on(window, 'contextmenu', () => { if (++c >= n) show(near()); }, { passive: true, capture: true }); },
  hold: s => holdTrigger(s, p => show(p)),
  select: () => { on(document, 'selectionchange', () => { try { const s = String(getSelection()); if (s.replace(/\s+/g, ' ').trim().length >= 20) show(); } catch (e) {} }); },
  copy: () => on(document, 'copy', () => show(), { passive: true, capture: true }),
  type: w => { let buf = ''; on(window, 'keydown', e => { if (!e.key || e.key.length !== 1) return; buf = (buf + e.key.toLowerCase()).slice(-w.length); if (buf === w) show(); }, { passive: true, capture: true }); },
  konami: () => { const K = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a']; let i = 0; on(window, 'keydown', e => { const k = (e.key || '').toLowerCase(); i = k === K[i] ? i + 1 : (k === K[0] ? 1 : 0); if (i === K.length) show(); }, { passive: true, capture: true }); },
  scroll: () => { let c = 0, ty = 0; const atEnd = () => { const el = document.scrollingElement || document.documentElement; return el.scrollTop + innerHeight >= el.scrollHeight - 6; };
    on(window, 'wheel', e => { if (e.deltaY > 0 && atEnd() && ++c >= 6) show(); }, { passive: true, capture: true });
    on(window, 'touchstart', e => { ty = e.touches[0].clientY; }, { passive: true, capture: true });
    on(window, 'touchmove', e => { const y = e.touches[0].clientY; if (ty - y > 40 && atEnd()) { ty = y; if (++c >= 4) show(); } }, { passive: true, capture: true }); },
  circle: () => { let pts = [], ang = 0, prev = null;
    on(window, 'pointermove', e => { if (e.pointerType === 'mouse' && !e.buttons && e.pointerType !== 'touch') { /* drawing with the button up still counts */ }
      pts.push([e.clientX, e.clientY, performance.now()]); pts = pts.filter(p => performance.now() - p[2] < 1600); if (pts.length < 8) return;
      const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length, cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
      const r = pts.reduce((s, p) => s + Math.hypot(p[0] - cx, p[1] - cy), 0) / pts.length; if (r < 30) { ang = 0; prev = null; return; }
      const a = Math.atan2(e.clientY - cy, e.clientX - cx); if (prev != null) { let d = a - prev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; ang += d; } prev = a;
      if (Math.abs(ang) > Math.PI * 3.6) show({ x: cx / innerWidth, y: cy / innerHeight }); }, { passive: true, capture: true }); },
  shake: () => { let flips = [], lastDx = 0, lx = null;
    on(window, 'pointermove', e => { if (lx == null) { lx = e.clientX; return; } const dx = e.clientX - lx; lx = e.clientX; if (Math.abs(dx) < 4) return; if (lastDx && Math.sign(dx) !== Math.sign(lastDx)) { flips.push(performance.now()); flips = flips.filter(t => performance.now() - t < 1200); if (flips.length >= 9) show(near()); } lastDx = dx; }, { passive: true, capture: true });
    on(window, 'devicemotion', e => { const a = e.accelerationIncludingGravity; if (a && Math.abs(a.x || 0) > 25) show(); }); },
  edge: () => { on(document, 'mouseout', e => { if (!e.relatedTarget && e.clientY <= 2) show({ x: 0.5, y: 0.25 }); }, { passive: true, capture: true }); },
  resize: () => { const w0 = innerWidth, h0 = innerHeight; on(window, 'resize', () => { if (Math.abs(innerWidth - w0) > 120 || Math.abs(innerHeight - h0) > 160 || (innerWidth > innerHeight) !== (w0 > h0)) show(); }); },
  zoom: () => { const d0 = window.devicePixelRatio, chk = () => { const vv = window.visualViewport; if (Math.abs(window.devicePixelRatio - d0) > 0.05 || (vv && vv.scale > 1.3)) show(); };
    on(window, 'resize', chk); if (window.visualViewport) on(window.visualViewport, 'resize', chk); const iv = setInterval(chk, 1000); timers.push(iv); }
};
function arm() {
  try {
    T[me.type](me.arg);
    if (TOUCH && KEYBOARDY.includes(me.type)) holdTrigger(3, p => show(p));
  } catch (e) {}
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arm); else arm();
})();
