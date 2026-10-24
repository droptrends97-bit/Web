import type { Place } from "./session";

export interface HourForecast {
  time: string;
  wind: number;
  gust: number;
  dir: number;
}

export interface Conditions {
  wind: number;
  gust: number;
  dir: number;
  airTemp: number;
  pressure: number;
  waterTemp: number | null;
  waveHeight: number | null;
  wavePeriod: number | null;
  hours: HourForecast[];
  fetchedAt: Date;
  /** True when this is built-in example data rather than a live forecast. */
  sample?: boolean;
}

/** A blustery autumn morning, used by the demo build where live requests are blocked. */
export function sampleConditions(): Conditions {
  const now = new Date();
  const wind = [12, 12, 13, 11, 10, 9];
  const gust = [21, 23, 24, 20, 17, 16];
  const dir = [338, 20, 45, 110, 135, 135];
  return {
    wind: 11.7,
    gust: 21,
    dir: 338,
    airTemp: 10,
    pressure: 1026,
    waterTemp: 14,
    waveHeight: 1.0,
    wavePeriod: 4,
    hours: wind.map((w, i) => ({
      time: `${String((now.getHours() + i) % 24).padStart(2, "0")}:00`,
      wind: w,
      gust: gust[i],
      dir: dir[i],
    })),
    fetchedAt: now,
    sample: true,
  };
}

const FORECAST = "https://api.open-meteo.com/v1/forecast";
const MARINE = "https://marine-api.open-meteo.com/v1/marine";
const GEOCODE = "https://geocoding-api.open-meteo.com/v1/search";

async function getJson(url: string, signal?: AbortSignal) {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Weather service returned ${res.status}`);
  return res.json();
}

export async function fetchConditions(place: Place, signal?: AbortSignal): Promise<Conditions> {
  const coords = `latitude=${place.lat}&longitude=${place.lon}`;
  const forecastUrl =
    `${FORECAST}?${coords}&wind_speed_unit=kn&timezone=auto&forecast_days=2` +
    `&current=temperature_2m,wind_speed_10m,wind_gusts_10m,wind_direction_10m,pressure_msl` +
    `&hourly=wind_speed_10m,wind_gusts_10m,wind_direction_10m`;
  const marineUrl = `${MARINE}?${coords}&current=wave_height,wave_period,sea_surface_temperature`;

  const [forecast, marine] = await Promise.all([
    getJson(forecastUrl, signal),
    // Inland spots have no marine data; the rest of the page still works without it.
    getJson(marineUrl, signal).catch(() => null),
  ]);

  const c = forecast.current;
  const h = forecast.hourly;
  const nowHour = (c.time as string).slice(0, 13);
  const start = Math.max(0, (h.time as string[]).findIndex((t) => t.slice(0, 13) === nowHour));
  const hours: HourForecast[] = (h.time as string[]).slice(start, start + 6).map((t, i) => ({
    time: t.slice(11, 16),
    wind: h.wind_speed_10m[start + i],
    gust: h.wind_gusts_10m[start + i],
    dir: h.wind_direction_10m[start + i],
  }));

  const m = marine?.current;
  return {
    wind: c.wind_speed_10m,
    gust: c.wind_gusts_10m,
    dir: c.wind_direction_10m,
    airTemp: c.temperature_2m,
    pressure: c.pressure_msl,
    waterTemp: m?.sea_surface_temperature ?? null,
    waveHeight: m?.wave_height ?? null,
    wavePeriod: m?.wave_period ?? null,
    hours,
    fetchedAt: new Date(),
  };
}

export interface PlaceResult extends Place {
  id: number;
}

export async function searchPlaces(query: string, signal?: AbortSignal): Promise<PlaceResult[]> {
  const data = await getJson(`${GEOCODE}?name=${encodeURIComponent(query)}&count=6&language=en`, signal);
  return (data.results ?? []).map((r: { id: number; name: string; admin1?: string; country?: string; latitude: number; longitude: number }) => ({
    id: r.id,
    name: [r.name, r.admin1 ?? r.country].filter(Boolean).join(", "),
    lat: r.latitude,
    lon: r.longitude,
  }));
}
