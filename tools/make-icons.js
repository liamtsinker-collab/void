// Draws Void's app icons (a dark glass orb with eyes, half-filled with colour) as PNG files. No dependencies.
// Run from the project folder:  node tools/make-icons.js
const fs = require("fs");
const zlib = require("zlib");
const path = require("path");

function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const t = Buffer.from(type);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}
function png(size, rgba) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.substr(i, 2), 16));
const lerp = (a, b, t) => a + (b - a) * t;
const mixc = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

const BG = hex("#16121f"), ACCENT = hex("#b4a7ea");
const GLASS_A = hex("#40355e"), GLASS_B = hex("#1a1528"), RIM = hex("#e2d8fa"), EYE = hex("#f1eadf"), PUPIL = hex("#2a2340");
const LIQ = [hex("#c58a9f"), hex("#c9965c"), hex("#6f97b8")];   // rose -> amber -> blue, like Void's colours

// colour at a point, in 0..1 coordinates
function shade(u, v) {
  let col = BG.slice();
  // soft glow behind the orb
  const gd = Math.hypot(u - 0.5, v - 0.52) / 0.5;
  if (gd < 1) col = mixc(col, ACCENT, 0.34 * Math.pow(1 - gd, 2));
  // the orb
  const cx = 0.5, cy = 0.53, a = 0.235, b = 0.275;
  const x = (u - cx) / a, y = (v - cy) / b;
  // slightly egg-shaped: a touch narrower at the top
  const d = Math.hypot(x * (y < 0 ? 1 + 0.12 * -y : 1), y);
  if (d <= 1) {
    col = mixc(GLASS_A, GLASS_B, Math.min(1, Math.max(0, (x * 0.5 + y * 0.6 + 1) / 2)));
    // liquid in the lower part, with a gentle wave on top
    const liqTop = cy + 0.03 + Math.sin(u * 22) * 0.006;
    if (v > liqTop) {
      const t = Math.min(1, (v - liqTop) / (cy + b - liqTop));
      col = t < 0.5 ? mixc(LIQ[0], LIQ[1], t * 2) : mixc(LIQ[1], LIQ[2], (t - 0.5) * 2);
    }
    // glass rim
    const edge = (1 - d) * Math.min(a, b);
    if (edge < 0.011) col = mixc(col, RIM, 0.85 * (1 - edge / 0.011));
  }
  // eyes (drawn over everything inside the orb)
  for (const sx of [-1, 1]) {
    const ex = (u - (cx + sx * 0.085)) / 0.037, ey = (v - (cy - 0.075)) / 0.047;
    if (Math.hypot(ex, ey) <= 1) {
      col = EYE.slice();
      const px = (u - (cx + sx * 0.085)) / 0.018, py = (v - (cy - 0.07)) / 0.02;
      if (Math.hypot(px, py) <= 1) col = PUPIL.slice();
    }
  }
  return col;
}

function render(size) {
  const buf = Buffer.alloc(size * size * 4), S = 3;           // 3x3 supersampling for smooth edges
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0;
      for (let sy = 0; sy < S; sy++) for (let sx = 0; sx < S; sx++) {
        const c = shade((x + (sx + 0.5) / S) / size, (y + (sy + 0.5) / S) / size);
        r += c[0]; g += c[1]; b += c[2];
      }
      const i = (y * size + x) * 4, n = S * S;
      buf[i] = Math.round(r / n); buf[i + 1] = Math.round(g / n); buf[i + 2] = Math.round(b / n); buf[i + 3] = 255;
    }
  }
  return png(size, buf);
}

const out = path.join(__dirname, "..", "icons");
fs.mkdirSync(out, { recursive: true });
const files = { "icon-192.png": 192, "icon-512.png": 512, "icon-maskable-512.png": 512, "apple-touch-icon.png": 180 };
for (const [name, size] of Object.entries(files)) {
  fs.writeFileSync(path.join(out, name), render(size));
  console.log("wrote icons/" + name);
}
