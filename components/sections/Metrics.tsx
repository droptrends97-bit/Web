"use client";

import { motion } from "framer-motion";
import { metrics } from "@/lib/content";
import { inViewLoose, riseChild, staggerParent } from "@/lib/motion";
import Counter from "@/components/primitives/Counter";

export default function Metrics() {
  return (
    <section className="relative isolate py-20 md:py-28">
      <div className="gutter mx-auto max-w-[110rem]">
        <motion.dl
          variants={staggerParent(0.09)}
          initial="hidden"
          whileInView="visible"
          viewport={inViewLoose}
          className="hairline-t grid grid-cols-2 md:grid-cols-4"
        >
          {metrics.map((metric) => (
            <motion.div
              key={metric.label}
              variants={riseChild}
              className="hairline-b hairline-l group relative px-5 py-8 first:border-l-0 md:px-8 md:py-12 md:first:border-l-[0.5px]"
            >
              {/* the number lights up as the cell is approached */}
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-acid transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
              />
              <dd className="display text-[clamp(2.75rem,7vw,5.5rem)] tabular-nums">
                <Counter to={metric.value} suffix={metric.suffix} />
              </dd>
              <dt className="eyebrow mt-3">{metric.label}</dt>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
