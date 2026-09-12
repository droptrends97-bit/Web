"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/content";
import { EASE, transitions } from "@/lib/motion";

export default function Nav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setCondensed(latest > 40);
    setHidden(latest > previous && latest > 320 && !menuOpen);
  });

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: hidden ? -100 : 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE.outExpo }}
        className="fixed inset-x-0 top-0 z-[80]"
      >
        <div
          className={`gutter flex items-center justify-between transition-all duration-500 ${
            condensed
              ? "hairline-b h-14 bg-ink/85 backdrop-blur-md md:h-16"
              : "h-20 border-b-[0.5px] border-transparent md:h-24"
          }`}
        >
          <a href="#top" className="group flex items-baseline gap-1.5">
            <span className="display text-[1.375rem] tracking-[-0.03em] md:text-[1.5rem]">
              {site.name}
            </span>
            <span
              aria-hidden
              className="size-[3px] rotate-45 bg-vermillion transition-transform duration-500 group-hover:scale-150 group-focus-visible:scale-150"
            />
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group relative py-1 text-paper-2 transition-colors duration-300 hover:text-paper"
              >
                {item.label}
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-vermillion transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-focus-visible:origin-left group-hover:scale-x-100 group-focus-visible:scale-x-100"
                />
              </a>
            ))}
            <a
              href={`mailto:${site.email}`}
              className="group relative py-1 text-paper"
            >
              {site.email}
              <span aria-hidden className="absolute inset-x-0 -bottom-0.5 h-px bg-paper/30" />
              <span
                aria-hidden
                className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-vermillion transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="relative -mr-1 flex h-11 items-center px-1 md:hidden"
          >
            <span className="relative flex h-2.5 w-5 flex-col justify-between">
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 4.5 } : { rotate: 0, y: 0 }}
                transition={transitions.tap}
                className="block h-px w-full bg-paper"
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -4.5 } : { rotate: 0, y: 0 }}
                transition={transitions.tap}
                className="block h-px w-full bg-paper"
              />
            </span>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.75, ease: EASE.inOutQuart }}
            className="fixed inset-0 z-[75] bg-ink md:hidden"
          >
            <nav className="gutter flex h-full flex-col justify-end pb-20">
              {nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ y: 32, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.22 + i * 0.06, duration: 0.8, ease: EASE.outExpo }}
                  className="display hairline-t flex items-baseline justify-between py-4 text-[14vw]"
                >
                  {item.label}
                  <span className="label figure-num">0{i + 1}</span>
                </motion.a>
              ))}
              <motion.a
                href={`mailto:${site.email}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.8 }}
                className="hairline-t mt-8 pt-5 text-paper-2"
              >
                {site.email}
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
