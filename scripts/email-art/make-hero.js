// Builds the hero photo of the welcome email -> public/email/hero-photo.png
// Prasun's cut-out on a navy-to-teal card with a mint disc behind him, rounded corners and a white border,
// like the framed photo in the mint header panel of the reference newsletter.
// Run: node scripts/email-art/make-hero.js
const sharp = require("sharp");
const path = require("path");

const OUT = path.join(__dirname, "..", "..", "public", "email", "hero-photo.png");
const CUTOUT = path.join(__dirname, "..", "..", "public", "faculty", "prasun-cutout.webp");

const W = 1040, H = 640, R = 44, BORDER = 10; // 2x of a 520 x 320 image

const star = (cx, cy, r, fill, o = 1) =>
  `<path transform="translate(${cx} ${cy}) scale(${r / 12})" d="M0 -12 C.8 -4 4 -.8 12 0 C4 .8 .8 4 0 12 C-.8 4 -4 .8 -12 0 C-4 -.8 -.8 -4 0 -12Z" fill="${fill}" opacity="${o}"/>`;

(async () => {
  const bg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b2540"/><stop offset=".6" stop-color="#0f4a63"/><stop offset="1" stop-color="#17808a"/></linearGradient>
      <radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#bdfbba" stop-opacity=".35"/><stop offset="1" stop-color="#bdfbba" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
    <circle cx="520" cy="330" r="360" fill="url(#glow)"/>
    <circle cx="520" cy="318" r="248" fill="#bdfbba"/>
    <circle cx="520" cy="318" r="292" fill="none" stroke="#ffffff" stroke-opacity=".28" stroke-width="3"/>
    <circle cx="520" cy="318" r="340" fill="none" stroke="#ffffff" stroke-opacity=".12" stroke-width="3"/>
    ${star(168, 150, 26, "#ffffff", 0.9)}
    ${star(884, 118, 20, "#bdfbba")}
    ${star(900, 440, 14, "#ffffff", 0.7)}
    ${star(120, 470, 12, "#bdfbba", 0.8)}
  </svg>`;

  const person = await sharp(CUTOUT).resize({ width: 600 }).toBuffer();
  const pm = await sharp(person).metadata();
  const top = 52;
  const crop = await sharp(person).extract({ left: 0, top: 0, width: 600, height: Math.min(pm.height, H - top) }).toBuffer();

  const composed = await sharp(Buffer.from(bg)).composite([{ input: crop, left: 220, top }]).png().toBuffer();

  // rounded corners (transparent) and a white frame
  const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" rx="${R}" fill="#fff"/></svg>`);
  const frame = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect x="${BORDER / 2}" y="${BORDER / 2}" width="${W - BORDER}" height="${H - BORDER}" rx="${R - BORDER / 2}" fill="none" stroke="#ffffff" stroke-width="${BORDER}"/></svg>`
  );
  await sharp(composed)
    .composite([{ input: mask, blend: "dest-in" }, { input: frame }])
    .png({ compressionLevel: 9 })
    .toFile(OUT);
  const m = await sharp(OUT).metadata();
  console.log("hero-photo.png", m.width + "x" + m.height);
})();
