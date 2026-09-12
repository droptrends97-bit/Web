"use client";

import { motion } from "framer-motion";
import { disciplines } from "@/lib/content";
import { EASE, inViewLoose, riseChild, staggerParent } from "@/lib/motion";

/**
 * What the studio does, set as a numbered list rather than a card grid.
 *
 * Four equal cards in a 2×2 is the shape every template lands on; a list with
 * a hanging number and a rule per row is how a printed capabilities page does
 * it, and it survives at any width without breakpoints fighting each other.
 */
export default function Disciplines() {
  return (
    <section id="studio" className="section-y">
      <div className="gutter mx-auto max-w-[104rem]">
        <div className="grid gap-10 md:grid-cols-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={inViewLoose}
            transition={{ duration: 0.9, ease: EASE.outExpo }}
            className="md:col-span-4"
          >
            <p className="label hairline-t pt-4">What we do</p>
            <h2 className="display text-h2 mt-8 max-w-[10ch]">
              Four things, <span className="italic">properly</span>
            </h2>
            <p className="mt-6 max-w-[34ch] text-paper-2">
              One team, one contract. No handing the build to a second agency
              once the pictures are signed off.
            </p>
          </motion.div>

          <motion.dl
            variants={staggerParent(0.09)}
            initial="hidden"
            whileInView="visible"
            viewport={inViewLoose}
            className="md:col-span-7 md:col-start-6"
          >
            {disciplines.map((item) => (
              <motion.div
                key={item.num}
                variants={riseChild}
                className="hairline-t group grid grid-cols-[2.5rem_1fr] gap-x-4 py-8 last:border-b-[0.5px] last:border-b-[color-mix(in_oklab,var(--color-paper)_14%,transparent)] md:grid-cols-[4rem_1fr] md:gap-x-8"
              >
                <span className="label figure-num pt-1 transition-colors duration-500 group-hover:text-vermillion">
                  {item.num}
                </span>

                <div>
                  <dt className="display text-h3">{item.title}</dt>
                  <dd className="mt-3 max-w-[46ch] text-paper-2">{item.body}</dd>
                  <dd className="mt-5 flex flex-wrap gap-x-5 gap-y-1">
                    {item.items.map((sub) => (
                      <span key={sub} className="label">
                        {sub}
                      </span>
                    ))}
                  </dd>
                </div>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
