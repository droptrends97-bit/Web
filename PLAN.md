# East Coast Digital — v2 plan

Written before implementation. Pass 1 is the plan, Pass 2 is the critique that changed it.
Everything in Pass 1 below is the **post-critique** version; Pass 2 records what was thrown out.

---

## Pass 1 — the plan

### 1. Tokens

Six values. The limestone/ink/teal family survives; the values, the contrast, and the accent
policy do not.

| Token | Hex | Role |
|---|---|---|
| `--limestone` | `#E9E2D3` | Primary ground. Greyer and warmer than the old cream — closer to chart paper than to "off-white SaaS". |
| `--limestone-deep` | `#D8CEBA` | Second ground. Density shifts, rules, insets, the "before" side of the reveal. |
| `--ink` | `#0E1518` | Near-black with a blue-green bias. Type, and the ground of the hero, the build section and the price. |
| `--slate` | `#4E5A60` | Secondary type on limestone, hairlines, chart furniture. |
| `--teal` | `#05655C` | Deep chart teal. Contrast 6.4:1 on limestone. |
| `--hi-vis` | `#E2571C` | Signal orange. Harbour marks, lifebuoys, and every trade jacket in Ireland. |

**Where the accent is not allowed** — this matters more than the values:

- Teal is **banned from headlines.** No single teal word in a black sentence. That device is the
  single clearest fingerprint of a generated page and it is the first thing to go.
- Teal is banned from body copy, card borders, icons, bullets and button fills. Primary buttons
  are ink; secondary buttons are hairline-on-ground.
- Teal appears in exactly three places: the course line and its waypoints, the "after" side of
  the reveal, and link underlines on hover/focus.
- Hi-vis appears in exactly two places: the drag handle, and the "before" tag. Nowhere else, ever.
  It is the loudest colour on the site and it is spent on the one thing the user must touch.

Net effect: the first full screen a cold visitor sees is **ink, not cream**, and the accent is
carrying information rather than decorating a headline.

### 2. Type

Reference world: Admiralty pilot books, OSi place-name lettering, harbour and quay signage,
signwritten van livery.

- **Display — Archivo Variable, width axis pushed to 112–125%, weight 700–800, uppercase,
  tracking −0.01em, leading 0.92.** Chart and signage lettering is *wide* — place names are
  stretched along coastlines, quay signs are painted wide because they are read from a distance.
  The current condensed grotesque is the house style of every generated agency page in 2026;
  expanded is its literal inverse and it is a signage reference, not a fashion reference.
- **Body — Newsreader Variable, 400/500, optical-serif, 1.55 leading.** A serif body on a trades
  site reads as substance and as print. It also puts maximum distance between this page and the
  neutral-sans-on-cream default.
- **Labels and data — Archivo 500, uppercase, 0.16em tracking, 11–12px.** Same family as display,
  so no third font file.

Two woff2 files, 145KB total, latin subset, `font-display: swap`, display face preloaded.
No italics shipped (the italic file cost 64KB and earned nothing).

### 3. Layout and rhythm

Nine sections that deliberately do not share a rhythm. Ground colour, density and scale all move.

| # | Section | Ground | Density | Scale |
|---|---|---|---|---|
| 1 | Hero — the reveal | ink | medium | huge |
| 2 | Position — one sentence | limestone | **near-empty** | huge |
| 3 | The problem — three cards | limestone-deep | **dense, small type** | small |
| 4 | The build — Hartnett, pinned | ink | full-bleed | full width |
| 5 | Atmospheric band | image, full-bleed | one line | medium |
| 6 | How it runs — ledger | limestone | wide, sparse | medium |
| 7 | The price — docket | ink | tabular | large |
| 8 | Contact | limestone | form | medium |
| 9 | Footer | ink | small | small |

#### Hero (new)

