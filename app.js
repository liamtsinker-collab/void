// Void — app logic. Everything is saved in your browser (localStorage); no server yet.
const $ = (id) => document.getElementById(id);
const KEY = "void-state-v1";

let state = load();
let pending = null;                 // experiment currently on the card
let ref = { before: null, after: null, verdict: null };

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s && Array.isArray(s.done)) return { quest: null, ...s };
  } catch {}
  return { done: [], quest: null };
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} }
const getExp = (id) => EXPERIMENTS.find((e) => e.id === id);
const rand = (a, b) => a + Math.random() * (b - a);

// ---------- screens ----------
const TAB_OF = { home: "home", exp: "home", reflect: "home", map: "map", wins: "wins" };
function show(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("active", s.id === id));
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t.dataset.go === TAB_OF[id]));
  window.scrollTo(0, 0);
}
document.querySelectorAll(".tab").forEach((t) => {
  t.onclick = () => {
    if (t.dataset.go === "map") renderMap();
    if (t.dataset.go === "wins") renderWins();
    if (t.dataset.go === "home") renderHome();
    show(t.dataset.go);
  };
});

// ---------- progress ----------
const GOAL = 20;    // completing 20 experiments fills the void completely
const LEVELS = [
  [0, "Empty void"], [1, "First spark"], [3, "Curious"], [6, "Explorer"],
  [10, "Adventurer"], [15, "Pathfinder"], [20, "Void filler"]
];
const levelName = (n) => [...LEVELS].reverse().find(([min]) => n >= min)[1];

function streakWeeks() {
  const weeks = new Set(state.done.map((d) => Math.floor(d.ts / 6048e5)));
  let w = Math.floor(Date.now() / 6048e5), s = 0;
  if (!weeks.has(w)) w--;
  while (weeks.has(w)) { s++; w--; }
  return s;
}

// ---------- Void the character ----------
const SVGNS = "http://www.w3.org/2000/svg";
const STICKER_SPOTS = { make: [30, 66], move: [212, 70], learn: [26, 152], social: [216, 150], nature: [58, 214], give: [186, 214] };
const SPAN = 192, PER = SPAN / GOAL;
let stickerSeen = new Set();

function renderVoid() {
  const n = state.done.length, f = Math.min(n / GOAL, 1);
  const layers = state.done.slice(-GOAL);

  // colours blend softly into each other, newest on top, like a dusk sky in a bottle
  const topDown = [...layers].reverse().map((d) => CATEGORIES[d.cat].color);
  const len = topDown.length;
  $("liqgrad").innerHTML = topDown.map((col, j) => {
    const a = (j + 0.42) / len, b = (j + 0.58) / len;
    return `<stop offset="${j === 0 ? 0 : a.toFixed(3)}" stop-color="${col}"/><stop offset="${j === len - 1 ? 1 : b.toFixed(3)}" stop-color="${col}"/>`;
  }).join("");
  $("layers").innerHTML = len ? `<rect x="-10" y="6" width="260" height="${len * PER + 2}" fill="url(#liqgrad)"/>` : "";
  $("wave").setAttribute("fill", len ? topDown[0] : "none");
  $("liquid").style.transform = `translateY(${222 - f * SPAN}px)`;

  let bubs = "";
  for (let i = 0; i < Math.min(n, 6); i++) {
    bubs += `<circle class="bub" cx="${rand(60, 180).toFixed(0)}" cy="${rand(20, 6 + Math.min(n, 8) * PER - 6).toFixed(0)}" r="${rand(2.5, 5).toFixed(1)}" style="animation-delay:${(-rand(0, 3.4)).toFixed(1)}s"/>`;
  }
  $("bubbles").innerHTML = bubs;

  $("hollow-q").style.opacity = n === 0 ? 1 : 0;
  document.querySelectorAll(".cheek").forEach((c) => c.classList.toggle("on", n >= 3));
  setMouth(n === 0 ? 0 : n < 5 ? 1 : n < 12 ? 2 : 3);

  // one sticker per category you've tried
  const tried = [...new Set(state.done.map((d) => d.cat))];
  $("stickers").innerHTML = tried.map((k, i) => {
    const [x, y] = STICKER_SPOTS[k];
    return `<text class="sparkle" x="${x}" y="${y}" text-anchor="middle" fill="${CATEGORIES[k].color}" style="color:${CATEGORIES[k].color};animation-delay:${-i * 0.6}s">✦</text>`;
  }).join("");

  // a soft glow behind Void that grows as he fills, tinted by your latest colour
  const stage = document.querySelector(".stage");
  stage.style.setProperty("--glow-o", (0.16 + f * 0.42).toFixed(2));
  stage.style.setProperty("--glow", layers.length ? CATEGORIES[layers[layers.length - 1].cat].color : "#b4a7ea");

  $("level").textContent = `${levelName(n)} · ${n}`;
}

