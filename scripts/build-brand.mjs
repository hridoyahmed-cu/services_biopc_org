/**
 * Brand assets from the BioPC logo.
 *
 * The source is a JPEG (opaque white background) of a circular badge, so the
 * corners are trimmed away and a circular alpha mask is applied — otherwise
 * the white square corners show against the page.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = path.resolve(process.cwd(), "../LOGO.jpg");
const BRAND = path.resolve(process.cwd(), "public/brand");
await mkdir(BRAND, { recursive: true });

const SIZE = 512;

// Trim the white margin, then letterbox to a clean square.
const square = await sharp(SRC)
  .trim({ threshold: 12 })
  .resize(SIZE, SIZE, { fit: "contain", background: "#ffffff" })
  .png()
  .toBuffer();

const circleMask = Buffer.from(
  `<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
     <circle cx="${SIZE / 2}" cy="${SIZE / 2}" r="${SIZE / 2}" fill="#fff"/>
   </svg>`,
);

const round = await sharp(square)
  .composite([{ input: circleMask, blend: "dest-in" }])
  .png()
  .toBuffer();

// Transparent-cornered mark for the header, footer and anywhere on-page.
await sharp(round).webp({ quality: 95 }).toFile(path.join(BRAND, "logo.webp"));
await sharp(round).png().toFile(path.join(BRAND, "logo.png"));

// Apple touch icons must be opaque — iOS composites them on black otherwise.
await sharp(square)
  .resize(180, 180)
  .flatten({ background: "#ffffff" })
  .png()
  .toFile(path.join(BRAND, "apple-touch-icon.png"));

// Favicon (Next serves src/app/icon.png automatically)
await sharp(round)
  .resize(256, 256)
  .png()
  .toFile(path.resolve(process.cwd(), "src/app/icon.png"));

console.log("✓ logo.webp, logo.png, apple-touch-icon.png, src/app/icon.png");
