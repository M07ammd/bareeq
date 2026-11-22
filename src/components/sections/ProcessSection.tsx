import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/animations/Reveal";

export const processSteps = [
  { n: "01", title: "نفهم احتياجك", body: "نتعرف على بيزنسك ومتطلباته وأهدافك." },
  { n: "02", title: "نصمم الحل", body: "نطوّر حل أتمتة أو تكنولوجيا أو إبداع مناسب لك." },
  { n: "03", title: "ننفذ ونطوّر", body: "نبني ونسلّم ونحسّن الحل حسب نطاق المشروع." },
] as const;

/** Horizontal timeline on desktop, vertical on mobile. This content really is a sequence, hence the numbering. */
export function ProcessSection() {
  return (
    <section aria-labelledby="process-title" className="bg-silver py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading id="process-title" title="إزاي بنشتغل معاك؟" description="ثلاث خطوات واضحة من أول فكرة لحد التنفيذ." />

        <ol className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          {/* connecting line: vertical on mobile (inline-start edge), horizontal on desktop */}
          <span
            aria-hidden
            className="absolute bottom-6 start-[1.6rem] top-6 w-px md:inset-x-[16%] md:bottom-auto md:start-auto md:top-[1.6rem] md:h-px md:w-auto"
            style={{ background: "var(--holo-gradient)" }}
          />
          {processSteps.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 0.12} className="relative list-none ps-20 md:ps-0 md:text-center">
              <span className="chrome-ring absolute start-0 top-0 grid h-[3.2rem] w-[3.2rem] place-items-center rounded-full bg-white font-latin text-lg font-semibold text-navy shadow-lg md:static md:mx-auto">
                {s.n}
              </span>
              <h3 className="mt-0 text-xl font-bold text-navy md:mt-6">{s.title}</h3>
              <p className="mt-2 text-ink-soft md:mx-auto md:max-w-xs">{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
