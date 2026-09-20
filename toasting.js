"use strict";
/* ============================================================
   A SIMPLE GAME ABOUT TOASTING — v2 "the expansion"
   20 generators · ~100 tiered specials · 36-node research tree
   71 badges (+butter) · golden toast ×4 effects · THE BURNING
   crumb prestige + crumb shop · buffs · export/import · an ending
   ============================================================ */
var SHARE_URL="kaifun.fun/toasting.html";
var $=function(id){ return document.getElementById(id); };

/* ---------------- balance ---------------- */
var BAL={
  costGrowth:1.15, paceMult:2.2,
  crumbDiv:4e7, crumbBase:0.10,
  offlineRate:0.5, offlineCapH:8,
  goldenMin:50, goldenMax:100,
  smolderSiphon:0.06, smolderMax:4,
  sunCost:1e24
};
/* ---------------- numbers ---------------- */
var SUF=["","k","M","B","T","Qa","Qi","Sx","Sp","Oc","No","Dc"];
function fmt(n){
  if(n<0) return "-"+fmt(-n);
  if(!isFinite(n)) return "∞";
  if(n<1000) return (n<10&&n%1!==0)? n.toFixed(1) : Math.floor(n)+"";
  var p=Math.floor(Math.log10(n)/3);
  if(p>=SUF.length) return n.toExponential(2).replace("e+","e");
  return (n/Math.pow(10,p*3)).toFixed(n/Math.pow(10,p*3)<100?1:0)+SUF[p];
}

var GENS=[
 {id:"t1", ic:"🍞", nm:"Toaster",                cost:15,     tps:0.1,   quip:"two slots. infinite dreams.",
  tiers:["heavier lever","chrome finish","double-wide slots","bagel mode (forbidden)","toaster rights"]},
 {id:"t2", ic:"🔥", nm:"Toaster Oven",            cost:100,    tps:1,     quip:"it also does bagels. we don't.",
  tiers:["cleaner glass","convection fans","broil button bravery","self-cleaning ritual","oven mitts of power"]},
 {id:"t3", ic:"🦎", nm:"Salamander Grill",        cost:1.1e3,  tps:8,     quip:"chef term. mostly.",
  tiers:["hotter salamander","actual salamander","salamander union","overhead flame array","mythic broiler"]},
 {id:"t4", ic:"🏭", nm:"Conveyor Line",           cost:1.2e4,  tps:47,    quip:"the bread doesn't stop. it can't.",
  tiers:["greased belts","two-lane bread","rush hour scheduling","hypnotic rotation","möbius conveyor"]},
 {id:"t5", ic:"🚚", nm:"Toast Food Truck",        cost:1.3e5,  tps:260,   quip:"follow the smell.",
  tiers:["louder horn","festival permits","secret menu","food court diplomacy","a fleet, actually"]},
 {id:"t6", ic:"🏗", nm:"Toast Factory",           cost:1.4e6,  tps:1.4e3, quip:"OSHA has questions.",
  tiers:["night shift","ISO 9000 (toast)","vertical ovens","steam whistle morale","factory within a factory"]},
 {id:"t7", ic:"🛸", nm:"Bread Drone Swarm",       cost:2e7,    tps:7.8e3, quip:"they find bread. no one asked.",
  tiers:["quieter rotors","bread radar","swarm choreography","robot carrier pigeons","air superiority"]},
 {id:"t8", ic:"🌋", nm:"Volcano Griddle",         cost:3.3e8,  tps:4.4e4, quip:"geothermally crispy.",
  tiers:["deeper magma tap","obsidian plates","sacrificial croutons","tectonic seasoning","tame the caldera"]},
 {id:"t9", ic:"⛈", nm:"Weather Control Crisper", cost:5.1e9,  tps:2.6e5, quip:"100% chance of crunch.",
  tiers:["warmer fronts","toast-seeking lightning","el niño crisping","jetstream delivery","permanent golden hour"]},
 {id:"t10",ic:"🛰", nm:"Orbital Mirror Array",    cost:7.5e10, tps:1.6e6, quip:"borrowing the sun. it's fine.",
  tiers:["polished mirrors","tighter focus","sun-tracking gimbals","orbital butter tank","a gentle laser"]},
 {id:"t11",ic:"🌍", nm:"Tectonic Toast Plate",    cost:1e12,   tps:1e7,   quip:"the continent is a griddle now.",
  tiers:["plate lubricant","drift scheduling","ring of fire pact","pangea reunion tour","mantle-fired crust"]},
 {id:"t12",ic:"🌊", nm:"Deep-Sea Vent Toastery",  cost:1.4e13, tps:6.5e7, quip:"pressure-crisped.",
  tiers:["pressure crisping","vent sommelier","abyssal sourdough","kraken labor deal","bioluminescent butter"]},
 {id:"t13",ic:"🧬", nm:"Cloned Bakery Dimension", cost:1.7e14, tps:4.3e8, quip:"legally distinct bakeries.",
  tiers:["better clones","clone breakfast rights","recursive bakeries","mirror flour","infinite yeast clause"]},
 {id:"t14",ic:"⏰", nm:"Toast Time Loop",         cost:2.1e15, tps:2.9e9, quip:"yesterday's toast, today.",
  tiers:["tighter loops","retroactive breakfast","paradox insurance","déjà brew","breakfast eternal"]},
 {id:"t15",ic:"🌀", nm:"Dyson Crumb Swarm",       cost:2.6e16, tps:2.1e10,quip:"the swarm hungers for crust.",
  tiers:["denser swarm","crumb magnetism","stellar sweep patterns","heliocrust harvest","swarm sentience (mild)"]},
 {id:"t16",ic:"🗿", nm:"Ancestral Sourdough Titan",cost:3.1e17,tps:1.5e11,quip:"the starter is older than us.",
  tiers:["feed the starter","ancient hydration","titan stretch & fold","million-year ferment","the mother awakens"]},
 {id:"t17",ic:"⚛️", nm:"Quantum Crouton Foam",    cost:3.7e18, tps:1.1e12,quip:"crunchy at the planck scale.",
  tiers:["colder foam","superposition seasoning","entangled slices","observer-friendly crunch","planck-scale crisp"]},
 {id:"t18",ic:"👁", nm:"The Yeast Beyond",        cost:4.3e19, tps:8.3e12,quip:"it dreams of bread.",
  tiers:["listen to the yeast","non-euclidean proofing","rise beyond reason","eldritch fermentation","it wakes"]},
 {id:"t19",ic:"🕳", nm:"Bread Singularity",       cost:5.1e20, tps:6.1e13,quip:"nothing escapes. especially butter.",
  tiers:["denser bread","event horizon crust","hawking crumbs","spaghettified baguettes","beyond the crust horizon"]},
 {id:"t20",ic:"☀️", nm:"The Final Toaster",       cost:6e21,   tps:4.5e14,quip:"room for exactly one slice. a big one.",
  tiers:["warm it up","industrial lever","sun-rated coils","cosmic crumb tray","two minutes on medium"]}
];
var TIER_AT=[5,25,50,100,150], TIER_COSTX=[12,90,700,6000,50000], TIER_MULT=[2,2,2,2,3];

