#!/usr/bin/env python3
"""Embed a hero photograph into index.html as the --hero-photo data URI.

index.html is a single self-contained file, so the photo lives inline.

    python3 scripts/embed-hero.py [source-image]

With a source image it is resized, graded for the hero and written to
assets/hero.jpg first; with no argument the existing assets/hero.jpg is
embedded as-is. Afterwards run scripts/build-artifact.py to refresh the
hosted build.
"""
import base64, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PHOTO = ROOT / "assets" / "hero.jpg"
PAGE = ROOT / "index.html"

TARGET_W = 1800          # wide enough for a 2x hero on a laptop
TARGET_RATIO = 16 / 9
QUALITY = 78

def prepare(src: pathlib.Path) -> None:
    """Crop to the hero's aspect, resize, and warm it slightly."""
    from PIL import Image, ImageEnhance
    im = Image.open(src).convert("RGB")

    # centre-crop to the hero ratio so the cover-fit never lops off the subject
    w, h = im.size
    if w / h > TARGET_RATIO:
        new_w = int(h * TARGET_RATIO)
        im = im.crop(((w - new_w) // 2, 0, (w - new_w) // 2 + new_w, h))
    else:
        new_h = int(w / TARGET_RATIO)
        im = im.crop((0, (h - new_h) // 2, w, (h - new_h) // 2 + new_h))

    if im.width > TARGET_W:
        im = im.resize((TARGET_W, int(TARGET_W / TARGET_RATIO)), Image.LANCZOS)

    # a touch more warmth and contrast so it separates from the green
    im = ImageEnhance.Color(im).enhance(1.08)
    im = ImageEnhance.Contrast(im).enhance(1.06)

    PHOTO.parent.mkdir(parents=True, exist_ok=True)
    im.save(PHOTO, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    print(f"prepared {src.name} -> {PHOTO.relative_to(ROOT)} "
          f"({im.width}x{im.height}, {PHOTO.stat().st_size:,} bytes)")

def main() -> None:
    if len(sys.argv) > 1:
        src = pathlib.Path(sys.argv[1]).expanduser()
        if not src.exists():
            sys.exit(f"no such file: {src}")
        prepare(src)

    if not PHOTO.exists():
        sys.exit(f"missing {PHOTO} — pass a source image")

    uri = "data:image/jpeg;base64," + base64.b64encode(PHOTO.read_bytes()).decode()
    html = PAGE.read_text()
    new, n = re.subn(r"--hero-photo:url\(data:image/jpeg;base64,[^)]*\)",
                     "--hero-photo:url(" + uri + ")", html, count=1)
    if n != 1:
        sys.exit("could not find the --hero-photo declaration in index.html")
    PAGE.write_text(new)
    print(f"embedded: {PHOTO.stat().st_size:,} bytes -> {len(uri):,} chars of data URI")

if __name__ == "__main__":
    main()
