/**
 * Prepares the hero video from the supplied BioPC promo reel.
 *
 * Source: assets/hero-source.mp4 (1920x1080, kept out of the web bundle).
 *
 * What this does:
 *   - strips the audio track entirely (the hero autoplays; browsers only
 *     permit that when muted, and a silent file is smaller)
 *   - scales to a high-resolution web master, preserving 16:9, the reel
 *     carries titles, a URL and a call-to-action, so it must not be cropped
 *   - encodes mp4 (H.264) and webm (VP8) plus a poster still
 *
 * No colour grading here, unlike the previous ambient clip: this reel contains
 * the BioPC logo and brand colours, which a hue shift would corrupt.
 *
 * The reel has a narrative shape (title card -> science -> call to action), so
 * it is NOT palindrome-looped; reversing it would play the end card backwards.
 * It loops by restarting, which is the normal behaviour for a promo reel.
 *
 * Preview a single frame instead of encoding:
 *   node scripts/build-hero-video.mjs --preview 14
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

const W = 1280;
const H = 720;
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

const frameAt = async (t) => {
  const raw = await run(
    [
      "-ss", String(t), "-i", SRC, "-frames:v", "1",
      "-vf", SCALE,
      "-f", "rawvideo", "-pix_fmt", "rgb24", "pipe:1",
    ],
    { collect: true },
  );
  return sharp(raw, { raw: { width: W, height: H, channels: 3 } });
};

// ── Preview mode ──────────────────────────────────────────────────────────
const previewIdx = process.argv.indexOf("--preview");
if (previewIdx !== -1) {
  const t = process.argv[previewIdx + 1] ?? "5";
  const out = path.resolve(process.cwd(), `preview-${t}.png`);
  await (await frameAt(t)).png().toFile(out);
  console.log("✓ preview", out);
  process.exit(0);
}

// ── Encode ────────────────────────────────────────────────────────────────
await mkdir(OUTDIR, { recursive: true });

console.log("encoding mp4…");
await run([
  "-y", "-i", SRC,
  "-vf", SCALE,
  "-an",
  "-c:v", "libopenh264", "-b:v", "1150k",
  "-pix_fmt", "yuv420p",
  "-movflags", "+faststart",
  path.join(OUTDIR, "biopc-md-reel.mp4"),
]);
console.log("✓ biopc-md-reel.mp4");

console.log("encoding webm…");
await run([
  "-y", "-i", SRC,
  "-vf", SCALE,
  "-an",
  "-c:v", "libvpx", "-b:v", "980k", "-crf", "33",
  "-qmin", "4", "-qmax", "48",
  "-pix_fmt", "yuv420p",
  path.join(OUTDIR, "biopc-md-reel.webm"),
]);
console.log("✓ biopc-md-reel.webm");

// Poster: the branded title card, so the still frame is on-message
await (await frameAt("1.5"))
  .webp({ quality: 86 })
  .toFile(path.join(OUTDIR, "biopc-md-reel-poster.webp"));
console.log("✓ poster");
