/* kai.fun visitor counter: who is on the site right now, all-time visits, unique visitors, and the
   who-visits-most leaderboard. Loaded on every page by bdp.js. Everything lives in the kai.fun Firebase
   database under /visits (the rules that guard it are in VISITS_SETUP.md). It never blocks the page:
   if the database can't be reached, the numbers just don't show.

   /visits/total        all-time visits (one per browser tab session)
   /visits/unique       unique visitors (one per browser, ever)
   /visits/live/{sid}   a heartbeat timestamp per open tab; fresh ones = people here right now
   /visits/board/{vid}  { name, n, last } for the leaderboard: n goes up at most once every 30 minutes */
(function () {
  'use strict';
  if (window.KFV) return;
  // don't count automated test browsers or copies of the site running on a local test server
  if (navigator.webdriver || /^(localhost|127\.|0\.0\.0\.0|\[::1\]|$)/.test(location.hostname) || location.protocol === 'file:') return;
  const DB = 'https://kaifun-wall-default-rtdb.firebaseio.com/visits';
  const LIVE_MS = 75000, BEAT_MS = 30000, BOARD_GAP = 1800000;
  const rid = () => Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => 'abcdefghijklmnopqrstuvwxyz0123456789'[b % 36]).join('');
  const ls = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } };
  const ss = (k, v) => { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } };
  let vid = ls('kfv_id'); if (!/^[a-z0-9]{10,24}$/.test(vid || '')) { vid = rid(); ls('kfv_id', vid); }
  let sid = ss('kfv_sid'); if (!/^[a-z0-9]{10,24}$/.test(sid || '')) { sid = rid(); ss('kfv_sid', sid); }
  const INC = { '.sv': { increment: 1 } }, NOW = { '.sv': 'timestamp' };
  const S = { ok: false, total: null, unique: null, live: null, vid, me: null };

  async function req(path, method, body) {
    const q = path.indexOf('?'), url = q < 0 ? DB + path + '.json' : DB + path.slice(0, q) + '.json' + path.slice(q);
    const r = await fetch(url, { cache: 'no-store', method: method || 'GET', body: body === undefined ? undefined : JSON.stringify(body), keepalive: method === 'DELETE' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  }
  function emit() { try { window.dispatchEvent(new CustomEvent('kfv', { detail: S })); } catch (e) { } }

  // a friendly default name until you pick one on the leaderboard page
  function defaultName() {
    const a = ['Sneaky', 'Bouncy', 'Mystery', 'Turbo', 'Sleepy', 'Cosmic', 'Wobbly', 'Speedy', 'Fuzzy', 'Mega'], b = ['Banana', 'Penguin', 'Pickle', 'Noodle', 'Gecko', 'Muffin', 'Robot', 'Walrus', 'Taco', 'Comet'];
    let h = 0; for (const c of vid) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return a[h % a.length] + ' ' + b[(h >>> 4) % b.length];
  }
  const cleanName = (s) => String(s || '').replace(/[<>&"\\/\u0000-\u001f]/g, '').replace(/\s+/g, ' ').trim().slice(0, 16);

  async function count() {
    // one visit per tab session, one unique visitor per browser
    if (!ss('kfv_counted')) {
      await req('/total', 'PUT', INC); ss('kfv_counted', '1');
      if (!ls('kfv_seen')) { await req('/unique', 'PUT', INC).catch(() => { }); ls('kfv_seen', '1'); }
    }
    // the leaderboard counts you at most once every half hour
    const lastLocal = +(ls('kfv_board_t') || 0);
    if (Date.now() - lastLocal > BOARD_GAP) {
      const cur = await req('/board/' + vid).catch(() => null);
      const name = cleanName(ls('kfv_name')) || (cur && cur.name) || defaultName();
      try { await req('/board/' + vid, 'PUT', { name, n: (cur && cur.n ? cur.n : 0) + 1, last: NOW }); ls('kfv_board_t', String(Date.now())); }
      catch (e) { /* counted recently on another device clock: fine */ }
    }
  }
  async function beat() {
    if (document.visibilityState === 'hidden') return;
    try { await req('/live/' + sid, 'PUT', NOW); } catch (e) { }
  }
  async function refresh() {
    try {
      const [live, total, unique] = await Promise.all([req('/live'), req('/total'), req('/unique')]);
      const top = [total, unique];
      S.total = top[0] || 0; S.unique = top[1] || 0;
      // "right now" = heartbeats within the last 75 seconds of the newest one (so clock differences don't matter)
      const ts = live ? Object.values(live).filter((x) => typeof x === 'number') : [];
      const newest = ts.length ? Math.max(...ts) : 0;
      S.live = Math.max(1, ts.filter((t) => t > newest - LIVE_MS).length);
      S.ok = true; emit();
      // tidy up tabs that closed without saying goodbye (only now and then)
      if (live && Math.random() < 0.15) for (const [k, t] of Object.entries(live)) if (typeof t !== 'number' || t < newest - 10 * 60000) req('/live/' + k, 'DELETE').catch(() => { });
    } catch (e) { S.ok = false; emit(); }
  }
  async function start() {
    try { await count(); } catch (e) { /* database not reachable or not set up yet */ }
    await beat(); await refresh();
    setInterval(async () => { await beat(); refresh(); }, BEAT_MS);
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') beat().then(refresh); });
    addEventListener('pagehide', () => { try { fetch(DB + '/live/' + sid + '.json', { method: 'DELETE', keepalive: true }); } catch (e) { } });
  }

  window.KFV = {
    state: S,
    defaultName,
    cleanName,
    myName: () => cleanName(ls('kfv_name')) || defaultName(),
    // rename yourself on the leaderboard (keeps your visit count)
    async setName(name) {
      name = cleanName(name); if (!name) throw new Error('Pick a name');
      ls('kfv_name', name);
      const cur = await req('/board/' + vid);
      if (cur) await req('/board/' + vid, 'PUT', { name, n: cur.n, last: cur.last });
      return name;
    },
    async board(limit) {
      const r = await req('/board?orderBy=%22n%22&limitToLast=' + (limit || 50));
      return Object.entries(r || {}).map(([id, v]) => ({ id, name: cleanName(v && v.name) || 'Visitor', n: (v && v.n) | 0, me: id === vid })).sort((a, b) => b.n - a.n);
    },
    async mine() { return req('/board/' + vid).catch(() => null); },
    refresh,
  };
  if (document.readyState === 'complete') start(); else addEventListener('load', () => setTimeout(start, 300));
})();
