import { buildMetadata } from "@/lib/metadata";
import { Hero } from "@/components/sections/Hero";
import { MarqueeBand } from "@/components/sections/MarqueeBand";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { CreativeShowcase } from "@/components/sections/CreativeShowcase";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ContactCTA } from "@/components/sections/ContactCTA";

export const metadata = buildMetadata({
  title: "BAREEQ | حلول ذكية وأتمتة وإبداع بالذكاء الاصطناعي للبيزنس",
  description:
    "BAREEQ وكالة نمو بالذكاء الاصطناعي: أتمتة وحلول ذكية، أنظمة للمطاعم والكافيهات، وإعلانات وموشن جرافيك بالذكاء الاصطناعي.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <MarqueeBand />
      <ServicesSection />
      <CreativeShowcase />
      <AboutSection />
      <ProcessSection />
      <ContactCTA />
    </>
  );
}
