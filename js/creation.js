/* =====================================================================
   CREATION / BRAHMANDA VIEW — the macro-cosmology.
   Maha-Vishnu reclines on the Causal Ocean and exhales innumerable
   universes from the pores of His body; one universe is shown expanded,
   revealing Garbhodakasayi Vishnu on the Garbhodaka ocean, the lotus
   rising from His navel, Lord Brahma upon it, and the egg that contains
   the fourteen worlds mapped in the other views.

   Distilled from the lecture series (see js/scriptures.js). All forms of
   the Lord are shown reverently as radiant presences, not figures.
   ===================================================================== */

window.CreationView = (function () {
  const GFX = window.GFX;
  const W0 = 1600, H0 = 900;                  // virtual design space
  const cam = { scale: 1, ox: 0, oy: 0, base: 1 };
  let env = { w: 0, h: 0 };
  let regions = [];
  let bubbles = [];

  // world anchor points
  const KRISHNA = { x: 250, y: 150 };
  const VISHNU = { x: 330, y: 470, r: 150 };
  const OURUNI = { x: 905, y: 312, r: 30 };
  const EGG = { x: 1240, y: 470, rx: 200, ry: 270 };

  function build() {
    bubbles = [];
    for (let i = 0; i < 46; i++) {
      bubbles.push({
        phase: Math.random(),
        speed: 0.018 + Math.random() * 0.03,
        spread: (Math.random() - 0.5) * 90,
        size: 4 + Math.random() * 9,
        hueWarm: Math.random() < 0.5,
      });
    }
  }

  /* world -> screen */
  function sx(wx) { return (wx - W0 / 2) * cam.scale + env.w / 2 + cam.ox; }
  function sy(wy) { return (wy - H0 / 2) * cam.scale + env.h / 2 + cam.oy; }
  function ss(v) { return v * cam.scale; }

  function reset(e) {
    env = e; if (!bubbles.length) build();
    cam.base = Math.min(e.w / W0, e.h / H0) * 0.96;
    cam.scale = cam.base; cam.ox = 0; cam.oy = 0;
  }
  function clampCam() { cam.scale = Math.max(cam.base * 0.6, Math.min(cam.base * 5, cam.scale)); }
  function onWheel(ev) {
    const wx = (ev.offsetX - env.w / 2 - cam.ox) / cam.scale + W0 / 2;
    const wy = (ev.offsetY - env.h / 2 - cam.oy) / cam.scale + H0 / 2;
    cam.scale *= ev.deltaY < 0 ? 1.12 : 0.89; clampCam();
    cam.ox = ev.offsetX - env.w / 2 - (wx - W0 / 2) * cam.scale;
    cam.oy = ev.offsetY - env.h / 2 - (wy - H0 / 2) * cam.scale;
  }
  function onDrag(dx, dy) { cam.ox += dx; cam.oy += dy; }

  /* quadratic bezier for the stream path */
  function streamPoint(p) {
    const S = { x: VISHNU.x + 110, y: VISHNU.y - 10 }, C = { x: 640, y: 540 }, E = { x: 980, y: 280 };
    const u = 1 - p;
    return {
      x: u * u * S.x + 2 * u * p * C.x + p * p * E.x,
      y: u * u * S.y + 2 * u * p * C.y + p * p * E.y,
    };
  }

  function draw(ctx, e, t) {
    env = e; regions = [];
    const w = e.w, h = e.h;
    const breath = 0.5 + 0.5 * Math.sin(t * 0.0005);

    // --- background: spiritual light above fading to the dark causal waters ---
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "#241a3a");
    bg.addColorStop(0.16, "#15183a");
    bg.addColorStop(0.5, "#0a1130");
    bg.addColorStop(1, "#05050e");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
    // rippling causal water (lower half)
    const tile = GFX.noiseTile("oceanTile", 160, 10, 4);
    ctx.save(); ctx.beginPath(); ctx.rect(0, h * 0.32, w, h * 0.68); ctx.clip();
    ctx.globalAlpha = 0.10; ctx.globalCompositeOperation = "overlay";
    GFX.tile(ctx, tile, 0, h * 0.32, w, h, (t * 0.01) % 160, 0);
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
    ctx.restore();

    // screen-space ambient regions (low priority)
    regions.push({ type: "rect", x: 0, y: 0, w: w, h: h * 0.12, info: vaikunthaInfo(), pr: 0 });
    regions.push({ type: "rect", x: 0, y: 0, w: w, h: h, info: causalInfo(), pr: -1 });

    drawRatioBar(ctx, e);

    // --- Sri Krishna source + descending beam ---
    const kx = sx(KRISHNA.x), ky = sy(KRISHNA.y);
    const beam = ctx.createLinearGradient(kx, ky, sx(VISHNU.x), sy(VISHNU.y));
    beam.addColorStop(0, "rgba(255,225,150,0.5)"); beam.addColorStop(1, "rgba(120,150,255,0)");
    ctx.strokeStyle = beam; ctx.lineWidth = ss(10); ctx.beginPath(); ctx.moveTo(kx, ky); ctx.lineTo(sx(VISHNU.x), sy(VISHNU.y)); ctx.stroke();
    GFX.glow(ctx, kx, ky, ss(46), "#ffe7a0", 0.8);
    ctx.fillStyle = "#fff6da"; ctx.beginPath(); ctx.arc(kx, ky, ss(13), 0, Math.PI * 2); ctx.fill();
    regions.push({ type: "circle", cx: kx, cy: ky, r: ss(28), info: hierInfo("krishna", "The source of all"), pr: 5 });
    label(ctx, e, "Sri Krishna · Goloka", kx, ky - ss(34), "center");

    // --- Maha-Vishnu reclining on the Causal Ocean (radiant presence) ---
    drawDivinePresence(ctx, sx(VISHNU.x), sy(VISHNU.y), ss(VISHNU.r) * (0.94 + 0.1 * breath), "#9fb4ff", "#ffe6a8");
    regions.push({ type: "circle", cx: sx(VISHNU.x), cy: sy(VISHNU.y), r: ss(VISHNU.r) * 0.8, info: hierInfo("mahavishnu", "First purusha-avatar"), pr: 4 });
    label(ctx, e, "Maha-Vishnu — on the Causal Ocean", sx(VISHNU.x), sy(VISHNU.y) + ss(VISHNU.r) * 0.78 + 16, "center");

    // --- exhaled universes streaming out ---
    drawUniverseStream(ctx, t, breath, e);

    // --- our universe (highlighted) + connector to the expanded egg ---
    const ox = sx(OURUNI.x), oy = sy(OURUNI.y);
    GFX.glow(ctx, ox, oy, ss(OURUNI.r) * 2.4 * (0.9 + 0.2 * breath), "#ffd27a", 0.6);
    drawUniverseEgg(ctx, ox, oy, ss(OURUNI.r), ss(OURUNI.r * 1.3), 0.5);
    regions.push({ type: "circle", cx: ox, cy: oy, r: ss(OURUNI.r) * 1.3, info: hierInfo("anda", "Our universe"), pr: 6 });
    label(ctx, e, "our universe", ox, oy - ss(OURUNI.r * 1.3) - 8, "center");
    // dotted connector
    ctx.save(); ctx.setLineDash([4, 6]); ctx.strokeStyle = "rgba(255,210,130,0.5)"; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(ox + ss(OURUNI.r), oy); ctx.lineTo(sx(EGG.x) - ss(EGG.rx), sy(EGG.y) - ss(120)); ctx.stroke();
    ctx.restore();

    // --- the expanded universe (cutaway egg) ---
    drawEggCutaway(ctx, t, breath, e);

    // title-ish caption
    label(ctx, e, "“As He breathes out, the universes appear; as He breathes in, they are withdrawn.”  — Brahma-samhita 5.48",
      sx(W0 / 2), sy(H0) - 6, "center", "rgba(210,200,180,0.55)", "italic 12px Georgia, serif");
  }

  function drawDivinePresence(ctx, x, y, r, c1, c2) {
    GFX.glow(ctx, x, y, r * 1.9, c1, 0.5);
    GFX.glow(ctx, x, y, r * 1.2, c2, 0.6);
    // reclining mandorla (abstract, horizontal)
    ctx.save(); ctx.translate(x, y); ctx.scale(1.5, 1);
    const g = ctx.createRadialGradient(0, 0, r * 0.1, 0, 0, r);
    g.addColorStop(0, "rgba(255,248,224,0.95)");
    g.addColorStop(0.4, "rgba(220,210,255,0.55)");
    g.addColorStop(1, "rgba(150,170,255,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    // halo rings
    ctx.strokeStyle = "rgba(255,236,180,0.35)"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.ellipse(x, y, r * 1.5, r, 0, 0, Math.PI * 2); ctx.stroke();
  }

  function drawUniverseStream(ctx, t, breath, e) {
    for (const b of bubbles) {
      let p = (b.phase + t * 0.00006 * (b.speed * 30)) % 1;
      const pt = streamPoint(p);
      const x = sx(pt.x), y = sy(pt.y + b.spread * Math.sin(p * Math.PI));
      const r = ss(b.size) * (0.5 + p * 0.9);
      const a = Math.sin(p * Math.PI) * 0.9;        // fade in/out along the path
      if (a <= 0.02) continue;
      ctx.globalAlpha = a;
      GFX.glow(ctx, x, y, r * 2.2, b.hueWarm ? "#ffd98a" : "#bcd0ff", 0.5);
      drawUniverseEgg(ctx, x, y, r, r * 1.25, a);
      ctx.globalAlpha = 1;
    }
    // a representative hover zone over the stream
    const mid = streamPoint(0.55);
    regions.push({ type: "circle", cx: sx(mid.x), cy: sy(mid.y), r: ss(70), info: universesInfo(), pr: 2 });
    label(ctx, e, "innumerable universes", sx(streamPoint(0.5).x), sy(streamPoint(0.5).y) - ss(70), "center");
  }

  function drawUniverseEgg(ctx, x, y, rx, ry, a) {
    const g = ctx.createRadialGradient(x - rx * 0.3, y - ry * 0.3, 1, x, y, ry);
    g.addColorStop(0, "rgba(255,250,230," + (0.9 * a) + ")");
    g.addColorStop(0.6, "rgba(180,200,255," + (0.5 * a) + ")");
    g.addColorStop(1, "rgba(90,110,200," + (0.15 * a) + ")");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
  }

  function drawEggCutaway(ctx, t, breath, e) {
    const cx = sx(EGG.x), cy = sy(EGG.y), rx = ss(EGG.rx), ry = ss(EGG.ry);
    // outer bloom + shell
    GFX.glow(ctx, cx, cy, ry * 1.4, "#6f7bd0", 0.35);
    ctx.save();
    ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.clip();

    // interior gradient (dark inside the egg)
    const inside = ctx.createLinearGradient(0, cy - ry, 0, cy + ry);
    inside.addColorStop(0, "#0d0a1c"); inside.addColorStop(1, "#070512");
    ctx.fillStyle = inside; ctx.fillRect(cx - rx, cy - ry, rx * 2, ry * 2);

    // faint column of the fourteen worlds (gold above -> brown below)
    const colW = rx * 0.5;
    const col = ctx.createLinearGradient(0, cy - ry * 0.8, 0, cy + ry * 0.8);
    col.addColorStop(0, "rgba(255,230,150,0.30)");
    col.addColorStop(0.45, "rgba(255,200,110,0.22)");
    col.addColorStop(0.55, "rgba(210,170,110,0.30)");
    col.addColorStop(1, "rgba(120,80,50,0.30)");
    ctx.fillStyle = col; ctx.fillRect(cx - colW / 2, cy - ry * 0.8, colW, ry * 1.6);
    // bright Bhu plane line at mid
    ctx.strokeStyle = "rgba(255,224,150,0.7)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx - colW * 0.7, cy + ry * 0.05); ctx.lineTo(cx + colW * 0.7, cy + ry * 0.05); ctx.stroke();

    // Garbhodaka ocean at the base
    const oy0 = cy + ry * 0.45;
    const og = ctx.createLinearGradient(0, oy0, 0, cy + ry);
    og.addColorStop(0, "#13385a"); og.addColorStop(1, "#0a2238");
    ctx.fillStyle = og; ctx.fillRect(cx - rx, oy0, rx * 2, ry);
    ctx.save(); ctx.beginPath(); ctx.rect(cx - rx, oy0, rx * 2, ry); ctx.clip();
    ctx.globalAlpha = 0.18; ctx.globalCompositeOperation = "overlay";
    GFX.tile(ctx, GFX.noiseTile("oceanTile", 160, 10, 4), cx - rx, oy0, cx + rx, cy + ry, (t * 0.012) % 160, 0);
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over"; ctx.restore();

    // Garbhodakasayi Vishnu presence on the ocean
    drawDivinePresence(ctx, cx, oy0 + ry * 0.22, rx * 0.42 * (0.95 + 0.1 * breath), "#7fd0ff", "#ffe6b0");

    // lotus stem from navel rising to Brahma
    const lotusY = cy - ry * 0.58;
    const sway = Math.sin(t * 0.0009) * rx * 0.05;
    ctx.strokeStyle = "rgba(120,200,140,0.8)"; ctx.lineWidth = Math.max(1.5, ss(4));
    ctx.beginPath();
    ctx.moveTo(cx, oy0 + ry * 0.1);
    ctx.quadraticCurveTo(cx + sway, (oy0 + lotusY) / 2, cx + sway, lotusY + ss(14));
    ctx.stroke();

    ctx.restore(); // unclip egg

    // lotus + Brahma (drawn over the shell so glow shows)
    drawLotus(ctx, cx + sway, lotusY, ss(20));
    GFX.glow(ctx, cx + sway, lotusY - ss(6), ss(26), "#ffdf9a", 0.8);
    ctx.fillStyle = "#fff3cf"; ctx.beginPath(); ctx.arc(cx + sway, lotusY - ss(6), ss(7), 0, Math.PI * 2); ctx.fill();

    // shell outline (glassy)
    const shell = ctx.createLinearGradient(0, cy - ry, 0, cy + ry);
    shell.addColorStop(0, "rgba(210,220,255,0.8)"); shell.addColorStop(0.5, "rgba(150,160,230,0.4)"); shell.addColorStop(1, "rgba(90,90,160,0.5)");
    ctx.strokeStyle = shell; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();

    // regions
    regions.push({ type: "ellipse", cx, cy, rx, ry, info: hierInfo("anda", "Our universe — expanded"), pr: 3 });
    regions.push({ type: "circle", cx, cy: oy0 + ry * 0.22, r: rx * 0.4, info: hierInfo("garbhodaka", "Within the universe"), pr: 7 });
    regions.push({ type: "circle", cx: cx + sway, cy: lotusY - ss(6), r: ss(22), info: hierInfo("brahma", "The first created being"), pr: 8 });

    // labels
    label(ctx, e, "Our universe (expanded)", cx, cy - ry - 8, "center");
    label(ctx, e, "Brahma on the navel-lotus", cx + sway, lotusY - ss(30), "center", "rgba(255,244,210,0.85)");
    label(ctx, e, "Garbhodaka ocean", cx, cy + ry * 0.62, "center", "rgba(180,210,235,0.8)");
    label(ctx, e, "14 worlds", cx, cy - ry * 0.86, "center", "rgba(255,228,160,0.7)", "10px Inter, system-ui, sans-serif");
  }

  function drawLotus(ctx, x, y, r) {
    ctx.save(); ctx.translate(x, y);
    for (let i = 0; i < 8; i++) {
      ctx.rotate(Math.PI / 4);
      const g = ctx.createLinearGradient(0, 0, 0, -r);
      g.addColorStop(0, "rgba(255,160,190,0.4)"); g.addColorStop(1, "rgba(255,120,160,0.85)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.ellipse(0, -r * 0.6, r * 0.28, r * 0.6, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  function drawRatioBar(ctx, e) {
    const x = 26, y = e.h * 0.16, w = 22, h = e.h * 0.68;
    const split = h * 0.75;
    const g = ctx.createLinearGradient(0, y, 0, y + split);
    g.addColorStop(0, "#ffe6a0"); g.addColorStop(1, "#d79a3a");
    ctx.fillStyle = g; ctx.fillRect(x, y, w, split);
    ctx.fillStyle = "#1a1630"; ctx.fillRect(x, y + split, w, h - split);
    ctx.strokeStyle = "rgba(255,196,92,0.4)"; ctx.lineWidth = 1; ctx.strokeRect(x, y, w, h);
    ctx.save(); ctx.translate(x - 6, y + split / 2); ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = "rgba(20,16,30,0.9)"; ctx.font = "700 10px Inter, system-ui, sans-serif"; ctx.textAlign = "center";
    ctx.fillText("SPIRITUAL · 3/4", 0, 4); ctx.restore();
    ctx.save(); ctx.translate(x - 6, y + split + (h - split) / 2); ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = "rgba(220,214,228,0.8)"; ctx.font = "700 9px Inter, system-ui, sans-serif"; ctx.textAlign = "center";
    ctx.fillText("MATTER · 1/4", 0, 4); ctx.restore();
    regions.push({ type: "rect", x, y, w, h, info: conceptInfo("ratio"), pr: 9 });
  }

  function label(ctx, e, text, x, y, align, color, font) {
    if (!e.showLabels) return;
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.8)"; ctx.shadowBlur = 5;
    ctx.fillStyle = color || "rgba(245,238,222,0.9)";
    ctx.font = font || "12px Inter, system-ui, sans-serif";
    ctx.textAlign = align || "left";
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  /* ---- info builders ---- */
  function hierInfo(key, eyebrowExtra) {
    const node = COSMIC_HIERARCHY.find((n) => n.key === key);
    return {
      eyebrow: (eyebrowExtra ? eyebrowExtra + " · " : "") + "Cosmic hierarchy",
      name: node.name, alt: node.alt, ref: node.ref, body: node.summary,
      facts: [["Realm", node.realm === "spiritual" ? "Spiritual world" : node.realm === "boundary" ? "Boundary of creation" : "Material world"], ["Source", sourceTag(node.sources)]],
      triloka: false,
    };
  }
  function conceptInfo(key) {
    const c = CONCEPTS.find((x) => x.key === key);
    return { eyebrow: "Teaching", name: c.title, alt: null, ref: c.ref, body: c.body, facts: [["Source", sourceTag(c.sources)]], triloka: false };
  }
  function vaikunthaInfo() {
    const c = CONCEPTS.find((x) => x.key === "effulgence");
    return { eyebrow: "Spiritual world · three-quarters of existence", name: "The Spiritual Sky", alt: "Vaikuntha — self-effulgent",
      ref: "BG 15.6; Purusha-sukta", body: c.body, facts: [["Proportion", "3/4 of all existence (eternal)"], ["Source", sourceTag(c.sources)]], triloka: false };
  }
  function causalInfo() {
    return { eyebrow: "Boundary of the material creation", name: "The Causal Ocean", alt: "Karana-arnava",
      ref: "Brahma-samhita 5.47-48", body: "The vast waters upon which Maha-Vishnu reclines. Here the entire material energy rests in potential until, by His glance and breath, the innumerable universes are set into motion.",
      facts: [["Source", sourceTag([1])]], triloka: false };
  }
  function universesInfo() {
    const c = CONCEPTS.find((x) => x.key === "time");
    return { eyebrow: "Ananta-koti brahmanda", name: "Innumerable Universes", alt: "from the pores of Maha-Vishnu",
      ref: "Brahma-samhita 5.48", body: "Countless universes emanate from the pores of Maha-Vishnu's body like atoms passing through a screen — appearing as He exhales and dissolving as He inhales. " + c.body,
      facts: [["A Brahma's life", bigNum(MACRO_TIME.brahmaLifeYears) + " yrs"], ["Source", sourceTag([1])]], triloka: false };
  }

  /* ---- hit testing (highest pr wins) ---- */
  function inEllipse(mx, my, r) { const dx = (mx - r.cx) / r.rx, dy = (my - r.cy) / r.ry; return dx * dx + dy * dy <= 1; }
  function hitTest(mx, my) {
    let best = null, bestPr = -Infinity;
    for (const r of regions) {
      let hit = false;
      if (r.type === "circle") { const dx = mx - r.cx, dy = my - r.cy; hit = dx * dx + dy * dy <= r.r * r.r; }
      else if (r.type === "ellipse") hit = inEllipse(mx, my, r);
      else if (r.type === "rect") hit = mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h;
      if (hit && (r.pr == null ? 0 : r.pr) > bestPr) { best = r.info; bestPr = (r.pr == null ? 0 : r.pr); }
    }
    return best;
  }

  return {
    id: "creation",
    title: "Creation — The Brahmanda",
    subtitle: "Maha-Vishnu reclines on the Causal Ocean and breathes out innumerable universes. One is shown expanded: Garbhodakasayi Vishnu, the navel-lotus, Lord Brahma, and the egg that holds the fourteen worlds.",
    navName: "Creation",
    navSub: "Maha-Vishnu & the universes",
    accent: "#b9c2ff",
    hint: "Scroll to zoom · drag to pan · hover Maha-Vishnu, a universe, or the expanded egg",
    reset, draw, hitTest, onWheel, onDrag,
  };
})();
