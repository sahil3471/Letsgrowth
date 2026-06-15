/* =====================================================================
   VEDIC PURANIC COSMOLOGY — SCRIPTURAL DATA MODULE
   Source: Srimad Bhagavatam, Canto 5 (chapters 16-26); Vishnu Purana Bk II.
   Convention used throughout: 1 yojana = 8 miles  (the measure used in the
   repository source essays by Mayesvara dasa; Jambudvipa = 100,000 yojanas
   = 800,000 miles).
   Nothing here is reconciled with modern astronomy — it is a pure Puranic
   model as described by Sukadeva Goswami.
   ===================================================================== */

const YOJANA_TO_MILES = 8;
const fmt = (n) => n.toLocaleString("en-US");
const milesOf = (yoj) => fmt(yoj * YOJANA_TO_MILES);

/* ---------------------------------------------------------------------
   THE FOURTEEN LOKAS (BHUVANA-KOSHA)
   Seven upper worlds (the higher being subtler), the earthly plane,
   and seven lower worlds (tala). The first three upper worlds
   (Bhu, Bhuvar, Svar) together form the TRILOKA — the realm that is
   annihilated at the close of each day of Brahma.
   --------------------------------------------------------------------- */

const LOKAS = [
  {
    key: "satya",
    name: "Satyaloka",
    altName: "Brahmaloka",
    group: "upper",
    triloka: false,
    color: "#fff6d5",
    ruler: "Lord Brahma",
    summary:
      "The topmost planet of the universe, the abode of Brahma the creator. Those who reach it attain liberation along with Brahma at the universe's end and are never reborn in the material world.",
    reference: "SB 2.5.39, SB 5.23",
  },
  {
    key: "tapas",
    name: "Tapoloka",
    group: "upper",
    triloka: false,
    color: "#ffe9b0",
    ruler: "The Vairaja gods & great ascetics",
    summary:
      "The realm of perfected ascetics and the Vairaja demigods who practise severe penance. It is untouched by the fire that consumes the three lower worlds.",
    reference: "SB 2.5.38",
  },
  {
    key: "jana",
    name: "Janaloka",
    group: "upper",
    triloka: false,
    color: "#ffe0a0",
    ruler: "The Kumaras (Sanaka, Sanandana, Sanatana, Sanat-kumara)",
    summary:
      "The abode of Brahma's celibate mind-born sons and other elevated beings who are free from material desire.",
    reference: "SB 2.5.37",
  },
  {
    key: "mahar",
    name: "Maharloka",
    group: "upper",
    triloka: false,
    color: "#ffd28a",
    ruler: "Great sages — Bhrigu and other rishis",
    summary:
      "Home of saintly sages who live for one full day of Brahma. When the triple world below is scorched at the day's end, they travel upward to Janaloka rather than perish.",
    reference: "SB 2.5.36, SB 5.23",
  },
  {
    key: "svar",
    name: "Svarloka",
    altName: "Svah — the heavens",
    group: "upper",
    triloka: true,
    color: "#7fd4ff",
    ruler: "Indra, king of the demigods",
    summary:
      "The heavenly planets reached by pious karma — extending from the Sun up to Dhruvaloka, the polar star. The Sun, Moon, planets and stars wheel through this region. Enjoyment here lasts only until one's merit is exhausted.",
    reference: "SB 2.5.35, SB 5.22-23",
  },
  {
    key: "bhuvar",
    name: "Bhuvarloka",
    altName: "Antariksha — the intermediate sky",
    group: "upper",
    triloka: true,
    color: "#9ad7c0",
    ruler: "Siddhas, Charanas, Vidyadharas, spirits",
    summary:
      "The atmospheric region between the earthly plane and the Sun. Mystic perfected beings, ghosts and aerial spirits dwell here, moving through the sky.",
    reference: "SB 2.5.35, SB 5.24",
  },
  {
    key: "bhu",
    name: "Bhuloka",
    altName: "Bhu-mandala — the great Earth circle",
    group: "earth",
    triloka: true,
    color: "#caa46a",
    ruler: "Maharaja Priyavrata's descendants",
    summary:
      "The vast circular earthly plane — not a globe but a four-billion-mile disc of seven concentric island-continents and seven oceans, with Mount Meru at its centre. Our Bharata-varsha lies on its southern part.",
    reference: "SB 5.16, SB 5.20",
  },
  {
    key: "atala",
    name: "Atala",
    group: "lower",
    triloka: false,
    color: "#c98f6b",
    ruler: "Bala, son of the demon Maya",
    summary:
      "The first subterranean heaven. Bala generates illusory women and bewildering mystic powers here. The lower worlds are lit not by the Sun but by the jewels on the hoods of great serpents.",
    reference: "SB 5.24.7",
  },
  {
    key: "vitala",
    name: "Vitala",
    group: "lower",
    triloka: false,
    color: "#b97f5e",
    ruler: "Lord Shiva as Hataka-svami, with Bhavani",
    summary:
      "Lord Shiva dwells here surrounded by his attendants. From the gold called Hataka, produced from his union with Bhavani, the ornaments of the upper worlds are said to be made.",
    reference: "SB 5.24.8",
  },
  {
    key: "sutala",
    name: "Sutala",
    group: "lower",
    triloka: false,
    color: "#a97152",
    ruler: "Bali Maharaja",
    summary:
      "The most celebrated lower realm, the kingdom of the great devotee Bali, who was blessed by the Lord's incarnation Vamanadeva. The Lord personally guards his door.",
    reference: "SB 5.24.18",
  },
  {
    key: "talatala",
    name: "Talatala",
    group: "lower",
    triloka: false,
    color: "#996548",
    ruler: "Maya Danava, the demon architect",
    summary:
      "The domain of Maya, master of sorcery and mystic technology, worshipped by those who seek material magic. He was spared by Lord Shiva and rules this region.",
    reference: "SB 5.24.27",
  },
  {
    key: "mahatala",
    name: "Mahatala",
    group: "lower",
    triloka: false,
    color: "#8a583e",
    ruler: "The many-hooded serpents (sons of Kadru)",
    summary:
      "Abode of the great snakes — Kuhaka, Takshaka, Kaliya and others — who live in fear of Garuda, the carrier of the Lord.",
    reference: "SB 5.24.28",
  },
  {
    key: "rasatala",
    name: "Rasatala",
    group: "lower",
    triloka: false,
    color: "#7b4d35",
    ruler: "The Danavas and Daityas (demons)",
    summary:
      "Dwelling of the demoniac races — the Panis, Nivata-kavachas and others — perpetual enemies of the demigods, living in caves like serpents.",
    reference: "SB 5.24.29",
  },
  {
    key: "patala",
    name: "Patala",
    altName: "Nagaloka",
    group: "lower",
    triloka: false,
    color: "#6a4029",
    ruler: "Vasuki and the serpent kings",
    summary:
      "The lowest of the seven subterranean worlds, realm of the great serpents crowned with jewels. Far below it rests Ananta-Sesha, who upholds all the worlds upon His hoods.",
    reference: "SB 5.24.31, SB 5.25",
  },
];

