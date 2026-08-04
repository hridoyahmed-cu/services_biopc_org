export const SITE = {
  name: "BioPC Molecular Dynamics Simulation Service",
  shortName: "BioPC Services",
  url: "https://services.biopc.org",
  tagline: "Reliable. Reproducible. Publication-ready.",
  description:
    "GPU-accelerated molecular dynamics simulation services from 100 ns to 5 µs using GROMACS, Desmond and AMBER. Trajectory analysis, PCA, free energy landscapes, DCCM and MM/PBSA binding free energy — delivered as publication-ready figures and data.",
  phone: "+880 1855-310554",
  phoneHref: "+8801855310554",
  whatsapp: "+880 1622-488559",
  whatsappHref: "8801622488559",
  email: "biopc.research@gmail.com",
  facebook: "https://www.facebook.com/biopclab",
} as const;

export const WHATSAPP_MESSAGE =
  "Hello BioPC, I would like a quotation for an MD simulation project.";

export const whatsappLink = (message: string = WHATSAPP_MESSAGE) =>
  `https://wa.me/${SITE.whatsappHref}?text=${encodeURIComponent(message)}`;

export const NAV = [
  { label: "Services", href: "#services" },
  { label: "Deliverables", href: "#deliverables" },
  { label: "Workflow", href: "#workflow" },
  { label: "Packages", href: "#packages" },
  { label: "Gallery", href: "#gallery" },
  { label: "FAQ", href: "#faq" },
] as const;

/* ─────────────────────────────────────────────────────────────────────────
 * PLACEHOLDER CONTENT — MUST BE REPLACED WITH REAL DATA BEFORE LAUNCH.
 *
 * METRICS, PUBLICATIONS, TESTIMONIALS and AFFILIATIONS below were written as
 * realistic structural examples so the layout could be built. They are NOT
 * real records. Publishing invented publication credits, client quotes or
 * university affiliations is a misrepresentation and a legal risk.
 * Substitute verified entries — or delete the entries you cannot verify.
 * See REPLACE-BEFORE-LAUNCH.md.
 * ───────────────────────────────────────────────────────────────────────── */

export const METRICS = [
  { value: "180+", label: "MD projects completed", detail: "Since 2021" },
  { value: "26", label: "Peer-reviewed papers supported", detail: "Q1–Q3 journals" },
  { value: "5 µs", label: "Longest production run", detail: "Single continuous trajectory" },
  { value: "9 days", label: "Average turnaround", detail: "Typical 100–200 ns project" },
] as const;

export const DIFFERENTIATORS = [
  {
    icon: "gpu",
    title: "GPU-accelerated infrastructure",
    body: "High-performance GPU workstations run production trajectories continuously, so a 500 ns system finishes in days rather than months.",
  },
  {
    icon: "workflow",
    title: "Reproducible workflows",
    body: "Standardised protocols and version-controlled analysis pipelines. Every figure in your report can be regenerated from the scripts we ship with it.",
  },
  {
    icon: "pricing",
    title: "Transparent pricing",
    body: "A clear written quotation before any work begins. No hidden computational charges, no surprise invoices for re-runs we recommended.",
  },
  {
    icon: "manuscript",
    title: "Manuscript-ready outputs",
    body: "Figures, statistics and supporting files prepared to journal specification, with legends you can paste directly into a thesis or submission.",
  },
] as const;

export const SERVICES = [
  {
    id: "setup",
    number: "01",
    title: "System setup & equilibration",
    summary: "Everything between your raw structure and a stable, production-ready system.",
    items: [
      "Protein and ligand preparation",
      "Protonation state assignment",
      "Force field selection (AMBER, CHARMM, OPLS)",
      "Solvation and ion addition",
      "Energy minimization",
      "NVT and NPT equilibration",
      "Simulation box optimization",
    ],
  },
  {
    id: "production",
    number: "02",
    title: "Production MD simulation",
    summary: "Continuous GPU production runs at the timescale your question actually requires.",
    items: [
      "100 ns",
      "200 ns",
      "500 ns",
      "1 µs",
      "2 µs",
      "5 µs (5000 ns)",
      "Custom simulation lengths",
    ],
  },
  {
    id: "trajectory",
    number: "03",
    title: "Trajectory & stability analysis",
    summary: "The core stability panel every reviewer expects to see.",
    items: [
      "RMSD and RMSF",
      "Radius of gyration (Rg)",
      "SASA",
      "DSSP secondary structure",
      "Distance and angle analysis",
      "Convergence assessment",
    ],
  },
  {
    id: "interaction",
    number: "04",
    title: "Protein–ligand interaction analysis",
    summary: "Which contacts hold, for how long, and what that means for affinity.",
    items: [
      "Hydrogen bond occupancy",
      "Salt bridges",
      "Hydrophobic contacts",
      "Contact maps",
      "Interaction fractions",
      "Ligand torsion analysis",
      "Desmond Simulation Interaction Diagram",
    ],
  },
  {
    id: "advanced",
    number: "05",
    title: "Advanced computational analysis",
    summary: "Collective motion and conformational landscapes beyond the standard panel.",
    items: [
      "Principal component analysis (PCA)",
      "Free energy landscape (FEL)",
      "Dynamic cross-correlation matrix (DCCM)",
      "Covariance matrix",
      "Cluster analysis",
      "Essential dynamics",
    ],
  },
  {
    id: "energy",
    number: "06",
    title: "Binding free energy calculations",
    summary: "Quantitative energetics with per-residue attribution.",
    items: [
      "MM/PBSA",
      "MM/GBSA",
      "Per-residue energy decomposition",
      "Energy decomposition plots",
      "Comparative binding analysis",
    ],
  },
] as const;

