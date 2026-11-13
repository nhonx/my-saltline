// @ts-nocheck
import * as THREE from 'three';
import { T0, Z0, ar } from './core.js';
import { Ei } from './geometry.js';

var Wv = {};

ar(Wv, { create: () => f1, showcase: () => KP });

function Nv(n) {
  let i = new Float32Array(4096),
    s = n >>> 0,
    o = () => {
      ((s |= 0), (s = (s + 1831565813) | 0));
      let l = Math.imul(s ^ (s >>> 15), 1 | s);
      return ((l = (l + Math.imul(l ^ (l >>> 7), 61 | l)) ^ l), ((l ^ (l >>> 14)) >>> 0) / 4294967296);
    };
  for (let l = 0; l < 4096; l++) i[l] = o();
  let r = (l, c) => {
    let u = Math.floor(l),
      f = Math.floor(c),
      h = l - u,
      p = c - f;
    ((h = h * h * (3 - 2 * h)), (p = p * p * (3 - 2 * p)));
    let d = u & 63,
      m = (u + 1) & 63,
      x = (f & 63) * 64,
      v = ((f + 1) & 63) * 64,
      y = i[x + d],
      b = i[x + m],
      g = i[v + d],
      E = i[v + m];
    return y + (b - y) * h + (g - y + (y - b - g + E) * h) * p;
  };
  return {
    noise: r,
    fbm: (l, c, u = 4) => {
      let f = 0,
        h = 0.5,
        p = 0;
      for (let d = 0; d < u; d++)
        ((f += r(l, c) * h), (p += h), (l = l * 2.03 + 17.1), (c = c * 2.03 + 9.7), (h *= 0.5));
      return f / p;
    },
    rnd: o,
  };
}

var Do = (n, e, t) => {
    let i = (t - n) / (e - n);
    return ((i = i < 0 ? 0 : i > 1 ? 1 : i), i * i * (3 - 2 * i));
  },
  uh = 4,
  Wg = 2;

function qw(n = 128) {
  let e = n * uh,
    t = n * Wg,
    i = new Uint8Array(e * t * 4),
    s = Nv(9173),
    o = new Float32Array(n * n),
    r = new Float32Array(n * n),
    a = new Float32Array(n * n);
  for (let c = 0; c < uh * Wg; c++) {
    let u = c % uh,
      f = Math.floor(c / uh),
      h = c * 13.37 + 3.1,
      p = c * 7.77 + 1.3;
    for (let d = 0; d < n; d++)
      for (let m = 0; m < n; m++) {
        let x = ((m + 0.5) / n) * 2 - 1,
          v = ((d + 0.5) / n) * 2 - 1,
          y = 1 - Do(0.78, 0.98, Math.max(Math.abs(x), Math.abs(v))),
          b,
          g,
          E;
        if (c === 6) {
          let _ = v * 0.5 + 0.5,
            T = 0.16 + 0.5 * _ * _,
            w = (s.fbm(x * 2 + h, _ * 2 + p, 3) - 0.5) * 0.25,
            S = 1 - Do(T * 0.3, T, Math.abs(x + w * _)),
            R = s.fbm(x * 9 + h, _ * 2.2 + p, 4),
            z = 1 - Do(0.55, 0.95, _ - (s.noise(x * 6 + h, 3.3) - 0.5) * 0.35),
            I = Do(0, 0.12, _);
          ((b = S * z * I * Do(0.22, 0.7, R + 0.25 * (1 - _))), (g = S * z), (E = b * 0.5));
        } else {
          let _ = c === 7,
            T = _ ? 0.3 : 0.6,
            w = (s.fbm(x * 1.4 + h, v * 1.4 + p, 3) - 0.5) * T,
            S = (s.fbm(x * 1.4 + p + 5.2, v * 1.4 + h + 1.7, 3) - 0.5) * T,
            R = x + w,
            z = v + S,
            I = Math.sqrt(R * R + z * z),
            L = (s.fbm(R * 2.2 + h, z * 2.2 + p, 3) - 0.5) * 0.6,
            U = 1 - Do(0, _ ? 0.84 : 0.8, I + L),
            k = s.fbm(R * 4.2 + h * 2, z * 4.2 + p * 2, 5),
            C = U * (_ ? 0.8 + 0.7 * k : 0.25 + 1.5 * k);
          ((b = Do(_ ? 0.02 : 0.06, _ ? 0.7 : 0.95, C)),
            (g = U),
            (E = U * 0.55 + U * s.fbm(R * 3.1 + h * 3, z * 3.1 + p * 3, 3) * 0.9));
        }
        let M = d * n + m;
        ((r[M] = b * y), (a[M] = g), (o[M] = E * y));
      }
    for (let d = 0; d < n; d++)
      for (let m = 0; m < n; m++) {
        let x = Math.max(0, m - 2),
          v = Math.min(n - 1, m + 2),
          y = Math.max(0, d - 2),
          b = Math.min(n - 1, d + 2),
          g = ((o[d * n + v] - o[d * n + x]) * n) / 8,
          E = ((o[b * n + m] - o[y * n + m]) * n) / 8,
          M = 0.55,
          _ = -g * M,
          T = -E * M,
          w = 1 / Math.sqrt(_ * _ + T * T + 1);
        ((_ *= w), (T *= w));
        let S = ((f * n + d) * e + u * n + m) * 4,
          R = d * n + m;
        ((i[S] = Math.round((_ * 0.5 + 0.5) * 255)),
          (i[S + 1] = Math.round((T * 0.5 + 0.5) * 255)),
          (i[S + 2] = Math.min(255, a[R] * 255)),
          (i[S + 3] = Math.min(255, r[R] * 255)));
      }
  }
  let l = new THREE.DataTexture(i, e, t, THREE.RGBAFormat, THREE.UnsignedByteType);
  return (
    (l.magFilter = THREE.LinearFilter),
    (l.minFilter = THREE.LinearMipmapLinearFilter),
    (l.generateMipmaps = !0),
    (l.wrapS = l.wrapT = THREE.ClampToEdgeWrapping),
    (l.colorSpace = THREE.NoColorSpace),
    (l.needsUpdate = !0),
    l
  );
}

var c1 = 4,
  Uv = 2,
  mo = 0,
  Bv = 1,
  Gl = 2,
  HP = 3,
  Hv = 4,
  Gg = 5,
  fh = 6,
  qg = 7;

function Xw(n = 128) {
  let e = n * c1,
    t = n * Uv,
    i = new Uint8Array(e * t * 4),
    s = Nv(4441),
    o = [0, 1].map(() => {
      let a = 7 + Math.floor(s.rnd() * 4),
        l = [];
      for (let c = 0; c < a; c++)
        l.push({
          a: (c / a + (s.rnd() - 0.5) * 0.12) * Math.PI * 2,
          l: 0.35 + s.rnd() * 0.6,
          w: 0.018 + s.rnd() * 0.05,
          g: 0.5 + s.rnd() * 0.5,
        });
      return l;
    });
  for (let a = 0; a < 8; a++) {
    let l = a % c1,
      c = Math.floor(a / c1);
    for (let u = 0; u < n; u++)
      for (let f = 0; f < n; f++) {
        let h = ((f + 0.5) / n) * 2 - 1,
          p = ((u + 0.5) / n) * 2 - 1,
          d = Math.sqrt(h * h + p * p),
          m = 1 - Do(0.86, 0.99, Math.max(Math.abs(h), Math.abs(p))),
          x = 0;
        if (a === mo) {
          let b = Math.max(0, 1 - d);
          x = b * b * b * 0.75 + Math.exp(-d * d * 22) * 0.5;
        } else if (a === Bv) {
          let b = Math.pow(Math.max(0, 1 - h * h), 1.5);
          x = Math.exp(-(p * p) / (0.42 * 0.42)) * b;
        } else if (a === Gl || a === HP) {
          let b = o[a - Gl],
            g = Math.atan2(p, h);
          for (let E of b) {
            let M = Math.abs(g - E.a) % (Math.PI * 2);
            M > Math.PI && (M = Math.PI * 2 - M);
            let _ = Math.sin(Math.min(M, 1.5)) * d;
            M < 1.5 &&
              (x +=
                E.g * Math.exp(-(_ * _) / (E.w * E.w * (0.4 + d))) * Math.pow(Math.max(0, 1 - d / E.l), 1.4));
          }
          x =
            x * (0.7 + 0.6 * s.fbm(h * 5 + a * 9, p * 5, 3)) +
            Math.exp(-d * d * 70) * 1.2 +
            Math.max(0, 1 - d * 2.2) * 0.06;
        } else if (a === Hv) {
          let b = Math.atan2(p, h),
            g = 0.78 + (s.noise(Math.cos(b) * 2 + 5, Math.sin(b) * 2 + 5) - 0.5) * 0.04;
          x =
            Math.exp(-((d - g) * (d - g)) / (0.03 * 0.03)) *
              (0.6 + 0.4 * s.noise(Math.cos(b) * 5 + 9, Math.sin(b) * 5 + 9)) +
            0.05 * Do(0.2, 0.78, d) * (1 - Do(0.78, 0.8, d));
        } else if (a === Gg) {
          let b = (s.fbm(h * 1.6 + 3.3, p * 1.6 + 8.1, 3) - 0.5) * 0.5,
            g = (s.fbm(h * 1.6 + 7.7, p * 1.6 + 2.2, 3) - 0.5) * 0.5,
            E = h + b,
            M = p + g,
            _ = Math.sqrt(E * E + M * M),
            T = 1 - Do(0, 0.84, _),
            w = s.fbm(E * 4 + 1.1, M * 4 + 6.6, 5);
          x = Do(0.04, 0.9, T * (0.3 + 1.4 * w)) * (0.45 + 0.75 * T);
        } else if (a === fh) x = 1 - Do(0.3, 0.62, d);
        else if (a === qg) {
          let b = h * 0.5 + 0.5,
            g = 0.22 + 0.3 * b,
            E = Math.exp(-(p * p) / (g * g)) * Math.pow(b, 1.8),
            M = (h - 0.8) / 0.16;
          (h > 0.8 && (E *= Math.max(0, 1 - M * M)), (x = E * 1.15));
        }
        x *= m;
        let v = Math.max(0, Math.min(255, x * 255)),
          y = ((c * n + u) * e + l * n + f) * 4;
        ((i[y] = i[y + 1] = i[y + 2] = v), (i[y + 3] = 255));
      }
  }
  let r = new THREE.DataTexture(i, e, t, THREE.RGBAFormat, THREE.UnsignedByteType);
  return (
    (r.magFilter = THREE.LinearFilter),
    (r.minFilter = THREE.LinearMipmapLinearFilter),
    (r.generateMipmaps = !0),
    (r.wrapS = r.wrapT = THREE.ClampToEdgeWrapping),
    (r.colorSpace = THREE.NoColorSpace),
    (r.needsUpdate = !0),
    r
  );
}

var pu = 4,
  Fv = 2,
  Oa = {
    bullet_metal: [0, 1],
    bullet_concrete: [2, 3],
    bullet_wood: [4],
    scorch: [5],
    soot: [6],
    bullet_glass: [7],
  };

