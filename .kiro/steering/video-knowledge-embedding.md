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
