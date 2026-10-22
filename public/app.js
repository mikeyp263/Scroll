import { SECTIONS, VERSES, BOOKS } from "./content.js";
import { GLASS, medallion, unitWindow, roseWindow } from "./glass.js";
import { NATIVE, initNative, haptic, backup, restore, askForReminders, remindersAllowed, scheduleReminders } from "./native.js";

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const rand = (n) => Math.floor(Math.random() * n);
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pickN = (a, n) => shuffle(a).slice(0, n);
const localDay = (d = new Date()) => { d = new Date(d); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };
const today = () => localDay();
const dayDiff = (a, b) => Math.round((new Date(b) - new Date(a)) / 864e5);
const lsGet = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

const I = {
  flame: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M13.6 1.2s1.2 3.7-1.4 6.8C9.9 10.8 8 12.2 8 15a4 4 0 0 0 8 0c0-1.3-.6-2.4-.6-2.4s3.6 1.7 3.6 5.6A7 7 0 0 1 12 23a7 7 0 0 1-7-7c0-5.6 4.2-7.6 6-10.8 1.5-2.6 2.6-4 2.6-4z"/></svg>',
  xp: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M13 2 4 14h6l-1 8 9-12h-6z"/></svg>',
  heart: '<svg viewBox="0 0 24 24"><path d="M12 21.3 10.6 20C5.4 15.4 2 12.3 2 8.5 2 5.4 4.4 3 7.5 3c1.7 0 3.4.8 4.5 2.1A6 6 0 0 1 16.5 3C19.6 3 22 5.4 22 8.5c0 3.8-3.4 6.9-8.6 11.5z"/></svg>',
  heartO: '<svg viewBox="0 0 24 24"><path d="M16.5 3A6 6 0 0 0 12 5.1 6 6 0 0 0 7.5 3C4.4 3 2 5.4 2 8.5c0 3.8 3.4 6.9 8.6 11.5l1.4 1.3 1.4-1.3C18.6 15.4 22 12.3 22 8.5 22 5.4 19.6 3 16.5 3zm-4.4 15.6-.1.1-.1-.1C7.1 14.2 4 11.4 4 8.5 4 6.5 5.5 5 7.5 5c1.5 0 3 1 3.6 2.4h1.9C13.5 6 15 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.9-3.1 5.7-7.9 10.1z"/></svg>',
  chev: '<svg viewBox="0 0 24 24"><path d="M7.4 8.6 12 13.2l4.6-4.6L18 10l-6 6-6-6z"/></svg>',
  star: '<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6.2 6.8.7-5.1 4.6 1.5 6.7L12 17.3 5.9 20.7l1.5-6.7-5.1-4.6 6.8-.7z"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>',
  lock: '<svg viewBox="0 0 24 24"><path d="M12 2a5 5 0 0 1 5 5v3h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h1V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v3h6V7a3 3 0 0 0-3-3z"/></svg>',
  trophy: '<svg viewBox="0 0 24 24"><path d="M7 3h10v2h4v3a5 5 0 0 1-4.6 5A5 5 0 0 1 13 15.9V18h3v3H8v-3h3v-2.1A5 5 0 0 1 7.6 13 5 5 0 0 1 3 8V5h4zm10 4v4a3 3 0 0 0 2-3V7zM5 7v1a3 3 0 0 0 2 3V7z"/></svg>',
  x: '<svg viewBox="0 0 24 24"><path d="M6.4 5 12 10.6 17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6 10.6 12 5 6.4z"/></svg>',
  copy: '<svg viewBox="0 0 24 24"><path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12zm3 4H8a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11z"/></svg>',
  trash: '<svg viewBox="0 0 24 24"><path d="M9 3h6l1 2h4v2H4V5h4zm-3 5h12l-1 13H7z"/></svg>',
  learn: '<svg viewBox="0 0 24 24"><path d="M12 3 2 8l10 5 8-4v6h2V8zM6 12.2V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-3.8l-6 3z"/></svg>',
  book: '<svg viewBox="0 0 24 24"><path d="M3 4h7a3 3 0 0 1 2 .8A3 3 0 0 1 14 4h7v15h-7a2 2 0 0 0-2 2 2 2 0 0 0-2-2H3zm2 2v11h5c.7 0 1.4.2 2 .5V7a1 1 0 0 0-1-1zm14 0h-6a1 1 0 0 0-1 1v10.5c.6-.3 1.3-.5 2-.5h5z"/></svg>',
  user: '<svg viewBox="0 0 24 24"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5 0-9 2.5-9 6v2h18v-2c0-3.5-4-6-9-6z"/></svg>',
  cross: '<svg viewBox="0 0 24 24"><path d="M10 2h4v6h6v4h-6v10h-4V12H4V8h6z"/></svg>',
  tablets: '<svg viewBox="0 0 24 24"><path d="M2 21V7a5 5 0 0 1 9.5-2.2V21zm10.5 0V4.8A5 5 0 0 1 22 7v14z"/></svg>',
  letter: '<svg viewBox="0 0 24 24"><path d="M3 5h18v14H3zm2 2v.6l7 5 7-5V7z"/></svg>',
  compass: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4 6-2.7 5.3L8 16l2.7-5.3z"/></svg>',
  spark: '<svg viewBox="0 0 24 24"><path d="M12 1l2.4 7.6L22 11l-7.6 2.4L12 21l-2.4-7.6L2 11l7.6-2.4zM19 15l1 3 3 1-3 1-1 3-1-3-3-1 3-1z"/></svg>',
  arrowL: '<svg viewBox="0 0 24 24"><path d="M15.4 7.4 10.8 12l4.6 4.6L14 18l-6-6 6-6z"/></svg>',
  arrowR: '<svg viewBox="0 0 24 24"><path d="M8.6 16.6 13.2 12 8.6 7.4 10 6l6 6-6 6z"/></svg>',
  bulb: '<svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-4 12.7V18h8v-3.3A7 7 0 0 0 12 2zM9 20h6v2H9z"/></svg>',
  q: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 17h-2v-2h2zm2-7.7-.9.9c-.7.8-1.1 1.3-1.1 2.8h-2v-.5c0-1.1.4-2.1 1.2-2.8l1.2-1.3c.4-.4.6-.9.6-1.4a2 2 0 0 0-4 0H8a4 4 0 0 1 8 0c0 .9-.4 1.7-1 2.3z"/></svg>',
};
const SEC_ICON = { journey: I.compass, ot: I.tablets, nt: I.letter, gospels: I.cross, stories: I.spark };
const D = (svg) => /\sd="([^"]+)"/.exec(svg)[1]; // raw path data for drawing inside glass
const SEC_D = { journey: D(I.compass), ot: D(I.tablets), nt: D(I.letter), gospels: D(I.cross), stories: D(I.spark) };
const play = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';

/* ---------- content indexes ---------- */
const SEC = Object.fromEntries(SECTIONS.map((s) => [s.id, s]));
const LESSON = {};
const NODES = {}; // section id -> [{id, kind:'lesson'|'review', ui, li}]
for (const s of SECTIONS) {
  NODES[s.id] = [];
  s.units.forEach((u, ui) => {
    u.lessons.forEach((l, li) => { LESSON[l.id] = { sec: s, ui, li, l }; NODES[s.id].push({ id: l.id, kind: "lesson", ui, li }); });
    NODES[s.id].push({ id: `R:${s.id}-${ui}`, kind: "review", ui });
  });
}
const BOOK_IX = Object.fromEntries(BOOKS.map((b, i) => [b.name, i]));
BOOK_IX["Psalm"] = BOOK_IX["Psalms"];
const refBook = (i) => (BOOKS[i].name === "Psalms" ? "Psalm" : BOOKS[i].name);
const parseRef = (ref) => {
  const m = /^(.+) (\d+):(\d+)(?:-(\d+))?$/.exec(ref || "");
  if (!m || BOOK_IX[m[1]] == null) return null;
  return { b: BOOK_IX[m[1]], c: +m[2], v1: +m[3], v2: m[4] ? +m[4] : +m[3] };
};

