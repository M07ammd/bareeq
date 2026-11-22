import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";
import { Magnetic } from "@/components/animations/Magnetic";
import { ChromeSparkle } from "@/components/ui/ChromeSparkle";

type Props = { href?: string; title?: string; body?: string; label?: string };

export function ContactCTA({
  href = "/contact",
  title = "جاهز تطوّر البيزنس بتاعك؟",
  body = "خلينا نبدأ ونبني مع بعض تجربة أذكى.",
  label = "ابدأ دلوقتي",
}: Props) {
  return (
    <section aria-labelledby="cta-title" className="bg-signal on-dark relative overflow-hidden py-24 md:py-32">
      <div aria-hidden className="rings pointer-events-none absolute left-1/2 top-1/2 w-[120%] -translate-x-1/2 -translate-y-1/2 opacity-60 md:w-[70%]" />
      <ChromeSparkle
        idSuffix="cta-a"
        className="float-slow pointer-events-none absolute start-[8%] top-12 w-20 opacity-90 md:w-32"
      />
      <ChromeSparkle
        idSuffix="cta-b"
        className="float-slower pointer-events-none absolute bottom-10 end-[10%] w-12 opacity-80 md:w-20"
      />
      <Reveal className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 id="cta-title" className="text-3xl font-bold text-white md:text-5xl">
          {title}
        </h2>
        <p className="mt-5 text-lg text-white/75 md:text-xl">{body}</p>
        <Magnetic className="mt-10">
          <Button href={href} size="lg" variant="chrome">
            {label}
          </Button>
        </Magnetic>
      </Reveal>
    </section>
  );
}
