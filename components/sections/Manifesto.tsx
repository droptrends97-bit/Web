"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { manifesto } from "@/lib/content";
import { inViewLoose } from "@/lib/motion";

/**
 * One word of the manifesto. Its opacity and colour are bound directly to the
 * section's scroll progress, so the sentence writes itself as you descend —
 * nothing is time-based, everything is scrubbable.
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
  const opacity = useTransform(progress, range, [0.12, 1]);
  const blur = useTransform(progress, range, [4, 0]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  return (
    <span className="relative mr-[0.28em] inline-block">
      {/* The dim ghost stays put so the paragraph never reflows or flickers. */}
      <span aria-hidden className="absolute inset-0 text-smoke/20">
        {children}
      </span>
      <motion.span style={{ opacity, filter }} className="relative">
        {children}
      </motion.span>
    </span>
  );
}

export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    // Starts writing as the block reaches mid-screen, finishes before it exits.
    offset: ["start 0.82", "end 0.55"],
  });

  const words = manifesto.body.split(" ");

  return (
    <section ref={ref} className="section-y relative isolate">
      <div
        aria-hidden
        className="bloom size-[40rem] top-1/4 -left-[16rem] bg-violet-glow/14"
      />
      <div className="gutter mx-auto max-w-[110rem]">
        <div className="grid gap-10 md:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={inViewLoose}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-3"
          >
            <div className="hairline-t flex items-center gap-3 pt-4">
              <span className="eyebrow">{manifesto.eyebrow}</span>
              <span aria-hidden className="h-px flex-1 bg-bone/10" />
            </div>
          </motion.div>

          <p className="display text-h2 font-medium md:col-span-9 md:col-start-4">
            {words.map((word, i) => {
              const start = i / words.length;
              const end = start + 1 / words.length;
              return (
                <Word key={`${word}-${i}`} range={[start, end]} progress={scrollYProgress}>
                  {word}
                </Word>
              );
            })}
          </p>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={inViewLoose}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-serif-accent text-lead text-smoke italic md:col-span-9 md:col-start-4"
          >
            {manifesto.signature}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
