// Void — app logic. Everything is saved in your browser (localStorage); no server yet.
const $ = (id) => document.getElementById(id);
const KEY = "void-state-v2";
const rand = (a, b) => a + Math.random() * (b - a);
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

function fresh() {
  return { profile: null, done: [], quest: null, gear: { owned: [], equipped: { head: null, eyes: null, body: null } } };
}
function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s && Array.isArray(s.done)) return { ...fresh(), ...s, gear: { ...fresh().gear, ...(s.gear || {}) } };
  } catch {}
  return fresh();
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} }

let state = load();
let pending = null;                               // quest currently on the card
let ref = { before: null, after: null, flow: null, verdict: null };
const getQuest = (id) => QUESTS.find((q) => q.id === id);

// ---------- screens ----------
const TAB_OF = { home: "home", exp: "home", reflect: "home", map: "map", locker: "locker", rank: "rank" };
function show(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("active", s.id === id));
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t.dataset.go === TAB_OF[id]));
  window.scrollTo(0, 0);
}
document.querySelectorAll(".tab").forEach((t) => {
  t.onclick = () => {
    const g = t.dataset.go;
    if (g === "home") renderHome(true);
    if (g === "map") renderMap();
    if (g === "locker") renderLocker();
    if (g === "rank") renderRank();
    show(g);
  };
});

// ---------- progress: XP, rank, campaign ----------
const GOAL = 30;                                  // quests it takes to fill Void completely
const totalXp = () => state.done.reduce((s, d) => s + (d.xp || 0), 0);
function rankIdx(xp = totalXp()) { let i = 0; RANKS.forEach((r, k) => { if (xp >= r.xp) i = k; }); return i; }
function rankProgress(xp = totalXp()) {
  const i = rankIdx(xp), cur = RANKS[i], next = RANKS[i + 1];
  if (!next) return { i, pct: 1, into: xp - cur.xp, need: 0, max: true };
  return { i, pct: (xp - cur.xp) / (next.xp - cur.xp), into: xp - cur.xp, need: next.xp - cur.xp, next: next.name };
}
function tierUnlocked(t) {
  if (t === "recon") return true;
  if (t === "mission") return state.done.length >= 2;
  return rankIdx() >= 2;                          // trials unlock at Seeker
}

// per-field stats: your "signal" in each field
function catStats() {
  return Object.keys(CATEGORIES).map((k) => {
    const list = state.done.filter((d) => d.cat === k);
    if (!list.length) return null;
    const delta = list.reduce((s, d) => s + (d.after - d.before), 0) / list.length;
    const more = list.filter((d) => d.verdict === "more").length;
    const never = list.filter((d) => d.verdict === "never").length;
    const flow = list.filter((d) => d.flow).length;
    return { k, list, more, never, flow, score: delta + (more - never) / list.length + flow / list.length };
  }).filter(Boolean).sort((a, b) => b.score - a.score);
}

// Phase 1 sweeps every field once. Phase 2 leans toward the fields where you show the strongest signal.
function pickQuest() {
  const doneIds = state.done.map((d) => d.id);
  const ok = (q) => tierUnlocked(q.tier) && (!pending || q.id !== pending.id);
  let pool = QUESTS.filter((q) => ok(q) && !doneIds.includes(q.id));
  if (!pool.length) pool = QUESTS.filter(ok);
  if (!pool.length) return QUESTS[0];
  const tried = new Set(state.done.map((d) => d.cat));
  const untried = Object.keys(CATEGORIES).filter((k) => !tried.has(k));
  if (untried.length) {
    const p = pool.filter((q) => untried.includes(q.cat));
    if (p.length) {
      const low = ["recon", "mission", "trial"].find((t) => p.some((q) => q.tier === t));
      return sample(p.filter((q) => q.tier === low));
    }
  }
  const top = catStats().slice(0, 2).map((r) => r.k);
  let pref = pool;
  if (Math.random() < 0.65) { const p = pool.filter((q) => top.includes(q.cat)); if (p.length) pref = p; }
  const w = { recon: 1, mission: 2, trial: 1.5 };
  let r = Math.random() * pref.reduce((s, q) => s + w[q.tier], 0);
  for (const q of pref) { r -= w[q.tier]; if (r <= 0) return q; }
  return pref[0];
}

