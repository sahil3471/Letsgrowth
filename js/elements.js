/* =====================================================================
   ELEMENTS VIEW — the Sankhya emanation tree (SB 3.26, Video 3).
   How the ingredients of creation unfold from Vasudeva through the
   mahat-tattva and false ego (under the three modes) down to the five
   gross elements.  A pan/zoom node-graph; hover any tattva for its source.
   ===================================================================== */
window.ElementsView = (function () {
  const GFX = window.GFX;
  const W0 = 1200, H0 = 900;
  const cam = { scale: 1, ox: 0, oy: 0, base: 1 };
  let env = { w: 0, h: 0 };
  let nodes = [], edges = [], regions = [];

  function sx(x) { return (x - W0 / 2) * cam.scale + env.w / 2 + cam.ox; }
  function sy(y) { return (y - H0 / 2) * cam.scale + env.h / 2 + cam.oy; }
  function N(id, x, y, w, h, title, sub, color, info) { nodes.push({ id, x, y, w, h, title, sub, color, info }); }
  const src = (ids) => ["Source", sourceTag(ids)];

  /* ---- info builders (pull from scriptures.js data) ---- */
  function tattvaInfo(name) {
    const n = TATTVA_EMANATION.find((x) => x.name === name) || {};
    return { eyebrow: "Chain of emanation", name: name, alt: n.sanskrit || null, ref: n.ref || "SB 2.5",
      body: n.note || "", facts: [["Source", sourceTag(n.sources || [2, 3])]], triloka: false };
  }
  function conceptInfo(key) {
    const c = CONCEPTS.find((x) => x.key === key);
    return { eyebrow: "Teaching", name: c.title, alt: null, ref: c.ref, body: c.body, facts: [src(c.sources)], triloka: false };
  }
  function modeInfo(mode) {
    const a = AHANKARA_DIVISION.find((x) => x.mode === mode);
    const ga = GUNA_AVATARAS.find((g) => g.mode.toLowerCase().indexOf(mode.toLowerCase()) === 0);
    const facts = [["Produces", a.items.join(", ")]];
    if (ga) facts.push([ga.role, ga.lord]);
    facts.push(src(a.sources));
    return { eyebrow: "Mode of nature · " + a.alt, name: "The mode of " + mode.toLowerCase(), alt: a.alt, ref: a.ref, body: a.produces, facts: facts, triloka: false };
  }
  function elementInfo(el) {
    return { eyebrow: "Gross element (mahabhuta)", name: el.name, alt: el.sanskrit, ref: el.ref,
      body: "Evolves from the subtle element of " + el.tanmatra.toLowerCase() + ". It carries the qualities " + el.qualities.join(", ") + " — perceived through " + el.sense.toLowerCase() + ".",
      facts: [["Sense-quality", el.tanmatra], ["Qualities", el.qualities.length + " (" + el.qualities.join(", ") + ")"], src(el.sources)], triloka: false };
  }


  function build() {
    nodes = []; edges = [];
    N("vasudeva", 600, 50, 240, 60, "Sri Krishna", "Vasudeva — the origin", "#ffd980",
      { eyebrow: "The origin", name: "Sri Krishna (Vasudeva)", alt: "source of all energies", ref: "SB 2.5.14",
        body: "Everything emanates from Vasudeva — His effulgence, the total material energy, and every ingredient of creation.", facts: [src([2, 3])], triloka: false });
    N("jyoti", 600, 152, 220, 56, "Brahma-jyoti", "His self-effulgence", "#fff0c0", tattvaInfo("Brahma-jyoti"));
    N("mahat", 600, 254, 220, 56, "Mahat-tattva", "total material energy", "#cdb9ff", tattvaInfo("Mahat-tattva"));
    N("kala", 300, 254, 180, 52, "Kala", "time — the agitator", "#9fb4d8", tattvaInfo("Kala"));
    N("ahankara", 600, 360, 230, 56, "Ahankara", "false ego — divides by the modes", "#caa46a", conceptInfo("ahankara"));
    // three modes
    N("sattva", 250, 474, 226, 66, "Sattva", "goodness · Vishnu maintains", "#ffd86b", modeInfo("Sattva"));
    N("rajas", 600, 474, 226, 66, "Rajas", "passion · Brahma creates", "#ff9d5c", modeInfo("Rajas"));
    N("tamas", 950, 474, 226, 66, "Tamas", "ignorance · Shiva dissolves", "#9a8bc0", modeInfo("Tamas"));
    // products of each mode
    N("p_sattva", 250, 602, 240, 66, "Mind + 10 demigods", "manas & the sense-controllers", "#ffe39a",
      { eyebrow: "From goodness (vaikarika)", name: "Mind & the presiding demigods", alt: null, ref: "SB 3.26.25",
        body: "The mind (manas) and the ten demigods who control the senses and directions: " + SENSE_DEITIES.join(", ") + ".", facts: [src([3])], triloka: false });
    N("p_rajas", 600, 602, 252, 66, "Intelligence · Prana · 10 senses", "buddhi, life-air & the indriyas", "#ffb27a",
      { eyebrow: "From passion (taijasa)", name: "Intelligence, life-air & the ten senses", alt: null, ref: "SB 3.26.27-31",
        body: "The intelligence (buddhi), the life-air (prana), and the ten senses — five for knowledge (ear, skin, eye, tongue, nose) and five for action (voice, hands, legs, anus, genitals).", facts: [src([3])], triloka: false });
    N("p_tamas", 950, 602, 252, 66, "Subtle → gross elements", "tanmatras and the five elements", "#b0a2d6", conceptInfo("elements-evolution"));
    // five gross elements, evolving left-to-right
    const ex = [170, 375, 580, 785, 990], ey = 762;
    ELEMENTS.forEach((el, i) => N("el_" + i, ex[i], ey, 188, 78, el.name + " — " + el.tanmatra, el.sense, el.color, elementInfo(el)));
    edges = [
      ["vasudeva", "jyoti"], ["jyoti", "mahat"], ["mahat", "kala"], ["mahat", "ahankara"],
      ["ahankara", "sattva"], ["ahankara", "rajas"], ["ahankara", "tamas"],
      ["sattva", "p_sattva"], ["rajas", "p_rajas"], ["tamas", "p_tamas"],
      ["p_tamas", "el_0"], ["el_0", "el_1"], ["el_1", "el_2"], ["el_2", "el_3"], ["el_3", "el_4"],
    ];
  }

  function reset(e) { env = e; if (!nodes.length) build(); cam.base = Math.min(e.w / W0, e.h / H0) * 0.94; cam.scale = cam.base; cam.ox = 0; cam.oy = 0; }
  function clampCam() { cam.scale = Math.max(cam.base * 0.5, Math.min(cam.base * 4, cam.scale)); }
  function onWheel(ev) {
    const wx = (ev.offsetX - env.w / 2 - cam.ox) / cam.scale + W0 / 2, wy = (ev.offsetY - env.h / 2 - cam.oy) / cam.scale + H0 / 2;
    cam.scale *= ev.deltaY < 0 ? 1.12 : 0.89; clampCam();
    cam.ox = ev.offsetX - env.w / 2 - (wx - W0 / 2) * cam.scale; cam.oy = ev.offsetY - env.h / 2 - (wy - H0 / 2) * cam.scale;
  }
  function onDrag(dx, dy) { cam.ox += dx; cam.oy += dy; }


  function roundRect(ctx, x, y, w, h, r) {
    r = Math.min(r, h / 2, w / 2);
    ctx.beginPath(); ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function label(ctx, e, text, x, y, align, color, font) {
    if (!e.showLabels) return;
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,0.8)"; ctx.shadowBlur = 5;
    ctx.fillStyle = color || "rgba(245,238,222,0.9)"; ctx.font = font || "12px Inter, system-ui, sans-serif";
    ctx.textAlign = align || "left"; ctx.fillText(text, x, y); ctx.restore();
  }

  function draw(ctx, e, t) {
    env = e; regions = [];
    ctx.clearRect(0, 0, e.w, e.h);
    const bg = ctx.createLinearGradient(0, 0, 0, e.h);
    bg.addColorStop(0, "#120d22"); bg.addColorStop(1, "#070510");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, e.w, e.h);

    const byId = {}; nodes.forEach((n) => (byId[n.id] = n));
    ctx.lineWidth = Math.max(1, 1.4 * cam.scale);
    for (const ed of edges) {
      const na = byId[ed[0]], nb = byId[ed[1]];
      const horizontal = Math.abs(na.y - nb.y) < 6;
      let x1, y1, x2, y2;
      if (horizontal) { x1 = sx(na.x + na.w / 2); y1 = sy(na.y); x2 = sx(nb.x - nb.w / 2); y2 = sy(nb.y); }
      else { x1 = sx(na.x); y1 = sy(na.y + na.h / 2); x2 = sx(nb.x); y2 = sy(nb.y - nb.h / 2); }
      const grd = ctx.createLinearGradient(x1, y1, x2, y2);
      grd.addColorStop(0, "rgba(255,210,130,0.55)"); grd.addColorStop(1, "rgba(180,170,210,0.18)");
      ctx.strokeStyle = grd; ctx.beginPath(); ctx.moveTo(x1, y1);
      if (horizontal) ctx.lineTo(x2, y2);
      else { const my = (y1 + y2) / 2; ctx.bezierCurveTo(x1, my, x2, my, x2, y2); }
      ctx.stroke();
    }
    for (const n of nodes) drawNode(ctx, n, e);
    label(ctx, e, "The Sankhya emanation of the elements", sx(600), sy(14), "center", "rgba(255,236,180,0.85)", "600 15px Georgia, serif");
  }

  function drawNode(ctx, n, e) {
    const cx = sx(n.x), cy = sy(n.y), w = n.w * cam.scale, h = n.h * cam.scale;
    const x = cx - w / 2, y = cy - h / 2;
    GFX.glow(ctx, cx, cy, w * 0.7, n.color, 0.22);
    roundRect(ctx, x, y, w, h, 8 * cam.scale);
    const g = ctx.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, GFX.hexA(n.color, 0.34)); g.addColorStop(1, "rgba(12,9,22,0.85)");
    ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = GFX.hexA(n.color, 0.72); ctx.lineWidth = 1.2; ctx.stroke();
    regions.push({ x: x, y: y, w: w, h: h, info: n.info });
    if (e.showLabels) {
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(255,247,228,0.96)";
      ctx.font = "600 " + Math.max(9, Math.min(15, 13 * cam.scale)) + "px Inter, system-ui, sans-serif";
      ctx.fillText(n.title, cx, cy + (n.sub ? -2 : 4));
      if (n.sub) {
        ctx.fillStyle = "rgba(202,194,174,0.72)";
        ctx.font = Math.max(8, Math.min(12, 10 * cam.scale)) + "px Inter, system-ui, sans-serif";
        ctx.fillText(n.sub, cx, cy + 13);
      }
    }
  }

  function hitTest(mx, my) {
    for (let i = regions.length - 1; i >= 0; i--) {
      const r = regions[i];
      if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) return r.info;
    }
    return null;
  }

  return {
    id: "tattvas",
    title: "The Elements — Sankhya Emanation",
    subtitle: "How the ingredients of creation unfold from Vasudeva through the mahat-tattva and false ego, under the three modes, down to the five gross elements.",
    navName: "The Elements", navSub: "Sankhya emanation",
    accent: "#cdb9ff",
    hint: "Scroll to zoom · drag to pan · hover any tattva for its scripture",
    reset, draw, hitTest, onWheel, onDrag,
  };
})();
