/**
 * Static stand-in for the 3D Kinetic Sculpture:
 * A stylized prismatic core with glowing orbital rings.
 * Pure SVG/CSS — renders instantly on the server.
 */
export function StaticHeroArt({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 500 500"
        className="h-full w-full max-h-[480px] max-w-[480px] drop-shadow-[0_0_50px_rgba(83,108,255,0.3)]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="sc-holo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#536cff" />
            <stop offset="60%" stopColor="#a66aff" />
            <stop offset="100%" stopColor="#f18ddb" />
          </linearGradient>
          <linearGradient id="sc-core" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#dce0e9" />
            <stop offset="50%" stopColor="#536cff" />
            <stop offset="100%" stopColor="#101224" />
          </linearGradient>
          <radialGradient id="sc-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7b5aff" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#536cff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#536cff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Core Radial Bloom */}
        <circle cx="250" cy="250" r="190" fill="url(#sc-glow)" />

        {/* Outer Orbital Ring 3 (Pink) */}
        <ellipse
          cx="250"
          cy="250"
          rx="210"
          ry="85"
          fill="none"
          stroke="#f18ddb"
          strokeWidth="1.5"
          strokeOpacity="0.45"
          transform="rotate(35 250 250)"
          strokeDasharray="8 6"
        />

        {/* Orbital Ring 2 (Purple) */}
        <ellipse
          cx="250"
          cy="250"
          rx="185"
          ry="75"
          fill="none"
          stroke="#a66aff"
          strokeWidth="2"
          strokeOpacity="0.6"
          transform="rotate(-40 250 250)"
        />

        {/* Orbital Ring 1 (Electric Blue) */}
        <ellipse
          cx="250"
          cy="250"
          rx="160"
          ry="65"
          fill="none"
          stroke="#536cff"
          strokeWidth="2.5"
          strokeOpacity="0.75"
          transform="rotate(15 250 250)"
        />

        {/* Orbiting Satellite Beads */}
        <circle cx="110" cy="190" r="5" fill="#ffffff" filter="drop-shadow(0 0 8px #536cff)" />
        <circle cx="380" cy="230" r="6" fill="#ffffff" filter="drop-shadow(0 0 10px #a66aff)" />
        <circle cx="290" cy="390" r="4.5" fill="#ffffff" filter="drop-shadow(0 0 6px #f18ddb)" />

        {/* Central Kinetic Torus Knot Silhouette / Faceted Crystal */}
        <g transform="translate(250, 250)">
          {/* Faceted Diamond Core */}
          <polygon
            points="0,-85 65,-25 55,60 0,90 -55,60 -65,-25"
            fill="url(#sc-core)"
            stroke="url(#sc-holo)"
            strokeWidth="2"
          />
          {/* Facets lines */}
          <line x1="0" y1="-85" x2="0" y2="90" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1" />
          <line x1="-65" y1="-25" x2="65" y2="-25" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1" />
          <line x1="-55" y1="60" x2="55" y2="60" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1" />
          <polygon
            points="0,-45 35,-10 0,45 -35,-10"
            fill="#536cff"
            fillOpacity="0.35"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
        </g>
      </svg>
    </div>
  );
}
