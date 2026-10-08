"""Pack built pages into self-contained HTML previews (CSS, JS, fonts and photos inlined).

usage: python3 scripts/bundle.py site    -> preview/darragh-connolly-site.html (home + about in one file)
       python3 scripts/bundle.py home    -> preview/darragh-connolly-home.html
       python3 scripts/bundle.py about   -> preview/darragh-connolly-about.html
"""
import base64, mimetypes, re, subprocess, sys, tempfile
from pathlib import Path

dist = Path('dist')
cache = Path(tempfile.gettempdir()) / 'dc-bundle-webp'
cache.mkdir(exist_ok=True)


def data_uri(path: Path) -> str:
    mime = mimetypes.guess_type(path.name)[0] or ('font/woff2' if path.suffix == '.woff2' else 'application/octet-stream')
    return f"data:{mime};base64,{base64.b64encode(path.read_bytes()).decode()}"


_uris = {}
def img_uri(rel: str) -> str:
    """Photos are re-encoded to WebP (much smaller) and embedded directly, so they show without JavaScript."""
    if rel not in _uris:
        src = dist / rel.lstrip('/')
        if src.suffix.lower() in ('.jpg', '.jpeg', '.png'):
            out_webp = cache / (src.stem + '.webp')
            subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(src), '-c:v', 'libwebp', '-quality', '80', str(out_webp)], check=True)
            _uris[rel] = 'data:image/webp;base64,' + base64.b64encode(out_webp.read_bytes()).decode()
        else:
            _uris[rel] = data_uri(src)
    return _uris[rel]


def inline_css(css: str) -> str:
    # Keep only latin / latin-ext font faces.
    css = re.sub(r'@font-face\{[^}]*\}', lambda m: '' if re.search(r'(cyrillic|vietnamese|greek)', m.group(0)) else m.group(0), css)
    return re.sub(r"url\(['\"]?(/_astro/[^'\")]+)['\"]?\)", lambda m: f"url({data_uri(dist / m.group(1).lstrip('/'))})", css)


def page_html(route: str) -> str:
    html = (dist / ('index.html' if route == 'home' else f'{route}/index.html')).read_text()
    html = re.sub(r'<link rel="stylesheet" href="(/_astro/[^"]+)">',
                  lambda m: f"<style>{inline_css((dist / m.group(1).lstrip('/')).read_text())}</style>", html)
    html = re.sub(r'<script type="module" src="(/_astro/[^"]+)"></script>',
                  lambda m: f"<script type=\"module\">{(dist / m.group(1).lstrip('/')).read_text()}</script>", html)
    return html


def finish(html: str, links: dict, default: str) -> str:
    html = re.sub(r'src="(/img/[^"]+)"', lambda m: f'src="{img_uri(m.group(1))}"', html)
    html = re.sub(r"url\(['\"]?(/img/[^'\")]+)['\"]?\)", lambda m: f"url({img_uri(m.group(1))})", html)
    html = re.sub(r'href="(/favicon\.svg)"', lambda m: f'href="{data_uri(dist / "favicon.svg")}"', html)

    def link(m):
        url = m.group(1)
        if url in links:
            return f'href="{links[url]}"'
        if url.startswith('/services/'):
            return f'href="{default}#services-title"'
        return m.group(0)
    return re.sub(r'href="(/[^"]*)"', link, html)


def main_inner(html: str) -> str:
    m = re.search(r'<main id="main"[^>]*>(.*)</main>', html, re.S)
    return m.group(1)


def module_scripts(html: str) -> list:
    return re.findall(r'<script type="module">.*?</script>', html, re.S)


def styles(html: str) -> list:
    return re.findall(r'<style>.*?</style>', html, re.S)


PAGE_CSS = """<style>
/* Page switching with plain links and :target, so it works with JavaScript switched off. */
[data-page='about'] { display: none; }
body:has([data-page='about']:target, [data-page='about'] :target) [data-page='about'] { display: block; }
body:has([data-page='about']:target, [data-page='about'] :target) [data-page='home'] { display: none; }
body:has([data-page='about']:target, [data-page='about'] :target) .nav a[href='#about'] {
  color: var(--on-evergreen); background: rgb(255 255 255 / 0.12);
}
[data-page] { scroll-margin-top: 0; }
</style>"""


def build_site() -> str:
    home, about = page_html('home'), page_html('about')
    links = {
        '/': '#home', '/about/': '#about', '/services/': '#services-title', '/the-year/': '#year-title',
        '/gallery/': '#gallery-title', '/contact/': '#cta-title',
    }
    home_main, about_main = main_inner(home), main_inner(about)
    # IDs used on both pages: give the about copies their own names so its buttons stay on the about page.
    home_ids = set(re.findall(r' id="([^"]+)"', home_main))
    for dup in set(re.findall(r' id="([^"]+)"', about_main)) & home_ids:
        about_main = about_main.replace(f' id="{dup}"', f' id="about-{dup}"')
        about_main = about_main.replace(f'aria-labelledby="{dup}"', f'aria-labelledby="about-{dup}"')
        about_main = about_main.replace(f'href="/contact/"', 'href="#about-cta-title"') if dup == 'cta-title' else about_main
    combined = ('<div id="home" data-page="home">' + home_main + '</div>'
                + '<div id="about" data-page="about">' + about_main + '</div>')
    html = home.replace(home_main, combined, 1)
    # Bring across the about page's own styles and scripts that the home page does not already have.
    home_styles, home_scripts = set(styles(home)), set(module_scripts(home))
    extra = [s for s in styles(about) if s not in home_styles]
    html = html.replace('</head>', ''.join(extra) + PAGE_CSS + '</head>', 1)
    extra_js = [s for s in module_scripts(about) if s not in home_scripts]
    html = html.replace('</body>', ''.join(extra_js) + '</body>', 1)
    return finish(html, links, '')


FILES = {'site': 'darragh-connolly-site.html', 'home': 'darragh-connolly-home.html', 'about': 'darragh-connolly-about.html'}

if __name__ == '__main__':
    target = sys.argv[1] if len(sys.argv) > 1 else 'site'
    if target == 'site':
        html = build_site()
    else:
        home_file = FILES['home']
        links = {
            '/': home_file, '/about/': FILES['about'], '/services/': f'{home_file}#services-title',
            '/the-year/': f'{home_file}#year-title', '/gallery/': f'{home_file}#gallery-title',
            '/contact/': f'{home_file}#cta-title',
        }
        html = finish(page_html(target), links, home_file)
    out = Path('preview') / FILES.get(target, f'darragh-connolly-{target}.html')
    out.write_text(html)
    print(out, f"{out.stat().st_size / 1024:.0f} KB", 'leftover root refs:', len(re.findall(r'(?:src|href)="/[^/]', html)))
