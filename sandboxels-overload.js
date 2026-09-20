/* ============================================================
   SANDBOXELS OVERLOAD
   a very large content pack.
   + 5 new categories: gems · chemistry · cosmic · desserts · toxic
   + ~90 new elements, ~200 new reactions & heat transitions
   + new recipes injected into existing base elements
   install: Sandboxels → Settings → Mods → add this file's URL
   ============================================================ */

(function(){
"use strict";

/* ---------- helpers ---------- */
// add a reaction onto an element only if that element exists
function react(name, other, r){
  if(!elements[name] || !elements[other]) return;
  if(!elements[name].reactions) elements[name].reactions={};
  if(elements[name].reactions[other]) return;   // never overwrite a base recipe
  elements[name].reactions[other]=r;
}
// define an element only if the name is free (never fight base game)
function def(name, props){
  if(elements[name]) return;
  elements[name]=props;
}
var UP_LIQUID=[ "M1|M1|M1", "M2|XX|M2", "XX|XX|XX" ];  // liquid that flows upward

/* ============================================================
   CATEGORY 1: GEMS — dig, smelt, sparkle
   ============================================================ */
def("ruby",{ color:["#e0115f","#c2094c","#ff2d6f"], behavior:behaviors.WALL, category:"gems",
  state:"solid", density:4000, hardness:0.9, breakInto:"gem_dust",
  tempHigh:2000, stateHigh:"molten_glass", desc:"Very hard. Very red. Very yours." });
def("sapphire",{ color:["#0f52ba","#0a3d8f","#2e6fdf"], behavior:behaviors.WALL, category:"gems",
  state:"solid", density:4000, hardness:0.9, breakInto:"gem_dust",
  tempHigh:2000, stateHigh:"molten_glass", desc:"Ruby's cooler sibling." });
def("emerald",{ color:["#50c878","#2e9e57","#6fe89b"], behavior:behaviors.WALL, category:"gems",
  state:"solid", density:2700, hardness:0.85, breakInto:"gem_dust",
  tempHigh:1800, stateHigh:"molten_glass", desc:"Green and judgmental." });
def("amethyst",{ color:["#9966cc","#7a4bb0","#b98ae0"], behavior:behaviors.WALL, category:"gems",
  state:"solid", density:2650, hardness:0.8, breakInto:"gem_dust",
  tempHigh:1700, stateHigh:"molten_glass", desc:"Purple quartz with opinions." });
def("topaz",{ color:["#ffc87c","#e8a84f","#ffe0a3"], behavior:behaviors.WALL, category:"gems",
  state:"solid", density:3500, hardness:0.85, breakInto:"gem_dust",
  tempHigh:1900, stateHigh:"molten_glass", desc:"Bottled sunset." });
def("opal",{ color:["#a8c3bc","#e8d3e8","#b8e0f0","#f0e8c8"], behavior:behaviors.WALL, category:"gems",
  state:"solid", density:2100, hardness:0.6, breakInto:"gem_dust",
  tempHigh:1600, stateHigh:"molten_glass", desc:"Every color, politely." });
def("onyx",{ color:["#20201e","#33322f","#0f0f0e"], behavior:behaviors.WALL, category:"gems",
  state:"solid", density:2700, hardness:0.85, breakInto:"gem_dust",
  tempHigh:1800, stateHigh:"molten_glass", desc:"Goth quartz." });
def("gem_dust",{ color:["#e8b8d8","#b8d8e8","#d8e8b8"], behavior:behaviors.POWDER, category:"gems",
  state:"solid", density:2600, desc:"Crushed dreams. Sparkly, though." });
def("crystal_shard",{ color:["#d8f0ff","#b0e0ff"], behavior:behaviors.POWDER, category:"gems",
  state:"solid", density:2600, tempHigh:1500, stateHigh:"molten_glass",
  desc:"Pointy. Handle with something." });
def("iron_ore",{ color:["#8a6a5a","#6f5548","#9a7a68"], behavior:behaviors.POWDER, category:"gems",
  state:"solid", density:5000, tempHigh:1538, stateHigh:"molten_iron",
  desc:"Smelt it. You know you want to." });
def("gold_ore",{ color:["#b8a04a","#8a7838","#d8c060"], behavior:behaviors.POWDER, category:"gems",
  state:"solid", density:8000, tempHigh:1064, stateHigh:"molten_gold",
  desc:"Shiny rocks, pre-shine." });
def("fools_gold",{ color:["#c8b458","#a89440"], behavior:behaviors.POWDER, category:"gems",
  state:"solid", density:5000, tempHigh:800, stateHigh:"sulfur_gas",
  desc:"Pyrite. It lies." });
if(!elements.sulfur_gas) def("sulfur_gas",{ color:"#d8d060", behavior:behaviors.GAS, category:"gases",
  state:"gas", density:2.6, desc:"Smells like a prank." });
// gem alchemy
react("gem_dust","magma",{ elem1:"crystal_shard", elem2:null, chance:0.02 });
react("gem_dust","lava",{ elem1:"crystal_shard", elem2:null, chance:0.02 });

/* ============================================================
   CATEGORY 2: CHEMISTRY — the fun kind of dangerous
   ============================================================ */
def("vinegar",{ color:["#e8d8a8","#dcd0a0"], behavior:behaviors.LIQUID, category:"chemistry",
  state:"liquid", density:1010, viscosity:1, tempHigh:100, stateHigh:"steam",
  desc:"Salad dressing / chemistry starter kit." });
def("baking_soda",{ color:["#f8f8f0","#efefe6"], behavior:behaviors.POWDER, category:"chemistry",
  state:"solid", density:2200, desc:"Meets vinegar. Chaos." });
def("fizz",{ color:["#f0f8ff","#e0f0ff"], behavior:behaviors.GAS, category:"gases",
  state:"gas", density:1.9, desc:"Enthusiastic bubbles." });
react("baking_soda","vinegar",{ elem1:"fizz", elem2:"soda_water", chance:0.6 });
def("soda_water",{ color:["#d8ecf4","#cce4f0"], behavior:behaviors.LIQUID, category:"chemistry",
  state:"liquid", density:1000, viscosity:1, tempHigh:100, stateHigh:"steam",
  desc:"Water with a personality." });
def("bleach",{ color:["#f0f4e8","#e8f0dc"], behavior:behaviors.LIQUID, category:"chemistry",
  state:"liquid", density:1100, viscosity:1.2, tempHigh:100, stateHigh:"chloramine",
  desc:"Do NOT mix with ammonia. (You're going to mix it with ammonia.)" });
def("ammonia",{ color:["#e8f0f0","#dce8e8"], behavior:behaviors.LIQUID, category:"chemistry",
  state:"liquid", density:900, viscosity:1, tempHigh:60, stateHigh:"ammonia_gas",
  desc:"Window cleaner with a dark side." });
def("ammonia_gas",{ color:"#e0ecec", behavior:behaviors.GAS, category:"gases",
  state:"gas", density:0.7, desc:"Eye-watering." });
def("chloramine",{ color:["#d0e0c8","#c4d8bc"], behavior:behaviors.GAS, category:"toxic",
  state:"gas", density:2.5, desc:"The reason the label said DO NOT MIX." });
react("bleach","ammonia",{ elem1:"chloramine", elem2:"chloramine", chance:0.7 });
react("bleach","ammonia_gas",{ elem1:"chloramine", elem2:null, chance:0.5 });
def("rubbing_alcohol",{ color:["#f0f0f8","#e8e8f4"], behavior:behaviors.LIQUID, category:"chemistry",
  state:"liquid", density:790, viscosity:1, burn:80, burnTime:120, burnInto:null,
  tempHigh:82, stateHigh:"alcohol_vapor", desc:"Evaporates. Also ignites. Pick one." });
def("alcohol_vapor",{ color:"#ececf6", behavior:behaviors.GAS, category:"gases",
  state:"gas", density:1.5, burn:95, burnTime:20, desc:"Flammable air. Great." });
def("glow_fluid",{ color:["#a0ff60","#c8ff80","#80ff40"], behavior:behaviors.LIQUID, category:"chemistry",
  state:"liquid", density:1050, viscosity:8, desc:"Cracked glowstick juice. Non-toxic. Probably." });
def("epoxy",{ color:["#e8d890","#e0d088"], behavior:behaviors.LIQUID, category:"chemistry",
  state:"liquid", density:1150, viscosity:60, tempHigh:60, stateHigh:"hard_epoxy",
  desc:"Sticky now, permanent later." });
def("hard_epoxy",{ color:["#d8c878","#d0c070"], behavior:behaviors.WALL, category:"solids",
  state:"solid", density:1200, hardness:0.7, desc:"That's not coming off." });
def("quicklime",{ color:["#f4f0e0","#eee8d4"], behavior:behaviors.POWDER, category:"chemistry",
  state:"solid", density:3300, desc:"Add water for instant regret (heat)." });
def("slaked_lime",{ color:["#f0ece0","#e8e4d4"], behavior:behaviors.POWDER, category:"chemistry",
  state:"solid", density:2200, desc:"Quicklime after its bath." });
react("quicklime","water",{ elem1:"slaked_lime", elem2:"steam", chance:0.5, temp1:200 });
def("flash_powder",{ color:["#e8e8e8","#d8d8d8"], behavior:behaviors.POWDER, category:"chemistry",
  state:"solid", density:1800, burn:100, burnTime:2, burnInto:"smoke", fireColor:"#ffffff",
  desc:"Photography, 1900s style. Loud." });
def("corrosive_salt",{ color:["#d8e8d0","#cce0c4"], behavior:behaviors.POWDER, category:"chemistry",
  state:"solid", density:2100, desc:"Salt's evil twin." });
react("corrosive_salt","water",{ elem1:null, elem2:"acid", chance:0.4 });
def("mineral_water",{ color:["#dceef4","#d0e8f0"], behavior:behaviors.LIQUID, category:"liquids",
  state:"liquid", density:1000, viscosity:1, tempHigh:100, stateHigh:"steam",
  desc:"Fancy. Tastes like rocks (compliment)." });

/* ============================================================
   CATEGORY 3: COSMIC — space delivered fresh
   ============================================================ */
def("stardust",{ color:["#fff0b0","#ffd8f0","#c8e8ff","#ffffff"], behavior:behaviors.POWDER, category:"cosmic",
  state:"solid", density:800, tempHigh:3000, stateHigh:"solar_plasma",
  desc:"Sweep up after a supernova." });
def("moon_dust",{ color:["#c8c8c4","#b4b4b0","#dcdcd8"], behavior:behaviors.POWDER, category:"cosmic",
  state:"solid", density:1500, desc:"Smells like spent gunpowder. Apparently." });
def("mars_sand",{ color:["#c1663e","#a8542f","#d47a4e"], behavior:behaviors.POWDER, category:"cosmic",
  state:"solid", density:1600, desc:"Rusty planet, rusty sand." });
def("comet_ice",{ color:["#d8f4ff","#c0ecff"], behavior:behaviors.POWDER, category:"cosmic",
  state:"solid", density:600, temp:-120, tempHigh:0, stateHigh:"water",
  desc:"Dirty snowball, interplanetary edition." });
def("solar_plasma",{ color:["#ffdc50","#ff9a2a","#fff0a0"], behavior:behaviors.GAS, category:"cosmic",
  state:"gas", density:0.2, temp:5500, desc:"A little piece of the sun. It bites." });
def("dark_matter",{ color:["#2a1a3a","#1a0f28","#3a2a4a"], behavior:UP_LIQUID, category:"cosmic",
  state:"liquid", density:-500, viscosity:5, desc:"Falls up. Physicists furious." });
def("nebula_gas",{ color:["#e080c0","#8080e0","#60c0d0","#c060e0"], behavior:behaviors.GAS, category:"cosmic",
  state:"gas", density:0.1, desc:"Space's screensaver." });
def("void_salt",{ color:["#483858","#382a48"], behavior:behaviors.POWDER, category:"cosmic",
  state:"solid", density:2400, desc:"Seasoning from nowhere." });
def("meteor_dust",{ color:["#7a6a5a","#8a7868","#6a5a4c"], behavior:behaviors.POWDER, category:"cosmic",
  state:"solid", density:3500, temp:300, tempHigh:1400, stateHigh:"magma",
  desc:"Arrives pre-heated." });
def("astro_metal",{ color:["#a8b0c0","#98a0b0"], behavior:behaviors.WALL, category:"cosmic",
  state:"solid", density:6000, hardness:0.9, conduct:0.8, tempHigh:1800, stateHigh:"molten_iron",
  desc:"Alloy of iron and bragging rights." });
def("alien_goo",{ color:["#70e070","#50c850","#90f090"], behavior:behaviors.LIQUID, category:"cosmic",
  state:"liquid", density:1200, viscosity:25,
  tick:function(pixel){ try{
    if(Math.random()<0.05){
      var dirs=[[-1,0],[1,0],[0,-1],[0,1]], d=dirs[Math.floor(Math.random()*4)];
      var x=pixel.x+d[0], y=pixel.y+d[1];
      if(typeof outOfBounds==="function" && outOfBounds(x,y)) return;
      if(typeof isEmpty==="function" && !isEmpty(x,y,true)){
        var p=pixelMap[x][y];
        if(p && (p.element==="plant"||p.element==="grass") && typeof changePixel==="function")
          changePixel(p,"alien_plant");
      }
    } }catch(e){} },
  desc:"It's spreading. That's normal. For it." });
def("alien_plant",{ color:["#a060ff","#8a4ae8","#c080ff"], behavior:behaviors.WALL, category:"cosmic",
  state:"solid", density:400, burn:15, burnTime:200, burnInto:"alien_goo",
  desc:"Photosynthesizes something. Not light." });
react("stardust","water",{ elem1:"glow_fluid", elem2:null, chance:0.1 });
react("void_salt","water",{ elem1:null, elem2:"dark_matter", chance:0.05 });
react("mars_sand","water",{ elem1:"mud", elem2:null, chance:0.2 });

/* ============================================================
   CATEGORY 4: DESSERTS — the important food group
   ============================================================ */
def("batter",{ color:["#f0dca8","#ecd49c"], behavior:behaviors.LIQUID, category:"desserts",
  state:"liquid", density:1100, viscosity:40, tempHigh:120, stateHigh:"pancake",
  desc:"Pancakes: the liquid phase." });
def("pancake",{ color:["#e0a860","#d89c54","#e8b470"], behavior:behaviors.WALL, category:"desserts",
  state:"solid", density:500, burn:8, burnTime:250, burnInto:"ash",
  desc:"Flat. Perfect. Stackable." });
def("waffle",{ color:["#d8a050","#cc9448"], behavior:behaviors.WALL, category:"desserts",
  state:"solid", density:450, burn:8, burnTime:250, burnInto:"ash",
  desc:"Pancake with a grid system." });
def("cookie_dough",{ color:["#e0c090","#d8b884"], behavior:behaviors.POWDER, category:"desserts",
  state:"solid", density:900, tempHigh:150, stateHigh:"cookie",
  desc:"Legally required to sneak a bite." });
def("cookie",{ color:["#c89050","#bc8444","#d09c5c"], behavior:behaviors.WALL, category:"desserts",
  state:"solid", density:500, burn:10, burnTime:200, burnInto:"ash",
  desc:"The correct shape is 'circle-ish'." });
def("frosting",{ color:["#ffffff","#fff0f8","#f0f8ff"], behavior:behaviors.LIQUID, category:"desserts",
  state:"liquid", density:1200, viscosity:90, tempHigh:90, stateHigh:"caramel",
  desc:"Structural sugar." });
def("sprinkles",{ color:["#ff6080","#60c0ff","#ffe060","#80e080","#c080ff"], behavior:behaviors.POWDER,
  category:"desserts", state:"solid", density:1300, desc:"Confetti you can eat." });
def("ice_cream",{ color:["#fff8ec","#ffecd8","#fff0f4"], behavior:behaviors.POWDER, category:"desserts",
  state:"solid", density:550, temp:-10, tempHigh:8, stateHigh:"cream",
  desc:"Eat fast. It's on a timer." });
if(!elements.cream) def("cream",{ color:["#fef8e8","#f8f0dc"], behavior:behaviors.LIQUID, category:"liquids",
  state:"liquid", density:1000, viscosity:20, tempHigh:100, stateHigh:"steam",
  desc:"Milk, promoted." });
def("whipped_cream",{ color:["#ffffff","#fdfaf2"], behavior:behaviors.POWDER, category:"desserts",
  state:"solid", density:300, tempHigh:30, stateHigh:"cream",
  desc:"Cloud (dairy)." });
def("caramel",{ color:["#c87828","#b86c20","#d88838"], behavior:behaviors.LIQUID, category:"desserts",
  state:"liquid", density:1300, viscosity:120, tempLow:40, stateLow:"fudge",
  desc:"Sugar that went to the gym." });
def("fudge",{ color:["#6a4028","#5c3820"], behavior:behaviors.WALL, category:"desserts",
  state:"solid", density:1200, tempHigh:60, stateHigh:"caramel",
  desc:"Dense. Like this mod." });
def("jelly",{ color:["#e05070","#d84868","#f06080"], behavior:behaviors.LIQUID, category:"desserts",
  state:"liquid", density:1050, viscosity:200, desc:"Wobbles professionally." });
def("marshmallow",{ color:["#fff4f4","#fceeee"], behavior:behaviors.POWDER, category:"desserts",
  state:"solid", density:250, burn:25, burnTime:150, burnInto:"toasted_marshmallow",
  tempHigh:100, stateHigh:"toasted_marshmallow", desc:"Campfire ammunition." });
def("toasted_marshmallow",{ color:["#c8945c","#a87848","#8a5c34"], behavior:behaviors.POWDER, category:"desserts",
  state:"solid", density:280, burn:40, burnTime:80, burnInto:"ash",
  desc:"The only acceptable level of burnt." });
def("cotton_candy",{ color:["#ffc8e8","#c8e0ff"], behavior:behaviors.POWDER, category:"desserts",
  state:"solid", density:100, burn:60, burnTime:40, burnInto:"smoke",
  desc:"Sugar cosplaying as a cloud." });
react("cotton_candy","water",{ elem1:null, elem2:"sugar_water", chance:0.8 });
if(!elements.sugar_water) def("sugar_water",{ color:["#e8f0ec","#e0ecE4"], behavior:behaviors.LIQUID,
  category:"liquids", state:"liquid", density:1050, viscosity:2, tempHigh:100, stateHigh:"steam",
  desc:"Hummingbird fuel." });
react("jelly","fire",{ elem1:"caramel", elem2:null, chance:0.3 });
react("sprinkles","water",{ elem1:null, elem2:"sugar_water", chance:0.2 });

/* ============================================================
   CATEGORY 5: TOXIC — please wash your hands
   ============================================================ */
def("sludge",{ color:["#4a5a30","#3c4c26","#5a6a3a"], behavior:behaviors.LIQUID, category:"toxic",
  state:"liquid", density:1400, viscosity:80, tempHigh:110, stateHigh:"toxic_gas",
  desc:"Industry's little secret." });
def("toxic_gas",{ color:["#a0b060","#90a050"], behavior:behaviors.GAS, category:"toxic",
  state:"gas", density:2.2, desc:"Green means stop." });
def("smog",{ color:["#8a8578","#7a7568"], behavior:behaviors.GAS, category:"toxic",
  state:"gas", density:1.4, desc:"City-flavored air." });
def("contaminated_soil",{ color:["#5a4a3a","#4c3e30"], behavior:behaviors.POWDER, category:"toxic",
  state:"solid", density:1300, desc:"Grows problems." });
def("mutagen",{ color:["#c8ff40","#a8e020","#e0ff80"], behavior:behaviors.LIQUID, category:"toxic",
  state:"liquid", density:1100, viscosity:10, desc:"Changes things. Rarely for the better." });
def("pesticide",{ color:["#d0e8c0","#c4dcb4"], behavior:behaviors.LIQUID, category:"toxic",
  state:"liquid", density:1000, viscosity:2, desc:"Bug off." });
def("venom",{ color:["#6a30a0","#582690"], behavior:behaviors.LIQUID, category:"toxic",
  state:"liquid", density:1080, viscosity:6, desc:"Snake juice. Artisanal." });
def("leachate",{ color:["#6a5a30","#5c4c26"], behavior:behaviors.LIQUID, category:"toxic",
  state:"liquid", density:1200, viscosity:12, desc:"Landfill tea." });
def("mold",{ color:["#5a6a4a","#6a7a5a","#4a5a3e"], behavior:behaviors.WALL, category:"toxic",
  state:"solid", density:300, burn:20, burnTime:100, burnInto:"smoke",
  tick:function(pixel){ try{
    if(Math.random()<0.02){
      var dirs=[[-1,0],[1,0],[0,-1],[0,1]], d=dirs[Math.floor(Math.random()*4)];
      var x=pixel.x+d[0], y=pixel.y+d[1];
      if(typeof outOfBounds==="function" && outOfBounds(x,y)) return;
      if(typeof isEmpty==="function" && !isEmpty(x,y,true)){
        var p=pixelMap[x][y];
        var f=["bread","cheese","dough","flour","cookie","pancake","waffle","cake","toast"];
        if(p && f.indexOf(p.element)>=0 && typeof changePixel==="function") changePixel(p,"mold");
      }
    } }catch(e){} },
  desc:"Eats your bread library." });
def("acid_cloud",{ color:["#b8c890","#a8b880"], behavior:behaviors.GAS, category:"toxic",
  state:"gas", density:0.8,
  tick:function(pixel){ try{
    if(Math.random()<0.01 && typeof isEmpty==="function" && typeof createPixel==="function"){
      var x=pixel.x, y=pixel.y+1;
      if(!(typeof outOfBounds==="function" && outOfBounds(x,y)) && isEmpty(x,y)) createPixel("acid",x,y);
    } }catch(e){} },
  desc:"0% chance of nice rain." });
react("sludge","water",{ elem1:"sludge", elem2:"leachate", chance:0.05 });
react("mutagen","plant",{ elem1:null, elem2:"alien_plant", chance:0.3 });
react("mutagen","grass",{ elem1:null, elem2:"alien_plant", chance:0.3 });
react("pesticide","plant",{ elem1:null, elem2:"dead_plant", chance:0.15 });
if(!elements.dead_plant) def("dead_plant",{ color:["#8a7a50","#7a6c44"], behavior:behaviors.POWDER,
  category:"life", state:"solid", density:400, burn:35, burnTime:120, burnInto:"ash",
  desc:"It had a good run." });
react("toxic_gas","cloud",{ elem1:"acid_cloud", elem2:null, chance:0.2 });
react("toxic_gas","rain_cloud",{ elem1:"acid_cloud", elem2:null, chance:0.2 });
react("smog","rain_cloud",{ elem1:"acid_cloud", elem2:null, chance:0.1 });

/* ============================================================
   EXTRAS for existing categories
   ============================================================ */
def("brine",{ color:["#c8d8d4","#bcd0cc"], behavior:behaviors.LIQUID, category:"liquids",
  state:"liquid", density:1120, viscosity:1.5, tempHigh:102, stateHigh:"steam",
  tempLow:-8, stateLow:"slush", desc:"Ocean concentrate." });
def("slush",{ color:["#dceef2","#d0e8ee"], behavior:behaviors.POWDER, category:"powders",
  state:"solid", density:900, temp:-4, tempHigh:2, stateHigh:"salt_water",
  desc:"Winter's soup." });
def("pumice",{ color:["#b8b0a4","#aca498"], behavior:behaviors.POWDER, category:"powders",
  state:"solid", density:250, desc:"The rock that floats (in your heart)." });
def("volcanic_ash",{ color:["#6a6560","#5c5854"], behavior:behaviors.POWDER, category:"powders",
  state:"solid", density:900, desc:"Souvenir from an angry mountain." });
def("soot",{ color:["#2a2826","#1e1c1a"], behavior:behaviors.POWDER, category:"powders",
  state:"solid", density:600, burn:5, burnTime:60, burnInto:"smoke", desc:"Chimney glitter." });
def("gravel",{ color:["#9a948a","#8a847a","#aaa49a"], behavior:behaviors.POWDER, category:"powders",
  state:"solid", density:1800, desc:"Stone, but plural." });
def("breadcrumbs",{ color:["#d8b878","#ccac6c"], behavior:behaviors.POWDER, category:"food",
  state:"solid", density:400, burn:15, burnTime:100, burnInto:"ash",
  desc:"Trail markers / toast byproduct." });
def("croutons",{ color:["#c8a058","#bc944c"], behavior:behaviors.POWDER, category:"food",
  state:"solid", density:350, burn:15, burnTime:120, burnInto:"ash",
  desc:"Toast that went to finishing school." });
def("curds",{ color:["#f4ecd8","#eee4cc"], behavior:behaviors.POWDER, category:"food",
  state:"solid", density:800, tempHigh:120, stateHigh:"cheese_sauce",
  desc:"Cheese: the origin story." });
def("cheese_sauce",{ color:["#f0b840","#e8ac34"], behavior:behaviors.LIQUID, category:"food",
  state:"liquid", density:1100, viscosity:70, tempLow:25, stateLow:"curds",
  desc:"Pours like a promise." });
def("hot_spring_water",{ color:["#c8e8e0","#bce0d8"], behavior:behaviors.LIQUID, category:"liquids",
  state:"liquid", density:1000, viscosity:1, temp:70, tempHigh:100, stateHigh:"steam",
  desc:"Nature's bathtub." });
def("ember",{ color:["#ff8a3a","#e05a1a","#ffb060"], behavior:behaviors.POWDER, category:"powders",
  state:"solid", density:400, temp:400, burn:100, burnTime:200, burnInto:"ash",
  desc:"Fire's leftovers, still grumpy." });

/* ============================================================
   NEW RECIPES FOR EXISTING ELEMENTS (all guarded)
   ============================================================ */
// kitchen upgrades
react("sugar","butter",{ elem1:"caramel", elem2:"caramel", chance:0.05 });
react("sugar","fire",{ elem1:"caramel", elem2:null, chance:0.15 });
react("milk","vinegar",{ elem1:"curds", elem2:null, chance:0.3 });
react("cream","vinegar",{ elem1:"curds", elem2:null, chance:0.3 });
react("milk","chocolate",{ elem1:"cream", elem2:null, chance:0.03 });
react("flour","milk",{ elem1:"batter", elem2:null, chance:0.25 });
react("flour","cream",{ elem1:"batter", elem2:null, chance:0.25 });
react("flour","butter",{ elem1:"cookie_dough", elem2:null, chance:0.15 });
react("dough","sugar",{ elem1:"cookie_dough", elem2:null, chance:0.2 });
react("bread","fire",{ elem1:"croutons", elem2:null, chance:0.05 });
react("toast","toast",{ elem1:"breadcrumbs", elem2:"breadcrumbs", chance:0.001 });
react("bread","salt_water",{ elem1:"dough", elem2:null, chance:0.05 });
react("sugar","cloud",{ elem1:"cotton_candy", elem2:null, chance:0.1 });
// geology upgrades
react("stone","acid",{ elem1:"gravel", elem2:null, chance:0.1 });
react("gravel","acid",{ elem1:"sand", elem2:null, chance:0.1 });
react("sand","magma",{ elem1:"molten_glass", elem2:null, chance:0.05 });
react("stone","magma",{ elem1:"gravel", elem2:null, chance:0.02 });
react("mud","fire",{ elem1:"brick", elem2:null, chance:0.03 });
react("ash","water",{ elem1:"leachate", elem2:null, chance:0.02 });
react("ash","magma",{ elem1:"volcanic_ash", elem2:null, chance:0.1 });
react("basalt","acid",{ elem1:"gravel", elem2:null, chance:0.05 });
// water cycle upgrades
react("salt","ice",{ elem1:null, elem2:"slush", chance:0.2 });
react("salt","snow",{ elem1:null, elem2:"slush", chance:0.2 });
react("salt_water","salt",{ elem1:"brine", elem2:null, chance:0.1 });
react("steam","stone",{ elem1:"hot_spring_water", elem2:null, chance:0.01 });
// metal & power upgrades
react("iron","salt_water",{ elem1:"rust", elem2:null, chance:0.02 });
react("iron","brine",{ elem1:"rust", elem2:null, chance:0.05 });
react("copper","acid",{ elem1:null, elem2:"toxic_gas", chance:0.03 });
react("gold","acid",{ elem1:"gold", elem2:null, chance:0 }); // gold doesn't care
// nature upgrades
react("plant","sugar_water",{ elem1:"plant", elem2:"plant", chance:0.02 });
react("wood","acid",{ elem1:"sawdust", elem2:null, chance:0.05 });
if(!elements.sawdust) def("sawdust",{ color:["#c8a878","#bc9c6c"], behavior:behaviors.POWDER,
  category:"powders", state:"solid", density:400, burn:40, burnTime:150, burnInto:"ash",
  desc:"Tree confetti." });
react("dirt","mutagen",{ elem1:"contaminated_soil", elem2:null, chance:0.4 });
react("mud","mutagen",{ elem1:"contaminated_soil", elem2:null, chance:0.4 });
react("dirt","leachate",{ elem1:"contaminated_soil", elem2:null, chance:0.2 });
react("grass","smog",{ elem1:"dead_plant", elem2:null, chance:0.01 });


/* ============================================================
   THE BIG REACTION WEB — cross-category interplay
   ============================================================ */
// chemistry set
react("vinegar","rust",{ elem1:"vinegar", elem2:"iron", chance:0.04 });
react("vinegar","stone",{ elem1:"vinegar", elem2:"gravel", chance:0.01 });
react("soda_water","sugar",{ elem1:"sugar_water", elem2:null, chance:0.3 });
react("glow_fluid","fire",{ elem1:"smoke", elem2:"fire", chance:0.3 });
react("rubbing_alcohol","water",{ elem1:"water", elem2:"water", chance:0.05 });
react("epoxy","sand",{ elem1:"hard_epoxy", elem2:null, chance:0.3 });
react("epoxy","gravel",{ elem1:"hard_epoxy", elem2:null, chance:0.3 });
react("epoxy","gem_dust",{ elem1:"hard_epoxy", elem2:null, chance:0.3 });
react("flash_powder","electricity",{ elem1:"fire", elem2:"electricity", chance:0.9 });
react("quicklime","steam",{ elem1:"slaked_lime", elem2:null, chance:0.3 });
react("slaked_lime","acid",{ elem1:null, elem2:"salt_water", chance:0.3 });
react("bleach","mold",{ elem1:"bleach", elem2:"smoke", chance:0.6 });
react("bleach","sludge",{ elem1:"bleach", elem2:"water", chance:0.2 });
react("bleach","leachate",{ elem1:"bleach", elem2:"water", chance:0.2 });
react("corrosive_salt","ice",{ elem1:null, elem2:"acid", chance:0.1 });
react("corrosive_salt","snow",{ elem1:null, elem2:"acid", chance:0.1 });
react("mineral_water","fire",{ elem1:"steam", elem2:"fire", chance:0.2 });
// gem economy
react("iron_ore","acid",{ elem1:"rust", elem2:null, chance:0.1 });
react("gold_ore","acid",{ elem1:"gold", elem2:null, chance:0.02 });
react("fools_gold","acid",{ elem1:null, elem2:"sulfur_gas", chance:0.1 });
react("fools_gold","fire",{ elem1:"ember", elem2:"sulfur_gas", chance:0.2 });
react("gem_dust","molten_glass",{ elem1:"crystal_shard", elem2:null, chance:0.1 });
react("crystal_shard","electricity",{ elem1:"crystal_shard", elem2:"glow_fluid", chance:0.02 });
react("gravel","water",{ elem1:"sand", elem2:"water", chance:0.003 });
react("pumice","magma",{ elem1:"magma", elem2:"magma", chance:0.2 });
react("volcanic_ash","water",{ elem1:"mud", elem2:null, chance:0.2 });
react("volcanic_ash","cloud",{ elem1:"smog", elem2:"cloud", chance:0.2 });
react("soot","water",{ elem1:"leachate", elem2:null, chance:0.05 });
react("soot","cloud",{ elem1:"smog", elem2:"cloud", chance:0.3 });
// cosmic events
react("comet_ice","fire",{ elem1:"steam", elem2:null, chance:0.4 });
react("comet_ice","magma",{ elem1:"steam", elem2:"basalt", chance:0.4 });
react("comet_ice","steam",{ elem1:"comet_ice", elem2:"snow", chance:0.2 });
react("stardust","magma",{ elem1:"solar_plasma", elem2:"magma", chance:0.05 });
react("stardust","electricity",{ elem1:"solar_plasma", elem2:null, chance:0.1 });
react("moon_dust","water",{ elem1:"mud", elem2:null, chance:0.15 });
react("mars_sand","plant",{ elem1:"mars_sand", elem2:"dead_plant", chance:0.05 });
react("nebula_gas","electricity",{ elem1:"stardust", elem2:"electricity", chance:0.2 });
react("nebula_gas","fire",{ elem1:"stardust", elem2:"fire", chance:0.05 });
react("dark_matter","electricity",{ elem1:"void_salt", elem2:null, chance:0.1 });
react("meteor_dust","water",{ elem1:"stone", elem2:"steam", chance:0.3 });
react("solar_plasma","water",{ elem1:"solar_plasma", elem2:"steam", chance:0.8 });
react("solar_plasma","sand",{ elem1:"solar_plasma", elem2:"molten_glass", chance:0.5 });
react("alien_goo","dirt",{ elem1:"alien_goo", elem2:"contaminated_soil", chance:0.05 });
react("alien_goo","water",{ elem1:"alien_goo", elem2:"mutagen", chance:0.01 });
react("alien_goo","fire",{ elem1:"toxic_gas", elem2:"fire", chance:0.3 });
react("alien_plant","water",{ elem1:"alien_plant", elem2:"alien_plant", chance:0.02 });
// dessert lab
react("batter","oil",{ elem1:"pancake", elem2:"oil", chance:0.05 });
react("batter","magma",{ elem1:"pancake", elem2:"smoke", chance:0.5 });
react("pancake","frosting",{ elem1:"cake", elem2:null, chance:0.1 });
react("waffle","frosting",{ elem1:"cake", elem2:null, chance:0.1 });
react("cookie","milk",{ elem1:"breadcrumbs", elem2:"milk", chance:0.02 });
react("whipped_cream","fire",{ elem1:"cream", elem2:"fire", chance:0.4 });
react("caramel","salt",{ elem1:"fudge", elem2:null, chance:0.2 });
react("marshmallow","chocolate",{ elem1:"fudge", elem2:"fudge", chance:0.05 });
react("cookie","marshmallow",{ elem1:"fudge", elem2:null, chance:0.02 });
react("ice_cream","caramel",{ elem1:"cream", elem2:"fudge", chance:0.05 });
react("sprinkles","frosting",{ elem1:null, elem2:"frosting", chance:0.05 });
react("jelly","sugar",{ elem1:"jelly", elem2:"jelly", chance:0.03 });
react("breadcrumbs","oil",{ elem1:"croutons", elem2:"oil", chance:0.1 });
react("curds","salt",{ elem1:"cheese", elem2:null, chance:0.1 });
react("cheese_sauce","breadcrumbs",{ elem1:"cheese_sauce", elem2:"croutons", chance:0.1 });
// toxic chains
react("sludge","plant",{ elem1:"sludge", elem2:"dead_plant", chance:0.1 });
react("sludge","grass",{ elem1:"sludge", elem2:"dead_plant", chance:0.1 });
react("sludge","fire",{ elem1:"toxic_gas", elem2:"fire", chance:0.3 });
react("sludge","dirt",{ elem1:"sludge", elem2:"contaminated_soil", chance:0.1 });
react("toxic_gas","water",{ elem1:"sludge", elem2:"water", chance:0.05 });
react("venom","plant",{ elem1:"venom", elem2:"dead_plant", chance:0.1 });
react("venom","water",{ elem1:"sludge", elem2:"water", chance:0.02 });
react("leachate","plant",{ elem1:"leachate", elem2:"dead_plant", chance:0.05 });
react("contaminated_soil","plant",{ elem1:"contaminated_soil", elem2:"dead_plant", chance:0.05 });
react("contaminated_soil","water",{ elem1:"dirt", elem2:"leachate", chance:0.05 });
react("pesticide","bee",{ elem1:"pesticide", elem2:null, chance:0.3 });
react("pesticide","fly",{ elem1:"pesticide", elem2:null, chance:0.3 });
react("pesticide","ant",{ elem1:"pesticide", elem2:null, chance:0.3 });
react("pesticide","worm",{ elem1:"pesticide", elem2:null, chance:0.2 });
react("mutagen","seed",{ elem1:null, elem2:"alien_plant", chance:0.3 });
react("mutagen","mold",{ elem1:null, elem2:"alien_goo", chance:0.2 });
// existing-world extras
react("ember","wood",{ elem1:"ember", elem2:"fire", chance:0.1 });
react("ember","oil",{ elem1:"ember", elem2:"fire", chance:0.3 });
react("ember","water",{ elem1:"soot", elem2:"steam", chance:0.5 });
react("smoke","cloud",{ elem1:"smog", elem2:"cloud", chance:0.1 });
react("ice","brine",{ elem1:"slush", elem2:"brine", chance:0.2 });
react("oil","flour",{ elem1:"cookie_dough", elem2:null, chance:0.05 });
react("hot_spring_water","iron",{ elem1:"hot_spring_water", elem2:"rust", chance:0.02 });
react("brine","magma",{ elem1:"salt", elem2:"basalt", chance:0.3 });
react("slush","salt",{ elem1:"brine", elem2:null, chance:0.3 });

/* ---------- hello ---------- */
try{
  var n=0; for(var k in elements) n++;
  console.log("SANDBOXELS OVERLOAD loaded — element table now "+n+" entries.");
}catch(e){}

})();