```
┌──────────────────────────────────────────────────────────────┐
│ EAST COAST DIGITAL     THE BUILD  HOW IT RUNS  PRICE   [call]│  ink ground
├──────────────────────────────────────────────────────────────┤
│ 53.4508°N  MALAHIDE                                          │
│                                                              │
│  YOUR BUSINESS DESERVES A WEBSITE                            │  Archivo
│  THAT DOESN'T EMBARRASS YOU                                  │  expanded 800
│                                                              │  no accent word
│  ┌────────────────────────┬─────────────────────────────┐    │
│  │ [BEFORE]               ▐║▌                           │    │  ▐║▌ = hi-vis
│  │  dead 2011 site        ▐║▌   the rebuilt site        │    │  handle, always
│  │  limestone-deep        ▐║▌   real build              │    │  visible, ~38%
│  │                        ▐║▌                           │    │
│  │  LAST TOUCHED 2011     ▐║▌   UPDATED THIS WEEK       │    │  readouts flip
│  │  8.4s ON 4G            ▐║▌   1.1s ON 4G              │    │  as you drag
│  │  NO PHONE NUMBER       ▐║▌   TAP TO CALL             │    │
│  └────────────────────────┴─────────────────────────────┘    │
│         ← DRAG                                               │
│                                                              │
│  [ See the whole build ]   [ One price: €500 ]               │
└──────────────────────────────────────────────────────────────┘
```

The paragraph that used to sit under the headline is cut — the readouts say the same thing with
evidence instead of adjectives.

#### The problem (dense — deliberately the opposite of the hero)

```
│ 53.3498°N  DUBLIN                                            │  limestone-deep
│ MOST SMALL BUSINESS WEBSITES ARE WORKING AGAINST THEM         │  smaller display
│──────────────┬───────────────────┬───────────────────────────│  hairline grid,
│ 01           │ 02                │ 03                        │  no cards, no
│ NO SITE      │ BUILT YEARS AGO   │ SLOW AND CLUTTERED        │  rounded corners,
│ 4 lines of   │ 4 lines of small  │ 4 lines of small body     │  no shadows
│ small body   │ body copy         │ copy                      │
│──────────────┴───────────────────┴───────────────────────────│
```

Three columns divided by hairlines in a single ruled block, like a table in a pilot book. Tight
leading, 15px body. After the hero's scale this reads as a change of room, not another slide.

#### The build (full-bleed, pinned — the one motion spend)

```
├══════════════════════════════════════════════════════════════┤  ink, full bleed,
│ 53.1424°N GREYSTONES        HARTNETT & SONS — REAL BUILD     │  zero side margin
│┌────────────────────────────────────────────────────────────┐│
││                                                            ││  the actual
││        the Hartnett homepage, real HTML, full width        ││  markup, pinned,
││        scrubs vertically as you scroll                     ││  scrolled 1:1 by
││                                                            ││  ScrollTrigger
│└────────────────────────────────────────────────────────────┘│
│  ▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░  progress          [ Open the real site ]│
└══════════════════════════════════════════════════════════════┘
```

No browser chrome, no laptop mock, no phone frame. Chrome is what you draw around something you
are embarrassed to show at full size.

### 4. Signature — the reveal

**Desktop.** The frame holds two stacked layers. The "after" layer is clipped by
`--pos` (0–100). A hi-vis handle sits on the seam.

- Pointer down anywhere in the frame grabs the seam; the seam follows the pointer until release.
- Hovering without dragging eases the seam toward the cursor at ~0.12 lerp, so it drifts under the
  hand and the affordance is discovered before it is read.
- Leaving the frame settles it back to 38% — the resting position deliberately shows *more before
  than after*, so there is visibly something to pull.

**Mobile.** Touch-drag on the frame, same code path (Pointer Events, so one implementation).
The handle is 44px wide with a grip and the word DRAG under it. No scroll-scrub on the hero: a
hero that moves while you are trying to scroll past it is a fight, not a feature.

**Keyboard and no-JS.** The seam is driven by a real `<input type="range">` that is visually
the handle. Arrow keys move it, it is focusable, it announces as a slider with
`aria-valuetext` of "before/after". With JS off the range is inert, so CSS defaults `--pos` to
100 — the after state and the headline are fully visible.

**Reduced motion.** Cursor-follow easing is off (the seam jumps to the pointer, no lerp), the
progress-drawn course line renders at full length immediately, and the pinned build section
becomes a normal tall section you scroll past. Nothing is lost, only smoothed.

### 5. The coastline device — committed, not cut

It carries real data or it goes. It carries real data:

