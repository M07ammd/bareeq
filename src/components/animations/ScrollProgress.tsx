"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Thin holographic reading-progress line at the top of the page. Fills from the right (RTL). */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX, originX: 1, background: "var(--holo-gradient)" }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
    />
  );
}
