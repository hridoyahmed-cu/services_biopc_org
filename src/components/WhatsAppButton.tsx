"use client";

import { useEffect, useState } from "react";
import { whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "./Icons";

/** Sticky quotation shortcut. Expands to a label on desktop after first scroll. */
export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Request a quotation on WhatsApp"
      className={`group fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-full bg-[#25D366] py-3 pl-3 pr-3 font-semibold text-[#04301a] shadow-[0_14px_38px_-10px_rgba(37,211,102,0.7)] transition-all duration-500 sm:bottom-7 sm:right-7 md:pr-5 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <span className="relative grid h-7 w-7 shrink-0 place-items-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-white/45 [animation-duration:2.6s]" />
        <WhatsAppIcon className="relative h-7 w-7" />
      </span>
      <span className="hidden text-[0.9rem] leading-none md:inline">
        WhatsApp a quotation
      </span>
    </a>
  );
}
