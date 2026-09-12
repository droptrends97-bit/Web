"use client";

import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { hero, site } from "@/lib/content";
import { EASE } from "@/lib/motion";
import { useLocalTime } from "@/lib/hooks";
import Magnetic from "@/components/primitives/Magnetic";

/** Per-line mask swing, tuned longer than the body reveals for weight. */
const line = {
  hidden: { y: "115%", rotate: 4 },
  visible: (i: number) => ({
    y: "0%",
    rotate: 0,
    transition: { duration: 1.5, delay: 0.35 + i * 0.12, ease: EASE.outExpo },
  }),
};

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const time = useLocalTime(site.timezone);
  // Scroll-linked movement is still movement: hold every positional transform
  // flat for reduced-motion users and let the section simply fade.
  const still = useReducedMotion();

  // Scroll-bound: the whole composition recedes as the next section arrives.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", still ? "0%" : "24%"]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, still ? 1 : 0.86]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const blurPx = useTransform(scrollYProgress, [0, 1], [0, still ? 0 : 14]);
  const contentBlur = useMotionTemplate`blur(${blurPx}px)`;

  // Backdrop drifts slower than content — depth without a parallax library.
  const bloomY = useTransform(scrollYProgress, [0, 1], ["0%", still ? "0%" : "-30%"]);
  const ghostY = useTransform(scrollYProgress, [0, 1], ["0%", still ? "0%" : "60%"]);
  const ghostOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-28 pb-8 md:pt-36"
    >
      {/* ---- layer 0: ambient light ---- */}
      <motion.div aria-hidden style={{ y: bloomY }} className="absolute inset-0 -z-20">
        {/* Bloom radii are viewport-relative: at phone width a 46rem disc would
            flood two thirds of the screen and flatten the composition. */}
        <div className="bloom size-[24rem] -top-[10rem] -left-[8rem] bg-violet-glow/14 md:size-[46rem] md:-top-[18rem] md:-left-[14rem] md:bg-violet-glow/22" />
        <div className="bloom size-[18rem] top-[42%] -right-[7rem] bg-acid/8 md:size-[34rem] md:-right-[12rem] md:bg-acid/12" />
        <div className="bloom size-[16rem] -bottom-[6rem] left-[28%] bg-ember/8 md:size-[26rem] md:-bottom-[10rem] md:bg-ember/10" />
      </motion.div>

      {/* ---- layer 1: structural grid ---- */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="gutter mx-auto grid h-full max-w-[110rem] grid-cols-4 md:grid-cols-12">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`hairline-l h-full ${i >= 4 ? "hidden md:block" : ""}`}
              style={{ borderLeftColor: "rgba(239,234,225,0.045)" }}
            />
          ))}
        </div>
      </div>

      {/* ---- layer 2: oversized ghost wordmark, sunk behind the headline ---- */}
      <motion.div
        aria-hidden
        style={{ y: ghostY, opacity: ghostOpacity }}
        className="pointer-events-none absolute inset-x-0 top-[38%] -z-10 flex justify-center"
      >
        <span className="display text-hollow text-mega leading-none whitespace-nowrap opacity-40">
          {site.name}
        </span>
      </motion.div>

      {/* ---- layer 3: content ---- */}
      <motion.div
        style={{
          y: contentY,
          scale: contentScale,
          opacity: contentOpacity,
          filter: contentBlur,
        }}
        className="gutter relative z-10 mx-auto flex w-full max-w-[110rem] flex-1 flex-col justify-center"
      >
        {/* eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.9, ease: EASE.outExpo }}
          className="mb-8 flex items-start gap-3 md:mb-12 md:items-center"
        >
          <span className="relative mt-[0.45em] flex size-1.5 shrink-0 md:mt-0">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-acid opacity-60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-acid" />
          </span>
          <span className="eyebrow max-w-[26ch] text-[0.6875rem] md:max-w-none md:text-[0.75rem]">
            {hero.eyebrow}
          </span>
        </motion.div>

        {/* headline */}
        <h1 className="display text-h1 max-w-[16ch]">
          {hero.lines.map((text, i) => (
            <span key={text} className="block overflow-hidden pb-[0.06em]">
              <motion.span
                custom={i}
                variants={line}
                initial="hidden"
                animate="visible"
                className={
                  i === hero.accentLine
                    ? "text-gradient drift inline-block pr-[0.08em] font-serif-accent font-normal italic will-change-transform"
                    : "inline-block will-change-transform"
                }
              >
                {text}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* sub + actions */}
        <div className="mt-10 grid gap-10 md:mt-16 md:grid-cols-12 md:items-end">
          <motion.p
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.95, duration: 1.1, ease: EASE.outExpo }}
            className="text-lead max-w-[42ch] text-ash md:col-span-5 md:col-start-1"
          >
            {hero.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 1.1, ease: EASE.outExpo }}
            className="flex flex-wrap items-center gap-4 md:col-span-5 md:col-start-8 md:justify-end"
          >
            <Magnetic strength={18} innerStrength={9}>
              <a
                href={hero.primaryCta.href}
                data-cursor="hover"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-bone px-7 py-4 text-void"
              >
                <span className="absolute inset-0 origin-left scale-x-0 bg-acid transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
                <span className="relative font-mono text-[11px] font-semibold tracking-[0.16em] uppercase">
                  {hero.primaryCta.label}
                </span>
                <svg
                  viewBox="0 0 16 16"
                  className="relative size-3.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden
                >
                  <path d="M2 8h12M9 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </Magnetic>

            <Magnetic strength={14} innerStrength={7}>
              <a
                href={hero.secondaryCta.href}
                data-cursor="hover"
                className="group relative inline-flex items-center gap-2 px-2 py-4 font-mono text-[11px] font-medium tracking-[0.16em] text-ash uppercase transition-colors duration-300 hover:text-bone"
              >
                {hero.secondaryCta.label}
                <span className="absolute inset-x-2 bottom-3 h-px origin-right scale-x-0 bg-bone/40 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100" />
              </a>
            </Magnetic>
          </motion.div>
        </div>
      </motion.div>

      {/* ---- layer 4: base rail ---- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        style={{ opacity: contentOpacity }}
        className="gutter relative z-10 mx-auto flex w-full max-w-[110rem] items-end justify-between"
      >
        <div className="eyebrow flex items-center gap-2">
          <span>{site.location}</span>
          <span aria-hidden className="text-ghost">/</span>
          <span className="tabular-nums text-ash">{time ?? "--:--:--"}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="eyebrow hidden sm:inline">Scroll</span>
          <span aria-hidden className="hairline relative h-12 w-px overflow-hidden rounded-full border-0 bg-bone/12">
            <motion.span
              animate={{ y: ["-100%", "100%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: EASE.inOutQuart }}
              className="absolute inset-x-0 h-1/2 bg-acid"
            />
          </span>
        </div>
      </motion.div>
    </section>
  );
}