/* ---------------- research tree ---------------- */
var NODES=[
 {id:"r0", x:470,y:44,  nm:"sliced bread",     fx:"+1 base per click",              cost:100,  req:[]},
 /* HEAT */
 {id:"h1", x:160,y:120, nm:"hotter coils",       fx:"clicking ×2",                  cost:500,  req:["r0"]},
 {id:"h2", x:120,y:200, nm:"quartz elements",    fx:"clicking ×3",                  cost:5e3,  req:["h1"]},
 {id:"h3", x:100,y:280, nm:"finger insurance",   fx:"each click +2% of tps",        cost:5e4,  req:["h2"]},
 {id:"h4", x:100,y:360, nm:"plasma filaments",   fx:"clicking ×5",                  cost:1e6,  req:["h3"]},
 {id:"h5", x:110,y:440, nm:"handheld sun",       fx:"each click +10% of tps",       cost:5e7,  req:["h4"]},
 {id:"h6", x:130,y:520, nm:"left hand of crisp", fx:"clicking ×10",                 cost:2e9,  req:["h5"]},
 {id:"h7", x:160,y:600, nm:"the pressing thumb", fx:"each click +25% of tps",       cost:1e12, req:["h6"]},
 {id:"h8", x:220,y:672, nm:"digitus solaris",    fx:"clicking ×20",                 cost:1e15, req:["h7"]},
 /* AUTOMATION */
 {id:"a1", x:340,y:120, nm:"longer cords",       fx:"Toasters ×2",                  cost:2e3,  req:["r0"]},
 {id:"a2", x:330,y:200, nm:"breakroom espresso", fx:"first four toasters ×2",       cost:2.5e4,req:["a1"]},
 {id:"a3", x:325,y:280, nm:"union negotiations", fx:"all toasters ×1.5",            cost:3e5,  req:["a2"]},
 {id:"a4", x:325,y:360, nm:"vertical integration",fx:"all toasters ×2",             cost:5e6,  req:["a3"]},
 {id:"a5", x:330,y:440, nm:"self-replicating toasters", fx:"Toasters ×8",           cost:1e8,  req:["a4"]},
 {id:"a6", x:340,y:520, nm:"logistics singularity", fx:"all toasters ×2",           cost:5e9,  req:["a5"]},
 {id:"a7", x:355,y:600, nm:"planetary supply web",fx:"toasters 11–15 ×3",           cost:5e12, req:["a6"]},
 {id:"a8", x:390,y:672, nm:"the great automation",fx:"all toasters ×2.5",           cost:5e15, req:["a7"]},
 /* SCIENCE */
 {id:"s1", x:610,y:120, nm:"crumb studies",      fx:"unlock golden toast",          cost:1e4,  req:["r0"]},
 {id:"s2", x:640,y:200, nm:"golden wheat",       fx:"golden toast: 2× more, better",cost:1e5,  req:["s1"]},
 {id:"s3", x:660,y:280, nm:"scrape theory",      fx:"unlock SCRAPING (prestige)",   cost:5e5,  req:["s2"]},
 {id:"s4", x:665,y:360, nm:"butter science",     fx:"badges give +2% each (was 1%)",cost:5e6,  req:["s3"]},
 {id:"s5", x:660,y:440, nm:"crumb compounding",  fx:"crumbs give +15% each",        cost:1e8,  req:["s4"]},
 {id:"s6", x:645,y:520, nm:"bread rights",       fx:"+25% everything. ticker wakes.",cost:1e9, req:["s5"]},
 {id:"s7", x:625,y:600, nm:"golden chains",      fx:"golden toast can chain",       cost:1e11, req:["s6"]},
 {id:"s8", x:560,y:672, nm:"heat death acceptance",fx:"all ×(1+½ per scrape)",      cost:1e15, req:["s7"]},
 /* THE CRUST (burning) */
 {id:"k1", x:830,y:250, nm:"leave it in longer", fx:"+15% all. THE BURNING begins.",cost:1e7,  req:["s2"], crust:true},
 {id:"k2", x:855,y:330, nm:"embrace the char",   fx:"smolders pop for ×1.8",        cost:1e8,  req:["k1"], crust:true},
 {id:"k3", x:865,y:410, nm:"controlled burn",    fx:"+2 smolders, gentler siphon",  cost:1e10, req:["k2"], crust:true},
 {id:"k4", x:860,y:490, nm:"ash economy",        fx:"+1% all per smolder popped (max 50%)",cost:1e12,req:["k3"],crust:true},
 {id:"k5", x:840,y:570, nm:"the crust speaks",   fx:"+10% all. ticker burns.",      cost:5e12, req:["k4"], crust:true},
 {id:"k6", x:800,y:645, nm:"sacred butter",      fx:"end THE BURNING. keep its gifts.",cost:1e14,req:["k5"],crust:true},
 /* crumb nodes */
 {id:"c1", x:900,y:120, nm:"ancestral crumbs",   fx:"scrapes start with 1k toast, 5 Toasters", cost:15, crumb:true, req:["s3"]},
 {id:"c2", x:920,y:190, nm:"crumb engine",       fx:"+0.5% more per crumb",         cost:40, crumb:true, req:["c1"]},
 {id:"c3", x:930,y:690, nm:"crumb bank",         fx:"keep 5% of toast through scrapes",cost:90, crumb:true, req:["c2"]},
 {id:"c4", x:900,y:760, nm:"eternal breakfast",  fx:"offline toasting at 100%",     cost:150, crumb:true, req:["c3"]},
 /* apex */
 {id:"sun",x:470,y:760, nm:"TOAST THE SUN",      fx:"end this.",                    cost:BAL.sunCost, req:["h8","a8","s8"], apex:true, needGen:"t20"}
];

