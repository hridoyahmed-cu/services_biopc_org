"use client";

import { useRef, useState } from "react";
import {
  ANALYSIS_OPTIONS,
  SIM_LENGTHS,
  SITE,
  whatsappLink,
} from "@/lib/site";
import { ArrowIcon, FacebookIcon, GlobeIcon, MailIcon, PhoneIcon, WhatsAppIcon } from "../Icons";
import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";

/**
 * Submissions POST to a Google Apps Script web app (same pattern as the other
 * BioPC sites) because the site is a static export with no server runtime.
 * Set NEXT_PUBLIC_QUOTE_ENDPOINT at build time; without it the form degrades
 * to a pre-filled email so an unconfigured deploy still converts.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_QUOTE_ENDPOINT ?? "";
const MAX_FILE_BYTES = 8 * 1024 * 1024;

type Status = "idle" | "sending" | "sent" | "error";

const readAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = () => reject(fr.error);
    fr.readAsDataURL(file);
  });

export default function Quotation() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  const buildSummary = (data: FormData) => {
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const analyses = data.getAll("analysis").join(", ");
    return [
      `Name: ${get("name")}`,
      `Institution: ${get("institution")}`,
      `Email: ${get("email")}`,
      `WhatsApp: ${get("whatsapp")}`,
      `Protein (PDB ID / description): ${get("pdb")}`,
      `Simulation length: ${get("length")}`,
      `Analysis required: ${analyses || "(none)"}`,
      `Manuscript deadline: ${get("deadline") || "(none)"}`,
      `Notes: ${get("notes") || "(none)"}`,
    ].join("\n");
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const files: { name: string; type: string; content: string }[] = [];
    for (const key of ["proteinFile", "ligandFile"]) {
      const f = data.get(key);
      if (f instanceof File && f.size > 0) {
        if (f.size > MAX_FILE_BYTES) {
          setStatus("error");
          setError(
            `${f.name} is larger than 8 MB. Please email it to ${SITE.email} instead.`,
          );
          return;
        }
        files.push({
          name: f.name,
          type: f.type || "application/octet-stream",
          content: await readAsDataUrl(f),
        });
      }
    }

    setStatus("sending");
    setError("");

    const payload = {
      form: "md-quotation",
      submittedAt: new Date().toISOString(),
      name: data.get("name"),
      institution: data.get("institution"),
      email: data.get("email"),
      whatsapp: data.get("whatsapp"),
      pdb: data.get("pdb"),
      length: data.get("length"),
      analysis: data.getAll("analysis"),
      deadline: data.get("deadline"),
      notes: data.get("notes"),
      files,
      pageUrl: typeof window !== "undefined" ? window.location.href : SITE.url,
    };

    if (!ENDPOINT) {
      // No backend configured, hand off to the user's mail client.
      const body = encodeURIComponent(
        `${buildSummary(data)}\n\n(Please attach your structure files to this email.)`,
      );
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
        "MD simulation quotation request",
      )}&body=${body}`;
      setStatus("sent");
      form.reset();
      return;
    }

    try {
      await fetch(ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
      setError(
        `We could not submit the form. Please WhatsApp ${SITE.whatsapp} or email ${SITE.email}.`,
      );
    }
  };

  /**
   * Built on click, not on render, otherwise the href is captured while the
   * form is still empty and the user sends us a blank summary.
   */
  const onWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const form = formRef.current;
    if (!form) return; // fall through to the plain href
    e.preventDefault();
    const url = whatsappLink(
      `Hello BioPC, I would like a quotation for an MD simulation project.\n\n${buildSummary(
        new FormData(form),
      )}`,
    );
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="quotation" className="relative overflow-hidden section">
      <div
        className="glow-orb left-1/4 top-0 h-[30rem] w-[30rem] opacity-35"
        style={{ background: "radial-gradient(circle, #93c5fd, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="shell relative">
        <SectionHeading
          eyebrow="Request a MD Service"
          title="Tell us about your system"
          lede="Send what you have, even just a PDB ID and a research question is enough to start. You will receive a written quotation with a simulation plan and a realistic timeline, usually within one working day."

        />

        <div className="section-body grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* ── Form ────────────────────────────────────────────────────── */}
          <Reveal>
            <div className="panel p-6 sm:p-8">
              {status === "sent" ? (
                <div className="flex min-h-[28rem] flex-col items-center justify-center text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full border border-[rgba(21,128,61,0.4)] bg-[rgba(21,128,61,0.1)] text-[var(--helix)]">
                    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.75">
                      <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <h3 className="mt-6 font-display text-[1.6rem] text-[var(--fg)]">
                    Request received
                  </h3>
                  <p className="lede mt-3 text-center text-[0.9375rem]">
                    We will review your system and reply with a quotation and a
                    proposed simulation plan, usually within one working day.
                    Urgent deadline? Message us on WhatsApp and we will
                    prioritise it.
                  </p>
                  <div className="mt-7 flex flex-wrap justify-center gap-3">
                    <a
                      href={whatsappLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      <span className="h-4 w-4">
                        <WhatsAppIcon />
                      </span>
                      Message on WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      className="btn btn-ghost"
                    >
                      Submit another project
                    </button>
                  </div>
                </div>
              ) : (
                <form ref={formRef} onSubmit={onSubmit} noValidate={false}>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="label" htmlFor="q-name">
                        Name <span className="text-[var(--ember)]">*</span>
                      </label>
                      <input id="q-name" name="name" required className="field" placeholder="Dr. Jane Doe" autoComplete="name" />
                    </div>
                    <div>
                      <label className="label" htmlFor="q-institution">
                        Institution
                      </label>
                      <input id="q-institution" name="institution" className="field" placeholder="University / company" autoComplete="organization" />
                    </div>
                    <div>
                      <label className="label" htmlFor="q-email">
                        Email <span className="text-[var(--ember)]">*</span>
                      </label>
                      <input id="q-email" name="email" type="email" required className="field" placeholder="you@university.edu" autoComplete="email" />
                    </div>
                    <div>
                      <label className="label" htmlFor="q-whatsapp">
                        WhatsApp
                      </label>
                      <input id="q-whatsapp" name="whatsapp" type="tel" className="field" placeholder="+880 1XXX-XXXXXX" autoComplete="tel" />
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className="label" htmlFor="q-pdb">
                      Protein PDB ID or description
                    </label>
                    <input id="q-pdb" name="pdb" className="field" placeholder="e.g. 4G8A, or a modelled structure you will attach" />
                  </div>

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="label" htmlFor="q-protein-file">
                        Protein file (.pdb)
                      </label>
                      <input
                        id="q-protein-file"
                        name="proteinFile"
                        type="file"
                        accept=".pdb,.cif,.ent,.gro"
                        className="field file:mr-3 file:rounded-md file:border-0 file:bg-[rgba(22,104,201,0.14)] file:px-3 file:py-1.5 file:text-[0.8125rem] file:font-medium file:text-[var(--accent)] hover:file:bg-[rgba(22,104,201,0.22)]"
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="q-ligand-file">
                        Ligand file (.mol2, .sdf, .pdbqt)
                      </label>
                      <input
                        id="q-ligand-file"
                        name="ligandFile"
                        type="file"
                        accept=".mol2,.sdf,.pdbqt,.pdb,.mol,.smi"
                        className="field file:mr-3 file:rounded-md file:border-0 file:bg-[rgba(22,104,201,0.14)] file:px-3 file:py-1.5 file:text-[0.8125rem] file:font-medium file:text-[var(--accent)] hover:file:bg-[rgba(22,104,201,0.22)]"
                      />
                    </div>
                  </div>
                  <p className="mt-2 text-[0.75rem] text-muted">
                    Up to 8 MB per file. Larger systems or multi-ligand series -
                    email them to {SITE.email}.
                  </p>

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="label" htmlFor="q-length">
                        Desired simulation length
                      </label>
                      <select id="q-length" name="length" className="field" defaultValue="">
                        <option value="" disabled>
                          Select a timescale
                        </option>
                        {SIM_LENGTHS.map((l) => (
                          <option key={l} value={l} className="bg-[var(--surface)]">
                            {l}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label" htmlFor="q-deadline">
                        Manuscript deadline
                      </label>
                      <input id="q-deadline" name="deadline" type="date" className="field" />
                    </div>
                  </div>

                  <fieldset className="mt-6">
                    <legend className="label">Analysis required</legend>
                    <div className="mt-1 grid gap-2 sm:grid-cols-2">
                      {ANALYSIS_OPTIONS.map((opt) => (
                        <label
                          key={opt}
                          className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-[var(--hairline)] bg-[var(--surface)] px-3 py-2.5 text-[0.8125rem] text-[var(--body)] transition-colors hover:border-[rgba(22,104,201,0.4)]"
                        >
                          <input
                            type="checkbox"
                            name="analysis"
                            value={opt}
                            className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]"
                          />
                          <span className="leading-snug">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div className="mt-5">
                    <label className="label" htmlFor="q-notes">
                      Additional notes
                    </label>
                    <textarea
                      id="q-notes"
                      name="notes"
                      rows={4}
                      className="field resize-y"
                      placeholder="Docking software used, binding site residues, replicate requirements, NDA needs, target journal…"
                    />
                  </div>

                  {status === "error" && (
                    <p
                      role="alert"
                      className="mt-5 rounded-lg border border-[rgba(194,65,12,0.4)] bg-[rgba(194,65,12,0.08)] px-4 py-3 text-[0.875rem] text-[var(--ember)]"
                    >
                      {error}
                    </p>
                  )}

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="btn btn-primary flex-1 disabled:opacity-60"
                    >
                      {status === "sending" ? "Sending…" : "Request a MD Service"}
                      {status !== "sending" && (
                        <span className="h-4 w-4">
                          <ArrowIcon />
                        </span>
                      )}
                    </button>
                    <a
                      href={whatsappLink()}
                      onClick={onWhatsAppClick}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost"
                    >
                      <span className="h-4 w-4 text-[#25D366]">
                        <WhatsAppIcon />
                      </span>
                      Send via WhatsApp
                    </a>
                  </div>
                  <p className="mt-3 text-[0.75rem] text-muted">
                    Your structures are treated as confidential and are never
                    used as examples without written permission. NDAs available
                    on request.
                  </p>
                </form>
              )}
            </div>
          </Reveal>

          {/* ── Contact rail ────────────────────────────────────────────── */}
          <Reveal delay={120}>
            <div className="flex h-full flex-col gap-5">
              <div className="panel p-7">
                <p className="eyebrow">Direct contact</p>
                <ul className="mt-5 space-y-4">
                  {[
                    { Icon: PhoneIcon, label: "Phone", value: SITE.phone, href: `tel:${SITE.phoneHref}`, tint: "var(--accent)" },
                    { Icon: WhatsAppIcon, label: "WhatsApp", value: SITE.whatsapp, href: whatsappLink(), tint: "#25D366" },
                    { Icon: MailIcon, label: "Email", value: SITE.email, href: `mailto:${SITE.email}`, tint: "var(--accent)" },
                    { Icon: GlobeIcon, label: "Website", value: "services.biopc.org", href: SITE.url, tint: "var(--accent)" },
                    { Icon: FacebookIcon, label: "Facebook", value: "BioPC Lab", href: SITE.facebook, tint: "var(--accent)" },
                  ].map(({ Icon, label, value, href, tint }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="group flex items-start gap-3.5"
                      >
                        <span
                          className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[var(--hairline)] bg-[var(--surface)] p-2 transition-colors group-hover:border-[rgba(22,104,201,0.4)]"
                          style={{ color: tint }}
                        >
                          <Icon />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
                            {label}
                          </span>
                          <span className="mt-0.5 block break-all text-[0.9375rem] text-[var(--body)] transition-colors group-hover:text-[var(--accent-ink)]">
                            {value}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="panel flex-1 p-7">
                <p className="eyebrow">What happens next</p>
                <ol className="mt-5 space-y-4">
                  {[
                    ["We read the system", "Size, chains, ligand chemistry and the question you are asking."],
                    ["You get a written plan", "Force field, timescale, analyses and a realistic delivery date."],
                    ["You approve, we run", "Nothing is charged until the plan and price are agreed."],
                  ].map(([title, body], i) => (
                    <li key={title} className="flex gap-3.5">
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[rgba(22,104,201,0.4)] font-mono text-[0.65rem] text-[var(--accent)]">
                        {i + 1}
                      </span>
                      <span>
                        <span className="block text-[0.9rem] font-medium text-[var(--fg)]">
                          {title}
                        </span>
                        <span className="mt-1 block text-[0.8125rem] leading-relaxed text-muted">
                          {body}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
