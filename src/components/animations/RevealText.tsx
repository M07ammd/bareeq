"use client";

import { useRef, useMemo } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

type RevealTextProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  /** "words" = word-by-word stagger, "chars" = character-by-character */
  mode?: "words" | "chars";
  /** Duration for each token */
  duration?: number;
};

const easeExpo = [0.16, 1, 0.3, 1] as const;

/**
 * Cinematic text reveal: each word or character slides up from a hidden overflow clip.
 * Falls back to a simple opacity fade for prefers-reduced-motion.
 */
export function RevealText({
  text,
  as: Tag = "span",
  className = "",
  delay = 0,
  mode = "words",
  duration = 0.75,
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  const tokens = useMemo(
    () => (mode === "chars" ? text.split("") : text.split(" ")),
    [text, mode]
  );

  if (reduced) {
    const Comp = Tag as React.ElementType;
    return (
      <motion.span
        className={`block ${className}`}
        ref={ref as React.Ref<HTMLSpanElement>}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay }}
      >
        {text}
      </motion.span>
    );
  }

  const Comp = motion[Tag as keyof typeof motion] as React.ElementType;

  return (
    <Comp
      ref={ref}
      className={`inline-block ${className}`}
      aria-label={text}
    >
      {tokens.map((token, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden"
          style={{ paddingBottom: "0.08em" }}
          aria-hidden
        >
          <motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0.4 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: "110%", opacity: 0.4 }}
            transition={{
              duration,
              ease: easeExpo as [number, number, number, number],
              delay: delay + i * (mode === "chars" ? 0.028 : 0.07),
            }}
          >
            {token}
            {mode === "words" && i < tokens.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </Comp>
  );
}
