# Triloka — A Puranic Simulation of Vedic Cosmology

An interactive, visually rich web simulation of the universe **exactly as described in
the Fifth Canto of the *Srimad Bhagavatam*** (chapters 16–26) — a pure Puranic model,
not reconciled with the modern globe/heliocentric picture.

It presents the **Triloka** (the three worlds), the **fourteen planetary systems**
within the cosmic egg (*Brahmanda*), and the great Earth circle of **Bhu-mandala** with
its seven island-continents, seven oceans, golden Mount Meru, the nine *varshas* of
Jambudvipa, and the wheel of luminaries (*jyotir-chakra*).

## Two views

1. **The Fourteen Worlds** — a vertical cross-section of the cosmic egg.
   Satyaloka at the crown down to Patala at the base, the bright earthly plane at the
   centre, the Sun–Moon–planets–Dhruva rising through the heavens at their scriptural
   heights, and the three worlds **Bhu / Bhuvar / Svar** (the Triloka, dissolved at the
   close of each day of Brahma) highlighted.

2. **Bhu-mandala — the great Earth circle** — a top-down map of the earthly plane:
   seven concentric *dvipas*, each ringed by an ocean of a different liquid
   (salt water, sugarcane juice, wine, ghee, milk, churned yoghurt, sweet water),
   with Mount Meru and the nine regions of Jambudvipa at the centre, our
   **Bharata-varsha** to the south, and the Sun circling Meru.

Hover or tap any region for its description and scriptural reference. Scroll to zoom,
drag to pan.

## Scriptural basis

- Seven dvipas & oceans, each twice the breadth of the one within it — *SB 5.20*
- Mount Meru: 84,000 yojanas high, solid gold — *SB 5.16.7*
- Heights of the Sun, Moon, planets, Saptarshi and Dhruvaloka — *SB 5.22–23*
- The seven lower worlds, 70,000 yojanas below the plane — *SB 5.24*

All distances are given in **yojanas (1 yojana = 8 miles)**, matching the measure used
in the reference essays included in this repository (`Part 1.txt`, `Part 2.txt`).
Because the true distances are astronomically disproportionate, the on-screen scale is
schematic; the **real measurements always appear in the info panel**.

## Running it

No build step and no external dependencies — it is plain HTML, CSS and JavaScript.

- **Locally:** open `index.html` in any modern browser.
- **Online:** enable **GitHub Pages** (Settings → Pages → Branch: `main`, folder `/root`).
  The simulation will be served at `https://<user>.github.io/Letsgrowth/`.

## Structure

```
index.html          app shell + intro
css/styles.css      cosmic gold/saffron visual system
js/data.js          all cosmological data drawn from Srimad Bhagavatam, Canto 5
js/starfield.js     animated star backdrop
js/triloka.js       the fourteen-worlds vertical cross-section
js/bhumandala.js    the Bhu-mandala top-down map
js/app.js           engine: navigation, animation loop, interaction, info panel
```
