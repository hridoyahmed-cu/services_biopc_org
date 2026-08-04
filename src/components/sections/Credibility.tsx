import { AFFILIATIONS, PUBLICATIONS, TESTIMONIALS } from "@/lib/site";
import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";

export default function Credibility() {
  return (
    <section id="track-record" className="relative overflow-hidden py-20 md:py-28">
      <div
        className="glow-orb right-0 top-1/3 h-[28rem] w-[28rem] opacity-25"
        style={{ background: "radial-gradient(circle, #a5f3fc, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="shell relative">
        <SectionHeading
          eyebrow="Track record"
          title="Work that has already survived peer review"
          lede="Simulation is only useful if it holds up under a reviewer's scrutiny. These are projects where it did."
        />

        {/* Publications */}
        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          {PUBLICATIONS.map((pub, i) => (
            <Reveal key={pub.title} delay={(i % 2) * 90}>
              <article className="panel panel-hover flex h-full flex-col p-6">
                <div className="flex items-center gap-3">
                  <span className="chip !text-[0.625rem]">{pub.year}</span>
                  <span className="text-[0.8125rem] font-medium italic text-[var(--accent)]">
                    {pub.venue}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-[1.1rem] leading-snug text-[var(--fg)]">
                  {pub.title}
                </h3>
                <p className="mt-auto pt-5 text-[0.8125rem] text-muted">
                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--accent)]">
                    BioPC contribution ·{" "}
                  </span>
                  {pub.contribution}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.author} delay={i * 90}>
              <figure className="panel flex h-full flex-col p-7">
                <span
                  className="font-display text-[3rem] leading-[0.6] text-[rgba(22,104,201,0.35)]"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                <blockquote className="mt-4 flex-1 font-display text-[1.05rem] leading-relaxed text-[var(--fg)]">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 border-t border-[var(--hairline)] pt-4">
                  <span className="block text-[0.8125rem] font-medium text-[var(--fg)]">
                    {t.author}
                  </span>
                  <span className="mt-0.5 block text-[0.8125rem] text-muted">
                    {t.org}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {/* Affiliations marquee */}
        <Reveal delay={120}>
          <div className="mt-14">
            <p className="text-center font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted">
              Researchers we have worked with are based at
            </p>
            <div className="mask-fade-x mt-6 flex overflow-hidden">
              <ul className="flex shrink-0 animate-marquee items-center gap-12 pr-12">
                {[...AFFILIATIONS, ...AFFILIATIONS].map((a, i) => (
                  <li
                    key={`${a}-${i}`}
                    className="whitespace-nowrap text-[0.9375rem] font-medium text-[var(--muted)]"
                    aria-hidden={i >= AFFILIATIONS.length}
                  >
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
