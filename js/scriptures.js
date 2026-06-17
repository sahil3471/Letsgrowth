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
  {
    id: 2,
    title: "Original Creation — Part 2",
    kind: "Hindi lecture (Srimad Bhagavatam, Canto 2, ch. 4-5)",
    covers:
      "Narada's inquiry to Brahma; Brahma's confession that he is not independent (the spider and sun analogies); the chain of emanation from Vasudeva through the brahma-jyoti and mahat-tattva to the elements; the Narayana-para principle (everything exists for Narayana); the meaning of nirguna; the three modes producing matter, knowledge and activity; and the universal accessibility of devotion.",
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
    sources: [1, 2],
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
  {
    key: "emanation",
    title: "The chain of emanation",
    ref: "SB 2.5.14, 2.5.22-24",
    sources: [2],
    body:
      "Everything emanates from Vasudeva: from Him comes the brahma-jyoti (His self-effulgence), from which arises the mahat-tattva (the total material energy), and from that come the living entities, the elements, action (karma), time (kala) and nature (svabhava). 'Matter, activity, time, nature and the living entities exist only because of Vasudeva.'",
  },
  {
    key: "narayana-para",
    title: "Everything is meant for Narayana",
    ref: "SB 2.5.15-16",
    sources: [2],
    body:
      "The Vedas, the demigods, the planets, sacrifices, yoga, austerity and knowledge are all 'narayana-para' — they exist for and lead to Narayana. The single purpose of the whole creation is to bring the wandering soul back to the Lord; knowledge or austerity that does not lead to Him is incomplete.",
  },
  {
    key: "brahma-dependent",
    title: "Brahma is empowered, not independent",
    ref: "SB 2.5.6, 2.5.17-18",
    sources: [2],
    body:
      "Narada asked whether Brahma creates by his own power, like a spider spinning a web from itself, or like the self-luminous sun. Brahma replied that he is not the Supreme and not equal to Vishnu — he only engineers, under the Lord's direction, what Narayana has already empowered and arranged. The Lord creates effortlessly, by His energy alone, as fire cooks without leaving its place.",
  },
  {
    key: "nirguna",
    title: "Nirguna does not mean formless",
    ref: "SB 2.5.18-19; BG 14.27",
    sources: [2],
    body:
      "The Lord is called nirguna — 'without qualities' — because He is never entangled or conditioned by the three material modes, not because He has no form. His form is sach-chid-ananda (eternity, knowledge, bliss); the impersonal brahma-jyoti is only His radiance, and He is its source.",
  },
  {
    key: "modes-triad",
    title: "The three modes weave matter, knowledge and activity",
    ref: "SB 2.5.18, 2.5.32",
    sources: [2],
    body:
      "Within the interplay of sattva, rajas and tamas the conditioned soul experiences three things — substance (dravya / matter), knowledge (jnana) and activity (kriya). Absorbed in these, the soul keeps tallying its gains and losses, virtue and vice, while the way out is devotion that transcends both.",
  },
  {
    key: "bhakti-universal",
    title: "Devotion purifies everyone",
    ref: "SB 2.4.18",
    sources: [2],
    body:
      "'Kiratas, Hunas, Andhras, Pulindas, Pulkasas, Abhiras, Shumbhas, Yavanas, Khasas and even others addicted to sin can be purified by taking shelter of the Lord's devotees, for He is the supreme power.' Bhakti is open to all — any age, land or birth — by simply reconnecting with the Lord; even chanting His holy name is directly transcendental.",
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

/* ---- the chain of emanation (tattva sequence) from Video 2, SB 2.5 ----
   How the material ingredients unfold from the Supreme Person. */
const TATTVA_EMANATION = [
  { name: "Vasudeva", sanskrit: "Sri Krishna", note: "The Supreme Person — the origin of all energies and ingredients.", ref: "SB 2.5.14", sources: [2] },
  { name: "Brahma-jyoti", sanskrit: "sva-rocisha", note: "The Lord's own self-effulgence. Many yogis reach only this impersonal radiance and stop, never reaching the Person who is its source.", ref: "Bs 5.40; BG 14.27", sources: [2] },
  { name: "Mahat-tattva", sanskrit: "the total material energy", note: "The reservoir of matter, set in motion by the Lord's glance through His shadow energy (Maya / Durga), who herself feels shame before Him.", ref: "SB 2.5.22; Bs 5.44", sources: [2] },
  { name: "Jiva", sanskrit: "the living entities", note: "Eternal sparks of the Lord, never themselves the controller, who act within the elements and time.", ref: "SB 2.5.14", sources: [2] },
  { name: "Pancha-mahabhuta", sanskrit: "the five gross elements", note: "Earth, water, fire, air and ether — the substance (dravya) the soul experiences.", ref: "SB 2.5.25-26", sources: [2] },
  { name: "Karma", sanskrit: "action / interaction", note: "The activity (kriya) of the living entity among the elements.", ref: "SB 2.5.14", sources: [2] },
  { name: "Kala", sanskrit: "time", note: "The Lord's impersonal feature that drives creation, maintenance and dissolution; birth and death occur within it.", ref: "SB 2.5.14", sources: [2] },
];

/* helper for nicely formatted big numbers */
const bigNum = (n) => n.toLocaleString("en-US");
