// Traces the ghost silhouette and eyes from a reference PNG into src/assistant/ghostShape.js.
// Usage: node scripts/trace-ghost.js [image=public/kiro.png]
import sharp from "sharp";
import fs from "node:fs/promises";

const source = process.argv[2] || "public/kiro.png";
const target = "src/assistant/ghostShape.js";

// Iso-contours of the luminance field at sub-pixel accuracy (marching squares).
function contours(L, W, H, iso) {
  const points = new Map(), links = new Map();
  const at = (x, y) => L[y * W + x];
  const cross = (x0, y0, x1, y1) => { const t = (iso - at(x0, y0)) / (at(x1, y1) - at(x0, y0)); return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t]; };
  const join = (a, b) => {
    for (const [key, p] of [a, b]) { points.set(key, p); if (!links.has(key)) links.set(key, []); }
    links.get(a[0]).push(b[0]); links.get(b[0]).push(a[0]);
  };
  for (let y = 0; y < H - 1; y++) for (let x = 0; x < W - 1; x++) {
    const c = (at(x, y) > iso) << 3 | (at(x + 1, y) > iso) << 2 | (at(x + 1, y + 1) > iso) << 1 | (at(x, y + 1) > iso);
    if (c === 0 || c === 15) continue;
    const T = () => [`h${x},${y}`, cross(x, y, x + 1, y)], B = () => [`h${x},${y + 1}`, cross(x, y + 1, x + 1, y + 1)];
    const Lt = () => [`v${x},${y}`, cross(x, y, x, y + 1)], R = () => [`v${x + 1},${y}`, cross(x + 1, y, x + 1, y + 1)];
    const centre = at(x, y) + at(x + 1, y) + at(x + 1, y + 1) + at(x, y + 1) > 4 * iso;
    if (c === 1 || c === 14) join(Lt(), B());
    else if (c === 2 || c === 13) join(B(), R());
    else if (c === 3 || c === 12) join(Lt(), R());
    else if (c === 4 || c === 11) join(T(), R());
    else if (c === 6 || c === 9) join(T(), B());
    else if (c === 7 || c === 8) join(Lt(), T());
    else if ((c === 5) === centre) { join(Lt(), T()); join(B(), R()); }
    else { join(T(), R()); join(Lt(), B()); }
  }
  const seen = new Set(), loops = [];
  for (const start of links.keys()) {
    if (seen.has(start)) continue;
    const loop = [];
    for (let prev = null, cur = start; cur;) {
      seen.add(cur); loop.push(points.get(cur));
      const next = links.get(cur).find((k) => k !== prev && !seen.has(k));
      prev = cur; cur = next;
    }
    loops.push(loop);
  }
  return loops;
}

const area = (p) => p.reduce((s, [x0, y0], i) => { const [x1, y1] = p[(i + 1) % p.length]; return s + (x0 * y1 - x1 * y0) / 2; }, 0);

function resample(p, step) {
  const lengths = [0];
  p.forEach(([x0, y0], i) => { const [x1, y1] = p[(i + 1) % p.length]; lengths.push(lengths[i] + Math.hypot(x1 - x0, y1 - y0)); });
  const total = lengths[p.length], count = Math.round(total / step), out = [];
  for (let k = 0, j = 0; k < count; k++) {
    const s = (k * total) / count;
    while (lengths[j + 1] < s) j++;
    const t = (s - lengths[j]) / (lengths[j + 1] - lengths[j] || 1), [x0, y0] = p[j], [x1, y1] = p[(j + 1) % p.length];
    out.push([x0 + (x1 - x0) * t, y0 + (y1 - y0) * t]);
  }
  return out;
}

// Gaussian smoothing along the curve removes pixel-scale noise without moving the outline.
function smooth(p, sigma) {
  const r = Math.ceil(sigma * 3), w = Array.from({ length: 2 * r + 1 }, (_, k) => Math.exp(-((k - r) ** 2) / (2 * sigma * sigma)));
  const sum = w.reduce((a, b) => a + b);
  return p.map((_, i) => w.reduce(([x, y], wk, k) => { const q = p[(i + k - r + p.length) % p.length]; return [x + q[0] * wk / sum, y + q[1] * wk / sum]; }, [0, 0]));
}

const { data, info } = await sharp(source).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const L = new Float32Array(info.width * info.height);
for (let i = 0; i < L.length; i++) L[i] = (0.2126 * data[i * info.channels] + 0.7152 * data[i * info.channels + 1] + 0.0722 * data[i * info.channels + 2]) / 255;

// Largest bright loop is the body; the two largest loops inside it are the eyes.
const [body, ...eyes] = contours(L, info.width, info.height, 0.5).sort((a, b) => Math.abs(area(b)) - Math.abs(area(a)));
const xs = body.map((p) => p[0]), ys = body.map((p) => p[1]);
const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
const scale = 4 / (Math.max(...ys) - Math.min(...ys)); // model is 4 units tall, y up
const toModel = (p) => p.map(([x, y]) => [(x - cx) * scale, (cy - y) * scale]);
// three.js expects a clockwise outline with counter-clockwise holes.
const orient = (p, clockwise) => (area(p) < 0) === clockwise ? p : p.reverse();
const flat = (p) => p.flat().map((v) => +v.toFixed(3));

const outline = orient(toModel(resample(smooth(resample(body, 0.5), 3), 2.4)), true);
const eyeData = eyes.slice(0, 2).map((loop) => {
  const p = orient(toModel(resample(smooth(resample(loop, 0.5), 2), 1.6)), false);
  const ex = p.map((q) => q[0]), ey = p.map((q) => q[1]);
  const round = (v) => +v.toFixed(3);
  return {
    x: round((Math.min(...ex) + Math.max(...ex)) / 2), y: round((Math.min(...ey) + Math.max(...ey)) / 2),
    rx: round((Math.max(...ex) - Math.min(...ex)) / 2), ry: round((Math.max(...ey) - Math.min(...ey)) / 2),
    outline: flat(p),
  };
}).sort((a, b) => a.x - b.x);

const rows = (values, indent) => values.reduce((lines, v, i) => { if (i % 16 === 0) lines.push([]); lines.at(-1).push(v); return lines; }, []).map((l) => indent + l.join(", ")).join(",\n");
await fs.writeFile(target, `// Generated by scripts/trace-ghost.js from ${source.replaceAll("\\", "/")}. Do not edit by hand.
// Model units: 4 tall, y up, centred on the silhouette's bounding box.
// The outline runs clockwise and each eye outline counter-clockwise, as three.js expects for holes.
export const GHOST_OUTLINE = [
${rows(flat(outline), "  ")},
];

export const GHOST_EYES = [
${eyeData.map((e) => `  {
    x: ${e.x}, y: ${e.y}, rx: ${e.rx}, ry: ${e.ry},
    outline: [
${rows(e.outline, "      ")},
    ],
  }`).join(",\n")},
];
`);
console.log(`${target}: ${outline.length} outline points, eyes ${eyeData.map((e) => `${e.outline.length / 2} pts @ (${e.x}, ${e.y}) r ${e.rx}×${e.ry}`).join("; ")}`);
