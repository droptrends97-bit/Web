# East Coast Digital — eastcoastdigital.ie

A static site. No build step: open `index.html`, or serve the directory.

```
python3 -m http.server 8000
```

| Path | What |
|---|---|
| `index.html` | The whole site — one page, seven sections |
| `assets/css/main.css` | Tokens, sections, the reveal, both rendered pages, the Hartnett demo |
| `assets/js/main.js` | The reveal, the trade switcher, the scroll behaviour |
| `assets/js/gsap.min.js`, `ScrollTrigger.min.js` | GSAP 3.13, self-hosted |
| `assets/fonts/` | Fraunces + Manrope, latin subset, self-hosted |
| `assets/img/` | Placeholder blocks — see `ASSETS.md` |
| `PLAN.md` | Design notes: tokens, type, the hero, and what was cut |
| `ASSETS.md` | Every asset slot, and what still needs a real value |

**Before launch**, `ASSETS.md` lists four placeholders that must be replaced:
the monthly price, the phone number, the form endpoint, and the OG image.

Measured on the shipped code: Lighthouse mobile 97 / 100 / 100 / 100
(performance, accessibility, best practices, SEO), CLS 0.023, ~272 KB uncompressed.
