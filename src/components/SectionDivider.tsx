/**
 * The wave-and-node motif used to occupy the space between sections, so the
 * page reads as continuous rather than as blocks separated by voids.
 *
 * Decorative only — hidden from assistive tech. Pure SVG, no runtime cost.
 * `flip` mirrors the curve so consecutive dividers do not look copy-pasted.
 *
 * The negative block margin lets the band sit *inside* the adjacent sections'
 * padding rather than adding to it, so the pattern fills the gap instead of
 * lengthening the page.
 */
export default function SectionDivider({
  flip = false,
  className = "",
}: {
  flip?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none relative my-[calc(var(--section-y)*-0.5)] h-10 w-full select-none md:h-14 ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        preserveAspectRatio="none"
        className={`absolute inset-0 h-full w-full ${flip ? "-scale-x-100" : ""}`}
      >
        <defs>
          <linearGradient
            id={`sd-a-${flip ? "f" : "n"}`}
            x1="0"
            y1="0"
            x2="1440"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#1668c9" stopOpacity="0" />
            <stop offset="0.34" stopColor="#4aa3f0" stopOpacity="0.62" />
            <stop offset="0.68" stopColor="#15803d" stopOpacity="0.42" />
            <stop offset="1" stopColor="#1668c9" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id={`sd-b-${flip ? "f" : "n"}`}
            x1="0"
            y1="0"
            x2="1440"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#1668c9" stopOpacity="0" />
            <stop offset="0.5" stopColor="#1668c9" stopOpacity="0.22" />
            <stop offset="1" stopColor="#1668c9" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d="M0 78 C 120 78 140 26 240 26 S 360 78 480 78 720 26 720 26 840 78 960 78 1080 26 1200 26 1320 78 1440 78"
          stroke={`url(#sd-a-${flip ? "f" : "n"})`}
          strokeWidth="1.75"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M0 52 C 140 52 160 96 260 96 S 380 52 500 52 740 96 740 96 860 52 980 52 1100 96 1220 96 1340 52 1440 52"
          stroke={`url(#sd-b-${flip ? "f" : "n"})`}
          strokeWidth="1.25"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {[180, 420, 660, 900, 1140, 1380].map((cx, i) => (
          <circle
            key={cx}
            cx={cx}
            cy={i % 2 ? 88 : 34}
            r="3"
            fill="#4aa3f0"
            opacity={0.45}
          />
        ))}
      </svg>
    </div>
  );
}
