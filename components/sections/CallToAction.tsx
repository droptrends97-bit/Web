"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { site } from "@/lib/content";
import { EASE, inViewLoose } from "@/lib/motion";
import Magnetic from "@/components/primitives/Magnetic";
import RevealText from "@/components/primitives/RevealText";

export default function CallToAction() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  // The headline rises into place and the light swells as the section lands.
  const still = useReducedMotion();
  const lift = useTransform(scrollYProgress, [0, 1], still ? ["0%", "0%"] : ["12%", "0%"]);
  const glow = useTransform(scrollYProgress, [0, 1], [0.05, 0.22]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [0.75, 1.1]);
  const rimOpacity = useTransform(scrollYProgress, [0.3, 1], [0, 0.8]);

  return (
    <section id="studio" ref={ref} className="relative isolate overflow-hidden py-28 md:py-44">
      {/* A deep violet wash rather than a flood of acid — the accent reads as a
          thin horizon line instead of a colour cast over the type. */}
      <motion.div
        aria-hidden
        style={{ opacity: glow, scale: glowScale }}
        className="bloom size-[56rem] -bottom-[34rem] left-1/2 -translate-x-1/2 bg-violet-glow"
      />
      <motion.div
        aria-hidden
        style={{ opacity: rimOpacity }}
        className="absolute inset-x-[12%] bottom-0 h-px bg-gradient-to-r from-transparent via-acid to-transparent"
      />
      <motion.div
        aria-hidden
        style={{ opacity: rimOpacity }}
        className="bloom pointer-events-none absolute inset-x-[24%] -bottom-[9rem] h-[14rem] rounded-none bg-acid/18"
      />

      <motion.div style={{ y: lift }} className="gutter relative mx-auto max-w-[110rem]">
        <div className="hairline-t flex items-center justify-between pt-5">
          <span className="eyebrow">Next</span>
          <span className="eyebrow">Currently booking Q2</span>
        </div>

        <RevealText
          as="h2"
          by="word"
          stagger={0.07}
          className="display text-h1 mt-10 max-w-[14ch]"
        >
          {"Let's make something worth the scroll"}
        </RevealText>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-10 md:mt-20">
          <Magnetic strength={26} innerStrength={13}>
            <a
              href={`mailto:${site.email}`}
              data-cursor="hover"
              className="group relative inline-flex items-center gap-4"
            >
              <span className="display text-[clamp(1.5rem,4vw,3rem)] text-bone transition-colors duration-500 group-hover:text-acid">
                {site.email}
              </span>
              <span className="hairline flex size-12 items-center justify-center rounded-full transition-colors duration-500 group-hover:border-acid/60 md:size-16">
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden
                  className="size-4 transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M4 12L12 4M6 4h6v6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span
                aria-hidden
                className="absolute -bottom-2 left-0 h-px w-full origin-right scale-x-0 bg-acid transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100"
              />
            </a>
          </Magnetic>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewLoose}
            transition={{ duration: 1, delay: 0.2, ease: EASE.outExpo }}
            className="max-w-[34ch] text-ash"
          >
            Tell us what you are building and what is in the way. We reply to every
            enquiry within two working days.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