const STOP = new Set("the and that with from this have will shall were been your yours they them their there then than into unto upon which what when where whom whose also because not but are was his her him you our ours those these every each said says like even just only very more most some such would could should about over through before after let may might must being again away does done doing made make came come went going yet nor both all any one out its it’s whoever whatever anyone neither either here now how why own can has had did therefore among against i’m who for thus them, until while within without whether toward towards".split(/\s+/));
const core = (w) => w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
const passageText = (ref) => {
  const v = VERSES[ref];
  if (v) return v.v.map((x) => x[1]).join(" ");
  const s = S.saved[ref];
  return s ? s.t : "";
};
const POOL = (() => {
  const m = new Map();
  for (const k in VERSES) for (const w of passageText(k).split(/\s+/)) {
    const c = core(w);
    if (c.length >= 4 && c.length <= 12 && c === c.toLowerCase() && !STOP.has(c) && !/[’']/.test(c)) m.set(c, c);
  }
  return [...m.values()];
})();
const ALL_REFS = Object.keys(VERSES);
const VOTD_REFS = ALL_REFS.filter((r) => VERSES[r].v.length === 1 && passageText(r).length < 200);

/* ---------- state ---------- */
const KEY = "scroll-v2";
const fresh = () => ({ done: {}, xp: 0, days: {}, streak: 0, best: 0, last: null, goal: 20, section: "journey", saved: {}, reader: { b: 42, c: 1 }, sound: true, lastLit: null, remind: { on: false, time: "19:00", asked: false } });
let S = fresh();
try { const raw = lsGet(KEY); if (raw) S = Object.assign(fresh(), JSON.parse(raw)); } catch {}
const save = () => { lsSet(KEY, S); backup(JSON.stringify(S)); };
const liveStreak = () => (S.last && dayDiff(S.last, today()) <= 1 ? S.streak : 0);
const xpToday = () => S.days[today()] || 0;
const isDone = (id) => !!S.done[id];
const secProgress = (sid) => { const n = NODES[sid].filter((x) => x.kind === "lesson"); return [n.filter((x) => isDone(x.id)).length, n.length]; };
const nodeOpen = (sid, i) => i === 0 || isDone(NODES[sid][i - 1].id) || isDone(NODES[sid][i].id);
const currentIndex = (sid) => NODES[sid].findIndex((x) => !isDone(x.id));

/* ---------- sound ---------- */
let AC = null;
function beep(ok) {
  if (!S.sound) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const t = AC.currentTime, notes = ok ? [[660, 0], [880, 0.09]] : [[220, 0], [180, 0.12]];
    for (const [f, d] of notes) {
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = ok ? "sine" : "triangle"; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t + d); g.gain.exponentialRampToValueAtTime(0.18, t + d + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.18);
      o.connect(g).connect(AC.destination); o.start(t + d); o.stop(t + d + 0.2);
    }
  } catch {}
}

/* ---------- toast + sheet ---------- */
let toastT;
function toast(msg, action) {
  $(".toast")?.remove(); clearTimeout(toastT);
  const t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status");
  t.innerHTML = `<span>${esc(msg)}</span>${action ? `<button type="button">${esc(action.label)}</button>` : ""}`;
  if (action) t.querySelector("button").onclick = () => { action.run(); t.remove(); };
  document.body.append(t); toastT = setTimeout(() => t.remove(), 3500);
}
function sheet(html, onMount, color) {
  closeSheet();
  const s = document.createElement("div"); s.className = "scrim"; s.id = "scrim";
  if (color) s.dataset.c = color;
  s.innerHTML = `<div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div>`;
  s.addEventListener("click", (e) => { if (e.target === s) closeSheet(); });
  document.body.append(s); onMount && onMount(s);
  const f = s.querySelector("button, input"); f && f.focus({ preventScroll: true });
}
function closeSheet() { $("#scrim")?.remove(); }

/* ---------- saved verses ---------- */
const isSaved = (ref) => !!S.saved[ref];
function toggleSave(ref, text) {
  if (S.saved[ref]) {
    const old = S.saved[ref]; delete S.saved[ref]; save();
    toast("Removed from saved", { label: "Undo", run: () => { S.saved[ref] = old; save(); refresh(); } });
  } else {
    S.saved[ref] = { t: text || passageText(ref), at: new Date().toISOString(), note: "" }; save();
    toast("Saved to your verses");
  }
  return isSaved(ref);
}
async function copyVerse(ref, text) {
  const s = `“${text}” ${ref} (BSB)`;
  try { await navigator.clipboard.writeText(s); toast("Copied"); } catch { toast("Copy didn't work on this device"); }
}

/* ---------- views ---------- */
let TAB = "learn";
const view = () => $("#view");
function setColor(c) { document.body.dataset.c = c; }
function topBar(left) {
  const st = liveStreak();
  return `<header class="top">${left}<div class="pills">
    <span class="pill fire ${st ? "" : "off"}" title="Day streak">${I.flame}${st}</span>
    <span class="pill xp" title="Total XP">${I.xp}${S.xp}</span></div></header>`;
}
function refresh() { if ($("#player")) return; render(); }
function render() {
  if (TAB !== "bible") $(".selbar")?.remove();
  $$(".tabs button").forEach((b) => b.setAttribute("aria-selected", b.dataset.tab === TAB));
  ({ learn: renderLearn, bible: renderBible, saved: renderSaved, me: renderMe })[TAB]();
}
function tab(t) { TAB = t; closeSheet(); render(); window.scrollTo(0, 0); }

