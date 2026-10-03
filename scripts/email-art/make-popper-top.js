// Draws the opening animation of the welcome email -> public/email/popper-top.gif
// Two party poppers sit in the top corners of the mint header; when the email opens they pop (a flash), shoot
// confetti inward, the confetti drifts down and fades, and the strip settles on the logo. Plays once, then holds.
// The Azisly logo is drawn into the strip (the <img> carries alt="Azisly.ai").
// Run: node scripts/email-art/make-popper-top.js
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const { GIFEncoder, quantize, applyPalette } = require("gifenc");

const ROOT = path.join(__dirname, "..", "..");
const OUT = path.join(ROOT, "public", "email", "popper-top.gif");
const W = 580, H = 112; // css px of the strip (the mint panel is 580 wide)
const K = 1.5; // render scale
const MINT = "#bdfbba";

const logoSvg = fs.readFileSync(path.join(ROOT, "public", "logos", "azisly-brand.svg"), "utf8");
const logoVb = logoSvg.match(/viewBox="([\d.\- ]+)"/)[1].split(/\s+/).map(Number);
const logoInner = logoSvg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
const LW = 148, LH = (LW * logoVb[3]) / logoVb[2];
const LOGO = `<svg x="${(W - LW) / 2}" y="${(H - LH) / 2}" width="${LW}" height="${LH}" viewBox="${logoVb.join(" ")}">${logoInner}</svg>`;

const ANGLE = 24; // degrees below horizontal that each popper points
const MOUTH = { x: 8 + 60 * Math.cos((ANGLE * Math.PI) / 180), y: 6 + 60 * Math.sin((ANGLE * Math.PI) / 180) };

const popper = (mirror) => `
  <g transform="${mirror ? `translate(${W - 8} 6) scale(-1 1)` : "translate(8 6)"} rotate(${ANGLE})">
    <defs><clipPath id="c${mirror ? "r" : "l"}"><path d="M0 0 L60 -19 Q67 0 60 19 Z"/></clipPath></defs>
    <path d="M0 0 L60 -19 Q67 0 60 19 Z" fill="#ffd23f"/>
    <g clip-path="url(#c${mirror ? "r" : "l"})" fill="#0b2540">
      <polygon points="12,-30 19,-30 19,30 12,30"/><polygon points="29,-30 36,-30 36,30 29,30"/><polygon points="46,-30 53,-30 53,30 46,30"/>
    </g>
    <path d="M0 0 L60 -19 L60 -8 L0 0Z" fill="#fff" opacity=".28"/>
    <ellipse cx="60" cy="0" rx="6.5" ry="19" fill="#5a3b00"/>
    <ellipse cx="60" cy="0" rx="6.5" ry="19" fill="none" stroke="#ff7bd5" stroke-width="3"/>
  </g>`;

let seed = 11;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const COLORS = ["#ffd23f", "#ffffff", "#ff7bd5", "#0b2540", "#2f9bff", "#ff6b4a", "#7a5cff", "#18b866"];
const star = (r, fill) => `<path transform="scale(${(r / 12).toFixed(2)})" d="M0 -12 C.8 -4 4 -.8 12 0 C4 .8 .8 4 0 12 C-.8 4 -4 .8 -12 0 C-4 -.8 -.8 -4 0 -12Z" fill="${fill}"/>`;

// each particle: which popper, launch velocity, spin, shape
const particles = [];
for (let side = 0; side < 2; side++) {
  for (let i = 0; i < 40; i++) {
    const a = (ANGLE + (rnd() - 0.5) * 70) * (Math.PI / 180);
    const speed = 260 + rnd() * 520;
    particles.push({
      side,
      vx: Math.cos(a) * speed * (side ? -1 : 1),
      vy: Math.sin(a) * speed,
      rot: rnd() * 360,
      spin: (rnd() - 0.5) * 900,
      color: COLORS[(i + side * 3) % COLORS.length],
      kind: i % 5, // 0 rect, 1 circle, 2 star, 3 thin rect, 4 curl
      size: 0.8 + rnd() * 0.7,
    });
  }
}

