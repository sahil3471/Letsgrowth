/* =====================================================================
   TRILOKA VIEW — vertical cross-section of the cosmic egg (Brahmanda).
   The fourteen worlds stacked from Satyaloka (top) to Patala (bottom),
   with the earthly plane (Bhu) at the centre and the wheel of luminaries
   rising through Svarloka. The three worlds Bhu/Bhuvar/Svar — the Triloka
   proper — are highlighted.

   Vertical scale is schematic (the true distances are astronomically
   disproportionate); ordering and the relative heights of the luminaries
   follow Srimad Bhagavatam 5.22-24.
   ===================================================================== */

window.TrilokaView = (function () {
  const HW = 300;            // half-width of the world column (world units)
  let bands = [];            // ordered band layout
  let total = 0;             // total world height
  let lumis = [];            // luminary placements
  let svarBand = null;
  const cam = { scale: 1, y: 0, baseScale: 1 };
  let regions = [];          // screen-space hit regions, rebuilt each frame
  let env = { w: 0, h: 0 };

  /* ---- build the stacked layout (top -> bottom) ---- */
  function build() {
    const order = [
      ["satya", 64], ["tapas", 56], ["jana", 56], ["mahar", 58],
      ["svar", 248], ["bhuvar", 78], ["bhu", 30],
      ["atala", 30], ["vitala", 30], ["sutala", 30], ["talatala", 30],
      ["mahatala", 30], ["rasatala", 30], ["patala", 32],
    ];
    bands = [];
    let y = 0;
    for (const [key, hgt] of order) {
      const loka = LOKAS.find((l) => l.key === key);
      bands.push({ key, y0: y, y1: y + hgt, h: hgt, loka });
      y += hgt;
    }
    // Garbhodaka ocean / Ananta-Sesha at the very base
    bands.push({
      key: "garbhodaka", y0: y, y1: y + 74, h: 74,
      loka: {
        name: "Garbhodaka Ocean", altName: "& Ananta-Sesha",
        color: "#1b3a52", group: "base", triloka: false,
        ruler: "Lord Ananta (Sankarshana)",
        summary:
          "Beneath the lowest world lies the Garbhodaka ocean, upon which rests the thousand-hooded serpent Ananta-Sesha. Upon a single one of His hoods this entire universe rests like a mustard seed.",
        reference: "SB 5.25",
      },
    });
    y += 74;
    total = y;
    svarBand = bands.find((b) => b.key === "svar");
    placeLuminaries();
  }

  /* ---- place the jyotir-chakra inside / above Svarloka by log height ---- */
  function placeLuminaries() {
    const hs = LUMINARIES.map((l) => Math.log(l.heightYojanas));
    const lo = Math.min(...hs), hi = Math.max(...hs);
    // Sun sits at the boundary of Bhuvar/Svar (bottom of Svar); Dhruva at top.
    const bottom = svarBand.y1 - 8;
    const topY = svarBand.y0 + 14;
    lumis = LUMINARIES.map((l, i) => {
      const f = (Math.log(l.heightYojanas) - lo) / (hi - lo);
      return {
        data: l,
        wy: bottom - f * (bottom - topY),
        amp: 60 + (i % 3) * 34,
        spd: 0.00018 + (i % 5) * 0.00006,
        ph: i * 1.7,
      };
    });
  }

  /* ---- world -> screen ---- */
  function sx(wx) { return env.w / 2 + wx * cam.scale; }
  function sy(wy) { return env.h / 2 + (wy - cam.y) * cam.scale; }

  function reset(e) {
    env = e;
    if (!bands.length) build();
    cam.baseScale = (e.h - 40) / total;
    cam.scale = cam.baseScale;
    cam.y = total / 2;
  }

  function clampCam() {
    const minS = cam.baseScale * 0.6;
    const maxS = cam.baseScale * 6;
    cam.scale = Math.max(minS, Math.min(maxS, cam.scale));
    const half = env.h / 2 / cam.scale;
    cam.y = Math.max(half - 10, Math.min(total - half + 10, cam.y));
  }

  function onWheel(e) {
    const before = cam.y + (e.offsetY - env.h / 2) / cam.scale;
    cam.scale *= e.deltaY < 0 ? 1.12 : 0.89;
    clampCam();
    cam.y = before - (e.offsetY - env.h / 2) / cam.scale;
    clampCam();
  }
  function onDrag(dx, dy) { cam.y -= dy / cam.scale; clampCam(); }

  /* ---- drawing ---- */
  function eggPath(ctx) {
    const cx = sx(0), cy = sy(total / 2);
    const rx = HW * 1.22 * cam.scale;
    const ry = (total / 2) * 1.05 * cam.scale;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  }

  function draw(ctx, e, t) {
    env = e;
    regions = [];
    const w = e.w, h = e.h;
    ctx.clearRect(0, 0, w, h);

    // soft inner glow of the egg
    const cx = sx(0), cy = sy(total / 2);
    const ry = (total / 2) * 1.05 * cam.scale;
    const g = ctx.createRadialGradient(cx, cy, 10, cx, cy, ry * 1.1);
    g.addColorStop(0, "rgba(40,30,60,0.55)");
    g.addColorStop(1, "rgba(8,6,16,0)");
    ctx.fillStyle = g;
    eggPath(ctx); ctx.fill();

    // clip everything to the egg
    ctx.save();
    eggPath(ctx); ctx.clip();

    const left = sx(-HW), right = sx(HW), bw = right - left;

    // bands
    for (const b of bands) {
      const y0 = sy(b.y0), y1 = sy(b.y1);
      if (y1 < -40 || y0 > h + 40) continue;
      const lk = b.loka;
      const grad = ctx.createLinearGradient(0, y0, 0, y1);
      grad.addColorStop(0, hexA(lk.color, b.key === "svar" ? 0.05 : 0.14));
      grad.addColorStop(0.5, hexA(lk.color, b.key === "svar" ? 0.12 : 0.30));
      grad.addColorStop(1, hexA(lk.color, b.key === "svar" ? 0.05 : 0.14));
      ctx.fillStyle = grad;
      ctx.fillRect(left, y0, bw, y1 - y0);

      // divider line
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(left, y0); ctx.lineTo(right, y0); ctx.stroke();

      regions.push({ type: "rect", x: left, y: y0, w: bw, h: y1 - y0, info: lokaInfo(lk) });

      // labels
      if (e.showLabels && y1 - y0 > 16) {
        ctx.fillStyle = b.key === "bhu" ? "#fff4d8" : "rgba(245,236,220,0.92)";
        ctx.font = "600 13px Georgia, 'Times New Roman', serif";
        ctx.textAlign = "left";
        ctx.fillText(lk.name, left + 14, (y0 + y1) / 2 + 4);
        if (lk.altName) {
          ctx.fillStyle = "rgba(200,190,170,0.55)";
          ctx.font = "italic 11px Georgia, serif";
          ctx.textAlign = "right";
          ctx.fillText(lk.altName, right - 12, (y0 + y1) / 2 + 4);
        }
      }
    }

    // the Bhu plane — bright edge-on disc
    const bhu = bands.find((b) => b.key === "bhu");
    if (bhu) {
      const by = sy((bhu.y0 + bhu.y1) / 2);
      const lg = ctx.createLinearGradient(left, 0, right, 0);
      lg.addColorStop(0, "rgba(255,200,110,0)");
      lg.addColorStop(0.5, "rgba(255,214,130,0.95)");
      lg.addColorStop(1, "rgba(255,200,110,0)");
      ctx.strokeStyle = lg; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(left, by); ctx.lineTo(right, by); ctx.stroke();
    }

    // luminaries within Svar
    drawLuminaries(ctx, t, e);

    // Mount Meru rising from the Bhu plane through the middle worlds
    drawMeru(ctx);

    ctx.restore(); // unclip

    // egg shell outline
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255,196,92,0.5)";
    eggPath(ctx); ctx.stroke();
    ctx.lineWidth = 6;
    ctx.strokeStyle = "rgba(255,157,46,0.06)";
    eggPath(ctx); ctx.stroke();

    // Triloka bracket
    drawTrilokaBracket(ctx, e);

    // group labels (upper / lower)
    drawAxisTags(ctx, e);
  }

  function drawLuminaries(ctx, t, e) {
    for (const L of lumis) {
      const wx = Math.sin(t * L.spd + L.ph) * L.amp;
      const x = sx(wx), y = sy(L.wy);
      const r = L.data.radius * Math.min(1.4, cam.scale / cam.baseScale + 0.4);
      // glow
      const gg = ctx.createRadialGradient(x, y, 0, x, y, r * 3.2);
      gg.addColorStop(0, hexA(L.data.glow, 0.85));
      gg.addColorStop(1, hexA(L.data.glow, 0));
      ctx.fillStyle = gg;
      ctx.beginPath(); ctx.arc(x, y, r * 3.2, 0, Math.PI * 2); ctx.fill();
      // body
      const bg = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 1, x, y, r);
      bg.addColorStop(0, "#fff");
      bg.addColorStop(0.4, L.data.color);
      bg.addColorStop(1, hexA(L.data.color, 0.7));
      ctx.fillStyle = bg;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();

      regions.push({ type: "circle", cx: x, cy: y, r: r + 6, info: lumiInfo(L.data) });

      if (e.showLabels && cam.scale > cam.baseScale * 0.9) {
        ctx.fillStyle = "rgba(255,244,216,0.85)";
        ctx.font = "11px Inter, system-ui, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(L.data.name, x + r + 6, y + 3);
      }
    }
  }

  function drawMeru(ctx) {
    // Meru drawn as a slender golden cone rising from Bhu up to Svar region
    const bhu = bands.find((b) => b.key === "bhu");
    const top = svarBand.y0 + svarBand.h * 0.45;
    const y0 = sy(bhu.y0), y1 = sy(top);
    const baseHalf = 10 * cam.scale, topHalf = 20 * cam.scale;
    const cxp = sx(0);
    const grd = ctx.createLinearGradient(cxp - topHalf, 0, cxp + topHalf, 0);
    grd.addColorStop(0, "rgba(180,120,30,0.85)");
    grd.addColorStop(0.5, "#ffe08a");
    grd.addColorStop(1, "rgba(180,120,30,0.85)");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.moveTo(cxp - baseHalf, y0);
    ctx.lineTo(cxp + baseHalf, y0);
    ctx.lineTo(cxp + topHalf, y1);
    ctx.lineTo(cxp - topHalf, y1);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(255,240,180,0.5)"; ctx.lineWidth = 1; ctx.stroke();
    regions.push({ type: "rect", x: cxp - topHalf, y: y1, w: topHalf * 2, h: y0 - y1, info: meruInfo() });
  }

  function drawTrilokaBracket(ctx, e) {
    const svar = bands.find((b) => b.key === "svar");
    const bhu = bands.find((b) => b.key === "bhu");
    const yTop = sy(svar.y0), yBot = sy(bhu.y1);
    const x = sx(-HW) - 16;
    if (yBot < 0 || yTop > e.h) return;
    ctx.strokeStyle = "rgba(255,179,71,0.9)"; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 8, yTop); ctx.lineTo(x, yTop);
    ctx.lineTo(x, yBot); ctx.lineTo(x + 8, yBot);
    ctx.stroke();
    ctx.save();
    ctx.translate(x - 8, (yTop + yBot) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = "rgba(255,179,71,0.95)";
    ctx.font = "700 12px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("T R I L O K A", 0, 0);
    ctx.restore();
  }

  function drawAxisTags(ctx, e) {
    ctx.font = "600 10px Inter, system-ui, sans-serif";
    ctx.fillStyle = "rgba(180,172,152,0.6)";
    ctx.textAlign = "center";
    const satya = bands[0], patala = bands[bands.length - 2];
    const ty = sy(satya.y0) - 6;
    if (ty > 12) ctx.fillText("↑ HIGHER WORLDS (subtler, more pious)", e.w / 2, ty);
    const py = sy(bands[bands.length - 1].y1) + 14;
    if (py < e.h) ctx.fillText("↓ LOWER WORLDS (subterranean)", e.w / 2, py);
  }

  /* ---- info builders ---- */
  function lokaInfo(lk) {
    const facts = [];
    if (lk.ruler) facts.push(["Presiding being", lk.ruler]);
    if (lk.group) facts.push(["Domain", lk.group === "upper" ? "Higher world" : lk.group === "lower" ? "Lower world" : lk.group === "earth" ? "Earthly plane" : "Foundation"]);
    return {
      eyebrow: lk.triloka ? "Triloka — one of the three worlds" : (lk.group === "upper" ? "Higher planetary system" : lk.group === "lower" ? "Lower planetary system" : "The earthly plane"),
      name: lk.name, alt: lk.altName, ref: lk.reference,
      body: lk.summary, facts, triloka: lk.triloka,
    };
  }
  function lumiInfo(L) {
    return {
      eyebrow: "Jyotir-chakra — wheel of light",
      name: L.name, alt: null, ref: L.reference, body: L.note,
      facts: [["Height above Bhu", fmt(L.heightYojanas) + " yojanas"], ["≈ in miles", milesOf(L.heightYojanas) + " mi"]],
      triloka: false,
    };
  }
  function meruInfo() {
    return {
      eyebrow: "Axis of the universe",
      name: MERU.name, alt: null, ref: MERU.reference, body: MERU.note,
      facts: [
        ["Total height", fmt(MERU.heightYojanas) + " yojanas (" + milesOf(MERU.heightYojanas) + " mi)"],
        ["Below the earth", fmt(MERU.belowEarthYojanas) + " yojanas"],
        ["Summit width", fmt(MERU.summitWidthYojanas) + " yojanas"],
        ["Base width", fmt(MERU.baseWidthYojanas) + " yojanas"],
        ["Material", MERU.material],
      ],
      triloka: false,
    };
  }

  function hitTest(mx, my) {
    // topmost first: circles (luminaries) & meru, then bands
    for (let i = regions.length - 1; i >= 0; i--) {
      const r = regions[i];
      if (r.type === "circle") {
        const dx = mx - r.cx, dy = my - r.cy;
        if (dx * dx + dy * dy <= r.r * r.r) return r.info;
      }
    }
    for (const r of regions) {
      if (r.type === "rect" && mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) {
        return r.info;
      }
    }
    return null;
  }

  function hexA(hex, a) {
    const c = hex.replace("#", "");
    const n = c.length === 3 ? c.split("").map((x) => x + x).join("") : c;
    const r = parseInt(n.slice(0, 2), 16), g = parseInt(n.slice(2, 4), 16), b = parseInt(n.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  }

  return {
    id: "triloka",
    title: "The Triloka & Fourteen Worlds",
    subtitle: "A vertical cross-section of the cosmic egg — Satyaloka above, Patala below, the earthly plane at the centre, and the wheel of luminaries rising through the heavens.",
    navName: "Fourteen Worlds",
    navSub: "Vertical cross-section",
    accent: "#ffb347",
    hint: "Scroll to zoom · drag to travel up & down the worlds · hover any realm",
    reset, draw, hitTest, onWheel, onDrag,
  };
})();
