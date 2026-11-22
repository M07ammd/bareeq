"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { navCta, navLinks } from "@/data/navigation";
import { Button } from "@/components/ui/Button";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
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
          className="nav-glass chrome-ring mx-auto mt-2 max-w-6xl rounded-3xl p-4 lg:hidden"
        >
          <ul className="flex flex-col">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={onClose}
                  className="block rounded-2xl px-4 py-3.5 font-display text-lg font-medium text-white/90 active:bg-white/10"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button href={navCta.href} size="lg" className="mt-3 w-full">
            {navCta.label}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
