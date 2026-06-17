/* =====================================================================
   COSMOS-GL — a tiny, dependency-free WebGL2 renderer for a cinematic,
   hyper-real deep-space look.  A single fullscreen fragment shader draws:
     - HDR procedural nebula (domain-warped fbm) + cosmic dust
     - multi-layer twinkling starfield
     - real analytic 3D lit celestial bodies (sun / rocky / gas / icy / star)
       with procedural surfaces, specular, fresnel rim and additive bloom
     - ACES filmic tonemapping, vignette, grain
   No textures, no libraries — everything is generated in-shader, so it runs
   fully offline.  If WebGL2 is unavailable it sets `ok=false` and the app
   falls back to the Canvas2D renderer.
   ===================================================================== */
window.CosmosGL = (function () {
  const MAXB = 16;
  let gl = null, prog = null, vao = null, ok = false;
  let U = {};
  let canvas = null;

  const VERT = `#version 300 es
  precision highp float;
  const vec2 verts[3] = vec2[3](vec2(-1.0,-1.0), vec2(3.0,-1.0), vec2(-1.0,3.0));
  void main(){ gl_Position = vec4(verts[gl_VertexID], 0.0, 1.0); }`;

  const FRAG = `#version 300 es
  precision highp float;
  out vec4 fragColor;

  uniform vec2  uRes;
  uniform float uTime;
  uniform vec3  uTint;       // nebula colour
  uniform float uNebula;     // nebula intensity
  uniform vec3  uLight;      // light direction
  uniform int   uCount;
  uniform vec2  uPos[${MAXB}];
  uniform float uR[${MAXB}];
  uniform vec3  uCol[${MAXB}];
  uniform float uType[${MAXB}];
  uniform float uGlow[${MAXB}];

  float hash13(vec3 p){ p = fract(p*0.1031); p += dot(p, p.yzx+33.33); return fract((p.x+p.y)*p.z); }
  float hash12(vec2 p){ vec3 p3=fract(vec3(p.xyx)*0.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }

  float vnoise(vec3 x){
    vec3 i=floor(x); vec3 f=fract(x); f=f*f*(3.0-2.0*f);
    return mix(mix(mix(hash13(i+vec3(0,0,0)),hash13(i+vec3(1,0,0)),f.x),
                   mix(hash13(i+vec3(0,1,0)),hash13(i+vec3(1,1,0)),f.x),f.y),
               mix(mix(hash13(i+vec3(0,0,1)),hash13(i+vec3(1,0,1)),f.x),
                   mix(hash13(i+vec3(0,1,1)),hash13(i+vec3(1,1,1)),f.x),f.y), f.z);
  }
  float fbm(vec3 p){ float a=0.5,s=0.0; for(int i=0;i<6;i++){ s+=a*vnoise(p); p*=2.02; a*=0.5; } return s; }

  vec3 aces(vec3 x){ const float a=2.51,b=0.03,c=2.43,d=0.59,e=0.14;
    return clamp((x*(a*x+b))/(x*(c*x+d)+e),0.0,1.0); }

  vec3 background(vec2 uv){
    vec2 p = uv/uRes;
    vec3 col = mix(vec3(0.015,0.014,0.035), vec3(0.03,0.022,0.06), p.y);
    // layered nebula with domain warping
    vec3 q = vec3(uv*0.0015, uTime*0.004);
    float w  = fbm(q + fbm(q*0.5+1.7)*1.6);
    float w2 = fbm(q*2.4 + 9.0);
    vec3 neb = mix(uTint*0.35, uTint, clamp(w,0.0,1.0));
    col += neb * pow(clamp(w,0.0,1.0),3.0) * uNebula * 1.7;
    col += vec3(0.45,0.28,0.6) * pow(clamp(w2,0.0,1.0),4.0) * 0.35 * uNebula;
    // dust lanes
    col *= 0.7 + 0.5*fbm(q*1.3+3.0);
    // stars (3 parallax layers)
    for(int k=0;k<3;k++){
      float sc = 0.5 + float(k)*0.9;
      vec2 g = uv*sc;
      vec2 id = floor(g);
      float h = hash12(id + float(k)*37.0);
      if(h>0.978){
        vec2 c = fract(g)-0.5;
        float d = length(c);
        float tw = 0.55 + 0.45*sin(uTime*0.002 + h*120.0);
        float b = smoothstep(0.45,0.0,d) * tw * (0.5+0.6*h);
        vec3 sc2 = h>0.992 ? vec3(1.0,0.85,0.6) : vec3(0.8,0.88,1.0);
        col += sc2 * b;
      }
    }
    return col;
  }

  void main(){
    vec2 uv = gl_FragCoord.xy;
    vec3 col = background(uv);
    vec3 L = normalize(uLight);

    for(int i=0;i<${MAXB};i++){
      if(i>=uCount) break;
      float r = uR[i];
      vec2 d = uv - uPos[i];
      float len = length(d)/r;
      float ty = uType[i];
      vec3 bcol = uCol[i];

      // additive bloom halo
      float halo = uGlow[i] * pow(max(0.0,1.0-len/3.2),2.4);
      col += bcol * halo * 0.7;

      if(len < 1.0){
        vec3 n = vec3(d/r, sqrt(max(0.0,1.0-len*len)));
        vec3 sp = n;
        float t = uTime*0.00018;
        mat2 rot = mat2(cos(t),-sin(t),sin(t),cos(t));
        sp.xz = rot*sp.xz;
        vec3 c;
        if(ty < 0.5){                              // SUN (emissive)
          float gran = fbm(sp*4.5 + uTime*0.02);
          c = mix(vec3(1.0,0.5,0.08), vec3(1.0,0.92,0.62), gran);
          c += pow(1.0-n.z,2.5)*vec3(1.0,0.45,0.12);
          c *= 1.8;
        } else if(ty < 3.5){
          float diff = max(dot(n,L),0.0);
          float amb  = 0.05;
          vec3 base  = bcol;
          if(ty < 1.5){ base *= 0.65 + 0.7*fbm(sp*5.5); }                       // rocky
          else if(ty < 2.5){ float bands=0.5+0.5*sin(sp.y*11.0 + fbm(sp*3.0)*5.0); base=mix(base*0.6,base*1.25,bands); } // gas
          else { base = mix(base, vec3(1.0), fbm(sp*7.0)*0.5); }                // icy
          float spec = pow(max(dot(reflect(-L,n),vec3(0,0,1)),0.0), 28.0)*0.7;
          float fres = pow(1.0-n.z,3.0);
          c = base*(amb+diff) + spec + fres*bcol*0.7;
          // thin atmosphere on the lit limb
          c += bcol * pow(1.0-n.z,4.0) * diff * 0.5;
        } else {                                   // STAR (brilliant point)
          c = vec3(1.2);
        }
        col = mix(col, c, 1.0 - smoothstep(0.985, 1.0, len));
      }
    }

    col = aces(col*1.08);
    vec2 q = uv/uRes;
    float vig = smoothstep(1.25, 0.35, length(q-0.5)*1.3);
    col *= mix(0.5, 1.0, vig);
    col += (hash12(uv + fract(uTime))-0.5)*0.022;   // grain
    fragColor = vec4(col, 1.0);
  }`;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn("CosmosGL shader error:", gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  function init(cnv) {
    canvas = cnv;
    try {
      gl = cnv.getContext("webgl2", { antialias: false, alpha: true, premultipliedAlpha: true });
    } catch (e) { gl = null; }
    if (!gl) { ok = false; cnv.style.display = "none"; return false; }
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) { ok = false; cnv.style.display = "none"; return false; }
    prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn("CosmosGL link error:", gl.getProgramInfoLog(prog));
      ok = false; cnv.style.display = "none"; return false;
    }
    vao = gl.createVertexArray();
    const names = ["uRes", "uTime", "uTint", "uNebula", "uLight", "uCount", "uPos", "uR", "uCol", "uType", "uGlow"];
    U = {};
    for (const n of names) U[n] = gl.getUniformLocation(prog, n);
    ok = true;
    return true;
  }

  function resize(wcss, hcss, dpr) {
    if (!ok) return;
    const w = Math.max(1, Math.floor(wcss * dpr)), h = Math.max(1, Math.floor(hcss * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  }

  function render(opts) {
    if (!ok) return;
    const dpr = opts.dpr || 1;
    const W = canvas.width, H = canvas.height;
    gl.viewport(0, 0, W, H);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(prog);
    gl.bindVertexArray(vao);

    gl.uniform2f(U.uRes, W, H);
    gl.uniform1f(U.uTime, opts.time || 0);
    const tint = opts.tint || [0.5, 0.35, 0.7];
    gl.uniform3f(U.uTint, tint[0], tint[1], tint[2]);
    gl.uniform1f(U.uNebula, opts.nebula == null ? 1.0 : opts.nebula);
    const lt = opts.light || [-0.4, -0.5, 0.75];
    gl.uniform3f(U.uLight, lt[0], lt[1], lt[2]);

    const bodies = (opts.bodies || []).slice(0, MAXB);
    const n = bodies.length;
    const pos = new Float32Array(MAXB * 2), rad = new Float32Array(MAXB);
    const cols = new Float32Array(MAXB * 3), types = new Float32Array(MAXB), glows = new Float32Array(MAXB);
    for (let i = 0; i < n; i++) {
      const b = bodies[i];
      pos[i * 2] = b.x * dpr;
      pos[i * 2 + 1] = H - b.y * dpr;          // flip to GL bottom-left origin
      rad[i] = Math.max(1, b.r * dpr);
      const c = b.color || [1, 1, 1];
      cols[i * 3] = c[0]; cols[i * 3 + 1] = c[1]; cols[i * 3 + 2] = c[2];
      types[i] = b.type == null ? 1 : b.type;
      glows[i] = b.glow == null ? 1 : b.glow;
    }
    gl.uniform1i(U.uCount, n);
    gl.uniform2fv(U.uPos, pos);
    gl.uniform1fv(U.uR, rad);
    gl.uniform3fv(U.uCol, cols);
    gl.uniform1fv(U.uType, types);
    gl.uniform1fv(U.uGlow, glows);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  return {
    init, resize, render,
    get ok() { return ok; },
    MAXB,
  };
})();