// ---------- gear ----------
const equippedItems = () => ["head", "eyes", "body"].map((s) => state.gear.equipped[s]).filter(Boolean);
function rollGear(tier) {
  const owned = new Set(state.gear.owned);
  let c = GEAR_ITEMS.filter((i) => i.endsWith(":" + tier) && !owned.has(i));
  if (!c.length) c = GEAR_ITEMS.filter((i) => !owned.has(i));
  return c.length ? sample(c) : null;
}

// ---------- Void the character ----------
const design = () => DESIGNS[state.profile.design];
const accent = () => ACCENTS[state.profile.accent].hex;

function applyLook() {
  const d = design(), acc = accent(), e = d.eyes, lid = LID[rankIdx()];
  document.querySelectorAll("#clip path, .hollow, .outline").forEach((x) => x.setAttribute("d", d.body));
  $("detail").setAttribute("d", d.detail || "");
  $("detail").style.stroke = mix(acc, "#ffffff", 0.4);
  document.querySelector(".shine").setAttribute("d", d.shine);
  $("glassA").setAttribute("stop-color", mix(acc, "#161221", 0.72));
  $("glassB").setAttribute("stop-color", mix(acc, "#120e1c", 0.9));
  const o = document.querySelector(".outline");
  o.style.stroke = mix(acc, "#ffffff", 0.35);
  o.style.filter = `drop-shadow(0 0 6px ${acc}99)`;
  document.documentElement.style.setProperty("--accent", acc);
  const eyeCol = mix(acc, "#ffffff", 0.78);
  [["L", -1], ["R", 1]].forEach(([s, sg]) => {
    const cx = 120 + sg * e.dx, ry = e.ry * lid;
    const sc = $("scl" + s); sc.setAttribute("cx", cx); sc.setAttribute("cy", e.y); sc.setAttribute("rx", e.rx); sc.setAttribute("ry", ry.toFixed(1)); sc.style.fill = eyeCol;
    const pu = $("p" + s); pu.setAttribute("cx", cx); pu.setAttribute("cy", e.y + 1.5); pu.setAttribute("r", Math.min(e.pr, ry * 0.75).toFixed(1));
    const g = $("g" + s); g.setAttribute("cx", cx + 2); g.setAttribute("cy", e.y - 1); g.setAttribute("r", Math.max(1, e.pr * 0.32).toFixed(1));
  });
}

const SPAN = 192, PER = SPAN / GOAL;
function renderVoid() {
  if (!state.profile) return;
  applyLook();
  const n = state.done.length, f = Math.min(n / GOAL, 1);
  const layers = state.done.slice(-GOAL);

  // colours blend softly into each other, newest on top
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
    bubs += `<circle class="bub" cx="${rand(60, 180).toFixed(0)}" cy="${rand(20, 6 + Math.min(n, 12) * PER - 6).toFixed(0)}" r="${rand(2.5, 5).toFixed(1)}" style="animation-delay:${(-rand(0, 3.4)).toFixed(1)}s"/>`;
  }
  $("bubbles").innerHTML = bubs;

  $("gear").innerHTML = equippedItems().map((i) => gearSVG(i, design())).join("");

  const stage = document.querySelector(".stage");
  stage.style.setProperty("--glow-o", (0.16 + f * 0.36).toFixed(2));
  stage.style.setProperty("--glow", len ? topDown[0] : accent());

  renderPlate();
}

function renderPlate() {
  const rp = rankProgress(), xp = totalXp();
  $("vname").textContent = state.profile.name;
  $("plate-rank").innerHTML = `${rankEmblem(rp.i, 22)}<span>${RANKS[rp.i].name}</span>`;
  $("xp-fill").style.width = Math.round(rp.pct * 100) + "%";
  $("xp-left").textContent = rp.max ? "Max rank" : `${rp.into} / ${rp.need} XP to ${rp.next}`;
  $("xp-right").textContent = `${xp} XP`;
  $("level").textContent = RANKS[rp.i].name;
}

