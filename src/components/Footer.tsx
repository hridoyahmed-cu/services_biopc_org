import { NAV, SITE, whatsappLink } from "@/lib/site";
import { FacebookIcon, GlobeIcon, MailIcon, PhoneIcon, WhatsAppIcon } from "./Icons";

const YEAR = 2026;

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-[var(--hairline)] bg-[var(--surface-2)]">
      <div
        className="glow-orb -top-24 left-1/4 h-72 w-72 opacity-40"
        style={{ background: "radial-gradient(circle, #93c5fd, transparent 70%)" }}
      />
      <div className="shell relative grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo.webp"
              alt="BioPC"
              width={48}
              height={48}
              className="h-12 w-12 shrink-0 rounded-full"
            />
            <div>
              <p className="font-semibold tracking-tight text-[var(--fg)]">BioPC</p>
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted">
                MD Simulation Service
              </p>
            </div>
          </div>
          <p className="lede mt-5 max-w-sm text-[0.9375rem]">
            GPU-accelerated molecular dynamics for research groups, thesis
            students and drug discovery teams, from system setup through to
            manuscript-ready figures.
          </p>
          <p className="mt-5 font-display text-lg italic text-[var(--body)]">
            {SITE.tagline}
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="eyebrow">Explore</h2>
          <ul className="mt-4 space-y-2.5">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-[0.9375rem] text-[var(--body)] transition-colors hover:text-[var(--accent-ink)]"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#quotation"
                className="text-[0.9375rem] text-[var(--body)] transition-colors hover:text-[var(--accent-ink)]"
              >
                Request a MD Service
              </a>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow">Contact</h2>
          <ul className="mt-4 space-y-3.5 text-[0.9375rem]">
            <li>
              <a
                href={`tel:${SITE.phoneHref}`}
                className="group flex items-center gap-3 text-[var(--body)] transition-colors hover:text-[var(--accent-ink)]"
              >
                <span className="h-4 w-4 shrink-0 text-[var(--accent)]">
                  <PhoneIcon />
                </span>
                {SITE.phone}
              </a>
            </li>
            <li>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-[var(--body)] transition-colors hover:text-[var(--accent-ink)]"
              >
                <span className="h-4 w-4 shrink-0 text-[#25D366]">
                  <WhatsAppIcon />
                </span>
                {SITE.whatsapp}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="group flex items-center gap-3 break-all text-[var(--body)] transition-colors hover:text-[var(--accent-ink)]"
              >
                <span className="h-4 w-4 shrink-0 text-[var(--accent)]">
                  <MailIcon />
                </span>
                {SITE.email}
              </a>
            </li>
            <li>
              <a
                href={SITE.url}
                className="group flex items-center gap-3 text-[var(--body)] transition-colors hover:text-[var(--accent-ink)]"
              >
                <span className="h-4 w-4 shrink-0 text-[var(--accent)]">
                  <GlobeIcon />
                </span>
                services.biopc.org
              </a>
            </li>
            <li>
              <a
                href={SITE.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-[var(--body)] transition-colors hover:text-[var(--accent-ink)]"
              >
                <span className="h-4 w-4 shrink-0 text-[var(--accent)]">
                  <FacebookIcon />
                </span>
                BioPC Lab
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="shell flex flex-col gap-2 border-t border-[var(--hairline)] py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {YEAR} BioPC. All rights reserved.</p>
        <p className="font-mono tracking-wide">
          GROMACS · Desmond · AMBER · CHARMM · OPLS
        </p>
      </div>
    </footer>
  );
}