/* ---------------- badges (achievements) ---------------- */
var ACH=[];
(function(){
  function add(id,nm,ds,test){ ACH.push({id:id,nm:nm,ds:ds,test:test}); }
  var TOT=[[100,"a toast"],[1e4,"toast enthusiast"],[1e6,"toast professional"],[1e8,"toast tycoon"],
    [1e10,"toast baron"],[1e12,"toast magnate"],[1e14,"toast emperor"],[1e16,"post-toast economy"],
    [1e18,"toast singularity"],[1e20,"universally toasted"],[1e22,"the crumbs remember"],[1e24,"why are you still counting"]];
  TOT.forEach(function(t,i){ add("tot"+i, t[1], fmt(t[0])+" toast, all time", function(G){return G.total>=t[0];}); });
  var TPS=[[1,"warm"],[100,"toasty"],[1e4,"industrial breakfast"],[1e6,"city-scale crunch"],
    [1e8,"weather of crumbs"],[1e10,"planetary griddle"],[1e12,"stellar output"],[1e14,"the numbers mean nothing"]];
  TPS.forEach(function(t,i){ add("tps"+i, t[1], fmt(t[0])+" toast per second", function(G,D){return D.tps>=t[0];}); });
  var CLK=[[100,"clicker"],[1000,"dedicated clicker"],[5e3,"carpal courage"],[2.5e4,"the finger"],
    [1e5,"a thousand mornings"],[5e5,"stop clicking (affectionate)"]];
  CLK.forEach(function(t,i){ add("clk"+i, t[1], fmt(t[0])+" clicks", function(G){return G.clicks>=t[0];}); });
  var BLD=[[10,"landlord of toast"],[50,"toast district"],[100,"toast city"],[200,"toast nation"],
    [300,"toast continent"],[400,"toast planet"],[500,"zoning violation"]];
  BLD.forEach(function(t,i){ add("bld"+i, t[1], t[0]+" toasters owned", function(G){
    var n=0; for(var k in G.gens) n+=G.gens[k]; return n>=t[0]; }); });
  GENS.forEach(function(g){ add("own_"+g.id, "first "+g.nm, "own a "+g.nm, function(G){return (G.gens[g.id]||0)>=1;}); });
  var GLD=[[1,"lucky"],[7,"golden hour"],[27,"golden week"],[77,"seventy-seven"],[177,"gilded"]];
  GLD.forEach(function(t,i){ add("gld"+i, t[1], t[0]+" golden toast caught", function(G){return G.golden>=t[0];}); });
  var SCR=[[1,"scraped"],[3,"serial scraper"],[7,"ash collector"],[15,"nothing left but crumbs"]];
  SCR.forEach(function(t,i){ add("scr"+i, t[1], t[0]+" scrapes", function(G){return G.scrapes>=t[0];}); });
  var SMO=[[1,"fire fighter"],[10,"smoke eater"],[50,"char broker"]];
  SMO.forEach(function(t,i){ add("smo"+i, t[1], "pop "+t[0]+" smolders", function(G){return G.smoldersPopped>=t[0];}); });
  add("mute","silence in the kitchen","mute the game once", function(G){return G.didMute;});
  add("exp","backup breakfast","export your save", function(G){return G.didExport;});
  add("b10","bulk shopper","use BUY ×10", function(G){return G.didBuy10;});
  add("t30","regular","play for 30 minutes", function(G){return (G.playMs+(Date.now()-G.start))>=1.8e6;});
  add("owl","3am toast","toast between 3 and 5 am", function(G){var h=new Date().getHours(); return h>=3&&h<5;});
  add("fin","you did it. you monster.","toast the sun", function(G){return G.sunToasted;});
})();

/* ---------------- crumb shop ---------------- */
var CSHOP=[
 {id:"cs1", nm:"warm start",        fx:"begin scrapes with 1 of each of the first 5 toasters", cost:8},
 {id:"cs2", nm:"buttered fingers",  fx:"clicking ×2 (permanent)",                              cost:12},
 {id:"cs3", nm:"family recipe",     fx:"all toasting +10%",                                    cost:20},
 {id:"cs4", nm:"golden crumbs",     fx:"golden toast rewards ×1.5",                            cost:30},
 {id:"cs5", nm:"industrial scraper",fx:"all toasting +15%",                                    cost:55},
 {id:"cs6", nm:"crumb insurance",   fx:"offline toasting rate 75%",                            cost:70},
 {id:"cs7", nm:"heirloom starter",  fx:"first ten toasters ×2",                                cost:100},
 {id:"cs8", nm:"the good butter",   fx:"badge butter ×1.5",                                    cost:140},
 {id:"cs9", nm:"ash to ash",        fx:"smolders eat 2% less",                                 cost:180},
 {id:"cs10",nm:"breakfast forever", fx:"all toasting +25%",                                    cost:260}
];

/* ---------------- ticker ---------------- */
var TICKER=[
 [0,"local person enjoys slice of toast. more at 11."],
 [0,"scientists confirm: toast is bread, but better."],
 [0,"today's special: toast. tomorrow's special: toast."],
 [50,"neighbor asks if you smell burning. you do not answer."],
 [50,"a crow has been watching you toast. respectfully."],
 [500,"toast futures up 4%."],
 [500,"your toaster hums a little tune. probably fine."],
 [5e3,"area declared 'toast district' by city council."],
 [5e3,"birds now bring you bread. word is out."],
 [5e4,"toast futures up 400%."],
 [5e4,"the smell has reached the next town. they're into it."],
 [5e5,"jam producers announce 'we are ready.'"],
 [1e6,"breaking: wheat now the global reserve currency."],
 [1e6,"a cult has formed. they seem nice. they brought butter."],
 [1e7,"the ocean is noticeably warmer. no one connects the dots."],
 [1e7,"your food truck was seen on three continents today."],
 [1e8,"the moon appears slightly browned on one side."],
 [1e8,"world jam reserves mobilized. 'it's time,' officials say."],
 [1e9,"UN holds emergency session about 'the crisping'."],
 [1e9,"drones spotted carrying a baguette 'somewhere important'."],
 [1e10,"astronomers report the sun looks nervous."],
 [1e10,"your toasters have unionized. production somehow up."],
 [1e11,"philosophers ask if anything was ever NOT toast."],
 [1e11,"volcanoes reclassified as 'municipal griddles'."],
 [1e12,"the sun has hired a lawyer."],
 [1e12,"tectonic plates now legally griddles."],
 [1e13,"deep-sea creatures report 'a pleasant warmth'."],
 [1e13,"time travelers arrive. they ask for toast."],
 [1e14,"clone bakeries demand clone weekends."],
 [1e14,"the yeast has opinions now."],
 [1e15,"yesterday's toast arrived today, again."],
 [1e16,"the crumb swarm blots out a small, polite amount of sky."],
 [1e17,"the sourdough titan turned in its sleep. crumbs everywhere."],
 [1e18,"physicists find toast at the bottom of the equations."],
 [1e19,"the yeast beyond sends a card. it just says 'soon'."],
 [1e20,"light entering the singularity comes out toasted."],
 [1e21,"the sun's lawyer has quit."],
 [1e22,"everything is warm. everything has always been warm."],
 [1e23,"the final toaster clears its throat."]
];
var SENTIENT=["hello.","i am the ticker.","i have watched you toast.","it's beautiful, in a way.","the sun knows.","finish it."];
var BURNT=["the crust whispers.","something is smoldering. it sounds pleased.","the char remembers being bread.",
 "smoke signals detected. they spell 'more'.","the burning is not angry. the burning is hungry.","scrape us, it says. scrape us all."];

