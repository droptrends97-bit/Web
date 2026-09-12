"use client";

import { useEffect, useRef } from "react";

/**
 * Threads.
 *
 * A rope of white filaments running down through the page in three dimensions.
 *
 * Geometry — every strand orbits one shared axis at a fixed radius, half of
 * them clockwise and half anticlockwise. Counter-rotation is what makes them
 * cross and trade places rather than running parallel, and because every
 * strand shares one period the whole braid repeats exactly, over and over,
 * for the length of the document.
 *
 * Depth — each sample is pushed through a real perspective projection, so a
 * filament thickens, brightens and stretches as it swings toward the camera,
 * and thins and compresses as it swings behind. Strands are painter-sorted by
 * mean depth so they genuinely pass in front of one another.
 *
 * Entry — nothing is drawn on the hero. The first touch of scroll sends the
 * heads down from above the fold, tapered to a point, and the rope is fully
 * established a sixth of the way into the page.
 *
 * Finish — the braid fades out over the last tenth so it resolves at the foot
 * of the page rather than being cut off. The pattern itself never distorts.
 */

/** Camera focal length, in the same arbitrary units as the world coords. */
const FOCAL = 900;
const SAMPLES = 92;
/** Sampled past both edges of the viewport, so a compressed strand still fills it. */
const SPAN_TOP = -0.4;
const SPAN_BOTTOM = 1.4;
/** World units per full turn. One turn lands a little over one screen. */
const PERIOD = 2;

const TAU = Math.PI * 2;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

