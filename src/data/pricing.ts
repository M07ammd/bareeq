/**
 * Pricing model. Prices are intentionally `null` — set a string such as "٩٩٩ ج.م" per plan
 * and per billing period to show it. While a price is null the UI shows CONTACT_FOR_PRICING.
 * No real prices, discounts or terms are invented here.
 */
export const CONTACT_FOR_PRICING = "تواصل معنا لمعرفة تفاصيل الاشتراك";

export type BillingPeriod = "monthly" | "yearly";

export type Plan = {
  id: string;
  name: string;
  description: string;
  features: string[];
  /** e.g. "٩٩٩ ج.م / شهريًا" — null means "not configured yet" */
  price: Record<BillingPeriod, string | null>;
  highlighted?: boolean;
  /** true for the bespoke tier, which never has a public price */
  custom?: boolean;
};

export function plan(
  id: string,
  name: string,
  description: string,
  features: string[],
  options: Partial<Pick<Plan, "price" | "highlighted" | "custom">> = {},
): Plan {
  return {
    id,
    name,
    description,
    features,
    price: options.price ?? { monthly: null, yearly: null },
    highlighted: options.highlighted,
    custom: options.custom,
  };
}