const K_DRAG = 3.2, FALL = 95;
const place = (p, t) => {
  const e = 1 - Math.exp(-K_DRAG * t);
  const x0 = p.side ? W - MOUTH.x : MOUTH.x;
  return {
    x: x0 + (p.vx / K_DRAG) * e,
    y: MOUTH.y + (p.vy / K_DRAG) * e + FALL * (t - e / K_DRAG),
  };
};
const shape = (p) => {
  const s = p.size;
  if (p.kind === 0) return `<rect x="${-5 * s}" y="${-2.5 * s}" width="${10 * s}" height="${5 * s}" rx="1" fill="${p.color}"/>`;
  if (p.kind === 1) return `<circle r="${3.2 * s}" fill="${p.color}"/>`;
  if (p.kind === 2) return star(9 * s, p.color);
  if (p.kind === 3) return `<rect x="${-1.6 * s}" y="${-7 * s}" width="${3.2 * s}" height="${14 * s}" rx="1.6" fill="${p.color}"/>`;
  return `<path d="M${-9 * s} 0 q${4.5 * s} ${-7 * s} ${9 * s} 0 t${9 * s} 0" fill="none" stroke="${p.color}" stroke-width="${2.4 * s}" stroke-linecap="round"/>`;
};

const frame = (t, flash) => {
  let g = "";
  if (t !== null) {
    for (const p of particles) {
      const { x, y } = place(p, t);
      const fade = t < 1.25 ? 1 : Math.max(0, 1 - (t - 1.25) / 0.6);
      if (fade <= 0 || y > H + 14 || x < -14 || x > W + 14) continue;
      g += `<g opacity="${fade.toFixed(2)}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(p.rot + p.spin * t).toFixed(0)})">${shape(p)}</g>`;
    }
  }
  const burst = flash
    ? [0, 1].map((side) => {
        const cx = side ? W - MOUTH.x : MOUTH.x;
        return `<g transform="translate(${cx} ${MOUTH.y})"><circle r="30" fill="#fff6b8" opacity=".55"/>${star(34, "#ffffff")}${star(20, "#ffd23f")}</g>`;
      }).join("")
    : "";
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(W * K)}" height="${Math.round(H * K)}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="${MINT}"/>${LOGO}${popper(false)}${popper(true)}${burst}${g}</svg>`
  );
};

(async () => {
  const GW = Math.round(W * K), GH = Math.round(H * K);
  const specs = [{ t: null, d: 700 }, { t: 0.04, flash: true, d: 90 }];
  for (let i = 1; i <= 22; i++) specs.push({ t: 0.04 + i * 0.085, d: 85 });
  specs.push({ t: null, d: 60000 }); // settled: clean header, held

  const rgbaOf = async (svg) => {
    const { data } = await sharp(svg).flatten({ background: MINT }).raw().toBuffer({ resolveWithObject: true });
    const out = new Uint8Array(GW * GH * 4);
    for (let p = 0, q = 0; p < data.length; p += 3, q += 4) { out[q] = data[p]; out[q + 1] = data[p + 1]; out[q + 2] = data[p + 2]; out[q + 3] = 255; }
    return out;
  };
  const frames = [];
  for (const s of specs) frames.push(await rgbaOf(frame(s.t, s.flash)));

  // one palette for all frames, learned from the busiest ones
  const sample = new Uint8Array(GW * GH * 4 * 3);
  [1, 5, 10].forEach((fi, k) => sample.set(frames[fi], k * GW * GH * 4));
  const palette = quantize(sample, 256);

  const gif = GIFEncoder();
  frames.forEach((rgba, i) => {
    gif.writeFrame(applyPalette(rgba, palette), GW, GH, { palette: i === 0 ? palette : undefined, delay: specs[i].d, repeat: i === 0 ? -1 : undefined });
  });
  gif.finish();
  fs.writeFileSync(OUT, Buffer.from(gif.bytes()));
  console.log("popper-top.gif", GW + "x" + GH, fs.statSync(OUT).size, "bytes,", frames.length, "frames");
})();
