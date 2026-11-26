"""The kai.fun Random Newsletter.

Run once a day by .github/workflows/newsletter.yml. On a random ~1 in 3 of those days it writes an email out of
random bits (a random kai.fun game, a weird fact, a terrible joke...) and sends it to everyone subscribed on
Buttondown. Subscriber emails live only in Buttondown; this script never sees them.

Needs the BUTTONDOWN_API_KEY secret. FORCE=1 sends one right now. DRY_RUN=1 just prints the email.
"""
import html
import json
import os
import random
import re
import sys
import urllib.error
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://kaifun.fun/'
CHANCE = 0.35

SUBJECTS = [
    'A random game has chosen YOU', 'This email has no reason to exist', 'Open this. Or don’t. (Open it.)',
    'URGENT: nothing is urgent', 'You have been randomly selected for… this email', 'Beep boop, random email incoming',
    'We rolled a dice and it said email you', 'A small gift from the internet', 'Your daily dose of random (not daily)',
    'Breaking news: we sent an email', 'The banana council has spoken', 'Psst. Hey. Kid. Wanna play a game?',
]
FACTS = [
    'A group of flamingos is called a flamboyance.', 'Octopuses have three hearts and blue blood.',
    'Bananas are berries, but strawberries are not.', 'Wombats make cube-shaped poop.',
    'Honey never spoils. Archaeologists have found 3,000-year-old honey that was still fine to eat.',
    'A day on Venus is longer than a year on Venus.', 'Sloths can hold their breath longer than dolphins.',
    'Cows have best friends and get stressed when they are apart.', 'The Eiffel Tower grows about 15 cm taller in summer.',
    'Sea otters hold hands when they sleep so they don’t drift apart.', 'Snails can sleep for up to three years.',
    'There are more possible chess games than atoms in the observable universe.', 'A shrimp’s heart is in its head.',
    'Penguins propose to their partners with a pebble.', 'Your nose can remember about 50,000 different smells.',
    'Butterflies taste with their feet.', 'A cloud can weigh more than a million kilograms.',
    'Hot water can freeze faster than cold water. Scientists still argue about why.', 'Koalas sleep up to 22 hours a day.',
    'The inventor of the Pringles can is buried in one.', 'Some turtles can breathe through their bums.',
]
JOKES = [
    ('Why did the banana go to the doctor?', 'It wasn’t peeling well.'),
    ('What do you call a sleeping dinosaur?', 'A dino-snore.'),
    ('Why can’t a bicycle stand up by itself?', 'It’s two tired.'),
    ('What do you call a fish with no eyes?', 'A fsh.'),
    ('Why did the computer go to the doctor?', 'It had a virus.'),
    ('What has four wheels and flies?', 'A garbage truck.'),
    ('Why do cows wear bells?', 'Because their horns don’t work.'),
    ('What do you call cheese that isn’t yours?', 'Nacho cheese.'),
    ('Why are ghosts bad liars?', 'You can see right through them.'),
    ('How does a penguin build its house?', 'Igloos it together.'),
    ('What did the ocean say to the beach?', 'Nothing, it just waved.'),
    ('Why did the scarecrow win an award?', 'He was outstanding in his field.'),
]
EXTRAS = [
    'Today’s lucky number is **{n}**. It is not lucky.', 'Here is a random emoji, for free: {e}',
    'Fun challenge: blink {n} times. Done? Great. That did nothing.', 'This email was written by a computer that rolled dice. It rolled a {n}.',
    'If you read this far, you are legally a legend.', 'Remember to drink water. And to play games. Mostly the water one.',
]
EMOJI = '🍌🐒🦩🐧🧀🎲🚀🦕🐙🌮🍕🦄👾🎮🌈🐸'


def games():
    """Every game tile on the homepage: (page, title, blurb)."""
    src = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
    out = []
    for tag in re.findall(r'<a class="game-tile[^>]*>', src):
        m = re.search(r'href="([a-z0-9_-]+\.html)"[^>]*aria-label="([^"]+)"', tag)
        if not m or 'data-mature' in tag:      # never send the ones kid-friendly mode hides
            continue
        href, label = m.group(1), html.unescape(m.group(2))
        title, _, blurb = label.partition(':')
        out.append((href, title.strip(), blurb.strip()))
    return out


def write_email(rng):
    parts = []
    picks = rng.sample(['game', 'fact', 'joke', 'extra'], k=rng.choice([2, 3, 3, 4]))
    if 'game' not in picks and rng.random() < 0.6:
        picks.insert(0, 'game')
    for what in picks:
        if what == 'game':
            gs = games()
            if gs:
                href, title, blurb = rng.choice(gs)
                parts.append('## 🎲 Your random game: [%s](%s%s)\n\n%s' % (title, SITE, href, (blurb[:1].upper() + blurb[1:]) if blurb else 'No idea what this one is. Go find out.'))
        elif what == 'fact':
            parts.append('## 🤯 Random fact\n\n' + rng.choice(FACTS))
        elif what == 'joke':
            q, a = rng.choice(JOKES)
            parts.append('## 😂 Terrible joke\n\n**%s**\n\n%s' % (q, a))
        else:
            parts.append(rng.choice(EXTRAS).format(n=rng.randint(2, 99), e=rng.choice(EMOJI)))
    body = '\n\n---\n\n'.join(parts)
    body += '\n\n---\n\nThat’s it. That’s the email. More random stuff at [kai.fun](%s). 🍌' % SITE
    return rng.choice(SUBJECTS), body


def send(subject, body, key):
    req = urllib.request.Request(
        'https://api.buttondown.com/v1/emails',
        data=json.dumps({'subject': subject, 'body': body, 'status': 'about_to_send'}).encode(),
        headers={'Authorization': 'Token ' + key, 'Content-Type': 'application/json',
                 # Buttondown asks for this once per key before an API call may send to real subscribers
                 'X-Buttondown-Live-Dangerously': 'true'},
        method='POST')
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            print('sent:', r.status, json.loads(r.read() or b'{}').get('id'))
    except urllib.error.HTTPError as e:
        print('Buttondown said', e.code, e.read().decode(errors='replace')[:500])
        sys.exit(1)


def main():
    rng = random.Random()
    force, dry = os.environ.get('FORCE') == '1', os.environ.get('DRY_RUN') == '1'
    if not force and not dry and rng.random() > CHANCE:
        print('Not today. (Random days only.)')
        return
    subject, body = write_email(rng)
    if dry:
        print('SUBJECT:', subject, '\n\n' + body)
        return
    key = os.environ.get('BUTTONDOWN_API_KEY', '').strip()
    if not key:
        print('No BUTTONDOWN_API_KEY secret yet, so nothing was sent.')
        return
    send(subject, body, key)


if __name__ == '__main__':
    main()
