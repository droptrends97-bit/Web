/**
 * Fixed film-grain layer.
 *
 * The noise is an inline SVG turbulence — no network request, no raster asset,
 * and it scales to any DPR. The `.grain` class in globals.css handles the
 * step-wise jitter that keeps it from looking like a static texture.
 */
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function Grain() {
  return (
    <div
      aria-hidden
      className="grain"
      style={{ ["--grain-src" as string]: NOISE }}
    />
  );
}
