"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";
import type { MotionValue } from "framer-motion";
import { projects, type Project } from "@/lib/content";
import { EASE, inViewLoose } from "@/lib/motion";
import { useHasPointer } from "@/lib/hooks";

/**
 * The plate that rides the cursor.
 *
 * A flat printed colour field with the client set on it — not a gradient, not
 * a glass card. Portrait, because every real piece of work in a studio index
 * is a photograph or a cover, and those are rarely square.
 */
function Plate({
  project,
  x,
  y,
}: {
  project: Project;
  x: MotionValue<number>;
  y: MotionValue<number>;
}) {
  return (
    <motion.div
      style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      className="pointer-events-none fixed top-0 left-0 z-40 hidden md:block"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.42, ease: EASE.outExpo }}
        className="relative h-[24rem] w-[17rem] overflow-hidden"
        style={{ backgroundColor: project.plate }}
      >
        <div
          className="absolute inset-x-0 top-0 flex items-baseline justify-between p-4"
          style={{ color: project.plateType }}
        >
          <span className="label" style={{ color: "inherit", opacity: 0.7 }}>
            {project.sector}
          </span>
          <span className="label figure-num" style={{ color: "inherit", opacity: 0.7 }}>
            {project.year}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4" style={{ color: project.plateType }}>
          <p className="display text-[1.75rem] leading-[1.05]">{project.client}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Work() {
  const hasPointer = useHasPointer();
  const [active, setActive] = useState<number | null>(null);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const x = useSpring(px, { stiffness: 260, damping: 30, mass: 0.6 });
  const y = useSpring(py, { stiffness: 260, damping: 30, mass: 0.6 });

  // The plate sits beside the pointer rather than under it, so it never covers
  // the row you are reading — clamped so it stays on screen near the edges.
  const [vw, setVw] = useState(0);
  useEffect(() => {
    const sync = () => setVw(window.innerWidth);
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const plateX = useTransform(x, (v) => {
    const halfPlate = 136; // 17rem / 2
    const offset = 208;
    const max = (vw || 1600) - halfPlate - 32;
    return Math.min(v + offset, max);
  });

  const onMove = (event: React.PointerEvent) => {
    px.set(event.clientX);
    py.set(event.clientY);
  };

  return (
    <section id="work" className="section-y">
      <div className="gutter mx-auto max-w-[104rem]">
        <div className="hairline-b flex flex-wrap items-baseline justify-between gap-4 pb-4">
          <h2 className="label">Selected work</h2>
          <p className="label figure-num">
            {projects.length} of 31 · 2023—2025
          </p>
        </div>

        <ul
          onPointerMove={hasPointer ? onMove : undefined}
          onPointerLeave={() => setActive(null)}
        >
          {projects.map((project, i) => (
            <motion.li
              key={project.index}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inViewLoose}
              transition={{ duration: 0.85, delay: i * 0.05, ease: EASE.outExpo }}
              onPointerEnter={() => setActive(i)}
              // Neighbours step back. No blur — just a drop in contrast,
              // the way a printed index dims under a reading finger.
              animate={{ opacity: active === null || active === i ? 1 : 0.38 }}
              className="hairline-b"
            >
              <a
                href="#"
                className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 py-6 md:grid-cols-[4rem_minmax(0,1fr)_14rem_4.5rem_1.5rem] md:gap-x-8 md:py-8"
              >
                <span className="label figure-num transition-colors duration-500 group-hover:text-vermillion">
                  {project.index}
                </span>

                <span className="display text-[clamp(1.75rem,4.6vw,3.75rem)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 md:group-hover:translate-x-4">
                  {project.client}
                </span>

                <span className="hidden text-paper-3 md:block">{project.scope}</span>

                <span className="label figure-num col-start-3 row-start-1 text-right md:col-start-4 md:text-left">
                  {project.year}
                </span>

                <span
                  aria-hidden
                  className="hidden text-paper-3 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:text-vermillion group-hover:opacity-100 md:block"
                >
                  →
                </span>
              </a>
            </motion.li>
          ))}
        </ul>

        <p className="label mt-6">
          <a href="#" className="group relative inline-block text-paper-2 hover:text-paper">
            Full index
            <span
              aria-hidden
              className="absolute inset-x-0 -bottom-1 h-px origin-right scale-x-0 bg-vermillion transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100"
            />
          </a>
        </p>
      </div>

      <AnimatePresence>
        {hasPointer && active !== null && (
          <Plate key={projects[active].index} project={projects[active]} x={plateX} y={y} />
        )}
      </AnimatePresence>
    </section>
  );
}
