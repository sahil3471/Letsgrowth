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
  const KRISHNA = { x: 250, y: 185 };
  const VISHNU = { x: 350, y: 500, r: 150 };
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
    const S = { x: VISHNU.x + 150, y: VISHNU.y - 30 }, C = { x: 660, y: 540 }, E = { x: 980, y: 280 };
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
    ctx.fillStyle = bg;
    if (e.glActive) { ctx.globalAlpha = 0.5; ctx.fillRect(0, 0, w, h); ctx.globalAlpha = 1; }
    else ctx.fillRect(0, 0, w, h);
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

    // --- Sri Krishna in Goloka + descending beam to Maha-Vishnu ---
    const kx = sx(KRISHNA.x), ky = sy(KRISHNA.y), ks = ss(82);
    drawGolokaRealm(ctx, kx, ky, ks, t);
    const beam = ctx.createLinearGradient(kx, ky, sx(VISHNU.x), sy(VISHNU.y));
    beam.addColorStop(0, "rgba(255,225,150,0.40)"); beam.addColorStop(1, "rgba(120,150,255,0)");
    ctx.strokeStyle = beam; ctx.lineWidth = ss(8);
    ctx.beginPath(); ctx.moveTo(kx, ky + ks * 0.9); ctx.lineTo(sx(VISHNU.x), sy(VISHNU.y) - ss(70)); ctx.stroke();
    drawKrishna(ctx, kx, ky, ks, t);
    regions.push({ type: "circle", cx: kx, cy: ky, r: ks, info: hierInfo("krishna", "The source of all"), pr: 5 });
    label(ctx, e, "Sri Krishna · Goloka Vrindavana", kx, ky - ks * 1.08, "center");

    // --- Maha-Vishnu reclining on Ananta-Shesha upon the Causal Ocean ---
    const vs = ss(VISHNU.r) * 0.8 * (0.97 + 0.06 * breath);
    drawRecliningVishnu(ctx, sx(VISHNU.x), sy(VISHNU.y), vs, t, { hoods: 7 });
    regions.push({ type: "ellipse", cx: sx(VISHNU.x), cy: sy(VISHNU.y), rx: vs * 1.7, ry: vs * 0.95, info: hierInfo("mahavishnu", "First purusha-avatar"), pr: 4 });
    label(ctx, e, "Maha-Vishnu — reclining on the Causal Ocean", sx(VISHNU.x), sy(VISHNU.y) + vs * 0.88 + 16, "center");

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

  /* small geometry helpers for the luminous figures */
  function ell(ctx, x, y, rx, ry, rot, color) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0);
    ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  function capsule(ctx, x1, y1, x2, y2, w, color) {
    ctx.strokeStyle = color; ctx.lineCap = "round"; ctx.lineWidth = w;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  }

  /* The golden self-effulgent realm of Goloka behind Krishna */
  function drawGolokaRealm(ctx, kx, ky, s, t) {
    GFX.glow(ctx, kx, ky, 2.4 * s, "#ffcf6a", 0.40);
    GFX.glow(ctx, kx, ky, 1.4 * s, "#fff3cf", 0.45);
    ctx.strokeStyle = "rgba(255,228,150,0.16)"; ctx.lineWidth = 1;
    for (let i = 1; i <= 3; i++) { ctx.beginPath(); ctx.arc(kx, ky, s * (0.95 + i * 0.42), 0, Math.PI * 2); ctx.stroke(); }
    for (let i = 0; i < 12; i++) {
      const a = i * 2.4 + t * 0.0003, rr = s * (1.05 + (i % 3) * 0.38);
      const mx = kx + Math.cos(a) * rr, my = ky + Math.sin(a) * rr * 0.7;
      ctx.fillStyle = "rgba(255,242,196," + (0.25 + 0.3 * Math.sin(t * 0.002 + i)) + ")";
      ctx.beginPath(); ctx.arc(mx, my, 1.6, 0, Math.PI * 2); ctx.fill();
    }
  }

  /* Sri Krishna — luminous tribhanga silhouette with flute & peacock crown */
  function drawKrishna(ctx, cx, cy, s, t) {
    const body = "#3a4790", bodyHi = "#7184d8", gold = "#ffd676", goldHi = "#fff0c0";
    const sway = Math.sin(t * 0.0009) * 0.02 * s;
    const P = (dx, dy) => [cx + dx * s, cy + dy * s];
    // legs (tribhanga, crossed at the ankle)
    capsule(ctx, ...P(0.0, 0.92), ...P(0.07, 0.22), 0.15 * s, body);
    capsule(ctx, ...P(0.07, 0.22), ...P(-0.22, 0.92), 0.14 * s, body);
    ell(ctx, cx - 0.24 * s, cy + 0.93 * s, 0.1 * s, 0.06 * s, 0.25, body);
    ell(ctx, cx + 0.02 * s, cy + 0.93 * s, 0.1 * s, 0.06 * s, -0.1, body);
    // dhoti (gold)
    ell(ctx, cx - 0.02 * s, cy + 0.30 * s, 0.24 * s, 0.2 * s, 0.05, gold);
    ctx.globalAlpha = 0.5; ell(ctx, cx - 0.06 * s, cy + 0.26 * s, 0.12 * s, 0.1 * s, 0.05, goldHi); ctx.globalAlpha = 1;
    // torso (bent left for tribhanga)
    ell(ctx, cx - 0.05 * s, cy - 0.05 * s, 0.18 * s, 0.3 * s, 0.08, body);
    ctx.globalAlpha = 0.45; ell(ctx, cx - 0.11 * s, cy - 0.04 * s, 0.07 * s, 0.22 * s, 0.08, bodyHi); ctx.globalAlpha = 1;
    // shoulders
    ell(ctx, cx + 0.0 * s, cy - 0.34 * s, 0.2 * s, 0.12 * s, 0, body);
    // arms raised, hands meeting at the flute by the mouth
    capsule(ctx, ...P(0.15, -0.32), ...P(0.3, -0.52), 0.08 * s, body);
    capsule(ctx, ...P(0.3, -0.52), ...P(0.17, -0.64), 0.07 * s, body);
    capsule(ctx, ...P(-0.15, -0.32), ...P(-0.02, -0.52), 0.08 * s, body);
    capsule(ctx, ...P(-0.02, -0.52), ...P(0.11, -0.64), 0.07 * s, body);
    // flute
    capsule(ctx, ...P(-0.06, -0.64), ...P(0.52, -0.5), 0.045 * s, goldHi);
    // neck + head
    capsule(ctx, ...P(0.0, -0.5), ...P(0.02, -0.62), 0.09 * s, body);
    ell(ctx, cx + 0.02 * s, cy - 0.72 * s, 0.13 * s, 0.15 * s, 0, body);
    ctx.globalAlpha = 0.5; ell(ctx, cx - 0.02 * s, cy - 0.74 * s, 0.05 * s, 0.08 * s, 0, bodyHi); ctx.globalAlpha = 1;
    // peacock crown
    peacockCrown(ctx, cx + 0.02 * s + sway, cy - 0.86 * s, s);
    // golden rim halo around the head
    ctx.strokeStyle = "rgba(255,224,150,0.5)"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(cx + 0.02 * s, cy - 0.72 * s, 0.2 * s, 0, Math.PI * 2); ctx.stroke();
  }

  function peacockCrown(ctx, x, y, s) {
    const feathers = 5;
    for (let i = 0; i < feathers; i++) {
      const a = (-1 + 2 * i / (feathers - 1)) * 0.7;
      ctx.save(); ctx.translate(x, y); ctx.rotate(a);
      capsule(ctx, 0, 0, 0, -0.34 * s, 0.03 * s, "#2f8f6a");
      ctx.fillStyle = "#1f9bd0"; ctx.beginPath(); ctx.ellipse(0, -0.37 * s, 0.05 * s, 0.09 * s, 0, 0, Math.PI * 2); ctx.fill();
      GFX.glow(ctx, 0, -0.37 * s, 0.05 * s, "#8be0ff", 0.6);
      ctx.fillStyle = "#1c5a3a"; ctx.beginPath(); ctx.arc(0, -0.37 * s, 0.024 * s, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = "#ffd676"; ctx.beginPath(); ctx.ellipse(x, y + 0.02 * s, 0.14 * s, 0.05 * s, 0, 0, Math.PI * 2); ctx.fill();
  }

  /* Maha-Vishnu / Garbhodakasayi reclining on the many-hooded serpent Ananta-Shesha */
  function drawRecliningVishnu(ctx, cx, cy, s, t, opts) {
    opts = opts || {};
    const body = opts.bodyC || "#cfe0ff", bodyHi = opts.bodyHi || "#ffffff";
    const serpent = opts.serpentC || "#2f7d86", serpentHi = opts.serpentHi || "#63cccc";
    const crownC = opts.crownC || "#ffd56a", glowC = opts.glowC || "#9fc4ff";
    const hoods = opts.hoods || 5;
    const P = (dx, dy) => [cx + dx * s, cy + dy * s];

    GFX.glow(ctx, cx, cy - 0.05 * s, 2.0 * s, glowC, 0.42);
    GFX.glow(ctx, cx, cy + 0.62 * s, 1.5 * s, glowC, 0.16); // reflection on the water

    // serpent couch (coils)
    for (let i = -1; i <= 1; i++) ell(ctx, cx + i * 0.62 * s, cy + 0.52 * s, 0.72 * s, 0.27 * s, 0, serpent);
    ctx.globalAlpha = 0.5;
    for (let i = -1; i <= 1; i++) ell(ctx, cx + i * 0.62 * s, cy + 0.42 * s, 0.6 * s, 0.11 * s, 0, serpentHi);
    ctx.globalAlpha = 1;
    // serpent neck
    capsule(ctx, ...P(-1.2, 0.5), ...P(-1.5, -0.3), 0.2 * s, serpent);
    // fan of hoods forming a canopy over the head
    const hx = cx - 1.5 * s, hy = cy - 0.48 * s;
    for (let k = 0; k < hoods; k++) {
      const a = (-1 + 2 * k / (hoods - 1)) * 0.72;
      ctx.save(); ctx.translate(hx, hy); ctx.rotate(a);
      ctx.fillStyle = serpent; ctx.beginPath(); ctx.ellipse(0, -0.34 * s, 0.14 * s, 0.32 * s, 0, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 0.6; ctx.fillStyle = serpentHi; ctx.beginPath(); ctx.ellipse(0, -0.4 * s, 0.06 * s, 0.16 * s, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
      GFX.glow(ctx, 0, -0.18 * s, 0.07 * s, "#bff0ff", 0.8); // hood-jewel
      ctx.restore();
    }

    // reclining deity body (assembled from luminous parts)
    ell(ctx, cx - 0.1 * s, cy + 0.12 * s, 0.6 * s, 0.22 * s, -0.12, body);   // torso
    ell(ctx, cx + 0.4 * s, cy + 0.16 * s, 0.26 * s, 0.2 * s, 0, body);       // hips
    ell(ctx, cx - 0.55 * s, cy + 0.02 * s, 0.26 * s, 0.22 * s, 0, body);     // chest
    capsule(ctx, ...P(0.4, 0.16), ...P(0.95, 0.26), 0.22 * s, body);          // thigh
    capsule(ctx, ...P(0.95, 0.26), ...P(1.5, 0.34), 0.18 * s, body);          // shin
    ell(ctx, cx + 1.5 * s, cy + 0.34 * s, 0.12 * s, 0.09 * s, 0.3, body);    // feet
    capsule(ctx, ...P(-0.55, 0.05), ...P(-1.02, 0.42), 0.13 * s, body);       // upper arm
    capsule(ctx, ...P(-1.02, 0.42), ...P(-0.93, 0.12), 0.12 * s, body);       // forearm
    ell(ctx, cx - 0.9 * s, cy + 0.08 * s, 0.1 * s, 0.1 * s, 0, body);        // resting hand
    GFX.glow(ctx, cx - 0.95 * s, cy - 0.12 * s, 0.44 * s, crownC, 0.8);        // halo
    ell(ctx, cx - 0.95 * s, cy - 0.12 * s, 0.24 * s, 0.26 * s, 0, body);     // head
    // highlights
    ctx.globalAlpha = 0.5; ell(ctx, cx - 0.2 * s, cy + 0.02 * s, 0.4 * s, 0.11 * s, -0.12, bodyHi);
    ell(ctx, cx - 1.0 * s, cy - 0.18 * s, 0.08 * s, 0.1 * s, 0, bodyHi); ctx.globalAlpha = 1;
    // crown
    ctx.fillStyle = crownC;
    ctx.beginPath(); ctx.moveTo(...P(-1.12, -0.28)); ctx.lineTo(...P(-0.95, -0.56)); ctx.lineTo(...P(-0.78, -0.28)); ctx.closePath(); ctx.fill();
    // attributes as light glints (conch, lotus)
    GFX.glow(ctx, cx - 0.2 * s, cy - 0.1 * s, 0.1 * s, "#fff0d0", 0.8);
    GFX.glow(ctx, cx + 0.15 * s, cy - 0.14 * s, 0.09 * s, "#ffd0e0", 0.7);
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

    // Garbhodakasayi Vishnu reclining on the Garbhodaka ocean
    drawRecliningVishnu(ctx, cx, oy0 + ry * 0.14, rx * 0.32 * (0.97 + 0.06 * breath), t, { hoods: 5, glowC: "#7fd0ff" });

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
    glTint: [0.34, 0.34, 0.72], glNebula: 1.0,
    reset, draw, hitTest, onWheel, onDrag,
  };
})();
