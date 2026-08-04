// Generates the 1200x630 social preview card.
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
  const o = 0.25 + 0.55 * Math.abs(Math.cos(t * Math.PI * 5));
  dots.push(
    `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${Math.abs(r).toFixed(
      2,
    )}" fill="#5cc6fb" opacity="${o.toFixed(2)}"/>`,
  );
}

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#050c1c"/>
      <stop offset="0.55" stop-color="#0a1a35"/>
      <stop offset="1" stop-color="#03070f"/>
    </linearGradient>
    <radialGradient id="orb" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#1d4ed8" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#1d4ed8" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="orb2" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#0e7490" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#0e7490" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#7dd3fc"/>
      <stop offset="0.6" stop-color="#38bdf8"/>
      <stop offset="1" stop-color="#4ade9a"/>
    </linearGradient>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M60 0H0V60" fill="none" stroke="#94b4e2" stroke-opacity="0.06" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <ellipse cx="150" cy="120" rx="420" ry="380" fill="url(#orb)"/>
  <ellipse cx="1080" cy="520" rx="400" ry="360" fill="url(#orb2)"/>
  <rect width="${W}" height="6" fill="url(#accent)"/>

  <g transform="translate(60,78)">
    <rect width="52" height="52" rx="13" fill="#1e63d6"/>
    <text x="26" y="34" font-family="Helvetica,Arial,sans-serif" font-size="20"
          font-weight="700" fill="#ffffff" text-anchor="middle">BP</text>
    <text x="70" y="22" font-family="Helvetica,Arial,sans-serif" font-size="21"
          font-weight="700" fill="#ffffff">BioPC</text>
    <text x="70" y="42" font-family="Helvetica,Arial,sans-serif" font-size="12"
          letter-spacing="2.4" fill="#5cc6fb">MOLECULAR DYNAMICS SIMULATION SERVICE</text>
  </g>

  <text x="60" y="248" font-family="Georgia,'Times New Roman',serif" font-size="58" fill="#ffffff">Turn docking results into</text>
  <text x="60" y="316" font-family="Georgia,'Times New Roman',serif" font-size="58" fill="url(#accent)">publication-ready</text>
  <text x="60" y="384" font-family="Georgia,'Times New Roman',serif" font-size="58" fill="#ffffff">MD insights</text>

  <g font-family="Helvetica,Arial,sans-serif" font-size="17" fill="#a9cdf5">
    <rect x="60" y="416" width="122" height="38" rx="19" fill="#38bdf8" fill-opacity="0.10" stroke="#38bdf8" stroke-opacity="0.32"/>
    <text x="121" y="441" text-anchor="middle">GROMACS</text>
    <rect x="194" y="416" width="118" height="38" rx="19" fill="#38bdf8" fill-opacity="0.10" stroke="#38bdf8" stroke-opacity="0.32"/>
    <text x="253" y="441" text-anchor="middle">Desmond</text>
    <rect x="324" y="416" width="102" height="38" rx="19" fill="#38bdf8" fill-opacity="0.10" stroke="#38bdf8" stroke-opacity="0.32"/>
    <text x="375" y="441" text-anchor="middle">AMBER</text>
    <rect x="438" y="416" width="150" height="38" rx="19" fill="#ffffff" fill-opacity="0.05" stroke="#94b4e2" stroke-opacity="0.2"/>
    <text x="513" y="441" text-anchor="middle">100 ns – 5 µs</text>
    <rect x="600" y="416" width="122" height="38" rx="19" fill="#ffffff" fill-opacity="0.05" stroke="#94b4e2" stroke-opacity="0.2"/>
    <text x="661" y="441" text-anchor="middle">MM/PBSA</text>
  </g>

  ${dots.join("")}

  <text x="60" y="586" font-family="Helvetica,Arial,sans-serif" font-size="19"
        font-weight="700" fill="#ffffff">services.biopc.org</text>
  <text x="${W - 60}" y="586" font-family="Georgia,serif" font-style="italic" font-size="18"
        fill="#5cc6fb" text-anchor="end">Reliable. Reproducible. Publication-ready.</text>
</svg>`;

const out = path.resolve(process.cwd(), "public/og.png");
await sharp(Buffer.from(svg)).png({ quality: 92 }).toFile(out);
console.log("✓", out);

// Favicon from the same mark
const icon = `
<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3aa0ff"/>
      <stop offset="1" stop-color="#1b4fae"/>
    </linearGradient>
  </defs>
  <rect width="256" height="256" rx="56" fill="#050c1c"/>
  <rect x="18" y="18" width="220" height="220" rx="46" fill="url(#g)"/>
  <text x="128" y="166" font-family="Helvetica,Arial,sans-serif" font-size="108"
        font-weight="700" fill="#ffffff" text-anchor="middle">BP</text>
</svg>`;
await sharp(Buffer.from(icon))
  .png()
  .toFile(path.resolve(process.cwd(), "public/icon.png"));
await sharp(Buffer.from(icon))
  .resize(180, 180)
  .png()
  .toFile(path.resolve(process.cwd(), "public/brand/apple-touch-icon.png"));
console.log("✓ icons");
