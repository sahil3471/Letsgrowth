/* =====================================================================
   GFX — shared rendering toolkit for a cinematic, non-cartoon look.
   Procedural value-noise, baked textures, lighting, atmospheric glow,
   detailed celestial bodies, vignette and film grain.  Pure canvas.
   ===================================================================== */
window.GFX = (function () {
  /* ---------- math ---------- */
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (t) => t * t * (3 - 2 * t);

  function hash2(ix, iy) {
    let h = (ix * 374761393 + iy * 668265263) | 0;
    h = (h ^ (h >> 13)) * 1274126177;
    return ((h ^ (h >> 16)) >>> 0) / 4294967295;
  }
  function valueNoise(x, y) {
    const x0 = Math.floor(x), y0 = Math.floor(y);
    const fx = smooth(x - x0), fy = smooth(y - y0);
    const a = hash2(x0, y0), b = hash2(x0 + 1, y0);
    const c = hash2(x0, y0 + 1), d = hash2(x0 + 1, y0 + 1);
    return lerp(lerp(a, b, fx), lerp(c, d, fx), fy);
  }
  function fbm(x, y, oct) {
    let sum = 0, amp = 0.5, freq = 1, norm = 0;
    for (let i = 0; i < oct; i++) {
      sum += amp * valueNoise(x * freq, y * freq);
      norm += amp; amp *= 0.5; freq *= 2;
    }
    return sum / norm;
  }

  /* ---------- colour helpers ---------- */
  function hexA(hex, a) {
    const c = hex.replace("#", "");
    const n = c.length === 3 ? c.split("").map((x) => x + x).join("") : c;
    return `rgba(${parseInt(n.slice(0,2),16)},${parseInt(n.slice(2,4),16)},${parseInt(n.slice(4,6),16)},${a})`;
  }
  function rgbOf(hex) {
    const c = hex.replace("#", "");
    const n = c.length === 3 ? c.split("").map((x) => x + x).join("") : c;
    return [parseInt(n.slice(0,2),16), parseInt(n.slice(2,4),16), parseInt(n.slice(4,6),16)];
  }
  function shade(hex, amt) {
    const [r, g, b] = rgbOf(hex);
    return `rgb(${clamp(r+amt,0,255)|0},${clamp(g+amt,0,255)|0},${clamp(b+amt,0,255)|0})`;
  }

  /* ---------- offscreen canvas + texture cache ---------- */
  function makeCanvas(w, h) {
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    return c;
  }
  const cache = {};
  function cached(key, build) {
    if (!cache[key]) cache[key] = build();
    return cache[key];
  }

  /* Tile an image across a bounding box but only within the visible
     viewport (keeps deep-zoom cheap). off shifts the pattern for drift. */
  function tile(ctx, img, bx0, by0, bx1, by1, vw, vh, ox, oy) {
    ox = ox || 0; oy = oy || 0;
    const tw = img.width, th = img.height;
    const x1 = Math.min(bx1, vw + tw), y1 = Math.min(by1, vh + th);
    const xLo = Math.max(bx0, -tw), yLo = Math.max(by0, -th);
    const sx = bx0 - ox, sy = by0 - oy;
    let startX = sx + Math.floor((xLo - sx) / tw) * tw;
    let startY = sy + Math.floor((yLo - sy) / th) * th;
    for (let y = startY; y < y1; y += th)
      for (let x = startX; x < x1; x += tw) ctx.drawImage(img, x, y);
  }

  /* Grayscale fractal-noise tile (tileable-ish via blending in use). */
  function noiseTile(key, size, freq, oct) {
    return cached(key, () => {
      const c = makeCanvas(size, size);
      const cx = c.getContext("2d");
      const img = cx.createImageData(size, size);
      const d = img.data;
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const v = fbm((x / size) * freq, (y / size) * freq, oct);
          const g = (v * 255) | 0;
          const i = (y * size + x) * 4;
          d[i] = d[i + 1] = d[i + 2] = g; d[i + 3] = 255;
        }
      }
      cx.putImageData(img, 0, 0);
      return c;
    });
  }

  /* Colourised cloudy nebula texture for backdrops. */
  function nebula(key, w, h, stops) {
    return cached(key, () => {
      const c = makeCanvas(w, h);
      const cx = c.getContext("2d");
      const img = cx.createImageData(w, h);
      const d = img.data;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const n = fbm((x / w) * 4, (y / h) * 4, 5);
          const n2 = fbm((x / w) * 9 + 5, (y / h) * 9 + 5, 4);
          const v = clamp(n * 0.7 + n2 * 0.5 - 0.25, 0, 1);
          const t = clamp(v, 0, 1);
          const col = sampleStops(stops, t);
          const a = Math.pow(t, 1.8) * 150;
          const i = (y * w + x) * 4;
          d[i] = col[0]; d[i + 1] = col[1]; d[i + 2] = col[2]; d[i + 3] = a;
        }
      }
      cx.putImageData(img, 0, 0);
      return c;
    });
  }
  function sampleStops(stops, t) {
    for (let i = 0; i < stops.length - 1; i++) {
      if (t <= stops[i + 1].t) {
        const a = stops[i], b = stops[i + 1];
        const k = (t - a.t) / (b.t - a.t || 1);
        return [lerp(a.c[0], b.c[0], k), lerp(a.c[1], b.c[1], k), lerp(a.c[2], b.c[2], k)];
      }
    }
    return stops[stops.length - 1].c;
  }

  /* ---------- glow ---------- */
  function glow(ctx, x, y, r, color, strength) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, hexA(color, strength));
    g.addColorStop(0.5, hexA(color, strength * 0.35));
    g.addColorStop(1, hexA(color, 0));
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }

  /* ---------- celestial bodies ---------- */

  /* Spherical shading: a body lit from the upper-left. */
  function sphere(ctx, x, y, r, lightHex, midHex, darkHex) {
    const lx = x - r * 0.34, ly = y - r * 0.34;
    const g = ctx.createRadialGradient(lx, ly, r * 0.05, x, y, r * 1.05);
    g.addColorStop(0, lightHex);
    g.addColorStop(0.45, midHex);
    g.addColorStop(0.85, darkHex);
    g.addColorStop(1, shade(darkHex, -30));
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }

  function clipCircle(ctx, x, y, r) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.clip();
  }

  /* The Sun: granulated photosphere, corona, animated flares, god-ray spokes. */
  function drawSun(ctx, x, y, r, t) {
    // corona
    glow(ctx, x, y, r * 4.2, "#ff8a1e", 0.55);
    glow(ctx, x, y, r * 2.6, "#ffd24a", 0.7);
    // rotating ray spokes
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(t * 0.00004);
    const spokes = 16;
    for (let i = 0; i < spokes; i++) {
      const a = (i / spokes) * Math.PI * 2;
      const len = r * (3.2 + 0.6 * Math.sin(t * 0.001 + i));
      const grd = ctx.createLinearGradient(0, 0, Math.cos(a) * len, Math.sin(a) * len);
      grd.addColorStop(0, "rgba(255,210,90,0.30)");
      grd.addColorStop(1, "rgba(255,170,0,0)");
      ctx.strokeStyle = grd; ctx.lineWidth = r * 0.5;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * len, Math.sin(a) * len); ctx.stroke();
    }
    ctx.restore();
    // photosphere disc
    ctx.save();
    clipCircle(ctx, x, y, r);
    const base = ctx.createRadialGradient(x - r * 0.2, y - r * 0.2, r * 0.2, x, y, r);
    base.addColorStop(0, "#fff6d8"); base.addColorStop(0.6, "#ffcf45"); base.addColorStop(1, "#f08a14");
    ctx.fillStyle = base; ctx.fillRect(x - r, y - r, r * 2, r * 2);
    // granulation via noise tile, animated drift
    const tile = noiseTile("sunTile", 128, 7, 4);
    ctx.globalAlpha = 0.30; ctx.globalCompositeOperation = "overlay";
    const off = (t * 0.01) % 128;
    for (let oy = -128; oy < r * 2 + 128; oy += 128)
      for (let ox = -128; ox < r * 2 + 128; ox += 128)
        ctx.drawImage(tile, x - r + ox - off, y - r + oy);
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
    ctx.restore();
    // bright limb
    ctx.strokeStyle = "rgba(255,240,200,0.8)"; ctx.lineWidth = Math.max(1, r * 0.05);
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
  }

  /* A textured planet/moon. type: 'moon','rocky','gas','icy'. */
  function drawPlanet(ctx, x, y, r, opts) {
    opts = opts || {};
    const glowC = opts.glow || "#cfd8ff";
    glow(ctx, x, y, r * 2.4, glowC, 0.4);
    ctx.save();
    clipCircle(ctx, x, y, r);
    sphere(ctx, x, y, r, opts.light || "#f4f6ff", opts.mid || "#b9c2dc", opts.dark || "#5b6480");

    if (opts.type === "gas") {
      // horizontal banding
      ctx.globalAlpha = 0.5; ctx.globalCompositeOperation = "overlay";
      const bands = 7;
      for (let i = 0; i < bands; i++) {
        const yy = y - r + (2 * r) * (i / bands);
        ctx.fillStyle = i % 2 ? hexA(opts.band || "#caa46a", 0.5) : hexA(shade(opts.band || "#caa46a", -28), 0.5);
        ctx.fillRect(x - r, yy, r * 2, (2 * r) / bands);
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
    } else {
      // rocky / icy texture from noise tile (multiply for relief)
      const tile = noiseTile(opts.tile || "rockTile", 128, 6, 5);
      ctx.globalAlpha = opts.texAlpha || 0.4; ctx.globalCompositeOperation = "multiply";
      for (let oy = -128; oy < r * 2 + 128; oy += 128)
        for (let ox = -128; ox < r * 2 + 128; ox += 128)
          ctx.drawImage(tile, x - r + ox, y - r + oy);
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
      if (opts.craters) drawCraters(ctx, x, y, r, opts.seed || 1);
    }
    ctx.restore();
    // terminator shadow (night side, lower-right)
    const sh = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.4, x + r * 0.2, y + r * 0.2, r * 1.25);
    sh.addColorStop(0, "rgba(0,0,0,0)");
    sh.addColorStop(1, "rgba(0,0,8,0.65)");
    ctx.save(); clipCircle(ctx, x, y, r); ctx.fillStyle = sh; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore();
    // rim light
    ctx.strokeStyle = hexA(opts.rim || glowC, 0.5); ctx.lineWidth = Math.max(1, r * 0.06);
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();

    if (opts.rings) drawPlanetRings(ctx, x, y, r, opts.ringColor || "#c9b07a");
  }

  function drawCraters(ctx, x, y, r, seed) {
    for (let i = 0; i < 9; i++) {
      const a = hash2(seed, i) * Math.PI * 2;
      const d = Math.sqrt(hash2(seed + 5, i)) * r * 0.8;
      const cx = x + Math.cos(a) * d, cy = y + Math.sin(a) * d;
      const cr = (0.06 + hash2(seed + 9, i) * 0.14) * r;
      const g = ctx.createRadialGradient(cx - cr * 0.3, cy - cr * 0.3, 0, cx, cy, cr);
      g.addColorStop(0, "rgba(255,255,255,0.18)");
      g.addColorStop(0.6, "rgba(0,0,0,0.0)");
      g.addColorStop(1, "rgba(0,0,0,0.28)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI * 2); ctx.fill();
    }
  }

  function drawPlanetRings(ctx, x, y, r, color) {
    ctx.save();
    ctx.translate(x, y); ctx.rotate(-0.5); ctx.scale(1, 0.32);
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = hexA(color, 0.5 - i * 0.12); ctx.lineWidth = r * (0.18 - i * 0.04);
      ctx.beginPath(); ctx.arc(0, 0, r * (1.7 + i * 0.35), 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
  }

  /* A brilliant fixed star (Dhruva) with diffraction spikes. */
  function drawStar(ctx, x, y, r, t) {
    glow(ctx, x, y, r * 5, "#bfe0ff", 0.5);
    glow(ctx, x, y, r * 2.4, "#ffffff", 0.85);
    const tw = 0.85 + 0.15 * Math.sin(t * 0.003);
    ctx.save(); ctx.translate(x, y);
    for (let pass = 0; pass < 2; pass++) {
      ctx.rotate(Math.PI / 4 * pass);
      const len = r * (pass ? 4 : 7) * tw;
      const grd = ctx.createLinearGradient(0, -len, 0, len);
      grd.addColorStop(0, "rgba(255,255,255,0)");
      grd.addColorStop(0.5, "rgba(255,255,255,0.9)");
      grd.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = grd; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(0, -len); ctx.lineTo(0, len); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-len, 0); ctx.lineTo(len, 0); ctx.stroke();
    }
    ctx.restore();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }

  /* ---------- post effects ---------- */
  function vignette(ctx, w, h, strength) {
    const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.32, w / 2, h / 2, Math.max(w, h) * 0.72);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, `rgba(0,0,0,${strength == null ? 0.55 : strength})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }
  function grain(ctx, w, h, t, alpha) {
    const tile = noiseTile("grain", 96, 48, 1);
    ctx.globalAlpha = alpha == null ? 0.04 : alpha;
    ctx.globalCompositeOperation = "overlay";
    const ox = (t * 0.05) % 96, oy = (t * 0.03) % 96;
    for (let y = -96; y < h; y += 96) for (let x = -96; x < w; x += 96) ctx.drawImage(tile, x - ox, y - oy);
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
  }

  return {
    clamp, lerp, smooth, valueNoise, fbm, hexA, rgbOf, shade,
    makeCanvas, noiseTile, nebula, glow, tile,
    drawSun, drawPlanet, drawStar, sphere, clipCircle,
    vignette, grain,
  };
})();
