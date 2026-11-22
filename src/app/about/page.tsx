import { buildMetadata } from "@/lib/metadata";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ContactCTA } from "@/components/sections/ContactCTA";

export const metadata = buildMetadata({
  title: "من نحن | BAREEQ وكالة النمو بالذكاء الاصطناعي",
  description:
    "BAREEQ وكالة تجمع بين الذكاء الاصطناعي والأتمتة الذكية وتطوير تجربة العملاء والإبداع البصري لمساعدة البيزنس على النمو.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <AboutSection asPage />
      <ProcessSection />
      <ContactCTA />
    </>
  );
}
