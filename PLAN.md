# East Coast Digital — second pass

**Repo state note:** this repository contained only `README.md` on both `main` and the
working branch. Section 2 of the brief has been treated as an accurate spec of the site
being redesigned rather than as something readable from source, so the implementation
builds the whole thing to that information architecture. No existing section was dropped.

---

## Pass 1 — plan

### 1. Tokens

Six values. The limestone/ink/teal family stays; the values move.

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#E7E3D6` | Ground. Chart buff — cooler and greener than limestone cream. |
| `--land` | `#D6D0BE` | Second ground. Banded sections, form fields, the "land" fill. |
| `--ink` | `#101615` | Type. Cold near-black with a green cast — an engraved plate, **not navy**. |
| `--depth` | `#08302E` | Full-bleed dark rooms. Deep water. |
| `--marker` | `#085A50` | The accent. Deep, dull, dirty teal. |
| `--oxide` | `#A8412A` | Rust/minium. Rationed to decay and hazard. |

Why these and not the current ones: the generic look is not "cream + teal", it is
*warm* cream + *bright* teal at high saturation. Pulling the ground green-grey and
dropping the accent to a 5.05:1 dull teal removes the tell while keeping the family.
`--oxide` is the one addition — it is the colour of anti-fouling paint, rust on a
slipway and OS Ireland contour lines, and it gives the "before" state a meaning
without a caricature.

Contrast, measured: ink/paper 6.3:1 at the accent, ink/paper 14.4:1 for type,
oxide/paper 4.70:1, paper/depth 11.1:1. The accent was deepened from `#0A6A5E`
during the build because it measured 4.24:1 against `--land` — a fail. At `#085A50`
it clears 4.5:1 on **both** grounds. On `--depth` it still fails (1.8:1), so dark
rooms use `color-mix(in srgb, var(--marker) 40%, var(--paper))` at 5.8:1, and oxide
on dark uses a 55% lift at 4.9:1 — derived values, not extra tokens.

**Where the accent is not allowed:**

- Never as a fill on anything larger than a 48px square. No teal panels, no teal sections.
- Never on body copy or on a heading — including the current "one teal word in the H1",
  which is cut (see *Cuts*).
- Never in a gradient. There are no gradients.
- Never on the "before" half of the reveal. That half is ink and oxide only.
- At most one teal element per viewport-height of scroll.

Oxide is narrower still: the before layer, the problem section's hazard rules, and
nothing else. **Never on a CTA** — the accent-for-action / oxide-for-decay split is
the whole point.

### 2. Type

Reference world mined for what it actually contains, not for atmosphere:
Admiralty charts set place names in a slanted roman with a mono-ish tabular layer for
soundings; Irish shopfront and van signwriting is overwhelmingly a heavy Egyptian slab,
not a grotesque; OS mapping uses a humanist sans with strong numerals.

| Role | Face | Setting |
|---|---|---|
| Display | **Rokkitt** var 500–800 | Sentence case, tracking `-0.02em`, leading `0.95–1.05` |
| Body | **IBM Plex Sans** var | 400/500, `1.55` leading, max 62ch |
| Data / labels | **IBM Plex Mono** 400/500 | Uppercase, `+0.14em`, 11–13px |

**Beating the condensed grotesque:** heavy condensed uppercase grotesque *is* the AI
house style, and uppercase display is half the tell on its own. A heavy Egyptian slab
set in sentence case is the opposite move on both axes, and it is the correct register
for the audience — it is the lettering already on their van and on the butcher's
shopfront down the road. Mono is not decoration here: it carries the latitudes,
waypoints, prices and form labels, which is exactly the tabular annotation layer a
chart has.

Self-hosted latin-subset woff2, ~104KB total, two files preloaded, metric-matched
fallback `@font-face` with `size-adjust` so the swap costs no layout shift.

### 3. Layout

**One sentence:** seven rooms with four different grounds and deliberately uneven
density — a medium hero, a dense dark problem room, a near-empty statement, a
full-bleed maximal build, a tight data table, a sparse dark price, and a calm close.

| # | Section | Ground | Density | Scale |
|---|---|---|---|---|
| 1 | Hero + reveal | paper | medium | huge display, full-bleed frame |
| 2 | The problem | **depth**, full-bleed | dense | small type, hairline rows, oxide |
| 3 | Who we are | paper | **nearly empty** | one sentence at 5vw, one tall image |
| 4 | Example build | land → full-bleed | maximal | edge to edge, no browser chrome |
| 5 | How it runs | land | dense | mono table, two columns |
| 6 | Pricing | **depth**, full-bleed | sparse | €500 and the monthly at equal size |
| 7 | Contact | paper | medium | phone number at display scale |

#### Hero