/* Learn */
function roseFor(sec, newest) {
  const units = sec.units.map((u, ui) => ({ lessons: u.lessons.map((l) => isDone(l.id)), done: isDone(`R:${sec.id}-${ui}`) }));
  return roseWindow(GLASS[sec.color], units, SEC_D[sec.id], newest);
}
function gemFor(sec) { return medallion(GLASS[sec.color], "current", SEC_D[sec.id], 3); }
function goalRing() {
  const g = Math.min(1, xpToday() / S.goal), C = 2 * Math.PI * 17;
  return `<svg class="ring" viewBox="0 0 42 42" aria-hidden="true"><circle cx="21" cy="21" r="17" fill="none" style="stroke:var(--raised)" stroke-width="5"/><circle cx="21" cy="21" r="17" fill="none" style="stroke:var(--gilt)" stroke-width="5" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - g)}" transform="rotate(-90 21 21)"/></svg>`;
}
function renderLearn() {
  const sec = SEC[S.section] || SECTIONS[0]; setColor(sec.color);
  const v = VOTD_REFS[Math.floor(new Date(today()).getTime() / 864e5) % VOTD_REFS.length];
  const cur = currentIndex(sec.id);
  const [dn, tot] = secProgress(sec.id);
  const newest = S.lastLit && S.lastLit.sec === sec.id ? S.lastLit.key : null;
  if (S.lastLit) { S.lastLit = null; save(); }
  const offs = [0, 54, 84, 54, 0, -54, -84, -54];
  const curNode = cur >= 0 ? NODES[sec.id][cur] : null;
  const curTitle = curNode ? (curNode.kind === "review" ? `Unit ${curNode.ui + 1} review` : LESSON[curNode.id].l.t) : "Every pane is lit";
  let h = topBar(`<button class="secbtn" id="secbtn" aria-label="Change section, current: ${esc(sec.name)}"><span class="gem">${gemFor(sec)}</span><span>${esc(sec.name)}</span>${I.chev}</button>`);
  h += `<section class="hero">${roseFor(sec, newest)}
    <h1>${esc(sec.name)}</h1><p class="sub">${dn} of ${tot} panes lit</p>
    ${curNode ? `<button class="cta" data-node="${cur}"><div><small>${dn ? "Continue" : "Begin"} · Unit ${curNode.ui + 1}</small><b>${esc(curTitle)}</b></div><span class="go">${play}</span></button>` : `<p class="sub">You finished this section. Try another one.</p>`}</section>
    <div class="card goal">${goalRing()}<div><b>${xpToday() >= S.goal ? "Daily goal complete" : "Daily goal"}</b><small>${xpToday()} of ${S.goal} XP today</small></div><span class="pill fire ${liveStreak() ? "" : "off"}">${I.flame}<b>${liveStreak()}</b></span></div>
    <section class="card votd"><div class="votd-h"><span class="eyebrow">Verse of the day</span>
    <button class="iconbtn heart ${isSaved(v) ? "on" : ""}" data-save="${esc(v)}" aria-label="${isSaved(v) ? "Remove from saved" : "Save verse"}">${isSaved(v) ? I.heart : I.heartO}</button></div>
    <blockquote>${esc(passageText(v))}</blockquote><span class="ref">${esc(v)}</span></section>`;
  let gi = 0;
  sec.units.forEach((u, ui) => {
    const nodes = NODES[sec.id].map((n, i) => ({ ...n, i })).filter((n) => n.ui === ui);
    const ln = nodes.filter((n) => n.kind === "lesson"), ld = ln.filter((n) => isDone(n.id)).length;
    h += `<section class="unit" id="unit-${ui}"><div class="window">${unitWindow(GLASS[sec.color], sec.id + ui, ld / ln.length)}<span class="count">${ld}/${ln.length}</span>
      <div class="cap"><span class="eyebrow">Unit ${ui + 1}</span><h2>${esc(u.t)}</h2><p>${esc(u.d)}</p></div></div><div class="path">`;
    nodes.forEach((n, k) => {
      const done = isDone(n.id), open = nodeOpen(sec.id, n.i), isCur = n.i === cur;
      const label = n.kind === "review" ? "Unit review" : LESSON[n.id].l.t;
      const state = done ? "done" : open ? "current" : "locked";
      const icon = n.kind === "review" ? D(I.trophy) : done ? D(I.check) : open ? D(I.star) : D(I.lock);
      h += `<div class="nodewrap ${isCur ? "cur" : ""}" style="transform:translateX(${offs[(k + gi) % offs.length]}px)">${isCur ? `<span class="bubble">${cur === 0 ? "Start" : "Next"}</span>` : ""}
        <button class="node ${done ? "done" : open ? "current" : "locked"}" data-node="${n.i}" aria-label="${esc(label)}${done ? ", complete" : open ? "" : ", locked"}">${medallion(GLASS[sec.color], state, icon, n.i * 7 + 3)}</button><span class="lbl">${esc(label)}</span></div>`;
    });
    gi += nodes.length;
    h += `</div></section>`;
  });
  view().innerHTML = `<div class="wrap">${h}</div>`;
  $("#secbtn").onclick = openSections;
}
function openSections() {
  sheet(`<h3>Choose a window</h3><p>Each section is its own path. Your light stays in all of them.</p><div class="seclist">${SECTIONS.map((s) => {
    const [d, n] = secProgress(s.id);
    return `<button class="secrow" data-c="${s.color}" data-sec="${s.id}" aria-current="${s.id === S.section}">${roseFor(s)}<b>${esc(s.name)}</b><small>${esc(s.desc)}</small><span class="pct">${Math.round((d / n) * 100)}%</span></button>`;
  }).join("")}</div>`, (el) => el.querySelectorAll("[data-sec]").forEach((b) => (b.onclick = () => { S.section = b.dataset.sec; save(); closeSheet(); renderLearn(); window.scrollTo(0, 0); })));
}
function openNode(i) {
  const sec = SEC[S.section], n = NODES[sec.id][i], open = nodeOpen(sec.id, i), done = isDone(n.id);
  const u = sec.units[n.ui];
  const icon = n.kind === "review" ? D(I.trophy) : done ? D(I.check) : open ? D(I.star) : D(I.lock);
  const m = medallion(GLASS[sec.color], done ? "done" : open ? "current" : "locked", icon, i * 7 + 3);
  if (n.kind === "review") {
    sheet(`<div class="medal-row">${m}<div><span class="eyebrow">Unit ${n.ui + 1} · ${esc(u.t)}</span><h3>Unit review</h3></div></div><p>${open ? "Every verse from this unit, mixed together. Finish it to seal the unit's window." : "Finish every lesson in this unit to unlock the review."}</p>
      ${open ? `<button class="btn wide" id="go">${done ? "Review again · +5 XP" : "Start review · +15 XP"}</button>` : ""}`, (el) => { const g = el.querySelector("#go"); if (g) g.onclick = () => { closeSheet(); startReview(sec, n.ui); }; }, sec.color);
    return;
  }
  const L = LESSON[n.id], count = u.lessons.length;
  sheet(`<div class="medal-row">${m}<div><span class="eyebrow">Unit ${n.ui + 1} · Lesson ${n.li + 1} of ${count}</span><h3>${esc(L.l.t)}</h3></div></div><p>${open ? esc(L.l.v.join("  ·  ")) : "Finish the lesson before this one to unlock it."}</p>
    ${open ? `<button class="btn wide" id="go">${done ? "Practice again · +5 XP" : "Start lesson · +10 XP"}</button>` : ""}`, (el) => { const g = el.querySelector("#go"); if (g) g.onclick = () => { closeSheet(); startLesson(n.id); }; }, sec.color);
}