function setMouth(level) {
  const m = $("mouth"), t = $("tongue");
  const shapes = [
    ["M109 152 Q120 155 131 152", "none", 0],    // calm, neutral
    ["M107 150 Q120 160 133 150", "none", 0],    // faint smile
    ["M104 148 Q120 165 136 148", "none", 0],    // warm smile
    ["M101 146 Q120 172 139 146", "none", 0]     // full, content smile
  ];
  m.setAttribute("d", shapes[level][0]);
  m.setAttribute("fill", shapes[level][1]);
  t.style.opacity = shapes[level][2];
}

function squish() {
  const b = $("squish");
  b.classList.remove("squish"); void b.getBoundingClientRect(); b.classList.add("squish");
  try { navigator.vibrate && navigator.vibrate(12); } catch {}
}

function say(text) {
  $("bubble-text").textContent = text;
  const b = $("bubble");
  b.classList.remove("say"); void b.offsetWidth; b.classList.add("say");
}

function homeLine() {
  const n = state.done.length;
  if (state.quest) return "Take your time. I'll be right here when you're done.";
  if (n === 0) return "Hey. I'm glad you're here. I feel a bit empty, and maybe you do too. Want to figure out what fills us up, together?";
  if (n < 3) return "Thank you. I felt that. Whenever you're ready, we can try another.";
  if (n < 8) return "I'm starting to have colour in me. That's you, working out what you like.";
  if (n < GOAL) return "Look how far we've come. All of this colour came from you trying.";
  return "I'm full. Every colour in me is something you tried. I'm proud of you.";
}

const POKES = [
  "I'm here.", "Hey. How are you doing today?", "No rush. Whenever you're ready.",
  "That tickles a little.", "I feel a bit fuller when you're around.", "Thanks for checking in on me."
];
$("void-svg").addEventListener("pointerdown", () => {
  squish();
  say(POKES[Math.floor(Math.random() * POKES.length)]);
});

// eyes follow your finger / cursor, and wander when nothing's happening
let lastPointer = 0;
function look(dx, dy) { ["pupL", "pupR"].forEach((id) => ($(id).style.transform = `translate(${dx}px,${dy}px)`)); }
addEventListener("pointermove", (e) => {
  lastPointer = Date.now();
  if (!$("home").classList.contains("active")) return;
  const r = $("void-svg").getBoundingClientRect();
  const vx = e.clientX - (r.left + r.width / 2), vy = e.clientY - (r.top + r.height * 0.44);
  const d = Math.hypot(vx, vy) || 1, m = Math.min(4, d / 30);
  look((vx / d) * m, (vy / d) * m);
});
setInterval(() => { if (Date.now() - lastPointer > 4000) look(rand(-4, 4), rand(-3, 4)); }, 2600);

// ---------- home actions: capsule, or your active quest ----------
function renderHome() {
  const box = $("home-actions");
  if (state.quest && getExp(state.quest.id)) {
    const e = getExp(state.quest.id), c = CATEGORIES[e.cat];
    box.innerHTML = `
      <div class="card quest" style="--c:${c.color}">
        <div class="big-emoji">${c.emoji}</div>
        <span class="tag">Your quest</span>
        <h3></h3><p></p>
        <span class="chip">⏱ about ${e.mins} min</span>
      </div>
      <div class="stack">
        <button class="btn primary" id="done">I did it! ✓</button>
        <button class="link" id="giveup">Swap this quest</button>
      </div>`;
    box.querySelector("h3").textContent = e.title;
    box.querySelector("p").textContent = e.desc;
    $("done").onclick = () => { pending = e; openReflect(); };
    $("giveup").onclick = () => { state.quest = null; save(); pending = pick(); showExperiment(); };
  } else {
    state.quest = null;
    box.innerHTML = `
      <div class="capsule-wrap">
        <button class="capsule" id="capsule" aria-label="Crack open a mystery quest">
          <span class="cap-top"></span><span class="cap-bot"></span><span class="cap-q">?</span>
        </button>
        <p class="hint">When you're ready, tap for a small quest</p>
      </div>`;
    $("capsule").onclick = crack;
  }
  say(homeLine());
}

function pick() {
  const doneIds = state.done.map((d) => d.id);
  let pool = EXPERIMENTS.filter((e) => !doneIds.includes(e.id) && (!pending || e.id !== pending.id));
  if (!pool.length) pool = EXPERIMENTS.filter((e) => !pending || e.id !== pending.id);
  return pool[Math.floor(Math.random() * pool.length)];
}

