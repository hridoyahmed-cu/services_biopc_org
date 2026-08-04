import TrajectoryField from "../TrajectoryField";
import { ArrowIcon, DownloadIcon } from "../Icons";

const ENGINES = ["GROMACS", "Desmond", "AMBER"];
const BADGES = ["100 ns – 5 µs", "MM/PBSA", "Publication-ready"];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-[4.5rem]">
      {/* Backdrop layers */}
      <div className="absolute inset-0 grid-veil" aria-hidden="true" />
      <TrajectoryField className="absolute inset-0 h-full w-full opacity-70" />
      <div
        className="glow-orb -left-32 top-10 h-[30rem] w-[30rem] animate-drift opacity-60"
        style={{ background: "radial-gradient(circle, #a9cbf7, transparent 68%)" }}
        aria-hidden="true"
      />
      <div
        className="glow-orb right-[-10rem] top-40 h-[34rem] w-[34rem] animate-drift opacity-45 [animation-delay:-8s]"
        style={{ background: "radial-gradient(circle, #a5f3fc, transparent 68%)" }}
        aria-hidden="true"
      />

      <div className="shell relative grid items-center gap-14 py-16 md:py-24 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:py-28">
        <div>
          <div className="chip w-fit">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--helix)] shadow-[0_0_10px_2px_rgba(21,128,61,0.7)]" />
            Accepting new projects
          </div>

          <h1 className="mt-6 font-display text-[clamp(2.3rem,1.1rem+4.1vw,4.1rem)] font-normal leading-[1.04] tracking-[-0.02em] text-[var(--fg)]">
            Turn your docking results into{" "}
            <span className="relative whitespace-nowrap">
              <span className="bg-gradient-to-r from-[var(--accent-ink)] via-[var(--accent)] to-[var(--helix)] bg-clip-text text-transparent">
                publication-ready
              </span>
            </span>{" "}
            molecular dynamics insights
          </h1>

          <p className="lede mt-6">
            GPU-accelerated MD simulations from 100 ns to 5 µs using GROMACS,
            Desmond and AMBER workflows — delivered with the figures, data and
            interpretation your manuscript actually needs.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-2.5">
            {ENGINES.map((e) => (
              <span
                key={e}
                className="rounded-md border border-[rgba(22,104,201,0.28)] bg-[rgba(22,104,201,0.07)] px-3 py-1.5 font-mono text-xs font-medium tracking-wide text-[var(--accent)]"
              >
                {e}
              </span>
            ))}
            <span className="mx-1 hidden h-4 w-px bg-[var(--hairline)] sm:block" />
            {BADGES.map((b) => (
              <span key={b} className="chip">
                {b}
              </span>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#quotation" className="btn btn-primary">
              Request a MD Service
              <span className="h-4 w-4">
                <ArrowIcon />
              </span>
            </a>
            <a href="#sample-report" className="btn btn-ghost">
              <span className="h-4 w-4">
                <DownloadIcon />
              </span>
              View sample report
            </a>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-[var(--hairline)] pt-7">
            {[
              ["5 µs", "Longest single run"],
              ["300–600", "dpi figure output"],
              ["9 days", "Average turnaround"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="font-display text-2xl text-[var(--fg)]">{value}</dt>
                <dd className="mt-1 text-[0.8125rem] leading-snug text-muted">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Protein–ligand animation. Silent, autoplaying, palindrome-looped. */}
        <figure className="relative mx-auto w-full max-w-[36rem] lg:max-w-none">
          <div
            className="glow-orb inset-[14%] opacity-70"
            style={{ background: "radial-gradient(circle, #bfdbfe, transparent 70%)" }}
            aria-hidden="true"
          />
          <div className="panel relative overflow-hidden p-2.5">
            <video
              className="aspect-video w-full rounded-xl bg-[var(--fg)] object-cover"
              poster="/video/md-protein-ligand-poster.webp"
              autoPlay
              muted
              loop
              playsInline
              disablePictureInPicture
              preload="metadata"
              aria-label="Animated illustration of a small-molecule ligand bound in a protein binding pocket, surrounded by water molecules"
            >
              <source src="/video/md-protein-ligand.webm" type="video/webm" />
              <source src="/video/md-protein-ligand.mp4" type="video/mp4" />
            </video>

            <figcaption className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[var(--hairline)] bg-[rgba(255,255,255,0.92)] px-4 py-2 font-mono text-[0.65rem] tracking-[0.14em] text-[var(--accent)] backdrop-blur">
              PROTEIN–LIGAND COMPLEX · SOLVATED · 310 K
            </figcaption>
          </div>
          <p className="mt-3 text-center text-[0.75rem] text-muted">
            Artist&rsquo;s impression for illustration. Your project&rsquo;s
            actual results are shown in the{" "}
            <a
              href="#gallery"
              className="underline decoration-dotted underline-offset-2 transition-colors hover:text-[var(--accent)]"
            >
              figure gallery
            </a>
            .
          </p>
        </figure>
      </div>
    </section>
  );
}