function squish() {
  const b = $("squish");
  b.classList.remove("squish"); void b.getBoundingClientRect(); b.classList.add("squish");
  try { navigator.vibrate && navigator.vibrate(10); } catch {}
}
function say(text) {
  $("bubble-text").textContent = text;
  const b = $("bubble");
  b.classList.remove("say"); void b.offsetWidth; b.classList.add("say");
}
function homeLine() {
  const n = state.done.length, name = state.profile.name;
  if (state.quest) return "Take your time. Come back when it's done.";
  if (n === 0) return `I'm ${name}. I don't know what I'm for yet either. Let's find out, one quest at a time.`;
  if (new Set(state.done.map((d) => d.cat)).size < 6) return "Good. Keep sweeping. Every field you test narrows the map.";
  if (n < 15) return "There's a pattern forming. Keep testing it.";
  if (n < 30) return "You're not guessing anymore. You're gathering evidence.";
  return "Look at the record. That's someone who's been paying attention.";
}
const POKES = ["Still here.", "No rush.", "Next move is yours.", "Small steps still count.", "You showed up. That matters.", "Keep going."];
$("void-svg").addEventListener("pointerdown", () => { squish(); say(sample(POKES)); });

// eyes follow your finger / cursor, and drift when nothing's happening
let lastPointer = 0;
const track = () => (state.profile ? design().eyes.track : 4);
function look(dx, dy) { ["pupL", "pupR"].forEach((id) => ($(id).style.transform = `translate(${dx}px,${dy}px)`)); }
addEventListener("pointermove", (e) => {
  lastPointer = Date.now();
  if (!state.profile || !$("home").classList.contains("active")) return;
  const r = $("void-svg").getBoundingClientRect();
  const vx = e.clientX - (r.left + r.width / 2), vy = e.clientY - (r.top + r.height * 0.45);
  const d = Math.hypot(vx, vy) || 1, m = Math.min(track(), d / 30);
  look((vx / d) * m, (vy / d) * m);
});
setInterval(() => { if (state.profile && Date.now() - lastPointer > 4000) look(rand(-track(), track()), rand(-track() * 0.6, track() * 0.8)); }, 2600);

// ---------- home ----------
function campaignHTML() {
  const tried = new Set(state.done.map((d) => d.cat));
  const dots = Object.keys(CATEGORIES).map((k) =>
    `<i class="cdot ${tried.has(k) ? "on" : ""}" style="--c:${CATEGORIES[k].color}" title="${CATEGORIES[k].label}"></i>`).join("");
  let lock = "";
  if (!tierUnlocked("mission")) lock = "Missions unlock after 2 quests.";
  else if (!tierUnlocked("trial")) lock = "Trials unlock at rank Seeker.";
  const lockHTML = lock ? `<p class="lock">${lock}</p>` : "";
  if (tried.size < 6) {
    return `<div class="campaign"><div class="c-head"><b>Phase 1 · The Sweep</b><span>${tried.size} of 6 fields</span></div>
      <div class="cdots">${dots}</div><p>Test every field once. Patterns only show up with evidence.</p>${lockHTML}</div>`;
  }
  const top = catStats()[0];
  return `<div class="campaign"><div class="c-head"><b>Phase 2 · Go Deeper</b><span>${state.done.length} quests</span></div>
    <div class="cdots">${dots}</div>
    <p>Strongest signal so far: <b style="color:${CATEGORIES[top.k].color}">${CATEGORIES[top.k].label}</b>. New quests lean toward it.</p>${lockHTML}</div>`;
}

function questTags(q) {
  const c = CATEGORIES[q.cat];
  return `<div class="tags"><span class="tier t-${q.tier}">${TIERS[q.tier].label}</span><span class="cat"><i class="dot" style="background:${c.color}"></i>${c.label}</span></div>`;
}

