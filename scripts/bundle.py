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
            subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(src), '-vf', r'scale=min(1100\,iw):-2', '-c:v', 'libwebp', '-quality', '70', str(out_webp)], check=True)
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
    # Photos used more than once are stored once, in a CSS rule, and shown via `content: url()`.
    counts = {}
    for m in re.finditer(r'src="(/img/[^"]+)"', html):
        counts[m.group(1)] = counts.get(m.group(1), 0) + 1
    shared = {rel: f'u{i}' for i, rel in enumerate(r for r, c in counts.items() if c > 1)}
    blank = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
    def src(m):
        rel = m.group(1)
        if rel in shared:
            return f'src="{blank}" data-u="{shared[rel]}"'
        return f'src="{img_uri(rel)}"'
    html = re.sub(r'src="(/img/[^"]+)"', src, html)
    if shared:
        css = ''.join(f'img[data-u="{k}"]{{content:url({img_uri(rel)})}}' for rel, k in shared.items())
        html = html.replace('</head>', f'<style>{css}</style></head>', 1)
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


def garden_set(html: str):
    """The page's garden plants (a <div class="garden-set" data-theme="..."> block), if it has one."""
    start = html.find('<div class="garden-set"')
    if start < 0:
        return None, None
    depth, i = 0, start
    for m in re.finditer(r'<div\b|</div>', html[start:]):
        depth += 1 if m.group(0) == '<div' else -1
        if depth == 0:
            block = html[start:start + m.end()]
            return re.search(r'data-theme="([^"]+)"', block).group(1), block
    return None, None


def main_inner(html: str) -> str:
    m = re.search(r'<main id="main"[^>]*>(.*)</main>', html, re.S)
    return m.group(1)


def module_scripts(html: str) -> list:
    return re.findall(r'<script type="module">.*?</script>', html, re.S)


def styles(html: str) -> list:
    return re.findall(r'<style>.*?</style>', html, re.S)


# Extra pages carried in the single-file site, as (page id, built route).
SITE_PAGES = [('about', 'about'), ('pots', 'services/pots-and-planters'), ('intervention', 'services/garden-intervention'), ('health', 'services/garden-health'), ('care', 'services/garden-care'), ('hedging', 'services/hedging'), ('passion', 'services/passionate-about-pots'), ('bulbs', 'services/bulb-planting'), ('reviews', 'testimonials'), ('gallery', 'gallery')]


def page_css(ids):
    """Page switching with plain links and :target, so it works with JavaScript switched off."""
    rules = []
    for pid in ids:
        on = f"body:has([data-page='{pid}']:target, [data-page='{pid}'] :target)"
        rules.append(f"[data-page='{pid}'] {{ display: none; }}")
        rules.append(f"{on} [data-page='{pid}'] {{ display: block; }}")
        rules.append(f"{on} [data-page='home'] {{ display: none; }}")
    rules.append("body:has([data-page='gallery']:target, [data-page='gallery'] :target) .nav a[href='#gallery'] "
                 "{ color: var(--on-evergreen); background: rgb(255 255 255 / 0.12); }")
    rules.append("body:has([data-page='reviews']:target, [data-page='reviews'] :target) .nav a[href='#reviews'] "
                 "{ color: var(--on-evergreen); background: rgb(255 255 255 / 0.12); }")
    rules.append("body:has([data-page='about']:target, [data-page='about'] :target) .nav a[href='#about'] "
                 "{ color: var(--on-evergreen); background: rgb(255 255 255 / 0.12); }")
    rules.append("body:has([data-page='pots']:target, [data-page='pots'] :target, [data-page='intervention']:target, [data-page='intervention'] :target, [data-page='health']:target, [data-page='health'] :target, [data-page='care']:target, [data-page='care'] :target, [data-page='hedging']:target, [data-page='hedging'] :target, [data-page='passion']:target, [data-page='passion'] :target, [data-page='bulbs']:target, [data-page='bulbs'] :target) .sub summary "
                 "{ color: var(--on-evergreen); background: rgb(255 255 255 / 0.12); }")
    return '<style>' + '\n'.join(rules) + '</style>'


