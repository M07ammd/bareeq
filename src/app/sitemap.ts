import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { siteConfig } from "@/data/site-config";

// Only emitted once siteConfig.siteUrl (the production domain) is set.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.siteUrl;
  if (!base) return [];
  const paths = ["/", "/about", "/contact", ...services.map((s) => `/services/${s.slug}`)];
  return paths.map((p) => ({ url: `${base}${p}`, lastModified: new Date() }));
}
