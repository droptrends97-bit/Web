import type { SailType } from "./session";

export interface WearAdvice {
  headline: string;
  items: string[];
  warnings: string[];
}

/** Wind chill in °C (Environment Canada formula); only meaningful below ~10 °C. */
function windChill(airC: number, windKt: number): number {
  const kmh = windKt * 1.852;
  if (airC > 10 || kmh < 5) return airC;
  return 13.12 + 0.6215 * airC - 11.37 * kmh ** 0.16 + 0.3965 * airC * kmh ** 0.16;
}

export function wearAdvice(input: {
  air: number;
  water: number | null;
  wind: number;
  gust: number;
  sailType: SailType;
}): WearAdvice {
  const { air, wind, gust, sailType } = input;
  // Without sea data, assume water is a little colder than the air.
  const water = input.water ?? Math.min(air, 15) - 1;
  const feels = windChill(air, wind);
  const wet = sailType !== "casual" || wind >= 12;
  const items: string[] = [];
  const warnings: string[] = [];
  let headline: string;

  if (water < 10 || feels < 3) {
    headline = "Drysuit day — dress for a swim, not the slipway.";
    items.push("Drysuit with fleece undersuit", "Neoprene hood or beanie", "Thick neoprene gloves", "Neoprene boots");
  } else if (water < 14) {
    headline = "Cold water — a full winter wetsuit or drysuit.";
    items.push("4/3 or 5/4 full wetsuit (or drysuit)", "Thermal base layer", "Neoprene gloves", "Neoprene boots + thermal socks");
  } else if (water < 17) {
    headline = "Cool water — full wetsuit and a layer on top.";
    items.push("3/2 full wetsuit", "Thermal top", "Neoprene boots");
  } else if (water < 20) {
    headline = "Mild — light neoprene and a spray top.";
    items.push("Long john or shortie wetsuit", "Rash vest");
  } else {
    headline = "Warm — sun protection matters more than neoprene.";
    items.push("Rash vest or quick-dry top", "Shorts or hiking shorts", "Sun hat with retainer");
  }

  if (wet && water >= 14) items.push("Spray top");
  if (water >= 14 && (wind >= 10 || sailType === "racing" || sailType === "hardcore")) items.push("Sailing gloves");
  if (sailType === "racing" || sailType === "hardcore" || sailType === "upwind") items.push("Hiking pants or padded shorts");
  items.push("Buoyancy aid, zipped and buckled", "Polarised sunglasses with retainer", "Sunscreen, even on grey days");

  if (water < 15) warnings.push("Cold water — cold shock is real. Stay close to rescue cover and sail with a buddy.");
  if (gust >= 22) warnings.push(`Gusts to ${Math.round(gust)} kt — only go out if you're confident capsizing and recovering in that.`);
  else if (wind > 0 && gust / wind >= 1.6 && gust >= 15) warnings.push("Very gusty — big jumps between lulls and puffs. Rig for the gusts.");

  return { headline, items, warnings };
}
