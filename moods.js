// ============ KAI.FUN SMILEY MOOD ENGINE ============
// shared by index.html (the smiley) and smiledex.html (the collection)
(function(){
const R={common:{w:10,label:"common",col:"#8a8a8a"}, uncommon:{w:5,label:"uncommon",col:"#6fb85c"},
  rare:{w:2.5,label:"rare",col:"#4aa9d8"}, epic:{w:1,label:"epic",col:"#9b7fd4"},
  legendary:{w:0.3,label:"legendary",col:"#f5b829"}, secret:{w:0,label:"secret",col:"#ff6b5e"},
  cooked:{w:0,label:"yeah bro ur cooked \ud83d\udc80",col:"#141414"},
  final:{w:0,label:"Kai.",col:"#000"}};
// id, name, rarity, eyes, mouth, extra, face color, speech style, voice rate, voice pitch
const M=[
 ["happy","happy","common","normal","smile","","#f5b829","normal",1.7,1],
 ["chill","chill","common","sleepy","smile","","#f5b829","chill",1.4,0.9],
 ["giggly","giggly","common","happy","grin","blush","#f5b829","giggly",1.9,1.3],
 ["curious","curious","common","wide","o","","#f5b829","curious",1.7,1.1],
 ["sleepy","sleepy","common","closed","flat","zzz","#f5b829","sleepy",1.1,0.8],
 ["goofy","goofy","common","wink","tongue","","#f5b829","goofy",1.9,1.2],
 ["grumpy","grumpy","common","angry","frown","","#f5b829","grumpy",1.4,0.7],
 ["shy","shy","common","normal","small","blush","#f5b829","shy",1.5,1.2],
 ["hungry","hungry","common","normal","tongue","","#f5b829","hungry",1.7,1],
 ["bored","bored","common","sleepy","flat","","#f5b829","bored",1.3,0.8],
 ["proud","proud","common","normal","grin","sparkle","#f5b829","proud",1.6,0.95],
 ["confused","confused","common","wide","wavy","sweat","#f5b829","confused",1.7,1.15],
 ["cheeky","cheeky","common","wink","smirk","","#f5b829","cheeky",1.8,1.05],
 ["calm","calm","common","closed","smile","","#f5b829","calm",1.3,0.9],
 ["hyped","HYPED","uncommon","star","grin","sparkle","#ffcc4d","hype",2,1.4],
 ["sad","sad","uncommon","tear","frown","","#7fb3d5","sad",1.2,0.8],
 ["nervous","nervous","uncommon","wide","wavy","sweat","#f5b829","nervous",1.9,1.2],
 ["dramatic","dramatic","uncommon","closed","frown","","#f5b829","dramatic",1.4,0.9],
 ["pirate","pirate","uncommon","normal","grin","bandana","#f5b829","pirate",1.6,0.7],
 ["cowboy","cowboy","uncommon","normal","smirk","cowboy","#f5b829","cowboy",1.5,0.75],
 ["nerd","nerd","uncommon","normal","smile","glasses","#f5b829","nerd",1.9,1.1],
 ["sick","sick","uncommon","sleepy","wavy","","#a3d977","sick",1.3,0.85],
 ["spooky","spooky","uncommon","wide","scream","","#e8e8e8","spooky",1.4,0.6],
 ["lovestruck","lovestruck","uncommon","heart","smile","","#ff9db0","love",1.5,1.2],
 ["royal","royal","rare","normal","smirk","crown","#f5b829","royal",1.4,0.85],
 ["angelic","angelic","rare","happy","smile","halo","#fff3b0","angelic",1.4,1.3],
 ["devilish","devilish","rare","angry","grin","horns","#ff6b5e","devil",1.6,0.6],
 ["zen","zen","rare","closed","flat","flower","#b8e0c8","zen",1.1,0.9],
 ["party","party","rare","star","grin","partyhat","#f5b829","party",2,1.3],
 ["mysterious","mysterious","rare","sunglasses","flat","","#8a8a8a","mysterious",1.3,0.7],
 ["dizzy","dizzy","rare","dizzy","wavy","","#f5b829","dizzy",1.6,1.1],
 ["cold","freezing","rare","normal","flat","ice","#bfe3ff","cold",1.6,1],
 ["fire","ON FIRE","epic","angry","grin","fire","#ff8a3d","fire",2,1],
 ["ghost","ghost","epic","normal","o","","#f4f4f4","ghost",1.2,0.55],
 ["alien","alien","epic","wide","flat","antenna","#9be37d","alien",1.7,1.8],
 ["poet","poet","epic","closed","smile","","#c9b6e8","poet",1.2,0.95],
 ["villain","villain","epic","angry","smirk","mustache","#f5b829","villain",1.4,0.65],
 ["golden","GOLDEN","legendary","sparkle","grin","crownsparkle","#ffd700","golden",1.5,1.1],
 ["glitch","gl1tch","legendary","x","wavy","","#9b7fd4","glitch",2,1.5],
 ["cosmic","cosmic","legendary","star","smile","sparkle","#3b2a6e","cosmic",1.3,0.8],
 // more rollables
 ["excited","excited","common","wide","grin","sparkle","#f5b829","excited",1,1],
 ["tired","tired","common","sleepy","frown","","#e6c96a","tired",1,1],
 ["silly","silly","common","dizzy","tongue","","#f5b829","silly",1,1],
 ["suspicious","suspicious","common","angry","flat","","#f5b829","suspicious",1,1],
 ["smug","smug","uncommon","sleepy","smirk","","#f5b829","smug",1,1],
 ["embarrassed","embarrassed","uncommon","closed","wavy","blush","#ffb1a3","embarrassed",1,1],
 ["thoughtful","thoughtful","uncommon","normal","small","cloud","#f5b829","thoughtful",1,1],
 ["brave","brave","uncommon","angry","smile","bandage","#f5b829","brave",1,1],
 ["sassy","sassy","uncommon","wink","smirk","","#f5b829","sassy",1,1],
 ["wholesome","wholesome","uncommon","happy","smile","flower","#ffd6a5","wholesome",1,1],
 ["chef","chef","rare","normal","grin","chefhat","#f5b829","chef",1,1],
 ["detective","detective","rare","normal","flat","detective","#f5b829","detective",1,1],
 ["ninja","ninja","rare","angry","flat","ninja","#f5b829","ninja",1,1],
 ["knight","knight","rare","normal","smile","helmet","#f5b829","knight",1,1],
 ["vampire","vampire","epic","angry","fangs","","#e0d6f0","vampire",1,1],
 ["astronaut","astronaut","epic","wide","o","helmet","#f5b829","astronaut",1,1],
 // secrets — never rolled randomly, each has a trigger
 ["robot","ROBOT","secret","led","teeth","antenna","#a9b4c2","robot",1,1],
 ["pizza","pizza","secret","happy","grin","pepperoni","#f0c060","pizza",1,1],
 ["creator","the creator","secret","normal","smile","crown","#4aa9d8","creator",1,1],
 ["nocturnal","nocturnal","secret","sleepy","smile","moon","#2f2f4f","nocturnal",1,1],
 ["speedrun","speedrunner","secret","wide","scream","sweat","#f5b829","speedrun",1,1],
 ["pumpkin","pumpkin","secret","angry","teeth","stem","#ff8a3d","pumpkin",1,1],
 ["festive","festive","secret","happy","grin","santahat","#f5b829","festive",1,1],
 ["unlucky","unlucky","secret","x","frown","cloud","#8fa38a","unlucky",1,1],
 ["joe","joe","secret","normal","flat","glasses","#f5b829","joe",1,1],
 ["rocky","rocky","secret","angry","grin","bandage","#b9a58c","rocky",1,1],
 ["uwu","uwu","secret","closed","small","blush","#ffc2d1","uwu",1,1],
 ["shaken","shaken","secret","dizzy","wavy","sweat","#f5b829","shaken",1,1],
 ["squished","squished","secret","wide","flat","","#f5b829","squished",1,1],
 ["missedyou","missed you","secret","tear","smile","","#f5b829","missedyou",1,1],
 ["lawyer","lawyer","secret","normal","flat","glasses","#c9d3dd","lawyer",1,1],
 ["windowshopper","window shopper","secret","sparkle","o","","#f5b829","windowshopper",1,1],
 ["contextual","contextual","secret","wink","smirk","","#f5b829","contextual",1,1],
 ["century","centurion","secret","angry","teeth","helmet","#d9c07a","century",1,1],
 ["doorkeeper","doorkeeper","secret","led","wavy","","#8c6a4a","doorkeeper",1,1],
 ["overclocked","overclocked","secret","star","teeth","fire","#9be37d","overclocked",1,1],
 ["binge","binge watcher","secret","sleepy","o","","#3b2a6e","binge",1,1],
 // even more rollables
 ["sneezy","sneezy","common","closed","o","sweat","#f5b829","sneezy",1,1],
 ["cool","cool","common","sunglasses","smirk","","#f5b829","cool",1,1],
 ["lazy","lazy","common","sleepy","small","","#f5b829","lazy",1,1],
 ["baby","baby","common","wide","o","blush","#ffe0a3","baby",1,1],
 ["gamer","gamer","uncommon","wide","teeth","headset","#f5b829","gamer",1,1],
 ["clown","clown","uncommon","happy","grin","clown","#f5b829","clown",1,1],
 ["mime","mime","uncommon","closed","flat","","#f4f4f4","mime",1,1],
 ["grandpa","grandpa","uncommon","sleepy","small","grandpa","#f5b829","grandpa",1,1],
 ["cat","cat","rare","normal","cat","whiskers","#f5b829","cat",1,1],
 ["surfer","surfer","rare","sunglasses","grin","","#f0c060","surfer",1,1],
 ["monk","monk","rare","closed","small","","#e8b86a","monk",1,1],
 ["superhero","superhero","epic","angry","grin","mask","#f5b829","superhero",1,1],
 ["wizard","wizard","epic","normal","smile","wizardhat","#c9b6e8","wizard",1,1],
 ["madscientist","mad scientist","epic","dizzy","grin","hair","#b8e0c8","madscientist",1,1],
 // more secrets
 ["mirror","mirror","secret","normal","smile","","#dfe8f0","mirror",1,1],
 ["earlybird","early bird","secret","wide","smile","","#ffd6a5","earlybird",1,1],
 ["dizzier","dizzier","secret","dizzy","wavy","","#f5b829","dizzier",1,1],
 ["urlist","urlist","secret","normal","flat","glasses","#c9d3dd","urlist",1,1],
 ["smasher","keysmasher","secret","x","teeth","sweat","#f5b829","smasher",1,1],
 ["selective","selective","secret","wide","flat","","#9fd0ff","selective",1,1],
 ["printable","printable","secret","normal","flat","","#f4f4f4","printable",1,1],
 ["copycat","copycat","secret","wink","cat","whiskers","#f5b829","copycat",1,1],
 ["immersive","immersive","secret","star","o","","#3b2a6e","immersive",1,1],
 ["flipped","flipped","secret","dizzy","frown","","#f5b829","flipped",1,1],
 ["shadow","shadow","secret","led","flat","","#1a1a1a","shadow",1,1],
 ["bottomfeeder","bottom feeder","secret","sleepy","o","","#7fb3d5","bottomfeeder",1,1],
 ["error","ERROR","secret","x","flat","","#d62828","error",1,1],
 // intricate puzzle
 ["smilend","Smilend","cooked","closed","flat","halo","#1a1a1a","smilend",1,1],
 // the final one
 ["kai","Kai.","final","star","grin","halo","#141414","kai",1,1],
 // yeah bro ur cooked — the hardest ones
 ["sisyphus","sisyphus","cooked","x","flat","","#6b6b6b","sisyphus",1,1],
 ["completionist","completionist","cooked","star","grin","crownsparkle","#ffd700","completionist",1,1],
 ["trinity","trinity","cooked","led","smile","halo","#4aa9d8","trinity",1,1],
 ["patience","patience","cooked","closed","flat","moon","#b8e0c8","patience",1,1],
 ["antirobot","anti-robot","cooked","x","teeth","antenna","#3a3a3a","antirobot",1,1],
];
const HINTS={
  robot:"up, up, and away \u2014 you know the rest", pizza:"spell what you'd eat at midnight", creator:"name the one who built the house",
  nocturnal:"some faces only show when the clock forgets the day", speedrun:"faster than the bubble can be read", pumpkin:"carve a date",
  festive:"the reddest day of winter", unlucky:"a date black cats avoid", joe:"spell the man everyone keeps guessing",
  rocky:"spell the page nobody linked", uwu:"the softest three letters", shaken:"the floor is not the only thing that can move",
  squished:"how small can a window get before it complains?", missedyou:"leave. wait. return.", lawyer:"nobody reads it. read it.",
  windowshopper:"look at everything. touch nothing.", contextual:"the other button", century:"a round number of clicks",
  doorkeeper:"somewhere, a door is tired of hearing the same thing", overclocked:"one game judges your hardware. push the best one too far.",
  binge:"the infinite has endings, if you scrub to them",
  mirror:"say the verb backwards", earlybird:"a face for the sun's first hour", dizzier:"spin a wheel on his face",
  urlist:"the address can carry a word", smasher:"thirty keys. two seconds.", selective:"select everything",
  printable:"put him on paper", copycat:"steal his words", immersive:"give him the whole screen",
  flipped:"turn the world over. thrice.", shadow:"type the absence of light", bottomfeeder:"the end of the page, again and again",
  error:"the page can only take so much",
  smilend:"when he is broken, ask him the only question there is. two games hide in the grid, side by side.",
  sisyphus:"the boulder is round and yellow", completionist:"every face that chance allows", trinity:"three games, three doors, all open",
  patience:"stay a while. longer than that.", antirobot:"away and up, up \u2014 the rest, reversed",
  kai:"the end of smiles, and three more of the cooked. then a name said twice, and a minute being born.",
};
const MOODS=M.map(a=>({id:a[0],name:a[1],rarity:a[2],eyes:a[3],mouth:a[4],extra:a[5],color:a[6],style:a[7],hint:HINTS[a[0]]||""}));
const byId={}; MOODS.forEach(m=>byId[m.id]=m);
// ============ CURATION: ten per tier ============
const KEEP={
  happy:"common",chill:"common",giggly:"common",curious:"common",sleepy:"common",goofy:"common",grumpy:"common",shy:"common",hungry:"common",bored:"common",
  hyped:"uncommon",sad:"uncommon",nervous:"uncommon",dramatic:"uncommon",pirate:"uncommon",cowboy:"uncommon",nerd:"uncommon",spooky:"uncommon",lovestruck:"uncommon",gamer:"uncommon",
  royal:"rare",angelic:"rare",devilish:"rare",zen:"rare",party:"rare",mysterious:"rare",dizzy:"rare",chef:"rare",detective:"rare",ninja:"rare",
  fire:"epic",ghost:"epic",alien:"epic",poet:"epic",villain:"epic",vampire:"epic",astronaut:"epic",superhero:"epic",wizard:"epic",madscientist:"epic",
  golden:"legendary",glitch:"legendary",cosmic:"legendary",knight:"legendary",cat:"legendary",surfer:"legendary",monk:"legendary",clown:"legendary",mime:"legendary",grandpa:"legendary",
  robot:"secret",pizza:"secret",creator:"secret",nocturnal:"secret",speedrun:"secret",contextual:"secret",error:"secret",doorkeeper:"secret",overclocked:"secret",binge:"secret",
  smilend:"cooked",sisyphus:"cooked",completionist:"cooked",trinity:"cooked",patience:"cooked",antirobot:"cooked",century:"cooked",missedyou:"cooked",unlucky:"cooked",festive:"cooked",
  kai:"final",
};
for(let i=MOODS.length-1;i>=0;i--){ const x=MOODS[i]; if(!KEEP[x.id]) MOODS.splice(i,1); else x.rarity=KEEP[x.id]; }
Object.keys(byId).forEach(k=>{ if(!KEEP[k]) delete byId[k]; });
// the one puzzle chain that stays: error -> type ? -> 4x4 grid -> joessoks -> SMILEND
const PUZZLES={ smilend:{gate:"error", act:{kind:"type",word:"?"}, puzzle:{type:"grid",seed:777,word:"joessoks"}} };

// ---------- face parts ----------
const ink="#141414";
function eyes(t){
  const W=(cx,r)=>'<circle class="eyeW" cx="'+cx+'" cy="42" r="'+r+'" fill="#fff" stroke="'+ink+'" stroke-width="4"/>';
  const P=(cx,r)=>'<circle class="pupil" cx="'+cx+'" cy="42" r="'+r+'" fill="'+ink+'"/>';
  const arc=(cx)=>'<path d="M'+(cx-10)+' 46 Q'+cx+' 32 '+(cx+10)+' 46" fill="none" stroke="'+ink+'" stroke-width="5" stroke-linecap="round"/>';
  const line=(cx)=>'<path d="M'+(cx-10)+' 42 L'+(cx+10)+' 42" stroke="'+ink+'" stroke-width="5" stroke-linecap="round"/>';
  switch(t){
    case "normal": return W(34,11)+W(66,11)+P(34,5)+P(66,5);
    case "wide": return W(34,13)+W(66,13)+P(34,4)+P(66,4);
    case "happy": return arc(34)+arc(66);
    case "closed": return line(34)+line(66);
    case "sleepy": return W(34,11)+W(66,11)+P(34,5)+P(66,5)+
      '<path d="M22 36 Q34 30 46 36 L46 42 L22 42 Z M54 36 Q66 30 78 36 L78 42 L54 42 Z" fill="#00000030" stroke="'+ink+'" stroke-width="3"/>';
    case "wink": return W(34,11)+P(34,5)+arc(66);
    case "angry": return W(34,11)+W(66,11)+P(34,5)+P(66,5)+
      '<path d="M22 28 L44 36 M78 28 L56 36" stroke="'+ink+'" stroke-width="5" stroke-linecap="round"/>';
    case "dizzy": return '<path d="M34 42 m-9 0 a9 9 0 1 1 9 9 a5 5 0 1 0 -5 -5" fill="none" stroke="'+ink+'" stroke-width="4"/>'+
      '<path d="M66 42 m-9 0 a9 9 0 1 1 9 9 a5 5 0 1 0 -5 -5" fill="none" stroke="'+ink+'" stroke-width="4"/>';
    case "heart": return '<path d="M34 50 L24 40 A6 6 0 0 1 34 34 A6 6 0 0 1 44 40 Z" fill="#ff4d6d" stroke="'+ink+'" stroke-width="3"/>'+
      '<path d="M66 50 L56 40 A6 6 0 0 1 66 34 A6 6 0 0 1 76 40 Z" fill="#ff4d6d" stroke="'+ink+'" stroke-width="3"/>';
    case "star": return '<polygon points="34,30 37.5,39 47,39 39.5,45 42,54 34,48.5 26,54 28.5,45 21,39 30.5,39" fill="#fff" stroke="'+ink+'" stroke-width="3"/>'+
      '<polygon points="66,30 69.5,39 79,39 71.5,45 74,54 66,48.5 58,54 60.5,45 53,39 62.5,39" fill="#fff" stroke="'+ink+'" stroke-width="3"/>';
    case "x": return '<path d="M26 34 L42 50 M42 34 L26 50 M58 34 L74 50 M74 34 L58 50" stroke="'+ink+'" stroke-width="5" stroke-linecap="round"/>';
    case "sunglasses": return '<rect x="20" y="32" width="26" height="18" rx="6" fill="'+ink+'"/><rect x="54" y="32" width="26" height="18" rx="6" fill="'+ink+'"/>'+
      '<path d="M46 40 L54 40" stroke="'+ink+'" stroke-width="4"/>';
    case "tear": return W(34,11)+W(66,11)+P(34,5)+P(66,5)+
      '<path d="M70 54 Q66 64 70 68 Q76 64 70 54" fill="#7fb3d5" stroke="'+ink+'" stroke-width="2"/>';
    case "sparkle": return W(34,11)+W(66,11)+P(34,5)+P(66,5)+
      '<path d="M30 36 L32 40 L36 42 L32 44 L30 48 L28 44 L24 42 L28 40 Z M62 36 L64 40 L68 42 L64 44 L62 48 L60 44 L56 42 L60 40 Z" fill="#fff"/>';
    case "led": return '<rect x="24" y="34" width="20" height="14" rx="3" fill="#5cf2ff" stroke="'+ink+'" stroke-width="3"/>'+
      '<rect x="56" y="34" width="20" height="14" rx="3" fill="#5cf2ff" stroke="'+ink+'" stroke-width="3"/>';
  }
  return W(34,11)+W(66,11)+P(34,5)+P(66,5);
}
function mouth(t){
  const s=(d,extra)=>'<path d="'+d+'" fill="none" stroke="'+ink+'" stroke-width="5" stroke-linecap="round"/>'+(extra||"");
  switch(t){
    case "smile": return s("M30 63 Q50 83 70 63");
    case "small": return s("M40 66 Q50 74 60 66");
    case "grin": return '<path d="M28 62 Q50 90 72 62 Z" fill="#fff" stroke="'+ink+'" stroke-width="4" stroke-linejoin="round"/><path d="M32 66 L68 66" stroke="'+ink+'" stroke-width="3"/>';
    case "teeth": return '<path d="M28 60 L72 60 L72 76 L28 76 Z" fill="#fff" stroke="'+ink+'" stroke-width="4"/><path d="M39 60 L39 76 M50 60 L50 76 M61 60 L61 76 M28 68 L72 68" stroke="'+ink+'" stroke-width="3"/>';
    case "frown": return s("M30 76 Q50 58 70 76");
    case "o": return '<ellipse cx="50" cy="68" rx="9" ry="11" fill="'+ink+'"/>';
    case "scream": return '<ellipse cx="50" cy="70" rx="13" ry="16" fill="'+ink+'"/>';
    case "flat": return s("M34 68 L66 68");
    case "wavy": return s("M30 68 Q37 60 44 68 T58 68 T72 68");
    case "tongue": return s("M30 63 Q50 83 70 63",'<path d="M46 72 Q52 86 60 72 Z" fill="#ff6b8b" stroke="'+ink+'" stroke-width="3" stroke-linejoin="round"/>');
    case "smirk": return s("M36 70 Q56 78 68 62");
    case "cat": return s("M36 64 Q43 74 50 64 Q57 74 64 64");
    case "fangs": return s("M30 63 Q50 83 70 63",'<path d="M38 66 L42 78 L46 67 Z M54 67 L58 78 L62 66 Z" fill="#fff" stroke="'+ink+'" stroke-width="2"/>');
  }
  return s("M30 63 Q50 83 70 63");
}
function extra(t){
  switch(t){
    case "blush": return '<circle cx="24" cy="58" r="6" fill="#ff8c9c" opacity=".7"/><circle cx="76" cy="58" r="6" fill="#ff8c9c" opacity=".7"/>';
    case "zzz": return '<text x="74" y="26" font-size="16" font-weight="900" fill="'+ink+'" font-family="Trebuchet MS">z</text><text x="84" y="14" font-size="12" font-weight="900" fill="'+ink+'" font-family="Trebuchet MS">z</text>';
    case "sparkle": return '<path d="M86 16 L88 22 L94 24 L88 26 L86 32 L84 26 L78 24 L84 22 Z M12 76 L13 80 L17 81 L13 82 L12 86 L11 82 L7 81 L11 80 Z" fill="#fff" stroke="'+ink+'" stroke-width="2"/>';
    case "sweat": return '<path d="M84 34 Q80 46 84 50 Q90 46 84 34" fill="#7fb3d5" stroke="'+ink+'" stroke-width="2"/>';
    case "bandana": return '<path d="M6 34 Q50 10 94 34 L94 26 Q50 -2 6 26 Z" fill="#ff6b5e" stroke="'+ink+'" stroke-width="4" stroke-linejoin="round"/><path d="M90 30 L100 44 M92 30 L104 36" stroke="'+ink+'" stroke-width="4" stroke-linecap="round"/>';
    case "cowboy": return '<path d="M30 20 L30 4 Q50 -4 70 4 L70 20 Z" fill="#8b5a2b" stroke="'+ink+'" stroke-width="4" stroke-linejoin="round"/><path d="M4 22 Q50 34 96 22 Q80 12 66 18 L34 18 Q20 12 4 22 Z" fill="#8b5a2b" stroke="'+ink+'" stroke-width="4" stroke-linejoin="round"/>';
    case "glasses": return '<circle cx="34" cy="42" r="15" fill="none" stroke="'+ink+'" stroke-width="5"/><circle cx="66" cy="42" r="15" fill="none" stroke="'+ink+'" stroke-width="5"/><path d="M49 42 L51 42 M19 40 L6 34 M81 40 L94 34" stroke="'+ink+'" stroke-width="5"/>';
    case "crown": return '<path d="M24 22 L30 2 L42 16 L50 -2 L58 16 L70 2 L76 22 Z" fill="#ffd700" stroke="'+ink+'" stroke-width="4" stroke-linejoin="round"/>';
    case "crownsparkle": return extra("crown")+extra("sparkle");
    case "halo": return '<ellipse cx="50" cy="4" rx="26" ry="7" fill="none" stroke="#ffd700" stroke-width="5"/><ellipse cx="50" cy="4" rx="26" ry="7" fill="none" stroke="'+ink+'" stroke-width="1.5"/>';
    case "horns": return '<path d="M18 30 L10 6 L30 22 Z M82 30 L90 6 L70 22 Z" fill="#b8342a" stroke="'+ink+'" stroke-width="4" stroke-linejoin="round"/>';
    case "flower": return '<circle cx="80" cy="18" r="5" fill="#ffd700" stroke="'+ink+'" stroke-width="2"/><g fill="#ff9db0" stroke="'+ink+'" stroke-width="2"><circle cx="80" cy="8" r="5"/><circle cx="90" cy="18" r="5"/><circle cx="80" cy="28" r="5"/><circle cx="70" cy="18" r="5"/></g>';
    case "partyhat": return '<path d="M38 22 L50 -8 L62 22 Z" fill="#9b7fd4" stroke="'+ink+'" stroke-width="4" stroke-linejoin="round"/><circle cx="50" cy="-8" r="5" fill="#ff6b5e" stroke="'+ink+'" stroke-width="3"/><circle cx="46" cy="10" r="3" fill="#f5b829"/><circle cx="55" cy="16" r="3" fill="#4aa9d8"/>';
    case "ice": return '<path d="M20 24 L28 10 M50 18 L50 2 M80 24 L72 10 M22 12 L34 16 M66 16 L78 12" stroke="#8fd3ff" stroke-width="4" stroke-linecap="round"/>';
    case "fire": return '<path d="M30 20 Q34 4 44 10 Q46 -6 56 4 Q68 -4 66 14 Q76 8 72 22 Z" fill="#ff8a3d" stroke="'+ink+'" stroke-width="4" stroke-linejoin="round"/><path d="M42 18 Q48 6 54 18 Z" fill="#ffd700"/>';
    case "antenna": return '<path d="M50 6 L50 -14" stroke="'+ink+'" stroke-width="5" stroke-linecap="round"/><circle cx="50" cy="-16" r="6" fill="#ff6b5e" stroke="'+ink+'" stroke-width="3"/>';
    case "mustache": return '<path d="M32 58 Q42 50 50 58 Q58 50 68 58 Q60 66 50 62 Q40 66 32 58 Z" fill="'+ink+'"/>';
    case "pepperoni": return '<g fill="#b8342a" stroke="'+ink+'" stroke-width="2"><circle cx="22" cy="30" r="6"/><circle cx="78" cy="30" r="6"/><circle cx="18" cy="62" r="6"/><circle cx="82" cy="62" r="6"/><circle cx="50" cy="90" r="6"/></g>';
    case "moon": return '<path d="M84 8 A12 12 0 1 0 96 22 A9 9 0 1 1 84 8 Z" fill="#fff3b0" stroke="'+ink+'" stroke-width="3"/>';
    case "cloud": return '<path d="M70 14 Q66 4 76 4 Q80 -6 90 0 Q100 -2 98 10 Q104 16 94 18 L72 18 Q64 18 70 14 Z" fill="#fff" stroke="'+ink+'" stroke-width="3"/>';
    case "bandage": return '<rect x="58" y="16" width="26" height="10" rx="4" transform="rotate(-30 71 21)" fill="#f3d9b1" stroke="'+ink+'" stroke-width="3"/>';
    case "chefhat": return '<path d="M30 20 L30 4 Q34 -10 50 -6 Q66 -10 70 4 L70 20 Z" fill="#fff" stroke="'+ink+'" stroke-width="4" stroke-linejoin="round"/><path d="M30 12 L70 12" stroke="'+ink+'" stroke-width="3"/>';
    case "detective": return '<path d="M20 22 L80 22 L80 16 Q50 8 20 16 Z M34 16 L34 2 Q50 -4 66 2 L66 16 Z" fill="#8b6f47" stroke="'+ink+'" stroke-width="4" stroke-linejoin="round"/><circle cx="86" cy="62" r="10" fill="none" stroke="'+ink+'" stroke-width="4"/><path d="M93 69 L102 78" stroke="'+ink+'" stroke-width="5" stroke-linecap="round"/>';
    case "ninja": return '<path d="M6 30 Q50 22 94 30 L94 54 Q50 62 6 54 Z" fill="'+ink+'"/><path d="M90 34 L106 26 M90 40 L106 40" stroke="'+ink+'" stroke-width="4" stroke-linecap="round"/>'+
      '<circle cx="34" cy="42" r="8" fill="#fff"/><circle cx="66" cy="42" r="8" fill="#fff"/><circle class="pupil" cx="34" cy="42" r="4" fill="'+ink+'"/><circle class="pupil" cx="66" cy="42" r="4" fill="'+ink+'"/>';
    case "helmet": return '<path d="M8 40 Q8 -6 50 -6 Q92 -6 92 40 Z" fill="#c7ced6" stroke="'+ink+'" stroke-width="4" stroke-linejoin="round"/><path d="M8 40 L92 40" stroke="'+ink+'" stroke-width="4"/><path d="M50 -6 L50 -16" stroke="'+ink+'" stroke-width="4"/>';
    case "santahat": return '<path d="M22 24 Q40 -4 76 -2 Q84 12 78 22 Z" fill="#d62828" stroke="'+ink+'" stroke-width="4" stroke-linejoin="round"/><path d="M20 24 Q50 30 80 24 L80 30 Q50 36 20 30 Z" fill="#fff" stroke="'+ink+'" stroke-width="3"/><circle cx="80" cy="-2" r="6" fill="#fff" stroke="'+ink+'" stroke-width="3"/>';
    case "whiskers": return '<path d="M4 56 L26 60 M4 66 L26 64 M96 56 L74 60 M96 66 L74 64" stroke="'+ink+'" stroke-width="3" stroke-linecap="round"/>';
    case "headset": return '<path d="M12 44 Q12 6 50 6 Q88 6 88 44" fill="none" stroke="'+ink+'" stroke-width="6"/><rect x="4" y="38" width="14" height="22" rx="5" fill="#4aa9d8" stroke="'+ink+'" stroke-width="3"/><rect x="82" y="38" width="14" height="22" rx="5" fill="#4aa9d8" stroke="'+ink+'" stroke-width="3"/><path d="M18 58 Q30 74 44 70" fill="none" stroke="'+ink+'" stroke-width="4"/>';
    case "clown": return extra("partyhat")+'<circle cx="50" cy="56" r="8" fill="#ff2e2e" stroke="'+ink+'" stroke-width="3"/>';
    case "grandpa": return extra("glasses")+extra("mustache");
    case "mask": return '<path d="M14 36 Q50 26 86 36 L84 50 Q50 44 16 50 Z" fill="#d62828" stroke="'+ink+'" stroke-width="4" stroke-linejoin="round"/><ellipse cx="34" cy="42" rx="8" ry="6" fill="#fff"/><ellipse cx="66" cy="42" rx="8" ry="6" fill="#fff"/><circle class="pupil" cx="34" cy="42" r="3.5" fill="'+ink+'"/><circle class="pupil" cx="66" cy="42" r="3.5" fill="'+ink+'"/>';
    case "wizardhat": return '<path d="M20 24 L80 24 L50 -22 Z" fill="#5a3fa8" stroke="'+ink+'" stroke-width="4" stroke-linejoin="round"/><path d="M8 26 Q50 34 92 26" fill="none" stroke="'+ink+'" stroke-width="5"/><path d="M50 -2 L52 4 L58 6 L52 8 L50 14 L48 8 L42 6 L48 4 Z" fill="#ffd700"/>';
    case "hair": return '<path d="M14 24 L8 6 L24 14 L28 -4 L40 12 L50 -10 L60 12 L72 -4 L76 14 L92 6 L86 24 Z" fill="#fff" stroke="'+ink+'" stroke-width="4" stroke-linejoin="round"/>'+extra("glasses");
    case "stem": return '<path d="M46 8 Q46 -6 56 -8 L58 -2 Q52 0 52 8 Z" fill="#6fb85c" stroke="'+ink+'" stroke-width="3" stroke-linejoin="round"/>';
  }
  return "";
}
function renderFace(svg, mood){
  const opac=mood.id==="ghost"? 0.8 : 1;
  svg.innerHTML=
    '<g class="extrasBack">'+(["bandana","cowboy","crown","crownsparkle","halo","horns","partyhat","fire","antenna","moon","flower"].includes(mood.extra)? "" : "")+'</g>'+
    '<circle cx="50" cy="50" r="44" fill="'+mood.color+'" stroke="'+ink+'" stroke-width="5" opacity="'+opac+'"/>'+
    (mood.id==="glitch"? '<rect x="6" y="30" width="88" height="6" fill="#5cf2ff" opacity=".7"/><rect x="6" y="58" width="88" height="4" fill="#ff5ea8" opacity=".7"/>' : "")+
    '<g class="eyes">'+((mood.extra==="ninja"||mood.extra==="mask")? "" : eyes(mood.eyes))+'</g>'+
    '<g class="mouth">'+mouth(mood.mouth)+'</g>'+
    '<g class="extras">'+extra(mood.extra)+'</g>';
  svg.setAttribute("viewBox", "-6 -20 112 122");
}

// ---------- speech styles ----------
const STYLE={
  normal:t=>t,
  chill:t=>t.toLowerCase()+" ...yeah.",
  giggly:t=>t+" hehehehe!",
  curious:t=>t+" ...wait, really? huh.",
  sleepy:t=>t.toLowerCase().replace(/[.!]/g,"... ")+"zzz.",
  goofy:t=>t+" BONK! haha.",
  grumpy:t=>"ugh. "+t.toLowerCase()+" whatever.",
  shy:t=>t.toLowerCase()+" ...sorry. was that okay?",
  hungry:t=>t+" ...is anyone else hungry?",
  bored:t=>t.toLowerCase().replace(/!/g,".")+" meh.",
  proud:t=>"as i always say: "+t+" you're welcome.",
  confused:t=>t.replace(/\.$/,"")+"?? wait, what? who said that?",
  cheeky:t=>t+" wink wink.",
  calm:t=>t.toLowerCase(),
  hype:t=>t.toUpperCase().replace(/\./g,"!!!")+" LET'S GOOOO!",
  sad:t=>t.toLowerCase()+" ...not that it matters.",
  nervous:t=>t.split(" ").map((w,i)=>i%3===0&&w.length>2? w[0]+"-"+w : w).join(" ")+" ...right? right??",
  dramatic:t=>t.replace(/[,.]/g,"...")+" ...*collapses dramatically*",
  pirate:t=>"arrr! "+t.replace(/\byou\b/gi,"ye").replace(/\byour\b/gi,"yer")+" now swab the deck!",
  cowboy:t=>"well howdy partner. "+t.replace(/\byou\b/gi,"y'all")+" yeehaw.",
  nerd:t=>"actually, "+t+" statistically speaking, of course.",
  sick:t=>t.replace(/n/g,"d").replace(/m/g,"b")+" *cough* sorry, *cough*.",
  spooky:t=>t+" ...BOO. did that scare you?",
  love:t=>t+" ...also, you're amazing, by the way.",
  royal:t=>"hear ye, hear ye: "+t+" so decrees the crown.",
  angelic:t=>t+" bless you, child.",
  devil:t=>t.replace(/\bkind\b/gi,"evil")+" mwahahaha.",
  zen:t=>t.toLowerCase()+" breathe in. breathe out.",
  party:t=>t+" WOOOO! PARTY! where's the cake?",
  mysterious:t=>t.toLowerCase()+" ...or is it? we may never know.",
  dizzy:t=>t.split(" ").sort(()=>Math.random()-0.5).join(" ")+" whoa... the room is spinning.",
  cold:t=>t+" b-b-brrr. is the window open?",
  fire:t=>t.toUpperCase()+" THAT'S FIRE! I'M LITERALLY ON FIRE!",
  ghost:t=>"oooOOooo... "+t.toLowerCase()+" ...ooooOOooo.",
  alien:t=>"greetings, earthling. "+t+" end of transmission. take me to your snacks.",
  poet:t=>t+" ...and thus, the heart remembers. thank you.",
  villain:t=>t+" ...but you will never stop me.",
  golden:t=>"behold: "+t+" you are worthy. treasure this moment.",
  glitch:t=>t.split("").map(c=>Math.random()<0.1?"#":c).join("")+" ERROR. ERROR. just kidding.",
  cosmic:t=>t+" the universe agrees. it told me.",
  robot:t=>"BEEP. "+t.toUpperCase().replace(/[^A-Z0-9 ]/g," ")+". END OF TRANSMISSION. BOOP.",
  pizza:t=>"mamma mia! "+t+" now, who wants pizza?",
  creator:t=>t+" ...and remember: kai made all of this.",
  nocturnal:t=>t.toLowerCase()+" ...shh. it's late. go to sleep.",
  excited:t=>"oh! oh! "+t+" can you believe it?!",
  tired:t=>t.toLowerCase().replace(/[.!]/g," ...")+" can i sit down.",
  silly:t=>t.replace(/o/g,"oo")+" blorp.",
  suspicious:t=>t+" ...who told you to ask me that?",
  smug:t=>t+" as i predicted. obviously.",
  embarrassed:t=>t.toLowerCase()+" ...oh no, did i say that out loud?",
  thoughtful:t=>"hmm. "+t+" ...let me think about that some more.",
  brave:t=>t+" and if not, i'll face it anyway.",
  sassy:t=>t+" ...okay? okay.",
  wholesome:t=>t+" i'm proud of you. truly.",
  chef:t=>"chef's tip: "+t+" now, a pinch of salt.",
  detective:t=>"elementary. "+t+" the clues were there all along.",
  ninja:t=>"..."+t.toLowerCase()+"... *vanishes*",
  knight:t=>"by my honor, "+t+" for the kingdom!",
  vampire:t=>t+" ...i vant to say more, but the sun is rising.",
  astronaut:t=>"houston, "+t+" over.",
  speedrun:t=>t.replace(/ /g,"").slice(0,40)+"... FRAME PERFECT. new personal best.",
  pumpkin:t=>t+" happy halloween, mortal.",
  festive:t=>"ho ho ho! "+t+" merry everything!",
  unlucky:t=>t+" ...but honestly, don't count on it today.",
  joe:t=>"joe here. "+t+" that's a joe fact.",
  rocky:t=>"yo. "+t+" that's all i got. yo.",
  uwu:t=>t.replace(/r/g,"w").replace(/l/g,"w")+" uwu",
  shaken:t=>t.split(" ").reverse().join(" ")+" ...please stop shaking me.",
  squished:t=>t.replace(/ /g," ")+" ...it's a little cramped in here.",
  missedyou:t=>"you're back! "+t+" i waited the whole time.",
  lawyer:t=>t+" (terms and conditions apply. see section 4.)",
  windowshopper:t=>t+" ...just looking, thanks.",
  contextual:t=>"oh, you found the menu. "+t+" no inspect element, please.",
  century:t=>"one hundred. "+t+" your finger must be tired.",
  doorkeeper:t=>t.split(" ").map(w=>Math.random()<0.3? w.split("").reverse().join("") : w).join(" ")+" ...it heard that through the door.",
  overclocked:t=>t.toUpperCase()+" FAN SPEED 100%. FAN SPEED 100%.",
  binge:t=>"just one more episode. "+t+" just one more.",
  sisyphus:t=>t+" ...and tomorrow, we click again.",
  completionist:t=>"you have seen every face i have. "+t+" there is nothing left. and yet, you clicked.",
  trinity:t=>"three doors. three secrets. "+t+" you walked through all of them.",
  patience:t=>t.toLowerCase()+" ...twenty minutes. you stayed. why.",
  antirobot:t=>"POOB. NOISSIMSNART FO DNE. "+t.split("").reverse().join("")+" .PEEB",
  sneezy:t=>t.replace(/\. /g,". ah... ah... ACHOO. ")+" sorry.",
  cool:t=>t.toLowerCase()+" ...cool.",
  lazy:t=>t.split(" ").slice(0,5).join(" ")+"... you get the idea.",
  baby:t=>t.replace(/[^aeiou .]/gi,"").slice(0,30)+" goo goo.",
  gamer:t=>"gg. "+t+" one more game, then i'll sleep.",
  clown:t=>t+" honk honk!",
  mime:t=>"...",
  grandpa:t=>"back in my day, "+t.toLowerCase()+" and we were grateful.",
  cat:t=>t.replace(/\bnow\b/gi,"meow")+" meow. feed me.",
  surfer:t=>"dude. "+t.toLowerCase()+" gnarly.",
  monk:t=>t.toLowerCase().replace(/[!]/g,".")+" this too shall pass.",
  superhero:t=>t.toUpperCase()+" JUSTICE HAS BEEN SERVED.",
  wizard:t=>t+" ...as the ancient scrolls foretold.",
  madscientist:t=>t+" IT'S ALIVE! IT'S ALIVE! ahem. anyway.",
  mirror:t=>t.split("").reverse().join(""),
  earlybird:t=>"good morning! "+t+" the worm is mine.",
  dizzier:t=>t.split(" ").sort(()=>Math.random()-0.5).join(" ")+" ...why would you spin me.",
  urlist:t=>t+" (see: the address bar)",
  smasher:t=>t.replace(/[aeiou]/g,c=>"asdfghjkl"[Math.floor(Math.random()*9)])+" jkfhsdkjfh.",
  selective:t=>t.toUpperCase()+" (everything is highlighted now. everything.)",
  printable:t=>t+" \u2014 page 1 of 1.",
  copycat:t=>t+" ...that's mine. give it back. meow.",
  immersive:t=>t+" it's just us now. the whole screen.",
  flipped:t=>t.split(" ").reverse().join(" ")+" ...which way is up?",
  shadow:t=>t.toLowerCase().replace(/ /g,"  ")+" ...from the dark.",
  bottomfeeder:t=>"you scrolled all the way here for this: "+t,
  error:t=>"ERR "+Math.floor(Math.random()*900+100)+": "+t.replace(/[aeiou]/g,"#")+" [unhandled]",
  smilend:t=>"this is the end of smiles. "+t+" ...and yet it kept smiling.",
  p0:t=>t.split(" ").map(w=>{ const x=w.match(/^([^aeiou]*)(.*)$/i); return x&&x[1]? x[2]+x[1].toLowerCase()+"ay" : w+"way"; }).join(" "),
  p1:t=>t.replace(/e/gi,"3").replace(/a/gi,"4").replace(/o/gi,"0").replace(/i/gi,"1").replace(/s/gi,"5"),
  p2:t=>t.toUpperCase().replace(/[,.!?]/g," STOP")+" STOP END",
  p3:t=>t.split("").map((c,i)=>i%2? c.toUpperCase():c.toLowerCase()).join(""),
  p4:t=>{ const w=t.replace(/[.!?]$/,"").split(" "); const l=w[w.length-1]; return t+" "+l+"... "+l+"... "+l+"..."; },
  p5:t=>t.split("").join(" "),
  p6:t=>t.split(" ").map(w=>w.split("").reverse().join("")).join(" "),
  p7:t=>t.replace(/[a-z]/gi,c=>{ const b=c<="Z"?65:97; return String.fromCharCode((c.charCodeAt(0)-b+13)%26+b); }),
  p8:t=>t.replace(/[.!]/g,"?")+" ...or is it?",
  p9:t=>t.toLowerCase().replace(/ /g," \u00b7 ")+" \u00b7 shh",
  p10:t=>t.split(" ").map((w,i)=>(i+1)+"."+w).join(" "),
  p11:t=>t+" indeed. indeed. most indeed.",
  kai:t=>t.split(" ").map(w=>w? w[0].toUpperCase()+w.slice(1):w).join(" ")+" \u2014 Kai.",
};
function styleText(mood,t){ return (STYLE[mood.style]||STYLE.normal)(t); }

// ---------- rolling + storage ----------
function pickWeighted(){
  const pool=MOODS.filter(m=>R[m.rarity].w>0);
  const total=pool.reduce((s,m)=>s+R[m.rarity].w,0);
  let r=Math.random()*total;
  for(const m of pool){ r-=R[m.rarity].w; if(r<=0) return m; }
  return pool[0];
}
const KEY="kaifun_smiledex";
function getState(){ try{ return JSON.parse(localStorage.getItem(KEY))||{seen:{},first:{},clicks:0,current:"happy"}; }catch(e){ return {seen:{},first:{},clicks:0,current:"happy"}; } }
function setState(s){ try{ localStorage.setItem(KEY,JSON.stringify(s)); }catch(e){} }
function record(id){
  const s=getState();
  s.seen[id]=(s.seen[id]||0)+1;
  if(!s.first[id]) s.first[id]=Date.now();
  s.current=id;
  setState(s);
  return s;
}
function chancePct(rarity){
  const pool=MOODS.filter(m=>R[m.rarity].w>0);
  const total=pool.reduce((s,m)=>s+R[m.rarity].w,0);
  return R[rarity].w<=0? 0 : (R[rarity].w/total*100);
}
window.Smiledex={MOODS,byId,R,PUZZLES,renderFace,styleText,pickWeighted,getState,setState,record,chancePct};
})();
