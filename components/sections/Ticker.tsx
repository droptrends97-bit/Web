"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ticker } from "@/lib/content";
import Marquee from "@/components/primitives/Marquee";

function Row({ reverse, duration }: { reverse?: boolean; duration: number }) {
  return (
    <Marquee duration={duration} reverse={reverse}>
      {ticker.map((word, i) => (
        <span key={`${word}-${i}`} className="flex shrink-0 items-center">
          <span
            className={`display px-[0.35em] text-[clamp(2rem,6vw,5.5rem)] whitespace-nowrap ${
              i % 2 === 0 ? "text-bone/90" : "text-hollow"
            }`}
          >
            {word}
          </span>
          <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-acid" />
        </span>
      ))}
    </Marquee>
  );
}

/**
 * Two counter-running bands of disciplines.
 *
 * The pair is skewed and scroll-bound: as the band crosses the viewport it
 * slides laterally in opposite directions, so the rows shear against each other.
 */
export default function Ticker() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const still = useReducedMotion();
  const shiftA = useTransform(scrollYProgress, [0, 1], still ? ["0%", "0%"] : ["-6%", "6%"]);
  const shiftB = useTransform(scrollYProgress, [0, 1], still ? ["0%", "0%"] : ["6%", "-6%"]);

  return (
    <div ref={ref} className="relative isolate overflow-hidden py-10 md:py-16">
      <div
        aria-hidden
        className="bloom size-[36rem] -top-[14rem] left-1/2 -translate-x-1/2 bg-violet-glow/12"
      />
      <div className="hairline-t hairline-b -rotate-[1.4deg] scale-[1.06] bg-carbon/40 py-4 backdrop-blur-[2px] md:py-6">
        <motion.div style={{ x: shiftA }}>
          <Row duration={44} />
        </motion.div>
        <motion.div style={{ x: shiftB }} className="mt-2 md:mt-4">
          <Row duration={52} reverse />
        </motion.div>
      </div>
    </div>
  );
}
