# East Coast Digital — design plan (Pass 1) and self-critique (Pass 2)

Status: planning only. No implementation code written yet.

Note on the repo: this repository contains a README and nothing else. The site
described in the brief does not exist here. Everything below is therefore
specified as a build, not a refactor. The brief's description of the current
site is treated as accurate and is used as the thing being replaced.

---

## Pass 1 — the plan

### 1. Tokens

Five values. The limestone/ink/teal family survives, but the **roles are
inverted**, and that inversion is the point.

The current palette's problem is not the hues, it is that cream + near-black +
one bright teal accent is the default output of every design tool in 2026. The
teal is doing the job of "the accent", which is exactly the slot that reads as
generated. So teal stops being the accent and becomes the ink; the accent
becomes chart magenta, which is the colour Admiralty charts reserve for
anything that matters — lights, beacons, cautionary notes — and which nothing
in this category is using.

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#EFE7D6` | Primary ground. Admiralty chart buff — yellower and dirtier than the usual warm cream. |
| `--land` | `#E2D3B4` | Secondary ground. The chart's land tint. Used for whole-section ground changes, never for cards. |
| `--ink` | `#10312F` | Text, and the dark full-bleed ground. Near-black that is unmistakably sea-teal in the shadow. This is where the teal went. |
| `--shoal` | `#9FB8B4` | Hairlines, rules, depth contours, quiet/secondary text on `--ink`. |
| `--light` | `#C6317B` | The accent. Chart magenta. |

Contrast: `--ink` on `--paper` ≈ 14.8:1. `--light` on `--paper` ≈ 5.0:1 —
sufficient for large text and UI, so body copy stays `--ink` and magenta is
never used for running text.

**Where the accent is not allowed** (this is a hard rule, not a preference):

- Never as a large fill. No magenta buttons, no magenta panels, no magenta section grounds.
- Never on body copy or headlines.
- Never more than **one** magenta element visible in a single viewport height.
- Not on the nav CTA. That button is `--ink` filled with `--paper` text.

Magenta appears in exactly five places on the whole site: the reveal handle,
the active waypoint marker, the rule under the price figures, the form focus
ring, and inline link underlines. That scarcity is what makes it read as
signal rather than decoration.

### 2. Type

Reference world is nautical charts, Admiralty pilot books, OS Ireland, harbour
signage, trade signwriting. Mining it properly rather than gesturing at it:

**Display — Source Serif 4, 600/700, Title Case, tight tracking.**

The current heavy condensed uppercase grotesque is not beaten by another
grotesque, it is beaten by refusing the format. Every generated site in this
category sets giant uppercase condensed sans. Chart and pilot-book lettering is
a sharp, sober, engraved transitional roman, and Source Serif 4 is the
closest honest match that is also a real text face with a technical-documentation
lineage rather than a fashion serif. Set in Title Case, not caps — caps go
somewhere else, see below. It reads *surveyed and official*, which is a
register no competitor in Irish trades web design is occupying.

**Body — IBM Plex Sans.**

Not Inter. Inter is the single most reliable fingerprint of a generated
layout. Plex has the instrument-panel register, a real italic, and enough
warmth at 17–19px to carry three-line paragraphs.

**Labels and data — IBM Plex Mono, uppercase, +0.18em tracking.**

This is where the capitals and the letter-spacing live. Chart marginalia is
monospaced-adjacent and *wide*-tracked, never condensed. The mono is earned
rather than decorative because it is carrying actual coordinates and waypoint
names — see the coastline device below. If the coastline device were cut, the
mono would have to go with it.

All three self-hosted as subsetted woff2, `font-display: swap`, with
`size-adjust` metric-matched fallbacks so there is no layout shift on load.
No external font CDN.

### 3. The coastline device — **commit**

Committing, because it is the one element on the site that a template cannot
produce, it justifies the mono, and it is the thing that makes the studio's
name mean something. Half-committing was correctly identified as the worst
option; the current 8pt-coordinates version is the half-commit.

