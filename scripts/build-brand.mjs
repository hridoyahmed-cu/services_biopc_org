/**
 * Brand assets from the BioPC logo.
 *
 * The source is a JPEG (opaque white background) of a circular badge, so the
 * corners are trimmed away and a circular alpha mask is applied, otherwise
 * the white square corners show against the page.
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
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

// Apple touch icons must be opaque, iOS composites them on black otherwise.
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

/**
 * A real /favicon.ico as well: browsers, crawlers and link-preview bots still
 * request that exact path, and a 404 there is why the tab showed no logo.
 * ICO entries may hold PNG payloads, which every current browser accepts.
 */
const icoSizes = [16, 32, 48];
const pngs = await Promise.all(
  icoSizes.map((s) => sharp(round).resize(s, s).png({ compressionLevel: 9 }).toBuffer()),
);

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(icoSizes.length, 4);

let offset = 6 + 16 * icoSizes.length;
const entries = icoSizes.map((size, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(size === 256 ? 0 : size, 0); // width
  e.writeUInt8(size === 256 ? 0 : size, 1); // height
  e.writeUInt8(0, 2); // palette count
  e.writeUInt8(0, 3); // reserved
  e.writeUInt16LE(1, 4); // colour planes
  e.writeUInt16LE(32, 6); // bits per pixel
  e.writeUInt32LE(pngs[i].length, 8);
  e.writeUInt32LE(offset, 12);
  offset += pngs[i].length;
  return e;
});

await writeFile(
  path.resolve(process.cwd(), "src/app/favicon.ico"),
  Buffer.concat([header, ...entries, ...pngs]),
);

console.log(
  "✓ logo.webp, logo.png, apple-touch-icon.png, src/app/icon.png, src/app/favicon.ico",
);
