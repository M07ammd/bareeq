"use client";

import { motion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Headline reveal: each word rises out of a mask when scrolled into view.
 * Splits on spaces only (never letters), so Arabic letter-joining stays intact.
 * The full text is exposed once to screen readers; the animated words are hidden from them.
 */
export function SplitReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <span key={`${w}-${i}`}>
            <span className="-my-[0.14em] inline-block overflow-hidden py-[0.14em] align-bottom">
              <motion.span
                className="inline-block"
                initial={{ y: "115%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.85, ease, delay: delay + i * 0.07 }}
              >
                {w}
              </motion.span>
            </span>
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </>
  );
}
