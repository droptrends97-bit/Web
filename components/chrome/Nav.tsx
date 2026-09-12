"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/content";
import { EASE, transitions } from "@/lib/motion";
import Magnetic from "@/components/primitives/Magnetic";

export default function Nav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setCondensed(latest > 40);
    // Only retreat once past the fold, and never while the menu is open.
    setHidden(latest > previous && latest > 320 && !menuOpen);
  });

  /* Lock the page while the overlay is up. */
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
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? -100 : 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE.outExpo }}
        className="fixed inset-x-0 top-0 z-[120]"
      >
        <div
          className={`gutter flex items-center justify-between transition-all duration-500 ${
            condensed
              ? "hairline-b panel h-16 md:h-[68px]"
              : "h-20 border-b-[0.5px] border-transparent md:h-24"
          }`}
        >
          {/* wordmark */}
          <a
            href="#top"
            className="group relative flex items-baseline gap-2"
            data-cursor="hover"
          >
            <span className="display text-[1.15rem] font-semibold tracking-[-0.06em] md:text-[1.35rem]">
              {site.name}
            </span>
            <span
              aria-hidden
              className="size-1 rounded-full bg-acid transition-transform duration-500 group-hover:scale-[2.4]"
            />
          </a>

          {/* desktop links */}
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                data-cursor="hover"
                className="group relative rounded-full px-4 py-2 font-mono text-[11px] font-medium tracking-[0.14em] text-ash uppercase transition-colors duration-300 hover:text-bone"
              >
                <span className="relative z-10">{item.label}</span>
                <span
                  aria-hidden
                  className="absolute inset-0 scale-75 rounded-full bg-bone/[0.06] opacity-0 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100"
                />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Magnetic strength={10} innerStrength={5} className="hidden md:block">
              <a
                href="#studio"
                data-cursor="hover"
                className="group relative inline-flex items-center overflow-hidden rounded-full bg-bone px-5 py-2.5 font-mono text-[11px] font-semibold tracking-[0.14em] text-void uppercase"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-acid transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
                <span className="relative">Start a project</span>
              </a>
            </Magnetic>

            {/* menu toggle */}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              data-cursor="hover"
              className="hairline relative flex size-11 items-center justify-center rounded-full md:hidden"
            >
              <span className="relative flex h-2.5 w-4 flex-col justify-between">
                <motion.span
                  animate={menuOpen ? { rotate: 45, y: 4.5 } : { rotate: 0, y: 0 }}
                  transition={transitions.tap}
                  className="block h-[1.5px] w-full bg-bone"
                />
                <motion.span
                  animate={menuOpen ? { rotate: -45, y: -4.5 } : { rotate: 0, y: 0 }}
                  transition={transitions.tap}
                  className="block h-[1.5px] w-full bg-bone"
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* full-screen overlay menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: EASE.inOutQuart }}
            className="fixed inset-0 z-[115] bg-pitch md:hidden"
          >
            <div
              aria-hidden
              className="bloom size-[70vw] -top-[10vh] -right-[20vw] bg-violet-glow/25"
            />
            <nav className="gutter relative flex h-full flex-col justify-center gap-2">
              {nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.8, ease: EASE.outExpo }}
                  className="display hairline-b flex items-baseline justify-between py-5 text-[13vw] text-bone"
                >
                  {item.label}
                  <span className="font-mono text-[11px] tracking-[0.2em] text-smoke">
                    0{i + 1}
                  </span>
                </motion.a>
              ))}
              <motion.a
                href={`mailto:${site.email}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="mt-10 font-mono text-xs tracking-[0.16em] text-acid uppercase"
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
