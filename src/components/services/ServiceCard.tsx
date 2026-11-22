"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { categories, type Service } from "@/data/services";
import { PhotoFill } from "@/components/ui/PhotoFill";
import { ServiceIcon } from "./ServiceIcon";

/** tall = portrait portfolio tile, landscape = 2-up, banner = single feature spanning the row */
export type CardRatio = "tall" | "landscape" | "banner";

const ratioClass: Record<CardRatio, string> = {
  tall: "aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5]",
  landscape: "aspect-[4/3] sm:aspect-[16/11]",
  banner: "aspect-[4/5] sm:aspect-[16/10] lg:aspect-[21/9]",
};

const sizesFor: Record<CardRatio, string> = {
  tall: "(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw",
  landscape: "(min-width:768px) 50vw, 100vw",
  banner: "100vw",
};

type Props = { service: Service; ratio?: CardRatio; priority?: boolean };

/**
 * Portfolio-style service card: full-bleed photo, text on a navy gradient, subtle 3D tilt,
 * a moving reflective light and a holographic border on hover. The whole card is one link that opens in a new tab.
 */
export function ServiceCard({ service, ratio = "tall", priority = false }: Props) {
  const ref = useRef<HTMLElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 160, damping: 18 });
  const sy = useSpring(py, { stiffness: 160, damping: 18 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-5, 5]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [4, -4]);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    px.set(x - 0.5);
    py.set(y - 0.5);
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  const category = categories.find((c) => c.id === service.category)!;
  const bilingual = service.category === "hospitality";
  const banner = ratio === "banner";

  return (
    <motion.article
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className={`group chrome-ring holo-ring relative isolate overflow-hidden rounded-[1.75rem] bg-navy shadow-[0_24px_60px_-28px_rgb(16_18_36/0.6)] ${ratioClass[ratio]}`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]">
          <PhotoFill src={service.image.src} alt={service.image.alt} sizes={sizesFor[ratio]} priority={priority} />
        </div>
      </div>

      {/* legibility gradient: dense at the bottom where the text sits */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgb(16 18 36 / 0.96) 0%, rgb(16 18 36 / 0.78) 34%, rgb(16 18 36 / 0.18) 66%, rgb(16 18 36 / 0.35) 100%)",
        }}
      />

      {/* top row: category + icon */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-5">
        <span className="glass-dark rounded-full px-3.5 py-1.5 text-[0.8rem] text-white/90">{category.titleEn}</span>
        <span
          aria-hidden
          className="glass-dark grid h-12 w-12 place-items-center rounded-2xl transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-6deg]"
        >
          <ServiceIcon name={service.icon} className="h-7 w-7" />
        </span>
      </div>

      {/* bottom: title, description, CTA */}
      <div className={`absolute inset-x-0 bottom-0 flex flex-col p-6 md:p-7 ${banner ? "lg:max-w-2xl" : ""}`}>
        <h3 className="text-2xl font-bold leading-snug text-white md:text-[1.7rem]">
          {service.nameAr}
          {bilingual && (
            <span className="font-latin ms-3 text-lg font-medium tracking-wide text-white/65">{service.nameEn}</span>
          )}
        </h3>
        <p className="mt-2.5 text-[0.97rem] text-white/80">{service.short}</p>

        <Link
          href={`/services/${service.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`اكتشف الخدمة: ${service.nameAr} (يفتح في تبويب جديد)`}
          className="mt-5 inline-flex w-fit items-center gap-3 font-display font-semibold text-white after:absolute after:inset-0 after:content-['']"
        >
          اكتشف الخدمة
          <span
            aria-hidden
            className="grid h-10 w-10 place-items-center rounded-full bg-white text-navy transition-all duration-300 group-hover:-translate-x-1.5 group-hover:bg-[#dce0e9]"
          >
            ←
          </span>
        </Link>
      </div>

      <span className="card-light" aria-hidden />
    </motion.article>
  );
}
