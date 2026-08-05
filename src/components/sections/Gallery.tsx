"use client";

import { useCallback, useEffect, useState } from "react";
import { FIGURE_DISCLAIMER, GALLERY, GALLERY_CATEGORIES } from "@/lib/site";
import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";

type Figure = (typeof GALLERY)[number];

export default function Gallery() {
  const [filter, setFilter] = useState<string>("All");
  const [active, setActive] = useState<Figure | null>(null);

  const visible =
    filter === "All" ? GALLERY : GALLERY.filter((f) => f.category === filter);

  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const i = visible.findIndex((f) => f.slug === active.slug);
        const next =
          e.key === "ArrowRight"
            ? (i + 1) % visible.length
            : (i - 1 + visible.length) % visible.length;
        setActive(visible[next]);
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, visible, close]);

  return (
    <section id="gallery" className="relative section">
      <div className="shell">
        <SectionHeading
          eyebrow="Sample results gallery"
          title="Figures from real completed projects"
          lede="Every plot below came out of a delivered BioPC project and is shown at the resolution and styling you would receive. Click any figure to enlarge."
        />

        <Reveal delay={80}>
          <div className="section-body flex flex-wrap gap-2">
            {GALLERY_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFilter(c)}
                aria-pressed={filter === c}
                className={`rounded-full border px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] transition-all ${
                  filter === c
                    ? "border-[var(--accent)] bg-[var(--accent)] text-[#fff]"
                    : "border-[var(--hairline)] text-muted hover:border-[rgba(22,104,201,0.35)] hover:text-[var(--body)]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-[var(--block-gap)] grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((fig, i) => (
            <Reveal key={fig.slug} delay={(i % 3) * 80}>
              <button
                type="button"
                onClick={() => setActive(fig)}
                className="panel panel-hover group block h-full w-full overflow-hidden p-3 text-left"
              >
                <span className="paper block">
                  {/* Static export: plain img keeps the build dependency-free */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/figures/${fig.slug}-thumb.webp`}
                    alt={fig.title}
                    loading="lazy"
                    decoding="async"
                    className="h-52 w-full object-contain p-2 transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </span>
                <span className="mt-4 flex items-center justify-between gap-3 px-1">
                  <span className="text-[0.9375rem] font-medium text-[var(--fg)]">
                    {fig.title}
                  </span>
                  <span className="chip shrink-0 !text-[0.625rem]">
                    {fig.category}
                  </span>
                </span>
                <span className="mt-2 block px-1 pb-1 text-[0.8125rem] leading-snug text-muted">
                  {fig.caption}
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal delay={80}>
          <p
            role="note"
            className="mt-[var(--block-gap)] rounded-xl border border-[rgba(194,65,12,0.3)] bg-[rgba(194,65,12,0.05)] px-5 py-4 text-[0.8125rem] leading-relaxed text-[var(--ember)]"
          >
            <strong className="font-semibold">Disclaimer.</strong>{" "}
            {FIGURE_DISCLAIMER}
          </p>
        </Reveal>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(11,31,61,0.62)] p-4 backdrop-blur-md sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          onClick={close}
        >
          <div
            className="flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[var(--hairline)] bg-[var(--surface)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[var(--hairline)] px-6 py-4">
              <div>
                <h3 className="font-display text-[1.3rem] leading-tight text-[var(--fg)]">
                  {active.title}
                </h3>
                <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[var(--accent)]">
                  {active.category}
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close figure"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[var(--hairline)] text-muted transition-colors hover:text-[var(--accent-ink)]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="paper m-4 overflow-auto rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/figures/${active.slug}.webp`}
                alt={active.caption}
                className="mx-auto max-h-[62vh] w-auto max-w-full object-contain p-3"
              />
            </div>

            <p className="border-t border-[var(--hairline)] px-6 py-4 text-[0.875rem] leading-relaxed text-muted">
              {active.caption}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