What it becomes:

- A **course line**: an SVG path down the left edge, not straight — plotted
  from real coastal waypoints, so it wanders the way a coastline does.
- Drawn by scroll. `stroke-dashoffset` scrubbed to scroll progress, so the
  passage is plotted as you descend. Freezes when you stop, reverses on scroll up.
- **Waypoints are real places in true descending latitude order**, one per
  section, so scrolling the page is travelling down the east coast:
  Malahide 53.4508°N → Dublin 53.3498°N → Greystones 53.1424°N →
  Wicklow 52.9808°N → Arklow 52.7936°N → Courtown 52.6436°N →
  Wexford 52.3369°N → Rosslare 52.2510°N.
- Markers are chart light symbols. The active one takes the magenta flash mark.
  Label = place, latitude, section name.
- Mobile: collapses to a 3px gutter line with tick markers; labels reduce to
  the place name, set horizontally at each section head rather than in a rail.
  Still scrubbed, still real.

The visitor is not required to decode a latitude scale. They are required to
notice they are going down a coast they know the names of. That is the payoff.

### 4. Layout and rhythm

The eight-identical-sections problem is solved by changing **ground, density,
and scale** every time, so no two adjacent sections feel like the same room.
Four ground changes, two full-bleeds, one deliberately empty section, one dense
data panel, one pinned sequence.

| # | Section | Ground | Density | Scale |
|---|---|---|---|---|
| 1 | Hero — the reveal | paper | sparse text, dense image | full-bleed, ~92vh |
| 2 | Proof strip | ink | one line + horizontal scrub | full-bleed, short |
| 3 | The problem | paper | **dense** — chart panel | contained, small type |
| 4 | The build (Hartnett) | ink | pinned scroll-through | full-bleed |
| 5 | Who we are | land | **nearly empty** | full-bleed photo, 3 sentences |
| 6 | How it runs | paper | medium two-column | contained, reduced scale |
| 7 | Pricing | ink | two figures + legend | full-bleed band |
| 8 | Contact | paper | form + photo | contained |

#### Wireframe — hero

```
┌──────────────────────────────────────────────────────────────┐
│ ECD          The build   Process   Pricing   01 xxx xxxx [▪] │  nav, paper
├─┬────────────────────────────────────────────────────────────┤
│ │                                                            │
│●│   ┌──────────────────────────────────────────────────┐     │
│ │   │                    ║                             │     │
│ │   │   BEFORE           ║          AFTER              │     │
│ │   │   their real       ║   their real rebuilt        │     │
│ │   │   current site     ║   homepage                  │     │
│ │   │                    ▓ ← magenta handle, 44px      │     │
│ │   │                    ║   always visible at rest    │     │
│ │   └──────────────────────────────────────────────────┘     │
│ │        DRAG ─────────────────────────────────                │
│ │                                                            │
│ │   Your business deserves a website                         │
│ │   that doesn't embarrass you                     ← serif   │
│ │                                                            │
│ │   [ See a full build ]   [ Get a price and a start date ]  │
│ │                                                            │
│ MALAHIDE — 53.4508°N                                         │
└──────────────────────────────────────────────────────────────┘
  ↑ course line, left rail, drawn by scroll
```

Headline sits **beneath** the reveal, not over it. Nothing is overlaid on the
screenshots — overlaying type on a screenshot of a website is unreadable and
looks like a slide deck.

#### Wireframe — the problem (dense, contained, small)

Deliberately the tightest thing on the page. Reads like a panel of chart notes.

