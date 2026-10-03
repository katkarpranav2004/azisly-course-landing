// Builds the small image assets of the welcome email into public/email:
//   prasun-hero.png     Prasun cut-out on one tilted pink card, bottom-flush (right side of the hero)
//   fade-to-dark.png    alpha strip that dissolves the purple link section into the dark finale
//   notch-gift-*.png    punched half-circles for the yellow coupon ticket
// Run: node scripts/email-art/make-hero.js
const sharp = require("sharp");
const path = require("path");

const OUT = path.join(__dirname, "..", "..", "public", "email");
const CUTOUT = path.join(__dirname, "..", "..", "public", "faculty", "prasun-cutout.webp");
const DEEP = { r: 22, g: 8, b: 47 }; // #16082f, the dark finale

(async () => {
  // hero: 520 x 640 (shown at 260 x 320)
  const W = 520, H = 640;
  const art = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <radialGradient id="glow" cx="50%" cy="46%" r="50%"><stop offset="0" stop-color="#b79bff" stop-opacity=".55"/><stop offset="1" stop-color="#b79bff" stop-opacity="0"/></radialGradient>
      <linearGradient id="card" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff8cec"/><stop offset="1" stop-color="#ff4fd8"/></linearGradient>
    </defs>
    <ellipse cx="270" cy="300" rx="270" ry="300" fill="url(#glow)"/>
    <g transform="rotate(9 360 240)"><rect x="196" y="82" width="312" height="312" rx="52" fill="url(#card)"/></g>
    <path d="M446 40 C448 56 454 62 470 64 C454 66 448 72 446 88 C444 72 438 66 422 64 C438 62 444 56 446 40Z" fill="#ffd23f"/>
  </svg>`;
  const person = await sharp(CUTOUT).resize({ width: 500 }).toBuffer();
  const pm = await sharp(person).metadata();
  const crop = await sharp(person).extract({ left: 0, top: 0, width: 500, height: Math.min(H, pm.height) }).toBuffer();
  await sharp(Buffer.from(art)).composite([{ input: crop, left: 10, top: 0 }]).png({ compressionLevel: 9 }).toFile(path.join(OUT, "prasun-hero.png"));

  // fade-to-dark: purple above, dark below (alpha 0 -> 1, eased)
  const FW = 1200, FH = 150, px = Buffer.alloc(FW * FH * 4);
  for (let y = 0; y < FH; y++) {
    const t = y / (FH - 1), a = Math.round(255 * (t * t * (3 - 2 * t)));
    for (let x = 0; x < FW; x++) {
      const o = (y * FW + x) * 4;
      px[o] = DEEP.r; px[o + 1] = DEEP.g; px[o + 2] = DEEP.b; px[o + 3] = a;
    }
  }
  await sharp(px, { raw: { width: FW, height: FH, channels: 4 } }).png({ compressionLevel: 9 }).toFile(path.join(OUT, "fade-to-dark.png"));

  // coupon notches (half circles in the finale colour), 14 x 28 shown at 2x
  const fill = `rgb(${DEEP.r},${DEEP.g},${DEEP.b})`;
  const half = (left) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="28" height="56"><circle cx="${left ? 0 : 28}" cy="28" r="26" fill="${fill}"/></svg>`);
  await sharp(half(true)).png().toFile(path.join(OUT, "notch-gift-left.png"));
  await sharp(half(false)).png().toFile(path.join(OUT, "notch-gift-right.png"));
  console.log("done");
})();
