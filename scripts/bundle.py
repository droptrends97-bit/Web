"""Bundle dist/index.html into one self-contained HTML file (CSS, JS, fonts, images inlined)."""
import base64, mimetypes, re, sys
from pathlib import Path

dist = Path('dist')
out = Path(sys.argv[1] if len(sys.argv) > 1 else 'preview/darragh-connolly-home.html')
html = (dist / 'index.html').read_text()

def data_uri(path: Path) -> str:
    mime = mimetypes.guess_type(path.name)[0] or ('font/woff2' if path.suffix == '.woff2' else 'application/octet-stream')
    return f"data:{mime};base64,{base64.b64encode(path.read_bytes()).decode()}"

def inline_css(css: str) -> str:
    # Keep only latin / latin-ext font faces; drop other subsets.
    def face(m):
        block = m.group(0)
        if re.search(r'(cyrillic|vietnamese|greek)', block):
            return ''
        return block
    css = re.sub(r'@font-face\{[^}]*\}', face, css)
    css = re.sub(r'url\((/[^)]+)\)', lambda m: f"url({data_uri(dist / m.group(1).lstrip('/'))})", css)
    return css

html = re.sub(r'<link rel="stylesheet" href="(/_astro/[^"]+)">',
              lambda m: f"<style>{inline_css((dist / m.group(1).lstrip('/')).read_text())}</style>", html)
html = re.sub(r'<script type="module" src="(/_astro/[^"]+)"></script>',
              lambda m: f"<script type=\"module\">{(dist / m.group(1).lstrip('/')).read_text()}</script>", html)

# Images: each file is embedded once and assigned by a tiny script, since the page repeats photos.
images = {}
def img(m):
    name = m.group(1)
    images.setdefault(name, data_uri(dist / 'img' / name))
    return f'data-img="{name}"'
html = re.sub(r'src="/img/([^"]+)"', img, html)
html = re.sub(r'href="(/favicon\.svg)"', lambda m: f'href="{data_uri(dist / "favicon.svg")}"', html)
import json
loader = ("<script>(()=>{const I=" + json.dumps(images) +
          ";document.querySelectorAll('img[data-img]').forEach(e=>{e.src=I[e.dataset.img]})})()</script>")
html = html.replace('</body>', loader + '</body>')
html = re.sub(r"url\((/img/[^)]+)\)", lambda m: f"url({data_uri(dist / m.group(1).lstrip('/'))})", html)

# Internal pages become anchors on this single page.
anchors = {
    '/': '#main', '/services/': '#services-title', '/the-year/': '#year-title', '/gallery/': '#services-title',
    '/about/': '#about-title', '/contact/': '#cta-title',
}
def link(m):
    url = m.group(1)
    if url in anchors:
        return f'href="{anchors[url]}"'
    if url.startswith('/services/'):
        return 'href="#services-title"'
    return m.group(0)
html = re.sub(r'href="(/[^"]*)"', link, html)

out.write_text(html)
print(out, f"{out.stat().st_size/1024:.0f} KB", 'leftover root refs:', len(re.findall(r'(?:src|href)="/[^/]', html)))
