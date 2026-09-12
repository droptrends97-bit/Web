"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { useHasPointer } from "@/lib/hooks";

type Props = {
  children: React.ReactNode;
  /** How far the element is allowed to chase the pointer, in px. */
  strength?: number;
  /** Inner content drifts further than the shell for a parallax feel. */
  innerStrength?: number;
  className?: string;
};

/**
 * Magnetic wrapper: the element leans toward the pointer while it is nearby
 * and springs home on exit. Two layers move at different rates so the label
 * appears to float slightly ahead of its container.
 */
export default function Magnetic({
  children,
  strength = 22,
  innerStrength = 12,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const hasPointer = useHasPointer();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const spring = { stiffness: 260, damping: 18, mass: 0.5 };
  const x = useSpring(mx, spring);
  const y = useSpring(my, spring);

  const innerX = useTransform(x, (v) => (v / strength) * innerStrength);
  const innerY = useTransform(y, (v) => (v / strength) * innerStrength);

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!hasPointer || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    // Normalise pointer offset to [-1, 1] across each axis, then scale.
    const nx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const ny = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    mx.set(Math.max(-1, Math.min(1, nx)) * strength);
    my.set(Math.max(-1, Math.min(1, ny)) * strength);
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x, y }}
      className={className}
    >
      <motion.div style={{ x: innerX, y: innerY }}>{children}</motion.div>
    </motion.div>
  );
}
