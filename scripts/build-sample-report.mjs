/**
 * Builds the downloadable sample MD report from the real project figures.
 * Output: public/BioPC-Sample-MD-Report.pdf
 */
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const SRC = path.resolve(process.cwd(), "..");
const OUT = path.resolve(process.cwd(), "public/BioPC-Sample-MD-Report.pdf");

const A4 = { w: 595.28, h: 841.89 };
const M = 56; // page margin
const NAVY = rgb(0.02, 0.07, 0.16);
const NAVY_SOFT = rgb(0.09, 0.19, 0.35);
const ACCENT = rgb(0.22, 0.74, 0.97);
const INK = rgb(0.13, 0.16, 0.21);
const GREY = rgb(0.42, 0.47, 0.55);
const HAIR = rgb(0.85, 0.88, 0.92);

const FIGURES = [
  {
    file: "MD figures/M1_rmsd.png",
    n: 1,
    title: "Backbone RMSD",
    caption:
      "C-alpha RMSD of each partner and of the complex over the 500 ns production trajectory. Both chains plateau within the first 40 ns and remain within 0.35 nm of the equilibrated reference thereafter, so frames from 50–500 ns were carried into all downstream analysis.",
  },
  {
    file: "MD figures/M2_rmsf.png",
    n: 2,
    title: "Per-residue backbone fluctuation",
    caption:
      "RMSF per residue for both binding partners. The receptor (blue) is uniformly rigid, while the smaller partner (red) shows elevated fluctuation at solvent-exposed loops around residues 180–250 — motion that is peripheral to, and does not destabilise, the interface.",
  },
  {
    file: "MD figures/M3_gyrate.png",
    n: 3,
    title: "Radius of gyration",
    caption:
      "Compactness of the complex across the trajectory. Rg remains flat with no drift, confirming that neither partner unfolds or expands over the simulated timescale.",
  },
  {
    file: "MD figures/M4_sasa.png",
    n: 4,
    title: "Solvent-accessible surface area",
    caption:
      "Total SASA of the complex. The stable value indicates a persistent buried interface with no progressive solvent exposure that would signal dissociation.",
  },
  {
    file: "MD figures/M5_hbonds.png",
    n: 5,
    title: "Interfacial hydrogen bonding",
    caption:
      "Number of hydrogen bonds between the two chains per frame. A sustained population is maintained throughout, with the running mean showing no decay across the second half of the trajectory.",
  },
  {
    file: "MD figures/M6_interface.png",
    n: 6,
    title: "Interface persistence",
    caption:
      "Upper: heavy-atom contacts within 0.6 nm, which increase over the first 100 ns as the interface anneals and then remain high. Lower: minimum inter-chain distance, stable at ~0.17 nm — the partners never separate.",
  },
  {
    file: "MD figures/M7_secondary_structure.png",
    n: 7,
    title: "Secondary-structure content (DSSP)",
    caption:
      "Per-frame DSSP assignment. Helix, sheet, turn and coil populations are conserved for the full 500 ns, demonstrating that complexation does not perturb the fold of either partner.",
  },
  {
    file: "MD figures/F_PCA_eigenvalues.png",
    n: 8,
    title: "PCA eigenvalue spectrum",
    caption:
      "Eigenvalues of the Cα covariance matrix with cumulative variance. The leading two components dominate, justifying a two-dimensional description of the essential subspace.",
  },
  {
    file: "MD figures/F_PCA_scatter.png",
    n: 9,
    title: "Essential subspace projection",
    caption:
      "PC1–PC2 projection coloured by simulation time. The trajectory migrates from an initial basin (light) into a distinct, well-populated basin (dark) that it occupies for the remainder of the run.",
  },
  {
    file: "MD figures/F_FEL_PC1_PC2.png",
    n: 10,
    title: "Gibbs free-energy landscape",
    caption:
      "Free-energy surface over PC1 and PC2. A single deep global minimum (marked ×) with a shallow secondary basin indicates one dominant, energetically favoured conformational state.",
  },
  {
    file: "MD figures/F_DCCM.png",
    n: 11,
    title: "Dynamic cross-correlation matrix",
    caption:
      "Cα cross-correlation. Intra-chain blocks show strong positive correlation (red) along the diagonal; the off-diagonal quadrants reveal coordinated inter-chain motion consistent with a mechanically coupled complex.",
  },
  {
    file: "MMPBSA figures/P1_energy_components.png",
    n: 12,
    title: "MM/PBSA and MM/GBSA energy components",
    caption:
      "Decomposed binding free energy under both solvation models. Van der Waals and non-polar solvation drive binding, opposed by the polar desolvation penalty. Net binding free energy: -68.9 kcal/mol (Generalised Born) and -109.0 kcal/mol (Poisson-Boltzmann).",
  },
  {
    file: "MMPBSA figures/P2_convergence_GB.png",
    n: 13,
    title: "MM/GBSA convergence",
    caption:
      "Running average of the GB binding energy against frame count. The estimate is stable over the final third of the trajectory, confirming that sampling is sufficient for the reported value.",
  },
  {
    file: "MMPBSA figures/P3_hotspot_residues.png",
    n: 14,
    title: "Energetic hot-spot residues",
    caption:
      "Per-residue free energy decomposition, top 25 by magnitude. PRO129, PHE573 and TYR451 dominate the favourable contribution; GLU474 and GLU425 are net unfavourable, marking them as candidates for affinity-maturation mutagenesis.",
  },
];

