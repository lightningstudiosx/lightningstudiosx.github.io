// ============ KAI.FUN PUZZLE ENGINE ============
// watches the homepage smiley: gateway mood + hidden action -> opens a puzzle -> awards a mood
(function(){
const S=window.Smiledex, H=window.__smiley;
if(!S||!H) return;
const P=S.PUZZLES;
function mul32(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
// ---------- overlay ----------
const css=document.createElement("style");
css.textContent=`
#pz{position:fixed;inset:0;background:#141414ee;z-index:100;display:none;align-items:center;justify-content:center;padding:14px;}
#pz .box{background:#fff;color:#141414;border:2px solid #141414;border-radius:16px;box-shadow:6px 6px 0 #141414;padding:16px 18px;width:min(460px,96vw);text-align:center;font-family:"Trebuchet MS",system-ui,sans-serif;}
#pz h2{font-family:"Comic Sans MS","Trebuchet MS",sans-serif;font-size:22px;color:#ff8a3d;margin:0 0 4px;}
#pz .sub{font-size:12.5px;color:#666;margin:0 0 12px;line-height:1.45;}
#pz .area{margin:10px auto;}
#pz input{border:2px solid #141414;border-radius:9px;padding:9px 12px;font-family:inherit;font-size:15px;width:min(260px,80%);text-align:center;}
#pz button{border:2px solid #141414;border-radius:9px;background:#fff;font-family:inherit;font-weight:900;font-size:13px;padding:8px 14px;cursor:pointer;margin:4px;box-shadow:2px 2px 0 #141414;}
#pz button:hover{transform:translate(-1px,-1px);box-shadow:3px 3px 0 #141414;}
#pz .go{background:#f5b829;}
#pz .msg{min-height:18px;font-size:12.5px;color:#ff6b5e;font-weight:700;margin-top:6px;}
.pzgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;max-width:240px;margin:0 auto;}
.pzgrid div{aspect-ratio:1;border:2px solid #141414;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:22px;background:#fff7dc;}
.pzlights{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;max-width:200px;margin:0 auto;}
.pzlights div{aspect-ratio:1;border:2px solid #141414;border-radius:12px;cursor:pointer;opacity:.45;transition:opacity .1s;}
.pzlights div.on{opacity:1;box-shadow:0 0 0 4px #fff,0 0 18px #000;}
.pzmem{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;max-width:240px;margin:0 auto;}
.pzmem div{aspect-ratio:1;border:2px solid #141414;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:24px;background:#fff;cursor:pointer;}
.pzdial{position:relative;width:160px;height:160px;margin:0 auto;border:3px solid #141414;border-radius:50%;background:#fff;}
.pzdial .zone{position:absolute;inset:0;border-radius:50%;background:conic-gradient(transparent 0deg 300deg,#6fb85c 300deg 330deg,transparent 330deg 360deg);}
.pzdial .hand{position:absolute;left:50%;top:50%;width:4px;height:74px;background:#141414;transform-origin:2px 74px;margin:-74px 0 0 -2px;border-radius:2px;}
.pztap{width:120px;height:120px;border-radius:50%;background:#f5b829;border:3px solid #141414;margin:8px auto;cursor:pointer;user-select:none;display:flex;align-items:center;justify-content:center;font-weight:900;}
.pzcode{font-size:26px;letter-spacing:6px;font-weight:900;margin:6px 0;}
.pzbig{font-family:Georgia,serif;font-size:24px;letter-spacing:4px;font-weight:700;margin:8px 0;}
`;
document.head.appendChild(css);
const ov=document.createElement("div"); ov.id="pz";
ov.innerHTML='<div class="box"><h2 id="pzTitle"></h2><div class="sub" id="pzSub"></div><div class="area" id="pzArea"></div><div class="msg" id="pzMsg"></div><div><button id="pzLeave">leave</button></div></div>';
document.body.appendChild(ov);
const $=id=>document.getElementById(id);
let open=false, pending=null;
function show(title,sub){ $("pzTitle").textContent=title; $("pzSub").textContent=sub; $("pzArea").innerHTML=""; $("pzMsg").textContent=""; ov.style.display="flex"; open=true; }
function close(){ ov.style.display="none"; open=false; pending=null; }
$("pzLeave").onclick=close;
function inputRow(placeholder,onGo){
  const i=document.createElement("input"); i.placeholder=placeholder; i.autocomplete="off"; i.spellcheck=false;
  const b=document.createElement("button"); b.className="go"; b.textContent="answer";
  const go=()=>onGo(i.value.trim().toLowerCase().replace(/[^a-z0-9-]/g,""), i);
  b.onclick=go; i.onkeydown=e=>{ if(e.key==="Enter") go(); };
  const w=document.createElement("div"); w.append(i,b); $("pzArea").appendChild(w); setTimeout(()=>i.focus(),50);
  return i;
}
function wrong(i,msg){ $("pzMsg").textContent=msg; if(i){ i.value=""; } }
// ---------- puzzle types ----------
const T={
  grid(p,done){
    show("the grid","sixteen letters. some of them, in the right order, are the answer. type it.");
    const r=mul32(p.seed), letters=p.word.split("");
    const alpha="abcdefghijklmnopqrstuvwxyz";
    while(letters.length<16) letters.push(alpha[Math.floor(r()*26)]);
    for(let i=letters.length-1;i>0;i--){ const j=Math.floor(r()*(i+1)); [letters[i],letters[j]]=[letters[j],letters[i]]; }
    const g=document.createElement("div"); g.className="pzgrid";
    letters.forEach(l=>{ const d=document.createElement("div"); d.textContent=l.toUpperCase(); g.appendChild(d); });
    $("pzArea").appendChild(g);
    inputRow("the hidden word",(a,i)=>{ if(a===p.word) done(); else wrong(i,"the grid disagrees."); });
  },
  cipher(p,done){
    show("the shift","every letter moved the same number of steps. move them back.");
    const r=mul32(p.seed), k=3+Math.floor(r()*20);
    const enc=p.word.replace(/[a-z]/g,c=>String.fromCharCode((c.charCodeAt(0)-97+k)%26+97)).toUpperCase();
    const d=document.createElement("div"); d.className="pzbig"; d.textContent=enc; $("pzArea").appendChild(d);
    inputRow("the original word",(a,i)=>{ if(a===p.word) done(); else wrong(i,"still shifted."); });
  },
  lights(p,done){
    const r=mul32(p.seed), len=5+Math.floor(r()*4), seq=[]; for(let i=0;i<len;i++) seq.push(Math.floor(r()*4));
    show("the lights","watch the order. then repeat it. "+len+" lights.");
    const cols=["#ff6b5e","#4aa9d8","#6fb85c","#f5b829"], g=document.createElement("div"); g.className="pzlights";
    const cells=cols.map(c=>{ const d=document.createElement("div"); d.style.background=c; g.appendChild(d); return d; });
    $("pzArea").appendChild(g);
    let input=[], playing=true;
    const flash=(i,ms)=>new Promise(res=>{ cells[i].classList.add("on"); setTimeout(()=>{ cells[i].classList.remove("on"); setTimeout(res,180); },ms); });
    (async()=>{ await new Promise(r2=>setTimeout(r2,600)); for(const s of seq) await flash(s,420); playing=false; $("pzMsg").textContent="your turn."; })();
    cells.forEach((d,i)=>d.onclick=()=>{ if(playing) return; flash(i,140); input.push(i);
      if(input[input.length-1]!==seq[input.length-1]){ input=[]; $("pzMsg").textContent="wrong light. from the top."; return; }
      if(input.length===seq.length) done(); });
  },
  count(p,done){
    const EM=["\ud83d\udc38","\ud83c\udf55","\ud83c\udf19","\ud83d\udd11","\ud83c\udf4c","\ud83d\udc19"];
    const r=mul32(p.seed); let round=0;
    show("the count","sixteen things. how many of the one i ask about? two rounds.");
    function play(){
      const cells=[]; for(let i=0;i<16;i++) cells.push(EM[Math.floor(r()*EM.length)]);
      const target=cells[Math.floor(r()*16)], n=cells.filter(c=>c===target).length;
      const g=document.createElement("div"); g.className="pzmem"; $("pzArea").innerHTML=""; $("pzArea").appendChild(g);
      cells.forEach(e=>{ const d=document.createElement("div"); d.textContent=e; g.appendChild(d); });
      $("pzMsg").textContent="round "+(round+1)+"/2 \u2014 how many "+target+" ?";
      inputRow("the number",(a,i)=>{ if(+a===n){ round++; if(round>=2) done(); else play(); } else { round=0; wrong(i,"count again. from round one."); play(); } });
    }
    play();
  },
  riddle(p,done){
    const r=mul32(p.seed), a=3+Math.floor(r()*9), b=4+Math.floor(r()*9), c=10+Math.floor(r()*40), d=1+Math.floor(r()*9);
    const ans=(a*b+c)-d;
    show("the arithmetic","no calculator needed. probably.");
    const t=document.createElement("div"); t.className="pzbig"; t.style.letterSpacing="1px";
    t.textContent="( "+a+" \u00d7 "+b+" ) + "+c+" \u2212 "+d; $("pzArea").appendChild(t);
    inputRow("the number",(x,i)=>{ if(+x===ans) done(); else wrong(i,"the numbers say no."); });
  },
  memory(p,done){
    const EM=["\ud83d\udc38","\ud83c\udf55","\ud83c\udf19","\ud83d\udd11","\ud83c\udf4c","\ud83d\udc19","\ud83c\udfa9","\ud83e\udde0","\ud83d\udca1","\ud83c\udfb2","\u2744\ufe0f","\ud83c\udfaf"];
    const r=mul32(p.seed); let round=0;
    show("the memory","eight things appear, then hide. i'll ask where one was. three rounds.");
    function play(){
      const pick=[...EM].sort(()=>r()-0.5).slice(0,8);
      const g=document.createElement("div"); g.className="pzmem"; $("pzArea").innerHTML=""; $("pzArea").appendChild(g);
      const cells=pick.map(e=>{ const d=document.createElement("div"); d.textContent=e; g.appendChild(d); return d; });
      $("pzMsg").textContent="round "+(round+1)+"/3 \u2014 memorize\u2026";
      const target=Math.floor(r()*8);
      setTimeout(()=>{
        cells.forEach(d=>d.textContent="?");
        $("pzMsg").textContent="where was "+pick[target]+" ?";
        cells.forEach((d,i)=>d.onclick=()=>{ if(i===target){ round++; if(round>=3) done(); else play(); } else { $("pzMsg").textContent="no. from round one."; round=0; setTimeout(play,900); } });
      },2500);
    }
    play();
  },
  anagram(p,done){
    const r=mul32(p.seed), L=p.word.split("");
    for(let i=L.length-1;i>0;i--){ const j=Math.floor(r()*(i+1)); [L[i],L[j]]=[L[j],L[i]]; }
    show("the scramble","the letters are all here. the order isn't.");
    const d=document.createElement("div"); d.className="pzbig"; d.textContent=L.join("").toUpperCase(); $("pzArea").appendChild(d);
    inputRow("unscrambled",(a,i)=>{ if(a===p.word) done(); else wrong(i,"those letters, but not like that."); });
  },
  timing(p,done){
    show("the hand","click when the hand is in the green. three times in a row. a miss resets.");
    const dial=document.createElement("div"); dial.className="pzdial";
    dial.innerHTML='<div class="zone"></div><div class="hand"></div>'; $("pzArea").appendChild(dial);
    const hand=dial.querySelector(".hand"); let ang=0, hits=0, run=true, last=performance.now();
    const speed=200+ (p.seed%5)*40;
    (function loop(now){ if(!open||!run) return; const dt=(now-last)/1000; last=now; ang=(ang+speed*dt)%360; hand.style.transform="rotate("+ang+"deg)"; requestAnimationFrame(loop); })(performance.now());
    dial.onclick=()=>{ if(ang>=300&&ang<=330){ hits++; $("pzMsg").textContent=hits+"/3"; if(hits>=3){ run=false; done(); } } else { hits=0; $("pzMsg").textContent="missed. back to zero."; } };
  },
};
function launch(id){
  const c=P[id]; if(!c) return;
  pending=id;
  const finish=()=>{ close(); H.award(id); };
  T[c.puzzle.type](c.puzzle,finish);
}
// ---------- detection ----------
const face=H.face;
let rights=0, tbuf="";
function cur(){ return H.current().id; }
addEventListener("moodchange",()=>{ rights=0; });
face.addEventListener("contextmenu",()=>{
  rights++;
  if(open) return;
  const g=cur(), st=S.getState();
  for(const id in P){ const c=P[id]; if(c.gate===g && c.act.kind==="right" && c.act.n===rights && !st.seen[id]){ launch(id); break; } }
});
addEventListener("keydown",(e)=>{
  if(open || e.key.length!==1) return;
  tbuf=(tbuf+e.key.toLowerCase()).slice(-12);
  const g=cur(), st=S.getState();
  for(const id in P){ const c=P[id]; if(c.gate===g && c.act.kind==="type" && tbuf.endsWith(c.act.word) && !st.seen[id]){ tbuf=""; launch(id); break; } }
});
window.KaiPuzzle={isOpen:()=>open, launch};
})();
