import { AlertTriangle, Anchor, Gauge, RefreshCw, Thermometer, Waves, Wind } from "lucide-react";
import { useStore } from "../lib/store";
import { sailTypeName } from "../lib/session";
import { beaufort, compassPoint } from "../lib/wind";
import { wearAdvice } from "../lib/wear";
import { PageHeading, Stat } from "../components/ui";
import WindCompass from "../components/WindCompass";

export default function Weather() {
  const { weather, refreshWeather, boat, sailType, place } = useStore();
  const w = weather.data;
  const context = [boat?.name, sailTypeName(sailType), place.name].filter(Boolean).join(" · ");

  const heading = (
    <PageHeading
      eyebrow="Now on the water"
      title="Conditions"
      sub={context}
      action={
        <button onClick={refreshWeather} disabled={weather.status === "loading"} className="btn-ghost shrink-0">
          <RefreshCw className={`size-4 ${weather.status === "loading" ? "animate-spin" : ""}`} />
          Refresh
        </button>
      }
    />
  );

  if (!w) {
    return (
      <>
        {heading}
        <div className="card text-muted">
          {weather.status === "error" ? `Couldn't load the forecast: ${weather.error}. Try Refresh.` : "Fetching live conditions…"}
        </div>
      </>
    );
  }

  const bf = beaufort(w.wind);
  const noGo = boat?.pointing ?? 45;
  const wear = wearAdvice({ air: w.airTemp, water: w.waterTemp, wind: w.wind, gust: w.gust, sailType });

  return (
    <>
      {heading}
      {w.sample && (
        <p className="mb-4 rounded-xl border border-teal/40 bg-teal/10 px-4 py-3 text-sm">
          Sample conditions. This preview can't reach the live forecast, so it shows an example blustery morning.
        </p>
      )}
      {weather.status === "error" && (
        <p className="mb-4 rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm">Refresh failed — showing the last reading.</p>
      )}

      <div className="space-y-5">
        <section className="card">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="eyebrow flex items-center gap-1.5">
                <Wind className="size-3.5" /> Wind
              </div>
              <div className="mt-2 font-mono text-3xl sm:text-6xl">
                {w.wind.toFixed(1)}
                <span className="ml-1 text-sm text-muted sm:text-xl">kt</span>
              </div>
              <div className="mt-1 text-sm text-muted">
                {bf.name} · F{bf.force}
              </div>
            </div>
            <div>
              <div className="eyebrow">Gusts</div>
              <div className="mt-2 font-mono text-3xl sm:text-6xl">
                {Math.round(w.gust)}
                <span className="ml-1 text-sm text-muted sm:text-xl">kt</span>
              </div>
              <div className="mt-1 text-sm text-muted">{w.gust - w.wind >= 8 ? "very gusty" : w.gust - w.wind >= 4 ? "gusty" : "steady"}</div>
            </div>
            <div>
              <div className="eyebrow">From</div>
              <div className="mt-2 font-mono text-3xl sm:text-6xl">
                {Math.round(w.dir)}
                <span className="ml-0.5 text-sm text-muted sm:text-xl">°</span>
              </div>
              <div className="mt-1 text-sm text-muted">{compassPoint(w.dir)}</div>
            </div>
          </div>
          <div className="mt-6">
            <WindCompass dir={w.dir} noGo={noGo} />
            <p className="mt-2 text-center font-mono text-xs text-muted">
              blowing from {compassPoint(w.dir)} · red = no-go ±{noGo}°
            </p>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat icon={<Thermometer className="size-3.5" />} label="Air" value={`${Math.round(w.airTemp)}°C`} />
          <Stat icon={<Anchor className="size-3.5" />} label="Water" value={w.waterTemp == null ? "—" : `${Math.round(w.waterTemp)}°C`} />
          <Stat icon={<Gauge className="size-3.5" />} label="Pressure" value={`${Math.round(w.pressure)} hPa`} />
          <Stat
            icon={<Waves className="size-3.5" />}
            label="Waves"
            value={w.waveHeight == null ? "—" : `${w.waveHeight.toFixed(1)} m · ${Math.round(w.wavePeriod ?? 0)}s`}
          />
        </div>

        <section className="card">
          <h2 className="eyebrow mb-4">Next 6 hours · knots</h2>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {w.hours.map((h) => (
              <div key={h.time} className="rounded-xl bg-well px-2 py-3 text-center">
                <div className="font-mono text-xs text-muted">{h.time}</div>
                <div className="mt-1 text-2xl">{Math.round(h.wind)}</div>
                <div className="text-xs text-muted">gust {Math.round(h.gust)}</div>
                <div className="mt-1 font-mono text-xs text-teal">{compassPoint(h.dir)}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <h2 className="eyebrow">What to wear</h2>
          <p className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">{wear.headline}</p>
          <ul className="mt-5 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
            {wear.items.map((i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-amber" />
                {i}
              </li>
            ))}
          </ul>
          {wear.warnings.map((warning) => (
            <div key={warning} className="mt-5 flex gap-3 rounded-xl border border-amber/60 bg-amber/10 px-4 py-3 text-sm">
              <AlertTriangle className="size-5 shrink-0 text-amber" />
              {warning}
            </div>
          ))}
          {w.waterTemp == null && <p className="mt-4 text-xs text-faint">No sea temperature for this spot — kit is estimated from the air temperature.</p>}
        </section>

        <p className="text-center font-mono text-xs text-faint">
          {w.sample ? "Sample data" : "Source: Open-Meteo"} · fetched {w.fetchedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </>
  );
}
