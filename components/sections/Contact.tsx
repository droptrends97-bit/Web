"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { contact, site } from "@/lib/content";
import { EASE, inViewLoose } from "@/lib/motion";
import RevealText from "@/components/primitives/RevealText";

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const still = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  const lift = useTransform(scrollYProgress, [0, 1], still ? ["0%", "0%"] : ["8%", "0%"]);

  return (
    <section id="contact" ref={ref} className="section-y overflow-hidden">
      <motion.div style={{ y: lift }} className="gutter mx-auto max-w-[104rem]">
        <div className="hairline-t flex items-baseline justify-between gap-4 pt-4">
          <p className="label">Contact</p>
          <p className="label">{contact.availability}</p>
        </div>

        <RevealText
          as="h2"
          by="word"
          stagger={0.06}
          className="display text-h1 mt-10 max-w-[12ch]"
        >
          {contact.heading}
        </RevealText>

        <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <a
              href={`mailto:${site.email}`}
              className="group relative inline-block"
            >
              <span className="display text-[clamp(1.75rem,4.4vw,3.25rem)] transition-colors duration-500 group-hover:text-vermillion">
                {site.email}
              </span>
              <span
                aria-hidden
                className="absolute inset-x-0 -bottom-1 h-px bg-paper/25"
              />
              <span
                aria-hidden
                className="absolute inset-x-0 -bottom-1 h-px origin-right scale-x-0 bg-vermillion transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100"
              />
            </a>

            <p className="label figure-num mt-6">
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-paper">
                {site.phone}
              </a>
            </p>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewLoose}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE.outExpo }}
            className="max-w-[34ch] text-paper-2 md:col-span-4 md:col-start-9"
          >
            {contact.body}
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
