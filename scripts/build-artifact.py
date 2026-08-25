"""Generate the Artifact build of the site from index.html.

The artifact CSP blocks cdn.tailwindcss.com, so the compiled stylesheet is
inlined instead. Everything else is carried over verbatim, so the hosted page
and the repo file cannot drift.
"""
import re, sys

SP = "/tmp/claude-0/-home-user-Web/307ab255-112e-5c4e-b22c-b1fdb5800c49/scratchpad"
src = open("/home/user/Web/index.html").read()
tw  = open(f"{SP}/tw.css").read()

# the page's own <style> block
own = re.search(r"<style>(.*?)</style>", src, re.S).group(1)

# the Google Fonts link (allowed by the artifact CSP)
fonts = re.search(r'<link href="https://fonts\.googleapis\.com[^>]*>', src).group(0)

title = re.search(r"<title>(.*?)</title>", src, re.S).group(1)

# body content: everything from the grain overlay to </main>, plus the
# modal/drawer/toast and the script
body_start = src.index('<div class="grain"')
body_end   = src.rindex("</body>")
body = src[body_start:body_end]

out = f"""<title>{title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
{fonts}
<style>
{tw}
</style>
<style>
{own}
</style>
{body}"""


# The artifact wrapper owns <head>, so this file cannot declare a charset.
# Make it pure ASCII instead, so it renders identically whatever encoding the
# host serves it as: HTML entities in markup, \u escapes inside <script>.
import re as _re

def _esc_html(t):
    return "".join(c if ord(c) < 128 else "&#%d;" % ord(c) for c in t)

def _esc_js(t):
    return "".join(c if ord(c) < 128 else "\\u%04x" % ord(c) for c in t)

_m = _re.search(r"<script>(.*)</script>", out, _re.S)
_script = _m.group(1)
_head, _tail = out[:_m.start(1)], out[_m.end(1):]
out = _esc_html(_head) + _esc_js(_script) + _esc_html(_tail)
assert all(ord(c) < 128 for c in out), "still has non-ASCII"
print("escaped to pure ASCII")

open("/home/user/Web/artifact/hartnett.html", "w").write(out)
print("written:", len(out), "bytes")
for must in ["cdn.tailwindcss.com", "<!doctype", "<html", "<head>", "<body"]:
    assert must not in out.lower(), f"leaked: {must}"
print("no wrapper tags, no blocked CDN — ok")