/* Bible reader */
const BIBLE = {};
async function loadBook(b) {
  if (BIBLE[b]) return BIBLE[b];
  const r = await fetch(`bible/${b}.json`);
  if (!r.ok) throw new Error("load");
  return (BIBLE[b] = await r.json());
}
let SEL = new Set();
function savedVersesIn(b, c) {
  const set = new Set();
  for (const ref in S.saved) { const p = parseRef(ref); if (p && p.b === b && p.c === c) for (let v = p.v1; v <= p.v2; v++) set.add(v); }
  return set;
}
async function renderBible(scrollTo) {
  setColor((SEC[S.section] || SECTIONS[0]).color);
  const { b, c } = S.reader;
  view().innerHTML = `<div class="wrap">${topBar(`<span class="title-bar">Bible</span>`)}
    <div class="readbar"><button class="pick" id="pick">${esc(BOOKS[b].name)} ${c}${I.chev}</button><span class="eyebrow">BSB</span></div>
    <div id="chap"><div class="loading"><div class="spin" aria-label="Loading"></div></div></div></div>`;
  $("#pick").onclick = () => openPicker(b < 39 ? "ot" : "nt");
  let book;
  try { book = await loadBook(b); } catch { $("#chap").innerHTML = `<div class="empty"><h3>Couldn't open this chapter</h3><p>Check your connection and try again. Chapters you've opened before work offline.</p><button class="btn" id="retry">Try again</button></div>`; $("#retry").onclick = () => renderBible(); return; }
  if (TAB !== "bible" || S.reader.b !== b || S.reader.c !== c) return;
  const vs = book.chapters[c - 1], saved = savedVersesIn(b, c);
  $("#chap").innerHTML = `<div class="chapter ${c === 1 ? "first" : ""}">${vs.map((t, i) => `<span class="v ${saved.has(i + 1) ? "saved" : ""} ${SEL.has(i + 1) ? "sel" : ""}" id="v-${i + 1}" data-v="${i + 1}" tabindex="0" role="button" aria-pressed="${SEL.has(i + 1)}"><sup>${i + 1}</sup>${esc(t)}</span> `).join("")}</div>
    <div class="chnav"><button class="btn ghost small" id="prevc" ${b === 0 && c === 1 ? "disabled" : ""}>${I.arrowL}Previous</button><button class="btn ghost small" id="nextc" ${b === 65 && c === BOOKS[65].ch ? "disabled" : ""}>Next${I.arrowR}</button></div>`;
  $$(".chapter .v").forEach((el) => { const tog = () => { const n = +el.dataset.v; SEL.has(n) ? SEL.delete(n) : SEL.add(n); el.classList.toggle("sel"); el.setAttribute("aria-pressed", SEL.has(n)); selBar(); }; el.onclick = tog; el.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tog(); } }; });
  $("#prevc").onclick = () => goChapter(-1); $("#nextc").onclick = () => goChapter(1);
  if (scrollTo) { const el = $("#v-" + scrollTo); if (el) { el.scrollIntoView({ block: "center" }); el.classList.add("sel"); SEL.add(scrollTo); selBar(); } }
  selBar();
}
function goChapter(d) {
  let { b, c } = S.reader; c += d;
  if (c < 1) { b--; c = BOOKS[b].ch; } else if (c > BOOKS[b].ch) { b++; c = 1; }
  S.reader = { b, c }; SEL = new Set(); save(); renderBible(); window.scrollTo(0, 0);
}
function selRuns() {
  const ns = [...SEL].sort((a, b) => a - b), runs = [];
  for (const n of ns) { const r = runs[runs.length - 1]; if (r && r[1] === n - 1) r[1] = n; else runs.push([n, n]); }
  const { b, c } = S.reader, book = BIBLE[b];
  return runs.map(([a, z]) => ({ ref: `${refBook(b)} ${c}:${a}${z > a ? "-" + z : ""}`, text: book.chapters[c - 1].slice(a - 1, z).join(" ") }));
}
function selBar() {
  $(".selbar")?.remove();
  if (TAB !== "bible" || !SEL.size || !BIBLE[S.reader.b]) return;
  const runs = selRuns(), allSaved = runs.every((r) => isSaved(r.ref));
  const d = document.createElement("div"); d.className = "selbar";
  d.innerHTML = `<div class="in"><b>${esc(runs.map((r) => r.ref).join(", "))}</b><button class="save" id="ssave">${allSaved ? I.heart + "Saved" : I.heartO + "Save"}</button><button id="scopy" aria-label="Copy">${I.copy}</button><button id="sx" aria-label="Clear selection">${I.x}</button></div>`;
  document.body.append(d);
  $("#ssave").onclick = () => { for (const r of runs) if (allSaved ? isSaved(r.ref) : !isSaved(r.ref)) toggleSave(r.ref, r.text); SEL = new Set(); renderBible(); };
  $("#scopy").onclick = () => copyVerse(runs.map((r) => r.ref).join(", "), runs.map((r) => r.text).join(" "));
  $("#sx").onclick = () => { SEL = new Set(); renderBible(); };
}
function openPicker(testament, chosen) {
  if (chosen != null) {
    sheet(`<h3>${esc(BOOKS[chosen].name)}</h3><p>Choose a chapter</p><div class="chgrid">${Array.from({ length: BOOKS[chosen].ch }, (_, i) => `<button data-ch="${i + 1}" aria-current="${S.reader.b === chosen && S.reader.c === i + 1}">${i + 1}</button>`).join("")}</div>`,
      (el) => el.querySelectorAll("[data-ch]").forEach((x) => (x.onclick = () => { S.reader = { b: chosen, c: +x.dataset.ch }; SEL = new Set(); save(); closeSheet(); renderBible(); window.scrollTo(0, 0); })));
    return;
  }
  const list = BOOKS.map((bk, i) => ({ bk, i })).filter((x) => (testament === "ot" ? x.i < 39 : x.i >= 39));
  sheet(`<h3>Choose a book</h3><div class="booktabs"><button data-t="ot" aria-pressed="${testament === "ot"}">Old Testament</button><button data-t="nt" aria-pressed="${testament === "nt"}">New Testament</button></div>
    <div class="bookgrid">${list.map(({ bk, i }) => `<button data-b="${i}" aria-current="${S.reader.b === i}">${esc(bk.name)}</button>`).join("")}</div>`,
    (el) => { el.querySelectorAll("[data-t]").forEach((x) => (x.onclick = () => openPicker(x.dataset.t))); el.querySelectorAll("[data-b]").forEach((x) => (x.onclick = () => { const i = +x.dataset.b; BOOKS[i].ch === 1 ? (S.reader = { b: i, c: 1 }, SEL = new Set(), save(), closeSheet(), renderBible()) : openPicker(null, i); })); });
}

