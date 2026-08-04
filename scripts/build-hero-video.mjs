/**
 * Renders the hero video from REAL simulation output.
 *
 * Source: ../MD figures/pca_projections_pc1_pc3.csv — 25,001 frames of Ca
 * principal-component projections from the delivered 500 ns trajectory
 * (874 Ca atoms; PC1 36.5%, PC2 12.4% of total variance).
 *
 * The animation sweeps the essential subspace in simulation time: the faint
 * cloud is every frame of the run, the bright comet is the ~8 ns window around
 * the current frame. This is a genuine visualisation of the trajectory, not a
 * decorative loop.
 *
 * Output: public/video/md-trajectory.{mp4,webm} + poster.webp
 */
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const FFMPEG =
  process.env.FFMPEG_PATH ||
  "C:/Program Files (x86)/Icecream Screen Recorder 7/ffmpeg.exe";

const SRC = path.resolve(process.cwd(), "../MD figures/pca_projections_pc1_pc3.csv");
const OUTDIR = path.resolve(process.cwd(), "public/video");
const TMP = path.resolve(process.cwd(), ".video-frames");

const W = 900;
const H = 900;
const FPS = 30;
const SECONDS = 14;
const FRAMES = FPS * SECONDS;
const TRAIL = 420; // trajectory points in the comet
const TOTAL_NS = 500;

// Light-theme palette, matched to the site
const BG = "#f5f8fd";
const INK = "#0d2242";

// ── Load the real projections ─────────────────────────────────────────────
const rows = readFileSync(SRC, "utf8").trim().split("\n");
const pts = rows.map((line) => {
  const [a, b] = line.split(",");
  return [parseFloat(a), parseFloat(b)];
});
console.log(`loaded ${pts.length} frames from pca_projections_pc1_pc3.csv`);

const xs = pts.map((p) => p[0]);
const ys = pts.map((p) => p[1]);
const pad = 0.08;
const x0 = Math.min(...xs);
const x1 = Math.max(...xs);
const y0 = Math.min(...ys);
const y1 = Math.max(...ys);
const spanX = x1 - x0;
const spanY = y1 - y0;

const M = 78; // plot margin in px
const sx = (v) => M + ((v - x0 + spanX * pad) / (spanX * (1 + 2 * pad))) * (W - 2 * M);
const sy = (v) => H - M - ((v - y0 + spanY * pad) / (spanY * (1 + 2 * pad))) * (H - 2 * M);

const proj = pts.map(([a, b]) => [sx(a), sy(b)]);

// ── Base layer: the full ensemble, drawn once ─────────────────────────────
// Sub-sampled for file size; density still reads correctly.
const STRIDE = 6;
const cloud = [];
for (let i = 0; i < proj.length; i += STRIDE) {
  const [x, y] = proj[i];
  cloud.push(
    `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.5" fill="#2f7ff6" opacity="0.075"/>`,
  );
}

const gridLines = [];
for (let i = 1; i < 5; i++) {
  const gx = M + (i / 5) * (W - 2 * M);
  const gy = M + (i / 5) * (H - 2 * M);
  gridLines.push(
    `<line x1="${gx}" y1="${M}" x2="${gx}" y2="${H - M}" stroke="#c9d9ef" stroke-width="1"/>`,
    `<line x1="${M}" y1="${gy}" x2="${W - M}" y2="${gy}" stroke="#c9d9ef" stroke-width="1"/>`,
  );
}

const baseSvg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${BG}"/>
  ${gridLines.join("")}
  <rect x="${M}" y="${M}" width="${W - 2 * M}" height="${H - 2 * M}"
        fill="none" stroke="#b6cbe8" stroke-width="1.2"/>
  ${cloud.join("")}
  <text x="${M}" y="46" font-family="Helvetica,Arial,sans-serif" font-size="21"
        font-weight="700" fill="${INK}">Essential subspace, 500 ns trajectory</text>
  <text x="${M}" y="68" font-family="Helvetica,Arial,sans-serif" font-size="13"
        fill="#5b7a9e">874 Ca atoms · PC1 36.5% · PC2 12.4% of variance</text>
  <text x="${W / 2}" y="${H - 26}" font-family="Helvetica,Arial,sans-serif" font-size="14"
        fill="#5b7a9e" text-anchor="middle">PC1 (nm)</text>
  <text x="26" y="${H / 2}" font-family="Helvetica,Arial,sans-serif" font-size="14"
        fill="#5b7a9e" text-anchor="middle"
        transform="rotate(-90 26 ${H / 2})">PC2 (nm)</text>