```
┌───────────────────────────────────────────────────────────────┐
│▌ EAST COAST DIGITAL    Example build  Process  Pricing        │
│▌                       01 555 0134   [ Get a start date ]     │
│▌───────────────────────────────────────────────────────────── │
│●  MALAHIDE · 53.4508°N                                        │
│▌                                                              │
│▌  Your business deserves a website                            │
│▌  that doesn't embarrass you.                                 │
│▌                                                              │
│▌  ┌──────────────┰────────────────────────────────────────┐   │
│▌  │ BEFORE 2011  ┃ ◉ AFTER — built by us                  │   │
│▌  │              ┃                                        │   │
│▌  │ [ dead site  ┃   [ the rebuild — real screenshot ]    │   │
│▌  │   screenshot]┃                                        │   │
│▌  │  PLASTERER · MALAHIDE                                 │   │
│▌  └──────────────┸────────────────────────────────────────┘   │
│▌   ◀ drag ▶   This is the page we build before we ring you.   │
│▌                                                              │
│▌  [ See a build for your trade ]   [ 01 555 0134 ]            │
└───────────────────────────────────────────────────────────────┘
```

#### The problem — dense dark room, deliberately unlike the hero

```
╔═══════════════════════════════════════════════════════════════╗
║ ● DUBLIN · 53.3498°N                        ground: --depth   ║
║                                                               ║
║ Most small business websites are working against them.        ║
║                                                               ║
║ 01   No site at all      A Facebook page is not a website …   ║
║ ──────────────────────────────────────────────────────────    ║
║ 02   Built years ago     A site from 2013 tells someone …     ║
║ ──────────────────────────────────────────────────────────    ║
║ 03   Slow and cluttered  Four seconds to load on a phone …    ║
║      ↑ oxide             ↑ paper-74 on depth                  ║
║                                                               ║
║        [ full-bleed image band — shuttered shopfront ]        ║
╚═══════════════════════════════════════════════════════════════╝
```

Three equal cards become a numbered hairline ledger. Same content, a quarter of the
vertical space, and it reads as a survey rather than as a pricing grid.

#### Who we are — the near-empty room

```
┌───────────────────────────────────────────────────────────────┐
│● BRAY · 53.2028°N                                             │
│                                                               │
│                                                               │
│   Two of us, in Malahide.          ┌─────────────────┐        │
│   We build the site,               │                 │        │
│   then we answer the phone.        │  [ 3:4 image    │        │
│                                    │    workshop /   │        │
│                                    │    van / hands ]│        │
│                                    │                 │        │
│                                    └─────────────────┘        │
│                                                               │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

Roughly 70% of this section is empty. It is the only place on the page where that is
true, which is what makes it register.

### 4. The signature — the reveal

One frame, two layers. `.reveal__before` is the base and paints fully;
`.reveal__after` sits on top clipped to `inset(0 0 0 var(--x))`, so it occupies
everything right of the handle. `--x` defaults to `30%`: on arrival you see a 30%
strip of the dead site on the left and 70% of the rebuild on the right.

That default is chosen so the good version dominates for a cold visitor, and so the
no-JS and JS compositions are the same thing rather than two designs.

Above 820px the frame takes a **fixed height** rather than a ratio, so the grip is
reachable without scrolling on a 900px laptop. That makes the desktop crop roughly
3:1, anchored to the top of both screenshots — which is the band that actually says
"dated" or "current". Below 820px it returns to a 4:3 ratio.

**Desktop.** Pointer movement anywhere inside the frame moves the wipe with no click
required (gated behind `(hover: hover)`), and press-and-drag works identically.
Leaving the frame holds the last position rather than snapping back. The handle is a
2px rule with a 44px grip, two chevrons and a mono `DRAG` label.

**Mobile.** The same handle, 56px hit target, `touch-action: none` on the grip only so
vertical page scrolling is never captured. `--x` starts at 34% and the grip carries a
persistent chevron pair. No scroll-scrub alternative — two competing mechanisms on one
component is worse than one obvious one.

**Obvious in one second:** a visible handle, permanent BEFORE/AFTER labels inside the
frame, a one-shot nudge (30 → 46 → 30 over 1.1s) fired once on first intersection, and
a caption under the frame. Nothing here is a discovered interaction.

**Keyboard.** The handle is `role="slider"` with `aria-valuenow`; arrows move 2%,
shift-arrows 10%, Home/End go to the extremes.

**Reduced motion.** The interaction stays — it is user-driven, not motion. Only the
nudge is suppressed.

**No JS.** `html:not(.js)` sets `--x: 0%`, so the rebuild covers the frame completely,
the handle is hidden, and a caption states what the comparison would have shown.

### 5. Motion budget

GSAP + ScrollTrigger, `scrub` only, nothing on a timer.

1. Course-line progress on the left rail (scrub).
2. The pinned build sequence — the single pin — capped at 1.4 viewport heights.
3. Section labels fading in on enter, 200ms, once.

That is the whole list. The reveal nudge is a one-shot affordance hint, not ambient
motion. Everything dies under `prefers-reduced-motion`, and the pin does not run on
mobile at all (see below).

### 6. The coastline device — committing

Kept, and promoted to carrying real information. A fixed left rail holds a hairline
course line whose drawn length is the page's scroll progress; the waypoints on it sit
at each section's true position in the document, they are anchor links, and they fill
in as they are passed. The readout at the top shows the current town and latitude.

The towns are real, on the actual east coast, and descend monotonically as you scroll
south: Malahide 53.4508 → Dublin 53.3498 → Bray 53.2028 → Greystones 53.1424 →
Wicklow 52.9808 → Arklow 52.7936 → Wexford 52.3369.

So the device is a progress indicator, a table of contents and a jump nav at once. On
mobile it collapses to a 2px top progress rule with no labels — at 360px the rail
would cost more width than it returns.

**Revised during the build.** The first attempt let the full-bleed grounds run
underneath the rail, with the rail's ink adapting to whichever room was behind it.
That fails by construction: the rail is a full viewport tall, so it routinely spans a
paper room and a deep room at the same time and no single tone is legible against
both. The rail now owns a permanent 148px paper margin column, and the grounds bleed
to its edge. It reads as a chart's border panel, which is what it always wanted to
be, and it deletes the adaptive-tone machinery entirely.

### 7. Copy fixes

- **€500**, not €300. The monthly arrangement is set at the same display size directly
  beneath it, not in a footnote. The figure itself is an explicit placeholder pending
  the real terms.
- The pricing card stops being a pricing card: no rounded rectangle, no tick list, no
  full-width pill. It becomes a dockyard quotation — two figures at display scale, an
  inclusions list set as a mono manifest, one line CTA.
- `Work` → `Example build`.
- `Get a quote` → `Get a start date`. There is one price; a quote is a lie.
- `Get started` → `Get a start date`.
- Form submit → `Send it — you'll get a reply today`.
- `See the work` → `See a build for your trade`, anchored to the build.

