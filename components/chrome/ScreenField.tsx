"use client";

import { useEffect, useRef } from "react";

/**
 * Halftone screen field.
 *
 * The studio sits above a printworks, so the background is the thing that
 * makes printed images possible: a lattice of dots, rotated to a screen angle.
 *
 * Four-colour printing rotates each separation to a different angle so the
 * screens never line up and moiré — 15° for cyan, 75° magenta, 0° yellow,
 * 45° black. Scrolling the page walks the screen through that whole range, so
 * the page is effectively re-screened as you read it. A slow diagonal wave
 * modulates dot size the way ink density varies across a roller, and roughly
 * one dot in a hundred prints in the accent, like a separation out of
 * register.
 *
 * Canvas rather than SVG: this is thousands of marks redrawn on scroll, which
 * is what a raster surface is for.
 */

/** Distance between dot centres — the screen frequency. Tight enough that the
 *  lattice reads as a screen; any looser and it reads as dust. */
const PITCH = 18;
/** Dots are a soft texture, so cap the raster cost on high-density displays. */
const DPR_CAP = 1.5;
/** A background texture does not need to redraw every frame. Halving the rate
 *  is invisible on a field of 1px dots and halves the main-thread cost. */
const MIN_FRAME_MS = 1000 / 30;
/** Prime, and large: roughly half a dozen strays on screen at a time. Any
 *  more often and a misregistered separation reads as red speckle. */
const STRAY_MODULUS = 601;

const PAPER = "239, 236, 228";
const VERMILLION = "212, 80, 42";

export default function ScreenField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let width = 0;
    let height = 0;
    let frame = 0;
    let lastProgress = -1;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lastProgress = -1; // force a redraw at the new size
    };

    const draw = (progress: number) => {
      ctx.clearRect(0, 0, width, height);

      // Walk the standard separation angles as the page is read.
      const angle = ((15 + progress * 90) * Math.PI) / 180;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      const cx = width / 2;
      const cy = height / 2;
      const phase = progress * Math.PI * 5;

      // Inverse-rotate the viewport corners into lattice space to get exact
      // bounds. Iterating the bounding square instead would cull ~60% of the
      // loop, and the culling costs as much as the drawing.
      let uMin = Infinity, uMax = -Infinity, vMin = Infinity, vMax = -Infinity;
      for (const [dx, dy] of [
        [-cx, -cy],
        [cx, -cy],
        [cx, cy],
        [-cx, cy],
      ]) {
        const u = dx * cos + dy * sin;
        const v = -dx * sin + dy * cos;
        if (u < uMin) uMin = u;
        if (u > uMax) uMax = u;
        if (v < vMin) vMin = v;
        if (v > vMax) vMax = v;
      }

      const iuMin = Math.floor(uMin / PITCH) - 1;
      const iuMax = Math.ceil(uMax / PITCH) + 1;
      const ivMin = Math.floor(vMin / PITCH) - 1;
      const ivMax = Math.ceil(vMax / PITCH) + 1;

      // Two passes, one path each: a fill per dot would cost more in state
      // changes than in pixels.
      ctx.fillStyle = `rgba(${PAPER}, 0.055)`;
      ctx.beginPath();

      const strays: Array<[number, number, number]> = [];

      for (let iv = ivMin; iv <= ivMax; iv++) {
        const v = iv * PITCH;
        // Walking u is a straight line in screen space, so step along it
        // rather than recomputing a rotation per dot.
        let x = cx + iuMin * PITCH * cos - v * sin;
        let y = cy + iuMin * PITCH * sin + v * cos;
        const dx = PITCH * cos;
        const dy = PITCH * sin;

        for (let iu = iuMin; iu <= iuMax; iu++, x += dx, y += dy) {
          if (x < -PITCH || x > width + PITCH || y < -PITCH || y > height + PITCH) {
            continue;
          }
          const u = iu * PITCH;

          // Ink density wave, running diagonally across the lattice. The
          // floor matters: let dots fall to nothing and the screen breaks up
          // into specks instead of thinning like ink.
          const wave = Math.sin(u * 0.0065 + v * 0.011 + phase);
          const r = 0.55 + (wave * 0.5 + 0.5) * 1.45;

          // Keyed to lattice coordinates, not draw order, so a stray dot stays
          // the same dot as the screen rotates instead of flickering.
          if (((iu * 7 + iv * 13) % STRAY_MODULUS + STRAY_MODULUS) % STRAY_MODULUS === 0) {
            strays.push([x, y, r * 1.35]);
            continue;
          }

          ctx.moveTo(x + r, y);
          ctx.arc(x, y, r, 0, Math.PI * 2);
        }
      }
      ctx.fill();

      if (strays.length) {
        ctx.fillStyle = `rgba(${VERMILLION}, 0.24)`;
        ctx.beginPath();
        for (const [x, y, r] of strays) {
          ctx.moveTo(x + r, y);
          ctx.arc(x, y, r, 0, Math.PI * 2);
        }
        ctx.fill();
      }
    };

    const scrollProgress = () => {
      const range = document.documentElement.scrollHeight - window.innerHeight;
      if (range <= 0) return 0;
      return Math.min(1, Math.max(0, window.scrollY / range));
    };

    let lastDraw = 0;

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (now - lastDraw < MIN_FRAME_MS) return;
      const progress = scrollProgress();
      // Redraw only when the screen would actually move.
      if (Math.abs(progress - lastProgress) > 0.0004) {
        lastProgress = progress;
        lastDraw = now;
        draw(progress);
      }
    };

    const start = () => {
      if (frame) return;
      frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (!frame) return;
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const onVisibility = () => (document.hidden ? stop() : start());

    const applyMotionPreference = () => {
      resize();
      if (reduced.matches) {
        stop();
        // A single screen at the black separation angle — the texture without
        // the movement.
        draw(1 / 3);
      } else {
        start();
      }
    };

    applyMotionPreference();

    window.addEventListener("resize", applyMotionPreference);
    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", applyMotionPreference);

    return () => {
      stop();
      window.removeEventListener("resize", applyMotionPreference);
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", applyMotionPreference);
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
