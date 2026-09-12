# Nocturne

A premium dark landing page built as a motion-first design system, not a page
of Tailwind defaults. Next.js App Router, Framer Motion, Lenis, Tailwind v4.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Design system

Everything visual resolves from tokens declared in `app/globals.css` under
`@theme`. Nothing in the components hard-codes a hex value except the project
gradient plates, which are data in `lib/content.ts`.

**Ground / type**

| Token | Value | Role |
| --- | --- | --- |
| `void` | `#06050a` | page ground |
| `pitch` / `carbon` / `slate-ink` | `#0a0810` → `#171320` | layered surfaces |
| `bone` | `#efeae1` | primary type — warm, never pure white |
| `ash` / `smoke` / `ghost` | `#a79fb4` → `#3a3446` | the descending type ramp |

**Light sources** — `acid #c9fa4b`, `violet-glow #7a52ff`, `ember #ff6a3d`.
Used as radial blooms behind content and as pointer-tracked highlights, never
as flat fills.

**Type scale** is fluid end to end: `--text-body` through `--text-mega`
(`clamp(4rem, -1rem + 22vw, 20rem)`). The drama comes from the gap between
`--text-label` and `--text-mega`, not from extra weights.

Three faces, each with one job: **Inter Tight** for display, **Instrument
Serif** italic for the accent phrase, **JetBrains Mono** for every technical
label.

**House utilities** (`@utility` in `globals.css`): `hairline*` (0.5px borders),
`eyebrow`, `display`, `text-gradient`, `text-hollow`, `gutter`, `section-y`,
`panel`.

## Motion

`lib/motion.ts` holds the shared easing curves, transitions and variants so
reveals stay consistent across sections.

- **Smooth scroll** — `components/providers/SmoothScroll.tsx` runs Lenis over
  the real window scroll, so `useScroll`, IntersectionObserver and anchor
  offsets keep working. It also provides `MotionConfig reducedMotion="user"`.
- **Scroll-bound** — the hero recedes and blurs, the manifesto writes itself
  word by word, the process cards compress into a stack, the ticker rows shear
  against each other, the footer wordmark rises. All scrubbable, none timed.
- **Micro-interactions** — `Magnetic` (two-layer pointer chase), `Spotlight`
  (pointer-lit wash plus a masked border ring), `RevealText` (clip-mask line
  swing), `Cursor` (dot + trailing ring with per-element states via
  `data-cursor`), `Counter`, `Marquee`.

## Accessibility

`prefers-reduced-motion` is honoured in three places, because one is not
enough: the CSS media query kills CSS animation, `MotionConfig
reducedMotion="user"` stops Framer Motion's transform work, and every
scroll-linked positional transform collapses to a no-op via `useReducedMotion`.
Lenis and the preloader are skipped entirely. All content renders at full
opacity without JavaScript motion.

The custom cursor and magnetic effects are gated behind
`(hover: hover) and (pointer: fine)` so touch devices get native behaviour.

## Structure

```
app/          layout (fonts, metadata, chrome), page, design tokens
components/
  providers/  Lenis + MotionConfig
  chrome/     Nav, Cursor, Grain, Preloader, ScrollProgress
  primitives/ Magnetic, RevealText, Spotlight, Marquee, Counter
  sections/   Hero, Ticker, Manifesto, Work, Capabilities, Process,
              Metrics, CallToAction, Footer
lib/          content.ts (all copy), motion.ts (tokens), hooks.ts
```

Copy and project data live in `lib/content.ts` — sections read from it, so
content can be swapped without touching motion code.

## Notes

- No image assets. The work previews are generated from two-stop gradients and
  the film grain is an inline SVG turbulence, so the page ships without a
  single raster request.
- `overflow-x: clip` sits on both `html` and `body`. On `body` alone the root
  still overflows, which makes mobile browsers widen the layout viewport and
  push fixed chrome off-screen.
