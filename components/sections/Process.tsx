"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { process } from "@/lib/content";
import { EASE, inViewLoose } from "@/lib/motion";

/**
 * One step in the stack.
 *
 * Every card pins to the same offset and the outgoing card scales down and
 * darkens as the next one slides over it — the deck compresses as you scroll
 * rather than each step simply scrolling past.
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
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.35", "end 0.1"],
  });

  // Cards deeper in the stack settle slightly smaller and fall into shadow.
  // Opacity is deliberately NOT animated: a translucent card would let the one
  // beneath it bleed through the stack. A scrim does the dimming instead.
  const still = useReducedMotion();
  const scale = useTransform(scrollYProgress, [0, 1], [1, still ? 1 : 0.91]);
  const scrim = useTransform(scrollYProgress, [0, 1], [0, 0.72]);

  return (
    <div
      ref={ref}
      className="sticky"
      // Each card pins a little lower, so the stack fans out at the top edge.
      style={{ top: `calc(14vh + ${index * 1.1}rem)` }}
    >
      <motion.article
        style={{ scale, transformOrigin: "center top" }}
        className="hairline relative overflow-hidden rounded-[4px] bg-carbon shadow-[0_-24px_60px_-20px_rgba(0,0,0,0.9)]"
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 120% at 88% 0%, rgba(122,82,255,0.14), transparent 62%)",
          }}
        />
        {/* the scrim that sinks this card as the next one arrives */}
        <motion.div
          aria-hidden
          style={{ opacity: scrim }}
          className="absolute inset-0 z-10 bg-void"
        />
        <div className="relative z-0 grid min-h-[18rem] gap-6 p-8 md:grid-cols-12 md:items-start md:gap-10 md:p-14">
          <div className="flex items-center gap-4 md:col-span-3 md:block">
            <span className="display text-[3rem] leading-none text-acid md:text-[5rem]">
              {item.step}
            </span>
            <span className="eyebrow md:mt-3 md:block">
              Step {index + 1} of {total}
            </span>
          </div>

          <div className="md:col-span-9">
            <h3 className="display text-h2">{item.title}</h3>
            <p className="text-lead mt-5 max-w-[46ch] text-ash">{item.body}</p>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export default function Process() {
  const stackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ["start 0.6", "end 0.9"],
  });
  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="process" className="section-y relative isolate">
      <div className="gutter mx-auto max-w-[110rem]">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewLoose}
            transition={{ duration: 1, ease: EASE.outExpo }}
            className="display text-h2"
          >
            How it runs
          </motion.h2>
          <span className="eyebrow">Typically 10—16 weeks</span>
        </div>

        <div ref={stackRef} className="relative">
          {/* progress rail — scrubs with the stack */}
          <motion.div
            aria-hidden
            style={{ scaleY: railScale }}
            className="absolute top-0 -left-4 hidden h-full w-px origin-top bg-gradient-to-b from-acid via-violet-glow to-transparent md:block"
          />

          <div className="flex flex-col gap-6">
            {process.map((item, i) => (
              <Step key={item.step} item={item} index={i} total={process.length} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
