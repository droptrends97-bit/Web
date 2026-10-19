# Tacktical — Sailor's Console

A web app that helps dinghy sailors get ready for a session: pick your boat and the kind of sail, and it tells you the conditions, what to wear, how to rig, and what to check before launching.

## Pages

- **Session** — choose boat, sail type (casual, hardcore, racing, upwind, downwind) and location (GPS or search).
- **Weather** — live wind, gusts, direction, air/water temperature, pressure and waves from [Open-Meteo](https://open-meteo.com), a 6-hour outlook, and clothing advice.
- **Rigging** — wind band (follows live wind, or tap to override), numbered control map, and settings for outhaul, cunningham, vang, mainsheet and jib. Warns when gusts reach a higher band.
- **Checklist** — pre-launch checks that change with boat rig and sail type; ticks are saved per boat and sail type.
- **Boats** — add, edit and delete boats from class presets (ILCA, RS Aero, RS200/400/500, RS Feva).

Everything is stored in the browser (localStorage); there is no backend yet.

## Develop

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build
```

Stack: Vite, React, TypeScript, Tailwind CSS v4, React Router, lucide-react.