function crack() {
  const btn = $("capsule");
  btn.classList.add("shake");
  say("Let's see what's in here…");
  squish();
  const r = btn.getBoundingClientRect();
  setTimeout(() => {
    burst(r.left + r.width / 2, r.top + r.height / 2, 26);
    pending = pick();
    showExperiment();
  }, 720);
}

function showExperiment() {
  const c = CATEGORIES[pending.cat], card = $("card");
  card.style.setProperty("--c", c.color);
  card.innerHTML = `<div class="big-emoji">${c.emoji}</div><span class="tag">${c.label} quest</span><h2></h2><p></p><span class="chip">⏱ about ${pending.mins} min</span>`;
  card.querySelector("h2").textContent = pending.title;
  card.querySelector("p").textContent = pending.desc;
  card.style.animation = "none"; void card.offsetWidth; card.style.animation = "";
  show("exp");
}

$("accept").onclick = () => {
  state.quest = { id: pending.id };
  save(); pending = null;
  renderHome(); show("home"); squish();
};
$("reroll").onclick = () => { pending = pick(); showExperiment(); };
$("back1").onclick = () => { pending = null; renderHome(); show("home"); };

// ---------- reflect ----------
const FACES = [["😴", "drained"], ["🥱", "low"], ["😐", "okay"], ["🙂", "good"], ["⚡", "buzzing"]];
function buildFaces(id, key) {
  const row = $(id);
  row.innerHTML = FACES.map(([e, l], i) => `<button class="face" data-i="${i + 1}" aria-label="${l}" title="${l}">${e}</button>`).join("");
  row.querySelectorAll(".face").forEach((b) => {
    b.onclick = () => {
      ref[key] = +b.dataset.i;
      row.querySelectorAll(".face").forEach((x) => x.classList.toggle("sel", x === b));
      checkReady();
    };
  });
}
function checkReady() {
  const ok = ref.before && ref.after && ref.verdict;
  $("save").disabled = !ok;
  $("save").textContent = ok ? "Add to Void" : "Answer all three to continue";
}
function openReflect() {
  ref = { before: null, after: null, verdict: null };
  $("reflect-title").textContent = pending.title;
  buildFaces("faces-before", "before"); buildFaces("faces-after", "after");
  document.querySelectorAll(".verdict").forEach((b) => b.classList.remove("sel"));
  $("note").value = "";
  checkReady();
  show("reflect");
}
document.querySelectorAll(".verdict").forEach((b) => {
  b.onclick = () => {
    ref.verdict = b.dataset.v;
    document.querySelectorAll(".verdict").forEach((x) => x.classList.toggle("sel", x === b));
    checkReady();
  };
});

$("save").onclick = () => {
  const e = pending, c = CATEGORIES[e.cat];
  const prevLevel = levelName(state.done.length);
  state.done.push({
    id: e.id, cat: e.cat, ts: Date.now(),
    before: ref.before, after: ref.after, verdict: ref.verdict, note: $("note").value.trim()
  });
  state.quest = null; pending = null;
  save();
  const nowLevel = levelName(state.done.length);
  renderHome(); show("home");
  setTimeout(() => {
    renderVoid(); squish();
    const r = $("void-svg").getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height * 0.5, nowLevel !== prevLevel ? 70 : 34, c.color);
    if (nowLevel !== prevLevel) {
      say(`You've reached "${nowLevel}". That's real progress, and I felt it.`);
      const p = $("level"); p.classList.remove("pulse"); void p.offsetWidth; p.classList.add("pulse");
    } else {
      const feel = { make: "creativity", move: "energy", learn: "curiosity", social: "connection", nature: "calm", give: "kindness" }[e.cat];
      say(`Thank you. I can feel some ${feel} in me now.`);
    }
  }, 250);
};

