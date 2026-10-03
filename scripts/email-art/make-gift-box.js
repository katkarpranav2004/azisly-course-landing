// Draws the surprise gift box of the welcome email into public/email:
//   gift-base.png   box body + shadow
//   gift-lid.png    lid with the bow
//   gift-light.png  glow + light rays behind the box, shown when it opens
//   gift-burst.png  confetti that flies out in front of the box
//   gift-glow.png   soft mint halo behind the box
//   gift-box.gif    the whole thing as a looping animation (box shakes, lid pops, confetti), for mail apps
//                   that cannot run the tap-to-open version
// One drawing, two uses: the layered PNGs are moved by CSS in Apple Mail, the GIF is the same scene frame by frame.
// Everything is drawn on a 600 x 300 stage. Run: node scripts/email-art/make-gift-box.js
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const { GIFEncoder, quantize, applyPalette } = require("gifenc");

const OUT = path.join(__dirname, "..", "..", "public", "email");
const SW = 600, SH = 300;

const DEFS = `<defs>
  <linearGradient id="body" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1d4f86"/><stop offset=".5" stop-color="#12365e"/><stop offset="1" stop-color="#0b2540"/></linearGradient>
  <linearGradient id="lidg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#245a96"/><stop offset="1" stop-color="#12365e"/></linearGradient>
  <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe888"/><stop offset=".55" stop-color="#ffc21a"/><stop offset="1" stop-color="#d98f00"/></linearGradient>
  <linearGradient id="goldv" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e9a400"/><stop offset=".5" stop-color="#ffe27a"/><stop offset="1" stop-color="#e9a400"/></linearGradient>
  <radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fffbe0" stop-opacity=".95"/><stop offset=".45" stop-color="#ffe98a" stop-opacity=".5"/><stop offset="1" stop-color="#ffe98a" stop-opacity="0"/></radialGradient>
  <radialGradient id="halo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#bdfbba" stop-opacity=".75"/><stop offset="1" stop-color="#bdfbba" stop-opacity="0"/></radialGradient>
  <linearGradient id="ray" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff6b8" stop-opacity=".7"/><stop offset="1" stop-color="#fff6b8" stop-opacity="0"/></linearGradient>
</defs>`;

const BASE = `
  <ellipse cx="300" cy="268" rx="132" ry="11" fill="#0b2540" opacity=".2"/>
  <rect x="190" y="150" width="220" height="112" rx="12" fill="url(#body)"/>
  <rect x="190" y="150" width="14" height="112" rx="6" fill="#fff" opacity=".07"/>
  <path d="M190 162 Q190 150 202 150 H398 Q410 150 410 162 V168 H190Z" fill="#061729" opacity=".5"/>
  <rect x="282" y="150" width="36" height="112" fill="url(#goldv)"/>
  <rect x="288" y="150" width="4" height="112" fill="#fff" opacity=".35"/>`;

const LID = `
  <rect x="178" y="118" width="244" height="40" rx="10" fill="url(#lidg)"/>
  <rect x="186" y="122" width="228" height="5" rx="2.5" fill="#fff" opacity=".2"/>
  <rect x="282" y="118" width="36" height="40" fill="url(#goldv)"/>
  <path d="M300 124 L278 156 L294 152 L300 160Z" fill="url(#gold)" stroke="#c98a00" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M300 124 L322 156 L306 152 L300 160Z" fill="url(#gold)" stroke="#c98a00" stroke-width="1.5" stroke-linejoin="round"/>
  <g id="loop"><path d="M300 114 C286 82 244 76 250 100 C254 118 282 120 300 114Z" fill="url(#gold)" stroke="#c98a00" stroke-width="2"/><path d="M296 110 C284 92 262 88 262 100 C264 108 280 112 296 110Z" fill="#fff" opacity=".28"/></g>
  <g transform="translate(600 0) scale(-1 1)"><use href="#loop"/></g>
  <rect x="286" y="98" width="28" height="26" rx="9" fill="url(#gold)" stroke="#c98a00" stroke-width="2"/>
  <rect x="291" y="102" width="8" height="14" rx="4" fill="#fff" opacity=".4"/>`;

// small deterministic random for the confetti
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const COLORS = ["#ffd23f", "#ffffff", "#ff7bd5", "#6ee7ff", "#43d17a", "#0b2540", "#ffb347", "#a78bfa"];
const star = (x, y, r, fill) => `<path transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(r / 12).toFixed(2)})" d="M0 -12 C.8 -4 4 -.8 12 0 C4 .8 .8 4 0 12 C-.8 4 -4 .8 -12 0 C-4 -.8 -.8 -4 0 -12Z" fill="${fill}"/>`;

