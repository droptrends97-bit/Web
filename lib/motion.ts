import type { Transition, Variants } from "framer-motion";

/** House easing curves, mirrored from the CSS tokens in globals.css. */
export const EASE = {
  outExpo: [0.16, 1, 0.3, 1],
  inOutQuart: [0.76, 0, 0.24, 1],
  spring: [0.34, 1.56, 0.64, 1],
} as const;

export const transitions = {
  /** The default entrance: long, decelerating, never bouncy. */
  reveal: { duration: 1.1, ease: EASE.outExpo } satisfies Transition,
  /** Hover / press feedback — short enough to feel physical. */
  tap: { duration: 0.32, ease: EASE.outExpo } satisfies Transition,
  /** Section-to-section, heavier elements. */
  sweep: { duration: 1.4, ease: EASE.inOutQuart } satisfies Transition,
};

/**
 * Parent that hands its children a staggered start.
 * Pair with `riseChild` on each item.
 */
export const staggerParent = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

/** Child of `staggerParent`: rises from below with a slight blur settle. */
export const riseChild: Variants = {
  hidden: { y: 28, opacity: 0, filter: "blur(6px)" },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: transitions.reveal,
  },
};

/** A line of type clipped by its parent, swinging up into view. */
export const maskLine: Variants = {
  hidden: { y: "110%", rotate: 3 },
  visible: {
    y: "0%",
    rotate: 0,
    transition: { duration: 1.25, ease: EASE.outExpo },
  },
};

/** Viewport config used across sections so reveals fire at a consistent depth. */
export const inView = { once: true, amount: 0.35 } as const;
export const inViewLoose = { once: true, amount: 0.15 } as const;