/* ================================================================
   ENGINE
   ================================================================ */
function fresh(){ return {
  toast:0, total:0, totalRun:0, clicks:0, crumbs:0, scrapes:0, golden:0,
  gens:{}, nodes:{}, specs:{}, cshop:{}, ach:{},
  smolders:[], smoldersPopped:0, burning:false,
  start:Date.now(), saveT:Date.now(), playMs:0,
  muted:false, buy10:false, didMute:false, didExport:false, didBuy10:false,
  sunToasted:false
};}
var G=fresh();
var D={tps:0, rawTps:0, clickVal:0, buffs:[]};
var needPaint=false;

function has(id){ return !!G.nodes[id]; }
function spec(id){ return !!G.specs[id]; }
function cshopHas(id){ return !!G.cshop[id]; }
function achCount(){ var n=0; for(var k in G.ach) n++; return n; }
function genCount(id){ return G.gens[id]||0; }
function totalBuildings(){ var n=0; for(var k in G.gens) n+=G.gens[k]; return n; }
function genCost(g,n){ var c=genCount(g.id), t=0;
  for(var i=0;i<(n||1);i++) t+=g.cost*Math.pow(BAL.costGrowth,c+i); return t; }

function genMult(id){
  var gi=GENS.findIndex(function(x){return x.id===id;});
  var m=Math.pow(2, Math.floor(genCount(id)/25)); if(!isFinite(m)) m=1e300;
  for(var j=0;j<5;j++) if(spec("ug_"+id+"_"+j)) m*=TIER_MULT[j];
  if(id==="t1"){ if(has("a1"))m*=2; if(has("a5"))m*=8; }
  if(gi<4 && has("a2")) m*=2;
  if(gi>=10&&gi<=14 && has("a7")) m*=3;
  if(gi<10 && cshopHas("cs7")) m*=2;
  if(has("a3"))m*=1.5; if(has("a4"))m*=2; if(has("a6"))m*=2; if(has("a8"))m*=2.5;
  return m;
}
function butterMult(){
  var per=(has("s4")?0.02:0.01)*(cshopHas("cs8")?1.5:1);
  return 1+achCount()*per;
}
function crumbEff(){ return G.crumbs/(1+G.crumbs/400); }   // saturates: runaway-proof
function globalMult(){
  var per=BAL.crumbBase+(has("s5")?0.05:0)+(has("c2")?0.005:0);
  var m=(1+crumbEff()*per);
  m*=butterMult();
  if(has("s6")) m*=1.25;
  if(has("s8")) m*=Math.min(8, 1+0.5*G.scrapes);
  if(has("k1")) m*=1.15;
  if(has("k5")) m*=1.10;
  if(has("k4")) m*=(1+Math.min(0.5,G.smoldersPopped*0.01));
  if(cshopHas("cs3")) m*=1.10;
  if(cshopHas("cs5")) m*=1.15;
  if(cshopHas("cs10")) m*=1.25;
  D.buffs.forEach(function(b){ if(b.mult) m*=b.mult; });
  return m;
}
function smolderSiphonRate(){
  var s=BAL.smolderSiphon;
  if(has("k3")) s-=0.02;
  if(cshopHas("cs9")) s-=0.02;
  return Math.max(0.01,s);
}
function recompute(){
  var raw=0;
  GENS.forEach(function(g){ raw+=genCount(g.id)*g.tps*genMult(g.id); });
  raw*=BAL.paceMult*globalMult();
  D.rawTps=raw;
  var siphon=G.burning? G.smolders.length*smolderSiphonRate() : 0;
  D.tps=raw*Math.max(0,1-siphon);
  var base=1+(has("r0")?1:0), mult=1;
  if(has("h1"))mult*=2; if(has("h2"))mult*=3; if(has("h4"))mult*=5; if(has("h6"))mult*=10; if(has("h8"))mult*=20;
  if(cshopHas("cs2"))mult*=2;
  var share=(has("h3")?0.02:0)+(has("h5")?0.10:0)+(has("h7")?0.25:0);
  var cbuff=1; D.buffs.forEach(function(b){ if(b.click) cbuff*=b.click; });
  D.clickVal=(base*mult*globalMult()+D.tps*share)*cbuff;
}

