"use client";

import { motion } from "framer-motion";
import { clients, recognition } from "@/lib/content";
import { EASE, inViewLoose, riseChild, staggerParent } from "@/lib/motion";

/**
 * Clients and recognition, as two plain lists.
 *
 * This replaced a row of counting-up statistics. Numbers that animate from
 * zero flatter the site, not the reader; the names and the years are the
 * evidence, and they only work if you can read them.
 */
export default function Index() {
  return (
    <section className="section-y">
      <div className="gutter mx-auto max-w-[104rem]">
        <div className="grid gap-14 md:grid-cols-12 md:gap-8">
          <motion.div
            variants={staggerParent(0.05)}
            initial="hidden"
            whileInView="visible"
            viewport={inViewLoose}
            className="md:col-span-5"
          >
            <motion.p variants={riseChild} className="label hairline-t pt-4">
              Clients
            </motion.p>
            <ul className="mt-7 space-y-1">
              {clients.map((client) => (
                <motion.li
                  key={client}
                  variants={riseChild}
                  className="display text-[clamp(1.375rem,2.6vw,2rem)] leading-[1.22] text-paper-2 transition-colors duration-400 hover:text-paper"
                >
                  {client}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={staggerParent(0.07, 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={inViewLoose}
            className="md:col-span-6 md:col-start-7"
          >
            <motion.p variants={riseChild} className="label hairline-t pt-4">
              Recognition
            </motion.p>
            <dl className="mt-7">
              {recognition.map((item) => (
                <motion.div
                  key={item.name}
                  variants={riseChild}
                  className="hairline-b flex items-baseline justify-between gap-6 py-4"
                >
                  <dt className="text-paper-2">{item.name}</dt>
                  <dd className="label figure-num shrink-0">{item.year}</dd>
                </motion.div>
              ))}
            </dl>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
