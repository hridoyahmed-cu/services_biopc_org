/**
 * Prepares the hero video from the supplied protein–ligand animation.
 *
 * Source: assets/hero-source.mp4 (kept out of the web bundle).
 *
 * What this does:
 *   - strips the audio track entirely (the hero autoplays; it must be silent)
 *   - grades the teal render toward the site's azure so it sits inside the
 *     light theme rather than fighting it
 *   - builds a palindrome (forward + reversed) so playback loops with no
 *     visible jump — the camera flies in, then back out, forever
 *   - encodes mp4 (H.264) and webm (VP8) plus a poster still
 *
 * The AI-generation watermark in the source is deliberately preserved.
 *
 * Preview a single graded frame instead of encoding:
 *   node scripts/build-hero-video.mjs --preview 9.5
 */
import sharp from "sharp";
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const FFMPEG =
  process.env.FFMPEG_PATH ||
  "C:/Program Files (x86)/Icecream Screen Recorder 7/ffmpeg.exe";

const SRC = path.resolve(process.cwd(), "assets/hero-source.mp4");
const OUTDIR = path.resolve(process.cwd(), "public/video");

const W = 1152;
const H = 648;

/**
 * Teal (~180°) is rotated toward the brand azure (~211°) and the midtones are
 * lifted slightly so the render reads as deep brand blue on a light page.
 */
// NB: this ffmpeg build has no `eq` filter — hue's own b/s params and
// `curves` cover brightness, saturation and contrast instead.
const GRADE =
  "hue=h=26:s=1.05:b=0.35," +
  "curves=all='0/0.045 0.5/0.545 1/1'," +
  "colorbalance=rs=-0.03:gs=-0.02:bs=0.08:rm=-0.03:bm=0.05:rh=-0.02:bh=0.04";

const SCALE = `scale=${W}:${H}:flags=lanczos`;

function run(args, { collect = false } = {}) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const ff = spawn(FFMPEG, ["-hide_banner", "-loglevel", "error", ...args], {
      stdio: ["ignore", collect ? "pipe" : "inherit", "inherit"],
    });
    if (collect) ff.stdout.on("data", (d) => chunks.push(d));
    ff.on("error", reject);
    ff.on("close", (c) =>
      c === 0 ? resolve(Buffer.concat(chunks)) : reject(new Error(`ffmpeg exited ${c}`)),
    );
  });
}

// ── Preview mode ──────────────────────────────────────────────────────────
const previewIdx = process.argv.indexOf("--preview");
if (previewIdx !== -1) {
  const t = process.argv[previewIdx + 1] ?? "5";
  const raw = await run(
    [
      "-ss", t, "-i", SRC, "-frames:v", "1",
      "-vf", `${SCALE},${GRADE}`,
      "-f", "rawvideo", "-pix_fmt", "rgb24", "pipe:1",
    ],
    { collect: true },
  );
  const out = path.resolve(process.cwd(), `preview-${t}.png`);
  await sharp(raw, { raw: { width: W, height: H, channels: 3 } }).png().toFile(out);
  console.log("✓ preview", out);
  process.exit(0);
}

// ── Encode ────────────────────────────────────────────────────────────────
await mkdir(OUTDIR, { recursive: true });

// Palindrome: [graded] and [graded reversed] concatenated.
const FILTER =
  `[0:v]${SCALE},${GRADE},split[fwd][tmp];` +
  `[tmp]reverse[rev];` +
  `[fwd][rev]concat=n=2:v=1:a=0[out]`;

console.log("encoding mp4…");
await run([
  "-y", "-i", SRC,
  "-filter_complex", FILTER,
  "-map", "[out]",
  "-an", // no audio track at all
  "-c:v", "libopenh264", "-b:v", "1050k",
  "-pix_fmt", "yuv420p",
  "-movflags", "+faststart",
  path.join(OUTDIR, "md-protein-ligand.mp4"),
]);
console.log("✓ md-protein-ligand.mp4");

console.log("encoding webm…");
await run([
  "-y", "-i", SRC,
  "-filter_complex", FILTER,
  "-map", "[out]",
  "-an",
  "-c:v", "libvpx", "-b:v", "820k", "-crf", "35",
  "-pix_fmt", "yuv420p",
  path.join(OUTDIR, "md-protein-ligand.webm"),
]);
console.log("✓ md-protein-ligand.webm");

// Poster: a graded frame from the wide establishing shot
const posterRaw = await run(
  [
    "-ss", "9.4", "-i", SRC, "-frames:v", "1",
    "-vf", `${SCALE},${GRADE}`,
    "-f", "rawvideo", "-pix_fmt", "rgb24", "pipe:1",
  ],
  { collect: true },
);
await sharp(posterRaw, { raw: { width: W, height: H, channels: 3 } })
  .webp({ quality: 84 })
  .toFile(path.join(OUTDIR, "md-protein-ligand-poster.webp"));
console.log("✓ poster");
