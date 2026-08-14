/* ==========================================================================
   data.js — every word, number and body-plan on the site lives here
   Colours are [hue, saturation%, lightness%] so the renderer can shade them.
   ========================================================================== */
(function (global) {
  'use strict';

  /* ---------------------------------------------------------------- ZONES */
  var ZONES = [
    {
      name: 'Sunlight Zone', short: 'Epipelagic', tick: 'EPI', range: '0 – 200 m',
      light: 'full daylight', pressure: '1 – 20 atm', temp: '18 – 30 °C',
      resident: 'Clownfish, tuna, sailfish',
      text: 'Everything that photosynthesises in the sea lives up here, so almost everything that eats lives here too. ' +
            'Ninety percent of marine life is packed into the top two hundred metres — a thin bright skin on a very deep planet.',
      top: [193, 72, 58], bottom: [199, 78, 34], fog: 0.06, density: 1.0, glow: 0
    },
    {
      name: 'Twilight Zone', short: 'Mesopelagic', tick: 'MESO', range: '200 – 1,000 m',
      light: '1% of surface light', pressure: '20 – 100 atm', temp: '4 – 18 °C',
      resident: 'Lanternfish, hatchetfish, squid',
      text: 'Blue is the last colour to survive the descent, so red animals turn invisible here and use it as camouflage. ' +
            'Every night the largest migration on Earth happens in this water: billions of fish rise to feed, then sink before dawn.',
      top: [202, 76, 30], bottom: [210, 80, 16], fog: 0.14, density: .8, glow: .15
    },
    {
      name: 'Midnight Zone', short: 'Bathypelagic', tick: 'BATHY', range: '1,000 – 4,000 m',
      light: 'none but their own', pressure: '100 – 400 atm', temp: '2 – 4 °C',
      resident: 'Anglerfish, viperfish, gulper eel',
      text: 'No sunlight has ever reached this far. Food arrives as marine snow — a slow drift of everything that died above — ' +
            'so bodies here are built to spend nothing: soft bones, slack muscle, jaws that swallow prey larger than themselves.',
      top: [214, 70, 14], bottom: [220, 62, 8], fog: .26, density: .5, glow: .55
    },
    {
      name: 'Abyssal Zone', short: 'Abyssopelagic', tick: 'ABYSS', range: '4,000 – 6,000 m',
      light: 'absolute dark', pressure: '400 – 600 atm', temp: '0 – 3 °C',
      resident: 'Tripodfish, cusk eels, grenadiers',
      text: 'Two thirds of the seafloor sits at this depth, a cold plain under six hundred atmospheres. ' +
            'Fish here often stand still on stilt-like fins, waiting for current to deliver a meal rather than burning energy chasing one.',
      top: [222, 58, 9], bottom: [226, 50, 5], fog: .34, density: .3, glow: .7
    },
    {
      name: 'Hadal Zone', short: 'Hadopelagic', tick: 'HADAL', range: '6,000 – 11,000 m',
      light: 'none', pressure: '600 – 1,100 atm', temp: '1 – 4 °C',
      resident: 'Hadal snailfish',
      text: 'Only trenches go this deep. Snailfish here are gelatinous and nearly transparent, their cells stabilised by a molecule ' +
            'that stops the pressure crushing their proteins. Around 8,200 m that chemistry gives out — a hard ceiling on how deep a fish can be.',
      top: [228, 48, 6], bottom: [232, 42, 3], fog: .4, density: .16, glow: .5
    },
    {
      name: 'Back to the Light', short: 'Return', tick: 'UP', range: 'surface',
      light: 'returning', pressure: '1 atm', temp: 'warm',
      resident: 'You',
      text: 'Rise back through eleven kilometres of water. Every layer you just passed is connected to this one by ' +
            'animals that commute between them nightly — the ocean is not stacked, it circulates.',
      top: [190, 74, 56], bottom: [200, 78, 32], fog: .06, density: 1, glow: 0
    }
  ];

  /* -------------------------------------------------------------- SPECIES */
  function spec(o) {
    var d = {
      shape: 'fusiform', bodyDepth: .34, head: .5,
      top: [205, 60, 40], mid: [200, 55, 55], belly: [190, 30, 88],
      pattern: 'none', patternColor: [0, 0, 100], patternCount: 4, patternAlpha: .85,
      finColor: null, finAlpha: .8,
      dorsal: .5, dorsalStyle: 'normal', anal: .4, pectoral: .5,
      tail: 'fork', tailSize: .5,
      eye: .5, glow: 0, lure: false, teeth: false, bill: false, spines: false,
      speed: 1, waveAmp: 1, waveFreq: 1
    };
    for (var k in o) d[k] = o[k];
    return d;
  }

  var SPECIES = [
    {
      id: 'clownfish', name: 'Clownfish', latin: 'Amphiprion ocellaris', group: 'reef',
      depthText: '1 – 15 m',
      blurb: 'Born male, coated in mucus that anemone stingers ignore, and permanently late for nothing.',
      long: 'Every clownfish begins life male. The largest fish in a colony becomes female, the second-largest becomes her breeding ' +
            'partner, and the rest wait in line. If she dies, he changes sex and the queue moves up. They never leave their anemone ' +
            '— a mucus coat, partly acquired from the anemone itself, keeps the stinging cells from firing.',
      facts: [['Length', 'up to 11 cm'], ['Lifespan', '6 – 10 years'], ['Depth', '1 – 15 m'], ['Diet', 'algae, plankton, scraps'], ['Status', 'Least concern']],
      stats: { Speed: 22, Depth: 6, Size: 8, Strangeness: 62 },
      art: spec({
        bodyDepth: .46, head: .62, top: [20, 92, 52], mid: [26, 96, 56], belly: [30, 90, 62],
        pattern: 'bars', patternColor: [200, 30, 99], patternCount: 3,
        dorsal: .55, dorsalStyle: 'spiny', anal: .45, pectoral: .62,
        tail: 'round', tailSize: .5, eye: .62, speed: .85, waveAmp: 1.15, waveFreq: 1.25,
        finColor: [22, 90, 46]
      })
    },
    {
      id: 'bluetang', name: 'Regal Blue Tang', latin: 'Paracanthurus hepatus', group: 'reef',
      depthText: '2 – 40 m',
      blurb: 'A living paintbrush with a scalpel folded into each side of its tail.',
      long: 'The "surgeon" in surgeonfish is literal: a hinged, razor-sharp spine sits in a groove at the base of the tail and flicks ' +
            'out sideways when the fish is threatened. When frightened it wedges itself into coral and locks its spines, or plays ' +
            'dead on its side until the danger passes.',
      facts: [['Length', 'up to 31 cm'], ['Lifespan', '8 – 20 years'], ['Depth', '2 – 40 m'], ['Diet', 'algae, plankton'], ['Status', 'Least concern']],
      stats: { Speed: 34, Depth: 12, Size: 16, Strangeness: 48 },
      art: spec({
        shape: 'disc', bodyDepth: .58, head: .42, top: [222, 88, 44], mid: [214, 92, 52], belly: [210, 80, 62],
        pattern: 'palette', patternColor: [8, 5, 8], patternCount: 1,
        dorsal: .7, dorsalStyle: 'long', anal: .6, pectoral: .55,
        tail: 'lunate', tailSize: .55, eye: .55, speed: .95, waveAmp: .8, waveFreq: 1.05,
        finColor: [50, 100, 55]
      })
    },
    {
      id: 'lionfish', name: 'Red Lionfish', latin: 'Pterois volitans', group: 'reef',
      depthText: '2 – 100 m',
      blurb: 'Eighteen venomous spines, no natural predators outside its home range, and an appetite that rewrote an ecosystem.',
      long: 'Beautiful and catastrophic. Released into the Atlantic in the 1980s, lionfish now dominate reefs from Rhode Island to ' +
            'Venezuela, eating juvenile fish faster than reefs can replace them. They herd prey with their fanned pectoral fins, then ' +
            'swallow it in a strike that lasts a fiftieth of a second.',
      facts: [['Length', 'up to 47 cm'], ['Lifespan', '10 – 15 years'], ['Depth', '2 – 100 m'], ['Diet', 'small fish, shrimp'], ['Status', 'Invasive (Atlantic)']],
      stats: { Speed: 18, Depth: 24, Size: 22, Strangeness: 88 },
      art: spec({
        bodyDepth: .44, head: .58, top: [8, 62, 34], mid: [16, 70, 52], belly: [24, 45, 78],
        pattern: 'stripes', patternColor: [10, 70, 22], patternCount: 9,
        dorsal: 1, dorsalStyle: 'spiny', anal: .5, pectoral: 1, spines: true,
        tail: 'fan', tailSize: .62, eye: .6, speed: .55, waveAmp: .7, waveFreq: .8,
        finColor: [12, 60, 40], finAlpha: .55
      })
    },
    {
      id: 'bluefin', name: 'Atlantic Bluefin Tuna', latin: 'Thunnus thynnus', group: 'open',
      depthText: '0 – 1,000 m',
      blurb: 'Warm-blooded, retractable-finned, and capable of crossing an ocean in under two months.',
      long: 'A bluefin is closer to a missile than to most fish. Counter-current heat exchangers keep its muscle up to 20 °C above ' +
            'the surrounding water, its fins fold into slots to cut drag, and its tail is a rigid crescent driven by tendons rather ' +
            'than a flexing body. Individuals have been tracked crossing the Atlantic in 50 days.',
      facts: [['Length', 'up to 3 m'], ['Weight', 'up to 680 kg'], ['Top speed', '~70 km/h'], ['Diet', 'herring, mackerel, squid'], ['Status', 'Rebuilding, still fished hard']],
      stats: { Speed: 96, Depth: 42, Size: 66, Strangeness: 40 },
      art: spec({
        bodyDepth: .3, head: .48, top: [216, 55, 26], mid: [206, 40, 46], belly: [45, 25, 82],
        pattern: 'none',
        dorsal: .42, dorsalStyle: 'normal', anal: .34, pectoral: .4,
        tail: 'lunate', tailSize: .72, eye: .45, speed: 1.9, waveAmp: .45, waveFreq: 1.7,
        finColor: [48, 80, 52]
      })
    },
    {
      id: 'sailfish', name: 'Indo-Pacific Sailfish', latin: 'Istiophorus platypterus', group: 'open',
      depthText: '0 – 200 m',
      blurb: 'Raises a dorsal fin taller than its own body, then herds sardines with it.',
      long: 'Often called the fastest fish in the sea, though the famous 110 km/h figure comes from a fishing-line measurement and ' +
            'is probably generous. What is certain is the sail: normally folded into a groove, it snaps up during hunting, and a ' +
            'group of sailfish will use their sails together to compress a bait ball before slashing through it with their bills.',
      facts: [['Length', 'up to 3.5 m'], ['Weight', 'up to 100 kg'], ['Sail height', 'to 1.5× body depth'], ['Diet', 'sardines, anchovies, squid'], ['Status', 'Least concern']],
      stats: { Speed: 100, Depth: 20, Size: 74, Strangeness: 66 },
      art: spec({
        bodyDepth: .26, head: .4, top: [230, 62, 24], mid: [220, 48, 40], belly: [210, 20, 80],
        pattern: 'dots', patternColor: [200, 60, 92], patternCount: 22, patternAlpha: .5,
        dorsal: 1, dorsalStyle: 'sail', anal: .34, pectoral: .4, bill: true,
        tail: 'lunate', tailSize: .78, eye: .42, speed: 2.1, waveAmp: .4, waveFreq: 1.8,
        finColor: [232, 70, 30], finAlpha: .78
      })
    },
    {
      id: 'mola', name: 'Ocean Sunfish', latin: 'Mola mola', group: 'open',
      depthText: '0 – 800 m',
      blurb: 'A head that decided it did not need a body. Heaviest bony fish alive.',
      long: 'The mola looks unfinished because it is: its tail never develops, and the back edge of the fish is a stiff rudder called ' +
            'a clavus. It swims by flapping enormous dorsal and anal fins like wings, dives repeatedly into cold water after ' +
            'jellyfish, then returns to the surface to lie flat and let seabirds pick parasites off its skin.',
      facts: [['Length', 'to 3.3 m tall'], ['Weight', 'up to 2,300 kg'], ['Eggs', 'up to 300 million'], ['Diet', 'jellies, salps'], ['Status', 'Vulnerable']],
      stats: { Speed: 14, Depth: 38, Size: 88, Strangeness: 100 },
      art: spec({
        shape: 'disc', bodyDepth: .95, head: .35, top: [205, 22, 40], mid: [200, 14, 56], belly: [195, 10, 72],
        pattern: 'net', patternColor: [200, 20, 88], patternCount: 6, patternAlpha: .25,
        dorsal: 1.4, dorsalStyle: 'wing', anal: 1.3, pectoral: .35,
        tail: 'truncate', tailSize: .22, eye: .7, speed: .38, waveAmp: .28, waveFreq: .55,
        finColor: [200, 16, 46]
      })
    },
    {
      id: 'anglerfish', name: 'Humpback Anglerfish', latin: 'Melanocetus johnsonii', group: 'deep',
      depthText: '1,000 – 4,000 m',
      blurb: 'Carries a lamp full of glowing bacteria and a husband fused to her side.',
      long: 'The fish everyone pictures is female. Males are a fraction of her size, born with no functional gut — they must find a ' +
            'mate before they starve, bite on, and in some species fuse permanently, their bodies dissolving into hers until only ' +
            'the testes remain. Her lure glows because of bacteria she farms inside it.',
      facts: [['Length', 'female to 18 cm'], ['Male', '~3 cm, parasitic'], ['Depth', '1,000 – 4,000 m'], ['Diet', 'anything it can fit'], ['Status', 'Data deficient']],
      stats: { Speed: 8, Depth: 88, Size: 12, Strangeness: 100 },
      art: spec({
        bodyDepth: .72, head: .85, top: [250, 30, 8], mid: [245, 24, 14], belly: [240, 18, 20],
        pattern: 'none',
        dorsal: .3, dorsalStyle: 'normal', anal: .3, pectoral: .4,
        tail: 'fan', tailSize: .45, eye: .35, glow: .9, lure: true, teeth: true,
        speed: .32, waveAmp: 1.3, waveFreq: .6, finColor: [248, 26, 12]
      })
    },
    {
      id: 'viperfish', name: 'Sloane\'s Viperfish', latin: 'Chauliodus sloani', group: 'deep',
      depthText: '500 – 2,500 m',
      blurb: 'Teeth too long for its own mouth, so it hinges its skull backwards to bite.',
      long: 'Its fangs are so oversized that they close outside the jaw, past the eyes. To swallow, it drops its heart and gills ' +
            'out of the way and rotates its skull back. A row of photophores runs along its belly, tuned to match the faint light ' +
            'from above so nothing below sees a silhouette.',
      facts: [['Length', 'up to 35 cm'], ['Fangs', 'longer than its jaw'], ['Depth', '500 – 2,500 m by day'], ['Diet', 'lanternfish, shrimp'], ['Status', 'Least concern']],
      stats: { Speed: 40, Depth: 76, Size: 14, Strangeness: 94 },
      art: spec({
        shape: 'eel', bodyDepth: .2, head: .7, top: [235, 45, 12], mid: [225, 40, 22], belly: [215, 30, 30],
        pattern: 'dots', patternColor: [170, 90, 62], patternCount: 26, patternAlpha: .9,
        dorsal: .5, dorsalStyle: 'long', anal: .3, pectoral: .3,
        tail: 'fan', tailSize: .4, eye: .6, glow: .6, teeth: true,
        speed: .8, waveAmp: 1.6, waveFreq: 1.1, finColor: [230, 40, 20]
      })
    },
    {
      id: 'betta', name: 'Siamese Fighting Fish', latin: 'Betta splendens', group: 'fresh',
      depthText: 'shallow paddies',
      blurb: 'Breathes air from an organ in its head, builds nests out of bubbles.',
      long: 'Wild bettas live in rice paddies and floodplains that routinely run out of oxygen, so they evolved a labyrinth organ — ' +
            'a folded, blood-rich maze above the gills — and gulp air at the surface. Males blow saliva-coated bubbles into a raft, ' +
            'coax a female underneath it, then catch the sinking eggs in their mouths and spit them back into the nest.',
      facts: [['Length', '6 – 8 cm'], ['Lifespan', '3 – 5 years'], ['Breathes', 'air + water'], ['Diet', 'insects, larvae'], ['Status', 'Vulnerable in the wild']],
      stats: { Speed: 20, Depth: 2, Size: 5, Strangeness: 70 },
      art: spec({
        bodyDepth: .42, head: .55, top: [340, 78, 34], mid: [352, 84, 48], belly: [12, 70, 58],
        pattern: 'stripes', patternColor: [330, 60, 26], patternCount: 6, patternAlpha: .35,
        dorsal: 1.1, dorsalStyle: 'long', anal: 1.2, pectoral: .7,
        tail: 'fan', tailSize: 1.15, eye: .6, speed: .5, waveAmp: 1.1, waveFreq: .85,
        finColor: [348, 82, 42], finAlpha: .62
      })
    },
    {
      id: 'piranha', name: 'Red-bellied Piranha', latin: 'Pygocentrus nattereri', group: 'fresh',
      depthText: 'river channels',
      blurb: 'Shoals for protection, not for slaughter. The frenzy is mostly folklore.',
      long: 'Theodore Roosevelt watched a starved, netted shoal strip a cow and told the world piranhas were killers; the fish had ' +
            'been deliberately penned and famished for the show. In the wild they mostly eat fish, insects and fruit, and they shoal ' +
            'because they are prey — for caiman, river dolphins and larger fish. Their bite force, per kilo, is still among the ' +
            'strongest ever measured.',
      facts: [['Length', 'up to 33 cm'], ['Teeth', 'single interlocking row'], ['Bite', '~320 N in a 1 kg fish'], ['Diet', 'fish, insects, fruit, carrion'], ['Status', 'Least concern']],
      stats: { Speed: 52, Depth: 4, Size: 20, Strangeness: 44 },
      art: spec({
        shape: 'disc', bodyDepth: .56, head: .6, top: [210, 18, 34], mid: [40, 12, 62], belly: [8, 78, 48],
        pattern: 'dots', patternColor: [45, 30, 80], patternCount: 30, patternAlpha: .35,
        dorsal: .5, dorsalStyle: 'normal', anal: .55, pectoral: .5,
        tail: 'fork', tailSize: .55, eye: .55, teeth: true,
        speed: 1.15, waveAmp: .9, waveFreq: 1.4, finColor: [10, 60, 44]
      })
    },
    {
      id: 'icefish', name: 'Blackfin Icefish', latin: 'Chaenocephalus aceratus', group: 'cold',
      depthText: '5 – 770 m, Antarctic',
      blurb: 'The only vertebrate on Earth with no haemoglobin. Its blood runs clear.',
      long: 'Icefish gave up red blood cells entirely. In water at −1.9 °C, oxygen dissolves so readily — and their metabolism is so ' +
            'slow — that plasma alone carries enough of it, pumped by an oversized heart through unusually wide vessels. They also ' +
            'produce antifreeze glycoproteins that bind to ice crystals and stop them growing inside the body.',
      facts: [['Length', 'up to 72 cm'], ['Blood', 'no haemoglobin'], ['Habitat', 'Southern Ocean'], ['Diet', 'krill, fish'], ['Status', 'Least concern']],
      stats: { Speed: 26, Depth: 46, Size: 34, Strangeness: 96 },
      art: spec({
        bodyDepth: .3, head: .74, top: [200, 18, 46], mid: [195, 12, 66], belly: [190, 8, 88],
        pattern: 'stripes', patternColor: [205, 20, 32], patternCount: 5, patternAlpha: .3,
        dorsal: .8, dorsalStyle: 'long', anal: .5, pectoral: .85,
        tail: 'truncate', tailSize: .5, eye: .78, speed: .6, waveAmp: 1.05, waveFreq: .9,
        finColor: [200, 14, 60], finAlpha: .5
      })
    },
    {
      id: 'greenland', name: 'Greenland Shark', latin: 'Somniosus microcephalus', group: 'cold',
      depthText: '0 – 2,200 m, Arctic',
      blurb: 'May not breed until it is 150. The oldest known individual predates Newton.',
      long: 'Radiocarbon dating of eye lenses put one female at roughly 392 years old, give or take a century — the longest-lived ' +
            'vertebrate known. It cruises at about one kilometre per hour, slower than the seals found in its stomach, which remains ' +
            'unexplained. Nearly every individual carries a parasitic copepod hanging from each eye, leaving it functionally blind.',
      facts: [['Length', 'up to 7 m'], ['Age', 'estimated 250 – 400 yrs'], ['Cruise speed', '~1.2 km/h'], ['Diet', 'fish, seals, carrion'], ['Status', 'Vulnerable']],
      stats: { Speed: 6, Depth: 70, Size: 92, Strangeness: 90 },
      art: spec({
        shape: 'shark', bodyDepth: .28, head: .55, top: [215, 12, 26], mid: [210, 8, 38], belly: [200, 6, 52],
        pattern: 'none',
        dorsal: .45, dorsalStyle: 'normal', anal: .3, pectoral: .8,
        tail: 'shark', tailSize: .8, eye: .3,
        speed: .3, waveAmp: 1.2, waveFreq: .45, finColor: [212, 10, 30]
      })
    }
  ];

  /* -------------------------------------------------------------- ANATOMY */
  var ANATOMY = [
    { part: 'dorsal', x: 470, y: 118, label: 'Dorsal fin', title: 'Dorsal fin',
      text: 'The keel. It stops the fish rolling over when the tail pushes sideways. Spiny at the front in most reef fish, where it doubles as a folding fence of needles.' },
    { part: 'caudal', x: 800, y: 152, label: 'Caudal fin', title: 'Caudal fin — the engine',
      text: 'Shape predicts lifestyle almost perfectly. Crescent tails mean open-ocean cruising; broad round tails mean explosive acceleration from a standstill and quick turns around coral.' },
    { part: 'pectoral', x: 356, y: 320, label: 'Pectoral', title: 'Pectoral fins',
      text: 'Steering, braking and hovering. They sit roughly where your shoulders are, and they are the fins that would eventually become arms in the animals that crawled ashore.' },
    { part: 'lateral', x: 470, y: 216, label: 'Lateral line', title: 'Lateral line',
      text: 'A row of pressure-sensitive hair cells running head to tail under the scales. It reads water displacement — a sixth sense that lets a shoal of hundreds turn as one, in the dark.' },
    { part: 'gills', x: 252, y: 306, label: 'Gills', title: 'Gills',
      text: 'Water enters the mouth and exits over stacked filaments where blood flows the opposite way. That counter-current design strips up to 80% of the oxygen from water — lungs manage about 25% from air.' },
    { part: 'bladder', x: 430, y: 182, label: 'Swim bladder', title: 'Swim bladder',
      text: 'A gas bag tuned to make the fish exactly as dense as the water around it, so hovering costs nothing. In some species it doubles as an ear and a drum. Sharks never evolved one — they use an oily liver instead.' },
    { part: 'eye', x: 196, y: 168, label: 'Eye', title: 'Eye',
      text: 'A rigid spherical lens that focuses by moving back and forth, like a camera, rather than changing shape. Many reef fish see ultraviolet; deep-sea species trade colour entirely for photon-counting sensitivity.' },
    { part: 'mouth', x: 128, y: 288, label: 'Jaw', title: 'Protrusible jaw',
      text: 'Most bony fish can shoot the whole upper jaw forwards, creating a suction pulse that pulls prey in rather than requiring a chase. The strike is typically over in under 30 milliseconds.' }
  ];

  /* ---------------------------------------------------------------- SCALE */
  var SCALE = [
    { name: 'Dwarf pygmy goby', len: 0.009, note: 'Among the smallest vertebrates ever measured — mature adults weigh less than a grain of rice.', art: 'clownfish' },
    { name: 'Siamese fighting fish', len: 0.07, note: 'Fits in a teacup, breathes air, and will flare at its own reflection for hours.', art: 'betta' },
    { name: 'Clownfish', len: 0.11, note: 'Spends its entire adult life within a metre or two of one anemone.', art: 'clownfish' },
    { name: 'Red-bellied piranha', len: 0.33, note: 'A shoaling prey animal with an unfairly cinematic reputation.', art: 'piranha' },
    { name: 'Atlantic bluefin tuna', len: 3.0, note: 'Warm-blooded, ocean-crossing, and roughly the length of a small car.', art: 'bluefin' },
    { name: 'Greenland shark', len: 6.4, note: 'Grows about one centimetre a year. This one would have been born in the 1600s.', art: 'greenland' },
    { name: 'Basking shark', len: 9.8, note: 'The second-largest fish, and a filter feeder — it strains plankton with a mouth a metre wide.', art: 'greenland' },
    { name: 'Whale shark', len: 14.0, note: 'The largest fish alive. Spotted like a night sky, harmless, and mapped individually by those spots.', art: 'greenland' }
  ];

  /* ----------------------------------------------------------------- QUIZ */
  var QUIZ = [
    {
      q: 'It is 3 a.m. Where are you?',
      a: [
        { t: 'Somewhere warm and social', s: 'Half-asleep among friends', w: { clownfish: 3, bluetang: 2 } },
        { t: 'Still moving', s: 'You do not really stop', w: { bluefin: 3, sailfish: 2 } },
        { t: 'Alone in the dark, thinking', s: 'And enjoying it', w: { anglerfish: 3, viperfish: 2 } },
        { t: 'Drifting, honestly', s: 'Wherever the current went', w: { mola: 3, greenland: 2 } }
      ]
    },
    {
      q: 'Pick a superpower.',
      a: [
        { t: 'Make your own light', s: 'Never need anyone else\'s', w: { anglerfish: 3, viperfish: 2 } },
        { t: 'Never feel cold', s: 'Antifreeze in the blood', w: { icefish: 3, greenland: 2 } },
        { t: 'Outrun anything', s: 'Seventy kilometres an hour', w: { bluefin: 3, sailfish: 3 } },
        { t: 'Be politely untouchable', s: 'Venom, but only defensive', w: { lionfish: 3, bluetang: 1 } }
      ]
    },
    {
      q: 'How do you handle conflict?',
      a: [
        { t: 'Look dramatic until it stops', s: 'Fins fully fanned', w: { lionfish: 3, betta: 3 } },
        { t: 'Hide in something familiar', s: 'Home has stinging tentacles', w: { clownfish: 3 } },
        { t: 'Bring the group', s: 'Safety in numbers', w: { piranha: 3, bluetang: 2 } },
        { t: 'Outlast it', s: 'You have four centuries', w: { greenland: 3, mola: 2 } }
      ]
    },
    {
      q: 'Your ideal meal is…',
      a: [
        { t: 'Grazed slowly, all day', s: 'Algae, mostly', w: { bluetang: 3, clownfish: 2 } },
        { t: 'Whatever fits in your mouth', s: 'And some things that do not', w: { anglerfish: 3, viperfish: 3 } },
        { t: 'Jellyfish. Endless jellyfish.', s: 'Ninety percent water, no regrets', w: { mola: 3 } },
        { t: 'Shared with the shoal', s: 'Fish, insects, fruit', w: { piranha: 3, betta: 1 } }
      ]
    },
    {
      q: 'Choose a home.',
      a: [
        { t: 'A crowded, colourful reef', s: 'Loud, bright, competitive', w: { clownfish: 3, bluetang: 3, lionfish: 2 } },
        { t: 'Open blue in every direction', s: 'No walls at all', w: { bluefin: 3, sailfish: 3, mola: 2 } },
        { t: 'A trench with no sunrise', s: 'Pressure is a comfort', w: { anglerfish: 3, viperfish: 3 } },
        { t: 'Cold, quiet, ancient water', s: 'Nothing hurries here', w: { greenland: 3, icefish: 3 } }
      ]
    }
  ];

  var RESULT_TEXT = {
    clownfish: 'Fiercely loyal to one small patch of the world, and quietly capable of reinventing yourself entirely when the situation demands it.',
    bluetang: 'Bright, sociable, allergic to confrontation — and carrying one very sharp thing you would rather not have to use.',
    lionfish: 'Impossible to ignore. You move slowly, arrive with presence, and tend to reshape whatever room you are dropped into.',
    bluefin: 'Built for distance. Warmer than your surroundings, faster than you look, and profoundly bad at sitting still.',
    sailfish: 'You raise the sail. Whatever you are doing, you do it visibly, at speed, and preferably with a crowd coordinating around you.',
    mola: 'Utterly unbothered. Strange-shaped, sun-loving, enormous, and gently confusing to everyone who meets you.',
    anglerfish: 'You make your own light in the least hospitable place available, and you have never once needed permission to be odd.',
    viperfish: 'All edges and instinct. You are more sensitive than you look — you just happen to keep the fangs on the outside.',
    betta: 'Small, luminous and completely unwilling to be told what your limits are. You build things out of nothing but bubbles.',
    piranha: 'Badly misunderstood. You show up for your people, you eat more fruit than anyone expects, and the reputation amuses you.',
    icefish: 'Running on a chemistry no one else uses. Calm at temperatures that would stop most hearts, and clear all the way through.',
    greenland: 'Playing an extremely long game. You are slower than everything you catch, and somehow that has never been a problem.'
  };

  /* ------------------------------------------------------------------ FAQ */
  var FAQ = [
    { q: 'Are these fish real simulations or animations on a loop?',
      a: 'Real simulation. Each fish carries a position, heading, speed and hunger, and every frame it re-weighs four steering urges — keep clear of neighbours, match their heading, stay with the group, and go towards food — against the mouse pointer and the edges of the screen. Nothing is on a timeline, which is why the shoal never does the same thing twice.' },
    { q: 'How are the fish drawn without images?',
      a: 'Each body is a flexible spine of segments. A travelling sine wave runs down it — faster and shallower for tuna, slower and deeper for eel-shaped species — and the outline is rebuilt around that spine every frame, then filled with a gradient and given fins, patterns and an eye. Change eight numbers and you get a different species.' },
    { q: 'Where do the numbers come from?',
      a: 'Published ranges from FishBase, NOAA and peer-reviewed surveys. Where sources disagree — sailfish top speed and Greenland shark age are the usual arguments — the page says so rather than picking the most dramatic figure.' },
    { q: 'Does any of this work without a fast machine?',
      a: 'It adapts. The simulation counts its own frame times and trims the population, particle count and effects until it is comfortable, and it pauses entirely when the tab is hidden. On phones it starts smaller. If your system asks for reduced motion, the page respects that automatically — and the button in the header toggles it manually.' },
    { q: 'What happens to the email address?',
      a: 'Nothing, because there is no server. The form validates in the browser and stops there — this is a demonstration project, and the sign-up exists to show the interaction, not to collect anything.' }
  ];

  global.DATA = {
    ZONES: ZONES, SPECIES: SPECIES, ANATOMY: ANATOMY,
    SCALE: SCALE, QUIZ: QUIZ, RESULT_TEXT: RESULT_TEXT, FAQ: FAQ,
    byId: function (id) {
      for (var i = 0; i < SPECIES.length; i++) if (SPECIES[i].id === id) return SPECIES[i];
      return null;
    }
  };
})(window);
