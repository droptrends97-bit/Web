import { AlertTriangle, Wind } from "lucide-react";
import { useStore } from "../lib/store";
import { boatSubtitle, classById } from "../lib/boats";
import { controlsFor, focusTip } from "../lib/rigging";
import { sailTypeName } from "../lib/session";
import { BANDS, bandAbove, bandFor } from "../lib/wind";
import { Meter, NeedsBoat, PageHeading } from "../components/ui";
import RigDiagram from "../components/RigDiagram";

export default function Rigging() {
  const { boat, sailType, weather, bandOverride, setBandOverride } = useStore();
  if (!boat) {
    return (
      <>
        <PageHeading eyebrow="Rigging & tuning" title="Rigging" />
        <NeedsBoat what="Rig tuning" />
      </>
    );
  }

  const w = weather.data;
  const liveBand = w ? bandFor(w.wind) : null;
  const band = bandOverride ?? liveBand ?? "medium";
  const gustBand = w ? bandFor(w.gust) : null;
  const gustsJump = gustBand && bandAbove(gustBand, band) ? gustBand : null;

  const controls = controlsFor(boat.rig, band);
  const gustControls = gustsJump ? controlsFor(boat.rig, gustsJump) : null;
  const tip = focusTip(boat.rig, sailType);
  const cls = classById(boat.classId);

  return (
    <>
      <PageHeading eyebrow="Rigging & tuning" title={boat.name} sub={`${boatSubtitle(boat)} · ${sailTypeName(sailType)}`} />

      <div className="space-y-5">
        <section className="card">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="eyebrow">Wind band</h2>
            {w && (
              <span className="flex items-center gap-1.5 font-mono text-sm text-muted">
                <Wind className="size-4 text-teal" />
                {w.wind.toFixed(1)} kt / gust {Math.round(w.gust)} kt
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3" role="radiogroup" aria-label="Wind band">
            {BANDS.map((b) => (
              <button
                key={b.id}
                role="radio"
                aria-checked={b.id === band}
                onClick={() => setBandOverride(b.id === liveBand ? null : b.id)}
                className="choice px-3 py-3 sm:px-5 sm:py-4"
              >
                <div className="sm:text-lg">{b.name}</div>
                <div className="font-mono text-xs text-muted sm:text-sm">{b.range}</div>
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted">
            {bandOverride ? (
              <>
                Manual band.{" "}
                <button onClick={() => setBandOverride(null)} className="text-teal hover:underline">
                  Follow live wind
                </button>
              </>
            ) : w ? (
              "Following live wind from the weather page."
            ) : (
              "Waiting for live wind — showing medium settings."
            )}
          </p>
          {gustsJump && (
            <div className="mt-4 flex gap-3 rounded-xl border border-amber/60 bg-amber/10 px-4 py-3 text-sm">
              <AlertTriangle className="size-5 shrink-0 text-amber" />
              Gusts reach the {gustsJump} band. Rig for the average, but have the {gustsJump}-air settings ready — they're listed under each control.
            </div>
          )}
        </section>

        <section className="card">
          <h2 className="eyebrow mb-2">Control map</h2>
          <RigDiagram rig={boat.rig} controls={controls.map((c) => c.id)} />
          {cls && <p className="mt-2 text-sm text-muted">{cls.blurb}.</p>}
        </section>

        {controls.map((c, i) => {
          const gust = gustControls?.find((g) => g.id === c.id);
          return (
            <section key={c.id} className="card">
              <div className="flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-3 text-xl">
                  <span className="grid size-7 place-items-center rounded-full bg-teal font-mono text-sm text-ink">{i + 1}</span>
                  {c.name}
                </h3>
                <span className="font-mono text-sm text-muted">{c.amount}%</span>
              </div>
              <div className="mt-4">
                <Meter value={c.amount} />
              </div>
              <p className="mt-4 text-lg">{c.action}</p>
              <p className="mt-1 text-muted">{c.detail}</p>
              {gust && gust.action !== c.action && (
                <p className="mt-3 border-l-2 border-amber pl-3 text-sm">
                  <span className="text-amber">In the gusts:</span> {gust.action.toLowerCase()}
                </p>
              )}
            </section>
          );
        })}

        {tip && (
          <section className="card border-teal/40">
            <h2 className="eyebrow text-teal">{tip.title}</h2>
            <p className="mt-2">{tip.body}</p>
          </section>
        )}
      </div>
    </>
  );
}
