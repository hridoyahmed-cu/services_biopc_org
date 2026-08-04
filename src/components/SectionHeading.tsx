import type { ReactNode } from "react";
import Reveal from "./Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  children?: ReactNode;
}) {
  const centered = align === "center";
  return (
    <Reveal className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section-title mt-3 text-white">{title}</h2>
      {lede ? (
        <p className={`lede mt-5 ${centered ? "mx-auto" : ""}`}>{lede}</p>
      ) : null}
      {children}
    </Reveal>
  );
}
