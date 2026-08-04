// Converts the raw MD / MM-PBSA figures into web-optimised WebP assets.
// Source PNGs live outside the app and are never shipped as-is.
import sharp from "sharp";
import { mkdir, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "..");
const OUT = path.resolve(process.cwd(), "public/figures");

const FIGURES = [
  ["MD figures/M1_rmsd.png", "rmsd"],
  ["MD figures/M2_rmsf.png", "rmsf"],
  ["MD figures/M3_gyrate.png", "gyration"],
  ["MD figures/M4_sasa.png", "sasa"],
  ["MD figures/M5_hbonds.png", "hbonds"],
  ["MD figures/M6_interface.png", "interface"],
  ["MD figures/M7_secondary_structure.png", "dssp"],
  ["MD figures/F_DCCM.png", "dccm"],
  ["MD figures/F_FEL_PC1_PC2.png", "fel"],
  ["MD figures/F_PCA_scatter.png", "pca-scatter"],
  ["MD figures/F_PCA_eigenvalues.png", "pca-eigenvalues"],
  ["MMPBSA figures/P1_energy_components.png", "mmpbsa-components"],
  ["MMPBSA figures/P2_convergence_GB.png", "mmpbsa-convergence-gb"],
  ["MMPBSA figures/P2_convergence_PB.png", "mmpbsa-convergence-pb"],
  ["MMPBSA figures/P3_hotspot_residues.png", "mmpbsa-hotspots"],
];

await mkdir(OUT, { recursive: true });

const manifest = [];
for (const [rel, slug] of FIGURES) {
  const src = path.join(ROOT, rel);
  if (!existsSync(src)) {
    console.warn("missing:", rel);
    continue;
  }
  const img = sharp(src).flatten({ background: "#ffffff" });
  const { width, height } = await img.metadata();

  await img
    .clone()
    .resize({ width: Math.min(width, 1600), withoutEnlargement: true })
    .webp({ quality: 88 })
    .toFile(path.join(OUT, `${slug}.webp`));

  await img
    .clone()
    .resize({ width: 760, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(path.join(OUT, `${slug}-thumb.webp`));

  manifest.push({ slug, width, height, ratio: +(width / height).toFixed(3) });
  console.log("✓", slug, `${width}x${height}`);
}

// Brand marks
const logoSrc = path.join(ROOT, "LOGO.jpg");
if (existsSync(logoSrc)) {
  await mkdir(path.resolve(process.cwd(), "public/brand"), { recursive: true });
  await sharp(logoSrc)
    .resize({ width: 512 })
    .webp({ quality: 90 })
    .toFile(path.resolve(process.cwd(), "public/brand/logo.webp"));
  await sharp(logoSrc)
    .resize(180, 180, { fit: "cover" })
    .png()
    .toFile(path.resolve(process.cwd(), "public/brand/apple-touch-icon.png"));
  console.log("✓ logo");
}

console.log(JSON.stringify(manifest, null, 1));
