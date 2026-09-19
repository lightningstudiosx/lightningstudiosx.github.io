// ═══════════════════════════════════════════════════════════════════
// 11 things I made in Blender  —  a mod for Sandboxels
// exported 2026-09-19 from kai.fun/blender.html
//
// INSTALL: put this file in the "mods" folder of your Sandboxels install,
// press the "Mods" button above the element picker, type this file's name
// (including .js) and refresh the page.
//
// Ingredients the game already has (water, fire, sand...) are reused rather
// than overwritten, so this plays nicely with vanilla and with other mods.
// ═══════════════════════════════════════════════════════════════════
(function(){
"use strict";
var ITEMS=[
  { n:"Coconut", c:"#f1f3f5", s:"solid", t:["fruit","tropical","fat","white"] },
  { n:"Avocado", c:"#5c940d", s:"goo", t:["fruit","fat","green"] },
  { n:"Coconut-Avocado Smoothie", c:"#a7c481", s:"goo", t:["fruit","tropical","fat","white","green","sweet"] },
  { n:"Prawn", c:"#ff8787", s:"solid", t:["protein","meat","raw","sea"] },
  { n:"Prawn Candy", c:"#dc9f85", s:"solid", t:["fruit","tropical","fat","white","green","sweet"] },
  { n:"Walnut", c:"#a67c52", s:"solid", t:["protein","nut","fat"] },
  { n:"Bacon", c:"#e8590c", s:"solid", t:["protein","meat","savoury","cooked"] },
  { n:"Bacon Walnut", c:"#c06e36", s:"solid", t:["protein","nut","fat","meat","savoury","cooked"] },
  { n:"Rice", c:"#f8f9fa", s:"powder", t:["grain","starch","white"] },
  { n:"Bacon Walnut Rice Brittle", c:"#d9ad8e", s:"solid", t:["protein","nut","fat","meat","savoury","cooked"] },
  { n:"Pasta", c:"#f7d794", s:"solid", t:["grain","starch"] },
  { n:"Pasta Bacon Blend", c:"#e7c091", s:"solid", t:["protein","nut","fat","meat","savoury","cooked"] },
  { n:"Jelly", c:"#e8384f", s:"goo", t:["sweet","wobbly"] },
  { n:"Pasta Bacon Blend Candy", c:"#e78a77", s:"solid", t:["sweet","wobbly","protein","nut","fat","meat"] },
  { n:"Fire", c:"#ff6b35", s:"gas", t:["hot","fire","energy"] },
  { n:"Pasta Fire Blend", c:"#bd6e4d", s:"goo", t:["sweet","wobbly","protein","nut","fat","meat"] },
  { n:"Caramelised Pasta Fire Blend", c:"#a65e36", s:"goo", t:["sweet","wobbly","protein","nut","fat","meat"] },
  { n:"Lava", c:"#ff4d00", s:"liquid", t:["hot","fire","molten","mineral"] },
  { n:"Caramelised Pasta Blend", c:"#a76a46", s:"goo", t:["sweet","wobbly","protein","nut","fat","meat"] },
  { n:"Rubber", c:"#495057", s:"solid", t:["odd","bouncy"] },
  { n:"Rubber Candy", c:"#6f5a50", s:"solid", t:["sweet","wobbly","protein","nut","fat","meat"] },
  { n:"Baking Powder", c:"#f8f9fa", s:"powder", t:["dry","white","riser"] },
  { n:"Baking Crumble", c:"#cfc9c7", s:"powder", t:["sweet","wobbly","protein","nut","fat","meat"] }
];
var PAIRS=[
  ["coconut","avocado","coconut_avocado_smoothie"],
  ["prawn","coconut_avocado_smoothie","prawn_candy"],
  ["walnut","bacon","bacon_walnut"],
  ["bacon_walnut","rice","bacon_walnut_rice_brittle"],
  ["pasta","bacon_walnut_rice_brittle","pasta_bacon_blend"],
  ["pasta_bacon_blend","jelly","pasta_bacon_blend_candy"],
  ["pasta_bacon_blend_candy","fire","pasta_fire_blend"],
  ["pasta_fire_blend","fire","caramelised_pasta_fire_blend"],
  ["pasta_caramelised_blend","lava","caramelised_pasta_blend"],
  ["rubber","caramelised_pasta_blend","rubber_candy"],
  ["rubber_candy","baking_powder","baking_crumble"]
];
function key(n){ return String(n).toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,""); }
function beh(s){ if(s==="gas") return behaviors.GAS; if(s==="liquid") return behaviors.LIQUID;
  if(s==="powder") return behaviors.POWDER; return (behaviors.STURDYPOWDER||behaviors.POWDER); }
function st(s){ return s==="gas"?"gas":(s==="liquid"?"liquid":"solid"); }
function dens(s){ return s==="gas"?1.2:s==="liquid"?1000:s==="goo"?1200:s==="powder"?1400:1600; }
var made=0, reused=0;
for(var i=0;i<ITEMS.length;i++){
  var it=ITEMS[i], k=key(it.n);
  if(elements[k]){ reused++; continue; }        // the game already owns this one — leave it alone
  elements[k]={ color:it.c, behavior:beh(it.s), category:"my blends", state:st(it.s), density:dens(it.s) };
  made++;
}
var wired=0;
for(var j=0;j<PAIRS.length;j++){
  var a=PAIRS[j][0], b=PAIRS[j][1], r=PAIRS[j][2];
  if(!elements[a]||!elements[b]||!elements[r]) continue;
  var rx=elements[a].reactions||{};
  if(rx[b]) continue;                            // don't clobber an existing reaction
  rx[b]={ elem1:r, elem2:null };
  elements[a].reactions=rx; wired++;
}
if(typeof console!=="undefined"&&console.log)
  console.log("[My Blends] "+made+" elements added ("+reused+" already existed), "+wired+" reactions wired.");
})();
