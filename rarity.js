/* Rarity Roll: shared by the homepage tile and rarity.html.
   Every time the homepage loads it rolls one of 35 rarities ("1/2 Common", "1/5 Uncommon", ...).
   Rolling goes from the rarest down: each rarity gets its own 1-in-N chance, and if nothing hits you get Common. */
(function () {
"use strict";
const R = [
  ["Common", 2, "#b8b8b8"], ["Uncommon", 5, "#6fbf4a"], ["Rare", 10, "#3d8ef0"], ["Epic", 25, "#9b59e6"],
  ["Legendary", 50, "#f5a524"], ["Mythic", 100, "#ff4f7a"], ["Exotic", 250, "#17c3b2"], ["Divine", 500, "#ffd84a"],
  ["Celestial", 1000, "#8fd3ff"], ["Ethereal", 2500, "#d8b4fe"], ["Cosmic", 5000, "#6c5ce7"], ["Astral", 10000, "#74b9ff"],
  ["Prismatic", 25000, "#ff9ff3"], ["Glitched", 50000, "#00ff9c"], ["Nebula", 100000, "#e056fd"], ["Eclipse", 250000, "#2d3436"],
  ["Supernova", 500000, "#ff7a18"], ["Galactic", 1e6, "#4834d4"], ["Quantum", 2.5e6, "#22a6b3"], ["Paradox", 5e6, "#eb4d4b"],
  ["Void", 1e7, "#0b0b12"], ["Infinity", 2.5e7, "#f0932b"], ["Omega", 5e7, "#c0392b"], ["Transcendent", 1e8, "#f9ca24"],
  ["Abyssal", 2.5e8, "#130f40"], ["Primordial", 5e8, "#6ab04c"], ["Eternal", 1e9, "#dff9fb"], ["Singularity", 2.5e9, "#000000"],
  ["Kai", 5e9, "#ff6b5e"], ["Impossible", 1e10, "#ff00cc"], ["Forbidden", 2.5e10, "#8b0000"], ["Unreal", 5e10, "#7efff5"],
  ["Noob", 1e11, "#f5cd30"], ["The Developer's", 5e11, "#ffffff"], ["Absolute", 1e12, "#ffffff"],
].map(([name, n, color], i) => ({i, name, n, color}));

function rand(){
  // a full-precision random number, so even the one-in-a-trillion roll is fair
  try { const a = new Uint32Array(2); crypto.getRandomValues(a); return (a[0] * 2097152 + (a[1] >>> 11)) / 9007199254740992; }
  catch (e) { return Math.random(); }
}
function roll(){
  for (let i = R.length - 1; i >= 1; i--) if (rand() < 1 / R[i].n) return R[i];
  return R[0];
}
const odds = r => "1/" + r.n.toLocaleString("en");
function percent(r){
  const p = 100 / r.n;
  if (p >= 1) return (+p.toFixed(2)) + "%";
  const decimals = Math.ceil(-Math.log10(p)) + 1;
  return p.toFixed(decimals).replace(/0+$/, "") + "%";
}
// how fancy the look gets: 0 plain → 4 total chaos
const tier = r => r.i < 4 ? 0 : r.i < 10 ? 1 : r.i < 20 ? 2 : r.i < 30 ? 3 : 4;

const KEY = "rarity_v1";
function load(){ try { const j = JSON.parse(localStorage.getItem(KEY) || "null"); if (j && typeof j === "object") return {rolls: j.rolls || 0, found: j.found || {}, best: j.best ?? -1}; } catch (e) {} return {rolls: 0, found: {}, best: -1}; }
function save(s){ try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }

// the styles both pages share
const css = `
.rr-t0{} .rr-t1 .rr-name{text-shadow:0 0 14px var(--rc)}
.rr-t2{background:linear-gradient(120deg,var(--rc),#fff 50%,var(--rc)) !important;background-size:250% 250% !important;animation:rrShift 3s linear infinite}
.rr-t2 .rr-name{text-shadow:0 0 18px #fff,0 0 30px var(--rc)}
.rr-t3{background:radial-gradient(circle at 30% 20%,var(--rc),#05030f 70%) !important;color:#fff !important}
.rr-t3 .rr-name{background:linear-gradient(90deg,#ff5e5e,#ffd84a,#5effa0,#5ec8ff,#c45eff,#ff5e5e);background-size:300% 100%;-webkit-background-clip:text;background-clip:text;color:transparent !important;animation:rrShift 2.5s linear infinite}
.rr-t4{background:linear-gradient(90deg,#ff004c,#ff9900,#ffee00,#00ff6a,#00c8ff,#7a00ff,#ff004c) !important;background-size:400% 100% !important;animation:rrShift 1.6s linear infinite,rrShake .35s infinite;color:#fff !important}
.rr-t4 .rr-name{text-shadow:3px 3px 0 #000,0 0 26px #fff}
@keyframes rrShift{to{background-position:400% 0}}
@keyframes rrShake{0%,100%{transform:translate(0,0) rotate(0)}25%{transform:translate(-2px,1px) rotate(-.4deg)}75%{transform:translate(2px,-1px) rotate(.4deg)}}
.rr-stars{position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(2px 2px at 20% 30%,#fff,transparent),radial-gradient(1.5px 1.5px at 70% 60%,#fff,transparent),radial-gradient(2px 2px at 45% 80%,#fff,transparent),radial-gradient(1px 1px at 85% 20%,#fff,transparent),radial-gradient(1.5px 1.5px at 10% 75%,#fff,transparent);animation:rrTwinkle 2s ease-in-out infinite alternate}
@keyframes rrTwinkle{from{opacity:.4}to{opacity:1}}
`;
function injectCSS(){ if (document.getElementById("rr-css")) return; const st = document.createElement("style"); st.id = "rr-css"; st.textContent = css; document.head.appendChild(st); }
const textOn = hex => { const v = parseInt(hex.slice(1), 16), r = v >> 16, g = v >> 8 & 255, b = v & 255; return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? "#141414" : "#ffffff"; };

window.Rarity = {list: R, roll, odds, percent, tier, load, save, injectCSS, textOn};

// ---------- the homepage tile ----------
function homepageTile(){
  const tile = document.getElementById("rarityTile");
  if (!tile) return;
  injectCSS();
  const r = roll();
  const s = load();
  s.rolls++; s.found[r.i] = (s.found[r.i] || 0) + 1; if (r.i > s.best) s.best = r.i;
  save(s);
  const t = tier(r);
  tile.href = "rarity.html#r=" + r.i + "&roll=" + s.rolls;
  tile.classList.add("rr-t" + t);
  tile.style.setProperty("--rc", r.color);
  tile.style.background = r.color;
  tile.style.color = t >= 3 ? "#fff" : textOn(r.color);
  tile.setAttribute("aria-label", odds(r) + " " + r.name + ". Click to see your roll");
  tile.innerHTML = (t >= 3 ? '<span class="rr-stars"></span>' : "") +
    `<span style="position:relative;display:block;text-align:center;font-family:'Comic Sans MS','Trebuchet MS',sans-serif;font-weight:900;line-height:1">
       <span style="display:block;font-size:${r.n >= 1e9 ? 34 : r.n >= 1e6 ? 42 : 58}px;letter-spacing:-1px">${odds(r)}</span>
       <span class="rr-name" style="display:block;font-size:40px;margin-top:8px">${r.name}</span>
       <span style="display:block;font-size:13px;font-family:'Trebuchet MS',sans-serif;font-weight:800;margin-top:12px;opacity:.75">roll #${s.rolls.toLocaleString("en")} · reload to roll again</span>
     </span>`;
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", homepageTile); else homepageTile();
})();
