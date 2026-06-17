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
  const GFX = window.GFX;
  const HW = 300;            // half-width of the world column (world units)
  let bands = [];            // ordered band layout
  let total = 0;             // total world height
  let lumis = [];            // luminary placements
  let svarBand = null;
  const cam = { scale: 1, y: 0, baseScale: 1 };
  let regions = [];          // screen-space hit regions, rebuilt each frame
  let dhruvaScreen = null;    // tracked position of Dhruvaloka (Shishumara pivot)
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

  function bandKind(lk, key) {
    if (key === "svar") return "space";
    if (key === "bhuvar") return "sky";
    if (key === "bhu") return "earth";
    if (key === "garbhodaka") return "liquid";
    if (lk.group === "upper") return "cloud";
    return "rock";
  }

  function draw(ctx, e, t) {
    env = e;
    regions = [];
    const w = e.w, h = e.h;
    ctx.clearRect(0, 0, w, h);

    const cx = sx(0), cy = sy(total / 2);
    const ry = (total / 2) * 1.05 * cam.scale;
    const rx = HW * 1.22 * cam.scale;

    // deep interior atmosphere of the cosmic egg
    const g = ctx.createRadialGradient(cx, cy - ry * 0.2, 10, cx, cy, ry * 1.15);
    g.addColorStop(0, "rgba(46,34,72,0.6)");
    g.addColorStop(0.6, "rgba(20,14,34,0.5)");
    g.addColorStop(1, "rgba(6,5,14,0)");
    ctx.fillStyle = g; eggPath(ctx); ctx.fill();

    // clip everything to the egg
    ctx.save();
    eggPath(ctx); ctx.clip();

    const left = sx(-HW), right = sx(HW), bw = right - left;

    for (const b of bands) {
      const y0 = sy(b.y0), y1 = sy(b.y1);
      if (y1 < -60 || y0 > h + 60) continue;
      const lk = b.loka, kind = bandKind(lk, b.key);
      const a0 = kind === "space" ? 0.04 : 0.16, a1 = kind === "space" ? 0.10 : 0.34;
      const grad = ctx.createLinearGradient(0, y0, 0, y1);
      grad.addColorStop(0, hexA(lk.color, a0));
      grad.addColorStop(0.5, hexA(lk.color, a1));
      grad.addColorStop(1, hexA(lk.color, a0));
      ctx.fillStyle = grad; ctx.fillRect(left, y0, bw, y1 - y0);

      drawBandTexture(ctx, left, y0, bw, y1 - y0, kind, t);

      ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(left, y0); ctx.lineTo(right, y0); ctx.stroke();

      regions.push({ type: "rect", x: left, y: y0, w: bw, h: y1 - y0, info: lokaInfo(lk) });

      if (e.showLabels && y1 - y0 > 16) {
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.7)"; ctx.shadowBlur = 6;
        ctx.fillStyle = b.key === "bhu" ? "#fff4d8" : "rgba(248,240,224,0.95)";
        ctx.font = "600 13px Georgia, 'Times New Roman', serif";
        ctx.textAlign = "left";
        ctx.fillText(lk.name, left + 14, (y0 + y1) / 2 + 4);
        ctx.restore();
        if (lk.altName) {
          ctx.fillStyle = "rgba(210,200,178,0.6)";
          ctx.font = "italic 11px Georgia, serif"; ctx.textAlign = "right";
          ctx.fillText(lk.altName, right - 12, (y0 + y1) / 2 + 4);
        }
      }
    }

    drawBhuPlane(ctx, left, right);
    drawLuminaries(ctx, t, e);
    drawShishumara(ctx, t, e);
    drawMeru(ctx, t);

    ctx.restore(); // unclip

    drawEggShell(ctx, cx, cy, rx, ry);
    drawTrilokaBracket(ctx, e);
    drawViratAxis(ctx, e);
    drawAxisTags(ctx, e);
  }

  function drawShishumara(ctx, t, e) {
    if (!dhruvaScreen) return;
    const rr = 64 * cam.scale;
    ctx.save();
    ctx.translate(dhruvaScreen.x, dhruvaScreen.y); ctx.rotate(t * 0.00018);
    ctx.strokeStyle = "rgba(180,210,255,0.22)"; ctx.lineWidth = 1.2; ctx.setLineDash([3, 7]);
    ctx.beginPath(); ctx.ellipse(0, 0, rr, rr * 0.42, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, 0, rr * 0.6, rr * 0.25, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]); ctx.restore();
    if (e.showLabels && cam.scale > cam.baseScale * 0.9) {
      ctx.fillStyle = "rgba(180,210,255,0.7)"; ctx.font = "italic 10px Georgia, serif"; ctx.textAlign = "center";
      ctx.fillText("Shishumara-chakra", dhruvaScreen.x, dhruvaScreen.y - rr * 0.42 - 6);
    }
  }

  function drawViratAxis(ctx, e) {
    const satya = bands[0], patala = bands.find((b) => b.key === "patala");
    if (!satya || !patala) return;
    const x = sx(HW) + 14, yTop = sy(satya.y0), yBot = sy(patala.y1);
    if (yBot < 10 || yTop > e.h - 10) return;
    ctx.strokeStyle = "rgba(150,200,255,0.7)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x - 8, yTop); ctx.lineTo(x, yTop); ctx.lineTo(x, yBot); ctx.lineTo(x - 8, yBot); ctx.stroke();
    ctx.fillStyle = "rgba(190,215,255,0.85)"; ctx.font = "9px Inter, system-ui, sans-serif"; ctx.textAlign = "left";
    const anchor = (key, txt) => { const b = bands.find((z) => z.key === key); if (!b) return; const yy = sy((b.y0 + b.y1) / 2); if (yy > yTop + 4 && yy < yBot - 4) ctx.fillText(txt, x + 5, yy + 3); };
    anchor("satya", "Head"); anchor("svar", "Chest"); anchor("bhuvar", "Navel"); anchor("patala", "Feet");
    ctx.save(); ctx.translate(x + 26, (yTop + yBot) / 2); ctx.rotate(Math.PI / 2);
    ctx.fillStyle = "rgba(150,200,255,0.95)"; ctx.font = "700 11px Inter, system-ui, sans-serif"; ctx.textAlign = "center";
    ctx.fillText("THE VIRATA-RUPA", 0, 0); ctx.restore();
  }

  function drawBandTexture(ctx, left, y0, bw, hgt, kind, t) {
    if (kind === "space") return;
    ctx.save();
    ctx.beginPath(); ctx.rect(left, y0, bw, hgt); ctx.clip();
    if (kind === "cloud" || kind === "sky") {
      const tile = GFX.noiseTile("cloudTile", 220, 4, 5);
      ctx.globalAlpha = 0.28; ctx.globalCompositeOperation = "overlay";
      const off = (t * 0.004) % 220;
      GFX.tile(ctx, tile, left, y0, left + bw, y0 + hgt, env.w, env.h, off, 0);
    } else if (kind === "rock") {
      const tile = GFX.noiseTile("rockTile", 160, 7, 5);
      ctx.globalAlpha = 0.5; ctx.globalCompositeOperation = "multiply";
      GFX.tile(ctx, tile, left, y0, left + bw, y0 + hgt, env.w, env.h, 0, 0);
      // serpent-jewel glints in the dark lower worlds
      ctx.globalCompositeOperation = "screen"; ctx.globalAlpha = 1;
      for (let i = 0; i < 5; i++) {
        const gx = left + ((i * 97 + (t * 0.02)) % bw), gy = y0 + (hgt * ((i * 0.37) % 1));
        GFX.glow(ctx, gx, gy, 6, "#9fe6ff", 0.5);
      }
    } else if (kind === "liquid") {
      const tile = GFX.noiseTile("oceanTile", 160, 10, 4);
      ctx.globalAlpha = 0.25; ctx.globalCompositeOperation = "overlay";
      const off = (t * 0.01) % 160;
      GFX.tile(ctx, tile, left, y0, left + bw, y0 + hgt, env.w, env.h, off, 0);
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
    ctx.restore();
  }

  function drawBhuPlane(ctx, left, right) {
    const bhu = bands.find((b) => b.key === "bhu");
    if (!bhu) return;
    const by = sy((bhu.y0 + bhu.y1) / 2);
    // atmospheric haze above & below the plane
    const haze = ctx.createLinearGradient(0, by - 26, 0, by + 26);
    haze.addColorStop(0, "rgba(255,200,110,0)");
    haze.addColorStop(0.5, "rgba(255,210,130,0.22)");
    haze.addColorStop(1, "rgba(255,200,110,0)");
    ctx.fillStyle = haze; ctx.fillRect(left, by - 26, right - left, 52);
    // the bright edge-on disc
    const lg = ctx.createLinearGradient(left, 0, right, 0);
    lg.addColorStop(0, "rgba(255,200,110,0)");
    lg.addColorStop(0.5, "rgba(255,236,180,1)");
    lg.addColorStop(1, "rgba(255,200,110,0)");
    ctx.strokeStyle = lg; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(left, by); ctx.lineTo(right, by); ctx.stroke();
    ctx.lineWidth = 1; ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.beginPath(); ctx.moveTo(left + (right - left) * 0.2, by); ctx.lineTo(left + (right - left) * 0.8, by); ctx.stroke();
  }

  function drawEggShell(ctx, cx, cy, rx, ry) {
    // outer bloom
    ctx.lineWidth = 8; ctx.strokeStyle = "rgba(255,157,46,0.05)";
    ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
    // glassy rim with a fresnel-like highlight at the top
    const grad = ctx.createLinearGradient(0, cy - ry, 0, cy + ry);
    grad.addColorStop(0, "rgba(255,236,190,0.85)");
    grad.addColorStop(0.5, "rgba(255,196,92,0.35)");
    grad.addColorStop(1, "rgba(180,120,40,0.5)");
    ctx.lineWidth = 2; ctx.strokeStyle = grad;
    ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
    // top specular arc
    ctx.lineWidth = 2.5; ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, -Math.PI * 0.72, -Math.PI * 0.28); ctx.stroke();
  }

  function drawLuminaries(ctx, t, e) {
    const sizeF = Math.min(1.5, cam.scale / cam.baseScale + 0.4);
    for (const L of lumis) {
      const wx = Math.sin(t * L.spd + L.ph) * L.amp;
      const x = sx(wx), y = sy(L.wy);
      const r = L.data.radius * sizeF;
      const rd = L.data.render || { type: "rocky" };

      if (rd.type === "sun") GFX.drawSun(ctx, x, y, r, t);
      else if (rd.type === "star") { GFX.drawStar(ctx, x, y, r, t); dhruvaScreen = { x: x, y: y, r: r }; }
      else if (rd.type === "cluster") drawCluster(ctx, x, y, r, rd.count, t);
      else GFX.drawPlanet(ctx, x, y, r, Object.assign({ glow: L.data.glow }, rd));

      regions.push({ type: "circle", cx: x, cy: y, r: r * 1.6 + 6, info: lumiInfo(L.data) });

      if (e.showLabels && cam.scale > cam.baseScale * 0.85) {
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.8)"; ctx.shadowBlur = 5;
        ctx.fillStyle = "rgba(255,246,222,0.92)";
        ctx.font = "11px Inter, system-ui, sans-serif"; ctx.textAlign = "left";
        ctx.fillText(L.data.name, x + r * 1.6 + 6, y + 3);
        ctx.restore();
      }
    }
  }

  function drawCluster(ctx, x, y, r, count, t) {
    GFX.glow(ctx, x, y, r * 3, "#cfe6ff", 0.4);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + i * 1.3;
      const dist = (0.4 + ((i * 0.27) % 1)) * r * 2.2;
      const px = x + Math.cos(a) * dist, py = y + Math.sin(a) * dist * 0.7;
      const tw = 0.6 + 0.4 * Math.sin(t * 0.004 + i);
      GFX.glow(ctx, px, py, 5, "#ffffff", 0.8 * tw);
      ctx.fillStyle = "rgba(255,255,255," + tw + ")";
      ctx.beginPath(); ctx.arc(px, py, 1.6, 0, Math.PI * 2); ctx.fill();
    }
  }

  function drawMeru(ctx, t) {
    const bhu = bands.find((b) => b.key === "bhu");
    const top = svarBand.y0 + svarBand.h * 0.45;
    const y0 = sy(bhu.y0), y1 = sy(top);
    const baseHalf = 9 * cam.scale, topHalf = 19 * cam.scale;
    const cxp = sx(0);
    // base shadow on the plane
    GFX.glow(ctx, cxp, y0, topHalf * 1.6, "#000010", 0.5);
    // metallic gold body, lit from the left
    const grd = ctx.createLinearGradient(cxp - topHalf, 0, cxp + topHalf, 0);
    grd.addColorStop(0, "#6e4410");
    grd.addColorStop(0.28, "#c8841f");
    grd.addColorStop(0.5, "#fff0b8");
    grd.addColorStop(0.72, "#e0a534");
    grd.addColorStop(1, "#5e3a0e");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.moveTo(cxp - baseHalf, y0); ctx.lineTo(cxp + baseHalf, y0);
    ctx.lineTo(cxp + topHalf, y1); ctx.lineTo(cxp - topHalf, y1);
    ctx.closePath(); ctx.fill();
    // vertical facet streaks
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cxp - baseHalf, y0); ctx.lineTo(cxp + baseHalf, y0);
    ctx.lineTo(cxp + topHalf, y1); ctx.lineTo(cxp - topHalf, y1); ctx.closePath(); ctx.clip();
    for (let i = -3; i <= 3; i++) {
      ctx.strokeStyle = i % 2 ? "rgba(255,245,200,0.18)" : "rgba(110,68,16,0.22)";
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(cxp + i * topHalf / 3.5, y1); ctx.lineTo(cxp + i * baseHalf / 3.5, y0); ctx.stroke();
    }
    ctx.restore();
    // summit glow (lotus-cup) + specular
    GFX.glow(ctx, cxp, y1, topHalf * 1.8, "#ffd66a", 0.6);
    ctx.strokeStyle = "rgba(255,245,205,0.7)"; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cxp - baseHalf, y0); ctx.lineTo(cxp - topHalf, y1);
    ctx.moveTo(cxp + baseHalf, y0); ctx.lineTo(cxp + topHalf, y1); ctx.stroke();
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
    if (lk.viratPart) facts.push(["Virata-rupa", lk.viratPart]);
    if (lk.distance) facts.push(["Distance", lk.distance]);
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
    subtitle: "A vertical cross-section of the cosmic egg — Satyaloka above, Patala below, the earthly plane at the centre, and the wheel of luminaries rising through the heavens. The whole is the Virata-rupa: the universe as the body of the Lord.",
    navName: "Fourteen Worlds",
    navSub: "Vertical cross-section",
    accent: "#ffb347",
    hint: "Scroll to zoom · drag to travel up & down the worlds · hover any realm",
    reset, draw, hitTest, onWheel, onDrag,
  };
})();