/* ---------------------------------------------------------------------
   THE SEVEN DVIPAS (ISLAND-CONTINENTS) AND SEVEN OCEANS OF BHU-MANDALA
   Each successive dvipa is twice as broad as the one within it, and is
   encircled by an ocean of equal breadth made of a particular liquid.
   Widths are given in yojanas (x8 = miles).
   --------------------------------------------------------------------- */

const DVIPAS = [
  {
    name: "Jambudvipa",
    widthYojanas: 100000,
    master: "Agnidhra",
    landColor: "#d8b878",
    ocean: { name: "Lavana", liquid: "Salt water", color: "#3b6ea5" },
    note:
      "The central island, with golden Mount Meru rising from its heart. Divided into nine varshas; our Bharata-varsha is its southernmost region.",
  },
  {
    name: "Plakshadvipa",
    widthYojanas: 200000,
    master: "Idhmajihva",
    landColor: "#cf9d63",
    ocean: { name: "Ikshu", liquid: "Sugarcane juice", color: "#9bbf5a" },
    note:
      "Named for a blazing fig tree as tall as the island itself. Divided into seven regions, each with a mountain and a great river.",
  },
  {
    name: "Shalmalidvipa",
    widthYojanas: 400000,
    master: "Yajnabahu",
    landColor: "#c68c55",
    ocean: { name: "Sura", liquid: "Wine / Liquor", color: "#b06a9a" },
    note:
      "Named for a gigantic shalmali (silk-cotton) tree, the resting place of Garuda. Surrounded by an ocean of intoxicating liquor.",
  },
  {
    name: "Kushadvipa",
    widthYojanas: 800000,
    master: "Hiranyaretas",
    landColor: "#bd7d48",
    ocean: { name: "Ghrita / Sarpi", liquid: "Clarified butter (ghee)", color: "#e0c060" },
    note:
      "Named for clumps of kusha grass that glow like a second fire, lighting the quarters. Encircled by an ocean of liquid ghee.",
  },
  {
    name: "Krauñchadvipa",
    widthYojanas: 1600000,
    master: "Ghritaprstha",
    landColor: "#b46f3d",
    ocean: { name: "Kshira", liquid: "Milk", color: "#eef1f4" },
    note:
      "Named for the great Krauñcha mountain. Its inhabitants bathe in and are nourished by an encircling ocean of milk.",
  },
  {
    name: "Shakadvipa",
    widthYojanas: 3200000,
    master: "Medhatithi",
    landColor: "#a9622f",
    ocean: { name: "Dadhi / Mathita", liquid: "Churned yoghurt (buttermilk)", color: "#f4f0e2" },
    note:
      "Named for a fragrant shaka tree that perfumes the whole island. Surrounded by an ocean of churned yoghurt.",
  },
  {
    name: "Pushkaradvipa",
    widthYojanas: 6400000,
    master: "Vitihotra",
    landColor: "#9c5526",
    ocean: { name: "Svadudaka", liquid: "Sweet fresh water", color: "#5fa8c9" },
    note:
      "The outermost island, bearing a colossal golden lotus (pushkara), the seat of Brahma. Encircled by an ocean of pure, sweet water. Beyond lies the great Lokaloka mountain.",
  },
];

