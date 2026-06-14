/* =====================================================================
   BHU-MANDALA VIEW — top-down map of the great Earth circle, rendered
   with textured terrain, liquid oceans, directional dome-lighting and a
   metallic golden Mount Meru.  Seven dvipas, seven oceans, the nine
   varshas of Jambudvipa, the Manasottara ring, and the Sun on its
   95,100,000-yojana orbit.

   Radii use a compressed (schematic) scale so all seven dvipas remain
   visible — each true dvipa is twice the breadth of the one within it.
   True measurements appear in the info panel.
   ===================================================================== */

window.BhuMandalaView = (function () {
  const G = window.GFX;
  const cam = { scale: 1, ox: 0, oy: 0, base: 1 };
  let env = { w: 0, h: 0 };
  let rings = [], jambuR = 0, maxR = 0, pushkaraRing = null;
  let regions = [];

  const NS_BANDS = ["Kuru-varsha", "Hiranmaya-varsha", "Ramyaka-varsha", "ILAVRTA", "Hari-varsha", "Kimpurusha-varsha", "Bharata-varsha"];

  function build() {
    rings = [];
    let r = 0, thick = 26; const grow = 1.085;
    jambuR = 74; r = jambuR;
    rings.push({ kind: "core", rIn: 0, rOut: r, dvipa: DVIPAS[0] });
    for (let i = 0; i < DVIPAS.length; i++) {
      const d = DVIPAS[i];
      const oThick = thick; thick *= grow;
      rings.push({ kind: "ocean", rIn: r, rOut: r + oThick, dvipa: d, ocean: d.ocean }); r += oThick;
      if (i < DVIPAS.length - 1) {
        const lThick = thick; thick *= grow;
        const land = { kind: "land", rIn: r, rOut: r + lThick, dvipa: DVIPAS[i + 1] };
        rings.push(land); r += lThick;
        if (DVIPAS[i + 1].name === "Pushkaradvipa") pushkaraRing = land;
      }
    }
    const oThick = thick * 0.8;
    rings.push({ kind: "outer", rIn: r, rOut: r + oThick, outer: OUTER_REALMS[0] }); r += oThick;
    rings.push({ kind: "lokaloka", rIn: r, rOut: r + thick * 0.55, outer: OUTER_REALMS[1] }); r += thick * 0.55;
    rings.push({ kind: "darkness", rIn: r, rOut: r + thick * 0.95, outer: OUTER_REALMS[2] }); r += thick * 0.95;
    maxR = r;
  }

  function reset(e) {
    env = e; if (!rings.length) build();
    cam.base = Math.min(e.w, e.h) * 0.46 / maxR;
    cam.scale = cam.base; cam.ox = 0; cam.oy = 0;
  }
  function clampCam() { cam.scale = Math.max(cam.base * 0.5, Math.min(cam.base * 9, cam.scale)); }
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

  function annulus(ctx, cx, cy, rIn, rOut) {
    ctx.beginPath(); ctx.arc(cx, cy, rOut, 0, Math.PI * 2);
    ctx.arc(cx, cy, Math.max(rIn, 0.01), 0, Math.PI * 2, true);
  }

  function draw(ctx, e, t) {
    env = e; regions = [];
    ctx.clearRect(0, 0, e.w, e.h);
    const cx = cxp(), cy = cyp(), s = cam.scale;
    const lx = cx - maxR * s * 0.32, ly = cy - maxR * s * 0.32; // light source (upper-left)

    // faint disc shadow on the cosmos floor
    G.glow(ctx, cx + maxR * s * 0.06, cy + maxR * s * 0.06, maxR * s * 1.05, "#000008", 0.5);

    for (let i = rings.length - 1; i >= 0; i--) {
      const ring = rings[i];
      if (ring.kind === "core") continue;
      const rOut = ring.rOut * s, rIn = ring.rIn * s;
      if (ring.kind === "ocean") { drawOcean(ctx, cx, cy, rIn, rOut, ring, t, lx, ly); regions.push({ type: "ring", rIn, rOut, info: oceanInfo(ring) }); }
      else if (ring.kind === "land") { drawLand(ctx, cx, cy, rIn, rOut, ring.dvipa, lx, ly); regions.push({ type: "ring", rIn, rOut, info: dvipaInfo(ring.dvipa) }); }
      else { drawOuter(ctx, cx, cy, rIn, rOut, ring); regions.push({ type: "ring", rIn, rOut, info: outerInfo(ring.outer) }); }
    }

    // Manasottara ring atop Pushkaradvipa + Sun's orbital path
    if (pushkaraRing) drawManasottara(ctx, cx, cy, t);

    drawJambudvipa(ctx, cx, cy, t, e, lx, ly);

    // global dome lighting — makes the whole plane feel lit from one side
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, maxR * s, 0, Math.PI * 2); ctx.clip();
    const hi = ctx.createRadialGradient(lx, ly, 0, lx, ly, maxR * s * 1.6);
    hi.addColorStop(0, "rgba(255,245,220,0.16)"); hi.addColorStop(0.5, "rgba(255,235,200,0.04)"); hi.addColorStop(1, "rgba(0,0,10,0.35)");
    ctx.globalCompositeOperation = "soft-light"; ctx.fillStyle = hi; ctx.fillRect(cx - maxR * s, cy - maxR * s, maxR * s * 2, maxR * s * 2);
    ctx.restore();

    if (e.showLabels) drawRingLabels(ctx, cx, cy);
    drawCompass(ctx, e);
  }

  function drawOcean(ctx, cx, cy, rIn, rOut, ring, t, lx, ly) {
    const base = ctx.createRadialGradient(cx, cy, rIn, cx, cy, rOut);
    base.addColorStop(0, G.shade(ring.ocean.color, -22));
    base.addColorStop(0.5, ring.ocean.color);
    base.addColorStop(1, G.shade(ring.ocean.color, 16));
    annulus(ctx, cx, cy, rIn, rOut); ctx.fillStyle = base; ctx.fill("evenodd");

    ctx.save(); annulus(ctx, cx, cy, rIn, rOut); ctx.clip("evenodd");
    // rippling liquid texture
    const tile = G.noiseTile("oceanTile", 160, 10, 4);
    ctx.globalAlpha = 0.22; ctx.globalCompositeOperation = "overlay";
    const off = (t * 0.012) % 160;
    G.tile(ctx, tile, cx - rOut, cy - rOut, cx + rOut, cy + rOut, env.w, env.h, off, 0);
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
    // moving specular sheen
    const sheen = ctx.createRadialGradient(lx, ly, 0, lx, ly, rOut * 1.2);
    sheen.addColorStop(0, "rgba(255,255,255,0.30)"); sheen.addColorStop(0.4, "rgba(255,255,255,0.05)"); sheen.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = sheen; ctx.fillRect(cx - rOut, cy - rOut, rOut * 2, rOut * 2);
    ctx.restore();

    // inner & outer coastlines
    ctx.strokeStyle = "rgba(255,255,255,0.18)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, rIn, 0, Math.PI * 2); ctx.stroke();
  }

  function drawLand(ctx, cx, cy, rIn, rOut, d, lx, ly) {
    const base = ctx.createRadialGradient(cx, cy, rIn, cx, cy, rOut);
    base.addColorStop(0, G.shade(d.landColor, 14));
    base.addColorStop(1, G.shade(d.landColor, -16));
    annulus(ctx, cx, cy, rIn, rOut); ctx.fillStyle = base; ctx.fill("evenodd");

    ctx.save(); annulus(ctx, cx, cy, rIn, rOut); ctx.clip("evenodd");
    const tile = G.noiseTile("landTile", 200, 8, 5);
    ctx.globalAlpha = 0.45; ctx.globalCompositeOperation = "multiply";
    G.tile(ctx, tile, cx - rOut, cy - rOut, cx + rOut, cy + rOut, env.w, env.h, 0, 0);
    ctx.globalAlpha = 0.25; ctx.globalCompositeOperation = "screen";
    const lite = ctx.createRadialGradient(lx, ly, 0, lx, ly, rOut * 1.3);
    lite.addColorStop(0, "rgba(255,240,200,0.5)"); lite.addColorStop(1, "rgba(255,240,200,0)");
    ctx.fillStyle = lite; ctx.fillRect(cx - rOut, cy - rOut, rOut * 2, rOut * 2);
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
    ctx.restore();

    // coast glow
    ctx.strokeStyle = "rgba(255,228,170,0.35)"; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(cx, cy, rOut, 0, Math.PI * 2); ctx.stroke();
  }

  function drawOuter(ctx, cx, cy, rIn, rOut, ring) {
    let fill;
    if (ring.kind === "outer") { // Kanchani-bhumi — land of gold
      const g = ctx.createRadialGradient(cx, cy, rIn, cx, cy, rOut);
      g.addColorStop(0, "#e8c878"); g.addColorStop(1, "#a8842e"); fill = g;
    } else if (ring.kind === "lokaloka") {
      const g = ctx.createRadialGradient(cx, cy, rIn, cx, cy, rOut);
      g.addColorStop(0, "#6a6076"); g.addColorStop(0.5, "#48414f"); g.addColorStop(1, "#2a2530"); fill = g;
    } else { fill = "rgba(6,5,12,0.95)"; }
    annulus(ctx, cx, cy, rIn, rOut); ctx.fillStyle = fill; ctx.fill("evenodd");
    if (ring.kind === "lokaloka") { // suggest a raised ridge
      ctx.strokeStyle = "rgba(180,175,190,0.5)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(cx, cy, (rIn + rOut) / 2, 0, Math.PI * 2); ctx.stroke();
    }
  }

  function drawManasottara(ctx, cx, cy, t) {
    const r = (pushkaraRing.rIn + (pushkaraRing.rOut - pushkaraRing.rIn) * 0.5) * cam.scale;
    ctx.strokeStyle = "rgba(120,90,40,0.7)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    // four cities
    const dirs = [[0, -1, "N"], [1, 0, "E"], [0, 1, "S"], [-1, 0, "W"]];
    for (const [dx, dy] of dirs) {
      ctx.fillStyle = "rgba(255,224,150,0.9)";
      ctx.beginPath(); ctx.arc(cx + dx * r, cy + dy * r, 2.5, 0, Math.PI * 2); ctx.fill();
    }
    regions.push({ type: "ringThin", cx, cy, r, w: 8, info: manasottaraInfo() });
  }

  function drawJambudvipa(ctx, cx, cy, t, e, lx, ly) {
    const R = jambuR * cam.scale;
    G.glow(ctx, cx, cy, R * 1.25, "#3a6ea5", 0.35);
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();

    const n = NS_BANDS.length;
    for (let i = 0; i < n; i++) {
      const v = VARSHAS.find((x) => x.name === (NS_BANDS[i] === "ILAVRTA" ? "Ilavrta-varsha" : NS_BANDS[i]));
      const y0 = cy - R + (2 * R) * (i / n), y1 = cy - R + (2 * R) * ((i + 1) / n);
      const grad = ctx.createLinearGradient(0, y0, 0, y1);
      grad.addColorStop(0, G.shade(v.color, 10)); grad.addColorStop(1, G.shade(v.color, -14));
      ctx.fillStyle = NS_BANDS[i] === "ILAVRTA" ? "rgba(0,0,0,0)" : grad;
      ctx.fillRect(cx - R, y0, 2 * R, y1 - y0);
      regions.push({ type: "discBand", cx, cy, R, y0, y1, info: varshaInfo(v) });
    }
    // terrain relief over the whole island
    const tile = G.noiseTile("landTile", 200, 8, 5);
    ctx.globalAlpha = 0.35; ctx.globalCompositeOperation = "multiply";
    G.tile(ctx, tile, cx - R, cy - R, cx + R, cy + R, env.w, env.h, 0, 0);
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";

    // boundary mountain ridges between varshas
    for (let i = 1; i < n; i++) {
      const yy = cy - R + (2 * R) * (i / n);
      ctx.strokeStyle = "rgba(60,40,18,0.55)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx - R, yy); ctx.lineTo(cx + R, yy); ctx.stroke();
      ctx.strokeStyle = "rgba(255,235,190,0.25)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx - R, yy - 1.5); ctx.lineTo(cx + R, yy - 1.5); ctx.stroke();
    }

    // Ilavrta + Ketumala/Bhadrasva flanks
    const ilav = VARSHAS.find((x) => x.name === "Ilavrta-varsha");
    const bh = R * 0.42;
    paintBlock(ctx, cx - bh, cy - bh, bh * 2, bh * 2, ilav.color);
    regions.push({ type: "rect", x: cx - bh, y: cy - bh, w: bh * 2, h: bh * 2, info: varshaInfo(ilav) });
    const ket = VARSHAS.find((x) => x.name === "Ketumala-varsha");
    const bhad = VARSHAS.find((x) => x.name === "Bhadrasva-varsha");
    paintBlock(ctx, cx - R, cy - bh, R - bh, bh * 2, ket.color);
    regions.push({ type: "rect", x: cx - R, y: cy - bh, w: R - bh, h: bh * 2, info: varshaInfo(ket) });
    paintBlock(ctx, cx + bh, cy - bh, R - bh, bh * 2, bhad.color);
    regions.push({ type: "rect", x: cx + bh, y: cy - bh, w: R - bh, h: bh * 2, info: varshaInfo(bhad) });

    // dome light over the island
    const lite = ctx.createRadialGradient(lx, ly, 0, lx, ly, R * 1.6);
    lite.addColorStop(0, "rgba(255,245,210,0.22)"); lite.addColorStop(1, "rgba(0,0,10,0.30)");
    ctx.globalCompositeOperation = "soft-light"; ctx.fillStyle = lite; ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
    ctx.globalCompositeOperation = "source-over";
    ctx.restore();

    ctx.strokeStyle = "rgba(255,224,160,0.8)"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();

    drawMeru(ctx, cx, cy, R, t);

    if (e.showLabels) {
      ctx.fillStyle = "rgba(40,28,12,0.85)"; ctx.font = "600 9px Inter, system-ui, sans-serif"; ctx.textAlign = "center";
      for (let i = 0; i < n; i++) {
        if (NS_BANDS[i] === "ILAVRTA") continue;
        const v = VARSHAS.find((x) => x.name === NS_BANDS[i]);
        const yy = cy - R + (2 * R) * ((i + 0.5) / n);
        if (yy > cy - R + 8 && yy < cy + R - 8) ctx.fillText(v.name.replace("-varsha", ""), cx, yy + 3);
      }
    }
  }

  function paintBlock(ctx, x, y, w, h, color) {
    const g = ctx.createLinearGradient(x, y, x, y + h);
    g.addColorStop(0, G.shade(color, 12)); g.addColorStop(1, G.shade(color, -14));
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  }

  function drawMeru(ctx, cx, cy, R, t) {
    const mr = Math.max(8, R * 0.16);
    // cast shadow
    G.glow(ctx, cx + mr * 0.5, cy + mr * 0.5, mr * 2.2, "#000010", 0.5);
    // bloom
    G.glow(ctx, cx, cy, mr * 3.4, "#ffd24a", 0.7);
    // metallic gold disc
    const g = ctx.createRadialGradient(cx - mr * 0.35, cy - mr * 0.35, mr * 0.1, cx, cy, mr);
    g.addColorStop(0, "#fff7da"); g.addColorStop(0.4, "#ffd35c"); g.addColorStop(0.78, "#c8841f"); g.addColorStop(1, "#7c4e12");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, mr, 0, Math.PI * 2); ctx.fill();
    // golden facets radiating from summit
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, mr, 0, Math.PI * 2); ctx.clip();
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 + t * 0.00003;
      ctx.fillStyle = i % 2 ? "rgba(255,245,200,0.18)" : "rgba(120,76,18,0.18)";
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, mr, a, a + Math.PI / 12); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
    // specular hotspot
    G.glow(ctx, cx - mr * 0.35, cy - mr * 0.35, mr * 0.5, "#ffffff", 0.9);
    ctx.strokeStyle = "rgba(255,245,200,0.85)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, mr, 0, Math.PI * 2); ctx.stroke();
    regions.push({ type: "circle", cx, cy, r: mr + 4, info: meruInfo() });

    if (env.showLabels) {
      ctx.fillStyle = "#fff4d8"; ctx.font = "700 10px Inter, system-ui, sans-serif"; ctx.textAlign = "center";
      ctx.fillText("MERU", cx, cy - mr - 7);
    }

    // the Sun on its orbit around Meru (jyotir-chakra)
    const pr = (jambuR + 30) * cam.scale;
    ctx.setLineDash([3, 7]); ctx.strokeStyle = "rgba(255,210,120,0.22)"; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(cx, cy, pr, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
    const ang = t * 0.00035;
    const sxp = cx + Math.cos(ang) * pr, syp = cy + Math.sin(ang) * pr;
    G.drawSun(ctx, sxp, syp, Math.max(5, mr * 0.45), t);
    regions.push({ type: "circle", cx: sxp, cy: syp, r: 12, info: lumiInfo(LUMINARIES[0]) });
  }

  function drawRingLabels(ctx, cx, cy) {
    ctx.textAlign = "center";
    for (const ring of rings) {
      if (ring.kind === "core") continue;
      const rMid = (ring.rIn + ring.rOut) / 2 * cam.scale, y = cy - rMid;
      if (y < 16 || y > env.h - 8) continue;
      let label = ring.kind === "ocean" ? ring.ocean.liquid : ring.kind === "land" ? ring.dvipa.name : ring.outer ? ring.outer.name : "";
      if (!label) continue;
      ctx.font = ring.kind === "land" ? "600 10px Inter, system-ui, sans-serif" : "italic 10px Georgia, serif";
      ctx.lineWidth = 3; ctx.strokeStyle = "rgba(0,0,0,0.45)"; ctx.strokeText(label, cx, y + 3);
      ctx.fillStyle = ring.kind === "ocean" ? "rgba(245,250,255,0.9)" : ring.kind === "land" ? "rgba(255,244,220,0.95)" : "rgba(220,214,228,0.85)";
      ctx.fillText(label, cx, y + 3);
    }
  }

  function drawCompass(ctx, e) {
    const x = e.w - 56, y = e.h - 56, r = 22;
    ctx.fillStyle = "rgba(8,6,16,0.5)"; ctx.beginPath(); ctx.arc(x, y, r + 6, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(255,196,92,0.45)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "rgba(255,214,130,0.95)"; ctx.font = "700 10px Inter, system-ui, sans-serif"; ctx.textAlign = "center";
    ctx.fillText("N", x, y - r + 9); ctx.fillText("S", x, y + r - 2);
    ctx.fillStyle = "rgba(190,182,162,0.8)"; ctx.fillText("W", x - r + 7, y + 3); ctx.fillText("E", x + r - 7, y + 3);
    ctx.fillStyle = "rgba(190,182,162,0.6)"; ctx.font = "8px Inter, system-ui, sans-serif";
    ctx.fillText("Bharata = South", x, y + r + 12);
  }

  /* ---- info builders ---- */
  function dvipaInfo(d) {
    return { eyebrow: "Island-continent (dvipa)", name: d.name, alt: null, ref: "SB 5.20", body: d.note,
      facts: [["Breadth", fmt(d.widthYojanas) + " yojanas"], ["≈ in miles", milesOf(d.widthYojanas) + " mi"], ["Encircling ocean", d.ocean.liquid], ["Ruling son of Priyavrata", d.master]], triloka: false };
  }
  function oceanInfo(ring) {
    const d = ring.dvipa;
    return { eyebrow: "Encircling ocean", name: "Ocean of " + ring.ocean.liquid, alt: ring.ocean.name, ref: "SB 5.20",
      body: "The ring of " + ring.ocean.liquid.toLowerCase() + " surrounding " + d.name + ". Its breadth equals the breadth of the island it encircles.",
      facts: [["Breadth", fmt(d.widthYojanas) + " yojanas"], ["≈ in miles", milesOf(d.widthYojanas) + " mi"], ["Surrounds", d.name]], triloka: false };
  }
  function varshaInfo(v) {
    return { eyebrow: "Region of Jambudvipa (varsha)", name: v.name, alt: v.dir === "center" ? "the central region" : "to the " + v.dir, ref: "SB 5.16-19",
      body: v.note, facts: [["Length", fmt(VARSHA_LENGTH_YOJANAS) + " yojanas (" + milesOf(VARSHA_LENGTH_YOJANAS) + " mi)"], ["Direction from Meru", v.dir]], triloka: v.name === "Bharata-varsha" };
  }
  function outerInfo(o) { return { eyebrow: "Beyond the seven oceans", name: o.name, alt: null, ref: o.reference, body: o.description, facts: [], triloka: false }; }
  function manasottaraInfo() {
    return { eyebrow: "The Sun's orbit", name: MANASOTTARA.name, alt: "atop Pushkaradvipa", ref: MANASOTTARA.reference, body: MANASOTTARA.note,
      facts: [["Sun's orbital path", fmt(MANASOTTARA.sunOrbitYojanas) + " yojanas"], ["≈ in miles", milesOf(MANASOTTARA.sunOrbitYojanas) + " mi"]].concat(MANASOTTARA.cities.map((c) => [c.name + " (" + c.dir + ")", c.lord])), triloka: false };
  }
  function meruInfo() {
    return { eyebrow: "Axis of the universe", name: MERU.name, alt: null, ref: MERU.reference, body: MERU.note,
      facts: [["Total height", fmt(MERU.heightYojanas) + " yojanas"], ["≈ in miles", milesOf(MERU.heightYojanas) + " mi"], ["Summit / base width", fmt(MERU.summitWidthYojanas) + " / " + fmt(MERU.baseWidthYojanas) + " yojanas"], ["Material", MERU.material]], triloka: false };
  }
  function lumiInfo(L) { return { eyebrow: "Jyotir-chakra — the Sun", name: L.name, alt: null, ref: L.reference, body: L.note, facts: [["Height above Bhu", fmt(L.heightYojanas) + " yojanas"]], triloka: false }; }

  function hitTest(mx, my) {
    const cx = cxp(), cy = cyp();
    for (let i = regions.length - 1; i >= 0; i--) { const r = regions[i]; if (r.type === "circle") { const dx = mx - r.cx, dy = my - r.cy; if (dx * dx + dy * dy <= r.r * r.r) return r.info; } }
    const d = Math.hypot(mx - cx, my - cy);
    for (let i = regions.length - 1; i >= 0; i--) { const r = regions[i];
      if (r.type === "ringThin" && Math.abs(d - r.r) <= r.w) return r.info;
      if (r.type === "rect" && mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) return r.info;
      if (r.type === "discBand" && d <= r.R && my >= r.y0 && my <= r.y1) return r.info;
    }
    let best = null;
    for (const r of regions) if (r.type === "ring" && d >= r.rIn && d <= r.rOut) best = r.info;
    return best;
  }

  return {
    id: "bhumandala",
    title: "Bhu-mandala — The Great Earth Circle",
    subtitle: "Looking down upon the earthly plane: seven island-continents, each ringed by an ocean of a different liquid, with golden Mount Meru and the nine regions of Jambudvipa at the centre.",
    navName: "Bhu-mandala", navSub: "The Earth circle (top view)",
    accent: "#caa46a",
    hint: "Scroll to zoom · drag to pan · hover an island, ocean, or region · the Sun circles Meru",
    reset, draw, hitTest, onWheel, onDrag,
  };
})();
