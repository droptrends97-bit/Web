# Asset slots

Every image on the site is a slot. Each one currently holds a flat placeholder in a palette
colour with its own spec written on it — deliberately **not** a CSS or generated approximation of
the final picture, because that is what makes a page read as machine-made.

To fill a slot: export the real file at the **exact dimensions listed**, keep the filename, and
drop it into `assets/img/`. Nothing in the layout moves — every `<img>` already carries its
`width`/`height`, so there is no layout shift before or after.

Placeholders are regenerated with `node tools/make-placeholders.mjs`. Delete that call for a slot
once the real file lands, or just let the real file overwrite it (the script only writes `.svg`;
prefer `.avif`/`.webp` for the real thing and update the `src`).

---

## Site

| File | Size | Ratio | Where | Art direction |
|---|---|---|---|---|
| `hero-before.svg` | 1400×1000 | 7:5 | Hero reveal, base layer | The **same business's** dead website, screenshotted or faithfully reconstructed. Table layout, stretched logo, stock handshake photo, Flash-era navy gradient bar, "Copyright 2011" in the footer. Must be plausibly real — a caricature makes the whole comparison dishonest and readers can tell. Desktop viewport, captured 1400 wide, top of page only, business name legible. |
| `hero-after.svg` | 1400×1000 | 7:5 | Hero reveal, clipped layer | The rebuilt site for that same business. Export `/demo/hartnett/` at 1400×1000, top of page, no browser chrome, DPR 2. It has to be the real build — this is the one image the entire argument rests on. |
| `band-coast.svg` | 2400×1100 | ~24:11 | Full-bleed band | Genuine Irish texture. First choice: a signwritten trade van on a wet east-coast pier at dusk; second choice: a harbour wall with hand-painted lettering. Low sun, nobody looking at camera, no stock-American contractors in hard hats. Must be dark enough in the lower third to carry white type — a scrim is applied, but the photo should do most of the work. |
| `trade-hands.svg` | 1200×1500 | 4:5 | **Unplaced** — spare | Portrait. Hands and materials, not a face: a plasterer trowelling, an electrician at a consumer unit, tiles being cut. Real dirt, Irish light, phone-camera honesty over studio gloss. Held for the contact section if it ever needs weight. |
| `og-card.svg` | 1200×630 | 1.9:1 | Social share | Wordmark, the headline and the €500 line on ink. **Export to `og-card.png` before launch** and update the `og:image` meta — most platforms will not render SVG. |
| `favicon.svg` | 32×32 | 1:1 | Tab icon | Already final: a course line and a waypoint. Add a 180×180 `apple-touch-icon.png` if you want the iOS home-screen icon to look deliberate. |

## Hartnett & Sons demo build

These sit inside the example build, so they set the standard the client work is judged against.
Shoot them as one session — same board, same light — or they will read as stock.

| File | Size | Ratio | Art direction |
|---|---|---|---|
| `hartnett-counter.svg` | 1800×1200 | 3:2 | Butcher counter, tiled wall, hanging scales, low warm light. Cork shopfront realism. Keep the left third quiet — the headline sits over it. |
| `hartnett-shopfront.svg` | 1400×1000 | 7:5 | Painted timber shopfront, gold signwritten lettering, awning, street context. Square-on from across the road. |
| `hartnett-cut-1.svg` | 900×900 | 1:1 | Dry-aged ribeye on paper, overhead, dark timber board. |
| `hartnett-cut-2.svg` | 900×900 | 1:1 | Coiled fresh sausage, overhead, same board and light as cut-1. |
| `hartnett-cut-3.svg` | 900×900 | 1:1 | Rack of lamb, overhead, same board and light as cut-1. |

---

## Non-image placeholders to replace before launch

| What | Where | Note |
|---|---|---|
| Phone number `020 913 0000` | nav, price section, contact, footer | `020 913 xxxx` is the range ComReg reserves for drama, so nothing real is dialled while this is in place. Swap for the real number in all four places and in the `tel:` hrefs. |
| Phone number `020 913 0100` | Hartnett demo | Same reason. The demo business is fictional; leave it fictional. |
| Form action `/enquiry` | contact section | Points nowhere. Wire to whatever handles enquiries (Formspree, a mailto fallback, or a real endpoint) before the site takes traffic. |
| Monthly price `€25` | price section | **Assumed, not given.** See README. |
