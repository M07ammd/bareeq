import { Marquee } from "@/components/animations/Marquee";
import { ChromeSparkle } from "@/components/ui/ChromeSparkle";

// The three brand pillars from the brief, in Arabic and English.
const words = [
  { ar: "أتمتة", en: "AUTOMATE" },
  { ar: "ابتكار", en: "INNOVATE" },
  { ar: "إبداع", en: "CREATE" },
];

/**
 * A tilted chrome band that crosses the seam between the dark hero and the light services section.
 * Purely decorative (the same words appear as real content elsewhere), so it is hidden from assistive tech.
 */
export function MarqueeBand() {
  return (
    <div aria-hidden className="relative z-10 -my-7 overflow-x-clip py-7 md:-my-9 md:py-9">
      <div className="chrome-band -ms-[3%] w-[106%] -rotate-[1.6deg] py-3.5 md:py-5">
        <Marquee>
          {[0, 1].map((rep) =>
            words.map((w) => (
              <div key={`${rep}-${w.en}`} className="flex items-center">
                <span dir="rtl" className="font-display px-6 text-3xl font-bold text-navy md:px-9 md:text-5xl">
                  {w.ar}
                </span>
                <ChromeSparkle idSuffix={`mq-${rep}-${w.en}`} className="h-6 w-6 shrink-0 md:h-9 md:w-9" />
                <span className="font-latin px-6 text-3xl font-semibold tracking-wide text-navy/80 md:px-9 md:text-5xl">
                  {w.en}
                </span>
                <ChromeSparkle idSuffix={`mq2-${rep}-${w.en}`} className="h-6 w-6 shrink-0 md:h-9 md:w-9" />
              </div>
            )),
          )}
        </Marquee>
      </div>
    </div>
  );
}
