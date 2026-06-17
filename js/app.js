/* =====================================================================
   APP — engine that wires the views to the canvas, navigation, info
   panel, tooltip and controls. No external dependencies.
   ===================================================================== */
(function () {
  const VIEWS = [window.CreationView, window.TrilokaView, window.BhuMandalaView];
  let current = VIEWS[0];

  const canvas = document.getElementById("scene");
  const ctx = canvas.getContext("2d");
  const stage = document.getElementById("stage");
  const navEl = document.getElementById("nav");
  const infoEl = document.getElementById("info");
  const tooltip = document.getElementById("tooltip");
  const stageTitle = document.getElementById("stageTitle");
  const hintEl = document.getElementById("hint");
  const scaleReadout = document.getElementById("scaleReadout");

  const env = { w: 0, h: 0, animating: true, showLabels: true };
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let mouse = { x: -9999, y: -9999, inside: false };
  let pinned = null; // info pinned by click

  /* ---- canvas sizing ---- */
  function resize() {
    env.w = stage.clientWidth;
    env.h = stage.clientHeight;
    canvas.width = env.w * dpr;
    canvas.height = env.h * dpr;
    canvas.style.width = env.w + "px";
    canvas.style.height = env.h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    current.reset(env);
  }

  /* ---- navigation ---- */
  function buildNav() {
    navEl.querySelectorAll(".nav-item").forEach((n) => n.remove());
    VIEWS.forEach((v) => {
      const item = document.createElement("div");
      item.className = "nav-item" + (v === current ? " active" : "");
      item.dataset.id = v.id;
      item.innerHTML =
        `<span class="dot" style="--accent:${v.accent}"></span>` +
        `<span class="txt"><b>${v.navName}</b><span>${v.navSub}</span></span>`;
      item.addEventListener("click", () => selectView(v));
      navEl.appendChild(item);
    });
    addNavReference();
  }

  function addNavReference() {
    const lbl = document.createElement("div");
    lbl.className = "nav-label";
    lbl.textContent = "Source";
    navEl.appendChild(lbl);
    const note = document.createElement("div");
    note.style.cssText = "font-size:0.72rem;color:var(--ink-faint);line-height:1.6;padding:4px 10px;";
    note.innerHTML =
      "Built from the <em>Srimad Bhagavatam</em> (Canto 2 for creation, Canto 5 for structure) " +
      "and a series of scripture-based video lectures. Distances in yojanas (1 yojana = 8 miles).";
    navEl.appendChild(note);
  }

  function selectView(v) {
    current = v;
    navEl.querySelectorAll(".nav-item").forEach((n) =>
      n.classList.toggle("active", n.dataset.id === v.id)
    );
    stageTitle.innerHTML = `<h2>${v.title}</h2><p>${v.subtitle}</p>`;
    hintEl.textContent = v.hint;
    pinned = null;
    renderInfo(null);
    current.reset(env);
  }

  /* ---- info panel ---- */
  function renderInfo(info) {
    if (!info) {
      infoEl.innerHTML =
        `<div class="placeholder">Hover or tap any region of the cosmos to read its description from the scripture.</div>` +
        legendFor(current);
      return;
    }
    let facts = "";
    if (info.facts && info.facts.length) {
      facts =
        `<div class="divider"></div>` +
        info.facts
          .map((f) => `<div class="factrow"><span class="k">${f[0]}</span><span class="v">${f[1]}</span></div>`)
          .join("");
    }
    infoEl.innerHTML =
      `<div class="eyebrow">${info.eyebrow}</div>` +
      `<h3>${info.name}${info.triloka ? '<span class="triloka-tag">Triloka</span>' : ""}</h3>` +
      (info.alt ? `<div class="alt">${info.alt}</div>` : "") +
      (info.ref ? `<span class="ref-pill">${info.ref}</span>` : "") +
      `<div class="body">${info.body}</div>` +
      facts;
  }

  function legendFor(v) {
    if (v.id === "creation") {
      return (
        `<div class="divider"></div><div class="eyebrow">The descending hierarchy</div>` +
        `<div class="legend">` +
        COSMIC_HIERARCHY.map((n) => `<span class="chip"><i style="background:${n.realm === "spiritual" ? "#ffd980" : n.realm === "boundary" ? "#b9c2ff" : "#caa46a"}"></i>${n.name}</span>`).join("") +
        `</div>` +
        `<div class="body" style="margin-top:12px;font-size:0.82rem;color:var(--ink-dim)">Source: Video 1 — “Original Creation, Part 1”. As you add more videos from the series, new realms and teachings appear here automatically.</div>`
      );
    }
    if (v.id === "triloka") {
      return (
        `<div class="divider"></div><div class="eyebrow">Legend</div>` +
        `<div class="legend">` +
        `<span class="chip"><i style="background:#ffb347"></i>Triloka (3 worlds)</span>` +
        `<span class="chip"><i style="background:#ffd28a"></i>Higher worlds</span>` +
        `<span class="chip"><i style="background:#8a583e"></i>Lower worlds</span>` +
        `<span class="chip"><i style="background:#ffd35c"></i>Jyotir-chakra</span>` +
        `</div>`
      );
    }
    return (
      `<div class="divider"></div><div class="eyebrow">The seven oceans</div>` +
      `<div class="legend">` +
      DVIPAS.map((d) => `<span class="chip"><i style="background:${d.ocean.color}"></i>${d.ocean.liquid}</span>`).join("") +
      `</div>`
    );
  }

  /* ---- tooltip ---- */
  function showTooltip(info, x, y) {
    if (!info) { tooltip.classList.remove("show"); return; }
    tooltip.innerHTML =
      `<b>${info.name}</b>` +
      (info.ref ? `<div class="meta">${info.ref}</div>` : "") +
      `<div class="desc">${truncate(info.body, 130)}</div>`;
    tooltip.classList.add("show");
    const pad = 16, tw = tooltip.offsetWidth, th = tooltip.offsetHeight;
    let px = x + pad, py = y + pad;
    if (px + tw > window.innerWidth) px = x - tw - pad;
    if (py + th > window.innerHeight) py = y - th - pad;
    tooltip.style.left = px + "px";
    tooltip.style.top = py + "px";
  }
  function truncate(s, n) { return s.length > n ? s.slice(0, n).replace(/\s+\S*$/, "") + "…" : s; }

  /* ---- interaction ---- */
  let dragging = false, lastX = 0, lastY = 0, moved = 0;
  canvas.addEventListener("mousedown", (e) => { dragging = true; moved = 0; lastX = e.clientX; lastY = e.clientY; });
  window.addEventListener("mouseup", () => { dragging = false; });
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top; mouse.inside = true;
    if (dragging) {
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      moved += Math.abs(dx) + Math.abs(dy);
      current.onDrag(dx, dy); lastX = e.clientX; lastY = e.clientY;
      tooltip.classList.remove("show");
    }
  });
  canvas.addEventListener("mouseleave", () => { mouse.inside = false; tooltip.classList.remove("show"); });
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    current.onWheel({ deltaY: e.deltaY, offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top });
  }, { passive: false });
  canvas.addEventListener("click", () => {
    if (moved > 6) return; // was a drag
    const info = current.hitTest(mouse.x, mouse.y);
    pinned = info || null;
    renderInfo(info);
  });

  // touch support
  canvas.addEventListener("touchstart", (e) => {
    const tch = e.touches[0]; const rect = canvas.getBoundingClientRect();
    dragging = true; moved = 0; lastX = tch.clientX; lastY = tch.clientY;
    mouse.x = tch.clientX - rect.left; mouse.y = tch.clientY - rect.top;
  }, { passive: true });
  canvas.addEventListener("touchmove", (e) => {
    const tch = e.touches[0]; const rect = canvas.getBoundingClientRect();
    const dx = tch.clientX - lastX, dy = tch.clientY - lastY;
    moved += Math.abs(dx) + Math.abs(dy);
    current.onDrag(dx, dy); lastX = tch.clientX; lastY = tch.clientY;
    mouse.x = tch.clientX - rect.left; mouse.y = tch.clientY - rect.top;
  }, { passive: true });
  canvas.addEventListener("touchend", () => {
    dragging = false;
    if (moved <= 8) { const info = current.hitTest(mouse.x, mouse.y); pinned = info; renderInfo(info); }
  });

  /* ---- controls ---- */
  const animBtn = document.getElementById("animToggle");
  const labelBtn = document.getElementById("labelToggle");
  animBtn.addEventListener("click", () => {
    env.animating = !env.animating;
    animBtn.classList.toggle("active", env.animating);
    animBtn.innerHTML = (env.animating ? "&#9646;&#9646;" : "&#9654;") + " Motion";
  });
  labelBtn.classList.toggle("active", env.showLabels);
  labelBtn.addEventListener("click", () => {
    env.showLabels = !env.showLabels;
    labelBtn.classList.toggle("active", env.showLabels);
  });

  /* ---- epigraph rotation ---- */
  const epi = document.getElementById("epigraph");
  let epiIdx = 0;
  function rotateEpigraph() {
    const e = EPIGRAPHS[epiIdx % EPIGRAPHS.length];
    epi.innerHTML = `&ldquo;${e.text}&rdquo;<cite>${e.cite}</cite>`;
    epi.classList.add("show");
    setTimeout(() => epi.classList.remove("show"), 8200);
    epiIdx++;
  }

  /* ---- main loop ---- */
  let t0 = performance.now(), tAnim = 0;
  function loop(now) {
    const dt = now - t0; t0 = now;
    if (env.animating) tAnim += dt;
    current.draw(ctx, env, tAnim);

    // hover hit-test (only when not dragging)
    if (mouse.inside && !dragging) {
      const info = current.hitTest(mouse.x, mouse.y);
      showTooltip(info, mouse.x + canvas.getBoundingClientRect().left, mouse.y + canvas.getBoundingClientRect().top);
      if (info && !pinned) renderInfo(info);
      if (!info && !pinned) renderInfo(null);
    }

    scaleReadout.textContent =
      "1 yojana = 8 miles · scale schematic · Bhu-mandala \u2300 " +
      BHUMANDALA_DIAMETER_YOJANAS.toLocaleString("en-US") + " yojanas";
    requestAnimationFrame(loop);
  }

  /* ---- boot ---- */
  function boot() {
    buildNav();
    stageTitle.innerHTML = `<h2>${current.title}</h2><p>${current.subtitle}</p>`;
    hintEl.textContent = current.hint;
    resize();
    renderInfo(null);
    requestAnimationFrame(loop);
    rotateEpigraph();
    setInterval(rotateEpigraph, 10000);
  }

  window.addEventListener("resize", () => { dpr = Math.min(window.devicePixelRatio || 1, 2); resize(); });

  // intro
  const intro = document.getElementById("intro");
  document.getElementById("enterBtn").addEventListener("click", () => {
    intro.classList.add("hide");
    setTimeout(() => (intro.style.display = "none"), 900);
  });

  boot();
})();
