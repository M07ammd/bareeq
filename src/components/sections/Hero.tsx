"use client";

import Image from "next/image";
import { useRef, useCallback } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/animations/Magnetic";
import { HeroScene } from "@/components/three/HeroScene";

const ease = [0.16, 1, 0.3, 1] as const;

/** Single headline line — clips up from bottom */
function HeroLine({
  text,
  delay,
  holo,
}: {
  text: string;
  delay: number;
  holo?: boolean;
}) {
  return (
    <span className="block overflow-hidden leading-[1.15]">
      <motion.span
        className={`block ${holo ? "holo-text-light" : ""}`}
        initial={{ y: "110%", skewY: 3 }}
        animate={{ y: 0, skewY: 0 }}
        transition={{ duration: 1, ease, delay }}
      >
        {text}
      </motion.span>
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--gx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--gy", `${((e.clientY - r.top) / r.height) * 100}%`);
  }, []);

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      onPointerMove={onPointerMove}
      className="relative isolate min-h-[100svh] overflow-hidden"
      style={
        {
          "--gx": "50%",
          "--gy": "50%",
          background:
            "linear-gradient(135deg, #0a0d1f 0%, #0f1535 40%, #111730 70%, #0c0f26 100%)",
        } as React.CSSProperties
      }
    >
      {/* ── ACCENT GLOWS ── */}
      {/* Top-left purple bloom */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-32 -z-10 h-[500px] w-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgb(166 106 255 / 0.18) 0%, transparent 70%)",
        }}
      />
      {/* Right-side electric blue bloom */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-1/4 -z-10 h-[600px] w-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgb(83 108 255 / 0.15) 0%, transparent 65%)",
        }}
      />
      {/* Bottom fade to match next section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48"
        style={{
          background: "linear-gradient(to top, #101224 0%, transparent 100%)",
        }}
      />

      {/* ── GRID FLOOR ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-floor opacity-30" />
      </div>

      {/* ── CURSOR-REACTIVE GLOW ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-[8] transition-all duration-700"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at var(--gx) var(--gy), rgb(83 108 255 / 0.2) 0%, transparent 68%)",
        }}
      />

      {/* ═══════════════════════════════════════════════
          TWO-COLUMN LAYOUT
          Left: Text  |  Right: 3D Network
          ═══════════════════════════════════════════════ */}
      <div className="relative z-[2] mx-auto grid min-h-[100svh] max-w-7xl grid-cols-1 items-center gap-10 px-6 py-24 md:grid-cols-2 md:gap-6 md:py-0">

        {/* ── LEFT: Content ── */}
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="flex flex-col"
        >

          {/* Headline */}
          <h1
            id="hero-title"
            className="mb-6 font-display text-4xl font-bold text-white sm:text-5xl lg:text-[3.5rem]"
          >
            <HeroLine text="حلول ذكية." delay={0.3} />
            <HeroLine text="تجارب مختلفة." delay={0.45} />
            <HeroLine text="مستقبل أقوى." delay={0.6} holo />
          </h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.9 }}
            className="mb-10 max-w-md text-base leading-relaxed text-white/70 md:text-lg"
          >
            نساعد البيزنس يشتغل بذكاء، يطوّر تجربة عملائه، ويخلق حضور أقوى
            باستخدام الذكاء الاصطناعي والأتمتة والإبداع.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 1.1 }}
            className="flex flex-wrap gap-4"
          >
            <Magnetic>
              <Button href="/#services" size="lg" variant="chrome">
                اكتشف خدماتنا
              </Button>
            </Magnetic>
            <Magnetic>
              <Button href="/contact" size="lg" variant="glass">
                ابدأ مشروعك
              </Button>
            </Magnetic>
          </motion.div>

          {/* Stat strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 1.4 }}
            className="mt-12 grid grid-cols-3 gap-4 border-t border-white/10 pt-8"
          >
            {[
              { n: "٩+", label: "خدمة" },
              { n: "٣", label: "تخصص" },
              { n: "١٠٠٪", label: "مخصّص" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-latin text-xl font-bold text-white md:text-2xl">
                  {s.n}
                </div>
                <div className="mt-0.5 text-xs text-white/45">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── RIGHT: 3D Network Scene ── */}
        <motion.div
          style={{ y: sceneY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.4 }}
          className="relative hidden h-[480px] w-full md:block lg:h-[560px]"
          aria-hidden
        >
          {/* Glow rings behind canvas */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: "420px",
              height: "420px",
              background:
                "radial-gradient(circle, rgb(83 108 255 / 0.18) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]"
            style={{ width: "380px", height: "380px" }}
          />
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]"
            style={{ width: "280px", height: "280px" }}
          />

          {/* The actual Three.js canvas fills this container */}
          <div className="absolute inset-0">
            <HeroScene />
          </div>

          {/* Service badges floating around the network */}
          {[
            { label: "تسويق رقمي", x: "8%", y: "18%", delay: 1.0 },
            { label: "أتمتة", x: "72%", y: "12%", delay: 1.2 },
            { label: "تصميم", x: "80%", y: "72%", delay: 1.4 },
            { label: "ذكاء اصطناعي", x: "5%", y: "72%", delay: 1.6 },
          ].map((b) => (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease, delay: b.delay }}
              className="glass absolute rounded-full px-3 py-1.5 text-xs font-medium text-white/80"
              style={{ left: b.x, top: b.y }}
            >
              {b.label}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Mobile: show network below text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.6 }}
        className="relative mx-auto mb-8 h-[260px] w-full max-w-sm md:hidden"
        aria-hidden
      >
        <HeroScene />
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden
        style={{ opacity: cueOpacity }}
        className="absolute bottom-8 left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="font-latin text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-white/30">
          scroll
        </span>
        <span className="relative h-10 w-px overflow-hidden bg-white/15">
          <motion.span
            className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-transparent via-white to-transparent"
            animate={{ y: [-16, 40] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
