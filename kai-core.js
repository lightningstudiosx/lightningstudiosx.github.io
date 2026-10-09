/* KAIISM core — the single source of truth for the Kai language (Kaihana),
   Kaiscript, Kai numbers, Kai Time, the passport and the shared nav.
   Every KAIISM page loads this before its own script. Exposes window.KAI. */
(function () {
'use strict';
const KAI = {};

/* ================= Kaihana: sounds & letters ================= */
// 17 letters. Every letter always makes one sound. Syllables are (C)V or (C)Vn.
KAI.ALPHABET = ['a','e','i','o','u','k','t','p','m','n','s','l','r','h','y','w','z'];
KAI.LETTER_INFO = {
  a:{sound:'ah, as in "father"',name:'a'}, e:{sound:'eh, as in "bed"',name:'e'}, i:{sound:'ee, as in "see"',name:'i'},
  o:{sound:'oh, as in "go"',name:'o'}, u:{sound:'oo, as in "moon"',name:'u'},
  k:{sound:'k, as in "kite"',name:'ka'}, t:{sound:'t, as in "top"',name:'ta'}, p:{sound:'p, as in "pig"',name:'pa'},
  m:{sound:'m, as in "map"',name:'ma'}, n:{sound:'n, as in "net"',name:'na'}, s:{sound:'s, as in "sun" (never z)',name:'sa'},
  l:{sound:'l, as in "lamp"',name:'la'}, r:{sound:'a quick tapped r, like "butter" said fast',name:'ra'},
  h:{sound:'h, as in "hat"',name:'ha'}, y:{sound:'y, as in "yes" (always a consonant)',name:'ya'},
  w:{sound:'w, as in "win"',name:'wa'}, z:{sound:'z, as in "zoo"',name:'za'}
};
KAI.VOWELS = ['a','e','i','o','u'];
// English letters Kaihana lacks, for writing foreign names in Kaiscript
KAI.LOAN_MAP = {b:'p',c:'k',d:'t',f:'p',g:'k',j:'y',q:'k',v:'w',x:'ks'};

/* ================= Kaihana dictionary =================
   kai | english (main gloss) | part of speech | category | other English words that map to it */
const RAW = `
sa|to be (is, am, are)|part|grammar|is,am,are,be,was,were,been,being
nai|not|part|grammar|not,don't,doesn't,didn't,won't,isn't,aren't,can't,never
pa|(past tense: before the verb)|part|grammar|
wo|(future tense: before the verb)|part|grammar|will,shall,gonna
ke|(question: end of a sentence)|part|grammar|
ni|of (shows who owns something)|part|grammar|of,'s
mo|very|adv|grammar|really,so,too
li|(plural: added to the end of a noun)|suffix|grammar|
ka|and|conj|grammar|and
ola|or|conj|grammar|or
kosu|because|conj|grammar|because,since
wen|if|conj|grammar|if
ten|then|conj|grammar|then
temu|with|prep|grammar|with
ana|in, at, on|prep|grammar|in,at,on,inside
lo|to, toward|prep|grammar|to,toward,towards,into
ri|from|prep|grammar|from
kan|can (be able to)|part|grammar|can,could,able
musa|must, have to|part|grammar|must,should
mi|I, me|pron|people|i,me,myself
tu|you|pron|people|you,yourself
ya|he, she, it|pron|people|he,she,it,him,her,itself
mili|we, us|pron|people|we,us
tuli|you all|pron|people|y'all,yall
yali|they, them|pron|people|they,them
si|this|pron|grammar|this,these
so|that|pron|grammar|that,those
sin|here|adv|grammar|here
son|there|adv|grammar|there
kumi|all, every|adj|grammar|all,every,everyone,everything,each
tan|some|adj|grammar|some,any
kaiyo|hello|interj|greetings|hello,hi,hey
yosen|goodbye|interj|greetings|goodbye,bye
arima|thank you|interj|greetings|thanks,thank
puri|please|interj|greetings|please
un|yes|interj|greetings|yes,yeah,yep,true
nu|no|interj|greetings|no,nope,false
sumen|sorry|interj|greetings|sorry,oops
kaiwen|good luck|interj|greetings|luck
temo|what|q|questions|what,which
kemo|who|q|questions|who,whom
remo|where|q|questions|where
wemo|when|q|questions|when
yemo|why|q|questions|why
hemo|how|q|questions|how
namo|how many|q|questions|
teno|person|n|people|person,human,someone,somebody
mosa|friend|n|people|friend,buddy,pal
kaina|family|n|people|family
mamu|mother|n|people|mom,mother,mum,mama
papu|father|n|people|dad,father,papa
riki|child, kid|n|people|child,kid,children,kids
nunu|baby|n|people|baby
sisa|brother or sister|n|people|brother,sister,sibling
tisa|teacher|n|people|teacher
manuto|student|n|people|student,learner,pupil
rasu|leader, boss|n|people|leader,boss,king,queen,chief
kaiteno|Kaiist (a person who lives the Kai way)|n|kai|kaiist
miwa|cat|n|animals|cat,kitten
wuwa|dog|n|animals|dog,puppy
piri|bird|n|animals|bird
yulo|fish|n|animals|fish
hosa|horse|n|animals|horse
momo|cow|n|animals|cow
monke|monkey|n|animals|monkey,monke,ape,gorilla
kero|frog|n|animals|frog,toad
tiku|bug|n|animals|bug,insect,ant,fly
humo|bear|n|animals|bear
sesa|snake|n|animals|snake
nesu|mouse|n|animals|mouse,mice,rat
hemi|sun|n|nature|sun,sunshine
nuwa|moon, month|n|nature|moon,month
siki|star|n|nature|star
amo|sky|n|nature|sky
wasu|water|n|nature|water
kenta|fire|n|nature|fire,flame
teru|ground, earth|n|nature|ground,earth,land,dirt
yenu|tree|n|nature|tree,wood
rira|flower|n|nature|flower
sasu|rain|n|nature|rain
yuwi|snow|n|nature|snow
wunu|wind|n|nature|wind
takan|mountain|n|nature|mountain,hill
awana|sea|n|nature|sea,ocean
roka|rock, stone|n|nature|rock,stone
pumu|cloud|n|nature|cloud
nesi|day|n|time|day,days
nuken|night|n|time|night,tonight
ima|now|adv|time|now
panesi|yesterday|adv|time|yesterday
imanesi|today|adv|time|today
wonesi|tomorrow|adv|time|tomorrow
kaiyu|time|n|time|time
neno|year|n|time|year
hiru|week|n|time|week
yamo|food|n|food|food,meal
tosu|bread, toast|n|food|bread,toast
apu|apple|n|food|apple
nana|banana|n|food|banana
pisa|pizza|n|food|pizza
keki|cake|n|food|cake
miru|milk|n|food|milk
amasu|candy|n|food|candy,sweets,chocolate
oyu|egg|n|food|egg
ramu|rice|n|food|rice
supu|soup|n|food|soup
kesu|cheese|n|food|cheese
uso|home, house|n|home|home,house
rumo|room|n|home|room
towa|door|n|home|door
minu|window|n|home|window
suyon|bed|n|home|bed
taru|table|n|home|table,desk
isu|chair|n|home|chair,seat
puku|book|n|home|book
sirinu|pen, pencil|n|home|pen,pencil
kopu|computer|n|home|computer,laptop,pc
hono|phone|n|home|phone
kaimo|game|n|play|game,games
malu|ball|n|play|ball
kaiku|toy|n|play|toy
manuya|school|n|school|school,class
woto|word|n|school|word
hanaso|language|n|school|language,tongue
Kaihana|the Kai language|n|kai|kaihana,kailang
namu|number|n|school|number
kotu|code|n|school|code,program
kiri|letter (of the alphabet)|n|school|letter
tomen|question|n|school|question
repa|answer|n|school|answer
kopa|head|n|body|head
mio|eye|n|body|eye
kunin|ear|n|body|ear
muna|mouth|n|body|mouth
temi|hand|n|body|hand,hands
pomi|foot|n|body|foot,feet,leg
kora|heart|n|body|heart
huru|hair|n|body|hair
ume|to have|v|verbs|have,has,had,got,own
ira|to go|v|verbs|go,goes,went,gone,going,leave
kema|to come|v|verbs|come,comes,came,coming,arrive
yami|to eat|v|verbs|eat,eats,ate,eaten,eating
suwi|to drink|v|verbs|drink,drinks,drank,drinking
mira|to see, to look|v|verbs|see,sees,saw,seen,look,looks,watch,watches
kuno|to hear, to listen|v|verbs|hear,hears,heard,listen,listens
hana|to say, to speak|v|verbs|say,says,said,speak,speaks,spoke,talk,talks,tell,told
sapi|to know|v|verbs|know,knows,knew,known
toma|to think|v|verbs|think,thinks,thought
wiso|to want|v|verbs|want,wants,wanted,wish
liko|to like|v|verbs|like,likes,liked,enjoy
lewi|to love|v|verbs|love,loves,loved
kaia|to play, to have fun|v|kai|play,plays,played,playing
teka|to make|v|verbs|make,makes,made,create
toro|to build|v|verbs|build,builds,built
sirin|to write|v|verbs|write,writes,wrote,written
rinu|to read|v|verbs|read,reads
tasa|to run|v|verbs|run,runs,ran,running
pomo|to walk|v|verbs|walk,walks,walked
suyu|to sleep|v|verbs|sleep,sleeps,slept
wesa|to wake up|v|verbs|wake,wakes,woke
teyo|to give|v|verbs|give,gives,gave,given
kapa|to take, to get|v|verbs|take,takes,took,get,gets
manu|to learn|v|verbs|learn,learns,learned,learnt,study
mano|to teach|v|verbs|teach,teaches,taught
yusa|to win|v|verbs|win,wins,won
losi|to lose|v|verbs|lose,loses,lost
kanta|to sing|v|verbs|sing,sings,sang
tanu|to dance|v|verbs|dance,dances,danced
pinu|to draw|v|verbs|draw,draws,drew
rota|to turn, to spin|v|verbs|turn,turns,turned,spin,rotate
kotan|to code|v|verbs|coding,programming
huma|to help|v|verbs|help,helps,helped
aku|to open|v|verbs|open,opens,opened
tesu|to close|v|verbs|close,closes,closed,shut
mitu|to find|v|verbs|find,finds,found
mata|to wait|v|verbs|wait,waits,waited
hasi|to start|v|verbs|start,starts,started,begin
tome|to stop|v|verbs|stop,stops,stopped,end
waha|to laugh|v|verbs|laugh,laughs,laughed
nako|to cry|v|verbs|cry,cries,cried
hopu|to jump|v|verbs|jump,jumps,jumped
yuyu|to swim|v|verbs|swim,swims,swam
pirin|to fly|v|verbs|fly,flies,flew
kaun|to buy|v|verbs|buy,buys,bought
uru|to sell|v|verbs|sell,sells,sold
seyo|to live|v|verbs|live,lives,lived
mesu|to need|v|verbs|need,needs,needed
lon|big|adj|adjectives|big,large,huge
piku|small|adj|adjectives|small,little,tiny
yosa|good|adj|adjectives|good,great,nice,fine
moka|bad|adj|adjectives|bad,awful
lumo|happy|adj|adjectives|happy,glad
heru|sad|adj|adjectives|sad,unhappy
sipa|fast|adj|adjectives|fast,quick,quickly
nolo|slow|adj|adjectives|slow,slowly
nia|new|adj|adjectives|new
kola|old|adj|adjectives|old
atu|hot|adj|adjectives|hot,warm
simu|cold|adj|adjectives|cold,cool
kai|fun|adj|kai|fun,funny
mun|boring|adj|adjectives|boring,dull
teki|smart|adj|adjectives|smart,clever
kosa|strong|adj|adjectives|strong
yamia|beautiful|adj|adjectives|beautiful,pretty
maku|many, a lot|adj|adjectives|many,much,lots
sen|few, a little|adj|adjectives|few
eza|easy|adj|adjectives|easy
kata|hard, difficult|adj|adjectives|hard,difficult
yamin|hungry|adj|adjectives|hungry
suyun|tired|adj|adjectives|tired,sleepy
kewa|cool, awesome|adj|adjectives|awesome
wiru|weird|adj|adjectives|weird,strange
ron|loud|adj|adjectives|loud
sisi|quiet|adj|adjectives|quiet
reka|red|adj|colors|red
aso|blue|adj|colors|blue
milo|green|adj|colors|green
kiwo|yellow|adj|colors|yellow
nuto|black|adj|colors|black,dark
hilo|white|adj|colors|white,light
rosa|pink|adj|colors|pink
oren|orange|adj|colors|orange
muru|purple|adj|colors|purple
kaimu|Kaiism, the way of fun|n|kai|kaiism
Kaiya|Kaiya, the Land of Fun|n|kai|kaiya
kaipasu|passport|n|kai|passport
`;
KAI.DICT = RAW.trim().split('\n').map(l => {
  const [kai, en, pos, cat, alts] = l.split('|');
  return { kai, en, pos, cat, alts: (alts || '').split(',').map(s => s.trim()).filter(Boolean) };
});
KAI.CATEGORIES = ['greetings','people','animals','nature','food','home','play','school','body','time','verbs','adjectives','colors','questions','grammar','kai'];
const byKai = new Map(KAI.DICT.map(d => [d.kai.toLowerCase(), d]));
const byEn = new Map();
for (const d of KAI.DICT) {
  const heads = d.en.replace(/\(.*?\)/g, '').split(/[,]/).map(s => s.replace(/^to /, '').trim().toLowerCase()).filter(Boolean);
  for (const w of heads.concat(d.alts)) if (w && !byEn.has(w)) byEn.set(w, d);
}
KAI.lookupKai = w => byKai.get(String(w).toLowerCase()) || null;
KAI.lookupEn = w => byEn.get(String(w).toLowerCase()) || null;
// tolerant English lookup: handles plurals and -ing/-ed. Returns {entry, plural}
KAI.lookupEnLoose = function (w) {
  w = String(w).toLowerCase().replace(/[^a-z']/g, '');
  if (!w) return null;
  let d = byEn.get(w); if (d) return { entry: d, plural: false };
  const tries = [[/ies$/, 'y'], [/ves$/, 'f'], [/es$/, ''], [/s$/, ''], [/ing$/, ''], [/ing$/, 'e'], [/ed$/, ''], [/ed$/, 'e'], [/d$/, '']];
  for (const [re, rep] of tries) if (re.test(w)) { d = byEn.get(w.replace(re, rep)); if (d) return { entry: d, plural: /s$/.test(w) && d.pos === 'n' }; }
  return null;
};

/* ================= Kaihana grammar (reference text for lessons & docs) ================= */
KAI.GRAMMAR = [
  { id:'sounds', title:'Sounds', rule:'17 letters, one sound each. Stress the first syllable. Every syllable is a consonant + vowel (ka, mi), sometimes ending in n (kan, sen).', ex:[['kaiyo','hello'],['miwa','cat']] },
  { id:'order', title:'Word order', rule:'Subject, then verb, then object — like English.', ex:[['mi liko miwa','I like cats'],['ya yami apu','she eats an apple']] },
  { id:'no-articles', title:'No "a" or "the"', rule:'Kaihana has no words for "a", "an" or "the". Just drop them.', ex:[['mi mira wuwa','I see a dog / I see the dog']] },
  { id:'be', title:'sa = to be', rule:'"sa" means is / am / are. Use it with adjectives and nouns.', ex:[['mi sa lumo','I am happy'],['miwa sa piku','the cat is small']] },
  { id:'adj', title:'Describing words go after', rule:'Adjectives come AFTER the noun. Put "mo" before an adjective for "very". The one exception is counting words — numbers, kumi (every), tan (some), maku (many) and sen (few) go BEFORE the noun.', ex:[['miwa piku','a small cat'],['wuwa mo lon','a very big dog'],['kumi nesi','every day']] },
  { id:'plural', title:'Plurals: -li', rule:'Add -li to make a noun plural. After a number you do not need -li.', ex:[['miwali','cats'],['tawa miwa','two cats']] },
  { id:'not', title:'Not: nai', rule:'Put "nai" right before the verb (or before sa).', ex:[['mi nai liko keki','I do not like cake'],['ya nai sa suyun','he is not tired']] },
  { id:'tense', title:'Past and future', rule:'Verbs never change. Put "pa" before the verb for the past and "wo" for the future. "nai" goes first.', ex:[['mi pa yami','I ate'],['mili wo ira','we will go'],['mi nai pa mira','I did not see']] },
  { id:'question', title:'Yes/no questions: ke', rule:'Put "ke" at the end to turn a sentence into a yes/no question. Answer with un (yes) or nu (no).', ex:[['tu liko pisa ke?','do you like pizza?'],['un, mi liko pisa','yes, I like pizza']] },
  { id:'qwords', title:'Question words end in -emo', rule:'temo what, kemo who, remo where, wemo when, yemo why, hemo how, namo how many. They stay where the answer would go. No "ke" needed.', ex:[['tu liko temo?','what do you like?'],['tu seyo remo?','where do you live?']] },
  { id:'own', title:'Owning things: ni', rule:'"X ni Y" means Y\'s X. "ni mi" = my, "ni tu" = your.', ex:[['miwa ni mi','my cat'],['uso ni Kai','Kai\'s house']] },
  { id:'prep', title:'Little place words', rule:'ana (in/at/on), lo (to), ri (from), temu (with) go before the noun.', ex:[['mi ana uso','I am at home'],['ya ira lo manuya','she goes to school']] },
  { id:'command', title:'Commands', rule:'Start with the verb. Add "puri" (please) at the front to be polite.', ex:[['yami!','eat!'],['puri huma mi','please help me']] },
  { id:'modal', title:'Can and must', rule:'Put "kan" (can) or "musa" (must) right before the verb.', ex:[['mi kan yuyu','I can swim'],['tu musa suyu','you must sleep']] },
  { id:'words', title:'Building new words', rule:'-ya = place, -to = person who does it, -ko = thing. manu (learn) → manuya (school), manuto (student).', ex:[['manuya','school (learn-place)'],['kaiteno','Kaiist (fun-person)']] },
  { id:'numbers', title:'Numbers', rule:'Build big numbers like counting out loud: tens, then ones. 10 is kaito, 100 is honu, 1000 is salu.', ex:[['tawa kaito mito','23'],['honu pana','105']] }
];

/* ================= numbers ================= */
KAI.DIGITS = ['zen','ika','tawa','mito','seka','pana','rolu','hesu','yawa','nomi'];
function under1000(n) {
  const out = [], h = Math.floor(n / 100), t = Math.floor(n % 100 / 10), o = n % 10;
  if (h) out.push(h === 1 ? 'honu' : KAI.DIGITS[h] + ' honu');
  if (t) out.push(t === 1 ? 'kaito' : KAI.DIGITS[t] + ' kaito');
  if (o) out.push(KAI.DIGITS[o]);
  return out.join(' ');
}
KAI.numberToKai = function (n) {
  n = Math.floor(Math.abs(+n || 0));
  if (n === 0) return 'zen';
  if (n >= 1e6) return String(n);
  const th = Math.floor(n / 1000), rest = n % 1000, out = [];
  if (th) out.push(th === 1 ? 'salu' : under1000(th) + ' salu');
  if (rest) out.push(under1000(rest));
  return out.join(' ');
};
KAI.kaiToNumber = function (s) {
  const w = String(s).toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!w.length) return null;
  let total = 0, cur = 0, pend = null;
  for (const x of w) {
    const d = KAI.DIGITS.indexOf(x);
    if (d >= 0) { if (pend !== null) return null; pend = d; continue; }
    if (x === 'kaito') { cur += (pend === null ? 1 : pend) * 10; pend = null; continue; }
    if (x === 'honu') { cur += (pend === null ? 1 : pend) * 100; pend = null; continue; }
    if (x === 'salu') { cur += (pend || 0); total += (cur || 1) * 1000; cur = 0; pend = null; continue; }
    return null;
  }
  return total + cur + (pend || 0);
};

/* ================= Kaiscript ================= */
// Each glyph lives on a 3×3 dot grid: 0 1 2 / 3 4 5 / 6 7 8.
// s = strokes between grid points, d = dots on grid points, o = ring around the centre.
KAI.GLYPHS = {
  a:{s:[[3,5]],d:[1]},            e:{s:[[3,5]],d:[7]},          i:{s:[[4,7]],d:[1]},
  o:{o:1},                          u:{s:[[0,6],[6,8],[8,2]]},
  k:{s:[[0,2],[1,7],[6,8]]},       t:{s:[[0,2],[2,8]]},          p:{s:[[0,6],[0,2],[2,5],[5,3]]},
  m:{s:[[6,1],[1,8]]},             n:{s:[[0,7],[7,2]]},          s:{s:[[0,4],[4,8]],d:[2]},
  l:{s:[[0,6],[6,8]]},             r:{s:[[6,0],[0,5]]},          h:{s:[[0,6],[2,8],[3,5]]},
  y:{s:[[0,4],[2,4],[4,7]]},       w:{s:[[0,3],[3,5],[5,2]],d:[7]}, z:{s:[[0,2],[2,6],[6,8]]}
};
const PT = i => [ (i % 3) * 0.5, Math.floor(i / 3) * 0.5 ];
KAI.translit = function (text) {
  return String(text).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[bcdfgjqvx]/g, c => KAI.LOAN_MAP[c]);
};
// Returns an SVG string. opts: size (px per glyph height), color, weight, gap
KAI.scriptSVG = function (text, opts = {}) {
  const size = opts.size || 32, color = opts.color || 'currentColor', sw = opts.weight || Math.max(1.6, size / 11);
  const t = KAI.translit(text), cell = 0.78, gap = opts.gap != null ? opts.gap : 0.34, pad = 0.12;
  let x = pad, y0 = pad, parts = [], lines = 0;
  for (const ch of t) {
    const g = KAI.GLYPHS[ch];
    if (g) {
      const P = i => { const p = PT(i); return [(x + p[0] * cell).toFixed(3), (y0 + p[1] * cell).toFixed(3)]; };
      for (const [a, b] of (g.s || [])) { const A = P(a), B = P(b); parts.push(`<line x1="${A[0]}" y1="${A[1]}" x2="${B[0]}" y2="${B[1]}"/>`); }
      for (const d of (g.d || [])) { const A = P(d); parts.push(`<circle cx="${A[0]}" cy="${A[1]}" r="0.075" fill="${color}" stroke="none"/>`); }
      if (g.o) { const A = P(4); parts.push(`<circle cx="${A[0]}" cy="${A[1]}" r="${(cell * 0.42).toFixed(3)}" fill="none"/>`); }
      x += cell + gap;
    } else if (/[0-9]/.test(ch)) {
      const n = +ch;
      if (n === 0) { parts.push(`<circle cx="${(x + cell / 2).toFixed(3)}" cy="${(y0 + cell / 2).toFixed(3)}" r="0.12" fill="none"/>`); }
      for (let k = 0; k < n; k++) { const p = PT(k); parts.push(`<circle cx="${(x + p[0] * cell).toFixed(3)}" cy="${(y0 + p[1] * cell).toFixed(3)}" r="0.09" fill="${color}" stroke="none"/>`); }
      parts.push(`<line x1="${(x - 0.06).toFixed(3)}" y1="${(y0 + cell + 0.1).toFixed(3)}" x2="${(x + cell + 0.06).toFixed(3)}" y2="${(y0 + cell + 0.1).toFixed(3)}"/>`);
      x += cell + gap;
    } else if (ch === ' ') { x += cell * 0.7; }
    else if (ch === '.' || ch === '!' ) { parts.push(`<circle cx="${(x + 0.06).toFixed(3)}" cy="${(y0 + cell).toFixed(3)}" r="0.07" fill="${color}" stroke="none"/>`); if (ch === '!') parts.push(`<line x1="${(x + 0.06).toFixed(3)}" y1="${y0.toFixed(3)}" x2="${(x + 0.06).toFixed(3)}" y2="${(y0 + cell * 0.65).toFixed(3)}"/>`); x += 0.32; }
    else if (ch === '?') { parts.push(`<circle cx="${(x + 0.12).toFixed(3)}" cy="${(y0 + cell).toFixed(3)}" r="0.07" fill="${color}" stroke="none"/><circle cx="${(x + 0.12).toFixed(3)}" cy="${(y0 + cell * 0.38).toFixed(3)}" r="0.16" fill="none"/>`); x += 0.5; }
    else if (ch === ',') { parts.push(`<line x1="${(x + 0.1).toFixed(3)}" y1="${(y0 + cell * 0.85).toFixed(3)}" x2="${(x).toFixed(3)}" y2="${(y0 + cell + 0.12).toFixed(3)}"/>`); x += 0.3; }
    else if (ch === '\n') { /* single line renderer */ x += cell; }
  }
  const W = Math.max(x - gap + pad, 0.5), H = cell + pad * 2 + 0.14;
  const px = size / H;
  return `<svg class="k-script" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W.toFixed(3)} ${H.toFixed(3)}" width="${(W * px).toFixed(1)}" height="${size}" role="img" aria-label="${String(text).replace(/"/g, '&quot;')} in Kaiscript" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" style="stroke-width:${sw}px">${parts.join('')}</svg>`;
};

/* ================= flag ================= */
KAI.flagSVG = function (w = 300) {
  const h = Math.round(w * 2 / 3);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" width="${w}" height="${h}" role="img" aria-label="Flag of Kaiya"><rect width="300" height="200" fill="#e5432d"/><rect y="150" width="300" height="50" fill="#127a73"/><rect y="146" width="300" height="8" fill="#f6efe0"/><circle cx="110" cy="92" r="58" fill="#f2b632"/><circle cx="110" cy="92" r="58" fill="none" stroke="#191512" stroke-width="5"/><g stroke="#191512" stroke-width="11" stroke-linecap="round"><line x1="84" y1="66" x2="136" y2="66"/><line x1="110" y1="66" x2="110" y2="118"/><line x1="84" y1="118" x2="136" y2="118"/></g><g fill="#f6efe0"><circle cx="214" cy="60" r="7"/><circle cx="238" cy="60" r="7"/><circle cx="262" cy="60" r="7"/></g></svg>`;
};
KAI.FLAG_MEANING = 'Red for courage to try things, the sun for fun (kai), the teal band for the sea around Kaiya, the white line for a fresh start. The black mark in the sun is the letter k in Kaiscript. The three dots are the three Kai rules.';
KAI.RULES = [
  { kai:'kaia kumi nesi', en:'Play every day.' },
  { kai:'huma mosali ni tu', en:'Help your friends.' },
  { kai:'manu woto nia', en:'Learn new words.' }
];
KAI.MOTTO = { kai:'kai sa yosa', en:'Fun is good.' };

/* ================= Kai Time & Kai calendar ================= */
// Kai Time: the day has 10 kai (hours), each kai has 100 bits, each bit has 100 blinks.
// 1 kai = 2.4 hours. 5:00 Kai Time = noon. Day starts at midnight.
KAI.TIME = {
  epoch: { y: 2026, m: 8, d: 24 },     // 1 Kaiyon, year 1 KE (the day Kai.fun went live)
  months: [
    { kai:'Kaiyon', en:'Hello month' }, { kai:'Miwan', en:'Cat month' }, { kai:'Tosun', en:'Toast month' },
    { kai:'Monken', en:'Monke month' }, { kai:'Siken', en:'Star month' }, { kai:'Wasun', en:'Water month' },
    { kai:'Kentan', en:'Fire month' }, { kai:'Yenun', en:'Tree month' }, { kai:'Rikin', en:'Kid month' },
    { kai:'Kotun', en:'Code month' }
  ],
  kaidays: ['Kaiyo Day','Mosa Day','Kaimo Day','Manu Day','Yosen Day','Leap Day'], // the 5 (or 6) festival days after Kotun
  weekdays: [
    { kai:'Ikan', en:'Oneday' }, { kai:'Tawan', en:'Twoday' }, { kai:'Miton', en:'Threeday' },
    { kai:'Sekan', en:'Fourday' }, { kai:'Panan', en:'Fiveday' }, { kai:'Rolun', en:'Funday (rest day)' }
  ],
  holidays: [
    { m:1, d:1, name:'Kai.fun Day', about:'New Year. The day the first Kai.fun page went live.' },
    { m:3, d:12, name:'Toast Day', about:'Everyone makes toast. Nobody burns the sun.' },
    { m:4, d:20, name:'Monke Day', about:'Climb something. Respectfully.' },
    { m:6, d:6, name:'Splash Day', about:'Water fights in Wasun, the water month.' },
    { m:10, d:1, name:'First Code Day', about:'Write your first Kaicode program.' }
  ]
};
function ymdUTC(y, m, d) { return Date.UTC(y, m - 1, d); }
const DAY = 86400000;
function isLeap(y) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; }
// Kai year N starts on Aug 24 of Gregorian year 2025+N. It has 365 days, or 366 when the next Feb 29 falls inside it.
function kaiYearStart(n) { return ymdUTC(2025 + n, 8, 24); }
KAI.toKaiDate = function (date = new Date()) {
  const t = ymdUTC(date.getFullYear(), date.getMonth() + 1, date.getDate());
  let n = 1 + Math.floor((t - kaiYearStart(1)) / (365.2425 * DAY));
  while (t < kaiYearStart(n)) n--;
  while (t >= kaiYearStart(n + 1)) n++;
  const doy = Math.round((t - kaiYearStart(n)) / DAY); // 0-based
  const len = Math.round((kaiYearStart(n + 1) - kaiYearStart(n)) / DAY);
  const out = { year: n, era: n >= 1 ? 'KE' : 'BKE', dayOfYear: doy + 1, yearLength: len,
    weekday: KAI.TIME.weekdays[((Math.round((t - kaiYearStart(1)) / DAY) % 6) + 6) % 6] };
  if (doy < 360) { out.month = Math.floor(doy / 36) + 1; out.day = doy % 36 + 1; out.monthName = KAI.TIME.months[out.month - 1]; out.kaiday = null; }
  else { out.month = 0; out.day = doy - 359; out.monthName = null; out.kaiday = KAI.TIME.kaidays[doy - 360]; }
  out.holiday = KAI.TIME.holidays.find(h => h.m === out.month && h.d === out.day) || null;
  out.text = out.kaiday ? `${out.kaiday}, ${KAI.yearText(n)}` : `${out.day} ${out.monthName.kai}, ${KAI.yearText(n)}`;
  return out;
};
KAI.yearText = n => n >= 1 ? `year ${n} KE` : `${1 - n} BKE`;
KAI.fromKaiDate = function (year, month, day) { // month 0 = Kaidays
  const off = month === 0 ? 359 + day : (month - 1) * 36 + (day - 1);
  return new Date(kaiYearStart(year) + off * DAY + 12 * 3600000);
};
KAI.toKaiTime = function (date = new Date()) {
  const ms = date.getHours() * 3600000 + date.getMinutes() * 60000 + date.getSeconds() * 1000 + date.getMilliseconds();
  const blinksTotal = ms / 864;                 // 100,000 blinks per day
  const kai = Math.floor(blinksTotal / 10000), bits = Math.floor(blinksTotal / 100) % 100, blinks = Math.floor(blinksTotal) % 100;
  return { kai, bits, blinks, fraction: ms / 86400000, text: `${kai}:${String(bits).padStart(2, '0')}`, full: `${kai}:${String(bits).padStart(2, '0')}.${String(blinks).padStart(2, '0')}` };
};

/* ================= passport ================= */
KAI.STAMPS = [
  { id:'arrive', kai:'Kaiyo!', en:'Arrived in Kaiya', how:'Open the KAIISM hub.' },
  { id:'kai-first', kai:'Kaimo!', en:'Played KAI', how:'Finish a game of KAI.' },
  { id:'kai-win', kai:'Yusa!', en:'Beat a KAI bot', how:'Win a game of KAI against any bot.' },
  { id:'kai-master', kai:'Rasu', en:'KAI master', how:'Beat a KAI bot on level 4 or higher.' },
  { id:'lang-first', kai:'Manuto', en:'First lesson', how:'Finish Kaihana lesson 1.' },
  { id:'lang-half', kai:'Hana sen', en:'Halfway speaker', how:'Finish half the Kaihana lessons.' },
  { id:'lang-all', kai:'Hana mo yosa', en:'Fluent(ish)', how:'Finish every Kaihana lesson.' },
  { id:'script', kai:'Sirin!', en:'Wrote in Kaiscript', how:'Write your name in Kaiscript.' },
  { id:'code-run', kai:'Kotan!', en:'Ran Kaicode', how:'Run a Kaicode program.' },
  { id:'code-draw', kai:'Pinu!', en:'Drew with code', how:'Draw something with Kaicode turtle commands.' },
  { id:'code-all', kai:'Kotu rasu', en:'Code master', how:'Solve every Kaicode challenge.' },
  { id:'time', kai:'Kaiyu', en:'Read Kai Time', how:'Visit Kai Time.' },
  { id:'pedia', kai:'Rinu maku', en:'Kaipedia reader', how:'Read 5 Kaipedia articles.' },
  { id:'anthem', kai:'Kanta!', en:'Sang the anthem', how:'Play the Kaiya anthem all the way through.' },
  { id:'citizen', kai:'Kaiteno', en:'Citizen of Kaiya', how:'Pass the citizenship test.' }
];
const PKEY = 'kaiism.v1';
function loadP() { try { const j = JSON.parse(localStorage.getItem(PKEY) || 'null'); if (j && typeof j === 'object') return j; } catch (e) {} return { stamps: {}, name: '' }; }
let P = loadP(); if (!P.stamps) P.stamps = {};
function saveP() { try { localStorage.setItem(PKEY, JSON.stringify(P)); } catch (e) {} }
KAI.passport = {
  has: id => !!P.stamps[id],
  count: () => KAI.STAMPS.filter(s => P.stamps[s.id]).length,
  all: () => KAI.STAMPS.map(s => Object.assign({ got: P.stamps[s.id] || 0 }, s)),
  give(id) {
    if (P.stamps[id]) return false;
    const s = KAI.STAMPS.find(x => x.id === id); if (!s) return false;
    P.stamps[id] = Date.now(); saveP(); updateNavCount();
    KAI.toast(`Passport stamp: <b>${s.kai}</b> · ${s.en}`, true);
    return true;
  },
  getName: () => P.name || '',
  setName(n) { P.name = String(n || '').slice(0, 30); saveP(); },
  reset() { P = { stamps: {}, name: '' }; saveP(); updateNavCount(); }
};
// tiny namespaced storage for pages: KAI.store('lang').get(k, def) / .set(k, v)
KAI.store = ns => ({
  get(k, d) { try { const v = localStorage.getItem('kaiism.' + ns + '.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('kaiism.' + ns + '.' + k, JSON.stringify(v)); } catch (e) {} }
});

/* ================= toast ================= */
let toastEl = null, toastT = 0;
KAI.toast = function (html, stamp) {
  if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'k-toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
  toastEl.innerHTML = (stamp ? `<svg class="k-stampmini" width="30" height="30" viewBox="0 0 30 30"><circle cx="15" cy="15" r="12" fill="none" stroke="#f2b632" stroke-width="3" stroke-dasharray="3 2"/><circle cx="15" cy="15" r="5" fill="#e5432d"/></svg>` : '') + `<span>${html}</span>`;
  requestAnimationFrame(() => toastEl.classList.add('on'));
  clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('on'), stamp ? 3600 : 2400);
};

/* ================= shared nav ================= */
KAI.PAGES = [
  { id:'hub', href:'index.html', label:'Hub' },
  { id:'kai', href:'kai.html', label:'KAI' },
  { id:'lang', href:'lang.html', label:'Kaihana' },
  { id:'script', href:'script.html', label:'Kaiscript' },
  { id:'code', href:'code.html', label:'Kaicode' },
  { id:'time', href:'time.html', label:'Kai Time' },
  { id:'pedia', href:'pedia.html', label:'Kaipedia' },
  { id:'anthem', href:'anthem.html', label:'Anthem' },
  { id:'test', href:'test.html', label:'Citizenship' }
];
function updateNavCount() { const el = document.getElementById('k-pass-count'); if (el) el.textContent = `${KAI.passport.count()}/${KAI.STAMPS.length}`; }
KAI.mountNav = function (active) {
  let host = document.getElementById('kai-nav');
  if (!host) { host = document.createElement('header'); host.id = 'kai-nav'; document.body.prepend(host); }
  host.className = 'k-nav';
  host.innerHTML = `<nav class="k-nav-in" aria-label="KAIISM">
    <a class="k-home" href="../index.html" aria-label="Back to Kai.fun">← Kai.fun</a><span class="k-sep"></span>
    <a class="k-brand${active === 'hub' ? ' on' : ''}" href="index.html">${KAI.flagSVG(26)}<span>KAIISM</span></a>
    ${KAI.PAGES.filter(p => p.id !== 'hub').map(p => `<a href="${p.href}"${p.id === active ? ' class="on" aria-current="page"' : ''}>${p.label}</a>`).join('')}
    <a class="k-pass" href="index.html#passport" title="Your passport stamps">Passport <b id="k-pass-count"></b></a>
  </nav>`;
  updateNavCount();
};

/* word of the day (same for everyone on a given day) */
KAI.wordOfDay = function (date = new Date()) {
  const pool = KAI.DICT.filter(d => !['grammar', 'questions'].includes(d.cat) && d.pos !== 'suffix');
  const n = Math.floor(ymdUTC(date.getFullYear(), date.getMonth() + 1, date.getDate()) / DAY);
  return pool[((n * 2654435761) >>> 0) % pool.length];
};

window.KAI = KAI;
})();
