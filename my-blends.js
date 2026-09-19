// ═══════════════════════════════════════════════════════════════════
// 6 things I made in Blender  —  a mod for Sandboxels
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
  { n:"Watermelon", c:"#ff6b6b", s:"goo", t:["fruit","sweet","watery"] },
  { n:"Watermelon-Watermelon Smoothie", c:"#ff6b6b", s:"goo", t:["fruit","sweet","watery","smoothie"] },
  { n:"Pineapple", c:"#fcc419", s:"goo", t:["fruit","sour","tropical"] },
  { n:"Lemon", c:"#ffe066", s:"goo", t:["fruit","citrus","sour"] },
  { n:"Pineapple-Lemon Smoothie", c:"#fed240", s:"goo", t:["fruit","sour","tropical","citrus","sweet","smoothie"] },
  { n:"Lime", c:"#a9e34b", s:"goo", t:["fruit","citrus","sour"] },
  { n:"Lime-Pineapple-Lemon Smoothie", c:"#d4db46", s:"goo", t:["fruit","citrus","sour","tropical","sweet","smoothie"] },
  { n:"Gum", c:"#ff8fab", s:"goo", t:["odd","sticky","bouncy"] },
  { n:"Gum Lime Blend", c:"#e7b973", s:"goo", t:["odd","sticky","bouncy","fruit","citrus","sour"] },
  { n:"Ice", c:"#d0ebff", s:"solid", t:["frozen","cold","water"] },
  { n:"Gum Lime Blend Sorbet", c:"#edcb96", s:"goo", t:["odd","sticky","bouncy","fruit","citrus","sour"] },
  { n:"Lemon-Pineapple Smoothie", c:"#fed240", s:"goo", t:["fruit","citrus","sour","tropical","sweet","smoothie"] }
];
var PAIRS=[
  ["watermelon","watermelon","watermelon_watermelon_smoothie"],
  ["pineapple","lemon","pineapple_lemon_smoothie"],
  ["lime","pineapple_lemon_smoothie","lime_pineapple_lemon_smoothie"],
  ["gum","lime_pineapple_lemon_smoothie","gum_lime_blend"],
  ["ice","gum_lime_blend","gum_lime_blend_sorbet"],
  ["lemon","pineapple","lemon_pineapple_smoothie"]
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
