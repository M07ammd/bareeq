import type { IconKey } from "@/data/services";

/**
 * Chrome-gradient line icons. Each SVG gets a unique gradient id so several can sit on one page.
 */
export function ServiceIcon({ name, className = "h-10 w-10" }: { name: IconKey; className?: string }) {
  const id = `g-${name}`;
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={id} x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#536CFF" />
          <stop offset="0.5" stopColor="#A66AFF" />
          <stop offset="1" stopColor="#F18DDB" />
        </linearGradient>
      </defs>
      <g stroke={`url(#${id})`} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        {name === "brain" && (
          <>
            <circle cx="24" cy="24" r="8" />
            <path d="M24 4v8M24 36v8M4 24h8M36 24h8M10 10l6 6M32 32l6 6M38 10l-6 6M16 32l-6 6" />
          </>
        )}
        {name === "flow" && (
          <>
            <circle cx="10" cy="12" r="4" />
            <circle cx="38" cy="12" r="4" />
            <circle cx="24" cy="36" r="4" />
            <path d="M14 12h20M12.5 15.5l9.5 17M35.5 15.5L26 32.5" />
          </>
        )}
        {name === "queue" && (
          <>
            <circle cx="13" cy="14" r="4" />
            <circle cx="13" cy="34" r="4" />
            <path d="M22 14h20M22 34h14M22 24h17" />
            <path d="M13 18v12" strokeDasharray="2 4" />
          </>
        )}
        {name === "card" && (
          <>
            <rect x="5" y="10" width="38" height="28" rx="6" />
            <path d="M5 19h38" />
            <path d="M24 25l2 4.2 4.6.6-3.3 3.2.8 4.6-4.1-2.2-4.1 2.2.8-4.6-3.3-3.2 4.6-.6z" />
          </>
        )}
        {name === "pin" && (
          <>
            <path d="M24 44s14-12.5 14-24a14 14 0 10-28 0c0 11.5 14 24 14 24z" />
            <circle cx="24" cy="20" r="5" />
          </>
        )}
        {name === "film" && (
          <>
            <rect x="5" y="9" width="38" height="30" rx="5" />
            <path d="M20 17l11 7-11 7z" />
          </>
        )}
        {name === "motion" && (
          <>
            <path d="M6 34c6-18 12-18 18-4s12 14 18-8" />
            <circle cx="6" cy="34" r="2.5" />
            <circle cx="42" cy="22" r="2.5" />
          </>
        )}
      </g>
    </svg>
  );
}
