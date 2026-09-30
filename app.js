// Void — app logic. Everything is saved in your browser (localStorage); no server yet.
const $ = (id) => document.getElementById(id);
const KEY = "void-state-v1";

let state = load();
let pending = null;      // experiment currently shown
let verdict = null;

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || { done: [] }; }
  catch { return { done: [] }; }
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} }

function show(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("active", s.id === id));
  window.scrollTo(0, 0);
}

// ---------- progress ----------
const GOAL = 20; // completing 20 experiments fills the void completely
const LEVELS = [
  [0, "Empty void"], [1, "First spark"], [3, "Curious"], [6, "Explorer"],
  [10, "Adventurer"], [15, "Pathfinder"], [20, "Void filler"]
];
function levelName(n) { return [...LEVELS].reverse().find(([min]) => n >= min)[1]; }

function streakWeeks() {
  const weeks = new Set(state.done.map((d) => Math.floor(d.ts / 6048e5)));
  let w = Math.floor(Date.now() / 6048e5), s = 0;
  if (!weeks.has(w)) w--;            // this week's not over yet
  while (weeks.has(w)) { s++; w--; }
  return s;
}

function render() {
  const n = state.done.length;
  $("fill").style.height = Math.min(n / GOAL, 1) * 100 + "%";
  $("stats").textContent = `${levelName(n)} · ${n} wins`;
  $("blob-text").textContent =
    n === 0 ? "I'm empty. Help me out?" :
    n < 5 ? "Ooh, I feel something…" :
    n < 10 ? "I'm filling up. Keep going!" :
    n < GOAL ? "Almost full. Look at me glow!" : "I'm full! Now… what next?";
}

// ---------- spin ----------
function pick() {
  const doneIds = state.done.map((d) => d.id);
  let pool = EXPERIMENTS.filter((e) => !doneIds.includes(e.id) && (!pending || e.id !== pending.id));
  if (!pool.length) pool = EXPERIMENTS.filter((e) => !pending || e.id !== pending.id);
  return pool[Math.floor(Math.random() * pool.length)];
}

function spin(after) {
  const slot = $("slot"), text = $("slot-text");
  slot.classList.add("spinning");
  $("spin").disabled = true;
  let ticks = 0;
  const t = setInterval(() => {
    const e = EXPERIMENTS[Math.floor(Math.random() * EXPERIMENTS.length)];
    text.textContent = CATEGORIES[e.cat].emoji + " " + e.title;
    if (++ticks > 12) {
      clearInterval(t);
      slot.classList.remove("spinning");
      $("spin").disabled = false;
      text.textContent = "Ready when you are";
      after();
    }
  }, 90);
}

function showExperiment() {
  const c = CATEGORIES[pending.cat];
  const card = $("card");
  card.style.setProperty("--c", c.color);
  card.innerHTML = `
    <div class="tag">${c.emoji} ${c.label}</div>
    <h2></h2><p></p>
    <span class="mins">⏱ about ${pending.mins} min</span>`;
  card.querySelector("h2").textContent = pending.title;
  card.querySelector("p").textContent = pending.desc;
  // re-trigger the flip animation
  card.style.animation = "none"; void card.offsetWidth; card.style.animation = "";
  show("exp");
}

$("spin").onclick = () => spin(() => { pending = pick(); showExperiment(); });
$("reroll").onclick = () => { pending = pick(); showExperiment(); };
$("back1").onclick = () => { pending = null; show("home"); };

// ---------- reflect ----------
$("accept").onclick = () => {
  // v1: you do it on your own time and come back. For now we go straight to reflection
  // so you can test the loop. (Later: a "doing it" timer + reminders.)
  verdict = null;
  $("reflect-title").textContent = pending.title;
  $("before").value = 3; $("after").value = 3; $("bv").value = 3; $("av").value = 3;
  $("note").value = "";
  document.querySelectorAll(".verdict").forEach((b) => b.classList.remove("sel"));
  $("save").disabled = true;
  show("reflect");
};
$("before").oninput = (e) => ($("bv").textContent = e.target.value);
$("after").oninput = (e) => ($("av").textContent = e.target.value);
document.querySelectorAll(".verdict").forEach((b) => {
  b.onclick = () => {
    verdict = b.dataset.v;
    document.querySelectorAll(".verdict").forEach((x) => x.classList.toggle("sel", x === b));
    $("save").disabled = false;
  };
});

$("save").onclick = () => {
  state.done.push({
    id: pending.id, cat: pending.cat, ts: Date.now(),
    before: +$("before").value, after: +$("after").value,
    verdict, note: $("note").value.trim()
  });
  save();
  const prev = levelName(state.done.length - 1), now = levelName(state.done.length);
  pending = null;
  render();
  show("home");
  confetti(prev !== now ? 60 : 24);
  if (prev !== now) $("blob-text").textContent = `🎉 New level: ${now}!`;
};