const doc = await PDFDocument.create();
doc.setTitle("Sample Molecular Dynamics Report — BioPC");
doc.setAuthor("BioPC");
doc.setSubject("Example deliverable: 500 ns protein–protein MD simulation with MM/PBSA");
doc.setCreator("BioPC Molecular Dynamics Simulation Service");
doc.setKeywords(["molecular dynamics", "GROMACS", "MM/PBSA", "sample report", "BioPC"]);

const regular = await doc.embedFont(StandardFonts.Helvetica);
const bold = await doc.embedFont(StandardFonts.HelveticaBold);
const italic = await doc.embedFont(StandardFonts.HelveticaOblique);
const serifBold = await doc.embedFont(StandardFonts.TimesRomanBold);

/**
 * The 14 standard PDF fonts are WinAnsi-encoded and cannot represent Greek
 * letters, the true minus sign or superscripts. Prose is written in ASCII-safe
 * notation; this maps anything that slips through rather than throwing.
 */
const CHAR_MAP = [
  [/[−–—]/g, "-"],
  [/⁻¹/g, "-1"],
  [/Å/g, "A"],
  [/Δ/g, "delta "],
  [/α/g, "alpha"],
  [/β/g, "beta"],
  [/μ/g, "u"],
  [/[‘’]/g, "'"],
  [/[“”]/g, '"'],
  [/…/g, "..."],
];

function ascii(text) {
  let out = String(text);
  for (const [re, sub] of CHAR_MAP) out = out.replace(re, sub);
  // final guard: drop anything still outside WinAnsi's range, keeping newlines
  return out.replace(/[^\n\x20-\xFF]/g, "");
}

