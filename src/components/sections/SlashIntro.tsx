"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type Phase = "in" | "slash" | "split" | "done";
const KEY = "bareeq-intro-seen";

/**
 * One-time opening: the figure stands in a dark panel, a blade-line cuts the screen along a diagonal,
 * and the two halves slide apart to reveal the site. About 2 seconds, skippable (button, click, Esc),
 * shown once per browser session, and skipped entirely for reduced-motion. The page is already
 * rendered underneath, so nothing waits on it. A CSS failsafe removes it even if scripts fail.
 */
export function SlashIntro() {
  const [phase, setPhase] = useState<Phase>("in");

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {}
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) {
      setPhase("done");
      return;
    }
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    const t1 = setTimeout(() => setPhase("slash"), 850);
    const t2 = setTimeout(() => setPhase("split"), 1200);
    const t3 = setTimeout(() => setPhase("done"), 2250);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPhase("done");
    window.addEventListener("keydown", onKey);
    return () => {
      [t1, t2, t3].forEach(clearTimeout);
      window.removeEventListener("keydown", onKey);
      root.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    if (phase === "done") document.documentElement.style.overflow = "";
  }, [phase]);

  const split = phase === "split";
  const ease = [0.76, 0, 0.24, 1] as const;

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="intro"
          className="intro-root fixed inset-0 z-[100] overflow-hidden"
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          onClick={() => setPhase("done")}
        >
          {/* two halves of the screen, cut along the same diagonal as the blade line */}
          <motion.div
            className="absolute inset-0 bg-[#0d1030]"
            style={{ clipPath: "polygon(0 0, 62% 0, 38% 100%, 0 100%)" }}
            animate={{ x: split ? "-105%" : 0 }}
            transition={{ duration: 0.95, ease }}
          />
          <motion.div
            className="absolute inset-0 bg-[#171c52]"
            style={{ clipPath: "polygon(62% 0, 100% 0, 100% 100%, 38% 100%)" }}
            animate={{ x: split ? "105%" : 0 }}
            transition={{ duration: 0.95, ease }}
          />

          {/* the figure, centred, rises in then falls back as the screen opens */}
          <motion.div
            className="absolute inset-0 grid place-items-center"
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: split ? 0 : 1, y: 0, scale: split ? 1.12 : 1 }}
            transition={{ duration: split ? 0.5 : 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src="/hero/warrior.webp"
              alt=""
              width={706}
              height={615}
              priority
              className="h-auto w-[78vw] max-w-[560px] drop-shadow-[0_0_60px_rgb(83_108_255/0.55)]"
            />
          </motion.div>

          {/* the slash: a bright line drawn corner to corner along the cut */}
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <motion.line
              x1="62"
              y1="0"
              x2="38"
              y2="100"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{ filter: "drop-shadow(0 0 10px #a66aff) drop-shadow(0 0 22px #536cff)" }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: phase === "in" ? 0 : 1,
                opacity: phase === "in" ? 0 : split ? 0 : 1,
              }}
              transition={{ duration: phase === "slash" ? 0.18 : 0.3, ease: "easeOut" }}
            />
          </svg>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setPhase("done");
            }}
            className="absolute bottom-8 start-1/2 -translate-x-1/2 rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm text-white/85 backdrop-blur transition hover:bg-white/20 focus-visible:outline-2"
          >
            تخطي
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