/* The region beyond the seven dvipas */
const OUTER_REALMS = [
  {
    name: "Kanchani-bhumi",
    description:
      "A vast land of pure gold, smooth as a mirror, lying beyond the ocean of sweet water. No living being resides there.",
    reference: "SB 5.20.35",
  },
  {
    name: "Lokaloka Mountain",
    description:
      "The colossal circular mountain — about 10,000 yojanas (80,000 miles) in both breadth and height — that walls off the lands lit by the sun from the lands of perpetual darkness. Its name means 'world and no-world'.",
    reference: "SB 5.20.34-38",
  },
  {
    name: "Region of Darkness & the Shell",
    description:
      "Beyond Lokaloka lies a region of total darkness, and finally the great shell (anda-kataha) of the universal egg, composed of the layered material elements.",
    reference: "SB 5.20.43",
  },
];

/* ---------------------------------------------------------------------
   THE NINE VARSHAS OF JAMBUDVIPA (regions divided by eight mountains)
   Mount Meru / Ilavrta sits at the centre.
   --------------------------------------------------------------------- */

const VARSHAS = [
  { name: "Ilavrta-varsha", dir: "center", color: "#ffd86b", note: "The central region surrounding golden Mount Meru. Lord Shiva (Sankarshana) is worshipped here." },
  { name: "Bhadrasva-varsha", dir: "east", color: "#8fd3a6", note: "East of Meru; the demigod Hayasirsha (Vishnu with a horse's head) is worshipped here." },
  { name: "Ketumala-varsha", dir: "west", color: "#e8a06a", note: "West of Meru, where the Lord appears as Kamadeva (Pradyumna) for the goddess of fortune." },
  { name: "Bharata-varsha", dir: "south", color: "#e9d18a", note: "The southernmost region — the land of action (karma-bhumi) where we live. The only place where one may strive for liberation." },
  { name: "Kuru-varsha", dir: "north", color: "#bcd0e8", note: "The far-northern region, where the Lord is worshipped in His tortoise (Kurma) form." },
  { name: "Hari-varsha", dir: "south", color: "#d9b06a", note: "South of Ilavrta, beyond Hari-varsha's mountains; Lord Nrisimha is worshipped by Prahlada here." },
  { name: "Kimpurusha-varsha", dir: "south", color: "#cdbf7a", note: "Realm where Hanuman and the Kimpurushas eternally worship Lord Ramachandra." },
  { name: "Ramyaka-varsha", dir: "north", color: "#a9c6d8", note: "North of Ilavrta, where Manu and others worship the Lord's fish (Matsya) incarnation." },
  { name: "Hiranmaya-varsha", dir: "north", color: "#c9c089", note: "Northern region of golden lustre, where the Lord is worshipped in His tortoise form by Aryama and the Pitas." },
];

