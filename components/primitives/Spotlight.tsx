"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Colour of the light that follows the pointer. */
  glow?: string;
};

/**
 * A panel lit by the pointer.
 *
 * Two stacked radial gradients track the cursor: a wide soft wash inside the
 * card, and a tight one masked to the border so the hairline itself appears to
 * catch the light.
 */
export default function Spotlight({ children, className, glow = "201,250,75" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [lit, setLit] = useState(false);

  const wash = useMotionTemplate`radial-gradient(440px circle at ${x}px ${y}px, rgba(${glow},0.14), transparent 72%)`;
  const edge = useMotionTemplate`radial-gradient(260px circle at ${x}px ${y}px, rgba(${glow},0.95), transparent 66%)`;

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerEnter={() => setLit(true)}
      onPointerLeave={() => setLit(false)}
      className={`group relative isolate overflow-hidden ${className ?? ""}`}
    >
      {/* border light — a 0.5px ring painted by a masked gradient */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
        style={{
          background: edge,
          opacity: lit ? 1 : 0,
          // 1px of lit ring over the 0.5px resting hairline: the static border
          // stays sub-pixel, only the light that travels it is thicker.
          padding: 1,
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          transition: "opacity 420ms cubic-bezier(0.16,1,0.3,1)",
        }}
      />
      {/* interior wash */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit]"
        style={{
          background: wash,
          opacity: lit ? 1 : 0,
          transition: "opacity 420ms cubic-bezier(0.16,1,0.3,1)",
        }}
      />
      <div className="relative z-20 h-full">{children}</div>
    </div>
  );
}