function renderHome(quiet) {
  const box = $("home-actions");
  const q = state.quest && getQuest(state.quest.id);
  if (q) {
    const c = CATEGORIES[q.cat];
    box.innerHTML = campaignHTML() + `
      <div class="card quest" style="--c:${c.color}">
        <span class="tag">Active quest</span>
        ${questTags(q)}
        <h3></h3><p></p>
        <span class="chip">${q.time}</span> <span class="chip">+${TIERS[q.tier].xp} XP</span>
      </div>
      <div class="stack">
        <button class="btn primary" id="done">Mark complete</button>
        <button class="link" id="giveup">Swap this quest</button>
      </div>`;
    box.querySelector("h3").textContent = q.title;
    box.querySelector("p").textContent = q.desc;
    $("done").onclick = () => { pending = q; openReflect(); };
    $("giveup").onclick = () => { pending = q; state.quest = null; save(); pending = pickQuest(); showQuest(); };
  } else {
    state.quest = null;
    box.innerHTML = campaignHTML() + `<div class="stack"><button class="btn primary" id="take">Take a quest</button></div>`;
    $("take").onclick = scan;
  }
  if (!quiet) say(homeLine());
}

function scan() {
  const b = $("take");
  b.disabled = true; b.textContent = "Scanning…";
  say("Looking for a good one…");
  squish();
  setTimeout(() => { pending = pickQuest(); showQuest(); }, 900);
}

function showQuest() {
  const q = pending, c = CATEGORIES[q.cat], card = $("card");
  card.style.setProperty("--c", c.color);
  card.innerHTML = `${questTags(q)}<h2></h2><p class="desc"></p>
    <div class="why"><b>Why this quest</b><p></p></div>
    <div class="meta"><span class="chip">${q.time}</span><span class="chip">+${TIERS[q.tier].xp} XP</span><span class="chip">${GEAR_TIERS[TIERS[q.tier].gear].label} gear drop</span></div>`;
  card.querySelector("h2").textContent = q.title;
  card.querySelector(".desc").textContent = q.desc;
  card.querySelector(".why p").textContent = q.why;
  card.style.animation = "none"; void card.offsetWidth; card.style.animation = "";
  show("exp");
}
$("accept").onclick = () => { state.quest = { id: pending.id }; save(); pending = null; renderHome(); show("home"); squish(); };
$("reroll").onclick = () => { pending = pickQuest(); showQuest(); };
$("back1").onclick = () => { pending = null; renderHome(); show("home"); };

// ---------- debrief ----------
function buildScale(id, key) {
  const row = $(id);
  row.innerHTML = [1, 2, 3, 4, 5].map((n) => `<button class="num" data-i="${n}">${n}</button>`).join("");
  row.querySelectorAll(".num").forEach((b) => {
    b.onclick = () => {
      ref[key] = +b.dataset.i;
      row.querySelectorAll(".num").forEach((x) => x.classList.toggle("sel", x === b));
      checkReady();
    };
  });
}
function checkReady() {
  const ok = ref.before && ref.after && ref.flow !== null && ref.verdict;
  $("save").disabled = !ok;
  $("save").textContent = ok ? "Complete quest" : "Answer the questions to continue";
}
function openReflect() {
  ref = { before: null, after: null, flow: null, verdict: null };
  $("reflect-title").textContent = pending.title;
  $("ask-label").textContent = CATEGORIES[pending.cat].ask;
  buildScale("scale-before", "before"); buildScale("scale-after", "after");
  document.querySelectorAll("#flow-row .verdict, #pull-row .verdict").forEach((b) => b.classList.remove("sel"));
  $("note").value = "";
  checkReady();
  show("reflect");
}
document.querySelectorAll("#flow-row .verdict").forEach((b) => {
  b.onclick = () => {
    ref.flow = b.dataset.flow === "1";
    document.querySelectorAll("#flow-row .verdict").forEach((x) => x.classList.toggle("sel", x === b));
    checkReady();
  };
});
document.querySelectorAll("#pull-row .verdict").forEach((b) => {
  b.onclick = () => {
    ref.verdict = b.dataset.v;
    document.querySelectorAll("#pull-row .verdict").forEach((x) => x.classList.toggle("sel", x === b));
    checkReady();
  };
});

