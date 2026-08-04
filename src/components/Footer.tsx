import { NAV, SITE, whatsappLink } from "@/lib/site";
import { FacebookIcon, GlobeIcon, MailIcon, PhoneIcon, WhatsAppIcon } from "./Icons";

const YEAR = 2026;

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-[var(--hairline)] bg-[#03070f]">
      <div
        className="glow-orb -top-24 left-1/4 h-72 w-72 opacity-40"
        style={{ background: "radial-gradient(circle, #1d4ed8, transparent 70%)" }}
      />
      <div className="shell relative grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-[#3aa0ff] to-[#1b4fae] text-sm font-bold text-white">
              BP
            </span>
            <div>
              <p className="font-semibold tracking-tight text-white">BioPC</p>
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted">
                MD Simulation Service
              </p>
            </div>
          </div>
          <p className="lede mt-5 max-w-sm text-[0.9375rem]">
            GPU-accelerated molecular dynamics for research groups, thesis
            students and drug discovery teams — from system setup through to
            manuscript-ready figures.
          </p>
          <p className="mt-5 font-display text-lg italic text-[#a9cdf5]">
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
                  className="text-[0.9375rem] text-[#c3d8f4] transition-colors hover:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#quotation"
                className="text-[0.9375rem] text-[#c3d8f4] transition-colors hover:text-white"
              >
                Request a quotation
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
                className="group flex items-center gap-3 text-[#c3d8f4] transition-colors hover:text-white"
              >
                <span className="h-4 w-4 shrink-0 text-[#38bdf8]">
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
                className="group flex items-center gap-3 text-[#c3d8f4] transition-colors hover:text-white"
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
                className="group flex items-center gap-3 break-all text-[#c3d8f4] transition-colors hover:text-white"
              >
                <span className="h-4 w-4 shrink-0 text-[#38bdf8]">
                  <MailIcon />
                </span>
                {SITE.email}
              </a>
            </li>
            <li>
              <a
                href={SITE.url}
                className="group flex items-center gap-3 text-[#c3d8f4] transition-colors hover:text-white"
              >
                <span className="h-4 w-4 shrink-0 text-[#38bdf8]">
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
                className="group flex items-center gap-3 text-[#c3d8f4] transition-colors hover:text-white"
              >
                <span className="h-4 w-4 shrink-0 text-[#38bdf8]">
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