- The hairline is a **course line drawn by scroll progress** (`stroke-dashoffset` scrubbed).
- The waypoints are real towns down the real east coast, and the label at the top of the rail is a
  **live latitude readout** interpolated between them from scroll position. It descends
  monotonically because you are travelling south: Malahide 53.4508 → Dublin 53.3498 →
  Dún Laoghaire 53.2947 → Greystones 53.1424 → Wicklow 52.9808 → Arklow 52.7936 →
  Gorey 52.6747 → Wexford 52.3369.
- Those are the towns the company actually sells into, and the readout is the page's scroll
  position expressed as a coordinate. That is information. It is also the reason the company is
  called East Coast Digital, which the old 8pt version never made a visitor notice.

On mobile the rail collapses to a 2px edge line and the readout moves into the nav.

### 6. Copy fixes

- **Price.** €500 one-off. The monthly arrangement is stated in the same size type, on the line
  directly under it, with what it buys. *(Assumption flagged: €25/month — see Deliverables.)*
- **Buttons say what happens.** "See the whole build" scrolls to the build. "One price: €500"
  scrolls to the price. "Send my details" sends the form. The nav button is "Start yours".
  Nothing says "Get started".
- **Nav "Work" is renamed "The build"** — one demo, described honestly, and it now links to both
  the pinned section and a standalone page.

---

## Pass 2 — critique of the plan above

The test: *would I have produced this for any small agency?* Where the answer was yes, it changed.

**1. A before/after slider is itself a stock device.** Yes — it is on half the marketing sites in
the world, and I very nearly shipped a pretty one. What makes it not stock is not the interaction,
it is the payload. **Changed:** both sides carry live readouts that flip as you drag — last touched
2011, 8.4s on 4G, no phone number, versus updated this week, 1.1s, tap to call. The user is
dragging *facts* across the screen, not a photo wipe. The before is specified as a faithful
reconstruction of a real dead Irish trade site, not a grey caricature, because a caricature is
obvious and it makes the whole argument dishonest.

**2. Original plan kept a teal accent word in the headline.** That is the tell. **Changed:** teal
is banned from headlines and body entirely, and the accent budget was moved to a hi-vis orange that
appears on exactly the two things that need touching. Also, the hero ground moved to ink, so the
"cream page" reading never gets established in the first place.

**3. Original plan kept the coastline as a decorative hairline with a scroll-drawn stroke.** That
is still decoration — a line that draws itself is an effect. **Changed:** the latitude readout is
now derived from scroll position by interpolating between eight real towns, descending south, so
the device answers a question ("why 'East Coast'?") instead of asking one. If it had not survived
this test I would have cut the coordinates entirely; the plan does not half-commit.

**4. "Pick a nicer serif" was the lazy version of the type answer.** Swapping condensed grotesque
for a fashionable high-contrast display serif would have been a lateral move into a different
default. **Changed:** the display face goes *expanded*, which is a specific reference (chart
lettering, quay signage) and is currently rare precisely because the generated-design consensus
went condensed.

**5. Process section was going to be an 01/02/03 timeline.** Every agency site has one.
**Changed:** it becomes a ledger with real durations and, in the right column, the only thing the
client actually has to do — *"Day one: send us photos of your work. Ten minutes of your time."*
The differentiator for this audience is how little of their day it costs, so that is the column
that gets the type.

**6. Pricing was going to be a dark rounded card with ticks.** **Changed:** it becomes a docket —
ruled tabular rows, no radius, no shadow, ink ground, the €500 and the monthly line at the same
size, and a "what you do not pay for" row. It should read like a quote written on a counter, which
is exactly how this audience buys.

**7. I considered adding logo strips and testimonials to fill the middle of the page.** Cut — the
company has one demo build and inventing social proof for a real business is not on the table.
Better to show the one real thing at full bleed than five fake things small.

**8. Honest remaining weakness.** The site's imagery is all placeholder slots on delivery, and the
design leans on those slots (the hero before/after and the full-bleed band are structural, not
garnish). Until real images land it will look like a wireframe of a good site rather than a good
site. That is the correct failure mode — the alternative was CSS-generated gradient art, which is
the exact thing that makes pages read as generated.
