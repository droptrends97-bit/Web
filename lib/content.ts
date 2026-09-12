/**
 * All site copy in one place. Sections read from here, so words can change
 * without anyone touching motion code.
 *
 * Placeholder content for a fictional studio — swap it for the real thing.
 */

export const site = {
  name: "Setpiece",
  what: "Design and front-end",
  city: "London",
  district: "Bermondsey",
  timezone: "Europe/London",
  founded: "2019",
  email: "hello@setpiece.studio",
  phone: "+44 20 7946 0813",
} as const;

export const nav = [
  { label: "Work", href: "#work" },
  { label: "Studio", href: "#studio" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
] as const;

export const hero = {
  eyebrow: `${site.what} · ${site.city} · Since ${site.founded}`,
  lines: ["Design", "and front-end,", "under one roof."],
  /** Line set in the serif italic. One word of voice, not a gradient. */
  italicLine: 1,
  sub: "Sixteen of us, above a printworks in Bermondsey. We take four or five projects a year and stay on each one from the first sketch to the last deploy.",
  primaryCta: { label: "Start a conversation", href: "#contact" },
  secondaryCta: { label: "Selected work", href: "#work" },
} as const;

export const services = [
  "Brand identity",
  "Websites",
  "Design systems",
  "Front-end engineering",
  "Art direction",
  "Editorial",
  "Accessibility",
] as const;

export const manifesto = {
  eyebrow: "Position",
  body:
    "We are less interested in work that looks expensive than in the moment a page opens on a four-year-old Android, in a tunnel, and still feels like somebody thought about it.",
  attribution: "Studio handbook, page one",
} as const;

export type Project = {
  index: string;
  client: string;
  scope: string;
  sector: string;
  year: string;
  /** Flat field colour for the hover plate. Muted, printed, never neon. */
  plate: string;
  /** Type colour that sits on the plate. */
  plateType: string;
};

export const projects: Project[] = [
  {
    index: "01",
    client: "Marlow & Fitch",
    scope: "Identity, website",
    sector: "Publishing",
    year: "2025",
    plate: "#8a3f2b",
    plateType: "#f4ede2",
  },
  {
    index: "02",
    client: "Kestrel Instruments",
    scope: "Product site",
    sector: "Hardware",
    year: "2025",
    plate: "#3f4a3c",
    plateType: "#eef0e6",
  },
  {
    index: "03",
    client: "Southbank Ballet",
    scope: "Season site, ticketing",
    sector: "Arts",
    year: "2024",
    plate: "#2f3a4a",
    plateType: "#e8edf4",
  },
  {
    index: "04",
    client: "Tide & Tow",
    scope: "Commerce",
    sector: "Outdoor",
    year: "2024",
    plate: "#8d7434",
    plateType: "#f7f1dd",
  },
  {
    index: "05",
    client: "Werrington Trust",
    scope: "Design system",
    sector: "Healthcare",
    year: "2023",
    plate: "#d8d2c4",
    plateType: "#1a1814",
  },
];

export const disciplines = [
  {
    num: "01",
    title: "Identity",
    body:
      "Wordmarks, type systems, colour, photographic direction and the guidelines that keep them intact once we leave.",
    items: ["Naming", "Wordmarks", "Type systems", "Guidelines"],
  },
  {
    num: "02",
    title: "Websites",
    body:
      "Designed in the browser from week two, so the thing you sign off is the thing that ships rather than a picture of it.",
    items: ["Art direction", "Prototypes", "Copy support", "CMS"],
  },
  {
    num: "03",
    title: "Front-end",
    body:
      "React and Next.js, typed and tested. We agree a performance budget in week one and hold ourselves to it after launch.",
    items: ["Next.js", "Accessibility", "Performance", "Handover"],
  },
  {
    num: "04",
    title: "Systems",
    body:
      "Tokens, components and documentation for in-house teams who have to keep shipping long after the launch post.",
    items: ["Tokens", "Components", "Documentation", "Training"],
  },
] as const;

export const process = [
  {
    step: "01",
    title: "Read the room",
    weeks: "Weeks 1—2",
    body:
      "We sit in your office, read the support tickets and talk to the people who use the thing every day. At the end we agree the one number this project has to move.",
  },
  {
    step: "02",
    title: "Set the direction",
    weeks: "Weeks 3—5",
    body:
      "Two routes, built as working pages rather than static boards. You look at them on your own phone, on your own connection, before anyone commits.",
  },
  {
    step: "03",
    title: "Build it",
    weeks: "Weeks 6—12",
    body:
      "Design and engineering run together in one repo. Everything lands typed, accessible and measured against the budget we set in week one.",
  },
  {
    step: "04",
    title: "Hand it over",
    weeks: "Weeks 13—16",
    body:
      "We launch, watch the numbers for a month, fix what the real world finds, then train your team on the system and get out of the way.",
  },
] as const;

export const clients = [
  "Marlow & Fitch",
  "Kestrel Instruments",
  "Southbank Ballet",
  "Tide & Tow",
  "Werrington Trust",
  "Halland Paper",
  "The Lowry Archive",
  "Pike Street Records",
] as const;

export const recognition = [
  { name: "D&AD, Wood Pencil — Digital Design", year: "2025" },
  { name: "Type Directors Club, Certificate of Excellence", year: "2024" },
  { name: "Creative Review Annual, selected", year: "2024" },
  { name: "Design Week Awards, shortlist", year: "2023" },
] as const;

export const contact = {
  heading: "Tell us what you're making.",
  body:
    "We read everything ourselves and reply within two working days — including the ones we turn down.",
  availability: "Taking on two projects for spring",
} as const;

export const footerLinks = [
  {
    heading: "Studio",
    links: [
      { label: "Work", href: "#work" },
      { label: "What we do", href: "#studio" },
      { label: "Process", href: "#process" },
    ],
  },
  {
    heading: "Elsewhere",
    links: [
      { label: "Instagram", href: "#" },
      { label: "Are.na", href: "#" },
      { label: "LinkedIn", href: "#" },
    ],
  },
] as const;

export const address = ["Unit 4, Tanner Street", "London SE1 3LD"] as const;