function confetti(n) {
  const bits = ["✨", "🎉", "💜", "⭐", "🔥", "💛"];
  for (let i = 0; i < n; i++) {
    const s = document.createElement("span");
    s.className = "confetti";
    s.textContent = bits[i % bits.length];
    s.style.left = Math.random() * 100 + "vw";
    s.style.animationDelay = Math.random() * 0.6 + "s";
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 3000);
  }
}

// ---------- map ----------
function renderMap() {
  const body = $("map-body");
  const n = state.done.length;
  if (n < 3) {
    body.innerHTML = `<div class="insight">Your map appears after 3 experiments. You have ${n} so far.
      Every one you do sharpens the picture.</div>`;
    return;
  }
  const rows = Object.keys(CATEGORIES).map((k) => {
    const list = state.done.filter((d) => d.cat === k);
    if (!list.length) return null;
    const delta = list.reduce((s, d) => s + (d.after - d.before), 0) / list.length;
    const more = list.filter((d) => d.verdict === "more").length;
    const never = list.filter((d) => d.verdict === "never").length;
    const score = delta + (more - never) / list.length; // simple v1 "spark score"
    return { k, list, delta, more, never, score };
  }).filter(Boolean).sort((a, b) => b.score - a.score);

  const top = rows[0], bottom = rows[rows.length - 1];
  let html = "";
  if (n >= 5 && top.score > 0) {
    const c = CATEGORIES[top.k];
    html += `<div class="insight">✨ <b>${c.label}</b> lights you up most. You were more energised
      after ${top.list.length} ${top.list.length === 1 ? "try" : "tries"}
      and wanted more ${top.more} time${top.more === 1 ? "" : "s"}. Try leaning into it.</div>`;
    if (rows.length > 1 && bottom.score < 0) {
      html += `<div class="insight" style="border-color:#ff8a6e">🔋 <b>${CATEGORIES[bottom.k].label}</b>
        tends to drain you. Worth knowing, not worth forcing.</div>`;
    }
  } else {
    html += `<div class="insight">Early picture. Patterns get much clearer after 5 experiments.</div>`;
  }
  rows.forEach((r) => {
    const c = CATEGORIES[r.k];
    const pct = Math.max(6, Math.min(100, (r.score + 2) / 4 * 100)); // -2..+2 mapped to 0..100
    html += `<div class="bar-row">
      <div class="bar-head"><span>${c.emoji} ${c.label}</span><small>${r.list.length} tried · ${r.more} 🔥 · ${r.never} 🚫</small></div>
      <div class="bar"><div style="width:${pct}%;background:${c.color}"></div></div></div>`;
  });
  body.innerHTML = html;
}

// ---------- wins ----------
function renderWins() {
  const n = state.done.length;
  const badges = [
    [1, "🌱 First try"], [3, "🧭 Curious"], [5, "🗺️ Map unlocked"],
    [10, "🚀 Ten down"], [20, "🌈 Void filled"]
  ].map(([min, label]) => `<span class="badge ${n >= min ? "" : "locked"}">${label}</span>`).join("");
  const sw = streakWeeks();
  let html = `<div class="badges">${badges}</div>
    <p class="sub">🔥 ${sw} week${sw === 1 ? "" : "s"} in a row · ${n} experiment${n === 1 ? "" : "s"} tried</p>`;
  if (!n) html += `<div class="insight">No wins yet. Your first one is one spin away.</div>`;
  [...state.done].reverse().forEach((d) => {
    const e = EXPERIMENTS.find((x) => x.id === d.id);
    const v = { more: "🔥", neutral: "😐", never: "🚫" }[d.verdict];
    const div = document.createElement("div");
    div.className = "win";
    div.innerHTML = `<b></b> ${v}<br><small></small>`;
    div.querySelector("b").textContent = (e ? CATEGORIES[e.cat].emoji + " " + e.title : "Experiment");
    div.querySelector("small").textContent =
      new Date(d.ts).toLocaleDateString() + (d.note ? " — " + d.note : "");
    html += div.outerHTML;
  });
  $("wins-body").innerHTML = html;
}

$("to-map").onclick = () => { renderMap(); show("map"); };
$("to-wins").onclick = () => { renderWins(); show("wins"); };
document.querySelectorAll("[data-back]").forEach((b) => (b.onclick = () => show("home")));
$("reset").onclick = (e) => {
  e.preventDefault();
  if (!$("reset").dataset.armed) {
    $("reset").dataset.armed = 1; $("reset").textContent = "Click again to erase everything";
    return;
  }
  state = { done: [] }; save(); delete $("reset").dataset.armed;
  $("reset").textContent = "Reset my data"; render(); show("home");
};

render();
