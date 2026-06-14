/* =====================================================================
   STARFIELD — cinematic deep-space backdrop: a nebula band, layered
   parallax stars of varying temperature, and occasional meteors.
   ===================================================================== */
(function () {
  const canvas = document.getElementById("starfield");
  const ctx = canvas.getContext("2d");
  let w, h, stars = [], meteors = [], neb = null;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    w = canvas.clientWidth = window.innerWidth;
    h = canvas.clientHeight = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    neb = GFX.nebula("bgNebula", 360, 240, [
      { t: 0.0, c: [8, 6, 20] },
      { t: 0.4, c: [40, 22, 60] },
      { t: 0.7, c: [90, 40, 90] },
      { t: 1.0, c: [180, 120, 160] },
    ]);
    seed();
  }

  function seed() {
    const count = Math.round((w * h) / 3400);
    stars = [];
    for (let i = 0; i < count; i++) {
      const layer = Math.random();
      stars.push({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * (0.4 + layer * 1.4) + 0.2,
        base: 0.15 + layer * 0.5,
        amp: Math.random() * 0.5,
        spd: Math.random() * 0.0016 + 0.0003,
        ph: Math.random() * Math.PI * 2,
        warm: Math.random() < 0.25,
        blue: Math.random() < 0.18,
      });
    }
  }

  function spawnMeteor() {
    if (Math.random() < 0.004 && meteors.length < 2) {
      const edge = Math.random() * w;
      meteors.push({ x: edge, y: -20, vx: (Math.random() - 0.5) * 6 - 2, vy: 6 + Math.random() * 5, life: 1 });
    }
  }

  function frame(t) {
    ctx.clearRect(0, 0, w, h);
    // nebula band, gently drifting, rotated
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.translate(w * 0.5, h * 0.42);
    ctx.rotate(-0.35);
    const sc = Math.max(w, h) / 200;
    ctx.drawImage(neb, -180 * sc + Math.sin(t * 0.00003) * 30, -120 * sc, 360 * sc, 240 * sc);
    ctx.restore();

    for (const s of stars) {
      const a = s.base + s.amp * (0.5 + 0.5 * Math.sin(t * s.spd + s.ph));
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.warm ? `rgba(255,214,150,${a})` : s.blue ? `rgba(170,200,255,${a})` : `rgba(225,232,250,${a})`;
      ctx.fill();
      if (s.r > 1.3) { // brighter stars get a soft halo
        ctx.fillStyle = s.warm ? `rgba(255,200,120,${a * 0.15})` : `rgba(190,210,255,${a * 0.15})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2); ctx.fill();
      }
    }

    spawnMeteor();
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.x += m.vx; m.y += m.vy; m.life -= 0.012;
      const g = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 6, m.y - m.vy * 6);
      g.addColorStop(0, `rgba(255,255,255,${m.life})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = g; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - m.vx * 6, m.y - m.vy * 6); ctx.stroke();
      if (m.life <= 0 || m.y > h + 30) meteors.splice(i, 1);
    }

    requestAnimationFrame(frame);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(frame);
})();
