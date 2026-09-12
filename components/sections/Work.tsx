"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useState } from "react";
import { projects, type Project } from "@/lib/content";
import { EASE, inViewLoose } from "@/lib/motion";
import { useHasPointer } from "@/lib/hooks";

/**
 * The plate that rides the cursor.
 *
 * It is generated entirely from each project's two-stop gradient — no image
 * assets — and tilts based on how fast the pointer is travelling, which is what
 * sells it as a physical card rather than a div following a mouse.
 */
function Plate({
  project,
  x,
  y,
  rotate,
}: {
  project: Project;
  x: ReturnType<typeof useSpring>;
  y: ReturnType<typeof useSpring>;
  rotate: ReturnType<typeof useTransform<number, number>>;
}) {
  return (
    <motion.div
      style={{ x, y, rotate, translateX: "-50%", translateY: "-50%" }}
      className="pointer-events-none fixed top-0 left-0 z-40 hidden md:block"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.82, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
        transition={{ duration: 0.45, ease: EASE.outExpo }}
        className="hairline relative size-[22rem] overflow-hidden rounded-[2px]"
        style={{
          background: `linear-gradient(145deg, ${project.hue[0]} 0%, ${project.hue[1]} 78%)`,
        }}
      >
        {/* interior structure so the plate reads as a composition, not a swatch */}
        <div aria-hidden className="absolute inset-0 opacity-[0.14]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute inset-y-0 w-px bg-void"
              style={{ left: `${((i + 1) / 7) * 100}%` }}
            />
          ))}
        </div>
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 20% 10%, rgba(255,255,255,0.22), transparent 60%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
          <span className="display text-[1.5rem] leading-none text-void/85">
            {project.title}
          </span>
          <span className="font-mono text-[10px] tracking-[0.16em] text-void/60 uppercase">
            {project.year}
          </span>
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
  const x = useSpring(px, { stiffness: 220, damping: 26, mass: 0.7 });
  const y = useSpring(py, { stiffness: 220, damping: 26, mass: 0.7 });

  // Lag between raw and sprung position becomes the plate's tilt.
  const rotate = useTransform<number, number>([px, x], ([raw, eased]) =>
    Math.max(-14, Math.min(14, ((raw as number) - (eased as number)) * 0.12)),
  );

  const onMove = (event: React.PointerEvent) => {
    px.set(event.clientX);
    py.set(event.clientY);
  };

  return (
    <section id="work" className="section-y relative isolate">
      <div aria-hidden className="bloom size-[38rem] top-0 -right-[14rem] bg-acid/10" />

      <div className="gutter mx-auto max-w-[110rem]">
        {/* header */}
        <div className="hairline-b flex flex-wrap items-end justify-between gap-6 pb-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewLoose}
            transition={{ duration: 1, ease: EASE.outExpo }}
            className="display text-h2"
          >
            Selected work
          </motion.h2>
          <span className="eyebrow">
            {String(projects.length).padStart(2, "0")} projects / 2023—2025
          </span>
        </div>

        {/* index */}
        <ul onPointerMove={hasPointer ? onMove : undefined} onPointerLeave={() => setActive(null)}>
          {projects.map((project, i) => (
            <motion.li
              key={project.index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inViewLoose}
              transition={{ duration: 0.9, delay: i * 0.06, ease: EASE.outExpo }}
              onPointerEnter={() => setActive(i)}
              // Neighbouring rows recede while one is focused.
              animate={{
                opacity: active === null || active === i ? 1 : 0.32,
                filter: active === null || active === i ? "blur(0px)" : "blur(1.5px)",
              }}
              className="hairline-b"
            >
              <a
                href="#"
                data-cursor="view"
                data-cursor-label="View case"
                className="group relative flex items-center gap-4 py-7 md:gap-10 md:py-10"
              >
                {/* acid sweep that fills the row from the left on hover */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-acid transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                />

                <span className="font-mono text-[11px] tracking-[0.16em] text-smoke transition-colors duration-500 group-hover:text-acid">
                  {project.index}
                </span>

                <span className="flex-1 overflow-hidden">
                  <span className="display block text-[clamp(1.75rem,5.5vw,4.5rem)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 md:group-hover:translate-x-6">
                    {project.title}
                  </span>
                </span>

                <span className="hidden shrink-0 text-right font-mono text-[11px] tracking-[0.14em] text-ash uppercase md:block">
                  {project.discipline}
                </span>

                <span className="shrink-0 font-mono text-[11px] tracking-[0.14em] text-smoke">
                  {project.year}
                </span>

                <svg
                  viewBox="0 0 16 16"
                  aria-hidden
                  className="size-4 shrink-0 -translate-x-2 text-acid opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:opacity-100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M4 12L12 4M6 4h6v6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {hasPointer && active !== null && (
          <Plate key={projects[active].index} project={projects[active]} x={x} y={y} rotate={rotate} />
        )}
      </AnimatePresence>
    </section>
  );
}
