// Generates the 1200x630 social preview card (light theme, real logo).
// Run build-brand.mjs first — this composites public/brand/logo.png.
import sharp from "sharp";
import path from "node:path";

const W = 1200;
const H = 630;

// A helix trace mirroring the one in the hero
const dots = [];
for (let i = 0; i < 120; i++) {
  const t = i / 119;
  const x = 60 + t * (W - 120);
  const y = 500 + Math.sin(t * Math.PI * 5) * 46;
  const r = 2.2 + Math.cos(t * Math.PI * 5) * 1.5;
  const o = 0.18 + 0.45 * Math.abs(Math.cos(t * Math.PI * 5));
  dots.push(
    `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${Math.abs(r).toFixed(
      2,
    )}" fill="#1668c9" opacity="${o.toFixed(2)}"/>`,
  );
}

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="0.55" stop-color="#f4f8fd"/>
      <stop offset="1" stop-color="#e8f0fa"/>
    </linearGradient>
    <radialGradient id="orb" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#9cc6f8" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#9cc6f8" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="orb2" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#a5e8f5" stop-opacity="0.45"/>
      <stop offset="1" stop-color="#a5e8f5" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#1668c9"/>
      <stop offset="0.6" stop-color="#1f74d8"/>
      <stop offset="1" stop-color="#15803d"/>
    </linearGradient>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M60 0H0V60" fill="none" stroke="#0d2242" stroke-opacity="0.045" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <ellipse cx="150" cy="120" rx="420" ry="380" fill="url(#orb)"/>
  <ellipse cx="1080" cy="520" rx="400" ry="360" fill="url(#orb2)"/>
  <rect width="${W}" height="6" fill="url(#accent)"/>

  <g transform="translate(134,78)">
    <text x="0" y="22" font-family="Helvetica,Arial,sans-serif" font-size="21"
          font-weight="700" fill="#0b1f3d">BioPC</text>
    <text x="0" y="44" font-family="Helvetica,Arial,sans-serif" font-size="12"
          letter-spacing="2.4" fill="#1668c9">MOLECULAR DYNAMICS SIMULATION SERVICE</text>
  </g>

  <text x="60" y="248" font-family="Georgia,'Times New Roman',serif" font-size="58" fill="#0b1f3d">Turn docking results into</text>
  <text x="60" y="316" font-family="Georgia,'Times New Roman',serif" font-size="58" fill="url(#accent)">publication-ready</text>
  <text x="60" y="384" font-family="Georgia,'Times New Roman',serif" font-size="58" fill="#0b1f3d">MD insights</text>

  <g font-family="Helvetica,Arial,sans-serif" font-size="17" fill="#16345c">
    <rect x="60" y="416" width="122" height="38" rx="19" fill="#1668c9" fill-opacity="0.08" stroke="#1668c9" stroke-opacity="0.35"/>
    <text x="121" y="441" text-anchor="middle">GROMACS</text>
    <rect x="194" y="416" width="118" height="38" rx="19" fill="#1668c9" fill-opacity="0.08" stroke="#1668c9" stroke-opacity="0.35"/>
    <text x="253" y="441" text-anchor="middle">Desmond</text>
    <rect x="324" y="416" width="102" height="38" rx="19" fill="#1668c9" fill-opacity="0.08" stroke="#1668c9" stroke-opacity="0.35"/>
    <text x="375" y="441" text-anchor="middle">AMBER</text>
    <rect x="438" y="416" width="150" height="38" rx="19" fill="#ffffff" stroke="#b9cde8"/>
    <text x="513" y="441" text-anchor="middle">100 ns – 5 µs</text>
    <rect x="600" y="416" width="122" height="38" rx="19" fill="#ffffff" stroke="#b9cde8"/>
    <text x="661" y="441" text-anchor="middle">MM/PBSA</text>
  </g>

  ${dots.join("")}

  <text x="60" y="586" font-family="Helvetica,Arial,sans-serif" font-size="19"
        font-weight="700" fill="#0b1f3d">services.biopc.org</text>
  <text x="${W - 60}" y="586" font-family="Georgia,serif" font-style="italic" font-size="18"
        fill="#1668c9" text-anchor="end">Reliable. Reproducible. Publication-ready.</text>
</svg>`;

const logo = await sharp(path.resolve(process.cwd(), "public/brand/logo.png"))
  .resize(62, 62)
  .png()
  .toBuffer();

const out = path.resolve(process.cwd(), "public/og.png");
await sharp(Buffer.from(svg))
  .composite([{ input: logo, top: 72, left: 60 }])
  .png({ quality: 92 })
  .toFile(out);

console.log("✓", out);