/** Greedy word wrap. */
function wrap(rawText, font, size, maxWidth) {
  const text = ascii(rawText);
  const lines = [];
  for (const paragraph of text.split("\n")) {
    let line = "";
    for (const word of paragraph.split(/\s+/)) {
      const test = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(test, size) > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    lines.push(line);
  }
  return lines;
}

let pageNo = 0;
function newPage() {
  const page = doc.addPage([A4.w, A4.h]);
  // Route every string through the WinAnsi sanitiser
  const rawDrawText = page.drawText.bind(page);
  page.drawText = (text, opts) => rawDrawText(ascii(text), opts);
  pageNo += 1;
  if (pageNo > 1) {
    // running header
    page.drawText("BioPC · Sample Molecular Dynamics Report", {
      x: M,
      y: A4.h - 38,
      size: 7.5,
      font: regular,
      color: GREY,
    });
    page.drawLine({
      start: { x: M, y: A4.h - 48 },
      end: { x: A4.w - M, y: A4.h - 48 },
      thickness: 0.5,
      color: HAIR,
    });
    // footer — disclaimer on every page, so a detached print still carries it
    page.drawText(
      "Not for commercial or research use. Reusing these figures in your own research will result in it being falsified and retracted.",
      { x: M, y: 46, size: 6.6, font: italic, color: rgb(0.68, 0.24, 0.1) },
    );
    page.drawText("services.biopc.org  ·  biopc.research@gmail.com", {
      x: M,
      y: 34,
      size: 7.5,
      font: regular,
      color: GREY,
    });
    const label = `${pageNo}`;
    page.drawText(label, {
      x: A4.w - M - regular.widthOfTextAtSize(label, 7.5),
      y: 34,
      size: 7.5,
      font: regular,
      color: GREY,
    });
  }
  return page;
}

/* ── Cover ──────────────────────────────────────────────────────────────── */
const cover = newPage();
cover.drawRectangle({ x: 0, y: 0, width: A4.w, height: A4.h, color: NAVY });
cover.drawRectangle({ x: 0, y: A4.h - 6, width: A4.w, height: 6, color: ACCENT });

// decorative helix trace
for (let i = 0; i < 90; i++) {
  const t = i / 89;
  const x = M + t * (A4.w - 2 * M);
  const y = 300 + Math.sin(t * Math.PI * 6) * 30;
  cover.drawCircle({
    x,
    y,
    size: 1.6 + Math.cos(t * Math.PI * 6) * 0.9,
    color: rgb(0.22, 0.6 + 0.25 * Math.abs(Math.sin(t * 6)), 0.95),
    opacity: 0.35 + 0.4 * Math.abs(Math.cos(t * Math.PI * 6)),
  });
}

cover.drawText("BioPC", {
  x: M,
  y: A4.h - 120,
  size: 30,
  font: serifBold,
  color: rgb(1, 1, 1),
});
cover.drawText("MOLECULAR DYNAMICS SIMULATION SERVICE", {
  x: M,
  y: A4.h - 140,
  size: 8,
  font: regular,
  color: ACCENT,
});

let y = A4.h - 230;
for (const line of wrap("Sample Molecular Dynamics Report", serifBold, 27, A4.w - 2 * M)) {
  cover.drawText(line, { x: M, y, size: 27, font: serifBold, color: rgb(1, 1, 1) });
  y -= 33;
}

cover.drawText(
  "500 ns protein–protein complex · GROMACS · MM/PBSA & MM/GBSA",
  { x: M, y: y - 6, size: 11.5, font: regular, color: rgb(0.66, 0.8, 0.96) },
);

y -= 60;
const coverBlurb =
  "This document is an abridged example of the deliverable supplied at the end of a BioPC molecular dynamics project. Figures are taken from a completed, anonymised study and are reproduced at delivery quality. A live project report additionally includes the methods section, full statistical appendix, raw data tables and the analysis scripts used to generate every panel.";
for (const line of wrap(coverBlurb, regular, 9.5, A4.w - 2 * M - 140)) {
  cover.drawText(line, { x: M, y, size: 9.5, font: regular, color: rgb(0.72, 0.81, 0.93) });
  y -= 14;
}

// spec strip
const specs = [
  ["Engine", "GROMACS 2023, CHARMM36m"],
  ["Production", "500 ns, NPT, 310 K"],
  ["System", "~148,000 atoms, TIP3P, 0.15 M NaCl"],
  ["Energetics", "MM/PBSA + MM/GBSA, 500 frames"],
];
y = 232;
for (const [k, v] of specs) {
  cover.drawText(k.toUpperCase(), { x: M, y, size: 7, font: bold, color: ACCENT });
  cover.drawText(v, { x: M + 90, y, size: 9, font: regular, color: rgb(0.86, 0.91, 0.98) });
  y -= 20;
}

// Usage restriction — boxed on the cover so it cannot be overlooked
cover.drawRectangle({
  x: M,
  y: 100,
  width: A4.w - 2 * M,
  height: 60,
  color: rgb(0.16, 0.05, 0.03),
  borderColor: rgb(0.76, 0.29, 0.13),
  borderWidth: 1,
});
cover.drawText("DISCLAIMER", {
  x: M + 16,
  y: 144,
  size: 7.5,
  font: bold,
  color: rgb(0.95, 0.55, 0.36),
});
{
  let dy = 130;
  const text =
    "This report and every figure in it are provided as a demonstration of deliverable quality only. They are not for commercial or research use. If you use any of these figures in your research, your research will be falsified and retracted.";
  for (const line of wrap(text, regular, 8, A4.w - 2 * M - 32)) {
    cover.drawText(line, {
      x: M + 16,
      y: dy,
      size: 8,
      font: regular,
      color: rgb(0.98, 0.86, 0.8),
    });
    dy -= 11;
  }
}

cover.drawLine({
  start: { x: M, y: 92 },
  end: { x: A4.w - M, y: 92 },
  thickness: 0.5,
  color: NAVY_SOFT,
});
cover.drawText("services.biopc.org", { x: M, y: 72, size: 9, font: bold, color: rgb(1, 1, 1) });
cover.drawText("biopc.research@gmail.com  ·  WhatsApp +880 1622-488559", {
  x: M,
  y: 58,
  size: 8.5,
  font: regular,
  color: rgb(0.66, 0.8, 0.96),
});
cover.drawText("Reliable. Reproducible. Publication-ready.", {
  x: A4.w - M - italic.widthOfTextAtSize("Reliable. Reproducible. Publication-ready.", 8.5),
  y: 58,
  size: 8.5,
  font: italic,
  color: ACCENT,
});

/* ── Summary page ───────────────────────────────────────────────────────── */
const summary = newPage();
y = A4.h - 92;
summary.drawText("Executive summary", { x: M, y, size: 19, font: serifBold, color: NAVY });
y -= 10;
summary.drawLine({
  start: { x: M, y },
  end: { x: M + 46, y },
  thickness: 2,
  color: ACCENT,
});
y -= 26;

const summaryText = `A 500 ns all-atom molecular dynamics simulation was carried out on the protein–protein complex to establish whether the docked pose represents a stable, physically plausible assembly, and to quantify the energetic basis of the interaction.

The complex is stable across the full trajectory. Backbone RMSD equilibrates within 40 ns and remains flat thereafter; radius of gyration and solvent-accessible surface area show no drift; and DSSP analysis confirms that the secondary structure of both partners is preserved. The interface itself strengthens over the first 100 ns — heavy-atom contacts rise and then plateau, while the minimum inter-chain distance holds near 0.17 nm for the entire run. Hydrogen bonding at the interface is sustained rather than transient.

Principal component analysis shows that the essential dynamics are captured by two components. The trajectory transitions out of its starting basin within the first 100 ns and settles into a single, deep free-energy minimum, indicating one dominant conformational state rather than continued conformational searching. The dynamic cross-correlation matrix shows coordinated inter-chain motion, consistent with a mechanically coupled complex rather than two independently tumbling proteins.

Binding free energy was estimated over 500 equally spaced frames from the equilibrated region. Both solvation models agree on the sign and on the driving terms: binding is dominated by van der Waals and non-polar contributions and opposed by polar desolvation. Per-residue decomposition identifies PRO129, PHE573 and TYR451 as the principal energetic hot spots, while GLU474 and GLU425 make net unfavourable contributions and are therefore the most promising targets for affinity-improving substitution.

Conclusion: the docked pose is validated on a 500 ns timescale, the interface is energetically well-founded, and the residue-level analysis provides a concrete, testable starting point for mutagenesis.`;

for (const line of wrap(summaryText, regular, 10, A4.w - 2 * M)) {
  if (y < 130) break;
  summary.drawText(line, { x: M, y, size: 10, font: regular, color: INK });
  y -= line === "" ? 8 : 15.5;
}

// key numbers box
summary.drawRectangle({
  x: M,
  y: 78,
  width: A4.w - 2 * M,
  height: 62,
  color: rgb(0.96, 0.98, 1),
  borderColor: HAIR,
  borderWidth: 0.6,
});
const kpis = [
  ["Binding energy (GB)", "-68.9 kcal/mol"],
  ["Binding energy (PB)", "-109.0 kcal/mol"],
  ["Mean RMSD", "0.31 nm"],
  ["Top hot spot", "PRO129"],
];
kpis.forEach(([k, v], i) => {
  const x = M + 14 + i * ((A4.w - 2 * M - 28) / 4);
  summary.drawText(k.toUpperCase(), { x, y: 118, size: 6.5, font: bold, color: GREY });
  summary.drawText(v, { x, y: 98, size: 12, font: serifBold, color: NAVY });
});

/* ── Figure pages: two figures per page ─────────────────────────────────── */
const CONTENT_W = A4.w - 2 * M;

for (let i = 0; i < FIGURES.length; i += 2) {
  const page = newPage();
  let cursor = A4.h - 76;

  for (const fig of FIGURES.slice(i, i + 2)) {
    const jpg = await sharp(path.join(SRC, fig.file))
      .flatten({ background: "#ffffff" })
      .resize({ width: 1500, withoutEnlargement: true })
      .jpeg({ quality: 78 })
      .toBuffer();
    const img = await doc.embedJpg(jpg);

    const captionLines = wrap(fig.caption, regular, 8.2, CONTENT_W);
    const captionH = captionLines.length * 11 + 6;
    const maxImgH = (A4.h - 76 - 70) / 2 - captionH - 34;
    const scale = Math.min(CONTENT_W / img.width, maxImgH / img.height);
    const w = img.width * scale;
    const h = img.height * scale;

    page.drawText(`Figure ${fig.n}. ${fig.title}`, {
      x: M,
      y: cursor,
      size: 10,
      font: bold,
      color: NAVY,
    });
    cursor -= 8;
    page.drawLine({
      start: { x: M, y: cursor },
      end: { x: A4.w - M, y: cursor },
      thickness: 0.5,
      color: HAIR,
    });
    cursor -= h + 10;

    page.drawImage(img, { x: M + (CONTENT_W - w) / 2, y: cursor, width: w, height: h });
    cursor -= 14;

    for (const line of captionLines) {
      page.drawText(line, { x: M, y: cursor, size: 8.2, font: regular, color: GREY });
      cursor -= 11;
    }
    cursor -= 22;
  }
}

/* ── Closing page ───────────────────────────────────────────────────────── */
const last = newPage();
y = A4.h - 92;
last.drawText("What a full project delivers", { x: M, y, size: 19, font: serifBold, color: NAVY });
y -= 10;
last.drawLine({ start: { x: M, y }, end: { x: M + 46, y }, thickness: 2, color: ACCENT });
y -= 30;

const deliverables = [
  ["High-resolution figures", "300–600 dpi raster, prepared to journal specification"],
  ["Vector graphics", "SVG, PDF and EPS versions of every panel"],
  ["Raw trajectory files", ".xtc and .trr, plus PBC-corrected and fitted trajectories"],
  ["Topology & parameters", "Complete system definition so the run can be reproduced"],
  ["Analysis scripts", "Every figure regenerable from the code shipped with the report"],
  ["Data tables", "CSV and Excel exports of the numbers behind each curve"],
  ["Statistical summaries", "Means, standard deviations, block averaging, convergence tests"],
  ["Interpretation report", "A written 2–10 page scientific analysis, not just plots"],
  ["Figure legends", "Drafted in journal style, ready to paste into your manuscript"],
  ["Supplementary package", "SI figures and tables bundled separately for submission"],
];

for (const [title, detail] of deliverables) {
  last.drawCircle({ x: M + 3, y: y + 3, size: 2, color: ACCENT });
  last.drawText(title, { x: M + 14, y, size: 9.5, font: bold, color: NAVY });
  last.drawText(detail, {
    x: M + 14 + bold.widthOfTextAtSize(title, 9.5) + 8,
    y,
    size: 9.5,
    font: regular,
    color: GREY,
  });
  y -= 21;
}

y -= 20;
last.drawRectangle({
  x: M,
  y: y - 96,
  width: CONTENT_W,
  height: 96,
  color: NAVY,
});
last.drawText("Ready to scope your project?", {
  x: M + 22,
  y: y - 34,
  size: 15,
  font: serifBold,
  color: rgb(1, 1, 1),
});
last.drawText(
  "Send your protein, ligand and research question for a written quotation — usually within one working day.",
  { x: M + 22, y: y - 54, size: 8.8, font: regular, color: rgb(0.72, 0.83, 0.95) },
);
last.drawText("services.biopc.org   ·   biopc.research@gmail.com   ·   WhatsApp +880 1622-488559", {
  x: M + 22,
  y: y - 76,
  size: 8.8,
  font: bold,
  color: ACCENT,
});

const bytes = await doc.save();
await writeFile(OUT, bytes);
console.log(`✓ ${OUT} — ${pageNo} pages, ${(bytes.length / 1024 / 1024).toFixed(2)} MB`);
