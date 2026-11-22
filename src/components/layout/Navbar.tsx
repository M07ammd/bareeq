"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { navCta, navLinks } from "@/data/navigation";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<string>(pathname);

  // Close mobile menu whenever the route changes
  useEffect(() => setOpen(false), [pathname]);

  // Sync active link with route & scroll position
  useEffect(() => {
    if (pathname !== "/") {
      setActiveHref(pathname);
      return;
    }

    // On home page: check hash or scroll position
    if (typeof window !== "undefined" && window.location.hash === "#services") {
      setActiveHref("/#services");
    } else {
      setActiveHref("/");
    }

    const handleScroll = () => {
      const servicesEl = document.getElementById("services");
      if (!servicesEl) return;

      const rect = servicesEl.getBoundingClientRect();
      // When services section enters viewport
      if (rect.top <= 260 && rect.bottom >= 180) {
        setActiveHref("/#services");
      } else if (window.scrollY < 350) {
        setActiveHref("/");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return (
    <header className="on-dark fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-5">
      <nav
        aria-label="التنقل الرئيسي"
        className="nav-glass chrome-ring mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full py-2 ps-5 pe-2.5 backdrop-blur-xl"
      >
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={() => setActiveHref("/")}
          aria-label="BAREEQ — الصفحة الرئيسية"
          className="flex items-center"
        >
          <Image
            src="/brand/logo-b.webp"
            alt="BAREEQ"
            width={900}
            height={693}
            priority
            className="h-9 w-auto md:h-10"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => {
            const isActive = activeHref === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setActiveHref(l.href)}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative rounded-full px-4 py-2 font-display text-[0.95rem] font-medium transition-colors hover:bg-white/10 hover:text-white ${
                    isActive ? "text-white font-semibold" : "text-white/70"
                  }`}
                >
                  {l.label}
                  {/* Active Indicator Line with smooth layoutId animation */}
                  {isActive && (
                    <motion.span
                      layoutId="navbar-active-line"
                      className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full"
                      style={{
                        background: "var(--holo-gradient)",
                        boxShadow: "0 0 10px rgba(166, 106, 255, 0.75)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* CTA & Mobile Toggle */}
        <div className="flex items-center gap-2">
          <Button
            href={navCta.href}
            onClick={() => setActiveHref(navCta.href)}
            className="hidden !min-h-11 !py-2 sm:inline-flex"
          >
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

      <MobileMenu
        open={open}
        activeHref={activeHref}
        onSelect={(href) => setActiveHref(href)}
        onClose={() => setOpen(false)}
      />
    </header>
  );
}
