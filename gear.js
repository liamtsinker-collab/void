// Void's look and the game data: body designs, accent colours, ranks and gear (accessories).

// ---------- ranks ----------
const RANKS = [
  { name: "Drifter",     xp: 0 },
  { name: "Wanderer",    xp: 150 },
  { name: "Seeker",      xp: 400 },
  { name: "Explorer",    xp: 800 },
  { name: "Pathfinder",  xp: 1400 },
  { name: "Trailblazer", xp: 2200 },
  { name: "Vanguard",    xp: 3200 }
];
// Void's eyes open up as you rank up: tired at Drifter, alert by Pathfinder.
const LID = [0.55, 0.68, 0.8, 0.9, 1, 1, 1];

// ---------- colour helpers ----------
function hexToRgb(h) { h = h.replace("#", ""); return [0, 2, 4].map((i) => parseInt(h.substr(i, 2), 16)); }
function mix(a, b, t) {
  const A = hexToRgb(a), B = hexToRgb(b);
  return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join("");
}

const ACCENTS = [
  { name: "Violet", hex: "#b4a7ea" },
  { name: "Steel",  hex: "#8fb3d6" },
  { name: "Ember",  hex: "#dba070" },
  { name: "Moss",   hex: "#8fbf9f" },
  { name: "Rose",   hex: "#d590a5" },
  { name: "Bone",   hex: "#ddd3bf" }
];

// ---------- body designs ----------
// body: outline path (fits a 240x240 box, roughly y 30-210). eyes: position + size. a: anchor points that gear attaches to.
const DESIGNS = [
  { id: "orb", name: "Orb", line: "Steady. Sees the whole picture.",
    body: "M120 30C170 30 205 70 203 125C201 175 175 210 120 210C65 210 38 176 38 125C38 70 70 30 120 30Z",
    shine: "M68 78 Q74 52 100 42", detail: "",
    eyes: { y: 108, dx: 21, rx: 11, ry: 14, pr: 5.2, track: 4 },
    a: { bandY: 66, bandL: 62, bandR: 178, top: 30, neckY: 172, neckL: 52, neckR: 188, sideY: 104, sideL: 40, sideR: 200 } },
  { id: "monolith", name: "Monolith", line: "Silent. Built to last.",
    body: "M86 30H154Q178 30 178 54V186Q178 210 154 210H86Q62 210 62 186V54Q62 30 86 30Z",
    shine: "M74 52 V118", detail: "",
    eyes: { y: 92, dx: 22, rx: 15, ry: 6.5, pr: 3.4, track: 2 },
    a: { bandY: 62, bandL: 62, bandR: 178, top: 30, neckY: 172, neckL: 62, neckR: 178, sideY: 96, sideL: 62, sideR: 178 } },
  { id: "crystal", name: "Crystal", line: "Sharp. Values clarity.",
    body: "M120 30L185 88L168 178L120 210L72 178L55 88Z",
    shine: "M86 76 L108 50", detail: "M55 88L120 122L185 88M120 122V210",
    eyes: { y: 100, dx: 24, rx: 10, ry: 12, pr: 4.4, track: 3 },
    a: { bandY: 68, bandL: 76, bandR: 164, top: 30, neckY: 170, neckL: 70, neckR: 170, sideY: 100, sideL: 56, sideR: 184 } },
  { id: "wisp", name: "Wisp", line: "Restless. Always moving.",
    body: "M120 26C132 62 192 100 197 148C201 186 165 210 120 210C75 210 39 186 43 148C48 100 108 62 120 26Z",
    shine: "M92 98 Q100 74 116 60", detail: "",
    eyes: { y: 134, dx: 20, rx: 8, ry: 15, pr: 4.4, track: 3 },
    a: { bandY: 108, bandL: 66, bandR: 174, top: 26, neckY: 180, neckL: 50, neckR: 190, sideY: 134, sideL: 44, sideR: 196 } }
];

