import { FAQ, SITE, whatsappLink } from "@/lib/site";
import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";

export default function Faq() {
  return (
    <section id="faq" className="relative section">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow="FAQ"
              title="Frequently asked questions"
              lede="The questions researchers actually send us before commissioning a project."
            />
            <Reveal delay={100}>
              <div className="panel mt-[var(--heading-gap)] p-6">
                <p className="text-[0.9375rem] text-[var(--body)]">
                  Still unsure whether MD is the right tool for your question?
                </p>
                <a
                  href={whatsappLink(
                    "Hello BioPC, I have a question about whether MD simulation suits my project.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost mt-4 w-full"
                >
                  Ask on WhatsApp
                </a>
                <a
                  href={`mailto:${SITE.email}`}
                  className="mt-3 block text-center font-mono text-[0.7rem] tracking-wide text-muted transition-colors hover:text-[var(--accent)]"
                >
                  {SITE.email}
                </a>
              </div>
            </Reveal>
          </div>

          <div className="divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
            {FAQ.map((item, i) => (
              <Reveal key={item.q} delay={Math.min(i, 4) * 70}>
                <details className="group py-5 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-start justify-between gap-6 list-none">
                    <h3 className="text-[1.0625rem] font-medium leading-snug tracking-tight text-[var(--fg)] transition-colors group-hover:text-[var(--accent)]">
                      {item.q}
                    </h3>
                    <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[var(--hairline)] text-[var(--accent)] transition-transform duration-300 group-open:rotate-45">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-3.5 max-w-2xl pr-10 text-[0.9375rem] leading-relaxed text-muted">
                    {item.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
