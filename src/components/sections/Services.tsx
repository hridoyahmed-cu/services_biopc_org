import { SERVICES } from "@/lib/site";
import { ArrowIcon, CheckIcon } from "../Icons";
import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";

export default function Services() {
  return (
    <section id="services" className="relative section">
      <div
        className="glow-orb left-1/2 top-0 h-[26rem] w-[26rem] -translate-x-1/2 opacity-30"
        style={{ background: "radial-gradient(circle, #93c5fd, transparent 70%)" }}
        aria-hidden="true"
      />
      <div className="shell relative">
        <SectionHeading
          eyebrow="Services"
          title="Six stages, one continuous pipeline"
          lede="Commission the whole workflow or any single stage. Systems already equilibrated elsewhere are welcome, we will validate them before production."
        />

        <div className="section-body grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <Reveal key={service.id} delay={(i % 3) * 90}>
              <article className="panel panel-hover group flex h-full flex-col p-7">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-[0.7rem] tracking-[0.2em] text-[var(--accent)]">
                    {service.number}
                  </span>
                  <span className="h-px flex-1 bg-[var(--hairline)] transition-colors group-hover:bg-[rgba(22,104,201,0.4)]" />
                </div>

                <h3 className="mt-5 font-display text-[1.4rem] leading-tight text-[var(--fg)]">
                  {service.title}
                </h3>
                <p className="mt-2.5 text-[0.875rem] leading-relaxed text-muted">
                  {service.summary}
                </p>

                <ul className="mt-6 space-y-2.5 border-t border-[var(--hairline)] pt-6">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-0.5 h-4 w-4 shrink-0 text-[var(--helix)]">
                        <CheckIcon />
                      </span>
                      <span className="text-[0.875rem] leading-snug text-[var(--body)]">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="panel mt-[var(--block-gap)] flex flex-col items-start justify-between gap-6 p-7 sm:flex-row sm:items-center">
            <p className="text-[0.9375rem] text-[var(--body)]">
              Not sure which stages your project needs?{" "}
              <span className="text-muted">
                Send the structure and your research question, we will scope it
                for you.
              </span>
            </p>
            <a href="#quotation" className="btn btn-primary shrink-0">
              Get an exact quotation
              <span className="h-4 w-4">
                <ArrowIcon />
              </span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
