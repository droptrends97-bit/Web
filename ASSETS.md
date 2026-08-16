# Asset slots & outstanding items

Every image on the site is a real `<img>` at final dimensions pointing at a real
file. What ships today is a **flat placeholder block in a palette colour with the
slot spec printed on it** — never a CSS or gradient approximation of the final
picture. Swapping in the real photography is one `src` change per slot.

Placeholders live at `assets/img/<name>.svg`. Replace with `<name>.jpg` (or
`.webp`) and update the `src` in `index.html`; the `width`/`height` attributes
already match, so nothing shifts on load.

---

## 1. The hero reveal — the two that matter most

| Slot | File | Size | Where |
|---|---|---|---|
| Before | `hero-before` | 1600 × 1000 | `index.html` → `.reveal__layer--before` |
| After | `hero-after` | 1600 × 1000 | `index.html` → `.reveal__layer--after` |

**Crop warning.** Above 820px the frame is a fixed height, so on a laptop these
render as roughly a **3:1 band anchored to the top** (`object-position: 50% 0`).
Everything that has to be legible — logo, nav, the hero headline, the top of the
first image — must sit in the **top ~35% of the file**. Supply the full 1600×1000
anyway; narrow screens show more of it.

**Before — art direction.** A real screenshot of a real dead site, or a faithful
reconstruction of one. Genuinely dated, not a caricature: a narrow centred column
on a wide white field, a stock header photo, a gradient nav bar, a tiny logo, text
at 12px, a `Copyright 2011` line. Do not add Comic Sans, do not add animated GIFs,
do not exaggerate — the whole argument dies if a visitor thinks it is a strawman.
If you use a real business's site, get permission or reconstruct it.

**After — art direction.** A screenshot of a **real shipped ECD build** at the same
desktop width and the same crop. Not a mockup, not a Figma export. Until a real one
exists, the honest interim is a screenshot of the Hartnett build in this repo.

**Per-campaign variants.** The frame reads its labels from `data-trade` and
`data-town` on `.reveal`, and the chip renders from them. For a campaign landing
page, change those two attributes and the two `src`s — nothing else.

Recommended once real: add `srcset` at 800w for phones.
`<img src="hero-after-1600.jpg" srcset="hero-after-800.jpg 800w, hero-after-1600.jpg 1600w" sizes="100vw" …>`

## 2. Atmospheric — the three that stop the site looking cheap

| Slot | File | Size | Ratio |
|---|---|---|---|
| Problem band | `problem-shopfront` | 2400 × 900 | 8:3, full-bleed |
| Who we are | `who-workshop` | 1200 × 1600 | 3:4 portrait |
| Contact band | `contact-coast` | 2400 × 800 | 3:1, full-bleed |

**problem-shopfront.** An Irish town shopfront, shuttered or carrying a handwritten
sign. Overcast, flat light, low saturation so it sits under the deep-green room
without fighting it. No people. Somewhere real on the east coast — Wicklow town,
Arklow, Gorey.

**who-workshop.** Irish trade at work: van doors open with the racking visible,
hawk and trowel, buckets, an Irish reg plate in frame. Daylight, no flash, no stock
gloss, no white-teeth handshake. It must look like someone's actual Tuesday. This
one is **load-bearing** — the "who we are" room is deliberately near-empty, and
without the image it reads as unfinished rather than confident. If no real photo can
be had, cut the section rather than ship it empty.

**contact-coast.** East coast: Wicklow head, Greystones harbour wall, or the
Malahide estuary at low tide. Overcast, horizon low in frame, no sunset, no drone
hero shot.

Across all three: **Irish trades, not American contractors.** No hard hats worn
indoors, no crossed arms in front of a pickup truck, no hi-vis models.

## 3. The Hartnett demo

Hartnett & Sons is an openly fictional butcher, built as live HTML so it can be
scrolled rather than looked at. Its photography is still real photography.

| Slot | File | Size |
|---|---|---|
| Counter, wide | `hartnett-hero` | 1600 × 1000 |
| Hands / wrapping | `hartnett-counter` | 1000 × 1000 |
| Product 1 — dry-aged sirloin | `hartnett-cut-1` | 800 × 800 |
| Product 2 — lamb shoulder | `hartnett-cut-2` | 800 × 800 |
| Product 3 — sausages | `hartnett-cut-3` | 800 × 800 |

Shot for a dark ground: warm interior key light, deep shadows, no white seamless.
Products square, top-lit, on paper or a block.

## 4. Social

| Slot | File | Size | Note |
|---|---|---|---|
| Open Graph card | `og` | 1200 × 630 | Must ship as **`og.jpg`** — several scrapers reject SVG. Update the `og:image` meta. |

Favicon is an inline SVG data URI in `<head>` — no file needed.

---

## Outstanding items — these are placeholders, not decisions

1. **The monthly figure.** `index.html` → `.quote__fig--todo`. The amount renders as
   `€00/month` with an oxide `TO CONFIRM — FIGURE NOT YET SET` flag and a comment
   marking exactly what to replace. Delete the `--todo` modifier and the
   `.quote__flag` line once the real terms are set. The brief is explicit that this
   must stay the same display size as the €500, so replace the number in place — do
   not move it to a footnote.
2. **The phone number.** `01 555 0134` appears in six places (masthead, hero, dock,
   contact, footer, and two `tel:` hrefs). 555 is a fictional-number convention;
   replace with the real line before launch.
3. **The form endpoint.** `<form method="post" action="/enquiry">` needs wiring to a
   real handler. It is a plain POST, so it works without JavaScript once the
   endpoint exists.
4. **`hello@eastcoastdigital.ie`** — confirm the address is live.

---

## Deliberately not built

- **No fabricated "before" screenshot.** Reconstructing a dead site in HTML would
  have made the hero demo look finished today, but it would be an invented asset
  standing in for a real one — the exact failure the brief names. The mechanism is
  complete and tested; it is waiting on two real files.
- **No procedural or generated imagery anywhere.** No gradient meshes, no drawn
  coastlines, no particle fields, no `radial-gradient` skies, no Three.js. There is
  no geometry or data on this site that would justify it.
- **No mobile scroll-scrub for the reveal.** The brief offered drag *or* scroll
  scrub; shipping both would mean neither is the obvious one, and "obvious within
  one second" is the requirement that matters.
- **No teal accent word in the H1.** It broke the accent rule set in `PLAN.md` §1,
  and a single coloured word in a headline is itself a marker of generated design.
- **No hamburger menu.** Below 860px the section links move to the footer and a
  persistent dock carries *Call* and *Get a start date*. A tradesperson on a phone in
  the evening wants the number, not a nav drawer.
