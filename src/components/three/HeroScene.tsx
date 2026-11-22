"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useLiteMode, useWebGLSupport } from "@/hooks/useWebGL";
import { useOnScreen } from "@/hooks/useInView";
import { StaticHeroArt } from "./StaticHeroArt";
import { ThreeErrorBoundary } from "./ThreeErrorBoundary";

// Three.js is browser-only and heavy: load it lazily, never on the server.
const HeroSculptureScene = dynamic(() => import("./HeroSculptureScene"), {
  ssr: false,
  loading: () => null,
});

/** Lazy, visibility-aware wrapper around the hero 3D sculpture with a static fallback. */
export function HeroScene() {
  const supported = useWebGLSupport();
  const lite = useLiteMode();
  const reduced = useReducedMotion();
  const { ref, active } = useOnScreen<HTMLDivElement>();
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  const onError = useCallback(() => setFailed(true), []);
  const onReady = useCallback(() => setReady(true), []);

  const show3D = supported === true && !failed;

  return (
    <div ref={ref} aria-hidden className="relative h-full w-full">
      {/* Static art renders instantly on server/fallback */}
      <StaticHeroArt
        className={`transition-opacity duration-1000 ${
          show3D && ready ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      />
      {show3D && (
        <ThreeErrorBoundary fallback={null} onError={onError}>
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <HeroSculptureScene
              active={active}
              lite={lite}
              still={!!reduced}
              onError={onError}
              onReady={onReady}
            />
          </motion.div>
        </ThreeErrorBoundary>
      )}
    </div>
  );
}
