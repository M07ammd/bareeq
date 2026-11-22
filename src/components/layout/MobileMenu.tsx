"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { navCta, navLinks } from "@/data/navigation";
import { Button } from "@/components/ui/Button";

export function MobileMenu({
  open,
  activeHref,
  onSelect,
  onClose,
}: {
  open: boolean;
  activeHref?: string;
  onSelect?: (href: string) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="nav-glass chrome-ring mx-auto mt-2 max-w-6xl rounded-3xl p-4 lg:hidden backdrop-blur-2xl"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((l) => {
              const isActive = activeHref === l.href;
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => {
                      onSelect?.(l.href);
                      onClose();
                    }}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3.5 font-display text-lg font-medium transition-all ${
                      isActive
                        ? "bg-white/15 text-white shadow-inner font-semibold"
                        : "text-white/75 hover:bg-white/10 hover:text-white active:bg-white/10"
                    }`}
                  >
                    <span>{l.label}</span>
                    {isActive && (
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{
                          background: "var(--holo-gradient)",
                          boxShadow: "0 0 8px rgba(166, 106, 255, 0.9)",
                        }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Button
            href={navCta.href}
            onClick={() => {
              onSelect?.(navCta.href);
              onClose();
            }}
            size="lg"
            className="mt-3 w-full"
          >
            {navCta.label}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
