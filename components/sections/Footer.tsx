"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { address, footerLinks, site } from "@/lib/content";
import { useLocalTime } from "@/lib/hooks";
import { EASE, inViewLoose } from "@/lib/motion";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const time = useLocalTime(site.timezone);
  const still = useReducedMotion();

  // Bound to the footer arriving, not to the last pixel of the document: an
  // offset that resolves at max scroll has no headroom left to animate in.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.15"],
  });

  const markY = useTransform(scrollYProgress, [0, 1], still ? ["0%", "0%"] : ["30%", "0%"]);
  const markOpacity = useTransform(scrollYProgress, [0.15, 0.8], [0, 1]);

  return (
    <footer ref={ref} className="hairline-t relative overflow-hidden bg-ink-raised">
      <div className="gutter mx-auto max-w-[104rem] pt-16 md:pt-24">
        <div className="hairline-b grid gap-10 pb-14 md:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewLoose}
            transition={{ duration: 0.9, ease: EASE.outExpo }}
            className="md:col-span-4"
          >
            <p className="label">Office</p>
            <address className="mt-5 space-y-0.5 text-paper-2 not-italic">
              {address.map((row) => (
                <span key={row} className="block">
                  {row}
                </span>
              ))}
            </address>
            <a
              href={`mailto:${site.email}`}
              className="group relative mt-5 inline-block text-paper"
            >
              {site.email}
              <span
                aria-hidden
                className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-vermillion transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100"
              />
            </a>
          </motion.div>

          {footerLinks.map((column, ci) => (
            <motion.nav
              key={column.heading}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inViewLoose}
              transition={{ duration: 0.9, delay: 0.08 + ci * 0.07, ease: EASE.outExpo }}
              className="md:col-span-2"
            >
              <p className="label">{column.heading}</p>
              <ul className="mt-5 space-y-1.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group relative inline-block text-paper-2 transition-colors duration-300 hover:text-paper"
                    >
                      {link.label}
                      <span
                        aria-hidden
                        className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-paper/40 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.nav>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewLoose}
            transition={{ duration: 0.9, delay: 0.24, ease: EASE.outExpo }}
            className="md:col-span-3 md:col-start-10"
          >
            <p className="label">{site.city}</p>
            <p className="display figure-num mt-5 text-[2rem]">{time ?? "--:--"}</p>
          </motion.div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 py-6">
          <p className="label">
            © {site.founded}—{new Date().getFullYear()} {site.name} Ltd
          </p>
          <a href="#top" className="label group inline-flex items-center gap-2 hover:text-paper">
            Back to top
            <span
              aria-hidden
              className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1"
            >
              ↑
            </span>
          </a>
        </div>
      </div>

      {/* The wordmark, cropped by the page edge. Solid — a gradient-filled
          wordmark is the one thing every generated dark site does. */}
      <motion.div
        aria-hidden
        style={{ y: markY, opacity: markOpacity }}
        className="pointer-events-none flex justify-center overflow-hidden"
      >
        <span className="display text-mega translate-y-[0.16em] leading-[0.74] whitespace-nowrap text-paper/[0.09] select-none">
          {site.name}
        </span>
      </motion.div>
    </footer>
  );
}
