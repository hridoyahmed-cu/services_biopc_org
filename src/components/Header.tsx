"use client";

import { useEffect, useState } from "react";
import { NAV, SITE } from "@/lib/site";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[var(--hairline)] bg-[rgba(5,12,28,0.82)] backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="shell flex h-[4.5rem] items-center justify-between gap-6">
        <a href="#top" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-[#3aa0ff] to-[#1b4fae] text-[13px] font-bold tracking-tight text-white shadow-lg shadow-[#1b4fae]/30">
            BP
          </span>
          <span className="leading-tight">
            <span className="block text-[0.95rem] font-semibold tracking-tight text-white">
              BioPC
            </span>
            <span className="block font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted">
              MD Simulation Service
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[0.875rem] text-[#c3d8f4] transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href="#quotation" className="btn btn-primary hidden sm:inline-flex">
            Request a quotation
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--hairline)] text-white lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
              {open ? (
                <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[var(--hairline)] bg-[rgba(5,12,28,0.98)] backdrop-blur-xl lg:hidden">
          <nav className="shell flex flex-col py-4">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-[var(--hairline)] py-3.5 text-[0.95rem] text-[#dce9fb] last:border-0"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#quotation"
              onClick={() => setOpen(false)}
              className="btn btn-primary mt-4 w-full"
            >
              Request a quotation
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-3 text-center font-mono text-xs text-muted"
            >
              {SITE.email}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