/* Saved */
let savedQ = "";
function renderSaved() {
  setColor((SEC[S.section] || SECTIONS[0]).color);
  const all = Object.entries(S.saved).sort((a, b) => b[1].at.localeCompare(a[1].at));
  const q = savedQ.trim().toLowerCase();
  const list = q ? all.filter(([r, s]) => (r + " " + s.t + " " + (s.note || "")).toLowerCase().includes(q)) : all;
  let h = topBar(`<span class="title-bar">Saved</span>`);
  if (!all.length) {
    h += `<div class="empty">${medallion("#FF5C7A", "current", D(I.heart), 11).replace("<svg", "<svg class=\"big\"")}<h3>Keep the verses that speak to you</h3><p>Tap the heart on any verse in a lesson, or select verses while reading the Bible. They'll live here so you can come back, add notes, and memorize them.</p><button class="btn" id="toBible">Open the Bible</button></div>`;
  } else {
    h += `<h1 class="page-h">My verses</h1><p class="page-sub">${all.length} saved${all.length > 1 ? " · practice them to memorize" : ""}</p>
      <button class="btn wide" id="practice">${I.bulb}Practice saved verses</button>
      <div style="margin-top:14px"><input class="search" id="sq" type="search" placeholder="Search your verses and notes" value="${esc(savedQ)}" aria-label="Search saved verses"></div>
      <div class="savedlist">${list.map(([ref, s]) => `<article class="scard card" data-ref="${esc(ref)}">
        <div class="row"><button class="ref" data-open="${esc(ref)}">${esc(ref)}</button><span class="when">${new Date(s.at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span></div>
        <blockquote>${esc(s.t)}</blockquote>
        <textarea class="note" data-note="${esc(ref)}" rows="1" placeholder="Why does this verse matter to you?" aria-label="Note for ${esc(ref)}">${esc(s.note || "")}</textarea>
        <div class="row"><span></span><span class="acts"><button class="iconbtn" data-copy="${esc(ref)}" aria-label="Copy ${esc(ref)}">${I.copy}</button><button class="iconbtn heart on" data-unsave="${esc(ref)}" aria-label="Remove ${esc(ref)}">${I.heart}</button></span></div></article>`).join("")}
      ${q && !list.length ? `<p class="page-sub">No saved verses match "${esc(savedQ)}".</p>` : ""}</div>`;
  }
  view().innerHTML = `<div class="wrap">${h}</div>`;
  $("#toBible")?.addEventListener("click", () => tab("bible"));
  $("#practice")?.addEventListener("click", startPractice);
  const sq = $("#sq"); if (sq) sq.oninput = () => { savedQ = sq.value; const p = sq.selectionStart; renderSaved(); const n = $("#sq"); n.focus(); n.setSelectionRange(p, p); };
  $$("[data-note]").forEach((t) => { const fit = () => { t.style.height = "auto"; t.style.height = t.scrollHeight + 4 + "px"; }; fit(); t.oninput = () => { fit(); if (S.saved[t.dataset.note]) { S.saved[t.dataset.note].note = t.value; save(); } }; });
  $$("[data-copy]").forEach((b) => (b.onclick = () => copyVerse(b.dataset.copy, S.saved[b.dataset.copy].t)));
  $$("[data-unsave]").forEach((b) => (b.onclick = () => { toggleSave(b.dataset.unsave); renderSaved(); }));
  $$("[data-open]").forEach((b) => (b.onclick = () => { const p = parseRef(b.dataset.open); if (!p) return; S.reader = { b: p.b, c: p.c }; SEL = new Set(); save(); TAB = "bible"; $$(".tabs button").forEach((x) => x.setAttribute("aria-selected", x.dataset.tab === TAB)); renderBible(p.v1); }));
}

/* Profile */
function renderMe() {
  setColor((SEC[S.section] || SECTIONS[0]).color);
  const lessons = Object.keys(S.done).filter((k) => !k.startsWith("R:")).length;
  const total = Object.keys(LESSON).length;
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return localDay(d); });
  const max = Math.max(S.goal, ...days.map((d) => S.days[d] || 0));
  let h = topBar(`<span class="title-bar">Profile</span>`);
  h += `<h1 class="page-h">Your cathedral</h1><p class="page-sub">${lessons} of ${total} panes lit across five windows</p>
  <div class="nave">${SECTIONS.map((s) => { const [d, n] = secProgress(s.id); return `<button data-go="${s.id}" data-c="${s.color}">${roseFor(s)}<span class="pct">${Math.round((d / n) * 100)}%</span>${esc(s.name.replace("The ", ""))}</button>`; }).join("")}</div>
  <div class="stats">
    <div class="stat card" style="color:#FF9A3D">${I.flame}<div><b style="color:var(--ink)">${liveStreak()}</b><small>Day streak</small></div></div>
    <div class="stat card" style="color:var(--gilt)">${I.xp}<div><b style="color:var(--ink)">${S.xp}</b><small>Total XP</small></div></div>
    <div class="stat card" style="color:var(--c)">${I.check}<div><b style="color:var(--ink)">${lessons}</b><small>Lessons done</small></div></div>
    <div class="stat card" style="color:#FF5C7A">${I.heart}<div><b style="color:var(--ink)">${Object.keys(S.saved).length}</b><small>Verses saved</small></div></div></div>
  <section class="block"><h3>This week</h3><div class="card week" role="img" aria-label="XP earned each of the last 7 days">${days.map((d) => { const x = S.days[d] || 0; return `<div class="col ${x ? "" : "zero"} ${d === today() ? "today" : ""}"><em>${x || ""}</em><i style="height:${Math.max(4, (x / max) * 86)}px"></i><small>${new Date(d + "T12:00").toLocaleDateString(undefined, { weekday: "narrow" })}</small></div>`; }).join("")}</div>
    <p class="page-sub" style="margin-top:10px">Best streak: ${Math.max(S.best, liveStreak())} day${Math.max(S.best, liveStreak()) === 1 ? "" : "s"}</p></section>
  <section class="block"><h3>Daily goal</h3><div class="segs">${[[10, "Casual"], [20, "Regular"], [30, "Serious"], [50, "Intense"]].map(([n, l]) => `<button data-goal="${n}" aria-pressed="${S.goal === n}">${l} · ${n}</button>`).join("")}</div></section>
  ${NATIVE ? `<section class="block"><h3>Daily reminder</h3><div class="segs"><button data-remind="1" aria-pressed="${S.remind.on}">On</button><button data-remind="0" aria-pressed="${!S.remind.on}">Off</button></div>
    ${S.remind.on ? `<label class="card goal" style="margin-top:10px" for="rtime"><div><b>Remind me at</b><small>Skipped on days you've already done a lesson</small></div><input id="rtime" type="time" value="${S.remind.time}" class="search" style="width:auto"></label>` : ""}</section>` : ""}
  <section class="block"><h3>Sound effects</h3><div class="segs"><button data-sound="1" aria-pressed="${S.sound}">On</button><button data-sound="0" aria-pressed="${!S.sound}">Off</button></div></section>
  <button class="linkbtn" id="reset">Reset all progress</button>
  <p class="fine">Scripture quotations are from the Berean Standard Bible (BSB), which is in the public domain. Your progress and saved verses are stored on this device.</p><p class="fine"><a href="privacy.html" style="color:var(--muted)">Privacy</a> · <a href="support.html" style="color:var(--muted)">Support</a></p>`;
  view().innerHTML = `<div class="wrap">${h}</div>`;
  $$("[data-go]").forEach((b) => (b.onclick = () => { S.section = b.dataset.go; save(); tab("learn"); }));
  $$("[data-goal]").forEach((b) => (b.onclick = () => { S.goal = +b.dataset.goal; save(); renderMe(); }));
  $$("[data-remind]").forEach((b) => (b.onclick = async () => { if (b.dataset.remind === "1") await enableReminders(S.remind.time); else { S.remind.on = false; save(); reschedule(); } renderMe(); }));
  const rt = $("#rtime"); if (rt) rt.onchange = () => { if (rt.value) { S.remind.time = rt.value; save(); reschedule(); toast("Reminder time saved"); } };
  $$("[data-sound]").forEach((b) => (b.onclick = () => { S.sound = b.dataset.sound === "1"; save(); renderMe(); if (S.sound) beep(true); }));
  let armed = false;
  $("#reset").onclick = (e) => { if (!armed) { armed = true; e.target.textContent = "Tap again to erase progress (saved verses are kept)"; return; } const keep = S.saved; S = fresh(); S.saved = keep; save(); toast("Progress reset"); renderMe(); };
}

