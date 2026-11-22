import { Suspense } from "react";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/data/site-config";
import { ContactForm } from "@/components/sections/ContactForm";
import { ChromeSparkle } from "@/components/ui/ChromeSparkle";

export const metadata = buildMetadata({
  title: "تواصل معنا | ابدأ مشروعك مع BAREEQ",
  description: "ابعتلنا تفاصيل مشروعك ونرد عليك. أتمتة، حلول للمطاعم والكافيهات، وإعلانات بالذكاء الاصطناعي.",
  path: "/contact",
});

export default function ContactPage() {
  const { contact } = siteConfig;
  const hasDirect = contact.email || contact.phone || contact.whatsapp;

  return (
    <section aria-labelledby="contact-title" className="bg-silver relative overflow-hidden pb-24 pt-40 md:pb-32">
      <ChromeSparkle
        idSuffix="contact-a"
        className="float-slow pointer-events-none absolute end-[6%] top-28 w-20 opacity-90 md:w-32"
      />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h1 id="contact-title" className="text-4xl font-bold text-navy md:text-6xl">
            خلينا نبدأ مشروعك.
          </h1>
          <p className="mt-5 max-w-md text-lg text-ink-soft">
            احكيلنا عن بيزنسك واللي محتاجه، ونرجعلك بخطوة واضحة.
          </p>

          <div className="mt-10 space-y-3 text-ink-soft">
            {contact.email && (
              <p>
                البريد: <a className="font-semibold text-navy hover:text-electric" dir="ltr" href={`mailto:${contact.email}`}>{contact.email}</a>
              </p>
            )}
            {contact.phone && (
              <p>
                الهاتف: <a className="font-semibold text-navy hover:text-electric" dir="ltr" href={`tel:${contact.phone}`}>{contact.phone}</a>
              </p>
            )}
            {contact.whatsapp && (
              <p>
                <a
                  className="font-semibold text-navy hover:text-electric"
                  href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  راسلنا على واتساب
                </a>
              </p>
            )}
            {!hasDirect && <p className="text-sm">وسائل التواصل المباشر هتتضاف قريبًا. النموذج هو الطريق حاليًا.</p>}
          </div>
        </div>

        <Suspense fallback={<div className="glass min-h-[30rem] rounded-[2rem]" aria-busy="true" />}>
          <ContactForm />
        </Suspense>
      </div>
    </section>
  );
}