/* ---------------- actions ---------------- */
function addToast(n){ G.toast+=n; G.total+=n; G.totalRun+=n; }
function clickToast(ev){
  G.clicks++; addToast(D.clickVal); sfx.pop();
  if(ev&&ev.clientX) crumbFly(ev.clientX,ev.clientY);
  paintCount();
}
function buyGen(id,n){
  var g=GENS.find(function(x){return x.id===id;}); n=n||1;
  var c=genCost(g,n);
  if(G.toast<c) return false;
  G.toast-=c; G.gens[id]=genCount(id)+n;
  if(n>=10) G.didBuy10=true;
  recompute(); needPaint=true; paintCount(); sfx.buy(); return true;
}
function specDef(id){ // "ug_t3_2"
  var p=id.split("_"), g=GENS.find(function(x){return x.id===p[1];}), j=+p[2];
  return {g:g, j:j, nm:g.tiers[j], cost:g.cost*TIER_COSTX[j], need:TIER_AT[j]};
}
function buySpec(id){
  if(spec(id)) return false;
  var d=specDef(id);
  if(genCount(d.g.id)<d.need || G.toast<d.cost) return false;
  G.toast-=d.cost; G.specs[id]=true;
  recompute(); needPaint=true; paintCount(); sfx.node(); return true;
}
function buyNode(id){
  var nd=NODES.find(function(x){return x.id===id;});
  if(has(id)||!nd.req.every(has)) return false;
  if(nd.needGen && genCount(nd.needGen)<1) return false;
  if(nd.crumb){ if(G.crumbs<nd.cost) return false; G.crumbs-=nd.cost; }
  else { if(G.toast<nd.cost) return false; G.toast-=nd.cost; }
  G.nodes[id]=true;
  if(id==="s3") $("tabScrape").style.display="inline-block";
  if(id==="k1"){ G.burning=true; document.body.classList.add("burning"); msg("something changes in the kitchen."); }
  if(id==="k6"){ G.burning=false; G.smolders=[]; document.body.classList.remove("burning"); msg("the burning ends. its gifts remain."); }
  if(id==="sun"){ endGame(); return true; }
  recompute(); needPaint=true; paintCount(); sfx.node(); return true;
}
function buyCshop(id){
  var it=CSHOP.find(function(x){return x.id===id;});
  if(cshopHas(id)||G.crumbs<it.cost) return false;
  G.crumbs-=it.cost; G.cshop[id]=true;
  recompute(); needPaint=true; paintCount(); sfx.node(); return true;
}
function crumbsFor(total){          // log-scale: crumbs come from ERAS of toast,
  if(total<1e7) return 0;           // so the count stays human even at 1e24+
  var l=Math.log10(total)-7;
  return Math.floor(3*l*l);
}
function pendingCrumbs(){
  return Math.max(0, crumbsFor(G.total)-G.crumbs);
}
function doScrape(){
  if(!has("s3")||pendingCrumbs()<1) return false;
  var gain=pendingCrumbs(), keep=has("c3")? G.toast*0.05:0;
  G.crumbs+=gain; G.scrapes++;
  G.toast=keep; G.totalRun=0; G.gens={}; G.smolders=[];
  if(has("c1")){ G.toast+=1000; G.gens.t1=5; }
  if(cshopHas("cs1")) ["t1","t2","t3","t4","t5"].forEach(function(id){ G.gens[id]=(G.gens[id]||0)+1; });
  recompute(); needPaint=true; paintCount(); sfx.scrape();
  msg("scraped. +"+gain+" crumbs. the pan is clean.");
  return true;
}

/* ---------------- buffs ---------------- */
function addBuff(nm,opts){
  D.buffs=D.buffs.filter(function(b){return b.nm!==nm;});
  D.buffs.push({nm:nm, mult:opts.mult, click:opts.click, t:opts.t});
  recompute(); paintBuffs();
}
function tickBuffs(dt){
  var n=D.buffs.length;
  D.buffs.forEach(function(b){ b.t-=dt; });
  D.buffs=D.buffs.filter(function(b){return b.t>0;});
  if(D.buffs.length!==n){ recompute(); }
  paintBuffs();
}
function paintBuffs(){
  var h="";
  D.buffs.forEach(function(b){ h+='<span class="buff">'+b.nm+" "+Math.ceil(b.t)+"s</span>"; });
  if(G.burning&&G.smolders.length) h+='<span class="buff bad">smolders −'+Math.round(G.smolders.length*smolderSiphonRate()*100)+'% 🔥</span>';
  $("buffs").innerHTML=h;
}

/* ---------------- golden toast ---------------- */
var goldNext=0;
function scheduleGolden(now,quick){
  var min=BAL.goldenMin, max=BAL.goldenMax;
  if(has("s2")){ min/=2; max/=2; }
  if(quick){ min=2; max=4; }
  goldNext=now+(min+Math.random()*(max-min))*1000;
}
function maybeGolden(now){
  if(!has("s1")) return;
  if(!goldNext) scheduleGolden(now);
  if(now>=goldNext && $("golden").style.display!=="block"){
    var g=$("golden");
    g.style.left=(10+Math.random()*(innerWidth-80))+"px";
    g.style.top=(90+Math.random()*(innerHeight-240))+"px";
    g.style.display="block";
    setTimeout(function(){ if(g.style.display==="block"){ g.style.display="none"; scheduleGolden(performance.now()); } },9000);
  }
}
function goldenReward(){
  G.golden++;
  var pow=(has("s2")?2:1)*(cshopHas("cs4")?1.5:1);
  var roll=Math.random();
  if(roll<0.42){
    var gain=Math.max(D.clickVal*150, D.tps*60)*pow;
    addToast(gain); msg("lucky! +"+fmt(gain)+" toast");
  } else if(roll<0.78){
    addBuff("FRENZY ×7",{mult:7*(pow>1?1.3:1), t:30}); msg("frenzy! toasting ×7 for 30s"); 
  } else if(roll<0.93){
    addBuff("CLICK ×77",{click:77, t:13}); msg("CLICK FRENZY ×77 — go go go");
  } else {
    addBuff("BUTTER SURGE",{mult:1+achCount()*0.03*pow, t:25}); msg("butter surge! your badges shine");
  }
  if(has("s7")&&Math.random()<0.25){ scheduleGolden(performance.now(),true); msg("...it chains!"); }
  else scheduleGolden(performance.now());
  sfx.gold(); recompute(); needPaint=true; paintCount();
}
$("golden").addEventListener("pointerdown", function(){ this.style.display="none"; goldenReward(); });

/* ---------------- smolders (THE BURNING) ---------------- */
function smolderCap(){ return BAL.smolderMax+(has("k3")?2:0); }
function maybeSmolder(dt){
  if(!G.burning) return;
  if(G.smolders.length<smolderCap() && Math.random()<dt/45){
    G.smolders.push({eaten:0});
    recompute(); paintSmolders();
  }
  G.smolders.forEach(function(s){ s.eaten+=D.rawTps*smolderSiphonRate()*dt; });
}
function popSmolder(i){
  var s=G.smolders.splice(i,1)[0]; if(!s) return;
  G.smoldersPopped++;
  var pay=s.eaten*(has("k2")?1.8:1.2)+D.rawTps*10;
  addToast(pay); msg("smolder popped: +"+fmt(pay));
  sfx.scrape(); recompute(); needPaint=true; paintSmolders();
}
function paintSmolders(){
  var b=$("smolderbox"); b.innerHTML="";
  G.smolders.forEach(function(s,i){
    var e=document.createElement("button");
    e.className="smolder"; e.textContent="💨"; e.title="a smolder. it eats your toast. pop it.";
    e.onclick=function(){ popSmolder(i); };
    b.appendChild(e);
  });
}

