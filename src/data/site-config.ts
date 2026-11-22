/**
 * Central, editable site configuration.
 * Every value that needs real business information is `null` until you fill it in.
 * Nothing here is invented: empty values are shown to visitors as "coming soon" placeholders.
 */
export const siteConfig = {
  name: "BAREEQ",
  nameAr: "بريق",
  tagline: "AI-Powered Growth Agency",
  description:
    "بنساعد البيزنس يشتغل بذكاء، يطوّر تجربة عملائه، ويخلق حضور أقوى باستخدام الذكاء الاصطناعي والأتمتة والإبداع.",

  /** Production domain, e.g. "https://bareeq.example". Enables canonical URLs + sitemap. */
  siteUrl: null as string | null,

  contact: {
    email: null as string | null,
    phone: "01228040614" as string | null,
    whatsapp: "+201228040614" as string | null,
    /**
     * REQUIRED to make the contact form deliver messages.
     * Any endpoint that accepts a JSON POST works (Formspree, Resend route, your own API...).
     * Payload: { name, email, business, service, message }
     * While null, the form validates but clearly tells the visitor nothing was sent.
     */
    formEndpoint: null as string | null,
  },

  social: {
    instagram: null as string | null,
    facebook: null as string | null,
    tiktok: null as string | null,
    linkedin: null as string | null,
    x: null as string | null,
    youtube: null as string | null,
  },

  /**
   * Set to a real checkout/payment URL only when a payment provider exists.
   * While null, subscription buttons route to the contact form (never to a fake checkout).
   */
  paymentProvider: null as string | null,
};

export type SiteConfig = typeof siteConfig;
