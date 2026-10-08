"""Bundle dist/index.html into one self-contained HTML file (CSS, JS, fonts, images inlined)."""
import base64, mimetypes, re, sys
from pathlib import Path

dist = Path('dist')
# usage: bundle.py [page] ; page is 'home' (default) or a route folder such as 'about'
page = sys.argv[1] if len(sys.argv) > 1 else 'home'
FILES = {'home': 'darragh-connolly-home.html', 'about': 'darragh-connolly-about.html'}
out = Path('preview') / FILES.get(page, f'darragh-connolly-{page}.html')
html = (dist / ('index.html' if page == 'home' else f'{page}/index.html')).read_text()

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
    css = re.sub(r"url\(['\"]?(/_astro/[^'\")]+)['\"]?\)", lambda m: f"url({data_uri(dist / m.group(1).lstrip('/'))})", css)
    return css

html = re.sub(r'<link rel="stylesheet" href="(/_astro/[^"]+)">',
              lambda m: f"<style>{inline_css((dist / m.group(1).lstrip('/')).read_text())}</style>", html)
html = re.sub(r'<script type="module" src="(/_astro/[^"]+)"></script>',
              lambda m: f"<script type=\"module\">{(dist / m.group(1).lstrip('/')).read_text()}</script>", html)

# Images: re-encoded to WebP (much smaller) and embedded directly, so they show without JavaScript.
import subprocess, tempfile
cache = Path(tempfile.gettempdir()) / 'dc-bundle-webp'
cache.mkdir(exist_ok=True)
_uris = {}
def img_uri(rel: str) -> str:
    if rel not in _uris:
        src = dist / rel.lstrip('/')
        if src.suffix.lower() in ('.jpg', '.jpeg', '.png'):
            out_webp = cache / (src.stem + '.webp')
            subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(src), '-c:v', 'libwebp', '-quality', '80', str(out_webp)], check=True)
            _uris[rel] = 'data:image/webp;base64,' + base64.b64encode(out_webp.read_bytes()).decode()
        else:
            _uris[rel] = data_uri(src)
    return _uris[rel]
html = re.sub(r'src="(/img/[^"]+)"', lambda m: f'src="{img_uri(m.group(1))}"', html)
html = re.sub(r"url\(['\"]?(/img/[^'\")]+)['\"]?\)", lambda m: f"url({img_uri(m.group(1))})", html)
html = re.sub(r'href="(/favicon\.svg)"', lambda m: f'href="{data_uri(dist / "favicon.svg")}"', html)

# Internal links: pages that have their own preview file link to it; the rest jump to the home page sections.
home = FILES['home']
anchors = {
    '/': home, '/about/': FILES['about'], '/services/': f'{home}#services-title', '/the-year/': f'{home}#year-title',
    '/gallery/': f'{home}#gallery-title', '/contact/': f'{home}#cta-title',
}
def link(m):
    url = m.group(1)
    if url in anchors:
        return f'href="{anchors[url]}"'
    if url.startswith('/services/'):
        return f'href="{home}#services-title"'
    return m.group(0)
html = re.sub(r'href="(/[^"]*)"', link, html)

out.write_text(html)
print(out, f"{out.stat().st_size/1024:.0f} KB", 'leftover root refs:', len(re.findall(r'(?:src|href)="/[^/]', html)))
