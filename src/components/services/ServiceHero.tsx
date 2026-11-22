import { Button } from "@/components/ui/Button";
import { ChromeSparkle } from "@/components/ui/ChromeSparkle";
import { PhotoFill } from "@/components/ui/PhotoFill";
import { categories, type Service } from "@/data/services";
import { ServiceIcon } from "./ServiceIcon";

export function ServiceHero({ service }: { service: Service }) {
  const category = categories.find((c) => c.id === service.category)!;
  const bilingual = service.category === "hospitality";

  return (
    <section
      aria-labelledby="service-title"
      className="bg-signal on-dark grain relative isolate overflow-hidden pb-20 pt-36 md:pb-28 md:pt-44"
      style={{ ["--gx" as string]: "22%", ["--gy" as string]: "40%" } as React.CSSProperties}
    >
      <div className="relative z-[2] mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="text-sm text-white/65">{category.title}</p>
          <h1 id="service-title" className="mt-3 text-4xl font-bold text-white md:text-6xl">
            {service.nameAr}
            {bilingual && (
              <span className="font-latin ms-4 block text-2xl font-medium tracking-wide text-white/70 md:inline md:text-3xl">
                {service.nameEn}
              </span>
            )}
          </h1>
          <p className="holo-text mt-5 text-2xl font-semibold md:text-3xl">{service.tagline}</p>
          <p className="mt-6 max-w-xl text-lg text-white/80">{service.intro}</p>

          {service.notice && (
            <p className="glass-dark mt-6 max-w-xl rounded-2xl px-5 py-4 text-[0.95rem] text-white/90">
              {service.notice}
            </p>
          )}

          <div className="mt-9 flex flex-wrap gap-4">
            <Button href={`/contact?service=${service.slug}`} size="lg">
              اشترك في الخدمة
            </Button>
            <Button href="/contact" size="lg" variant="glass">
              تواصل معنا
            </Button>
          </div>
        </div>

        {/* portfolio-style photo frame */}
        <div className="relative mx-auto w-full max-w-md">
          <div className="chrome-ring relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-2xl shadow-black/50">
            <PhotoFill src={service.image.src} alt={service.image.alt} sizes="(min-width:1024px) 34vw, 90vw" priority />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgb(16 18 36 / 0.7), transparent 55%)" }}
            />
            <span
              aria-hidden
              className="glass-dark absolute bottom-5 start-5 grid h-16 w-16 place-items-center rounded-3xl"
            >
              <ServiceIcon name={service.icon} className="h-9 w-9" />
            </span>
          </div>
          <ChromeSparkle idSuffix="sh-a" className="float-slow absolute -end-5 -top-7 w-20 drop-shadow-xl" />
          <ChromeSparkle idSuffix="sh-b" className="float-slower absolute -bottom-5 -start-5 w-10 drop-shadow-lg" />
        </div>
      </div>
    </section>
  );
}
