// @ts-nocheck
import * as THREE from 'three';
import { AK47_CONFIG, AK47_DEF, buildAk47Geometry } from '../game/weapons/ak47';
import { DEAGLE_CONFIG, DEAGLE_DEF, DEAGLE_MAG_LEN, DEAGLE_RAKE, buildDesertEagleGeometry } from '../game/weapons/desertEagle';
import { Hn, Ia, Is, Ro, T0, Z0, ar, j0, u0 } from './core.js';
import { explosivesModule } from './explosives.js';
import { Ei, Tr, bn } from './geometry.js';
import {
  FE,
  Fh,
  Fr,
  Jl,
  Kl,
  Lh,
  S5,
  Sh,
  Th,
  Un,
  d0,
  di,
  er,
  h5,
  kh,
  mn,
  nn,
  ra,
  t0,
  tc,
  tn,
  tr,
  vs,
  wh,
  xs,
} from './hands.js';

ar(explosivesModule, { create: () => I5, showcase: () => BD });

var Qo = {
  model: [8, 8, 440, 112],
  p_model: [456, 8, 300, 112],
  rack: [764, 8, 420, 150],
  p_rack: [1192, 8, 340, 120],
  qr: [1540, 8, 150, 150],
  cart: [1698, 8, 230, 150],
  warn: [8, 166, 640, 170],
  optic: [656, 166, 420, 84],
  light: [1084, 166, 420, 84],
  p_name: [1512, 166, 340, 78],
  p_cal: [656, 258, 340, 50],
  p_sn: [1004, 258, 340, 50],
  sn: [1352, 258, 400, 50],
  proof: [1760, 258, 200, 60],
  maker: [8, 344, 880, 56],
  cal: [896, 344, 880, 56],
  prop: [8, 408, 1100, 56],
  p_maker: [1116, 408, 880, 56],
  p_prop: [8, 472, 900, 56],
  safe: [916, 472, 96, 60],
  semi: [1020, 472, 96, 60],
  auto: [1124, 472, 96, 60],
  dots: [1228, 472, 96, 60],
  nm: [1332, 472, 660, 50],
  tag: [8, 610, 560, 200],
  arrow: [580, 610, 120, 60],
  index: [710, 610, 60, 60],
};

for (let n = 0; n < 20; n++) Qo['r' + (2 + n * 2)] = [8 + n * 100, 540, 92, 60];

var y1 = 2048,
  b1 = 1024;

function Fz() {
  let n = document.createElement('canvas');
  ((n.width = y1), (n.height = b1));
  let e = n.getContext('2d');
  (e.clearRect(0, 0, y1, b1), (e.textBaseline = 'middle'));
  let t = (h, p, d, m, x = 'left') => {
      let [v, y, b, g] = Qo[h];
      ((e.font = d),
        (e.fillStyle = m),
        (e.textAlign = x),
        e.fillText(p, x === 'left' ? v + 4 : v + b / 2, y + g / 2 + 2, b - 8));
    },
    i = '"Barlow Condensed", "Arial Narrow", Arial, sans-serif',
    s = '"IBM Plex Mono", "Courier New", monospace',
    o = '"Big Shoulders Display", "Barlow Condensed", Impact, sans-serif',
    r = 'rgba(158,160,158,0.92)',
    a = 'rgba(206,198,160,0.92)',
    l = 'rgba(196,52,36,0.95)';
  (t('model', 'AK-47', `700 104px ${o}`, r),
    t('maker', 'IZHMASH  \xB7  7.62\xD739', `600 44px ${i}`, r),
    t('cal', 'CAL 7.62\xD739   SN 1974-04217', `500 38px ${s}`, r),
    t('prop', 'PROPERTY OF PORT AUTHORITY \u2014 BERTH 4 ARMOURY', `600 40px ${i}`, r),
    t('sn', 'PA-004217', `500 40px ${s}`, r, 'center'),
    t('nm', 'BARREL NUT 54 N\xB7m  \xB7  DO NOT OIL THREADS', `600 34px ${i}`, r),
    t('safe', 'S', `700 46px ${i}`, r, 'center'),
    t('semi', '1', `700 46px ${i}`, r, 'center'),
    t('auto', 'A', `700 46px ${i}`, l, 'center'),
    t('rack', 'B4-07', `800 142px ${o}`, a, 'center'));
  for (let h = 0; h < 20; h++)
    t('r' + (2 + h * 2), 'T' + (2 + h * 2), `600 40px ${s}`, 'rgba(150,152,150,0.88)', 'center');
  (t('optic', 'HX-2 REFLEX', `700 62px ${i}`, r, 'center'),
    t('light', '900 LM  IPX8', `600 56px ${i}`, r, 'center'),
    t('p_model', 'DESERT EAGLE', `700 104px ${o}`, r),
    t('p_name', '.50 AE', `600 70px ${i}`, r),
    t('p_cal', '50 ACTION EXPRESS', `500 38px ${s}`, r),
    t('p_sn', 'SN DE-050192', `500 38px ${s}`, r),
    t('p_rack', 'B4-11', `800 112px ${o}`, a, 'center'),
    t('p_maker', 'MAGNUM RESEARCH  \xB7  IMI', `600 44px ${i}`, r),
    t('p_prop', 'PROPERTY OF PORT AUTHORITY \u2014 BERTH 4', `600 40px ${i}`, r));
  {
    let [h, p] = Qo.warn;
    ((e.fillStyle = r),
      (e.textAlign = 'left'),
      (e.font = `600 38px ${i}`),
      [
        'WARNING \u2014 CLEAR CHAMBER BEFORE',
        'STOWAGE. AUTHORISED BREACH',
        'PERSONNEL ONLY. PA-REG 44/7',
      ].forEach((d, m) => e.fillText(d, h + 4, p + 32 + m * 52, 630)));
  }
  {
    let [h, p, d, m] = Qo.dots;
    ((e.fillStyle = r),
      e.beginPath(),
      e.arc(h + 24, p + m / 2, 11, 0, 7),
      e.fill(),
      (e.fillStyle = l),
      e.beginPath(),
      e.arc(h + 68, p + m / 2, 11, 0, 7),
      e.fill());
  }
  let c = 7,
    u = () => ((c = (c * 16807) % 2147483647), c / 2147483647);
  {
    let [h, p, d] = Qo.qr,
      m = 16,
      x = (d - 12) / m;
    e.fillStyle = r;
    for (let v = 0; v < m; v++)
      for (let y = 0; y < m; y++)
        (y === 0 ||
          v === m - 1 ||
          (v === 0 && y % 2 === 0) ||
          (y === m - 1 && v % 2 === 1) ||
          (y > 0 && v > 0 && y < m - 1 && v < m - 1 && u() > 0.52)) &&
          e.fillRect(h + 6 + y * x, p + 6 + v * x, x + 0.5, x + 0.5);
  }
  {
    let [h, p, d, m] = Qo.cart,
      x = h + d / 2,
      v = p + m / 2;
    ((e.strokeStyle = r),
      (e.fillStyle = r),
      (e.lineWidth = 6),
      e.beginPath(),
      e.ellipse(x, v, d / 2 - 8, m / 2 - 8, 0, 0, 7),
      e.stroke(),
      (e.lineWidth = 3),
      e.beginPath(),
      e.ellipse(x, v, d / 2 - 20, m / 2 - 20, 0, 0, 7),
      e.stroke(),
      (e.lineWidth = 7),
      e.beginPath(),
      e.moveTo(x, v - 36),
      e.lineTo(x, v + 30),
      e.moveTo(x - 16, v - 20),
      e.lineTo(x + 16, v - 20),
      e.stroke(),
      e.beginPath(),
      e.arc(x, v + 2, 30, 0.25, Math.PI - 0.25),
      e.stroke(),
      e.beginPath(),
      e.arc(x, v - 42, 7, 0, 7),
      e.stroke(),
      (e.font = `700 30px ${i}`),
      (e.textAlign = 'center'),
      e.fillText('L', x - 62, v + 2),
      e.fillText('W', x + 62, v + 2));
  }
  {
    let [h, p, , d] = Qo.proof,
      m = p + d / 2;
    ((e.strokeStyle = r),
      (e.fillStyle = r),
      (e.lineWidth = 4),
      (e.font = `700 30px ${i}`),
      (e.textAlign = 'center'),
      e.beginPath(),
      e.arc(h + 34, m, 24, 0, 7),
      e.stroke(),
      e.fillText('P', h + 34, m + 2),
      e.beginPath(),
      e.moveTo(h + 100, m - 26),
      e.lineTo(h + 126, m),
      e.lineTo(h + 100, m + 26),
      e.lineTo(h + 74, m),
      e.closePath(),
      e.stroke(),
      e.fillText('4', h + 100, m + 2),
      e.strokeRect(h + 144, m - 22, 44, 44),
      e.fillText('N', h + 166, m + 2));
  }
  {
    let [h, p, d, m] = Qo.tag;
    ((e.fillStyle = 'rgba(186,184,174,0.97)'),
      e.fillRect(h + 4, p + 4, d - 8, m - 8),
      (e.fillStyle = 'rgba(24,24,26,0.96)'),
      (e.textAlign = 'left'),
      (e.font = `700 40px ${i}`),
      e.fillText('PORT AUTHORITY  \xB7  BERTH 4', h + 22, p + 38, d - 44),
      (e.font = `500 30px ${s}`),
      e.fillText('ASSET 0407-A   INSP 11/26', h + 22, p + 172, d - 44));
    let x = h + 22;
    for (; x < h + d - 30;) {
      let v = 2 + Math.floor(u() * 4) * 2;
      (e.fillRect(x, p + 66, v, 78), (x += v + 2 + Math.floor(u() * 3) * 2));
    }
  }
  {
    let [h, p, d, m] = Qo.arrow;
    ((e.fillStyle = r),
      e.beginPath(),
      e.moveTo(h + 8, p + m / 2 - 7),
      e.lineTo(h + d - 40, p + m / 2 - 7),
      e.lineTo(h + d - 40, p + 8),
      e.lineTo(h + d - 8, p + m / 2),
      e.lineTo(h + d - 40, p + m - 8),
      e.lineTo(h + d - 40, p + m / 2 + 7),
      e.lineTo(h + 8, p + m / 2 + 7),
      e.fill());
  }
  {
    let [h, p, d, m] = Qo.index;
    ((e.fillStyle = 'rgba(214,214,208,0.95)'), e.fillRect(h + d / 2 - 5, p + 6, 10, m - 12));
  }
  e.globalCompositeOperation = 'destination-out';
  for (let h = 0; h < 5200; h++) {
    e.fillStyle = `rgba(0,0,0,${0.2 + u() * 0.55})`;
    let p = u() < 0.92 ? 1 + u() * 2 : 3 + u() * 7;
    e.fillRect(u() * y1, u() * b1, p, p * (0.4 + u()));
  }
  {
    let [h, p, d, m] = Qo.rack;
    for (let x = 0; x < 260; x++) {
      e.fillStyle = `rgba(0,0,0,${0.3 + u() * 0.6})`;
      let v = 2 + u() * 9;
      e.fillRect(h + u() * d, p + u() * m, v * (0.5 + u() * 2), v * 0.6);
    }
  }
  let f = new THREE.CanvasTexture(n);
  return (
    (f.colorSpace = THREE.SRGBColorSpace),
    (f.anisotropy = 8),
    (f.generateMipmaps = !0),
    (f.minFilter = THREE.LinearMipmapLinearFilter),
    f
  );
}

var Nz = [
    [2, 1],
    [4, 3],
    [6, 15],
    [8, 17],
    [10, 19],
    [12, 21],
    [14, 23],
    [26, 35],
    [28, 37],
    [30, 39],
    [32, 41],
  ].map(([n, e]) => ['r' + n, 0, 0.04362, -0.09211 + e * 0.01001, 0.003, 'T']),
  ty = {
    rifle: [
      ['model', -0.01522, -0.035, 0.066, 0.0092, 'L'],
      ['maker', -0.01522, -0.0452, 0.0672, 0.003, 'L'],
      ['cal', -0.01522, -0.05, 0.0672, 0.0027, 'L'],
      ['prop', -0.01522, -0.0712, 0.0675, 0.0024, 'L'],
      ['cart', -0.01522, -0.061, 0.054, 0.008, 'L'],
      ['proof', -0.01522, -0.0612, 0.08, 0.0034, 'L'],
      ['auto', -0.01642, -0.0262, -0.0335, 0.0038, 'L'],
      ['semi', -0.01642, -0.0252, -0.049, 0.0038, 'L'],
      ['safe', -0.01642, -0.0362, -0.0605, 0.0038, 'L'],
      ['warn', -0.01652, -0.0082, 0.033, 0.0058, 'L'],
      ['qr', -0.01652, -0.007, -0.044, 0.0078, 'L'],
      ['sn', -0.01652, -0.0098, -0.079, 0.0026, 'L'],
      ['cal', -0.01812, 0.0244, 0, 0.0022, 'L'],
      ['rack', -0.01702, -0.003, -0.203, 0.019, 'L'],
      ['optic', -0.01935, 0.0735, 0.021, 0.0024, 'L'],
      ['model', 0.01522, -0.035, 0.069, 0.0092, 'R'],
      ['maker', 0.01522, -0.0452, 0.0672, 0.003, 'R'],
      ['prop', 0.01522, -0.0712, 0.0675, 0.0024, 'R'],
      ['tag', 0.01522, -0.06, 0.067, 0.0094, 'R'],
      ['auto', 0.01642, -0.0262, -0.0335, 0.0038, 'R'],
      ['semi', 0.01642, -0.0252, -0.049, 0.0038, 'R'],
      ['safe', 0.01642, -0.0362, -0.0605, 0.0038, 'R'],
      ['sn', 0.01652, -0.0098, -0.067, 0.003, 'R'],
      ['proof', 0.01652, 0.001, 0.0808, 0.0036, 'R'],
      ['nm', 0.01812, 0.0244, 0.05, 0.002, 'R'],
      ['rack', 0.01702, -0.003, -0.203, 0.019, 'R'],
      ['optic', 0.01935, 0.0725, 0.025, 0.0022, 'R'],
      ...Nz,
    ],
    pistolSlide: [
      ['p_model', -0.01292, -6e-4, 0.047, 0.0066, 'L'],
      ['p_name', -0.01292, -6e-4, 0.0225, 0.004, 'L'],
      ['p_maker', -0.01292, -0.0038, -0.024, 0.0017, 'L'],
      ['cart', -0.01292, 6e-4, -0.03, 0.0048, 'L'],
      ['p_cal', 0.01292, -6e-4, 0.047, 0.0036, 'R'],
      ['proof', 0.01292, -0.001, -0.035, 0.0026, 'R'],
    ],
    pistolFrame: [
      ['p_prop', -0.01282, -0.0196, 0.061, 0.002, 'L'],
      ['qr', -0.01282, -0.025, 0.086, 0.0048, 'L'],
      ['p_sn', 0.01282, -0.0196, 0.064, 0.0024, 'R'],
      ['p_rack', 0.01282, -0.025, 0.08, 0.0036, 'R'],
    ],
  },
  bE = `vec3 dBump(vec3 N, float h){ vec3 dpdx = dFdx(-vViewPosition), dpdy = dFdy(-vViewPosition); float dhx = dFdx(h), dhy = dFdy(h);
  vec3 r1 = cross(dpdy, N), r2 = cross(N, dpdx); float det = dot(dpdx, r1); vec3 g = sign(det) * (dhx * r1 + dhy * r2);
  return normalize(abs(det) * N - g); }
`,
  ny = null;