// ---------- gear ----------
const GEAR_SHAPES = {
  headband:   { slot: "head", label: "Headband" },
  cap:        { slot: "head", label: "Cap" },
  headphones: { slot: "head", label: "Headphones" },
  glasses:    { slot: "eyes", label: "Glasses" },
  visor:      { slot: "eyes", label: "Visor" },
  scar:       { slot: "eyes", label: "Scar" },
  scarf:      { slot: "body", label: "Scarf" },
  medal:      { slot: "body", label: "Medal" }
};
const GEAR_TIERS = {
  common: { label: "Common", color: "#9aa3b2" },
  rare:   { label: "Rare",   color: "#6fa8d6" },
  epic:   { label: "Epic",   color: "#d9b96a" }
};
const SLOTS = [["head", "Head"], ["eyes", "Eyes"], ["body", "Body"]];
const GEAR_ITEMS = [];
Object.keys(GEAR_SHAPES).forEach((s) => Object.keys(GEAR_TIERS).forEach((t) => GEAR_ITEMS.push(s + ":" + t)));

function gearInfo(id) {
  const [shape, tier] = id.split(":");
  return { shape, tier, slot: GEAR_SHAPES[shape].slot, label: `${GEAR_TIERS[tier].label} ${GEAR_SHAPES[shape].label}` };
}

// Draws one item onto a design, using that design's anchor points.
function gearSVG(id, d) {
  const [shape, tier] = id.split(":");
  const col = GEAR_TIERS[tier].color, dark = "rgba(20,14,32,.6)";
  const a = d.a, e = d.eyes, cx = 120;
  const S = (extra) => `<g class="gear tier-${tier}">${extra}</g>`;
  switch (shape) {
    case "headband":
      return S(`<path d="M${a.bandL} ${a.bandY} Q${cx} ${a.bandY - 9} ${a.bandR} ${a.bandY}" fill="none" stroke="${col}" stroke-width="9" stroke-linecap="round"/>
        <path d="M${a.bandL + 6} ${a.bandY + 4} Q${cx} ${a.bandY - 5} ${a.bandR - 6} ${a.bandY + 4}" fill="none" stroke="${dark}" stroke-width="2"/>
        <path d="M${a.bandR - 4} ${a.bandY} l14 -7 M${a.bandR - 4} ${a.bandY} l16 8" fill="none" stroke="${col}" stroke-width="5" stroke-linecap="round"/>`);
    case "cap":
      return S(`<path d="M${a.bandL + 4} ${a.bandY + 6} Q${a.bandL + 4} ${a.top - 8} ${cx} ${a.top - 8} Q${a.bandR - 4} ${a.top - 8} ${a.bandR - 4} ${a.bandY + 6} Z" fill="${col}" stroke="${dark}" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M${a.bandL - 6} ${a.bandY + 8} H${a.bandR + 6}" stroke="${col}" stroke-width="7" stroke-linecap="round"/>
        <circle cx="${cx}" cy="${a.top - 6}" r="3" fill="${dark}"/>`);
    case "headphones": {
      const cy = a.sideY - 14, ctrl = 2 * (a.top - 10) - cy;
      return S(`<path d="M${a.sideL} ${cy} Q${cx} ${ctrl} ${a.sideR} ${cy}" fill="none" stroke="${col}" stroke-width="7" stroke-linecap="round"/>
        <rect x="${a.sideL - 9}" y="${a.sideY - 18}" width="18" height="36" rx="7" fill="${col}" stroke="${dark}" stroke-width="2.5"/>
        <rect x="${a.sideR - 9}" y="${a.sideY - 18}" width="18" height="36" rx="7" fill="${col}" stroke="${dark}" stroke-width="2.5"/>`);
    }
    case "glasses": {
      const rx = Math.min(e.rx + 8, e.dx - 3), ry = e.ry + 7;
      return S(`<ellipse cx="${cx - e.dx}" cy="${e.y}" rx="${rx}" ry="${ry}" fill="rgba(255,255,255,.06)" stroke="${col}" stroke-width="3"/>
        <ellipse cx="${cx + e.dx}" cy="${e.y}" rx="${rx}" ry="${ry}" fill="rgba(255,255,255,.06)" stroke="${col}" stroke-width="3"/>
        <path d="M${cx - e.dx + rx} ${e.y} H${cx + e.dx - rx}" stroke="${col}" stroke-width="3"/>
        <path d="M${cx - e.dx - rx} ${e.y - 2} l-9 -4 M${cx + e.dx + rx} ${e.y - 2} l9 -4" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`);
    }
    case "visor": {
      const w = e.dx + e.rx + 12;
      return S(`<rect x="${cx - w}" y="${e.y - e.ry - 6}" width="${2 * w}" height="${2 * e.ry + 12}" rx="${e.ry + 6}" fill="${col}" fill-opacity=".28" stroke="${col}" stroke-width="3"/>`);
    }
    case "scar": {
      const x = cx - e.dx;
      return S(`<path d="M${x - e.rx - 1} ${e.y - e.ry - 10} L${x + e.rx + 3} ${e.y + e.ry + 12}" stroke="${col}" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M${x - 6} ${e.y - e.ry + 1} l10 -3 M${x - 3} ${e.y + 2} l11 -3 M${x} ${e.y + e.ry + 2} l10 -3" stroke="${col}" stroke-width="2.5" stroke-linecap="round"/>`);
    }
    case "scarf":
      return S(`<path d="M${a.neckL} ${a.neckY} Q${cx} ${a.neckY + 16} ${a.neckR} ${a.neckY}" fill="none" stroke="${col}" stroke-width="15" stroke-linecap="round"/>
        <path d="M${cx + 22} ${a.neckY + 8} L${cx + 30} ${a.neckY + 36}" stroke="${col}" stroke-width="12" stroke-linecap="round"/>
        <path d="M${a.neckL + 8} ${a.neckY + 2} Q${cx} ${a.neckY + 16} ${a.neckR - 8} ${a.neckY + 2}" fill="none" stroke="${dark}" stroke-width="2"/>`);
    case "medal":
      return S(`<path d="M${a.neckL + 22} ${a.neckY - 4} L${cx} ${a.neckY + 22} L${a.neckR - 22} ${a.neckY - 4}" fill="none" stroke="${col}" stroke-width="2.5" stroke-linejoin="round"/>
        <circle cx="${cx}" cy="${a.neckY + 28}" r="9" fill="${col}" stroke="${dark}" stroke-width="2.5"/>
        <circle cx="${cx}" cy="${a.neckY + 28}" r="3.5" fill="${dark}"/>`);
  }
  return "";
}