/* ---------------- badges ---------------- */
var achPopQ=[];
function checkAch(){
  ACH.forEach(function(a){
    if(G.ach[a.id]) return;
    var ok=false; try{ ok=a.test(G,D); }catch(e){}
    if(ok){ G.ach[a.id]=true; achPopQ.push(a); recompute(); }
  });
  if(achPopQ.length && !checkAch.showing){
    checkAch.showing=true;
    var a=achPopQ.shift();
    $("achname").textContent=a.nm;
    $("achpop").classList.add("show"); sfx.gold();
    setTimeout(function(){ $("achpop").classList.remove("show"); checkAch.showing=false; },2600);
    paintBadges(); paintTabs();
  }
}

/* ---------------- ticker & subtitle ---------------- */
var tickIx=0, tickT=6;
function rotateTicker(dt){
  tickT+=dt; if(tickT<7) return; tickT=0;
  var pool=TICKER.filter(function(t){return G.total>=t[0];}).map(function(t){return t[1];});
  if(G.burning||has("k5")) pool=pool.concat(BURNT,BURNT);
  if(has("s6")) pool=pool.concat(SENTIENT);
  $("ticker").textContent=pool[(tickIx++)%pool.length];
}
var STAGES=[[0,"it's just toast."],[1e3,"it's still mostly just toast."],[1e6,"the toast is scaling."],
 [1e9,"this is no longer about breakfast."],[1e13,"the kitchen has opinions now."],
 [1e17,"the sun is watching nervously."],[1e21,"almost. almost."]];
function checkStage(){
  var s=STAGES[0];
  STAGES.forEach(function(x){ if(G.total>=x[0]) s=x; });
  if(G.burning) s=[0,s[1]+" and something is burning."];
  if(G.sunToasted) s=[0,"there is only toast."];
  $("subtitle").textContent=s[1];
}

/* ================================================================
   UI
   ================================================================ */
function paintCount(){
  $("orderno").textContent="ORDER #"+String(Math.min(9999,G.clicks)).padStart(4,"0");
  $("count").textContent=fmt(G.toast);
  var extra=D.buffs.filter(function(b){return b.mult;}).length? " ★":"";
  $("tpsline").textContent=fmt(D.tps)+" toast/s"+extra;
  $("clickline").textContent="+"+fmt(D.clickVal)+" per toast";
}
function paintGens(){
  var n=G.buy10?10:1;
  GENS.forEach(function(g,i){
    var el=$("gen_"+g.id), own=genCount(g.id), c=genCost(g,n);
    var visible=own>0||G.total>=g.cost*0.35;
    el.classList.toggle("hiddenGen",!visible);
    if(!visible) return;
    el.disabled=G.toast<c;
    el.querySelector(".own").textContent=own;
    el.querySelector(".cost").textContent=fmt(c);
    el.querySelector(".info").textContent=fmt(g.tps*genMult(g.id)*BAL.paceMult*globalMult())+"/s ea (\u00d72 per 25) \u00b7 "+g.quip;
  });
  // specials board: show up to 8 currently-unlockable tier upgrades
  var sp=$("specials"); sp.innerHTML="";
  var shown=0;
  GENS.forEach(function(g){
    for(var j=0;j<5;j++){
      var id="ug_"+g.id+"_"+j;
      if(spec(id)) continue;
      if(genCount(g.id)<TIER_AT[j]) break;
      if(shown>=8) return;
      shown++;
      var d=specDef(id);
      var b=document.createElement("button");
      b.className="spec"; b.disabled=G.toast<d.cost;
      b.innerHTML='<span class="snm">'+d.nm+'</span><span class="sfx">'+g.nm+" ×"+TIER_MULT[j]+'</span><span class="scs">'+fmt(d.cost)+'</span>';
      (function(id2){ b.onclick=function(){ buySpec(id2); }; })(id);
      sp.appendChild(b);
    }
  });
  if(!shown) sp.innerHTML='<span style="font-size:11px;color:var(--faded)">own more of a toaster to unlock its specials (5 / 25 / 50 / 100 / 150)</span>';
}
function paintTree(){
  NODES.forEach(function(nd){
    var el=$("nd_"+nd.id), owned=has(nd.id);
    var reqOK=nd.req.every(has)&&(!nd.needGen||genCount(nd.needGen)>=1);
    var afford=nd.crumb? G.crumbs>=nd.cost : G.toast>=nd.cost;
    el.className="node"+(nd.apex?" apex":"")+(nd.crust?" crust":"")+
      (owned?" owned":reqOK?(afford?"":" cant"):" locked");
    el.querySelector(".cs").textContent=nd.crumb? nd.cost+" 🍂":fmt(nd.cost);
    if(nd.id==="sun"&&!owned)
      el.querySelector(".fx").textContent=genCount("t20")>=1?"end this.":"requires The Final Toaster";
  });
}
function paintScrape(){
  var p=pendingCrumbs();
  $("scrapeinfo").innerHTML="scraping now: <b>+"+p+" crumbs</b> (you hold "+G.crumbs+")";
  $("scrapebtn").disabled=p<1;
  $("crumbline").style.display=(G.crumbs>0||has("s3"))?"block":"none";
  $("crumbcount").textContent=G.crumbs;
  var per=(BAL.crumbBase+(has("s5")?0.05:0)+(has("c2")?0.005:0))*100;
  $("crumbfx").textContent=G.crumbs?"(+"+Math.round(crumbEff()*per)+"%)":"";
  CSHOP.forEach(function(it){
    var el=$("cs_"+it.id);
    var got=cshopHas(it.id);
    el.className="shopitem"+(got?" done":"");
    el.disabled=got||G.crumbs<it.cost;
    el.querySelector(".scs").textContent=got?"OWNED":it.cost+" 🍂";
  });
}
function paintBadges(){
  var got=achCount();
  $("badgeN").textContent=got+"/"+ACH.length;
  $("butterexplain").textContent="each badge butters production by +"+
    ((has("s4")?2:1)*(cshopHas("cs8")?1.5:1))+"% — currently ×"+butterMult().toFixed(2);
  $("butterline").style.display=got?"block":"none";
  $("butterline").textContent="🧈 butter: ×"+butterMult().toFixed(2)+" from "+got+" badges";
  ACH.forEach(function(a){
    var el=$("ach_"+a.id);
    el.className="badge"+(G.ach[a.id]?" got":"");
    el.querySelector(".bd").textContent=G.ach[a.id]? a.ds : "???";
  });
}
function paintStats(){
  var pm=G.playMs+(Date.now()-G.start), mins=Math.floor(pm/60000), s=Math.floor(pm/1000)%60;
  function row(l,v){ return '<div class="rl"><span>'+l+'</span><span class="dots"></span><b>'+v+"</b></div>"; }
  $("statlist").innerHTML=
    row("toast, all time",fmt(G.total))+row("toast this run",fmt(G.totalRun))+
    row("toast per second",fmt(D.tps))+row("per click",fmt(D.clickVal))+
    row("clicks",fmt(G.clicks))+row("toasters owned",totalBuildings())+
    row("specials bought",Object.keys(G.specs).length)+row("research done",Object.keys(G.nodes).length+"/"+NODES.length)+
    row("badges",achCount()+"/"+ACH.length)+row("golden toast",G.golden)+
    row("smolders popped",G.smoldersPopped)+row("scrapes",G.scrapes)+
    row("crumbs",G.crumbs)+row("time in the kitchen",mins+"m "+s+"s");
}
function paintTabs(){ $("badgeN").textContent=achCount()+"/"+ACH.length; }
function paintAll(){ paintCount(); paintGens(); paintTree(); paintScrape(); paintBadges(); paintStats(); paintBuffs(); }

