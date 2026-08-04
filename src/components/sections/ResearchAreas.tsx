import { RESEARCH_AREAS } from "@/lib/site";
import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";

export default function ResearchAreas() {
  return (
    <section id="research-areas" className="relative py-20 md:py-28">
      <div className="shell">
        <SectionHeading
          eyebrow="Research areas we support"
          title="Ten domains, one simulation discipline"
          lede="The methodology transfers; the interpretation does not. Tell us the biology and we will match the protocol to the question rather than the other way round."
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-[var(--hairline)] bg-[var(--hairline)] sm:grid-cols-2 lg:grid-cols-5">
          {RESEARCH_AREAS.map((area, i) => (
            <Reveal key={area.title} delay={(i % 5) * 70}>
              <article className="group h-full bg-[#071228] p-6 transition-colors hover:bg-[#0c1c38]">
                <span className="block h-px w-8 bg-[#38bdf8] transition-all duration-500 group-hover:w-14" />
                <h3 className="mt-4 text-[0.9375rem] font-semibold leading-snug tracking-tight text-white">
                  {area.title}
                </h3>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">
                  {area.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
