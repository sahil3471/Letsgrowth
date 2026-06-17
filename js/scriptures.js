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
  {
    id: 3,
    title: "Original Creation — Part 3",
    kind: "Hindi lecture (Srimad Bhagavatam; Sankhya of SB 3.26)",
    covers:
      "The detailed Sankhya emanation: mahat-tattva to time and false ego (ahankara); the three modes dividing ego into mind and the presiding demigods (sattva), intelligence, life-air and the ten senses (rajas), and the five subtle and gross elements (tamas); how each element carries one more sense-quality than the last; the three Purusha-avatars on the three oceans; the three guna-avataras; and how each soul receives a body according to its own desire and karma.",
  },
  {
    id: 4,
    title: "Original Creation — Part 4",
    kind: "Hindi lecture (Srimad Bhagavatam, Canto 2.1)",
    covers:
      "The Virata-rupa — the single universe meditated upon as the gigantic body of the Lord (Satyaloka the head, the heavens His chest, outer space His navel, the lower worlds His legs down to the soles); how it differs from the Vishva-rupa of Bhagavad-gita 11; the four social orders arising from that body; the three vyahritis of the Gayatri (Bhur, Bhuvah, Svah); the Shishumara wheel of stars revolving on Dhruva; and the Vaikuntha realms (Dhruvaloka, Shvetadvipa) within the universe.",
  },
  {
    id: 5,
    title: "Original Creation — Part 5",
    kind: "Hindi lecture (Srimad Bhagavatam 2.9; Brahma-samhita 5)",
    covers:
      "Brahma's birth in darkness and the instruction 'tapa' (austerity); his thousand-year penance and the origin of the Gayatri given by Sarasvati; the Lord's three energies (internal, marginal, external); the genesis of Shiva (Shambhu) and Maya as the linga and yoni whose union yields the mahat-tattva; the holy name being non-different from the Lord; and Maha-Vishnu (Narayana) resting aloof in yoga-nidra on the Causal waters.",
  },
  {
    id: 6,
    title: "Original Creation — Part 6",
    kind: "Hindi lecture (Srimad Bhagavatam 2.9-2.10)",
    covers:
      "The Lord's words to Brahma — 'I alone existed before, during and after' — and the world as His reflection; the ten subjects through which the Bhagavatam explains everything (sarga, visarga, sthana, poshana, uti, manvantara, ishanukatha, nirodha, mukti, ashraya); how the Virat-purusha's senses manifest, each governed by a presiding deity; the threefold view (self, element, deity); and the Lord as the ultimate shelter (ashraya) of the five sheaths.",
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
    sources: [1, 5],
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
  { name: "Karanodakasayi Vishnu (Maha-Vishnu)", ocean: "Karana — the Causal Ocean", role: "Creates the aggregate of universes; reclining on the Causal Ocean, He exhales them all.", ref: "Satvata-tantra; Bs 5.47-48", sources: [1, 3] },
  { name: "Garbhodakasayi Vishnu (Hiranyagarbha)", ocean: "Garbhodaka — within each universe", role: "Enters each universe and, by His glance, awakens the dormant elements; from His navel-lotus Brahma is born.", ref: "SB 2.10; 3.8", sources: [1, 3] },
  { name: "Kshirodakasayi Vishnu", ocean: "Kshira — the Ocean of Milk", role: "The Supersoul (Paramatma) within every atom and being; the demigods petition Him here.", ref: "Bs 5.35; SB 2.9", sources: [1, 3] },
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
  {
    key: "ahankara",
    title: "False ego divides by the three modes",
    ref: "SB 3.26.23-25",
    sources: [3],
    body:
      "From the mahat-tattva first comes time (kala), then false ego (ahankara). Ahankara then splits according to the three modes: in goodness it yields the mind and the controlling demigods; in passion, the intelligence, the life-air and the ten senses; in ignorance, the five subtle and gross elements.",
  },
  {
    key: "elements-evolution",
    title: "Each element carries one more quality",
    ref: "SB 3.26.32-44; BG 7.4",
    sources: [3],
    body:
      "From ignorance evolve the five elements in sequence, each inheriting the qualities before it: ether (sound), air (sound, touch), fire (sound, touch, form), water (those plus taste), and earth (all five, plus smell). Earth therefore bears every quality. The eightfold separated energy is earth, water, fire, air, ether, mind, intelligence and ego.",
  },
  {
    key: "three-oceans",
    title: "Three Purusha-avatars on three oceans",
    ref: "SB 2.10; 3.8; Bs 5.47-48",
    sources: [3],
    body:
      "Matter is inert until the Lord enters it. Maha-Vishnu reclines on the Causal Ocean and exhales the universes; as Garbhodakasayi Vishnu He enters each one (on the Garbhodaka ocean) and His glance awakens the dormant elements; as Kshirodakasayi Vishnu (on the Ocean of Milk) He is the Supersoul within all. The mahat-tattva is the mother, the Purusha the father, and the souls His children.",
  },
  {
    key: "guna-avataras",
    title: "Brahma, Vishnu and Shiva — the three modes",
    ref: "SB 2.5; 10.88",
    sources: [3],
    body:
      "The one Lord superintends the three modes through three forms: Brahma is empowered with passion (rajas) for creation, Vishnu presides over goodness (sattva) for maintenance, and Shiva acts in ignorance (tamas) for dissolution.",
  },
  {
    key: "soul-allotment",
    title: "Each soul receives a body by its own desire and karma",
    ref: "SB 3.26; BG 15.8",
    sources: [3],
    body:
      "When the universe unfolds, every soul is given a body, senses and mind matching the desires and karma it carried at the previous dissolution — which is why no two beings are alike. Brahma is only the manager; the soul itself is the root cause of its own situation.",
  },
  {
    key: "virat-rupa",
    title: "The Virata-rupa — the universe as the Lord's body",
    ref: "SB 2.1.24-39",
    sources: [4],
    body:
      "The entire single universe, within its sevenfold shell, can be meditated upon as the gigantic body of the Lord — the Virata (Vairaja) Purusha: Satyaloka is His head, the heavens His chest, outer space His navel, and the lower worlds His legs down to Patala, the soles of His feet. This differs from the Vishva-rupa Arjuna saw (BG 11), which revealed all forms at once.",
  },
  {
    key: "virat-varna",
    title: "The four orders from the cosmic body",
    ref: "SB 2.1.37; Rig Veda 10.90.12",
    sources: [4],
    body:
      "From the Virata-purusha's body arise the four social orders: the brahmanas from His mouth, the kshatriyas from His arms, the vaishyas from His thighs and waist, and the shudras from His legs and feet — each indispensable, like the limbs of one body.",
  },
  {
    key: "vyahriti",
    title: "Bhur, Bhuvah, Svah — the three vyahritis",
    ref: "Gayatri mantra; SB 2.5",
    sources: [4],
    body:
      "The three worlds of the Triloka are the three vyahritis invoked at the start of the Gayatri: Bhur (the earthly plane), Bhuvah (the intermediate sky) and Svah (the heavens) — followed by meditation on Savita, the source of creation.",
  },
  {
    key: "shishumara",
    title: "The Shishumara — the wheel of stars on Dhruva",
    ref: "SB 5.23",
    sources: [4],
    body:
      "All the planets and stars are fixed on a vast wheel that revolves around Dhruvaloka, the pivot — like a whirling firebrand that appears as a ring of light. To the great sages it appears as the Shishumara, a coiled dolphin-form, and the Lord resides within it as its heart.",
  },
  {
    key: "vaikunthas-within",
    title: "Vaikuntha within the universe",
    ref: "SB 5.17; 8.5",
    sources: [4],
    body:
      "Even within the material egg there are transcendental abodes — Dhruvaloka and Shvetadvipa, on the shore of the Ocean of Milk, where Kshirodakasayi Vishnu rests. When the demigods are in distress they come to its shore to petition the Lord.",
  },
  {
    key: "brahma-tapas",
    title: "Brahma's penance — the instruction 'tapa'",
    ref: "SB 2.9.6",
    sources: [5],
    body:
      "Born on the lotus into darkness and unsure of his task, Brahma heard two syllables — 'ta' and 'pa' (tapa, austerity) — spoken by the Lord. Austerity is the foundation of all creation; nothing is made or sustained without it. Brahma then meditated for a thousand celestial years before creating. In this age that austerity means following four principles — no meat-eating, intoxication, gambling or illicit sex — and chanting the holy names.",
  },
  {
    key: "gayatri-origin",
    title: "The origin of the Gayatri",
    ref: "Brahma-samhita 5.24-25; SB 2.9",
    sources: [5],
    body:
      "Seeing Brahma bewildered in the dark, the goddess of learning, Sarasvati, gave him a seed-mantra glorifying Krishna — Govinda, beloved of the gopis — and told him to perform austerity with it. From this the Gayatri is said to arise: the sound through which Brahma received the power and knowledge to create.",
  },
  {
    key: "three-shaktis",
    title: "The Lord's three energies",
    ref: "Vishnu Purana 6.7.61; CC Madhya 6.154",
    sources: [5],
    body:
      "The Supreme acts through three potencies: the internal (antaranga) spiritual energy — His own pleasure potency (Radha, Sita, Lakshmi); the marginal (tatastha) energy — the countless living beings, who may turn either way; and the external (bahiranga) energy — maya, the illusory power governing the material world.",
  },
  {
    key: "shambhu-maya",
    title: "Shiva and Maya — the linga and the yoni",
    ref: "Brahma-samhita 5.24-25",
    sources: [5],
    body:
      "Desiring to create, the Lord glances upon His internal potency Rama; from this Lord Shambhu (Shiva) appears as the masculine principle (linga) and Maya as the feminine (yoni). Their union yields the mahat-tattva, the substance of the material world. The Shiva-linga is thus the emblem of purusha and prakriti — consciousness merging with matter — not a crude image. Shiva later acts as Rudra in dissolution, yet only Vishnu grants liberation.",
  },
  {
    key: "nama-nami",
    title: "The holy name is the Lord Himself",
    ref: "Padma Purana; CC Madhya 17.133",
    sources: [5],
    body:
      "The sound of the Lord's name is non-different from the Lord (abhinnatvan nama-naminoh). The chanting itself purifies the heart: one need not strain the mind or reason, but simply sound the names and hear them, letting the vibration act like medicine entering within.",
  },
  {
    key: "vishnu-aloof",
    title: "Narayana, aloof in yoga-nidra",
    ref: "Brahma-samhita 5.47-48; SB 2.9",
    sources: [5],
    body:
      "He who lies upon the Causal waters (nara) is called Narayana. Maha-Vishnu rests there in yoga-nidra, casting only His glance upon the material energy and remaining aloof — as a king builds a prison yet has no wish to live in it. The material world exists for the souls who wish to enjoy apart from Him, and as the path back for those who would return.",
  },
  {
    key: "before-creation",
    title: "'I alone existed' — the world as His reflection",
    ref: "SB 2.9.32-35",
    sources: [6],
    body:
      "The Lord told Brahma: before the creation I alone existed; what you see now is also Myself; and what remains after annihilation is Myself again. Whatever appears valuable apart from Me is My illusory reflection (maya) — like an image in a mirror; valued in relation to Me it is spiritual, divorced from Me it is mere matter.",
  },
  {
    key: "dasha-lakshana",
    title: "The ten subjects of the Bhagavatam",
    ref: "SB 2.10.1",
    sources: [6],
    body:
      "The Bhagavatam explains everything through ten subjects: sarga (primary creation), visarga (secondary creation), sthana (maintenance), poshana (protection), uti (the urges to act), manvantara (the reigns of the Manus), ishanukatha (narrations of the Lord), nirodha (winding up), mukti (liberation), and ashraya (the ultimate shelter) — the last being the Supreme Person, the support of all the rest.",
  },
  {
    key: "virat-senses",
    title: "The senses of the cosmic being and their deities",
    ref: "SB 2.10.16-30; 2.6",
    sources: [6],
    body:
      "Each desire of the Virat-purusha manifests a sense organ, governed by a presiding demigod: speech by Fire, breath by Vayu, sight by the Sun, hearing by the directions, touch by the plants, hands by Indra, movement by Vishnu, the heart by the Moon, and so on. Thus every faculty is seen three ways — as the soul's sense (adhyatmika), the physical organ (adhibhautika), and its controlling deity (adhidaivika).",
  },
  {
    key: "panchakosha-ashraya",
    title: "The five sheaths and the ultimate shelter",
    ref: "Taittiriya Upanishad 2; SB 2.10",
    sources: [6],
    body:
      "The self is wrapped in five sheaths — food (annamaya), life-air (pranamaya), mind (manomaya), intelligence (vijnanamaya) and bliss (anandamaya). Going inward through them, the final shelter (ashraya) of all beings, elements and senses is the blissful Supreme Person Himself.",
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
  { name: "Mahat-tattva", sanskrit: "the total material energy", note: "The reservoir of matter, produced from the union of Shambhu (the linga) and Maya (the yoni) when the Lord casts His glance — the principle from which time, ego and all the elements unfold.", ref: "SB 2.5.22; Bs 5.24-25", sources: [2, 5] },
  { name: "Jiva", sanskrit: "the living entities", note: "Eternal sparks of the Lord, never themselves the controller, who act within the elements and time.", ref: "SB 2.5.14", sources: [2] },
  { name: "Pancha-mahabhuta", sanskrit: "the five gross elements", note: "Earth, water, fire, air and ether — the substance (dravya) the soul experiences.", ref: "SB 2.5.25-26", sources: [2] },
  { name: "Karma", sanskrit: "action / interaction", note: "The activity (kriya) of the living entity among the elements.", ref: "SB 2.5.14", sources: [2] },
  { name: "Kala", sanskrit: "time", note: "The Lord's impersonal feature that drives creation, maintenance and dissolution; birth and death occur within it.", ref: "SB 2.5.14", sources: [2] },
];

/* ---- Video 3: the Sankhya breakdown of the elements (SB 3.26) ---- */

/* False ego (ahankara) divides under the three modes, each producing a set
   of tattvas. */
const AHANKARA_DIVISION = [
  {
    mode: "Sattva", alt: "Vaikarika — goodness", color: "#ffd86b",
    produces: "The mind (manas) and the ten presiding demigods of the senses and directions.",
    items: ["Mind (manas)", "Ten controlling demigods"],
    ref: "SB 3.26.23-25", sources: [3],
  },
  {
    mode: "Rajas", alt: "Taijasa — passion", color: "#ff9d5c",
    produces: "The intelligence, the life-air, and the ten senses (five for knowledge, five for action).",
    items: ["Intelligence (buddhi)", "Life-air (prana)", "Five knowledge-senses", "Five working-senses"],
    ref: "SB 3.26.27-31", sources: [3],
  },
  {
    mode: "Tamas", alt: "Tamasa — ignorance", color: "#8a7bb0",
    produces: "The five subtle elements (tanmatras) and, from them, the five gross elements.",
    items: ["Five subtle elements (tanmatras)", "Five gross elements"],
    ref: "SB 3.26.32-34", sources: [3],
  },
];

/* The ten demigods presiding over the senses (from sattvika ahankara). */
const SENSE_DEITIES = ["Dik (directions)", "Vata (air)", "Surya (sun)", "Varuna (waters)", "Asvini-kumaras", "Agni (fire)", "Indra", "Upendra", "Mitra", "Ka / Brahma"];

/* The five gross elements, each inheriting one more sense-quality. */
const ELEMENTS = [
  { name: "Ether", sanskrit: "Akasha", tanmatra: "Sound", sense: "Hearing — ear", qualities: ["sound"], color: "#b9c2ff", ref: "SB 3.26.34", sources: [3] },
  { name: "Air", sanskrit: "Vayu", tanmatra: "Touch", sense: "Touch — skin", qualities: ["sound", "touch"], color: "#9ad7c0", ref: "SB 3.26.36", sources: [3] },
  { name: "Fire", sanskrit: "Tejas", tanmatra: "Form", sense: "Sight — eyes", qualities: ["sound", "touch", "form"], color: "#ff9d5c", ref: "SB 3.26.38", sources: [3] },
  { name: "Water", sanskrit: "Ap", tanmatra: "Taste", sense: "Taste — tongue", qualities: ["sound", "touch", "form", "taste"], color: "#5fa8c9", ref: "SB 3.26.40", sources: [3] },
  { name: "Earth", sanskrit: "Prithvi", tanmatra: "Smell", sense: "Smell — nose", qualities: ["sound", "touch", "form", "taste", "smell"], color: "#caa46a", ref: "SB 3.26.42", sources: [3] },
];

/* The three guna-avataras who superintend the modes. */
const GUNA_AVATARAS = [
  { lord: "Brahma", mode: "Rajas — passion", role: "Creation", ref: "SB 2.5", sources: [3] },
  { lord: "Vishnu", mode: "Sattva — goodness", role: "Maintenance", ref: "SB 2.5", sources: [3] },
  { lord: "Shiva", mode: "Tamas — ignorance", role: "Dissolution", ref: "SB 2.5", sources: [3] },
];

/* The four social orders mapped onto the cosmic body (Video 4, SB 2.1.37). */
const VARNA_BODY = [
  { part: "Mouth", order: "Brahmanas", role: "teachers & priests" },
  { part: "Arms", order: "Kshatriyas", role: "rulers & protectors" },
  { part: "Thighs & waist", order: "Vaishyas", role: "farmers & merchants" },
  { part: "Legs & feet", order: "Shudras", role: "artisans & laborers" },
];

/* The Lord's three energies (Video 5). */
const THREE_SHAKTIS = [
  { name: "Antaranga", alt: "internal — spiritual", color: "#ffd980", note: "The Lord's own pleasure potency (Radha, Sita, Lakshmi)." },
  { name: "Tatastha", alt: "marginal — the souls", color: "#9ad7c0", note: "The countless living beings, who may turn toward spirit or matter." },
  { name: "Bahiranga", alt: "external — maya", color: "#9a8bc0", note: "The illusory energy that governs the material world." },
];

/* The ten subjects of the Bhagavatam (Video 6, SB 2.10.1). */
const BHAGAVATA_TOPICS = [
  { name: "Sarga", en: "primary creation" },
  { name: "Visarga", en: "secondary creation" },
  { name: "Sthana", en: "maintenance" },
  { name: "Poshana", en: "protection" },
  { name: "Uti", en: "the urge to act" },
  { name: "Manvantara", en: "reigns of the Manus" },
  { name: "Ishanukatha", en: "narrations of the Lord" },
  { name: "Nirodha", en: "winding up" },
  { name: "Mukti", en: "liberation" },
  { name: "Ashraya", en: "the ultimate shelter" },
];

/* The Virat-purusha's senses, organs and presiding deities (Video 6, SB 2.10). */
const VIRAT_SENSES = [
  { desire: "To speak", organ: "Mouth", deity: "Agni (fire)" },
  { desire: "To breathe", organ: "Nostrils", deity: "Vayu (wind)" },
  { desire: "To see", organ: "Eyes", deity: "Surya (sun)" },
  { desire: "To hear", organ: "Ears", deity: "Dik (the directions)" },
  { desire: "To feel", organ: "Skin", deity: "Vanaspati (plants)" },
  { desire: "To work", organ: "Hands", deity: "Indra" },
  { desire: "To move", organ: "Legs", deity: "Vishnu" },
  { desire: "To think", organ: "Heart", deity: "Chandra (moon)" },
  { desire: "To procreate", organ: "Genitals", deity: "Prajapati" },
  { desire: "To eat", organ: "Belly", deity: "Rivers & seas" },
];

/* helper for nicely formatted big numbers */
const bigNum = (n) => n.toLocaleString("en-US");