/* The eight boundary mountains of Jambudvipa.
   Each varsha is 9,000 yojanas (72,000 miles) in length (SB 5.16.6);
   the boundary mountains are about 2,000 yojanas high and wide. */
const MERU_MOUNTAINS = {
  south: ["Nishadha", "Hemakuta", "Himalaya"],
  north: ["Nila", "Sveta", "Sringavan"],
  west: ["Malyavan"],
  east: ["Gandhamadana"],
};
const VARSHA_LENGTH_YOJANAS = 9000;        /* SB 5.16.6 */
const BOUNDARY_MTN_YOJANAS = 2000;         /* approx height & width */

/* The four cities of the directional demigods on Manasottara Mountain
   (atop Pushkaradvipa), around which the Sun travels. SB 5.21.7 */
const MANASOTTARA = {
  name: "Manasottara Mountain",
  sunOrbitYojanas: 95100000,               /* SB 5.21.13: 760,800,000 miles */
  reference: "SB 5.21",
  cities: [
    { name: "Devadhani", dir: "east", lord: "Indra, king of heaven" },
    { name: "Samyamani", dir: "south", lord: "Yamaraja, lord of death" },
    { name: "Nimlochani", dir: "west", lord: "Varuna, lord of waters" },
    { name: "Vibhavari", dir: "north", lord: "Chandra (the Moon)" },
  ],
  note:
    "A great ring-mountain atop Pushkaradvipa. The Sun's chariot circles it along a path 95,100,000 yojanas (760,800,000 miles) long, bringing day to one city while it is midnight at the opposite one.",
};

/* The whole Bhu-mandala disc, per the Puranas */
const BHUMANDALA_DIAMETER_YOJANAS = 500000000;   /* 4 billion miles */
const LOKALOKA_YOJANAS = 10000;                  /* breadth and height */

/* Mount Meru itself (Sumeru) — SB 5.16.7 */
const MERU = {
  name: "Mount Meru (Sumeru)",
  heightYojanas: 84000,
  belowEarthYojanas: 16000,
  summitWidthYojanas: 32000,
  baseWidthYojanas: 16000,
  material: "Solid gold",
  reference: "SB 5.16.7",
  note:
    "The axis of all the worlds. It rises 84,000 yojanas (672,000 miles), of which 16,000 yojanas stand below the earth. Broader at the summit than at the base, like the seed-cup of a lotus.",
};

/* ---------------------------------------------------------------------
   THE JYOTIR-CHAKRA — luminaries and their heights ABOVE the Bhu plane.
   Heights cumulative in yojanas above Bhu-mandala (SB 5.22-23).
   Sun 100,000; then each successive sphere as described by Sukadeva.
   --------------------------------------------------------------------- */

