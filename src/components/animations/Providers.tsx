"use client";

import { MotionConfig } from "motion/react";

/** Makes every Motion animation respect the visitor's prefers-reduced-motion setting. */
export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