/* ---------- exercise builders ---------- */
// Words that make good blanks in verses the user saved from the reader (no hand-written blank).
const THEME = ["love","faith","hope","grace","peace","light","life","glory","truth","mercy","heart","spirit","kingdom","heaven","joy","strength","righteousness","salvation","wisdom","power","holy","eternal","world","people","name","blood","cross","sin","death","fear","trust","praise","prayer","bread","water","shepherd","king","children","earth","word","soul","path","rock","fire","lamb","covenant","promise","temple","nations","Lord","God","Father","Son","Spirit","Christ","Jesus"];
const THEME_SET = new Set(THEME.map((w) => w.toLowerCase()));
function blankStep(ref) {
  const words = passageText(ref).split(/\s+/);
  const k = VERSES[ref] && VERSES[ref].k;
  if (k) { const all = shuffle([k.w, ...k.o]); return { type: "blank", ref, idx: k.i, options: all, ans: all.indexOf(k.w) }; }
  const counts = {}; words.forEach((w) => { const c = core(w).toLowerCase(); counts[c] = (counts[c] || 0) + 1; });
  let cand = words.map((w, i) => ({ i, c: core(w) })).filter((x) => THEME_SET.has(x.c.toLowerCase()) && counts[x.c.toLowerCase()] === 1);
  if (!cand.length) cand = words.map((w, i) => ({ i, c: core(w) })).filter((x) => x.c.length >= 5 && !STOP.has(x.c.toLowerCase()) && counts[x.c.toLowerCase()] === 1);
  if (!cand.length) return null;
  const pick = cand[rand(cand.length)], ans = pick.c, cap = ans[0] !== ans[0].toLowerCase();
  const inVerse = new Set(Object.keys(counts));
  const pool = THEME_SET.has(ans.toLowerCase()) ? THEME.filter((w) => w[0] === w[0].toLowerCase()) : POOL.filter((w) => Math.abs(w.length - ans.length) <= 2);
  const opts = pickN(pool.filter((w) => !inVerse.has(w.toLowerCase())), 3).map((w) => (cap ? w[0].toUpperCase() + w.slice(1) : w));
  const all = shuffle([ans, ...opts]);
  return { type: "blank", ref, idx: pick.i, options: all, ans: all.indexOf(ans) };
}
function whereStep(ref, pool) {
  const p = parseRef(ref);
  const others = (pool || ALL_REFS).filter((r) => { const q = parseRef(r); return r !== ref && q && !(q.b === p?.b && q.c === p?.c); });
  const opts = shuffle([ref, ...pickN(others.length >= 3 ? others : ALL_REFS.filter((r) => r !== ref), 3)]);
  return { type: "where", ref, options: opts, ans: opts.indexOf(ref) };
}
// Put a real phrase from the verse back in order. Uses a natural clause (4 to 9 words); no filler words.
function buildStep(ref) {
  const words = passageText(ref).split(/\s+/).filter(Boolean);
  const clauses = []; let st = 0;
  words.forEach((w, i) => { if (/[,;:.!?”’]$/.test(w) || i === words.length - 1) { clauses.push([st, i + 1]); st = i + 1; } });
  let good = clauses.filter(([a, b]) => b - a >= 4 && b - a <= 9);
  let start, end;
  if (good.length) [start, end] = good[rand(good.length)];
  else if (words.length <= 9) [start, end] = [0, words.length];
  else { const len = 7; start = rand(words.length - len + 1); end = start + len; }
  const chunk = words.slice(start, end).map(core).filter(Boolean);
  let bank = shuffle(chunk);
  for (let t = 0; t < 5 && bank.join(" ") === chunk.join(" "); t++) bank = shuffle(chunk);
  return { type: "build", ref, start, end, chunk, bank };
}
function mcStep(q) {
  const [question, ...opts] = q, correct = opts[0], all = shuffle(opts);
  return { type: "mc", q: question, options: all, ans: all.indexOf(correct) };
}

function lessonSteps(L, sec) {
  const refs = L.v, pool = sec.units.flatMap((u) => u.lessons.flatMap((x) => x.v));
  const s = [{ type: "teach", title: L.t, paras: L.teach }];
  for (const r of refs) s.push({ type: "read", ref: r });
  const shortest = refs.slice().sort((a, b) => passageText(a).length - passageText(b).length)[0];
  const add = (x) => x && s.push(x);
  add(blankStep(refs[0]));
  if (L.q[0]) add(mcStep(L.q[0]));
  add(whereStep(refs[1] || refs[0], pool));
  add(buildStep(shortest));
  if (L.q[1]) add(mcStep(L.q[1]));
  if (refs[1]) add(blankStep(refs[1]));
  for (const q of L.q.slice(2)) add(mcStep(q));
  return s;
}

/* ---------- player ---------- */
let P = null;
function openPlayer(meta, steps) {
  steps.forEach((x, i) => (x.uid = i));
  P = { meta, steps, pos: 0, sel: null, checked: false, graded: 0, firstRight: 0, retried: new Set(), built: [], combo: 0 };
  const el = document.createElement("div"); el.className = "player"; el.id = "player"; el.dataset.c = meta.color;
  el.innerHTML = `<div class="p-top"><button class="iconbtn" id="pquit" aria-label="Quit">${I.x}</button><div class="panes" id="panes" role="progressbar" aria-label="Lesson progress"></div><span class="combo" id="combo"></span></div>
    <div class="p-body" id="pbody"><div class="p-inner" id="pin"></div></div>
    <div class="p-foot" id="pfoot"><div class="p-inner"><div class="fb" id="fb" hidden></div><button class="btn wide go" id="pgo">Continue</button></div></div>`;
  document.body.append(el); document.body.style.overflow = "hidden"; $(".selbar")?.remove();
  $("#pquit").onclick = askQuit;
  draw();
}
function askQuit() {
  if (!P || P.pos === 0 || P.finished) return closePlayer();
  sheet(`<h3>Leave this lesson?</h3><p>You'll lose your progress in this lesson.</p><div style="display:grid;gap:10px"><button class="btn wide" id="stay">Keep learning</button><button class="btn ghost wide" id="leave">End lesson</button></div>`,
    (el) => { el.querySelector("#stay").onclick = closeSheet; el.querySelector("#leave").onclick = () => { closeSheet(); closePlayer(); }; }, P.meta.color);
}
function closePlayer() { $("#player")?.remove(); document.body.style.overflow = ""; P = null; render(); }
const verseHTML = (ref, blankIdx) => {
  const v = VERSES[ref];
  if (blankIdx != null) {
    const words = passageText(ref).split(/\s+/);
    return words.map((w, i) => { if (i !== blankIdx) return esc(w); const c = core(w), k = w.indexOf(c); return esc(w.slice(0, k)) + `<span class="blank" id="blank">?</span>` + esc(w.slice(k + c.length)); }).join(" ");
  }
  if (v && v.v.length > 1) return v.v.map(([n, t]) => `<sup>${n}</sup>${esc(t)}`).join(" ");
  return esc(passageText(ref));
};
function saveBtn(ref) { const on = isSaved(ref); return `<button class="savebtn ${on ? "on" : ""}" data-psave="${esc(ref)}" aria-pressed="${on}">${on ? I.heart : I.heartO}${on ? "Saved" : "Save"}</button>`; }
function wireSave(root) { root.querySelectorAll("[data-psave]").forEach((b) => (b.onclick = () => { const on = toggleSave(b.dataset.psave); b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); b.innerHTML = (on ? I.heart : I.heartO) + (on ? "Saved" : "Save"); })); }

