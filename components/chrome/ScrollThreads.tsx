"use client";

import { useEffect, useRef } from "react";

/**
 * Threads.
 *
 * A bundle of white strands that run down through the page in three
 * dimensions. Each one is a helix sampled in world space and pushed through a
 * real perspective projection, so it bows toward the viewer and away again:
 * where a strand swings close it thickens, brightens and its vertical spacing
 * stretches; where it swings behind it thins and compresses toward the
 * vanishing point. That is what separates this from a flat squiggle — the
 * depth is computed, not faked with a gradient.
 *
 * Scroll flows the whole bundle downward, faster than the page, so the threads
 * read as diving ahead of the reader. The twist blooms through the middle of
 * the document and then collapses: over the last fifth the strands converge on
 * a single axis and fade, so the animation resolves at the foot of the page
 * instead of simply being cut off.
 *
 * A slow time term keeps it breathing while the page is still.
 */

const PAPER = "239, 236, 228";

/** Camera focal length, in the same arbitrary units as the world coords. */
const FOCAL = 900;
/** Samples per strand along its visible span. */
const SAMPLES = 84;
/** Sampled past both edges of the viewport, so a compressed strand still fills it. */
const SPAN_TOP = -0.4;
const SPAN_BOTTOM = 1.4;

const TAU = Math.PI * 2;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

