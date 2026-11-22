/** Decorative 4-point chrome star (SVG, CSS-animated). Lightweight alternative to a WebGL canvas for section accents. */
export function ChromeSparkle({
  className = "",
  idSuffix = "a",
}: {
  className?: string;
  idSuffix?: string;
}) {
  const id = `sparkle-${idSuffix}`;
  return (
    <svg viewBox="-1 -1 2 2" aria-hidden focusable="false" className={className}>
      <defs>
        <linearGradient id={id} x1="-0.7" y1="-1" x2="0.7" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.35" stopColor="#9aa3bd" />
          <stop offset="0.5" stopColor="#f4f5fa" />
          <stop offset="0.68" stopColor="#7d6bff" />
          <stop offset="1" stopColor="#dce0e9" />
        </linearGradient>
      </defs>
      <path
        d="M0 -1 Q0.12 -0.12 1 0 Q0.12 0.12 0 1 Q-0.12 0.12 -1 0 Q-0.12 -0.12 0 -1Z"
        fill={`url(#${id})`}
        stroke="rgb(255 255 255 / 0.8)"
        strokeWidth="0.012"
      />
    </svg>
  );
}
