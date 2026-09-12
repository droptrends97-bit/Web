"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Hairline progress rail pinned to the top of the viewport.
 * Springs the raw scroll fraction so it glides instead of stepping.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.0005,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[150] h-px origin-left bg-gradient-to-r from-violet-glow via-acid to-ember"
    />
  );
}