const smoothstep = (edge0: number, edge1: number, v: number) => {
  const t = clamp01((v - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

type Strand = {
  phase: number;
  /** Resting lateral position across the bundle, -1 … 1. */
  lateral: number;
  /** Depth offset so the strands do not all bow toward the viewer together. */
  depth: number;
  /** Turns per unit of world travel. */
  freq: number;
  thickness: number;
  drift: number;
};

function buildStrands(count: number): Strand[] {
  return Array.from({ length: count }, (_, i) => {
    const n = count === 1 ? 0.5 : i / (count - 1);
    return {
      // Irrational-ish steps, so the bundle never falls into a visible rhythm.
      phase: i * 1.7 + (i % 2) * 0.9,
      lateral: (n - 0.5) * 2,
      depth: (n - 0.5) * 300,
      freq: 0.82 + (i % 3) * 0.2,
      // Thick enough that the depth-driven width change is actually legible;
      // a hairline cannot show foreshortening.
      thickness: 4.2 + (i % 3) * 1.6,
      drift: 0.09 + (i % 4) * 0.022,
    };
  });
}

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
      // Fewer strands on a phone: less to draw, and a narrow column cannot
      // show the spread that makes a wide bundle legible anyway.
      strands = buildStrands(width < 700 ? 4 : 6);
    };

    const scrollProgress = () => {
      const range = document.documentElement.scrollHeight - window.innerHeight;
      if (range <= 0) return 0;
      return clamp01(window.scrollY / range);
    };

    type Sample = { x: number; y: number; w: number; k: number };

    const draw = (p: number, time: number) => {
      ctx.clearRect(0, 0, width, height);

      const narrow = width < 700;

      // Twist blooms mid-document and collapses over the last fifth, so the
      // bundle resolves onto one axis rather than being cut off.
      const bloom = Math.sin(Math.PI * p);
      const collapse = 1 - smoothstep(0.78, 0.98, p);
      const fade = 1 - smoothstep(0.9, 1, p);
      // On a phone the text column is full-bleed, so every thread crosses
      // copy. Same composition, held further back.
      const ink = fade * (narrow ? 0.6 : 1);

      // Lateral excursion is kept inside the frame: the bundle should descend
      // past the reader, not fly off as a set of giant arcs.
      const amp = (narrow ? 95 : 155) * (0.45 + 0.55 * bloom) * collapse;
      const spread = width * (narrow ? 0.11 : 0.16) * (0.55 + 0.45 * bloom) * collapse;
      const worldH = height * 1.25;

      // Scroll flows the bundle downward faster than the page itself — enough
      // travel that the threads read as diving ahead rather than drifting.
      const flow = p * 7;

      const built = strands.map((s) => {
        const samples: Sample[] = [];
        let depthSum = 0;

        for (let j = 0; j <= SAMPLES; j++) {
          const sT = SPAN_TOP + (SPAN_BOTTOM - SPAN_TOP) * (j / SAMPLES);
          // Subtracting the flow term moves features down-screen as p grows.
          const w = sT * 1.35 - flow + time * s.drift * 0.12;
          const a = w * TAU * s.freq + s.phase;

          const x3 = s.lateral * spread + Math.sin(a) * amp;
          const z3 = s.depth + Math.cos(a) * amp * 0.95;
          const yWorld = (sT - 0.5) * worldH;

          const zCam = FOCAL + z3;
          // Guard the projection: a strand must never cross the camera plane.
          const k = FOCAL / Math.max(160, zCam);
          depthSum += z3;

          samples.push({
            x: width / 2 + x3 * k,
            y: height / 2 + yWorld * k,
            w: s.thickness * k * (narrow ? 0.85 : 1),
            k,
          });
        }

        return { samples, depth: depthSum / (SAMPLES + 1) };
      });

      // Painter's algorithm: the far strands first, so nearer ones overlap them.
      built.sort((a, b) => b.depth - a.depth);

      // Vertical fade so strands dissolve at the viewport edges instead of
      // ending in a hard cut.
      const edge = ctx.createLinearGradient(0, 0, 0, height);
      edge.addColorStop(0, `rgba(${PAPER}, 0)`);
      edge.addColorStop(0.16, `rgba(${PAPER}, 1)`);
      edge.addColorStop(0.84, `rgba(${PAPER}, 1)`);
      edge.addColorStop(1, `rgba(${PAPER}, 0)`);

      /**
       * Offset a run of samples perpendicular to its own tangent.
       *
       * `feather` ramps the width to nothing over that many samples at each
       * end. The highlight passes cover only part of a thread, and without the
       * ramp each run ends in a blunt cap that reads as a rendering artefact
       * rather than light falling off.
       */
      const ribbon = (
        samples: Sample[],
        from: number,
        to: number,
        scale: number,
        feather = 0,
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

        ctx.beginPath();
        for (let j = from; j <= to; j++) {
          const prev = samples[Math.max(from, j - 1)];
          const next = samples[Math.min(to, j + 1)];
          const dx = next.x - prev.x;
          const dy = next.y - prev.y;
          const len = Math.hypot(dx, dy) || 1;
          const nx = -dy / len;
          const ny = dx / len;
          const hw = (samples[j].w * scale * taper(j)) / 2;
          const px = samples[j].x + nx * hw;
          const py = samples[j].y + ny * hw;
          if (j === from) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        for (let j = to; j >= from; j--) {
          const prev = samples[Math.max(from, j - 1)];
          const next = samples[Math.min(to, j + 1)];
          const dx = next.x - prev.x;
          const dy = next.y - prev.y;
          const len = Math.hypot(dx, dy) || 1;
          const nx = -dy / len;
          const ny = dx / len;
          const hw = (samples[j].w * scale * taper(j)) / 2;
          ctx.lineTo(samples[j].x - nx * hw, samples[j].y - ny * hw);
        }
        ctx.closePath();
        ctx.fill();
      };

      ctx.fillStyle = edge;

      /** Fill every run of samples that satisfies `test`, as its own ribbon. */
      const runs = (
        samples: Sample[],
        test: (s: Sample) => boolean,
        scale: number,
        feather: number,
      ) => {
        let run = -1;
        for (let j = 0; j <= SAMPLES; j++) {
          const hit = test(samples[j]);
          if (hit && run === -1) run = j;
          if ((!hit || j === SAMPLES) && run !== -1) {
            const end = hit ? j : j - 1;
            if (end - run > 2) ribbon(samples, run, end, scale, feather);
            run = -1;
          }
        }
      };

      for (const { samples } of built) {
        // Body of the thread.
        ctx.globalAlpha = 0.1 * ink;
        ribbon(samples, 0, SAMPLES, 1);

        // Where a strand swings toward the camera it catches the light — this
        // pass and the next are what read as a round tube rather than a stroke.
        ctx.globalAlpha = 0.26 * ink;
        runs(samples, (s) => s.k > 1.05, 1, 9);

        // Specular spine along the very nearest stretch.
        ctx.globalAlpha = 0.42 * ink;
        runs(samples, (s) => s.k > 1.24, 0.34, 7);
      }

      ctx.globalAlpha = 1;
    };

    let lastFrame = 0;

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      // The bundle breathes while the page is still, so it cannot run purely
      // off scroll deltas — but 40fps is plenty for motion this slow.
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
        // One resting frame: the composition without the movement.
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
