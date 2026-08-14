import TrajectoryField from "../TrajectoryField";
import { ArrowIcon, DownloadIcon } from "../Icons";

const ENGINES = ["GROMACS", "Desmond", "AMBER"];
const BADGES = ["100 ns to 5 µs", "MM/PBSA", "Publication-ready"];

const STATS = [
  ["5 µs", "Longest single run"],
  ["300-600", "dpi figure output"],
  ["3 days", "Average turnaround"],
  ["180+", "Projects delivered"],
];

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

      {/* Two columns on desktop: copy left, reel right. The reel stays 16:9 and
          uncropped (it carries on-screen titles and a URL), so the stats sit
          under it to bring the two columns to a comparable height. Below xl the
          columns stack, because a narrower text column pushes the headline to
          five lines. */}
      <div className="shell relative grid items-start gap-10 pt-12 md:pt-16 xl:grid-cols-[1fr_1fr] xl:gap-12">
        <div className="max-w-3xl xl:max-w-none">
          <div className="chip w-fit">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--helix)] shadow-[0_0_10px_2px_rgba(21,128,61,0.7)]" />
            Accepting new projects
          </div>

          <h1 className="mt-5 font-display text-[clamp(2.1rem,1.5rem+1.9vw,3rem)] font-normal leading-[1.08] tracking-[-0.02em] text-[var(--fg)]">
            Turn your docking results into{" "}
            <span className="bg-gradient-to-r from-[var(--accent-ink)] via-[var(--accent)] to-[var(--helix)] bg-clip-text text-transparent">
              publication-ready
            </span>{" "}
            molecular dynamics insights
          </h1>

          <p className="lede mt-5 text-justify hyphens-auto">
            GPU-accelerated MD simulations from 100 ns to 5 µs using GROMACS,
            Desmond and AMBER workflows, delivered with the figures, data and
            interpretation your manuscript actually needs.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
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

          <div className="mt-7 flex flex-wrap gap-3">
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
        </div>

        {/* Service reel, shown uncropped at 16:9 and looping continuously. */}
        <div className="mt-2 xl:mt-0">
          <figure>
            <div className="panel overflow-hidden p-2 md:p-2.5">
            <video
              className="aspect-video w-full rounded-xl bg-[var(--fg)] object-cover"
              poster="/video/biopc-md-reel-poster.webp"
              autoPlay
              muted
              loop
              playsInline
              disablePictureInPicture
              preload="metadata"
              aria-label="BioPC molecular dynamics simulation service overview reel"
            >
              <source src="/video/biopc-md-reel.webm" type="video/webm" />
              <source src="/video/biopc-md-reel.mp4" type="video/mp4" />
            </video>
            </div>
            <figcaption className="mt-3 text-center text-[0.75rem] text-muted">
              Service overview reel. Molecular renderings are illustrative, your
              project&rsquo;s actual results are shown in the{" "}
              <a
                href="#gallery"
                className="underline decoration-dotted underline-offset-2 transition-colors hover:text-[var(--accent)]"
              >
                figure gallery
              </a>
              .
            </figcaption>
          </figure>

          {/* Stats live under the reel so the media column reaches a height
              comparable to the copy column beside it. */}
          <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-[var(--hairline)] pt-6 sm:grid-cols-4 xl:grid-cols-2">
            {STATS.map(([value, label]) => (
              <div key={label}>
                <dt className="font-display text-2xl text-[var(--fg)]">
                  {value}
                </dt>
                <dd className="mt-1 text-[0.8125rem] leading-snug text-muted">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="pb-14 md:pb-20" />
    </section>
  );
}
