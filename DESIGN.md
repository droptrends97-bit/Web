# Design: The Gardener's Year

An almanac of Darragh's year. The current month leads, and the season colours the page.

## Colour
| Token | Value | Use |
|---|---|---|
| `--paper` | #eceee6 | Page ground (green-grey seed paper) |
| `--paper-2` | #e0e4d8 | Quiet fields: proof band, aside panels |
| `--ink` / `--ink-2` | #17251c / #3c4b41 | Text / secondary text |
| `--evergreen` | #1d3a2a | Masthead, footer, primary buttons, statement band |
| `--leaf` | #8cc63f | Logo lime; on dark grounds and as fills only (never text on paper) |
| `--leaf-ink` | #3d6b12 | Lime's text-safe shade on paper |
| `--season*` | per season | Year ribbon field, CTA wash, season accents |

Seasons are set on `<html data-season>` from the visitor's date (`Base.astro`). Autumn is acer wine, winter is frost blue, spring is blossom pink and summer is lawn green. Each season defines `--season`, `--on-season`, `--on-season-2`, `--season-soft` and `--season-ink`.

## Type
- Display: Bricolage Grotesque Variable, condensed (`font-stretch` 75–85%), weights 650–800. Set like woodtype almanac headings.
- Text: Schibsted Grotesk Variable, 18px base, line height 1.6.
- Both fonts are self-hosted via @fontsource.

## Components
- **Year ribbon** (`YearRibbon.astro`): the signature. Twelve month tabs over a season field; selecting a month swaps its work panel and recolours the field. Accessible tablist with arrow, Home and End keys.
- **Almanac rules**: a 2px ink rule opens each list, with 1px `--rule` lines between rows.
- **Plates**: square-cornered photos, no frames.
- **Buttons**: pill shapes. Primary is evergreen, ghost is outlined ink, leaf is the lime phone CTA.
- **Entries**: a service list as ruled rows (thumbnail, name, short description, arrow), never a card grid.

## Motion
One authored moment: the year ribbon's crossfade and blur-in, plus the season colour transition (500ms, expo out). Elsewhere, only hover nudges on arrows. Reduced motion is respected.
