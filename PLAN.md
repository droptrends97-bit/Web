# East Coast Digital — design notes

**Repo state note:** this repository contained only `README.md` at the start. The
section order in the brief has been treated as the spec; no section was dropped.

**Direction change.** The first pass built a nautical-chart system — flat chart-buff
grounds, a heavy Egyptian slab, hard hairline rules, a course line down the left edge.
It was rejected as generic and, more usefully, as *hard*: flat blocks of saturated
colour at 14:1 contrast, separation by hairline, and grey placeholder rectangles where
the hero's proof should have been. This document describes what replaced it.

The mood brief that drives everything below: **pride, on a light airy ground.** Not
"relief", not "warmth" — the feeling to produce in the first two seconds is *my business
could look like that.*

---

## 1. Tokens

Seven values. Depth comes from elevation and space, never from hard blocks.

| Token | Hex | Role |
|---|---|---|
| `--canvas` | `#EFF2F2` | Ground. Soft cool daylight — deliberately **not** cream. |
| `--surface` | `#FFFFFF` | Raised white. Floats on the canvas on a soft shadow. |
| `--ink` | `#14191C` | Headings. |
| `--ink-soft` | `#586066` | Body copy. 5.7:1 — legible, but not shouting. |
| `--accent` | `#0D4A5C` | Deep petrol. Competence and depth, never shouty. |
| `--tint` | `#E1EBEE` | The second ground, for alternating sections. |
| `--brass` | `#B5873F` | The pride note. Rare, and never on a large area. |

**Why this reads as pride rather than calm.** Aspiration on a light ground comes from
*luminosity and layering*, not saturation: a cool near-white that behaves like daylight,
white surfaces lifted off it on long soft shadows, and one deep petrol that reads as
considered rather than corporate. Brass is the achievement note — it appears only as the
18px rule in an eyebrow, the mark inside the wordmark, and the "to confirm" chip. Total
brass coverage is well under 1% of the page, which is what keeps it reading as gold leaf
rather than as a gold theme.

Cream was specifically avoided. Warm cream around `#F4F1EA` with a serif display is one
of the most recognisable generated-design signatures going, and the previous pass had
already been called out for landing near it.

Three shadow steps (`sm`, `md`, `lg`) do the work hairlines used to do. Exactly one
`--line` token survives, used only where a rule genuinely separates rows of data.

## 2. Type

| Role | Face | Setting |
|---|---|---|
| Display | **Fraunces** var 400–700 | 600 weight, optical sizing on, tracking `-0.018em` |
| Everything else | **Manrope** var 400–800 | 400/600/700, `1.6` leading |

Fraunces is a soft-contrast old-style serif with real character — warm without being
decorative, and at 600 with tight leading it reads editorial-premium, which is the
"worth being proud of" register. Manrope is a humanist geometric with rounded terminals:
contemporary, friendly, and pointedly *not* Inter.

The `SOFT` axis of Fraunces was tested and dropped — it cost 53KB (67KB → 120KB) for
gentler terminals. The hardness was never in the letterforms; it was in the flat blocks
and the hairlines, and those are gone.

Self-hosted latin-subset woff2, 92KB total, both preloaded, metric-matched fallbacks
with `size-adjust` so the swap costs no layout shift.

## 3. The hero — two live websites, not two screenshots

The single biggest cause of the old hero reading dead was that both sides of the reveal
were flat placeholder rectangles. They are now **real rendered web pages**, built in
HTML and CSS inside the frame:

- **The before** is a faithful reconstruction of a small Irish trade site of around 2011:
  a blue gradient bar, a Times-serif logo, bevelled tab navigation, a fixed-width
  left-aligned page, 11px Verdana, a bordered photo, `Copyright © 2011`. Restrained on
  purpose — no Comic Sans, no marquee, no visitor counter. The argument collapses the
  moment a visitor decides it is a strawman.
- **The after** is a current build: a pill nav, a display-serif headline, a photo panel
  and three service cards on soft shadows.

Because they are live pages rather than images, the hero works today with no photography,
and it is genuinely interactive.

**The wipe composition problem, and how it is solved.** Two different layouts do not
overlay like two photographs — whatever sits left of the handle is hidden, and on the
first build that clipped the rebuilt site's headline. The fix is structural rather than
fiddled: the rebuilt page's content sits inside a gutter of `220/1280 = 17.2%` of its own
width, and the handle rests at `13%`. Both are proportions of the same frame, so the
clearance holds at *every* screen size — measured at 48px on desktop, 39px at 1024, 9px
at 360. The old site sits hard left at a `28px` margin so its dated signals fall inside
the visible sliver.

**The trade switcher.** Five chips under the frame — plasterer, electrician, plumber,
roofer, garage. Picking one rewrites *both* pages together: business name, phone,
headline, body copy, service list, and the rebuild's colour. This is the actual sales
motion made interactive — the outreach builds the prospect's real homepage first and
then sends the link, and the hero is a live version of that email. The Irish detail is
kept honest: the old electrician site says "RECI registered", the rebuild says "Safe
Electric"; the plumber is "RGII registered", not the UK's Gas Safe.

## 4. Mobile — where the argument makes itself

On a phone the rebuild renders as a **real phone layout** (390 × 520, stacked nav,
single-column cards) and is fully legible. The old site is deliberately left at its full
1280px desktop width and scaled to fit, so it appears exactly as it does in real life on
a phone: a tiny, zoomed-out, unusable desktop page.

That is not a compromise — it is the strongest version of the argument, and it only
exists on mobile.

The hero also reorders on mobile so the reveal comes before the buttons, which puts the
drag grip above the fold on a 780px-tall screen.

## 5. Scrolling

- A hairline scroll-progress bar at the very top, scrubbed.
- Elements rise 20px and fade in as they arrive — 0.7s, once, `power2.out`.
- One pinned sequence: the Hartnett build, scrubbed at `0.6` so it lags slightly behind
  the scroll and reads as weight rather than snap. Capped at 1.4 viewport heights,
  desktop only; on a phone you simply scroll the build natively.
- `prefers-reduced-motion` removes all of it. The `.rise` hidden state is applied only
  once GSAP has confirmed it loaded, so a blocked script can never blank the page.

## 6. Cut from the first pass

- **The course line and the coordinates.** A latitude rail is chart-technical and fought
  the premium-soft direction on every axis. The original brief's own option to "cut the
  coordinates entirely" was taken. A 2px progress bar replaced it.
- **The Egyptian slab, the chart buff, the oxide rust, the hairline ledger** — the whole
  hard-edged system.
- **The hero reassurance list**, which repeated the four-fact strip directly below it.
- **Four asset slots.** The two hero screenshots are not needed at all now that the pages
  are live; the problem-section and contact-section photo bands went with the redesign.

## 7. Verified

Lighthouse mobile **97 / 100 / 100 / 100**, CLS 0.023, 272KB uncompressed, and 28
automated checks covering keyboard drive, the trade switcher, no-JS, reduced motion, and
360px overflow at every scroll depth.
