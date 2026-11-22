import { SlashIntro } from "@/components/sections/SlashIntro";
import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { alexandria, outfit, plex } from "@/lib/fonts";
import { siteConfig } from "@/data/site-config";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/animations/Providers";
import { ScrollProgress } from "@/components/animations/ScrollProgress";

export const metadata: Metadata = {
  metadataBase: siteConfig.siteUrl ? new URL(siteConfig.siteUrl) : undefined,
  title: {
    default: "BAREEQ | وكالة نمو بالذكاء الاصطناعي والأتمتة والإبداع",
    template: "%s",
  },
  description: siteConfig.description,
  openGraph: {
    siteName: siteConfig.name,
    locale: "ar_EG",
    type: "website",
    images: [{ url: "/brand/logo-wordmark.png", width: 1200, height: 551, alt: "BAREEQ" }],
  },
  icons: { icon: "/brand/logo-b.png" },
};

export const viewport: Viewport = {
  themeColor: "#101224",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${alexandria.variable} ${plex.variable} ${outfit.variable}`}>
      <body>
        <Providers>
          <a href="#main" className="skip-link">
            تخطّي إلى المحتوى
          </a>
          <SlashIntro />
        <ScrollProgress />
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
