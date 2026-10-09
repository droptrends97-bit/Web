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
  { href: '/testimonials/', label: 'Testimonials' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
];

// The Services menu, mirroring the categories on the current site.
export const serviceMenu = [
  { href: '/services/pots-and-planters/', label: 'Pots & Planters' },
  { href: '/services/garden-intervention/', label: 'The Garden Intervention' },
  { href: '/services/garden-health/', label: 'Garden Health' },
  { href: '/services/garden-care/', label: 'Maintenance for Wellness' },
  { href: '/services/hedging/', label: 'Hedging' },
  { href: '/services/passionate-about-pots/', label: 'Passionate About Pots' },
  { href: '/services/bulb-planting/', label: 'Bulb Planting' },
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
    short: 'New life for planting that has lost its spark, with expert plant design.',
    intro:
      'Perfect when your garden was designed and landscaped in the last 3 to 5 years (or more), the paving and paths are still in good condition, but the planting has lost its spark.',
    image: '/img/gi-6.jpg',
    imageAlt: 'A raised bed of red heuchera and orange crocosmia against a white wall.',
    body: [
      "When a solid garden structure is paired with a carefully chosen palette of plants that thrive, the whole space comes alive. That's exactly what a Garden Intervention delivers.",
      "With our experience and expertise in plant design, we'll transform your garden into the vibrant, stylish sanctuary you want.",
    ],
    includes: [
      'Standout specimen plants',
      'Signature Plunge Planting perennial schemes',
      'Topiary and pleached trees',
      'Full soil reconditioning',
    ],
  },
  {
    slug: 'garden-health',
    name: 'Garden health',
    short: 'A three-visits-a-year programme: lawn, soil, feeding, and pest and disease care.',
    intro:
      "Darragh's Garden Health Programme gives a well-planted garden the ongoing specialist care it needs to stay vibrant, resilient and full of life.",
    image: '/img/striped-lawn-bench.jpg',
    imageAlt: 'A freshly striped lawn in front of a white bench and trellis.',
    body: [
      'The programme is carried out three times a year. Even if you already have a maintenance company, we can work alongside them.',
    ],
    includes: ['Lawn treatments', 'Soil conditioning', 'Feeding of plants', 'Pest and disease treatment'],
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
    work: ['Garden Intervention season: new planting schemes', 'Soil reconditioning before planting', 'First lawn cuts and edging'] },
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

export const reviews = [
  { name: 'Honor Finucane', place: 'Dún Laoghaire, Co. Dublin', tag: 'Clear-up & planting', img: '/img/rev-1.jpg',
    quote: "I would highly recommend the work of Darragh Connolly. My garden was completely overrun and he cleaned it, cut back the brambles and took all the rubbish away. It was also planted with a great array of plants. It is so great to be able to use the space again. We now do a scheduled garden care programme and wouldn't have it any other way." },
  { name: 'J Keaney', place: 'Monkstown, Co. Dublin', tag: 'Autumn/winter tidy-up', img: '/img/rev-2.jpg',
    quote: "Darragh Connolly Garden Care did an autumn/winter tidy-up in both front and back gardens. They did a wonderful job, cutting everything back, shaping all bushes and trees, weeding and weed control. We haven't had to do a thing to the garden since." },
  { name: 'M Walshe', place: 'Dalkey, Co. Dublin', tag: 'Five years of care', img: '/img/rev-3.jpg',
    quote: 'We have used the services of Darragh Connolly Garden Care for the past five years. What we really liked about the company initially was the upfront pricing and what you are getting for your money. They work so hard at getting the correct results and you can really see the results now with our gorgeous garden, which is admired by all.' },
  { name: 'O Smyth', place: 'Blackrock, Co. Dublin', tag: 'Garden restoration', img: '/img/rev-4.jpg',
    quote: "I have no hesitation in recommending the services of Darragh Connolly. He recently completed some work on my garden and has restored it to its former glory. I found him to be extremely reliable and accommodating, and his work was of the highest standard. It's great to have the use of my garden again. Now I just need to maintain it!" },
  { name: 'F Stacey', place: 'Dalkey, Co. Dublin', tag: 'Scheduled garden care', img: '/img/rev-5.jpg',
    quote: 'Thank you for carrying out the work in our garden a couple of weeks ago. You did exactly what we asked you to do, plus the extra work we decided to add while you were here. We are now ever so pleased with the scheduled garden care programme, as all we have to do now is look at the garden and enjoy it!' },
  { name: 'P Cotterell', place: 'Shankill, Co. Dublin', tag: 'Garden work', img: '/img/rev-6.jpg',
    quote: 'I would have no hesitation in recommending Darragh Connolly and his crew to carry out work in your garden. They came on the day agreed and did a wonderful job in our garden. He and his team are very efficient in their work and leave everything tidy. I was really impressed with their excellent work.' },
  { name: 'A Kavanagh', place: 'Foxrock, Co. Dublin', tag: 'Annual lawn programme', img: '/img/rev-7.jpg',
    quote: 'Darragh has been looking after our lawn for 2 years now. He does an annual programme which involves several treatments throughout the year. Our lawn looks great year round, at a reasonable cost to us.' },
  { name: 'N Tubridy', place: 'Donnybrook, Dublin 4', tag: 'Small urban garden', img: '/img/rev-8.jpg',
    quote: 'I was delighted with the work done by Darragh Connolly on my small urban garden. Everything was done quickly and efficiently, with no fuss and no mess. Will definitely use the company again.' },
  { name: 'T Crowley', place: 'Dalkey, Co. Dublin', tag: 'Award-winning garden', img: '/img/rev-9.jpg',
    quote: "I am delighted with the work that Darragh Connolly did for us. It was to the highest standard, finished on time and within budget. I can't believe my garden won an award, it is just wonderful!" },
];