function build(){
  var gl=$("genlist");
  GENS.forEach(function(g){
    var b=document.createElement("button");
    b.className="gen hiddenGen"; b.id="gen_"+g.id;
    b.innerHTML='<span class="ic">'+g.ic+'</span><span><div class="nm">'+g.nm+'</div><div class="info"></div></span>'+
      '<span class="own">0</span><span class="cost"></span>';
    b.onclick=function(){ buyGen(g.id,G.buy10?10:1); };
    gl.appendChild(b);
  });
  var svg=$("treesvg"), tree=$("tree");
  NODES.forEach(function(nd){
    nd.req.forEach(function(r){
      var p=NODES.find(function(x){return x.id===r;});
      var l=document.createElementNS("http://www.w3.org/2000/svg","line");
      l.setAttribute("x1",p.x); l.setAttribute("y1",p.y);
      l.setAttribute("x2",nd.x); l.setAttribute("y2",nd.y);
      l.setAttribute("stroke","#c9bb9c"); l.setAttribute("stroke-width","3");
      l.setAttribute("stroke-dasharray","1 6"); l.setAttribute("stroke-linecap","round");
      svg.appendChild(l);
    });
  });
  NODES.forEach(function(nd){
    var b=document.createElement("button");
    b.className="node"; b.id="nd_"+nd.id;
    b.style.left=nd.x+"px"; b.style.top=nd.y+"px";
    b.innerHTML='<div class="nm">'+nd.nm+'</div><div class="fx">'+nd.fx+'</div><div class="cs"></div>';
    b.onclick=function(){ buyNode(nd.id); };
    tree.appendChild(b);
  });
  var cs=$("crumbshop");
  CSHOP.forEach(function(it){
    var b=document.createElement("button");
    b.className="shopitem"; b.id="cs_"+it.id;
    b.innerHTML='<span>'+it.nm+' <span class="sfx">— '+it.fx+'</span></span><span class="scs"></span>';
    b.onclick=function(){ buyCshop(it.id); };
    cs.appendChild(b);
  });
  var bg=$("badgegrid");
  ACH.forEach(function(a){
    var e=document.createElement("div");
    e.className="badge"; e.id="ach_"+a.id;
    e.innerHTML='<span class="bt">'+a.nm+'</span><span class="bd">???</span>';
    bg.appendChild(e);
  });
  document.querySelectorAll(".tab").forEach(function(t){
    t.onclick=function(){
      document.querySelectorAll(".tab").forEach(function(x){x.classList.remove("on");});
      document.querySelectorAll(".panel").forEach(function(x){x.classList.remove("on");});
      t.classList.add("on"); $(t.dataset.p).classList.add("on");
    };
  });
}
$("toastbtn").addEventListener("pointerdown", clickToast);
$("scrapebtn").onclick=function(){
  if(pendingCrumbs()<1) return;
  if(confirm("scrape it all? toast and toasters reset. crumbs + research + specials remain.")) doScrape();
};
$("buyamt").onclick=function(){ G.buy10=!G.buy10; this.textContent=G.buy10?"BUY ×10":"BUY ×1"; paintGens(); };
$("mutebtn").onclick=function(){ G.muted=!G.muted; G.didMute=true; this.textContent=G.muted?"SOUND: OFF":"SOUND: ON"; };
$("exportbtn").onclick=function(){
  save(); G.didExport=true;
  prompt("your save (copy it somewhere warm):", btoa(unescape(encodeURIComponent(JSON.stringify(G)))));
};
$("importbtn").onclick=function(){
  var raw=prompt("paste a save:"); if(!raw) return;
  try{
    var s=JSON.parse(decodeURIComponent(escape(atob(raw.trim()))));
    if(typeof s.toast!=="number") throw 0;
    var f=fresh(); for(var k in f) if(k in s) f[k]=s[k];
    G=f; G.start=Date.now();
    if(G.burning) document.body.classList.add("burning"); else document.body.classList.remove("burning");
    if(has("s3")) $("tabScrape").style.display="inline-block";
    recompute(); paintAll(); paintSmolders(); msg("save imported. welcome back.");
  }catch(e){ msg("that was not a save. that was just words."); }
};
$("wipebtn").onclick=function(){
  if(!confirm("burn EVERYTHING? crumbs, badges, all of it?")) return;
  if(!confirm("really? there is no toast on the other side.")) return;
  try{ localStorage.removeItem("toast_save2"); }catch(e){}
  location.reload();
};
function crumbFly(x,y){
  for(var i=0;i<4;i++){
    var c=document.createElement("div"); c.className="crumbfly";
    c.style.left=x+"px"; c.style.top=y+"px"; document.body.appendChild(c);
    (function(el,vx,vy){
      var t=0, iv=setInterval(function(){
        t+=0.05; vy+=1;
        el.style.transform="translate("+(vx*t*26)+"px,"+(vy*t*8)+"px) rotate("+(t*280)+"deg)";
        el.style.opacity=1-t;
        if(t>=1){ clearInterval(iv); el.remove(); }
      },16);
    })(c,(Math.random()-0.5)*4,-3-Math.random()*3);
  }
}

/* ---------------- ending ---------------- */
var ENDLINES=["you press the lever on The Final Toaster.","the sun goes in.","(it fits. don't worry about it.)",
 "two minutes on medium.","...","ding."];
