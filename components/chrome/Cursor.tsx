"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useHasPointer } from "@/lib/hooks";

/**
 * Two-part cursor: a hard dot that tracks the pointer exactly, and a soft ring
 * that trails on a spring. Elements opt into states with data attributes:
 *
 *   data-cursor="hover"            → ring expands
 *   data-cursor="view"             → ring becomes a filled acid disc
 *   data-cursor-label="Open case"  → label rides inside the disc
 *
 * Rendered only for fine pointers; touch devices get nothing at all.
 */
export default function Cursor() {
  const hasPointer = useHasPointer();

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const ringX = useSpring(x, { stiffness: 320, damping: 34, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 320, damping: 34, mass: 0.6 });

  const [state, setState] = useState<"idle" | "hover" | "view">("idle");
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!hasPointer) return;

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);

      const target = (event.target as HTMLElement | null)?.closest?.(
        "[data-cursor], a, button",
      ) as HTMLElement | null;

      if (!target) {
        setState("idle");
        setLabel(null);
        return;
      }

      const declared = target.dataset.cursor;
      setState(declared === "view" ? "view" : declared === "hover" || target.matches("a, button") ? "hover" : "idle");
      setLabel(target.dataset.cursorLabel ?? null);
    };

    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [hasPointer, x, y]);

  if (!hasPointer) return null;

  const ringSize = state === "view" ? 104 : state === "hover" ? 54 : 30;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[200] hidden md:block">
      {/* trailing ring */}
      <motion.div
        className="absolute top-0 left-0 rounded-full"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          className="flex items-center justify-center rounded-full"
          animate={{
            width: ringSize,
            height: ringSize,
            opacity: visible ? 1 : 0,
            scale: pressed ? 0.86 : 1,
            backgroundColor:
              state === "view" ? "rgba(201,250,75,1)" : "rgba(201,250,75,0)",
            borderColor:
              state === "view"
                ? "rgba(201,250,75,0)"
                : "rgba(239,234,225,0.45)",
          }}
          transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
          style={{ borderWidth: 0.5, borderStyle: "solid" }}
        >
          <AnimatePresence>
            {state === "view" && label && (
              <motion.span
                key={label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                className="font-mono text-[10px] font-semibold tracking-[0.16em] text-void uppercase"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* exact-tracking dot */}
      <motion.div
        className="absolute top-0 left-0 size-1 rounded-full bg-bone"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible && state !== "view" ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
}
