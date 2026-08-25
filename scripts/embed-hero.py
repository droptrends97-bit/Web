#!/usr/bin/env python3
"""Embed assets/hero.jpg into index.html as the --hero-photo data URI.

index.html is meant to stay a single self-contained file, so the hero
photograph lives inline. Swapping the photo is: replace assets/hero.jpg,
run this, then run scripts/build-artifact.py.
"""
import base64, pathlib, re, sys

root = pathlib.Path(__file__).resolve().parent.parent
photo = root / "assets" / "hero.jpg"
page = root / "index.html"

if not photo.exists():
    sys.exit(f"missing {photo}")

uri = "data:image/jpeg;base64," + base64.b64encode(photo.read_bytes()).decode()
html = page.read_text()

new, n = re.subn(
    r"--hero-photo:url\(data:image/jpeg;base64,[^)]*\)",
    "--hero-photo:url(" + uri + ")",
    html,
    count=1,
)
if n != 1:
    sys.exit("could not find the --hero-photo declaration in index.html")

page.write_text(new)
print(f"embedded {photo.name}: {photo.stat().st_size:,} bytes -> {len(uri):,} chars of data URI")