function drawPanes(done) {
  const n = P.steps.length, k = done ? n : P.pos;
  $("#panes").innerHTML = Array.from({ length: n }, (_, i) => `<i class="${i < k ? "on" : ""}"></i>`).join("");
  $("#panes").setAttribute("aria-valuenow", Math.round((k / n) * 100));
  $("#combo").innerHTML = P.combo >= 3 ? `${I.flame}${P.combo}` : "";
}
function draw() {
  const st = P.steps[P.pos], pin = $("#pin"), go = $("#pgo"), foot = $("#pfoot");
  foot.className = "p-foot"; $("#fb").hidden = true; P.sel = null; P.checked = false; P.built = [];
  drawPanes();
  const label = (icon, t) => `<div class="kind">${t}</div>`;
  if (st.type === "teach") {
    pin.innerHTML = `<div class="teach">${label("", P.meta.kicker)}<h1>${esc(st.title)}</h1>${st.paras.map((p) => `<p>${esc(p)}</p>`).join("")}</div>`;
    go.disabled = false; go.textContent = "Continue"; go.onclick = next;
  } else if (st.type === "read") {
    pin.innerHTML = `${label(I.book, st.retry ? "Read it again" : "New verse")}<div class="vcard" style="margin-top:14px"><p class="verse">${verseHTML(st.ref)}</p><div class="vfoot"><span class="ref">${esc(st.ref)}</span>${saveBtn(st.ref)}</div></div>`;
    wireSave(pin); go.disabled = false; go.textContent = "Continue"; go.onclick = next;
  } else if (st.type === "mc" || st.type === "blank" || st.type === "where") {
    let head;
    if (st.type === "mc") head = `${label(I.q, st.retry ? "Try again" : "Question")}<h1 class="q">${esc(st.q)}</h1>`;
    else if (st.type === "blank") head = `${label(I.bulb, st.retry ? "Try again" : "Fill in the blank")}<div class="vcard" style="margin:14px 0 20px"><p class="verse">${verseHTML(st.ref, st.idx)}</p><span class="ref">${esc(st.ref)}</span></div>`;
    else head = `${label(I.book, st.retry ? "Try again" : "Where is this verse?")}<div class="vcard" style="margin:14px 0 20px"><p class="verse">${verseHTML(st.ref)}</p></div>`;
    pin.innerHTML = `${head}<div class="opts ${st.type === "blank" ? "two" : ""}">${st.options.map((o, j) => `<button class="opt" data-j="${j}" aria-pressed="false"><span class="n">${j + 1}</span>${esc(o)}</button>`).join("")}</div>`;
    pin.querySelectorAll(".opt").forEach((b) => (b.onclick = () => pick(+b.dataset.j)));
    go.disabled = true; go.textContent = "Check"; go.onclick = () => (P.checked ? next() : check());
  } else if (st.type === "build") {
    const words = passageText(st.ref).split(/\s+/).filter(Boolean);
    const pre = words.slice(Math.max(0, st.start - 10), st.start).join(" "), post = words.slice(st.end, st.end + 6).join(" ");
    pin.innerHTML = `${label(I.bulb, st.retry ? "Try again" : "Put the words in order")}
      <p class="ctx" style="margin-top:14px">${st.start > 10 ? "… " : ""}${esc(pre)}${pre ? " " : ""}<b style="color:var(--c)">_____</b>${post ? " " + esc(post) : ""}${st.end + 6 < words.length ? " …" : ""}</p>
      <div class="answer" id="ans" aria-label="Your answer"></div><div class="bank" id="bank">${st.bank.map((w, j) => `<button class="chip" data-k="${j}">${esc(w)}</button>`).join("")}</div><p class="ref" style="margin-top:16px;text-align:center">${esc(st.ref)}</p>`;
    pin.querySelectorAll("#bank .chip").forEach((b) => (b.onclick = () => { if (P.checked || b.classList.contains("used")) return; P.built.push(+b.dataset.k); b.classList.add("used"); drawAnswer(); }));
    drawAnswer(); go.textContent = "Check"; go.onclick = () => (P.checked ? next() : check());
  }
  $("#pbody").scrollTop = 0;
}
function drawAnswer() {
  const st = P.steps[P.pos], ans = $("#ans");
  ans.innerHTML = P.built.map((k, i) => `<button class="chip" data-i="${i}">${esc(st.bank[k])}</button>`).join("");
  ans.querySelectorAll(".chip").forEach((b) => (b.onclick = () => { if (P.checked) return; const k = P.built.splice(+b.dataset.i, 1)[0]; $(`#bank [data-k="${k}"]`).classList.remove("used"); drawAnswer(); }));
  $("#pgo").disabled = P.built.length === 0;
}
function pick(j) {
  if (!P || P.checked) return; const st = P.steps[P.pos]; if (!["mc", "blank", "where"].includes(st.type)) return;
  const os = $$("#pin .opt"); if (!os[j]) return;
  os.forEach((x) => x.setAttribute("aria-pressed", "false")); os[j].setAttribute("aria-pressed", "true");
  P.sel = j; $("#pgo").disabled = false;
  if (st.type === "blank") { const b = $("#blank"); if (b) b.textContent = st.options[j]; }
}
function check() {
  const st = P.steps[P.pos]; P.checked = true;
  let ok, right;
  if (st.type === "build") { ok = P.built.map((k) => st.bank[k]).join(" ") === st.chunk.join(" "); right = st.chunk.join(" "); $$("#bank .chip").forEach((b) => (b.disabled = true)); }
  else { ok = P.sel === st.ans; right = st.options[st.ans]; $$("#pin .opt").forEach((b, j) => { b.disabled = true; if (j === st.ans) b.classList.add("right"); else if (j === P.sel) b.classList.add("wrong"); }); if (st.type === "blank") $("#blank").textContent = right; }
  if (!st.retry) { P.graded++; if (ok) P.firstRight++; }
  P.combo = ok ? P.combo + 1 : 0; $("#combo").innerHTML = P.combo >= 3 ? `${I.flame}${P.combo}` : "";
  haptic(ok ? "light" : "error");
  if (!ok && !P.retried.has(st.uid)) { P.retried.add(st.uid); P.steps.push({ ...st, retry: true, ...(st.type === "build" ? { bank: shuffle(st.bank) } : st.options ? reshuffle(st) : {}) }); }
  beep(ok);
  const praise = P.combo >= 3 ? `${P.combo} in a row!` : ["Excellent!", "Nice job!", "Correct!", "Well done!", "Amen!", "Great!"][rand(6)];
  $("#pfoot").className = "p-foot " + (ok ? "good" : "bad");
  const fb = $("#fb"); fb.hidden = false;
  fb.innerHTML = `<span class="badge">${ok ? I.check : I.x}</span><div><strong>${ok ? praise : "Correct answer:"}</strong>${ok ? (st.ref && st.type !== "where" ? `<span>${esc(st.ref)}</span>` : "") : `<span>${esc(right)}</span>`}</div>`;
  const go = $("#pgo"); go.disabled = false; go.textContent = "Continue";
}
function reshuffle(st) { const right = st.options[st.ans], o = shuffle(st.options); return { options: o, ans: o.indexOf(right) }; }
function next() { P.pos++; if (P.pos >= P.steps.length) finish(); else draw(); }

function finish() {
  const m = P.meta, first = !isDone(m.id), perfect = P.graded > 0 && P.firstRight === P.graded;
  const gain = m.kind === "practice" ? 10 : first ? m.xp + (m.kind === "lesson" && perfect ? 5 : 0) : 5;
  const before = xpToday();
  S.xp += gain; S.days[today()] = before + gain;
  if (m.id) S.done[m.id] = true;
  const t = today();
  if (S.last !== t) { S.streak = S.last && dayDiff(S.last, t) === 1 ? S.streak + 1 : 1; S.last = t; }
  S.best = Math.max(S.best, S.streak);
  save(); P.finished = true;
  const acc = P.graded ? Math.round((P.firstRight / P.graded) * 100) : 100;
  const goalHit = before < S.goal && S.days[t] >= S.goal;
  drawPanes(true);
  if (m.kind === "lesson") { const L = LESSON[m.id]; S.lastLit = { sec: L.sec.id, key: `${L.ui}-${L.li}` }; save(); }
  const icon = m.kind === "review" ? D(I.trophy) : m.kind === "practice" ? D(I.heart) : D(I.check);
  const title = m.kind === "review" ? "Window sealed" : m.kind === "practice" ? "Well practiced" : "A pane is lit";
  const line = goalHit ? "You hit your daily goal. Keep showing up." : perfect ? "Perfect. Not a single mistake." : "Every verse you learn stays with you.";
  $("#pin").innerHTML = `<div class="done-screen"><div class="shine">${medallion(GLASS[m.color] || GLASS.gold, "done", icon, 5)}</div>
    <h2>${title}</h2><p class="page-sub" style="margin:0">${line}</p>
    <div class="tiles"><div class="tile"><small>XP</small><b style="color:var(--gilt)">+${gain}</b></div><div class="tile"><small>Accuracy</small><b style="color:var(--good)">${acc}%</b></div><div class="tile"><small>Streak</small><b style="color:#FF9A3D">${S.streak}</b></div></div>
    ${m.refs && m.refs.length ? `<div class="keep"><h4>Did a verse speak to you? Keep it.</h4>${m.refs.map((r) => `<div class="krow"><div><p>${esc(passageText(r))}</p><span class="ref">${esc(r)}</span></div>${saveBtn(r)}</div>`).join("")}</div>` : ""}</div>`;
  confetti(GLASS[m.color] || GLASS.gold);
  beep(true); setTimeout(() => beep(true), 140);
  wireSave($("#pin"));
  $("#pfoot").className = "p-foot"; $("#fb").hidden = true;
  const go = $("#pgo"); go.disabled = false; go.textContent = "Continue"; go.onclick = () => { closePlayer(); if (NATIVE && !S.remind.asked) offerReminder(); };
  haptic("success"); reschedule();
  $("#pbody").scrollTop = 0;
}

