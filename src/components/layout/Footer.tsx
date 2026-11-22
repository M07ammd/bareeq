import Image from "next/image";
import Link from "next/link";
import { navLinks } from "@/data/navigation";
import { services } from "@/data/services";
import { siteConfig } from "@/data/site-config";

const socialLabels: Record<string, string> = {
  instagram: "إنستجرام",
  facebook: "فيسبوك",
  tiktok: "تيك توك",
  linkedin: "لينكدإن",
  x: "إكس",
  youtube: "يوتيوب",
};

const linkCls = "text-white/65 transition-colors hover:text-white";

export function Footer() {
  const { contact, social } = siteConfig;
  const socials = Object.entries(social).filter(([, url]) => !!url) as [string, string][];
  const hasContact = contact.email || contact.phone || contact.whatsapp;

  return (
    <footer
      className="bg-night on-dark relative overflow-hidden"
      style={{ ["--gx" as string]: "85%", ["--gy" as string]: "0%" } as React.CSSProperties}
    >
      {/* holographic hairline: the one colour accent in the footer */}
      <div aria-hidden className="h-px w-full" style={{ background: "var(--holo-gradient)" }} />
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1.2fr_1fr]">
        <div>
          <Image
            src="/brand/logo-b.webp"
            alt="BAREEQ"
            width={900}
            height={693}
            className="h-20 w-auto drop-shadow-[0_8px_30px_rgb(83_108_255/0.35)]"
          />
          <p className="mt-5 max-w-xs text-[0.95rem] text-white/65">
            وكالة تجمع بين الذكاء الاصطناعي والأتمتة وتطوير تجربة العملاء والإبداع البصري، لمساعدة
            البيزنس على التطور والنمو.
          </p>
        </div>

        <nav aria-label="روابط الموقع">
          <h2 className="font-display text-base font-semibold text-white">الموقع</h2>
          <ul className="mt-4 space-y-2.5">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkCls}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="روابط الخدمات">
          <h2 className="font-display text-base font-semibold text-white">خدماتنا</h2>
          <ul className="mt-4 space-y-2.5">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className={linkCls}>
                  {s.nameAr}
                  {s.category === "hospitality" && (
                    <span className="font-latin text-sm text-white/45"> | {s.nameEn}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-base font-semibold text-white">تواصل معنا</h2>
          <ul className="mt-4 space-y-2.5 text-white/65">
            {contact.email && (
              <li>
                <a href={`mailto:${contact.email}`} className="hover:text-white" dir="ltr">
                  {contact.email}
                </a>
              </li>
            )}
            {contact.phone && (
              <li>
                <a href={`tel:${contact.phone}`} className="hover:text-white" dir="ltr">
                  {contact.phone}
                </a>
              </li>
            )}
            {contact.whatsapp && (
              <li>
                <a
                  href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  واتساب
                </a>
              </li>
            )}
            {!hasContact && (
              <li className="text-sm">بيانات التواصل المباشر قيد الإضافة. استخدم نموذج التواصل.</li>
            )}
            <li>
              <Link href="/contact" className="font-semibold text-white hover:text-[#dce0e9]">
                أرسل لنا رسالة
              </Link>
            </li>
          </ul>

          {socials.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="حسابات التواصل الاجتماعي">
              {socials.map(([key, url]) => (
                <li key={key}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-dark inline-block rounded-full px-4 py-1.5 text-sm text-white hover:bg-white/15"
                  >
                    {socialLabels[key] ?? key}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-6 py-6 text-sm text-white/50">
          © {new Date().getFullYear()} BAREEQ. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}
