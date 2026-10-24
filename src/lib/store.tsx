import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Boat } from "./boats";
import { DEFAULT_PLACE, type Place, type SailType } from "./session";
import { fetchConditions, sampleConditions, type Conditions } from "./weather";
import type { Band } from "./wind";

interface Persisted {
  boats: Boat[];
  boatId: string | null;
  sailType: SailType;
  place: Place;
  /** Manual wind band; null follows live wind. */
  bandOverride: Band | null;
  /** Ticked checklist items, keyed by `${boatId}:${sailType}:${sectionId}:${itemId}`. */
  checks: Record<string, true>;
}

const KEY = "tacktical:v1";

const DEMO = import.meta.env.VITE_DEMO === "1";

const DEMO_BOAT: Boat = { id: "demo-rs200", classId: "rs200", name: "RS200", rig: "sloop-kite", pointing: 40, sails: ["Main", "Jib", "Asymmetric kite"] };

const DEFAULTS: Persisted = {
  boats: DEMO ? [DEMO_BOAT] : [],
  boatId: DEMO ? DEMO_BOAT.id : null,
  sailType: "racing",
  place: DEFAULT_PLACE,
  bandOverride: null,
  checks: {},
};

function load(): Persisted {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

type WeatherState =
  | { status: "loading"; data: Conditions | null }
  | { status: "ready"; data: Conditions }
  | { status: "error"; data: Conditions | null; error: string };

interface Store extends Persisted {
  boat: Boat | null;
  weather: WeatherState;
  refreshWeather: () => void;
  saveBoat: (boat: Boat) => void;
  deleteBoat: (id: string) => void;
  selectBoat: (id: string) => void;
  setSailType: (s: SailType) => void;
  setPlace: (p: Place) => void;
  setBandOverride: (b: Band | null) => void;
  toggleCheck: (key: string) => void;
  clearChecks: (prefix: string) => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(load);
  const [weather, setWeather] = useState<WeatherState>({ status: "loading", data: null });
  const [reloadTick, setReloadTick] = useState(0);
  const lastData = useRef<Conditions | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      // Storage full or blocked: the app still works for this visit.
    }
  }, [state]);

  const { lat, lon } = state.place;
  useEffect(() => {
    const ctrl = new AbortController();
    setWeather({ status: "loading", data: lastData.current });
    if (DEMO) {
      const data = sampleConditions();
      lastData.current = data;
      setWeather({ status: "ready", data });
      return;
    }
    fetchConditions({ name: "", lat, lon }, ctrl.signal)
      .then((data) => {
        lastData.current = data;
        setWeather({ status: "ready", data });
      })
      .catch((e: Error) => {
        if (ctrl.signal.aborted) return;
        setWeather({ status: "error", data: lastData.current, error: e.message || "Couldn't reach the weather service" });
      });
    return () => ctrl.abort();
  }, [lat, lon, reloadTick]);

  const patch = useCallback((p: Partial<Persisted> | ((s: Persisted) => Partial<Persisted>)) => {
    setState((s) => ({ ...s, ...(typeof p === "function" ? p(s) : p) }));
  }, []);

  const store = useMemo<Store>(
    () => ({
      ...state,
      boat: state.boats.find((b) => b.id === state.boatId) ?? null,
      weather,
      refreshWeather: () => setReloadTick((t) => t + 1),
      saveBoat: (boat) =>
        patch((s) => {
          const exists = s.boats.some((b) => b.id === boat.id);
          return {
            boats: exists ? s.boats.map((b) => (b.id === boat.id ? boat : b)) : [...s.boats, boat],
            boatId: exists ? s.boatId : boat.id,
          };
        }),
      deleteBoat: (id) =>
        patch((s) => {
          const boats = s.boats.filter((b) => b.id !== id);
          return { boats, boatId: s.boatId === id ? (boats[0]?.id ?? null) : s.boatId };
        }),
      selectBoat: (id) => patch({ boatId: id }),
      setSailType: (sailType) => patch({ sailType }),
      setPlace: (place) => patch({ place }),
      setBandOverride: (bandOverride) => patch({ bandOverride }),
      toggleCheck: (key) =>
        patch((s) => {
          const checks = { ...s.checks };
          if (checks[key]) delete checks[key];
          else checks[key] = true;
          return { checks };
        }),
      clearChecks: (prefix) =>
        patch((s) => ({
          checks: Object.fromEntries(Object.entries(s.checks).filter(([k]) => !k.startsWith(prefix))) as Record<string, true>,
        })),
    }),
    [state, weather, patch],
  );

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be used inside StoreProvider");
  return s;
}