### 8. Assets

No CSS-generated or math-generated stand-ins anywhere. Every image is a real `<img>`
pointing at a real file at final dimensions; the shipped files are flat placeholder
blocks in a palette colour with the slot spec set on them in mono. Full list with art
direction in `ASSETS.md`.

---

## Pass 2 — self-critique

> *Would I have produced this plan for any small agency site?*

**Yes, for four parts. Each is revised below.**

### a) The before/after slider is a stock widget

Honest answer: image-comparison sliders are a component you can install. Building one
and calling it a signature is not a differentiator by itself.

**What changed.** The frame is now *addressable*. It carries a trade-and-town chip
(`PLASTERER · MALAHIDE`) and the caption says plainly: *"This is the page we build
before we ring you."* The reveal stops being a widget demonstrating a capability and
becomes a picture of the actual sales motion — the outreach builds the prospect's real
homepage first and then sends the link, and the hero is that email. The markup takes
the trade and town from `data-` attributes on one element so a per-campaign landing
page is a one-line change, which is the thing that makes it worth having built rather
than installed.

### b) Nautical theming for a coast-named agency is the obvious move

A chart-referenced palette on a site called East Coast Digital is the first idea anyone
has, and the failure mode is theme-park: compass roses, rope borders, distressed paper
texture, depth soundings scattered as decoration.

**What changed.** The chart influence is now allowed to appear in exactly two places —
the typographic system, and the single course line. Explicitly cut: soundings scatter,
compass rose, paper grain texture, any hand-drawn coastline vector, and the section-3
suggestion that the hairline be accompanied by chart furniture. One structural device,
carrying real data, and otherwise the restraint does the talking. If a reviewer can
tell it is "nautical" from a thumbnail, it has gone too far.

### c) Pinned scroll-through of a demo is a 2023 agency cliché

Pinning something and scrubbing it is the single most over-used scroll technique of the
last three years, and done badly it holds the user hostage.

**What changed.** Two hard limits. The pin is capped at 1.4 viewport heights, so the
sequence is over in about one thumb-flick and can never feel stuck; and there is a
permanent, visible "Open the full build" escape that leaves the pin entirely. More
importantly, **the pin does not run on mobile at all** — on a phone the build simply
renders full-width and you scroll it natively, which is not a degraded fallback, it is
the identical experience delivered by the platform instead of by JavaScript. That also
protects the mobile performance floor, which a scrubbed pin is the most likely thing to
break.

### d) "Let one section be nearly empty" reads as unfinished, not confident

Emptiness is only luxurious when something is obviously being withheld. An empty
section with two lines of type in it just looks like the copy is missing.

**What changed.** The near-empty room gets one tall 3:4 image occupying a third of the
width. Now the space is compositional — the image anchors it and the emptiness becomes
a decision. Without the image slot this section should be cut rather than shipped
empty, and that is noted as a condition in `ASSETS.md`.

### Two smaller revisions from the same pass

- **The teal word in the H1 is cut.** It contradicted the accent rule I had just
  written, and one-coloured-word-in-a-headline is itself a strong marker of generated
  design. The slab carries the line without help.
- **The mobile scroll-scrub option for the reveal is cut.** The brief offered "drag, or
  scroll-driven scrub". Shipping both means neither is obvious, and the whole
  requirement is that it be obvious in one second.