export const DELIVERABLES = [
  { title: "High-resolution figures", detail: "300–600 dpi raster, ready for submission" },
  { title: "Vector graphics", detail: "SVG, PDF and EPS for infinite rescaling" },
  { title: "Raw trajectory files", detail: ".xtc and .trr, plus the fitted trajectories" },
  { title: "Topology & parameter files", detail: "Full system definition for reproduction" },
  { title: "Analysis scripts", detail: "Every plot regenerable from the shipped code" },
  { title: "CSV / Excel data tables", detail: "The numbers behind every curve" },
  { title: "Statistical summaries", detail: "Means, SD, block averages, convergence tests" },
  { title: "Interpretation report", detail: "A concise 2–10 page scientific write-up" },
  { title: "Manuscript figure legends", detail: "Drafted in journal style, ready to paste" },
  { title: "Supplementary package", detail: "SI figures and tables bundled separately" },
] as const;

export const WORKFLOW = [
  {
    step: "Step 1",
    title: "Submit structure",
    detail: "PDB / ligand / project details",
    body: "Send a PDB ID or your own coordinates, the ligand file, and a sentence on what you want to learn. Docking poses from AutoDock, Vina, Glide or GOLD are all valid starting points.",
  },
  {
    step: "Step 2",
    title: "System preparation",
    detail: "Force fields, solvation, ions",
    body: "Protonation states assigned at your target pH, an appropriate force field chosen and justified, then solvation, neutralisation, minimisation and staged NVT/NPT equilibration.",
  },
  {
    step: "Step 3",
    title: "GPU production MD",
    detail: "100 ns to 5 µs",
    body: "Continuous production on dedicated GPUs with periodic integrity checks. Replicate runs available where the question demands statistical support.",
  },
  {
    step: "Step 4",
    title: "Advanced analysis",
    detail: "Trajectory, PCA, MM/PBSA",
    body: "The full stability panel, interaction profiling, essential dynamics and binding free energy — each plotted to publication specification.",
  },
  {
    step: "Step 5",
    title: "Publication-ready report",
    detail: "Figures, data, interpretation",
    body: "You receive figures, vectors, raw data, scripts and a written interpretation, with a revision round included for reviewer responses.",
  },
] as const;

export const PACKAGES = [
  {
    length: "100 ns",
    bestFor: "Thesis projects",
    output: "Stability analysis",
    note: "RMSD, RMSF, Rg, SASA and hydrogen bonding — the standard panel for a defensible thesis chapter.",
    accent: false,
  },
  {
    length: "200–500 ns",
    bestFor: "Journal manuscripts",
    output: "Convergence and interaction analysis",
    note: "Adds convergence assessment, DSSP, contact maps and interaction fractions for peer review.",
    accent: true,
  },
  {
    length: "1 µs",
    bestFor: "High-impact publications",
    output: "Advanced dynamics and free energy",
    note: "PCA, free energy landscape, DCCM and MM/PBSA with per-residue decomposition.",
    accent: false,
  },
  {
    length: "2–5 µs",
    bestFor: "Drug discovery research",
    output: "Long-timescale conformational behaviour",
    note: "Rare-event sampling, cluster analysis and comparative binding across ligand series.",
    accent: false,
  },
] as const;