</svg>`;

const base = await sharp(Buffer.from(baseSvg)).png().toBuffer();

// ── Per-frame overlay ─────────────────────────────────────────────────────

await mkdir(TMP, { recursive: true });
await mkdir(OUTDIR, { recursive: true });

for (let f = 0; f < FRAMES; f++) {
  const t = f / (FRAMES - 1);
  const idx = Math.min(proj.length - 1, Math.round(t * (proj.length - 1)));
  const start = Math.max(0, idx - TRAIL);

  const seg = [];
  for (let i = start; i < idx; i += 2) {
    const age = (i - start) / Math.max(1, idx - start); // 0 oldest -> 1 newest
    const [ax, ay] = proj[i];
    const [bx, by] = proj[Math.min(i + 2, idx)];
    seg.push(
      `<line x1="${ax.toFixed(1)}" y1="${ay.toFixed(1)}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}" stroke="#1e63d6" stroke-width="${(0.6 + age * 2.6).toFixed(2)}" stroke-linecap="round" opacity="${(0.05 + age * 0.85).toFixed(3)}"/>`,
    );
  }

  const [hx, hy] = proj[idx];
  const ns = (t * TOTAL_NS).toFixed(0);

  const overlay = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  ${seg.join("")}
  <circle cx="${hx.toFixed(1)}" cy="${hy.toFixed(1)}" r="15" fill="#4ade9a" opacity="0.20"/>
  <circle cx="${hx.toFixed(1)}" cy="${hy.toFixed(1)}" r="8" fill="#22c55e" opacity="0.35"/>
  <circle cx="${hx.toFixed(1)}" cy="${hy.toFixed(1)}" r="4.6" fill="#15803d"/>
  <rect x="${W - M - 172}" y="${M + 14}" width="172" height="40" rx="8"
        fill="#ffffff" opacity="0.9" stroke="#c9d9ef"/>
  <text x="${W - M - 156}" y="${M + 40}" font-family="Helvetica,Arial,sans-serif"
        font-size="19" font-weight="700" fill="${INK}">t = ${ns} ns</text>
</svg>`;

  const buf = await sharp(base)
    .composite([{ input: Buffer.from(overlay), top: 0, left: 0 }])
    .png({ compressionLevel: 1 })
    .toBuffer();

  await writeFile(path.join(TMP, `f${String(f).padStart(4, "0")}.png`), buf);
  if (f % 60 === 0) console.log(`  frame ${f}/${FRAMES}`);
}
console.log("frames rendered");

// ── Encode ────────────────────────────────────────────────────────────────
// The available ffmpeg build has no PNG *decoder*, so frames are streamed in
// as raw RGB over stdin rather than handed over as a numbered PNG sequence.
async function encode(args, label) {
  await new Promise((resolve, reject) => {
    const ff = spawn(
      FFMPEG,
      [
        "-y", "-hide_banner", "-loglevel", "error",
        "-f", "rawvideo",
        "-pixel_format", "rgb24",
        "-video_size", `${W}x${H}`,
        "-framerate", String(FPS),
        "-i", "pipe:0",
        ...args,
      ],
      { stdio: ["pipe", "inherit", "inherit"] },
    );
    ff.on("error", reject);
    ff.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`${label} exited ${code}`)),
    );

    (async () => {
      for (let f = 0; f < FRAMES; f++) {
        const raw = await sharp(path.join(TMP, `f${String(f).padStart(4, "0")}.png`))
          .removeAlpha()
          .raw()
          .toBuffer();
        if (!ff.stdin.write(raw)) {
          await new Promise((r) => ff.stdin.once("drain", r));
        }
      }
      ff.stdin.end();
    })().catch(reject);
  });
  console.log(`✓ ${label}`);
}

await encode(
  [
    "-c:v", "libopenh264", "-b:v", "1500k",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    path.join(OUTDIR, "md-trajectory.mp4"),
  ],
  "md-trajectory.mp4",
);

await encode(
  [
    "-c:v", "libvpx", "-b:v", "1100k", "-crf", "32",
    "-pix_fmt", "yuv420p",
    path.join(OUTDIR, "md-trajectory.webm"),
  ],
  "md-trajectory.webm",
);

// Poster = a frame partway through, so the still is not an empty plot
await sharp(path.join(TMP, `f${String(Math.round(FRAMES * 0.62)).padStart(4, "0")}.png`))
  .webp({ quality: 86 })
  .toFile(path.join(OUTDIR, "md-trajectory-poster.webp"));
console.log("✓ poster");

await rm(TMP, { recursive: true, force: true });
console.log("done");
