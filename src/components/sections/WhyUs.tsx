import { DIFFERENTIATORS, METRICS } from "@/lib/site";
import { DIFF_ICONS } from "../Icons";
import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";

export default function WhyUs() {
  return (
    <section id="why" className="relative py-20 md:py-28">
      <div className="shell">
        <SectionHeading
          eyebrow="Why researchers choose BioPC"
          title="Simulation you can defend in review"
          lede="Every project is run on dedicated hardware, documented end to end, and priced before a single nanosecond is computed."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DIFFERENTIATORS.map((item, i) => {
            const Icon = DIFF_ICONS[item.icon];
            return (
              <Reveal key={item.title} delay={i * 90}>
                <article className="panel panel-hover h-full p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-[rgba(22,104,201,0.25)] bg-[rgba(22,104,201,0.08)] p-2.5 text-[var(--accent)]">
                    <Icon />
                  </span>
                  <h3 className="mt-5 text-[1.0625rem] font-semibold tracking-tight text-[var(--fg)]">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-[0.9rem] leading-relaxed text-muted">
                    {item.body}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={120}>
          <dl className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-[var(--hairline)] bg-[var(--hairline)] sm:grid-cols-2 lg:grid-cols-4">
            {METRICS.map((m) => (
              <div key={m.label} className="bg-[var(--surface)] px-6 py-7">
                <dt className="font-display text-[2.1rem] leading-none text-[var(--fg)]">
                  {m.value}
                </dt>
                <dd className="mt-2.5 text-[0.875rem] font-medium text-[var(--body)]">
                  {m.label}
                </dd>
                <dd className="mt-1 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
                  {m.detail}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
