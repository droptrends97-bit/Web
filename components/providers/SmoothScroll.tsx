"use client";

import { MotionConfig } from "framer-motion";
import Lenis from "lenis";
import { useEffect } from "react";
import { createContext, useContext, useRef, useState } from "react";

const LenisContext = createContext<Lenis | null>(null);

/** Access the live Lenis instance (null until mount / on reduced-motion). */
export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Motion + smooth-scroll wrapper.
 *
 * Lenis drives the real window scroll position (rather than transforming a
 * container), so `useScroll`, IntersectionObserver and anchor offsets all keep
 * working — scroll-bound animation stays in sync for free.
 *
 * Opted out entirely when the user prefers reduced motion. The CSS media query
 * in globals.css only reaches CSS animations, so `MotionConfig reducedMotion`
 * is what stops Framer Motion's transform work for those users — opacity still
 * cross-fades, which is the accessible behaviour rather than a hard cut.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({
      duration: 1.15,
      // Gentle exponential decay — long tail, no rubber-band at the end.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      // Native momentum on touch beats an emulated one.
      syncTouch: false,
    });

    const raf = (time: number) => {
      instance.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    setLenis(instance);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  /* Intercept in-page anchors so they ease rather than jump. */
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;

      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;

      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      if (lenis) {
        lenis.scrollTo(target as HTMLElement, { offset: -24, duration: 1.4 });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [lenis]);

  return (
    <MotionConfig reducedMotion="user">
      <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
    </MotionConfig>
  );
}
