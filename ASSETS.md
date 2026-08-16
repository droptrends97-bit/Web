# Asset slots & outstanding items

The hero no longer needs photography at all — both sides of the before/after are live
rendered pages. What remains is one atmospheric slot and the example build's own images.

Every remaining image is a real `<img>` at final dimensions. What ships today is a soft
placeholder block in a palette colour with the slot spec on it — never a CSS or gradient
approximation of the final picture. Placeholders live at `assets/img/<name>.svg`; replace
with `<name>.jpg` (or `.webp`) and update the `src` in `index.html`. The `width`/`height`
attributes already match, so nothing shifts on load.

---

## 1. The one that matters

| Slot | File | Size | Ratio |
|---|---|---|---|
| Who we are | `who-workshop` | 1200 × 1500 | 4:5 portrait |

Irish trade at work: van doors open with the racking visible, hawk and trowel, buckets,
an Irish reg plate in frame. Daylight, no flash, no stock gloss, no white-teeth
handshake. It must look like someone's actual Tuesday.

This one is **load-bearing** — the "who we are" section is a two-column statement and the
image is half of it. Without a real photo the section should be reworked rather than
shipped with a placeholder.

**Irish trades, not American contractors.** No hard hats worn indoors, no crossed arms in
front of a pickup truck, no hi-vis models.

## 2. The Hartnett example build

Hartnett & Sons is an openly fictional butcher, built as live HTML so it can be scrolled
rather than looked at. Its photography is still real photography.

| Slot | File | Size |
|---|---|---|
| Counter, wide | `hartnett-hero` | 1600 × 1000 |
| Hands / wrapping | `hartnett-counter` | 1000 × 1000 |
| Dry-aged sirloin | `hartnett-cut-1` | 800 × 800 |
| Lamb shoulder | `hartnett-cut-2` | 800 × 800 |
| Sausages | `hartnett-cut-3` | 800 × 800 |

Shot for a dark ground: warm interior key light, deep shadows, no white seamless.
Products square, top-lit, on paper or a block.

## 3. Social

| Slot | File | Size | Note |
|---|---|---|---|
| Open Graph card | `og` | 1200 × 630 | Must ship as **`og.jpg`** — several scrapers reject SVG. Update the `og:image` meta. |

The favicon is an inline SVG data URI in `<head>`; no file needed.

---

## Outstanding items — placeholders, not decisions

1. **The monthly figure.** `index.html` → the second `.fig__amt` in the pricing block.
   It renders as `€00/month` with an amber `To confirm — figure not yet set` chip and a
   comment marking exactly what to replace. Delete the `.fig__flag` line once the real
   terms are set. It is deliberately the same display size as the €500 — replace the
   number in place, do not move it to a footnote.
2. **The phone number.** `01 555 0134` appears in five places (masthead, contact, footer,
   dock, and the `tel:` hrefs). 555 is a fictional-number convention; replace with the
   real line before launch.
3. **The form endpoint.** `<form method="post" action="/enquiry">` needs wiring to a real
   handler. It is a plain POST, so it works without JavaScript once the endpoint exists.
4. **`hello@eastcoastdigital.ie`** — confirm the address is live.

## About the businesses in the hero

The five trades in the switcher — Dolan Plastering, Byrne Electrical, Keane Plumbing &
Heating, Nolan Roofing, Hayes Motors — are **invented**, with invented phone numbers, and
exist to demonstrate the reveal. If any is ever swapped for a real client's before/after,
get written permission first: the "before" half is unflattering by design.

The data lives in one object at the top of `assets/js/main.js` (`TRADES`). Adding a trade
is one entry plus one chip in the markup; a per-campaign landing page can pre-select one.

---

## Deliberately not built

- **No procedural or generated imagery.** No gradient meshes, no drawn coastlines, no
  particle fields, no Three.js. The one gradient on the page is a single soft radial
  behind the hero, used as *lighting* rather than as a stand-in for a picture.
- **No mobile scroll-scrub for the reveal.** Drag on both, cursor-follow as a desktop
  extra. Two competing mechanisms on one component means neither is the obvious one.
- **No hamburger menu.** Below 900px the section links move to the footer and a
  persistent dock carries *Call* and *Get a start date*. A tradesperson on a phone in the
  evening wants the number, not a nav drawer.
