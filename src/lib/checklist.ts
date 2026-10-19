import type { RigType } from "./boats";
import type { SailType } from "./session";

export interface ChecklistSection {
  id: string;
  title: string;
  items: { id: string; label: string }[];
}

const item = (id: string, label: string) => ({ id, label });

function boatAndRig(rig: RigType): ChecklistSection {
  const items = [
    item("hull", "Hull, foils and rudder fittings free of damage"),
    item("bungs", "Bungs in, hatches sealed"),
    item("mast", "Mast step, shrouds and pins taped"),
    item("lines", "Mainsheet, halyards and control lines run free"),
    item("battens", "Battens in and tensioned"),
  ];
  if (rig !== "una") items.push(item("jib", "Jib sheets led and stopper knots tied"));
  if (rig === "sloop-kite") items.push(item("kite", "Kite packed, halyard and sheets clear"));
  return { id: "rig", title: "Boat & rig", items };
}

const SAFETY: ChecklistSection = {
  id: "safety",
  title: "Safety",
  items: [
    item("ba", "Buoyancy aid fitted and buckled"),
    item("painter", "Painter attached and reachable"),
    item("phone", "Phone in a dry pouch"),
    item("ashore", "Told someone ashore your plan and return time"),
  ],
};

const CONDITIONS: ChecklistSection = {
  id: "conditions",
  title: "Conditions",
  items: [
    item("wind", "Checked wind, gusts and forecast trend"),
    item("tide", "Checked tide state and direction"),
    item("escape", "Identified a downwind escape / landing spot"),
  ],
};

function focusSection(sailType: SailType, rig: RigType): ChecklistSection {
  switch (sailType) {
    case "racing":
      return {
        id: "race",
        title: "Race prep",
        items: [
          item("si", "Sailing instructions and amendments read"),
          item("sequence", "Start sequence and flag signals checked"),
          item("course", "Course and mark rounding order confirmed"),
          item("class-flag", "Class flag, time limits and recall procedure noted"),
          item("watch", "Watch synced to committee boat time"),
          item("compass", "Compass numbers taken on both tacks"),
          item("bias", "Line bias checked at the start line"),
          item("signon", "Sail numbers legible, tally / sign-on done"),
        ],
      };
    case "hardcore":
      return {
        id: "hardcore",
        title: "Big-breeze prep",
        items: [
          item("spares", "Spare shackle and line on board"),
          item("knife", "Knife reachable"),
          item("cover", "Rescue cover knows you're out"),
          item("wear", "Ties, sheets and blocks checked for wear"),
        ],
      };
    case "upwind":
      return {
        id: "upwind",
        title: "Upwind drills",
        items: [
          item("telltales", "Tell-tales on the luff and leech"),
          item("angle", "Tacking angle reference noted on the compass"),
          item("plan", "Drill plan set — e.g. 5 tacks on 3-minute legs"),
          item("marks", "Control line marks ready to repeat settings"),
        ],
      };
    case "downwind":
      return {
        id: "downwind",
        title: "Downwind drills",
        items:
          rig === "sloop-kite"
            ? [
                item("kite-check", "Kite hoist and drop practised ashore"),
                item("sprit", "Bowsprit launches and retracts cleanly"),
                item("gybe-plan", "Gybe drill plan set"),
              ]
            : [
                item("vang-marks", "Vang marks set for downwind"),
                item("lee-plan", "By-the-lee drill plan set"),
                item("gybe-plan", "Gybe drill plan set"),
              ],
      };
    default:
      return {
        id: "casual",
        title: "Before you go",
        items: [
          item("route", "Rough route and turn-back time decided"),
          item("snack", "Water and a snack on board"),
        ],
      };
  }
}

export function checklistFor(sailType: SailType, rig: RigType): ChecklistSection[] {
  return [boatAndRig(rig), SAFETY, CONDITIONS, focusSection(sailType, rig)];
}

export const CHECKLIST_INTRO: Record<SailType, string> = {
  casual: "The standard checks before an easy sail.",
  hardcore: "Standard checks plus spares and cover for a big-breeze day.",
  racing: "Standard checks plus the start sequence and course confirmation.",
  upwind: "Standard checks plus set-up for upwind drills.",
  downwind: "Standard checks plus set-up for downwind drills.",
};
