"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * Custom cursor dot — desktop only. A small dot follows the cursor precisely,
 * with a larger ring that springs behind it. Hidden on touch/SSR.
 */
export function Cursor() {
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const sx = useSpring(mx, { stiffness: 180, damping: 18, mass: 0.3 });
  const sy = useSpring(my, { stiffness: 180, damping: 18, mass: 0.3 });
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  // Start hidden; show only after mount confirms pointer device
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show on true pointer devices (not touch)
    if (window.matchMedia("(hover: none)").matches) return;
    setVisible(true);

    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };

    const onEnter = () => {
      dotRef.current?.style.setProperty("transform", "translate(-50%,-50%) scale(2.5)");
      if (ringRef.current) ringRef.current.style.opacity = "0.4";
    };
    const onLeave = () => {
      dotRef.current?.style.setProperty("transform", "translate(-50%,-50%) scale(1)");
      if (ringRef.current) ringRef.current.style.opacity = "1";
    };

    document.addEventListener("mousemove", onMove);
    const interactives = document.querySelectorAll("a, button, [role=button]");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      document.removeEventListener("mousemove", onMove);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, [mx, my]);

  if (!visible) return null;

  return (
    <>
      {/* fast dot */}
      <motion.div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed z-[9999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference transition-transform duration-150"
        style={{ left: mx, top: my }}
      />
      {/* spring ring */}
      <motion.div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed z-[9998] h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 mix-blend-difference"
        style={{ left: sx, top: sy }}
      />
    </>
  );
}