const smoothstep = (edge0: number, edge1: number, v: number) => {
  const t = clamp01((v - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

type Strand = {
  phase: number;
  /** +1 or -1 — counter-rotation is what makes the strands trade places. */
  spin: number;
  /** Fraction of the rope radius this strand orbits at. */
  radius: number;
  thickness: number;
};

function buildStrands(count: number): Strand[] {
  return Array.from({ length: count }, (_, i) => {
    const inner = i % 2 === 1;
    return {
      phase: (i / count) * TAU,
      spin: inner ? -1 : 1,
      radius: inner ? 0.68 : 1,
      thickness: inner ? 3.1 : 4.4,
    };
  });
}

type Sample = { x: number; y: number; w: number; k: number };

export default function ScrollThreads() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let width = 0;
    let height = 0;
    let strands: Strand[] = [];
    let frame = 0;
    const started = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      strands = buildStrands(width < 700 ? 4 : 6);
    };

    const scrollProgress = () => {
      const range = document.documentElement.scrollHeight - window.innerHeight;
      if (range <= 0) return 0;
      return clamp01(window.scrollY / range);
    };

    const draw = (p: number, time: number) => {
      ctx.clearRect(0, 0, width, height);

      // Nothing on the hero. The first touch of scroll sends the heads down.
      const entry = smoothstep(0.012, 0.16, p);
      if (entry <= 0) return;

      const narrow = width < 700;
      const fade = 1 - smoothstep(0.9, 1, p);
      // Below 700px the text column is full-bleed, so every filament crosses
      // copy. Same rope, held further back.
      const ink = fade * (narrow ? 0.55 : 1);
      if (ink <= 0) return;

      // Radius breathes very slightly, so the rope is never quite frozen.
      const radius =
        (narrow ? 112 : 186) * (1 + Math.sin(time * 0.31) * 0.06);
      const worldH = height * 1.25;
      // The whole axis sways, which keeps the repeat from feeling mechanical.
      const axisX = width / 2 + Math.sin(time * 0.19) * (narrow ? 14 : 34);

      // Scroll drives the rope downward faster than the page, so it reads as
      // diving ahead of the reader. Twelve turns over the document.
      const flow = p * 12;

      // The heads travel down from above the fold as the rope establishes.
      const headT = SPAN_TOP + entry * (SPAN_BOTTOM - SPAN_TOP + 0.25);
      const maxJ = Math.min(
        SAMPLES,
        Math.round(((headT - SPAN_TOP) / (SPAN_BOTTOM - SPAN_TOP)) * SAMPLES),
      );
      if (maxJ < 3) return;

      const built = strands.map((s) => {
        const samples: Sample[] = [];
        let depthSum = 0;

        for (let j = 0; j <= maxJ; j++) {
          const sT = SPAN_TOP + (SPAN_BOTTOM - SPAN_TOP) * (j / SAMPLES);
          const w = sT * 1.35 - flow;
          const a = (w * TAU) / PERIOD * s.spin + s.phase;

          const r = radius * s.radius;
          const x3 = Math.cos(a) * r;
          // Depth swings wider than the lateral, so the shine has somewhere
          // to travel — this is what makes a filament read as round.
          const z3 = Math.sin(a) * r * 1.5;
          const yWorld = (sT - 0.5) * worldH;

          // Guard the projection: a strand must never cross the camera plane.
          const k = FOCAL / Math.max(180, FOCAL + z3);
          depthSum += z3;

          samples.push({
            x: axisX + x3 * k,
            y: height / 2 + yWorld * k,
            w: s.thickness * k * (narrow ? 0.85 : 1),
            k,
          });
        }

        return { samples, depth: depthSum / (maxJ + 1) };
      });

      // Painter's algorithm: far strands first, so nearer ones overlap them.
      built.sort((a, b) => b.depth - a.depth);

      /**
       * Offset a run of samples perpendicular to its own tangent.
       *
       * `feather` ramps the width to nothing over that many samples at each
       * end — the highlight passes cover only part of a filament, and without
       * the ramp each run ends in a blunt cap that reads as a rendering
       * artefact rather than light falling off. `shift` slides the centreline
       * sideways, which is how the specular sits off-axis on a cylinder
       * instead of straight down the middle.
       */
      const ribbon = (
        samples: Sample[],
        from: number,
        to: number,
        scale: number,
        feather = 0,
        shift = 0,
      ) => {
        const span = to - from;
        const taper = (j: number) => {
          if (feather <= 0 || span <= 0) return 1;
          const reach = Math.min(feather, span / 2);
          return Math.min(
            smoothstep(0, reach, j - from),
            smoothstep(0, reach, to - j),
          );
        };

        const normalAt = (j: number) => {
          const prev = samples[Math.max(from, j - 1)];
          const next = samples[Math.min(to, j + 1)];
          const dx = next.x - prev.x;
          const dy = next.y - prev.y;
          const len = Math.hypot(dx, dy) || 1;
          return [-dy / len, dx / len] as const;
        };

        ctx.beginPath();
        for (let j = from; j <= to; j++) {
          const [nx, ny] = normalAt(j);
          const hw = (samples[j].w * scale * taper(j)) / 2;
          const off = samples[j].w * shift;
          const cx = samples[j].x + nx * off;
          const cy = samples[j].y + ny * off;
          if (j === from) ctx.moveTo(cx + nx * hw, cy + ny * hw);
          else ctx.lineTo(cx + nx * hw, cy + ny * hw);
        }
        for (let j = to; j >= from; j--) {
          const [nx, ny] = normalAt(j);
          const hw = (samples[j].w * scale * taper(j)) / 2;
          const off = samples[j].w * shift;
          ctx.lineTo(samples[j].x + nx * off - nx * hw, samples[j].y + ny * off - ny * hw);
        }
        ctx.closePath();
        ctx.fill();
      };

      /** Fill every run of samples that satisfies `test`, as its own ribbon. */
      const runs = (
        samples: Sample[],
        test: (s: Sample) => boolean,
        scale: number,
        feather: number,
        shift = 0,
      ) => {
        let run = -1;
        for (let j = 0; j <= maxJ; j++) {
          const hit = test(samples[j]);
          if (hit && run === -1) run = j;
          if ((!hit || j === maxJ) && run !== -1) {
            const end = hit ? j : j - 1;
            if (end - run > 2) ribbon(samples, run, end, scale, feather, shift);
            run = -1;
          }
        }
      };

      // Dissolve at the viewport edges rather than ending in a hard cut.
      const edge = ctx.createLinearGradient(0, 0, 0, height);
      edge.addColorStop(0, "rgba(255,255,255,0)");
      edge.addColorStop(0.14, "rgba(255,255,255,1)");
      edge.addColorStop(0.86, "rgba(255,255,255,1)");
      edge.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = edge;

      // While the heads are still descending, taper the tail to a point.
      const headFeather = entry < 1 ? 14 : 0;

      for (const { samples } of built) {
        // Halo. Two widening passes approximate a falloff for far less than
        // a real blur would cost.
        ctx.globalAlpha = 0.04 * ink;
        ribbon(samples, 0, maxJ, 3.4, headFeather);
        ctx.globalAlpha = 0.045 * ink;
        ribbon(samples, 0, maxJ, 2.1, headFeather);

        // The filament itself.
        ctx.globalAlpha = 0.26 * ink;
        ribbon(samples, 0, maxJ, 1, headFeather);

        // Lit side, where the strand swings toward the camera.
        ctx.globalAlpha = 0.46 * ink;
        runs(samples, (s) => s.k > 1.03, 0.96, 11);

        // Specular, off-axis the way it sits on a real cylinder. Kept to the
        // nearest arcs only: light should catch as the filament turns, in
        // short brilliant stretches, not glow along its whole length.
        ctx.globalAlpha = 0.9 * ink;
        runs(samples, (s) => s.k > 1.21, 0.24, 7, -0.2);
      }

      ctx.globalAlpha = 1;
    };

    let lastFrame = 0;

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (now - lastFrame < 1000 / 40) return;
      lastFrame = now;
      draw(scrollProgress(), (now - started) / 1000);
    };

    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    const apply = () => {
      resize();
      if (reduced.matches) {
        stop();
        draw(scrollProgress(), 0);
      } else {
        start();
      }
    };

    const onVisibility = () => (document.hidden ? stop() : start());
    const onScrollWhileStill = () => {
      if (reduced.matches) draw(scrollProgress(), 0);
    };

    apply();
    window.addEventListener("resize", apply);
    window.addEventListener("scroll", onScrollWhileStill, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", apply);

    return () => {
      stop();
      window.removeEventListener("resize", apply);
      window.removeEventListener("scroll", onScrollWhileStill);
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", apply);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
