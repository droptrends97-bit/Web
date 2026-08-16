/**
 * Generates the placeholder files that stand in every image slot.
 *
 * A placeholder is a flat block in a palette colour with the spec written on it.
 * It is deliberately NOT an approximation of the final image: no gradients, no
 * generated texture, no CSS-drawn scenery. When a real photograph or screenshot
 * arrives it replaces the file at the same path and the same dimensions, and
 * nothing in the layout moves.
 *
 * Run: node tools/make-placeholders.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';

const OUT = new URL('../assets/img/', import.meta.url);
mkdirSync(OUT, { recursive: true });

const INK = '#0E1518';
const LIMESTONE = '#E9E2D3';
const LIMESTONE_DEEP = '#D8CEBA';
const SLATE = '#4E5A60';
const TEAL = '#05655C';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Wrap on width in rough character units. */
function wrap(text, max) {
  const out = [];
  let line = '';
  for (const word of text.split(' ')) {
    if ((line + ' ' + word).trim().length > max) {
      out.push(line.trim());
      line = word;
    } else line += ' ' + word;
  }
  if (line.trim()) out.push(line.trim());
  return out;
}

function placeholder({ file, w, h, ground, ontop, label, note }) {
  const pad = Math.round(Math.min(w, h) * 0.06);
  const base = Math.max(11, Math.round(Math.min(w, h) / 34));
  const noteSize = Math.max(10, Math.round(base * 0.62));
  const lines = wrap(note, Math.max(24, Math.round((w - pad * 2) / (noteSize * 0.62))));
  const body = lines
    .map((l, i) => `<text x="${pad}" y="${pad + base * 2.6 + i * noteSize * 1.5}" font-family="ui-monospace, Menlo, monospace" font-size="${noteSize}" fill="${ontop}" opacity=".72">${esc(l)}</text>`)
    .join('\n  ');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)} — placeholder">
  <rect width="${w}" height="${h}" fill="${ground}"/>
  <rect x="${pad / 2}" y="${pad / 2}" width="${w - pad}" height="${h - pad}" fill="none" stroke="${ontop}" stroke-opacity=".28" stroke-dasharray="6 6"/>
  <text x="${pad}" y="${pad + base}" font-family="ui-monospace, Menlo, monospace" font-size="${base}" font-weight="700" fill="${ontop}" letter-spacing="1">${esc(label.toUpperCase())}</text>
  <text x="${pad}" y="${pad + base * 1.9}" font-family="ui-monospace, Menlo, monospace" font-size="${noteSize}" fill="${ontop}" opacity=".9">${w}×${h}  ·  ${file}</text>
  ${body}
</svg>`;
  writeFileSync(new URL(file, OUT), svg);
  return { file, w, h, label, note };
}

const slots = [
  {
    file: 'hero-before.svg', w: 1400, h: 1000, ground: LIMESTONE_DEEP, ontop: INK,
    label: 'Hero — BEFORE',
    note: 'Screenshot of the SAME business\'s dead website, or a faithful reconstruction of one. Table layout, stretched logo, stock handshake photo, Flash-era navy gradient bar, "Copyright 2011". Must be plausibly real — not a caricature. Desktop viewport, captured at 1400 wide, top of page only. Business name visible.',
  },
  {
    file: 'hero-after.svg', w: 1400, h: 1000, ground: LIMESTONE, ontop: INK,
    label: 'Hero — AFTER',
    note: 'Screenshot of the rebuilt site for the SAME business. Export the Hartnett & Sons build at /demo/hartnett/ at 1400x1000, top of page, no browser chrome, device pixel ratio 2. Must be the real build, not a mockup.',
  },
  {
    file: 'band-coast.svg', w: 2400, h: 1100, ground: SLATE, ontop: LIMESTONE,
    label: 'Full-bleed band',
    note: 'Atmospheric, genuine Irish texture. Preferred: a signwritten trade van parked on a wet east-coast pier at dusk, or a harbour wall with hand-painted lettering. Landscape, low sun, no people looking at camera, no stock-American contractors in hard hats. Dark enough to carry white type across the lower third.',
  },
  {
    file: 'trade-hands.svg', w: 1200, h: 1500, ground: SLATE, ontop: LIMESTONE,
    label: 'Trade portrait',
    note: 'Portrait orientation. Hands and materials, not a face: a plasterer trowelling, an electrician at a consumer unit, tiles being cut. Real dirt, real Irish light, phone-camera honesty rather than studio gloss.',
  },
  {
    file: 'hartnett-counter.svg', w: 1800, h: 1200, ground: '#12241C', ontop: '#EFE7D6',
    label: 'Hartnett — counter',
    note: 'Demo asset. Butcher counter, tiled wall, hanging scales, low warm light. Cork shopfront realism. Landscape hero crop; keep the left third quiet for the overlaid headline.',
  },
  {
    file: 'hartnett-shopfront.svg', w: 1400, h: 1000, ground: '#12241C', ontop: '#EFE7D6',
    label: 'Hartnett — shopfront',
    note: 'Demo asset. Painted timber shopfront, gold signwritten lettering, awning, street context. Shot square-on from across the road.',
  },
  {
    file: 'hartnett-cut-1.svg', w: 900, h: 900, ground: '#1B3226', ontop: '#EFE7D6',
    label: 'Hartnett — dry-aged beef',
    note: 'Demo asset. Square. Dry-aged ribeye on paper, overhead, dark timber board.',
  },
  {
    file: 'hartnett-cut-2.svg', w: 900, h: 900, ground: '#1B3226', ontop: '#EFE7D6',
    label: 'Hartnett — sausages',
    note: 'Demo asset. Square. Coiled fresh sausage, overhead, same board and light as cut-1 so the row reads as one shoot.',
  },
  {
    file: 'hartnett-cut-3.svg', w: 900, h: 900, ground: '#1B3226', ontop: '#EFE7D6',
    label: 'Hartnett — lamb',
    note: 'Demo asset. Square. Rack of lamb, overhead, same board and light as cut-1.',
  },
  {
    file: 'og-card.svg', w: 1200, h: 630, ground: INK, ontop: TEAL,
    label: 'Open Graph card',
    note: 'Social share card. Wordmark, the headline, and the €500 line on ink. Export to og-card.png before launch — most platforms will not render SVG.',
  },
];

const made = slots.map(placeholder);
console.log(made.map((m) => `${m.file}  ${m.w}x${m.h}`).join('\n'));
