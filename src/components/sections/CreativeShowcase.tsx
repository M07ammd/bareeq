"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/animations/Reveal";
import { ChromeSparkle } from "@/components/ui/ChromeSparkle";
import { Button } from "@/components/ui/Button";
import { PhotoFill } from "@/components/ui/PhotoFill";
import { showcaseItems, type ShowcaseItem } from "@/data/showcase";

function Art({ item, large = false }: { item: ShowcaseItem; large?: boolean }) {
  const style = {
    "--ax": item.art.ax,
    "--ay": item.art.ay,
    "--bx": item.art.bx,
    "--by": item.art.by,
    "--cx": item.art.cx,
    "--cy": item.art.cy,
  } as React.CSSProperties;

  if (item.media?.type === "image") {
    return (
      <PhotoFill
        src={item.media.src}
        alt={item.media.alt}
        sizes={large ? "(min-width:768px) 768px, 100vw" : "(min-width:1024px) 50vw, 100vw"}
      />
    );
  }
  if (item.media?.type === "video") {
    return (
      <video
        src={item.media.src}
        poster={item.media.poster}
        aria-label={item.media.alt}
        className="absolute inset-0 h-full w-full object-cover"
        controls={large}
        autoPlay={!large}
        muted={!large}
        loop={!large}
        playsInline
      />
    );
  }
  return (
    <div className="holo-art absolute inset-0" style={style} aria-hidden>
      <ChromeSparkle
        idSuffix={`show-${item.id}${large ? "-lg" : ""}`}
        className="float-slow absolute start-[14%] top-[16%] w-[22%] max-w-28 drop-shadow-xl"
      />
      <ChromeSparkle
        idSuffix={`show2-${item.id}${large ? "-lg" : ""}`}
        className="float-slower absolute bottom-[14%] end-[16%] w-[11%] max-w-14 drop-shadow-lg"
      />
    </div>
  );
}

function Lightbox({ item, onClose }: { item: ShowcaseItem; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") e.preventDefault(); // single focusable control: keep focus in the dialog
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previous?.focus();
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] grid place-items-center bg-navy/80 p-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
        className="glass chrome-ring relative w-full max-w-3xl overflow-hidden rounded-[2rem]"
      >
        <div className="relative aspect-video w-full">
          <Art item={item} large />
        </div>
        <div className="p-6 md:p-8">
          <p className="text-sm text-ink-soft">{item.kind}</p>
          <h3 className="mt-1 text-2xl font-bold text-navy">{item.title}</h3>
          <p className="mt-3 text-ink-soft">{item.description}</p>
          {item.concept && (
            <p className="mt-4 rounded-2xl bg-navy/5 px-4 py-3 text-sm text-navy">
              معاينة مفهومية توضيحية، وليست مشروعًا لعميل.
            </p>
          )}
          <Button href={`/services/${item.serviceSlug}`} external className="mt-5">
            تفاصيل الخدمة
          </Button>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="إغلاق المعاينة"
          className="absolute end-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/80 text-2xl text-navy shadow-lg"
        >
          ×
        </button>
      </motion.div>
    </motion.div>
  );
}

export function CreativeShowcase() {
  const [active, setActive] = useState<ShowcaseItem | null>(null);

  return (
    <section
      aria-labelledby="showcase-title"
      className="bg-night on-dark relative overflow-hidden py-24 md:py-32"
      style={{ ["--gx" as string]: "18%", ["--gy" as string]: "12%" } as React.CSSProperties}
    >
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          id="showcase-title"
          tone="dark"
          title="الإبداع لما يقابل التكنولوجيا."
          description="إعلانات فيديو، مشاهد منتجات، وموشن جرافيك بالذكاء الاصطناعي. المعروض هنا مفاهيم توضيحية لحد ما نضيف أعمالنا الفعلية."
        />

        <ul className="mt-14 grid gap-5 lg:grid-cols-10 lg:auto-rows-[minmax(16rem,auto)]">
          {showcaseItems.map((item, i) => (
            <Reveal as="li" key={item.id} delay={i * 0.08} className={`${item.span} list-none`}>
              <button
                type="button"
                onClick={() => setActive(item)}
                aria-haspopup="dialog"
                className="group chrome-ring holo-ring relative block h-full w-full min-h-[18rem] overflow-hidden rounded-[1.75rem] text-start"
              >
                <Art item={item} />
                <div
                  aria-hidden
                  className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-90"
                  style={{
                    background: "linear-gradient(to top, rgb(16 18 36 / 0.92) 0%, rgb(16 18 36 / 0.45) 45%, rgb(16 18 36 / 0.1) 100%)",
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  {item.concept && (
                    <span className="glass-dark mb-3 inline-block rounded-full px-3 py-1 text-xs text-white">
                      معاينة مفهومية
                    </span>
                  )}
                  <p className="text-sm text-white/70">{item.kind}</p>
                  <h3 className="text-xl font-bold text-white md:text-2xl">{item.title}</h3>
                </div>
                <span
                  aria-hidden
                  className="absolute end-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/80 text-navy opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 scale-75"
                >
                  ▶
                </span>
                <span className="sr-only">فتح المعاينة</span>
              </button>
            </Reveal>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {active && <Lightbox key={active.id} item={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}
