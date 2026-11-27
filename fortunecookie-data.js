// Fortune Cookie Factory: every fortune in the game. One fortune per line.
// omens  = bad fortunes about a townsperson that come true unless you stop them
// saves  = good fortunes about a townsperson (they cancel that person's omen)
// golden = golden-cookie fortunes (they cancel every omen in town)
// jinx   = burnt-cookie fortunes (bad luck: a new omen lands somewhere)
// wisdom = everything else: plain fortunes for your collection
(function () {
const L = s => s.split('\n').map(x => x.trim()).filter(Boolean);
const P = [
  { id: 'baker', name: 'Baker', home: 'Bakery' },
  { id: 'mayor', name: 'Mayor', home: 'Town Hall' },
  { id: 'fisher', name: 'Fisher', home: 'Dock' },
  { id: 'farmer', name: 'Farmer', home: 'Barn' },
  { id: 'postie', name: 'Postie', home: 'Post Office' },
  { id: 'librarian', name: 'Librarian', home: 'Library' },
  { id: 'clockmaker', name: 'Clockmaker', home: 'Clock Tower' },
  { id: 'grandma', name: 'Grandma', home: 'Cottage' },
  { id: 'kid', name: 'Kid', home: 'Treehouse' },
  { id: 'cat', name: 'Cat', home: 'Cardboard Box' },
];
const OMENS = {
baker: L(`
The Baker's oven will explode at exactly the wrong moment.
The Baker's bread will rise straight through the roof.
A swarm of pigeons will discover the Baker's open window.
The Baker will confuse salt and sugar in four hundred cupcakes.
The Baker's sourdough starter will become self-aware.
The Baker will drop the wedding cake. All of it.
A croissant will roll out of the Bakery and never be seen again.
The Baker's rolling pin will roll away on its own.
The Bakery's flour sacks will burst in a great white cloud.
The Baker will sneeze directly into the dough.
The Baker's doughnuts will come out square.
The Baker's best baguette will be used as a sword.
The Baker's cookies will all crumble at once.
The Baker will run out of butter on the busiest day of the year.
`),
mayor: L(`
The Mayor will give a speech with spinach in their teeth.
The Mayor's statue will lose its nose.
The Mayor will cut the ribbon on the wrong building.
The Mayor's toupee will fly away during the parade.
The Mayor will accidentally declare war on the next town.
The town budget will be spent entirely on balloons.
The Mayor will shake hands with a very sticky child.
The Mayor's microphone will only play kazoo sounds.
The Mayor will sign a law making Tuesdays illegal.
The Mayor's chain of office will get caught in a door.
A goose will chase the Mayor around the town square.
The Mayor will forget everyone's name at once.
The Mayor's re-election poster will be drawn on with moustaches.
The Town Hall roof will start leaking exactly over the Mayor's desk.
`),
fisher: L(`
The Fisher will be eaten by a slightly larger fish.
The Fisher's boat will spring a leak the size of a doughnut.
The Fisher will catch only boots today.
A seagull will steal the Fisher's lunch and their hat.
The Fisher's net will come up full of angry crabs.
The Fisher will fall in. Again.
The Fisher's line will tangle into a perfect knot no one can undo.
The tide will go out and take the Dock with it.
The Fisher's bait will escape.
A very polite octopus will steal the Fisher's oar.
The Fisher's boat will drift off while they tie their shoe.
The Fisher will hook their own trousers.
The Fisher's prize fish will slap them and leave.
Fog will roll in so thick the Fisher rows in circles all day.
`),
farmer: L(`
The Farmer's cows will learn to open the gate.
The Farmer's tractor will only drive backwards.
A hailstorm will flatten the Farmer's pumpkins.
The Farmer's chickens will go on strike.
The scarecrow will quit and take the crows with it.
The Farmer's pig will escape and run for Mayor.
The Barn door will fall off its hinges.
The Farmer will plant the seeds upside down.
A goat will eat the Farmer's only pair of boots.
The Farmer's crops will grow into a corn maze with no exit.
The Farmer's sheep will all shrink in the rain.
The Farmer's well will start giving fizzy water.
Moles will tunnel under the whole field at once.
The Farmer's rooster will crow at midnight every night.
`),
postie: L(`
The Postie will be chased by every dog in town.
The Postie's bag will burst open in the wind.
Every letter will be delivered to the wrong house.
The Postie's bike will get a flat on the steepest hill.
A parcel will start ticking. It is only a clock. Probably.
The Postie will lick a stamp and stick it to their own forehead.
The Post Office will receive a single envelope the size of a barn.
The Postie will deliver a letter to themselves and get very confused.
A gust of wind will scatter the birthday cards across the lake.
The Postie's sorting machine will start sorting by smell.
Someone will mail a live lobster. Without a box.
The Postie's whistle will only attract geese.
The Postie will get stuck in a very small mailbox.
The postmarks will all say the wrong year.
`),
librarian: L(`
The Library's books will fall over like dominoes.
The Librarian will shush a thunderstorm and lose.
Every book will be returned with a pressed sandwich inside.
The Library's card catalogue will be eaten by moths.
A book will be returned four hundred years late.
The Librarian's glasses will fall into the book drop.
The Library will be flooded by a single leaky pen.
All the pages in the dictionary will swap places.
The Library's quiet room will start echoing.
The Librarian will lose their place in a 900-page book.
A ghost will check out every mystery novel at once.
The Library ladder will roll away mid-climb.
The Librarian's tea will be spilled on a first edition.
Someone will reshelve every book by colour.
`),
clockmaker: L(`
The Clock Tower will strike thirteen and keep going.
The Clockmaker will drop the tiniest gear forever.
Every clock in town will run backwards.
The Clock Tower's bell will fall into the square.
A pigeon will nest inside the big hand.
The Clockmaker will wind the spring too tight.
The cuckoo clocks will all cuckoo at once.
The Clock Tower will lose an hour and refuse to give it back.
The Clockmaker's magnifying glass will set a small fire.
The town will be late for everything all day.
The Clockmaker's own watch will stop at breakfast.
The pendulum will swing loose and knock over the scaffolding.
The Clock Tower's face will get a crack right through noon.
A mouse will run up the clock and refuse to come down.
`),
grandma: L(`
Grandma's knitting will unravel into one very long string.
Grandma will bake cookies and forget them in the oven.
Grandma's cat-shaped teapot will crack.
Grandma will win the lottery and lose the ticket.
Grandma's rocking chair will rock too far.
Grandma's garden gnome will be stolen by teenagers.
Grandma's hearing aid will pick up the radio station.
Grandma will show everyone four hundred holiday photos.
Grandma's soup will come out a suspicious colour.
Grandma will slip on her own doily.
Grandma's prize roses will be eaten by a deer.
Grandma will call the Kid by the dog's name. There is no dog.
Grandma's false teeth will end up in the pudding.
Grandma's quilt will be blown off the washing line.
`),
kid: L(`
The Kid will fall out of the treehouse.
The Kid's kite will get stuck in the Clock Tower.
The Kid will eat a whole bag of sweets before dinner.
The Kid's science project will escape.
The Kid will lose their first tooth in a sandwich.
The Kid's ice cream will fall off the cone.
The Kid's balloon will float away forever.
The Kid will get gum stuck in their hair.
The Kid's homework will actually be eaten by the Cat.
The Kid will draw on the Mayor's statue.
The Kid's treehouse ladder will snap.
The Kid will get a splinter the size of a pencil.
The Kid's paper boat will sink in the first puddle.
The Kid will lose at hide and seek because they are still hiding.
`),
cat: L(`
The Cat will knock the Mayor's trophy off the shelf.
The Cat will get stuck up a very short tree.
The Cat's box will be recycled.
The Cat will eat something it should not have.
The Cat will fall asleep on a moving cart.
A dog will move in next door to the Cat.
The Cat's favourite sunbeam will be blocked by a new building.
The Cat will discover the vacuum cleaner.
The Cat will get its head stuck in a jam jar.
The Cat will be given a bath.
The Cat will chase a laser dot into the lake.
The Cat will knock over the Baker's flour.
The Cat will be mistaken for a fur hat.
The Cat will run out of all nine lives on the same day.
`),
};
const SAVES = {
baker: L(`
The Baker's oven will behave itself today.
The Baker will catch the falling cake with one hand.
The Baker's bread will rise exactly as much as it should.
A pigeon-proof net will arrive at the Bakery just in time.
The Baker will taste the batter first. Disaster avoided.
The Baker's dough will be perfect. Not a sneeze in sight.
The Baker's croissants will stay put.
The Baker will find a forgotten crate of butter.
Every loaf the Baker makes today will be golden.
The Baker will remember to turn off the oven.
The Bakery smells so good that trouble turns around at the door.
The Baker's cupcakes will win first prize.
The Baker will invent a new pastry and name it after you.
The Baker's rolling pin will stay right where it is.
A kind stranger will help the Baker carry the flour.
The Baker will get the day off and spend it napping.
The Baker's sourdough will stay a normal, quiet loaf.
The Baker's doughnuts will be perfectly round.
The Baker will sell out by noon.
The Baker's apron will stay spotless all day.
`),
mayor: L(`
The Mayor will check their teeth before the speech.
The Mayor's speech will get a standing ovation.
The Mayor will remember everyone's name, even yours.
The Mayor's hat will stay firmly on.
The Mayor will cut the right ribbon on the first try.
The town budget will balance itself.
The Mayor will make friends with the goose.
The Mayor's statue will be polished and proud.
The Mayor will sign a law making Fridays a half day.
The Mayor's microphone will work perfectly.
The Mayor will be re-elected by a landslide.
The Town Hall roof will be fixed by lunchtime.
The Mayor will find a lucky coin in the fountain.
The Mayor will be too busy to cause any trouble today.
The Mayor's assistant will catch every mistake.
The next town will send a fruit basket instead of a war.
The Mayor will give the shortest, nicest speech in history.
The Mayor's moustache-covered poster will be replaced.
The Mayor will declare today a holiday.
The Mayor's chain of office will gleam in the sun.
`),
fisher: L(`
The Fisher will catch the biggest fish of the season.
The Fisher's boat will stay perfectly dry.
A friendly dolphin will guide the Fisher home.
The Fisher's net will come up full and calm.
The Fisher will stay on the boat all day. A personal best.
The seagulls will leave the Fisher alone.
The Fisher's line will never tangle today.
The tide will be kind to the Dock.
The fog will lift the moment the Fisher sets out.
The Fisher will find a pearl in an ordinary oyster.
The octopus will return the oar with an apology.
The Fisher will catch dinner for the whole town.
The Fisher's lucky hat will stay on their head.
The Fisher's boat will get a fresh coat of paint.
The fish will practically jump into the bucket.
The Fisher will nap in the sun and wake up with a full net.
The Fisher's bait will stay where it is put.
The Fisher will spot a rainbow over the lake.
The Fisher's boat will be tied up nice and tight.
The Fisher will win the fishing contest by a fin.
`),
farmer: L(`
The Farmer's cows will stay happily in their field.
The Farmer's tractor will start on the first try.
The Farmer's pumpkins will grow enormous.
The Farmer's chickens will lay golden-brown eggs all day.
The scarecrow will work overtime for free.
The Farmer's pig will come home for dinner.
The Barn door will be fixed with a single nail.
The Farmer's seeds will sprout overnight.
The goat will eat weeds instead of boots.
The Farmer's crops will grow in neat straight rows.
Gentle rain will fall on the Farmer's field and nowhere else.
The moles will move to the next town.
The Farmer will win a ribbon at the county fair.
The rooster will sleep in until morning.
The Farmer's well will give the sweetest water in town.
A rainbow will end right over the Barn.
The Farmer's sheep will be fluffy and full size.
The harvest will come in early.
The Farmer's dog will herd everything perfectly.
The Farmer's apple tree will be heavy with fruit.
`),
postie: L(`
Every letter will reach the right house today.
The dogs of the town will wag at the Postie instead.
The Postie's bag will hold together in the wind.
The Postie's bike will glide up every hill.
The ticking parcel will turn out to be a lovely cuckoo clock.
The Postie will deliver a long-lost letter and make someone cry happy tears.
The Postie will finish the round before lunch.
The Post Office will receive only nice postcards.
The Postie's sorting machine will sort perfectly.
The Postie will find the lobster a nice new home.
The geese will ignore the Postie's whistle.
The Postie will get a thank-you card from every house.
The Postie's stamps will all stick the right way up.
The wind will blow the birthday cards straight to the right doors.
The Postie will deliver a parcel of free cookies to themselves.
The Postie's shoes will never get a blister.
The Postie will make it home before the rain.
Every mailbox will open smoothly today.
The Postie will be voted Most Reliable in Town.
The postmarks will all show today's date.
`),
librarian: L(`
The Library's shelves will stay perfectly straight.
The Librarian's shush will calm even the thunder.
Every book will come back on time and crumb-free.
The Librarian will find the rarest book in the back room.
The Library's quiet room will be blissfully silent.
The Librarian will never lose their place.
The ghost will return every mystery novel, solved.
The Library ladder will roll exactly where it should.
The Librarian's tea will stay in the cup.
The Library will get a big box of donated books.
The card catalogue will be safe in a moth-proof drawer.
The Librarian's glasses will stay on their nose.
A child will read their first whole book at the Library today.
The dictionary will be in perfect alphabetical order.
The Library roof will be leak-proof.
The Librarian will read a chapter in peace.
The book drop will only receive books.
Every book will be shelved in the right place.
The Library will be named the best in the county.
The Librarian will finish the 900-page book with a happy ending.
`),
clockmaker: L(`
The Clock Tower will strike exactly twelve.
The Clockmaker will find the tiniest gear on the first try.
Every clock in town will run right on time.
The Clock Tower's bell will ring loud and clear.
The pigeon will build its nest somewhere else.
The Clockmaker's springs will be wound just right.
The cuckoo clocks will take turns.
The lost hour will turn up behind the sofa.
The Clockmaker's magnifying glass will stay cool.
The whole town will be on time for once.
The Clockmaker's watch will tick happily all day.
The pendulum will swing smooth and steady.
The crack in the clock face will be fixed by noon.
The mouse will run down the clock right on schedule.
The Clockmaker will finish their masterpiece today.
The Clock Tower will glow golden at sunset.
The Clockmaker will fix the Mayor's watch and get a medal.
The Clock Tower's gears will be oiled and quiet.
Time will be on the Clockmaker's side.
The Clockmaker will have time to spare.
`),
grandma: L(`
Grandma's knitting will become the warmest scarf in town.
Grandma's cookies will come out of the oven just in time.
Grandma's teapot will stay in one piece.
Grandma will find her lottery ticket in her handbag.
Grandma's rocking chair will rock just right.
Grandma's garden gnome will be returned with a note of apology.
Grandma's hearing aid will pick up only good news.
Grandma will show just three holiday photos. The good ones.
Grandma's soup will be the best she has ever made.
Grandma will stay steady on her feet all day.
Grandma's roses will win first prize.
Grandma will remember everybody's name.
Grandma's teeth will stay where they belong.
Grandma's quilt will stay pinned on the line.
Grandma will get a surprise visit from the whole family.
Grandma will win at bingo. Twice.
Grandma's cat-shaped teapot will make the perfect cup.
Grandma will get a long phone call from an old friend.
Grandma will nap in the sun and dream of the seaside.
Grandma's garden will bloom overnight.
`),
kid: L(`
The Kid will climb down from the treehouse safely.
The Kid's kite will fly higher than the Clock Tower.
The Kid will eat a carrot without being asked.
The Kid's science project will win a gold star.
The Kid's tooth will earn a shiny coin.
The Kid's ice cream will stay on the cone.
The Kid's balloon will float back down.
The Kid's hair will stay gum-free.
The Kid's homework will be finished early.
The Kid will draw a portrait of the Mayor and get it framed.
The Kid's treehouse ladder will be extra sturdy.
The Kid will make a new best friend today.
The Kid's paper boat will sail all the way across the pond.
The Kid will find the best hiding spot and come out to win.
The Kid will learn to whistle.
The Kid will find a four-leaf clover.
The Kid's loose tooth will come out painlessly.
The Kid will get a puppy. A real one. Probably.
The Kid will win the spelling bee on the word cookie.
The Kid will have the best birthday ever.
`),
cat: L(`
The Cat will land on its feet. Every time.
The Cat's box will be replaced with a bigger box.
The Cat will nap in the sunniest spot in town.
The Cat will be given a whole fish.
The Cat will leave the Mayor's trophy alone. Just this once.
The Cat will climb down the tree all by itself.
The new dog next door will be afraid of the Cat.
The Cat will discover catnip.
The Cat will get its head out of the jam jar with dignity.
The Cat will avoid bath time completely.
The Cat will catch the laser dot. Somehow.
The Cat will be crowned Town Mascot.
The Cat's nine lives will all be safe today.
The Cat will purr so loudly the whole street relaxes.
Someone will open a can of tuna for the Cat.
The Cat will find a warm laptop to sit on.
The Cat will be petted by everybody it meets.
The Cat will finally catch the red dot.
The Cat will knock only empty things off shelves.
The Cat will get a tiny crown.
`),
};
const GOLDEN = L(`
Everything is going to be fine. Everywhere. For everyone.
A wave of good luck will wash over the whole town.
Every bad omen in town just tripped over its own shoelaces.
The stars have lined up in your favour.
All curses are hereby cancelled. Signed, the Universe.
The town will have the luckiest day in its history.
Sunshine, rainbows, and zero disasters.
Every black cat in town will turn out to be very friendly.
Today's forecast: one hundred percent luck.
Fortune smiles on everyone who lives here.
The bad luck went to the wrong town.
Every broken mirror in town just fixed itself.
A golden glow will protect every door in town.
All omens have been returned to sender.
Luck has decided to move in permanently.
Somewhere, a four-leaf clover just bloomed for each of you.
Trouble has taken the day off.
The wishing well heard every wish at once.
Every ladder in town will be walked around, not under.
The whole town just found a lucky penny.
The future just got rewritten, and it is lovely.
Doom has been postponed indefinitely.
All of tomorrow's bad news has been cancelled.
You have saved the day. Again.
Every horseshoe in town points up.
The town will laugh about this one day. Starting now.
The clouds part. The birds sing. The omens leave.
A rainbow will cover the whole town.
Good fortune will arrive in bulk.
Everyone in town will get exactly what they need.
`);
const JINX = L(`
Something somewhere just went wrong. Good luck.
You have angered a very small god.
The next thing you drop will land butter-side down.
Your shoelace is untied. It will stay that way.
Someone, somewhere, just stepped on a crack.
A black cat crossed your path. Then came back to do it again.
You will walk under a ladder today without noticing.
You will find a hair in your soup. It is not yours.
The bad news will arrive by pigeon.
Your umbrella will be at home when the rain starts.
You will get the wobbly shopping trolley.
Somebody just broke a mirror. Seven years of this.
The cookie was burnt. So is your luck.
The wind is changing. It is not changing nicely.
Your toast will land jam-side down.
An omen has escaped from the cookie. Sorry.
A cloud is following you around.
You will stub your toe on something invisible.
The next song in your head will be the worst one.
Your socks will be damp by noon.
A seagull has chosen you.
You will sneeze in the middle of something important.
The lift will be out of order. You are on the top floor.
You will forget why you walked into this room.
Your phone will die at one percent.
The queue you pick will be the slow one.
That was your last clean spoon.
Your pen will run out mid-signature.
The bus will leave as you arrive.
Your ice cream will melt faster than you can eat it.
Something just went bump. Somewhere.
A curse has been delivered. Please sign here.
You have unlocked bad luck mode.
The town's luck just slipped on a banana peel.
Trouble is on its way and it has brought friends.
That cookie was a bad idea and you know it.
Somebody spilled salt and did not throw any over their shoulder.
The fortune teller looked at this one and left.
Burnt cookie, burnt fate.
You will lose a sock in the wash. Just one.
The weather will be worse than you dressed for.
Your autocorrect will betray you.
The vending machine will keep your coin.
You will bite your tongue at dinner.
Your favourite mug will develop a tiny chip.
Your headphones will tangle themselves in your pocket.
The printer knows. The printer always knows.
Your keys are in the last place you look. Which is very far away.
The cookie crumbles. So does the plan.
The next door you push says pull.
`);
const WISDOM = L(`
You will receive a fortune cookie.
The fortune you seek is in another cookie.
Help, I am trapped in a fortune cookie factory.
This cookie is not responsible for your future.
Your lucky number is in a different cookie.
That wasn't chicken.
You will read this fortune and then another one.
Ignore the previous cookie.
The cookie you choose next will be the right one.
A cookie a day keeps the fortunes away.
You are not illiterate.
Error 404: fortune not found.
Wise is the person who reads all the fortunes.
This fortune intentionally left blank.
Look behind you. Not now. Later.
Today is a good day to have a good day.
Your shoes will be comfortable all day.
You will be hungry again in one hour.
Somebody nearby is thinking about lunch.
Now is a good time to drink water.
Believe in yourself. The cookie does.
You will finish what you sta
The early bird gets the worm, but the second mouse gets the cheese.
A smile is the shortest distance between two people.
You have a secret admirer. It's a pigeon.
Your future is bright. Wear sunglasses.
Every cookie has a silver lining. Except this one. This one has paper.
Do not trust the next fortune.
Good things come to those who crack cookies.
The answer is yes. The question is not important.
You will soon learn something you already knew.
A journey of a thousand miles begins with getting off the couch.
Your best idea will arrive in the shower.
You will have an excellent sandwich this week.
Do not eat the paper.
You just ate the paper, didn't you.
Fortune favours the bold, and the moderately curious.
The cookie believes in you.
Your hair looks great today.
You are going to sneeze soon. Bless you in advance.
Someone will laugh at your joke. Probably out of kindness.
You will win an argument with a vending machine.
Patience is a virtue. Cookies are a snack.
Life is like a cookie: crunchy, then gone.
The paper is the real cookie.
Today you will make the right choice by accident.
An old friend will remember you fondly today.
You will find something you lost last year.
You will see a dog and it will make your day better.
Your plants are proud of you.
You will soon be surrounded by snacks.
Change is coming. Check your pockets.
Look up. There might be a bird.
Your next nap will be legendary.
A cat will judge you today. Pass the test.
Don't count your chickens. Count your cookies.
Opportunity knocks. Don't pretend you're not home.
Your laugh is contagious.
Do the thing. You know the thing.
The best is yet to come. It's running late.
Small steps are still steps.
You are exactly where the cookie expected.
Today's mistake is tomorrow's funny story.
Someone out there owes you a high five.
You will be offered a biscuit. Accept it.
A surprise is waiting for you in the fridge.
You will hum a song all day without knowing which one.
Stop reading fortunes and go outside. Then come back.
The moon is watching. The moon is fine with it.
Your keyboard misses you.
The stars say hello.
Wear the fun socks.
A new hobby is calling. It sounds like a ukulele.
You will learn the name of a new cloud.
Your next idea will be weird. Do it anyway.
Something good will happen on Thursday.
You will find a coin on the ground. Keep it. It's lucky now.
Tomorrow will be slightly better than today.
You will be the first to notice the rainbow.
A good book is about to find you.
You will laugh so hard you snort.
You are more interesting than you think.
The universe is big. Your snack is small. Get another snack.
Make a wish. Then make a plan.
Kindness is free. So is this fortune.
Ask the question you are scared to ask.
You will get a compliment from an unexpected place.
There is a reason you are reading this right now. It is because you clicked.
Your dreams tonight will involve a giraffe.
Today, eat the cookie first and read the fortune second.
Spend today like you found a twenty in your coat.
You are someone's favourite person.
You are going to be okay.
You are cooler than a cucumber in a fridge.
Every expert was once a beginner who crashed into things.
Be the person your dog thinks you are.
Let the ducks be ducks.
Your gut feeling is right. Your gut also wants pizza.
Not all who wander are lost. Some are looking for the bathroom.
Life is short. Eat dessert first.
Never trust an atom. They make up everything.
Two wrongs don't make a right, but three lefts do.
Your socks don't need to match to be happy.
A clean desk is a sign of an empty drawer.
Honesty is the best policy. Snacks are the second best.
The quietest person in the room has the best snacks.
Today's weather: a chance of cookies.
Beware of geese.
Don't let yesterday use up too much of today.
You will finally understand the joke from three years ago.
Your phone battery will last all day.
You will win a staring contest with a pigeon.
Your next cup of tea will be the perfect temperature.
Treat yourself. You are a cookie connoisseur now.
This message will self-destruct when you look away.
You are reading the cookie. The cookie is reading you.
The secret ingredient is more cookies.
Every great story starts with someone doing something silly.
You will be remembered for your excellent handwriting.
Somewhere a dog is wagging because of you.
You will find a song that fits your mood perfectly.
Life is a long game. Pace yourself and stretch.
Your enthusiasm is contagious. Spread it like jam.
The best view comes after the hardest climb.
Remember to blink.
You have been chosen by a fortune cookie. This is a big deal.
You'll do great on the thing you're nervous about.
A lucky coincidence is coming your way.
Be gentle with yourself today.
A sock you lost years ago is thinking of you.
A friend will say exactly what you need to hear.
You will try something new and like it.
You will sleep well tonight.
There's a spider in your room. It's on your side.
You will discover a shortcut.
Your future self says thanks.
You are the main character today. Act like it.
You will eat something delicious and talk about it for days.
Your instincts are sharp. Like cheddar.
A quiet morning is coming. Enjoy it.
The next person you meet will be kind.
You will find the remote on the first try.
Your laugh will make someone's day.
You will be brave today in a small way.
Everything is temporary, including this cookie.
Your patience will be rewarded with a parking space.
Today is a great day for a walk.
You are about to have a very good idea.
Your favourite song will come on soon.
A pleasant surprise waits around the next corner.
Today you will find a reason to dance.
Collect moments, not fortune cookies. Actually, collect both.
You are a work in progress. So is everyone.
The best things in life aren't things. Except cookies.
You have unusual taste in cookies. Respect.
Fortune cookies were invented to make you read.
This fortune is lucky. Probably.
The cookie said nothing. The cookie knew.
A thousand fortunes await. You have read one more.
Another day, another cookie.
There are more fortunes in these cookies than stars in a small sky.
Your next fortune will be better. Maybe.
The person who wrote this is very tired.
This is the fortune you deserve.
Congratulations, you have found the most average fortune.
You will one day own a very nice hat.
Your enemies will be confused by your cheerfulness.
A cloud shaped like a cookie will float by today.
You will get a parcel. It will be smaller than expected.
Embrace the crumbs.
Never give up. Never surrender. Never skip dessert.
You are the cookie of someone's eye.
Your next sandwich will have the perfect ratio.
Be the change you want to see in the cookie jar.
Fortune favours the snack-prepared.
Someone will copy your style. Be flattered.
Your next adventure starts with a single click.
You have the heart of a lion and the appetite of a bear.
Seize the day. Gently.
You will win the next game you play. Or the one after.
A long-forgotten password will come back to you.
Smile. It confuses people.
You will eat at least one vegetable this week.
You will have a lucky hair day.
The traffic lights will turn green for you.
Your next yawn will be satisfying.
You will be early to something important.
You will find a pen that actually works.
You will be first in line.
Someone you admire admires you back.
You will make someone laugh without trying.
The Wi-Fi will be strong wherever you go.
A great nap is in your near future.
You will feel the urge to clean your room. Resist it or don't.
A cold drink on a hot day is in your future.
You will hear good news before the weekend.
A stranger will hold the door for you.
Today is a perfect day to start something.
Your next cup of coffee will hit just right.
You are on the right track. It's just a long track.
You will remember an important birthday just in time.
You will learn something cool from a documentary.
A rainy day will become your favourite day.
Something you've been waiting for is almost here.
The stars say: drink more water.
The stars say: go to bed earlier.
The stars say: you're doing your best.
The stars say: nice shoes.
The stars refuse to comment.
The stars are busy. Please try again later.
The planets are aligned. Mostly. Pluto is sulking.
Mercury is in retrograde. Blame everything on it.
A mysterious stranger will offer you a mint.
You will be asked for directions and give them confidently.
You will walk into a room and everyone will be happy to see you.
You will finish a puzzle with no pieces missing.
Your plans will work out better than expected.
You are luckier than you feel.
Trust the process. And the cookie.
You will spot a shooting star soon.
Your next sneeze will be perfectly timed.
Somebody loves the way you laugh.
Dance like nobody's watching. Someone is. It's fine.
The road to success is paved with cookie crumbs.
The secret to happiness is a warm cookie.
When life gives you lemons, ask for cookies instead.
Tomorrow belongs to those who prepare snacks today.
Your bravery will be rewarded with a nice surprise.
Every cloud has a cookie lining.
You will soon have reason to celebrate.
Eat the cookie. Ignore the scale.
Some fortunes are better left unread. Oops.
The answer you seek is 'maybe'.
You will make a decision and stick to it. Mostly.
You will soon visit a place that smells like bread.
A fun surprise is hiding in your inbox.
You will be invited somewhere fun.
Your talents will be recognised.
Your hard work will pay off. In cookies.
Never trust a cookie that is too quiet.
The more fortunes you read, the luckier you get. Allegedly.
You are now 1 percent luckier.
You are now 2 percent luckier.
You are now 3 percent luckier. That's a lot.
Lucky colour: orange.
Lucky colour: the one you're wearing.
Lucky colour: cookie brown.
Lucky day: today.
Lucky day: the day after the day you read this.
Lucky animal: a confident pigeon.
Lucky animal: a goose. Good luck.
Lucky food: anything fried.
Lucky snack: the last one in the packet.
Lucky direction: forwards.
Lucky time: snack time.
Lucky word: crumpet.
Lucky word: wobble.
Lucky word: kerfuffle.
Lucky word: noodle.
Lucky sound: the crack of a cookie.
Lucky shape: whatever this cookie is.
Lucky item: a spoon.
Lucky item: a rubber duck.
Lucky item: odd socks.
Lucky place: under a blanket.
Lucky place: the fridge.
Lucky planet: whichever one you're on.
Lucky weather: drizzle with a chance of fun.
Lucky number: yes.
Lucky number: also yes.
You will find your lucky number in an unlikely place.
Kai says hi.
Kai made this cookie. Kai is very proud.
Kai has 183 games. You should play them.
A trip to kai.fun is in your future. Oh wait.
Somewhere in kai.fun, a traffic cone believes in you.
The cat on the keyboard says: aaaaaaaaaaaaaaaa.
The Monke approves of your cookie choices.
Your bottle will land upright. Eventually.
Play one more game. Just one. Then one more.
The fortune factory thanks you for your service.
You have cracked a cookie. The factory is pleased.
The factory workers send their regards.
The factory machine says: beep.
This fortune was hand-folded by a robot with tiny hands.
This fortune was written at 3am.
This fortune passed quality control. Barely.
This fortune was supposed to go to someone else.
Please return this fortune to the factory if found.
The factory is not responsible for lost luck.
No fortunes were harmed in the making of this cookie.
Warning: this cookie contains fortune.
May contain traces of destiny.
Best before: the future.
Ingredients: flour, sugar, prophecy.
Made in a factory that also handles bad luck.
Keep away from fire, water, and the Cat.
Serving suggestion: crack and read.
Shake well before reading. Too late.
You are holding fortune number one of many.
Collect them all. There are a lot.
Your collection is growing. So are you.
Fortune collector level: impressive.
You have the patience of a fortune cookie collector.
What do you call a cookie that tells the future? Fortune-ate.
Why did the cookie go to the doctor? It was feeling crummy.
What did the cookie say to the milk? See you on the dunk side.
Why was the cookie sad? Its mum was a wafer too long.
I would tell you a cookie joke, but it might crumble.
Knock knock. Who's there? Cookie. Cookie who? Cookie the future!
The cookie crossed the road. Nobody knows why.
Your future is so bright it needs a lampshade.
You will soon be famous for something weird.
You will invent a word that everyone uses.
You will name a pet something amazing.
You will one day ride a camel. Badly.
You will win a medal for an extremely niche skill.
You will become the best at a game nobody else plays.
You will one day make a perfect pancake flip.
You will meet a dog with your exact personality.
You will accidentally start a trend.
You will one day eat a cake shaped like your face.
You will one day see a moose. In person. Maybe.
You will learn to juggle three things. One of them will be cookies.
You will discover a new favourite snack by mistake.
You will build an impressive pillow fort.
You will find out a famous person shares your birthday.
You will one day be very good at bowling.
You will get a sticker for no reason.
You will hear the ice cream van at the perfect time.
You will witness an extremely good sunset.
You will smell freshly baked bread and remember this fortune.
You will one day own a fancy pen.
You will tell a story that gets better every time.
Your houseplant will flower.
You will beat your own high score.
You will remember your dream tomorrow morning.
You will laugh at something silly at an important moment.
The next cookie is the luckiest one. Trust me.
The previous cookie was jealous of this one.
This cookie is better than the last one.
This cookie had a crush on you.
This cookie has been waiting a long time for you.
This cookie has seen things.
This cookie is now empty. Like my promises.
This cookie was made with love and a big machine.
This cookie believes in second chances. And third.
This cookie would like to remain anonymous.
This cookie is on a diet. It only contains words.
This cookie is gluten-full and proud.
This cookie went to college. Ask it anything.
This cookie dreamed of being a muffin.
This cookie is more wise than it looks.
This cookie hates Mondays too.
This cookie is lactose tolerant.
This cookie wants to be friends.
This cookie will not judge you.
This cookie judges you a little.
This cookie is a certified good cookie.
This cookie was baked by a grandmother of twelve.
This cookie has a twin somewhere.
This cookie is famous on the internet.
This cookie has never told a lie. Until now.
Your cookie is upside down.
Your cookie has a cookie inside. Just kidding.
Your future involves at least three more cookies.
You will crack a cookie and smile. You are doing it now.
Fortune says: well done.
Fortune says: try again.
Fortune says: yes, but bring a jacket.
Fortune says: it's complicated.
Fortune says: ask Grandma.
Fortune says: the Cat knows.
Fortune says: snack break.
Fortune says: that's a good question.
Fortune says: ha.
Fortune says: shh.
Fortune is busy. Here's a cookie instead.
Fortune is shy. Please look away.
Fortune is on holiday. Please enjoy this placeholder.
Fortune has gone to get milk.
Fortune will be right back.
Fortune is loading...
Fortune not available in your region.
Fortune temporarily out of stock.
Fortune has been updated. Please restart your life.
Fortune requires an update. Click to continue.
Do not fold, spindle, or mutilate this fortune.
Please recycle this fortune after reading.
This fortune is printed on recycled fortunes.
This fortune is 100 percent organic.
This fortune is sugar-free.
This fortune has been approved by a panel of cats.
This fortune was tested on no animals, except Kevin.
Kevin says hi.
Kevin, if you're reading this, call your mum.
A message for Steve: we know what you did.
Happy birthday! (If it's not your birthday, save this for later.)
Congratulations on your new job! (Or your old one.)
Merry whatever-it-is-today.
Hello from the past. It's a bit dusty here.
Hello from the future. Everything is shaped like a cookie.
Greetings from the inside of a cookie.
The real fortune was the friends we made along the way.
Every fortune is true if you wait long enough.
The future is not written. Except on this paper.
Fortune cookies are actually from San Francisco. Shh.
Don't believe everything you read in cookies.
Believe everything you read in cookies.
Reading fortunes in a room full of fortunes. Very meta.
If you can read this, you're close enough to the cookie.
You will receive one compliment for every cookie you crack.
You crack cookies like a pro.
Your cracking technique is flawless.
That was a beautiful crack. Ten out of ten.
The crack heard round the world.
Cookie cracked. Destiny unlocked.
Achievement unlocked: read a fortune.
Achievement unlocked: still reading fortunes.
Achievement unlocked: lucky.
Level up! Your luck increased by one.
+1 wisdom.
+1 luck. -1 cookie.
+5 happiness. Spend it wisely.
You gained 10 experience points.
New fortune discovered! (This one.)
A rare fortune! (It isn't.)
An ultra-rare fortune! (Okay, maybe.)
A legendary fortune! (Look how shiny the paper is.)
A fortune so rare it doesn't even have words. ...
A fortune with a typo. Teh end.
A fortune in reverse. .yaw siht ti daer ll'uoY
A fortune in a whisper. (you're doing great)
A FORTUNE IN CAPITALS. YOU ARE VERY LOUD TODAY.
a fortune with no capitals. relax.
A fortune that rhymes: today will be fine, like a ripe pine.
A fortune that tries to rhyme: be happy and also orange.
A haiku: crack the cookie wide, paper holds a small promise, crumbs fall on your lap.
A haiku: luck is a strange thing, it comes like a cat at night, then leaves for no reason.
A haiku: the oven is warm, a thousand fortunes are folded, which one will you get.
A haiku: tiny paper slip, tells you nothing that you need, still you read it all.
A haiku: Monday morning sun, the coffee machine is broke, fortune says hang on.
A limerick: a cookie that came from the line, said your future would really be fine, so you cracked it in two, read the words that were true, and then went on to crack number nine.
A riddle: what has words but never speaks? This fortune.
A riddle: what gets broken before it is used? An egg. And a cookie.
A riddle: what can you catch but not throw? A cold. Or good luck.
A riddle: the more you take, the more you leave behind. Footsteps. Also cookie crumbs.
Fun fact: the town Clock Tower has never been on time.
Fun fact: Grandma once beat the Mayor at arm wrestling.
Fun fact: the Cat has never paid rent.
Fun fact: the Fisher has fallen in 412 times.
Fun fact: the Baker can juggle four loaves.
Fun fact: the Librarian has read every book twice.
Fun fact: the Kid's treehouse has a doorbell.
Fun fact: the Postie has never been bitten. Yet.
Fun fact: the Farmer named every single chicken.
Fun fact: the Clockmaker owns 300 clocks and is always late.
Fun fact: the Mayor's statue is slightly taller than the Mayor.
Fun fact: fortune cookies are folded while still warm.
Fun fact: a fortune cookie weighs about as much as a paperclip.
Fun fact: you have cracked more cookies than most people ever will.
Fun fact: the first fortune ever printed said 'hello'. Probably.
Fun fact: octopuses have three hearts.
Fun fact: a group of flamingos is called a flamboyance.
Fun fact: honey never goes off.
Fun fact: wombat poop is cube-shaped.
Fun fact: bananas are berries, but strawberries aren't.
Fun fact: sea otters hold hands while they sleep.
Fun fact: a day on Venus is longer than its year.
Fun fact: cows have best friends.
Fun fact: the Eiffel Tower grows taller in summer.
Fun fact: sloths can hold their breath longer than dolphins.
Fun fact: there are more possible chess games than atoms in the universe.
Fun fact: snails can sleep for three years.
Fun fact: a shrimp's heart is in its head.
Fun fact: koalas have fingerprints.
Fun fact: the dot over an i is called a tittle.
Fun fact: hot water can freeze faster than cold water.
Fun fact: a bolt of lightning is hotter than the sun's surface.
Fun fact: jellyfish have been around longer than dinosaurs.
Fun fact: pigeons can recognise themselves in a mirror.
Fun fact: crows can remember faces.
Fun fact: an ostrich's eye is bigger than its brain.
Fun fact: Scotland's national animal is the unicorn.
Fun fact: humans share about 60 percent of their DNA with bananas.
Fun fact: the moon has moonquakes.
Fun fact: penguins propose with pebbles.
Fun fact: a cloud can weigh as much as a hundred elephants.
Fun fact: butterflies taste with their feet.
Fun fact: starfish don't have brains.
Fun fact: you can't hum while holding your nose. You just tried.
Fun fact: you're now aware of your breathing.
Fun fact: you just blinked.
Fun fact: you're reading this in your head voice.
Advice: always check behind the sofa.
Advice: never trust a goose.
Advice: always carry a spare cookie.
Advice: water your plants and yourself.
Advice: stretch before cracking cookies.
Advice: make the bed. Or don't. The bed won't mind.
Advice: say thank you to the bus driver.
Advice: take the stairs. Then take a nap.
Advice: name your car something nice.
Advice: write things down.
Advice: if in doubt, add cheese.
Advice: phone your grandma.
Advice: don't feed the ducks bread. Peas are better.
Advice: back up your files.
Advice: always read the fortune before eating the cookie.
Advice: wear sunscreen.
Advice: leave the party while it's still fun.
Advice: laugh at your own jokes. Someone has to.
Advice: never argue with a toddler.
Advice: hold the door for the person behind you.
Advice: listen more than you talk. Except at karaoke.
Advice: keep a spare pair of socks in your bag.
Advice: say yes to adventures. And to dessert.
Advice: look both ways. Then look up for pigeons.
Advice: don't put metal in the microwave.
Advice: always tip the pizza person.
Advice: never trust a staircase. It's always up to something.
Advice: find a hobby that makes you lose track of time.
Advice: learn one magic trick.
Advice: compliment someone's shoes today.
Prediction: you will open another cookie.
Prediction: you will smile at least once in the next hour.
Prediction: the next fortune will be different from this one.
Prediction: the Cat will knock something over today.
Prediction: someone in town will fall in the lake.
Prediction: there will be cookies.
Prediction: Tuesday will happen.
Prediction: you will stretch soon.
Prediction: you'll read this out loud to someone.
Prediction: you will finish this sentence.
Prediction: something will be slightly funny today.
Prediction: snacks are in your near future.
Prediction: the weekend is coming.
Prediction: you will check the time right after reading this.
Prediction: you will want another cookie.
Prediction: this prediction is correct.
The fortune you are about to read is false.
The fortune you just read was true.
Everything in this cookie is true. Except this sentence.
Disregard all other cookies.
This is the only real fortune. All the others are fake.
Under the cookie lies another cookie.
Your cookie has been upgraded.
Your cookie has been downgraded to a biscuit.
Your cookie is now a cracker.
You owe the factory one cookie.
The factory owes you one cookie.
You will owe a cookie to someone you love.
Share your next cookie.
Pass the luck along.
Give this fortune to someone who needs it.
Tell someone they're doing great.
Hug someone today. Ask first.
Wave at a stranger's dog.
Send a nice text to an old friend.
Leave a nice note somewhere.
Do something kind and don't tell anyone. Except this cookie.
Put the shopping trolley back.
Pick up one piece of litter.
Let someone go ahead of you in line.
Say good morning to a neighbour.
Call your mum. Or someone's mum.
Thank the person who made your lunch.
Tell a joke to someone who looks tired.
Draw something today, even a bad stick figure.
Sing in the shower. Loudly.
Go to bed ten minutes earlier tonight.
Drink a glass of water right now.
Take three deep breaths. There, wasn't that nice?
Unclench your jaw.
Drop your shoulders.
Look away from the screen for twenty seconds.
Blink. Good.
Stand up and stretch. The cookies will wait.
Today, wear something that makes you happy.
Eat something green today.
Go outside and look at a tree.
Have a dance break.
Make a cup of something warm.
Open a window. Let the luck in.
Tidy one thing. Just one.
Today, be curious.
Today, be brave.
Today, be silly.
Today, be gentle.
Today, be the goose.
Today, be the duck. Calm on top, paddling underneath.
Today, be like the Cat. Do whatever you want.
Today, be like Grandma. Feed everyone.
Today, be like the Librarian. Shush the chaos.
Today, be like the Baker. Rise.
Today, be like the Clockmaker. Be on time.
Today, be like the Fisher. Be patient.
Today, be like the Kid. Climb something.
Today, be like the Postie. Deliver.
Today, be like the Farmer. Grow.
Today, be like the Mayor. Make a speech. To your fridge.
Your cookie-cracking hands are steady.
Your luck stat has gone up.
The cookie gods are smiling.
The cookie gods are snacking.
The cookie gods are asleep. Crack quietly.
The cookie gods demand more cookies.
The great cookie in the sky sees all.
Somewhere a fortune teller just felt a disturbance.
A crystal ball somewhere just went blurry.
The tea leaves say: cookie.
The tarot cards say: also cookie.
The magic 8-ball says: outlook cookie.
The ancient prophecy says: snacks.
The prophecy was misread. It said 'cookies', not 'crooks'.
A prophecy has been fulfilled. A very small one.
The prophecy foretold your arrival. It was right on time.
The chosen one has arrived. Hi.
You are the chosen cookie cracker.
Destiny brought you here. So did a link.
Fate is a cookie. Crack it.
Luck is a muscle. Keep cracking.
Luck is just preparation meeting a good cookie.
Luck is the only thing you can't buy. Except in cookies.
Luck comes in threes. This is number one.
Luck comes in threes. This is number two.
Luck comes in threes. This is number three. Phew.
Good luck is coming. It's stuck in traffic.
Good luck is coming. It took the scenic route.
Good luck has been delivered. Please check your porch.
Good luck. You'll need it. Just kidding. You won't.
You don't need luck. You've got cookies.
Lucky you.
Lucky me, getting to tell you this.
Lucky us.
`);
const ALL = [];
const add = (kind, who, list) => list.forEach((t, i) => ALL.push({ id: kind[0] + (who ? who.slice(0, 3) : '') + i, kind, who, t }));
P.forEach(p => { add('omen', p.id, OMENS[p.id]); add('save', p.id, SAVES[p.id]); });
add('golden', null, GOLDEN); add('jinx', null, JINX); add('wisdom', null, WISDOM);
window.FC_DATA = { P, OMENS, SAVES, GOLDEN, JINX, WISDOM, ALL };
})();
