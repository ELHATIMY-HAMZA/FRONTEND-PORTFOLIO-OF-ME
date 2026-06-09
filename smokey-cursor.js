/**
 * SmokeyCursor — Vanilla JS port of Lightswind UI smokey-cursor component
 * Source reference: https://lightswind.com/components/smokey-cursor
 *
 * Renders a real-time WebGL fluid / smoke simulation that follows the cursor.
 * Drop this script into any plain HTML project; it self-initialises on load.
 */
(function () {
  "use strict";

  // ─── Configuration (mirrors the React component's default props) ───────────
  const config = {
    SIM_RESOLUTION: 128,
    DYE_RESOLUTION: 1440,
    DENSITY_DISSIPATION: 3.5,
    VELOCITY_DISSIPATION: 2,
    PRESSURE: 0.1,
    PRESSURE_ITERATIONS: 20,
    CURL: 3,
    SPLAT_RADIUS: 0.2,
    SPLAT_FORCE: 6000,
    SHADING: true,
    COLOR_UPDATE_SPEED: 10,
    TRANSPARENT: true,
  };

  // ─── Bootstrap on DOMContentLoaded ────────────────────────────────────────
  function init() {
    // Reuse the existing canvas if present, otherwise create one
    let canvas = document.getElementById("fluid-canvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "fluid-canvas";
      document.body.prepend(canvas);
    }

    // Ensure the canvas is a fixed full-screen overlay (pointer-events: none so
    // it never blocks clicks/scrolls on the page beneath it)
    Object.assign(canvas.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      zIndex: "9999",
      pointerEvents: "none",
      display: "block",
    });

    startFluid(canvas);
  }

  // ─── Pointer state ─────────────────────────────────────────────────────────
  function makePointer() {
    return {
      id: -1,
      texcoordX: 0,
      texcoordY: 0,
      prevTexcoordX: 0,
      prevTexcoordY: 0,
      deltaX: 0,
      deltaY: 0,
      down: false,
      moved: false,
      color: { r: 0, g: 0, b: 0 },
    };
  }

  // ─── Main fluid engine ─────────────────────────────────────────────────────
  function startFluid(canvas) {
    const pointers = [makePointer()];

    // ── WebGL context ──────────────────────────────────────────────────────
    const { gl, ext } = getWebGLContext(canvas);
    if (!gl || !ext) return;

    if (!ext.supportLinearFiltering) {
      config.DYE_RESOLUTION = 256;
      config.SHADING = false;
    }

    function getWebGLContext(canvas) {
      const params = {
        alpha: true,
        depth: false,
        stencil: false,
        antialias: false,
        preserveDrawingBuffer: false,
      };

      let gl = canvas.getContext("webgl2", params);
      const isWebGL2 = !!gl;

      if (!isWebGL2) {
        gl =
          canvas.getContext("webgl", params) ||
          canvas.getContext("experimental-webgl", params);
      }

      if (!gl) return { gl: null, ext: null };

      let supportLinearFiltering = false;
      let halfFloat = null;

      if (isWebGL2) {
        gl.getExtension("EXT_color_buffer_float");
        supportLinearFiltering = !!gl.getExtension("OES_texture_float_linear");
      } else {
        halfFloat = gl.getExtension("OES_texture_half_float");
        supportLinearFiltering = !!gl.getExtension(
          "OES_texture_half_float_linear"
        );
      }

      gl.clearColor(0, 0, 0, 1);

      const halfFloatTexType = isWebGL2
        ? gl.HALF_FLOAT
        : halfFloat
        ? halfFloat.HALF_FLOAT_OES
        : 0;

      let formatRGBA, formatRG, formatR;

      if (isWebGL2) {
        formatRGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
        formatRG   = getSupportedFormat(gl, gl.RG16F,   gl.RG,   halfFloatTexType);
        formatR    = getSupportedFormat(gl, gl.R16F,    gl.RED,  halfFloatTexType);
      } else {
        formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        formatRG   = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        formatR    = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      }

      return {
        gl,
        ext: {
          formatRGBA,
          formatRG,
          formatR,
          halfFloatTexType,
          supportLinearFiltering,
          isWebGL2,
        },
      };
    }

    function getSupportedFormat(gl, internalFormat, format, type) {
      if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
        if (gl.drawBuffers) {
          switch (internalFormat) {
            case gl.R16F:  return getSupportedFormat(gl, gl.RG16F,   gl.RG,   type);
            case gl.RG16F: return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
            default: return null;
          }
        }
        return null;
      }
      return { internalFormat, format };
    }

    function supportRenderTextureFormat(gl, internalFormat, format, type) {
      const texture = gl.createTexture();
      if (!texture) return false;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
      const fbo = gl.createFramebuffer();
      if (!fbo) return false;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      return gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    }

    // ── Shader helpers ─────────────────────────────────────────────────────
    function addKeywords(src, keywords) {
      if (!keywords) return src;
      return keywords.map((k) => `#define ${k}`).join("\n") + "\n" + src;
    }

    function compileShader(type, src, keywords) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, addKeywords(src, keywords));
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn("[SmokeyCursor] Shader compile error:", gl.getShaderInfoLog(shader));
      }
      return shader;
    }

    function createProgram(vert, frag) {
      if (!vert || !frag) return null;
      const prog = gl.createProgram();
      gl.attachShader(prog, vert);
      gl.attachShader(prog, frag);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.warn("[SmokeyCursor] Program link error:", gl.getProgramInfoLog(prog));
      }
      return prog;
    }

    function getUniforms(prog) {
      const uniforms = {};
      const n = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < n; i++) {
        const info = gl.getActiveUniform(prog, i);
        if (info) uniforms[info.name] = gl.getUniformLocation(prog, info.name);
      }
      return uniforms;
    }

    class GLProgram {
      constructor(vert, frag) {
        this.program  = createProgram(vert, frag);
        this.uniforms = this.program ? getUniforms(this.program) : {};
      }
      bind() { if (this.program) gl.useProgram(this.program); }
    }

    class Material {
      constructor(vert, fragSrc) {
        this.vert = vert;
        this.fragSrc = fragSrc;
        this.programs = {};
        this.activeProgram = null;
        this.uniforms = {};
      }
      setKeywords(keywords) {
        const hash = keywords.reduce((h, k) => h + hashCode(k), 0);
        let prog = this.programs[hash];
        if (!prog) {
          const frag = compileShader(gl.FRAGMENT_SHADER, this.fragSrc, keywords);
          prog = createProgram(this.vert, frag);
          this.programs[hash] = prog;
        }
        if (prog === this.activeProgram) return;
        this.uniforms = getUniforms(prog);
        this.activeProgram = prog;
      }
      bind() { if (this.activeProgram) gl.useProgram(this.activeProgram); }
    }

    function hashCode(s) {
      let h = 0;
      for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; }
      return h;
    }

    // ── GLSL sources ───────────────────────────────────────────────────────
    const baseVert = compileShader(gl.VERTEX_SHADER, `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform vec2 texelSize;
      void main(){
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `);

    const copyFrag = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      void main(){ gl_FragColor = texture2D(uTexture, vUv); }
    `);

    const clearFrag = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture; uniform float value;
      void main(){ gl_FragColor = value * texture2D(uTexture, vUv); }
    `);

    const displaySrc = `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uTexture;
      uniform vec2 texelSize;
      void main(){
        vec3 c = texture2D(uTexture, vUv).rgb;
        #ifdef SHADING
          vec3 lc=texture2D(uTexture,vL).rgb; vec3 rc=texture2D(uTexture,vR).rgb;
          vec3 tc=texture2D(uTexture,vT).rgb; vec3 bc=texture2D(uTexture,vB).rgb;
          float dx=length(rc)-length(lc); float dy=length(tc)-length(bc);
          vec3 n=normalize(vec3(dx,dy,length(texelSize)));
          float diffuse=clamp(dot(n,vec3(0,0,1))+0.7,0.7,1.0);
          c*=diffuse;
        #endif
        float a=max(c.r,max(c.g,c.b));
        gl_FragColor=vec4(c,a);
      }
    `;

    const splatFrag = compileShader(gl.FRAGMENT_SHADER, `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget; uniform float aspectRatio;
      uniform vec3 color; uniform vec2 point; uniform float radius;
      void main(){
        vec2 p=vUv-point.xy; p.x*=aspectRatio;
        vec3 splat=exp(-dot(p,p)/radius)*color;
        vec3 base=texture2D(uTarget,vUv).xyz;
        gl_FragColor=vec4(base+splat,1.0);
      }
    `);

    const advectionFrag = compileShader(gl.FRAGMENT_SHADER, `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity; uniform sampler2D uSource;
      uniform vec2 texelSize; uniform vec2 dyeTexelSize;
      uniform float dt; uniform float dissipation;
      vec4 bilerp(sampler2D sam,vec2 uv,vec2 tsize){
        vec2 st=uv/tsize-0.5; vec2 iuv=floor(st); vec2 fuv=fract(st);
        vec4 a=texture2D(sam,(iuv+vec2(0.5,0.5))*tsize);
        vec4 b=texture2D(sam,(iuv+vec2(1.5,0.5))*tsize);
        vec4 c=texture2D(sam,(iuv+vec2(0.5,1.5))*tsize);
        vec4 d=texture2D(sam,(iuv+vec2(1.5,1.5))*tsize);
        return mix(mix(a,b,fuv.x),mix(c,d,fuv.x),fuv.y);
      }
      void main(){
        #ifdef MANUAL_FILTERING
          vec2 coord=vUv-dt*bilerp(uVelocity,vUv,texelSize).xy*texelSize;
          vec4 result=bilerp(uSource,coord,dyeTexelSize);
        #else
          vec2 coord=vUv-dt*texture2D(uVelocity,vUv).xy*texelSize;
          vec4 result=texture2D(uSource,coord);
        #endif
        gl_FragColor=result/(1.0+dissipation*dt);
      }
    `, ext.supportLinearFiltering ? null : ["MANUAL_FILTERING"]);

    const divergenceFrag = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR;
      varying highp vec2 vT; varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main(){
        float L=texture2D(uVelocity,vL).x; float R=texture2D(uVelocity,vR).x;
        float T=texture2D(uVelocity,vT).y; float B=texture2D(uVelocity,vB).y;
        vec2 C=texture2D(uVelocity,vUv).xy;
        if(vL.x<0.0){L=-C.x;} if(vR.x>1.0){R=-C.x;}
        if(vT.y>1.0){T=-C.y;} if(vB.y<0.0){B=-C.y;}
        gl_FragColor=vec4(0.5*(R-L+T-B),0,0,1);
      }
    `);

    const curlFrag = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR;
      varying highp vec2 vT; varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main(){
        float L=texture2D(uVelocity,vL).y; float R=texture2D(uVelocity,vR).y;
        float T=texture2D(uVelocity,vT).x; float B=texture2D(uVelocity,vB).x;
        gl_FragColor=vec4(0.5*(R-L-T+B),0,0,1);
      }
    `);

    const vorticityFrag = compileShader(gl.FRAGMENT_SHADER, `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uVelocity; uniform sampler2D uCurl;
      uniform float curl; uniform float dt;
      void main(){
        float L=texture2D(uCurl,vL).x; float R=texture2D(uCurl,vR).x;
        float T=texture2D(uCurl,vT).x; float B=texture2D(uCurl,vB).x;
        float C=texture2D(uCurl,vUv).x;
        vec2 force=0.5*vec2(abs(T)-abs(B),abs(R)-abs(L));
        force/=length(force)+0.0001; force*=curl*C; force.y*=-1.0;
        vec2 vel=texture2D(uVelocity,vUv).xy+force*dt;
        vel=min(max(vel,-1000.0),1000.0);
        gl_FragColor=vec4(vel,0,1);
      }
    `);

    const pressureFrag = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR;
      varying highp vec2 vT; varying highp vec2 vB;
      uniform sampler2D uPressure; uniform sampler2D uDivergence;
      void main(){
        float L=texture2D(uPressure,vL).x; float R=texture2D(uPressure,vR).x;
        float T=texture2D(uPressure,vT).x; float B=texture2D(uPressure,vB).x;
        float div=texture2D(uDivergence,vUv).x;
        gl_FragColor=vec4((L+R+B+T-div)*0.25,0,0,1);
      }
    `);

    const gradSubFrag = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR;
      varying highp vec2 vT; varying highp vec2 vB;
      uniform sampler2D uPressure; uniform sampler2D uVelocity;
      void main(){
        float L=texture2D(uPressure,vL).x; float R=texture2D(uPressure,vR).x;
        float T=texture2D(uPressure,vT).x; float B=texture2D(uPressure,vB).x;
        vec2 vel=texture2D(uVelocity,vUv).xy;
        vel.xy-=vec2(R-L,T-B);
        gl_FragColor=vec4(vel,0,1);
      }
    `);

    // ── Programs ───────────────────────────────────────────────────────────
    const copyProg       = new GLProgram(baseVert, copyFrag);
    const clearProg      = new GLProgram(baseVert, clearFrag);
    const splatProg      = new GLProgram(baseVert, splatFrag);
    const advectionProg  = new GLProgram(baseVert, advectionFrag);
    const divergenceProg = new GLProgram(baseVert, divergenceFrag);
    const curlProg       = new GLProgram(baseVert, curlFrag);
    const vorticityProg  = new GLProgram(baseVert, vorticityFrag);
    const pressureProg   = new GLProgram(baseVert, pressureFrag);
    const gradSubProg    = new GLProgram(baseVert, gradSubFrag);
    const displayMat     = new Material(baseVert, displaySrc);

    // ── Fullscreen quad blit ───────────────────────────────────────────────
    const quadBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,-1,1,1,1,1,-1]), gl.STATIC_DRAW);
    const elemBuf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elemBuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0,1,2,0,2,3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    function blit(target, doClear) {
      if (!target) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      } else {
        gl.viewport(0, 0, target.width, target.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      }
      if (doClear) { gl.clearColor(0,0,0,1); gl.clear(gl.COLOR_BUFFER_BIT); }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }

    // ── FBO helpers ────────────────────────────────────────────────────────
    function createFBO(w, h, internalFmt, fmt, type, param) {
      gl.activeTexture(gl.TEXTURE0);
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFmt, w, h, 0, fmt, type, null);
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0,0,w,h); gl.clear(gl.COLOR_BUFFER_BIT);
      return {
        texture, fbo, width: w, height: h,
        texelSizeX: 1/w, texelSizeY: 1/h,
        attach(id) { gl.activeTexture(gl.TEXTURE0+id); gl.bindTexture(gl.TEXTURE_2D, texture); return id; },
      };
    }

    function createDoubleFBO(w, h, internalFmt, fmt, type, param) {
      let f1 = createFBO(w, h, internalFmt, fmt, type, param);
      let f2 = createFBO(w, h, internalFmt, fmt, type, param);
      return {
        width: w, height: h,
        texelSizeX: f1.texelSizeX, texelSizeY: f1.texelSizeY,
        read: f1, write: f2,
        swap() { const t=this.read; this.read=this.write; this.write=t; },
      };
    }

    function resizeFBO(target, w, h, internalFmt, fmt, type, param) {
      const n = createFBO(w, h, internalFmt, fmt, type, param);
      copyProg.bind();
      if (copyProg.uniforms.uTexture) gl.uniform1i(copyProg.uniforms.uTexture, target.attach(0));
      blit(n, false);
      return n;
    }

    function resizeDoubleFBO(target, w, h, internalFmt, fmt, type, param) {
      if (target.width===w && target.height===h) return target;
      target.read  = resizeFBO(target.read,  w, h, internalFmt, fmt, type, param);
      target.write = createFBO(w, h, internalFmt, fmt, type, param);
      target.width=w; target.height=h;
      target.texelSizeX=1/w; target.texelSizeY=1/h;
      return target;
    }

    // ── FBO state ──────────────────────────────────────────────────────────
    let dye, velocity, divergenceFBO, curlFBO, pressureFBO;

    function initFramebuffers() {
      const simRes = getResolution(config.SIM_RESOLUTION);
      const dyeRes = getResolution(config.DYE_RESOLUTION);
      const texType   = ext.halfFloatTexType;
      const rgba      = ext.formatRGBA;
      const rg        = ext.formatRG;
      const r         = ext.formatR;
      const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
      gl.disable(gl.BLEND);

      if (!dye)
        dye = createDoubleFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
      else
        dye = resizeDoubleFBO(dye, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);

      if (!velocity)
        velocity = createDoubleFBO(simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);
      else
        velocity = resizeDoubleFBO(velocity, simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);

      divergenceFBO = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
      curlFBO       = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
      pressureFBO   = createDoubleFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
    }

    function getResolution(resolution) {
      const w = gl.drawingBufferWidth, h = gl.drawingBufferHeight;
      const ar = w / h;
      const aspect = ar < 1 ? 1/ar : ar;
      const min = Math.round(resolution);
      const max = Math.round(resolution * aspect);
      return w > h ? { width: max, height: min } : { width: min, height: max };
    }

    function scaleByPixelRatio(v) {
      return Math.floor(v * (window.devicePixelRatio || 1));
    }

    // ── Keywords / display material ────────────────────────────────────────
    function updateKeywords() {
      const kw = [];
      if (config.SHADING) kw.push("SHADING");
      displayMat.setKeywords(kw);
    }

    updateKeywords();
    initFramebuffers();

    // ── Simulation loop ────────────────────────────────────────────────────
    let lastTime = Date.now();
    let colorTimer = 0;
    let rafId;

    function loop() {
      rafId = requestAnimationFrame(loop);
      const dt = calcDt();
      if (resizeCanvas()) initFramebuffers();
      updateColors(dt);
      applyInputs();
      step(dt);
      render();
    }

    function calcDt() {
      const now = Date.now();
      const dt = Math.min((now - lastTime) / 1000, 0.016666);
      lastTime = now;
      return dt;
    }

    function resizeCanvas() {
      const w = scaleByPixelRatio(canvas.clientWidth);
      const h = scaleByPixelRatio(canvas.clientHeight);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h; return true;
      }
      return false;
    }

    function updateColors(dt) {
      colorTimer += dt * config.COLOR_UPDATE_SPEED;
      if (colorTimer >= 1) {
        colorTimer = wrap(colorTimer, 0, 1);
        pointers.forEach((p) => { p.color = generateColor(); });
      }
    }

    function applyInputs() {
      for (const p of pointers) {
        if (p.moved) { p.moved = false; splatPointer(p); }
      }
    }

    function step(dt) {
      gl.disable(gl.BLEND);

      // Curl
      curlProg.bind();
      u2f(curlProg, "texelSize", velocity.texelSizeX, velocity.texelSizeY);
      u1i(curlProg, "uVelocity", velocity.read.attach(0));
      blit(curlFBO);

      // Vorticity
      vorticityProg.bind();
      u2f(vorticityProg, "texelSize", velocity.texelSizeX, velocity.texelSizeY);
      u1i(vorticityProg, "uVelocity", velocity.read.attach(0));
      u1i(vorticityProg, "uCurl", curlFBO.attach(1));
      u1f(vorticityProg, "curl", config.CURL);
      u1f(vorticityProg, "dt", dt);
      blit(velocity.write); velocity.swap();

      // Divergence
      divergenceProg.bind();
      u2f(divergenceProg, "texelSize", velocity.texelSizeX, velocity.texelSizeY);
      u1i(divergenceProg, "uVelocity", velocity.read.attach(0));
      blit(divergenceFBO);

      // Clear pressure
      clearProg.bind();
      u1i(clearProg, "uTexture", pressureFBO.read.attach(0));
      u1f(clearProg, "value", config.PRESSURE);
      blit(pressureFBO.write); pressureFBO.swap();

      // Pressure iterations
      pressureProg.bind();
      u2f(pressureProg, "texelSize", velocity.texelSizeX, velocity.texelSizeY);
      u1i(pressureProg, "uDivergence", divergenceFBO.attach(0));
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        u1i(pressureProg, "uPressure", pressureFBO.read.attach(1));
        blit(pressureFBO.write); pressureFBO.swap();
      }

      // Gradient subtract
      gradSubProg.bind();
      u2f(gradSubProg, "texelSize", velocity.texelSizeX, velocity.texelSizeY);
      u1i(gradSubProg, "uPressure", pressureFBO.read.attach(0));
      u1i(gradSubProg, "uVelocity", velocity.read.attach(1));
      blit(velocity.write); velocity.swap();

      // Advection — velocity
      advectionProg.bind();
      u2f(advectionProg, "texelSize", velocity.texelSizeX, velocity.texelSizeY);
      if (!ext.supportLinearFiltering)
        u2f(advectionProg, "dyeTexelSize", velocity.texelSizeX, velocity.texelSizeY);
      const velId = velocity.read.attach(0);
      u1i(advectionProg, "uVelocity", velId);
      u1i(advectionProg, "uSource",   velId);
      u1f(advectionProg, "dt", dt);
      u1f(advectionProg, "dissipation", config.VELOCITY_DISSIPATION);
      blit(velocity.write); velocity.swap();

      // Advection — dye
      if (!ext.supportLinearFiltering)
        u2f(advectionProg, "dyeTexelSize", dye.texelSizeX, dye.texelSizeY);
      u1i(advectionProg, "uVelocity", velocity.read.attach(0));
      u1i(advectionProg, "uSource",   dye.read.attach(1));
      u1f(advectionProg, "dissipation", config.DENSITY_DISSIPATION);
      blit(dye.write); dye.swap();
    }

    function render() {
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      const w = gl.drawingBufferWidth, h = gl.drawingBufferHeight;
      displayMat.bind();
      if (config.SHADING) u2f(displayMat, "texelSize", 1/w, 1/h);
      u1i(displayMat, "uTexture", dye.read.attach(0));
      blit(null, false);
    }

    // ── Uniform helpers ────────────────────────────────────────────────────
    function u(obj, name) {
      return (obj.uniforms || obj.uniforms);  // same reference
    }
    function u1i(prog, name, v) { if (prog.uniforms[name] != null) gl.uniform1i(prog.uniforms[name], v); }
    function u1f(prog, name, v) { if (prog.uniforms[name] != null) gl.uniform1f(prog.uniforms[name], v); }
    function u2f(prog, name, x, y) { if (prog.uniforms[name] != null) gl.uniform2f(prog.uniforms[name], x, y); }
    function u3f(prog, name, x, y, z) { if (prog.uniforms[name] != null) gl.uniform3f(prog.uniforms[name], x, y, z); }

    // ── Splat / interaction ────────────────────────────────────────────────
    function splatPointer(p) {
      splat(p.texcoordX, p.texcoordY,
            p.deltaX * config.SPLAT_FORCE,
            p.deltaY * config.SPLAT_FORCE,
            p.color);
    }

    function clickSplat(p) {
      const c = generateColor();
      c.r *= 10; c.g *= 10; c.b *= 10;
      splat(p.texcoordX, p.texcoordY,
            10*(Math.random()-0.5), 30*(Math.random()-0.5), c);
    }

    function splat(x, y, dx, dy, color) {
      splatProg.bind();
      u1i(splatProg, "uTarget",     velocity.read.attach(0));
      u1f(splatProg, "aspectRatio", canvas.width / canvas.height);
      u2f(splatProg, "point",       x, y);
      u3f(splatProg, "color",       dx, dy, 0);
      u1f(splatProg, "radius",      correctRadius(config.SPLAT_RADIUS / 100));
      blit(velocity.write); velocity.swap();

      u1i(splatProg, "uTarget", dye.read.attach(0));
      u3f(splatProg, "color",   color.r, color.g, color.b);
      blit(dye.write); dye.swap();
    }

    function correctRadius(r) {
      const ar = canvas.width / canvas.height;
      return ar > 1 ? r * ar : r;
    }

    function correctDeltaX(d) {
      const ar = canvas.width / canvas.height;
      return ar < 1 ? d * ar : d;
    }

    function correctDeltaY(d) {
      const ar = canvas.width / canvas.height;
      return ar > 1 ? d / ar : d;
    }

    // ── Pointer update helpers ─────────────────────────────────────────────
    function updatePointerDown(p, id, posX, posY) {
      p.id = id; p.down = true; p.moved = false;
      p.texcoordX = posX / canvas.width;
      p.texcoordY = 1 - posY / canvas.height;
      p.prevTexcoordX = p.texcoordX;
      p.prevTexcoordY = p.texcoordY;
      p.deltaX = p.deltaY = 0;
      p.color = generateColor();
    }

    function updatePointerMove(p, posX, posY, color) {
      p.prevTexcoordX = p.texcoordX;
      p.prevTexcoordY = p.texcoordY;
      p.texcoordX = posX / canvas.width;
      p.texcoordY = 1 - posY / canvas.height;
      p.deltaX = correctDeltaX(p.texcoordX - p.prevTexcoordX);
      p.deltaY = correctDeltaY(p.texcoordY - p.prevTexcoordY);
      p.moved = Math.abs(p.deltaX) > 0 || Math.abs(p.deltaY) > 0;
      p.color = color;
    }

    function updatePointerUp(p) { p.down = false; }

    // ── Colour generation ──────────────────────────────────────────────────
    function generateColor() {
      const c = hsvToRgb(Math.random(), 1.0, 1.0);
      c.r *= 0.15; c.g *= 0.15; c.b *= 0.15;
      return c;
    }

    function hsvToRgb(h, s, v) {
      const i = Math.floor(h * 6), f = h * 6 - i;
      const p = v*(1-s), q = v*(1-f*s), t = v*(1-(1-f)*s);
      let r=0, g=0, b=0;
      switch(i%6){
        case 0: r=v; g=t; b=p; break;
        case 1: r=q; g=v; b=p; break;
        case 2: r=p; g=v; b=t; break;
        case 3: r=p; g=q; b=v; break;
        case 4: r=t; g=p; b=v; break;
        case 5: r=v; g=p; b=q; break;
      }
      return { r, g, b };
    }

    function wrap(val, min, max) {
      const range = max - min;
      return range === 0 ? min : ((val - min) % range) + min;
    }

    // ── Event listeners ────────────────────────────────────────────────────
    window.addEventListener("mousedown", (e) => {
      const p = pointers[0];
      updatePointerDown(p, -1, scaleByPixelRatio(e.clientX), scaleByPixelRatio(e.clientY));
      clickSplat(p);
    });

    // Start loop on first mouse move, then keep updating
    let loopStarted = false;
    function ensureLoop() {
      if (!loopStarted) { loopStarted = true; loop(); }
    }

    window.addEventListener("mousemove", (e) => {
      ensureLoop();
      const p = pointers[0];
      updatePointerMove(p, scaleByPixelRatio(e.clientX), scaleByPixelRatio(e.clientY), p.color);
    });

    window.addEventListener("touchstart", (e) => {
      ensureLoop();
      const p = pointers[0];
      const t = e.targetTouches[0];
      updatePointerDown(p, t.identifier, scaleByPixelRatio(t.clientX), scaleByPixelRatio(t.clientY));
    }, { passive: true });

    window.addEventListener("touchmove", (e) => {
      const p = pointers[0];
      const t = e.targetTouches[0];
      updatePointerMove(p, scaleByPixelRatio(t.clientX), scaleByPixelRatio(t.clientY), p.color);
    }, { passive: true });

    window.addEventListener("touchend", () => { updatePointerUp(pointers[0]); });
  }

  // ─── Entry point ────────────────────────────────────────────────────────
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
