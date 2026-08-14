# Abyssal — a living guide to the fish of our oceans

An immersive, interactive single-page site about fish. Every fish on the page is
drawn frame-by-frame from code and steered by its own simulation — there is not a
single image, video or third-party library in the project.

Open `index.html`. That's it: no build step, no server required, no network calls.

```
index.html          markup for every section
css/style.css       all styling, tokens, responsive rules, motion preferences
js/utils.js         maths, easing, value noise, DOM and canvas helpers
js/data.js          all copy and numbers: zones, species, anatomy, quiz, FAQ
js/fish-art.js      procedural fish renderer (bodies, fins, patterns, glow)
js/tank.js          the live background aquarium (steering, particles, light)
js/sections.js      behaviour for each section of the page
js/main.js          boot sequence
```

## What's on the page

| Section | What it does |
| --- | --- |
| **Hero** | Live tank behind the copy; fish count updates as the population changes. |
| **Descent** | A sticky, scroll-driven dive through six ocean zones. Scroll position drives the water colour, fog, light and which species swim behind you. |
| **Species** | Twelve profiles, each with an animated canvas portrait. Filter, search, open a dossier, or **release** a species into the live tank. |
| **Anatomy** | Interactive diagram of a bony fish — hover, tap or keyboard-focus any of the eight markers. |
| **Scale** | True-to-metre silhouette comparison against a 1.8 m diver, with a magnified inset when the animal is only a few pixels long. |
| **Feed** | Click anywhere on the water to drop food. The shoal decides what to do about it. |
| **Quiz** | Five questions, weighted scoring, and your result joins the tank. |
| **Join** | Client-side-only sign-up form and FAQ. Nothing is transmitted anywhere. |

## How the fish are drawn

Each body is a flexible spine of segments. A travelling sine wave runs from head
to tail — faster and shallower for a tuna, slower and deeper for an eel — and the
outline is rebuilt around that spine every frame, then filled with a gradient and
given fins, patterns, an eye and (where relevant) photophores or a glowing lure.

The caudal fin is simply the spine continued past the body, so the tail sweep
falls out of the same wave rather than being animated separately. Dorsal and anal
fins attach to the body outline, so changing the body depth reshapes the fins with
it. A species is therefore just a set of numbers — see `spec()` in `js/data.js`:

```js
art: spec({
  shape: 'fusiform', bodyDepth: .3, head: .48,
  top: [216, 55, 26], mid: [206, 40, 46], belly: [45, 25, 82],
  dorsalStyle: 'normal', tail: 'lunate', tailSize: .72,
  speed: 1.9, waveAmp: .45, waveFreq: 1.7
})
```

## How the tank behaves

Every fish re-weighs four steering urges each frame — keep clear of neighbours,
match their heading, stay with the shoal, move towards food — against the pointer
and the edges of the frame. Desired direction is converted into a *limited turn*
rather than an instant change of velocity, so fish bank into corners instead of
strafing; fast species turn more widely than slow ones. Nothing is on a timeline,
so the shoal never repeats itself.

Fast pointer movement scares fish away; a still pointer draws the bolder ones in.
Clicking drops food that sinks and drifts, and fish that reach it get a short
burst of speed.

## Performance and preferences

- The simulation watches its own frame cost and trims population, particle count
  and per-fish detail until it is comfortable. Phones start smaller.
- Rendering pauses entirely while the tab is hidden.
- `prefers-reduced-motion` is honoured automatically: the tank renders one still
  frame and entrance animations are dropped. The header button toggles this
  manually, in both directions.
- Off-screen canvases (species cards) are skipped by the shared render loop.

## Accessibility notes

Skip link, visible focus rings, keyboard-operable anatomy markers, `aria-pressed`
on toggles, labelled form fields with inline validation, `aria-live` regions for
the depth readout and toasts, and a modal dossier that traps Escape and restores
focus on close.

## Sources

Figures reflect widely published ranges from FishBase, NOAA and peer-reviewed
surveys. Where sources disagree — sailfish top speed, Greenland shark age — the
page says so rather than quoting the most dramatic number.
