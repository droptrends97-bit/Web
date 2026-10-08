export const contact = {
  phone: '087 225 9319',
  phoneHref: 'tel:+353872259319',
  email: 'info@darraghconnolly.ie',
  area: 'Dublin, North Wicklow and surrounding counties',
};

export const nav = [
  { href: '/services/', label: 'Services' },
  { href: '/the-year/', label: 'The year' },
  { href: '/gallery/', label: 'Gallery' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
];

// The Services menu, mirroring the categories on the current site.
export const serviceMenu = [
  { href: '/services/pots-and-planters/', label: 'Pots & Planters' },
  { href: '/services/garden-intervention/', label: 'The Garden Intervention' },
  { href: '/services/garden-health/', label: 'Garden Health' },
  { href: '/services/garden-care/', label: 'Garden Care & Maintenance' },
  { href: '/services/', label: 'Hedging' },
  { href: '/services/', label: 'Passionate About Pots' },
  { href: '/services/', label: 'Bulb Planting' },
  { href: '/services/', label: 'Wellness Planting' },
];

export type Service = {
  slug: string;
  name: string;
  short: string;
  intro: string;
  image: string;
  imageAlt: string;
  body: string[];
  includes: string[];
};

export const services: Service[] = [
  {
    slug: 'garden-care',
    name: 'Garden care & maintenance',
    short: 'Regular visits, monthly, fortnightly or weekly, to keep a garden right all year.',
    intro:
      'Reliable, no-fuss maintenance for gardens of all sizes. After an initial visit we recommend a schedule that suits your garden, and you can trust us to keep things under control all year round.',
    image: '/img/bench-border.jpg',
    imageAlt: 'A curved lawn edged with clipped bay trees, lavender-blue geraniums and a white bench in a walled garden.',
    body: [
      'Every garden is different, so we start with a visit. We walk the garden with you, talk about how you use it, and recommend how often we should come: monthly, fortnightly or weekly.',
      'Visits are made by a team of two gardeners. We bring all the tools, work efficiently, and leave the garden looking its best.',
    ],
    includes: [
      'Pruning, weeding and general tidying',
      'Lawn edge care and light hedge trimming',
      'Border and bed maintenance',
      'Green waste removal (within reason)',
    ],
  },
  {
    slug: 'garden-intervention',
    name: 'The Garden Intervention',
    short: 'A one-off seasonal reset that brings a tired garden back to life.',
    intro:
      'Whether it is a new garden or an old one, a Garden Intervention gets it back to a state you can enjoy, and that is easy to keep that way.',
    image: '/img/alliums-van.jpg',
    imageAlt: 'Purple alliums in full flower in front of the Darragh Connolly Garden Care van.',
    body: [
      'A Garden Intervention is a concentrated piece of work, usually at the turn of a season, that takes a garden from overgrown to cared for in one go.',
      'It is the ideal starting point before regular maintenance, or a once-a-year refresh if you look after the garden yourself the rest of the time.',
    ],
    includes: ['Plant cut-backs', 'Weeding', 'Mulching', 'Power washing'],
  },
  {
    slug: 'garden-health',
    name: 'Garden health',
    short: 'Soil and lawn conditioning, spraying and feeding programmes.',
    intro:
      'Our garden health programmes look after what is underneath: the soil, the lawn and the plants themselves, so the garden grows strong rather than just looking tidy.',
    image: '/img/striped-lawn-bench.jpg',
    imageAlt: 'A freshly striped lawn in front of a white bench and trellis.',
    body: [
      'A garden that is fed and conditioned at the right times of year needs less rescuing. We plan a programme around your soil, your lawn and your planting.',
    ],
    includes: ['Soil conditioning', 'Lawn conditioning and feeding', 'Spraying programmes', 'Seasonal feeding'],
  },
  {
    slug: 'pots-and-planters',
    name: 'Pots & planters',
    short: 'Designed seasonal container displays for front doors, patios and businesses.',
    intro:
      'Transform your entrance, patio, balcony or business with professionally designed seasonal pots and planters, from striking front-door displays to colourful patio arrangements.',
    image: '/img/topiary-tulips.jpg',
    imageAlt: 'Two lollipop topiary trees above pink and red tulips at a granite and red-brick entrance.',
    body: [
      'We design the display, supply the plants, install it, and come back to refresh it as the seasons turn, so the containers look fantastic throughout the year.',
    ],
    includes: [
      'Professionally designed displays',
      'Installation included',
      'Seasonal refreshes',
      'For homes and businesses',
    ],
  },
];

export const alsoOffer = ['Bulb planting', 'Wellness planting', 'Hedging of all types'];

export const visitOptions = [
  { length: 'Full day', team: '2 gardeners' },
  { length: '4 hours', team: '2 gardeners' },
  { length: '3 hours', team: '2 gardeners' },
  { length: '2 hours', team: '2 gardeners' },
  { length: '1.5 hours', team: '2 gardeners' },
];

export type Season = 'winter' | 'spring' | 'summer' | 'autumn';

export type Month = {
  name: string;
  short: string;
  season: Season;
  work: string[];
  service: string;
};

// Typical seasonal work, to be confirmed with Darragh.
export const months: Month[] = [
  { name: 'January', short: 'Jan', season: 'winter', service: 'garden-care',
    work: ['Winter pruning of shrubs and climbers', 'Planting bare-root hedging', 'Tidying beds and borders'] },
  { name: 'February', short: 'Feb', season: 'winter', service: 'garden-intervention',
    work: ['Cutting back grasses and perennials', 'Mulching beds before spring', 'Booking spring Garden Interventions'] },
  { name: 'March', short: 'Mar', season: 'spring', service: 'garden-intervention',
    work: ['Garden Intervention season: cut-backs, weeding, mulching', 'Power washing paths and patios', 'First lawn cuts and edging'] },
  { name: 'April', short: 'Apr', season: 'spring', service: 'garden-health',
    work: ['Spring lawn feeding and conditioning', 'Planting up spring pots', 'Regular maintenance visits begin'] },
  { name: 'May', short: 'May', season: 'spring', service: 'garden-care',
    work: ['Weekly and fortnightly mowing and edging', 'Planting summer pots and planters', 'Keeping on top of weeds'] },
  { name: 'June', short: 'Jun', season: 'summer', service: 'garden-care',
    work: ['Deadheading and border care', 'Light hedge trimming', 'Watering and feeding pots'] },
  { name: 'July', short: 'Jul', season: 'summer', service: 'garden-care',
    work: ['Maintenance at full pace: lawns, edges, borders', 'Deadheading to keep colour coming', 'Green waste taken away'] },
  { name: 'August', short: 'Aug', season: 'summer', service: 'garden-care',
    work: ['Main hedge trim', 'Refreshing summer pots', 'Lawn care through dry spells'] },
  { name: 'September', short: 'Sep', season: 'autumn', service: 'garden-health',
    work: ['Autumn lawn conditioning and feeding', 'Planting autumn pots', 'Cutting back finished perennials'] },
  { name: 'October', short: 'Oct', season: 'autumn', service: 'pots-and-planters',
    work: ['Bulb planting for spring colour', 'Autumn and winter pots', 'Autumn cut-backs and leaf clearance'] },
  { name: 'November', short: 'Nov', season: 'autumn', service: 'garden-care',
    work: ['Leaf clearance and green waste removal', 'Finishing bulb planting', 'Putting beds to rest with mulch'] },
  { name: 'December', short: 'Dec', season: 'winter', service: 'pots-and-planters',
    work: ['Winter and festive planters for front doors', 'Quiet-season tidy', 'Planning next year with you'] },
];

export const testimonials = [
  {
    quote: 'Excellent general gardening & tidy up service from a professional and experienced team. Highly recommended.',
    name: 'John Fallon',
  },
];

export const gallery = [
  { src: '/img/garden-bench-panorama.jpg', alt: 'A white bench before trellis, clipped bay trees, white hydrangeas and blue geraniums.', wide: true },
  { src: '/img/topiary-tulips.jpg', alt: 'Lollipop topiary above pink tulips at a granite entrance.' },
  { src: '/img/bench-border.jpg', alt: 'A curving lawn and mixed border with standard bay trees and a white bench.' },
  { src: '/img/acer-garden.jpg', alt: 'A copper acer framing a lawn and a border of pink roses.' },
  { src: '/img/alliums-van.jpg', alt: 'Purple alliums in front of the Darragh Connolly van.' },
  { src: '/img/striped-lawn-bench.jpg', alt: 'A striped lawn leading to a white bench.' },
  { src: '/img/tulips-paving.jpg', alt: 'Tulip planting along a granite kerb.' },
  { src: '/img/lawn-stripes.jpg', alt: 'Close view of a freshly striped lawn.', wide: true },
];
