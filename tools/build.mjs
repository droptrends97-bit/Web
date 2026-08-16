/**
 * Inlines partials/hartnett.html into every file that carries the
 * BUILD:START / BUILD:END markers, rewriting {{BASE}} to the right asset
 * root for each destination.
 *
 * The committed HTML is complete and deployable — this step only exists so
 * the pinned section on the homepage and the standalone demo page cannot
 * drift apart. Run it after editing partials/hartnett.html.
 *
 * Run: node tools/build.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const partial = readFileSync(new URL('partials/hartnett.html', root), 'utf8').trim();

/**
 * On the agency homepage the build is embedded inside another document, so
 * two things have to change that do not change on the standalone page:
 *   - its headings drop a level, or the page ends up with two h1s
 *   - its links leave the tab order, because focusing something inside the
 *     pinned, translated stage would scroll the container and break the pin.
 *     The same content is fully interactive at /demo/hartnett/, which the
 *     section links to.
 */
function embed(html) {
  return html
    .replace(/<h3(\s|>)/g, '<h4$1').replace(/<\/h3>/g, '</h4>')
    .replace(/<h2(\s|>)/g, '<h3$1').replace(/<\/h2>/g, '</h3>')
    .replace(/<h1(\s|>)/g, '<h2$1').replace(/<\/h1>/g, '</h2>')
    .replace(/<a /g, '<a tabindex="-1" ');
}

const targets = [
  { file: 'index.html', base: '', transform: embed },
  { file: 'demo/hartnett/index.html', base: '../../' },
];

const START = '<!-- BUILD:START -->';
const END = '<!-- BUILD:END -->';

for (const { file, base, transform } of targets) {
  const url = new URL(file, root);
  const html = readFileSync(url, 'utf8');
  const a = html.indexOf(START);
  const b = html.indexOf(END);
  if (a === -1 || b === -1) throw new Error(`markers missing in ${file}`);

  let body = partial.replaceAll('{{BASE}}', base);
  if (transform) body = transform(body);
  const next = html.slice(0, a + START.length) + '\n' + body + '\n' + html.slice(b);
  writeFileSync(url, next);
  console.log(`inlined build → ${file}`);
}