function Uz() {
  if (ny) return ny;
  let n = new THREE.MeshStandardMaterial({
    map: Fz(),
    transparent: !0,
    roughness: 0.78,
    metalness: 0,
    depthWrite: !1,
    polygonOffset: !0,
    polygonOffsetFactor: -3,
    polygonOffsetUnits: -3,
    side: THREE.DoubleSide,
  });
  return (
    (n.name = 'weapon_markings'),
    (n.onBeforeCompile = (e) => {
      e.fragmentShader = e.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
` + bE,
        )
        .replace(
          '#include <normal_fragment_maps>',
          `#include <normal_fragment_maps>
normal = dBump(normal, -diffuseColor.a * 0.00005);`,
        );
    }),
    (n.customProgramCacheKey = () => 'pac-markings-2'),
    (ny = n)
  );
}

function M1(n) {
  let e = n && n[0] && n[0][0];
  e === 'model'
    ? (n = ty.rifle)
    : e === 'p_model'
      ? (n = ty.pistolSlide)
      : e === 'p_prop' && (n = ty.pistolFrame);
  let t = [],
    i = [],
    s = [],
    o = [];
  for (let [l, c, u, f, h, p, d = 0] of n) {
    let [m, x, v, y] = Qo[l],
      b = (h * v) / y,
      g = m / y1,
      E = (m + v) / y1,
      M = 1 - x / b1,
      _ = 1 - (x + y) / b1,
      T = t.length / 3,
      w;
    if (
      (p === 'L'
        ? (w = [
            [c, u - h / 2, -(f + b / 2)],
            [c, u - h / 2, -(f - b / 2)],
            [c, u + h / 2, -(f - b / 2)],
            [c, u + h / 2, -(f + b / 2)],
          ])
        : p === 'R'
          ? (w = [
              [c, u - h / 2, -(f - b / 2)],
              [c, u - h / 2, -(f + b / 2)],
              [c, u + h / 2, -(f + b / 2)],
              [c, u + h / 2, -(f - b / 2)],
            ])
          : (w = [
              [c - b / 2, u, -(f - h / 2)],
              [c + b / 2, u, -(f - h / 2)],
              [c + b / 2, u, -(f + h / 2)],
              [c - b / 2, u, -(f + h / 2)],
            ]),
      d)
    ) {
      let R = Math.cos(d),
        z = Math.sin(d),
        I = u,
        L = -f;
      for (let U of w) {
        let k = U[1] - I,
          C = U[2] - L;
        ((U[1] = I + k * R - C * z), (U[2] = L + k * z + C * R));
      }
    }
    for (let R of w) t.push(R[0], R[1], R[2]);
    i.push(g, _, E, _, E, M, g, M);
    let S = p === 'L' ? [-1, 0, 0] : p === 'R' ? [1, 0, 0] : [0, 1, 0];
    for (let R = 0; R < 4; R++) s.push(S[0], S[1], S[2]);
    o.push(T, T + 1, T + 2, T, T + 2, T + 3);
  }
  let r = new THREE.BufferGeometry();
  (r.setAttribute('position', new THREE.Float32BufferAttribute(t, 3)),
    r.setAttribute('uv', new THREE.Float32BufferAttribute(i, 2)),
    r.setAttribute('normal', new THREE.Float32BufferAttribute(s, 3)),
    r.setIndex(o));
  let a = new THREE.Mesh(r, Uz());
  return ((a.renderOrder = 2), a);
}

function ME(n, e) {
  let t = new THREE.Shape();
  (n.forEach((a, l) => (l ? t.lineTo(a[0], a[1]) : t.moveTo(a[0], a[1]))), t.closePath());
  let i = new THREE.ShapeGeometry(t);
  i.translate(0, 0, -e);
  {
    let a = 1e9,
      l = -1e9,
      c = 1e9,
      u = -1e9;
    for (let p of n)
      ((a = Math.min(a, p[0])), (l = Math.max(l, p[0])), (c = Math.min(c, p[1])), (u = Math.max(u, p[1])));
    let f = i.attributes.position,
      h = i.attributes.uv;
    for (let p = 0; p < f.count; p++) h.setXY(p, (f.getX(p) - a) / (l - a), (f.getY(p) - c) / (u - c));
  }
  let s = new THREE.ShaderMaterial({
      transparent: !0,
      premultipliedAlpha: !0,
      depthWrite: !1,
      side: THREE.DoubleSide,
      uniforms: {
        uBright: { value: 7 },
        uSun: { value: Z0.dir.clone() },
        uSunCol: { value: Z0.color.clone() },
        uZen: { value: T0.zenith.clone() },
        uHor: { value: T0.horizonAway.clone() },
        uTilt: { value: 0.1 },
        uEnv: { value: 1 },
      },
      vertexShader: `
      varying vec3 vView, vFwd, vRight, vUp, vWPos, vWN; varying vec2 vUv;
      uniform float uTilt;
      void main(){
        vUv = uv;
        vec4 mv = modelViewMatrix * vec4(position, 1.0); vView = mv.xyz;
        vFwd = (modelViewMatrix * vec4(0.0, 0.0, -1.0, 0.0)).xyz; vRight = (modelViewMatrix * vec4(1.0, 0.0, 0.0, 0.0)).xyz; vUp = (modelViewMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz;
        vWPos = (modelMatrix * vec4(position, 1.0)).xyz;
        vWN = normalize(mat3(modelMatrix) * normalize(vec3(0.0, -uTilt, 1.0)));   // real sights tilt the glass a few degrees
        gl_Position = projectionMatrix * mv;
      }`,
      fragmentShader: `
      varying vec3 vView, vFwd, vRight, vUp, vWPos, vWN; varying vec2 vUv;
      uniform float uBright, uEnv; uniform vec3 uSun, uSunCol, uZen, uHor;
      void main(){
        vec3 d = normalize(vView), fw = normalize(vFwd);
        float k = max(dot(d, fw), 1e-3);
        vec2 a = vec2(dot(d, normalize(vRight)), dot(d, normalize(vUp))) / k;      // tangent of the angle off the bore axis
        float r = length(a), px = max(fwidth(r), 1e-5);
        float dotR = max(0.0011, px * 0.9), ringW = max(0.00045, px * 0.6);
        float dotI = 1.0 - smoothstep(dotR - px, dotR + px, r);
        float ring = 1.0 - smoothstep(ringW - px * 0.5, ringW + px, abs(r - 0.0128));
        float ang = atan(a.y, a.x);
        float tick = (1.0 - smoothstep(0.0, px * 1.2 + 0.0004, min(abs(a.x), abs(a.y)))) * step(0.0128, r) * (1.0 - smoothstep(0.0165, 0.0175, r));
        float ret = clamp(dotI + ring * 0.8 + tick * 0.8, 0.0, 1.0);
        // faint halo so the bloom has something to hold on to
        ret += 0.05 * exp(-r * r / 0.00002);
        vec3 retCol = vec3(1.0, 0.11, 0.045) * ret * uBright;
        // coated glass: sky/sun reflection through a ruby-teal dichroic coating, stronger at grazing angles
        vec3 wv = normalize(vWPos - cameraPosition); vec3 n = normalize(vWN); if (dot(n, wv) > 0.0) n = -n;
        vec3 rf = reflect(wv, n);
        float fres = pow(1.0 - abs(dot(wv, n)), 3.0);
        vec3 sky = mix(uHor, uZen, clamp(rf.y * 1.4 + 0.2, 0.0, 1.0));
        float sd = max(dot(rf, uSun), 0.0);
        sky += uSunCol * (pow(sd, 6.0) * 0.6 + pow(sd, 90.0) * 6.0);
        sky = mix(vec3(0.050, 0.047, 0.043), sky, uEnv); sd *= uEnv;               // under a roof the glass mirrors the room, not the sky
        // multi-layer dichroic coating: the reflected tint walks teal -> violet -> amber as the glass turns away from the
        // eye (thin-film path length grows with the angle), a soft diagonal sheen band, and a thin dark edge
        float band = smoothstep(0.25, 0.5, vUv.x * 0.6 + vUv.y) * (1.0 - smoothstep(0.62, 0.95, vUv.x * 0.6 + vUv.y));
        float ndv = abs(dot(wv, n)), ph = (1.0 - ndv) * 2.6 + vUv.y * 0.35 + vUv.x * 0.12;
        vec3 film = 0.5 + 0.5 * cos(6.2832 * (ph + vec3(0.62, 0.30, 0.12)));
        vec3 coat = mix(mix(vec3(0.30, 0.52, 0.95), vec3(1.0, 0.62, 0.28), clamp(fres * 2.2 + vUv.y * 0.75 - 0.15, 0.0, 1.0)), film * vec3(0.85, 1.0, 0.95), 0.28);
        vec2 e = abs(vUv - 0.5) * 2.0; float edge = smoothstep(0.90, 1.0, max(e.x, e.y));
        float refl = 0.12 + 0.60 * fres + 0.07 * band;
        // dust and a thumb smear on the outer surface: only where light rakes it
        vec2 dc = vUv * vec2(150.0, 100.0), di = floor(dc); float dh = fract(sin(dot(di, vec2(127.1, 311.7))) * 43758.5453);
        float speck = step(0.988, dh) * (1.0 - smoothstep(0.10, 0.36, length(fract(dc) - 0.5 - (fract(dh * 57.3) - 0.5) * 0.5)));
        vec2 sq = (vUv - vec2(0.70, 0.30)) * vec2(1.0, 1.7); float smudge = exp(-dot(sq, sq) * 9.0) * (0.6 + 0.4 * sin(vUv.x * 90.0 + vUv.y * 60.0));
        float lit = 0.06 + 1.6 * pow(sd, 3.0) + fres;
        // faint emitter glow that stays visible off-axis (what you see of a powered sight from the hip)
        vec2 eg = (vUv - vec2(0.5, 0.16)) * vec2(1.0, 1.6); retCol += vec3(1.0, 0.10, 0.04) * 0.20 * exp(-dot(eg, eg) * 60.0) * (1.0 - smoothstep(0.985, 0.9995, k));
        vec3 col = (sky * 1.5 + vec3(0.03, 0.035, 0.045)) * coat * refl * (1.0 - edge) + retCol;
        col += (uHor * 0.5 + uSunCol * 0.25) * lit * (speck * 0.45 + smudge * 0.03);
        float alpha = clamp(0.20 + 0.32 * fres + 0.05 * band + 0.6 * edge + speck * 0.2 * lit + smudge * 0.02, 0.0, 0.94);
        gl_FragColor = vec4(col, alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    }),
    o = new THREE.Mesh(i, s);
  o.renderOrder = 5;
  let r = 0;
  return (
    (o.onBeforeRender = (a, l) => {
      let c = l.environmentIntensity || 1;
      c > r && (r = c);
      let u = Math.min(1, Math.max(0, (c / r - 0.55) / 0.4));
      s.uniforms.uEnv.value += (u - s.uniforms.uEnv.value) * 0.12;
    }),
    o
  );
}

function l5() {
  let n = [],
    e = [],
    t = [],
    i = [],
    s = (d, m, x, v, y) => {
      let b = n.length / 3;
      for (let g of [d, m, x, v]) n.push(g[0], g[1], g[2]);
      e.push(0, 0, 1, 0, 1, 1, 0, 1);
      for (let g = 0; g < 4; g++) t.push(y);
      i.push(b, b + 1, b + 2, b, b + 2, b + 3);
    };
  (s([-0.13, -0.13, -0.03], [0.13, -0.13, -0.03], [0.13, 0.13, -0.03], [-0.13, 0.13, -0.03], 0),
    s(
      [-0.13 * 0.7, -0.13 * 0.7, -0.09],
      [0.13 * 0.7, -0.13 * 0.7, -0.09],
      [0.13 * 0.7, 0.13 * 0.7, -0.09],
      [-0.13 * 0.7, 0.13 * 0.7, -0.09],
      0,
    ));
  let r = 0.065,
    a = 0.34;
  (s([-r, 0, 0.01], [r, 0, 0.01], [r, 0, -a], [-r, 0, -a], 1),
    s([0, -r, 0.01], [0, r, 0.01], [0, r, -a], [0, -r, -a], 1));
  let l = 0.17,
    c = 0.05,
    u = 0.035;
  (s([-l, -c, u], [l, -c, u], [l, c, u], [-l, c, u], 2),
    s([-l, 0, u + c], [l, 0, u + c], [l, 0, u - c], [-l, 0, u - c], 2),
    s([-0.05, -0.05, -0.01], [0.05, -0.05, -0.01], [0.05, 0.05, -0.01], [-0.05, 0.05, -0.01], 3),
    s([-0.03, -0.03, 0.02], [0.03, -0.03, 0.02], [0.03, 0.03, 0.02], [-0.03, 0.03, 0.02], 4));
  let f = new THREE.BufferGeometry();
  (f.setAttribute('position', new THREE.Float32BufferAttribute(n, 3)),
    f.setAttribute('uv', new THREE.Float32BufferAttribute(e, 2)),
    f.setAttribute('aType', new THREE.Float32BufferAttribute(t, 1)),
    f.setIndex(i));
  let h = new THREE.ShaderMaterial({
      transparent: !0,
      depthWrite: !1,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      uniforms: { uSeed: { value: 0 }, uInt: { value: 0 }, uHeat: { value: 0 }, uJet: { value: 1 } },
      vertexShader: `attribute float aType; varying vec2 vUv; varying float vType;
      void main(){ vUv = uv; vType = aType; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `varying vec2 vUv; varying float vType; uniform float uSeed, uInt, uHeat, uJet;
      float h1(float n){ return fract(sin(n * 127.1 + uSeed * 311.7) * 43758.5453); }
      void main(){
        vec2 p = vUv * 2.0 - 1.0; float r = length(p), a = atan(p.y, p.x); float I = 0.0; vec3 tintc = vec3(1.0, 0.50, 0.16);
        if (vType < 0.5) {
          float n1 = 3.0 + floor(h1(1.0) * 3.0), n2 = 5.0 + floor(h1(2.0) * 4.0);
          float pet = pow(abs(cos(a * n1 * 0.5 + h1(3.0) * 6.283)), 5.0) * (0.55 + 0.45 * h1(4.0));
          pet += pow(abs(cos(a * n2 * 0.5 + h1(5.0) * 6.283)), 14.0) * 0.55;
          float reach = 0.35 + 0.65 * pet;
          I = (0.25 + pet) * smoothstep(reach, reach * 0.15, r) * (0.75 + 0.25 * sin(r * 26.0 + h1(6.0) * 20.0));
        } else if (vType < 1.5) {
          float y = vUv.y, x = p.x * (1.0 + 0.5 * sin(y * 17.0 + h1(7.0) * 30.0) * y);
          float wdt = mix(0.20, 0.75, smoothstep(0.0, 0.35, y)) * (1.0 - y * 0.75);
          I = exp(-x * x / (wdt * wdt * 0.35)) * pow(1.0 - y, 1.4) * (0.7 + 0.3 * sin(y * 31.0 + h1(8.0) * 9.0)) * 0.9;
        } else if (vType < 2.5) {
          float u = abs(p.x), len = 0.55 + 0.45 * h1(9.0 + step(0.0, p.x));
          float wv = p.y * (1.0 + u * 3.0) + 0.12 * sin(u * 14.0 + h1(10.0) * 20.0) * u;
          I = exp(-wv * wv * 22.0) * smoothstep(len, 0.06, u) * smoothstep(0.02, 0.10, u) * 0.85 * uJet;
        } else if (vType < 3.5) {
          I = exp(-r * r * 5.0) * 2.4 * smoothstep(1.0, 0.6, r); tintc = vec3(1.0, 0.82, 0.58);
        } else {
          gl_FragColor = vec4(vec3(1.0, 0.28, 0.06) * exp(-r * r * 4.0) * smoothstep(1.0, 0.5, r) * uHeat, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          return;
        }
        vec3 col = mix(tintc, vec3(1.0, 0.90, 0.70), clamp(I * I * 0.7, 0.0, 1.0)) * I * uInt;
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    }),
    p = new THREE.Mesh(f, h);
  return ((p.renderOrder = 10), (p.frustumCulled = !1), p);
}

var iy = { value: 1 },
  Bz = {
    pac9_anodised: { kind: 0, color: [0.038, 0.039, 0.043], roughness: 0.54, metalness: 0.1 },
    pac9_phosphate: { kind: 1, color: [0.042, 0.042, 0.043], roughness: 0.66, metalness: 0.2 },
    pac9_polymer: { kind: 2, color: [0.034, 0.035, 0.038], roughness: 0.6, metalness: 0 },
    pac9_polymer_tan: { kind: 2, color: [0.15, 0.112, 0.068], roughness: 0.6, metalness: 0 },
    pac4_nitride: { kind: 3, color: [0.034, 0.035, 0.039], roughness: 0.47, metalness: 0.35 },
    pac9_matte: { kind: 4, color: [1, 1, 1], roughness: 0.86, metalness: 0 },
  },
  Hz =
    `
varying vec3 vObjP; varying vec3 vWNrm; varying vec3 vONrm; varying vec4 vSurf; uniform float uRain;
float dh3(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
float dn3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(dh3(i), dh3(i + vec3(1,0,0)), f.x), mix(dh3(i + vec3(0,1,0)), dh3(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(dh3(i + vec3(0,0,1)), dh3(i + vec3(1,0,1)), f.x), mix(dh3(i + vec3(0,1,1)), dh3(i + vec3(1,1,1)), f.x), f.y), f.z); }
vec2 dh2(vec2 p){ return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
vec2 dDrops(vec2 uv, float cell, float seed, float thr){ vec2 g = uv / cell, i = floor(g), f = fract(g); float best = 0.0;
  for (int a = -1; a <= 1; a++) for (int b = -1; b <= 1; b++) { vec2 o = vec2(float(a), float(b)); vec2 r = dh2(i + o + seed);
    float keep = step(thr, fract(r.x * 7.31 + r.y * 3.17)); vec2 c = o + 0.2 + 0.6 * r; float rad = (0.14 + 0.20 * fract(r.x * 13.7)) * keep;
    float d = length(f - c); best = max(best, sqrt(max(rad * rad - d * d, 0.0))); }
  return vec2(best * cell, step(1e-6, best)); }
` + bE,
  Oz = `
vec3 dP = vObjP; vec3 dAn = abs(vONrm);
vec2 dUV = (dAn.y > dAn.x && dAn.y > dAn.z) ? dP.xz : (dAn.x > dAn.z ? dP.zy : dP.xy);
float dEdge = vSurf.x, dCav = vSurf.y, dBare = vSurf.z, dZone = vSurf.w;
float dPx = length(fwidth(dP));                                         // metres of surface per pixel
float dNear = 1.0 - smoothstep(0.00020, 0.00075, dPx);                  // micro detail fades out before it can alias
vec3 dQ = mat3(0.36, 0.48, -0.80, -0.80, 0.60, 0.0, 0.48, 0.64, 0.60) * dP;       // turned domain: the noise lattice never lines up with the gun
float dLo = dn3(dQ * 34.0), dMid = dn3(dQ * 180.0 + 7.0);
float dGr = (dh3(floor(dP * 2900.0)) - 0.5) * dNear;                    // finest grain: one hash
float dScr = dn3(dP * vec3(640.0, 640.0, 21.0) + 3.0);                  // long fine scratches along the bore
float dHt = 0.0, dR = 0.0; vec3 dAlb = diffuseColor.rgb;
float dBreak = dMid * 0.65 + dLo * 0.35;
float dPolish = smoothstep(0.15, 0.85, dEdge) * (0.35 + 0.65 * dLo);     // exposed edges are a little burnished, unevenly
float dWorn = smoothstep(0.60, 0.72, dBreak) * smoothstep(0.55, 0.95, dEdge);   // and worn through in a few patches (high-wear parts only)
float dScratch = smoothstep(0.80, 0.94, dScr) * (0.10 + 0.90 * dZone) * smoothstep(0.30, 0.62, dMid * 0.5 + dLo * 0.5) * (1.0 - smoothstep(0.0007, 0.0020, dPx));
#if D_KIND == 0
  float smear = smoothstep(0.52, 0.82, dn3(dQ * vec3(52.0, 30.0, 15.0) + 11.0));      // palm and finger oil on the flats
  dR = (dLo - 0.5) * 0.14 + (dMid - 0.5) * 0.08 + dGr * 0.10 - smear * 0.12;
  dHt = dGr * 0.000012;
  dAlb *= (0.90 + 0.20 * dLo) * (1.0 - 0.10 * smear);
  dAlb = mix(dAlb, dAlb * 1.7 + 0.005, dPolish * 0.55); dR -= dPolish * 0.06;
  dAlb = mix(dAlb, vec3(0.30, 0.31, 0.33), dScratch * 0.55); dR -= dScratch * 0.10; dHt -= dScratch * 0.000012;
  metalnessFactor = mix(metalnessFactor, 1.0, max(dWorn, dScratch * 0.5));
  dAlb = mix(dAlb, vec3(0.50, 0.51, 0.53), dWorn); dR = mix(dR, -0.10 + 0.12 * dMid, dWorn);
#elif D_KIND == 3
  float lay = dn3(vec3(dP.xy * 2600.0, dP.z * 36.0));                                  // surface-ground lay along the bore
  float smear = smoothstep(0.50, 0.80, dn3(dQ * vec3(60.0, 34.0, 20.0) + 11.0));
  dR = (dLo - 0.5) * 0.10 + (lay - 0.5) * 0.14 * dNear + dGr * 0.04 - smear * 0.11;
  dHt = lay * 0.000007 * dNear;
  dAlb *= (0.92 + 0.16 * dLo) * (1.0 - 0.12 * smear);
  dAlb = mix(dAlb, dAlb * 1.9 + 0.006, dPolish * 0.6); dR -= dPolish * 0.06;
  dAlb = mix(dAlb, vec3(0.16, 0.16, 0.17), dScratch * 0.35); dR -= dScratch * 0.06;
  float through = dWorn * 0.8;                                                         // holster wear: grey steel, not silver
  metalnessFactor = mix(metalnessFactor, 1.0, through); dAlb = mix(dAlb, vec3(0.36, 0.36, 0.37), through); dR = mix(dR, -0.06, through);
#elif D_KIND == 1
  float oil = smoothstep(0.30, 0.72, dn3(dQ * vec3(46.0, 46.0, 30.0) + 5.0));
  float lay = dn3(vec3(dP.xy * 1400.0, dP.z * 60.0));
  // phosphate: crystalline, porous, drinks oil
  float cR = (dLo - 0.5) * 0.14 + dGr * 0.14 - oil * 0.20, cH = dGr * 0.000022 + dMid * 0.000004;
  vec3 cA = dAlb * mix(1.22, 0.72, oil) * (0.94 + 0.12 * dMid);
  cA = mix(cA, cA * 1.8 + 0.006, dPolish * 0.6); cR -= dPolish * 0.10;
  float cM = metalnessFactor; float through = max(dWorn, dScratch * 0.6);
  cM = mix(cM, 1.0, through); cA = mix(cA, vec3(0.40, 0.40, 0.41), through); cR = mix(cR, -0.26 + 0.10 * dMid, through);
  // bare: turned or ground steel, faint lay, a little staining
  float bR = -0.30 + (lay - 0.5) * 0.20 + (dLo - 0.5) * 0.14, bH = lay * 0.000008 * dNear;
  vec3 bA = min(dAlb, vec3(0.78)) * (0.86 + 0.20 * dMid); bA = mix(bA, bA * vec3(0.72, 0.62, 0.50), smoothstep(0.62, 0.9, dLo) * 0.35);
  dAlb = mix(cA, bA, dBare); dR = mix(cR, bR, dBare); dHt = mix(cH, bH, dBare); metalnessFactor = mix(cM, 1.0, dBare);
#elif D_KIND == 4
  // rubber and matte liners (the 'plain' group, absolute vertex albedo): fine moulded grain, chalky bloom, shiny where rubbed
  float bloom = smoothstep(0.45, 0.80, dMid * 0.6 + dLo * 0.4);
  dR = (dLo - 0.5) * 0.10 + dGr * 0.08 - dPolish * 0.22; dHt = dGr * 0.000018;
  dAlb = mix(dAlb, dAlb * 1.5 + 0.012, bloom * 0.35) * (1.0 + 0.35 * dPolish);
#else
  float st = dn3(dP * 1500.0) * 0.6 + dh3(floor(dP * 3300.0)) * 0.4;                    // mould texture (VDI-ish spark finish)
  dR = (dLo - 0.5) * 0.14 + (st - 0.5) * 0.12 * dNear - smoothstep(0.55, 0.90, dMid) * 0.035;
  dHt = st * 0.000045 * dNear;
  dAlb *= 0.92 + 0.16 * dLo;
  // studded grip zones: 1.15 mm pyramids on a diagonal grid; past the range where they resolve they fold into roughness
  float zk = smoothstep(0.35, 0.60, dZone); vec2 q = vec2(dUV.x + dUV.y, dUV.x - dUV.y) / 0.00115, qc = abs(fract(q) - 0.5);
  float stud = 1.0 - smoothstep(0.10, 0.46, max(qc.x, qc.y)), studK = 1.0 - smoothstep(0.00024, 0.00056, dPx);   // gone before a stud is under two pixels: no moire
  dHt += zk * stud * 0.00028 * studK; dR += zk * (0.10 - stud * 0.16 * studK);
  dAlb *= 1.0 - zk * 0.14 * (1.0 - stud * studK);
  // moulding parting line on the centre plane, flash trimmed
  float pl = (1.0 - smoothstep(0.00012, 0.00034, abs(dP.x))) * step(dAn.x, 0.55) * dNear; dHt += pl * 0.00005; dR -= pl * 0.10;
  // handling shine on edges, a few pale scuffs (polymer whitens where it is scraped)
  float scuff = smoothstep(0.86, 0.96, dScr) * smoothstep(0.45, 0.70, dLo) * (1.0 - smoothstep(0.0007, 0.0020, dPx));
  dAlb = mix(dAlb, dAlb * 1.5 + 0.006, dPolish * 0.5); dR -= dPolish * 0.12;
  dAlb = mix(dAlb, dAlb * 2.0 + 0.015, scuff * 0.35 + dWorn * 0.25); dR += scuff * 0.06;
#endif
// recesses: darker, rougher, a little pale dust settled in them
float dGrime = dCav * (0.55 + 0.45 * dMid);
dAlb *= 1.0 - 0.50 * dGrime;
dAlb = mix(dAlb, vec3(0.115, 0.100, 0.082), dCav * smoothstep(0.50, 0.85, dLo * 0.5 + dMid * 0.5) * 0.30);
dR += dGrime * 0.22; metalnessFactor *= 1.0 - 0.5 * dGrime;
// rain
float dUpN = vWNrm.y, dUp = smoothstep(0.30, 0.75, dUpN) * uRain, dSide = (1.0 - smoothstep(0.10, 0.60, abs(dUpN))) * uRain;
float dDrop = 0.0, dDropH = 0.0, dRun = 0.0;
if (dUp > 0.002) { vec2 dD1 = dDrops(dUV, 0.0050, 3.0, 0.80), dD2 = dDrops(dUV + 0.31, 0.0024, 9.0, 0.90); dDrop = max(dD1.y, dD2.y) * dUp; dDropH = max(dD1.x, dD2.x) * dUp; }
if (dSide > 0.002) dRun = smoothstep(0.80, 0.90, dn3(vec3(dP.x * 420.0 + dP.z * 610.0, dP.y * 9.0, dP.z * 37.0))) * smoothstep(0.42, 0.62, dLo) * dSide * (1.0 - smoothstep(0.0008, 0.0024, dPx));   // run-off: thin, sparse, broken trickles
float dWet = max(dUp * (0.5 + 0.5 * smoothstep(0.3, 0.7, dLo)), dRun * 0.55);
diffuseColor.rgb = dAlb * (1.0 - 0.20 * dWet);
roughnessFactor = clamp(roughnessFactor + dR, 0.12, 1.0);
roughnessFactor = mix(roughnessFactor, roughnessFactor * 0.52, dWet);
roughnessFactor = mix(roughnessFactor, 0.20, dDrop * 0.8);
float dOcc = 1.0 - 0.80 * dCav;
`,
  Vz = `
normal = dBump(normal, dHt + dDropH * 0.17);
`,
  Wz = `
reflectedLight.indirectDiffuse *= dOcc; reflectedLight.indirectSpecular *= dOcc * dOcc;
reflectedLight.directDiffuse *= mix(1.0, dOcc, 0.35); reflectedLight.directSpecular *= mix(1.0, dOcc, 0.6);
`;

function _E(n, e) {
  let t = Bz[n.name];
  return (
    t &&
      ((e = t.kind),
      n.color.setRGB(t.color[0], t.color[1], t.color[2]),
      (n.roughness = t.roughness),
      (n.metalness = t.metalness)),
    (n.onBeforeCompile = (i) => {
      ((i.uniforms.uRain = iy),
        (i.vertexShader = i.vertexShader
          .replace(
            '#include <common>',
            `#include <common>
attribute vec4 aSurf; varying vec3 vObjP; varying vec3 vWNrm; varying vec3 vONrm; varying vec4 vSurf;`,
          )
          .replace(
            '#include <begin_vertex>',
            `#include <begin_vertex>
vObjP = position; vONrm = normal; vWNrm = normalize(mat3(modelMatrix) * normal); vSurf = aSurf;`,
          )),
        (i.fragmentShader = i.fragmentShader
          .replace(
            '#include <common>',
            `#include <common>
#define D_KIND ` +
              (e | 0) +
              `
` +
              Hz,
          )
          .replace(
            '#include <metalnessmap_fragment>',
            `#include <metalnessmap_fragment>
` + Oz,
          )
          .replace(
            '#include <normal_fragment_maps>',
            `#include <normal_fragment_maps>
` + Vz,
          )
          .replace(
            '#include <aomap_fragment>',
            `#include <aomap_fragment>
` + Wz,
          )));
    }),
    (n.customProgramCacheKey = () => 'pac-detail-3-' + e),
    n
  );
}

var u5 = (n, e, t) => {
  let i = Math.min(1, Math.max(0, (t - n) / (e - n)));
  return i * i * (3 - 2 * i);
};

function Gz(n, e) {
  let t = n.attributes.position.array,
    i = t.length / 3,
    s = i / 3,
    o = new Float32Array(s * 3),
    r = new Float32Array(s);
  for (let f = 0; f < s; f++) {
    let h = f * 9,
      p = t[h + 3] - t[h],
      d = t[h + 4] - t[h + 1],
      m = t[h + 5] - t[h + 2],
      x = t[h + 6] - t[h],
      v = t[h + 7] - t[h + 1],
      y = t[h + 8] - t[h + 2],
      b = d * y - m * v,
      g = m * x - p * y,
      E = p * v - d * x,
      M = Math.hypot(b, g, E) || 1;
    ((o[f * 3] = b / M), (o[f * 3 + 1] = g / M), (o[f * 3 + 2] = E / M), (r[f] = M));
  }
  let a = Math.cos((e * Math.PI) / 180),
    l = new Map(),
    c = 5e4;
  for (let f = 0; f < i; f++) {
    let h =
        (Math.round(t[f * 3] * c) + 65536) * 17179869184 +
        (Math.round(t[f * 3 + 1] * c) + 65536) * 131072 +
        (Math.round(t[f * 3 + 2] * c) + 65536),
      p = l.get(h);
    p ? p.push(f) : l.set(h, [f]);
  }
  let u = new Float32Array(i * 3);
  for (let f of l.values())
    for (let h of f) {
      let p = (h / 3) | 0,
        d = o[p * 3],
        m = o[p * 3 + 1],
        x = o[p * 3 + 2],
        v = 0,
        y = 0,
        b = 0;
      for (let E of f) {
        let M = (E / 3) | 0;
        if (d * o[M * 3] + m * o[M * 3 + 1] + x * o[M * 3 + 2] >= a) {
          let _ = r[M];
          ((v += o[M * 3] * _), (y += o[M * 3 + 1] * _), (b += o[M * 3 + 2] * _));
        }
      }
      let g = Math.hypot(v, y, b);
      g > 1e-20
        ? ((u[h * 3] = v / g), (u[h * 3 + 1] = y / g), (u[h * 3 + 2] = b / g))
        : ((u[h * 3] = d), (u[h * 3 + 1] = m), (u[h * 3 + 2] = x));
    }
  n.setAttribute('normal', new THREE.BufferAttribute(u, 3));
}

function vh(n, e, t = {}) {
  let i = n.index ? n.toNonIndexed() : n,
    s = i.attributes.position.array,
    o = i.attributes.normal ? i.attributes.normal.array : null,
    r = [],
    a = [];
  for (let b = 0; b < s.length; b += 9) {
    let g = s[b + 3] - s[b],
      E = s[b + 4] - s[b + 1],
      M = s[b + 5] - s[b + 2],
      _ = s[b + 6] - s[b],
      T = s[b + 7] - s[b + 1],
      w = s[b + 8] - s[b + 2];
    if (!(Math.hypot(E * w - M * T, M * _ - g * w, g * T - E * _) < 1e-11))
      for (let S = 0; S < 9; S++) (r.push(s[b + S]), o && a.push(o[b + S]));
  }
  let l = new THREE.BufferGeometry();
  (l.setAttribute('position', new THREE.BufferAttribute(new Float32Array(r), 3)),
    t.keepN && o
      ? l.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(a), 3))
      : Gz(l, t.crease || 50));
  let c = r.length / 3,
    u = l.attributes.normal.array,
    f = new Float32Array(c * 3),
    h = new Float32Array(c * 4),
    p = new Float32Array(c),
    d = new Float32Array(c),
    m = t.wear == null ? 1 : t.wear,
    x = t.bare || 0,
    v = t.zone || 0,
    y = t.ao || 0;
  for (let b = 0; b < c; b += 3) {
    let g = 0,
      E = 0;
    for (let M = 0; M < 3; M++) {
      let _ = b + M,
        T = b + ((M + 1) % 3),
        w = r[T * 3] - r[_ * 3],
        S = r[T * 3 + 1] - r[_ * 3 + 1],
        R = r[T * 3 + 2] - r[_ * 3 + 2],
        z = w * w + S * S + R * R,
        I =
          ((u[T * 3] - u[_ * 3]) * w +
            (u[T * 3 + 1] - u[_ * 3 + 1]) * S +
            (u[T * 3 + 2] - u[_ * 3 + 2]) * R) /
          z;
      (I > g && (g = I), I < E && (E = I));
    }
    ((p[b] = p[b + 1] = p[b + 2] = g), (d[b] = d[b + 1] = d[b + 2] = E));
  }
  for (let b = 0; b < c; b++)
    ((f[b * 3] = e[0]),
      (f[b * 3 + 1] = e[1]),
      (f[b * 3 + 2] = e[2]),
      (h[b * 4] = Math.min(1, u5(110, 520, p[b]) * m)),
      (h[b * 4 + 1] = Math.min(
        1,
        (t.aoFn ? Math.max(y, t.aoFn(r[b * 3], r[b * 3 + 1], r[b * 3 + 2])) : y) + 0.7 * u5(110, 520, -d[b]),
      )),
      (h[b * 4 + 2] = x),
      (h[b * 4 + 3] = v));
  return (
    l.setAttribute('color', new THREE.BufferAttribute(f, 3)),
    l.setAttribute('aSurf', new THREE.BufferAttribute(h, 4)),
    l
  );
}

var wE = new THREE.Euler(),
  qz = new THREE.Matrix4(),
  Xz = (n, e, t, i, s) => (
    s && (wE.set(s[0], s[1], s[2]), n.applyMatrix4(qz.makeRotationFromEuler(wE))),
    n.translate(e, t, -i),
    n
  );

function Mt(n, e, t, i, s, o, r, a, l = {}, c = null) {
  return Xz(vh(Ei(n, e, t, i), a, { keepN: !0, ...l }), s, o, r, c);
}

function b0(n, e, t = 2) {
  let i = n.length,
    s = [];
  for (let o = 0; o < i; o++) {
    let r = n[o],
      a = n[(o + i - 1) % i],
      l = n[(o + 1) % i],
      c = typeof e == 'number' ? e : e[o] || 0,
      u = a[0] - r[0],
      f = a[1] - r[1],
      h = l[0] - r[0],
      p = l[1] - r[1],
      d = Math.hypot(u, f),
      m = Math.hypot(h, p),
      x = d > 1e-9 && m > 1e-9 ? Math.acos(Math.max(-1, Math.min(1, (u * h + f * p) / (d * m)))) : Math.PI;
    if (c <= 0 || x > 3.05) {
      for (let z = 0; z <= t; z++) s.push([r[0], r[1]]);
      continue;
    }
    let v = c / Math.tan(x / 2),
      y = 0.45 * Math.min(d, m);
    v > y && ((v = y), (c = v * Math.tan(x / 2)));
    let b = u / d + h / m,
      g = f / d + p / m,
      E = Math.hypot(b, g),
      M = c / Math.sin(x / 2),
      _ = r[0] + (b / E) * M,
      T = r[1] + (g / E) * M,
      w = Math.atan2(r[1] + (f / d) * v - T, r[0] + (u / d) * v - _),
      R = Math.atan2(r[1] + (p / m) * v - T, r[0] + (h / m) * v - _) - w;
    for (; R > Math.PI;) R -= 2 * Math.PI;
    for (; R < -Math.PI;) R += 2 * Math.PI;
    for (let z = 0; z <= t; z++) {
      let I = w + (R * z) / t;
      s.push([_ + Math.cos(I) * c, T + Math.sin(I) * c]);
    }
  }
  return s;
}

var EE = (n) =>
  n.filter((e, t) => {
    let i = n[(t + n.length - 1) % n.length];
    return Math.hypot(e[0] - i[0], e[1] - i[1]) > 1e-7;
  });

function Yz(n, e) {
  let t = new THREE.Shape();
  if ((EE(n).forEach((i, s) => (s ? t.lineTo(i[0], i[1]) : t.moveTo(i[0], i[1]))), t.closePath(), e))
    for (let i of e) t.holes.push(new THREE.Path(EE(i).map((s) => new THREE.Vector2(s[0], s[1]))));
  return t;
}

function SE(n, e, t, i, s) {
  return new THREE.ExtrudeGeometry(Yz(n, i), {
    depth: Math.max(1e-4, e - 2 * t),
    bevelEnabled: t > 0,
    bevelThickness: t,
    bevelSize: t,
    bevelOffset: -t,
    bevelSegments: s || 1,
    steps: 1,
    curveSegments: 6,
  });
}

function Q0(n, e, t, i, s, o = {}) {
  let r = vh(SE(n, t - e, i, o.holes, o.bs), s, o);
  return (r.translate(0, 0, e + i), r.rotateY(Math.PI / 2), r);
}

function Nn(n, e, t, i, s, o = {}) {
  let r = vh(SE(n, t - e, i, o.holes, o.bs), s, o);
  return (r.translate(0, 0, -t + i), r);
}

function h0(n, e, t, i = {}) {
  let s = [],
    o = [],
    r = [],
    a = [],
    l = 0;
  for (let d = 0; d < n.length - 1; d++) {
    let m = n[d + 1][0] - n[d][0],
      x = n[d + 1][1] - n[d][1],
      v = Math.hypot(m, x);
    s.push(v < 1e-8 ? null : { nr: x / v, nf: -m / v, len: v });
  }
  let c = Math.cos(((i.crease || 50) * Math.PI) / 180),
    u = i.ox || 0,
    f = i.oy || 0,
    h = (d, m) => {
      let x = s[d],
        v = m >= 0 && m < s.length ? s[m] : null,
        y = x.nr * x.len,
        b = x.nf * x.len;
      v && x.nr * v.nr + x.nf * v.nf >= c && ((y += v.nr * v.len), (b += v.nf * v.len));
      let g = Math.hypot(y, b);
      return [y / g, b / g];
    };
  for (let d = 0; d < s.length; d++) {
    if (!s[d]) continue;
    let m = d - 1,
      x = d + 1;
    for (; m >= 0 && !s[m];) m--;
    for (; x < s.length && !s[x];) x++;
    let v = h(d, m),
      y = h(d, x),
      [b, g] = n[d],
      [E, M] = n[d + 1];
    for (let _ = 0; _ <= e; _++) {
      let T = (_ / e) * Math.PI * 2,
        w = Math.cos(T),
        S = Math.sin(T);
      (o.push(u + b * w, f + b * S, -g, u + E * w, f + E * S, -M),
        r.push(v[0] * w, v[0] * S, -v[1], y[0] * w, y[0] * S, -y[1]));
    }
    for (let _ = 0; _ < e; _++) {
      let T = l + _ * 2,
        w = T + 2,
        S = T + 1,
        R = T + 3;
      a.push(T, S, w, w, S, R);
    }
    l += (e + 1) * 2;
  }
  let p = new THREE.BufferGeometry();
  return (
    p.setAttribute('position', new THREE.Float32BufferAttribute(o, 3)),
    p.setAttribute('normal', new THREE.Float32BufferAttribute(r, 3)),
    p.setIndex(a),
    vh(p, t, { keepN: !0, ...i })
  );
}

function m0(n, e, t, i, s, o, r = 12, a = {}) {
  let l = Math.min(n * 0.25, e * 0.25),
    c = e / 2,
    u = h0(
      [
        [0, -c],
        [n - l, -c],
        [n, -c + l],
        [n, c - l],
        [n - l, c],
        [0, c],
      ],
      r,
      o,
      a,
    );
  return (u.rotateY(Math.PI / 2), u.translate(t, i, -s), u);
}

function Eu(n, e, t = {}) {
  let i = n[0].length,
    s = [],
    o = n.length,
    r = t.caps || [!0, !0],
    a = (f) => {
      let h = 0,
        p = 0,
        d = 0;
      for (let m of f) ((h += m[0]), (p += m[1]), (d += m[2]));
      return [h / i, p / i, d / i];
    },
    l = 0,
    c = n.map(a);
  for (let f = 0; f < o - 1; f++)
    for (let h = 0; h < i; h++) {
      let p = n[f][h],
        d = n[f][(h + 1) % i],
        m = n[f + 1][h],
        x = d[0] - p[0],
        v = d[1] - p[1],
        y = d[2] - p[2],
        b = m[0] - p[0],
        g = m[1] - p[1],
        E = m[2] - p[2];
      l +=
        (v * E - y * g) * (p[0] - c[f][0]) +
        (y * b - x * E) * (p[1] - c[f][1]) +
        (x * g - v * b) * (p[2] - c[f][2]);
    }
  for (let f = 0; f < o - 1; f++)
    for (let h = 0; h < i; h++) {
      let p = n[f][h],
        d = n[f][(h + 1) % i],
        m = n[f + 1][(h + 1) % i],
        x = n[f + 1][h];
      l >= 0 ? s.push(...p, ...d, ...m, ...p, ...m, ...x) : s.push(...p, ...m, ...d, ...p, ...x, ...m);
    }
  for (let f of [0, 1]) {
    if (!r[f]) continue;
    let h = n[f ? o - 1 : 0],
      p = c[f ? o - 1 : 0],
      d = c[f ? o - 2 : 1],
      m = [p[0] - d[0], p[1] - d[1], p[2] - d[2]],
      x = Math.abs(m[0]),
      v = Math.abs(m[1]),
      y = Math.abs(m[2]),
      b = x > v && x > y ? 1 : 0,
      g = (v > x && v > y) || b === 1 ? 2 : 1,
      E = [],
      M = [];
    h.forEach((_, T) => {
      let w = h[(T + i - 1) % i];
      Math.hypot(_[0] - w[0], _[1] - w[1], _[2] - w[2]) > 1e-7 &&
        (E.push(T), M.push(new THREE.Vector2(_[b], _[g])));
    });
    for (let _ of THREE.ShapeUtils.triangulateShape(M, [])) {
      let T = h[E[_[0]]],
        w = h[E[_[1]]],
        S = h[E[_[2]]],
        R = w[0] - T[0],
        z = w[1] - T[1],
        I = w[2] - T[2],
        L = S[0] - T[0],
        U = S[1] - T[1],
        k = S[2] - T[2];
      (z * k - I * U) * m[0] + (I * L - R * k) * m[1] + (R * U - z * L) * m[2] >= 0
        ? s.push(...T, ...w, ...S)
        : s.push(...T, ...S, ...w);
    }
  }
  let u = new THREE.BufferGeometry();
  return (u.setAttribute('position', new THREE.Float32BufferAttribute(s, 3)), vh(u, e, t));
}

function $a(n, e, t, i, s, o = 3) {
  let r = [],
    a = (l, c, u, f) => {
      for (let h = 0; h <= o; h++) {
        let p = f + ((h / o) * Math.PI) / 2;
        r.push([l + Math.cos(p) * u, c + Math.sin(p) * u]);
      }
    };
  return (
    a(-n + s, e + s, s, Math.PI),
    a(n - s, e + s, s, Math.PI * 1.5),
    a(n - i, t - i, i, 0),
    a(-n + i, t - i, i, Math.PI / 2),
    r
  );
}

var kn = (n, e, t = {}) =>
  n.map((i) => [
    i[0] * (t.sx || 1) + (t.dx || 0),
    (i[1] - (t.cy || 0)) * (t.sy || 1) + (t.cy || 0) + (t.dy || 0),
    -e + (t.rake || 0) * i[1],
  ]);

function c5(n, e, t, i, s = 4) {
  let o = [],
    r = i / 2,
    a = t / 2 - r;
  for (let l = 0; l <= s; l++) {
    let c = -Math.PI / 2 + (l / s) * Math.PI;
    o.push([n + a + Math.cos(c) * r, e + Math.sin(c) * r]);
  }
  for (let l = 0; l <= s; l++) {
    let c = Math.PI / 2 + (l / s) * Math.PI;
    o.push([n - a + Math.cos(c) * r, e + Math.sin(c) * r]);
  }
  return o;
}

var Su = (n, e, t, i, s, o = 2) =>
    b0(
      [
        [n, e],
        [t, e],
        [t, i],
        [n, i],
      ],
      s,
      o,
    ),
  $z = (n, e, t, i = 10) => {
    let s = [];
    for (let o = 0; o < i; o++) {
      let r = (o / i) * Math.PI * 2;
      s.push([n + Math.cos(r) * t, e + Math.sin(r) * t]);
    }
    return s;
  };

function Fs(n) {
  let e = n.filter(Boolean);
  if (!e.length) return new THREE.BufferGeometry();
  for (let t of e)
    for (let i of Object.keys(t.attributes))
      ['position', 'normal', 'color', 'aSurf'].includes(i) || t.deleteAttribute(i);
  return Tr(e, !1);
}

function sy(n, e = null, t = 0.002) {
  let i = [1e9, 1e9, 1e9],
    s = [-1e9, -1e9, -1e9],
    o = [];
  for (let E of n) {
    let M = E.g.attributes.position.array,
      _ = E.g.attributes.normal.array,
      T = new Float32Array(M.length),
      w = new Float32Array(M.length),
      S = Math.cos(E.rx || 0),
      R = Math.sin(E.rx || 0),
      z = E.off || [0, 0, 0];
    for (let I = 0; I < M.length; I += 3) {
      ((T[I] = M[I] + z[0]),
        (T[I + 1] = M[I + 1] * S - M[I + 2] * R + z[1]),
        (T[I + 2] = M[I + 1] * R + M[I + 2] * S + z[2]),
        (w[I] = _[I]),
        (w[I + 1] = _[I + 1] * S - _[I + 2] * R),
        (w[I + 2] = _[I + 1] * R + _[I + 2] * S));
      for (let L = 0; L < 3; L++)
        (T[I + L] < i[L] && (i[L] = T[I + L]), T[I + L] > s[L] && (s[L] = T[I + L]));
    }
    o.push({ w: T, wn: w });
  }
  let r = 8,
    a = Math.ceil((s[0] - i[0]) / t) + 2 * r,
    l = Math.ceil((s[1] - i[1]) / t) + 2 * r,
    c = Math.ceil((s[2] - i[2]) / t) + 2 * r,
    u = new Uint8Array(a * l * c),
    f = i[0] - r * t,
    h = i[1] - r * t,
    p = i[2] - r * t,
    d = 1 / t,
    m = t * 0.9;
  for (let { w: E } of o)
    for (let M = 0; M < E.length; M += 9) {
      let _ = E[M],
        T = E[M + 1],
        w = E[M + 2],
        S = E[M + 3] - _,
        R = E[M + 4] - T,
        z = E[M + 5] - w,
        I = E[M + 6] - _,
        L = E[M + 7] - T,
        U = E[M + 8] - w,
        k = Math.max(1, Math.ceil(Math.hypot(S, R, z) / m)),
        C = Math.max(1, Math.ceil(Math.hypot(I, L, U) / m));
      for (let A = 0; A <= k; A++) {
        let F = A / k,
          H = Math.max(1, Math.ceil(C * (1 - F)));
        for (let N = 0; N <= H; N++) {
          let Z = (N / H) * (1 - F);
          u[
            ((((w + z * F + U * Z - p) * d) | 0) * l + (((T + R * F + L * Z - h) * d) | 0)) * a +
              (((_ + S * F + I * Z - f) * d) | 0)
          ] = 1;
        }
      }
    }
  let x = (E, M, _) => u[((((_ - p) * d) | 0) * l + (((M - h) * d) | 0)) * a + (((E - f) * d) | 0)],
    v = [0.0032, 0.007],
    y = [1, 0.6],
    b = [1, -0.5, -0.5],
    g = [0, 0.866, -0.866];
  n.forEach((E, M) => {
    let { w: _, wn: T } = o[M],
      w = E.g.attributes.aSurf.array;
    for (let S = 0; S < _.length; S += 9) {
      let R = Math.max(
          Math.hypot(_[S + 3] - _[S], _[S + 4] - _[S + 1], _[S + 5] - _[S + 2]),
          Math.hypot(_[S + 6] - _[S + 3], _[S + 7] - _[S + 4], _[S + 8] - _[S + 5]),
          Math.hypot(_[S] - _[S + 6], _[S + 1] - _[S + 7], _[S + 2] - _[S + 8]),
        ),
        z = 1 - u5(0.012, 0.045, R);
      for (let I = 0; I < 3; I++) {
        let L = S + I * 3,
          U = L / 3,
          k = _[L],
          C = _[L + 1],
          A = _[L + 2],
          F = T[L],
          H = T[L + 1],
          N = T[L + 2];
        if (e) {
          let ue = e(k, C, A, E.key);
          ue > w[U * 4 + 3] && (w[U * 4 + 3] = ue);
        }
        if (z <= 0) continue;
        let Z, Q, W;
        Math.abs(F) < 0.8 ? ((Z = 0), (Q = -N), (W = H)) : ((Z = N), (Q = 0), (W = -F));
        let J = Math.hypot(Z, Q, W) || 1;
        ((Z /= J), (Q /= J), (W /= J));
        let G = H * W - N * Q,
          te = N * Z - F * W,
          oe = F * Q - H * Z,
          ee = 0,
          le = 0,
          xe = k + F * t * 1.3,
          j = C + H * t * 1.3,
          O = A + N * t * 1.3;
        for (let ue = 0; ue < 4; ue++) {
          let de = F,
            $ = H,
            se = N;
          if (ue) {
            let fe = b[ue - 1] * 0.78,
              me = g[ue - 1] * 0.78;
            ((de = F * 0.62 + Z * fe + G * me),
              ($ = H * 0.62 + Q * fe + te * me),
              (se = N * 0.62 + W * fe + oe * me));
          }
          ((le += 1.6),
            x(xe + de * v[0], j + $ * v[0], O + se * v[0])
              ? (ee += 1.6)
              : x(xe + de * v[1], j + $ * v[1], O + se * v[1]) && (ee += 0.6));
        }
        let q = Math.min(1, (ee / le) * 1.4) * z;
        q > w[U * 4 + 1] && (w[U * 4 + 1] = Math.min(1, q + w[U * 4 + 1] * 0.4));
      }
    }
  });
}

var Zl = (n, e, t, i, s, o, r, a, l, c = 0.012) => {
    let u = Math.max(i - n, 0, n - s),
      f = Math.max(o - e, 0, e - r),
      h = Math.max(a + t, 0, -t - l);
    return 1 - u5(0, c, Math.hypot(u, f, h));
  },
  wn = AK47_CONFIG;

function TE() {
  return buildAk47Geometry({ Mt, Q0, Nn, h0, m0, Eu, Su, $a, kn, b0, Fs, sy, Zl });
}

function _TE_UNUSED() {
  let n = [1, 1, 1],
    e = [1.16, 1.05, 0.98],
    t = [0.86, 0.93, 1.04],
    i = [0.8, 0.8, 0.84],
    s = [0.94, 0.92, 0.88],
    o = [1.25, 1.2, 1.15],
    r = [1, 1, 1],
    a = [2.6, 2.6, 2.7],
    l = [11, 11, 11.4],
    c = [0.3, 0.3, 0.31],
    u = [1, 1, 1],
    f = [0.03, 0.03, 0.031],
    h = [0.016, 0.016, 0.017],
    p = { wear: 0.8 },
    d = { wear: 1, zone: 0.5 },
    m = { wear: 0.5, ao: 0.28 },
    x = { wear: 0.55 },
    v = { wear: 0.9 },
    y = { bare: 0.45, wear: 1.2 },
    b = { wear: 0.8 },
    g = { wear: 0, ao: 0.75 },
    E = { wear: 0 },
    M = [],
    _ = [],
    T = [],
    w = [],
    S = [],
    R = [],
    z = [],
    I = 0.0176,
    L = 0.0163,
    U = 0.0012,
    k = (V, ne, ye, Te, Re = 0.0022) => Su(V, ne, ye, Te, Re, 2),
    C = (V, ne, ye, Te, Re, Ue, Ve, ze) => {
      let Ge = Math.min(V * 0.25, (ye - ne) * 0.25);
      return h0(
        [
          [0, ne],
          [V - Ge, ne],
          [V, ne + Ge],
          [V, ye - Ge],
          [V - Ge, ye],
          [0, ye],
        ],
        Ve,
        Ue,
        { ...ze, ox: Te, oy: Re },
      );
    },
    A = (V, ne, ye, Te, Re, Ue, Ve, ze) => {
      let Ge = C(V, -ne / 2, ne / 2, 0, 0, Ue, Ve, ze);
      return (Ge.rotateX(Math.PI / 2), Ge.translate(ye, Te, -Re), Ge);
    },
    F = b0(
      [
        [-0.1, -0.02],
        [0.1, -0.02],
        [0.1, 0.0245],
        [-0.1, 0.0245],
      ],
      8e-4,
      1,
    ),
    H = c5(0.032, 0.007, 0.112, 0.0075, 4),
    N = Su(-0.012, -0.01, 0.06, 0.012, 0.003, 2);
  (M.push(Q0(F, 0, I - U + 1e-4, 5e-4, n, { ...m, holes: [N] })),
    M.push(Q0(F, -(I - U + 1e-4), 0, 5e-4, n, { ...m, holes: [H] })),
    M.push(
      Q0(F, -I, -(I - U), 45e-5, n, {
        ...x,
        holes: [H, k(-0.094, -0.015, -0.033, 0.017), k(-0.0225, -0.0155, 0.093, -8e-4)],
      }),
    ),
    M.push(
      Q0(F, I - U, I, 45e-5, n, {
        ...x,
        holes: [N, k(0.0675, -0.015, 0.094, 0.017), k(-0.094, -0.0155, -0.04, -0.004)],
      }),
    ));
  {
    let V = I + 4e-4,
      ne = (ye, Te, Re) =>
        b0(
          [
            [-V, 0.0226],
            [V, 0.0226],
            [V, Re],
            [Te, ye],
            [-Te, ye],
            [-V, Re],
          ],
          7e-4,
          1,
        );
    M.push(
      Eu(
        [
          kn(ne(0.0252, 0.015, 0.024), -0.1004),
          kn(ne(0.0335, 0.011, 0.0262), -0.0885),
          kn(ne(0.0335, 0.011, 0.0262), 0.0935),
          kn(ne(0.0276, 0.0142, 0.025), 0.1004),
        ],
        n,
        p,
      ),
    );
  }
  (_.push(Mt(0.0034, 0.036, 0.19, 4e-4, -0.0116, 0.006, 0, c, g)),
    _.push(Mt(0.0034, 0.012, 0.19, 4e-4, 0.0125, 0.022, 0, c, g)),
    _.push(Mt(0.0034, 0.008, 0.19, 4e-4, 0.0125, -0.014, 0, c, g)),
    _.push(Mt(0.02, 0.001, 0.196, 2e-4, 0, -0.0203, 0, c, g)),
    _.push(
      h0(
        [
          [0, 0.058],
          [0.0118, 0.058],
          [0.0118, 0.099],
          [0, 0.099],
        ],
        16,
        [0.8, 0.8, 0.82],
        E,
      ),
    ),
    M.push(
      Q0(
        b0(
          [
            [-0.04, -0.008],
            [-0.0165, -0.011],
            [-0.0145, 0.013],
            [-0.034, 0.016],
          ],
          0.002,
          2,
        ),
        I - 0.001,
        I + 0.0052,
        0.0022,
        n,
        { ...d, bs: 2 },
      ),
    ),
    M.push(
      h0(
        [
          [0, -0.086],
          [0.0058, -0.086],
          [0.0066, -0.0845],
          [0.0066, -0.06],
          [0.004, -0.0565],
          [0, -0.0565],
        ],
        14,
        n,
        { ...p, ox: 0.0182, oy: 0.012 },
      ),
    ),
    _.push(
      h0(
        [
          [0, -0.0945],
          [0.004, -0.0945],
          [0.0048, -0.0935],
          [0.0048, -0.0905],
          [0.0042, -0.09],
          [0.0042, -0.0885],
          [0.0048, -0.088],
          [0.0048, -0.086],
          [0, -0.086],
        ],
        12,
        r,
        { ...v, ox: 0.0182, oy: 0.012 },
      ),
    ),
    _.push(Mt(0.0016, 0.02, 0.07, 5e-4, I + 0.0042, -0.0212, 0.024, r, v, [0, 0, 0.3])),
    _.push(Mt(0.0012, 0.013, 0.056, 4e-4, I + 0.0056, -0.0208, 0.024, r, v, [0, 0, 0.3])),
    _.push(C(0.0015, -0.014, 0.062, I + 0.0012, -0.0116, a, 8, y)));
  for (let V of [-0.0115, 0.0245, 0.0595])
    _.push(C(0.0023, V - 0.0035, V + 0.0035, I + 0.0012, -0.0116, r, 8, v));
  _.push(m0(0.0016, 0.0016, I + 0.0068, -0.0285, 0.024, a, 8, y));
  for (let V of [-0.06, -0.072]) _.push(m0(0.0019, 8e-4, -I + U - 2e-4, 0.011, V, c, 8, g));
  {
    let V = h0(
      [
        [0.0042, -0.0016],
        [0.0064, -0.0016],
        [0.0068, -0.0012],
        [0.0068, 6e-4],
        [0.0062, 0.0012],
        [0.0046, 0.0012],
        [0.0042, 4e-4],
      ],
      14,
      r,
      v,
    );
    (V.rotateY(-Math.PI / 2),
      V.translate(-(I - U) - 4e-4, 0.0035, 0.064),
      _.push(V),
      _.push(m0(0.0044, 6e-4, -(I - U) + 2e-4, 0.0035, -0.064, c, 10, g)));
  }
  let Z = [
    [-0.0078, 0.0333],
    [0.0078, 0.0333],
    [0.0106, 0.0402],
    [-0.0106, 0.0402],
  ];
  (M.push(Nn(Z, -0.096, 0.1003, 4e-4, n, { wear: 1, ao: 0.42 })),
    M.push(Nn(Z, 0.1008, 0.397, 4e-4, t, { wear: 1, ao: 0.42 })));
  let Q = b0(
    [
      [-0.0102, 0.0398],
      [0.0102, 0.0398],
      [0.0106, 0.0408],
      [0.008, 0.0435],
      [-0.008, 0.0435],
      [-0.0106, 0.0408],
    ],
    [0, 0, 3e-4, 5e-4, 5e-4, 3e-4],
    1,
  );
  {
    let V = Nn(Q, 0, 0.00478, 6e-4, n, { wear: 1, zone: 0.45 }),
      ne = Nn(Q, 0, 0.00478, 6e-4, t, { wear: 1, zone: 0.45 });
    for (let ye = 0; ye < 49; ye++) {
      let Te = -0.0945 + ye * 0.01001;
      M.push((Te < 0.1 ? V : ne).clone().translate(0, 0, -Te));
    }
  }
  let W = b0(
    [
      [-0.1, -0.0203],
      [0.099, -0.0203],
      [0.101, -0.03],
      [0.098, -0.088],
      [0.036, -0.082],
      [0.031, -0.058],
      [-0.03, -0.058],
      [-0.04, -0.066],
      [-0.078, -0.055],
      [-0.1, -0.044],
    ],
    [8e-4, 8e-4, 0.004, 0.003, 0.003, 0.004, 0.004, 0.004, 0.006, 0.003],
    2,
  );
  M.push(Q0(W, -(L - U + 1e-4), L - U + 1e-4, 5e-4, e, m));
  for (let V of [-1, 1]) {
    let ne = [k(0.0405, -0.077, 0.0945, -0.0265, 0.003), $z(-0.048, -0.036, 0.0074, 14)],
      ye = Q0(W, L - U, L, 45e-5, e, { ...x, holes: ne });
    (V < 0 && (ye.scale(-1, 1, 1), Zz(ye)), M.push(ye));
  }
  (M.push(Mt(0.0372, 0.0095, 0.0665, 0.0022, 0, -0.0838, 0.0668, e, { wear: 0.82, zone: 1 }, [-0.095, 0, 0])),
    M.push(Mt(0.0348, 0.05, 0.0044, 0.001, 0, -0.053, 0.099, e, p)));
  for (let V = 0; V < 7; V++)
    M.push(Mt(0.024, 0.003, 0.0016, 6e-4, 0, -0.0345 - V * 0.006, 0.1012 - V * 3e-4, e, { wear: 1.4 }));
  M.push(Mt(0.0348, 0.038, 0.0044, 0.001, 0, -0.048, 0.0345, e, p));
  for (let [V, ne] of [
    [0.087, -0.029],
    [-0.086, -0.031],
  ])
    (_.push(m0(0.0036, 0.0336, 0, ne, V, a, 12, y)),
      _.push(m0(0.005, 0.0016, L + 0.0012, ne, V, r, 14, v)),
      _.push(m0(0.0011, 0.001, -L - 8e-4, ne, V, c, 8, g)));
  (_.push(m0(0.0021, 0.0334, 0, -0.04, 0.012, a, 10, y)),
    _.push(m0(0.0021, 0.0334, 0, -0.032, 0.032, a, 10, y)));
  for (let V of [-1, 1])
    (_.push(m0(0.0062, 0.003, V * (L + 2e-4), -0.036, -0.048, r, 16, v)),
      _.push(
        Mt(0.0036, 0.0058, 0.022, 0.0014, V * (L + 0.0026), -0.036, -0.037, r, { wear: 1.2 }, [0.5, 0, 0]),
      ),
      _.push(m0(0.0016, 0.001, V * (L + 0.002), -0.036, -0.048, a, 8, y)));
  _.push(
    Q0(
      b0(
        [
          [0.0155, -0.019],
          [0.0285, -0.019],
          [0.029, -0.033],
          [0.025, -0.0415],
          [0.019, -0.0415],
          [0.015, -0.033],
        ],
        0.0015,
        1,
      ),
      -L - 0.0032,
      -L + 2e-4,
      9e-4,
      r,
      v,
    ),
  );
  for (let V = 0; V < 4; V++)
    _.push(Mt(0.0012, 0.0016, 0.0105, 5e-4, -L - 0.0036, -0.0215 - V * 0.0036, 0.022, r, { wear: 1.3 }));
  (_.push(m0(0.0015, 0.034, 0, -0.0375, 0.022, a, 8, y)),
    _.push(m0(0.0054, 0.0044, L + 0.0014, -0.042, 0.016, r, 14, { wear: 1.2 })));
  for (let V = 0; V < 3; V++)
    _.push(
      Mt(6e-4, 0.0076 - Math.abs(V - 1) * 0.0018, 0.001, 2e-4, L + 0.0037, -0.042, 0.0138 + V * 0.0022, r, E),
    );
  (M.push(
    Q0(
      b0(
        [
          [0.004, -0.0325],
          [0.029, -0.0335],
          [0.029, -0.053],
          [0.004, -0.053],
          [0.004, -0.05],
          [0.0245, -0.05],
          [0.0245, -0.0365],
          [0.004, -0.036],
        ],
        8e-4,
        1,
      ),
      L - 4e-4,
      L + 0.003,
      0.001,
      e,
      p,
    ),
  ),
    M.push(
      Q0(
        b0(
          [
            [0.033, -0.056],
            [0.033, -0.093],
            [0.024, -0.1005],
            [-0.031, -0.1005],
            [-0.041, -0.09],
            [-0.041, -0.06],
          ],
          0.003,
          2,
        ),
        -0.007,
        0.007,
        0.0014,
        e,
        {
          ...p,
          bs: 2,
          holes: [
            b0(
              [
                [0.029, -0.059],
                [0.029, -0.0915],
                [0.0225, -0.0968],
                [-0.0295, -0.0968],
                [-0.0372, -0.0885],
                [-0.0372, -0.061],
              ],
              0.004,
              3,
            ),
          ],
        },
      ),
    ),
    _.push(
      Q0(
        b0(
          [
            [-0.006, -0.057],
            [0.004, -0.057],
            [0.003, -0.069],
            [0.0065, -0.079],
            [0.01, -0.086],
            [0.0065, -0.088],
            [0.001, -0.081],
            [-0.004, -0.07],
          ],
          [0, 0, 0.004, 0.006, 8e-4, 8e-4, 0.006, 0.004],
          2,
        ),
        -0.0031,
        0.0031,
        0.0011,
        r,
        { wear: 0.6, bs: 2 },
      ),
    ));
  let J = b0(
    [
      [-0.038, -0.05],
      [-0.045, -0.074],
      [-0.049, -0.086],
      [-0.049, -0.1],
      [-0.054, -0.112],
      [-0.057, -0.13],
      [-0.064, -0.158],
      [-0.11, -0.152],
      [-0.102, -0.112],
      [-0.096, -0.082],
      [-0.095, -0.064],
      [-0.103, -0.046],
      [-0.08, -0.044],
    ],
    [0.002, 0.006, 0.004, 0.004, 0.006, 0.008, 0.003, 0.004, 0.02, 0.02, 0.006, 0.003, 0.004],
    2,
  );
  T.push(Q0(J, -0.0142, 0.0142, 0.005, u, { ...b, bs: 3 }));
  {
    let V = b0(
      [
        [-0.0565, -0.085],
        [-0.061, -0.109],
        [-0.068, -0.149],
        [-0.101, -0.145],
        [-0.095, -0.112],
        [-0.09, -0.085],
      ],
      0.004,
      2,
    );
    for (let ne of [-1, 1])
      T.push(Q0(V, ne > 0 ? 0.0138 : -0.0146, ne > 0 ? 0.0146 : -0.0138, 4e-4, u, { wear: 0.8, zone: 1 }));
  }
  for (let V = 0; V < 7; V++) {
    let ne = -0.084 - V * 0.0098,
      ye = -0.0527 + (ne + 0.084) * 0.21;
    T.push(Mt(0.015, 0.0034, 0.003, 0.0012, 0, ne, ye, u, b, [-0.21, 0, 0]));
  }
  for (let V = 0; V < 7; V++) {
    let ne = -0.078 - V * 0.01,
      ye = -0.0962 + (ne + 0.078) * 0.16;
    T.push(Mt(0.016, 0.004, 0.0034, 0.0014, 0, ne, ye, u, b, [-0.16, 0, 0]));
  }
  (T.push(Mt(0.03, 0.0056, 0.049, 0.002, 0, -0.1568, -0.087, u, b, [0.13, 0, 0])),
    _.push(m0(0.0028, 0.0296, 0, -0.15, -0.085, a, 8, y)));
  let G = wn.handguardR,
    te = 0.00885,
    oe = 0.0028,
    ee = 0.101,
    le = 0.398,
    xe = b0(
      [
        [ee, -te],
        [le, -te],
        [le, te],
        [ee, te],
      ],
      0.001,
      1,
    );
  for (let V = 0; V < 8; V++) {
    let ne = [];
    if (V === 0 || V === 4 || V === 6)
      for (let Re = 0; Re < 7; Re++) ne.push(c5(0.13 + Re * 0.04, 0, 0.032, 0.007, 4));
    else if (V !== 2)
      for (let Re = 0; Re < 10; Re++) {
        let Ue = 0.124 + Re * 0.027;
        (V === 3 && Ue > 0.3) || ne.push(c5(Ue, 0, 0.013, 0.0052, 3));
      }
    let ye = Q0(xe, G - oe, G, 8e-4, t, { ...p, holes: ne });
    (ye.rotateZ((V * Math.PI) / 4), M.push(ye));
    let Te = ((V + 0.5) * Math.PI) / 4;
    M.push(C(0.003, ee, le, Math.cos(Te) * 0.0197, Math.sin(Te) * 0.0197, t, 8, { wear: 1.2 }));
  }
  (M.push(
    Nn(
      b0(
        [
          [-0.0088, 0.02],
          [0.0088, 0.02],
          [0.0106, 0.029],
          [0.0082, 0.0336],
          [-0.0082, 0.0336],
          [-0.0106, 0.029],
        ],
        8e-4,
        1,
      ),
      0.1012,
      0.3978,
      0.001,
      t,
      p,
    ),
  ),
    M.push(
      h0(
        [
          [0.016, 0.096],
          [0.0236, 0.096],
          [0.0243, 0.0967],
          [0.0243, 0.101],
          [0.0236, 0.1016],
          [0.0236, 0.1062],
          [0.0228, 0.1075],
          [0.016, 0.1075],
        ],
        16,
        t,
        { wear: 1.3 },
      ),
    ));
  for (let V of [-1, 1]) {
    M.push(Mt(0.005, 0.015, 0.03, 0.0014, V * 0.0222, -0.003, 0.119, t, p));
    for (let ne of [0.112, 0.126])
      (_.push(m0(0.0027, 0.0016, V * 0.0252, -0.003, ne, a, 6, y)),
        _.push(m0(0.0012, 6e-4, V * 0.026, -0.003, ne, c, 6, g)));
    M.push(Mt(0.003, 0.006, 0.008, 0.001, V * 0.015, -0.019, 0.1, t, p));
  }
  M.push(
    h0(
      [
        [0.018, 0.3985],
        [0.0222, 0.3985],
        [0.0226, 0.399],
        [0.0226, 0.4004],
        [0.022, 0.4012],
        [0.018, 0.4012],
        [0.018, 0.3985],
      ],
      8,
      t,
      { wear: 1.4 },
    ),
  );
  for (let V of [0.115, 0.215, 0.3, 0.385])
    for (let ne of [-1, 1])
      (_.push(A(0.0019, 0.0012, ne * 0.0098, 0.0314, V, a, 6, y)),
        _.push(A(9e-4, 4e-4, ne * 0.0098, 0.0321, V, c, 6, g)));
  {
    let V = Q.map((Re) => [Re[0], Re[1] - 0.016]),
      ne = Z.map((Re) => [Re[0], Re[1] - 0.0128]),
      ye = [Nn(ne, 0.318, 0.396, 4e-4, t, p)];
    for (let Re = 0; Re < 8; Re++) {
      let Ue = 0.319 + Re * 0.01001;
      ye.push(Nn(V, Ue, Ue + 0.00478, 6e-4, t, { wear: 1.3 }));
    }
    for (let Re of ye) (Re.rotateZ(Math.PI / 4), M.push(Re));
    let Te = [Nn(ne, 0.35, 0.392, 4e-4, t, p)];
    for (let Re = 0; Re < 4; Re++) {
      let Ue = 0.352 + Re * 0.01001;
      Te.push(Nn(V, Ue, Ue + 0.00478, 6e-4, t, { wear: 1.3 }));
    }
    for (let Re of Te) (Re.rotateZ(Math.PI), M.push(Re));
  }
  (T.push(
    Q0(
      b0(
        [
          [0.35, -0.026],
          [0.392, -0.026],
          [0.388, -0.036],
          [0.372, -0.05],
          [0.362, -0.05],
          [0.354, -0.036],
        ],
        0.003,
        2,
      ),
      -0.011,
      0.011,
      0.0032,
      u,
      { ...b, bs: 2, zone: 0.6 },
    ),
  ),
    T.push(
      Q0(
        b0(
          [
            [0.2395, -0.0215],
            [0.2725, -0.0215],
            [0.2725, -0.03],
            [0.27, -0.092],
            [0.2665, -0.0965],
            [0.2455, -0.0975],
            [0.242, -0.093],
            [0.2395, -0.03],
          ],
          0.0025,
          2,
        ),
        -0.014,
        0.014,
        0.0045,
        u,
        { ...b, bs: 3, zone: 0.7 },
      ),
    ));
  for (let V = 0; V < 6; V++)
    T.push(Mt(0.0288, 0.0024, 0.0312, 0.001, 0, -0.04 - V * 0.0085, 0.256 - V * 3e-4, u, b));
  (T.push(Mt(0.03, 0.005, 0.04, 0.0016, 0, -0.024, 0.256, u, b)),
    _.push(m0(0.003, 0.031, 0, -0.025, 0.256, a, 8, y)),
    _.push(
      h0(
        [
          [0.0115, 0.095],
          [0.0115, 0.15],
          [0.0095, 0.153],
          [0.0095, 0.285],
          [0.009, 0.288],
          [0.009, 0.322],
          [0.0086, 0.326],
          [0.0086, 0.435],
          [0.0092, 0.437],
          [0.0092, 0.453],
          [0.0075, 0.455],
          [0.0075, 0.461],
        ],
        20,
        r,
        v,
      ),
    ),
    _.push(
      h0(
        [
          [0.0092, 0.286],
          [0.0135, 0.286],
          [0.0142, 0.2875],
          [0.0142, 0.3165],
          [0.0135, 0.318],
          [0.0092, 0.318],
        ],
        16,
        r,
        v,
      ),
    ),
    _.push(Mt(0.014, 0.009, 0.03, 0.002, 0, 0.0145, 0.302, r, v)),
    _.push(C(0.0026, 0.1, 0.3, 0, 0.0172, l, 8, { bare: 0.8, wear: 0.4 })),
    _.push(m0(0.002, 0.0145, 0, 0.012, 0.308, a, 6, y)));
  for (let V of [0.2925, 0.3115]) _.push(A(0.0017, 0.001, 0, -0.0143, V, c, 6, g));
  (_.push(
    h0(
      [
        [0.0075, 0.459],
        [0.0104, 0.459],
        [0.0112, 0.4598],
        [0.0112, 0.4628],
        [0.0104, 0.4636],
        [0.0104, 0.4644],
        [0.011, 0.465],
        [0.0116, 0.4656],
        [0.0116, 0.477],
        [0.011, 0.478],
        [0.0052, 0.478],
      ],
      20,
      r,
      { wear: 1.1, zone: 0.6 },
    ),
  ),
    _.push(
      h0(
        [
          [0.0052, 0.477],
          [0.0052, 0.517],
        ],
        12,
        c,
        g,
      ),
    ));
  for (let V of [0.4865, 0.4965, 0.5065])
    _.push(
      h0(
        [
          [0.0052, V - 0.0019],
          [0.011, V - 0.0019],
          [0.0116, V - 0.0012],
          [0.0116, V + 0.0012],
          [0.011, V + 0.0019],
          [0.0052, V + 0.0019],
        ],
        20,
        r,
        { wear: 1.1, zone: 0.9 },
      ),
    );
  (_.push(
    h0(
      [
        [0.0052, 0.5145],
        [0.011, 0.5145],
        [0.0116, 0.5155],
        [0.0116, 0.527],
        [0.0102, 0.5305],
        [0.0062, 0.5305],
        [0.0048, 0.5285],
      ],
      20,
      r,
      { wear: 1.1, zone: 0.9 },
    ),
  ),
    _.push(
      h0(
        [
          [0.0048, 0.5285],
          [0.0036, 0.526],
          [0.0036, 0.495],
        ],
        14,
        c,
        g,
      ),
    ));
  for (let V of [-1, 1])
    _.push(Mt(0.0125, 0.0042, 0.042, 0.0012, 0, V * 0.0096, 0.496, r, { wear: 1.1, zone: 0.9 }));
  for (let V = 0; V < 3; V++) _.push(m0(0.0016, 0.0236, 0, 0, 0.4675 + V * 0.0035, c, 6, g));
  M.push(
    h0(
      [
        [0, -0.292],
        [0.0138, -0.292],
        [0.0146, -0.291],
        [0.0146, -0.1],
      ],
      20,
      o,
      p,
    ),
  );
  {
    let V = [[0.0146, -0.122]];
    for (let ne = 0; ne < 1; ne++)
      V.push([0.0183, -0.122], [0.019, -0.1212], [0.019, -0.112], [0.0183, -0.111], [0.0146, -0.111]);
    _.push(h0(V, 12, r, { wear: 1.4, crease: 20 }));
    for (let ne = 0; ne < 6; ne++) {
      let ye = (ne * Math.PI) / 3 + 0.3;
      _.push(
        Mt(0.004, 0.0022, 0.005, 4e-4, Math.cos(ye) * 0.0186, Math.sin(ye) * 0.0186, -0.1192, c, g, [
          0,
          0,
          ye + Math.PI / 2,
        ]),
      );
    }
  }
  {
    let V = [
        [-0.0163, -0.024],
        [0.0163, -0.024],
        [0.018, -0.018],
        [0.018, 0.018],
        [0.0138, 0.024],
        [-0.0138, 0.024],
        [-0.018, 0.018],
        [-0.018, 0.006],
        [-0.031, 0.004],
        [-0.0344, -0.002],
        [-0.0344, -0.014],
        [-0.0292, -0.02],
        [-0.018, -0.02],
      ],
      ne = [
        [-0.0215, -0.014],
        [-0.0215, -0.002],
        [-0.0284, -5e-4],
        [-0.031, -0.004],
        [-0.031, -0.012],
        [-0.0275, -0.016],
      ];
    _.push(Nn(b0(V, 0.0015, 1), -0.1095, -0.1045, 8e-4, r, { ...v, holes: [b0(ne, 0.0012, 1)] }));
  }
  (z.push(Mt(0.003, 8e-4, 0.015, 3e-4, 0.0062, 0.0182, -0.115, [0.5, 0.36, 0.03], E, [0, 0, -0.33])),
    z.push(Mt(0.0022, 6e-4, 0.0022, 2e-4, 0, -0.0146, 0.2925, [0.42, 0.05, 0.03], E)));
  let j = 0.0163;
  T.push(
    Q0(
      b0(
        [
          [-0.146, 0.024],
          [-0.3, 0.024],
          [-0.331, 0.014],
          [-0.334, -0.086],
          [-0.318, -0.101],
          [-0.29, -0.096],
          [-0.232, -0.04],
          [-0.146, -0.024],
        ],
        [0.004, 0.02, 0.006, 0.006, 0.006, 0.02, 0.03, 0.006],
        3,
      ),
      -j,
      j,
      0.0042,
      u,
      {
        ...b,
        bs: 3,
        holes: [
          b0(
            [
              [-0.262, -0.036],
              [-0.306, -0.036],
              [-0.306, -0.074],
              [-0.292, -0.074],
            ],
            0.005,
            2,
          ),
          c5(0.004, -0.3185, 0.022, 0.0055, 3).map((V) => [V[1], V[0]]),
        ],
      },
    ),
  );
  for (let V of [-1, 1])
    (T.push(
      Q0(
        b0(
          [
            [-0.156, 0.017],
            [-0.25, 0.017],
            [-0.25, -0.022],
            [-0.228, -0.026],
            [-0.156, -0.016],
          ],
          0.004,
          2,
        ),
        V > 0 ? j - 3e-4 : -j - 6e-4,
        V > 0 ? j + 6e-4 : -j + 3e-4,
        5e-4,
        u,
        { wear: 0.8, zone: 0.55 },
      ),
    ),
      _.push(m0(0.0064, 0.002, V * (j + 2e-4), -0.06, -0.318, r, 14, { wear: 1.3 })),
      _.push(m0(0.0044, 0.001, V * (j + 0.001), -0.06, -0.318, c, 12, g)));
  T.push(
    Eu(
      [
        kn($a(0.012, 0.0215, 0.033, 0.005, 0.001, 3), -0.158, { sy: 0.25, cy: 0.0215 }),
        kn($a(0.0132, 0.0215, 0.0352, 0.0058, 0.001, 3), -0.166, { sy: 0.7, cy: 0.0215 }),
        kn($a(0.0138, 0.0215, 0.0372, 0.0062, 0.001, 3), -0.184),
        kn($a(0.0142, 0.0215, 0.038, 0.0064, 0.001, 3), -0.288),
        kn($a(0.0138, 0.0215, 0.0372, 0.0062, 0.001, 3), -0.298, { sy: 0.7, cy: 0.0215 }),
        kn($a(0.0128, 0.0215, 0.034, 0.005, 0.001, 3), -0.304, { sy: 0.25, cy: 0.0215 }),
      ],
      u,
      b,
    ),
  );
  for (let V of [-0.196, -0.268]) _.push(m0(0.0028, 0.029, 0, 0.0295, V, a, 8, y));
  (T.push(Mt(0.0105, 0.011, 0.04, 0.003, 0, -0.033, -0.19, u, b, [0.2, 0, 0])),
    _.push(m0(0.0022, 0.02, 0, -0.029, -0.174, a, 8, y)),
    z.push(Mt(0.0322, 0.12, 0.011, 0.0042, 0, -0.04, -0.3395, f, E)));
  for (let V = 0; V < 9; V++) z.push(Mt(0.027, 0.004, 0.003, 0.001, 0, 0.004 - V * 0.011, -0.3455, f, E));
  let O = wn.sightY,
    q = wn.window;
  (M.push(
    Nn(
      b0(
        [
          [-0.015, 0.0436],
          [0.015, 0.0436],
          [0.015, 0.05],
          [0.0176, 0.053],
          [-0.0176, 0.053],
          [-0.015, 0.05],
        ],
        8e-4,
        1,
      ),
      0.001,
      0.041,
      0.001,
      i,
      p,
    ),
  ),
    M.push(Mt(0.0044, 0.0086, 0.034, 0.001, -0.0164, 0.045, 0.021, i, p)));
  for (let V of [0.009, 0.033])
    (_.push(m0(0.004, 0.004, -0.0204, 0.045, V, r, 6, { wear: 1.3 })),
      _.push(m0(0.0019, 0.0012, -0.0228, 0.045, V, a, 8, y)),
      _.push(m0(0.003, 0.002, 0.016, 0.045, V, a, 10, y)));
  let ue = b0(
    [
      [-0.0192, 0.0525],
      [0.0192, 0.0525],
      [0.0192, 0.0788],
      [0.0138, 0.0842],
      [-0.0138, 0.0842],
      [-0.0192, 0.0788],
    ],
    [0.001, 0.001, 0.0022, 0.0022, 0.0022, 0.0022],
    2,
  );
  (M.push(Nn(ue, 0.008, 0.034, 0.0012, i, { ...p, bs: 2, holes: [q] })),
    M.push(Mt(0.042, 0.0052, 0.03, 0.0012, 0, 0.0546, 0.021, i, p)),
    z.push(
      Nn(
        q.map((V) => [V[0] * 1.004, (V[1] - O) * 1.004 + O]),
        0.0078,
        0.0342,
        0,
        h,
        { wear: 0, holes: [q.map((V) => [V[0] * 0.982, (V[1] - O) * 0.982 + O])] },
      ),
    ));
  let de = [
    [-0.0204, 0.06],
    [-0.0204, 0.0792],
    [-0.0143, 0.0854],
    [0.0143, 0.0854],
    [0.0204, 0.0792],
    [0.0204, 0.06],
    [0.0193, 0.06],
    [0.0193, 0.0788],
    [0.0138, 0.0843],
    [-0.0138, 0.0843],
    [-0.0193, 0.0788],
    [-0.0193, 0.06],
  ];
  M.push(Nn(de, 0.0285, 0.0385, 3e-4, i, { wear: 1.3 }));
  {
    let V = h0(
      [
        [0, -0.0058],
        [0.005, -0.0058],
        [0.0057, -0.0052],
        [0.0057, -0.003],
        [0.0052, -0.0026],
        [0.0052, -0.0018],
        [0.0057, -0.0014],
        [0.0057, 0.0034],
        [0.005, 0.0042],
        [0, 0.0042],
      ],
      16,
      r,
      { wear: 1.3 },
    );
    (V.rotateY(Math.PI / 2),
      V.translate(0.0222, 0.0625, -0.021),
      _.push(V),
      _.push(Mt(6e-4, 0.0012, 0.0074, 2e-4, 0.0281, 0.0625, 0.021, c, g)));
  }
  for (let V of [0.0165, 0.0245]) z.push(Mt(0.0022, 0.0055, 0.0055, 0.001, -0.0197, 0.064, V, f, E));
  for (let V of [0.012, 0.03])
    for (let ne of [-1, 1]) _.push(m0(0.0016, 0.0012, ne * 0.0212, 0.0546, V, a, 6, y));
  z.push(Mt(0.009, 0.0026, 0.006, 6e-4, 0, 0.058, 0.0115, h, E));
  for (let V of [0.0128, -0.0128]) {
    let ne = h0(
      [
        [0, -6e-4],
        [0.0019, -6e-4],
        [0.0022, -2e-4],
        [0.0022, 7e-4],
        [0, 7e-4],
      ],
      10,
      a,
      { ...y, ox: V, oy: 0.0546 },
    );
    (ne.translate(0, 0, -0.006), _.push(ne));
  }
  (_.push(A(0.003, 0.0022, 0.009, 0.0846, 0.014, a, 12, y)),
    z.push(Mt(0.0044, 3e-4, 9e-4, 1e-4, 0.009, 0.0858, 0.014, h, E)),
    z.push(Mt(0.016, 5e-4, 0.01, 1e-4, -0.003, 0.08435, 0.025, [0.012, 0.016, 0.03], E)));
  {
    let V = h0(
      [
        [0, -0.0012],
        [0.0034, -0.0012],
        [0.004, -6e-4],
        [0.004, 0.0026],
        [0.0034, 0.0032],
        [0, 0.0032],
      ],
      12,
      r,
      { wear: 1.3 },
    );
    (V.rotateY(-Math.PI / 2),
      V.translate(0.0196, 0.0755, -0.0125),
      _.push(V),
      _.push(Mt(5e-4, 0.001, 0.0052, 2e-4, 0.0228, 0.0755, 0.0125, c, g)));
  }
  z.push(
    Nn(q, 0.0304, 0.0318, 0, h, { wear: 0, holes: [q.map((V) => [V[0] * 0.955, (V[1] - O) * 0.955 + O])] }),
  );
  for (let [V, ne] of [
    [-0.03, 1],
    [0.372, -1],
  ]) {
    (_.push(
      Nn(
        b0(
          [
            [-0.0106, 0.0437],
            [0.0106, 0.0437],
            [0.0112, 0.0462],
            [0.009, 0.0508],
            [-0.009, 0.0508],
            [-0.0112, 0.0462],
          ],
          8e-4,
          1,
        ),
        V - 0.015,
        V + 0.015,
        8e-4,
        r,
        v,
      ),
    ),
      _.push(
        Q0(
          b0(
            [
              [V - ne * 0.0165, 0.0506],
              [V + ne * 0.0215, 0.0506],
              [V + ne * 0.0215, 0.053],
              [V + ne * 0.018, 0.0549],
              [V - ne * 0.01, 0.0549],
              [V - ne * 0.0165, 0.0532],
            ],
            8e-4,
            1,
          ),
          -0.006,
          0.006,
          9e-4,
          r,
          { wear: 1.1 },
        ),
      ));
    for (let ye of [-1, 1]) _.push(Mt(0.0022, 0.0034, 0.02, 8e-4, ye * 0.0071, 0.0524, V + ne * 0.009, r, v));
    (_.push(m0(0.0029, 0.0236, 0, 0.052, V - ne * 0.0125, r, 10, { wear: 1.2 })),
      _.push(Mt(0.004, 0.006, 0.006, 0.001, ne * 0.0128, 0.0472, V, r, v)),
      _.push(m0(0.004, 0.0044, -0.0128, 0.0472, V + 0.006, a, 6, y)),
      _.push(m0(0.0016, 0.0014, 0.0122, 0.0478, V - 0.007, a, 8, y)));
  }
  {
    let V = h0(
      [
        [0.0016, -0.0012],
        [0.0034, -0.0012],
        [0.0038, -8e-4],
        [0.0038, 8e-4],
        [0.0034, 0.0012],
        [0.0016, 0.0012],
        [0.0016, -0.0012],
      ],
      12,
      r,
      v,
    );
    (V.rotateX(Math.PI / 2), V.translate(0, 0.0553, 0.016), _.push(V));
  }
  _.push(m0(0.0048, 0.005, 0.015, 0.049, -0.036, r, 12, { wear: 1.4 }));
  for (let V = 0; V < 6; V++)
    _.push(
      Mt(
        0.0044,
        0.001,
        0.001,
        3e-4,
        0.015,
        0.049 + Math.sin(V * 1.047) * 0.0046,
        -0.036 + Math.cos(V * 1.047) * 0.0046,
        r,
        v,
      ),
    );
  (M.push(Mt(0.016, 0.005, 0.02, 0.0014, 0, 0.0352, -0.0975, n, p)),
    _.push(A(0.003, 0.0012, 0, 0.038, -0.0985, a, 6, y)));
  let $ = -0.0267,
    se = 0.0267;
  (M.push(
    h0(
      [
        [0, 0.308],
        [0.0095, 0.308],
        [0.0108, 0.3095],
        [0.0108, 0.322],
        [0.0118, 0.323],
        [0.0118, 0.378],
        [0.0128, 0.38],
        [0.0142, 0.382],
        [0.0142, 0.404],
        [0.0136, 0.406],
        [0.0142, 0.408],
        [0.0142, 0.412],
        [0.0128, 0.4135],
        [0.0118, 0.4135],
        [0.0112, 0.409],
      ],
      18,
      s,
      { wear: 1.2, ox: $, oy: se },
    ),
  ),
    z.push(
      h0(
        [
          [0.0112, 0.409],
          [0, 0.409],
        ],
        18,
        [0.1, 0.12, 0.14],
        { wear: 0, ox: $, oy: se },
      ),
    ));
  for (let V = 0; V < 5; V++)
    M.push(
      h0(
        [
          [0.0118, 0.33 + V * 0.008],
          [0.0124, 0.3305 + V * 0.008],
          [0.0124, 0.3335 + V * 0.008],
          [0.0118, 0.334 + V * 0.008],
        ],
        18,
        s,
        { wear: 1.4, ox: $, oy: se },
      ),
    );
  {
    let V = Mt(0.02, 0.008, 0.04, 0.0012, 0, 0.028, 0.352, s, p);
    (V.rotateZ(Math.PI / 4), M.push(V));
  }
  {
    let V = m0(0.004, 0.006, 0.0135, 0.028, 0.352, a, 6, y);
    (V.rotateZ(Math.PI / 4), _.push(V));
  }
  z.push(Mt(0.0185, 0.0065, 0.07, 0.0025, 0, 0.0468, 0.214, f, E));
  for (let V = 0; V < 6; V++) z.push(Mt(0.014, 0.0012, 0.004, 5e-4, 0, 0.0503, 0.192 + V * 0.009, f, E));
  z.push(
    vh(
      bn(
        [
          [$, se, -0.308],
          [$ - 0.001, se + 0.002, -0.296],
          [-0.0265, 0.0235, -0.284],
          [-0.0255, 0.0215, -0.272],
          [-0.0235, 0.027, -0.262],
          [-0.016, 0.04, -0.256],
          [-0.007, 0.0465, -0.252],
          [-0.002, 0.047, -0.247],
        ],
        0.0018,
        6,
      ),
      f,
      { keepN: !0, wear: 0 },
    ),
  );
  for (let V of [
    [-0.0262, 0.0228, 0.28],
    [-0.0242, 0.0255, 0.265],
  ]) {
    let ne = Mt(0.0065, 0.0026, 0.0035, 8e-4, 0, 0, 0, [0.04, 0.04, 0.04], E);
    (ne.rotateZ(Math.PI / 4), ne.translate(V[0], V[1], -V[2]), z.push(ne));
  }
  let fe = [9.5, 9.5, 9.9];
  w.push(
    h0(
      [
        [0, -0.058],
        [0.0108, -0.058],
        [0.0114, -0.057],
        [0.0114, -0.01],
        [0.0106, -0.008],
        [0.0106, -0.002],
        [0.0114, 0],
        [0.0114, 0.046],
        [0.0098, 0.048],
        [0.0098, 0.056],
        [0.0058, 0.056],
        [0.0058, 0.06],
        [0, 0.06],
      ],
      16,
      fe,
      { bare: 1, wear: 0.5, oy: 0.001 },
    ),
  );
  for (let V = 0; V < 6; V++)
    w.push(
      Mt(0.0014, 0.008, 0.0026, 5e-4, 0.0112, 0.001, 0.008 + V * 0.0062, [2.2, 2.2, 2.3], {
        bare: 0.6,
        wear: 0,
      }),
    );
  w.push(Mt(0.01, 0.0054, 0.014, 0.0015, -0.0142, 0.007, 0.078, r, v));
  {
    let V = h0(
      [
        [0, -0.0078],
        [0.0042, -0.0078],
        [0.0056, -0.0066],
        [0.0056, -0.0046],
        [0.005, -0.004],
        [0.005, -0.0026],
        [0.0056, -0.002],
        [0.0056, 0],
        [0.005, 6e-4],
        [0.005, 0.002],
        [0.0056, 0.0026],
        [0.0056, 0.0062],
        [0.0046, 0.0078],
        [0, 0.0078],
      ],
      14,
      r,
      { wear: 1.5, zone: 1 },
    );
    (V.rotateY(Math.PI / 2), V.translate(-0.0267, 0.007, -0.078), w.push(V));
  }
  let me = (V) => 1.5 * Math.pow(Math.max(0, V - 0.07), 2),
    ge = (V) => 3 * Math.max(0, V - 0.07),
    ce = [1, 1, 1],
    P = [],
    D = 0.212,
    B = 12,
    X = { wear: 0.8, zone: 0.25 };
  for (let V = 0; V <= B; V++) {
    let ne = -0.004 + ((D + 0.004) * V) / B;
    P.push([me(ne) + 0.0298, -ne]);
  }
  for (let V = B; V >= 0; V--) {
    let ne = -0.004 + ((D + 0.004) * V) / B;
    P.push([me(ne) - 0.0298, -ne]);
  }
  S.push(Q0(P, -0.0113, 0.0113, 0.0022, ce, { ...X, bs: 2, crease: 40 }));
  for (let V = 0; V < 8; V++) {
    let ne = 0.082 + V * 0.0155;
    S.push(Mt(0.0244, 0.0056, 0.05, 0.0018, 0, -ne, me(ne), ce, X, [Math.atan(ge(ne)), 0, 0]));
  }
  for (let V = 0; V < 10; V++) {
    let ne = 0.078 + V * 0.013;
    S.push(Mt(0.012, 0.011, 0.004, 0.0012, 0, -ne, me(ne) + 0.0302, ce, X, [Math.atan(ge(ne)), 0, 0]));
  }
  (S.push(
    Mt(0.027, 0.009, 0.068, 0.003, 0, -D - 0.003, me(D) + 0.001, ce, { wear: 1, zone: 0.6 }, [
      Math.atan(ge(D)),
      0,
      0,
    ]),
  ),
    S.push(
      Mt(0.01, 0.004, 0.012, 0.001, 0, -D - 0.008, me(D) - 0.01, [0.6, 0.6, 0.6], b, [
        Math.atan(ge(D)),
        0,
        0,
      ]),
    ),
    S.push(Mt(0.003, 0.006, 0.04, 0.001, -0.0085, 0.0045, 0.004, ce, X)),
    S.push(Mt(0.003, 0.006, 0.04, 0.001, 0.0085, 0.0045, 0.004, ce, X)));
  let re = [1.25, 0.72, 0.5];
  (R.push(
    h0(
      [
        [0, -0.02],
        [0.004, -0.02],
        [0.0047, -0.019],
        [0.0047, 0.01],
        [0.0034, 0.014],
        [0.0034, 0.018],
      ],
      12,
      [1, 1, 1],
      { wear: 0, ox: 0.002, oy: 0.0062 },
    ),
  ),
    R.push(
      h0(
        [
          [0.003, 0.018],
          [0.0029, 0.024],
          [0.0022, 0.03],
          [0.001, 0.0345],
          [0, 0.0352],
        ],
        12,
        re,
        { wear: 0, ox: 0.002, oy: 0.0062 },
      ),
    ),
    R.push(
      h0(
        [
          [0, -0.02],
          [0.004, -0.02],
          [0.0047, -0.019],
          [0.0047, 0.01],
        ],
        10,
        [0.8, 0.8, 0.8],
        { wear: 0, ox: -0.003, oy: 5e-4 },
      ),
    ));
  let Y = { ano: Fs(M), gun: Fs(_), poly: Fs(T), plain: Fs(z), bolt: Fs(w), mag: Fs(S), round: Fs(R) },
    he = (V, ne, ye, Te) =>
      Te === 'poly' || Te === 'plain' || Te === 'round' || Te === 'mag'
        ? 0
        : Math.max(
            Zl(V, ne, ye, -0.03, 0.03, -0.095, -0.074, 0.03, 0.104, 0.014),
            0.85 * Zl(V, ne, ye, 0.012, 0.03, -0.014, 0.016, -0.016, 0.066, 0.012),
            0.85 * Zl(V, ne, ye, -0.03, -0.012, 5e-4, 0.0135, -0.028, 0.092, 0.01),
            0.5 * Zl(V, ne, ye, -0.03, 0.03, -0.026, -0.016, -0.1, 0.1, 0.004),
          );
  sy(
    Object.keys(Y).map((V) => ({ key: V, g: Y[V], off: V === 'mag' || V === 'round' ? wn.magPos : null })),
    he,
  );
  for (let V in Y) Y[V].computeBoundingSphere();
  return Y;
}

function Zz(n) {
  let e = n.attributes.position.array,
    t = n.attributes.normal.array,
    i = n.attributes.color.array,
    s = n.attributes.aSurf.array,
    o = (r, a, l, c) => {
      for (let u = 0; u < c; u++) {
        let f = r[a * c + u];
        ((r[a * c + u] = r[l * c + u]), (r[l * c + u] = f));
      }
    };
  for (let r = 0; r < e.length / 3; r += 3)
    (o(e, r + 1, r + 2, 3), o(t, r + 1, r + 2, 3), o(i, r + 1, r + 2, 3), o(s, r + 1, r + 2, 4));
}

var Tu = (n) => (n && n.index ? n.index.count : n && n.attributes && n.attributes.position ? n.attributes.position.count : 0) / 3;

var RE = THREE.Quaternion,
  _1 = (n) => (n < 0 ? 0 : n > 1 ? 1 : n),
  Ot = (n) => ((n = _1(n)), n * n * n * (n * (6 * n - 15) + 10)),
  CE = (n) => ((n = _1(n)), n * n),
  yh = (n) => ((n = _1(n)), 1 - (1 - n) * (1 - n));

var dn = (n, e, t) => _1((n - e) / (t - e)),
  oy = (n, e) => {
    n = _1(n);
    let t = n - 1;
    return 1 + (e + 1) * t * t * t + e * t * t;
  },
  pn = (n, e = 1) => ({ x: 0, v: 0, w: n, z: e });

function en(n, e, t, i = n.w, s = n.z) {
  let o = n.x - e,
    r = n.v;
  if (s >= 0.999) {
    let a = Math.exp(-i * t),
      l = r + i * o;
    ((n.x = e + (o + l * t) * a), (n.v = (r - i * l * t) * a));
  } else {
    let a = i * Math.sqrt(1 - s * s),
      l = Math.exp(-s * i * t),
      c = Math.cos(a * t),
      u = Math.sin(a * t),
      f = (r + s * i * o) / a;
    ((n.x = e + l * (o * c + f * u)), (n.v = l * (a * (f * c - o * u) - s * i * (o * c + f * u))));
  }
  return n.x;
}

var Xn = (n, e = 0) => {
    ((n.x = e), (n.v = 0));
  },
  AE = (n) => {
    let e = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return (e - Math.floor(e)) * 2 - 1;
  };

function sa(n, e = 0) {
  let t = Math.floor(n),
    i = n - t,
    s = i * i * i * (i * (6 * i - 15) + 10);
  return 2 * ((1 - s) * AE(t + e * 57.31) * i + s * AE(t + 1 + e * 57.31) * (i - 1));
}

var ry = (n, e) => e * Math.tanh(n / e),
  Au = (n, e, t, i = 'XYZ') => new RE().setFromEuler(new THREE.Euler(n, e, t, i));

function Ru(n, e, t, i) {
  let s = 0;
  for (; s < n.length - 2 && e > n[s + 1][0];) s++;
  let o = n[s],
    r = n[s + 1],
    a = Ot((e - o[0]) / Math.max(1e-4, r[0] - o[0]));
  (t.copy(o[1].p).lerp(r[1].p, a), i.copy(o[1].q).slerp(r[1].q, a));
}

var oa = { holster: 0.28, draw: 0.32 },
  bh = {
    rifle: {
      pivot: [0, -0.035, 0.3],
      ads: {
        pos: 0.22,
        rot: 0.05,
        w: 23,
        z: 0.75,
        arc: { p: [0.004, 0.011, 0.01], r: [0.02, -0.03, -0.03] },
        out: 0.03,
      },
      idle: {
        hz: 0.25,
        breathY: 5e-4,
        breathP: 9e-4,
        drift: 6e-4,
        driftR: 0.001,
        noise: 18e-5,
        noiseR: 4e-4,
      },
      walk: { y: 0.0034, x: 0.0034, z: 0.0016, pitch: 0.007, yaw: 0.01, roll: 0.015, lag: 0.04 },
      run: { y: 0.015, x: 0.011, z: 0.006, pitch: 0.028, yaw: 0.028, roll: 0.046, lag: 0.05 },
      crouch: 0.72,
      inertia: { z: 0.0042, x: 0.0034, pitch: 0.0085, roll: 0.01, lean: 0.006, tau: 0.13, spr: [15, 0.48] },
      sway: { lag: 0.058, max: 0.07, roll: 0.55, shift: 0.02, spr: [13.5, 0.64], adsRot: 0.1, adsPos: 0.5 },
      air: {
        jumpY: 0.26,
        jumpP: 0.95,
        fallY: 0.0019,
        fallP: 0.004,
        landY: 0.092,
        landP: 0.26,
        landR: 0.17,
        spr: [20.5, 0.56],
      },
      recoil: {
        back: 0.82,
        rise: 1.5,
        yaw: 0.95,
        roll: 1.7,
        up: 0.11,
        side: 0.09,
        first: 1.4,
        adsBack: 0.75,
        adsRot: 0.1,
        adsPos: 0.9,
        spr: { kZ: [44, 0.55], kP: [36, 0.5], kY: [30, 0.45], kR: [31, 0.42], kX: [40, 0.5], kU: [40, 0.5] },
      },
      sprint: { spr: [17, 1] },
      wall: { near: 0.42, far: 1.05, p: [-0.03, -0.035, 0.085], r: [0.34, 0.5, 0.16] },
      crouchDip: { y: 0.0075, pitch: 0.02, roll: 0.028, w: [16, 8] },
    },
    pistol: {
      pivot: [0, -0.085, 0.075],
      ads: {
        pos: 0.14,
        rot: 0.06,
        w: 29.5,
        z: 0.75,
        arc: { p: [0.003, 0.008, 0.012], r: [0.03, -0.02, -0.03] },
        out: 0.024,
      },
      idle: {
        hz: 0.25,
        breathY: 6e-4,
        breathP: 0.0011,
        drift: 7e-4,
        driftR: 0.0014,
        noise: 25e-5,
        noiseR: 7e-4,
      },
      walk: { y: 0.003, x: 0.0036, z: 0.0014, pitch: 0.009, yaw: 0.014, roll: 0.015, lag: 0.028 },
      run: { y: 0.012, x: 0.009, z: 0.005, pitch: 0.034, yaw: 0.03, roll: 0.04, lag: 0.034 },
      crouch: 0.72,
      inertia: { z: 0.0034, x: 0.0028, pitch: 0.011, roll: 0.012, lean: 0.0085, tau: 0.1, spr: [20, 0.5] },
      sway: { lag: 0.04, max: 0.085, roll: 0.45, shift: 0.012, spr: [19, 0.6], adsRot: 0.1, adsPos: 0.4 },
      air: {
        jumpY: 0.22,
        jumpP: 1.2,
        fallY: 0.0017,
        fallP: 0.005,
        landY: 0.078,
        landP: 0.34,
        landR: 0.2,
        spr: [23, 0.54],
      },
      recoil: {
        back: 0.55,
        rise: 6.4,
        yaw: 1.3,
        roll: 2.3,
        up: 0.2,
        side: 0.1,
        first: 1,
        adsBack: 0.8,
        adsRot: 0.42,
        adsPos: 0.8,
        spr: { kZ: [56, 0.55], kP: [50, 0.5], kY: [38, 0.48], kR: [38, 0.45], kX: [46, 0.5], kU: [46, 0.5] },
      },
      sprint: { spr: [20, 1] },
      wall: { near: 0.32, far: 0.8, p: [-0.02, -0.02, 0.13], r: [0.42, 0.3, 0.1] },
      crouchDip: { y: 0.0065, pitch: 0.03, roll: 0.026, w: [18, 9] },
    },
  },
  ft = {
    tac: 2.24,
    empty: 2.72,
    atMag: 0.36,
    magout: 0.4,
    clear: 0.52,
    away: 0.74,
    swap: 0.8,
    rise: 0.86,
    align: 1.1,
    insert: 1.15,
    short: 1.31,
    windup: 1.385,
    magin: 1.44,
    rebound: 1.5,
    regrip: 1.54,
    tugDown: 1.6,
    tugUp: 1.66,
    swapBack: 1.75,
    atHandle: 1.84,
    tacBack: 1.89,
    tacRelease: 1.905,
    tacBolt: 1.93,
    back: 1.96,
    release: 2.12,
    bolt: 2.155,
    shortBy: 0.009,
    backOff: 0.032,
    reboundBy: 0.008,
    tugBy: 0.005,
    partial: 0.32,
  },
  It = {
    tac: 1.5,
    empty: 1.9,
    release: 0.12,
    magout: 0.18,
    swap: 0.48,
    rise: 0.52,
    align: 0.84,
    insert: 0.9,
    fingers: 1.02,
    windup: 1.075,
    magin: 1.13,
    rebound: 1.19,
    swapBack: 1.3,
    regrip: 1.44,
    thumb: 1.53,
    slideRelease: 1.575,
    slide: 1.61,
    backOff: 0.026,
    reboundBy: 0.01,
  };

var xU = new THREE.Euler(),
  vU = new RE();

var W0 = THREE.Vector3,
  Ur = THREE.Quaternion,
  Nu = THREE.Matrix4,
  Nh = new W0(1, 1, 1),
  cS = (n) => ((n = n < 0 ? 0 : n > 1 ? 1 : n), n * n * n * (n * (6 * n - 15) + 10));

function fS(n, e) {
  let t = new W0(n[0], n[1], n[2]).normalize().negate(),
    i = new W0(e[0], e[1], e[2]);
  return (
    i.addScaledVector(t, -i.dot(t)).normalize(),
    new Ur().setFromRotationMatrix(new Nu().makeBasis(new W0().crossVectors(i, t), i, t))
  );
}

function hS(n, e, t, i) {
  return new W0(n === 'left' ? -i[0] : i[0], i[1], i[2])
    .applyQuaternion(e)
    .negate()
    .add(new W0(t[0], t[1], t[2]));
}

function il(n, e, t, i = new Ur()) {
  let s = typeof e == 'string' ? nn[e].frame : e,
    o = new W0(),
    r = new Ur(),
    a = n === 'left',
    l = a ? new W0(-t.x, t.y, t.z) : t,
    c = a ? new Ur(i.x, -i.y, -i.z, i.w) : i;
  return (
    r.copy(c).multiply(new Ur().copy(s.q).invert()),
    o.copy(s.p).negate().applyQuaternion(r).add(l),
    a && ((o.x = -o.x), (r.y = -r.y), (r.z = -r.z)),
    { p: o, q: r }
  );
}

function AD(n) {
  let e = -1e9,
    t = new W0(),
    i = new Ur(),
    s = (o, r, a) => {
      let l = -Fr(o, r, a);
      l > e && (e = l);
    };
  for (let o of n)
    if (o.type === 'capsule') {
      let r = new W0(...o.a),
        a = new W0(...o.b),
        l = a.clone().sub(r),
        c = l.length() || 1e-9;
      l.multiplyScalar(1 / c);
      let u = new W0(1, 0, 0);
      (Math.abs(l.x) > 0.9 && u.set(0, 1, 0), u.addScaledVector(l, -u.dot(l)).normalize());
      let f = new W0().crossVectors(l, u);
      for (let h = 0; h <= 8; h++)
        for (let p = 0; p < 12; p++) {
          let d = (p / 12) * Math.PI * 2;
          (t
            .copy(r)
            .addScaledVector(l, (c * h) / 8)
            .addScaledVector(u, Math.cos(d) * o.r)
            .addScaledVector(f, Math.sin(d) * o.r),
            s(t.x, t.y, t.z));
        }
    } else {
      i.set(o.q[0], o.q[1], o.q[2], o.q[3]);
      let r = o.h,
        a = 6;
      for (let l = 0; l < 6; l++) {
        let c = l >> 1,
          u = l & 1 ? 1 : -1,
          f = (c + 1) % 3,
          h = (c + 2) % 3;
        for (let p = 0; p <= a; p++)
          for (let d = 0; d <= a; d++) {
            let m = [0, 0, 0];
            ((m[c] = u * r[c]),
              (m[f] = ((p / a) * 2 - 1) * Math.max(0, r[f] - o.r)),
              (m[h] = ((d / a) * 2 - 1) * Math.max(0, r[h] - o.r)),
              t.set(m[0], m[1], m[2]).applyQuaternion(i),
              s(t.x + o.c[0], t.y + o.c[1], t.z + o.c[2]));
          }
      }
    }
  return e;
}

function ca(n, e, t, i, s, o = {}) {
  let r = new Nu().compose(t, i, Nh).invert(),
    a = Th(s, r);
  e === 'left' && (a = Lh(a));
  let l = Jl(a, { palm: Fr, ...o });
  return {
    name: n,
    side: e,
    p: t.clone(),
    q: i.clone(),
    pose: l,
    shapes: a,
    depth: Kl(l, a).depth,
    palm: () => AD(a),
  };
}

function dS(n, e, t, i = null) {
  let s = n.shapes;
  if (i) {
    let r = new Nu().compose(n.p, n.q, Nh).invert(),
      a = Th(i, r);
    (n.side === 'left' && (a = Lh(a)), (s = s.concat(a)));
  }
  let o = Jl(s, { palm: Fr, ...t });
  return { ...n, name: e, pose: o, shapes: s, depth: Kl(o, s).depth };
}

function Uu(n, e, t, i, s = null, o = {}) {
  s = s || n.pose;
  let r = new W0(i[0], i[1], i[2]).applyMatrix4(new Nu().compose(n.p, n.q, Nh).invert());
  n.side === 'left' && (r.x = -r.x);
  let a = Float32Array.from(s);
  if (o.start) for (let c = 0; c < 4; c++) a[t * 4 + c] = o.start[c];
  let l = FE(a, t, [r.x, r.y, r.z], o);
  return { ...n, name: e, pose: a, depth: Kl(a, n.shapes).depth, miss: l };
}

var T5 = tr();

function pS(n, e, t = n.pose, i = 0.5) {
  Sh(t, e, T5);
  let s = t0[e],
    o = e * 4,
    r = new W0().copy(T5.j[o + 2]).lerp(T5.j[o + 3], i);
  return (
    r.addScaledVector(
      new W0(0, -1, 0).applyQuaternion(T5.q[e * 3 + 2]),
      s.rad[2] + (s.rad[3] - s.rad[2]) * i,
    ),
    n.side === 'left' && (r.x = -r.x),
    r.applyMatrix4(new Nu().compose(n.p, n.q, Nh))
  );
}

var Dy = tr(),
  U1 = new W0(),
  uS = new W0();

function RD(n, e, t, i, s, o, r, a) {
  Sh(n, e, Dy);
  let l = t0[e],
    c = Dy.j,
    u = e * 4,
    f = -1e9;
  for (let p = e === 0 ? 1 : 0; p < 3; p++) {
    let d = c[u + p],
      m = c[u + p + 1],
      x = p === 2 ? l.rad[3] / l.len[2] : 0;
    for (let v = 0; v < 6; v++) {
      let y = e === 0 && p === 1 ? a + ((1 - a) * v) / 5 : v / 5,
        b = y * (1 - x),
        g =
          l.rad[p] +
          (l.rad[p + 1] - l.rad[p]) * y -
          h5(t, d.x + (m.x - d.x) * b, d.y + (m.y - d.y) * b, d.z + (m.z - d.z) * b);
      g > f && (f = g);
    }
  }
  (U1.copy(c[u + 2]).lerp(c[u + 3], 0.55),
    uS.set(0, -1, 0).applyQuaternion(Dy.q[e * 3 + 2]),
    U1.addScaledVector(uS, l.rad[2] + (l.rad[3] - l.rad[2]) * 0.55));
  let h = Math.hypot(U1.x - i, U1.y - s, U1.z - o);
  return { cost: h + 6 * Math.max(0, f + r), miss: h, deep: f };
}

function R5(n, e, t, i, s = {}) {
  let o = new W0(i[0], i[1], i[2]).applyMatrix4(new Nu().compose(n.p, n.q, Nh).invert());
  n.side === 'left' && (o.x = -o.x);
  let r = Float32Array.from(s.base || n.pose),
    a = t * 4,
    l = s.skin ?? 8e-4,
    c = [0, 0, 0, 0],
    u = [0, 0, 0, 0],
    f = [0, 0, 0, 0],
    h = [7, 6, 4, 5];
  for (let x = 0; x < 4; x++) ((c[x] = xs.min[a + x]), (u[x] = xs.max[a + x]));
  let p = 1e9,
    d = 0,
    m = 0;
  for (let x = 0; x < 3; x++) {
    let v = [0, 0, 0, 0];
    for (v[0] = 0; v[0] < h[0]; v[0]++)
      for (v[1] = 0; v[1] < h[1]; v[1]++)
        for (v[2] = 0; v[2] < h[2]; v[2]++)
          for (v[3] = 0; v[3] < h[3]; v[3]++) {
            for (let b = 0; b < 4; b++)
              r[a + b] = c[b] + (u[b] - c[b]) * (h[b] > 1 ? v[b] / (h[b] - 1) : 0.5);
            let y = RD(r, t, n.shapes, o.x, o.y, o.z, l, s.root ?? 0.35);
            if (y.cost < p) {
              ((p = y.cost), (d = y.miss), (m = y.deep));
              for (let b = 0; b < 4; b++) f[b] = r[a + b];
            }
          }
    for (let y = 0; y < 4; y++) {
      let b = (u[y] - c[y]) / (h[y] - 1);
      ((c[y] = Math.max(xs.min[a + y], f[y] - b)), (u[y] = Math.min(xs.max[a + y], f[y] + b)));
    }
  }
  for (let x = 0; x < 4; x++) r[a + x] = f[x];
  return { ...n, name: e, pose: r, depth: Kl(r, n.shapes).depth, miss: d, deep: m };
}

function mS(n, e = n.pose, t = [1, 2, 3, 4]) {
  let i = ra(e, tr()),
    s = new Nu().compose(n.p, n.q, Nh),
    o = n.side === 'left' ? -1 : 1,
    r = [],
    a = (l) => new W0(l.x * o, l.y, l.z).applyMatrix4(s).toArray();
  for (let l of t)
    for (let c = 0; c < 3; c++) {
      let u = t0[l],
        f = i.j[l * 4 + c],
        h = i.j[l * 4 + c + 1],
        p = c === 2 ? h.clone().lerp(f, u.rad[3] / u.len[2]) : h;
      r.push(vs(a(f), a(p), (u.rad[c] + u.rad[c + 1]) / 2));
    }
  return r;
}

function gi(n, e, t) {
  let i = n.attributes.position.array,
    s = [1e9, 1e9, 1e9],
    o = [-1e9, -1e9, -1e9],
    r = 0;
  for (let a = 0; a < i.length; a += 3) {
    let l = i[a],
      c = i[a + 1],
      u = i[a + 2];
    l < e[0] ||
      l > t[0] ||
      c < e[1] ||
      c > t[1] ||
      u < e[2] ||
      u > t[2] ||
      (r++,
      l < s[0] && (s[0] = l),
      l > o[0] && (o[0] = l),
      c < s[1] && (s[1] = c),
      c > o[1] && (o[1] = c),
      u < s[2] && (s[2] = u),
      u > o[2] && (o[2] = u));
  }
  return { min: s, max: o, n: r };
}

function Bu(n, e, t, i = 0.01) {
  let s = [];
  for (let o = t[1]; o > e[1] + 1e-9; o -= i) {
    let r = gi(n, [e[0], Math.max(e[1], o - i), e[2]], [t[0], o, t[2]]);
    r.n && s.push({ y: o - i / 2, x0: r.min[0], x1: r.max[0], z0: r.min[2], z1: r.max[2], n: r.n });
  }
  return s;
}

function gS(n) {
  let e = Math.max(...n.map((l) => l.z1 - l.z0)),
    t = n.filter((l) => l.z1 - l.z0 > 0.75 * e),
    i = (l) => {
      let c = 0,
        u = 0,
        f = 0,
        h = 0;
      for (let m of t) ((c += m.y), (u += m[l]), (f += m.y * m.y), (h += m.y * m[l]));
      let p = t.length,
        d = p > 1 ? (p * h - c * u) / (p * f - c * c) : 0;
      return [(u - d * c) / p, d];
    },
    s = i('z0'),
    o = i('z1'),
    r = (l) => s[0] + s[1] * l,
    a = (l) => o[0] + o[1] * l;
  return {
    rake: Math.atan(-(s[1] + o[1]) / 2),
    hw: Math.max(...t.map((l) => Math.max(-l.x0, l.x1))),
    top: Math.max(...n.map((l) => l.y)),
    bottom: Math.min(...n.map((l) => l.y)),
    front: r,
    back: a,
    centre: (l) => (r(l) + a(l)) / 2,
    depth: (l) => a(l) - r(l),
  };
}

var xS = {
    shoulder: { right: [er.right[0], er.right[1], er.right[2]], left: [er.left[0], er.left[1], er.left[2]] },
    lean: 0.2,
  },
  A5 = (n) => ({
    p: new W0(),
    q: new Ur(),
    pose: new Float32Array(Un),
    trig: 0,
    pole: new W0().fromArray(S5[n]),
    sh: new W0().fromArray(xS.shoulder[n]),
  });

function vS(n, e = 1) {
  let t = Fh(n, { side: 'right' }),
    i = Fh(n, { side: 'left' }),
    s = [t, i];
  for (let S of s) (S.setLayer(e), n.camera && n.camera.add(S.group));
  let o = { r: A5('right'), l: A5('left') },
    r = [o.r, o.l];
  (o.r.pose.set(di.relaxed), o.l.pose.set(di.relaxed));
  let a = s.map((S, R) => ({
      last: A5(S.side),
      from: A5(S.side),
      fromL: { p: new W0(), q: new Ur() },
      v: new W0(),
      w: new W0(),
      side: R ? -1 : 1,
    })),
    l = new W0(),
    c = new Ur(),
    u = new W0(),
    f = new Float32Array(Un),
    h = { lean: xS.lean },
    p = new Ur(),
    d = new Ur(),
    m = new W0(),
    x = new W0(),
    v = new W0(),
    y = 1,
    b = 0,
    g = !0,
    E = -1,
    M = null,
    _ = !1,
    T = !1;
  return {
    right: t,
    left: i,
    list: s,
    targets: o,
    state: a,
    get dropping() {
      return E >= 0;
    },
    setVisible(S) {
      if (((g = !!S), E < 0)) for (let R of s) R.group.visible = g;
    },
    blend(S = 0.2) {
      if (_) {
        for (let R of a)
          (R.from.p.copy(R.last.p),
            R.from.q.copy(R.last.q),
            R.from.pose.set(R.last.pose),
            R.from.pole.copy(R.last.pole),
            R.from.sh.copy(R.last.sh));
        ((y = 0), (b = S), (T = !0));
      }
    },
    snap() {
      ((y = 1), (b = 0), (T = !1));
    },
    attach(S, R = null, z = 0) {
      M = S ? { root: S } : null;
      for (let I of s) ((S || n.camera).add(I.group), I.setLayer(S ? z : e));
      (S &&
        (p.setFromEuler(new THREE.Euler(R.r[0], R.r[1], R.r[2], 'YXZ')),
        d.copy(p).invert(),
        m.fromArray(R.p),
        (M.qi = d.clone()),
        (M.p = m.clone())),
        (y = 1));
    },
    update(S, R, z) {
      if (E >= 0 || !R || !R.armTargets) return;
      R.armTargets(o, S);
      let I = y < 1 && b > 0 ? cS((y += S / b)) : 1;
      if ((I >= 1 && (y = 1), T)) {
        ((T = !1), d.copy(z.quaternion).invert());
        for (let L of a)
          (L.fromL.p.copy(L.from.p).sub(z.position).applyQuaternion(d), L.fromL.q.copy(d).multiply(L.from.q));
      }
      if (I < 1)
        for (let L of a)
          (L.from.p.copy(L.fromL.p).applyQuaternion(z.quaternion).add(z.position),
            L.from.q.copy(z.quaternion).multiply(L.fromL.q));
      for (let L = 0; L < 2; L++) {
        let U = r[L],
          k = a[L],
          C = s[L],
          A = U.pose;
        (M
          ? (l.copy(U.p),
            c.copy(U.q),
            u.copy(U.pole).applyQuaternion(M.qi),
            x.copy(U.sh).sub(M.p).applyQuaternion(M.qi))
          : (l.copy(U.p).applyQuaternion(z.quaternion).add(z.position),
            c.copy(z.quaternion).multiply(U.q),
            u.copy(U.pole),
            x.copy(U.sh)),
          I < 1 &&
            (l.lerpVectors(k.from.p, l, I),
            c.slerpQuaternions(k.from.q, c, I),
            u.lerpVectors(k.from.pole, u, I),
            x.lerpVectors(k.from.sh, x, I),
            (A = tn(f, k.from.pose, U.pose, I))),
          k.last.p.copy(l),
          k.last.q.copy(c),
          k.last.pose.set(A),
          k.last.pole.copy(u),
          k.last.sh.copy(x),
          C.setFingers(A),
          C.setTrigger(U.trig),
          C.solve(x, l, c, u, h),
          C.update(S));
      }
      _ = !0;
    },
    startDrop(S = Math.random) {
      if (_) {
        ((E = 0), (y = 1));
        for (let R of a)
          (R.from.p.copy(R.last.p),
            R.from.q.copy(R.last.q),
            R.from.pose.set(R.last.pose),
            R.v.set(R.side * (0.1 + S() * 0.08), -0.05, 0.1),
            R.w.set(-1.5 - S() * 0.5, R.side * 0.5, R.side * (0.7 + S() * 0.4)));
      }
    },
    dropUpdate(S) {
      if (E < 0) return;
      E += S;
      let R = cS(E / 0.15);
      for (let z = 0; z < 2; z++) {
        let I = a[z],
          L = s[z];
        if (!L.group.visible) continue;
        ((I.v.y -= 2.2 * S), I.from.p.addScaledVector(I.v, S));
        let U = I.w.length() * S;
        (U > 0 && (c.setFromAxisAngle(v.copy(I.w).normalize(), U), I.from.q.multiply(c)),
          L.setFingers(tn(f, I.from.pose, di.relaxed, R)),
          L.setTrigger(0),
          L.solve(I.last.sh, I.from.p, I.from.q, I.last.pole, h),
          L.update(S),
          I.last.p.copy(I.from.p),
          I.last.q.copy(I.from.q),
          (E > 0.9 || I.from.p.y < -0.6) && (L.group.visible = !1));
      }
    },
    restore() {
      if (!(E < 0)) {
        ((E = -1), (y = 1), (_ = !1));
        for (let S of s) S.group.visible = g;
      }
    },
    report() {
      return s.map((S) => ({
        side: S.side,
        reach: S.ik.reach,
        violation: S.ik.violation,
        lean: S.ik.lean,
        flex: S.ik.wristFlex,
        deviation: S.ik.wristDeviation,
        twist: S.ik.twist,
      }));
    },
    dispose() {
      for (let S of s) S.dispose();
    },
  };
}

var Pn = THREE.Vector3,
  Fo = THREE.Quaternion,
  C5 = 0.076,
  yS = 0,
  bS = (n, e) => ({ p: n.p.map((t, i) => t - e.p[i]), r: n.r.map((t, i) => t - e.r[i]) }),
  Ly = (n, e, t, i, s, o, r) => ({
    name: n,
    HIP: e,
    ADS: { p: [0, -wn.sightY, t], r: [0, 0, 0] },
    SPRINT: bS(i, e),
    SPRINT_ARC: s,
    RELOAD: bS(o, e),
    RACK: r,
  }),
  Fy = { p: [0, 0, 0], r: [-0.16, 0, 0.62] },
  Ny = [0.494, 0.305, -0.83],
  Uy = [
    Ly(
      'close',
      { p: [0.1, -0.109, -0.219], r: [-0.045, 0.035, 0.09] },
      -0.1065,
      { p: [0.07, -0.205, -0.27], r: [0.25, 0.8, 0.32] },
      { p: [-0.01, -0.022, 0.02], r: [-0.06, 0.02, 0.07] },
      { p: [0.088, -0.022, -0.295], r: Ny },
      Fy,
    ),
    Ly(
      'threequarter',
      { p: [0.143, -0.173, -0.397], r: [0.065, 0.14, 0.04] },
      -0.1115,
      { p: [0.07, -0.16, -0.3], r: [-0.2, 0.85, 0.35] },
      { p: [-0.008, -0.02, 0.03], r: [0.05, 0.02, 0.06] },
      { p: [0.09, -0.035, -0.34], r: Ny },
      Fy,
    ),
    Ly(
      'compact',
      { p: [0.165, -0.172, -0.345], r: [0.045, 0.075, 0.03] },
      -0.1115,
      { p: [0.13, -0.185, -0.3], r: [-0.28, 0.55, 0.15] },
      { p: [-0.006, -0.016, 0.02], r: [0.04, 0.02, 0.05] },
      { p: [0.1, -0.04, -0.31], r: Ny },
      Fy,
    ),
  ],
  B1 = (n, e, t) => (n < e || n >= t ? 0 : Ot((n - e) / (t - e))),
  Uh = (n) => new Fo().setFromAxisAngle(new Pn(1, 0, 0), n),
  By = (n) => new Fo().setFromAxisAngle(new Pn(0, 1, 0), n),
  CD = [1, 0, 0, 1],
  kD = [1.6, 1.1, 0.8, 1],
  PD = d0({ thumb: [1.35, 0.7, 0.6, 0.3], fingers: [1.6, 1.1, 0.7, 0] }),
  MS = 0.0275,
  sc = {
    grip: { web: [-0.0335, -0.012, -0.045], tilt: 0.22, roll: -0.3, drop: 0.012, lift: 0.0025 },
    foreYaw: -0.8,
    foreTip: 0.08,
    foreDrop: 0.008,
    pinchAt: 0.15,
    pinchYaw: 0,
    cupYaw: 0,
    handle: { fingers: [0.85, 0.4, -0.34], back: [-0.36, 0.1, -1] },
    shR: [0.2, -0.18, 0.4],
    shL: [-0.17, -0.24, 0.05],
    poleR: [0.3, -0.95, 0],
    poleL: [-0.5, -0.85, 0],
    sprintShR: [0.19, -0.24, 0.1],
    sprintPoleR: [0.9, -0.4, 0],
  };

function ID(n) {
  let e = wn.grip,
    t = wn.handguard,
    i = wn.handguardR,
    s = wn.magPos,
    o = wn.handlePos,
    r = {},
    a = gi(n.poly, [-0.02, e[1] - 0.065, e[2] - 0.045], [0.02, e[1] + 0.058, e[2] + 0.05]),
    l = gS(Bu(n.poly, [-0.02, e[1] - 0.06, e[2] - 0.045], [0.02, e[1] + 0.03, e[2] + 0.05])),
    c = l.rake,
    u = a.max[1],
    f = l.bottom - 0.005,
    h = (u + f) / 2,
    p = (u - f) / 2 / Math.cos(c),
    d = (l.depth(h) / 2) * Math.cos(c);
  r.gripDim = { rake: c, hw: l.hw, hl: p, hd: d + 8e-4, c: [0, h, l.centre(h) - 8e-4] };
  let m = mn(r.gripDim.c, [l.hw, p, r.gripDim.hd], Uh(-c), l.hw * 0.9),
    x = gi(n.ano, [-0.03, e[1] + 0.045, e[2] - 0.17], [0.03, e[1] + 0.125, e[2] + 0.028]),
    v = -gi(n.ano, [-0.03, -0.018, e[2] - 0.12], [0, -0.008, e[2] - 0.02]).min[0],
    y = mn(
      [0, (x.min[1] + x.max[1]) / 2, (x.min[2] + x.max[2]) / 2],
      [v, (x.max[1] - x.min[1]) / 2, (x.max[2] - x.min[2]) / 2],
      null,
      0.003,
    ),
    b = mn([0, s[1] - 0.0345, s[2]], [v + 0.001, 0.0345, 0.0355], null, 0.003),
    g = mn([0, 0.002, x.max[2] + 0.09], [0.014, 0.016, 0.09], null, 0.01),
    E = gi(n.ano, [-0.009, e[1] - 0.004, e[2] - 0.115], [0.009, e[1] + 0.006, e[2] - 0.03]);
  r.tang = new Pn(0, E.min[1] + MS, l.back(E.min[1] + MS));
  let M = mn(
      [0, (E.min[1] + E.max[1]) / 2, (E.min[2] + E.max[2]) / 2],
      [(E.max[0] - E.min[0]) / 2, (E.max[1] - E.min[1]) / 2, (E.max[2] - E.min[2]) / 2],
      null,
      0.0018,
    ),
    _ = Bu(n.gun, [-0.0034, e[1] + 0.012, e[2] - 0.092], [0.0034, e[1] + 0.068, e[2] - 0.058], 0.006),
    T = _[Math.floor(_.length / 2)];
  r.triggerAt = [0, T.y, T.z0];
  let w = vs([-0.0031, T.y + 0.006, T.z0 + 0.0028], [0.0031, T.y - 0.01, T.z0 + 0.0028 - 0.003], 0.003);
  ((r.grip = [m, y, b, g, M]), (r.trigger = [w]));
  let S = Bu(n.wood || n.poly, [-0.03, -i - 0.085, t[2] - 0.03], [0.03, -i + 0.006, t[2] + 0.03]),
    R = S.slice(1),
    z = Math.min(...R.map((te) => te.z0)),
    I = Math.max(...R.map((te) => te.z1)),
    L = Math.max(...R.map((te) => te.x1)),
    U = gi(n.wood || n.poly, [-0.03, -i - 0.085, t[2] - 0.03], [0.03, -i + 0.006, t[2] + 0.03]);
  ((r.foreTop = new Pn(0, U.max[1], (z + I) / 2)),
    (r.foreDim = { hw: L, hd: (I - z) / 2, len: U.max[1] - U.min[1] }),
    (r.fore = [
      mn(
        [0, (U.max[1] + U.min[1]) / 2, (z + I) / 2],
        [L, (U.max[1] - U.min[1]) / 2, (I - z) / 2],
        null,
        0.01,
      ),
      mn([t[0], t[1], t[2]], [i, i, 0.146], null, 0.008),
    ]));
  let k = Bu(n.mag, [-1, -1, -1], [1, 0, 1], 0.02),
    C = (te) => (te.z0 + te.z1) / 2,
    A = [];
  for (let te = 0; te < k.length - 1; te++) {
    let oe = k[te],
      ee = k[Math.min(k.length - 2, te + 1)],
      le = k[Math.max(0, te - 1)],
      xe = Math.atan2(C(le) - C(ee), le.y - ee.y || 1);
    A.push(
      mn(
        [0, oe.y, C(oe)],
        [Math.max(-oe.x0, oe.x1), 0.0125, ((oe.z1 - oe.z0) / 2) * Math.cos(xe)],
        Uh(xe),
        0.003,
      ),
    );
  }
  let F = gi(n.mag, [-1, -1, -1], [1, 1, 1]),
    H = gi(n.mag, [-1, F.min[1], -1], [1, F.min[1] + 0.012, 1]),
    N = k[k.length - 2],
    Z = k[k.length - 3],
    Q = Math.atan2(C(Z) - C(N), Z.y - N.y) * 1.25;
  ((r.magAxis = (te) => {
    let oe = 0;
    for (; oe < k.length - 2 && -k[oe + 1].y < te;) oe++;
    let ee = k[oe],
      le = k[oe + 1],
      xe = Math.min(1, Math.max(0, (-te - ee.y) / (le.y - ee.y)));
    return {
      z: C(ee) + (C(le) - C(ee)) * xe,
      tilt: Math.atan2(C(ee) - C(le), ee.y - le.y),
      hw: Math.max(-ee.x0, ee.x1),
      hd: (ee.z1 - ee.z0) / 2,
    };
  }),
    (r.magTilt = Q),
    (r.magLen = -F.min[1]));
  let W = k[k.length - 1],
    J = C(N) + (C(N) - C(Z)) * 0.9;
  ((r.plate = new Pn(0, (H.min[1] + W.y + 0.01) / 2 - 0.004, J)),
    A.push(
      mn(
        [0, r.plate.y + 0.0045 * Math.cos(Q), r.plate.z + 0.0045 * Math.sin(Q)],
        [F.max[0], 0.0045, 0.034],
        Uh(Q),
        0.003,
      ),
    ),
    (r.mag = A));
  let G = gi(n.bolt, [-1, -1, -1], [-v - 0.0015, 1, 1]);
  return (
    (r.knob = vs([G.min[0] + 0.003, o[1], o[2]], [G.max[0], o[1], o[2]], (G.max[1] - G.min[1]) / 2)),
    (r.knobTip = G.min[0]),
    (r.handle = [r.knob, y, mn([0, wn.railTop - 0.004, o[2]], [0.011, 0.006, 0.1], null, 0.002)]),
    r
  );
}

var Hy = null,
  _S = '';

function zD(n) {
  let e = JSON.stringify(sc);
  if (Hy && e === _S) return Hy;
  let t = ID(n),
    i = sc,
    s = { shapes: t },
    o = new Fo();
  ((Hy = s), (_S = e));
  let r = tc({
      ...i.grip,
      rake: t.gripDim.rake,
      len: (t.tang.y - (t.gripDim.c[1] - t.gripDim.hl * Math.cos(t.gripDim.rake))) / Math.cos(t.gripDim.rake),
      width: 2 * t.gripDim.hw,
      depth: 2 * t.gripDim.hd,
      round: 0.009,
      top: [0.012, 0.2, 0.005, 0.04],
      topW: 0.034,
      guard: [0.036, 0.1, -0.024],
      trigger: [0.084, -0.01],
    }),
    a = il('right', r.frame, t.tang, o);
  (a.p.add(new Pn(0, i.grip.lift, 0).applyQuaternion(a.q)),
    (s.grip = ca('grip', 'right', a.p, a.q, t.grip, {
      from: d0({ thumb: CD }, nn.rifle_grip.fit.from),
      to: d0({ thumb: kD }, nn.rifle_grip.fit.to),
    })),
    (s.trigger = Uu(
      s.grip,
      'trigger',
      1,
      [t.triggerAt[0] + 0.002, t.triggerAt[1], t.triggerAt[2] - 0.0015],
      s.grip.pose,
      { start: [0.2, 1, 0.6, 0.1], at: 0.7 },
    )));
  let l = il(
    'left',
    'foregrip',
    t.foreTop.clone().add(new Pn(0, -i.foreDrop, 0)),
    By(i.foreYaw).multiply(Uh(i.foreTip)),
  );
  s.fore = ca('fore', 'left', l.p, l.q, t.fore, nn.foregrip.fit);
  let c = t.magAxis(i.pinchAt),
    u = il('left', 'mag_pinch', new Pn(0, -i.pinchAt, c.z), Uh(c.tilt).multiply(By(i.pinchYaw)));
  s.pinch = ca('pinch', 'left', u.p, u.q, t.mag, nn.mag_pinch.fit);
  let f = il('left', 'mag_cup', t.plate, Uh(t.magTilt).multiply(By(i.cupYaw)));
  (f.p.add(new Pn(0, 0.003, 0).applyQuaternion(f.q)),
    (s.carry = ca('carry', 'left', f.p, f.q, t.mag, { from: nn.mag_cup.fit.from, to: PD })),
    (s.cup = {
      ...s.carry,
      name: 'cup',
      pose: tn(new Float32Array(Un), nn.mag_cup.fit.from, s.carry.pose, 0.72),
    }));
  let h = fS(i.handle.fingers, i.handle.back),
    p = d0({
      thumb: [0.9, 0.2, 0.3, 0.6],
      index: [0.45, 0.55, 0.33, 0],
      middle: [0.45, 0.55, 0.33, 0],
      ring: [1.2, 1.45, 0.9, 0],
      little: [1.25, 1.45, 0.85, -0.04],
    }),
    d = ra(p, tr()),
    m = d.j[6].clone().lerp(d.j[7], 0.5).lerp(d.j[10].clone().lerp(d.j[11], 0.5), 0.5);
  m.y -= 0.009;
  let x = t.knobTip + 0.0035,
    v = t.knob.a[2] - t.knob.r - 5e-4,
    y = hS('left', h, [x, t.knob.a[1], v], m.toArray()),
    b = {
      name: 'handle',
      side: 'left',
      p: y,
      q: h,
      pose: p,
      shapes: ca('handle', 'left', y, h, t.handle, { from: p, to: p }).shapes,
    };
  return (
    (s.handle = Uu(
      Uu(b, 'handle', 1, [x, t.knob.a[1] + 0.0075, v], null, { at: 0.8 }),
      'handle',
      2,
      [x, t.knob.a[1] - 0.0075, v],
      null,
      { at: 0.8 },
    )),
    s
  );
}

function wS(n) {
  let { G: e, mats: t, mk: i, S: s, rng: o } = n,
    r = new THREE.Group();
  r.name = 'viewmodel-ak47';
  let a = TE();
  r.add(
    i(a.ano, t.ano),
    i(a.gun, t.steel),
    i(a.wood, t.wood),
    i(a.poly, t.bakelite),
    i(a.plain, t.plain),
  );
  let l = i(a.bolt, t.steel);
  r.add(l);
  let c = new THREE.Group(),
    u = new Pn().fromArray(wn.magPos);
  c.position.copy(u);
  let f = i(a.round, t.brass);
  (c.add(i(a.mag, t.steel), f), r.add(c));
  let h = null;
  if (wn.window) {
    let p = ME(
      wn.window.map((B) => [B[0] * 1.01, (B[1] - wn.sightY) * 1.01 + wn.sightY]),
      wn.lensF + 0.0025,
    );
    ((p.frustumCulled = !1), r.add(p));
  }
  let d = l5();
  (d.position.fromArray(wn.muzzle), (d.visible = !1), r.add(d));
  let m = zD(a),
    x = n.arms || null,
    v = new THREE.Matrix4(),
    y = new Pn(1, 1, 1),
    b = new Fo(),
    g = (B, X, re, Y, he) => {
      (he.copy(re).multiply(B.q), Y.copy(B.p).applyQuaternion(re).add(X));
    },
    E = { p: m.fore.p, q: m.fore.q },
    M = { p: new Pn(), q: new Fo() };
  g(m.pinch, u, b, M.p, M.q);
  let _ = { p: M.p.clone().add(new Pn(-0.045, -0.035, 0.015)), q: M.q.clone() },
    T = { p: M.p.clone().add(new Pn(0, -(C5 + 0.006), 0)), q: M.q.clone() },
    w = Au(-0.5, 0, 0.25),
    S = { p: M.p.clone().add(new Pn(-0.06, -0.36, 0.13)), q: w.clone().multiply(M.q) },
    R = { p: new Pn(-0.05, -0.38, 0.14), q: w.clone() },
    z = { p: new Pn(-0.005, -(C5 + 0.014), 0.006), q: Au(-0.11, 0, 0.07) },
    I = { p: new Pn(0, -C5, 0), q: new Fo() },
    L = [
      [ft.rise, R],
      [ft.align, z],
      [ft.insert, I],
      [9, I],
    ],
    U = { p: new Pn(), q: new Fo() };
  g(m.carry, u.clone().add(R.p), R.q, U.p, U.q);
  let k = { p: new Pn(), q: new Fo() };
  g(m.carry, u, b, k.p, k.q);
  let C = { p: m.handle.p, q: m.handle.q },
    A = { p: new Pn(), q: new Fo() },
    F = { partial: !0 },
    H = [
      [0, E],
      [0.07, E],
      [0.27, _],
      [ft.atMag, M],
      [9, M],
    ],
    N = {
      tac: [
        [ft.tacRelease + 0.03, A],
        [ft.tac - 0.04, E],
        [9, E],
      ],
      empty: [
        [ft.release + 0.03, A],
        [ft.empty - 0.1, E],
        [9, E],
      ],
    },
    Z = tn(new Float32Array(Un), di.relaxed, di.open, 0.25),
    Q = tn(new Float32Array(Un), nn.mag_pinch.fit.from, m.pinch.pose, 0.25),
    W = new Pn(),
    J = new Fo(),
    G = new Fo(),
    te = new Pn(),
    oe = new Pn(),
    ee = new Fo(),
    le = new THREE.Matrix4().compose(m.pinch.p, m.pinch.q, y).invert(),
    xe = new THREE.Matrix4().compose(m.carry.p, m.carry.q, y).invert(),
    j = new Pn(),
    O = { p: new Pn().copy(E.p), q: new Fo().copy(E.q), pose: new Float32Array(Un), busy: !1 },
    q = (B, X, re, Y, he) => (he < 0.5 ? tn(B, X, re, Ot(he * 2)) : tn(B, re, Y, Ot(he * 2 - 1))),
    ue = (B) => {
      (v.compose(W, J, y).multiply(B), v.decompose(c.position, c.quaternion, j));
    },
    de = 9,
    $ = !1,
    se = 0,
    fe = 1,
    me = 0;
  function ge() {
    ((O.busy = !1),
      O.p.copy(E.p),
      O.q.copy(E.q),
      O.pose.set(m.fore.pose),
      (c.visible = !0),
      c.position.copy(u),
      c.quaternion.identity(),
      (se = 0));
  }
  ge();
  let ce = Object.values(a).reduce((B, X) => B + Tu(X), 0) + (h ? Tu(h.geometry) : 0) + 2,
    P = 0;
  r.traverse((B) => {
    B.isMesh && P++;
  });
  let D = {
    id: 'rifle',
    name: wn.name,
    root: r,
    flash: d,
    muzzle: wn.muzzle,
    eject: wn.eject,
    sight: [0, wn.sightY, -wn.lensF],
    info: { tris: Math.round(ce), meshes: P },
    slot: { id: 'rifle', name: wn.name, ammo: AK47_DEF.magSize, magSize: AK47_DEF.magSize, reserve: AK47_DEF.reserve },
    def: AK47_DEF,
    views: Uy,
    view: 0,
    get pose() {
      return Uy[D.view];
    },
    setView(B) {
      D.view = Math.max(0, Math.min(Uy.length - 1, B | 0));
    },
    motion: bh.rifle,
    reloadTime: (B) => (B ? ft.empty : ft.tac),
    reset() {
      ((de = 9), ($ = !1), (f.visible = !0), ge(), (l.position.z = 0), (fe = 1), (me = 0));
    },
    cancelReload(B) {
      (ge(), B && ($ = !1), (f.visible = D.slot.ammo > 0));
    },
    shot(B) {
      ((de = 0), x && (x.right.impulse(0.55), x.left.impulse(0.35)), B && (($ = !0), (f.visible = !1)));
    },
    recoil(B, X, re) {
      let Y = B <= 9 ? 1 : 0.38,
        he =
          (B < 4 ? (o() - 0.5) * 0.0022 : Math.sin(B * 0.57 + s.recPhase) * 0.0042 + (o() - 0.5) * 0.002) * X;
      (re.addRecoil && re.addRecoil(0.0068 * Y * X * (0.85 + o() * 0.3), he),
        re.addShake && re.addShake(0.12 * X));
      let V = bh.rifle.recoil,
        ne = s.adsE,
        Te =
          (B === 1 ? V.first : B === 2 ? 0.5 + 0.5 * V.first : 1) *
          (0.88 + o() * 0.24) *
          (re.crouching ? 0.88 : 1),
        Re = Te * u0(1, V.adsRot, ne),
        Ue = Te * u0(1, V.adsPos, ne);
      ((s.kZ.v += V.back * Te * u0(1, V.adsBack, ne)),
        (s.kP.v += V.rise * Re),
        (s.kY.v += (o() - 0.5) * V.yaw * Re),
        (s.kR.v += (o() - 0.5) * V.roll * Re),
        (s.kU.v += V.up * Ue * (0.7 + 0.6 * o())),
        (s.kX.v += (o() - 0.5) * 2 * V.side * Ue));
    },
    reload(B, X) {
      let re = n.ev,
        Y = B.empty;
      (re(B, 'magout', ft.magout) && (s.bump.v -= 0.25),
        X >= ft.swap && !B.f.fresh && ((B.f.fresh = 1), (f.visible = !0)),
        re(B, 'maginsert', ft.insert) && ((s.bump.v += 0.1), (s.kR.v += 0.4)),
        re(B, 'magin', ft.magin) &&
          ((s.bump.v += 0.8), (s.kR.v -= 0.55), Y || ($ = !1), x && x.left.impulse(1)),
        X >= ft.regrip + 0.025 && !B.f.tug && ((B.f.tug = 1), (s.bump.v -= 0.3)));
      let he = Y ? ft.back : ft.tacBack,
        V = Y ? ft.release : ft.tacRelease,
        ne = Y ? ft.bolt : ft.tacBolt,
        ye = Y ? 1 : ft.partial,
        Te = Y ? yS : 0;
      ((se =
        X < ft.atHandle
          ? Te
          : X < he
            ? Te + (ye - Te) * Ot(dn(X, ft.atHandle, he))
            : X < V
              ? ye
              : ye * Math.max(0, 1 - (X - V) / (ne - V))),
        re(B, 'boltback', he, Y ? null : F) &&
          (($ = !1), (s.kZ.v += Y ? 0.55 : 0.3), (s.bump.v -= Y ? 0.12 : 0.06)),
        re(B, 'bolt', ne) &&
          (($ = !1),
          (s.kZ.v -= Y ? 0.85 : 0.45),
          (s.kP.v -= Y ? 0.9 : 0.4),
          (s.bump.v -= Y ? 0.14 : 0.05),
          (se = 0)),
        (s.antYT =
          0.0045 * B1(X, ft.magout - 0.14, ft.magout) -
          0.002 * B1(X, ft.insert - 0.1, ft.insert) -
          0.006 * B1(X, ft.short, ft.magin)),
        (s.antRT = 0.022 * B1(X, ft.magout - 0.14, ft.magout) + 0.05 * B1(X, ft.atHandle - 0.04, V)));
      let Re = O.pose;
      if (((O.busy = !0), X < ft.magout))
        (Ru(H, X, W, J),
          q(Re, m.fore.pose, Z, Q, dn(X, 0.03, 0.3)),
          X > 0.3 && tn(Re, Q, m.pinch.pose, Ot(dn(X, 0.3, ft.atMag + 0.02))),
          c.quaternion.identity(),
          c.position.copy(u));
      else if (X < ft.away) {
        let ze = yh(dn(X, ft.magout, ft.clear)),
          Ge = Ot(dn(X, ft.clear - 0.03, ft.away));
        (W.copy(M.p).lerp(T.p, ze).lerp(S.p, Ge), J.copy(M.q).slerp(S.q, Ge), Re.set(m.pinch.pose), ue(le));
      } else if (X < ft.rise) {
        let ze = Ot(dn(X, ft.away, ft.rise));
        (W.copy(S.p).lerp(U.p, ze),
          J.copy(S.q).slerp(U.q, ze),
          tn(Re, m.pinch.pose, m.carry.pose, ze),
          ue(X < ft.swap ? le : xe));
      } else {
        let ze = 0,
          Ge = 0,
          _e = 0;
        if (X < ft.insert) Ru(L, X, oe, ee);
        else {
          if ((oe.set(0, 0, 0), ee.identity(), X < ft.short))
            ze = ft.shortBy + (C5 - ft.shortBy) * Math.pow(1 - dn(X, ft.insert, ft.short), 2.2);
          else if (X < ft.windup)
            ((ze = ft.shortBy), (_e = Ot(dn(X, ft.short, ft.windup))), (Ge = ft.backOff * _e));
          else if (X < ft.magin) {
            let Ne = dn(X, ft.windup, ft.magin),
              ke = (ft.shortBy + ft.backOff) * (1 - Ne * Ne);
            ((ze = Math.min(ft.shortBy, ke)), (Ge = ke - ze), (_e = 1));
          } else
            X < ft.rebound
              ? ((Ge = ft.reboundBy * yh(dn(X, ft.magin, ft.rebound))), (_e = 1))
              : X < ft.regrip
                ? ((Ge = ft.reboundBy * (1 - Ot(dn(X, ft.rebound, ft.regrip)))),
                  (_e = 1 - Ot(dn(X, ft.rebound, ft.regrip))))
                : X < ft.tugDown
                  ? (Ge = ft.tugBy * Ot(dn(X, ft.regrip, ft.tugDown)))
                  : X < ft.tugUp && (Ge = ft.tugBy * (1 - Ot(dn(X, ft.tugDown, ft.tugUp))));
          oe.y = -ze;
        }
        if ((c.quaternion.copy(ee), c.position.copy(u).add(oe), X < ft.tugUp))
          (g(m.carry, c.position, ee, W, J), (W.y -= Ge), tn(Re, m.carry.pose, m.cup.pose, _e));
        else if (X < ft.atHandle) {
          let Ne = dn(X, ft.tugUp, ft.atHandle),
            ke = Ot(Ne);
          (te.copy(C.p),
            (te.z += wn.boltTravel * Te),
            W.copy(k.p).lerp(te, ke),
            (W.x -= 0.03 * Math.sin(Math.PI * ke)),
            J.copy(k.q).slerp(C.q, ke),
            q(Re, m.carry.pose, Z, m.handle.pose, Ne));
        } else if (X < V + 0.03)
          (W.copy(C.p),
            (W.z += wn.boltTravel * (X < V ? se : ye)),
            J.copy(C.q),
            A.p.copy(W),
            A.q.copy(J),
            tn(Re, m.handle.pose, Z, 0.5 * Ot(dn(X, V, V + 0.03))));
        else {
          let Ne = Y ? N.empty : N.tac;
          Ru(Ne, X, W, J);
          let ke = dn(X, Ne[0][0], Ne[1][0]);
          ((W.y -= 0.035 * Math.sin(Math.PI * Ot(ke))),
            ke < 0.6
              ? tn(Re, m.handle.pose, Z, 0.5 + 0.5 * Ot(ke / 0.6))
              : tn(Re, Z, m.fore.pose, Ot((ke - 0.6) / 0.4)));
        }
      }
      (O.p.copy(W), O.q.copy(J));
      let Ue = Ot(X / 0.3),
        Ve = 1 - Ot((X - (B.T - 0.46)) / 0.4);
      ((s.reloadW = Math.min(Ue, Ve)), (s.rackW = Ot((X - (ft.magin + 0.08)) / 0.28) * Ve));
    },
    endReload() {
      ge();
    },
    parts(B, X) {
      de += B;
      let re = 0.072,
        Y = de < re ? Math.sin((Math.PI * de) / re) : 0;
      ($ && de > re * 0.5 && (Y = Math.max(Y, yS / 0.95)),
        (l.position.z = wn.boltTravel * Math.max(Y * 0.95, se)),
        (me = X));
    },
    armTargets(B, X) {
      let re = s.spV.x > 0.3 || s.reload || s.hol > 0.12 ? 0 : 1;
      ((fe += (re - fe) * (1 - Math.exp(-16 * X))),
        B.r.p.copy(m.grip.p),
        B.r.q.copy(m.grip.q),
        tn(B.r.pose, m.grip.pose, m.trigger.pose, Ot(fe)),
        (B.r.trig = me * fe));
      let Y = Math.min(1, Math.max(0, s.spV.x));
      (B.r.pole.fromArray(sc.poleR).lerp(te.fromArray(sc.sprintPoleR), Y),
        B.r.sh.fromArray(sc.shR).lerp(te.fromArray(sc.sprintShR), Y),
        B.l.p.copy(O.p),
        B.l.q.copy(O.q),
        B.l.pose.set(O.busy ? O.pose : m.fore.pose),
        (B.l.trig = 0),
        B.l.pole.fromArray(sc.poleL),
        B.l.sh.fromArray(sc.shL));
    },
    snapArms() {
      fe = s.spV.x > 0.3 || s.reload || s.hol > 0.12 ? 0 : 1;
    },
    setLocked(B) {
      (($ = !!B), (f.visible = !B));
    },
    get locked() {
      return $;
    },
    holds: m,
  };
  return D;
}

var Hu = 0.0128,
  sl = -0.012,
  Ki = 0.011,
  No = DEAGLE_CONFIG.sightY,
  ES = 0.0074,
  Oy = 0.0046,
  Vy = DEAGLE_RAKE,
  SS = [-0.309, -0.951],
  RS = DEAGLE_MAG_LEN,
  G0 = DEAGLE_CONFIG,
  TS = (n, e, t, i, s = 12) => {
    let o = new THREE.CircleGeometry(n, s);
    return (o.translate(e, t, i), o);
  };

function AS(n = 0, e = Hu) {
  let t = [
    [e - 8e-4, sl],
    [e, sl + 8e-4],
    [e, sl + 0.0022],
    [e - 55e-5, sl + 0.0027],
    [e - 55e-5, sl + 0.0041],
    [e, sl + 0.0046],
    [e - n, sl + 0.0056],
    [e - n, Oy - 0.001],
    [e, Oy],
    [ES + 7e-4, Ki - 8e-4],
    [ES, Ki],
  ];
  return t.concat(t.map((i) => [-i[0], i[1]]).reverse());
}

function CS() {
  return buildDesertEagleGeometry({ Mt, Q0, Nn, h0, m0, Eu, Su, $a, kn, b0, Fs, sy, Zl });
}

function _CS_UNUSED() {
  let n = [1, 1, 1],
    e = [1, 1, 1],
    t = [2.6, 2.6, 2.7],
    i = [0.3, 0.3, 0.31],
    s = [1, 1, 1],
    o = [0.014, 0.014, 0.015],
    r = { wear: 1 },
    a = { wear: 0.9 },
    l = { bare: 0.45, wear: 1.2 },
    c = { wear: 0.8 },
    u = { wear: 0, ao: 0.75 },
    f = { wear: 0 },
    h = [],
    p = [],
    d = [],
    m = [],
    x = [],
    v = [],
    y = [],
    b = [],
    g = [],
    E = (H, N, Z, Q, W, J, G, te) => {
      let oe = Math.min(H * 0.25, (Z - N) * 0.25);
      return h0(
        [
          [0, N],
          [H - oe, N],
          [H, N + oe],
          [H, Z - oe],
          [H - oe, Z],
          [0, Z],
        ],
        G,
        J,
        { ...te, ox: Q, oy: W },
      );
    },
    M = 0.245,
    _ = 65e-5,
    T = AS(0),
    w = AS(_),
    S = (H, N) => (Math.abs(H) < Hu - 3e-4 && N > sl + 0.005 && N < Oy - 5e-4 ? 0.8 : 0),
    R = (H, N, Z, Q = 0.0032, W = 0.0015) => {
      for (let J = 0; J < Z; J++) {
        let G = N + J * Q;
        H.push(
          kn(T, G - W / 2 - 35e-5, { rake: -M }),
          kn(w, G - W / 2, { rake: -M }),
          kn(w, G + W / 2, { rake: -M }),
          kn(T, G + W / 2 + 35e-5, { rake: -M }),
        );
      }
    };
  {
    let H = [kn(T, -0.082, { sx: 0.945, sy: 0.94, cy: -5e-4 }), kn(T, -0.0811)];
    (R(H, -0.0735, 10),
      H.push(kn(T, -0.038), kn(T, -0.0118)),
      h.push(Eu(H, n, { ...r, crease: 38, aoFn: S })));
  }
  {
    let H = T.slice(0, 6),
      N = T.slice(11),
      Z = [
        ...H,
        [Hu, -0.0011],
        [Hu - 6e-4, -5e-4],
        [-0.0042, -5e-4],
        [-0.0042, Ki - 6e-4],
        [-0.0048, Ki],
        ...N.filter((Q) => Q[0] < -0.005),
      ];
    h.push(Nn(Z, -0.012, 0.03, 4e-4, n, { wear: 1, zone: 0.5, crease: 38 }));
  }
  {
    let H = [kn(T, 0.0298), kn(T, 0.056)];
    (R(H, 0.064, 6),
      H.push(
        kn(T, 0.088),
        kn(T, 0.0975),
        kn(T, 0.1018, { sx: 0.965, sy: 0.97, cy: 0.002 }),
        kn(T, 0.104, { sx: 0.9, sy: 0.92, cy: 0.002 }),
      ),
      h.push(Eu(H, n, { ...r, crease: 38, aoFn: S })));
  }
  for (let H = 0; H < 5; H++) {
    let N = (H - 2) * 0.0026;
    (h.push(Mt(9e-4, 5e-4, 0.044, 2e-4, N, Ki + 1e-4, -0.04, n, { wear: 0.45 })),
      h.push(Mt(9e-4, 5e-4, 0.05, 2e-4, N, Ki + 1e-4, 0.059, n, { wear: 0.45 })));
  }
  let z = [0.8, 0.8, 0.83];
  (h.push(
    Nn(
      b0(
        [
          [-0.0092, Ki - 4e-4],
          [0.0092, Ki - 4e-4],
          [0.0092, No - 0.0016],
          [0.0078, No],
          [0.0019, No],
          [0.0019, No - 0.003],
          [-0.0019, No - 0.003],
          [-0.0019, No],
          [-0.0078, No],
          [-0.0092, No - 0.0016],
        ],
        [0, 0, 6e-4, 6e-4, 0, 0, 0, 0, 6e-4, 6e-4],
        1,
      ),
      -0.0755,
      -0.0655,
      4e-4,
      z,
      r,
    ),
  ),
    h.push(
      Nn(
        [
          [-0.0074, Ki - 2e-4],
          [0.0074, Ki - 2e-4],
          [0.0066, Ki + 0.0011],
          [-0.0066, Ki + 0.0011],
        ],
        -0.078,
        -0.063,
        3e-4,
        z,
        r,
      ),
    ),
    h.push(
      h0(
        [
          [0, -6e-4],
          [0.0011, -6e-4],
          [0.0013, -3e-4],
          [0.0013, 4e-4],
          [0, 4e-4],
        ],
        6,
        t,
        l,
      )
        .rotateX(Math.PI / 2)
        .translate(0, Ki + 0.0011, 0.0642),
    ),
    h.push(
      Q0(
        [
          [0.0885, Ki - 4e-4],
          [0.0975, Ki - 4e-4],
          [0.0935, No],
          [0.0885, No],
        ],
        -0.0017,
        0.0017,
        3e-4,
        z,
        r,
      ),
    ),
    h.push(
      Nn(
        [
          [-0.005, Ki - 2e-4],
          [0.005, Ki - 2e-4],
          [0.0044, Ki + 0.001],
          [-0.0044, Ki + 0.001],
        ],
        0.087,
        0.0985,
        3e-4,
        z,
        r,
      ),
    ),
    h.push(Mt(0.0013, 0.003, 0.019, 5e-4, Hu, 0.0012, -0.0225, [2.2, 2.2, 2.3], { bare: 0.5, wear: 1 })),
    h.push(m0(0.001, 6e-4, Hu + 2e-4, 0.0012, -0.03, t, 6, l)),
    h.push(
      Nn(Su(-0.008, -0.0092, 0.008, 0.0052, 0.0016, 2), -0.0826, -0.0816, 3e-4, [0.62, 0.62, 0.64], {
        wear: 0.6,
      }),
    ),
    h.push(E(0.0016, -0.0829, -0.082, 0, -0.0052, t, 8, l)),
    h.push(Mt(0.0012, 0.0032, 0.0052, 3e-4, -Hu, sl + 0.0015, 0.008, i, u)),
    h.push(
      h0(
        [
          [0.0082, 0.10405],
          [0.0067, 0.10405],
        ],
        16,
        [0.1, 0.1, 0.11],
        u,
      ),
    ),
    h.push(
      h0(
        [
          [0.0036, 0.10405],
          [0.0029, 0.10405],
        ],
        10,
        [0.1, 0.1, 0.11],
        { ...u, oy: -0.0088 },
      ),
    ));
  for (let H of [-1, 1]) g.push(TS(0.00105, H * 0.0052, No - 0.0024, 0.0755 + 1e-4));
  (g.push(TS(0.00115, 0, No - 0.0019, -0.0885 + 1e-4)),
    p.push(
      h0(
        [
          [0.0066, 0.026],
          [0.0066, 0.105],
          [0.0061, 0.1066],
          [0.0055, 0.1075],
          [0.0049, 0.1075],
          [0.0045, 0.1062],
        ],
        16,
        [5.5, 5.5, 5.7],
        { bare: 0.8, wear: 0.6 },
      ),
    ),
    p.push(
      h0(
        [
          [0.0045, 0.1062],
          [0.0045, 0.09],
          [0, 0.09],
        ],
        12,
        [0.25, 0.25, 0.25],
        u,
      ),
    ),
    p.push(
      Nn(
        b0(
          [
            [-0.0038, -4e-4],
            [0.009, -4e-4],
            [0.009, 0.0096],
            [0.008, 0.0106],
            [-0.003, 0.0106],
            [-0.0038, 0.0098],
          ],
          5e-4,
          1,
        ),
        -0.0115,
        0.0295,
        5e-4,
        [7.5, 7.5, 7.8],
        { bare: 1, wear: 0.5, zone: 0.8 },
      ),
    ),
    p.push(Mt(0.0022, 6e-4, 0.0034, 2e-4, 0.0026, 0.0106, -0.0085, i, u)),
    p.push(Mt(6e-4, 0.004, 0.006, 2e-4, 0.0091, 0.004, -0.008, i, u)));
  let I = b0(
    [
      [0.098, -0.0126],
      [0.1, -0.015],
      [0.1, -0.027],
      [0.097, -0.03],
      [0.024, -0.03],
      [0.02, -0.033],
      [-0.026, -0.033],
      [-0.031, -0.04],
      [-0.084, -0.04],
      [-0.0875, -0.03],
      [-0.0885, -0.0126],
    ],
    [6e-4, 0.0015, 0.002, 0.002, 0.002, 0.002, 0.002, 0.002, 0.002, 0.004, 8e-4],
    2,
  );
  (d.push(Q0(I, -0.0127, 0.0127, 0.0016, s, { ...c, bs: 2 })),
    d.push(
      Eu(
        [
          [-0.084, 0.0126, -0.033, -0.0126, 0.0016, 0.003],
          [-0.0872, 0.0125, -0.0292, -0.0126, 0.0018, 0.004],
          [-0.0902, 0.012, -0.0258, -0.0128, 0.0022, 0.0046],
          [-0.093, 0.011, -0.0232, -0.0132, 0.0026, 0.0044],
          [-0.0954, 0.0096, -0.0214, -0.0139, 0.0028, 0.0036],
          [-0.0972, 0.008, -0.0203, -0.0147, 0.0026, 0.0028],
          [-0.0984, 0.006, -0.0196, -0.0156, 0.0019, 0.0019],
        ].map(([H, N, Z, Q, W, J]) => kn($a(N, Z, Q, W, J, 4), H)),
        s,
        { ...c, crease: 62 },
      ),
    ));
  {
    let H = [
        [-0.0262, -0.015],
        [-0.0275, -0.033],
        [-0.03, -0.037],
        [-0.0335, -0.06],
        [-0.0545, -0.125],
        [-0.056, -0.13],
      ],
      N = [
        [-0.0895, -0.015],
        [-0.0915, -0.0222],
        [-0.0878, -0.03],
        [-0.085, -0.035],
        [-0.0885, -0.042],
        [-0.093, -0.062],
        [-0.101, -0.09],
        [-0.1085, -0.115],
      ],
      Z = (G, te) => {
        let oe = 0;
        for (; oe < G.length - 2 && te < G[oe + 1][1];) oe++;
        return G[oe][0] + ((G[oe + 1][0] - G[oe][0]) * (te - G[oe][1])) / (G[oe + 1][1] - G[oe][1]);
      },
      Q = [];
    for (let [G, te, oe, ee, le] of [
      [-0.015, -0.015, 0.0124, 0.004, 0.004],
      [-0.0185, -0.0185, 0.013, 0.0055, 0.005],
      [-0.024, -0.024, 0.0137, 0.0068, 0.0062],
      [-0.031, -0.031, 0.0146, 0.0078, 0.008],
      [-0.04, -0.039, 0.015, 0.0082, 0.0096],
      [-0.06, -0.058, 0.015, 0.0084, 0.0102],
      [-0.08, -0.076, 0.015, 0.0084, 0.0104],
      [-0.1, -0.093, 0.015, 0.0084, 0.0104],
      [-0.118, -0.106, 0.015, 0.0082, 0.01],
      [-0.124, -0.1105, 0.0158, 0.008, 0.0096],
      [-0.13, -0.115, 0.0162, 0.0078, 0.0092],
      [-0.1308, -0.1158, 0.015, 0.007, 0.0084],
    ]) {
      let xe = Z(H, G),
        j = Z(N, te),
        O = $a(oe, j, xe, ee, le, 4);
      Q.push(O.map((q) => [q[0], te + ((G - te) * (q[1] - j)) / (xe - j), -q[1]]));
    }
    d.push(Eu(Q, s, { ...c, crease: 40 }));
    let W = b0(
        [
          [-0.044, -0.05],
          [-0.06, -0.115],
          [-0.099, -0.104],
          [-0.0935, -0.085],
          [-0.0865, -0.06],
          [-0.083, -0.045],
          [-0.056, -0.041],
        ],
        0.004,
        2,
      ),
      J = [];
    for (let G = 0; G < 16; G++) {
      let te = (G / 16) * Math.PI * 2;
      J.push([-0.0685 + Math.cos(te) * 0.0064, -0.072 + Math.sin(te) * 0.0064]);
    }
    for (let G of [-1, 1])
      (d.push(
        Q0(W, G > 0 ? 0.0146 : -0.0155, G > 0 ? 0.0155 : -0.0146, 4e-4, s, {
          wear: 0.8,
          zone: 1,
          holes: [J],
        }),
      ),
        m.push(m0(0.0058, 0.0012, G * 0.015, -0.072, -0.0685, [3.2, 3.2, 3.3], 16, { bare: 0.7, wear: 1 })),
        d.push(
          Q0(
            Su(0, -0.027, 0.019, -0.018, 0.002, 2),
            G > 0 ? 0.0124 : -0.0131,
            G > 0 ? 0.0131 : -0.0124,
            3e-4,
            s,
            { wear: 0.8, zone: 1 },
          ),
        ));
  }
  d.push(
    Nn(
      [
        [-0.0086, -0.0296],
        [0.0086, -0.0296],
        [0.01, -0.032],
        [-0.01, -0.032],
      ],
      0.038,
      0.095,
      4e-4,
      s,
      c,
    ),
  );
  {
    let H = b0(
      [
        [-0.01, -0.0316],
        [0.01, -0.0316],
        [0.0106, -0.0326],
        [0.009, -0.0346],
        [-0.009, -0.0346],
        [-0.0106, -0.0326],
      ],
      4e-4,
      1,
    );
    for (let N = 0; N < 5; N++) {
      let Z = 0.042 + N * 0.01001;
      d.push(Nn(H, Z, Z + 0.00478, 6e-4, s, c));
    }
  }
  d.push(
    Q0(
      b0(
        [
          [0.024, -0.029],
          [0.025, -0.056],
          [0.016, -0.0665],
          [-0.029, -0.0665],
          [-0.0345, -0.06],
          [-0.03, -0.032],
        ],
        [0.001, 0.004, 0.004, 0.004, 0.003, 0.001],
        2,
      ),
      -0.0075,
      0.0075,
      0.002,
      s,
      {
        ...c,
        bs: 2,
        holes: [
          b0(
            [
              [0.0195, -0.0335],
              [0.02, -0.055],
              [0.014, -0.062],
              [-0.027, -0.062],
              [-0.03, -0.057],
              [-0.026, -0.0335],
            ],
            0.004,
            3,
          ),
        ],
      },
    ),
  );
  for (let H = 0; H < 5; H++) d.push(Mt(0.011, 0.0016, 0.0014, 5e-4, 0, -0.037 - H * 0.0042, 0.0252, s, c));
  (v.push(Mt(0.0222, 0.001, 0.0345, 2e-4, 0, -0.12585, -0.07526, o, f, [-0.278, 0, 0])),
    d.push(
      Q0(
        b0(
          [
            [-0.101, -0.1085],
            [-0.1094, -0.1112],
            [-0.1072, -0.1188],
            [-0.099, -0.116],
          ],
          0.0015,
          2,
        ),
        -0.003,
        0.003,
        8e-4,
        s,
        { ...c, holes: [Su(-0.1064, -0.1158, -0.1026, -0.1116, 0.0012, 2)] },
      ),
    ),
    m.push(m0(0.0013, 0.0304, 0, -0.103, -0.0985, t, 8, l)),
    d.push(Mt(0.0034, 0.0082, 0.0072, 0.0014, -0.015, -0.0455, -0.0375, s, { wear: 1.2 }, [-Vy, 0, 0])));
  for (let H = 0; H < 3; H++)
    d.push(Mt(8e-4, 0.001, 0.006, 3e-4, -0.0169, -0.0432 - H * 0.0022, -0.0375 - H * 7e-4, s, c));
  for (let [H, N, Z] of [
    [0.004, -0.0225, 0.0019],
    [-0.008, -0.0178, 0.0016],
    [-0.076, -0.026, 0.0019],
  ])
    m.push(m0(Z, 0.0262, 0, N, H, t, 10, l));
  (m.push(
    Q0(
      b0(
        [
          [-0.0065, -0.0325],
          [0.0012, -0.0325],
          [6e-4, -0.042],
          [0.003, -0.05],
          [0.0056, -0.0565],
          [0.0022, -0.0588],
          [-0.003, -0.052],
          [-0.0055, -0.043],
        ],
        [0, 0, 0.004, 0.005, 8e-4, 8e-4, 0.005, 0.004],
        2,
      ),
      -0.0033,
      0.0033,
      0.0011,
      [1.2, 1.2, 1.25],
      { wear: 0.6, bs: 2 },
    ),
  ),
    m.push(Mt(0.0012, 0.011, 0.0014, 4e-4, 0, -0.049, 0.0048, [0.6, 0.6, 0.62], a, [0.36, 0, 0])));
  for (let H of [-1, 1]) {
    m.push(Mt(0.0018, 0.0044, 0.0125, 7e-4, H * 0.0131, -0.0188, 0.0215, e, { wear: 1.3 }));
    for (let N = 0; N < 4; N++)
      m.push(Mt(8e-4, 0.0034, 0.001, 3e-4, H * 0.0142, -0.0188, 0.0178 + N * 0.0025, e, { wear: 1.3 }));
  }
  m.push(
    h0(
      [
        [0.0028, 0.03],
        [0.0028, 0.1036],
        [0.0023, 0.1046],
        [0, 0.1046],
      ],
      10,
      [8, 8, 8.3],
      { bare: 0.9, wear: 0.4, oy: -0.0088 },
    ),
  );
  for (let H of [-1, 1]) m.push(Mt(0.002, 0.001, 0.15, 3e-4, H * 0.0112, -0.01225, 0.01, i, u));
  {
    x.push(
      Q0(
        b0(
          [
            [0.0045, 0.0024],
            [0.0045, -0.0024],
            [-0.019, -0.0022],
            [-0.029, -0.004],
            [-0.0335, -0.0016],
            [-0.0335, 0.003],
            [-0.0255, 0.004],
            [-0.019, 0.0022],
          ],
          8e-4,
          1,
        ),
        -0.0149,
        -0.0128,
        5e-4,
        [1.3, 1.3, 1.35],
        { wear: 1.3 },
      ),
    );
    for (let H = 0; H < 4; H++)
      x.push(
        Mt(8e-4, 0.005, 0.0011, 3e-4, -0.0152, 2e-4, -0.0222 - H * 0.0026, [1.3, 1.3, 1.35], { wear: 1.3 }),
      );
    x.push(m0(0.0026, 0.001, -0.0153, 0, 0.001, t, 10, l));
  }
  let L = [2.3, 2.3, 2.4],
    U = RS,
    k = { bare: 0.45, wear: 1, zone: 0.6 };
  (y.push(
    Q0(
      Su(-0.0155, -U, 0.0155, 0, 0.003, 2).map((H) => [-H[0], H[1]]),
      -0.01025,
      0.01025,
      0.0018,
      L,
      { ...k, bs: 2 },
    ),
  ),
    y.push(Mt(0.005, U - 0.02, 0.001, 4e-4, 0, -U / 2 - 0.004, 0.0157, L, k)));
  for (let H = 0; H < 6; H++) y.push(m0(0.0015, 6e-4, 0.01025, -0.03 - H * 0.014, -0.01, i, 8, u));
  for (let H of [-1, 1]) y.push(Mt(0.0024, 0.0052, 0.023, 8e-4, H * 0.0074, 0.0016, -0.003, L, k));
  (y.push(Mt(0.0262, 0.008, 0.04, 0.0026, 0, -U - 0.0036, 0.0025, [0.85, 0.85, 0.87], { wear: 0.7 })),
    y.push(Mt(0.018, 0.0012, 0.008, 4e-4, 0, -U - 0.0078, 0.01, [0.55, 0.55, 0.56], f)),
    y.push(Mt(0.015, 0.004, 0.019, 0.001, 0, -0.001, -0.004, [6, 2.6, 0.9], f)));
  let C = [1.25, 0.72, 0.5];
  {
    let H = h0(
        [
          [0, -0.0105],
          [0.0046, -0.0105],
          [0.0049, -0.0098],
          [0.0049, 0.007],
          [0.0046, 0.0085],
        ],
        12,
        [1, 1, 1],
        f,
      ),
      N = h0(
        [
          [0.0045, 0.0085],
          [0.0043, 0.0125],
          [0.0034, 0.016],
          [0.0018, 0.0182],
          [0, 0.0188],
        ],
        12,
        C,
        f,
      );
    for (let Z of [H, N]) (Z.rotateX(0.09), Z.translate(0, 0.0046, -0.001), b.push(Z));
  }
  let A = {
      slide: Fs(h),
      barrel: Fs(p),
      frame: Fs(d),
      steel: Fs(m),
      stop: Fs(x),
      plain: Fs(v),
      mag: Fs(y),
      round: Fs(b),
    },
    F = (H, N, Z, Q) =>
      Q === 'frame'
        ? Math.abs(H) < 0.0155 && N < -0.048 && N > -0.124 && -Z < -0.03
          ? (1 - Math.min(1, Math.max(0, (Math.abs(H) - 0.0075) / 0.003))) *
            Math.max(
              1 - Math.min(1, Math.max(0, (-0.0335 + (N + 0.06) * 0.323 + Z - 0.004) / 0.003)),
              1 - Math.min(1, Math.max(0, (-Z - (-0.093 + (N + 0.062) * 0.2857) - 0.004) / 0.003)),
            )
          : 0
        : Q === 'slide'
          ? Math.max(
              0.8 * Zl(H, N, Z, -0.006, 0.02, -0.002, 0.009, -0.014, 0.032, 0.004),
              0.6 * Zl(H, N, Z, -0.02, 0.02, -0.02, 0.02, 0.094, 0.11, 0.008),
              0.5 * Zl(H, N, Z, -0.02, 0.02, -0.014, -0.0105, -0.09, 0.11, 0.002),
            )
          : 0;
  (sy(
    Object.keys(A).map((H) => ({
      key: H,
      g: A[H],
      off: H === 'mag' || H === 'round' ? G0.magPos : H === 'stop' ? G0.stopPivot : null,
      rx: H === 'mag' || H === 'round' ? -Vy : 0,
    })),
    F,
    0.0013,
  ),
    (A.dots = DD(g)));
  for (let H in A) A[H].computeBoundingSphere();
  return A;
}

function DD(n) {
  let e = [],
    t = [],
    i = [],
    s = [],
    o = 0;
  for (let a of n) {
    let l = a.attributes.position.array,
      c = a.attributes.normal.array,
      u = a.attributes.uv.array;
    for (let f = 0; f < l.length; f++) (e.push(l[f]), t.push(c[f]));
    for (let f = 0; f < u.length; f++) i.push(u[f]);
    for (let f of a.index.array) s.push(f + o);
    o += l.length / 3;
  }
  let r = new THREE.BufferGeometry();
  return (
    r.setAttribute('position', new THREE.Float32BufferAttribute(e, 3)),
    r.setAttribute('normal', new THREE.Float32BufferAttribute(t, 3)),
    r.setAttribute('uv', new THREE.Float32BufferAttribute(i, 2)),
    r.setIndex(s),
    r
  );
}

var ii = THREE.Vector3,
  or = THREE.Quaternion,
  Bh = 0.118,
  k5 = 0.062,
  kS = (n, e) => ({ p: n.p.map((t, i) => t - e.p[i]), r: n.r.map((t, i) => t - e.r[i]) }),
  Wy = (n, e, t, i, s, o, r) => ({
    name: n,
    HIP: e,
    ADS: { p: [0, -G0.sightY, t], r: [0, 0, 0] },
    SPRINT: kS(i, e),
    SPRINT_ARC: s,
    RELOAD: kS(o, e),
    RACK: r,
  }),
  Gy = { p: [-0.03, 0.035, 0.04], r: [0.06, 0.04, -0.22] },
  qy = [0.58, 0.28, -0.99],
  Xy = [
    Wy(
      'close',
      { p: [0.075, -0.071, -0.343], r: [0.01, 0.08, 0.1] },
      -0.44,
      { p: [0.07, -0.11, -0.33], r: [-0.55, 0.35, 0.12] },
      { p: [-0.006, -0.012, 0.02], r: [0.05, 0.03, 0.04] },
      { p: [0.065, 0.057, -0.4], r: qy },
      Gy,
    ),
    Wy(
      'threequarter',
      { p: [0.103, -0.101, -0.5], r: [0.05, 0.16, 0.05] },
      -0.47,
      { p: [0.09, -0.13, -0.42], r: [-0.45, 0.5, 0.1] },
      { p: [-0.006, -0.012, 0.025], r: [0.05, 0.03, 0.04] },
      { p: [0.07, 0.05, -0.44], r: qy },
      Gy,
    ),
    Wy(
      'compact',
      { p: [0.166, -0.123, -0.481], r: [0.04, 0.07, 0.02] },
      -0.47,
      { p: [0.14, -0.15, -0.42], r: [-0.6, 0.25, 0.05] },
      { p: [-0.004, -0.01, 0.02], r: [0.05, 0.02, 0.03] },
      { p: [0.08, 0.04, -0.42], r: qy },
      Gy,
    ),
  ],
  H1 = (n, e, t) => (n < e || n >= t ? 0 : Ot((n - e) / (t - e))),
  Yy = (n) => new or().setFromAxisAngle(new ii(1, 0, 0), n),
  LD = (n) => new or().setFromAxisAngle(new ii(0, 1, 0), n),
  PS = 0.026,
  ol = {
    grip: {
      web: [-0.0335, -0.012, -0.045],
      tilt: 0.3,
      roll: 0.3,
      drop: 0.008,
      lift: 0.0025,
      nudge: [-0.008, 0, -0.002],
      thumb: [0, 0],
      wrap: { back: [-0.006, 0.024], out: [0, 0.0015, 0.003], dip: [0.3, 0.6, 0.9], clear: 3e-4, skin: 0 },
    },
    support: {
      web: [-0.0335, -0.012, -0.029],
      tilt: 0.3,
      roll: 0.2,
      drop: 0.016,
      pad: [0.008, 0.017, 0.03],
      nudge: [0, -0.014, 0],
      thumb: [0, 0],
      sweep: [0.5, 0.15, 0.1, 1.5, 1.3, -0.25],
    },
    carryYaw: 0,
    slapShift: 0.028,
    shR: [0.2, -0.2, 0.32],
    shL: [-0.2, -0.2, 0.32],
    poleR: [0.8, -0.6, 0],
    poleL: [-0.8, -0.6, 0],
    sprintShR: [0.26, -0.1, 0.32],
    sprintPoleR: [1, -0.2, 0],
    ads: {
      shR: [0.22, -0.3, 0.15],
      shL: [-0.22, -0.3, 0.15],
      poleR: [0.87, -0.5, 0],
      poleL: [-0.87, -0.5, 0],
    },
  };

function FD(n) {
  let e = -G0.gripFront[0],
    t = -G0.gripBack[0],
    i = G0.gripFront[1],
    s = G0.rake,
    o = Math.tan(s),
    r = {},
    a = (() => {
      let L = gi(n.grip || n.frame, [-0.03, i - 0.02, e], [0.03, i + 0.01, t]);
      return Math.min(-L.min[0], L.max[0]);
    })(),
    l = gi(n.grip || n.frame, [-0.02, i + 0.015, t - 0.004], [0.02, i + 0.048, t + 0.003]).min[1],
    c = gi(n.grip || n.frame, [-0.03, i - 0.14, e], [0.03, i, t + 0.03]).min[1],
    u = (l + c) / 2,
    f = (e + t) / 2 + (i - u) * o,
    h = (l - c) / 2 / Math.cos(s),
    p = ((t - e) / 2) * Math.cos(s);
  ((r.gripDim = { rake: s, hw: a, hl: h, hd: p, c: [0, u, f] }), (r.frontAt = (L) => e + (i - L) * o));
  let d = mn(r.gripDim.c, [a, h, p], Yy(-s), a * 0.62),
    m = gi(n.slide, [-1, -1, -1], [1, 1, 1]),
    x = gi(n.frame, [-1, i + 0.026, -1], [1, 0, t]),
    v = mn(
      [0, (x.min[1] + m.max[1] - 0.005) / 2, (m.min[2] + x.max[2]) / 2],
      [(m.max[0] - m.min[0]) / 2, (m.max[1] - 0.005 - x.min[1]) / 2, (x.max[2] - m.min[2]) / 2],
      null,
      0.003,
    ),
    y = gi(n.frame, [-0.009, i - 0.008, e - 0.064], [0.009, i - 0.003, e - 0.004]),
    b = mn(
      [0, (y.min[1] + y.max[1]) / 2, (y.min[2] + y.max[2]) / 2],
      [(y.max[0] - y.min[0]) / 2, (y.max[1] - y.min[1]) / 2, (y.max[2] - y.min[2]) / 2],
      null,
      0.0015,
    );
  r.tang = new ii(0, y.min[1] + PS, t + (i - y.min[1] - PS) * o);
  let g = mn(
      [0, (y.max[1] + x.min[1]) / 2, y.min[2] + 0.002],
      [(y.max[0] - y.min[0]) / 2, (x.min[1] - y.max[1]) / 2, 0.002],
      null,
      0.0015,
    ),
    E = Bu(n.steel, [-0.0034, i + 0.0015, -0.008], [0.0034, i + 0.026, 0.008], 0.005),
    M = E[Math.floor(E.length / 2)];
  ((r.triggerAt = [0, M.y, M.z0]),
    (r.trigger = [vs([-0.0033, M.y + 0.005, M.z0 + 0.003], [0.0033, M.y - 0.008, M.z0 + 0.001], 0.003)]));
  let _ = gi(n.stop, [-1, -1, -1], [1, 1, 1]),
    T = G0.stopPivot;
  r.lever = [
    mn(
      [T[0] + (_.min[0] + _.max[0]) / 2, T[1], T[2] + _.max[2] - 0.008],
      [(_.max[0] - _.min[0]) / 2, 0.004, 0.008],
      null,
      0.001,
    ),
  ];
  let w = gi(n.frame, [-1, i + 0.026, t - 0.012], [1, 0, 1]),
    S = mn(
      [0, (w.min[1] + w.max[1]) / 2, (w.min[2] + w.max[2]) / 2],
      [(w.max[0] - w.min[0]) / 2, (w.max[1] - w.min[1]) / 2, (w.max[2] - w.min[2]) / 2],
      null,
      0.004,
    );
  ((r.upperHw = (m.max[0] - m.min[0]) / 2), (r.grip = [d, v, b, g, S]));
  let R = gi(n.mag, [-1, -1, -1], [1, 1, 1]),
    z = gi(n.mag, [-1, R.min[1] + 0.012, -1], [1, -0.012, 1]),
    I = gi(n.mag, [-1, R.min[1], -1], [1, R.min[1] + 0.0085, 1]);
  ((r.mag = [
    mn(
      [0, (R.min[1] + 0.008) / 2, (z.min[2] + z.max[2]) / 2],
      [Math.max(-z.min[0], z.max[0]), -(R.min[1] + 0.008) / 2, (z.max[2] - z.min[2]) / 2],
      null,
      0.003,
    ),
    mn(
      [0, (I.min[1] + I.max[1]) / 2, (I.min[2] + I.max[2]) / 2],
      [I.max[0], (I.max[1] - I.min[1]) / 2, (I.max[2] - I.min[2]) / 2],
      null,
      0.0025,
    ),
  ]),
    (r.padBottom = new ii(0, R.min[1], (I.min[2] + I.max[2]) / 2)));
  {
    let L = r.mag[1];
    r.grip.push(
      mn(
        new ii().fromArray(L.c).applyQuaternion(Yy(-s)).add(new ii().fromArray(G0.magPos)).toArray(),
        L.h,
        Yy(-s),
        L.r,
      ),
    );
  }
  return r;
}

var $y = null,
  IS = '';

function ND(n) {
  let e = JSON.stringify(ol);
  if ($y && e === IS) return $y;
  let t = FD(n),
    i = ol,
    s = { shapes: t },
    o = new or(),
    r = t.gripDim;
  (($y = s), (IS = e));
  let a = {
      rake: r.rake,
      len: (t.tang.y - (r.c[1] - r.hl * Math.cos(r.rake))) / Math.cos(r.rake),
      width: 2 * r.hw,
      depth: 2 * r.hd,
      top: [0.012, 0.15, 0.004, 0.032],
      topW: 0.027,
      guard: [0.04, 0.096, -0.03],
      trigger: [0.082, -0.013],
    },
    l = il('right', tc({ ...i.grip, ...a, round: 0.011 }).frame, t.tang, o);
  (l.p.add(new ii(0, i.grip.lift, 0).applyQuaternion(l.q)),
    i.grip.nudge && l.p.add(new ii().fromArray(i.grip.nudge)));
  let c = t.lever[0],
    u = -t.upperHw - 5e-4;
  if (((s.grip = ca('grip', 'right', l.p, l.q, t.grip, nn.pistol_grip.fit)), i.grip.wrap)) {
    let y = i.grip.wrap,
      b = (g, E, M, _, T, w) =>
        Uu(s.grip, 'grip', g, [-(r.hw + M), T.y, w + E], s.grip.pose, {
          start: [1.35, 1.45, 0.4, s.grip.pose[g * 4 + 3]],
          at: 0.5,
          couple: _,
        });
    for (let g = 2; g < 5; g++) {
      let E = pS(s.grip, g),
        M = t.frontAt(E.y),
        _ = null,
        T = 1e9;
      for (let w = y.back[0]; w <= y.back[1] + 1e-9; w += 0.003)
        for (let S of y.out)
          for (let R of y.dip) {
            let z = b(g, w, S, R, E, M),
              I = wh(z.pose, g, s.grip.shapes),
              L =
                5 * Math.max(0, Math.max(I[0], I[1]) + y.clear) +
                Math.abs(I[2] + y.skin) +
                3 * z.miss -
                0.02 * w;
            L < T && ((T = L), (_ = z));
          }
      s.grip = _;
    }
  }
  ((s.grip = R5(s.grip, 'grip', 0, [u, c.c[1] - 0.006 + i.grip.thumb[0], c.c[2] + 0.022 + i.grip.thumb[1]], {
    root: 0.85,
  })),
    (s.trigger = Uu(
      s.grip,
      'trigger',
      1,
      [t.triggerAt[0] + 0.002, t.triggerAt[1] + 0.007, t.triggerAt[2] - 0.0015],
      s.grip.pose,
      { start: [0.2, 1, 0.6, 0.1], at: 0.4, couple: 0.3 },
    )));
  let f = il('left', tc({ ...i.support, ...a, round: 0.014 }).frame, t.tang, o);
  i.support.nudge && f.p.add(new ii().fromArray(i.support.nudge));
  let h = i.support.sweep,
    p = d0({ thumb: [0, -0.1, -0.1, 0.7], fingers: [h[0], h[1], h[2], 0], index: [h[0], h[1], h[2], h[5]] }),
    d = d0({ thumb: [0, -0.1, -0.1, 0.7], fingers: [1.6, h[1], h[2], 0], index: [1.6, h[1], h[2], h[5]] });
  s.support = ca('support', 'left', f.p, f.q, t.grip.concat(mS(s.grip, s.grip.pose, [0, 1, 2, 3, 4])), {
    from: p,
    to: d,
    digits: [1, 2, 3, 4],
  });
  let m = Float32Array.from(s.support.pose);
  for (let y = 1; y < 5; y++) ((m[y * 4 + 1] = h[3]), (m[y * 4 + 2] = h[4]));
  ((s.support = dS(s.support, 'support', { from: s.support.pose, to: m, digits: [1, 2, 3, 4] })),
    (s.support = R5(s.support, 'support', 0, [
      u,
      c.c[1] - 0.002 + i.support.thumb[0],
      c.c[2] - 0.03 + i.support.thumb[1],
    ])),
    (s.supportOpen = tn(new Float32Array(Un), p, s.support.pose, 0.2)),
    (s.stop = R5(s.grip, 'stop', 0, [c.c[0] - c.h[0], c.c[1] + 0.002, c.c[2] + 0.002], {
      skin: -0.003,
      root: 0.85,
    })));
  let x = il('left', 'mag_cup', t.padBottom, LD(i.carryYaw));
  s.carry = ca('carry', 'left', x.p, x.q, t.mag, {
    from: nn.mag_cup.fit.from,
    to: d0({ thumb: [1.35, 0.7, 0.6, 0.3], fingers: [1.6, 1.1, 0.7, 0] }),
  });
  let v = x.p.clone().add(new ii(0, 0, -i.slapShift).applyQuaternion(x.q));
  return (
    (s.slap = {
      ...s.carry,
      name: 'slap',
      p: v,
      pose: tn(new Float32Array(Un), s.carry.pose, di.relaxed, 0.55),
    }),
    s
  );
}

function zS(n) {
  let { mats: e, mk: t, S: i, rng: s } = n,
    o = new THREE.Group();
  o.name = 'viewmodel-deagle';
  let r = CS();
  o.add(t(r.frame, e.chrome), t(r.grip, e.poly), t(r.steel, e.steel));
  if (r.plain && r.plain.attributes.position) o.add(t(r.plain, e.plain));
  let a = new THREE.Group();
  (a.position.fromArray(G0.barrelPivot),
    r.barrel.translate(-G0.barrelPivot[0], -G0.barrelPivot[1], -G0.barrelPivot[2]),
    a.add(t(r.barrel, e.chrome)),
    o.add(a));
  let l = new THREE.Group();
  (l.add(t(r.slide, e.chrome), t(r.dots, e.dots)), o.add(l));
  let c = t(r.stop, e.steel);
  (c.position.fromArray(G0.stopPivot), o.add(c));
  let u = new THREE.Group(),
    f = new ii().fromArray(G0.magPos),
    h = Au(-G0.rake, 0, 0),
    p = new ii().fromArray(G0.magAxis),
    d = t(r.round, e.brass);
  (u.add(t(r.mag, e.steel), d), o.add(u));
  let m = null,
    x = null;
  let v = l5();
  (v.position.fromArray(G0.muzzle), (v.visible = !1), o.add(v));
  let y = ND(r),
    b = n.arms || null,
    g = new or(),
    E = (ge, ce, P, D, B) => {
      (B.copy(P).multiply(ge.q), D.copy(ge.p).applyQuaternion(P).add(ce));
    },
    M = { p: y.support.p, q: y.support.q },
    _ = { p: new ii(0.1, -0.38, 0.12), q: Au(-0.3, 0, 0.45) },
    T = {
      p: p
        .clone()
        .multiplyScalar(Bh + 0.016)
        .add(new ii(-0.004, 0, 0.005)),
      q: Au(-0.1, 0, 0.08),
    },
    w = { p: p.clone().multiplyScalar(Bh), q: new or() },
    S = [
      [It.rise, _],
      [It.align, T],
      [It.insert, w],
      [9, w],
    ],
    R = new or(),
    z = { p: new ii(), q: new or() };
  E(y.carry, f.clone().add(_.p), R.copy(_.q).multiply(h), z.p, z.q);
  let I = { p: new ii(), q: new or() };
  E(y.slap, f.clone().addScaledVector(p, It.reboundBy), h, I.p, I.q);
  let L = [
      [0, M],
      [0.05, M],
      [0.42, z],
      [9, z],
    ],
    U = I.p
      .clone()
      .lerp(M.p, 0.5)
      .add(new ii(0.035, -0.07, 0.045)),
    k = tn(new Float32Array(Un), di.relaxed, di.open, 0.25),
    C = y.supportOpen,
    A = new ii(),
    F = new or(),
    H = new ii(),
    N = new or(),
    Z = new ii(),
    Q = new ii(),
    W = new ii(),
    J = new or(),
    G = { p: new ii().copy(M.p), q: new or().copy(M.q), pose: new Float32Array(Un), busy: !1 },
    te = (ge, ce, P, D, B) => (B < 0.5 ? tn(ge, ce, P, Ot(B * 2)) : tn(ge, P, D, Ot(B * 2 - 1))),
    oe = 0.1366,
    ee = 1.53,
    le = 9,
    xe = !1,
    j = 0,
    O = 1,
    q = 0,
    ue = 0;
  function de() {
    ((G.busy = !1),
      G.p.copy(M.p),
      G.q.copy(M.q),
      G.pose.set(y.support.pose),
      (ue = 0),
      (u.visible = !0),
      u.position.copy(f),
      u.quaternion.copy(h));
  }
  de();
  let $ = (ge) => {
      l.position.z = ge;
      let ce = Math.min(1, ge / 0.006);
      ((a.rotation.x = 0.02 * ce), (a.position.z = G0.barrelPivot[2] + 0.0025 * ce));
    },
    se = Object.values(r).reduce((ge, ce) => ge + Tu(ce), 0) + (m ? Tu(m.geometry) + Tu(x.geometry) : 0) + 2,
    fe = 0;
  o.traverse((ge) => {
    ge.isMesh && fe++;
  });
  let me = {
    id: 'pistol',
    name: G0.name,
    root: o,
    flash: v,
    muzzle: G0.muzzle,
    eject: G0.eject,
    sight: [0, G0.sightY, -G0.rearF],
    info: { tris: Math.round(se), meshes: fe },
    slot: { id: 'pistol', name: G0.name, ammo: DEAGLE_DEF.magSize, magSize: DEAGLE_DEF.magSize, reserve: DEAGLE_DEF.reserve },
    def: DEAGLE_DEF,
    views: Xy,
    view: 0,
    get pose() {
      return Xy[me.view];
    },
    setView(ge) {
      me.view = Math.max(0, Math.min(Xy.length - 1, ge | 0));
    },
    motion: bh.pistol,
    reloadTime: (ge) => (ge ? It.empty : It.tac),
    reset() {
      ((le = 9), (xe = !1), (j = 0), (d.visible = !0), de(), $(0), (c.rotation.x = 0), (O = 1), (q = 0));
    },
    cancelReload(ge) {
      (de(), ge && (xe = !1), (d.visible = me.slot.ammo > 0));
    },
    shot(ge) {
      ((le = 0), b && (b.right.impulse(0.8), b.left.impulse(0.6)), ge && ((xe = !0), (d.visible = !1)));
    },
    recoil(ge, ce, P) {
      (P.addRecoil && P.addRecoil(0.0092 * ce * (0.9 + s() * 0.2), (s() - 0.5) * 0.005 * ce),
        P.addShake && P.addShake(0.14 * ce));
      let D = bh.pistol.recoil,
        B = i.adsE,
        X = (0.9 + s() * 0.2) * (P.crouching ? 0.9 : 1),
        re = X * u0(1, D.adsRot, B),
        Y = X * u0(1, D.adsPos, B);
      ((i.kZ.v += D.back * X * u0(1, D.adsBack, B)),
        (i.kP.v += D.rise * re),
        (i.kY.v += (s() - 0.5) * D.yaw * re),
        (i.kR.v += (s() - 0.5) * D.roll * re),
        (i.kU.v += D.up * Y),
        (i.kX.v += (s() - 0.5) * 2 * D.side * Y));
    },
    reload(ge, ce) {
      let P = n.ev,
        D = ge.empty;
      (P(ge, 'magout', It.magout) && (i.bump.v += 0.1),
        ce >= It.swap && !ge.f.fresh && ((ge.f.fresh = 1), (d.visible = !0)),
        P(ge, 'maginsert', It.insert) && ((i.bump.v += 0.1), (i.kR.v += 0.5)),
        P(ge, 'magin', It.magin) && ((i.bump.v += 0.85), (i.kP.v += 0.85), b && b.left.impulse(1)),
        D && P(ge, 'slide', It.slide) && ((xe = !1), (i.kZ.v -= 0.9), (i.kP.v -= 2.6), (i.bump.v -= 0.12)),
        (i.antRT =
          0.035 * H1(ce, 0.03, It.magout) - 0.03 * H1(ce, It.thumb - 0.08, It.slideRelease) * (D ? 1 : 0)),
        (i.antYT =
          -0.002 * H1(ce, It.insert - 0.1, It.insert) -
          0.0065 * H1(ce, It.fingers, It.magin) +
          0.003 * H1(ce, It.thumb - 0.08, It.slideRelease) * (D ? 1 : 0)));
      let B = 0,
        X = 0;
      if (ce < It.swap)
        if (ce < It.magout) (u.position.copy(f), u.quaternion.copy(h));
        else {
          let Y = ce - It.magout;
          if (Y < oe) (u.position.copy(f).addScaledVector(p, 4.5 * Y * Y + 0.3 * Y), u.quaternion.copy(h));
          else {
            let he = Y - oe;
            (Q.set(0, -1, 0).applyQuaternion(N.copy(o.quaternion).invert()),
              u.position
                .copy(f)
                .addScaledVector(p, 0.125 + ee * he)
                .addScaledVector(Q, 4.9 * he * he),
              N.setFromAxisAngle(Z.set(1, 0, 0), -2.6 * he),
              u.quaternion.copy(h).multiply(N));
          }
        }
      else {
        let Y = 0;
        if (ce < It.insert) Ru(S, Math.max(ce, It.rise), H, N);
        else {
          if ((N.identity(), ce < It.fingers)) Y = Bh - k5 * yh(dn(ce, It.insert, It.fingers));
          else if (ce < It.windup)
            ((Y = Bh - k5), (X = Ot(dn(ce, It.fingers, It.windup))), (B = It.backOff * X));
          else if (ce < It.magin) {
            let he = dn(ce, It.windup, It.magin),
              V = (Bh - k5 + It.backOff) * (1 - he * he);
            ((Y = Math.min(Bh - k5, V)), (B = V - Y), (X = 1));
          } else ((X = 1), (B = It.reboundBy * yh(dn(ce, It.magin, It.rebound))));
          H.copy(p).multiplyScalar(Y);
        }
        (u.position.copy(f).add(H), u.quaternion.copy(N).multiply(h));
      }
      let re = G.pose;
      if (((G.busy = !0), ce < It.swap))
        (Ru(L, ce, A, F), te(re, y.support.pose, k, y.carry.pose, dn(ce, 0.03, It.swap - 0.02)));
      else if (ce < It.rebound)
        (E(y.carry, u.position, u.quaternion, A, F),
          E(y.slap, u.position, u.quaternion, W, J),
          A.lerp(W, X).addScaledVector(p, B),
          F.slerp(J, X),
          tn(re, y.carry.pose, y.slap.pose, X));
      else {
        let Y = dn(ce, It.rebound, It.regrip),
          he = Ot(Y),
          V = 1 - he;
        (A.copy(I.p)
          .multiplyScalar(V * V)
          .addScaledVector(U, 2 * V * he)
          .addScaledVector(M.p, he * he),
          F.copy(I.q).slerp(M.q, Ot(dn(ce, It.rebound + 0.02, It.regrip - 0.02))),
          Y < 0.55 ? tn(re, y.slap.pose, C, Ot(Y / 0.55)) : tn(re, C, y.support.pose, Ot((Y - 0.55) / 0.45)));
      }
      (G.p.copy(A),
        G.q.copy(F),
        D
          ? ((j = ce < It.thumb ? 1 : 1 - Ot(dn(ce, It.thumb, It.slideRelease))),
            $(
              ce < It.slideRelease
                ? G0.slideLock
                : G0.slideLock * Math.max(0, 1 - (ce - It.slideRelease) / (It.slide - It.slideRelease)),
            ),
            (ue =
              Ot(dn(ce, It.thumb - 0.16, It.thumb - 0.01)) *
              (1 - Ot(dn(ce, It.slide + 0.02, It.slide + 0.16)))))
          : (ue = 0),
        (i.reloadW = Math.min(Ot(ce / 0.22), 1 - Ot((ce - (It.magin + 0.03)) / 0.32))),
        (i.rackW = D ? Ot((ce - (It.magin + 0.05)) / 0.28) * (1 - Ot((ce - (It.slide + 0.04)) / 0.24)) : 0));
    },
    endReload() {
      de();
    },
    parts(ge, ce, P) {
      le += ge;
      let D = 0.066;
      if (!(P && xe)) {
        let B = le < D ? (le < 0.024 ? le / 0.024 : 1 - (le - 0.024) / (D - 0.024)) : 0;
        (xe && le > 0.024 && (B = Math.max(B, G0.slideLock / G0.slideTravel)),
          $(G0.slideTravel * B),
          (j = xe && le > 0.03 ? 1 : 0));
      }
      ((c.rotation.x = -0.06 * j), (q = ce));
    },
    armTargets(ge, ce) {
      let P = i.spV.x > 0.3 || i.reload || i.hol > 0.12 ? 0 : 1;
      ((O += (P - O) * (1 - Math.exp(-16 * ce))),
        ge.r.p.copy(y.grip.p),
        ge.r.q.copy(y.grip.q),
        tn(ge.r.pose, y.grip.pose, y.trigger.pose, Ot(O)),
        (ge.r.trig = q * O));
      let D = Math.min(1, Math.max(0, i.spV.x)),
        B = Ot(Math.min(1, Math.max(0, i.adsV.x))),
        X = ol.ads;
      if (
        (ge.r.pole.fromArray(ol.poleR).lerp(Z.fromArray(ol.sprintPoleR), D).lerp(Z.fromArray(X.poleR), B),
        ge.r.sh.fromArray(ol.shR).lerp(Z.fromArray(ol.sprintShR), D).lerp(Z.fromArray(X.shR), B),
        ge.l.p.copy(G.p),
        ge.l.q.copy(G.q),
        ge.l.pose.set(G.busy ? G.pose : y.support.pose),
        (ge.l.trig = 0),
        ge.l.pole.fromArray(ol.poleL).lerp(Z.fromArray(X.poleL), B),
        ge.l.sh.fromArray(ol.shL).lerp(Z.fromArray(X.shL), B),
        ue > 0)
      )
        for (let re = 0; re < 4; re++) ge.r.pose[re] += (y.stop.pose[re] - ge.r.pose[re]) * ue;
    },
    snapArms() {
      O = i.spV.x > 0.3 || i.reload || i.hol > 0.12 ? 0 : 1;
    },
    setLocked(ge) {
      ((xe = !!ge), (d.visible = !ge), ge && (le = 9));
    },
    get locked() {
      return xe;
    },
    holds: y,
  };
  return me;
}

var Js = THREE.Vector3,
  UD = ['kZ', 'kP', 'kY', 'kR', 'kX', 'kU'],
  DS = [
    'kZ',
    'kP',
    'kY',
    'kR',
    'kX',
    'kU',
    'swY',
    'swP',
    'jY',
    'jP',
    'jR',
    'inZ',
    'inX',
    'inP',
    'inR',
    'bump',
    'antY',
    'antR',
    'amt',
    'wall',
  ],
  Hh = { p: [0.085, -0.34, 0.07], r: [-0.5, 0.22, -0.42] },
  LS = 1.25,
  O1 = Math.PI * 2,
  P5 = 0.965,
  FS = (n) => -(0.9 * Math.sin(n) + 0.318 * Math.sin(2 * n) + 0.1 * Math.sin(3 * n)) * 0.9416,
  NS = { walk: 1.55, sprint: 2.1, crouch: 1.05 };

async function I5(n) {
  let e = { brass: 4, glove_fabric: 3 },
    t = (B) => n.mats.get(B, { triplanar: !0, vertexColors: !0, scale: e[B] || 1 }),
    i = (B, X) => {
      let re = new THREE.Mesh(B, X);
      return ((re.castShadow = !1), (re.receiveShadow = !0), (re.frustumCulled = !1), re);
    },
    s = (B, X, re, Y, he) => {
      let V = new THREE.MeshStandardMaterial({
        color: new THREE.Color(X[0], X[1], X[2]),
        roughness: re,
        metalness: Y,
        vertexColors: !0,
      });
      return ((V.name = B), he >= 0 && _E(V, he), V);
    },
    o = {
      ano: s('pac9_anodised', [0.0085, 0.009, 0.0105], 0.4, 0.45, 0),
      plain: s('pac9_matte', [1, 1, 1], 0.92, 0, 4),
      steel: s('pac9_phosphate', [0.016, 0.016, 0.0165], 0.5, 0.7, 1),
      poly: s('pac9_polymer', [0.0125, 0.0128, 0.0135], 0.62, 0, 2),
      tan: s('pac9_polymer_tan', [0.105, 0.08, 0.05], 0.62, 0, 2),
      wood: s('ak47_wood', [0.22, 0.095, 0.038], 0.54, 0.02, 2),
      bakelite: s('ak47_bakelite', [0.28, 0.09, 0.038], 0.44, 0.04, 2),
      chrome: s('deagle_chrome', [0.46, 0.47, 0.49], 0.24, 0.88, 1),
      slide: s('pac4_nitride', [0.008, 0.0083, 0.0092], 0.36, 0.55, 0),
      dots: new THREE.MeshStandardMaterial({
        color: new THREE.Color(0.3, 0.42, 0.3),
        emissive: new THREE.Color(0.16, 0.5, 0.2),
        emissiveIntensity: 0.55,
        roughness: 0.35,
        metalness: 0,
      }),
      fab: t('glove_fabric'),
      brass: t('brass'),
    };
  o.dots.name = 'pac4_tritium';
  let r = n.rng && n.rng.fork ? n.rng.fork() : Math.random,
    a = {
      t: 0,
      cooldown: 0,
      prevFire: !1,
      dryDone: !1,
      fireQ: 0,
      autoReload: -1,
      reload: null,
      burst: 0,
      lastShot: -9,
      bloom: 0,
      heat: 0,
      smoke: 0,
      smokeTick: 0,
      adsLin: 0,
      adsE: 0,
      sprintT: 0,
      reloadW: 0,
      rackW: 0,
      finger: 0,
      flashT: 0,
      flashDur: 0.05,
      recPhase: 0,
      wasGround: !0,
      lastVy: 0,
      spreadS: 0.0125,
      idleT: 0,
      inspect: -1,
      hol: 0,
      adsWant: !1,
      spWant: !1,
      urgent: !1,
      antYT: 0,
      antRT: 0,
      gait: 0,
      gOffT: 0,
      gOff: pn(9, 1),
      stride: { x: 1.55, v: 0, w: 14, z: 1 },
      spd: 0,
      stepEv: 0,
      jumpEv: 0,
      landEv: -1,
      landSide: 1,
      lpR: 0,
      lpF: 0,
      breath: 0,
      exert: 0,
      wallT: 0,
      wallK: 0,
      adsV: pn(23, 0.75),
      adsS: pn(9, 1),
      spV: pn(17, 1),
      rwS: pn(45, 1),
      rkS: pn(45, 1),
      wall: pn(10, 1),
      amt: pn(13, 1),
      kZ: pn(44, 0.55),
      kP: pn(36, 0.5),
      kY: pn(30, 0.45),
      kR: pn(31, 0.42),
      kX: pn(40, 0.5),
      kU: pn(40, 0.5),
      swY: pn(13.5, 0.64),
      swP: pn(13.5, 0.64),
      jY: pn(20.5, 0.56),
      jP: pn(20.5, 0.56),
      jR: pn(20.5, 0.56),
      inZ: pn(15, 0.48),
      inX: pn(15, 0.48),
      inP: pn(15, 0.48),
      inR: pn(15, 0.48),
      stance: pn(13, 1),
      stance2: pn(5.5, 1),
      bump: pn(24.5, 0.61),
      antY: pn(50, 0.8),
      antR: pn(50, 0.8),
    };
  n.events &&
    n.events.on &&
    (n.events.on('player:step', () => {
      a.stepEv = 1;
    }),
    n.events.on('player:jump', () => {
      a.jumpEv = 1;
    }),
    n.events.on('player:land', (B) => {
      a.landEv = B && B.speed > 0 ? B.speed : 0;
    }));
  let l = {
    freeze: !1,
    pause: !1,
    reloadT: null,
    empty: !1,
    flash: !1,
    noFire: !1,
    ads: !1,
    sprint: !1,
    noIdle: !1,
  };
  l.S = a;
  let c = { t: 0, T: 0, empty: !1, rig: null, seated: !1, fresh: !1, f: null },
    u = { active: !1, phase: '', t: 0, fresh: !1, from: null, to: null };
  function f(B, X, re, Y) {
    if (B.t < re || B.f[X]) return !1;
    ((B.f[X] = 1), X === 'magin' && h(B));
    let he = { phase: X, empty: B.empty, weapon: B.rig.id };
    return (Y && Object.assign(he, Y), n.events.emit('weapon:reload', he), !0);
  }
  function h(B) {
    let X = B.rig.slot,
      re = Math.min(X.magSize - X.ammo, X.reserve);
    ((X.ammo += re), (X.reserve -= re), (B.seated = !0));
  }
  let p = vS(n, Ro),
    d = { G: n, S: a, mats: o, mk: i, rng: r, ev: f, arms: p },
    m = wS(d),
    x = zS(d),
    v = { rifle: m, pistol: x },
    y = [m, x];
  for (let B of y)
    (B.root.traverse((X) => {
      X.layers.set(Ro);
    }),
      (B.root.visible = !1),
      n.camera.add(B.root),
      console.log(
        `[weapon] ${B.name}: ${B.info.tris} tris, ${B.info.meshes} meshes (flash only while firing, hidden while holstered)`,
      ));
  console.log(`[weapon] arms: 2 x ${p.right.triCount} tris, 2 draw calls, shared by both weapons`);
  let b = m,
    g = !0,
    E = {
      state: 'idle',
      ads: 0,
      spread: 0.0125,
      debug: l,
      slots: [m.slot, x.slot],
      rigs: v,
      pending: null,
      arms: p,
      info: { tris: m.info.tris, meshes: m.info.meshes, pistol: x.info },
      update: O,
      reset: T,
      switchTo: U,
      swap() {
        return U((u.active ? u.to : b) === m ? 'pistol' : 'rifle');
      },
      equip(B) {
        v[B] && (I(), (u.active = !1), (E.pending = null), (a.hol = 0), _(v[B]), p.snap());
      },
      setVisible(B) {
        ((g = !!B), (b.root.visible = g), p.setVisible(g));
      },
      muzzleWorld: S,
      reloadNow: z,
      addAmmo(B) {
        b.slot.reserve += B;
      },
      setWetness(B) {
        iy.value = kh.value = Math.max(0, Math.min(1, +B || 0));
      },
      snap() {
        let B = n.player,
          X = (!!B.sprinting || l.sprint) && !n.input.fire && !n.input.ads && !a.reload;
        ((a.adsLin = (n.input.ads || l.ads) && !u.active ? 1 : 0),
          (a.adsE = Ot(a.adsLin)),
          (E.ads = a.adsE),
          (a.adsWant = a.adsLin > 0),
          (a.sprintT = X ? 1 : 0),
          (a.spWant = X));
        for (let re of DS) Xn(a[re]);
        (Xn(a.adsV, a.adsLin),
          Xn(a.adsS, a.adsLin),
          Xn(a.spV, a.sprintT),
          Xn(a.rwS, a.reloadW),
          Xn(a.rkS, a.rackW),
          (a.lpR = 0),
          (a.lpF = 0),
          (a.gait += a.gOff.x),
          Xn(a.gOff),
          (a.gOffT = 0),
          (a.stepEv = 0),
          (a.jumpEv = 0),
          (a.landEv = -1),
          (a.wasGround = B.onGround !== !1),
          Xn(a.stance, B.crouching ? 1 : 0),
          Xn(a.stance2, B.crouching ? 1 : 0),
          (a.wallK = 0),
          (a.antYT = 0),
          (a.antRT = 0));
        for (let re of y) re.snapArms && re.snapArms();
        p.snap();
      },
      view: 1,
      setView: M,
    };
  function M(B) {
    ((B = Math.max(1, Math.min(3, Math.round(+B) || 1))), (E.view = B));
    for (let X of y) X.setView && X.setView(B - 1);
    return B;
  }
  Object.defineProperties(E, {
    name: { enumerable: !0, get: () => b.slot.name },
    ammo: {
      enumerable: !0,
      get: () => b.slot.ammo,
      set: (B) => {
        b.slot.ammo = B;
      },
    },
    magSize: { enumerable: !0, get: () => b.slot.magSize },
    reserve: {
      enumerable: !0,
      get: () => b.slot.reserve,
      set: (B) => {
        b.slot.reserve = B;
      },
    },
    damage: { enumerable: !0, get: () => b.def.damage },
    rpm: { enumerable: !0, get: () => b.def.rpm },
    current: { enumerable: !0, get: () => b.id },
    root: { enumerable: !0, get: () => b.root },
  });
  function _(B) {
    (b.flash && (b.flash.visible = !1), (b.root.visible = !1), (b = B), (b.root.visible = g));
    let X = B.motion;
    for (let re of UD) ((a[re].w = X.recoil.spr[re][0]), (a[re].z = X.recoil.spr[re][1]), Xn(a[re]));
    for (let re of ['swY', 'swP']) ((a[re].w = X.sway.spr[0]), (a[re].z = X.sway.spr[1]));
    for (let re of ['jY', 'jP', 'jR']) ((a[re].w = X.air.spr[0]), (a[re].z = X.air.spr[1]));
    for (let re of ['inZ', 'inX', 'inP', 'inR']) ((a[re].w = X.inertia.spr[0]), (a[re].z = X.inertia.spr[1]));
    (Xn(a.adsV),
      Xn(a.adsS),
      Xn(a.rwS),
      Xn(a.rkS),
      Xn(a.antY),
      Xn(a.antR),
      (a.antYT = 0),
      (a.antRT = 0),
      (a.adsWant = !1),
      (a.reloadW = 0),
      (a.rackW = 0),
      (a.cooldown = 0),
      (a.fireQ = 0),
      (a.dryDone = !1),
      (a.burst = 0),
      (a.bloom = 0),
      (a.heat = 0),
      (a.smoke = 0),
      (a.flashT = 0),
      (a.finger = 0),
      (a.adsLin = 0),
      (a.adsE = 0),
      (a.inspect = -1),
      (a.idleT = 0),
      (a.autoReload = -1));
  }
  function T() {
    (j(), p.snap());
    for (let B of y)
      ((B.slot.ammo = B.def.magSize),
        (B.slot.reserve = B.def.reserve),
        B.reset(),
        B.flash && (B.flash.visible = !1));
    ((a.reload = null),
      (u.active = !1),
      (E.pending = null),
      (E.state = 'idle'),
      (E.ads = 0),
      Object.assign(a, {
        prevFire: !1,
        lastShot: -9,
        sprintT: 0,
        reloadW: 0,
        rackW: 0,
        hol: 0,
        gait: 0,
        gOffT: 0,
        spd: 0,
        stepEv: 0,
        jumpEv: 0,
        landEv: -1,
        lpR: 0,
        lpF: 0,
        exert: 0,
        wallK: 0,
        wasGround: !0,
      }));
    for (let B of DS) Xn(a[B]);
    (Xn(a.spV), Xn(a.stance), Xn(a.stance2), Xn(a.gOff), Xn(a.stride, NS.walk), _(m));
  }
  function w(B, X) {
    let re = b.root;
    (re.updateMatrix(), X.fromArray(B).applyMatrix4(re.matrix));
    let Y = n.camera,
      he = Math.tan((Y.fov * Math.PI) / 360) / Math.tan((n.viewCamera.fov * Math.PI) / 360);
    return ((X.x *= he), (X.y *= he), X.applyQuaternion(Y.quaternion).add(Y.position));
  }
  function S(B = new Js()) {
    return w(b.muzzle, B);
  }
  function R(B) {
    ((c.t = 0),
      (c.fresh = !0),
      (c.T = b.reloadTime(B)),
      (c.empty = B),
      (c.rig = b),
      (c.seated = !1),
      (c.f = {}),
      (a.reload = c),
      (a.autoReload = -1));
  }
  function z() {
    let B = b.slot;
    return a.reload || u.active || B.ammo >= B.magSize || B.reserve <= 0
      ? !1
      : (R(B.ammo <= 0),
        n.events.emit('weapon:reload', { phase: 'start', empty: c.empty, weapon: b.id }),
        !0);
  }
  function I() {
    if (!a.reload) return;
    let B = a.reload;
    ((a.reload = null), p.blend(0.22), B.rig.cancelReload(B.seated));
  }
  function L(B, X, re) {
    (I(),
      (a.autoReload = -1),
      (a.inspect = -1),
      (a.fireQ = 0),
      (u.active = !0),
      (u.phase = 'holster'),
      (u.t = re),
      (u.fresh = !0),
      (u.from = B),
      (u.to = X),
      (E.pending = X.id),
      n.events.emit('weapon:switch', { from: B.id, to: X.id, phase: 'holster' }));
  }
  function U(B) {
    let X = v[B];
    return X
      ? u.active
        ? u.phase === 'holster'
          ? u.to === X
            ? !1
            : ((u.to = X), (E.pending = X.id), !0)
          : X === b
            ? !1
            : (L(b, X, oa.holster * (1 - Is(u.t / oa.draw))), !0)
        : X === b
          ? !1
          : (L(b, X, 0), !0)
      : !1;
  }
  function k(B) {
    if ((u.fresh ? (u.fresh = !1) : (u.t += B), u.phase === 'holster'))
      if (u.t >= oa.holster) {
        let X = u.from;
        (p.blend(0.13),
          _(u.to),
          (u.phase = 'draw'),
          (u.t = Math.min(u.t - oa.holster, oa.draw * 0.5)),
          n.events.emit('weapon:switch', { from: X.id, to: b.id, phase: 'draw' }),
          (a.hol = 1 - oy(u.t / oa.draw, LS)));
      } else a.hol = CE(u.t / oa.holster);
    else
      u.t >= oa.draw
        ? ((u.active = !1), (E.pending = null), (a.hol = 0))
        : (a.hol = 1 - oy(u.t / oa.draw, LS));
  }
  let C = new Js(),
    A = new Js(),
    F = new Js(),
    H = new Js(),
    N = new Js(),
    Z = new Js();
  function Q() {
    let B = n.player,
      X = n.camera,
      re = b,
      Y = re.def;
    (re.slot.ammo--, a.burst++, (a.lastShot = a.t), (a.heat = Math.min(1.3, a.heat + 0.05)));
    let he = E.spread,
      V = r() * Math.PI * 2,
      ne = Math.tan(he) * Math.sqrt(r());
    (C.set(Math.cos(V) * ne, Math.sin(V) * ne, -1)
      .normalize()
      .applyQuaternion(X.quaternion),
      Z.copy(B.eye || X.position));
    let ye = null;
    try {
      ye = n.combat.playerShot(Z, C, { damage: Y.damage, range: Y.range });
    } catch {}
    (ye && ye.point ? F.copy(ye.point) : F.copy(Z).addScaledVector(C, Y.range), S(A));
    let Te = n.fx;
    (Te &&
      (Te.tracer && Te.tracer(A, F),
      Te.shell &&
        (w(re.eject, H),
        N.set(2 + r() * 1.2, 1.2 + r() * 0.8, 0.5 - r() * 0.6).applyQuaternion(X.quaternion),
        B.vel && N.add(B.vel),
        Te.shell(H, N))),
      n.render && n.render.lightPool && n.render.lightPool.flash(A, 16756832, Y.flashLight, 9, 0.05),
      n.events.emit('weapon:fire', { origin: Z, dir: C, muzzle: A, ads: a.adsE, weapon: re.id }),
      re.recoil(a.burst, u0(1, 0.55, a.adsE) * (B.crouching ? 0.85 : 1), B),
      (a.bloom = Math.min(1, a.bloom + Y.spread.shot)),
      (a.flashT = a.flashDur = 0.036 + r() * 0.02));
    let Re = re.flash,
      Ue = Re.material.uniforms;
    ((Ue.uSeed.value = r() * 100),
      (Ue.uJet.value = (0.6 + r() * 0.6) * (Y.auto ? 1 : 0.25)),
      (Re.rotation.z = (r() - 0.5) * 0.4));
    let Ve = (0.8 + r() * 0.5) * u0(1, 0.62, a.adsE) * Y.flashScale;
    (Re.scale.set(Ve, Ve, Ve * (0.8 + r() * 0.5)), re.shot(re.slot.ammo <= 0));
  }
  let W = {
      active: !1,
      rig: null,
      t: 0,
      vel: new Js(),
      w: new Js(),
      rest: !1,
      sunk: !1,
      bounces: 0,
      qRest: new THREE.Quaternion(),
      heard: 0,
    },
    J = new THREE.Quaternion(),
    G = new Js(),
    te = new THREE.Euler();
  function oe() {
    if (W.active || !g || !b.root.visible) return;
    let B = b,
      X = B.root,
      re = n.camera,
      Y = n.player;
    (I(),
      (u.active = !1),
      (E.pending = null),
      B.flash && (B.flash.visible = !1),
      re.updateMatrixWorld(!0),
      X.updateMatrixWorld(!0),
      p.startDrop(r));
    let he = Math.tan((re.fov * Math.PI) / 360) / Math.tan((n.viewCamera.fov * Math.PI) / 360);
    (G.copy(X.position),
      (G.z /= he),
      G.applyQuaternion(re.quaternion).add(re.position),
      J.copy(re.quaternion).multiply(X.quaternion),
      n.scene.add(X),
      X.position.copy(G),
      X.quaternion.copy(J),
      X.traverse((V) => {
        (V.layers.set(Ia), V.isMesh && (V.castShadow = V !== B.flash));
      }),
      W.vel.set(0.35 + r() * 0.3, 0.5, -0.5 - r() * 0.4).applyQuaternion(re.quaternion),
      Y && Y.vel && W.vel.addScaledVector(Y.vel, 0.6),
      W.w.set(2.2 + r() * 1.5, (r() - 0.5) * 3, -(3 + r() * 2)),
      Object.assign(W, { active: !0, rig: B, t: 0, rest: !1, sunk: !1, bounces: 0, heard: 0 }),
      (E.state = 'dropped'),
      n.events.emit('weapon:dropped', { weapon: B.id, pos: X.position }));
  }
  function ee(B, X) {
    if (!n.audio || !n.audio.play || W.heard > 3) return;
    W.heard++;
    let re = Math.min(1.4, 0.35 + X * 0.28);
    try {
      (n.audio.play('shell_bounce_metal', { pos: B.position, gain: re * 1.3, pitch: 0.42 + r() * 0.08 }),
        n.audio.play('reload_magout', { pos: B.position, gain: re, pitch: 0.7 + r() * 0.1 }));
    } catch {}
  }
  function le(B) {
    if (!W.active) return;
    ((W.t += B), p.dropUpdate(B));
    let X = W.rig.root;
    if (W.rest || W.sunk) return;
    let re = Math.max(1, Math.ceil(B / 0.012)),
      Y = B / re;
    for (let he = 0; he < re; he++) {
      W.vel.y -= 13.5 * Y;
      let V = Math.hypot(W.vel.x, W.vel.z);
      if (V > 0.05) {
        G.set(W.vel.x / V, 0, W.vel.z / V);
        let Te = null;
        try {
          Te = n.physics.raycast(X.position, G, V * Y + 0.12);
        } catch {
          Te = null;
        }
        Te && ((W.vel.x *= -0.2), (W.vel.z *= -0.2));
      }
      (X.position.addScaledVector(W.vel, Y),
        te.set(W.w.x * Y, W.w.y * Y, W.w.z * Y),
        J.setFromEuler(te),
        X.quaternion.multiply(J));
      let ne = 0;
      try {
        ne = n.physics.groundHeight(X.position.x, X.position.z, X.position.y + 0.4);
      } catch {
        ne = 0;
      }
      if (!(ne > -1.5)) {
        if (X.position.y < -1.7) {
          ((W.sunk = !0), (X.visible = !1));
          try {
            n.fx.splash && n.fx.splash(X.position, 0.8);
          } catch {}
        }
        continue;
      }
      let ye = 0.045;
      if (X.position.y < ne + ye && W.vel.y < 0) {
        X.position.y = ne + ye;
        let Te = -W.vel.y;
        if ((ee(X, Te), W.bounces++, Te < 1.1 || W.bounces >= 3)) {
          G.set(0, 0, -1).applyQuaternion(X.quaternion);
          let Re = Math.atan2(-G.x, -G.z),
            Ue = new Js(1, 0, 0).applyQuaternion(X.quaternion).y > 0 ? 1 : -1;
          (W.qRest.setFromEuler(te.set(0, Re, Ue * (Math.PI / 2 - 0.06), 'YXZ')),
            (W.rest = !0),
            (W.restT = 0),
            W.vel.set(0, 0, 0));
          break;
        }
        ((W.vel.y = Te * 0.3),
          (W.vel.x *= 0.55),
          (W.vel.z *= 0.55),
          W.w.multiplyScalar(0.55),
          (W.w.x += (r() - 0.5) * 3));
      }
    }
  }
  function xe(B) {
    if (!W.active || !W.rest || W.sunk || ((W.restT += B), W.restT > 0.5)) return;
    let X = W.rig.root;
    X.quaternion.slerp(W.qRest, 1 - Math.exp(-16 * B));
    let re = 0;
    try {
      re = n.physics.groundHeight(X.position.x, X.position.z, X.position.y + 0.4);
    } catch {
      re = 0;
    }
    X.position.y = j0(X.position.y, re + 0.024, 18, B);
  }
  function j() {
    if (!W.active) return;
    let B = W.rig,
      X = B.root;
    (n.camera.add(X),
      X.scale.set(1, 1, 1),
      p.restore(),
      X.traverse((re) => {
        (re.layers.set(Ro), re.isMesh && (re.castShadow = !1));
      }),
      (X.visible = !1),
      (W.active = !1),
      (W.rig = null));
  }
  function O(B) {
    let X = n.player,
      re = n.input;
    if ((X && re && !X.alive && !l.pause && (W.active || oe(), le(B), xe(B)), !X || !re || !X.alive)) {
      ((a.prevFire = !1), b.flash && (b.flash.visible = !1));
      return;
    }
    if (l.pause) return;
    ((a.t += B),
      re.pressed &&
        (re.pressed('swap')
          ? E.swap()
          : re.pressed('weapon1')
            ? U('rifle')
            : re.pressed('weapon2') && U('pistol')),
      u.active && k(B));
    let Y = b,
      he = Y.def,
      V = Y.slot,
      ne = u.active,
      ye = !!re.fire && g && !l.noFire,
      Te = ye && !a.prevFire;
    ((a.prevFire = ye), ye || (a.dryDone = !1));
    let Re = (!!X.sprinting || l.sprint) && !ye && !re.ads && !a.reload;
    if (
      ((a.sprintT = j0(a.sprintT, Re ? 1 : 0, 9, B)),
      (a.spWant = Re),
      (a.urgent = !Re && (ye || !!re.ads || !!a.reload)),
      re.pressed && re.pressed('reload') && z(),
      a.autoReload >= 0 && ((a.autoReload -= B), a.autoReload < 0 && z()),
      l.reloadT != null && !a.reload && R(l.empty),
      a.reload)
    ) {
      let $e = a.reload;
      (l.reloadT != null ? ($e.t = l.reloadT) : $e.fresh ? ($e.fresh = !1) : ($e.t += B),
        Y.reload($e, $e.t),
        $e.t >= $e.T &&
          l.reloadT == null &&
          ((a.reload = null),
          (a.reloadW = 0),
          (a.rackW = 0),
          (a.antYT = 0),
          (a.antRT = 0),
          Y.endReload(),
          n.events.emit('weapon:reload', { phase: 'done', empty: $e.empty, weapon: Y.id })));
    } else ((a.reloadW = 0), (a.rackW = 0), (a.antYT = 0), (a.antRT = 0));
    a.cooldown -= B;
    let Ue = !a.reload && !ne && a.sprintT < 0.45;
    if (he.auto) {
      if (ye && Ue)
        if (V.ammo > 0) {
          let $e = 0;
          for (; a.cooldown <= 0 && V.ammo > 0 && $e < 3;) (Q(), (a.cooldown += 60 / he.rpm), $e++);
        } else
          a.dryDone ||
            ((a.dryDone = !0),
            n.events.emit('weapon:dry', { weapon: Y.id }),
            (a.bump.v -= 0.08),
            V.reserve > 0 && (a.autoReload = 0.32));
    } else
      (Te ? (a.fireQ = 0.13) : a.fireQ > 0 && (a.fireQ -= B),
        a.fireQ > 0 &&
          Ue &&
          a.cooldown <= 0 &&
          ((a.fireQ = 0),
          V.ammo > 0
            ? (Q(), (a.cooldown = 60 / he.rpm))
            : (n.events.emit('weapon:dry', { weapon: Y.id }),
              (a.bump.v -= 0.08),
              (a.cooldown = 0.12),
              V.reserve > 0 && (a.autoReload = 0.28))));
    (a.cooldown < 0 && (a.cooldown = Math.max(a.cooldown, -0.001)),
      a.t - a.lastShot > 0.24 && (a.burst > 0 && (a.recPhase = r() * 6.28), (a.burst = 0)),
      (a.bloom = Math.max(0, a.bloom - B * he.spread.decay)),
      he.smoke &&
        a.t - a.lastShot > 0.11 &&
        a.t - a.lastShot < 0.11 + B * 1.5 &&
        a.heat > 0.4 &&
        (a.smoke = Math.min(1.6, a.heat * 1.3)),
      a.smoke > 0 &&
        ((a.smoke -= B),
        (a.smokeTick -= B),
        a.smokeTick <= 0 &&
          n.fx &&
          n.fx.smoke &&
          ((a.smokeTick = 0.085),
          S(A),
          n.fx.smoke(A, { size: 0.1 + a.smoke * 0.06, life: 1.3, rise: 0.5, count: 1, alpha: 0.22 }))),
      (a.heat = Math.max(0, a.heat - B * 0.2)));
    let Ve = (!!re.ads || l.ads) && !a.reload && !ne && a.sprintT < 0.35;
    ((a.adsLin = Hn(a.adsLin + (Ve ? B : -B) / he.adsTime, 0, 1)),
      (a.adsE = Ot(a.adsLin)),
      (E.ads = a.adsE),
      (a.adsWant = Ve));
    let ze = X.speed || 0,
      Ge = Is(ze / 6),
      _e = he.spread,
      Ne =
        u0(_e.hip, _e.ads, a.adsE) +
        Ge * u0(_e.moveHip, _e.moveAds, a.adsE) +
        a.bloom * u0(_e.bloomHip, _e.bloomAds, a.adsE) +
        (X.onGround === !1 ? _e.air : 0) -
        (X.crouching ? _e.crouch * (1 - a.adsE) : 0);
    ((a.spreadS = j0(a.spreadS, Ne, 18, B)),
      (E.spread = a.spreadS),
      ye ||
      !!re.ads ||
      !!a.reload ||
      ne ||
      ze > 0.2 ||
      (re.look && Math.abs(re.look.dx) + Math.abs(re.look.dy) > 0.002) ||
      a.sprintT > 0.1
        ? ((a.idleT = 0), a.inspect >= 0 && (a.inspect = Math.max(a.inspect, 2.9)))
        : (a.idleT += B),
      he.inspect && a.inspect < 0 && a.idleT > 24 && (a.inspect = 0));
    let je = 0,
      Ze = 0,
      qe = 0;
    if (a.inspect >= 0) {
      let $e = (a.inspect += B);
      ((je = Ot($e / 0.5) * (1 - Ot(($e - 1.4) / 0.5))),
        (Ze = Ot(($e - 1.5) / 0.5) * (1 - Ot(($e - 2.8) / 0.5))),
        (qe = Ot($e / 0.5) * (1 - Ot(($e - 2.9) / 0.5))),
        $e > 3.5 && ((a.inspect = -1), (a.idleT = 0)));
    }
    ((E.state = ne
      ? 'switching'
      : a.reload
        ? 'reloading'
        : a.inspect >= 0
          ? 'inspect'
          : a.sprintT > 0.5
            ? 'sprinting'
            : a.t - a.lastShot < 0.14
              ? 'firing'
              : 'idle'),
      (a.finger = j0(a.finger, (ye && Ue) || l.flash ? 1 : 0, 30, B)),
      Y.parts(B, a.finger, !!a.reload));
    let Oe = Y.flash,
      mt = Oe.material.uniforms;
    if (
      (l.flash && ((a.flashT = a.flashDur = 0.05), (mt.uSeed.value = 3.7), Oe.scale.setScalar(he.flashScale)),
      (a.flashT -= B),
      l.flash && (a.flashT = a.flashDur * 0.6),
      (mt.uInt.value = a.flashT > 0 ? 9.5 * Math.sqrt(a.flashT / a.flashDur) : a.lastShot === a.t ? 4.5 : 0),
      (mt.uHeat.value = he.smoke ? Is((a.heat - 0.45) / 0.8) * 2.2 : 0),
      (Oe.visible = mt.uInt.value > 0 || mt.uHeat.value > 0.02),
      l.freeze)
    ) {
      p.update(B, Y, Y.root);
      return;
    }
    (D(Math.min(B, 0.1), Y, X, re, je, Ze, qe), p.update(B, Y, Y.root));
  }
  let q = new THREE.Quaternion(),
    ue = new THREE.Quaternion(),
    de = new THREE.Euler(),
    $ = new Js(),
    se = new Js(),
    fe = new Js(),
    me = (B) => B * (0.35 + 0.65 * Math.abs(B)),
    ge = (B) => B * (1.6 - 0.6 * Math.abs(B)),
    ce = (B) => B * (1.45 - 0.45 * Math.abs(B)),
    P = (B, X) => {
      Math.abs(B.x - X) < 1e-5 && Math.abs(B.v) < 1e-4 && Xn(B, X);
    };
  function D(B, X, re, Y, he, V, ne) {
    let ye = X.motion,
      Te = X.pose,
      Re = Te.HIP,
      Ue = Te.ADS,
      Ve = Te.SPRINT,
      ze = Te.SPRINT_ARC,
      Ge = Te.RELOAD,
      _e = Te.RACK,
      Ne = ye.ads.arc,
      ke = ye.wall,
      je = re.onGround !== !1,
      Ze = re.speed || 0,
      qe = re.vel ? re.vel.x : 0,
      Oe = re.vel ? re.vel.y : 0,
      mt = re.vel ? re.vel.z : 0,
      $e = a.t;
    (en(a.adsV, a.adsWant ? 1 : 0, B, ye.ads.w, ye.ads.z),
      P(a.adsV, a.adsWant ? 1 : 0),
      en(a.adsS, a.adsWant ? 1 : 0, B),
      P(a.adsS, a.adsWant ? 1 : 0));
    let Ke = a.adsS.x - a.adsV.x,
      Bt = Ke > 0 ? Ke * Ke * ye.ads.out : 0;
    (en(a.spV, a.spWant ? 1 : 0, B, ye.sprint.spr[0] * (a.urgent ? 1.5 : 1), ye.sprint.spr[1]),
      P(a.spV, a.spWant ? 1 : 0),
      en(a.rwS, a.reloadW, B),
      P(a.rwS, a.reloadW),
      en(a.rkS, a.rackW, B),
      P(a.rkS, a.rackW));
    let Gt = a.adsV.x,
      vi = Is(Gt),
      q0 = vi * vi * (3 - 2 * vi),
      yi = 4 * Gt * (1 - Gt),
      sn = a.spV.x,
      P0 = 4 * sn * (1 - sn),
      $t = a.rwS.x,
      Sn = a.rkS.x,
      bi = a.hol,
      oi = ge(bi),
      xn = me(bi),
      Zt = ce(bi);
    if (((a.wallT -= B), a.wallT <= 0 && n.physics && n.physics.raycast && re.forward && re.eye)) {
      a.wallT = 0.08;
      let pe = null;
      try {
        pe = n.physics.raycast(re.eye, re.forward, ke.far);
      } catch {
        pe = null;
      }
      a.wallK = pe ? Ot((ke.far - pe.dist) / (ke.far - ke.near)) : 0;
    }
    (en(a.wall, a.wallK, B), P(a.wall, a.wallK));
    let Vs = a.wall.x * (1 - 0.85 * q0) * (1 - Is(bi * bi)),
      ws =
        Re.p[0] +
        (Ue.p[0] - Re.p[0]) * Gt +
        Ne.p[0] * yi +
        Ve.p[0] * sn +
        ze.p[0] * P0 +
        Ge.p[0] * $t +
        _e.p[0] * Sn +
        Hh.p[0] * oi +
        ke.p[0] * Vs -
        0.035 * ne,
      cl =
        Re.p[1] +
        (Ue.p[1] - Re.p[1]) * Gt +
        Ne.p[1] * yi +
        Ve.p[1] * sn +
        ze.p[1] * P0 +
        Ge.p[1] * $t +
        _e.p[1] * Sn +
        Hh.p[1] * xn +
        ke.p[1] * Vs +
        0.045 * ne,
      I0 =
        Re.p[2] +
        (Ue.p[2] - Re.p[2]) * Gt +
        Ne.p[2] * yi +
        Ve.p[2] * sn +
        ze.p[2] * P0 +
        Ge.p[2] * $t +
        _e.p[2] * Sn +
        Hh.p[2] * oi +
        ke.p[2] * Vs,
      Kt =
        Re.r[0] * (1 - Gt) +
        Ne.r[0] * yi +
        Ve.r[0] * sn +
        ze.r[0] * P0 +
        Ge.r[0] * $t +
        _e.r[0] * Sn +
        Hh.r[0] * Zt +
        ke.r[0] * Vs +
        0.3 * ne,
      be =
        Re.r[1] * (1 - Gt) +
        Ne.r[1] * yi +
        Ve.r[1] * sn +
        ze.r[1] * P0 +
        Ge.r[1] * $t +
        _e.r[1] * Sn +
        Hh.r[1] * Zt +
        ke.r[1] * Vs +
        0.18 * ne +
        0.25 * V,
      Le =
        Re.r[2] * (1 - Gt) +
        Ne.r[2] * yi +
        Ve.r[2] * sn +
        ze.r[2] * P0 +
        Ge.r[2] * $t +
        _e.r[2] * Sn +
        Hh.r[2] * Zt +
        ke.r[2] * Vs -
        0.75 * he +
        0.55 * V,
      Fe = 0,
      He = 0,
      De = 0,
      ve = 0,
      we = 0,
      Ae = 0,
      ie = u0(1, ye.ads.pos, q0),
      ae = u0(1, ye.ads.rot, q0);
    if (!l.noIdle) {
      let pe = ye.idle,
        Ee = a.exert,
        Me = ie * (1 - 0.5 * sn),
        Ie = ae;
      ((a.exert = j0(a.exert, re.sprinting ? 1 : 0, re.sprinting ? 0.3 : 0.14, B)),
        (a.breath += B * O1 * pe.hz * (1 + 0.5 * Ee) * (1 + 0.1 * sa($e * 0.11, 3))),
        a.breath > 4096 && (a.breath -= 651 * O1));
      let Ce = a.breath,
        Ye = (1 + 0.9 * Ee) * (1 + 0.2 * sa($e * 0.07, 5)),
        rt = (Math.sin(Ce) + 0.24 * Math.sin(2 * Ce + 0.7)) * Ye,
        Be = (Math.sin(Ce - 0.6) + 0.2 * Math.sin(2 * Ce + 0.2)) * Ye,
        _t = 1.4 * sa($e * 0.09, 7),
        wt = 1.4 * sa($e * 0.08, 8);
      ((Fe +=
        (Math.sin($e * 0.53 + _t) * pe.drift + rt * pe.breathY * 0.15 + sa($e * 2.3, 12) * pe.noise) * Me),
        (He +=
          (rt * pe.breathY + Math.sin($e * 0.83 + 1.7 + wt) * pe.drift * 0.6 + sa($e * 1.9, 11) * pe.noise) *
          Me),
        (ve +=
          (Be * pe.breathP +
            Math.sin($e * 0.41 + 0.9 + wt) * pe.driftR * 0.5 +
            sa($e * 1.6, 13) * pe.noiseR) *
          Ie),
        (we += (Math.sin($e * 0.37 + 2.2 + _t) * pe.driftR + sa($e * 1.3, 14) * pe.noiseR) * Ie),
        (Ae += (Math.sin($e * 0.29 + 0.4 - _t) * pe.driftR * 0.8 + sa($e * 1.1, 15) * pe.noiseR) * Ie));
    }
    {
      let pe = re.tuning && re.tuning.stride ? re.tuning.stride : NS,
        Ee = en(a.stride, re.crouching ? pe.crouch : re.sprinting ? pe.sprint : pe.walk, B);
      a.spd = j0(a.spd, Ze, 14, B);
      let Me = a.gait + a.gOff.x;
      if (je) {
        let Tn = Is(Ze / 0.5);
        a.gait += (Tn * Ze * B) / Ee - (((1 - Tn) * Math.sin(O1 * Me)) / O1) * (1 - Math.exp(-8 * B));
      }
      if (a.landEv >= 0 || (!a.wasGround && je)) a.gOffT += Math.floor(Me) + 0.35 - Me;
      else if (a.stepEv) {
        let Tn = (Ze * B) / Ee,
          ri = Math.round(Me) - Me - Tn * 0.5;
        Math.abs(ri) > 0.55 * Tn && (a.gOffT += ri - (a.gOffT - a.gOff.x));
      }
      ((a.stepEv = 0),
        en(a.gOff, a.gOffT, B),
        a.gait > 2048 && (a.gait -= 2048),
        en(a.amt, je ? Math.pow(Is(Ze / 3.8), 0.8) * (re.crouching ? ye.crouch : 1) : 0, B));
      let Ie = ye.walk,
        Ce = ye.run,
        Ye = a.amt.x,
        rt = a.gait + a.gOff.x - (u0(Ie.lag, Ce.lag, sn) * a.spd) / Ee,
        Be = O1 * rt - P5,
        _t = Math.PI * rt,
        wt = Ye * u0(1, 0.14, q0),
        z0 = Ye * u0(1, 0.05, q0),
        Pi = FS(Be),
        Lt = Math.sin(_t) + 0.16 * Math.sin(3 * _t + 0.5),
        o0 = Math.sin(Be + P5 + 2.2) + 0.25 * Math.sin(_t + 0.4),
        g0 = FS(Be - 0.55),
        M0 = Math.sin(_t + 1.25) + 0.22 * Math.sin(Be + P5),
        on = Math.sin(_t + 0.35) + 0.25 * Math.sin(Be + P5 + 1);
      ((Fe += Lt * u0(Ie.x, Ce.x, sn) * wt),
        (He += Pi * u0(Ie.y, Ce.y, sn) * wt),
        (De += o0 * u0(Ie.z, Ce.z, sn) * wt),
        (ve += g0 * u0(Ie.pitch, Ce.pitch, sn) * z0),
        (we += M0 * u0(Ie.yaw, Ce.yaw, sn) * z0),
        (Ae += on * u0(Ie.roll, Ce.roll, sn) * z0));
    }
    {
      let pe = ye.inertia,
        Ee = re.yaw || 0,
        Me = Math.cos(Ee),
        Ie = Math.sin(Ee),
        Ce = qe * Me - mt * Ie,
        Ye = -qe * Ie - mt * Me,
        rt = 1 - Math.exp(-B / pe.tau);
      ((a.lpR += (Ce - a.lpR) * rt), (a.lpF += (Ye - a.lpF) * rt));
      let Be = Ce - a.lpR,
        _t = Ye - a.lpF,
        wt = u0(1, 0.3, q0),
        z0 = u0(1, 0.08, q0);
      ((De += en(a.inZ, _t * pe.z, B) * wt),
        (Fe += en(a.inX, -Be * pe.x, B) * wt),
        (ve += en(a.inP, _t * pe.pitch, B) * z0),
        (Ae += en(a.inR, -Be * pe.roll - a.lpR * pe.lean * (1 - sn), B) * z0));
    }
    {
      let pe = ye.sway,
        Ee = pe.spr[0] * pe.spr[0] * pe.lag,
        Me = pe.max * 2.5;
      ((a.swY.v += Hn(Y.look ? Y.look.dx : 0, -0.35, 0.35) * Ee),
        (a.swP.v += Hn(Y.look ? Y.look.dy : 0, -0.35, 0.35) * Ee * 0.8),
        en(a.swY, 0, B),
        en(a.swP, 0, B),
        (a.swY.x > Me || a.swY.x < -Me) && ((a.swY.x = Hn(a.swY.x, -Me, Me)), (a.swY.v = 0)),
        (a.swP.x > Me || a.swP.x < -Me) && ((a.swP.x = Hn(a.swP.x, -Me, Me)), (a.swP.v = 0)));
      let Ie = ry(a.swY.x, pe.max),
        Ce = ry(a.swP.x, pe.max * 0.75),
        Ye = u0(1, pe.adsRot, q0),
        rt = u0(1, pe.adsPos, q0);
      ((we += Ie * Ye),
        (Ae -= Ie * pe.roll * Ye),
        (ve += Ce * Ye),
        (Fe -= Ie * pe.shift * rt),
        (He += Ce * pe.shift * rt));
    }
    {
      let pe = ye.air,
        Ee = u0(1, 0.45, q0),
        Me = u0(1, 0.1, q0);
      if (
        (a.wasGround && !je && (a.jumpEv || Oe > 1) && ((a.jY.v += pe.jumpY), (a.jP.v += pe.jumpP)),
        !a.wasGround && je)
      ) {
        let rt = Hn(Math.max(a.landEv, -a.lastVy), 0, 14);
        ((a.landSide = -a.landSide),
          (a.jY.v -= rt * pe.landY),
          (a.jP.v -= rt * pe.landP),
          (a.jR.v += a.landSide * rt * pe.landR * (0.65 + 0.35 * r())));
      }
      ((a.wasGround = je), (a.jumpEv = 0), (a.landEv = -1), je || (a.lastVy = Oe));
      let Ie = ye.crouchDip,
        Ce = re.crouching ? 1 : 0,
        Ye = (en(a.stance, Ce, B, Ie.w[0], 1) - en(a.stance2, Ce, B, Ie.w[1], 1)) * 2.4;
      ((He -= Ye * Ie.y * Ee),
        (ve -= Ye * Ie.pitch * Me),
        (Ae += Ye * Ie.roll * Me),
        (He += en(a.jY, je ? 0 : Hn(-Oe * pe.fallY, -0.004, 0.016), B) * Ee),
        (ve += en(a.jP, je ? 0 : Hn(-Oe * pe.fallP, -0.02, 0.04), B) * Me),
        (Ae += en(a.jR, 0, B) * Me));
    }
    (en(a.kZ, 0, B),
      en(a.kP, 0, B),
      en(a.kY, 0, B),
      en(a.kR, 0, B),
      en(a.kX, 0, B),
      en(a.kU, 0, B),
      en(a.bump, 0, B),
      en(a.antY, a.antYT, B),
      en(a.antR, a.antRT, B),
      (ve += a.kP.x + a.bump.x * 1.5),
      (we += a.kY.x),
      (Ae += a.kR.x + a.antR.x),
      (He += a.bump.x * 0.6 + a.antY.x),
      q.setFromEuler(de.set(Kt, be, Le, 'YXZ')),
      ue.setFromEuler(de.set(ve, we, Ae, 'YXZ')),
      $.fromArray(ye.pivot),
      se.copy($).applyQuaternion(ue),
      $.sub(se),
      fe.set($.x + a.kX.x, $.y + a.kU.x, $.z + a.kZ.x - Bt).applyQuaternion(q),
      X.root.position.set(ws + Fe + fe.x, cl + He + fe.y, I0 + De + fe.z),
      X.root.quaternion.copy(q).multiply(ue));
  }
  if (
    (T(),
    n.params && n.params.wview && M(n.params.wview),
    typeof window < 'u' && n.params && n.params.shot && !n.showcase && window.__setShot)
  ) {
    let B = window.__setShot;
    window.__setShot = (X) => {
      if (
        (X && X.wview && M(X.wview),
        X && X.wfill && n.render && (n.render.viewFill = +X.wfill),
        X && (X.wgun || X.wpose))
      ) {
        l.pause = !1;
        let re = X.wgun === 'pistol' ? 'pistol' : 'rifle',
          Y = X.wpose || 'hip',
          he = Y === 'empty';
        ((a.reload = null),
          (l.reloadT = null),
          (l.empty = !1),
          (l.flash = Y === 'fire'),
          (l.ads = Y === 'ads' || !!X.wads),
          (l.sprint = Y === 'sprint'));
        for (let V of y) ((V.slot.ammo = V.def.magSize), V.reset());
        if (
          (E.equip(re),
          (he || Y === 'locked') && ((b.slot.ammo = 0), b.setLocked(!0)),
          (Y === 'reload' || he) && ((l.reloadT = X.wt != null ? +X.wt : 0.6), (l.empty = he)),
          E.snap(),
          O(0.016),
          E.snap(),
          Y === 'switch')
        ) {
          U(re === 'rifle' ? 'pistol' : 'rifle');
          let V = X.wt != null ? +X.wt : 0.14;
          for (let ne = 0; ne < V - 1e-6; ne += 0.005) O(0.005);
          l.pause = !0;
        }
      }
      B(X);
    };
  }
  return E;
}

async function BD(n) {
  let e = await I5(n);
  n.weapon = e;
  let t = new Js(0, 1.68, 4),
    i = {
      south: [0.28, -0.01, 1],
      east: [1, 0, 0.25],
      north: [-0.2, -0.01, -1],
      west: [-1, 0, 0.1],
      nw: [-0.75, -0.01, -0.65],
    },
    s = {
      rifle: {
        side: [Math.PI, [1.12, 1.3, 0.11], [0, 1.235, 0.11], 30],
        right: [0, [1.12, 1.3, -0.11], [0, 1.235, -0.11], 30],
        top: [Math.PI * 0.86, [0.62, 1.8, -0.42], [0, 1.24, 0.12], 32],
        hands: [Math.PI, [0.4, 1.4, 0.02], [0.02, 1.215, 0.25], 30],
        rhand: [0, [0.36, 1.22, 0.27], [0.03, 1.16, 0.09], 30],
        muzzle: [Math.PI, [0.26, 1.37, 0.98], [0, 1.262, 0.44], 30],
        optic: [Math.PI, [0.2, 1.4, -0.26], [0, 1.31, 0.02], 30],
        lower: [Math.PI, [0.34, 1.26, 0.04], [0, 1.2, 0.03], 30],
      },
      pistol: {
        side: [Math.PI, [0.5, 1.25, -0.03], [0, 1.215, -0.03], 30],
        right: [0, [0.5, 1.25, 0.03], [0, 1.215, 0.03], 30],
        top: [Math.PI * 0.86, [0.2, 1.56, -0.16], [0, 1.25, 0], 32],
        hands: [Math.PI * 0.8, [0.3, 1.36, -0.2], [0, 1.2, -0.01], 30],
        rear: [Math.PI * 0.93, [0.07, 1.33, -0.34], [0, 1.24, 0], 30],
        grip: [0, [0.28, 1.2, 0.16], [0, 1.19, 0.05], 30],
        under: [Math.PI, [0.26, 1.02, -0.16], [0, 1.17, -0.05], 30],
      },
    },
    o = window.__setShot,
    r = null;
  function a(c, u = {}) {
    let f = u.wgun === 'pistol' ? 'pistol' : 'rifle',
      h = s[f][c];
    ((r = c), u.wview && e.setView(u.wview));
    let p = n.input,
      d = n.player;
    ((p.ads = !1),
      (p.fire = !1),
      (d.sprinting = !1),
      (d.speed = 0),
      (e.debug.pause = !1),
      (e.debug.reloadT = null),
      (e.debug.flash = !1),
      (e.debug.empty = !1),
      (e.debug.freeze = !!h),
      e.arms.attach(null),
      e.reset(),
      e.equip(f));
    for (let E of Object.values(e.rigs)) (n.camera.add(E.root), E.root.traverse((M) => M.layers.set(Ro)));
    let m = e.root,
      x = e.rigs[f],
      v = (E, M) => {
        ((e.debug.reloadT = +E), (e.debug.empty = !!M), M && ((e.ammo = 0), x.setLocked(!0)));
      },
      y,
      b,
      g;
    if (h)
      (n.scene.add(m),
        m.position.set(0, 1.25, 0),
        m.rotation.set(0, h[0], 0, 'YXZ'),
        m.traverse((E) => E.layers.set(Ia)),
        e.arms.attach(m, x.pose.HIP, Ia),
        (y = h[1]),
        (b = h[2]),
        (g = h[3]),
        u.wt != null ? v(u.wt, !!u.wempty) : u.wempty && ((e.ammo = 0), x.setLocked(!0)));
    else {
      let E = i[u.wlook] || i.south;
      ((y = [t.x, t.y, t.z]),
        (b = [t.x + E[0] * 50, t.y + E[1] * 50, t.z + E[2] * 50]),
        (g = 74),
        c === 'ads' && ((p.ads = !0), (g = 52)),
        c === 'sprint' && ((d.sprinting = !0), (d.speed = 6)),
        c === 'fire' && ((e.debug.flash = !0), u.wads && ((p.ads = !0), (g = 52))),
        (c === 'reload' || c === 'empty') && v(u.wt != null ? u.wt : 0.62, c === 'empty'),
        c === 'locked' && ((e.ammo = 0), x.setLocked(!0), u.wads && ((p.ads = !0), (g = 52))));
    }
    if ((e.snap(), e.update(0.016), e.snap(), c === 'switch')) {
      e.switchTo(f === 'rifle' ? 'pistol' : 'rifle');
      let E = u.wt != null ? +u.wt : 0.14;
      for (let M = 0; M < E - 1e-6; M += 0.005) e.update(0.005);
      e.debug.pause = !0;
    }
    return (
      o && o({ cam: u.cam || [...y, ...b].join(','), fov: u.fov || g, exposure: u.exposure }),
      { cam: y, target: b }
    );
  }
  window.__setShot = (c) => {
    c && c.wpose ? a(c.wpose, c) : o && o(c);
  };
  let l = a(n.params.wpose || 'hip', n.params);
  return {
    cam: l.cam,
    target: l.target,
    update(c) {
      (e.update(c), r === 'fire' && (e.debug.flash = !0));
    },
  };
}

export { I5 };