$("save").onclick = () => {
  const q = pending, tier = TIERS[q.tier], note = $("note").value.trim();
  const prevXp = totalXp(), prevRank = rankIdx(prevXp);
  const xp = tier.xp + (note.length >= 10 ? 25 : 0);
  state.done.push({ id: q.id, cat: q.cat, tier: q.tier, xp, ts: Date.now(), before: ref.before, after: ref.after, flow: ref.flow, verdict: ref.verdict, note });

  const drop = rollGear(tier.gear);
  let equipped = false;
  if (drop) {
    state.gear.owned.push(drop);
    const slot = gearInfo(drop).slot;
    if (!state.gear.equipped[slot]) { state.gear.equipped[slot] = drop; equipped = true; }
  }
  state.quest = null; pending = null;
  save();
  const newXp = totalXp(), newRank = rankIdx(newXp);
  renderHome(true); show("home");
  setTimeout(() => {
    renderVoid(); squish();
    openModal(completionHTML({ q, xp, prevXp, newXp, prevRank, newRank, drop, equipped }));
  }, 250);
};

// ---------- reward pop-up ----------
function openModal(html) {
  $("modal-card").innerHTML = html;
  $("modal").hidden = false;
  requestAnimationFrame(() => $("modal").classList.add("open"));
}
function closeModal() {
  $("modal").classList.remove("open");
  setTimeout(() => { $("modal").hidden = true; }, 250);
}
function completionHTML(r) {
  const rankUp = r.newRank > r.prevRank;
  const start = rankUp ? 0 : rankProgress(r.prevXp).pct, end = rankProgress(r.newXp);
  let h = `<div class="m-tag">Quest complete</div><h2>${r.q.title}</h2><div class="m-xp">+${r.xp} XP</div>
    <div class="xp big"><div id="m-fill" style="width:${Math.round(start * 100)}%" data-to="${Math.round(end.pct * 100)}"></div></div>
    <div class="xp-meta"><span>${end.max ? "Max rank" : `${end.into} / ${end.need} XP to ${end.next}`}</span><span>${r.newXp} XP</span></div>`;
  if (rankUp) {
    h += `<div class="rankup">${rankEmblem(r.newRank, 44)}<div><small>Rank up</small><b>${RANKS[r.newRank].name}</b></div></div>`;
  }
  if (r.drop) {
    const g = gearInfo(r.drop);
    h += `<div class="drop tier-${g.tier}">${miniVoid(state.profile.design, accent(), [r.drop], LID[rankIdx()])}
      <div><small>${GEAR_TIERS[g.tier].label} drop</small><b>${g.label}</b><span>${r.equipped ? "Equipped" : "Slot: " + g.slot}</span></div></div>`;
    if (!r.equipped) h += `<button class="btn" id="m-equip">Equip it</button>`;
  }
  h += `<button class="btn primary" id="m-close">Continue</button>`;
  setTimeout(() => {
    const f = $("m-fill"); if (f) f.style.width = f.dataset.to + "%";
    const eq = $("m-equip");
    if (eq) eq.onclick = () => { state.gear.equipped[gearInfo(r.drop).slot] = r.drop; save(); renderVoid(); eq.textContent = "Equipped"; eq.disabled = true; };
    $("m-close").onclick = () => {
      closeModal();
      say(rankUp ? `Rank up: ${RANKS[r.newRank].name}. You earned that.` : sample(["Logged. That's evidence.", "Good. One more data point.", "Thank you. I can feel it.", "That counts."]));
    };
  }, 30);
  return h;
}

// ---------- map ----------
function renderMap() {
  const body = $("map-body"), n = state.done.length;
  if (n < 3) {
    body.innerHTML = `<div class="insight">Your map shows up after 3 quests. You've done ${n}. Every quest adds evidence.</div>`;
    return;
  }
  const rows = catStats(), top = rows[0], bottom = rows[rows.length - 1];
  const flowTotal = state.done.filter((d) => d.flow).length;
  let html = "";
  if (n >= 5 && top.score > 0) {
    const c = CATEGORIES[top.k];
    html += `<div class="insight"><b style="color:${c.color}">${c.label}</b> is your strongest signal. You came out with more energy, wanted more, or lost track of time. Your next quests lean this way.</div>`;
    if (rows.length > 1 && bottom.score < 0) {
      html += `<div class="insight"><b style="color:${CATEGORIES[bottom.k].color}">${CATEGORIES[bottom.k].label}</b> tends to drain you. That's useful to know, not something to force.</div>`;
    }
  } else {
    html += `<div class="insight">Early picture. It gets much clearer after 5 quests.</div>`;
  }
  html += `<p class="sub">Flow moments so far: <b>${flowTotal}</b>. These are the strongest clues you can collect.</p>`;
  rows.forEach((r) => {
    const c = CATEGORIES[r.k];
    const pct = Math.max(8, Math.min(100, (r.score + 2) / 4 * 100));
    html += `<div class="bar-row">
      <div class="bar-head"><span><i class="dot" style="background:${c.color}"></i>${c.label}</span><small>${r.list.length} done · ${r.more} pull · ${r.flow} flow</small></div>
      <div class="bar"><div style="width:${pct}%;background:${c.color}"></div></div></div>`;
  });
  body.innerHTML = html;
}