function Yw(n = 256) {
  let e = n * pu,
    t = n * Fv,
    i = document.createElement('canvas');
  ((i.width = e), (i.height = t));
  let s = document.createElement('canvas');
  ((s.width = e), (s.height = t));
  let o = document.createElement('canvas');
  ((o.width = e), (o.height = t));
  let r = i.getContext('2d'),
    a = s.getContext('2d'),
    l = o.getContext('2d', { willReadFrequently: !0 });
  ((l.fillStyle = 'rgb(128,128,128)'), l.fillRect(0, 0, e, t));
  let c = (M, _) => {
      let T = l.createRadialGradient(0, 0, 0, 0, 0, _);
      for (let [w, S] of M) T.addColorStop(w, `rgb(${S},${S},${S})`);
      ((l.fillStyle = T), l.beginPath(), l.arc(0, 0, _, 0, Math.PI * 2), l.fill());
    },
    f = Nv(77123).rnd;
  ((a.fillStyle = 'rgb(0,235,0)'), a.fillRect(0, 0, e, t));
  let h = Math.PI * 2,
    p = (M, _, T, w = 22, S = 1) => {
      M.beginPath();
      for (let R = 0; R < w; R++) {
        let z = (R / w) * h,
          I = _ * (1 + (f() - 0.5) * T),
          L = Math.cos(z) * I,
          U = Math.sin(z) * I * S;
        R ? M.lineTo(L, U) : M.moveTo(L, U);
      }
      M.closePath();
    },
    d = (M, _, T, w, S, R, z) => {
      M.beginPath();
      let I = T,
        L = _;
      M.moveTo(Math.cos(L) * I, Math.sin(L) * I);
      let U = 5 + Math.floor(f() * 4);
      for (let k = 1; k <= U; k++)
        ((I = T + ((w - T) * k) / U), (L += (f() - 0.5) * S), M.lineTo(Math.cos(L) * I, Math.sin(L) * I));
      ((M.strokeStyle = z), (M.lineWidth = R), (M.lineCap = 'round'), (M.lineJoin = 'round'), M.stroke());
    },
    m = (M, _) => {
      let T = ((M % pu) + 0.5) * n,
        w = (Math.floor(M / pu) + 0.5) * n,
        S = n / 2;
      for (let R of [r, a, l])
        (R.save(), R.beginPath(), R.rect(T - S, w - S, n, n), R.clip(), R.translate(T, w));
      (_(S), r.restore(), a.restore(), l.restore());
    },
    x = (M, _, T, w) => {
      let S = M.createRadialGradient(0, 0, _, 0, 0, T);
      for (let [R, z] of w) S.addColorStop(R, z);
      return S;
    };
  for (let M of Oa.bullet_metal)
    m(M, (_) => {
      ((r.fillStyle = x(r, _ * 0.1, _ * 0.6, [
        [0, 'rgba(14,13,12,0.4)'],
        [0.5, 'rgba(18,17,16,0.14)'],
        [1, 'rgba(20,20,20,0)'],
      ])),
        r.fillRect(-_, -_, 2 * _, 2 * _));
      let T = 6 + Math.floor(f() * 5);
      for (let k = 0; k < T; k++) {
        let C = f() * h;
        d(r, C, _ * 0.2, _ * (0.38 + f() * 0.45), 0.3, 0.8 + f() * 1, 'rgba(8,8,8,0.55)');
      }
      let w = _ * (0.24 + f() * 0.08),
        S = 0.7 + f() * 0.5,
        R = f() * h,
        z = (k, C, A, F, H, N) => {
          for (let J of [r, a]) (J.save(), J.translate(k, C), J.rotate(F));
          let Z = [];
          for (let J = 0; J < N; J++) Z.push(1 + (f() - 0.5) * H);
          let Q = (J, G) => {
            J.beginPath();
            for (let te = 0; te < N; te++) {
              let oe = (te / N) * h,
                ee = A * Z[te] * G,
                le = Math.cos(oe) * ee,
                xe = Math.sin(oe) * ee * S;
              te ? J.lineTo(le, xe) : J.moveTo(le, xe);
            }
            J.closePath();
          };
          (Q(r, 1),
            (r.lineJoin = 'miter'),
            (r.strokeStyle = 'rgba(92,54,36,0.95)'),
            (r.lineWidth = Math.max(1.5, A * 0.14)),
            r.stroke());
          let W = 150 + Math.floor(f() * 50);
          (Q(r, 1),
            (r.fillStyle = x(r, 0, A * 1.2, [
              [0, `rgb(${W - 30},${W - 26},${W - 20})`],
              [0.7, `rgb(${W + 30},${W + 33},${W + 36})`],
              [1, `rgb(${W},${W + 3},${W + 6})`],
            ])),
            r.fill(),
            Q(a, 1),
            (a.fillStyle = 'rgb(0,85,255)'),
            a.fill(),
            r.restore(),
            a.restore());
        };
      z(0, 0, w, R, 0.75, 11);
      let I = 2 + Math.floor(f() * 4);
      for (let k = 0; k < I; k++) {
        let C = f() * h,
          A = w * (1 + f() * 0.7);
        z(Math.cos(C) * A, Math.sin(C) * A, w * (0.15 + f() * 0.3), f() * h, 0.8, 7);
      }
      for (let k = 0; k < 9; k++) {
        let C = f() * h,
          A = w * 0.3,
          F = w * (0.6 + f() * 0.3);
        (r.beginPath(),
          r.moveTo(Math.cos(C) * A, Math.sin(C) * A),
          r.lineTo(Math.cos(C + 0.1) * F, Math.sin(C + 0.1) * F),
          (r.strokeStyle = f() < 0.5 ? 'rgba(245,246,248,0.7)' : 'rgba(70,72,76,0.5)'),
          (r.lineWidth = 0.8),
          r.stroke());
      }
      let L = _ * (0.1 + f() * 0.025),
        U = 8 + Math.floor(f() * 5);
      for (let k = 0; k < U; k++) {
        if (f() < 0.15) continue;
        let C = ((k + (f() - 0.5) * 0.6) / U) * h,
          A = L * (1.25 + f() * 0.9),
          F = 0.16 + f() * 0.16,
          H = 205 + Math.floor(f() * 50);
        (r.beginPath(),
          r.moveTo(Math.cos(C - F) * L * 0.9, Math.sin(C - F) * L * 0.9),
          r.lineTo(Math.cos(C) * A, Math.sin(C) * A),
          r.lineTo(Math.cos(C + F) * L * 0.9, Math.sin(C + F) * L * 0.9),
          r.closePath(),
          (r.fillStyle = `rgb(${H},${H},${Math.min(255, H + 4)})`),
          r.fill(),
          (r.strokeStyle = 'rgba(40,40,42,0.6)'),
          (r.lineWidth = 0.7),
          r.stroke());
      }
      (a.beginPath(),
        a.arc(0, 0, L * 1.8, 0, h),
        (a.fillStyle = 'rgb(0,60,255)'),
        a.fill(),
        p(r, L, 0.3, 11),
        (r.fillStyle = x(r, 0, L, [
          [0, '#000000'],
          [0.8, '#040404'],
          [1, '#141414'],
        ])),
        r.fill(),
        c(
          [
            [0, 0],
            [0.26, 10],
            [0.36, 240],
            [0.5, 200],
            [0.62, 100],
            [1, 128],
          ],
          L * 3.4,
        ),
        p(a, L, 0.1, 11),
        (a.fillStyle = 'rgb(0,250,0)'),
        a.fill());
    });
  for (let M of Oa.bullet_concrete)
    m(M, (_) => {
      ((r.fillStyle = x(r, _ * 0.2, _ * 0.9, [
        [0, 'rgba(186,180,168,0.22)'],
        [0.6, 'rgba(180,175,165,0.07)'],
        [1, 'rgba(170,165,155,0)'],
      ])),
        r.fillRect(-_, -_, 2 * _, 2 * _));
      let T = 4 + Math.floor(f() * 4);
      for (let I = 0; I < T; I++) {
        let L = f() * h,
          U = _ * (0.5 + f() * 0.42);
        (d(r, L, _ * 0.25, U, 0.35, 1.3 + f() * 1.3, 'rgba(20,19,18,0.75)'),
          f() < 0.5 && d(r, L + (f() - 0.5) * 0.6, U * 0.7, U * 1.05, 0.6, 0.9, 'rgba(20,19,18,0.5)'));
      }
      let w = _ * (0.33 + f() * 0.09),
        S = 12,
        R = [];
      for (let I = 0; I < S; I++) R.push(1 + (f() - 0.5) * 0.6);
      let z = (I, L, U, k) => {
        I.beginPath();
        for (let C = 0; C < S; C++) {
          let A = (C / S) * h,
            F = w * R[C] * L;
          C
            ? I.lineTo(Math.cos(A) * F + U, Math.sin(A) * F + k)
            : I.moveTo(Math.cos(A) * F + U, Math.sin(A) * F + k);
        }
        I.closePath();
      };
      (z(r, 1.05, 1.5, 1.5),
        (r.fillStyle = 'rgba(22,21,20,0.8)'),
        r.fill(),
        z(r, 1, 0, 0),
        (r.fillStyle = x(r, w * 0.1, w * 1.1, [
          [0, '#35332f'],
          [0.4, '#6f6b63'],
          [0.8, '#8f8b82'],
          [1, '#9a968c'],
        ])),
        r.fill(),
        z(r, 0.97, -1, -1),
        (r.strokeStyle = 'rgba(206,201,190,0.55)'),
        (r.lineWidth = 1.2),
        r.stroke());
      for (let I = 0; I < 6; I++) {
        let L = f() * h;
        d(r, L, w * 0.2, w * 0.9, 0.5, 1, 'rgba(28,27,25,0.5)');
      }
      for (let I = 0; I < 60; I++) {
        let L = f() * h,
          U = Math.sqrt(f()) * w * 0.85;
        ((r.fillStyle = f() < 0.55 ? 'rgba(36,34,32,0.6)' : 'rgba(196,191,180,0.6)'),
          r.beginPath(),
          r.arc(Math.cos(L) * U, Math.sin(L) * U, 0.7 + f() * 2, 0, h),
          r.fill());
      }
      (p(r, w * 0.3, 0.45, 9),
        (r.fillStyle = x(r, 0, w * 0.33, [
          [0, '#060606'],
          [0.7, '#161514'],
          [1, '#2c2a27'],
        ])),
        r.fill(),
        c(
          [
            [0, 0],
            [0.24, 20],
            [0.3, 70],
            [0.8, 112],
            [0.88, 150],
            [1, 128],
          ],
          w * 1.15,
        ));
      for (let I = 0; I < 22; I++) {
        let L = f() * h,
          U = w * (1.15 + f() * 1.3);
        ((r.fillStyle = f() < 0.5 ? 'rgba(190,185,175,0.45)' : 'rgba(30,29,27,0.45)'),
          r.beginPath(),
          r.arc(Math.cos(L) * U, Math.sin(L) * U, 0.6 + f() * 1.6, 0, h),
          r.fill());
      }
    });
  for (let M of Oa.bullet_wood)
    m(M, (_) => {
      (p(r, _ * 0.27, 0.7, 11, 1.45), (r.fillStyle = 'rgba(206,182,140,0.85)'), r.fill());
      for (let T = 0; T < 46; T++) {
        let w = (f() - 0.5) * _ * 0.62,
          S = _ * (0.25 + f() * 0.6) * (1 - Math.abs(w) / (_ * 0.4)),
          R = (f() - 0.5) * _ * 0.2;
        (r.beginPath(),
          r.moveTo(w, R - S),
          r.lineTo(w + (f() - 0.5) * 5, R + S),
          (r.strokeStyle = f() < 0.5 ? 'rgba(236,216,172,0.85)' : 'rgba(88,62,38,0.7)'),
          (r.lineWidth = 0.8 + f() * 2.2),
          r.stroke());
      }
      (p(r, _ * 0.1, 0.5, 9, 1.1),
        (r.fillStyle = x(r, 0, _ * 0.12, [
          [0, '#050403'],
          [0.8, '#140f0a'],
          [1, '#3a2a1a'],
        ])),
        r.fill(),
        c(
          [
            [0, 0],
            [0.5, 30],
            [0.8, 140],
            [1, 128],
          ],
          _ * 0.17,
        ));
    });
  for (let M of Oa.scorch)
    m(M, (_) => {
      ((r.fillStyle = x(r, 0, _ * 0.98, [
        [0, 'rgba(6,5,5,0.92)'],
        [0.3, 'rgba(10,9,8,0.85)'],
        [0.55, 'rgba(22,18,15,0.5)'],
        [0.8, 'rgba(30,24,20,0.16)'],
        [1, 'rgba(30,24,20,0)'],
      ])),
        r.fillRect(-_, -_, 2 * _, 2 * _));
      for (let T = 0; T < 90; T++) {
        let w = f() * h,
          S = _ * (0.1 + f() * 0.3),
          R = _ * (0.5 + f() * 0.46);
        (r.beginPath(),
          r.moveTo(Math.cos(w - 0.03) * S, Math.sin(w - 0.03) * S),
          r.lineTo(Math.cos(w) * R, Math.sin(w) * R),
          r.lineTo(Math.cos(w + 0.03) * S, Math.sin(w + 0.03) * S),
          r.closePath(),
          (r.fillStyle = `rgba(8,7,6,${0.12 + f() * 0.3})`),
          r.fill());
      }
      for (let T = 0; T < 60; T++) {
        let w = f() * h,
          S = _ * (0.15 + f() * 0.6);
        ((r.fillStyle = f() < 0.3 ? 'rgba(150,140,128,0.25)' : 'rgba(0,0,0,0.4)'),
          r.beginPath(),
          r.arc(Math.cos(w) * S, Math.sin(w) * S, 1 + f() * 4, 0, h),
          r.fill());
      }
    });
  for (let M of Oa.soot)
    m(M, (_) => {
      for (let T = 0; T < 14; T++) {
        let w = f() * h,
          S = f() * _ * 0.3,
          R = _ * (0.15 + f() * 0.3),
          z = Math.cos(w) * S,
          I = Math.sin(w) * S,
          L = r.createRadialGradient(z, I, 0, z, I, R);
        (L.addColorStop(0, 'rgba(8,8,8,0.4)'),
          L.addColorStop(1, 'rgba(8,8,8,0)'),
          (r.fillStyle = L),
          r.fillRect(-_, -_, 2 * _, 2 * _));
      }
      (p(r, _ * 0.1, 0.4, 12), (r.fillStyle = 'rgba(0,0,0,0.9)'), r.fill());
    });
  for (let M of Oa.bullet_glass)
    m(M, (_) => {
      ((r.fillStyle = x(r, 0, _ * 0.5, [
        [0, 'rgba(235,240,242,0.55)'],
        [1, 'rgba(235,240,242,0)'],
      ])),
        r.fillRect(-_, -_, 2 * _, 2 * _));
      for (let T = 0; T < 13; T++) {
        let w = ((T + f() * 0.6) / 13) * h;
        d(r, w, _ * 0.07, _ * (0.5 + f() * 0.45), 0.12, 0.9 + f(), 'rgba(240,246,248,0.85)');
      }
      for (let T = 0; T < 3; T++) {
        let w = _ * (0.2 + T * 0.17 + f() * 0.05);
        for (let S = 0; S < 9; S++) {
          if (f() < 0.45) continue;
          let R = (S / 9) * h;
          (r.beginPath(),
            r.arc(0, 0, w, R, R + 0.5),
            (r.strokeStyle = 'rgba(240,246,248,0.6)'),
            (r.lineWidth = 1),
            r.stroke());
        }
      }
      (p(r, _ * 0.07, 0.3, 10), (r.fillStyle = '#060606'), r.fill());
    });
  let v = new THREE.CanvasTexture(i);
  ((v.colorSpace = THREE.SRGBColorSpace), (v.anisotropy = 4));
  let y = new THREE.CanvasTexture(s);
  y.colorSpace = THREE.NoColorSpace;
  let b = 2 / n,
    g = (M) => {
      let _ = M % pu,
        T = Math.floor(M / pu);
      return [(_ + b) / pu, 1 - (T + 1 - b) / Fv, (_ + 1 - b) / pu, 1 - (T + b) / Fv];
    },
    E = null;
  try {
    let M = l.getImageData(0, 0, e, t),
      _ = M.data;
    if (_ && _.length === e * t * 4) {
      let T = l.createImageData(e, t),
        w = T.data,
        S = 5 / 255;
      for (let R = 0; R < t; R++) {
        let z = Math.max(0, R - 1) * e,
          I = Math.min(t - 1, R + 1) * e;
        for (let L = 0; L < e; L++) {
          let U = Math.max(0, L - 1),
            k = Math.min(e - 1, L + 1),
            C = (_[(R * e + k) * 4] - _[(R * e + U) * 4]) * S,
            A = (_[(I + L) * 4] - _[(z + L) * 4]) * S,
            F = 1 / Math.sqrt(C * C + A * A + 1),
            H = (R * e + L) * 4;
          ((w[H] = (-C * F * 0.5 + 0.5) * 255),
            (w[H + 1] = (A * F * 0.5 + 0.5) * 255),
            (w[H + 2] = (F * 0.5 + 0.5) * 255),
            (w[H + 3] = 255));
        }
      }
      (l.putImageData(T, 0, 0), (E = new THREE.CanvasTexture(o)), (E.colorSpace = THREE.NoColorSpace));
    }
  } catch {
    E = null;
  }
  return { map: v, orm: y, nrm: E, uv: g };
}

