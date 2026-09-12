"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { manifesto } from "@/lib/content";
import { EASE, inViewLoose } from "@/lib/motion";

/**
 * One word, its brightness bound to the section's scroll position. The
 * sentence is written as you descend — scrubbable both ways, never timed.
 */
function Word({
  children,
  range,
  progress,
}: {
  children: string;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);

  return (
    <span className="relative mr-[0.26em] inline-block">
      {/* The dim copy holds the layout so nothing reflows as words light up. */}
      <span aria-hidden className="absolute inset-0 text-paper-4">
        {children}
      </span>
      <motion.span style={{ opacity }} className="relative">
        {children}
      </motion.span>
    </span>
  );
}

export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.6"],
  });

  const words = manifesto.body.split(" ");

  return (
    <section ref={ref} className="section-y">
      <div className="gutter mx-auto max-w-[104rem]">
        <div className="grid gap-8 md:grid-cols-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={inViewLoose}
            transition={{ duration: 0.9, ease: EASE.outExpo }}
            className="md:col-span-2"
          >
            <p className="label hairline-t pt-4">{manifesto.eyebrow}</p>
          </motion.div>

          <p className="display text-h2 leading-[1.04] md:col-span-9 md:col-start-4">
            {words.map((word, i) => {
              const start = i / words.length;
              return (
                <Word
                  key={`${word}-${i}`}
                  range={[start, start + 1 / words.length]}
                  progress={scrollYProgress}
                >
                  {word}
                </Word>
              );
            })}
          </p>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={inViewLoose}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="label mt-8 md:col-span-9 md:col-start-4"
          >
            {manifesto.attribution}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
