# Visitor counter, leaderboard and Random Newsletter: setup

Three switches have to be flipped once.

## 1. Let the database store visits (Firebase rules)

The counter (`visits.js`, loaded on every page by `bdp.js`) saves its numbers in the kai.fun Firebase database
`kaifun-wall`, under `/visits`. Right now the database's rules only allow the wall and blocks, so it says
"Permission denied" to visits.

1. Open <https://console.firebase.google.com>, pick the **kaifun-wall** project, then **Realtime Database → Rules**.
2. Keep everything that is already there. Inside the big `"rules": { … }` block, add the `"visits"` section below
   next to the existing `"wall"` and `"blocks"` sections (mind the comma between sections).
3. Press **Publish**.

```json
"visits": {
  ".read": true,
  "total":  { ".write": true, ".validate": "newData.isNumber() && newData.val() === (data.exists() ? data.val() : 0) + 1" },
  "unique": { ".write": true, ".validate": "newData.isNumber() && newData.val() === (data.exists() ? data.val() : 0) + 1" },
  "live": {
    "$sid": {
      ".write": "$sid.matches(/^[a-z0-9]{10,24}$/)",
      ".validate": "newData.isNumber() && newData.val() <= now + 60000"
    }
  },
  "board": {
    ".indexOn": ["n"],
    "$vid": {
      ".write": "$vid.matches(/^[a-z0-9]{10,24}$/) && newData.exists()",
      ".validate": "newData.hasChildren(['name', 'n', 'last']) && newData.child('name').isString() && newData.child('name').val().length >= 1 && newData.child('name').val().length <= 16 && newData.child('n').isNumber() && newData.child('last').isNumber() && ((newData.child('n').val() === (data.exists() ? data.child('n').val() : 0) + 1 && newData.child('last').val() === now && (!data.exists() || now - data.child('last').val() >= 1800000)) || (data.exists() && newData.child('n').val() === data.child('n').val() && newData.child('last').val() === data.child('last').val()))",
      "$other": { ".validate": false }
    }
  }
}
```

What the rules guarantee:

- All-time visits and unique visitors can only ever go up by exactly one per write.
- Leaderboard points:
  - Each visitor gets at most one point every 30 minutes.
  - Names are capped at 16 characters.
  - A rename keeps the same points.
- "Here right now" entries are just timestamps, and closed tabs get tidied away.

No email addresses or other personal details are stored here. Everything under `/visits` is public.

## 2. Turn on the newsletter signup (Buttondown)

1. Make a free account at <https://buttondown.com> (free up to 100 subscribers), and pick a username, e.g. `kaifun`.
2. In `visitors.html`, set `const BUTTONDOWN = 'your-username';` (it's `lightningstudiosx`).

Signups go straight to Buttondown, which sends each person a confirm email and puts an unsubscribe link in every
email. kai.fun never sees the addresses.

## 3. Let GitHub send the random emails

1. In Buttondown: **Settings → API** → copy the API key.
2. On GitHub: the repository's **Settings → Secrets and variables → Actions → New repository secret**.
   - Name: `BUTTONDOWN_API_KEY`
   - Value: the key.
3. The workflow `.github/workflows/newsletter.yml` runs every day. On a random ~1 in 3 of those days it sends
   one random email (a random game, a weird fact, a terrible joke…).
   - To send one straight away: **Actions → Random newsletter → Run workflow**.
   - To preview locally without sending: `DRY_RUN=1 python newsletter/send.py`.