var OP = `
attribute vec4 aPos;    // xyz centre, w size (m)
attribute vec4 aAxis;   // mode 1: stretch axis (length = streak length); mode 2: plane normal; w = roll (rad)
attribute vec4 aCol;    // rgb (HDR), a
attribute vec4 aMisc;   // x atlas frame, y mode (0 billboard, 1 velocity-stretched, 2 surface-aligned), z age 0..1, w sun visibility
uniform vec2 uAtlas;
uniform float uPx;      // world size of one pixel at distance 1
varying vec2 vUv;
varying vec4 vCol;
varying vec3 vOff;
varying vec3 vToCam;
varying vec3 vInfo;     // view z, age, shade
varying float vSoftD;
varying vec3 vT;
varying vec3 vB;
void main() {
  vec2 c = position.xy;
  vec3 center = aPos.xyz; float size = aPos.w; float mode = aMisc.y;
  vec3 camR = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  vec3 camU = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  vec3 toCam = cameraPosition - center; float dist = length(toCam); toCam /= max(dist, 1e-4);
  float sn = sin(aAxis.w), cs = cos(aAxis.w);
  vec2 rc = vec2(c.x * cs - c.y * sn, c.x * sn + c.y * cs);
  vec3 off; float comp = 1.0;
  if (mode < 0.5) {
    off = (camR * rc.x + camU * rc.y) * size;
    vT = camR * cs + camU * sn; vB = camU * cs - camR * sn;
  } else if (mode < 1.5) {
    float len = length(aAxis.xyz); vec3 d = aAxis.xyz / max(len, 1e-5);
    vec3 side = cross(d, toCam); float sl = length(side); side = sl > 1e-3 ? side / sl : camR;
    float w = max(size, dist * uPx * 1.4); comp = size / w;
    if (aMisc.w > 1.5) w = min(w, dist * uPx * aMisc.w);       // additive only: cap on-screen width (tracers near the lens)
    off = d * (c.x * max(len, w)) + side * (c.y * w);
    vT = d; vB = side;
  } else {
    vec3 n = normalize(aAxis.xyz);
    vec3 t = normalize(abs(n.y) > 0.9 ? cross(n, vec3(1.0, 0.0, 0.0)) : cross(vec3(0.0, 1.0, 0.0), n));
    vec3 b = cross(n, t);
    off = (t * rc.x + b * rc.y) * size;
    vT = t * cs + b * sn; vB = b * cs - t * sn;
  }
  vec4 mv = viewMatrix * vec4(center + off, 1.0);
  gl_Position = projectionMatrix * mv;
  float f = floor(aMisc.x + 0.5);
  float col = mod(f, uAtlas.x), row = floor(f / uAtlas.x);
  vUv = (vec2(col, row) + c + 0.5) / uAtlas;
  vCol = vec4(aCol.rgb * comp, aCol.a);
  vOff = off / max(size, 1e-4);
  vToCam = toCam;
  vInfo = vec3(mv.z, aMisc.z, aMisc.w);
  vSoftD = clamp(size * 0.4, 0.04, 0.7);
}`,
  Jw = `
uniform sampler2D uTex;
uniform sampler2D uDepth;
uniform vec2 uRes;
uniform vec2 uNearFar;
uniform float uSoft;
varying vec2 vUv;
varying vec4 vCol;
varying vec3 vOff;
varying vec3 vToCam;
varying vec3 vInfo;
varying float vSoftD;
varying vec3 vT;
varying vec3 vB;
float softFade() {
  float s = 1.0;
  if (uSoft > 0.5) {
    float d = texture2D(uDepth, gl_FragCoord.xy / uRes).x;
    float zs = (uNearFar.x * uNearFar.y) / ((uNearFar.y - uNearFar.x) * d - uNearFar.y);
    s = clamp((vInfo.x - zs) / vSoftD, 0.0, 1.0);
  }
  return s;
}`,
  VP =
    Jw +
    `
uniform vec3 uSun, uSunDir, uAmbLo, uAmbHi;
void main() {
  vec4 t = texture2D(uTex, vUv);
  float er = vInfo.y * 0.45;                                  // wisps erode as the puff ages
  float a = smoothstep(er, er + (vInfo.z > 1.5 ? 0.38 : 0.6), t.a) * vCol.a;   // fire lobes: denser body, crisper edge
  a *= softFade() * smoothstep(0.2, 0.9, -vInfo.x);           // soft intersection + fade right at the lens
  if (a < 0.004) discard;
  vec3 V = normalize(vToCam);
  vec3 q = vOff * 2.0; float r2 = min(dot(q, q), 1.0);
  vec3 Ns = q + V * (sqrt(1.0 - r2) * 0.9 + 0.05);            // overall sphere normal
  vec2 tn = t.rg * 2.0 - 1.0;                                 // billow normal from the flipbook
  vec3 Nb = vT * tn.x + vB * tn.y + V * sqrt(max(1.0 - dot(tn, tn), 0.0));
  vec3 N = normalize(Ns * 0.55 + Nb);
  float wrap = clamp((dot(N, uSunDir) + 0.45) / 1.45, 0.0, 1.0);
  float back = pow(clamp(dot(-V, uSunDir), 0.0, 1.0), 5.0);   // looking into the sun: forward scatter through thin edges
  float thin = 1.0 - t.b * smoothstep(0.0, 0.5, a);
  float hot = step(1.5, vInfo.z), shade = vInfo.z - 2.0 * hot;      // aMisc.w >= 2: emissive fire lobe (colour = emission)
  vec3 sun = uSun * (wrap * wrap * 0.85 + back * (0.15 + 1.3 * thin)) * shade;
  vec3 amb = mix(uAmbLo, uAmbHi, N.y * 0.5 + 0.5) * (1.0 - 0.35 * t.b);
  vec3 col = vCol.rgb * (amb + sun);
  if (hot > 0.5) {
    // alpha-blended fire: hot dense cores, dim orange skin, soot underneath. Because it is NOT additive, overlapping lobes
    // keep their shape and smoke in front can occlude them.
    float lump = clamp(dot(tn, vec2(0.6, 0.8)) * 0.6 + 0.5, 0.0, 1.0);
    float core = t.b * t.b * smoothstep(0.15, 0.9, t.a);
    vec3 fire = vCol.rgb * (0.10 + 1.7 * core) * (0.45 + 1.1 * lump);
    col = vec3(0.045, 0.042, 0.04) * (amb + sun) + fire;
  }
  gl_FragColor = vec4(col, a);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  gl_FragColor.rgb *= gl_FragColor.a;                         // premultiply after the (possibly no-op) output transform
}`,
  WP =
    Jw +
    `
void main() {
  float t = texture2D(uTex, vUv).r;
  float k = t * vCol.a * softFade();
  if (k < 0.002) discard;
  gl_FragColor = vec4(vCol.rgb * k, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,
  $w = new THREE.Vector2();

function Vv(
  n,
  e,
  { lit: t, tex: i, cols: s, rows: o, renderOrder: r, sun: a, sunDir: l, ambLo: c, ambHi: u },
) {
  let f = new THREE.InstancedBufferGeometry();
  (f.setAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array([-0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, 0.5, 0]), 3),
  ),
    f.setIndex([0, 1, 2, 0, 2, 3]));
  let h = (S) => {
      let R = new THREE.InstancedBufferAttribute(new Float32Array(e * 4), 4);
      return (R.setUsage(THREE.DynamicDrawUsage), f.setAttribute(S, R), R);
    },
    p = h('aPos'),
    d = h('aAxis'),
    m = h('aCol'),
    x = h('aMisc');
  f.instanceCount = 0;
  let v = {
    uTex: { value: i },
    uAtlas: { value: new THREE.Vector2(s, o) },
    uPx: { value: 0.001 },
    uDepth: { value: null },
    uRes: { value: new THREE.Vector2(1, 1) },
    uNearFar: { value: new THREE.Vector2(0.08, 900) },
    uSoft: { value: 0 },
  };
  t &&
    Object.assign(v, {
      uSun: { value: a },
      uSunDir: { value: l },
      uAmbLo: { value: c },
      uAmbHi: { value: u },
    });
  let y = new THREE.ShaderMaterial({
    uniforms: v,
    vertexShader: OP,
    fragmentShader: t ? VP : WP,
    transparent: !0,
    depthWrite: !1,
    depthTest: !0,
    side: THREE.DoubleSide,
    fog: !1,
    blending: THREE.CustomBlending,
    blendEquation: THREE.AddEquation,
    blendSrc: THREE.OneFactor,
    blendDst: t ? THREE.OneMinusSrcAlphaFactor : THREE.OneFactor,
    blendSrcAlpha: THREE.ZeroFactor,
    blendDstAlpha: THREE.OneFactor,
  });
  y.name = t ? 'fx_lit' : 'fx_add';
  let b = new THREE.Mesh(f, y);
  ((b.frustumCulled = !1),
    (b.renderOrder = r),
    (b.castShadow = !1),
    (b.receiveShadow = !1),
    (b.matrixAutoUpdate = !1),
    (b.name = y.name),
    (b.onBeforeRender = (S, R, z) => {
      let I = S.getRenderTarget(),
        L;
      I ? (L = I.height) : (S.getDrawingBufferSize($w), (L = $w.y));
      let U = z.projectionMatrix.elements;
      v.uPx.value = 2 / (Math.max(U[5], 0.001) * Math.max(L, 1));
      let k = n.render,
        C = k && k.depthTexture;
      C && C.image && z === n.camera && k.depthTextureIsLive !== !0 && n.params.fxsoft !== '0'
        ? ((v.uDepth.value = C),
          (v.uSoft.value = 1),
          k.resolution && k.resolution.x > 0
            ? v.uRes.value.set(k.resolution.x, k.resolution.y)
            : v.uRes.value.set(C.image.width || 1, C.image.height || 1),
          v.uNearFar.value.set(z.near, z.far))
        : ((v.uDepth.value = null), (v.uSoft.value = 0));
    }));
  let g = p.array,
    E = d.array,
    M = m.array,
    _ = x.array,
    T = {
      mesh: b,
      cap: e,
      n: 0,
      P: g,
      A: E,
      C: M,
      M: _,
      begin() {
        T.n = 0;
      },
      push(S, R, z, I, L, U, k, C, A, F, H, N, Z, Q, W, J) {
        let G = T.n;
        if (G >= e) return !1;
        let te = G * 4;
        return (
          (g[te] = S),
          (g[te + 1] = R),
          (g[te + 2] = z),
          (g[te + 3] = I),
          (E[te] = L),
          (E[te + 1] = U),
          (E[te + 2] = k),
          (E[te + 3] = C),
          (M[te] = A),
          (M[te + 1] = F),
          (M[te + 2] = H),
          (M[te + 3] = N),
          (_[te] = Z),
          (_[te + 1] = Q),
          (_[te + 2] = W),
          (_[te + 3] = J),
          (T.n = G + 1),
          !0
        );
      },
      end: null,
    },
    w = [p, d, m, x];
  return (
    (T.end = () => {
      let S = T.n;
      if (((f.instanceCount = S), (b.visible = S > 0), !!S))
        for (let R = 0; R < 4; R++) {
          let z = w[R];
          (z.clearUpdateRanges(), z.addUpdateRange(0, S * 4), (z.needsUpdate = !0));
        }
    }),
    T
  );
}

var hh = 1,
  dh = 2,
  GP = 4,
  u1 = class {
    constructor(e, t) {
      ((this.cap = e), (this.sorted = t), (this.n = 0), (this.freeTop = e));
      let i = () => new Float32Array(e);
      ((this.px = i()),
        (this.py = i()),
        (this.pz = i()),
        (this.vx = i()),
        (this.vy = i()),
        (this.vz = i()),
        (this.age = i()),
        (this.life = i()),
        (this.s0 = i()),
        (this.s1 = i()),
        (this.sk = i()),
        (this.rot = i()),
        (this.rotv = i()),
        (this.r = i()),
        (this.g = i()),
        (this.b = i()),
        (this.a = i()),
        (this.drag = i()),
        (this.grav = i()),
        (this.wind = i()),
        (this.turb = i()),
        (this.seed = i()),
        (this.fin = i()),
        (this.fout = i()),
        (this.stretch = i()),
        (this.shade = i()),
        (this.key = i()),
        (this.gy = i()),
        (this.frame = new Uint8Array(e)),
        (this.mode = new Uint8Array(e)),
        (this.flags = new Uint8Array(e)),
        (this.ramp = new Uint8Array(e)),
        (this.order = new Uint16Array(e)),
        (this.free = new Uint16Array(e)));
      for (let s = 0; s < e; s++) this.free[s] = e - 1 - s;
    }
    clear() {
      ((this.n = 0), (this.freeTop = this.cap));
      for (let e = 0; e < this.cap; e++) this.free[e] = this.cap - 1 - e;
    }
    emit(e, t, i, s, o, r, a, l, c) {
      if (this.freeTop === 0) return -1;
      let u = this.free[--this.freeTop];
      return (
        (this.order[this.n++] = u),
        (this.px[u] = e),
        (this.py[u] = t),
        (this.pz[u] = i),
        (this.vx[u] = s),
        (this.vy[u] = o),
        (this.vz[u] = r),
        (this.age[u] = -1),
        (this.life[u] = a),
        (this.s0[u] = l),
        (this.s1[u] = c),
        (this.sk[u] = 2),
        (this.rot[u] = 0),
        (this.rotv[u] = 0),
        (this.r[u] = 1),
        (this.g[u] = 1),
        (this.b[u] = 1),
        (this.a[u] = 1),
        (this.drag[u] = 0),
        (this.grav[u] = 0),
        (this.wind[u] = 0),
        (this.turb[u] = 0),
        (this.seed[u] = Math.random() * 100),
        (this.fin[u] = 0),
        (this.fout[u] = 0.5),
        (this.stretch[u] = 0.02),
        (this.shade[u] = 1),
        (this.key[u] = 0),
        (this.gy[u] = 0),
        (this.frame[u] = 0),
        (this.mode[u] = 0),
        (this.flags[u] = 0),
        (this.ramp[u] = 0),
        u
      );
    }
    update(e, t, i, s, o) {
      let { px: r, py: a, pz: l, vx: c, vy: u, vz: f, age: h, life: p, order: d, flags: m } = this,
        x = i.x,
        v = i.y,
        y = i.z,
        b = 0,
        g = this.n;
      for (let E = 0; E < g; E++) {
        let M = d[E];
        if (h[M] < 0) h[M] = 0;
        else {
          if (((h[M] += e), h[M] >= p[M])) {
            this.free[this.freeTop++] = M;
            continue;
          }
          let _ = 1 - Math.exp(-this.drag[M] * e),
            T = this.wind[M];
          ((c[M] += (s.x * T - c[M]) * _),
            (u[M] += (s.y * T - u[M]) * _),
            (f[M] += (s.z * T - f[M]) * _),
            (u[M] -= this.grav[M] * e));
          let w = this.turb[M];
          if (w > 0) {
            let z = this.seed[M];
            ((c[M] += Math.sin(a[M] * 2.3 + z + o * 1.7) * w * e),
              (f[M] += Math.cos(r[M] * 1.9 + z * 1.3 + o * 1.3) * w * e),
              (u[M] += Math.sin(l[M] * 2.1 + z * 0.7 + o * 2.1) * w * 0.4 * e));
          }
          ((r[M] += c[M] * e), (a[M] += u[M] * e), (l[M] += f[M] * e), (this.rot[M] += this.rotv[M] * e));
          let S = m[M],
            R = this.gy[M] + 0.012;
          if (S && a[M] < R) {
            if (S & dh) {
              this.free[this.freeTop++] = M;
              continue;
            }
            S & hh
              ? ((a[M] = R),
                u[M] < 0 &&
                  ((u[M] = -u[M] * (0.25 + (this.seed[M] % 1) * 0.3)), (c[M] *= 0.65), (f[M] *= 0.65)))
              : S & GP && ((a[M] = R), (c[M] = u[M] = f[M] = 0));
          }
        }
        if (this.sorted) {
          let _ = r[M] - x,
            T = a[M] - v,
            w = l[M] - y;
          this.key[M] = _ * _ + T * T + w * w;
        }
        d[b++] = M;
      }
      if (((this.n = b), this.sorted && b > 1)) {
        let E = this.key;
        for (let M = 1; M < b; M++) {
          let _ = d[M],
            T = E[_],
            w = M - 1;
          for (; w >= 0 && E[d[w]] < T;) ((d[w + 1] = d[w]), w--);
          d[w + 1] = _;
        }
      }
      for (let E = 0; E < b; E++) {
        let M = d[E],
          _ = h[M] / p[M],
          T = 1 - _,
          w = 1 - Math.pow(T, this.sk[M]),
          S = this.s0[M] + (this.s1[M] - this.s0[M]) * w,
          R = this.a[M],
          z = this.fin[M],
          I = this.fout[M];
        if ((z > 0 && _ < z && (R *= _ / z), _ > I)) {
          let Z = 1 - (_ - I) / (1 - I);
          R *= Z * Z * (3 - 2 * Z);
        }
        let L = this.r[M],
          U = this.g[M],
          k = this.b[M],
          C = this.ramp[M];
        if (C === 1) ((L *= Math.pow(T, 0.5)), (U *= Math.pow(T, 1.4)), (k *= Math.pow(T, 3)));
        else if (C === 2) {
          let Z = 1 - Math.pow(_, 1.6),
            Q = Z * Math.sqrt(Z);
          ((L *= Q),
            (U *= (0.22 + 0.78 * Math.pow(Z, 1.3)) * Q),
            (k *= (0.04 + 0.96 * Math.pow(Z, 3.5)) * Q));
        } else if (C === 3) {
          let Z = 0.55 + 0.45 * Math.sin(o * 17 + this.seed[M] * 9);
          ((L *= Z), (U *= Z * (0.6 + 0.4 * T)), (k *= Z * T));
        }
        let A = this.mode[M],
          F = 0,
          H = 1,
          N = 0;
        if (A === 1) {
          let Z = this.stretch[M];
          ((F = c[M] * Z), (H = u[M] * Z), (N = f[M] * Z));
        }
        if (
          !t.push(r[M], a[M], l[M], S, F, H, N, this.rot[M], L, U, k, R, this.frame[M], A, _, this.shade[M])
        )
          break;
      }
    }
  },
  Yg = class {
    constructor(e = 48) {
      ((this.cap = e), (this.n = 0));
      let t = () => new Float32Array(e);
      ((this.fx = t()),
        (this.fy = t()),
        (this.fz = t()),
        (this.dx = t()),
        (this.dy = t()),
        (this.dz = t()),
        (this.dist = t()),
        (this.speed = t()),
        (this.trav = t()),
        (this.len = t()),
        (this.width = t()),
        (this.r = t()),
        (this.g = t()),
        (this.b = t()),
        (this.frames = new Uint8Array(e)));
    }
    clear() {
      this.n = 0;
    }
    add(e, t, i, s, o, r, a) {
      let l = this.n;
      l >= this.cap ? (l = 0) : this.n++;
      let c = t.x - e.x,
        u = t.y - e.y,
        f = t.z - e.z,
        h = Math.sqrt(c * c + u * u + f * f);
      if (h < 0.001) {
        l === this.n - 1 && this.n--;
        return;
      }
      ((this.fx[l] = e.x),
        (this.fy[l] = e.y),
        (this.fz[l] = e.z),
        (this.dx[l] = c / h),
        (this.dy[l] = u / h),
        (this.dz[l] = f / h),
        (this.dist[l] = h),
        (this.speed[l] = r),
        (this.trav[l] = 0),
        (this.len[l] = Math.min(Math.max(r * 0.022, 2), 7)),
        (this.width[l] = a),
        (this.r[l] = i),
        (this.g[l] = s),
        (this.b[l] = o),
        (this.frames[l] = 0));
    }
    update(e, t, i, s) {
      let o = this.n;
      for (let r = 0; r < o; r++) {
        let a = this.speed[r],
          l = this.dist[r],
          c = this.len[r];
        this.frames[r] === 0
          ? (this.trav[r] = Math.min(l, a * Math.max(e, 0.008) * (0.35 + Math.random() * 0.4)))
          : (this.trav[r] += a * e);
        let u = Math.min(this.trav[r], l),
          f = Math.max(0, this.trav[r] - c);
        if (f >= l) {
          if (this.frames[r] >= 2) {
            if ((o--, r !== o)) {
              for (let T of qP) this[T][r] = this[T][o];
              this.frames[r] = this.frames[o];
            }
            r--;
            continue;
          }
          ((f = Math.max(0, l - c * 0.5)), (u = l));
        }
        this.frames[r] = Math.min(250, this.frames[r] + 1);
        let h = (u + f) * 0.5,
          p = Math.max(u - f, 0.05),
          d = this.dx[r],
          m = this.dy[r],
          x = this.dz[r],
          v = this.width[r],
          y = this.fx[r] + d * h,
          b = this.fy[r] + m * h,
          g = this.fz[r] + x * h,
          E = this.r[r],
          M = this.g[r],
          _ = this.b[r];
        (t.push(y, b, g, v, d * p, m * p, x * p, 0, E, M, _, 1, i, 1, 0, 5),
          t.push(
            y,
            b,
            g,
            v * 6,
            d * p * 1.05,
            m * p * 1.05,
            x * p * 1.05,
            0,
            E * 0.04,
            M * 0.032,
            _ * 0.028,
            1,
            i,
            1,
            0,
            28,
          ),
          t.push(
            this.fx[r] + d * u,
            this.fy[r] + m * u,
            this.fz[r] + x * u,
            v * 5,
            0,
            1,
            0,
            0,
            E * 0.2,
            M * 0.16,
            _ * 0.12,
            1,
            s,
            0,
            0,
            1,
          ));
      }
      this.n = o;
    }
  },
  qP = ['fx', 'fy', 'fz', 'dx', 'dy', 'dz', 'dist', 'speed', 'trav', 'len', 'width', 'r', 'g', 'b'],
  Ds = new THREE.Matrix4(),
  Zo = new THREE.Quaternion(),
  $g = new THREE.Vector3(),
  Zg = new THREE.Vector3(),
  Zw = new THREE.Vector3();

function XP() {
  let n = new THREE.BoxGeometry(1, 1, 1, 2, 1, 2),
    e = n.attributes.position,
    t = 1234.5,
    i = () => ((t = Math.sin(t * 12.9898 + 78.233) * 43758.5453), (t -= Math.floor(t)), t),
    s = new Map();
  for (let o = 0; o < e.count; o++) {
    let r = e.getX(o).toFixed(3) + ',' + e.getY(o).toFixed(3) + ',' + e.getZ(o).toFixed(3),
      a = s.get(r);
    if (!a) {
      let l = e.getX(o),
        c = e.getY(o),
        u = e.getZ(o),
        h = Math.abs(l) > 0.49 && Math.abs(u) > 0.49 ? 0.72 + i() * 0.2 : 1;
      ((l = l * h + (i() - 0.5) * 0.14),
        (u = u * h + (i() - 0.5) * 0.14),
        (c = c * (0.8 + i() * 0.3) + (i() - 0.5) * 0.1),
        (a = [l, c, u]),
        s.set(r, a));
    }
    e.setXYZ(o, a[0], a[1], a[2]);
  }
  return ((n = n.toNonIndexed()), n.computeVertexNormals(), n);
}

var jg = class {
    constructor(e, t = 256) {
      ((this.G = e), (this.cap = t), (this.next = 0), (this.live = 0));
      let i = new THREE.MeshStandardMaterial({ color: 16777215, roughness: 0.82, metalness: 0.05 });
      i.name = 'fx_debris';
      let s = (this.mesh = new THREE.InstancedMesh(XP(), i, t));
      (s.instanceMatrix.setUsage(THREE.DynamicDrawUsage),
        (s.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(t * 3).fill(1), 3)),
        (s.frustumCulled = !1),
        (s.castShadow = !1),
        (s.receiveShadow = !0),
        (s.name = 'fx_debris'));
      let o = () => new Float32Array(t);
      ((this.px = o()),
        (this.py = o()),
        (this.pz = o()),
        (this.vx = o()),
        (this.vy = o()),
        (this.vz = o()),
        (this.ax = o()),
        (this.ay = o()),
        (this.az = o()),
        (this.ang = o()),
        (this.spin = o()),
        (this.sx = o()),
        (this.sy = o()),
        (this.sz = o()),
        (this.age = o()),
        (this.life = o()),
        (this.floor = o()),
        (this.state = new Uint8Array(t)),
        Ds.makeScale(0, 0, 0));
      for (let r = 0; r < t; r++) Ds.toArray(s.instanceMatrix.array, r * 16);
      s.visible = !1;
    }
    clear() {
      (this.state.fill(0), Ds.makeScale(0, 0, 0));
      for (let e = 0; e < this.cap; e++) Ds.toArray(this.mesh.instanceMatrix.array, e * 16);
      ((this.mesh.instanceMatrix.needsUpdate = !0), (this.live = 0), (this.mesh.visible = !1));
    }
    add(e, t, i, s, o, r, a, l, c, u, f, h, p, d) {
      let m = this.next;
      ((this.next = (m + 1) % this.cap),
        (this.px[m] = e),
        (this.py[m] = t),
        (this.pz[m] = i),
        (this.vx[m] = s),
        (this.vy[m] = o),
        (this.vz[m] = r));
      let x = Math.random() - 0.5,
        v = Math.random() - 0.5,
        y = Math.random() - 0.5,
        b = Math.hypot(x, v, y) || 1;
      ((this.ax[m] = x / b),
        (this.ay[m] = v / b),
        (this.az[m] = y / b),
        (this.ang[m] = Math.random() * 6.28),
        (this.spin[m] = (Math.random() - 0.5) * 50),
        (this.sx[m] = a),
        (this.sy[m] = l),
        (this.sz[m] = c),
        (this.age[m] = 0),
        (this.life[m] = p),
        (this.floor[m] = d),
        (this.state[m] = 1));
      let g = this.mesh.instanceColor.array;
      ((g[m * 3] = u), (g[m * 3 + 1] = f), (g[m * 3 + 2] = h), (this.mesh.instanceColor.needsUpdate = !0));
    }
    update(e) {
      let t = this.state,
        i = this.mesh.instanceMatrix.array,
        s = 0,
        o = !1;
      for (let r = 0; r < this.cap; r++) {
        let a = t[r];
        if (!a) continue;
        this.age[r] += e;
        let l = this.life[r] - this.age[r];
        if (l <= 0) {
          ((t[r] = 0), Ds.makeScale(0, 0, 0), Ds.toArray(i, r * 16), (o = !0));
          continue;
        }
        if ((s++, a === 2 && l > 0.5)) continue;
        if (a === 1) {
          ((this.vy[r] -= 9.81 * e),
            (this.px[r] += this.vx[r] * e),
            (this.py[r] += this.vy[r] * e),
            (this.pz[r] += this.vz[r] * e),
            (this.ang[r] += this.spin[r] * e));
          let u = this.floor[r] + Math.min(this.sx[r], this.sy[r], this.sz[r]) * 0.5;
          this.py[r] < u &&
            this.vy[r] < 0 &&
            ((this.py[r] = u),
            this.vy[r] > -1.2
              ? ((t[r] = 2), (this.vx[r] = this.vy[r] = this.vz[r] = 0))
              : ((this.vy[r] = -this.vy[r] * 0.32),
                (this.vx[r] *= 0.55),
                (this.vz[r] *= 0.55),
                (this.spin[r] *= 0.5)));
        }
        let c = l < 0.5 ? l / 0.5 : 1;
        (Zw.set(this.ax[r], this.ay[r], this.az[r]),
          Zo.setFromAxisAngle(Zw, this.ang[r]),
          $g.set(this.px[r], this.py[r], this.pz[r]),
          Zg.set(this.sx[r] * c, this.sy[r] * c, this.sz[r] * c),
          Ds.compose($g, Zo, Zg),
          Ds.toArray(i, r * 16),
          (o = !0));
      }
      ((this.live = s), (this.mesh.visible = s > 0), o && (this.mesh.instanceMatrix.needsUpdate = !0));
    }
  },
  Ov = { pos: new THREE.Vector3(), surface: 'concrete' },
  YP = new THREE.Vector3(0, -1, 0),
  jw = new THREE.Vector3(),
  Kw = new THREE.Quaternion(),
  Xg = new THREE.Euler();

function $P() {
  let t = [
      [0, 0],
      [0.006076, 0],
      [0.0062, 0.0012],
      [0.005083999999999999, 0.0022],
      [0.005083999999999999, 0.0034],
      [0.006013999999999999, 0.0046],
      [0.005889999999999999, 0.036399999999999995],
      [0.004092, 0.0416],
      [0.003968, 0.052],
      [0.003224, 0.052],
      [0.0031, 0.044719999999999996],
    ],
    i = new THREE.LatheGeometry(
      t.map((s) => new THREE.Vector2(s[0], s[1] - 0.052 / 2)),
      10,
    );
  return (i.computeVertexNormals(), i);
}

var Kg = class {
  constructor(e, t = 60) {
    ((this.G = e), (this.cap = t), (this.next = 0));
    let i;
    try {
      i = e.mats.get('brass');
    } catch {
      i = null;
    }
    (!i || !i.isMaterial) &&
      (i = new THREE.MeshStandardMaterial({ color: 11570492, roughness: 0.3, metalness: 1 }));
    let s = (this.mesh = new THREE.InstancedMesh($P(), i, t));
    (s.instanceMatrix.setUsage(THREE.DynamicDrawUsage),
      (s.frustumCulled = !1),
      (s.castShadow = !1),
      (s.receiveShadow = !0),
      (s.name = 'fx_shells'));
    let o = () => new Float32Array(t);
    ((this.px = o()),
      (this.py = o()),
      (this.pz = o()),
      (this.vx = o()),
      (this.vy = o()),
      (this.vz = o()),
      (this.qx = o()),
      (this.qy = o()),
      (this.qz = o()),
      (this.qw = o().fill(1)),
      (this.wx = o()),
      (this.wy = o()),
      (this.wz = o()),
      (this.age = o()),
      (this.rest = o()),
      (this.floor = o()),
      (this.state = new Uint8Array(t)),
      (this.bounces = new Uint8Array(t)),
      Ds.makeScale(0, 0, 0));
    for (let r = 0; r < t; r++) Ds.toArray(s.instanceMatrix.array, r * 16);
    ((s.visible = !1), (this.surface = new Array(t).fill('concrete')));
  }
  clear() {
    (this.state.fill(0), Ds.makeScale(0, 0, 0));
    for (let e = 0; e < this.cap; e++) Ds.toArray(this.mesh.instanceMatrix.array, e * 16);
    ((this.mesh.instanceMatrix.needsUpdate = !0), (this.mesh.visible = !1));
  }
  _floorAt(e) {
    let t = this.G.physics;
    if (((this.floor[e] = 0), (this.surface[e] = 'concrete'), t && t.raycast)) {
      jw.set(this.px[e], this.py[e] + 0.25, this.pz[e]);
      let i = t.raycast(jw, YP, 6);
      i ? ((this.floor[e] = i.point.y), (this.surface[e] = i.surface || 'concrete')) : (this.floor[e] = -50);
    }
  }
  add(e, t) {
    let i = this.next;
    ((this.next = (i + 1) % this.cap),
      (this.px[i] = e.x),
      (this.py[i] = e.y),
      (this.pz[i] = e.z),
      (this.vx[i] = t.x),
      (this.vy[i] = t.y),
      (this.vz[i] = t.z),
      Xg.set(Math.random() * 6.28, Math.random() * 6.28, Math.random() * 6.28),
      Zo.setFromEuler(Xg),
      (this.qx[i] = Zo.x),
      (this.qy[i] = Zo.y),
      (this.qz[i] = Zo.z),
      (this.qw[i] = Zo.w),
      (this.wx[i] = (Math.random() - 0.5) * 40),
      (this.wy[i] = (Math.random() - 0.5) * 20),
      (this.wz[i] = (Math.random() - 0.5) * 40),
      (this.age[i] = 0),
      (this.rest[i] = 0),
      (this.state[i] = 1),
      (this.bounces[i] = 0),
      this._floorAt(i));
  }
  update(e) {
    let t = this.state,
      i = this.mesh.instanceMatrix.array,
      s = 0,
      o = !1;
    for (let r = 0; r < this.cap; r++) {
      let a = t[r];
      if (!a) continue;
      (s++, (this.age[r] += e));
      let l = 1;
      if (a === 1) {
        ((this.vy[r] -= 9.81 * e),
          (this.px[r] += this.vx[r] * e),
          (this.py[r] += this.vy[r] * e),
          (this.pz[r] += this.vz[r] * e));
        let c = this.wx[r],
          u = this.wy[r],
          f = this.wz[r],
          h = this.qx[r],
          p = this.qy[r],
          d = this.qz[r],
          m = this.qw[r],
          x = 0.5 * e,
          v = h + x * (c * m + u * d - f * p),
          y = p + x * (u * m + f * h - c * d),
          b = d + x * (f * m + c * p - u * h),
          g = m - x * (c * h + u * p + f * d),
          E = 1 / (Math.hypot(v, y, b, g) || 1);
        ((this.qx[r] = v * E), (this.qy[r] = y * E), (this.qz[r] = b * E), (this.qw[r] = g * E));
        let M = this.floor[r] + 0.0065;
        if (this.py[r] < M && this.vy[r] < 0) {
          this.py[r] = M;
          let _ = this.bounces[r]++;
          (_ < 2 &&
            (Ov.pos.set(this.px[r], this.py[r], this.pz[r]),
            (Ov.surface = this.surface[r]),
            this.G.events.emit('shell:bounce', Ov)),
            this.vy[r] > -0.9 || _ >= 4
              ? ((t[r] = 2),
                (this.vx[r] = this.vy[r] = this.vz[r] = 0),
                Xg.set(Math.PI / 2, 0, Math.random() * 6.28, 'ZXY'),
                Zo.setFromEuler(Xg),
                (this.qx[r] = Zo.x),
                (this.qy[r] = Zo.y),
                (this.qz[r] = Zo.z),
                (this.qw[r] = Zo.w))
              : ((this.vy[r] = -this.vy[r] * (0.32 + Math.random() * 0.16)),
                (this.vx[r] = this.vx[r] * 0.6 + (Math.random() - 0.5) * 0.6),
                (this.vz[r] = this.vz[r] * 0.6 + (Math.random() - 0.5) * 0.6),
                (this.wx[r] = (Math.random() - 0.5) * 50),
                (this.wy[r] = (Math.random() - 0.5) * 30),
                (this.wz[r] = (Math.random() - 0.5) * 50),
                _ === 0 && this._floorAt(r)));
        }
        this.age[r] > 8 && (t[r] = 2);
      } else {
        if (((this.rest[r] += e), this.rest[r] < 4 && this.rest[r] > e * 1.5)) continue;
        if (this.rest[r] >= 4.7) {
          ((t[r] = 0), Ds.makeScale(0, 0, 0), Ds.toArray(i, r * 16), (o = !0));
          continue;
        }
        this.rest[r] >= 4 && (l = 1 - (this.rest[r] - 4) / 0.7);
      }
      (Kw.set(this.qx[r], this.qy[r], this.qz[r], this.qw[r]),
        $g.set(this.px[r], this.py[r], this.pz[r]),
        Zg.set(l, l, l),
        Ds.compose($g, Kw, Zg),
        Ds.toArray(i, r * 16),
        (o = !0));
    }
    ((this.mesh.visible = s > 0), o && (this.mesh.instanceMatrix.needsUpdate = !0));
  }
};

var ZP = {
    bullet_metal: 0.25,
    bullet_concrete: 0.34,
    bullet_wood: 0.24,
    scorch: 2.4,
    soot: 0.3,
    bullet_glass: 0.3,
  },
  Qw = 14,
  Jg = class {
    constructor(e, t = 160) {
      ((this.cap = t), (this.next = 0), (this.count = 0));
      let i = (this.atlas = Yw(256)),
        s = new THREE.BufferGeometry();
      ((this.pos = new THREE.BufferAttribute(new Float32Array(t * 12), 3)),
        this.pos.setUsage(THREE.DynamicDrawUsage),
        (this.nor = new THREE.BufferAttribute(new Float32Array(t * 12), 3)),
        this.nor.setUsage(THREE.DynamicDrawUsage),
        (this.uv = new THREE.BufferAttribute(new Float32Array(t * 8), 2)),
        this.uv.setUsage(THREE.DynamicDrawUsage),
        (this.col = new THREE.BufferAttribute(new Float32Array(t * 16), 4)),
        this.col.setUsage(THREE.DynamicDrawUsage),
        (this.baseA = new Float32Array(t)),
        s.setAttribute('position', this.pos),
        s.setAttribute('normal', this.nor),
        s.setAttribute('uv', this.uv),
        s.setAttribute('color', this.col));
      let o = new Uint16Array(t * 6);
      for (let l = 0; l < t; l++) {
        let c = l * 4,
          u = l * 6;
        ((o[u] = c),
          (o[u + 1] = c + 1),
          (o[u + 2] = c + 2),
          (o[u + 3] = c),
          (o[u + 4] = c + 2),
          (o[u + 5] = c + 3));
      }
      s.setIndex(new THREE.BufferAttribute(o, 1));
      let r = new THREE.MeshStandardMaterial({
        map: i.map,
        roughnessMap: i.orm,
        metalnessMap: i.orm,
        roughness: 1,
        metalness: 1,
        transparent: !0,
        vertexColors: !0,
        depthWrite: !1,
        polygonOffset: !0,
        polygonOffsetFactor: -4,
        polygonOffsetUnits: -4,
      });
      (i.nrm && ((r.normalMap = i.nrm), (r.normalScale = new THREE.Vector2(1, 1))), (r.name = 'fx_decals'));
      let a = (this.mesh = new THREE.Mesh(s, r));
      ((a.frustumCulled = !1),
        (a.castShadow = !1),
        (a.receiveShadow = !0),
        (a.renderOrder = -5),
        (a.matrixAutoUpdate = !1),
        (a.name = 'fx_decals'),
        (a.visible = !1),
        (this.uvs = {}));
      for (let l in Oa) this.uvs[l] = Oa[l].map((c) => i.uv(c));
    }
    clear() {
      (this.col.array.fill(0),
        this.pos.array.fill(0),
        (this.col.needsUpdate = this.pos.needsUpdate = !0),
        (this.next = 0),
        (this.count = 0),
        (this.mesh.visible = !1));
    }
    add(e, t, i, s, o = 1, r = 1) {
      let a = this.uvs[i] || this.uvs.bullet_concrete,
        l = a[(Math.random() * a.length) | 0],
        c = (s || ZP[i] || 0.25) * (0.85 + Math.random() * 0.3) * 0.5,
        u = this.next;
      ((this.next = (u + 1) % this.cap), this.count < this.cap && this.count++);
      let f = t.x,
        h = t.y,
        p = t.z,
        d = Math.hypot(f, h, p) || 1;
      ((f /= d), (h /= d), (p /= d));
      let m, x, v;
      Math.abs(h) > 0.9 ? ((m = 1), (x = 0), (v = 0)) : ((m = -p), (x = 0), (v = f));
      let y = m * f + x * h + v * p;
      ((m -= f * y), (x -= h * y), (v -= p * y));
      let b = Math.hypot(m, x, v) || 1;
      ((m /= b), (x /= b), (v /= b));
      let g = h * v - p * x,
        E = p * m - f * v,
        M = f * x - h * m,
        _ = i === 'bullet_wood' ? (Math.random() - 0.5) * 0.3 : Math.random() * 6.283,
        T = Math.cos(_),
        w = Math.sin(_),
        S = (m * T + g * w) * c,
        R = (x * T + E * w) * c,
        z = (v * T + M * w) * c,
        I = (g * T - m * w) * c,
        L = (E * T - x * w) * c,
        U = (M * T - v * w) * c,
        k = 0.004 + (u % 7) * 3e-4,
        C = e.x + f * k,
        A = e.y + h * k,
        F = e.z + p * k,
        H = this.pos.array,
        N = this.nor.array,
        Z = this.uv.array,
        Q = this.col.array,
        W = u * 12;
      ((H[W] = C - S - I),
        (H[W + 1] = A - R - L),
        (H[W + 2] = F - z - U),
        (H[W + 3] = C + S - I),
        (H[W + 4] = A + R - L),
        (H[W + 5] = F + z - U),
        (H[W + 6] = C + S + I),
        (H[W + 7] = A + R + L),
        (H[W + 8] = F + z + U),
        (H[W + 9] = C - S + I),
        (H[W + 10] = A - R + L),
        (H[W + 11] = F - z + U));
      for (let J = 0; J < 4; J++) ((N[W + J * 3] = f), (N[W + J * 3 + 1] = h), (N[W + J * 3 + 2] = p));
      ((W = u * 8),
        (Z[W] = l[0]),
        (Z[W + 1] = l[1]),
        (Z[W + 2] = l[2]),
        (Z[W + 3] = l[1]),
        (Z[W + 4] = l[2]),
        (Z[W + 5] = l[3]),
        (Z[W + 6] = l[0]),
        (Z[W + 7] = l[3]),
        (W = u * 16),
        (this.baseA[u] = r));
      for (let J = 0; J < 4; J++)
        ((Q[W + J * 4] = o), (Q[W + J * 4 + 1] = o), (Q[W + J * 4 + 2] = o), (Q[W + J * 4 + 3] = r));
      if (this.count >= this.cap)
        for (let J = 0; J < Qw; J++) {
          let G = (this.next + J) % this.cap,
            te = (this.baseA[G] * (J + 1)) / (Qw + 1),
            oe = G * 16;
          Q[oe + 3] = Q[oe + 7] = Q[oe + 11] = Q[oe + 15] = te;
        }
      ((this.pos.needsUpdate = this.nor.needsUpdate = this.uv.needsUpdate = this.col.needsUpdate = !0),
        (this.mesh.visible = !0));
    }
  };

var e6 = 1400,
  t6 = 3200,
  Et = Math.random,
  lt = (n, e) => n + (e - n) * Math.random(),
  Ut = new THREE.Vector3(),
  jt = new THREE.Vector3(),
  Qg = new THREE.Vector3(),
  st = new THREE.Vector3(),
  Ls = new THREE.Vector3(),
  jo = new THREE.Vector3(),
  Ri = new THREE.Vector3(0, 1, 0),
  jP = new THREE.Vector3(0, -1, 0),
  e5 = new THREE.Color(),
  Lo = [1, 1, 1];

function ph(n, e, t, i) {
  return (
    n == null
      ? ((Lo[0] = e), (Lo[1] = t), (Lo[2] = i))
      : Array.isArray(n)
        ? ((Lo[0] = n[0]), (Lo[1] = n[1]), (Lo[2] = n[2]))
        : n.isColor
          ? ((Lo[0] = n.r), (Lo[1] = n.g), (Lo[2] = n.b))
          : (e5.set(n), (Lo[0] = e5.r), (Lo[1] = e5.g), (Lo[2] = e5.b)),
    Lo
  );
}

function go(n, e, t) {
  let i = Et() * 2 - 1,
    s = Et() * 2 - 1,
    o = Et() * 2 - 1,
    r = Math.hypot(i, s, o) || 1,
    a = (e * Math.cbrt(Et())) / r;
  t.set(n.x + i * a, n.y + s * a, n.z + o * a);
  let l = t.length();
  return (l < 1e-4 ? t.copy(n) : t.multiplyScalar(1 / l), t);
}

async function f1(n) {
  let e = n.scene || (n.render && n.render.scene),
    t = new THREE.Vector3(-0.8, 0, 0.3),
    i = new THREE.Vector3(Z0.color.r, Z0.color.g, Z0.color.b).multiplyScalar((Z0.intensity / Math.PI) * 0.9),
    s = new THREE.Vector3(
      T0.zenith.r * 0.6 + T0.horizonAway.r * 0.5 + T0.fog.r * 0.25,
      T0.zenith.g * 0.6 + T0.horizonAway.g * 0.5 + T0.fog.g * 0.25,
      T0.zenith.b * 0.6 + T0.horizonAway.b * 0.5 + T0.fog.b * 0.25,
    ),
    o = new THREE.Vector3(
      T0.horizonAway.r * 0.3 + T0.fog.r * 0.14,
      T0.horizonAway.g * 0.3 + T0.fog.g * 0.14,
      T0.horizonAway.b * 0.3 + T0.fog.b * 0.14,
    ),
    r = Vv(n, e6, {
      lit: !0,
      tex: qw(128),
      cols: uh,
      rows: Wg,
      renderOrder: 10,
      sun: i,
      sunDir: Z0.dir.clone().normalize(),
      ambLo: o,
      ambHi: s,
    }),
    a = Vv(n, t6, { lit: !1, tex: Xw(128), cols: c1, rows: Uv, renderOrder: 20 }),
    l = new u1(e6, !0),
    c = new u1(t6 - 160, !1),
    u = new Yg(48),
    f = new jg(n, 256),
    h = new Kg(n, 60),
    p = new Jg(n, 160),
    d = new THREE.Group();
  ((d.name = 'fx'), d.add(p.mesh, f.mesh, h.mesh, r.mesh, a.mesh), e.add(d));
  let m = 0,
    x = -1,
    v = -1,
    y = () => n.render && n.render.lightPool,
    b = (j, O, q, ue, de) => {
      let $ = y();
      $ && $.flash(j, O, q, ue, de);
    };
  function g(j, O) {
    let q = n.physics;
    if (!q || !q.raycast) return 1;
    (Ls.copy(j), O && Ls.addScaledVector(O, 0.08), (Ls.y += 0.03));
    let ue = null;
    try {
      ue = q.raycast(Ls, Z0.dir, 90);
    } catch {
      ue = null;
    }
    return ue ? 0.2 : 1;
  }
  function E(j) {
    let O = n.physics;
    if (!O || !O.raycast) return 0;
    (Ls.copy(j), (Ls.y += 0.1));
    let q = null;
    try {
      q = O.raycast(Ls, jP, 12);
    } catch {
      q = null;
    }
    return q ? q.point.y : -50;
  }
  function M(j, O, q, ue, de, $, se, fe, me, ge, ce, P, D, B, X, re, Y, he) {
    let V = l.emit(j, O, q, ue, de, $, se, fe, me);
    return V < 0
      ? -1
      : ((l.r[V] = ge),
        (l.g[V] = ce),
        (l.b[V] = P),
        (l.a[V] = D),
        (l.shade[V] = B),
        (l.drag[V] = X),
        (l.grav[V] = -re),
        (l.wind[V] = Y),
        (l.turb[V] = 0.5),
        (l.rot[V] = Et() * 6.283),
        (l.rotv[V] = (Et() - 0.5) * 1.2),
        (l.frame[V] = he < 0 ? (Et() * 6) | 0 : he),
        (l.fin[V] = 0.06),
        (l.fout[V] = 0.3),
        (l.sk[V] = 2.5),
        V);
  }
  function _(j, O, q, ue, de, $, se, fe, me, ge, ce, P) {
    let D = c.emit(j, O, q, ue, de, $, se, fe, fe * 0.5);
    return D < 0
      ? -1
      : ((c.mode[D] = 1),
        (c.frame[D] = Bv),
        (c.stretch[D] = 0.03),
        (c.grav[D] = 9.81),
        (c.drag[D] = 0.9),
        (c.ramp[D] = 1),
        (c.r[D] = me * 0.6),
        (c.g[D] = ge * 0.6),
        (c.b[D] = ce * 0.6),
        (c.fout[D] = 0.55),
        (c.flags[D] = P),
        (c.sk[D] = 1),
        D);
  }
  function T(j, O, q, ue, de, $, se, fe, me, ge, ce, P) {
    for (let D = 0; D < q; D++) {
      go(O, $, st);
      let B = lt(ue, de) * (0.35 + 0.65 * Et());
      _(
        j.x,
        j.y,
        j.z,
        st.x * B,
        st.y * B,
        st.z * B,
        lt(se, fe),
        lt(0.01, 0.02),
        me * lt(0.6, 1.2),
        ge * lt(0.6, 1.2),
        ce,
        P,
      );
    }
  }
  function w(j, O, q, ue, de, $, se, fe, me, ge) {
    let ce = c.emit(j, O, q, 0, 0, 0, ue, de, $);
    return ce < 0
      ? -1
      : ((c.frame[ce] = ge),
        (c.r[ce] = se),
        (c.g[ce] = fe),
        (c.b[ce] = me),
        (c.fout[ce] = 0.2),
        (c.rot[ce] = Et() * 6.283),
        (c.sk[ce] = 1.5),
        ce);
  }
  function S(j, O, q, ue, de, $, se, fe, me) {
    let ge = c.emit(j, O, q, 0, 0, 0, ue, de, $);
    return ge < 0
      ? -1
      : ((c.mode[ge] = 2),
        (c.frame[ge] = Hv),
        (c.r[ge] = se),
        (c.g[ge] = fe),
        (c.b[ge] = me),
        (c.fout[ge] = 0.15),
        (c.fin[ge] = 0.08),
        (c.sk[ge] = 2.2),
        (c.rot[ge] = Et() * 6.283),
        ge);
  }
  function R(j, O, q, ue, de, $, se, fe, me, ge, ce, P, D, B, X, re) {
    for (let Y = 0; Y < q; Y++) {
      go(O, X, st);
      let he = lt(ue, de),
        V = lt(0.8, 1.15);
      f.add(
        j.x + st.x * 0.02,
        j.y + st.y * 0.02,
        j.z + st.z * 0.02,
        st.x * he,
        st.y * he + 0.8,
        st.z * he,
        lt($, se),
        lt(fe, me),
        lt(ge, ce),
        P * V,
        D * V,
        B * V,
        lt(3.5, 6),
        re,
      );
    }
  }
  function z(j, O, q = 12) {
    (jt.copy(O || Ri),
      jt.lengthSq() < 1e-6 && jt.copy(Ri),
      jt.normalize(),
      T(j, jt, q, 5, 18, 0.6, 0.15, 0.5, 36, 22, 9, hh),
      w(j.x, j.y, j.z, 0.05, 0.2, 0.35, 10, 6.5, 3, mo));
  }
  function I(j, O = {}) {
    let q = O.size || 1,
      ue = O.life || 2.5,
      de = O.rise === void 0 ? 0.6 : O.rise,
      $ = ph(O.color, 0.32, 0.32, 0.33),
      se = O.vel,
      fe = g(j, null),
      me = O.count || 3;
    for (let ge = 0; ge < me; ge++)
      M(
        j.x + (Et() - 0.5) * 0.2 * q,
        j.y + (Et() - 0.5) * 0.2 * q,
        j.z + (Et() - 0.5) * 0.2 * q,
        (se ? se.x : 0) + (Et() - 0.5) * 0.4,
        (se ? se.y : 0) + Et() * 0.3,
        (se ? se.z : 0) + (Et() - 0.5) * 0.4,
        ue * lt(0.75, 1.2),
        q * 0.3,
        q * lt(1, 1.5),
        $[0],
        $[1],
        $[2],
        O.alpha || 0.4,
        fe,
        1.2,
        de,
        1,
        -1,
      );
  }
  function L(j, O, q = 1, ue = 0.5, de = 0.48, $ = 0.45) {
    (Ut.copy(O || Ri), Ut.lengthSq() < 1e-6 && Ut.copy(Ri), Ut.normalize());
    let se = g(j, Ut);
    for (let fe = 0; fe < 8; fe++) {
      go(Ut, 0.5, st);
      let me = lt(1, 4.5) * q,
        ge = lt(0.85, 1.1);
      M(
        j.x + Ut.x * 0.03,
        j.y + Ut.y * 0.03,
        j.z + Ut.z * 0.03,
        st.x * me,
        st.y * me,
        st.z * me,
        lt(0.5, 1.1),
        0.08 * q,
        lt(0.35, 0.7) * q,
        ue * ge,
        de * ge,
        $ * ge,
        0.9,
        se,
        3.5,
        0.15,
        0.6,
        fe < 3 ? 7 : -1,
      );
    }
    for (let fe = 0; fe < 2; fe++)
      M(
        j.x + Ut.x * 0.15,
        j.y + Ut.y * 0.15,
        j.z + Ut.z * 0.15,
        Ut.x * 0.5 + (Et() - 0.5) * 0.3,
        Ut.y * 0.5 + 0.1,
        Ut.z * 0.5 + (Et() - 0.5) * 0.3,
        lt(2.2, 3.6),
        0.25 * q,
        lt(0.9, 1.5) * q,
        ue,
        de,
        $,
        0.28,
        se,
        1.5,
        0.1,
        1,
        -1,
      );
    return se;
  }
  function U(j, O = {}) {
    let q;
    if (O.color !== void 0) q = ph(O.color, 0.4, 0.4, 0.4);
    else if (O.mat) {
      let me = null;
      try {
        me = typeof O.mat == 'string' ? n.mats.get(O.mat) : O.mat;
      } catch {
        me = null;
      }
      q = ph(me && me.color ? me.color : null, 0.4, 0.4, 0.4);
    } else q = ph(null, 0.4, 0.39, 0.37);
    let ue = q[0],
      de = q[1],
      $ = q[2],
      se = O.size || 0.06,
      fe = O.speed || 5;
    (Ut.copy(O.normal || Ri).normalize(),
      R(
        j,
        Ut,
        Math.min(O.count || 6, 40),
        fe * 0.4,
        fe * 1.3,
        se * 0.4,
        se * 1.2,
        se * 0.3,
        se * 0.9,
        se * 0.4,
        se * 1.2,
        ue,
        de,
        $,
        O.spread || 1,
        E(j),
      ));
  }
  function k(j, O = 1) {
    let q = g(j, Ri),
      ue = j.y;
    for (let ge = 0; ge < 5; ge++) {
      let ce = lt(0.35, 0.6) * O,
        P = M(
          j.x + (Et() - 0.5) * 0.08 * O,
          ue + 0.1 * O,
          j.z + (Et() - 0.5) * 0.08 * O,
          (Et() - 0.5) * 0.5,
          lt(1.6, 2.8) * Math.sqrt(O),
          (Et() - 0.5) * 0.5,
          lt(0.4, 0.65),
          ce * 0.3,
          ce,
          0.72,
          0.78,
          0.84,
          0.95,
          q,
          0.5,
          -7,
          0,
          6,
        );
      P >= 0 &&
        ((l.rot[P] = (Et() - 0.5) * 0.3), (l.rotv[P] = 0), (l.turb[P] = 0), (l.sk[P] = 3), (l.fout[P] = 0.4));
    }
    for (let ge = 0; ge < 2; ge++)
      M(
        j.x,
        ue + 0.15 * O,
        j.z,
        (Et() - 0.5) * 0.6,
        0.5,
        (Et() - 0.5) * 0.6,
        lt(0.7, 1.1),
        0.2 * O,
        0.7 * O,
        0.7,
        0.75,
        0.8,
        0.14,
        q,
        2,
        0,
        0.8,
        -1,
      );
    let de = 1.9 * q + 0.35,
      $ = 1.5 * q + 0.45,
      se = 1.05 * q + 0.55,
      fe = Math.round(14 * Math.min(O, 1.6));
    for (let ge = 0; ge < fe; ge++) {
      go(Ri, 0.75, st);
      let ce = lt(1.5, 4.8) * Math.sqrt(O),
        P = c.emit(
          j.x,
          ue + 0.03,
          j.z,
          st.x * ce,
          Math.abs(st.y) * ce,
          st.z * ce,
          lt(0.5, 1),
          lt(0.012, 0.024),
          0.01,
        );
      P >= 0 &&
        ((c.mode[P] = 1),
        (c.frame[P] = fh),
        (c.stretch[P] = 0.012),
        (c.grav[P] = 9.81),
        (c.drag[P] = 0.4),
        (c.r[P] = de),
        (c.g[P] = $),
        (c.b[P] = se),
        (c.fout[P] = 0.7),
        (c.flags[P] = dh),
        (c.sk[P] = 1),
        (c.gy[P] = ue));
    }
    S(j.x, ue + 0.012, j.z, 0.9, 0.12 * O, 1.5 * O, 0.3 * q + 0.08, 0.27 * q + 0.09, 0.22 * q + 0.1);
    let me = S(j.x, ue + 0.012, j.z, 1.3, 0.05 * O, 1 * O, 0.2 * q + 0.05, 0.18 * q + 0.06, 0.15 * q + 0.07);
    me >= 0 && (c.fin[me] = 0.35);
  }
  let C = { p: new THREE.Vector3() };
  function A(j, O, q, ue, de) {
    (Ut.copy(O || Ri),
      Ut.lengthSq() < 1e-6 && Ut.copy(Ri),
      Ut.normalize(),
      ue && ue.lengthSq() > 1e-6 ? jt.copy(ue).normalize() : jt.copy(Ut).negate(),
      Qg.copy(jt)
        .addScaledVector(Ut, -2 * jt.dot(Ut))
        .normalize());
    let $ = C.p.copy(j);
    if ((de && (q = 'enemy'), q !== 'enemy' && q !== 'water' && Ut.y > 0.7 && n.ground && n.ground.isPuddle))
      try {
        n.ground.isPuddle($.x, $.z) && $.y < 0.08 && (q = 'water');
      } catch {}
    let fe = (n.camera ? n.camera.position : Ls.set(0, 0, 0)).distanceToSquared($) > 3025,
      me = fe ? 0.5 : 1,
      ge = Ut.x,
      ce = Ut.y,
      P = Ut.z;
    switch (q) {
      case 'metal': {
        (st.copy(Qg).addScaledVector(Ut, 0.6).normalize(),
          jt.copy(st),
          T($, jt, Math.round(18 * me), 6, 24, 0.55, 0.1, 0.38, 40, 25, 10.5, 0),
          T($, jt, 2 + ((Et() * 2) | 0), 9, 18, 0.9, 0.7, 1.3, 32, 18, 7, hh),
          w($.x + ge * 0.03, $.y + ce * 0.03, $.z + P * 0.03, 0.05, 0.25, 0.45, 16, 11, 5.5, mo),
          w(
            $.x + ge * 0.04,
            $.y + ce * 0.04,
            $.z + P * 0.04,
            0.04,
            0.35,
            0.5,
            9,
            6,
            2.6,
            Gl + ((Et() * 2) | 0),
          ),
          m - x > 0.09 && ((x = m), Ls.copy($).addScaledVector(Ut, 0.12), b(Ls, 16760944, 10, 5, 0.05)));
        let D = g($, Ut);
        for (let B = 0; B < 2; B++)
          M(
            $.x + ge * 0.04,
            $.y + ce * 0.04,
            $.z + P * 0.04,
            ge * 0.8 + (Et() - 0.5) * 0.5,
            ce * 0.8 + 0.2,
            P * 0.8 + (Et() - 0.5) * 0.5,
            lt(0.5, 0.9),
            0.06,
            lt(0.3, 0.5),
            0.4,
            0.4,
            0.41,
            0.4,
            D,
            2.5,
            0.3,
            0.8,
            -1,
          );
        (fe || R($, Ut, 2, 1.5, 4, 0.012, 0.03, 0.003, 0.005, 0.01, 0.025, 0.2, 0.21, 0.23, 0.8, E($)),
          p.add($, Ut, 'bullet_metal'));
        break;
      }
      case 'wood': {
        let D = L($, Ut, 0.75, 0.5, 0.42, 0.32);
        (R($, Ut, fe ? 3 : 7, 2, 6, 0.004, 0.009, 0.03, 0.1, 0.004, 0.012, 0.62, 0.5, 0.33, 0.7, E($)),
          D > 0.5 && Et() < 0.3 && w($.x, $.y, $.z, 0.04, 0.1, 0.2, 3, 2, 1, mo),
          p.add($, Ut, 'bullet_wood'));
        break;
      }
      case 'water': {
        k($, 1);
        break;
      }
      case 'rubber':
      case 'dirt': {
        let D = g($, Ut),
          B = q === 'dirt',
          X = B ? 0.3 : 0.14,
          re = B ? 0.25 : 0.14,
          Y = B ? 0.19 : 0.14;
        for (let he = 0; he < 5; he++) {
          go(Ut, 0.6, st);
          let V = lt(0.6, 2.6);
          M(
            $.x + ge * 0.03,
            $.y + ce * 0.03,
            $.z + P * 0.03,
            st.x * V,
            st.y * V,
            st.z * V,
            lt(0.5, 1),
            0.07,
            lt(0.3, 0.55),
            X,
            re,
            Y,
            0.85,
            D,
            3.5,
            0.1,
            0.6,
            he < 2 ? 7 : -1,
          );
        }
        (R($, Ut, 3, 1.5, 4, 0.01, 0.03, 0.008, 0.02, 0.01, 0.03, X * 0.8, re * 0.8, Y * 0.8, 0.7, E($)),
          p.add($, Ut, 'soot', 0.2, 1, 0.8));
        break;
      }
      case 'glass': {
        for (let D = 0; D < 12; D++) {
          go(Ut, 0.9, st);
          let B = lt(1.5, 6),
            X = c.emit($.x, $.y, $.z, st.x * B, st.y * B, st.z * B, lt(0.4, 0.9), lt(0.012, 0.02), 0.008);
          X >= 0 &&
            ((c.mode[X] = 1),
            (c.frame[X] = fh),
            (c.stretch[X] = 0.01),
            (c.grav[X] = 9.81),
            (c.r[X] = 2.6),
            (c.g[X] = 2.7),
            (c.b[X] = 2.8),
            (c.flags[X] = dh),
            (c.ramp[X] = 3));
        }
        (R($, Ut, 4, 1.5, 5, 0.01, 0.03, 0.002, 0.004, 0.01, 0.03, 0.62, 0.72, 0.74, 0.8, E($)),
          M(
            $.x,
            $.y,
            $.z,
            ge * 0.6,
            ce * 0.6 + 0.2,
            P * 0.6,
            0.6,
            0.08,
            0.4,
            0.75,
            0.8,
            0.82,
            0.2,
            g($, Ut),
            2.5,
            0.2,
            0.8,
            -1,
          ),
          p.add($, Ut, 'bullet_glass'));
        break;
      }
      case 'enemy': {
        (st.copy(Qg).addScaledVector(Ut, 0.8).normalize(),
          jt.copy(st),
          T($, jt, Math.round(13 * me), 5, 20, 0.9, 0.12, 0.45, 42, 29, 14, 0),
          T($, jt, 2, 6, 12, 1, 0.6, 1.1, 32, 18, 7, hh),
          w($.x, $.y, $.z, 0.06, 0.3, 0.55, 18, 12, 6, mo),
          w($.x, $.y, $.z, 0.04, 0.3, 0.45, 8, 5, 2.4, Gl + ((Et() * 2) | 0)),
          m - x > 0.09 && ((x = m), b($, 16756832, 8, 4.5, 0.05)));
        let D = g($, Ut);
        for (let B = 0; B < 2; B++)
          M(
            $.x,
            $.y,
            $.z,
            ge * 0.5 + (Et() - 0.5) * 0.4,
            ce * 0.5 + 0.3,
            P * 0.5 + (Et() - 0.5) * 0.4,
            lt(0.6, 1.1),
            0.06,
            lt(0.3, 0.5),
            0.13,
            0.13,
            0.14,
            0.65,
            D,
            2.2,
            0.5,
            0.9,
            -1,
          );
        if (!fe) {
          let B = Et() < 0.35;
          R(
            $,
            Ut,
            3,
            2,
            6,
            0.012,
            0.035,
            0.004,
            0.008,
            0.012,
            0.03,
            0.6,
            B ? 0.2 : 0.62,
            B ? 0.05 : 0.64,
            0.8,
            E($),
          );
        }
        break;
      }
      default: {
        (L($, Ut, 1, 0.52, 0.5, 0.47),
          R(
            $,
            Ut,
            fe ? 2 : 4,
            1.5,
            5.5,
            0.012,
            0.035,
            0.008,
            0.02,
            0.012,
            0.035,
            0.42,
            0.41,
            0.39,
            0.7,
            E($),
          ),
          st.copy(Qg).addScaledVector(Ut, 0.7).normalize(),
          jt.copy(st));
        for (let D = 0; D < 4; D++) {
          go(jt, 0.5, st);
          let B = lt(3, 9),
            X = M(
              $.x,
              $.y,
              $.z,
              st.x * B,
              st.y * B,
              st.z * B,
              lt(0.25, 0.45),
              0.03,
              0.09,
              0.6,
              0.58,
              0.54,
              0.7,
              1,
              2,
              -6,
              0.2,
              7,
            );
          X >= 0 && (l.turb[X] = 0);
        }
        (Et() < 0.3 && T($, jt, 3, 4, 10, 0.6, 0.08, 0.2, 26, 15, 6, 0), p.add($, Ut, 'bullet_concrete'));
      }
    }
  }
  function F(j, O, q = {}) {
    let ue = ph(q.color, 1, 0.8, 0.46),
      de = q.intensity || 16;
    if (
      (u.add(j, O, ue[0] * de, ue[1] * de, ue[2] * de, q.speed || 260, q.width || 0.024),
      m - v > 0.07 && q.trail !== !1)
    ) {
      ((v = m), st.subVectors(O, j));
      let $ = st.length();
      if ($ > 2) {
        st.multiplyScalar(1 / $);
        let se = 5,
          fe = Math.min($, 7),
          me = g(j, null);
        for (let ge = 0; ge < se; ge++) {
          let ce = 0.6 + ((ge + Et()) / se) * (fe - 0.6),
            P = M(
              j.x + st.x * ce,
              j.y + st.y * ce,
              j.z + st.z * ce,
              st.x * 0.6,
              0.05,
              st.z * 0.6,
              lt(0.45, 0.8),
              0.04,
              lt(0.12, 0.2),
              0.6,
              0.6,
              0.62,
              0.1,
              me,
              2,
              0.1,
              0.7,
              -1,
            );
          P >= 0 && (l.fin[P] = 0.25);
        }
      }
    }
  }
  function H(j, O, q = {}) {
    let ue = q.scale || 1;
    (jt.copy(O || Ri), jt.lengthSq() < 1e-6 && jt.set(0, 0, -1), jt.normalize());
    let de = ph(q.color, 1, 0.68, 0.32),
      $ = j.x,
      se = j.y,
      fe = j.z,
      me = de[0],
      ge = de[1],
      ce = de[2];
    (w(
      $ + jt.x * 0.1 * ue,
      se + jt.y * 0.1 * ue,
      fe + jt.z * 0.1 * ue,
      0.045,
      0.75 * ue,
      1.15 * ue,
      34 * me,
      34 * ge,
      34 * ce,
      Gl,
    ),
      w(
        $ + jt.x * 0.14 * ue,
        se + jt.y * 0.14 * ue,
        fe + jt.z * 0.14 * ue,
        0.035,
        0.5 * ue,
        0.85 * ue,
        22 * me,
        22 * ge,
        22 * ce,
        Gl + 1,
      ),
      w(
        $ + jt.x * 0.05 * ue,
        se + jt.y * 0.05 * ue,
        fe + jt.z * 0.05 * ue,
        0.045,
        0.13 * ue,
        0.2 * ue,
        22,
        22 * (ge + 0.25),
        22 * (ce + 0.3),
        mo,
      ),
      w($, se, fe, 0.05, 0.8 * ue, 1.1 * ue, 0.4 * me, 0.4 * ge, 0.4 * ce, mo));
    let P = c.emit(
      $ + jt.x * 0.4 * ue,
      se + jt.y * 0.4 * ue,
      fe + jt.z * 0.4 * ue,
      -jt.x,
      -jt.y,
      -jt.z,
      0.04,
      0.11 * ue,
      0.14 * ue,
    );
    P >= 0 &&
      ((c.mode[P] = 1),
      (c.frame[P] = qg),
      (c.stretch[P] = 0.9 * ue),
      (c.r[P] = 18 * me),
      (c.g[P] = 18 * ge),
      (c.b[P] = 18 * ce),
      (c.fout[P] = 0.3));
    for (let D = 0; D < 3; D++) {
      go(jt, 0.25, st);
      let B = lt(8, 22);
      _($, se, fe, st.x * B, st.y * B, st.z * B, lt(0.08, 0.22), 0.012, 30, 18, 7, 0);
    }
    (M(
      $ + jt.x * 0.2,
      se + jt.y * 0.2,
      fe + jt.z * 0.2,
      jt.x * 1.5,
      jt.y * 1.5 + 0.2,
      jt.z * 1.5,
      lt(0.5, 0.9),
      0.08 * ue,
      0.45 * ue,
      0.5,
      0.5,
      0.52,
      0.16,
      1,
      3,
      0.3,
      0.8,
      -1,
    ),
      Ls.copy(j).addScaledVector(jt, 0.25),
      b(Ls, 16756832, 16 * ue, 7 * ue, 0.05));
  }
  function N(j, O) {
    h.add(j, O);
  }
  let Z = { pos: new THREE.Vector3(), size: 1 };
  function Q(j, O = 1) {
    let q = Math.max(0.4, Math.min(O, 4)),
      ue = j.x,
      de = j.y,
      $ = j.z,
      se = Math.sqrt(q),
      fe = E(j),
      me = de - fe < 1.4 * q,
      ge = g(j, Ri);
    (Ls.set(ue, de + 0.4, $),
      b(Ls, 16769712, 320 * q, 10 + 9 * q, 0.08),
      b(Ls, 16747056, 55 * q, 8 + 6 * q, 0.45));
    let ce = de + 0.35 * q;
    (w(ue, ce, $, 0.055, 1.5 * q, 2.3 * q, 16, 13.5, 9.5, mo),
      w(ue, ce, $, 0.05, 2.6 * q, 4.2 * q, 7, 5, 2.4, Gl + ((Et() * 2) | 0)),
      w(ue, ce, $, 0.3, 3.5 * q, 5.5 * q, 0.35, 0.2, 0.08, mo));
    let P = Math.round(13 + 5 * q);
    for (let X = 0; X < P; X++) {
      (go(Ri, 1.6, st), me && st.y < -0.1 && (st.y = -st.y * 0.5));
      let re = lt(2.2, 7.5) * se,
        Y = lt(0.7, 1.15),
        he = l.emit(
          ue + st.x * 0.3 * q,
          ce + st.y * 0.3 * q,
          $ + st.z * 0.3 * q,
          st.x * re,
          st.y * re + 1.4,
          st.z * re,
          lt(0.55, 1.05),
          0.85 * q,
          lt(1.8, 2.7) * q,
        );
      he >= 0 &&
        ((l.frame[he] = X % 4 === 0 ? 7 : (Et() * 6) | 0),
        (l.ramp[he] = 2),
        (l.r[he] = 5.8 * Y),
        (l.g[he] = 2.4 * Y),
        (l.b[he] = 0.5 * Y),
        (l.a[he] = 0.96),
        (l.shade[he] = 2 + ge),
        (l.drag[he] = 4),
        (l.grav[he] = -2.6),
        (l.wind[he] = 0.6),
        (l.turb[he] = 1.5),
        (l.rot[he] = Et() * 6.283),
        (l.rotv[he] = (Et() - 0.5) * 2.5),
        (l.sk[he] = 3),
        (l.fin[he] = 0),
        (l.fout[he] = 0.6));
    }
    for (let X = 0; X < 5; X++) {
      go(Ri, 1.4, st);
      let re = lt(2, 5) * se,
        Y = c.emit(
          ue + st.x * 0.3 * q,
          ce + st.y * 0.3 * q,
          $ + st.z * 0.3 * q,
          st.x * re,
          Math.abs(st.y) * re + 1.2,
          st.z * re,
          lt(0.3, 0.55),
          0.6 * q,
          lt(1.2, 1.8) * q,
        );
      Y >= 0 &&
        ((c.frame[Y] = Gg),
        (c.ramp[Y] = 2),
        (c.r[Y] = 2.4),
        (c.g[Y] = 1.1),
        (c.b[Y] = 0.3),
        (c.drag[Y] = 4),
        (c.grav[Y] = -2.5),
        (c.rot[Y] = Et() * 6.283),
        (c.sk[Y] = 3),
        (c.fout[Y] = 0.4));
    }
    let D = Math.round(11 + 5 * q);
    for (let X = 0; X < D; X++) {
      let re = X % 2 === 0;
      (go(Ri, 1.4, st), me && st.y < 0 && (st.y = -st.y * 0.4));
      let Y = (re ? lt(4.5, 9) : lt(1.5, 5)) * se,
        he = lt(0.04, 0.1),
        V = re ? 0.75 : 0.3,
        ne = M(
          ue + st.x * V * q,
          ce + st.y * V * q,
          $ + st.z * V * q,
          st.x * Y,
          st.y * Y + 0.8,
          st.z * Y,
          lt(2.8, 4.8),
          (re ? 0.8 : 1.2) * q,
          lt(2.6, 4.2) * q,
          he,
          he * 0.95,
          he * 0.9,
          re ? 0.7 : 0.8,
          ge,
          3.4,
          lt(0.8, 1.7),
          1,
          X % 3 === 0 ? 7 : -1,
        );
      ne >= 0 && ((l.fin[ne] = re ? 0.025 : 0.16), (l.fout[ne] = 0.35), (l.turb[ne] = 1.2));
    }
    G(ue, de + 0.3 * q, $, 'smolder', 1.3 + 0.3 * q, q, ge);
    let B = Math.min(90, Math.round(34 * q));
    for (let X = 0; X < B; X++) {
      (go(Ri, 1.5, st), me && st.y < 0 && (st.y = -st.y));
      let re = lt(6, 26) * se,
        Y = _(
          ue,
          de + 0.05,
          $,
          st.x * re,
          st.y * re,
          st.z * re,
          lt(0.5, 1.5),
          lt(0.014, 0.028),
          40,
          23,
          8,
          hh,
        );
      Y >= 0 && ((c.drag[Y] = 1.4), (c.stretch[Y] = 0.035));
    }
    for (let X = 0; X < 10 * q; X++) {
      go(Ri, 1.2, st);
      let re = lt(1, 5),
        Y = c.emit(ue, de + 0.3, $, st.x * re, Math.abs(st.y) * re + 1, st.z * re, lt(1.4, 3), 0.035, 0.02);
      Y >= 0 &&
        ((c.frame[Y] = mo),
        (c.ramp[Y] = 3),
        (c.r[Y] = 9),
        (c.g[Y] = 4),
        (c.b[Y] = 1),
        (c.drag[Y] = 1.2),
        (c.grav[Y] = 0.6),
        (c.turb[Y] = 3),
        (c.wind[Y] = 1),
        (c.fout[Y] = 0.5));
    }
    if (me) {
      let X = fe + 0.015;
      S(ue, X, $, 0.32, 0.6 * q, 9 * q, 1.6, 1.2, 0.75);
      let re = Math.round(12 + 3 * q);
      for (let Y = 0; Y < re; Y++) {
        let he = ((Y + Et()) / re) * 6.283,
          V = lt(5, 10) * se,
          ne = lt(0.42, 0.55),
          ye = M(
            ue + Math.cos(he) * 0.4 * q,
            X + 0.2,
            $ + Math.sin(he) * 0.4 * q,
            Math.cos(he) * V,
            lt(0.2, 0.9),
            Math.sin(he) * V,
            lt(1.2, 2.2),
            0.4 * q,
            lt(1.2, 1.9) * q,
            ne,
            ne * 0.96,
            ne * 0.9,
            0.26,
            ge,
            3,
            0.15,
            0.7,
            -1,
          );
        ye >= 0 && (l.fin[ye] = 0.1);
      }
      (jo.set(ue, fe, $), p.add(jo, Ri, 'scorch', 2.3 * q, 1, 0.92));
    }
    (jo.set(ue, Math.max(de, fe + 0.1), $),
      R(
        jo,
        Ri,
        Math.round(13 + 6 * q),
        4,
        13 * se,
        0.04,
        0.13,
        0.025,
        0.08,
        0.04,
        0.13,
        0.07,
        0.066,
        0.062,
        1.1,
        fe,
      ),
      Z.pos.copy(j),
      (Z.size = O),
      n.events.emit('explosion', Z));
  }
  let W = [];
  for (let j = 0; j < 24; j++) {
    let O = {
      active: !1,
      kind: 'steam',
      pos: new THREE.Vector3(),
      acc: 0,
      acc2: 0,
      ttl: 1 / 0,
      scale: 1,
      shade: 1,
      t: 0,
      light: null,
      drop: -1,
    };
    ((O.stop = () => {
      ((O.active = !1), O.light && (O.light.release(), (O.light = null)));
    }),
      (O.setPos = (q) => {
        O.pos.copy(q);
      }),
      W.push(O));
  }
  let J = { active: !1, pos: new THREE.Vector3(), stop() {}, setPos() {} };
  function G(j, O, q, ue, de, $, se) {
    let fe = null;
    for (let me = 0; me < W.length; me++)
      if (!W[me].active) {
        fe = W[me];
        break;
      }
    if (!fe) return J;
    if (
      ((fe.active = !0),
      (fe.kind = ue),
      fe.pos.set(j, O, q),
      (fe.acc = 0),
      (fe.acc2 = 0),
      (fe.ttl = de),
      (fe.scale = $),
      (fe.t = 0),
      (fe.drop = -1),
      (fe.shade = se === void 0 ? g(fe.pos, null) : se),
      ue === 'fire')
    ) {
      let me = y();
      ((fe.light = me && me.acquire ? me.acquire() : null),
        fe.light &&
          (fe.light.light.color.set(16747066),
          (fe.light.light.distance = 9),
          fe.light.light.position.set(j, O + 0.5, q)));
    }
    return fe;
  }
  function te(j, O = 'steam', q = {}) {
    return G(j.x, j.y, j.z, O, q.ttl || 1 / 0, q.scale || 1, void 0);
  }
  function oe(j) {
    for (let O = 0; O < W.length; O++) {
      let q = W[O];
      if (!q.active) continue;
      if (((q.t += j), q.t > q.ttl)) {
        q.stop();
        continue;
      }
      let ue = q.pos.x,
        de = q.pos.y,
        $ = q.pos.z,
        se = q.scale;
      if (q.kind === 'steam')
        for (q.acc += j * 13; q.acc > 1;) {
          q.acc -= 1;
          let fe = M(
            ue + (Et() - 0.5) * 0.08,
            de,
            $ + (Et() - 0.5) * 0.08,
            (Et() - 0.5) * 0.4,
            lt(1.4, 2.4),
            (Et() - 0.5) * 0.4,
            lt(1.8, 3),
            0.12 * se,
            lt(0.8, 1.3) * se,
            0.8,
            0.82,
            0.85,
            0.2,
            q.shade,
            1.3,
            0.5,
            1,
            -1,
          );
          fe >= 0 && ((l.fin[fe] = 0.12), (l.turb[fe] = 0.9));
        }
      else if (q.kind === 'smolder')
        for (q.acc += j * 9 * (1 - q.t / q.ttl); q.acc > 1;) {
          q.acc -= 1;
          let fe = lt(0.05, 0.11),
            me = M(
              ue + (Et() - 0.5) * 0.5 * se,
              de,
              $ + (Et() - 0.5) * 0.5 * se,
              (Et() - 0.5) * 0.6,
              lt(1.2, 2.4),
              (Et() - 0.5) * 0.6,
              lt(2.4, 3.8),
              0.5 * se,
              lt(1.6, 2.6) * se,
              fe,
              fe,
              fe,
              0.6,
              q.shade,
              1,
              0.9,
              1,
              -1,
            );
          me >= 0 && ((l.fin[me] = 0.12), (l.turb[me] = 1));
        }
      else if (q.kind === 'embers')
        for (q.acc += j * 8; q.acc > 1;) {
          q.acc -= 1;
          let fe = c.emit(
            ue + (Et() - 0.5) * 0.4 * se,
            de,
            $ + (Et() - 0.5) * 0.4 * se,
            (Et() - 0.5) * 0.6,
            lt(0.6, 1.8),
            (Et() - 0.5) * 0.6,
            lt(1.5, 3.2),
            lt(0.02, 0.04),
            0.012,
          );
          fe >= 0 &&
            ((c.frame[fe] = mo),
            (c.ramp[fe] = 3),
            (c.r[fe] = 10),
            (c.g[fe] = 4.2),
            (c.b[fe] = 1),
            (c.drag[fe] = 0.8),
            (c.grav[fe] = -0.5),
            (c.turb[fe] = 3.5),
            (c.wind[fe] = 1),
            (c.fout[fe] = 0.5));
        }
      else if (q.kind === 'fire') {
        for (q.acc += j * 24; q.acc > 1;) {
          q.acc -= 1;
          let fe = c.emit(
            ue + (Et() - 0.5) * 0.3 * se,
            de + 0.1 * se,
            $ + (Et() - 0.5) * 0.3 * se,
            (Et() - 0.5) * 0.5,
            lt(1.2, 2.6) * se,
            (Et() - 0.5) * 0.5,
            lt(0.35, 0.65),
            0.45 * se,
            lt(0.2, 0.35) * se,
          );
          fe >= 0 &&
            ((c.frame[fe] = Gg),
            (c.ramp[fe] = 2),
            (c.r[fe] = 9),
            (c.g[fe] = 5.5),
            (c.b[fe] = 2.2),
            (c.drag[fe] = 1),
            (c.rot[fe] = Et() * 6.283),
            (c.rotv[fe] = (Et() - 0.5) * 4),
            (c.fin[fe] = 0.12),
            (c.fout[fe] = 0.4),
            (c.wind[fe] = 1),
            (c.turb[fe] = 2));
        }
        for (q.acc2 += j * 4; q.acc2 > 1;) {
          q.acc2 -= 1;
          let fe = lt(0.05, 0.1),
            me = M(
              ue,
              de + 0.8 * se,
              $,
              (Et() - 0.5) * 0.4,
              lt(1.2, 2),
              (Et() - 0.5) * 0.4,
              lt(2.2, 3.4),
              0.3 * se,
              lt(1.1, 1.8) * se,
              fe,
              fe,
              fe,
              0.5,
              q.shade,
              0.9,
              0.8,
              1,
              -1,
            );
          me >= 0 && ((l.fin[me] = 0.2), (l.turb[me] = 1));
          let ge = c.emit(
            ue + (Et() - 0.5) * 0.3,
            de + 0.3,
            $ + (Et() - 0.5) * 0.3,
            Et() - 0.5,
            lt(1.5, 3),
            Et() - 0.5,
            lt(1, 2.2),
            0.03,
            0.012,
          );
          ge >= 0 &&
            ((c.frame[ge] = mo),
            (c.ramp[ge] = 3),
            (c.r[ge] = 10),
            (c.g[ge] = 4.2),
            (c.b[ge] = 1),
            (c.drag[ge] = 0.8),
            (c.grav[ge] = -0.6),
            (c.turb[ge] = 4),
            (c.wind[ge] = 1));
        }
        q.light && (q.light.light.intensity = (14 + 6 * Math.sin(q.t * 23) + 4 * Math.sin(q.t * 37.7)) * se);
      } else if (q.kind === 'drip') {
        if (((q.acc += j * 1.6), q.drop >= 0 && ((q.drop -= j), q.drop < 0))) {
          let fe = q.shade;
          S(ue, 0.014, $, 0.8, 0.05, 0.55, 0.4 * fe + 0.14, 0.36 * fe + 0.16, 0.3 * fe + 0.18);
          for (let me = 0; me < 3; me++) {
            go(Ri, 0.7, st);
            let ge = c.emit(ue, 0.03, $, st.x * 1.2, Math.abs(st.y) * 1.6, st.z * 1.2, 0.35, 0.012, 0.008);
            ge >= 0 &&
              ((c.mode[ge] = 1),
              (c.frame[ge] = fh),
              (c.stretch[ge] = 0.012),
              (c.grav[ge] = 9.81),
              (c.r[ge] = 1.6 * fe + 0.3),
              (c.g[ge] = 1.3 * fe + 0.4),
              (c.b[ge] = 0.9 * fe + 0.5),
              (c.flags[ge] = dh));
          }
        }
        for (; q.acc > 1;) {
          q.acc -= 1 + Et() * 0.6;
          let fe = Math.sqrt((2 * Math.max(de, 0.05)) / 9.81),
            me = c.emit(ue, de, $, 0, -0.2, 0, fe + 0.05, 0.014, 0.014);
          (me >= 0 &&
            ((c.mode[me] = 1),
            (c.frame[me] = fh),
            (c.stretch[me] = 0.02),
            (c.grav[me] = 9.81),
            (c.r[me] = 1.4 * q.shade + 0.4),
            (c.g[me] = 1.2 * q.shade + 0.5),
            (c.b[me] = 0.9 * q.shade + 0.6),
            (c.flags[me] = dh),
            (c.fout[me] = 0.98)),
            (q.drop = fe));
        }
      }
    }
  }
  n.events.on('impact', (j) => {
    !j || !j.point || A(j.point, j.normal, j.surface, j.dir, j.enemy);
  });
  let ee = (j, O) => {
    try {
      return !!(n.ground && n.ground.isPuddle && n.ground.isPuddle(j, O));
    } catch {
      return !1;
    }
  };
  (n.events.on('player:step', (j) => {
    let O = (j && j.pos) || (n.player && n.player.pos);
    O &&
      ((j && j.surface === 'water') || ee(O.x, O.z)) &&
      (jo.set(O.x, Math.max(0, O.y), O.z), k(jo, j && j.sprint ? 0.55 : 0.4));
  }),
    n.events.on('player:land', (j) => {
      let O = n.player && n.player.pos;
      if (O) {
        if ((jo.set(O.x, Math.max(0, O.y), O.z), (j && j.surface === 'water') || ee(O.x, O.z))) k(jo, 0.9);
        else if (j && j.speed > 5) {
          let q = g(jo, Ri);
          for (let ue = 0; ue < 6; ue++) {
            let de = Et() * 6.283;
            M(
              jo.x + Math.cos(de) * 0.2,
              jo.y + 0.08,
              jo.z + Math.sin(de) * 0.2,
              Math.cos(de) * 1.6,
              0.3,
              Math.sin(de) * 1.6,
              lt(0.7, 1.2),
              0.15,
              lt(0.5, 0.8),
              0.45,
              0.44,
              0.42,
              0.22,
              q,
              3,
              0.1,
              0.8,
              -1,
            );
          }
        }
      }
    }));
  function le(j) {
    (j > 0 || (j = 0), (m += j), oe(j));
    let O = n.camera ? n.camera.position : Ls.set(0, 0, 0);
    (r.begin(),
      l.update(j, r, O, t, m),
      r.end(),
      a.begin(),
      c.update(j, a, O, t, m),
      u.update(j, a, qg, mo),
      a.end(),
      f.update(j),
      h.update(j));
  }
  function xe() {
    (l.clear(), c.clear(), u.clear(), f.clear(), h.clear(), p.clear());
    for (let j of W) j.active && j.stop();
    (r.begin(), r.end(), a.begin(), a.end());
  }
  return {
    update: le,
    clear: xe,
    muzzleFlash: H,
    tracer: F,
    impact: A,
    sparks: z,
    smoke: I,
    dust: L,
    explosion: Q,
    shell: N,
    splash: k,
    addEmitter: te,
    debris: U,
    decal(j, O, q = 'bullet_concrete', ue) {
      (Ut.copy(O || Ri), p.add(j, Ut, q, ue));
    },
    wind: t,
    root: d,
    stats() {
      return { lit: l.n, add: c.n, tracers: u.n, debris: f.live, drawCalls: 5 };
    },
  };
}

function KP(n) {
  let e = n.fx,
    t = n.params.fxshow || 'all',
    i = new THREE.Group(),
    s = (N, Z, Q, W, J) => {
      let G = new THREE.Mesh(N, n.mats.get(Z));
      return (G.position.set(Q, W, J), (G.castShadow = G.receiveShadow = !0), i.add(G), G);
    };
  (s(Ei(2.6, 2.2, 0.3, 0.02), 'concrete', -3.2, 1.1, 0),
    s(Ei(2.2, 2, 0.08, 0.01), 'paint_blue', 0, 1, 0),
    s(Ei(1.2, 1.2, 1.2, 0.015), 'wood_pallet', 3.2, 0.6, 0),
    n.scene.add(i),
    n.physics.addBox([-4.5, 0, -0.15], [-1.9, 2.2, 0.15], { surface: 'concrete' }),
    n.physics.addBox([-1.1, 0, -0.04], [1.1, 2, 0.04], { surface: 'metal' }),
    n.physics.addBox([2.6, 0, -0.6], [3.8, 1.2, 0.6], { surface: 'wood' }));
  let o = (N, Z, Q) => new THREE.Vector3(N, Z, Q),
    r = o(-6.5, 1.5, 7),
    a = o(6.5, 1.4, 7),
    l = o(5.2, 1.3, 3.2),
    c = o(-4.6, 1.35, 4.2),
    u = o(0, 0, 0),
    f = o(0, 0, 0),
    h = o(0, 0, 0),
    p = o(0, 1, 0),
    d = {
      point: o(0, 0, 0),
      normal: o(0, 1, 0),
      surface: 'concrete',
      dir: o(0, 0, 0),
      enemy: null,
      from: 'player',
    },
    m = Math.random,
    x = 0,
    v = 0,
    y = 0,
    b = 0,
    g = 0,
    E = 0.2,
    M = 0,
    _ = 3.4,
    T = !1,
    w = t === 'all' || t === 'impact',
    S = t === 'all' || t === 'explosion',
    R = t === 'all' || t === 'tracer',
    z = t === 'explosion' ? 2.4 : 3.5;
  (t === 'explosion' && (_ = 0.6),
    (t === 'all' || t === 'impact') &&
      (e.addEmitter(o(-6.2, 0.05, -1.5), 'steam'),
      e.addEmitter(o(5.6, 0, 1.6), 'fire'),
      e.addEmitter(o(0.4, 2.6, 1.6), 'drip')));
  function I(N) {
    let Z = y++ % 2 ? a : r;
    if (((d.enemy = null), (d.from = 'player'), N === 5)) {
      (d.point.set(-1.5 + m() * 0.3, 2.5 + m() * 0.3, 0.8),
        d.normal.copy(Z).sub(d.point).normalize(),
        (d.surface = 'enemy'),
        (d.enemy = {}),
        d.dir.copy(d.point).sub(Z).normalize(),
        e.tracer(Z, d.point),
        n.events.emit('impact', d));
      return;
    }
    (N === 0
      ? u.set(-3.2 + (m() - 0.5) * 2, 0.4 + m() * 1.5, 0)
      : N === 1 || N === 7
        ? u.set((m() - 0.5) * 1.8, 0.3 + m() * 1.5, 0)
        : N === 2
          ? u.set(3.2 + (m() - 0.5) * 0.9, 0.2 + m() * 0.9, 0.6)
          : N === 3
            ? u.set(-1.6 + (m() - 0.5) * 1.2, 0, 2.2 + m())
            : N === 4
              ? u.set(1.5 + (m() - 0.5) * 0.8, 0, 2.6 + m() * 0.8)
              : u.set(3.4 + (m() - 0.5), 0, 2.4 + m() * 0.6),
      f.copy(u).sub(Z).normalize());
    let Q = n.physics.raycast(Z, f, 100);
    Q &&
      (d.point.copy(Q.point),
      d.normal.copy(Q.normal),
      d.dir.copy(f),
      (d.surface = N === 4 ? 'water' : N === 6 ? 'dirt' : Q.surface),
      e.tracer(Z, d.point),
      n.events.emit('impact', d));
  }
  let L = n.params.fxhold,
    U = o(0, 1.3, 3),
    k = o(1, 0, 0);
  function C(N) {
    if (
      ((x += N),
      L === 'muzzle' &&
        (e.muzzleFlash(U, k, { scale: 1 }),
        (U.x = 2.5),
        k.set(-0.5, 0, 0.86),
        e.muzzleFlash(U, k, { scale: 1.6 }),
        (U.x = 0),
        k.set(1, 0, 0)),
      w)
    )
      for (g -= N; g <= 0;) ((g += t === 'impact' ? 0.09 : 0.13), I(v++ % 8));
    if (
      (R &&
        ((E -= N),
        E <= 0 &&
          ((E += t === 'tracer' ? 0.16 : 0.45),
          h.set(-5 + m() * 3, 1.2 + m() * 0.8, 6 + m() * 2),
          f.copy(h).sub(l).normalize(),
          e.muzzleFlash(l, f, { scale: 1 }),
          e.tracer(l, h, { color: 16730658, speed: 120 }),
          t === 'tracer' &&
            (h.set(6, 1 + m() * 1.5, -6 - m() * 6), u.set(-7, 1.6, 6.5), e.tracer(u, h, { speed: 200 }))),
        (M -= N),
        M <= 0 &&
          ((M += 0.22), h.set(1.6 + m() * 0.8, 1.6 + m() * 0.8, 0.4 + (m() - 0.5) * 0.8), e.shell(c, h))),
      S && ((_ -= N), _ <= 0))
    ) {
      _ += z;
      let Z = +(n.params.fxsize || 0) || 1 + (b++ % 3);
      (h.set(t === 'explosion' ? 0 : 7, 0.25, t === 'explosion' ? 3.5 : -3.5), e.explosion(h, Z));
    }
  }
  let A = !1,
    F = e.update;
  e.update = (N) => {
    A || F(N);
  };
  let H = window.__setShot;
  return (
    H &&
      (window.__setShot = (N) => {
        if (N && N.fxage !== void 0) {
          (e.clear(), h.set(0, 0.25, 3.5), e.explosion(h, +(N.fxsize || 1.2)));
          let Z = +N.fxage;
          for (let Q = 0; Q < Z - 1e-6; Q += 1 / 60) F(1 / 60);
          (F(0), (A = !0));
        }
        H(N);
      }),
    {
      cam: t === 'explosion' ? [0, 2, 12.5] : [0.3, 1.6, 7.2],
      target: t === 'explosion' ? [0, 2.2, 3.5] : [0.2, 1, 0],
      update(N) {
        if (!T) {
          T = !0;
          let Z = +(n.params.fxt || 0);
          for (let Q = 0; Q < Z; Q += 1 / 30) (C(1 / 30), e.update(1 / 30));
        }
        A || C(N);
      },
    }
  );
}

export { Wv, f1 };
