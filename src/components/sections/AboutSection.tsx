import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/animations/Reveal";
import { ChromeSparkle } from "@/components/ui/ChromeSparkle";

export const pillars = [
  { word: "AUTOMATE", title: "أتمتة", body: "نبسّط التشغيل ونقلل الشغل المتكرر." },
  { word: "INNOVATE", title: "ابتكار", body: "نبني تجارب رقمية أذكى لعملائك." },
  { word: "CREATE", title: "إبداع", body: "نصنع محتوى بصري إبداعي بالذكاء الاصطناعي." },
] as const;

export function AboutSection({ asPage = false }: { asPage?: boolean }) {
  return (
    <section
      aria-labelledby="about-title"
      className={`relative overflow-hidden bg-white ${asPage ? "pb-24 pt-40 md:pb-32" : "py-24 md:py-32"}`}
    >
      <ChromeSparkle
        idSuffix="about-a"
        className="float-slow pointer-events-none absolute end-[6%] top-16 w-24 opacity-90 md:w-40"
      />
      <ChromeSparkle
        idSuffix="about-b"
        className="float-slower pointer-events-none absolute bottom-20 start-[5%] w-14 opacity-80 md:w-24"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          as={asPage ? "h1" : "h2"}
          id="about-title"
          title="بنصمّم مستقبل أذكى للبيزنس."
          description="BAREEQ وكالة تجمع بين الذكاء الاصطناعي، الأتمتة الذكية، تطوير تجربة العملاء، والإبداع البصري لمساعدة البيزنس على التطور والنمو."
        />

        <ul className="mt-16 grid divide-navy/10 md:grid-cols-3 md:divide-x md:divide-x-reverse">
          {pillars.map((p, i) => (
            <Reveal as="li" key={p.word} delay={i * 0.1} className="list-none py-8 md:px-10 md:first:ps-0 md:last:pe-0">
              <p
                className="font-latin chrome-text text-4xl font-semibold tracking-wide md:text-5xl"
                dir="ltr"
                style={{ textAlign: "start" }}
              >
                {p.word}
              </p>
              <h3 className="mt-4 text-xl font-bold text-navy">{p.title}</h3>
              <p className="mt-2 text-ink-soft">{p.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
