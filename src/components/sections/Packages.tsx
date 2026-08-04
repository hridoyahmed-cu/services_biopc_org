import { PACKAGES } from "@/lib/site";
import { ArrowIcon } from "../Icons";
import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";

export default function Packages() {
  return (
    <section id="packages" className="relative py-20 md:py-28">
      <div className="shell">
        <SectionHeading
          eyebrow="Simulation packages"
          title="Pick the timescale your question deserves"
          lede="Cost scales with system size and simulation length, so we quote per project rather than per page. These are the four configurations researchers ask for most."
        />

        {/* Desktop: table. Mobile: stacked cards. Same data, one source. */}
        <Reveal delay={80}>
          <div className="mt-14 hidden overflow-hidden rounded-2xl border border-[var(--hairline)] md:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[var(--surface-2)]">
                  {["Package", "Best for", "Typical output", ""].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="px-6 py-4 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-[var(--accent)]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PACKAGES.map((p) => (
                  <tr
                    key={p.length}
                    className={`border-t border-[var(--hairline)] transition-colors hover:bg-[var(--surface-2)] ${
                      p.accent ? "bg-[rgba(22,104,201,0.045)]" : ""
                    }`}
                  >
                    <th scope="row" className="px-6 py-6 align-top">
                      <span className="font-display text-[1.5rem] font-normal text-[var(--fg)]">
                        {p.length}
                      </span>
                      {p.accent && (
                        <span className="ml-2.5 rounded-full border border-[rgba(22,104,201,0.4)] bg-[rgba(22,104,201,0.1)] px-2 py-0.5 align-middle font-mono text-[0.6rem] uppercase tracking-[0.12em] text-[var(--accent-ink)]">
                          Most requested
                        </span>
                      )}
                    </th>
                    <td className="px-6 py-6 align-top text-[0.9375rem] text-[var(--body)]">
                      {p.bestFor}
                    </td>
                    <td className="px-6 py-6 align-top">
                      <span className="block text-[0.9375rem] text-[var(--body)]">
                        {p.output}
                      </span>
                      <span className="mt-1.5 block max-w-md text-[0.8125rem] leading-snug text-muted">
                        {p.note}
                      </span>
                    </td>
                    <td className="px-6 py-6 align-top">
                      <a
                        href="#quotation"
                        className="inline-flex items-center gap-1.5 whitespace-nowrap text-[0.875rem] font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-ink)]"
                      >
                        Quote
                        <span className="h-3.5 w-3.5">
                          <ArrowIcon />
                        </span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 md:hidden">
          {PACKAGES.map((p, i) => (
            <Reveal key={p.length} delay={i * 80}>
              <article
                className={`panel p-6 ${
                  p.accent ? "border-[rgba(22,104,201,0.4)]" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-display text-[1.6rem] text-[var(--fg)]">
                    {p.length}
                  </span>
                  {p.accent && (
                    <span className="rounded-full border border-[rgba(22,104,201,0.4)] bg-[rgba(22,104,201,0.1)] px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-[var(--accent-ink)]">
                      Most requested
                    </span>
                  )}
                </div>
                <dl className="mt-4 space-y-3 text-[0.875rem]">
                  <div>
                    <dt className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
                      Best for
                    </dt>
                    <dd className="mt-1 text-[var(--body)]">{p.bestFor}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
                      Typical output
                    </dt>
                    <dd className="mt-1 text-[var(--body)]">{p.output}</dd>
                    <dd className="mt-1 text-[0.8125rem] leading-snug text-muted">
                      {p.note}
                    </dd>
                  </div>
                </dl>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={140}>
          <div className="mt-8 flex flex-col items-center gap-4 text-center">
            <a href="#quotation" className="btn btn-primary">
              Get an exact quotation
              <span className="h-4 w-4">
                <ArrowIcon />
              </span>
            </a>
            <p className="text-[0.8125rem] text-muted">
              Student and multi-system rates available. Replicate runs quoted
              separately.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