function endGame(){
  G.sunToasted=true; checkAch(); save();
  $("ending").style.display="flex"; sfx.ending();
  var i=0;
  (function next(){
    if(i<ENDLINES.length){
      $("endline").textContent=ENDLINES[i++];
      if(i===2) $("sunface").setAttribute("fill","#d09a3a");
      if(i===4) $("sunface").setAttribute("fill","#b07a30");
      if(i===6){ $("sunface").setAttribute("fill","#8a5a2b");
        $("sunmouth").setAttribute("d","M42 60 Q50 55 58 60"); }
      setTimeout(next, i===5?2000:1900);
    } else {
      $("sunface").setAttribute("fill","#6b4522");
      $("endline").textContent="the sun: toasted.";
      var pm=G.playMs+(Date.now()-G.start), mins=Math.floor(pm/60000), s=Math.floor(pm/1000)%60;
      $("credits").style.display="block";
      $("credits").textContent=
        "a simple game about toasting\n\n"+
        "you toasted "+fmt(G.total)+" toast\n"+
        "in "+mins+"m "+s+"s · "+fmt(G.clicks)+" clicks\n"+
        achCount()+"/"+ACH.length+" badges · "+G.scrapes+" scrape"+(G.scrapes===1?"":"s")+"\n"+
        G.golden+" golden toast · "+G.smoldersPopped+" smolders\n\n"+
        "there is no post-credits scene.\nthe crumbs were inside you all along.\n\nfin";
      $("endshare").style.display="inline-block";
      $("endkeep").style.display="inline-block";
      $("endreset").style.display="inline-block";
      checkStage();
    }
  })();
}
$("endshare").onclick=function(){
  var pm=G.playMs+(Date.now()-G.start), mins=Math.floor(pm/60000);
  var t="i toasted the sun in "+mins+" minutes 🍞☀️ ("+achCount()+"/"+ACH.length+" badges)\na simple game about toasting\n"+SHARE_URL;
  (navigator.clipboard? navigator.clipboard.writeText(t):Promise.reject())
    .then(function(){ msg("copied — go tell someone"); }).catch(function(){ prompt("copy this:",t); });
};
$("endkeep").onclick=function(){ $("ending").style.display="none"; paintAll(); };
$("endreset").onclick=function(){
  if(!confirm("erase everything and be a person with one toaster again?")) return;
  try{ localStorage.removeItem("toast_save2"); }catch(e){}
  location.reload();
};

/* ---------------- save/load ---------------- */
function save(){ G.saveT=Date.now(); G.playMs+=Date.now()-G.start; G.start=Date.now();
  try{ localStorage.setItem("toast_save2", JSON.stringify(G)); }catch(e){} }
function loadSave(){
  try{
    var raw=localStorage.getItem("toast_save2"); if(!raw) return;
    var s=JSON.parse(raw); if(!s||typeof s.toast!=="number") return;
    var f=fresh(); for(var k in f) if(k in s) f[k]=s[k];
    G=f; G.start=Date.now();
    recompute();
    var away=Math.min((Date.now()-(s.saveT||Date.now()))/1000, BAL.offlineCapH*3600);
    var rate=has("c4")?1:(cshopHas("cs6")?0.75:BAL.offlineRate);
    if(away>30&&D.tps>0){
      var gain=D.tps*away*rate; addToast(gain);
      msg("while you were gone, the kitchen made "+fmt(gain)+" toast");
    }
    if(has("s3")) $("tabScrape").style.display="inline-block";
    if(G.burning) document.body.classList.add("burning");
  }catch(e){}
}
window.addEventListener("beforeunload", save);

/* ---------------- sfx ---------------- */
var sfx=(function(){
  var ac=null;
  function a(){ try{ var AC=window.AudioContext||window.webkitAudioContext;
    if(!AC||G.muted) return null; if(!ac) ac=new AC(); if(ac.state==="suspended") ac.resume(); return ac; }catch(e){ return null; } }
  function beep(f,d,type,v){ var c=a(); if(!c) return; try{
    var o=c.createOscillator(), g=c.createGain();
    o.type=type||"square"; o.frequency.value=f;
    g.gain.setValueAtTime(v||0.05,c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001,c.currentTime+d);
    o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime+d); }catch(e){} }
  return {
    pop:function(){ beep(560+Math.random()*240,0.05,"square",0.03); },
    buy:function(){ beep(330,0.07,"square",0.05); beep(500,0.09,"square",0.04); },
    node:function(){ [400,540,680].forEach(function(f,i){ setTimeout(function(){beep(f,0.1,"square",0.05);},i*70); }); },
    gold:function(){ [880,1100,1320].forEach(function(f,i){ setTimeout(function(){beep(f,0.12,"triangle",0.07);},i*60); }); },
    scrape:function(){ beep(150,0.35,"sawtooth",0.07); },
    ending:function(){ [523,494,440,392,349,330,294,262].forEach(function(f,i){ setTimeout(function(){beep(f,0.5,"triangle",0.06);},i*450); }); }
  };
})();
function msg(m){ var t=$("toast-msg"); t.textContent=m; t.classList.add("show");
  clearTimeout(msg.t); msg.t=setTimeout(function(){t.classList.remove("show");},3000); }

/* ---------------- main loop ---------------- */
function tick(dt){
  addToast(D.tps*dt);
  tickBuffs(dt);
  maybeSmolder(dt);
  rotateTicker(dt);
}
var lastTick=Date.now(), saveAcc=0, paintAcc=0, achAcc=0;
setInterval(function(){
  var now=Date.now(), dt=Math.min((now-lastTick)/1000, BAL.offlineCapH*3600); lastTick=now;
  tick(dt);
  maybeGolden(performance.now());
  saveAcc+=dt; if(saveAcc>6){ saveAcc=0; save(); }
  achAcc+=dt; if(achAcc>1.5){ achAcc=0; checkAch(); }
  paintAcc+=dt;
  paintCount(); checkStage();
  if(paintAcc>0.6||needPaint){ paintAcc=0; needPaint=false; paintGens(); paintTree(); paintScrape(); paintStats(); paintBuffs(); }
},250);

/* debug/test handle */
window.__toast={ G:function(){return G;}, D:D, tick:tick, recompute:recompute,
  buyGen:buyGen, buyNode:buyNode, buySpec:buySpec, buyCshop:buyCshop, doScrape:doScrape,
  click:function(){clickToast();}, goldenReward:goldenReward, popSmolder:popSmolder,
  pendingCrumbs:pendingCrumbs, checkAch:checkAch, achCount:achCount,
  GENS:GENS, NODES:NODES, ACH:ACH, CSHOP:CSHOP, BAL:BAL, genCost:genCost, specDef:specDef,
  TIER_AT:TIER_AT, save:save };

/* go */
build();
loadSave();
recompute();
paintAll();
paintSmolders();
checkStage();