// A small standalone Void (no liquid) for previews: onboarding, locker and item drops.
let _uid = 0;
function miniVoid(di, accent, items = [], lid = 1) {
  const d = DESIGNS[di], e = d.eyes, u = ++_uid;
  const eyeCol = mix(accent, "#ffffff", 0.78);
  const eyes = [-1, 1].map((sg) => {
    const cx = 120 + sg * e.dx, ry = e.ry * lid;
    return `<ellipse cx="${cx}" cy="${e.y}" rx="${e.rx}" ry="${ry.toFixed(1)}" fill="${eyeCol}"/>
      <circle cx="${cx}" cy="${e.y + 1.5}" r="${Math.min(e.pr, ry * 0.75).toFixed(1)}" fill="#2a2340"/>
      <circle cx="${cx + 2}" cy="${e.y - 1}" r="${Math.max(1, e.pr * 0.32).toFixed(1)}" fill="#fff"/>`;
  }).join("");
  return `<svg viewBox="0 0 240 240" class="mini" aria-hidden="true">
    <defs><radialGradient id="mg${u}" cx=".38" cy=".28" r=".85">
      <stop offset="0" stop-color="${mix(accent, "#161221", 0.72)}"/><stop offset="1" stop-color="${mix(accent, "#120e1c", 0.9)}"/>
    </radialGradient></defs>
    <ellipse cx="120" cy="226" rx="70" ry="8" fill="rgba(0,0,0,.35)"/>
    <path d="${d.body}" fill="url(#mg${u})"/>
    ${d.detail ? `<path d="${d.detail}" fill="none" stroke="${mix(accent, "#ffffff", 0.4)}" stroke-opacity=".25" stroke-width="2"/>` : ""}
    <path d="${d.body}" fill="none" stroke="${mix(accent, "#ffffff", 0.35)}" stroke-opacity=".75" stroke-width="3" stroke-linejoin="round"/>
    ${eyes}
    ${items.map((i) => gearSVG(i, d)).join("")}
  </svg>`;
}

// Rank emblem: one chevron per rank.
function rankEmblem(idx, size = 28) {
  let p = "";
  for (let i = 0; i <= idx; i++) {
    const y = 36 - i * 4.6;
    p += `<path d="M9 ${y.toFixed(1)}L20 ${(y - 7).toFixed(1)}L31 ${y.toFixed(1)}"/>`;
  }
  return `<svg class="emblem" viewBox="0 0 40 40" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
}
