import type { RigType } from "./boats";
import type { SailType } from "./session";
import type { Band } from "./wind";

export type ControlId = "outhaul" | "cunningham" | "vang" | "mainsheet" | "jib";

export interface ControlSetting {
  id: ControlId;
  name: string;
  /** How hard the control is on, 0–100. */
  amount: number;
  /** Short instruction, used on the diagram legend and as the card headline. */
  action: string;
  detail: string;
}

type Table = Record<Band, Omit<ControlSetting, "id" | "name">>;

const CONTROLS: { id: ControlId; name: string; table: Table }[] = [
  {
    id: "outhaul",
    name: "Outhaul",
    table: {
      light: { amount: 40, action: "Ease — a hand's depth at mid-boom", detail: "A fuller foot gives power in light air. Don't over-ease or the flow stalls." },
      medium: { amount: 60, action: "Medium — small foot shelf still visible", detail: "Flatten progressively as you start to hike hard." },
      heavy: { amount: 90, action: "Max — foot flat along the boom", detail: "Take all the depth out of the bottom of the sail to depower." },
    },
  },
  {
    id: "cunningham",
    name: "Cunningham",
    table: {
      light: { amount: 5, action: "Off — small luff wrinkles are fine", detail: "Keep the draft aft and the sail powerful." },
      medium: { amount: 40, action: "Light tension — wrinkles just gone", detail: "Add more as the breeze builds to keep the draft from sliding aft." },
      heavy: { amount: 85, action: "Hard on — open the top of the sail", detail: "Pulls the draft forward and twists off the head so gusts spill out." },
    },
  },
  {
    id: "vang",
    name: "Vang",
    table: {
      light: { amount: 10, action: "Slack — just take out the slop", detail: "Let the leech twist; the sheet controls leech tension." },
      medium: { amount: 55, action: "Snug — holds the leech when you ease", detail: "Set so the boom doesn't rise much as you ease in a puff." },
      heavy: { amount: 85, action: "Hard on — vang-sheet in the gusts", detail: "The vang holds the leech while you ease the sheet to keep the boat flat." },
    },
  },
  {
    id: "mainsheet",
    name: "Mainsheet",
    table: {
      light: { amount: 50, action: "Eased — top tell-tale flowing", detail: "Keep twist in the leech; sheeting hard in light air kills speed." },
      medium: { amount: 70, action: "Firm — top batten parallel to the boom", detail: "Sheet to the batten, then trim with the crew's weight." },
      heavy: { amount: 85, action: "Play it — ease in every gust", detail: "Keep the boat flat with the sheet; hiking alone won't hold it." },
    },
  },
  {
    id: "jib",
    name: "Jib",
    table: {
      light: { amount: 40, action: "Eased — leech breathing", detail: "Inside tell-tales just lifting. Don't strangle the slot." },
      medium: { amount: 70, action: "Sheeted until the tell-tales break evenly", detail: "Match the jib leech to the main so the slot stays open." },
      heavy: { amount: 80, action: "Firm, leech open at the top", detail: "Ease a touch in the gusts so the slot doesn't choke the main." },
    },
  },
];

export function controlsFor(rig: RigType, band: Band): ControlSetting[] {
  return CONTROLS.filter((c) => c.id !== "jib" || rig !== "una").map((c) => ({
    id: c.id,
    name: c.name,
    ...c.table[band],
  }));
}

export function focusTip(rig: RigType, sailType: SailType): { title: string; body: string } | null {
  switch (sailType) {
    case "upwind":
      return { title: "Pointing focus", body: "Steer to the windward tell-tale lifting just occasionally. Hold height in the lulls, foot for speed in the chop." };
    case "downwind":
      return rig === "sloop-kite"
        ? { title: "Kite focus", body: "Sheet the kite to a slight curl in the luff. Bear away in the puffs, head up in the lulls to keep apparent wind." }
        : { title: "Downwind focus", body: "Ease the vang so the leech can twist. Practise sailing by the lee and keep the boat flat with weight, not the rudder." };
    case "racing":
      return { title: "Race focus", body: "Settle settings before the start, then only adjust for real changes in the breeze — mark your control lines." };
    case "hardcore":
      return { title: "Big breeze", body: "Depower early. A flat boat is fast and keeps you upright; if you're overpowered, rig for the gusts not the lulls." };
    default:
      return null;
  }
}
