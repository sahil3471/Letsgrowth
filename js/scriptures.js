/* =====================================================================
   SCRIPTURE KNOWLEDGE BASE
   ---------------------------------------------------------------------
   An extensible store for the macro-cosmology and philosophy of the
   Vedic universe, distilled from a series of scripture-based video
   lectures.  Every entry carries `sources: [ids]` pointing at SOURCES,
   so new videos can be appended cohesively without breaking anything.

   TO ADD A NEW VIDEO (see .kiro/steering/video-knowledge-embedding.md):
     1. Append a new object to SOURCES (next id).
     2. Add or extend CONCEPTS / COSMIC_HIERARCHY / PURUSHA_AVATARS
        entries, tagging them with the new source id.
     3. The views read this file automatically.
   ===================================================================== */

/* ---- provenance: the lecture series ---- */
const SOURCES = [
  {
    id: 1,
    title: "Original Creation — Part 1",
    kind: "Hindi lecture (Srimad Bhagavatam, Canto 2, ch. 4-5)",
    covers:
      "The two-fold creation (spiritual vs material), the Purusha-avatars, Maha-Vishnu breathing out infinite universes, Garbhodakasayi Vishnu, the navel-lotus and the birth of Brahma, Yogamaya vs Mahamaya, and the self-effulgent spiritual abode.",
  },
];
const sourceTag = (ids) => ids.map((i) => "Video " + i).join(", ");

/* ---- the descending cosmic hierarchy (macro structure) ----
   From the supreme origin down to the single material universe that
   contains the fourteen worlds we map in the other views. */
const COSMIC_HIERARCHY = [
  {
    key: "krishna",
    name: "Sri Krishna",
    alt: "Goloka Vrindavana — the supreme abode",
    realm: "spiritual",
    ref: "SB 1.3.28; Brahma-samhita 5.1",
    sources: [1],
    summary:
      "The original Supreme Person (svayam bhagavan), source of all expansions and all causes, eternally enjoying His own abode. From Him everything emanates, yet He remains complete.",
  },
  {
    key: "mahavishnu",
    name: "Maha-Vishnu",
    alt: "Karanodakasayi Vishnu — on the Causal Ocean",
    realm: "boundary",
    ref: "Brahma-samhita 5.47-48",
    sources: [1],
    summary:
      "The first purusha-avatar. Reclining upon the Causal Ocean (Karana) in yoga-nidra, He exhales innumerable universes from the pores of His body and withdraws them when He inhales. Each universe is presided over by its own Brahma.",
  },
  {
    key: "garbhodaka",
    name: "Garbhodakasayi Vishnu",
    alt: "within each universe",
    realm: "material",
    ref: "SB 2.10; 3.8",
    sources: [1],
    summary:
      "Maha-Vishnu expands into every universe as Garbhodakasayi Vishnu, who lies on the Garbhodaka ocean at the base of the universal egg. From the lotus growing out of His navel, Lord Brahma is born.",
  },
  {
    key: "brahma",
    name: "Lord Brahma",
    alt: "on the navel-lotus — Satyaloka",
    realm: "material",
    ref: "SB 1.1.1; 2.5; 3.8",
    sources: [1],
    summary:
      "The first created being (adi-kavi), self-born upon the lotus. Not knowing his origin, he performed penance and received Vedic knowledge directly from the Lord within his heart, then engineered the secondary creation of the worlds.",
  },
  {
    key: "anda",
    name: "The Brahmanda",
    alt: "the universal egg — our universe",
    realm: "material",
    ref: "SB 3.11; 5.20",
    sources: [1],
    summary:
      "A single egg-shaped universe, wrapped in seven elemental shells. Within it stand the fourteen worlds, the Bhu-mandala plane and Mount Meru. Ours is said to be among the smaller universes, its Brahma having four heads.",
  },
];