```
┌──────────────────────────────────────────────────────────────┐
│ │  GREYSTONES — 53.1424°N                                    │
│●│                                                            │
│ │  Most small business websites are working against them     │
│ │  ──────────────────────────────────────────────────────    │
│ │  ┌──────────────┬──────────────┬──────────────┐            │
│ │  │ 01           │ 02           │ 03           │  ← mono     │
│ │  │ No site      │ Built years  │ Slow and     │            │
│ │  │ at all       │ ago          │ cluttered    │            │
│ │  │              │              │              │            │
│ │  │ small body   │ small body   │ small body   │  15px      │
│ │  │ copy, 4 lines│ copy, 4 lines│ copy, 4 lines│            │
│ │  └──────────────┴──────────────┴──────────────┘            │
│ │      hairline dividers only — no card borders, no radius   │
└──────────────────────────────────────────────────────────────┘
```

No boxes, no rounded corners, no shadows. Columns separated by `--shoal`
hairlines. This is the section that most needs to *not* look like three cards.

#### Wireframe — who we are (the empty room)

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │  land ground
│  ┌────────────────────────────────────────────────────────┐  │
│  │                                                        │  │
│  │        [ SLOT — 2400×1350 — workshop / van / hands ]    │  │
│  │                    full bleed                           │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│                                                              │
│         We're based in Malahide. We build for trades          │
│         on this coast.                                        │
│                                                              │
│                                                              │  ~40vh of
│                                                              │  nothing
└──────────────────────────────────────────────────────────────┘
```

Three sentences maximum, set at body scale, no headline. The photograph does
the talking. The emptiness is the contrast that makes section 3 read as dense
and section 4 read as loud.

### 5. The signature — how the reveal works

**Structure.** One `<figure>` with two images at identical intrinsic
dimensions, absolutely stacked. The "after" is wrapped and clipped with
`clip-path: inset(0 0 0 var(--split))`. `--split` is a percentage custom
property. Nothing else moves.

**The handle is a real `<input type="range">`,** visually restyled, spanning
the figure. This is deliberate: it gives keyboard control, arrow-key
stepping, focus, and screen-reader semantics natively, rather than a `div`
with ARIA bolted onto it. The thumb is the visible magenta handle, 44px on
touch, with a `DRAG` label set in mono beneath the figure. Obvious in under a
second, because it is a control, not a discovered gesture.

**Desktop.** Pointer movement inside the figure drives `--split`; pointer
leaving returns it to rest at 38% (so the "after" dominates). Drag works
anywhere in the figure. rAF-throttled, writes one custom property, no layout.

**Mobile.** Touch-drag anywhere in the figure, plus the range thumb. Plus one
scroll-linked demonstration: as the hero enters, a ScrollTrigger `scrub` moves
`--split` from 62% → 38% across the first 15% of scroll. It is tied to the
user's scroll, so it freezes when they stop and reverses when they scroll back
— it does not autoplay. It detaches permanently on first touch.

**Reduced motion.** No scrub. Split rests at 38%. Drag and keyboard still work.

**No JS.** `--split` defaults to `0%`, so the "after" fully covers the
"before". Headline, offer, and phone number all render. The range input is
present but inert, which is correct — nothing claims to be interactive and
isn't.

**Performance.** Two images, AVIF with WebP fallback, explicit `width`/`height`
plus `aspect-ratio` on the figure so there is zero CLS. `fetchpriority="high"`
on the "after". `clip-path` on a promoted layer is compositor-only.

### 6. Motion budget

Total, for the entire site:

1. The hero reveal's entry scrub (15% of one viewport).
2. The course line drawing down the left rail, scrubbed to page progress.
3. The Hartnett build's pinned scroll-through — the one pinned sequence.
4. Section 2's horizontal scrub.
5. Quiet hover states: 120ms colour/underline only. No transforms, no lifts, no scale.

Nothing autoplays. Nothing loops. `prefers-reduced-motion` disables 1–4
entirely and the page still communicates everything — the pinned section
becomes a normal full-width scrolling section, the course line renders fully
drawn.

GSAP + ScrollTrigger, self-hosted, `defer`. The page is fully functional and
fully legible before it loads.

### 7. Copy fixes

- **Price is €500**, not €300.
- **The monthly arrangement is stated at the same size as the €500.** See
  "Open questions" — I do not have the monthly figure or terms.
- Nav "Work" → **"The build"**, singular and honest, anchoring to Hartnett,
  with a line beneath it: *"One full example build. Yours would be next."*
  This turns the thin-portfolio problem into the offer.
- "See the work" → **"See a full build"**.
- "Get started" → **"Get a price and a start date"**.
- Form submit → **"Send my details"**.

Everything else in the voice is preserved verbatim.

### 8. Stack

Static HTML + CSS + one JS module. No framework, no build step. GSAP and
ScrollTrigger self-hosted and deferred. This is an eight-section marketing
page with a hard Lighthouse floor; a framework would cost budget and buy
nothing. Deploys as static files anywhere.

---

## Pass 2 — critique of the above, before writing any code

The test: would I have produced this for any small agency site?

### Where the answer was yes, and what changed

**1. The before/after slider is a stock component. — Revised, significantly.**

This is the most serious problem with Pass 1. A before/after drag slider is in
every Webflow template gallery and half the agency sites in the country.
Building it as the hero makes it the *biggest* stock element on the page rather
than a small one. The brief mandates the interaction, so the fix is not to drop
it but to make it do something no template's slider can.

The revision: **the hero reveal is parameterised by URL.**
`eastcoastdigital.ie/?b=obrien-plumbing` swaps the "before" for that specific
prospect's actual current site and the "after" for the homepage already built
for them. The cold email links to that URL. The prospect opens it one-handed in
the evening and drags their *own* dead website out of the way to reveal their
*own* new one.

That is not a slider component. That is the outreach model — "build their real
homepage first, then send the link" — performed in the hero, and it is the
single highest-value idea in this document. Generic traffic with no parameter
gets the Hartnett default, which is what the original plan described.

Implementation cost is small: a JSON manifest of prospects mapping slug →
{before image, after image, business name, alt text}, read at load, with the
default baked into the HTML so no-JS and unparameterised visits are unaffected.
Falls back silently on an unknown slug.

**2. I planned motion before I planned photography. — Reordered.**

The brief is explicit that the absence of imagery, not the absence of effects,
is the single biggest cause of the generic feeling. Pass 1 nonetheless spent
its detail on scroll behaviour and gave photography a table row.

The correction is structural, not cosmetic: the layout is designed so the
images are **load-bearing**. Section 5 is a photograph and three sentences — if
the photograph is missing, the section is visibly broken, not merely plainer.
Same for the hero. The test I will hold the build to is: *with the image slots
empty, does the page look unfinished?* If it looks fine, the images are
decorative and the design is still a type-on-cream document.

**3. The latitude-proportional spacing was machinery for its own sake. — Cut.**

Pass 1 proposed positioning each waypoint marker at a page offset proportional
to its true latitude. That forces section heights to be dictated by arithmetic
nobody can perceive, and it would produce ugly gaps. The real information
content is the *order* and the *places*, both of which survive. Cutting the
proportional scale, keeping true descending order and real coordinates.

**4. A serif display face is becoming its own 2026 default. — Kept, with a hedge.**

Fair objection: the big-editorial-serif look is now nearly as common as the
condensed-grotesque look it replaces. The defence is that the register is
different — Source Serif in Title Case beside wide-tracked mono chart labels
reads as *document*, not as *editorial*. But the risk is real, so the wordmark
and the two price figures are treated as **signwritten rather than typeset**:
drawn letterforms from the Irish trade-signage reference, used at exactly two
places on the site. That is a texture a font choice cannot fake, and it is the
element most resistant to looking generated.

**5. The giant number on a dark band is a common pricing treatment. — Revised.**

Pass 1 replaced a stock SaaS card with a slightly less stock dark band. The
revision uses the chart reference to solve the brief's actual requirement: the
build price and the monthly price are set as **two soundings**, chart
convention, side by side at identical size, with the inclusions rendered as a
**chart legend** — a two-column key with symbols — rather than a tick list.

The genuine benefit is not the wit. It is that the format makes it structurally
impossible to render the monthly figure smaller than the build figure, which is
exactly the failure the brief identified as costing sales.

### Where the answer was no

The coastline commit, the density map across the eight sections, the accent
inversion, and the deliberately empty section are specific to this brief and
this business, and stand.

---

## Asset slots

Every slot is a flat `--land` block with its spec written on it in mono until
filled. No CSS gradient meshes, no procedural waves, no `radial-gradient`
skies, no particle fields. Nothing decorative is generated by maths.

| # | File | Dimensions | Aspect | Art direction |
|---|---|---|---|---|
| 1 | `hero-before-hartnett.avif` | 2400×1600 | 3:2 | Real screenshot of a genuinely dead site — 2011-era, table layout, stock header, Flash-era typography. Or a faithful reconstruction, photographed on a real screen. Not a caricature: no Comic Sans, no visible "under construction" GIF. It must be plausible enough that a plasterer recognises his own. |
| 2 | `hero-after-hartnett.avif` | 2400×1600 | 3:2 | Real screenshot of the actual Hartnett build at the same viewport. Same crop, same scale, pixel-aligned with #1 — any misalignment destroys the reveal. |
| 3 | `who-we-are.avif` | 2400×1350 | 16:9 | Full-bleed atmospheric. Irish trades, not American contractors: a van interior on a wet morning, a workbench with real wear, hands and materials. Overcast Irish light, low contrast, no blue-hour grade, no lens flare. Nobody smiling at camera. |
| 4 | `contact-side.avif` | 1200×1500 | 4:5 | Portrait. Coast or harbour on the east coast — Malahide, Greystones, Wicklow. Grey water, real weather. Sits beside the form. |
| 5 | `process.avif` | 1600×1200 | 4:3 | Optional. Screen or notebook mid-build, shot over a shoulder. Only if section 6 needs the ballast — cut it if it reads as filler. |
| 6 | Wordmark + price figures | SVG | — | Signwritten letterforms, drawn not typeset. Irish trade signage reference. |
| 7 | `prospects.json` + per-prospect pairs | 2400×1600 each | 3:2 | Per the URL-parameterised hero. One before/after pair per prospect, same specs as #1 and #2. |

Each raster slot ships as AVIF + WebP, at 1×/2× for the hero pair.

## Cut, with reasons

| Cut | Reason |
|---|---|
| Latitude-proportional marker spacing | Machinery nobody can perceive, dictating section heights. Order and real places carry the concept without it. |
| Teal as the accent colour | It is the specific tell the brief identified. Teal is retained as the ink and the dark ground; magenta takes the accent slot at very low surface area. |
| The browser chrome frame around the Hartnett demo | It frames the proof as a picture of a website. Full-bleed and scrolled-through, it is the website. |
| The pricing card as an object | Dark rounded rectangle + tick list + full-width CTA is the most templated element in the category, at the highest-intent moment. Replaced by a full-bleed band with two equal figures and a legend. |
| Any framework or build step | An eight-section static page with a Lighthouse floor of 90. Nothing to buy. |
| Three.js | Nothing here is real geometry or real data. Decorative 3D is the tell the brief warned about. |
| Section 5's optional process photo | Flagged for cut if it reads as filler when the real images land. |

## Open questions

1. **The monthly arrangement.** The brief requires it stated plainly at the
   same size as the €500, but does not give the figure or the terms. Blocking
   for the pricing section's copy.
2. **Confirm the accent inversion.** The brief said keep the limestone/ink/teal
   family. Teal is kept, but demoted from accent to ink, with magenta taking
   the accent slot. This is a deliberate reading of "how the accent is deployed
   cannot stay" and worth confirming before it is built.