export const GALLERY = [
  {
    slug: "rmsd",
    title: "Backbone RMSD",
    category: "Stability",
    caption:
      "Cα RMSD of the complex over the production trajectory, with the equilibrated plateau used for downstream analysis marked.",
  },
  {
    slug: "rmsf",
    title: "Per-residue RMSF",
    category: "Stability",
    caption:
      "Backbone fluctuation per residue for both binding partners, resolving the flexible loops that drive interface breathing.",
  },
  {
    slug: "gyration",
    title: "Radius of gyration",
    category: "Stability",
    caption:
      "Compactness of the complex across the trajectory — a direct readout of global folding stability.",
  },
  {
    slug: "sasa",
    title: "Solvent-accessible surface",
    category: "Stability",
    caption:
      "Total and interface SASA, quantifying how much surface is buried on complex formation.",
  },
  {
    slug: "hbonds",
    title: "Hydrogen bond occupancy",
    category: "Interactions",
    caption:
      "Time-resolved hydrogen bond count at the interface with occupancy statistics for each persistent pair.",
  },
  {
    slug: "interface",
    title: "Interface persistence",
    category: "Interactions",
    caption:
      "Contacts within 0.6 nm and minimum inter-chain distance, demonstrating a stable, non-dissociating interface.",
  },
  {
    slug: "dssp",
    title: "DSSP secondary structure",
    category: "Stability",
    caption:
      "Per-frame secondary structure content showing helix, sheet and coil populations remain conserved throughout.",
  },
  {
    slug: "dccm",
    title: "Dynamic cross-correlation",
    category: "Advanced",
    caption:
      "Cα dynamic cross-correlation matrix resolving correlated and anti-correlated domain motion across both chains.",
  },
  {
    slug: "fel",
    title: "Free energy landscape",
    category: "Advanced",
    caption:
      "Gibbs free energy landscape projected onto the first two principal components, with the global minimum annotated.",
  },
  {
    slug: "pca-scatter",
    title: "Essential subspace",
    category: "Advanced",
    caption:
      "PC1–PC2 projection coloured by simulation time, showing the transition between conformational basins.",
  },
  {
    slug: "pca-eigenvalues",
    title: "PCA eigenvalue spectrum",
    category: "Advanced",
    caption:
      "Eigenvalue decay and cumulative variance, confirming that the essential dynamics are captured by the leading modes.",
  },
  {
    slug: "mmpbsa-components",
    title: "MM/PBSA energy components",
    category: "Energetics",
    caption:
      "Decomposed binding free energy under Generalised Born and Poisson–Boltzmann solvation, with standard errors.",
  },
  {
    slug: "mmpbsa-hotspots",
    title: "Energetic hot-spot residues",
    category: "Energetics",
    caption:
      "Per-residue ΔG contributions ranked by magnitude, identifying the residues that dominate binding.",
  },
  {
    slug: "mmpbsa-convergence-gb",
    title: "MM/GBSA convergence",
    category: "Energetics",
    caption:
      "Running average of the GB binding energy against frame count, establishing that the estimate has converged.",
  },
  {
    slug: "mmpbsa-convergence-pb",
    title: "MM/PBSA convergence",
    category: "Energetics",
    caption:
      "Equivalent convergence assessment under Poisson–Boltzmann solvation for the same trajectory.",
  },
] as const;

export const GALLERY_CATEGORIES = [
  "All",
  "Stability",
  "Interactions",
  "Advanced",
  "Energetics",
] as const;

export const RESEARCH_AREAS = [
  { title: "Drug discovery", body: "Lead optimisation, scaffold comparison and residence-time reasoning." },
  { title: "Protein–ligand complexes", body: "Pose validation and interaction persistence after docking." },
  { title: "Peptide therapeutics", body: "Conformational stability and target engagement of designed peptides." },
  { title: "Enzyme engineering", body: "Active-site dynamics and the effect of stabilising mutations." },
  { title: "Vaccine design", body: "Multi-epitope construct stability and receptor complex behaviour." },
  { title: "Antibody modelling", body: "CDR loop flexibility and antigen interface characterisation." },
  { title: "Membrane proteins", body: "Lipid-bilayer embedded systems with appropriate membrane force fields." },
  { title: "Viral proteins", body: "Protease, polymerase and spike-class targets with inhibitor series." },
  { title: "Protein–protein interactions", body: "Interface energetics and hot-spot residue identification." },
  { title: "Computational biophysics", body: "Allostery, collective motion and conformational free energy." },
] as const;

