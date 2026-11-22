"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CONTACT_FOR_PRICING, type BillingPeriod } from "@/data/pricing";
import { siteConfig } from "@/data/site-config";
import type { Service } from "@/data/services";

const periods: { id: BillingPeriod; label: string }[] = [
  { id: "monthly", label: "اشتراك شهري" },
  { id: "yearly", label: "اشتراك سنوي" },
];

export function ServicePricing({ service }: { service: Service }) {
  const [period, setPeriod] = useState<BillingPeriod>("monthly");

  // Subscribe goes to checkout ONLY if a payment provider is configured; otherwise to the contact form.
  const subscribeHref = (planId: string) =>
    siteConfig.paymentProvider
      ? `${siteConfig.paymentProvider}?service=${service.slug}&plan=${planId}&period=${period}`
      : `/contact?service=${service.slug}&plan=${planId}&period=${period}`;

  return (
    <section id="plans" aria-labelledby="plans-title" className="scroll-mt-4 bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          id="plans-title"
          align="center"
          title="خطط الاشتراك"
          description="اختار الخطة المناسبة، أو تواصل معنا لحل مخصص حسب احتياجك."
        />

        <div
          role="radiogroup"
          aria-label="فترة الاشتراك"
          className="chrome-ring mx-auto mt-10 flex w-fit rounded-full bg-soft p-1.5"
        >
          {periods.map((p) => {
            const selected = period === p.id;
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setPeriod(p.id)}
                className="relative rounded-full px-6 py-2.5 font-display text-[0.95rem] font-semibold"
              >
                {selected && (
                  <motion.span
                    layoutId={`period-pill-${service.slug}`}
                    className="absolute inset-0 rounded-full bg-navy"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={`relative ${selected ? "text-white" : "text-navy"}`}>{p.label}</span>
              </button>
            );
          })}
        </div>

        <ul className="mt-12 grid gap-6 lg:grid-cols-3">
          {service.plans.map((plan) => {
            const price = plan.custom ? null : plan.price[period];
            return (
              <li key={plan.id} className="list-none">
                <article
                  className={`holo-ring chrome-ring relative flex h-full flex-col rounded-[1.75rem] p-8 ${
                    plan.highlighted ? "bg-night on-dark text-white" : "bg-soft"
                  }`}
                >
                  <h3 className={`text-2xl font-bold ${plan.highlighted ? "text-white" : "text-navy"}`}>
                    {plan.name}
                  </h3>
                  <p className={`mt-2 ${plan.highlighted ? "text-white/75" : "text-ink-soft"}`}>
                    {plan.description}
                  </p>

                  <p
                    className={`mt-6 min-h-[3.5rem] font-display text-lg font-semibold ${
                      plan.highlighted ? "text-white" : "text-navy"
                    }`}
                  >
                    {price ?? CONTACT_FOR_PRICING}
                  </p>

                  <ul className="mt-6 flex-1 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-3">
                        <span
                          aria-hidden
                          className="mt-2.5 h-2 w-2 shrink-0 rounded-full"
                          style={{ background: "var(--holo-gradient)" }}
                        />
                        <span className={plan.highlighted ? "text-white/85" : "text-ink-soft"}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    href={plan.custom ? `/contact?service=${service.slug}&plan=custom` : subscribeHref(plan.id)}
                    variant={plan.highlighted ? "chrome" : "outline"}
                    className="mt-8 w-full"
                  >
                    {plan.custom ? "اطلب حل مخصص" : siteConfig.paymentProvider ? "اشترك الآن" : "اطلب هذه الخطة"}
                  </Button>
                </article>
              </li>
            );
          })}
        </ul>

        {!siteConfig.paymentProvider && (
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-ink-soft">
            الدفع الإلكتروني غير مفعّل حاليًا. الضغط على أي خطة بيفتح نموذج التواصل لتأكيد التفاصيل معاك.
          </p>
        )}
      </div>
    </section>
  );
}
