export type RigType = "una" | "sloop" | "sloop-kite";

export interface BoatClass {
  id: string;
  name: string;
  rig: RigType;
  crew: number;
  pointing: number;
  sails: string[];
  blurb: string;
}

export const RIG_LABEL: Record<RigType, string> = {
  una: "Una (single sail)",
  sloop: "Sloop",
  "sloop-kite": "Sloop + kite",
};

export const BOAT_CLASSES: BoatClass[] = [
  { id: "ilca4", name: "ILCA 4 (Laser 4.7)", rig: "una", crew: 1, pointing: 45, sails: ["Main"], blurb: "4.2 m singlehander with the smallest ILCA rig" },
  { id: "ilca6", name: "ILCA 6 (Radial)", rig: "una", crew: 1, pointing: 45, sails: ["Main"], blurb: "4.2 m singlehander, radial-cut mid-size rig" },
  { id: "ilca7", name: "ILCA 7 (Standard)", rig: "una", crew: 1, pointing: 45, sails: ["Main"], blurb: "4.2 m Olympic singlehander, full-size rig" },
  { id: "aero5", name: "RS Aero 5", rig: "una", crew: 1, pointing: 43, sails: ["Main"], blurb: "Lightweight 4.0 m singlehander, small rig" },
  { id: "aero7", name: "RS Aero 7", rig: "una", crew: 1, pointing: 43, sails: ["Main"], blurb: "Lightweight 4.0 m singlehander, mid rig" },
  { id: "aero9", name: "RS Aero 9", rig: "una", crew: 1, pointing: 43, sails: ["Main"], blurb: "Lightweight 4.0 m singlehander, big rig" },
  { id: "rs200", name: "RS200", rig: "sloop-kite", crew: 2, pointing: 40, sails: ["Main", "Jib", "Asymmetric kite"], blurb: "4.0 m two-person sloop with an asymmetric kite on a bowsprit" },
  { id: "rs400", name: "RS400", rig: "sloop-kite", crew: 2, pointing: 40, sails: ["Main", "Jib", "Asymmetric kite"], blurb: "4.5 m two-person sloop, powerful asymmetric rig" },
  { id: "rs500", name: "RS500", rig: "sloop-kite", crew: 2, pointing: 40, sails: ["Main", "Jib", "Asymmetric kite"], blurb: "4.3 m two-person trapeze sloop with an asymmetric kite" },
  { id: "feva", name: "RS Feva", rig: "sloop-kite", crew: 2, pointing: 42, sails: ["Main", "Jib", "Asymmetric kite"], blurb: "3.6 m two-person youth sloop with an asymmetric kite" },
];

export function classById(id: string): BoatClass | undefined {
  return BOAT_CLASSES.find((c) => c.id === id);
}

export interface Boat {
  id: string;
  classId: string;
  name: string;
  rig: RigType;
  pointing: number;
  sails: string[];
}

export function boatSubtitle(boat: Boat): string {
  const cls = classById(boat.classId);
  const parts = [RIG_LABEL[boat.rig]];
  if (cls && cls.name !== boat.name) parts.unshift(cls.name);
  return parts.join(" · ");
}
