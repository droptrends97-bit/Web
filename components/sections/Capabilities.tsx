"use client";

import { motion } from "framer-motion";
import { capabilities } from "@/lib/content";
import { EASE, inViewLoose, riseChild, staggerParent } from "@/lib/motion";
import Spotlight from "@/components/primitives/Spotlight";

/** Each card gets its own light temperature so the grid never reads flat. */
const GLOWS = ["201,250,75", "122,82,255", "255,106,61", "58,209,200"];

export default function Capabilities() {
  return (
    <section id="capabilities" className="section-y relative isolate">
      <div className="gutter mx-auto max-w-[110rem]">
        <div className="mb-14 grid gap-8 md:mb-20 md:grid-cols-12 md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewLoose}
            transition={{ duration: 1, ease: EASE.outExpo }}
            className="md:col-span-7"
          >
            <span className="eyebrow">What we do</span>
            <h2 className="display text-h2 mt-5">
              Four disciplines,
              <br />
              <span className="font-serif-accent font-normal text-smoke italic">
                one team
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewLoose}
            transition={{ duration: 1, delay: 0.12, ease: EASE.outExpo }}
            className="max-w-[38ch] text-ash md:col-span-4 md:col-start-9"
          >
            No handoffs between agencies. Designers and engineers sit on the same
            project from the first sketch to the last deploy.
          </motion.p>
        </div>

        {/* Deliberately offset grid — the second column drops to break the row line. */}
        <motion.div
          variants={staggerParent(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={inViewLoose}
          className="grid gap-5 md:grid-cols-2 md:gap-6"
        >
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.index}
              variants={riseChild}
              className={i % 2 === 1 ? "md:translate-y-16" : undefined}
            >
              <Spotlight
                glow={GLOWS[i % GLOWS.length]}
                className="hairline h-full rounded-[3px] bg-carbon/50"
              >
                <article className="flex h-full flex-col p-7 md:p-10">
                  <header className="flex items-start justify-between">
                    <h3 className="display text-h3 max-w-[10ch]">{cap.title}</h3>
                    <span
                      aria-hidden
                      className="display text-hollow text-[3.5rem] leading-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 md:text-[5rem]"
                    >
                      {cap.index}
                    </span>
                  </header>

                  <p className="mt-6 max-w-[44ch] text-ash">{cap.body}</p>

                  <ul className="mt-10 flex flex-wrap gap-x-2 gap-y-2 md:mt-14">
                    {cap.items.map((item) => (
                      <li
                        key={item}
                        className="hairline rounded-full px-3.5 py-1.5 font-mono text-[10px] tracking-[0.14em] text-smoke uppercase transition-colors duration-500 group-hover:border-bone/25 group-hover:text-ash"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </Spotlight>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