// ---------- locker ----------
function renderLocker() {
  const owned = new Set(state.gear.owned), eq = state.gear.equipped, lid = LID[rankIdx()];
  let html = `<div class="locker-prev">${miniVoid(state.profile.design, accent(), equippedItems(), lid)}</div>
    <p class="sub center">${owned.size} of ${GEAR_ITEMS.length} items found. Every quest drops one.</p><div class="slots">`;
  SLOTS.forEach(([s, label]) => {
    html += `<div class="slot"><small>${label}</small><b>${eq[s] ? gearInfo(eq[s]).label : "Empty"}</b></div>`;
  });
  html += `</div><div class="grid">`;
  GEAR_ITEMS.forEach((id) => {
    const g = gearInfo(id);
    if (owned.has(id)) {
      html += `<button class="tile tier-${g.tier} ${eq[g.slot] === id ? "on" : ""}" data-item="${id}">${miniVoid(state.profile.design, accent(), [id], lid)}<small>${g.label}</small></button>`;
    } else {
      html += `<div class="tile locked"><span>?</span><small>${GEAR_TIERS[g.tier].label}</small></div>`;
    }
  });
  html += `</div>`;
  $("locker-body").innerHTML = html;
  $("locker-body").querySelectorAll(".tile[data-item]").forEach((t) => {
    t.onclick = () => {
      const id = t.dataset.item, slot = gearInfo(id).slot;
      state.gear.equipped[slot] = state.gear.equipped[slot] === id ? null : id;
      save(); renderVoid(); renderLocker();
    };
  });
}

// ---------- rank ----------
function renderRank() {
  const rp = rankProgress(), xp = totalXp();
  let html = `<div class="rank-hero">${rankEmblem(rp.i, 72)}<div><small>Current rank</small><b>${RANKS[rp.i].name}</b><span>${xp} XP</span></div></div>
    <div class="xp big"><div style="width:${Math.round(rp.pct * 100)}%"></div></div>
    <div class="xp-meta"><span>${rp.max ? "Max rank" : `${rp.into} / ${rp.need} XP to ${rp.next}`}</span><span></span></div>
    <div class="ladder">`;
  RANKS.forEach((r, i) => {
    html += `<div class="rung ${i === rp.i ? "cur" : i < rp.i ? "done" : "locked"}">${rankEmblem(i, 28)}<b>${r.name}</b><span>${r.xp} XP</span></div>`;
  });
  html += `</div><h3 class="log-title">Quest log</h3>`;
  if (!state.done.length) html += `<div class="insight">Nothing logged yet. Your first quest is one tap away.</div>`;
  const wrap = document.createElement("div");
  [...state.done].reverse().forEach((d) => {
    const q = getQuest(d.id);
    const v = { more: "Pull", neutral: "Maybe", never: "No pull" }[d.verdict] || "";
    const div = document.createElement("div");
    div.className = "win";
    div.style.setProperty("--c", CATEGORIES[d.cat].color);
    div.innerHTML = `<b></b><br><small></small>`;
    div.querySelector("b").textContent = q ? q.title : "Quest";
    div.querySelector("small").textContent =
      `${CATEGORIES[d.cat].label} · ${TIERS[d.tier || (q && q.tier) || "recon"].label} · +${d.xp || 0} XP · ${v}${d.flow ? " · flow" : ""} · ${new Date(d.ts).toLocaleDateString()}${d.note ? " · " + d.note : ""}`;
    wrap.appendChild(div);
  });
  $("rank-body").innerHTML = html + wrap.innerHTML;
}