let confetti = "";
for (let i = 0; i < 38; i++) {
  const a = (-175 + rnd() * 170) * (Math.PI / 180);
  const r = 70 + rnd() * 190;
  const x = 300 + Math.cos(a) * r * 1.2, y = 142 + Math.sin(a) * r * 0.72;
  const c = COLORS[i % COLORS.length], k = i % 4;
  if (k === 0) confetti += `<rect x="${(x - 6).toFixed(1)}" y="${(y - 3).toFixed(1)}" width="12" height="6" rx="1.5" fill="${c}" transform="rotate(${(rnd() * 180).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
  else if (k === 1) confetti += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(3 + rnd() * 3).toFixed(1)}" fill="${c}"/>`;
  else if (k === 2) confetti += star(x, y, 9 + rnd() * 8, c);
  else confetti += `<rect x="${(x - 2.5).toFixed(1)}" y="${(y - 7).toFixed(1)}" width="5" height="14" rx="2.5" fill="${c}" transform="rotate(${(rnd() * 180).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
}
let rays = "";
for (let k = -4; k <= 4; k++) {
  const a = (-90 + k * 15) * (Math.PI / 180), w = 0.05;
  const p = (ang, r) => `${(300 + Math.cos(ang) * r).toFixed(1)},${(150 + Math.sin(ang) * r).toFixed(1)}`;
  rays += `<polygon points="300,150 ${p(a - w, 230)} ${p(a + w, 230)}" fill="url(#ray)" transform="rotate(${k * 0} 300 150)"/>`;
}
const LIGHT = `<ellipse cx="300" cy="128" rx="170" ry="120" fill="url(#glow)"/>${rays}`; // behind the box
const BURST = confetti; // in front of the box
const HALO = `<ellipse cx="300" cy="190" rx="250" ry="130" fill="url(#halo)"/>`;
const TWINKLE_A = star(196, 96, 12, "#ffd23f") + star(412, 70, 9, "#ffffff") + star(470, 150, 13, "#ff7bd5") + star(132, 170, 9, "#6ee7ff");
const TWINKLE_B = star(150, 110, 10, "#ffffff") + star(444, 100, 13, "#ffd23f") + star(396, 40, 8, "#6ee7ff") + star(112, 60, 12, "#ff7bd5");

const svg = (inner, vb, w, h, bg) =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="${vb}">${DEFS}${bg ? `<rect x="-50" y="-50" width="900" height="500" fill="${bg}"/>` : ""}${inner}</svg>`);

(async () => {
  // layered PNGs at 2x (CSS positions them on the stage)
  const layer = async (name, inner, x, y, w, h) =>
    sharp(svg(inner, `${x} ${y} ${w} ${h}`, w * 2, h * 2)).png({ compressionLevel: 9 }).toFile(path.join(OUT, name));
  await layer("gift-base.png", BASE, 170, 148, 260, 142);
  await layer("gift-lid.png", LID, 170, 66, 260, 100);
  await layer("gift-burst.png", BURST, 0, 0, SW, SH);
  await layer("gift-light.png", LIGHT, 0, 0, SW, SH);
  await layer("gift-glow.png", HALO, 0, 0, SW, SH);

  // the GIF: same scene, frame by frame, on white
  const K = 1.3, GW = Math.round(SW * K), GH = Math.round(SH * K);
  const frame = ({ dy = 0, rot = 0, lid = [0, 0, 0], burst = 0, burstOp = 0, twinkle = null }) => {
    const box = `<g transform="translate(0 ${dy}) rotate(${rot} 300 262)">${BASE}<g transform="translate(${lid[0]} ${lid[1]}) rotate(${lid[2]} 300 138)">${LID}</g></g>`;
    const light = burst
      ? `<g opacity="${Math.min(1, burstOp + 0.2)}" transform="translate(300 150) scale(${Math.min(burst, 1.05)}) translate(-300 -150)">${LIGHT}</g>`
      : "";
    const b = burst
      ? `<g opacity="${burstOp}" transform="translate(300 150) scale(${burst}) translate(-300 -150)">${BURST}</g>`
      : "";
    const t = twinkle ? (twinkle === "A" ? TWINKLE_A : TWINKLE_B) : "";
    return svg(HALO + light + box + b + t, `0 0 ${SW} ${SH}`, GW, GH, "#ffffff");
  };
  const open = [-60, -46, -24];
  const frames = [
    [{}, 800],
    [{ dy: -5 }, 100],
    [{ rot: 3 }, 70], [{ rot: -3 }, 70], [{ rot: 4 }, 70], [{ rot: -4 }, 70], [{ rot: 2 }, 70],
    [{}, 140],
    [{ lid: [0, -14, -4] }, 70],
    [{ lid: [-18, -36, -12], burst: 0.35, burstOp: 1 }, 70],
    [{ lid: [-40, -40, -18], burst: 0.6, burstOp: 1 }, 70],
    [{ lid: open, burst: 0.85, burstOp: 1 }, 80],
    [{ lid: open, burst: 1.05, burstOp: 0.9 }, 100],
    [{ lid: open, burst: 1.2, burstOp: 0.6 }, 120],
    [{ lid: open, burst: 1.3, burstOp: 0.3 }, 140],
    [{ lid: open, twinkle: "A" }, 520],
    [{ lid: open, twinkle: "B" }, 520],
    [{ lid: open, twinkle: "A" }, 520],
    [{ lid: open, twinkle: "B" }, 700],
  ];
  const gif = GIFEncoder();
  let palette = null;
  for (let i = 0; i < frames.length; i++) {
    const [spec, delay] = frames[i];
    const { data } = await sharp(frame(spec)).flatten({ background: "#fff" }).raw().toBuffer({ resolveWithObject: true });
    const rgba = new Uint8Array(GW * GH * 4);
    for (let p = 0, q = 0; p < data.length; p += 3, q += 4) { rgba[q] = data[p]; rgba[q + 1] = data[p + 1]; rgba[q + 2] = data[p + 2]; rgba[q + 3] = 255; }
    // one shared palette (from the busiest frame) keeps the file small
    if (!palette && i === 12) palette = quantize(rgba, 256);
    if (!palette) { frames[i].rgba = rgba; continue; }
    frames[i].rgba = rgba;
  }
  for (let i = 0; i < frames.length; i++) {
    const [, delay] = frames[i];
    const index = applyPalette(frames[i].rgba, palette);
    // play the sequence three times, then rest on the open box
    gif.writeFrame(index, GW, GH, { palette: i === 0 ? palette : undefined, delay, repeat: i === 0 ? 2 : undefined });
  }
  gif.finish();
  fs.writeFileSync(path.join(OUT, "gift-box.gif"), Buffer.from(gif.bytes()));
  console.log("done", fs.statSync(path.join(OUT, "gift-box.gif")).size, "bytes gif", GW + "x" + GH);
})();
