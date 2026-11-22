"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navCta, navLinks } from "@/data/navigation";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // close the mobile menu whenever the route changes
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : !href.includes("#") && pathname.startsWith(href);

  return (
    <header className="on-dark fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-5">
      <nav
        aria-label="التنقل الرئيسي"
        className="nav-glass chrome-ring mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full py-2 ps-5 pe-2.5"
      >
        <Link href="/" aria-label="BAREEQ — الصفحة الرئيسية" className="flex items-center">
          <Image
            src="/brand/logo-b.webp"
            alt="BAREEQ"
            width={900}
            height={693}
            priority
            className="h-9 w-auto md:h-10"
          />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`relative rounded-full px-4 py-2 font-display text-[0.95rem] font-medium transition-colors hover:bg-white/10 hover:text-white ${
                  isActive(l.href) ? "text-white" : "text-white/75"
                }`}
              >
                {l.label}
                {isActive(l.href) && (
                  <span
                    aria-hidden
                    className="absolute inset-x-4 -bottom-0.5 h-px"
                    style={{ background: "var(--holo-gradient)" }}
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button href={navCta.href} className="hidden !min-h-11 !py-2 sm:inline-flex">
            {navCta.label}
          </Button>
          <button
            type="button"
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white lg:hidden"
          >
            <span aria-hidden className="relative block h-3.5 w-5">
              <span
                className={`absolute inset-x-0 h-0.5 rounded bg-current transition-all ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute inset-x-0 top-1.5 h-0.5 rounded bg-current transition-opacity ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute inset-x-0 h-0.5 rounded bg-current transition-all ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
