"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { currently, hero, site } from "@/lib/content";
import { EASE } from "@/lib/motion";
import { useLocalTime } from "@/lib/hooks";

/** Per-line mask swing. Long and decelerating; the type arrives, it doesn't pop. */
const line = {
  hidden: { y: "108%" },
  visible: (i: number) => ({
    y: "0%",
    transition: { duration: 1.3, delay: 0.15 + i * 0.11, ease: EASE.outExpo },
  }),
};

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const time = useLocalTime(site.timezone);
  const still = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // The masthead drifts up slightly slower than the page and fades out.
  // No scale, no blur: the composition leaves, it doesn't dissolve.
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", still ? "0%" : "16%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const ruleScale = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-28 pb-7 md:pt-32"
    >
      {/* Column rules. Structure you can see, instead of light you can't place. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="gutter mx-auto grid h-full max-w-[104rem] grid-cols-3 md:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`h-full border-l-[0.5px] ${i >= 3 ? "hidden md:block" : ""}`}
              style={{ borderLeftColor: "rgba(239,236,228,0.05)" }}
            />
          ))}
        </div>
      </div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="gutter relative z-10 mx-auto flex w-full max-w-[104rem] flex-1 flex-col justify-center"
      >
        {/* The masthead is deliberately left-weighted, but the right column
            was carrying nothing at all. A short colophon anchors it without
            closing the asymmetry. */}
        <div className="mb-9 flex items-start justify-between gap-8 md:mb-14">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.9 }}
            className="label"
          >
            {hero.eyebrow}
          </motion.p>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 1 }}
            className="hidden w-[17rem] shrink-0 border-t-[0.5px] border-t-[color-mix(in_oklab,var(--color-paper)_14%,transparent)] pt-3 md:block"
          >
            <dt className="label">{currently.label}</dt>
            {currently.items.map((item) => (
              <dd key={item} className="mt-1.5 text-paper-2">
                {item}
              </dd>
            ))}
          </motion.dl>
        </div>

        {/* The masthead. One typeface, one voice shift — the second line is the
            same serif in italic, not a different face wearing a gradient. */}
        <h1 className="display text-h1 max-w-[13ch]">
          {hero.lines.map((text, i) => (
            <span key={text} className="block overflow-hidden pb-[0.04em]">
              <motion.span
                custom={i}
                variants={line}
                initial="hidden"
                animate="visible"
                className={`inline-block will-change-transform ${
                  i === hero.italicLine ? "pr-[0.06em] italic" : ""
                }`}
              >
                {text}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="mt-12 grid gap-8 md:mt-20 md:grid-cols-12 md:items-end">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 1, ease: EASE.outExpo }}
            className="max-w-[48ch] text-paper-2 md:col-span-6"
          >
            {hero.sub}
          </motion.p>

          {/* Plain text actions with rules. A pill button on a studio site is
              borrowed from software marketing, and it shows. */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1, ease: EASE.outExpo }}
            className="flex flex-wrap items-center gap-x-10 gap-y-4 md:col-span-5 md:col-start-8 md:justify-end"
          >
            <a
              href={hero.primaryCta.href}
              className="group relative inline-flex items-baseline gap-3 py-1 text-paper"
            >
              <span className="text-lead">{hero.primaryCta.label}</span>
              <span
                aria-hidden
                className="absolute inset-x-0 -bottom-0.5 h-px bg-paper/40 transition-colors duration-500 group-hover:bg-vermillion"
              />
              <span
                aria-hidden
                className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-vermillion transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />
            </a>

            <a
              href={hero.secondaryCta.href}
              className="group relative inline-block py-1 text-paper-3 transition-colors duration-400 hover:text-paper"
            >
              {hero.secondaryCta.label}
              <span
                aria-hidden
                className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-paper/40 transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-focus-visible:origin-left group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Foot of the masthead: the facts, and a rule that retracts on scroll. */}
      <div className="gutter relative z-10 mx-auto w-full max-w-[104rem]">
        <motion.div
          aria-hidden
          style={{ scaleX: ruleScale }}
          className="mb-5 h-px origin-left bg-paper/14"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          style={{ opacity: contentOpacity }}
          className="label flex items-center justify-between"
        >
          <span>
            {site.district} · <span className="figure-num text-paper-2">{time ?? "--:--"}</span>
          </span>
          <span className="hidden sm:inline">Est. {site.founded}</span>
          <span>Scroll</span>
        </motion.div>
      </div>
    </section>
  );
}
