"use client";

import { motion } from "framer-motion";
import { maskLine, staggerParent, inViewLoose } from "@/lib/motion";

type Props = {
  children: string;
  /** Split granularity. Lines swing as a block; words cascade. */
  by?: "line" | "word";
  className?: string;
  stagger?: number;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
};

/**
 * Type that swings up from behind a clip mask.
 *
 * Each fragment sits in its own `overflow-hidden` box, so the text appears to
 * be uncovered by the layout rather than faded in on top of it.
 */
export default function RevealText({
  children,
  by = "word",
  className,
  stagger = 0.055,
  delay = 0,
  as = "span",
}: Props) {
  const Wrapper = motion[as];
  const fragments = by === "word" ? children.split(" ") : [children];

  return (
    <Wrapper
      className={className}
      variants={staggerParent(stagger, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={inViewLoose}
    >
      {fragments.map((fragment, i) => (
        <span
          key={`${fragment}-${i}`}
          // `pb`/`-mb` give descenders room so the mask never clips a 'g'.
          className="inline-flex overflow-hidden pb-[0.12em] align-bottom -mb-[0.12em]"
        >
          <motion.span variants={maskLine} className="inline-block will-change-transform">
            {fragment}
            {by === "word" && i < fragments.length - 1 ? " " : null}
          </motion.span>
        </span>
      ))}
    </Wrapper>
  );
}
