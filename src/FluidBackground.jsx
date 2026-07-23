import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle, RenderTarget } from 'ogl';

const PRESSURE_ITERATIONS = 22;
const PRESSURE_ITERATIONS_SMALL = 16;
const DENSITY_DISSIPATION = 2.8;
const VELOCITY_DISSIPATION = 2.2;
const PRESSURE_DISSIPATION = 0.8;
const CURL_STRENGTH = 12;
const SPLAT_RADIUS = 0.22;
const SPLAT_FORCE = 2800;
const MAX_POINTER_DELTA = 0.04;
const MIN_SPLAT_INTERVAL = 0.03;
const IDLE_SPLAT_INTERVAL = 3.4;
const SMALL_SCREEN_WIDTH = 640;

const baseVertex = /* glsl */ `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform vec2 texelSize;
void main () {
  vUv = uv;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const splatShader = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec3 color;
uniform vec2 point;
uniform float radius;
void main () {
  vec2 p = vUv - point.xy;
  p.x *= aspectRatio;
  vec3 splat = exp(-dot(p, p) / radius) * color;
  vec3 base = texture2D(uTarget, vUv).xyz;
  gl_FragColor = vec4(base + splat, 1.0);
}
`;

const advectionShader = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float dt;
uniform float dissipation;
void main () {
  vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
  vec4 result = texture2D(uSource, coord);
  float decay = 1.0 + dissipation * dt;
  gl_FragColor = result / decay;
}
`;

const divergenceShader = /* glsl */ `
precision highp float;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uVelocity, vL).x;
  float R = texture2D(uVelocity, vR).x;
  float T = texture2D(uVelocity, vT).y;
  float B = texture2D(uVelocity, vB).y;
  vec2 C = texture2D(uVelocity, vUv).xy;
  if (vL.x < 0.0) { L = -C.x; }
  if (vR.x > 1.0) { R = -C.x; }
  if (vT.y > 1.0) { T = -C.y; }
  if (vB.y < 0.0) { B = -C.y; }
  float div = 0.5 * (R - L + T - B);
  gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
}
`;

const curlShader = /* glsl */ `
precision highp float;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uVelocity, vL).y;
  float R = texture2D(uVelocity, vR).y;
  float T = texture2D(uVelocity, vT).x;
  float B = texture2D(uVelocity, vB).x;
  float vorticity = R - L - T + B;
  gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
}
`;

const vorticityShader = /* glsl */ `
precision highp float;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;
void main () {
  float L = texture2D(uCurl, vL).x;
  float R = texture2D(uCurl, vR).x;
  float T = texture2D(uCurl, vT).x;
  float B = texture2D(uCurl, vB).x;
  float C = texture2D(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C;
  force.y *= -1.0;
  vec2 vel = texture2D(uVelocity, vUv).xy;
  vel += force * dt;
  vel = clamp(vel, -220.0, 220.0);
  gl_FragColor = vec4(vel, 0.0, 1.0);
}
`;

const pressureShader = /* glsl */ `
precision highp float;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main () {
  float L = texture2D(uPressure, vL).x;
  float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x;
  float B = texture2D(uPressure, vB).x;
  float divergence = texture2D(uDivergence, vUv).x;
  float pressure = (L + R + B + T - divergence) * 0.25;
  gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
}
`;

const zeroShader = /* glsl */ `
precision highp float;
void main () {
  gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
}
`;

const clearShader = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTexture;
uniform float value;
void main () {
  gl_FragColor = value * texture2D(uTexture, vUv);
}
`;

const gradientSubtractShader = /* glsl */ `
precision highp float;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uPressure, vL).x;
  float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x;
  float B = texture2D(uPressure, vB).x;
  vec2 velocity = texture2D(uVelocity, vUv).xy;
  velocity.xy -= vec2(R - L, T - B);
  gl_FragColor = vec4(velocity, 0.0, 1.0);
}
`;

const displayShader = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTexture;
void main () {
  vec3 c = texture2D(uTexture, vUv).rgb;
  float a = clamp(max(max(c.r, c.g), c.b), 0.0, 1.0);
  gl_FragColor = vec4(c, a);
}
`;

function hexToRgb(hex) {
  const clean = hex.trim().replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const int = parseInt(full, 16);
  if (Number.isNaN(int)) return [0.4, 0.85, 0.98];
  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255];
}

function getPalette() {
  const styles = getComputedStyle(document.documentElement);
  const a = hexToRgb(styles.getPropertyValue('--accent') || '#61dafb');
  const b = hexToRgb(styles.getPropertyValue('--accent-strong') || '#9beeff');
  return [a, b];
}

function randomSplatColor(intensity) {
  const [a, b] = getPalette();
  const t = Math.random();
  return [
    (a[0] + (b[0] - a[0]) * t) * intensity,
    (a[1] + (b[1] - a[1]) * t) * intensity,
    (a[2] + (b[2] - a[2]) * t) * intensity,
  ];
}

function getResolution(baseResolution, width, height) {
  let aspect = width / height;
  if (aspect < 1) aspect = 1 / aspect;
  const min = Math.round(baseResolution);
  const max = Math.round(baseResolution * aspect);
  return width > height ? { width: max, height: min } : { width: min, height: max };
}

export default function FluidBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let renderer;
    try {
      renderer = new Renderer({
        alpha: true,
        premultipliedAlpha: false,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, 1.5),
        width: container.clientWidth,
        height: container.clientHeight,
      });
    } catch (e) {
      return undefined;
    }

    const gl = renderer.gl;
    if (!gl) return undefined;

    const isWebgl2 = gl.renderer.isWebgl2;
    let texType;
    let texFilter;
    if (isWebgl2) {
      texType = gl.HALF_FLOAT;
      texFilter = gl.LINEAR;
    } else {
      const halfFloat = gl.renderer.extensions['OES_texture_half_float'];
      if (!halfFloat) return undefined;
      const halfFloatLinear = gl.renderer.extensions['OES_texture_half_float_linear'];
      texType = halfFloat.HALF_FLOAT_OES;
      texFilter = halfFloatLinear ? gl.LINEAR : gl.NEAREST;
    }
    const texInternalFormat = isWebgl2 ? gl.RGBA16F : gl.RGBA;

    gl.clearColor(0, 0, 0, 0);
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    gl.canvas.style.display = 'block';
    container.appendChild(gl.canvas);

    const isSmallScreen = window.innerWidth <= SMALL_SCREEN_WIDTH;
    const simBase = isSmallScreen ? 56 : 112;
    const dyeBase = isSmallScreen ? 320 : 720;
    const iterations = isSmallScreen ? PRESSURE_ITERATIONS_SMALL : PRESSURE_ITERATIONS;

    let simWidth;
    let simHeight;
    let simTexelSize = [0, 0];

    const fboOptions = {
      type: texType,
      format: gl.RGBA,
      internalFormat: texInternalFormat,
      minFilter: texFilter,
      magFilter: texFilter,
      depth: false,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE,
    };
    const fboOptionsNearest = { ...fboOptions, minFilter: gl.NEAREST, magFilter: gl.NEAREST };

    const createDoubleFBO = (width, height, options) => {
      let fbo1 = new RenderTarget(gl, { ...options, width, height });
      let fbo2 = new RenderTarget(gl, { ...options, width, height });
      return {
        width,
        height,
        get read() {
          return fbo1;
        },
        get write() {
          return fbo2;
        },
        swap() {
          const t = fbo1;
          fbo1 = fbo2;
          fbo2 = t;
        },
        resize(w, h) {
          fbo1.setSize(w, h);
          fbo2.setSize(w, h);
        },
      };
    };

    const triangle = new Triangle(gl);
    const makeProgram = (fragment, uniforms) =>
      new Program(gl, {
        vertex: baseVertex,
        fragment,
        uniforms: { texelSize: { value: [0, 0] }, ...uniforms },
        depthTest: false,
        depthWrite: false,
      });
    const makeMesh = (program) => new Mesh(gl, { geometry: triangle, program });

    const splatProgram = makeProgram(splatShader, {
      uTarget: { value: null },
      aspectRatio: { value: 1 },
      color: { value: [0, 0, 0] },
      point: { value: [0, 0] },
      radius: { value: SPLAT_RADIUS / 100 },
    });
    const advectionProgram = makeProgram(advectionShader, {
      uVelocity: { value: null },
      uSource: { value: null },
      dt: { value: 0.016 },
      dissipation: { value: 1 },
    });
    const divergenceProgram = makeProgram(divergenceShader, { uVelocity: { value: null } });
    const curlProgram = makeProgram(curlShader, { uVelocity: { value: null } });
    const vorticityProgram = makeProgram(vorticityShader, {
      uVelocity: { value: null },
      uCurl: { value: null },
      curl: { value: CURL_STRENGTH },
      dt: { value: 0.016 },
    });
    const pressureProgram = makeProgram(pressureShader, {
      uPressure: { value: null },
      uDivergence: { value: null },
    });
    const clearProgram = makeProgram(clearShader, { uTexture: { value: null }, value: { value: PRESSURE_DISSIPATION } });
    const gradientSubtractProgram = makeProgram(gradientSubtractShader, {
      uPressure: { value: null },
      uVelocity: { value: null },
    });
    const displayProgram = makeProgram(displayShader, { uTexture: { value: null } });
    const zeroProgram = makeProgram(zeroShader, {});

    const splatMesh = makeMesh(splatProgram);
    const advectionMesh = makeMesh(advectionProgram);
    const divergenceMesh = makeMesh(divergenceProgram);
    const curlMesh = makeMesh(curlProgram);
    const vorticityMesh = makeMesh(vorticityProgram);
    const pressureMesh = makeMesh(pressureProgram);
    const clearMesh = makeMesh(clearProgram);
    const gradientSubtractMesh = makeMesh(gradientSubtractProgram);
    const displayMesh = makeMesh(displayProgram);
    const zeroMesh = makeMesh(zeroProgram);
    const zeroOut = (target) => renderer.render({ scene: zeroMesh, target, clear: true });

    let velocity;
    let dye;
    let pressure;
    let divergenceTarget;
    let curlTarget;

    const initFramebuffers = () => {
      const sim = getResolution(simBase, renderer.width, renderer.height);
      const dyeRes = getResolution(dyeBase, renderer.width, renderer.height);
      simWidth = sim.width;
      simHeight = sim.height;
      simTexelSize = [1 / simWidth, 1 / simHeight];

      velocity = createDoubleFBO(simWidth, simHeight, fboOptions);
      pressure = createDoubleFBO(simWidth, simHeight, fboOptionsNearest);
      divergenceTarget = new RenderTarget(gl, { ...fboOptionsNearest, width: simWidth, height: simHeight });
      curlTarget = new RenderTarget(gl, { ...fboOptionsNearest, width: simWidth, height: simHeight });
      dye = createDoubleFBO(dyeRes.width, dyeRes.height, fboOptions);

      // render-target textures aren't guaranteed zero-initialized on every driver;
      // force every buffer to a known blank state before the sim ever reads from one.
      [velocity.read, velocity.write, pressure.read, pressure.write, divergenceTarget, curlTarget, dye.read, dye.write].forEach(
        zeroOut
      );
    };

    initFramebuffers();

    const correctRadius = (radius, aspect) => (aspect > 1 ? radius * aspect : radius);

    const splat = (x, y, dx, dy, color) => {
      const aspect = renderer.width / renderer.height;
      splatProgram.uniforms.aspectRatio.value = aspect;
      splatProgram.uniforms.radius.value = correctRadius(SPLAT_RADIUS / 100, aspect);
      splatProgram.uniforms.point.value = [x, y];

      splatProgram.uniforms.uTarget.value = velocity.read.texture;
      splatProgram.uniforms.color.value = [dx, dy, 0];
      renderer.render({ scene: splatMesh, target: velocity.write, clear: false });
      velocity.swap();

      splatProgram.uniforms.uTarget.value = dye.read.texture;
      splatProgram.uniforms.color.value = color;
      renderer.render({ scene: splatMesh, target: dye.write, clear: false });
      dye.swap();
    };

    const step = (dt) => {
      curlProgram.uniforms.texelSize.value = simTexelSize;
      curlProgram.uniforms.uVelocity.value = velocity.read.texture;
      renderer.render({ scene: curlMesh, target: curlTarget, clear: false });

      vorticityProgram.uniforms.texelSize.value = simTexelSize;
      vorticityProgram.uniforms.uVelocity.value = velocity.read.texture;
      vorticityProgram.uniforms.uCurl.value = curlTarget.texture;
      vorticityProgram.uniforms.dt.value = dt;
      renderer.render({ scene: vorticityMesh, target: velocity.write, clear: false });
      velocity.swap();

      divergenceProgram.uniforms.texelSize.value = simTexelSize;
      divergenceProgram.uniforms.uVelocity.value = velocity.read.texture;
      renderer.render({ scene: divergenceMesh, target: divergenceTarget, clear: false });

      clearProgram.uniforms.uTexture.value = pressure.read.texture;
      clearProgram.uniforms.value.value = PRESSURE_DISSIPATION;
      renderer.render({ scene: clearMesh, target: pressure.write, clear: false });
      pressure.swap();

      pressureProgram.uniforms.texelSize.value = simTexelSize;
      pressureProgram.uniforms.uDivergence.value = divergenceTarget.texture;
      for (let i = 0; i < iterations; i++) {
        pressureProgram.uniforms.uPressure.value = pressure.read.texture;
        renderer.render({ scene: pressureMesh, target: pressure.write, clear: false });
        pressure.swap();
      }

      gradientSubtractProgram.uniforms.texelSize.value = simTexelSize;
      gradientSubtractProgram.uniforms.uPressure.value = pressure.read.texture;
      gradientSubtractProgram.uniforms.uVelocity.value = velocity.read.texture;
      renderer.render({ scene: gradientSubtractMesh, target: velocity.write, clear: false });
      velocity.swap();

      advectionProgram.uniforms.texelSize.value = simTexelSize;
      advectionProgram.uniforms.uVelocity.value = velocity.read.texture;
      advectionProgram.uniforms.uSource.value = velocity.read.texture;
      advectionProgram.uniforms.dt.value = dt;
      advectionProgram.uniforms.dissipation.value = VELOCITY_DISSIPATION;
      renderer.render({ scene: advectionMesh, target: velocity.write, clear: false });
      velocity.swap();

      advectionProgram.uniforms.uVelocity.value = velocity.read.texture;
      advectionProgram.uniforms.uSource.value = dye.read.texture;
      advectionProgram.uniforms.dissipation.value = DENSITY_DISSIPATION;
      renderer.render({ scene: advectionMesh, target: dye.write, clear: false });
      dye.swap();
    };

    const pointer = { x: 0.5, y: 0.5, primed: false, lastSplatTime: 0 };
    const clampDelta = (v) => Math.max(-MAX_POINTER_DELTA, Math.min(MAX_POINTER_DELTA, v));

    const updatePointer = (clientX, clientY) => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = (clientX - rect.left) / rect.width;
      const y = 1 - (clientY - rect.top) / rect.height;
      if (!pointer.primed) {
        pointer.x = x;
        pointer.y = y;
        pointer.primed = true;
        return;
      }
      const rawDx = clampDelta(x - pointer.x);
      const rawDy = clampDelta(y - pointer.y);
      pointer.x = x;
      pointer.y = y;
      const now = performance.now();
      if (now - pointer.lastSplatTime < MIN_SPLAT_INTERVAL * 1000) return;
      const dx = rawDx * SPLAT_FORCE;
      const dy = rawDy * SPLAT_FORCE;
      if (Math.abs(dx) > 0.6 || Math.abs(dy) > 0.6) {
        pointer.lastSplatTime = now;
        splat(x, y, dx, dy, randomSplatColor(0.85));
      }
    };

    const onPointerMove = (e) => updatePointer(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      if (e.touches && e.touches.length) updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    const autoSplat = () => {
      const x = 0.15 + Math.random() * 0.7;
      const y = 0.15 + Math.random() * 0.7;
      const dx = (Math.random() - 0.5) * SPLAT_FORCE * 0.35;
      const dy = (Math.random() - 0.5) * SPLAT_FORCE * 0.35;
      splat(x, y, dx, dy, randomSplatColor(0.5));
    };

    let rafId;
    let lastTime = performance.now();
    let idleTimer = 0;
    let paused = document.hidden;

    const frame = (now) => {
      rafId = requestAnimationFrame(frame);
      if (paused) {
        lastTime = now;
        return;
      }
      const dt = Math.min((now - lastTime) / 1000, 0.033);
      lastTime = now;
      idleTimer += dt;
      if (idleTimer > IDLE_SPLAT_INTERVAL) {
        idleTimer = 0;
        autoSplat();
      }
      step(dt);
      displayProgram.uniforms.uTexture.value = dye.read.texture;
      renderer.render({ scene: displayMesh, target: null });
    };
    rafId = requestAnimationFrame(frame);

    const onVisibilityChange = () => {
      paused = document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        renderer.setSize(container.clientWidth, container.clientHeight);
        initFramebuffers();
      }, 150);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      const loseContext = gl.getExtension('WEBGL_lose_context');
      if (loseContext) loseContext.loseContext();
      if (gl.canvas.parentNode === container) container.removeChild(gl.canvas);
    };
  }, []);

  return <div className="fluid-bg" ref={containerRef} aria-hidden="true" />;
}
