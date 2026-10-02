// Draws the graduation-cap illustration used in the welcome email band -> public/email/cap.png
// Run: node scripts/email-art/make-cap.js
const sharp = require("sharp");
const path = require("path");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="300" viewBox="0 0 360 300">
  <defs>
    <linearGradient id="top" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b79bff"/><stop offset=".55" stop-color="#7a4cf2"/><stop offset="1" stop-color="#4a1fc4"/></linearGradient>
    <linearGradient id="edgeL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a1fb8"/><stop offset="1" stop-color="#3a1596"/></linearGradient>
    <linearGradient id="edgeR" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3a1596"/><stop offset="1" stop-color="#2a0f78"/></linearGradient>
    <linearGradient id="base" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a2bd6"/><stop offset="1" stop-color="#2c0e82"/></linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe27a"/><stop offset="1" stop-color="#f0a800"/></linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#9a6bff" stop-opacity=".55"/><stop offset="1" stop-color="#9a6bff" stop-opacity="0"/></radialGradient>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9"/></filter>
  </defs>
  <ellipse cx="180" cy="170" rx="170" ry="120" fill="url(#glow)"/>
  <ellipse cx="190" cy="262" rx="104" ry="14" fill="#0b0330" opacity=".55" filter="url(#soft)"/>
  <!-- skull cap under the board -->
  <path d="M104 150 L104 214 Q190 256 276 214 L276 150 Q190 190 104 150Z" fill="url(#base)"/>
  <path d="M104 150 Q190 190 276 150" fill="none" stroke="#8d6bff" stroke-opacity=".55" stroke-width="2"/>
  <!-- board thickness -->
  <path d="M26 118 L190 184 L190 202 L26 136Z" fill="url(#edgeL)"/>
  <path d="M190 184 L354 118 L354 136 L190 202Z" fill="url(#edgeR)"/>
  <!-- board top -->
  <path d="M190 40 L354 118 L190 184 L26 118Z" fill="url(#top)"/>
  <path d="M190 40 L354 118 L190 184 L26 118Z" fill="none" stroke="#d8c8ff" stroke-opacity=".5" stroke-width="2"/>
  <path d="M100 100 L190 62 L250 90" fill="none" stroke="#ffffff" stroke-opacity=".28" stroke-width="3" stroke-linecap="round"/>
  <!-- button + tassel -->
  <circle cx="190" cy="112" r="9" fill="url(#gold)"/>
  <path d="M190 112 L332 128 L336 206" fill="none" stroke="url(#gold)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="326" y="198" width="22" height="14" rx="4" fill="url(#gold)"/>
  <path d="M328 212 L326 246 M333 212 L333 250 M338 212 L338 250 M343 212 L345 246" stroke="url(#gold)" stroke-width="4" stroke-linecap="round"/>
  <!-- sparkles -->
  <path d="M318 40 C319.5 52 324 56.5 336 58 C324 59.5 319.5 64 318 76 C316.5 64 312 59.5 300 58 C312 56.5 316.5 52 318 40Z" fill="#ffd23f"/>
  <path d="M38 52 C38.8 59 41 61.2 48 62 C41 62.8 38.8 65 38 72 C37.2 65 35 62.8 28 62 C35 61.2 37.2 59 38 52Z" fill="#ffffff" opacity=".9"/>
  <circle cx="60" cy="214" r="5" fill="#ff86e6"/>
  <circle cx="300" cy="250" r="4" fill="#6fd8b9"/>
</svg>`;

(async () => {
  const out = path.join(__dirname, "..", "..", "public", "email", "cap.png");
  await sharp(Buffer.from(svg), { density: 192 }).png({ compressionLevel: 9 }).toFile(out);
  const m = await sharp(out).metadata();
  console.log("cap.png", m.width + "x" + m.height);
})();