/* ---- the three purusha-avatars (the threefold Vishnu) ---- */
const PURUSHA_AVATARS = [
  { name: "Karanodakasayi Vishnu (Maha-Vishnu)", role: "Creates the aggregate of universes; lies on the Causal Ocean.", ref: "Satvata-tantra; Bs 5.47-48", sources: [1] },
  { name: "Garbhodakasayi Vishnu", role: "Enters each universe; from His navel-lotus Brahma and the worlds arise.", ref: "SB 2.10; 3.8", sources: [1] },
  { name: "Kshirodakasayi Vishnu", role: "The Supersoul (Paramatma) within every atom and every living being.", ref: "Bs 5.35; SB 2.9", sources: [1] },
];

/* ---- key teachings / concepts, each scripturally anchored ---- */
const CONCEPTS = [
  {
    key: "ratio",
    title: "Three-quarters spiritual, one-quarter material",
    ref: "Purusha-sukta (Rig Veda 10.90.3); BG 10.42",
    sources: [1],
    body:
      "Of the Lord's total energy, three parts are the eternal spiritual sky (the unlimited Vaikuntha realm) and only one part is the temporary material manifestation. The material cosmos is the smaller fraction.",
  },
  {
    key: "prakriti",
    title: "Prakriti and the three gunas",
    ref: "BG 14; SB 3.26",
    sources: [1],
    body:
      "Material nature (prakriti) acts through three modes — sattva (goodness), rajas (passion) and tamas (ignorance). Their total reservoir is the mahat-tattva, from which the elements and the cosmos unfold.",
  },
  {
    key: "maya",
    title: "Yogamaya and Mahamaya",
    ref: "Bs 5.44; SB 2.5",
    sources: [1],
    body:
      "In the spiritual world the internal potency, Yogamaya, arranges the Lord's loving pastimes. In the material world the external potency, Mahamaya (the 'shadow' energy, personified as Durga), governs the dream of material existence.",
  },
  {
    key: "dukhalaya",
    title: "The material world as a temporary dream",
    ref: "BG 8.15 (duhkhalayam asasvatam)",
    sources: [1],
    body:
      "The material world is 'a place of misery where repeated birth and death occur.' The conditioned soul experiences it like an immersive virtual reality — vivid while engaged, yet not the soul's true, eternal situation.",
  },
  {
    key: "effulgence",
    title: "The self-effulgent abode",
    ref: "BG 15.6; Katha Up. 2.2.15; Svetasvatara Up. 6.14",
    sources: [1],
    body:
      "'There the sun does not shine, nor the moon, nor fire' — the spiritual sky (the brahma-jyoti and Vaikuntha) is self-luminous and needs no external light. Reaching it, one never returns to the material world.",
  },
  {
    key: "atom",
    title: "The Lord within every atom",
    ref: "Brahma-samhita 5.35",
    sources: [1],
    body:
      "'Govinda enters the universal egg and is present even within every atom.' Nothing can act independently of the all-pervading Supersoul.",
  },
  {
    key: "time",
    title: "The breath of Maha-Vishnu — cosmic time",
    ref: "Brahma-samhita 5.48; SB 3.11",
    sources: [1],
    body:
      "The span between one exhalation and inhalation of Maha-Vishnu equals the full lifetime of a Brahma — one hundred Brahma-years, about 311.04 trillion of our years. Universes appear and dissolve within His breathing.",
  },
  {
    key: "avatara",
    title: "Krishna appears within the day of Brahma",
    ref: "SB 1.3.28; BG 4.7-8",
    sources: [1],
    body:
      "Krishna, the original Personality of Godhead, descends once in a day of Brahma — in the Dvapara-yuga of the 28th maha-yuga of the 7th (Vaivasvata) Manu — while His expansions (Rama, Nrisimha, Varaha and others) appear as needed.",
  },
];

/* ---- macro time figures referenced above ---- */
const MACRO_TIME = {
  brahmaLifeYears: 311040000000000, // 311.04 trillion human years
  brahmaDayYears: 4320000000,       // one day (kalpa) = 4.32 billion years
  mahaYugaYears: 4320000,           // one cycle of four yugas
  ref: "SB 3.11; Bhagavad-gita 8.17",
  sources: [1],
};

/* helper for nicely formatted big numbers */
const bigNum = (n) => n.toLocaleString("en-US");
