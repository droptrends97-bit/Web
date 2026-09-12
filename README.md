# Setpiece

A studio site built as an editorial system: ink on paper, at night. Next.js
App Router, Framer Motion, Lenis, Tailwind v4.

```bash
npm install
npm run dev                    # http://localhost:3000
npm run build
STATIC_EXPORT=1 npm run build  # self-contained bundle in out/
```

## Direction

Warm near-blacks with no blue in the neutrals, a four-step paper ramp for
type, and one ink-red accent spent on roughly two percent of the surface —
indices, rules, hover states. **There are no glows in this system.** Depth
comes from overlap, hairlines and scale.

| Token | Value | Role |
| --- | --- | --- |
| `ink` → `ink-edge` | `#0d0c0a` → `#23201a` | ground and raised surfaces |
| `paper` → `paper-4` | `#efece4` → `#4c483e` | the type ramp |
| `vermillion` | `#d4502a` | the only accent |

**Type is one family in two voices.** Instrument Serif carries every display
size; Instrument Sans carries everything anyone actually reads. No third face
and no monospace — a mono caption on every label is a costume, not a decision.
The display scale runs to `--text-mega` (22rem) and is set tight, because a
high-contrast serif takes tracking a sans would not.

**House utilities** live in `app/globals.css`: `hairline*` (true 0.5px
borders), `label`, `display`, `figure-num`, `gutter`, `section-y`.

## Motion

`lib/motion.ts` holds shared easings, transitions and variants so reveals stay
consistent across sections.

- **Smooth scroll** — `components/providers/SmoothScroll.tsx` runs Lenis over
  the real window scroll, so `useScroll`, IntersectionObserver and anchor
  offsets keep working. It also supplies `MotionConfig reducedMotion="user"`.
- **Scroll-bound, not timed** — the masthead lifts and fades, the position
  statement writes itself word by word, the process cards compress into a
  deck, the footer wordmark rises. All scrubbable in both directions.
- **Restraint is the point.** No preloader, no custom cursor, no counting-up
  statistics. Interaction shows up as rules that sweep, indices that catch the
  accent, and a printed plate that rides beside the pointer on the work index —
  beside it, not under it, so it never covers the row you are reading.

## Accessibility

`prefers-reduced-motion` is honoured in three layers, because one is not
enough: the CSS media query (CSS animation only), `MotionConfig
reducedMotion="user"` (Framer Motion's transforms), and `useReducedMotion`
collapsing every scroll-linked positional transform to a no-op. Lenis is
skipped outright. All content renders at full opacity without JS motion.

The pointer-tracked plate is gated behind `(hover: hover) and (pointer: fine)`.

## Structure

```
app/          layout (fonts, metadata, chrome), page, design tokens
components/
  providers/  Lenis + MotionConfig
  chrome/     Nav, Grain, ScrollProgress
  primitives/ Magnetic, RevealText, Marquee
  sections/   Hero, Services, Manifesto, Work, Disciplines,
              Process, Index, Contact, Footer
lib/          content.ts (all copy), motion.ts (tokens), hooks.ts
```

All copy and project data live in `lib/content.ts` — placeholder content for a
fictional studio. Swap it without touching motion code.

## Notes

- No image assets. Work previews are flat printed colour fields and the paper
  grain is an inline SVG turbulence, so the page ships with no raster request.
  Fonts are self-hosted by `next/font`; nothing is fetched at runtime.
- `overflow-x: clip` sits on `html` as well as `body`. With it on `body` alone
  the root still overflows, which makes mobile browsers widen the layout
  viewport and push fixed chrome off-screen.
- `STATIC_EXPORT=1` emits `out/` for hosting as plain files. Asset references
  come out root-relative (`/_next/…`); rewrite them if the host serves the
  bundle from a subdirectory.
