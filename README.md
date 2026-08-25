# Hartnett & Sons — Family Butchers, Midleton

A single-file concept site for a third-generation Cork butcher, built by East Coast Digital.

**`index.html`** is the whole thing — no build step, no dependencies to install. Open it in a
browser, or drop it on any static host.

## Stack

- Tailwind CSS via CDN, configured inline (`tailwind.config`) with the brand palette and type scale
- Google Fonts: Bodoni Moda (display), Instrument Sans (body), JetBrains Mono (labels)
- Vanilla JS in one IIFE at the bottom of the file
- All icons and illustrations are inline SVG — no image requests, no icon library

## What's interactive

| Feature | Notes |
| --- | --- |
| Order ahead | Add cuts to a basket, adjust weight in 0.5 kg steps, running total, persisted to `localStorage` |
| Collection slots | Day/time listboxes generated from real opening hours; past slots and Sundays excluded |
| Cut detail modal | Origin, how it eats, how to ask for it — with a weight stepper and add-to-order |
| Ledger filters | Tabs filter the cut list by animal, with arrow-key navigation |
| Live shop status | "Open now / closes in N min" computed from the clock, refreshed every minute |
| FAQ accordion | Grid-rows height transition, one open at a time |
| Quote slider | Autoplay with pointer-drag, arrows and dots |
| Scroll behaviour | IntersectionObserver reveals, animated stat counters, progress bar, process rail fill |

## Accessibility

Semantic landmarks and headings, a skip link, focus-visible rings throughout, focus trapping and
Escape handling in the modal and order drawer, ARIA listbox/tab patterns with keyboard support, and
a full `prefers-reduced-motion` path that disables animation while leaving all content visible.

## Editing the cut list

Each cut is one `<article class="ledger-row">` in the `#cuts` section. The data attributes
(`data-id`, `data-name`, `data-price`, `data-cat`, `data-icon`, plus the modal copy in
`data-origin` / `data-eats` / `data-ask`) are the single source of truth — the modal and the basket
both read from them, so editing the markup is enough. Update the counts in the filter tabs to match.

Opening hours live in the `HOURS` map in the script; the hours table, the live status badge and the
collection-slot options all derive from it.
