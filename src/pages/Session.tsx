import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Crosshair, LoaderCircle, MapPin, Search } from "lucide-react";
import { useStore } from "../lib/store";
import { boatSubtitle } from "../lib/boats";
import { SAIL_TYPES, formatCoords } from "../lib/session";
import { searchPlaces, type PlaceResult } from "../lib/weather";
import { PageHeading } from "../components/ui";

export default function Session() {
  const { boats, boatId, selectBoat, sailType, setSailType, place, setPlace } = useStore();
  const navigate = useNavigate();
  const [gps, setGps] = useState<"idle" | "locating" | "error">("idle");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlaceResult[]>([]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return setResults([]);
    const ctrl = new AbortController();
    const t = setTimeout(() => searchPlaces(q, ctrl.signal).then(setResults).catch(() => {}), 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query]);

  const useGps = () => {
    if (!navigator.geolocation) return setGps("error");
    setGps("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPlace({ name: "Current position", lat: pos.coords.latitude, lon: pos.coords.longitude });
        setGps("idle");
      },
      () => setGps("error"),
      { enableHighAccuracy: false, timeout: 10000 },
    );
  };

  const ready = boatId !== null;

  return (
    <>
      <PageHeading
        eyebrow="Session setup"
        title="Going sailing."
        sub="Two answers drive the whole app: which boat, and what kind of sail. Weather, kit and tuning all read from these."
      />

      <div className="space-y-5">
        <section className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="eyebrow">01 · Boat</h2>
            <Link to="/boats" className="text-sm text-teal hover:underline">
              Manage boats →
            </Link>
          </div>
          {boats.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line-strong px-5 py-5 text-muted">
              No boats yet.{" "}
              <Link to="/boats/new" className="text-amber hover:underline">
                Add your first boat
              </Link>{" "}
              to continue.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Boat">
              {boats.map((b) => (
                <button key={b.id} role="radio" aria-checked={b.id === boatId} onClick={() => selectBoat(b.id)} className="choice px-5 py-4">
                  <div className="text-lg">{b.name}</div>
                  <div className="text-sm text-muted">{boatSubtitle(b)}</div>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="card">
          <h2 className="eyebrow mb-4">02 · Sail type</h2>
          <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Sail type">
            {SAIL_TYPES.map((s) => (
              <button key={s.id} role="radio" aria-checked={s.id === sailType} onClick={() => setSailType(s.id)} className="choice px-5 py-4">
                <div className="text-lg">{s.name}</div>
                <div className="text-sm text-muted">{s.blurb}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="card">
          <h2 className="eyebrow mb-4">03 · Location</h2>
          <div className="flex flex-wrap items-center gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-well text-teal">
              <MapPin className="size-6" />
            </span>
            <div className="min-w-[11rem] flex-1">
              <div className="text-lg">{place.name}</div>
              <div className="font-mono text-sm text-muted">{formatCoords(place)}</div>
            </div>
            <button onClick={useGps} disabled={gps === "locating"} className="btn-ghost">
              {gps === "locating" ? <LoaderCircle className="size-4 animate-spin" /> : <Crosshair className="size-4" />}
              Use GPS
            </button>
          </div>
          {gps === "error" && <p className="mt-3 text-sm text-danger">Couldn't get your position. Check location permissions, or search instead.</p>}

          <div className="relative mt-4">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-faint" />
            <input
              className="field pl-11"
              placeholder="Search for a place"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search location"
            />
          </div>
          {results.length > 0 && (
            <ul className="mt-2 overflow-hidden rounded-xl border border-line">
              {results.map((r) => (
                <li key={r.id}>
                  <button
                    className="w-full border-b border-line bg-well px-4 py-3 text-left last:border-b-0 hover:bg-line"
                    onClick={() => {
                      setPlace({ name: r.name, lat: r.lat, lon: r.lon });
                      setQuery("");
                    }}
                  >
                    {r.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <button className="btn-primary justify-between" disabled={!ready} onClick={() => navigate("/weather")}>
          Cast off — check conditions
          <ArrowRight className="size-5" />
        </button>
        {!ready && <p className="-mt-2 text-center text-sm text-muted">Choose a boat above to continue.</p>}
      </div>
    </>
  );
}
