/**
 * Single source of truth for site copy.
 * Sections read from here so content can be swapped without touching motion code.
 */

export const site = {
  name: "Nocturne",
  tagline: "Creative technology studio",
  location: "London",
  timezone: "Europe/London",
  founded: "2019",
  email: "studio@nocturne.dev",
} as const;

export const nav = [
  { label: "Work", href: "#work" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Process", href: "#process" },
  { label: "Studio", href: "#studio" },
] as const;

export const hero = {
  eyebrow: `${site.tagline} — ${site.location} / Est. ${site.founded}`,
  lines: ["We design", "the unreasonable", "web"],
  /** index of the line rendered in the serif-italic gradient treatment */
  accentLine: 1,
  sub: "Interface engineering and motion design for companies who refuse to look like everyone else.",
  primaryCta: { label: "Start a project", href: "#studio" },
  secondaryCta: { label: "See the work", href: "#work" },
} as const;

export const ticker = [
  "Motion design",
  "WebGL",
  "Design systems",
  "Brand identity",
  "Front-end engineering",
  "Art direction",
  "Prototyping",
] as const;

export const manifesto = {
  eyebrow: "Manifesto",
  body:
    "Most of the internet is a spreadsheet with rounded corners. We make the other kind — interfaces with weight, rhythm and a pulse, engineered to hold sixty frames a second on the phone in your pocket.",
  signature: "— The studio",
} as const;

export type Project = {
  index: string;
  title: string;
  discipline: string;
  year: string;
  /** two-stop gradient used to generate the hover plate — no image assets required */
  hue: [string, string];
};

export const projects: Project[] = [
  {
    index: "01",
    title: "Halcyon Capital",
    discipline: "Brand & web platform",
    year: "2025",
    hue: ["#7a52ff", "#1a0f3d"],
  },
  {
    index: "02",
    title: "Sonder Audio",
    discipline: "Commerce / WebGL",
    year: "2025",
    hue: ["#c9fa4b", "#1d2a00"],
  },
  {
    index: "03",
    title: "Meridian Health",
    discipline: "Design system",
    year: "2024",
    hue: ["#3ad1c8", "#03211f"],
  },
  {
    index: "04",
    title: "Atlas Robotics",
    discipline: "Product marketing",
    year: "2024",
    hue: ["#ff6a3d", "#2b0d03"],
  },
  {
    index: "05",
    title: "Vanta Studios",
    discipline: "Identity & site",
    year: "2023",
    hue: ["#e8e3d8", "#22202b"],
  },
];

export const capabilities = [
  {
    index: "A",
    title: "Interface design",
    body:
      "Layout, type and colour systems built from first principles. We design in the browser, so what you approve is what ships.",
    items: ["Art direction", "UI systems", "Typography", "Prototyping"],
  },
  {
    index: "B",
    title: "Motion & interaction",
    body:
      "Choreography, not decoration. Every transition carries meaning about state, hierarchy and cause.",
    items: ["Scroll choreography", "Micro-interaction", "Page transitions", "WebGL"],
  },
  {
    index: "C",
    title: "Front-end engineering",
    body:
      "Typed, accessible, fast. React and Next.js delivered with budgets we hold ourselves to after launch.",
    items: ["Next.js", "Accessibility", "Performance", "Headless CMS"],
  },
  {
    index: "D",
    title: "Design systems",
    body:
      "Tokens, primitives and documentation that let an in-house team keep the quality bar after we hand over.",
    items: ["Tokens", "Component libraries", "Docs", "Governance"],
  },
] as const;

export const process = [
  {
    step: "01",
    title: "Orient",
    body:
      "Two weeks inside your business. We audit what exists, interview the people who use it, and agree on the one metric this work has to move.",
  },
  {
    step: "02",
    title: "Compose",
    body:
      "Art direction first. Type, colour, grid and motion language, explored as real pages in a real browser rather than static boards.",
  },
  {
    step: "03",
    title: "Engineer",
    body:
      "Design and build run together. Components arrive typed, accessible and measured against a performance budget from the first commit.",
  },
  {
    step: "04",
    title: "Launch",
    body:
      "We ship, watch the numbers, and stay on for a cycle of refinement. Then we hand over a system your team can actually drive.",
  },
] as const;

export const metrics = [
  { value: 74, suffix: "", label: "Projects shipped" },
  { value: 12, suffix: "", label: "Awards & mentions" },
  { value: 98, suffix: "", label: "Median Lighthouse" },
  { value: 6, suffix: "", label: "Continents served" },
] as const;

export const footerLinks = [
  {
    heading: "Studio",
    links: [
      { label: "Work", href: "#work" },
      { label: "Capabilities", href: "#capabilities" },
      { label: "Process", href: "#process" },
    ],
  },
  {
    heading: "Elsewhere",
    links: [
      { label: "Instagram", href: "#" },
      { label: "Dribbble", href: "#" },
      { label: "LinkedIn", href: "#" },
    ],
  },
] as const;