// ---------- setup: age check, choose design, name ----------
let ob = { i: 0, acc: 0 };
const NAMES = ["Atlas", "Ash", "Kai", "Onyx", "Rook", "Sage", "Echo", "Nova"];

$("adult").onchange = (e) => { $("begin").disabled = !e.target.checked; };
$("begin").onclick = () => { renderPick(); show("choose"); };

function renderPick(dir) {
  const box = $("pick-void");
  box.innerHTML = miniVoid(ob.i, ACCENTS[ob.acc].hex, [], 1);
  if (dir) { box.classList.remove("sl", "sr"); void box.offsetWidth; box.classList.add(dir); }
  $("pick-name").textContent = DESIGNS[ob.i].name;
  $("pick-line").textContent = DESIGNS[ob.i].line;
  $("pick-dots").innerHTML = DESIGNS.map((_, k) => `<i class="${k === ob.i ? "on" : ""}"></i>`).join("");
  $("swatches").innerHTML = ACCENTS.map((a, k) => `<button class="sw ${k === ob.acc ? "sel" : ""}" data-k="${k}" style="background:${a.hex}" aria-label="${a.name}"></button>`).join("");
  $("swatches").querySelectorAll(".sw").forEach((b) => { b.onclick = () => { ob.acc = +b.dataset.k; renderPick(); }; });
}
function stepPick(n) { ob.i = (ob.i + n + DESIGNS.length) % DESIGNS.length; renderPick(n > 0 ? "sr" : "sl"); }
$("pick-prev").onclick = () => stepPick(-1);
$("pick-next").onclick = () => stepPick(1);
addEventListener("keydown", (e) => {
  if (!$("choose").classList.contains("active")) return;
  if (e.key === "ArrowLeft") stepPick(-1);
  if (e.key === "ArrowRight") stepPick(1);
});
(function swipe() {
  let x0 = null;
  const st = $("pick-stage");
  st.addEventListener("pointerdown", (e) => { x0 = e.clientX; });
  addEventListener("pointerup", (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) stepPick(dx < 0 ? 1 : -1);
  });
})();

$("pick-go").onclick = () => {
  $("namer-void").innerHTML = miniVoid(ob.i, ACCENTS[ob.acc].hex, [], 1);
  $("sugs").innerHTML = NAMES.map((n) => `<button class="chip-btn">${n}</button>`).join("");
  $("sugs").querySelectorAll(".chip-btn").forEach((b) => { b.onclick = () => { $("name-in").value = b.textContent; $("start").disabled = false; }; });
  show("namer");
};
$("namer-back").onclick = () => show("choose");
$("name-in").oninput = () => { $("start").disabled = !$("name-in").value.trim(); };
$("start").onclick = () => {
  const name = $("name-in").value.trim();
  if (!name) return;
  state.profile = { design: ob.i, accent: ob.acc, name, adult: true, created: Date.now() };
  save();
  enterApp(true);
};

function enterApp(first) {
  document.body.classList.remove("onboarding");
  $("liquid").style.transform = "translateY(236px)";
  renderVoid();
  $("liquid").style.transform = "translateY(236px)";
  renderHome();
  show("home");
  setTimeout(renderVoid, first ? 200 : 350);
}

$("reset").onclick = (e) => {
  e.preventDefault();
  const r = $("reset");
  if (!r.dataset.armed) { r.dataset.armed = 1; r.textContent = "Tap again to erase everything"; return; }
  state = fresh(); save();
  delete r.dataset.armed; r.textContent = "Reset everything";
  ob = { i: 0, acc: 0 };
  document.body.classList.add("onboarding");
  $("adult").checked = false; $("begin").disabled = true; $("name-in").value = ""; $("start").disabled = true;
  show("intro");
};

// ---------- boot ----------
$("modal").addEventListener("click", (e) => { if (e.target === $("modal") && $("m-close")) $("m-close").click(); });
if (state.profile) {
  if (state.quest && !getQuest(state.quest.id)) state.quest = null;
  enterApp(false);
} else {
  document.body.classList.add("onboarding");
  show("intro");
}