def garden_css(home_theme, page_themes):
    """Show the home garden by default, and each page's own garden while that page is open."""
    rules = [f".garden-set:not([data-theme='{home_theme}']) {{ display: none; }}"]
    for pid, theme in page_themes.items():
        if theme == home_theme:
            continue
        on = f"body:has([data-page='{pid}']:target, [data-page='{pid}'] :target)"
        rules.append(f"{on} .garden-set[data-theme='{home_theme}'] {{ display: none; }}")
        rules.append(f"{on} .garden-set[data-theme='{theme}'] {{ display: contents; }}")
    return '<style>' + '\n'.join(rules) + '</style>'


def build_site() -> str:
    home = page_html('home')
    links = {
        '/': '#home', '/about/': '#about', '/services/pots-and-planters/': '#pots', '/services/garden-intervention/': '#intervention', '/services/garden-health/': '#health', '/services/garden-care/': '#care', '/services/hedging/': '#hedging', '/services/passionate-about-pots/': '#passion', '/services/bulb-planting/': '#bulbs', '/testimonials/': '#reviews',
        '/services/': '#services-title', '/the-year/': '#year-title', '/gallery/': '#gallery',
        '/contact/': '#cta-title',
    }
    home_main = main_inner(home)
    used_ids = set(re.findall(r' id="([^"]+)"', home_main))
    blocks = ['<div id="home" data-page="home">' + home_main + '</div>']
    home_styles, home_scripts = set(styles(home)), set(module_scripts(home))
    extra_css, extra_js = [], []
    home_theme, _ = garden_set(home)
    themes = {home_theme: 'home'} if home_theme else {}
    page_themes, extra_gardens = {}, []
    for pid, route in SITE_PAGES:
        page = page_html(route)
        theme, block = garden_set(page)
        if theme:
            page_themes[pid] = theme
            if theme not in themes:
                themes[theme] = pid
                extra_gardens.append(block)
        inner = main_inner(page)
        # IDs already used elsewhere get a page prefix so each page's buttons stay on that page.
        for dup in set(re.findall(r' id="([^"]+)"', inner)) & used_ids:
            inner = inner.replace(f' id="{dup}"', f' id="{pid}-{dup}"')
            inner = inner.replace(f'aria-labelledby="{dup}"', f'aria-labelledby="{pid}-{dup}"')
            if dup == 'cta-title':
                inner = inner.replace('href="/contact/"', f'href="#{pid}-cta-title"')
        used_ids |= set(re.findall(r' id="([^"]+)"', inner))
        blocks.append(f'<div id="{pid}" data-page="{pid}">' + inner + '</div>')
        for st in styles(page):
            if st not in home_styles and st not in extra_css:
                extra_css.append(st)
        for js in module_scripts(page):
            if js not in home_scripts and js not in extra_js:
                extra_js.append(js)
    html = home.replace(home_main, ''.join(blocks), 1)
    # One garden for the whole preview: every page's plants live in it, and the page on show picks its set.
    _, home_block = garden_set(html)
    if home_block:
        html = html.replace(home_block, home_block + ''.join(extra_gardens), 1)
    html = html.replace('</head>', ''.join(extra_css) + page_css([p for p, _ in SITE_PAGES]) + garden_css(home_theme, page_themes) + '</head>', 1)
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
            '/contact/': f'{home_file}#cta-title', '/testimonials/': f'{home_file}#cta-title',
        }
        html = finish(page_html(target), links, home_file)
    out = Path('preview') / FILES.get(target, f'darragh-connolly-{target}.html')
    out.write_text(html)
    print(out, f"{out.stat().st_size / 1024:.0f} KB", 'leftover root refs:', len(re.findall(r'(?:src|href)="/[^/]', html)))
