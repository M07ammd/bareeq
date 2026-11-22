import type { Metadata } from "next";
import { siteConfig } from "@/data/site-config";

/** Builds consistent page metadata. Canonical is only emitted when a production domain is configured. */
export function buildMetadata(opts: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const { title, description, path } = opts;
  return {
    title,
    description,
    alternates: siteConfig.siteUrl ? { canonical: path } : undefined,
    openGraph: {
      title,
      description,
      url: siteConfig.siteUrl ? path : undefined,
      siteName: siteConfig.name,
      locale: "ar_EG",
      type: "website",
      images: [{ url: "/brand/logo-wordmark.png", width: 1200, height: 551, alt: "BAREEQ" }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
