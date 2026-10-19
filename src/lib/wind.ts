export type Band = "light" | "medium" | "heavy";

export const BANDS: { id: Band; name: string; range: string }[] = [
  { id: "light", name: "Light", range: "0–8 kt" },
  { id: "medium", name: "Medium", range: "8–16 kt" },
  { id: "heavy", name: "Heavy", range: "16 kt+" },
];

const ORDER: Band[] = ["light", "medium", "heavy"];

export function bandFor(kt: number): Band {
  if (kt < 8) return "light";
  if (kt < 16) return "medium";
  return "heavy";
}

export function bandAbove(a: Band, b: Band): boolean {
  return ORDER.indexOf(a) > ORDER.indexOf(b);
}

const BEAUFORT: [number, string][] = [
  [1, "Calm"],
  [4, "Light air"],
  [7, "Light breeze"],
  [11, "Gentle breeze"],
  [17, "Moderate breeze"],
  [22, "Fresh breeze"],
  [28, "Strong breeze"],
  [34, "Near gale"],
  [41, "Gale"],
  [48, "Strong gale"],
  [56, "Storm"],
  [64, "Violent storm"],
];

export function beaufort(kt: number): { force: number; name: string } {
  const i = BEAUFORT.findIndex(([max]) => kt < max);
  if (i === -1) return { force: 12, name: "Hurricane force" };
  return { force: i, name: BEAUFORT[i][1] };
}

const POINTS = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

export function compassPoint(deg: number): string {
  return POINTS[Math.round((((deg % 360) + 360) % 360) / 22.5) % 16];
}