function confetti(hex) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const c = document.createElement("canvas"); c.id = "confetti"; document.body.append(c);
  const dpr = devicePixelRatio || 1, W = (c.width = innerWidth * dpr), H = (c.height = innerHeight * dpr), x = c.getContext("2d");
  const cols = [hex, "#E6C36A", "#FFFFFF", hex, "#F1EEE6"];
  const ps = Array.from({ length: 90 }, () => ({ x: W / 2 + (Math.random() - 0.5) * W * 0.2, y: H * 0.32, vx: (Math.random() - 0.5) * 14 * dpr, vy: (-Math.random() * 14 - 6) * dpr, s: (4 + Math.random() * 6) * dpr, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, c: cols[rand(cols.length)], sides: 3 + rand(2) }));
  let t = 0;
  (function f() {
    x.clearRect(0, 0, W, H); t++;
    for (const p of ps) {
      p.vy += 0.45 * dpr; p.x += p.vx; p.y += p.vy; p.vx *= 0.99; p.r += p.vr;
      x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.globalAlpha = Math.max(0, 1 - t / 110); x.fillStyle = p.c; x.beginPath();
      for (let i = 0; i < p.sides; i++) { const a = (i / p.sides) * Math.PI * 2; x.lineTo(Math.cos(a) * p.s, Math.sin(a) * p.s); }
      x.fill(); x.restore();
    }
    if (t < 110) requestAnimationFrame(f); else c.remove();
  })();
}

function startLesson(id) {
  const { sec, ui, li, l } = LESSON[id];
  openPlayer({ kind: "lesson", id, sec: sec.id, color: sec.color, xp: 10, refs: l.v, kicker: `${sec.name} · Unit ${ui + 1} · Lesson ${li + 1}` }, lessonSteps(l, sec));
}
function startReview(sec, ui) {
  const u = sec.units[ui], refs = [...new Set(u.lessons.flatMap((l) => l.v))], pool = sec.units.flatMap((x) => x.lessons.flatMap((l) => l.v));
  let steps = refs.map((r, i) => (i % 2 ? whereStep(r, pool) : blankStep(r))).filter(Boolean);
  steps.push(...pickN(refs, 2).map(buildStep));
  steps.push(...pickN(u.lessons.flatMap((l) => l.q), 3).map(mcStep));
  steps = shuffle(steps).slice(0, 12);
  openPlayer({ kind: "review", id: `R:${sec.id}-${ui}`, sec: sec.id, color: sec.color, xp: 15, refs: [], kicker: "Unit review" }, steps);
}
function startPractice() {
  const refs = pickN(Object.keys(S.saved), 6);
  let steps = [];
  for (const r of refs) { steps.push(blankStep(r)); }
  steps.push(...pickN(refs, Math.min(3, refs.length)).map(buildStep));
  if (refs.length >= 2) steps.push(...pickN(refs, 2).map((r) => whereStep(r, [...ALL_REFS, ...Object.keys(S.saved)])));
  steps = shuffle(steps.filter(Boolean));
  if (!steps.length) { toast("Save a few more verses to practice"); return; }
  openPlayer({ kind: "practice", id: null, sec: "saved", color: (SEC[S.section] || SECTIONS[0]).color, xp: 10, refs: [], kicker: "Practice" }, steps);
}

/* ---------- global wiring ---------- */
document.addEventListener("click", (e) => {
  const sv = e.target.closest("[data-save]");
  if (sv && !$("#player")) { const on = toggleSave(sv.dataset.save); sv.classList.toggle("on", on); sv.innerHTML = on ? I.heart : I.heartO; sv.setAttribute("aria-label", on ? "Remove from saved" : "Save verse"); return; }
  const nd = e.target.closest("[data-node]");
  if (nd && !$("#player")) openNode(+nd.dataset.node);
});
$$(".tabs button").forEach((b) => (b.onclick = () => tab(b.dataset.tab)));
document.addEventListener("keydown", (e) => {
  if ($("#scrim") && e.key === "Escape") return closeSheet();
  if (!P || $("#scrim")) return;
  if (e.key === "Escape") return askQuit();
  if (/^[1-6]$/.test(e.key)) pick(+e.key - 1);
  else if (e.key === "Enter" && !$("#pgo").disabled && !(document.activeElement && document.activeElement.closest(".opt,.chip,.savebtn"))) { e.preventDefault(); $("#pgo").click(); }
});

$(".tabs").innerHTML = `<div class="bar">${[["learn", "Learn", I.learn], ["bible", "Bible", I.book], ["saved", "Saved", I.heart], ["me", "Profile", I.user]].map(([k, l, ic]) => `<button role="tab" data-tab="${k}" aria-selected="${k === TAB}">${ic}${l}</button>`).join("")}</div>`;
$$(".tabs button").forEach((b) => (b.onclick = () => tab(b.dataset.tab)));
/* ---------- reminders (iOS app only) ---------- */
function reschedule() {
  if (!NATIVE) return;
  const verses = pickN(VOTD_REFS, 14).map((r) => ({ ref: r, text: passageText(r) }));
  scheduleReminders({ on: S.remind.on, time: S.remind.time, doneToday: S.last === today(), streak: liveStreak(), verses });
}
async function enableReminders(time) {
  const ok = await askForReminders();
  S.remind = { ...S.remind, on: ok, time, asked: true }; save();
  if (ok) { reschedule(); toast("Daily reminder is on"); } else toast("Notifications are off for Scroll. Turn them on in iPhone Settings.");
}
function offerReminder() {
  S.remind.asked = true; save();
  sheet(`<div class="medal-row">${medallion(GLASS.gold, "current", D(I.flame), 9)}<div><span class="eyebrow">Stay consistent</span><h3>Want a daily nudge?</h3></div></div>
    <p>A gentle reminder with a verse, once a day. It skips days you've already done a lesson.</p>
    <label class="card goal" for="otime" style="margin-bottom:14px"><div><b>Remind me at</b></div><input id="otime" type="time" value="${S.remind.time}" class="search" style="width:auto"></label>
    <div style="display:grid;gap:10px"><button class="btn wide" id="ron">Turn on reminders</button><button class="btn ghost wide" id="roff">Not now</button></div>`,
    (el) => { el.querySelector("#ron").onclick = async () => { const t = el.querySelector("#otime").value || "19:00"; closeSheet(); await enableReminders(t); }; el.querySelector("#roff").onclick = closeSheet; });
}

render();
initNative(() => { reschedule(); refresh(); });
if (NATIVE) {
  if (!lsGet(KEY)) restore().then((raw) => { if (!raw) return; try { S = Object.assign(fresh(), JSON.parse(raw)); lsSet(KEY, S); refresh(); } catch {} });
  remindersAllowed().then((ok) => { if (!ok && S.remind.on) { S.remind.on = false; save(); } reschedule(); });
}

if ("serviceWorker" in navigator && location.protocol === "https:" && !/claude|anthropic/.test(location.hostname)) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
