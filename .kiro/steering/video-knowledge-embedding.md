# Embedding the Vedic-universe video series into the simulation

This project incrementally absorbs a series of scripture-based video lectures
(20–30 planned) on Vedic cosmology, embedding their content into the simulation
**cohesively** — each new video extends the model without contradicting earlier
ones.

## Where knowledge lives

- **`js/scriptures.js`** — the macro-cosmology / philosophy knowledge base
  (creation, the Purusha-avatars, the cosmic hierarchy, key teachings).
- **`js/data.js`** — the structural/measurement data (Bhu-mandala, the 14 lokas,
  dvipas, oceans, Meru, luminaries) from Srimad Bhagavatam Canto 5.
- Views render this data: `js/creation.js` (macro / Brahmanda),
  `js/triloka.js` (the 14 worlds), `js/bhumandala.js` (the Earth circle).

## How to add a NEW video (the cohesive workflow)

1. **Append a source** to `SOURCES` in `js/scriptures.js` with the next `id`,
   its title, the scripture it draws on, and what it covers.
2. **Add or extend entries**, each tagged with `sources: [id]`:
   - new metaphysical points → `CONCEPTS`
   - new layers of the descending cosmology → `COSMIC_HIERARCHY`
   - new structural facts/measurements → the relevant arrays in `js/data.js`
   - if a later video *refines* an earlier value, update the value and add the
     new source id to its `sources` list (don't delete the provenance).
3. **Surface it visually** only when it adds clarity — extend an existing view
   or add a focused new one. Reuse `js/gfx.js` (noise, lighting, glow, bodies)
   so the cinematic style stays consistent.
4. Keep every claim **scripturally attributable** — include a `ref` (verse) and
   a `Source` (video) on each info entry. Verify verse numbers before embedding.

## Conventions

- 1 yojana = 8 miles (consistent throughout).
- On-screen scale is schematic; true measurements always appear in the info panel.
- Depict the forms of the Lord reverently as radiant presences, not as figures.
- No external dependencies; everything must run by opening `index.html`.
- After changes, run the headless render check before committing.

## Source log

- **Video 1 — “Original Creation, Part 1.”** Two-fold creation (3/4 spiritual,
  1/4 material), the three Purusha-avatars, Maha-Vishnu breathing out the
  universes (Bs 5.48), Garbhodakasayi Vishnu, the navel-lotus and Brahma,
  Yogamaya vs Mahamaya, the self-effulgent abode (BG 15.6). Based on
  Srimad Bhagavatam, Canto 2 (chapters 4–5).
- **Video 2 — “Original Creation, Part 2.”** Narada's inquiry to Brahma;
  Brahma is empowered, not independent (the spider and sun analogies); the
  chain of emanation Vasudeva → brahma-jyoti → mahat-tattva → jiva, elements,
  karma, kala (SB 2.5.14, 2.5.22-26); the Narayana-para principle that
  everything exists for Narayana (SB 2.5.15-16); nirguna = beyond the modes,
  not formless (BG 14.27); the three modes producing matter, knowledge and
  activity; and the universal accessibility of devotion (SB 2.4.18).
  Added to `CONCEPTS`, `TATTVA_EMANATION`, and the Creation view's legend.
- **Video 3 — “Original Creation, Part 3.”** The detailed Sankhya emanation
  (SB 3.26): mahat-tattva → time + false ego (ahankara), which divides by the
  three modes — sattva (mind + ten presiding demigods), rajas (intelligence,
  life-air, ten senses), tamas (five subtle → five gross elements, each
  carrying one more sense-quality). Also the three Purusha-avatars on the
  three oceans (Karana / Garbhodaka / Kshira), the three guna-avataras
  (Brahma/Vishnu/Shiva), and each soul receiving a body per its desire and
  karma. Added `AHANKARA_DIVISION`, `SENSE_DEITIES`, `ELEMENTS`,
  `GUNA_AVATARAS` and the new **Elements view** (`js/elements.js`) — an
  interactive Sankhya emanation tree.
- **Video 4 — “Original Creation, Part 4.”** The Virata-rupa: the single
  universe as the Lord's body (Satyaloka the head … Patala the soles, SB 2.1),
  distinct from the Vishva-rupa of BG 11; the four varnas from that body; the
  three vyahritis of the Gayatri; the Shishumara wheel of stars on Dhruva
  (SB 5.23); and Vaikuntha realms within the egg. Added per-loka `viratPart`
  and the upper-loka `distance` figures (Mahar/Jana/Tapa/Satya = +10/20/80/120
  million yojanas), `VARNA_BODY`, five new CONCEPTS, and surfaced it in the
  Fourteen-Worlds view (right-side Virata axis, Shishumara wheel, body-part &
  distance facts, varna legend).

- **Video 5 — “Original Creation, Part 5.”** Brahma's penance and the
  instruction 'tapa' (SB 2.9.6); the origin of the Gayatri given by Sarasvati
  (Bs 5.24-25); the Lord's three energies (internal / marginal / external);
  the genesis of Shiva (Shambhu) and Maya as the linga and yoni whose union
  yields the mahat-tattva (Bs 5.24-25); the holy name being non-different from
  the Lord; and Narayana resting aloof in yoga-nidra on the Causal waters.
  Added six CONCEPTS and `THREE_SHAKTIS`; refined the Mahat-tattva node; and
  surfaced the three energies in the Creation view's legend.
