"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Hairline progress rail. One colour, not a spectrum — it is a position
 * indicator, not an ornament.
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
      className="fixed inset-x-0 top-0 z-[70] h-px origin-left bg-vermillion/70"
    />
  );
}