const LUMINARIES = [
  { name: "Surya (Sun)", heightYojanas: 100000, color: "#ffcf3f", glow: "#ffae00", radius: 14, reference: "SB 5.22.8", note: "Situated 100,000 yojanas above the earthly plane, at the very centre of the universe, the Sun is the king of all planets and the eye of the cosmic being." },
  { name: "Chandra (Moon)", heightYojanas: 200000, color: "#e8edf5", glow: "#bcd0ff", radius: 11, reference: "SB 5.22.8", note: "100,000 yojanas above the Sun. It moves swiftly and governs the minds and vegetation of all living beings; it is reckoned among the demigods." },
  { name: "Nakshatras (Stars)", heightYojanas: 400000, color: "#fff4c2", glow: "#ffe07a", radius: 7, reference: "SB 5.22.11", note: "200,000 yojanas above the Moon, the host of stars is fixed to the wheel of time, circling Dhruva with Mount Meru on their right." },
  { name: "Shukra (Venus)", heightYojanas: 600000, color: "#fff0d0", glow: "#ffe6a0", radius: 9, reference: "SB 5.22.12", note: "200,000 yojanas above the stars. Generally auspicious, Venus nullifies the influence of planets that cause drought and brings rain." },
  { name: "Budha (Mercury)", heightYojanas: 800000, color: "#bfe3c0", glow: "#8fd99a", radius: 8, reference: "SB 5.22.13", note: "200,000 yojanas above Venus. Born of the Moon, it is mostly auspicious, but its movement can portend cyclones and drought." },
  { name: "Mangala (Mars)", heightYojanas: 1000000, color: "#ff8a5c", glow: "#ff5a2a", radius: 9, reference: "SB 5.22.14", note: "200,000 yojanas above Mercury. Unless it moves in a curve, Mars is generally unfavourable and provokes misfortune." },
  { name: "Brihaspati (Jupiter)", heightYojanas: 1200000, color: "#ffe08a", glow: "#ffc44a", radius: 11, reference: "SB 5.22.15", note: "200,000 yojanas above Mars. The guru of the demigods; when not retrograde, it is very favourable to the brahmanas." },
  { name: "Shani (Saturn)", heightYojanas: 1400000, color: "#9aa7c0", glow: "#6f7ea0", radius: 10, reference: "SB 5.22.16", note: "200,000 yojanas above Jupiter. Slow-moving and generally inauspicious, it crosses each sign of the zodiac in about thirty months." },
  { name: "Saptarshi (Seven Sages)", heightYojanas: 2500000, color: "#cfe6ff", glow: "#9cc6ff", radius: 8, reference: "SB 5.22.17", note: "1,100,000 yojanas above Saturn, the seven great sages (Ursa Major) circle the supreme abode of Lord Vishnu, Dhruvaloka." },
  { name: "Dhruvaloka (Pole Star)", heightYojanas: 3800000, color: "#ffffff", glow: "#bfe0ff", radius: 12, reference: "SB 5.23.1", note: "1,300,000 yojanas above the seven sages stands the abode of Dhruva Maharaja — the fixed pivot around which the entire wheel of stars and planets revolves, like oxen treading a central post." },
];

/* Rendering hints so each luminary is drawn as a distinct, realistic body */
const LUMI_RENDER = {
  "Surya (Sun)": { type: "sun" },
  "Chandra (Moon)": { type: "moon", light: "#fbfcff", mid: "#c4cad8", dark: "#6c7488", craters: true, seed: 11, tile: "moonTile" },
  "Nakshatras (Stars)": { type: "cluster", count: 9 },
  "Shukra (Venus)": { type: "rocky", light: "#fff3d6", mid: "#f0d49a", dark: "#a67e44", tile: "venusTile", texAlpha: 0.3 },
  "Budha (Mercury)": { type: "rocky", light: "#dfeede", mid: "#a9c4a8", dark: "#5d7a5c", craters: true, seed: 4, tile: "mercTile" },
  "Mangala (Mars)": { type: "rocky", light: "#ff9a5e", mid: "#d4642f", dark: "#7e3216", craters: true, seed: 7, tile: "marsTile" },
  "Brihaspati (Jupiter)": { type: "gas", light: "#ffe8b0", mid: "#e8c074", dark: "#9c7330", band: "#d9a85a" },
  "Shani (Saturn)": { type: "gas", light: "#e6e0c2", mid: "#bcae84", dark: "#73684a", band: "#c9bd8e", rings: true, ringColor: "#cdbd92" },
  "Saptarshi (Seven Sages)": { type: "cluster", count: 7 },
  "Dhruvaloka (Pole Star)": { type: "star" },
};
LUMINARIES.forEach((l) => { l.render = LUMI_RENDER[l.name] || { type: "rocky" }; });

/* The seven lower worlds begin 70,000 yojanas below the earthly plane,
   each occupying 10,000 yojanas (SB 5.24.7). */
const LOWER_START_YOJANAS = 70000;
const LOWER_BAND_YOJANAS = 10000;

/* Scriptural epigraphs used in the UI */
const EPIGRAPHS = [
  {
    text:
      "The breadth of Jambudvipa is 100,000 yojanas, and the breadth of the saltwater ocean is the same.",
    cite: "Srimad Bhagavatam 5.20.2",
  },
  {
    text:
      "Mount Meru... is made of solid gold. Its height is 84,000 yojanas, of which 16,000 yojanas are below the earth.",
    cite: "Srimad Bhagavatam 5.16.7",
  },
  {
    text:
      "You understand or do not understand, you have to accept it... An idea is given of the planetary situation.",
    cite: "Srila Prabhupada, Morning Walk, June 10, 1975",
  },
];
