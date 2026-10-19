export type SailType = "casual" | "hardcore" | "racing" | "upwind" | "downwind";

export const SAIL_TYPES: { id: SailType; name: string; blurb: string }[] = [
  { id: "casual", name: "Casual sail", blurb: "Easy day on the water" },
  { id: "hardcore", name: "Hardcore", blurb: "Send it — full send session" },
  { id: "racing", name: "Racing", blurb: "Course racing, full kit" },
  { id: "upwind", name: "Upwind grinds", blurb: "Beat drills, pointing focus" },
  { id: "downwind", name: "Downwind grinds", blurb: "Kite / reaching training" },
];

export function sailTypeName(id: SailType): string {
  return SAIL_TYPES.find((s) => s.id === id)?.name ?? id;
}

export interface Place {
  name: string;
  lat: number;
  lon: number;
}

export const DEFAULT_PLACE: Place = { name: "Greystones, Co. Wicklow", lat: 53.1447, lon: -6.0644 };

export function formatCoords(p: Place): string {
  const ns = p.lat >= 0 ? "N" : "S";
  const ew = p.lon >= 0 ? "E" : "W";
  return `${Math.abs(p.lat).toFixed(4)}° ${ns}, ${Math.abs(p.lon).toFixed(4)}° ${ew}`;
}
