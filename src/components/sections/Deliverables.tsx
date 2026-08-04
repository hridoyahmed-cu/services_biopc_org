import { DELIVERABLES } from "@/lib/site";
import { CheckIcon, DownloadIcon } from "../Icons";
import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";

export default function Deliverables() {
  return (
    <section id="deliverables" className="relative py-20 md:py-28">
      <div className="shell">
        <SectionHeading
          eyebrow="What you receive"
          title="Concrete deliverables, not a slide deck"
          lede="Everything below ships with every completed project. If a journal asks for something else, we prepare it before you have to ask."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
          <Reveal>
            <ul className="grid gap-px overflow-hidden rounded-2xl border border-[var(--hairline)] bg-[var(--hairline)] sm:grid-cols-2">
              {DELIVERABLES.map((d) => (
                <li
                  key={d.title}
                  className="flex items-start gap-3 bg-[var(--surface)] px-5 py-4.5 transition-colors hover:bg-[var(--surface-2)]"
                >
                  <span className="mt-0.5 h-4 w-4 shrink-0 text-[var(--helix)]">
                    <CheckIcon />
                  </span>
                  <span>
                    <span className="block text-[0.9rem] font-medium text-[var(--fg)]">
                      {d.title}
                    </span>
                    <span className="mt-0.5 block text-[0.8125rem] leading-snug text-muted">
                      {d.detail}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Sample report download */}
          <Reveal delay={120} className="lg:sticky lg:top-28 lg:self-start">
            <div
              id="sample-report"
              className="panel relative overflow-hidden p-8 scroll-mt-28"
            >
              <div
                className="glow-orb -right-16 -top-16 h-56 w-56 opacity-60"
                style={{
                  background: "radial-gradient(circle, #93c5fd, transparent 70%)",
                }}
                aria-hidden="true"
              />
              <div className="relative">
                <p className="eyebrow">Sample report</p>
                <h3 className="mt-3 font-display text-[1.7rem] leading-tight text-[var(--fg)]">
                  See exactly what lands in your inbox
                </h3>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">
                  A real 500 ns protein–protein project, redacted and reformatted:
                  the full stability panel, interaction profiling, essential
                  dynamics and MM/PBSA decomposition, with the interpretation
                  text we would write for your manuscript.
                </p>

                <ul className="mt-6 space-y-2 font-mono text-[0.75rem] tracking-wide text-[var(--accent)]">
                  <li>· 14 publication-grade figures</li>
                  <li>· Convergence &amp; statistics appendix</li>
                  <li>· Draft figure legends</li>
                  <li>· PDF · A4 · ~2 MB</li>
                </ul>

                <a
                  href="/BioPC-Sample-MD-Report.pdf"
                  download
                  className="btn btn-primary mt-7 w-full"
                >
                  <span className="h-4 w-4">
                    <DownloadIcon />
                  </span>
                  Download the sample report
                </a>
                <p className="mt-3 text-center text-[0.75rem] text-muted">
                  No email required.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
