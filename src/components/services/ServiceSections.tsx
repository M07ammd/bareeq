import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";
import type { Service } from "@/data/services";

/** B. What is this service? */
export function ServiceWhatIs({ service }: { service: Service }) {
  const { whatIs } = service;
  return (
    <section aria-labelledby="what-title" className="bg-white py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-2 lg:gap-16">
        <SectionHeading id="what-title" title={whatIs.title} />
        <Reveal className="space-y-5 text-lg text-ink-soft">
          <p>{whatIs.body}</p>
          <p className="chrome-ring rounded-3xl bg-soft p-6 text-navy">{whatIs.problem}</p>
        </Reveal>
      </div>
    </section>
  );
}

/** C. Key features: individually designed cards (each has its own accent position). */
export function ServiceFeatures({ service }: { service: Service }) {
  const tilts = ["20% 20%", "80% 25%", "35% 80%", "75% 75%", "50% 15%", "15% 65%"];
  return (
    <section aria-labelledby="features-title" className="bg-silver py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading id="features-title" title="المميزات الأساسية" />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {service.features.map((f, i) => (
            <Reveal as="li" key={f.title} delay={(i % 3) * 0.08} className="list-none">
              <article className="group chrome-ring holo-ring relative h-full overflow-hidden rounded-3xl bg-white p-7">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -end-10 -top-10 h-36 w-36 rounded-full opacity-40 blur-2xl transition-opacity duration-500 group-hover:opacity-80"
                  style={{
                    background: `radial-gradient(circle at ${tilts[i % tilts.length]}, #a66aff, #536cff 55%, transparent 75%)`,
                  }}
                />
                <h3 className="relative text-xl font-bold text-navy">{f.title}</h3>
                <p className="relative mt-3 text-ink-soft">{f.body}</p>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** D. How it works. A real sequence, so it is numbered. */
export function ServiceSteps({ service }: { service: Service }) {
  return (
    <section aria-labelledby="steps-title" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading id="steps-title" title="إزاي بتشتغل الخدمة؟" />
        <ol className="relative mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {service.steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.1} className="relative list-none">
              <span className="font-latin chrome-text text-5xl font-semibold" dir="ltr" style={{ display: "block", textAlign: "start" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div aria-hidden className="my-4 h-px w-full" style={{ background: "var(--holo-gradient)" }} />
              <h3 className="text-xl font-bold text-navy">{s.title}</h3>
              <p className="mt-2 text-ink-soft">{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** E. Business benefits, with no invented statistics or guarantees. */
export function ServiceBenefits({ service }: { service: Service }) {
  return (
    <section aria-labelledby="benefits-title" className="bg-night on-dark py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading id="benefits-title" tone="dark" title="إيه الفايدة لبيزنسك؟" />
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {service.benefits.map((b, i) => (
            <Reveal as="li" key={b.title} delay={i * 0.1} className="list-none">
              <div className="glass-dark h-full rounded-3xl p-7">
                <h3 className="text-xl font-bold text-white">{b.title}</h3>
                <p className="mt-3 text-white/75">{b.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
        <p className="mt-8 text-sm text-white/55">
          النتائج الفعلية بتختلف من بيزنس لآخر، ومش بنقدّم أرقام أو وعود غير مضمونة.
        </p>
      </div>
    </section>
  );
}

/** G. FAQ */
export function ServiceFAQ({ service }: { service: Service }) {
  return (
    <section aria-labelledby="faq-title" className="bg-silver py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeading id="faq-title" title="أسئلة شائعة" align="center" />
        <div className="mt-12">
          <Accordion items={service.faqs} />
        </div>
      </div>
    </section>
  );
}
