/* =====================================================================
   BHU-MANDALA VIEW — top-down map of the great Earth circle.
   Seven concentric island-continents (dvipas) each ringed by an ocean of
   a different liquid, with golden Mount Meru and the nine varshas of
   Jambudvipa at the centre, and the wheel of the Sun (jyotir-chakra)
   circling Meru.

   Radii are drawn on a compressed (schematic) scale so all seven dvipas
   remain visible — each true dvipa is in fact twice the breadth of the one
   within it. True measurements appear in the info panel.
   ===================================================================== */

window.BhuMandalaView = (function () {
  const cam = { scale: 1, ox: 0, oy: 0, base: 1 };
  let env = { w: 0, h: 0 };
  let rings = [];     // computed concentric ring geometry (world radii)
  let jambuR = 0;     // world radius of Jambudvipa
  let maxR = 0;
  let regions = [];

  // Central varsha bands of Jambudvipa, north(top) -> south(bottom)
  const NS_BANDS = ["Kuru-varsha", "Hiranmaya-varsha", "Ramyaka-varsha", "ILAVRTA", "Hari-varsha", "Kimpurusha-varsha", "Bharata-varsha"];

  function build() {
    // Build ring list: alternating land (dvipa) and ocean, from centre out.
    // Use compressed visual thickness so doubling sizes stay viewable.
    rings = [];
    let r = 0;
    let thick = 26;                 // base visual thickness (world units)
    const grow = 1.085;             // mild growth per successive ring
    // Jambudvipa core disc
    jambuR = 70;
    r = jambuR;
    rings.push({ kind: "core", rIn: 0, rOut: r, dvipa: DVIPAS[0] });
    for (let i = 0; i < DVIPAS.length; i++) {
      const d = DVIPAS[i];
      // ocean surrounding this dvipa
      const oThick = thick; thick *= grow;
      rings.push({ kind: "ocean", rIn: r, rOut: r + oThick, dvipa: d, ocean: d.ocean });
      r += oThick;
      // next dvipa land (except after the last, which is followed by outer realms)
      if (i < DVIPAS.length - 1) {
        const lThick = thick; thick *= grow;
        const nd = DVIPAS[i + 1];
        rings.push({ kind: "land", rIn: r, rOut: r + lThick, dvipa: nd });
        r += lThick;
      }
    }
    // outer realms
    const oThick = thick * 0.8;
    rings.push({ kind: "outer", rIn: r, rOut: r + oThick, outer: OUTER_REALMS[0] }); r += oThick;
    rings.push({ kind: "lokaloka", rIn: r, rOut: r + thick * 0.5, outer: OUTER_REALMS[1] }); r += thick * 0.5;
    rings.push({ kind: "darkness", rIn: r, rOut: r + thick * 0.9, outer: OUTER_REALMS[2] }); r += thick * 0.9;
    maxR = r;
  }

  function reset(e) {
    env = e;
    if (!rings.length) build();
    cam.base = Math.min(e.w, e.h) * 0.46 / maxR;
    cam.scale = cam.base;
    cam.ox = 0; cam.oy = 0;
  }
  function clampCam() {
    cam.scale = Math.max(cam.base * 0.5, Math.min(cam.base * 8, cam.scale));
  }
  function onWheel(e) {
    const cx = env.w / 2 + cam.ox, cy = env.h / 2 + cam.oy;
    const wx = (e.offsetX - cx) / cam.scale, wy = (e.offsetY - cy) / cam.scale;
    cam.scale *= e.deltaY < 0 ? 1.12 : 0.89; clampCam();
    cam.ox = e.offsetX - env.w / 2 - wx * cam.scale;
    cam.oy = e.offsetY - env.h / 2 - wy * cam.scale;
  }
  function onDrag(dx, dy) { cam.ox += dx; cam.oy += dy; }

  function cxp() { return env.w / 2 + cam.ox; }
  function cyp() { return env.h / 2 + cam.oy; }

  function draw(ctx, e, t) {
    env = e; regions = [];
    ctx.clearRect(0, 0, e.w, e.h);
    const cx = cxp(), cy = cyp(), s = cam.scale;

    // draw from outermost inward so inner sits on top
    for (let i = rings.length - 1; i >= 0; i--) {
      const ring = rings[i];
      const rOut = ring.rOut * s, rIn = ring.rIn * s;
      let fill, info;
      if (ring.kind === "ocean") { fill = oceanFill(ctx, cx, cy, rOut, ring.ocean.color); info = oceanInfo(ring); }
      else if (ring.kind === "land") { fill = landFill(ctx, cx, cy, rOut, ring.dvipa.landColor); info = dvipaInfo(ring.dvipa); }
      else if (ring.kind === "core") { continue; } // drawn separately below
      else if (ring.kind === "outer") { fill = "rgba(214,176,90,0.5)"; info = outerInfo(ring.outer); }
      else if (ring.kind === "lokaloka") { fill = "rgba(90,80,110,0.85)"; info = outerInfo(ring.outer); }
      else if (ring.kind === "darkness") { fill = "rgba(10,9,18,0.9)"; info = outerInfo(ring.outer); }

      ctx.beginPath();
      ctx.arc(cx, cy, rOut, 0, Math.PI * 2);
      ctx.arc(cx, cy, Math.max(rIn, 0.1), 0, Math.PI * 2, true);
      ctx.fillStyle = fill; ctx.fill("evenodd");
      // subtle edge
      ctx.beginPath(); ctx.arc(cx, cy, rOut, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,0,0,0.25)"; ctx.lineWidth = 1; ctx.stroke();

      regions.push({ type: "ring", rIn, rOut, info });
    }

    // Jambudvipa core (with varshas + Meru)
    drawJambudvipa(ctx, cx, cy, t, e);

    // jyotir-chakra — the Sun's circular path around Meru
    drawSunPath(ctx, cx, cy, t, e);

    // ring labels
    if (e.showLabels) drawRingLabels(ctx, cx, cy);

    // compass
    drawCompass(ctx, e);
  }

  function oceanFill(ctx, cx, cy, rOut, color) {
    const g = ctx.createRadialGradient(cx, cy, rOut * 0.55, cx, cy, rOut);
    g.addColorStop(0, shade(color, -8));
    g.addColorStop(1, shade(color, 14));
    return g;
  }
  function landFill(ctx, cx, cy, rOut, color) {
    const g = ctx.createRadialGradient(cx, cy, rOut * 0.5, cx, cy, rOut);
    g.addColorStop(0, shade(color, 12));
    g.addColorStop(1, shade(color, -10));
    return g;
  }

  function drawJambudvipa(ctx, cx, cy, t, e) {
    const R = jambuR * cam.scale;
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();

    // horizontal varsha bands (N at top -> S at bottom)
    const n = NS_BANDS.length;
    for (let i = 0; i < n; i++) {
      const v = VARSHAS.find((x) => x.name === (NS_BANDS[i] === "ILAVRTA" ? "Ilavrta-varsha" : NS_BANDS[i]));
      const y0 = cy - R + (2 * R) * (i / n);
      const y1 = cy - R + (2 * R) * ((i + 1) / n);
      ctx.fillStyle = hexA(v.color, NS_BANDS[i] === "ILAVRTA" ? 0.0 : 0.78);
      ctx.fillRect(cx - R, y0, 2 * R, y1 - y0);
      ctx.strokeStyle = "rgba(90,60,25,0.35)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx - R, y0); ctx.lineTo(cx + R, y0); ctx.stroke();
      regions.push({ type: "discBand", cx, cy, R, y0, y1, info: varshaInfo(v) });
      if (e.showLabels && NS_BANDS[i] !== "ILAVRTA") {
        ctx.fillStyle = "rgba(40,28,12,0.8)";
        ctx.font = "600 9px Inter, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(v.name.replace("-varsha", ""), cx, (y0 + y1) / 2 + 3);
      }
    }

    // Ilavrta centre block (east = Bhadrasva right, west = Ketumala left)
    const ilav = VARSHAS.find((x) => x.name === "Ilavrta-varsha");
    const bh = R * 0.42;
    ctx.fillStyle = hexA(ilav.color, 0.85);
    ctx.fillRect(cx - bh, cy - bh, bh * 2, bh * 2);
    regions.push({ type: "rect", x: cx - bh, y: cy - bh, w: bh * 2, h: bh * 2, info: varshaInfo(ilav) });
    // east / west flanks
    const ket = VARSHAS.find((x) => x.name === "Ketumala-varsha");
    const bhad = VARSHAS.find((x) => x.name === "Bhadrasva-varsha");
    ctx.fillStyle = hexA(ket.color, 0.8); ctx.fillRect(cx - R, cy - bh, (R - bh), bh * 2);
    regions.push({ type: "rect", x: cx - R, y: cy - bh, w: R - bh, h: bh * 2, info: varshaInfo(ket) });
    ctx.fillStyle = hexA(bhad.color, 0.8); ctx.fillRect(cx + bh, cy - bh, (R - bh), bh * 2);
    regions.push({ type: "rect", x: cx + bh, y: cy - bh, w: R - bh, h: bh * 2, info: varshaInfo(bhad) });

    ctx.restore();

    // Jambudvipa outline
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,220,150,0.7)"; ctx.lineWidth = 1.5; ctx.stroke();

    // Mount Meru — radiant golden disc at the exact centre
    const mr = Math.max(7, R * 0.13);
    const gg = ctx.createRadialGradient(cx, cy, 0, cx, cy, mr * 3);
    gg.addColorStop(0, "rgba(255,225,140,0.95)");
    gg.addColorStop(1, "rgba(255,200,80,0)");
    ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(cx, cy, mr * 3, 0, Math.PI * 2); ctx.fill();
    const mg = ctx.createRadialGradient(cx - mr * 0.3, cy - mr * 0.3, 1, cx, cy, mr);
    mg.addColorStop(0, "#fff7da"); mg.addColorStop(0.6, "#ffd35c"); mg.addColorStop(1, "#c8841f");
    ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(cx, cy, mr, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(255,245,200,0.8)"; ctx.lineWidth = 1; ctx.stroke();
    regions.push({ type: "circle", cx, cy, r: mr + 4, info: meruInfo() });

    if (e.showLabels) {
      ctx.fillStyle = "#fff4d8"; ctx.font = "700 10px Inter, system-ui, sans-serif"; ctx.textAlign = "center";
      ctx.fillText("MERU", cx, cy - mr - 6);
    }
  }

  function drawSunPath(ctx, cx, cy, t, e) {
    // the Sun circles Meru just outside Jambudvipa — schematic jyotir-chakra
    const pr = (jambuR + 34) * cam.scale;
    ctx.beginPath(); ctx.arc(cx, cy, pr, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,210,120,0.18)"; ctx.lineWidth = 1.4;
    ctx.setLineDash([4, 6]); ctx.stroke(); ctx.setLineDash([]);
    const ang = t * 0.00035;
    const sxp = cx + Math.cos(ang) * pr, syp = cy + Math.sin(ang) * pr;
    const gg = ctx.createRadialGradient(sxp, syp, 0, sxp, syp, 18);
    gg.addColorStop(0, "rgba(255,200,60,0.95)"); gg.addColorStop(1, "rgba(255,170,0,0)");
    ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(sxp, syp, 18, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fff2c0"; ctx.beginPath(); ctx.arc(sxp, syp, 5, 0, Math.PI * 2); ctx.fill();
    regions.push({ type: "circle", cx: sxp, cy: syp, r: 9, info: lumiInfo(LUMINARIES[0]) });
  }

  function drawRingLabels(ctx, cx, cy) {
    ctx.textAlign = "center";
    for (const ring of rings) {
      if (ring.kind === "core") continue;
      const rMid = (ring.rIn + ring.rOut) / 2 * cam.scale;
      let label = "";
      if (ring.kind === "ocean") label = ring.ocean.liquid;
      else if (ring.kind === "land") label = ring.dvipa.name;
      else if (ring.outer) label = ring.outer.name;
      if (!label) continue;
      const y = cy - rMid;
      if (y < 16 || y > env.h - 8) continue;
      ctx.font = ring.kind === "land" ? "600 10px Inter, system-ui, sans-serif" : "italic 10px Georgia, serif";
      ctx.fillStyle = ring.kind === "ocean" ? "rgba(255,255,255,0.72)" : "rgba(30,20,8,0.85)";
      ctx.fillText(label, cx, y + 3);
    }
  }

  function drawCompass(ctx, e) {
    const x = e.w - 56, y = e.h - 56, r = 22;
    ctx.strokeStyle = "rgba(255,196,92,0.4)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "rgba(255,214,130,0.9)"; ctx.font = "700 10px Inter, system-ui, sans-serif"; ctx.textAlign = "center";
    ctx.fillText("N", x, y - r + 9); ctx.fillText("S", x, y + r - 2);
    ctx.fillStyle = "rgba(180,172,152,0.7)";
    ctx.fillText("W", x - r + 7, y + 3); ctx.fillText("E", x + r - 7, y + 3);
    ctx.fillStyle = "rgba(180,172,152,0.55)"; ctx.font = "8px Inter, system-ui, sans-serif";
    ctx.fillText("Bharata = South", x, y + r + 12);
  }

  /* ---- info builders ---- */
  function dvipaInfo(d) {
    return {
      eyebrow: "Island-continent (dvipa)",
      name: d.name, alt: null, ref: "SB 5.20",
      body: d.note,
      facts: [
        ["Breadth", fmt(d.widthYojanas) + " yojanas"],
        ["≈ in miles", milesOf(d.widthYojanas) + " mi"],
        ["Encircling ocean", d.ocean.liquid],
        ["Ruling son of Priyavrata", d.master],
      ],
      triloka: false,
    };
  }
  function oceanInfo(ring) {
    const d = ring.dvipa;
    return {
      eyebrow: "Encircling ocean",
      name: "Ocean of " + ring.ocean.liquid, alt: ring.ocean.name, ref: "SB 5.20",
      body: "The ring of " + ring.ocean.liquid.toLowerCase() + " that surrounds " + d.name + ". Its breadth equals the breadth of the island it encircles.",
      facts: [["Breadth", fmt(d.widthYojanas) + " yojanas"], ["≈ in miles", milesOf(d.widthYojanas) + " mi"], ["Surrounds", d.name]],
      triloka: false,
    };
  }
  function varshaInfo(v) {
    return {
      eyebrow: "Region of Jambudvipa (varsha)",
      name: v.name, alt: v.dir === "center" ? "the central region" : "to the " + v.dir, ref: "SB 5.16-19",
      body: v.note, facts: [["Direction from Meru", v.dir]], triloka: v.name === "Bharata-varsha",
    };
  }
  function outerInfo(o) {
    return { eyebrow: "Beyond the seven oceans", name: o.name, alt: null, ref: o.reference, body: o.description, facts: [], triloka: false };
  }
  function meruInfo() {
    return {
      eyebrow: "Axis of the universe", name: MERU.name, alt: null, ref: MERU.reference, body: MERU.note,
      facts: [
        ["Total height", fmt(MERU.heightYojanas) + " yojanas"],
        ["≈ in miles", milesOf(MERU.heightYojanas) + " mi"],
        ["Summit / base width", fmt(MERU.summitWidthYojanas) + " / " + fmt(MERU.baseWidthYojanas) + " yojanas"],
        ["Material", MERU.material],
      ], triloka: false,
    };
  }
  function lumiInfo(L) {
    return { eyebrow: "Jyotir-chakra — the Sun", name: L.name, alt: null, ref: L.reference, body: L.note,
      facts: [["Height above Bhu", fmt(L.heightYojanas) + " yojanas"]], triloka: false };
  }

  function hitTest(mx, my) {
    const cx = cxp(), cy = cyp();
    // circles first (Meru, Sun)
    for (let i = regions.length - 1; i >= 0; i--) {
      const r = regions[i];
      if (r.type === "circle") { const dx = mx - r.cx, dy = my - r.cy; if (dx * dx + dy * dy <= r.r * r.r) return r.info; }
    }
    const d = Math.hypot(mx - cx, my - cy);
    // inside Jambudvipa -> rects / discBands
    for (let i = regions.length - 1; i >= 0; i--) {
      const r = regions[i];
      if (r.type === "rect" && mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) return r.info;
      if (r.type === "discBand" && d <= r.R && my >= r.y0 && my <= r.y1) return r.info;
    }
    // rings (annuli)
    let best = null;
    for (const r of regions) {
      if (r.type === "ring" && d >= r.rIn && d <= r.rOut) { best = r.info; }
    }
    return best;
  }

  /* ---- colour helpers ---- */
  function hexA(hex, a) {
    const c = hex.replace("#", "");
    const n = c.length === 3 ? c.split("").map((x) => x + x).join("") : c;
    return `rgba(${parseInt(n.slice(0,2),16)},${parseInt(n.slice(2,4),16)},${parseInt(n.slice(4,6),16)},${a})`;
  }
  function shade(hex, amt) {
    const c = hex.replace("#", "");
    const n = c.length === 3 ? c.split("").map((x) => x + x).join("") : c;
    const clamp = (v) => Math.max(0, Math.min(255, v));
    const r = clamp(parseInt(n.slice(0,2),16) + amt), g = clamp(parseInt(n.slice(2,4),16) + amt), b = clamp(parseInt(n.slice(4,6),16) + amt);
    return `rgb(${r},${g},${b})`;
  }

  return {
    id: "bhumandala",
    title: "Bhu-mandala — The Great Earth Circle",
    subtitle: "Looking down upon the earthly plane: seven island-continents, each ringed by an ocean of a different liquid, with golden Mount Meru and the nine regions of Jambudvipa at the centre.",
    navName: "Bhu-mandala",
    navSub: "The Earth circle (top view)",
    accent: "#caa46a",
    hint: "Scroll to zoom · drag to pan · hover an island, ocean, or region · the Sun circles Meru",
    reset, draw, hitTest, onWheel, onDrag,
  };
})();
