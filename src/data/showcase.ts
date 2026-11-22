/**
 * Creative showcase items.
 *
 * No portfolio media has been supplied yet, so every item is an ILLUSTRATIVE CONCEPT PREVIEW
 * (stock photography) and is labelled that way in the UI. To show real work, point `media.src` at a file in
 * /public/showcase/ and set `concept: false`.
 */
import { unsplash } from "@/lib/images";

export type ShowcaseItem = {
  id: string;
  title: string;
  kind: string;
  description: string;
  serviceSlug: string;
  /** true = illustrative concept (not client work). Set false once real media is attached. */
  concept: boolean;
  media?: { type: "video" | "image"; src: string; poster?: string; alt: string };
  art: { ax: string; ay: string; bx: string; by: string; cx: string; cy: string };
  /** grid placement on large screens */
  span: string;
};

export const showcaseItems: ShowcaseItem[] = [
  {
    id: "video-ad",
    title: "إعلان فيديو لمنتج",
    kind: "إعلانات الفيديو بالذكاء الاصطناعي",
    description:
      "مفهوم لإعلان سينمائي يعرض منتج من زوايا وإضاءة صعب تصويرها تقليديًا، بسرد بصري يبرز تفاصيله.",
    serviceSlug: "ai-video-ads",
    concept: true,
    media: { type: "image", src: unsplash("photo-1642266488300-1a57609d73aa"), alt: "كاميرا على حامل ثلاثي أمام خلفية بدرجات الأحمر والبنفسجي" },
    art: { ax: "15%", ay: "25%", bx: "85%", by: "35%", cx: "55%", cy: "90%" },
    span: "lg:col-span-7 lg:row-span-2 min-h-[22rem] lg:min-h-[34rem]",
  },
  {
    id: "product-visual",
    title: "مشهد تجاري للمنتج",
    kind: "مشاهد المنتجات",
    description: "مفهوم لمشهد منتج معدني لامع داخل بيئة مستقبلية مع انعكاسات مدروسة.",
    serviceSlug: "ai-video-ads",
    concept: true,
    media: { type: "image", src: unsplash("photo-1644318295821-12c4ddf2a36e"), alt: "حلقة زرقاء مضيئة على خلفية سوداء" },
    art: { ax: "80%", ay: "20%", bx: "20%", by: "60%", cx: "50%", cy: "95%" },
    span: "lg:col-span-5 min-h-[16rem]",
  },
  {
    id: "motion",
    title: "موشن جرافيك للهوية",
    kind: "موشن جرافيك بالذكاء الاصطناعي",
    description: "مفهوم لتحريك عناصر الهوية البصرية في محتوى ترويجي قصير.",
    serviceSlug: "ai-motion-graphics",
    concept: true,
    media: { type: "image", src: unsplash("photo-1693588312088-a37c2a329982"), alt: "تصميم تجريدي مولّد بالكمبيوتر" },
    art: { ax: "30%", ay: "75%", bx: "75%", by: "15%", cx: "10%", cy: "20%" },
    span: "lg:col-span-3 min-h-[16rem]",
  },
  {
    id: "social",
    title: "فكرة محتوى متحرك",
    kind: "محتوى سوشيال إبداعي",
    description: "مفهوم لسلسلة محتوى متحرك بستايل موحد لمنصات السوشيال.",
    serviceSlug: "ai-motion-graphics",
    concept: true,
    media: { type: "image", src: unsplash("photo-1676917995754-536530c4017a"), alt: "شكل ثلاثي الأبعاد مولّد بالكمبيوتر بألوان متعددة" },
    art: { ax: "60%", ay: "85%", bx: "10%", by: "40%", cx: "90%", cy: "10%" },
    span: "lg:col-span-2 min-h-[16rem]",
  },
];
