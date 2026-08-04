import ProteinScene from "../ProteinScene";
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
        style={{ background: "radial-gradient(circle, #1e50c8, transparent 68%)" }}
        aria-hidden="true"
      />
      <div
        className="glow-orb right-[-10rem] top-40 h-[34rem] w-[34rem] animate-drift opacity-45 [animation-delay:-8s]"
        style={{ background: "radial-gradient(circle, #0e7490, transparent 68%)" }}
        aria-hidden="true"
      />

      <div className="shell relative grid items-center gap-14 py-16 md:py-24 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:py-28">
        <div>
          <div className="chip w-fit">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4ade9a] shadow-[0_0_10px_2px_rgba(74,222,154,0.7)]" />
            Accepting new projects
          </div>

          <h1 className="mt-6 font-display text-[clamp(2.3rem,1.1rem+4.1vw,4.1rem)] font-normal leading-[1.04] tracking-[-0.02em] text-white">
            Turn your docking results into{" "}
            <span className="relative whitespace-nowrap">
              <span className="bg-gradient-to-r from-[#7dd3fc] via-[#38bdf8] to-[#4ade9a] bg-clip-text text-transparent">
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
                className="rounded-md border border-[rgba(56,189,248,0.28)] bg-[rgba(56,189,248,0.07)] px-3 py-1.5 font-mono text-xs font-medium tracking-wide text-[#9fd5fb]"
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
              Request a quotation
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
                <dt className="font-display text-2xl text-white">{value}</dt>
                <dd className="mt-1 text-[0.8125rem] leading-snug text-muted">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* 3D molecular visualisation */}
        <div className="relative mx-auto aspect-square w-full max-w-[34rem] lg:max-w-none">
          <div
            className="absolute inset-[12%] rounded-full border border-[rgba(56,189,248,0.14)]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-[24%] rounded-full border border-[rgba(56,189,248,0.1)]"
            aria-hidden="true"
          />
          <div
            className="glow-orb inset-[18%] opacity-70"
            style={{ background: "radial-gradient(circle, #0b4a8f, transparent 70%)" }}
            aria-hidden="true"
          />
          <ProteinScene className="relative h-full w-full" />

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-[var(--hairline)] bg-[rgba(5,12,28,0.72)] px-4 py-2 font-mono text-[0.65rem] tracking-[0.14em] text-[#9fd5fb] backdrop-blur">
            PROTEIN–LIGAND COMPLEX · 310 K · NPT
          </div>
        </div>
      </div>
    </section>
  );
}
