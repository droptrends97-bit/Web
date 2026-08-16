# eastcoastdigital.ie

Static site. No framework, no build step required to deploy — `index.html` and `assets/` are
the site. Serve the repo root.

```
python3 -m http.server 8000      # or any static server
```

## Layout

```
index.html                  the site
demo/hartnett/index.html    the example build, standalone
partials/hartnett.html      the example build, single source of truth
assets/css/site.css         palette, type, layout
assets/css/hartnett.css     the demo build's own world
assets/js/site.js           reveal, coastline rail, one pinned sequence
assets/js/vendor/           GSAP + ScrollTrigger, vendored (no CDN)
assets/fonts/               Archivo Variable, Newsreader Variable (latin, self-hosted)
assets/img/                 placeholder slots — see ASSETS.md
tools/build.mjs             inlines the demo build into both pages
tools/make-placeholders.mjs regenerates the placeholder images
PLAN.md                     the design plan and the critique that changed it
ASSETS.md                   every image slot, with dimensions and art direction
```

### After editing `partials/hartnett.html`

```
node tools/build.mjs
```

That inlines the demo into both pages so the pinned section and the standalone page cannot
drift apart. On the homepage the build's headings drop a level and its links leave the tab
order — see the comment in `tools/build.mjs` for why.

## Things that need a decision before this goes live

1. **The monthly price is assumed.** The brief set the build at €500 and said the ongoing
   arrangement must be stated in the same size type. It did not say what that arrangement is, so
   the docket currently reads **€25/month** for hosting, domain, SSL, backups and small changes,
   with "no contract — stop any month". Both the figure and the terms are placeholders written to
   be replaced, not proposals. They are in one place: the second `.docket__line` in `index.html`.
2. **Phone numbers and the form endpoint** are placeholders. See ASSETS.md.
3. **Every image is a placeholder.** The design leans on them — the hero reveal and the full-bleed
   band are structural. Until real photography and real screenshots land, the site reads as a
   wireframe of a good site rather than a good site. That is the intended failure mode; the
   alternative was CSS-generated gradient art, which is exactly what makes a page look generated.

## Behaviour

- **The hero reveal** is a real `<input type="range">` laid over the frame, so drag, touch,
  keyboard and screen-reader support are native. With JavaScript off, the rebuilt site is what
  shows and the handle is not offered.
- **The coastline rail** turns scroll position into a latitude, interpolated between the real
  east-coast towns each section is labelled with. It descends because you are travelling south.
- **One pinned sequence**, the demo build, scrubbed 1:1 against scroll via ScrollTrigger. GSAP is
  fetched only for that, and only when motion is allowed.
- `prefers-reduced-motion: reduce` drops the pin (the build becomes an ordinary tall section),
  drops the cursor-follow, and never loads GSAP at all.
