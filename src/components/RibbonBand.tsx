/**
 * Decorative β-sheet/ribbon band used as a section divider. Pure SVG, animated
 * with CSS only, so it costs nothing at runtime.
 */
export default function RibbonBand({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 120"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ribbon-a" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1668c9" stopOpacity="0" />
          <stop offset="0.35" stopColor="#1668c9" stopOpacity="0.75" />
          <stop offset="0.7" stopColor="#15803d" stopOpacity="0.5" />
          <stop offset="1" stopColor="#2f7ff6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ribbon-b" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2f7ff6" stopOpacity="0" />
          <stop offset="0.5" stopColor="#4aa3f0" stopOpacity="0.35" />
          <stop offset="1" stopColor="#1668c9" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path
        d="M0 78 C 120 78 140 26 240 26 S 360 78 480 78 720 26 720 26 840 78 960 78 1080 26 1200 26 1320 78 1440 78"
        stroke="url(#ribbon-a)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M0 52 C 140 52 160 96 260 96 S 380 52 500 52 740 96 740 96 860 52 980 52 1100 96 1220 96 1340 52 1440 52"
        stroke="url(#ribbon-b)"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      {[180, 420, 660, 900, 1140, 1380].map((cx, i) => (
        <circle
          key={cx}
          cx={cx}
          cy={i % 2 ? 88 : 34}
          r="2.6"
          fill="#1668c9"
          opacity="0.55"
        />
      ))}
    </svg>
  );
}
