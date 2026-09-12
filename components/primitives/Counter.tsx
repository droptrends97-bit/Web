"use client";

import { animate, useInView, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE } from "@/lib/motion";

type Props = {
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
};

/**
 * Counts from zero to `to` the first time it enters the viewport.
 * The rendered value is state-driven so it stays readable to screen readers
 * and to anyone who lands mid-animation.
 */
export default function Counter({ to, suffix = "", duration = 2, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const value = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, {
      duration,
      ease: EASE.outExpo,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, to, duration, value]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
