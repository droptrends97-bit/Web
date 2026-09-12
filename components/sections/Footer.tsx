"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { footerLinks, site } from "@/lib/content";
import { useLocalTime } from "@/lib/hooks";
import { EASE, inViewLoose } from "@/lib/motion";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const time = useLocalTime(site.timezone);

  // Bound to the footer *arriving*, not to the last pixel of the document:
  // an offset that resolves at max scroll has no headroom left to animate in.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.15"],
  });

  // The oversized wordmark rises out of the fold as the footer settles.
  const still = useReducedMotion();
  const markY = useTransform(scrollYProgress, [0, 1], still ? ["0%", "0%"] : ["45%", "0%"]);
  const markOpacity = useTransform(scrollYProgress, [0.15, 0.75], [0, 1]);

  return (
    <footer ref={ref} className="relative isolate overflow-hidden bg-pitch">
      <div className="gutter mx-auto max-w-[110rem] pt-20 md:pt-28">
        <div className="hairline-b grid gap-12 pb-16 md:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewLoose}
            transition={{ duration: 1, ease: EASE.outExpo }}
            className="md:col-span-5"
          >
            <p className="text-lead max-w-[30ch] text-bone">
              A small studio in {site.location} building the parts of the internet
              people actually remember.
            </p>
            <a
              href={`mailto:${site.email}`}
              data-cursor="hover"
              className="group mt-6 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] text-acid uppercase"
            >
              {site.email}
              <span
                aria-hidden
                className="h-px w-6 origin-left bg-acid transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-150"
              />
            </a>
          </motion.div>

          {footerLinks.map((column, ci) => (
            <motion.nav
              key={column.heading}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inViewLoose}
              transition={{ duration: 1, delay: 0.1 + ci * 0.08, ease: EASE.outExpo }}
              className="md:col-span-2 md:col-start-auto"
            >
              <h3 className="eyebrow">{column.heading}</h3>
              <ul className="mt-5 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      data-cursor="hover"
                      className="group relative inline-block text-ash transition-colors duration-300 hover:text-bone"
                    >
                      {link.label}
                      <span
                        aria-hidden
                        className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-bone/40 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.nav>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewLoose}
            transition={{ duration: 1, delay: 0.26, ease: EASE.outExpo }}
            className="md:col-span-3 md:col-start-10"
          >
            <h3 className="eyebrow">Local time</h3>
            <p className="display mt-5 text-[2rem] tabular-nums">{time ?? "--:--:--"}</p>
            <p className="mt-1 font-mono text-[11px] tracking-[0.14em] text-smoke uppercase">
              {site.location}
            </p>
          </motion.div>
        </div>

        {/* colophon */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-7">
          <span className="font-mono text-[11px] tracking-[0.14em] text-smoke uppercase">
            © {new Date().getFullYear()} {site.name} Studio
          </span>
          <span className="font-mono text-[11px] tracking-[0.14em] text-smoke uppercase">
            Built with Next.js, Framer Motion & Lenis
          </span>
          <a
            href="#top"
            data-cursor="hover"
            className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-ash uppercase transition-colors hover:text-bone"
          >
            Back to top
            <svg
              viewBox="0 0 16 16"
              aria-hidden
              className="size-3.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M8 13V3M3 8l5-5 5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      {/* the wordmark, cropped by the page edge */}
      <motion.div
        aria-hidden
        style={{ y: markY, opacity: markOpacity }}
        className="pointer-events-none flex justify-center overflow-hidden"
      >
        <span className="display text-gradient drift text-mega translate-y-[0.14em] leading-[0.72] whitespace-nowrap select-none">
          {site.name}
        </span>
      </motion.div>
    </footer>
  );
}
