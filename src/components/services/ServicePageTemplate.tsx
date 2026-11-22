import type { Service } from "@/data/services";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { ServiceHero } from "./ServiceHero";
import {
  ServiceBenefits,
  ServiceFAQ,
  ServiceFeatures,
  ServiceSteps,
  ServiceWhatIs,
} from "./ServiceSections";
import { ServicePricing } from "./ServicePricing";

/** The one shared template behind every /services/[slug] page. All content comes from src/data/services.ts. */
export function ServicePageTemplate({ service }: { service: Service }) {
  return (
    <>
      <ServiceHero service={service} />
      <ServiceWhatIs service={service} />
      <ServiceFeatures service={service} />
      <ServiceSteps service={service} />
      <ServiceBenefits service={service} />
      <ServicePricing service={service} />
      <ServiceFAQ service={service} />
      <ContactCTA href={`/contact?service=${service.slug}`} />
    </>
  );
}
