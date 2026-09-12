"use client";

import { AnimatePresence, animate, motion, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import { site } from "@/lib/content";
import { EASE } from "@/lib/motion";

/**
 * Entry curtain.
 *
 * Runs once per tab (sessionStorage), covers the web-font swap, and exits with
 * a clip-path wipe rather than a fade so the page underneath feels revealed.
 * Skipped entirely for reduced-motion users.
 */
export default function Preloader() {
  const [done, setDone] = useState(true);
  const [count, setCount] = useState(0);
  const value = useMotionValue(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem("nocturne:entered");
    if (reduced || seen) return;

    setDone(false);
    document.documentElement.style.overflow = "hidden";

    const controls = animate(value, 100, {
      duration: 1.5,
      ease: EASE.inOutQuart,
      onUpdate: (latest) => setCount(Math.round(latest)),
      onComplete: () => {
        sessionStorage.setItem("nocturne:entered", "1");
        window.setTimeout(() => setDone(true), 260);
      },
    });

    return () => {
      controls.stop();
      document.documentElement.style.overflow = "";
    };
  }, [value]);

  useEffect(() => {
    if (done) document.documentElement.style.overflow = "";
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 1, ease: EASE.inOutQuart }}
          className="fixed inset-0 z-[300] flex flex-col justify-between bg-void p-6 md:p-10"
        >
          <div className="flex items-baseline justify-between">
            <span className="display text-[1.15rem] tracking-[-0.06em]">{site.name}</span>
            <span className="eyebrow">{site.tagline}</span>
          </div>

          <div className="flex items-end justify-between">
            <span className="display text-[clamp(4rem,18vw,14rem)] leading-[0.8] tabular-nums">
              {String(count).padStart(3, "0")}
            </span>
            <span className="eyebrow mb-3">Loading</span>
          </div>

          {/* fill rail */}
          <div className="h-px w-full bg-bone/10">
            <motion.div
              className="h-full origin-left bg-acid"
              style={{ scaleX: count / 100 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