// ---------- confetti ----------
const CONF = ["#c58a9f", "#c9965c", "#6f97b8", "#6f9f86", "#c4ad72", "#b4a7ea"];
function burst(x, y, n = 30, color) {
  n = Math.round(n * 0.6);  // gentle, like drifting petals
  for (let i = 0; i < n; i++) {
    const p = document.createElement("div");
    const s = rand(7, 12);
    p.className = "piece";
    p.style.width = s + "px"; p.style.height = s + "px";
    p.style.background = color && i % 2 ? color : CONF[i % CONF.length];
    p.style.left = x + "px"; p.style.top = y + "px";
    document.body.appendChild(p);
    const a = rand(0, Math.PI * 2), d = rand(40, 130);
    p.animate([
      { transform: "translate(0,0) rotate(0)", opacity: .95 },
      { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d + 160}px) rotate(${rand(-200, 200)}deg)`, opacity: 0 }
    ], { duration: rand(1800, 2800), easing: "cubic-bezier(.25,.6,.35,1)" }).onfinish = () => p.remove();
  }
}

// ---------- map ----------
function renderMap() {
  const body = $("map-body"), n = state.done.length;
  if (n < 3) {
    body.innerHTML = `<div class="insight">Your map shows up after 3 quests. You've done ${n} so far. Every small step sharpens the picture.</div>`;
    return;
  }
  const rows = Object.keys(CATEGORIES).map((k) => {
    const list = state.done.filter((d) => d.cat === k);
    if (!list.length) return null;
    const delta = list.reduce((s, d) => s + (d.after - d.before), 0) / list.length;
    const more = list.filter((d) => d.verdict === "more").length;
    const never = list.filter((d) => d.verdict === "never").length;
    return { k, list, more, never, score: delta + (more - never) / list.length };
  }).filter(Boolean).sort((a, b) => b.score - a.score);

  const top = rows[0], bottom = rows[rows.length - 1];
  let html = "";
  if (n >= 5 && top.score > 0) {
    const c = CATEGORIES[top.k];
    html += `<div class="insight">✨ <b>${c.label}</b> lights you up most. You had more energy after it ${top.list.length === 1 ? "once" : "in your " + top.list.length + " tries"} and wanted more ${top.more} time${top.more === 1 ? "" : "s"}. Try leaning into it.</div>`;
    if (rows.length > 1 && bottom.score < 0) {
      html += `<div class="insight">🔋 <b>${CATEGORIES[bottom.k].label}</b> tends to drain you. Worth knowing, not worth forcing.</div>`;
    }
  } else {
    html += `<div class="insight">Early picture. Patterns get much clearer after 5 quests.</div>`;
  }
  rows.forEach((r) => {
    const c = CATEGORIES[r.k];
    const pct = Math.max(8, Math.min(100, (r.score + 2) / 4 * 100));
    html += `<div class="bar-row">
      <div class="bar-head"><span>${c.emoji} ${c.label}</span><small>${r.list.length} tried · ${r.more} 🔥 · ${r.never} 🚫</small></div>
      <div class="bar"><div style="width:${pct}%;background:${c.color}"></div></div></div>`;
  });
  body.innerHTML = html;
}

// ---------- wins ----------
function renderWins() {
  const n = state.done.length, sw = streakWeeks();
  const badges = [[1, "🌱 First try"], [3, "🧭 Curious"], [5, "🗺️ Map unlocked"], [10, "🚀 Ten down"], [20, "🌈 Void filled"]]
    .map(([min, label]) => `<span class="badge ${n >= min ? "" : "locked"}">${label}</span>`).join("");
  let html = `<div class="badges">${badges}</div>
    <p class="sub">🔥 ${sw} week${sw === 1 ? "" : "s"} in a row · ${n} quest${n === 1 ? "" : "s"} done</p>`;
  if (!n) html += `<div class="insight">Nothing here yet. Your first one is just one small step away.</div>`;
  const wrap = document.createElement("div");
  [...state.done].reverse().forEach((d) => {
    const e = getExp(d.id);
    const v = { more: "🔥", neutral: "😐", never: "🚫" }[d.verdict] || "";
    const div = document.createElement("div");
    div.className = "win";
    div.style.setProperty("--c", CATEGORIES[d.cat].color);
    div.innerHTML = `<b></b> ${v}<br><small></small>`;
    div.querySelector("b").textContent = e ? CATEGORIES[e.cat].emoji + " " + e.title : "Quest";
    div.querySelector("small").textContent = new Date(d.ts).toLocaleDateString() + (d.note ? " · " + d.note : "");
    wrap.appendChild(div);
  });
  $("wins-body").innerHTML = html + wrap.innerHTML;
}

$("reset").onclick = (e) => {
  e.preventDefault();
  const r = $("reset");
  if (!r.dataset.armed) { r.dataset.armed = 1; r.textContent = "Tap again to erase everything"; return; }
  state = { done: [], quest: null }; save();
  delete r.dataset.armed; r.textContent = "Reset my data";
  renderVoid(); renderHome(); show("home");
};

// first paint: start empty, then let the liquid rise to where you left off
if (state.quest && !getExp(state.quest.id)) state.quest = null;
renderHome();
$("liquid").style.transform = "translateY(236px)";
renderVoid();
$("liquid").style.transform = "translateY(236px)";
setTimeout(renderVoid, 350);