export const PUBLICATIONS = [
  {
    title:
      "Multi-epitope subunit vaccine construct against a Gram-negative pathogen: immunoinformatics design and 500 ns TLR4 complex dynamics",
    venue: "Journal of Biomolecular Structure and Dynamics",
    year: "2024",
    contribution: "500 ns GROMACS production MD, DCCM, PCA/FEL and MM/PBSA",
  },
  {
    title:
      "Identification of natural product inhibitors targeting a bacterial efflux pump: docking, ADMET and molecular dynamics",
    venue: "Scientific Reports",
    year: "2024",
    contribution: "200 ns triplicate simulations and MM/GBSA decomposition",
  },
  {
    title:
      "Structure-based screening of phytochemicals against a viral main protease with long-timescale validation",
    venue: "Frontiers in Molecular Biosciences",
    year: "2023",
    contribution: "1 µs Desmond production run and interaction fraction analysis",
  },
  {
    title:
      "Comparative dynamics of wild-type and mutant enzyme variants reveals the structural basis of thermostability",
    venue: "Journal of Molecular Graphics and Modelling",
    year: "2023",
    contribution: "System setup, 300 ns MD and essential dynamics",
  },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "The convergence assessment and per-residue decomposition answered our second reviewer almost line by line. The revision was accepted without a further round.",
    author: "Assistant Professor, Department of Biochemistry",
    org: "Public university, Bangladesh",
  },
  {
    quote:
      "We sent docking poses on a Monday and had a 200 ns trajectory with the full stability panel back within two weeks — figures already at journal resolution.",
    author: "PhD candidate, Computational Drug Design",
    org: "Research group, India",
  },
  {
    quote:
      "What set BioPC apart was receiving the analysis scripts. We reran the whole pipeline on a second ligand ourselves without paying for it twice.",
    author: "Postdoctoral researcher, Structural Biology",
    org: "Research institute, Malaysia",
  },
] as const;

export const AFFILIATIONS = [
  "University of Chittagong",
  "University of Dhaka",
  "BRAC University",
  "Jahangirnagar University",
  "North South University",
  "Shahjalal University of Science & Technology",
  "Bangladesh Agricultural University",
  "Rajshahi University",
] as const;

export const FAQ = [
  {
    q: "Which software do you use?",
    a: "GROMACS, Desmond and AMBER-based workflows, selected per project. GROMACS is our default for protein–protein and membrane systems; Desmond where the Simulation Interaction Diagram is expected by the target journal; AMBER where the ligand parameterisation or MM/PBSA route calls for it.",
  },
  {
    q: "Can you continue from my docking results?",
    a: "Yes. We routinely start from AutoDock, AutoDock Vina, Glide, GOLD and HADDOCK outputs. Send the top pose (or several, if you want them compared) and we handle protonation, parameterisation and equilibration from there.",
  },
  {
    q: "Do you provide manuscript support?",
    a: "Yes. Every project includes publication-formatted figures, drafted figure legends, an interpretation report and a supplementary package. We also support one revision round for reviewer comments on the simulation work.",
  },
  {
    q: "How long does a 500 ns simulation take?",
    a: "Typically a few days to a few weeks, depending on system size and current queue load. A ~50,000-atom solvated complex generally completes within about a week of continuous GPU time; membrane systems and very large complexes take longer. You get a specific estimate in your quotation.",
  },
  {
    q: "Do you sign NDAs?",
    a: "Yes. Confidentiality agreements are available for collaborative and industry projects, and we can work under your institution's template. Unpublished structures and ligand series are never used as examples without written permission.",
  },
  {
    q: "What do I need to send to get a quotation?",
    a: "At minimum: the protein (PDB ID or file), the ligand or binding partner, and your intended simulation length or scientific question. Your manuscript deadline helps us schedule the run realistically.",
  },
  {
    q: "How do you handle authorship and acknowledgement?",
    a: "That is entirely your call. Most clients acknowledge the service; where our input is genuinely intellectual rather than technical, co-authorship can be discussed before work begins.",
  },
  {
    q: "What if the simulation shows the complex dissociating?",
    a: "We report it plainly, with the evidence. A negative result found in 200 ns is far cheaper than one found by a reviewer, and we will advise whether a different pose, protonation state or longer sampling is worth attempting.",
  },
] as const;

export const SIM_LENGTHS = [
  "100 ns",
  "200 ns",
  "500 ns",
  "1 µs",
  "2 µs",
  "5 µs",
  "Not sure — please advise",
] as const;

export const ANALYSIS_OPTIONS = [
  "RMSD / RMSF / Rg / SASA",
  "DSSP secondary structure",
  "Hydrogen bonds & salt bridges",
  "Contact maps / interaction fractions",
  "PCA & essential dynamics",
  "Free energy landscape (FEL)",
  "DCCM / covariance",
  "Cluster analysis",
  "MM/PBSA or MM/GBSA",
  "Per-residue energy decomposition",
] as const;
