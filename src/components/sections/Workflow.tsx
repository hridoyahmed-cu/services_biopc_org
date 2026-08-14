import { WORKFLOW } from "@/lib/site";
import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";

export default function Workflow() {
  return (
    <section id="workflow" className="relative overflow-hidden section">

      <div className="shell relative">
        <SectionHeading
          eyebrow="Project workflow"
          title="From coordinates to camera-ready in five stages"
          lede="You are kept in the loop at each handover, equilibration plots before production starts, and a preliminary analysis before the final report is written."
        />

        <ol className="relative section-body grid gap-8 lg:grid-cols-5 lg:gap-5">
          {/* Connecting rail */}
          <span
            className="absolute left-[1.05rem] top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-[var(--accent)] via-[rgba(22,104,201,0.35)] to-transparent lg:left-0 lg:top-[1.05rem] lg:h-px lg:w-full lg:bg-gradient-to-r"
            aria-hidden="true"
          />

          {WORKFLOW.map((s, i) => (
            <Reveal as="li" key={s.step} delay={i * 110} className="relative pl-12 lg:pl-0">
              <span className="absolute left-0 top-0 grid h-[2.1rem] w-[2.1rem] place-items-center rounded-full border border-[rgba(22,104,201,0.45)] bg-[var(--surface)] font-mono text-[0.7rem] font-semibold text-[var(--accent-ink)] shadow-[0_0_0_5px_var(--bg)] lg:relative lg:mb-6">
                {i + 1}
              </span>

              <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted lg:mt-0">
                {s.step}
              </p>
              <h3 className="mt-2 text-[1.05rem] font-semibold tracking-tight text-[var(--fg)]">
                {s.title}
              </h3>
              <p className="mt-1.5 text-[0.8125rem] font-medium text-[var(--accent)]">
                {s.detail}
              </p>
              <p className="mt-3 text-[0.875rem] leading-relaxed text-muted">
                {s.body}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
