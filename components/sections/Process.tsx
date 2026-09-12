"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { process } from "@/lib/content";
import { EASE, inViewLoose } from "@/lib/motion";

/**
 * One step in the stack.
 *
 * Cards pin at the same offset and the outgoing one sinks under a scrim as the
 * next slides over it. Opacity is deliberately NOT animated on the card itself:
 * a translucent card lets the one beneath bleed through the stack.
 */
function Step({
  item,
  index,
  total,
}: {
  item: (typeof process)[number];
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const still = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.32", "end 0.1"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, still ? 1 : 0.94]);
  const scrim = useTransform(scrollYProgress, [0, 1], [0, 0.78]);

  return (
    <div
      ref={ref}
      className="sticky"
      style={{ top: `calc(16vh + ${index * 0.9}rem)` }}
    >
      <motion.article
        style={{ scale, transformOrigin: "center top" }}
        className="hairline relative overflow-hidden bg-ink-card"
      >
        <motion.div
          aria-hidden
          style={{ opacity: scrim }}
          className="absolute inset-0 z-10 bg-ink"
        />
        <div className="relative z-0 grid min-h-[17rem] gap-5 p-7 md:grid-cols-12 md:gap-8 md:p-12">
          <div className="flex items-baseline gap-4 md:col-span-3 md:block">
            <span className="display figure-num text-[2.75rem] leading-none text-vermillion md:text-[4rem]">
              {item.step}
            </span>
            <p className="label md:mt-4">{item.weeks}</p>
            <p className="label hidden md:mt-1 md:block">
              Step {index + 1} / {total}
            </p>
          </div>

          <div className="md:col-span-8 md:col-start-5">
            <h3 className="display text-h2">{item.title}</h3>
            <p className="text-lead mt-5 max-w-[44ch] text-paper-2">{item.body}</p>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export default function Process() {
  return (
    <section id="process" className="section-y">
      <div className="gutter mx-auto max-w-[104rem]">
        <div className="hairline-b mb-12 flex flex-wrap items-baseline justify-between gap-4 pb-4 md:mb-20">
          <h2 className="label">How a project runs</h2>
          <p className="label">Sixteen weeks, typically</p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={inViewLoose}
          transition={{ duration: 0.9, ease: EASE.outExpo }}
          className="flex flex-col gap-5"
        >
          {process.map((item, i) => (
            <Step key={item.step} item={item} index={i} total={process.length} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
