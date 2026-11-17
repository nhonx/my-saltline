// @ts-nocheck

var at = Math.PI * 2;

function as(n) {
  let e = n >>> 0;
  return () => {
    ((e |= 0), (e = (e + 1831565813) | 0));
    let t = Math.imul(e ^ (e >>> 15), 1 | e);
    return ((t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t), ((t ^ (t >>> 14)) >>> 0) / 4294967296);
  };
}

function Gv(n) {
  let e = 2166136261;
  for (let t = 0; t < n.length; t++) ((e ^= n.charCodeAt(t)), (e = Math.imul(e, 16777619)));
  return e >>> 0;
}

var it = (n, e) => new Float32Array(Math.max(1, Math.round(n * e))),
  Dt = (n, e, t) => e + (t - e) * n(),
  qt = (n) => 440 * Math.pow(2, (n - 69) / 12);

function e0(n, e, t) {
  let i = it(n, e);
  for (let s = 0; s < i.length; s++) i[s] = t() * 2 - 1;
  return i;
}

function mu(n, e, t, i) {
  let s = (at * Math.max(10, Math.min(e, i * 0.47))) / i,
    o = Math.cos(s),
    r = Math.sin(s),
    a = r / (2 * t),
    l,
    c,
    u,
    f = 1 + a,
    h = -2 * o,
    p = 1 - a;
  return (
    n === 'lp'
      ? ((l = (1 - o) / 2), (c = 1 - o), (u = l))
      : n === 'hp'
        ? ((l = (1 + o) / 2), (c = -(1 + o)), (u = l))
        : ((l = a), (c = 0), (u = -a)),
    [l / f, c / f, u / f, h / f, p / f]
  );
}

function kt(n, e, t, i, s) {
  let [o, r, a, l, c] = mu(e, t, i, s),
    u = 0,
    f = 0;
  for (let h = 0; h < n.length; h++) {
    let p = n[h],
      d = o * p + u;
    ((u = r * p - l * d + f), (f = a * p - c * d), (n[h] = d));
  }
  return n;
}

function y0(n, e, t, i, s, o = 1) {
  let r = n.length;
  for (let a = 0; a < o; a++) {
    let l = 0,
      c = 0,
      u = null;
    a > 0 && ((l = y0.z1), (c = y0.z2));
    let f = a === o - 1 ? n : null;
    for (let h = 0; h < r; h++) {
      (h & 31) === 0 && (u = mu(e, t(h / r), typeof i == 'function' ? i(h / r) : i, s));
      let p = n[h],
        d = u[0] * p + l;
      ((l = u[1] * p - u[3] * d + c), (c = u[2] * p - u[4] * d), f && (f[h] = d));
    }
    ((y0.z1 = l), (y0.z2 = c));
  }
  return n;
}

var ei =
  (n, e, t = 1) =>
  (i) =>
    n * Math.pow(e / n, Math.pow(i, t));

function Mn(n, e, t) {
  for (let i = 0; i < n.length; i++) n[i] *= t(i / e);
  return n;
}

var ms = (n, e = 0) => (e > 0 ? (t) => (1 - Math.exp(-t / e)) * Math.exp(-t / n) : (t) => Math.exp(-t / n));

function Se(n, e, t, i, s) {
  let o = Math.round(t * s),
    r = Math.min(e.length, n.length - o);
  for (let a = Math.max(0, -o); a < r; a++) n[o + a] += e[a] * i;
  return n;
}

function Ni(n, e, t, i, s) {
  let o = n.length,
    r = Math.round(t * s) % o;
  r < 0 && (r += o);
  for (let a = 0; a < e.length; a++) ((n[r] += e[a] * i), ++r >= o && (r = 0));
  return n;
}

function Pr(n) {
  let e = 0;
  for (let t = 0; t < n.length; t++) {
    let i = Math.abs(n[t]);
    i > e && (e = i);
  }
  return e;
}

function ls(n, e) {
  for (let t = 0; t < n.length; t++) n[t] *= e;
  return n;
}

function fi(n, e) {
  let t = 1 / Math.tanh(e);
  for (let i = 0; i < n.length; i++) n[i] = Math.tanh(n[i] * e) * t;
  return n;
}

function n6(n, e, t, i) {
  let s = Math.min(n.length >> 1, Math.round(t * e)),
    o = Math.min(n.length >> 1, Math.round(i * e));
  for (let r = 0; r < s; r++) n[r] *= r / s;
  for (let r = 0; r < o; r++) {
    let a = r / o;
    n[n.length - 1 - r] *= a * a;
  }
  return n;
}

function xt(n, e, t, i, s = {}) {
  let o = e0(n, t, e);
  (s.hp && kt(o, 'hp', s.hp, 0.707, n),
    s.lp && kt(o, 'lp', s.lp, 0.707, n),
    s.bp && kt(o, 'bp', s.bp, s.q || 1, n),
    Mn(o, n, ms(i, s.att || 0)));
  let r = Pr(o);
  return r > 0 ? ls(o, 1 / r) : o;
}

function Gn(n, e, t, i, s, o, r = 6e-4) {
  let a = it(n, e),
    l = 0;
  for (let c = 0; c < a.length; c++) {
    let u = c / n;
    ((l += (at * (i + (t - i) * Math.exp(-u / s))) / n),
      (a[c] = Math.sin(l) * Math.exp(-u / o) * (1 - Math.exp(-u / r))));
  }
  return a;
}

function Va(n, e, t, i, s = !0) {
  let o = it(n, e),
    r = 0,
    a = o.length;
  for (let l = 0; l < a; l++) {
    let c = l / a;
    ((r += (at * t * Math.pow(i / t, c)) / n), (o[l] = Math.sin(r) * (s ? Math.sin(Math.PI * c) : 1)));
  }
  return o;
}

function Xt(n, e, t, i) {
  let s = it(n, e);
  for (let [r, a, l] of t) {
    if (r > n * 0.46) continue;
    let c = (at * r) / n,
      u = i ? i() * at : 0,
      f = Math.exp(-1 / (a * n)),
      h = 2 * f * Math.cos(c),
      p = f * f,
      d = Math.min(s.length, Math.ceil(Math.log(1e-5 / Math.max(l, 1e-5)) / Math.log(f)) + 1),
      m = (l / f) * Math.sin(u - c),
      x = l * Math.sin(u);
    for (let v = 0; v < d; v++) {
      s[v] += x;
      let y = h * x - p * m;
      ((m = x), (x = y));
    }
  }
  let o = Math.min(s.length, Math.round(4e-4 * n));
  for (let r = 0; r < o; r++) s[r] *= r / o;
  return s;
}

function Wa(n, e, t, i, s = {}) {
  let o = it(n, t),
    r = s.from || 0,
    a = s.fall || 1;
  for (let l = 0; l < i; l++) {
    let c = r + (t - r - 0.02) * Math.pow(e(), a),
      u = Math.round(c * n),
      f = Math.round(Dt(e, s.minLen || 0.001, s.maxLen || 0.004) * n),
      h = Dt(e, 0.2, 1) * (s.ampFall ? Math.exp(-c / s.ampFall) : 1);
    for (let p = 0; p < f && u + p < o.length; p++) o[u + p] += (e() * 2 - 1) * h * Math.exp((-4 * p) / f);
  }
  return (
    s.hp && kt(o, 'hp', s.hp, 0.707, n),
    s.lp && kt(o, 'lp', s.lp, 0.707, n),
    s.bp && kt(o, 'bp', s.bp, s.q || 1, n),
    o
  );
}

function t5(n, e, t) {
  let i = n.length - e,
    s = new Float32Array(e);
  s.set(n.subarray(0, e));
  for (let o = 0; o < i; o++) {
    let r = (o + 0.5) / i,
      a = t ? Math.sin((r * Math.PI) / 2) : r,
      l = t ? Math.cos((r * Math.PI) / 2) : 1 - r;
    s[o] = n[o] * a + n[e + o] * l;
  }
  return s;
}

function gu(n, e, t, i, s = 0.4) {
  let o = e0(n, e + s, t);
  return (i(o), t5(o, Math.round(n * e), !0));
}

function qv(n, ...e) {
  let t = new Float32Array(n);
  for (let [i, s] of e) for (let o = 0; o < Math.min(n, i.length); o++) t[o] += i[o] * s;
  return t;
}

var C0 = (n, e = 1) => {
  let t = Pr(n);
  return t > 0 ? ls(n, e / t) : n;
};

function n5(n, e) {
  let t = it(n, e * 12);
  for (let i = 0; i < t.length; i++) {
    let s = i / n / e;
    t[i] = (1 - s) * Math.exp(-s);
  }
  return t;
}

function s6(n, e, t, i, s, o) {
  let r = Math.exp(-1 / (s * e)),
    a = Math.exp(-1 / (o * e)),
    l = 1 / i - 1,
    c = 0;
  for (let u = 0; u < n.length; u++) {
    let f = Math.abs(n[u]);
    ((c = f > c ? r * c + (1 - r) * f : a * c + (1 - a) * f), c > t && (n[u] *= Math.pow(c / t, l)));
  }
  return n;
}

function JP(n, e, t, i, s = 1) {
  let o = Math.max(1, Math.round(t * e)),
    r = new Float32Array(n.length);
  for (let l = 0; l < n.length; l++) r[l] = n[l] + (l >= o ? r[l - o] * i : 0);
  let a = 1 - i * 0.5;
  for (let l = 0; l < n.length; l++) n[l] = n[l] * (1 - s) + r[l] * a * s;
  return n;
}

function Fn(n, e, t, i = {}) {
  let s = 0.004;
  for (let a of t) s = Math.max(s, a[1]);
  let o = it(n, Math.min(0.5, s * 7 + 0.004)),
    r = i.jit == null ? 0.02 : i.jit;
  return (
    Se(
      o,
      Xt(
        n,
        o.length / n,
        t.map(([a, l, c]) => [a * (1 + (e() * 2 - 1) * r), l, c]),
        e,
      ),
      0,
      i.ring == null ? 0.6 : i.ring,
      n,
    ),
    i.tick !== 0 &&
      Se(o, xt(n, e, 0.006, i.tickTau || 9e-4, { hp: i.hp || 2500 }), 0, i.tick == null ? 0.7 : i.tick, n),
    o
  );
}

function h1(n, e, t, i, s, o = {}) {
  let r = e0(n, t, e),
    a = o.q || 1.8,
    l = o.rough || 200,
    c = o.rough1 || l,
    u = r.length;
  if ((y0(r, 'bp', ei(i, s, o.curve || 1), a, n), o.hi)) {
    let m = e0(n, t, e);
    y0(m, 'bp', ei(i * 2.37, s * 2.37, o.curve || 1), a * 1.5, n);
    for (let x = 0; x < u; x++) r[x] += m[x] * o.hi;
  }
  let f = 0.5,
    h = 0.5,
    p = 0,
    d = o.env || ((m) => Math.sin(Math.PI * Math.pow(m, 0.7)));
  for (let m = 0; m < u; m++) {
    let x = m / u;
    (m >= p && ((h = 0.2 + e() * 0.8), (p = m + (n / (l + (c - l) * x)) * (0.6 + e() * 0.8))),
      (f += (h - f) * 0.03),
      (r[m] *= f * d(x)));
  }
  return C0(r);
}

function Yv(n, e, t, i, s, o) {
  let r = e0(n, t, e),
    a = r.length;
  y0(r, 'bp', ei(i, s), 0.7, n);
  let l = e0(n, t, e);
  kt(l, 'lp', 420, 0.7, n);
  let c = 0.4,
    u = 0.6,
    f = 0,
    h = 0.5,
    p = 0.5;
  for (let d = 0; d < a; d++) {
    let m = d / a;
    (d >= f && ((u = 0.15 + e() * 0.85), (f = d + n * (0.006 + e() * 0.016))),
      (d & 63) === 0 && (p = 0.5 + e() * 0.5),
      (c += (u - c) * 0.004),
      (h += (p - h) * 0.05),
      (r[d] = (r[d] * c * h + l[d] * 0.9 * c) * o(m)));
  }
  return C0(r);
}

var hi = (n, e, t = 28) => kt(n, 'hp', t, 0.707, e);

function o6(n, e, t, i = 0.72, s = 0.0012) {
  for (let o = 0; o < n.length; o++) n[o] *= i + (1 - i) * Math.exp(-Math.max(0, o / e - t) / s);
  return n;
}

var d1 =
    (n, e = 1) =>
    (t) =>
      Math.pow(t < n ? t / n : (1 - t) / (1 - n), e),
  QP = {
    len: 0.64,
    n: 5,
    pitch: [1, 0.965, 1.035, 0.985, 1.018],
    bright: [1, 1.07, 0.94, 1.04, 0.97],
    layers: [
      [85, 220, 1.75, 0.115, 0.125],
      [220, 950, 2.2, 0.1, 0.052],
      [950, 5e3, 1.5, 0.055, 0.026],
    ],
    hold: 0.022,
    holdTau: 0.0095,
    drive: 1.6,
    tPlus: 4e-4,
    blast: 2.5,
    f0: 150,
    f1: 62,
    tauF: 0.03,
    tauA: 0.055,
    thump: 0.2,
    lpEnd: 800,
    lpMid: 2600,
    lpMidTau: 0.07,
    lpTop: 15e3,
    lpTopTau: 0.0028,
    shelfF: 230,
    shelf: 0.55,
    plateau: 0.8,
    reDrive: 1.5,
    mech: [
      [
        0.021,
        0.05,
        [
          [2180, 0.007, 1],
          [3460, 0.006, 0.7],
          [1840, 0.009, 0.5],
        ],
        3e3,
      ],
      [
        0.058,
        0.07,
        [
          [1930, 0.009, 1],
          [2910, 0.007, 0.75],
          [4380, 0.005, 0.5],
          [860, 0.014, 0.4],
        ],
        2400,
      ],
    ],
    spring: [
      [706, 0.055, 1],
      [1418, 0.035, 0.4],
    ],
    springG: 0.02,
  },
  eI = {
    len: 0.44,
    n: 4,
    pitch: [1, 1.04, 0.962, 1.02],
    bright: [1, 0.95, 1.06, 1.02],
    layers: [
      [100, 270, 1.3, 0.16, 0.055],
      [270, 1400, 2.2, 0.2, 0.038],
      [1400, 5500, 1.8, 0.12, 0.016],
    ],
    hold: 0.01,
    holdTau: 0.005,
    drive: 1.5,
    tPlus: 45e-5,
    blast: 2.5,
    f0: 230,
    f1: 105,
    tauF: 0.014,
    tauA: 0.028,
    thump: 0.25,
    lpEnd: 1e3,
    lpMid: 2200,
    lpMidTau: 0.04,
    lpTop: 15e3,
    lpTopTau: 0.0024,
    shelfF: 260,
    shelf: 0.2,
    plateau: 0.78,
    reDrive: 1.5,
    mech: [
      [
        0.016,
        0.09,
        [
          [2920, 0.006, 1],
          [4410, 0.005, 0.8],
          [1650, 0.007, 0.4],
        ],
        3400,
      ],
      [
        0.046,
        0.12,
        [
          [3380, 0.008, 1],
          [5180, 0.007, 0.8],
          [1230, 0.01, 0.35],
        ],
        3e3,
      ],
    ],
    spring: [
      [1180, 0.02, 1],
      [2390, 0.012, 0.4],
    ],
    springG: 0.015,
  };

function r6(n, e, t, i) {
  let s = t % i.n,
    o = i.pitch[s],
    r = i.bright[s],
    a = 5e-4,
    l = it(n, i.len),
    c = l.length - Math.round(0.004 * n),
    u = new Float32Array(c);
  for (let [p, d, m, x, v] of i.layers) {
    let y = new Float32Array(c);
    for (let R = 0; R < c; R++) y[R] = e() * 2 - 1;
    (kt(y, 'hp', p * o, 0.707, n), kt(y, 'hp', p * o, 0.707, n), kt(y, 'lp', d * o * r, 0.707, n));
    let b = 0,
      g = Math.min(c, Math.round(0.12 * n));
    for (let R = 0; R < g; R++) b += y[R] * y[R];
    let E = 1 / Math.sqrt(b / g + 1e-12),
      M = Math.exp(-1 / (v * n)),
      _ = Math.exp(-1 / (i.holdTau * n)),
      T = Math.round(i.hold * n),
      w = x,
      S = m;
    for (let R = 0; R < c; R++) ((u[R] += y[R] * E * (S + w)), (w *= M), R >= T && (S *= _));
  }
  (Se(u, Gn(n, 0.3, i.f0 * o, i.f1 * o, i.tauF, i.tauA, 0.001), 0, i.thump, n),
    Se(u, n5(n, i.tPlus / o), 0, i.blast, n));
  for (let p = 0; p < c; p++) u[p] = Math.tanh(u[p] * i.drive);
  let f = (p) => {
    let d = (p * c) / n;
    return (i.lpEnd + i.lpMid * Math.exp(-d / i.lpMidTau)) * r + i.lpTop * Math.exp(-d / i.lpTopTau);
  };
  (y0(u, 'lp', f, 0.6, n), y0(u, 'lp', f, 0.6, n));
  let h = Float32Array.from(u);
  kt(h, 'lp', i.shelfF, 0.707, n);
  for (let p = 0; p < c; p++) u[p] += h[p] * i.shelf;
  hi(u, n, 30);
  {
    let p = 0,
      d = Math.round(0.004 * n),
      m = Math.round((i.hold + 0.004) * n);
    for (let x = d; x < m; x++) p += u[x] * u[x];
    ls(u, i.plateau / Math.sqrt(p / (m - d) + 1e-12));
  }
  (fi(u, i.reDrive), Se(l, u, a, 1, n));
  for (let p = 0; p < i.mech.length; p++) {
    let [d, m, x, v] = i.mech[p],
      y = a + d * Dt(e, 0.94, 1.06);
    (Se(
      l,
      Fn(
        n,
        e,
        x.map(([b, g, E]) => [b * o, g, E]),
        { hp: v, tick: 0.6, ring: 0.7 },
      ),
      y,
      m,
      n,
    ),
      p === i.mech.length - 1 &&
        Se(
          l,
          Xt(
            n,
            0.22,
            i.spring.map(([b, g, E]) => [b * o, g, E]),
            e,
          ),
          y + 0.002,
          i.springG,
          n,
        ));
  }
  return l;
}

var a6 = (n, e, t) => r6(n, e, t, QP),
  l6 = (n, e, t) => r6(n, e, t, eI),
  ql = (n) => Math.pow(10, n / 20),
  c6 = (n, e) => {
    for (let t = 0; t < n.length; t++) n[t] = e * Math.tanh(n[t] / e);
    return n;
  },
  xu = (n, e, t) => {
    let i = 0;
    ((e = Math.max(0, e | 0)), (t = Math.min(n.length, t | 0)));
    for (let s = e; s < t; s++) i += n[s] * n[s];
    return Math.sqrt(i / Math.max(1, t - e));
  };

function i6(n, e) {
  let t = Math.round(0.01 * e),
    i = Math.round(0.002 * e),
    s = 0;
  for (let o = 0; o + t <= n.length; o += i) s = Math.max(s, xu(n, o, o + t));
  return s;
}

function u6(n, e, t, i) {
  let s = Math.floor(e() * 1e9),
    o = as(s),
    r = i.len,
    a = i.ref,
    l = i.slaps[t % i.slaps.length].map(([m, x, v, y, b]) => {
      let g = e0(n, 0.16, o);
      return (
        kt(g, 'hp', 300, 0.7, n),
        kt(g, 'lp', v, 0.7, n),
        Mn(
          g,
          n,
          (E) => (1 - Math.exp(-E / 0.002)) * (E < i.slapHold ? 1 : Math.exp(-(E - i.slapHold) / i.slapTau)),
        ),
        C0(g),
        JP(g, n, b / 1e3, 0.5, 0.7),
        Se(
          g,
          Xt(
            n,
            0.1,
            [
              [Dt(o, 110, 190), 0.05, 1],
              [Dt(o, 240, 420), 0.035, 0.6],
            ],
            o,
          ),
          0.002,
          0.12,
          n,
        ),
        { b: ls(g, (a * ql(x)) / i6(g, n)), t: m - 0.007, pan: y }
      );
    }),
    c = e0(n, r, o),
    u = xt(n, o, 0.6, 0.14, { hp: 80, lp: 650, att: 0.04 });
  ls(u, (a * ql(i.far)) / i6(u, n));
  let f = e0(n, r - 0.1, o);
  (kt(f, 'lp', 130, 0.7, n),
    kt(f, 'hp', 34, 0.7, n),
    Mn(f, n, (m) => (1 - Math.exp(-m / 0.05)) * Math.exp(-Math.pow(m / i.lateT, 2))),
    ls(f, (a * ql(i.rumble)) / xu(f, 0.1 * n, 0.3 * n)));
  let h = Math.round(0.1 * n),
    p = Math.round(0.2 * n),
    d = (m) => {
      let x = as(s + 101 + m * 977),
        v = it(n, r),
        y = m ? 1 : -1,
        b = e0(n, r, x),
        g = it(n, r);
      for (let M = 0; M < g.length; M++) g[M] = c[M] * 0.72 + b[M] * 0.68;
      (y0(g, 'lp', ei(i.lp0, i.lp1, 0.55), 0.6, n), kt(g, 'hp', 140, 0.7, n));
      let E = Float32Array.from(g);
      (Mn(E, n, (M) => (1 - Math.exp(-M / 0.003)) * Math.exp(-M / i.earlyTau)),
        Mn(g, n, (M) => (1 - Math.exp(-M / 0.03)) * Math.exp(-Math.pow(M / i.lateT, 2))),
        Se(v, E, 0.004, (a * ql(i.early)) / xu(E, 0, 0.05 * n), n),
        Se(v, g, 0.004, (a * ql(i.floor)) / xu(g, h, p), n));
      for (let M of l) Se(v, M.b, M.t + (M.pan * y > 0 ? 0 : Math.abs(M.pan) * 9e-4), 1 + 0.4 * M.pan * y, n);
      return (Se(v, u, i.farT + (m ? 7e-4 : 0), m ? 0.85 : 1.1, n), Se(v, f, 0.03, 1, n), c6(v, i.ceil));
    };
  return [d(0), d(1)];
}

function f6(n, e, t, i) {
  let s = Math.floor(e() * 1e9),
    o = as(s),
    r = i.len,
    a = i.ref,
    l = e0(n, r, o),
    c = 18,
    u = [];
  for (let m = 0; m < c; m++)
    u.push([
      0.006 + 0.085 * Math.pow((m + o()) / c, 1.3),
      Math.pow(0.9, m) * Dt(o, 0.6, 1.1),
      o() * 2 - 1,
      Dt(o, 3200, 7500),
    ]);
  let f = t & 1 ? 0.051 : 0.046,
    h = Math.round(0.1 * n),
    p = Math.round(0.2 * n),
    d = (m) => {
      let x = as(s + 211 + m * 613),
        v = it(n, r),
        y = m ? 1 : -1,
        b = it(n, 0.5);
      for (let [_, T, w, S] of u)
        Se(
          b,
          xt(n, x, 0.03, 0.005, { hp: 350, lp: S, att: 4e-4 }),
          _ + (w * y > 0 ? 0 : 6e-4),
          T * (1 + 0.4 * w * y),
          n,
        );
      for (let _ = 1; _ < 8; _++)
        Se(
          b,
          xt(n, x, 0.04, 0.007, { hp: 600, lp: 5200 / (1 + _ * 0.3) }),
          f * _ * (m ? 1.012 : 0.99),
          0.45 * Math.pow(0.72, _),
          n,
        );
      Se(v, b, 0, (a * ql(i.early)) / xu(b, 0, 0.05 * n), n);
      let g = e0(n, r, x),
        E = it(n, r);
      for (let _ = 0; _ < E.length; _++) E[_] = l[_] * 0.7 + g[_] * 0.7;
      (y0(E, 'lp', ei(i.lp0, i.lp1, 0.5), 0.6, n), kt(E, 'hp', 170, 0.7, n), Mn(E, n, ms(i.tau, 0.006)));
      let M = (a * ql(i.level)) / xu(E, h, p);
      Se(v, E, 0.004, M, n);
      for (let [_, T] of [
        [57, 1],
        [86, 0.8],
        [123, 0.6],
        [171, 0.4],
      ]) {
        let w = e0(n, Math.min(r - 0.05, 0.9), x);
        (kt(w, 'bp', _ * (t & 1 ? 1.05 : 1), 8, n),
          Mn(w, n, ms(i.tau * 1.25, 0.02)),
          Se(v, w, 0.01, (T * a * ql(i.modes)) / xu(w, h, p), n));
      }
      return c6(v, i.ceil);
    };
  return [d(0), d(1)];
}

var tI = [
    [
      [0.078, -11.6, 4400, -0.8, 2.7],
      [0.124, -11.6, 3400, 0.7, 3.6],
      [0.171, -12, 2500, -0.3, 2.2],
      [0.262, -19, 1500, 0.5, 4.1],
    ],
    [
      [0.084, -11.4, 4200, 0.8, 3.1],
      [0.131, -11.6, 3600, -0.6, 2.4],
      [0.177, -12, 2400, 0.35, 3.9],
      [0.286, -19, 1400, -0.5, 2.9],
    ],
  ],
  nI = {
    len: 2.2,
    ref: 0.7,
    ceil: 0.75,
    slaps: tI,
    slapHold: 0.024,
    slapTau: 0.009,
    lp0: 3600,
    lp1: 600,
    early: -15,
    earlyTau: 0.03,
    floor: -14.1,
    lateT: 0.8,
    farT: 0.42,
    far: -18,
    rumble: -22,
  },
  iI = {
    len: 1.5,
    ref: 0.53,
    slaps: [
      [
        [0.076, -11.8, 5200, -0.7, 2.1],
        [0.121, -12, 3900, 0.75, 2.9],
        [0.168, -12.8, 2800, -0.25, 3.4],
      ],
    ],
    slapHold: 0.015,
    slapTau: 0.008,
    ceil: 0.6,
    lp0: 4400,
    lp1: 700,
    early: -15,
    earlyTau: 0.03,
    floor: -14.6,
    lateT: 0.55,
    farT: 0.34,
    far: -22,
    rumble: -28,
  },
  sI = { len: 1.3, ref: 0.7, ceil: 0.7, lp0: 7800, lp1: 1300, tau: 0.15, early: -13, level: -9, modes: -21 },
  oI = {
    len: 0.9,
    ref: 0.53,
    ceil: 0.55,
    lp0: 8500,
    lp1: 1700,
    tau: 0.105,
    early: -13,
    level: -10,
    modes: -27,
  },
  h6 = (n, e, t) => u6(n, e, t, nI),
  d6 = (n, e, t) => f6(n, e, t, sI),
  p6 = (n, e, t) => u6(n, e, t, iI),
  m6 = (n, e, t) => f6(n, e, t, oI);

function g6(n, e) {
  let t = it(n, 0.2),
    i = 5e-4;
  return (
    Se(
      t,
      Fn(
        n,
        e,
        [
          [2260, 0.005, 1],
          [3640, 0.0045, 0.75],
          [5880, 0.003, 0.5],
          [8100, 0.002, 0.3],
        ],
        { hp: 2200, tick: 0.9 },
      ),
      i,
      1,
      n,
    ),
    Se(
      t,
      Xt(
        n,
        0.05,
        [
          [640, 0.009, 1],
          [1180, 0.007, 0.6],
        ],
        e,
      ),
      i,
      0.3,
      n,
    ),
    Se(t, xt(n, e, 0.02, 0.004, { lp: 900 }), i, 0.22, n),
    Se(
      t,
      Fn(
        n,
        e,
        [
          [3050, 0.003, 1],
          [4700, 0.0025, 0.6],
        ],
        { hp: 3200, tick: 0.5 },
      ),
      i + 0.0125,
      0.16,
      n,
    ),
    Se(
      t,
      Xt(
        n,
        0.18,
        [
          [742, 0.04, 1],
          [1493, 0.028, 0.45],
          [2260, 0.016, 0.2],
        ],
        e,
      ),
      i + 0.002,
      0.045,
      n,
    ),
    hi(t, n, 60)
  );
}

function x6(n, e) {
  let t = it(n, 0.14),
    i = 5e-4;
  return (
    Se(
      t,
      Fn(
        n,
        e,
        [
          [3480, 0.0038, 1],
          [5350, 0.003, 0.7],
          [7900, 0.0022, 0.45],
          [1950, 0.005, 0.4],
        ],
        { hp: 3e3, tick: 0.8 },
      ),
      i,
      1,
      n,
    ),
    Se(
      t,
      Xt(
        n,
        0.03,
        [
          [980, 0.006, 1],
          [1620, 0.005, 0.5],
        ],
        e,
      ),
      i,
      0.22,
      n,
    ),
    Se(
      t,
      Fn(
        n,
        e,
        [
          [4300, 0.0025, 1],
          [6600, 0.002, 0.5],
        ],
        { hp: 3800, tick: 0.5 },
      ),
      i + 0.009,
      0.14,
      n,
    ),
    Se(
      t,
      Xt(
        n,
        0.09,
        [
          [1310, 0.018, 1],
          [2650, 0.012, 0.4],
        ],
        e,
      ),
      i + 0.002,
      0.03,
      n,
    ),
    hi(t, n, 90)
  );
}

function v6(n, e) {
  let t = it(n, 0.38),
    i = 0.003;
  (Se(
    t,
    Fn(
      n,
      e,
      [
        [3340, 0.004, 1],
        [5210, 0.003, 0.6],
        [1880, 0.006, 0.45],
        [7600, 0.002, 0.3],
      ],
      { hp: 2600, tick: 0.75 },
    ),
    i,
    0.62,
    n,
  ),
    Se(t, h1(n, e, 0.17, 2700, 1450, { rough: 210, rough1: 130, env: d1(0.25, 0.8) }), i + 0.018, 0.4, n));
  let s = e0(n, 0.24, e);
  (kt(s, 'hp', 4200, 0.7, n),
    Mn(s, n, (a) => Math.pow(Math.sin((Math.PI * a) / 0.24), 2)),
    Se(t, C0(s), i + 0.05, 0.075, n));
  let o = e0(n, 0.22, e);
  (y0(o, 'bp', ei(520, 260), 0.8, n),
    Mn(o, n, (a) => Math.pow(Math.sin((Math.PI * a) / 0.22), 2)),
    Se(t, C0(o), i + 0.08, 0.1, n));
  let r = i + 0.2;
  return (
    Se(
      t,
      Xt(
        n,
        0.12,
        [
          [418, 0.026, 1],
          [1135, 0.016, 0.6],
          [2280, 0.009, 0.4],
          [3420, 0.005, 0.25],
        ],
        e,
      ),
      r,
      0.3,
      n,
    ),
    Se(t, xt(n, e, 0.05, 0.009, { lp: 1e3 }), r, 0.3, n),
    Se(t, xt(n, e, 0.004, 8e-4, { hp: 2800 }), r, 0.18, n),
    hi(t, n, 70)
  );
}

function y6(n, e) {
  let t = it(n, 0.26),
    i = 0.004;
  (Se(
    t,
    Fn(
      n,
      e,
      [
        [2210, 0.004, 1],
        [3580, 0.003, 0.6],
      ],
      { hp: 2400, tick: 0.5 },
    ),
    i,
    0.3,
    n,
  ),
    Se(
      t,
      Xt(
        n,
        0.06,
        [
          [520, 0.014, 1],
          [1240, 0.009, 0.5],
        ],
        e,
      ),
      i,
      0.26,
      n,
    ),
    Se(
      t,
      h1(n, e, 0.19, 1e3, 3300, {
        rough: 140,
        rough1: 320,
        hi: 0.35,
        env: (s) => Math.pow(s, 0.8) * (s > 0.93 ? (1 - s) / 0.07 : 1),
      }),
      i + 0.012,
      0.62,
      n,
    ));
  for (let [s, o] of [
    [0.085, 0.14],
    [0.142, 0.2],
  ])
    Se(
      t,
      Fn(
        n,
        e,
        [
          [2850, 0.003, 1],
          [4420, 0.0025, 0.6],
        ],
        { hp: 3e3, tick: 0.6 },
      ),
      i + s,
      o,
      n,
    );
  return (Se(t, xt(n, e, 0.03, 0.006, { bp: 720, q: 1 }), i + 0.2, 0.22, n), hi(t, n, 70));
}

function b6(n, e) {
  let t = it(n, 0.21),
    i = 8e-4,
    s = i + 0.031;
  return (
    Se(
      t,
      Fn(
        n,
        e,
        [
          [2390, 0.0055, 1],
          [3760, 0.0045, 0.75],
          [5640, 0.0035, 0.5],
          [1270, 0.007, 0.45],
        ],
        { hp: 2400, tick: 0.95, tickTau: 8e-4 },
      ),
      i,
      0.62,
      n,
    ),
    Se(t, Gn(n, 0.08, 172, 74, 0.014, 0.02, 8e-4), i, 0.5, n),
    Se(t, xt(n, e, 0.04, 0.008, { lp: 720 }), i, 0.3, n),
    Se(
      t,
      Xt(
        n,
        0.07,
        [
          [432, 0.016, 1],
          [915, 0.011, 0.6],
        ],
        e,
      ),
      i,
      0.2,
      n,
    ),
    Se(
      t,
      Fn(
        n,
        e,
        [
          [3130, 0.011, 1],
          [4690, 0.009, 0.85],
          [7160, 0.006, 0.55],
          [1890, 0.012, 0.5],
          [9420, 0.0035, 0.3],
        ],
        { hp: 2800, tick: 1.1, tickTau: 0.001 },
      ),
      s,
      1.05,
      n,
    ),
    Se(t, xt(n, e, 0.012, 0.0022, { bp: 2600, q: 0.8 }), s, 0.4, n),
    Se(
      t,
      Xt(
        n,
        0.16,
        [
          [1485, 0.028, 1],
          [2215, 0.024, 0.6],
          [3320, 0.016, 0.35],
        ],
        e,
      ),
      s + 8e-4,
      0.11,
      n,
    ),
    hi(fi(C0(t), 1.5), n, 45)
  );
}

function M6(n, e, t) {
  let i = t === 1,
    s = i ? 0.085 : 0.15,
    o = it(n, i ? 0.16 : 0.26),
    r = 0.001;
  (Se(
    o,
    Fn(
      n,
      e,
      [
        [2710, 0.004, 1],
        [4130, 0.003, 0.6],
        [1560, 0.006, 0.4],
      ],
      { hp: 2600, tick: 0.7 },
    ),
    r,
    i ? 0.4 : 0.45,
    n,
  ),
    Se(
      o,
      h1(n, e, s, 1350, i ? 2e3 : 2650, {
        rough: 260,
        rough1: 420,
        hi: 0.5,
        q: 2.2,
        env: (u) => 0.35 + 0.65 * u,
      }),
      r + 0.006,
      0.34,
      n,
    ));
  let a = i ? 4 : 8;
  for (let u = 0; u < a; u++) {
    let f = (u + 0.5) / a,
      h = r + 0.01 + s * Math.pow(f, 0.85),
      p = 1900 + 1500 * f;
    Se(
      o,
      Fn(
        n,
        e,
        [
          [p, 0.003, 1],
          [p * 1.62, 0.0025, 0.6],
          [p * 2.71, 0.0018, 0.3],
        ],
        { hp: 2800, tick: 0.6, jit: 0.04 },
      ),
      h,
      0.2 + 0.2 * f,
      n,
    );
  }
  let l = it(n, s),
    c = 0;
  for (let u = 0; u < l.length; u++) {
    let f = u / l.length;
    ((c += (at * (470 + 300 * f)) / n),
      (l[u] = (Math.sin(c) + 0.4 * Math.sin(2.02 * c)) * f * Math.min(1, (1 - f) * 12)));
  }
  if ((Se(o, l, r + 0.008, 0.055, n), i))
    Se(o, xt(n, e, 0.02, 0.004, { bp: 1500, q: 1 }), r + 0.012 + s, 0.3, n);
  else {
    let u = r + 0.012 + s;
    (Se(
      o,
      Fn(
        n,
        e,
        [
          [1660, 0.012, 1],
          [2750, 0.01, 0.7],
          [4210, 0.006, 0.5],
          [6300, 0.004, 0.3],
        ],
        { hp: 2e3, tick: 1 },
      ),
      u,
      0.75,
      n,
    ),
      Se(o, Gn(n, 0.05, 205, 100, 0.012, 0.014, 8e-4), u, 0.35, n));
  }
  return hi(fi(C0(o), 1.2), n, 60);
}

function _6(n, e) {
  let t = it(n, 0.33),
    i = 8e-4,
    s = i + 0.019;
  Se(
    t,
    Fn(
      n,
      e,
      [
        [2950, 0.003, 1],
        [4580, 0.0025, 0.6],
      ],
      { hp: 3e3, tick: 0.6 },
    ),
    i,
    0.11,
    n,
  );
  let o = e0(n, 0.018, e);
  return (
    y0(o, 'bp', ei(1700, 5600), 2.5, n),
    Mn(o, n, (r) => Math.pow(r / 0.018, 1.6)),
    Se(t, C0(o), i + 0.001, 0.16, n),
    Se(
      t,
      Mn(Va(n, 0.018, 850, 2500, !1), n, (r) => Math.pow(r / 0.018, 2)),
      i + 0.001,
      0.05,
      n,
    ),
    Se(t, xt(n, e, 0.02, 0.0016, { hp: 1400 }), s, 1.15, n),
    Se(t, xt(n, e, 0.04, 0.007, { hp: 500, lp: 1900 }), s, 0.95, n),
    Se(
      t,
      Xt(
        n,
        0.08,
        [
          [820, 0.012, 1],
          [1240, 0.011, 0.9],
          [1710, 0.009, 0.7],
        ],
        e,
      ),
      s,
      0.4,
      n,
    ),
    Se(t, Gn(n, 0.07, 255, 104, 0.01, 0.02, 6e-4), s, 0.55, n),
    Se(
      t,
      Xt(
        n,
        0.2,
        [
          [2290, 0.024, 1],
          [3420, 0.02, 0.85],
          [4640, 0.016, 0.6],
          [2880, 0.018, 0.5],
          [6410, 0.008, 0.35],
          [8350, 0.005, 0.25],
        ].map(([r, a, l]) => [r * Dt(e, 0.985, 1.015), a, l]),
        e,
      ),
      s,
      0.46,
      n,
    ),
    Se(
      t,
      Xt(
        n,
        0.28,
        [
          [706, 0.07, 1],
          [1421, 0.045, 0.35],
        ],
        e,
      ),
      s + 0.002,
      0.07,
      n,
    ),
    hi(fi(C0(t), 1.6), n, 45)
  );
}

function w6(n, e) {
  let t = it(n, 0.27),
    i = 0.003;
  (Se(
    t,
    Fn(
      n,
      e,
      [
        [4120, 0.0035, 1],
        [6340, 0.0028, 0.6],
        [2480, 0.005, 0.4],
      ],
      { hp: 3200, tick: 0.7 },
    ),
    i,
    0.6,
    n,
  ),
    Se(
      t,
      h1(n, e, 0.09, 3100, 2050, { rough: 300, rough1: 200, hi: 0.4, q: 2.4, env: d1(0.2, 0.8) }),
      i + 0.012,
      0.42,
      n,
    ),
    Se(
      t,
      Xt(
        n,
        0.1,
        [
          [3320, 0.02, 1],
          [5150, 0.014, 0.5],
        ],
        e,
      ),
      i + 0.02,
      0.05,
      n,
    ));
  let s = e0(n, 0.14, e);
  return (
    kt(s, 'hp', 4500, 0.7, n),
    Mn(s, n, (o) => Math.pow(Math.sin((Math.PI * o) / 0.14), 2)),
    Se(t, C0(s), i + 0.04, 0.05, n),
    Se(
      t,
      Fn(
        n,
        e,
        [
          [1720, 0.008, 1],
          [2960, 0.006, 0.6],
          [690, 0.012, 0.5],
        ],
        { hp: 2600, tick: 0.4 },
      ),
      i + 0.108,
      0.3,
      n,
    ),
    hi(t, n, 90)
  );
}

function E6(n, e) {
  let t = it(n, 0.19),
    i = 0.003;
  return (
    Se(
      t,
      Fn(
        n,
        e,
        [
          [2900, 0.0035, 1],
          [4650, 0.003, 0.6],
        ],
        { hp: 2800, tick: 0.5 },
      ),
      i,
      0.3,
      n,
    ),
    Se(
      t,
      h1(n, e, 0.115, 1650, 4300, {
        rough: 220,
        rough1: 420,
        hi: 0.4,
        q: 2.2,
        env: (s) => Math.pow(s, 0.7) * (s > 0.92 ? (1 - s) / 0.08 : 1),
      }),
      i + 0.01,
      0.6,
      n,
    ),
    Se(
      t,
      Fn(
        n,
        e,
        [
          [3700, 0.003, 1],
          [5600, 0.0025, 0.5],
        ],
        { hp: 3200, tick: 0.6 },
      ),
      i + 0.07,
      0.16,
      n,
    ),
    hi(t, n, 90)
  );
}

function S6(n, e) {
  let t = it(n, 0.15),
    i = 8e-4,
    s = i + 0.013;
  return (
    Se(
      t,
      Fn(
        n,
        e,
        [
          [2620, 0.004, 1],
          [4050, 0.0035, 0.7],
          [1480, 0.006, 0.4],
        ],
        { hp: 2600, tick: 0.8 },
      ),
      i,
      0.55,
      n,
    ),
    Se(t, Gn(n, 0.05, 215, 108, 0.01, 0.013, 8e-4), i, 0.3, n),
    Se(t, xt(n, e, 0.03, 0.006, { hp: 350, lp: 1600 }), i, 0.4, n),
    Se(
      t,
      Xt(
        n,
        0.04,
        [
          [760, 0.008, 1],
          [1330, 0.007, 0.7],
        ],
        e,
      ),
      i,
      0.25,
      n,
    ),
    Se(
      t,
      Fn(
        n,
        e,
        [
          [3610, 0.008, 1],
          [5420, 0.0065, 0.75],
          [8130, 0.004, 0.45],
          [2110, 0.008, 0.4],
        ],
        { hp: 3200, tick: 1 },
      ),
      s,
      1,
      n,
    ),
    Se(
      t,
      Xt(
        n,
        0.08,
        [
          [1920, 0.016, 1],
          [2870, 0.012, 0.5],
        ],
        e,
      ),
      s + 6e-4,
      0.07,
      n,
    ),
    hi(fi(C0(t), 1.4), n, 60)
  );
}

function T6(n, e) {
  let t = it(n, 0.2),
    i = 8e-4,
    s = i + 0.012;
  Se(
    t,
    Fn(
      n,
      e,
      [
        [3900, 0.0028, 1],
        [5900, 0.0022, 0.6],
      ],
      { hp: 3400, tick: 0.6 },
    ),
    i,
    0.13,
    n,
  );
  let o = e0(n, 0.011, e);
  return (
    y0(o, 'bp', ei(2400, 7200), 2.5, n),
    Mn(o, n, (r) => Math.pow(r / 0.011, 1.5)),
    Se(t, C0(o), i + 0.001, 0.17, n),
    Se(t, xt(n, e, 0.012, 0.0011, { hp: 2400 }), s, 1.1, n),
    Se(t, xt(n, e, 0.025, 0.005, { hp: 700, lp: 2400 }), s, 0.8, n),
    Se(
      t,
      Xt(
        n,
        0.05,
        [
          [1180, 0.008, 1],
          [1760, 0.007, 0.8],
        ],
        e,
      ),
      s,
      0.3,
      n,
    ),
    Se(t, Gn(n, 0.04, 330, 165, 0.007, 0.011, 5e-4), s, 0.32, n),
    Se(
      t,
      Xt(
        n,
        0.12,
        [
          [3060, 0.012, 1],
          [4490, 0.011, 0.85],
          [6920, 0.008, 0.6],
          [9350, 0.005, 0.35],
          [1710, 0.012, 0.4],
        ].map(([r, a, l]) => [r * Dt(e, 0.985, 1.015), a, l]),
        e,
      ),
      s,
      0.5,
      n,
    ),
    Se(
      t,
      Xt(
        n,
        0.1,
        [
          [1190, 0.022, 1],
          [2400, 0.014, 0.4],
        ],
        e,
      ),
      s + 0.002,
      0.05,
      n,
    ),
    hi(fi(C0(t), 1.5), n, 70)
  );
}

function $v(n, e, t, i, s, o) {
  for (let r of i) {
    let a = o * Dt(t, 0.85, 1.2);
    Se(
      n,
      Fn(
        e,
        t,
        [
          [a, 0.005, 1],
          [a * 1.47, 0.004, 0.6],
          [a * 2.3, 0.003, 0.3],
        ],
        { hp: 3500, tick: 0.4 },
      ),
      r,
      s * Dt(t, 0.5, 1),
      e,
    );
  }
}

function A6(n, e) {
  let t = it(n, 0.31);
  return (
    Se(t, Yv(n, e, 0.26, 2500, 900, d1(0.32, 1.2)), 0.004, 0.7, n),
    $v(t, n, e, [0.055, 0.112, 0.168], 0.2, 4100),
    Se(t, Gn(n, 0.07, 125, 68, 0.02, 0.022, 0.003), 0.215, 0.5, n),
    Se(t, xt(n, e, 0.05, 0.012, { lp: 520 }), 0.215, 0.45, n),
    Se(
      t,
      Xt(
        n,
        0.05,
        [
          [610, 0.012, 1],
          [1340, 0.008, 0.5],
        ],
        e,
      ),
      0.217,
      0.14,
      n,
    ),
    hi(t, n, 50)
  );
}

function R6(n, e) {
  let t = it(n, 0.29);
  (Se(t, Yv(n, e, 0.22, 900, 2800, d1(0.5, 1.2)), 0.004, 0.65, n),
    $v(t, n, e, [0.04, 0.097, 0.15], 0.17, 4600));
  let i = 0.205;
  return (
    Se(
      t,
      Xt(
        n,
        0.06,
        [
          [615, 0.012, 1],
          [1510, 0.008, 0.6],
          [2920, 0.005, 0.4],
        ],
        e,
      ),
      i,
      0.4,
      n,
    ),
    Se(t, xt(n, e, 0.02, 0.004, { lp: 1400 }), i, 0.45, n),
    Se(t, xt(n, e, 0.004, 8e-4, { hp: 2600 }), i, 0.3, n),
    Se(
      t,
      Fn(
        n,
        e,
        [
          [2480, 0.004, 1],
          [3900, 0.003, 0.6],
        ],
        { hp: 2800, tick: 0.5 },
      ),
      i + 0.022,
      0.14,
      n,
    ),
    hi(t, n, 60)
  );
}

function C6(n, e, t) {
  let i = it(n, 0.2),
    s = t % 2 === 0;
  return (
    Se(i, Yv(n, e, 0.17, s ? 1100 : 2300, s ? 2400 : 1200, d1(0.4, 1.3)), 0.004, 0.8, n),
    $v(i, n, e, [0.03 + 0.02 * t, 0.11], 0.1, 4300),
    hi(i, n, 80)
  );
}

var rI = [
  [4180, 1],
  [6830, 0.7],
  [9760, 0.5],
  [11900, 0.3],
  [2470, 0.3],
];

function Xv(n, e, t, i, s) {
  return Xt(
    n,
    i * 6,
    rI.map(([o, r], a) => [o * t, i / (1 + a * 0.35), r]),
    e,
  );
}

function k6(n, e, t) {
  let i = it(n, 0.5),
    s = [1, 1.09, 0.93, 1.04][t & 3],
    o = 6e-4,
    r = 1,
    a = 2 + (t !== 1 ? 1 : 0);
  for (let l = 0; l < a; l++) {
    let c = s * (l & 1 ? 1.19 : 1) * Dt(e, 0.97, 1.04);
    (Se(i, Xv(n, e, c, Dt(e, 0.016, 0.03)), o, r * 0.5, n),
      Se(i, xt(n, e, 0.004, 8e-4, { hp: 3200 }), o, r * 0.5, n),
      Se(i, xt(n, e, 0.012, 0.0025, { bp: 1900, q: 0.8 }), o, r * 0.3, n),
      (o += Dt(e, 0.085, 0.15) * (l ? 0.72 : 1)),
      (r *= Dt(e, 0.42, 0.6)));
  }
  return hi(i, n, 200);
}

function P6(n, e, t) {
  let i = it(n, 0.7),
    s = [1, 1.11, 0.94][t % 3],
    o = 6e-4,
    r = 1;
  for (let a = 0; a < 3; a++) {
    let l = s * (a & 1 ? 1.19 : 1) * Dt(e, 0.97, 1.04);
    (Se(i, Xv(n, e, l, Dt(e, 0.045, 0.075)), o, r * 0.5, n),
      Se(i, xt(n, e, 0.003, 6e-4, { hp: 4500 }), o, r * 0.55, n),
      Se(
        i,
        Xt(
          n,
          0.3,
          [
            [1320 * s, 0.05, 1],
            [2130 * s, 0.04, 0.6],
            [3350 * s, 0.028, 0.4],
            [640 * s, 0.03, 0.3],
          ],
          e,
        ),
        o,
        r * 0.16,
        n,
      ),
      (o += Dt(e, 0.075, 0.13) * (a ? 0.7 : 1)),
      (r *= Dt(e, 0.5, 0.66)));
  }
  if (t !== 1)
    for (let a = 0; a < 6; a++)
      (Se(i, Xv(n, e, s * Dt(e, 1, 1.25), 0.012), o, r * 0.3, n), (o += 0.016 + 0.004 * a), (r *= 0.75));
  return hi(i, n, 200);
}

function I6(n, e, t) {
  let i = it(n, 2.2),
    s = t ? 0.9 : 1,
    o = 5e-4,
    r = it(n, 0.08);
  (Se(r, n5(n, 9e-4), 0, 1.2, n), Se(r, xt(n, e, 0.03, 0.005, { hp: 1500 }), 0, 1.5, n), fi(C0(r, 2), 2));
  let a = it(n, 2.1);
  Se(a, Gn(n, 0.9, 122 * s, 47, 0.08, 0.16, 0.001), 0, 1, n);
  let l = e0(n, 1.4, e);
  (y0(l, 'lp', ei(3e3, 240, 0.5), 0.7, n),
    Se(a, C0(Mn(l, n, ms(0.2, 0.002))), 0, 1.3, n),
    Se(a, xt(n, e, 0.45, 0.08, { bp: 500 * s, q: 1.2 }), 0, 0.8, n));
  let c = e0(n, 2, e);
  (kt(c, 'lp', 115, 0.7, n), Se(a, C0(Mn(c, n, ms(0.45, 0.03))), 0, 0.4, n));
  for (let [u, f, h] of [
    [0.13, 0.3, 1900],
    [0.235, 0.2, 1300],
    [0.41, 0.12, 800],
  ])
    Se(a, xt(n, e, 0.25, 0.045, { hp: 110, lp: h, att: 0.004 }), u * (t ? 1.1 : 1), f, n);
  (s6(C0(a), n, 0.3, 4, 5e-4, 0.09),
    fi(C0(a, 1.6), 1.8),
    Se(i, r, o, 1, n),
    Se(i, a, o, 0.8, n),
    Se(
      i,
      C0(Wa(n, e, 1.9, 70, { from: 0.2, fall: 1.5, hp: 1500, lp: 9e3, ampFall: 0.6, maxLen: 0.008 })),
      0,
      0.3,
      n,
    ));
  for (let u = 0; u < 5; u++) {
    let f = Dt(e, 1e3, 3800);
    Se(
      i,
      Xt(
        n,
        0.2,
        [
          [f, Dt(e, 0.02, 0.05), 1],
          [f * 1.61, 0.02, 0.5],
        ],
        e,
      ),
      Dt(e, 0.35, 1.5),
      Dt(e, 0.03, 0.08),
      n,
    );
  }
  return o6(fi(C0(hi(i, n, 22), 2.2), 1.6), n, o);
}

function* z6(n, e, t) {
  let i = it(n, 4.2),
    s = t ? 0.93 : 1,
    o = 5e-4,
    r = it(n, 0.12);
  (Se(r, n5(n, 0.0014), 0, 1.3, n),
    Se(r, xt(n, e, 0.03, 0.004, { hp: 2e3 }), 0, 1.6, n),
    Se(r, xt(n, e, 0.1, 0.016, { hp: 500, lp: 8e3 }), 0, 1.1, n),
    fi(C0(r, 2.4), 2.4));
  let a = it(n, 4.1);
  (Se(a, Gn(n, 2.4, 52 * s, 29, 0.28, 0.42, 0.004), 0, 1, n),
    Se(a, Gn(n, 1.4, 104 * s, 60, 0.2, 0.26, 0.002), 0, 0.7, n),
    yield);
  let l = e0(n, 2.6, e);
  (y0(l, 'lp', ei(4200, 170, 0.45), 0.7, n),
    Se(a, C0(Mn(l, n, ms(0.36, 0.003))), 0, 1.5, n),
    Se(a, xt(n, e, 0.8, 0.14, { bp: 300 * s, q: 1 }), 0, 1, n),
    yield);
  let c = e0(n, 4, e);
  (kt(c, 'lp', 95, 0.7, n), Se(a, C0(Mn(c, n, ms(1, 0.05))), 0, 1, n));
  let u = e0(n, 4, e);
  y0(u, 'lp', ei(420, 110, 0.6), 0.7, n);
  let f = [];
  for (let d = 0; d < 6; d++) f.push([Dt(e, 0.5, 2.8), Dt(e, 0.12, 0.35), Dt(e, 0.4, 1)]);
  let h = (d) => {
    let m = 0.3;
    for (let [x, v, y] of f) {
      let b = (d - x) / v;
      m += y * Math.exp(-b * b);
    }
    return m * Math.exp(-d / 1.3) * (1 - Math.exp(-d / 0.15));
  };
  for (let d = 0, m = 0, x = 0; d < u.length; d++)
    ((d & 63) === 0 && ((m = h(d / n)), (x = (h((d + 64) / n) - m) / 64)), (u[d] *= m), (m += x));
  (Se(a, C0(u), 0, 0.55, n), yield);
  for (let [d, m, x] of [
    [0.16, 0.42, 1700],
    [0.29, 0.34, 1300],
    [0.47, 0.26, 950],
    [0.79, 0.17, 700],
    [1.22, 0.1, 520],
  ])
    Se(a, xt(n, e, 0.5, 0.05 + d * 0.07, { hp: 70, lp: x, att: 0.006 }), d * (t ? 1.08 : 1), m, n);
  (s6(C0(a), n, 0.4, 3, 5e-4, 0.1),
    fi(C0(a, 1.7), 1.8),
    Se(i, r, o, 1, n),
    Se(i, a, o, 0.85, n),
    yield,
    Se(
      i,
      C0(Wa(n, e, 3.4, 170, { from: 0.3, fall: 1.6, hp: 1200, lp: 9e3, ampFall: 1, maxLen: 0.01 })),
      0,
      0.42,
      n,
    ));
  for (let d = 0; d < 11; d++) {
    let m = Dt(e, 900, 4200);
    Se(
      i,
      Xt(
        n,
        0.3,
        [
          [m, Dt(e, 0.02, 0.07), 1],
          [m * 1.61, 0.025, 0.5],
          [m * 2.4, 0.012, 0.25],
        ],
        e,
      ),
      Dt(e, 0.35, 2.7),
      Dt(e, 0.04, 0.11),
      n,
    );
  }
  let p = Dt(e, 0.95, 1.3);
  for (let [d, m] of [
    [0, 1],
    [0.21, 0.5],
    [0.33, 0.28],
  ])
    (Se(
      i,
      Xt(
        n,
        1,
        [
          [312 * s, 0.2, 1],
          [489 * s, 0.16, 0.8],
          [744 * s, 0.12, 0.6],
          [1183 * s, 0.08, 0.4],
          [1735 * s, 0.05, 0.3],
          [2620 * s, 0.03, 0.2],
        ],
        e,
      ),
      p + d,
      0.12 * m,
      n,
    ),
      Se(i, xt(n, e, 0.02, 0.004, { hp: 900, lp: 5e3 }), p + d, 0.1 * m, n));
  return o6(fi(C0(hi(i, n, 18), 2.2), 1.6), n, o);
}

function D6(n, e, t) {
  let i = it(n, 0.26),
    s = [1, 1.08, 0.93][t % 3],
    o = 5e-4,
    r = 0;
  Se(i, xt(n, e, 0.006, 9e-4, { hp: 4200 }), o, 0.9, n);
  let a = it(n, 0.085);
  for (let l = 0; l < a.length; l++) {
    let c = l / n,
      u = (520 + 2300 * Math.exp(-c / 0.014)) * s;
    r += u / n;
    let f = Math.sign(Math.sin(at * r)) * 0.6 + (2 * (r * 1.5 - Math.floor(r * 1.5)) - 1) * 0.5;
    a[l] = f * (0.75 + 0.25 * Math.sin(at * 310 * c)) * Math.exp(-c / 0.02);
  }
  return (
    kt(a, 'hp', 700 * s, 0.8, n),
    kt(a, 'lp', 5200, 0.8, n),
    Se(i, C0(a), o, 1, n),
    Se(i, xt(n, e, 0.12, 0.022, { hp: 2600, lp: 9500, att: 0.0015 }), o + 0.002, 0.5, n),
    Se(i, xt(n, e, 0.05, 0.009, { bp: 1750 * s, q: 2.5 }), o, 0.4, n),
    Se(
      i,
      Fn(
        n,
        e,
        [
          [3450 * s, 0.005, 1],
          [5300, 0.004, 0.6],
          [2050, 0.007, 0.4],
        ],
        { hp: 3200, tick: 0.5 },
      ),
      o + 0.024,
      0.24,
      n,
    ),
    hi(fi(C0(i), 1.5), n, 350)
  );
}

function L6(n, e, t) {
  let i = it(n, 0.42),
    s = [1, 0.94, 1.06][t % 3],
    o = 5e-4,
    r = 0,
    a = 0;
  Se(i, xt(n, e, 0.008, 0.0013, { hp: 2800 }), o, 0.8, n);
  let l = it(n, 0.17);
  for (let u = 0; u < l.length; u++) {
    let f = u / n,
      h = (150 + 760 * Math.exp(-f / 0.028)) * s;
    ((r += h / n), (a += (h * 2.76 + 90) / n));
    let p = 2 * (r - Math.floor(r)) - 1;
    l[u] =
      (p * 0.8 + Math.sin(at * r) * Math.sin(at * a) * 0.9) * Math.exp(-f / 0.04) * (1 - Math.exp(-f / 6e-4));
  }
  (kt(l, 'hp', 170, 0.8, n),
    kt(l, 'lp', 3600, 0.8, n),
    Se(i, C0(l), o, 1, n),
    Se(i, Gn(n, 0.09, 210 * s, 92 * s, 0.016, 0.024, 8e-4), o, 0.6, n),
    Se(i, xt(n, e, 0.07, 0.014, { bp: 640 * s, q: 1.8 }), o, 0.55, n));
  let c = e0(n, 0.3, e);
  return (
    y0(c, 'bp', ei(3800, 1500), 0.9, n),
    Mn(c, n, ms(0.065, 0.012)),
    Se(i, C0(c), o + 0.03, 0.34, n),
    Se(
      i,
      Fn(
        n,
        e,
        [
          [1380 * s, 0.012, 1],
          [2260 * s, 0.009, 0.7],
          [3540, 0.006, 0.45],
        ],
        { hp: 1800, tick: 0.6 },
      ),
      o + 0.062,
      0.26,
      n,
    ),
    hi(fi(C0(i), 1.7), n, 80)
  );
}

function F6(n, e, t) {
  let i = it(n, 0.32),
    s = e0(n, 0.3, e),
    o = [5200, 4300, 6100][t % 3],
    r = [1300, 1e3, 1700][t % 3],
    a = 0.05;
  y0(s, 'bp', ei(o, r, 0.8), 3.5, n);
  for (let l = 0; l < s.length; l++) {
    let c = (l / n - a) / (l / n < a ? 0.018 : 0.055);
    s[l] *= Math.exp(-c * c);
  }
  return (
    Se(i, C0(s), 0, 1, n),
    Se(i, n5(n, 18e-5), a - 0.002, 0.5, n),
    Se(i, xt(n, e, 0.006, 7e-4, { hp: 3500 }), a - 0.002, 0.55, n),
    Se(i, Va(n, 0.2, o * 0.5, r * 0.6), 0, 0.03, n),
    hi(i, n, 300)
  );
}

var Ci = {
    bpm: 96,
    beat: 0.625,
    bar: 2.5,
    s16: 0.15625,
    cycleBars: 8,
    formBars: 16,
    sr: 22050,
    srLo: 16e3,
    key: 'D minor (aeolian)',
    scale: [2, 4, 5, 7, 9, 10, 0],
    swing: 0.01,
    riserPeak: 5,
    chords: ['Dm', 'Bb/D', 'Gm/D', 'Dsus2 | Am7/D'],
    motif: { call: ['D4', 'A4', 'Bb4', 'F4'], answer: ['D4', 'G4', 'A4', 'E4'], resolve: ['F4', 'E4', 'D4'] },
    cells: [
      [62, 69],
      [70, 65],
      [62, 67],
      [69, 64],
    ],
    cellSecond: 0.9375,
    loops: {
      music_drone: 16,
      music_strings: 8,
      music_pulse: 16,
      music_ticks: 6,
      music_drums: 8,
      music_brass: 8,
      music_lift: 8,
    },
  },
  Ct = Ci.bar,
  qa = Ci.beat,
  qn = Ci.s16,
  Ko = Ci.sr,
  i5 = Ci.srLo,
  N6 = [57, 58, 58, 57],
  lI = [65, 65, 67, 64],
  U6 = [69, 70, 70, 69],
  cI = [74, 74, 74, 76],
  Zv = [57, 58, 58, 57],
  uI = [53, 53, 55, 52],
  fI = [
    [38, 50, 57],
    [38, 53, 58],
    [38, 55, 58],
    [38, 52, 57],
  ],
  hI = [
    [50, 57, 62],
    [53, 58, 62],
    [55, 58, 62],
    [52, 57, 64],
  ],
  bu = { drone: 0.071, strings: 0.062, pulse: 0.078, ticks: 0.03, drums: 0.122, brass: 0.08, lift: 0.071 };

function Mu(n, e) {
  let t = 0,
    i = 0;
  for (let o of n) {
    for (let r = 0; r < o.length; r++) t += o[r] * o[r];
    i += o.length;
  }
  let s = e / Math.sqrt(t / i || 1);
  for (let o of n) ls(o, s);
  return n;
}

var dI = [0, 3, 6, 8, 11, 14],
  pI = (n, e, t) => Math.min(t, Math.max(e, n));

function Xl(n, e) {
  let t = Math.sqrt(1 + e * e) / e;
  for (let i = 0; i < n.length; i++) {
    let s = n[i] * e;
    n[i] = (s / Math.sqrt(1 + s * s)) * t;
  }
  return n;
}

function Jo(n, e, t, i, s = {}) {
  let o = e0(n, t, e);
  (s.hp && kt(o, 'hp', s.hp, 0.707, n),
    s.lp && kt(o, 'lp', s.lp, 0.707, n),
    s.bp && kt(o, 'bp', s.bp, s.q || 1, n));
  let r = Math.exp(-1 / (i * n)),
    a = s.att > 0 ? Math.exp(-1 / (s.att * n)) : 0,
    l = 1,
    c = 1,
    u = 0;
  for (let f = 0; f < o.length; f++) {
    let h = o[f] * l * (1 - c);
    ((o[f] = h), (l *= r), (c *= a), h > u ? (u = h) : -h > u && (u = -h));
  }
  return u > 0 ? ls(o, 1 / u) : o;
}

function s5(n, e, t, i, s, o, r = 6e-4) {
  let a = it(n, e),
    l = Math.exp(-1 / (s * n)),
    c = Math.exp(-1 / (o * n)),
    u = Math.exp(-1 / (r * n)),
    f = (at * i) / n,
    h = 0,
    p = (at * (t - i)) / n,
    d = 1,
    m = 1;
  for (let x = 0; x < a.length; x++)
    ((h += f + p), h > at && (h -= at), (a[x] = Math.sin(h) * d * (1 - m)), (p *= l), (d *= c), (m *= u));
  return a;
}

function xo(n, e, t, i, s, o = 0.4) {
  let [r, a, l, c, u] = mu(e, t, i, s),
    f = n.length,
    h = 0,
    p = 0;
  for (let d = Math.max(0, f - Math.round(o * s)); d < f; d++) {
    let m = n[d],
      x = r * m + h;
    ((h = a * m - c * x + p), (p = l * m - u * x));
  }
  for (let d = 0; d < f; d++) {
    let m = n[d],
      x = r * m + h;
    ((h = a * m - c * x + p), (p = l * m - u * x), (n[d] = x));
  }
  return n;
}

function o5(n, e, t, i, s = 0.4) {
  let o = n.length,
    r = Math.max(0, o - Math.round(s * i)),
    a = 0,
    l = 0,
    c = null;
  for (let u = r; u < o; u++) {
    ((u & 63) === 0 || u === r) && (c = mu('lp', e(u / o), t, i));
    let f = n[u],
      h = c[0] * f + a;
    ((a = c[1] * f - c[3] * h + l), (l = c[2] * f - c[4] * h));
  }
  for (let u = 0; u < o; u++) {
    (u & 63) === 0 && (c = mu('lp', e(u / o), t, i));
    let f = n[u],
      h = c[0] * f + a;
    ((a = c[1] * f - c[3] * h + l), (l = c[2] * f - c[4] * h), (n[u] = h));
  }
  return n;
}

function _u(n, e, t, i) {
  let s = n.length,
    o = i ? Math.max(0, s - Math.round(0.3 * e)) : s;
  for (let [r, a, l] of t) {
    let c = Math.sqrt(1 + l),
      u = (at * r) / e,
      f = Math.sin(u) / (2 * a),
      h = Math.cos(u),
      p = 1 + f / c,
      d = (1 + f * c) / p,
      m = (-2 * h) / p,
      x = (1 - f * c) / p,
      v = (-2 * h) / p,
      y = (1 - f / c) / p,
      b = 0,
      g = 0;
    for (let E = o; E < s; E++) {
      let M = n[E],
        _ = d * M + b;
      ((b = m * M - v * _ + g), (g = x * M - y * _));
    }
    for (let E = 0; E < s; E++) {
      let M = n[E],
        _ = d * M + b;
      ((b = m * M - v * _ + g), (g = x * M - y * _), (n[E] = _));
    }
  }
  return n;
}

var g1 = [
  [520, 1.4, 0.35],
  [1350, 1.6, 0.22],
];

function B6(n, e, t, i = 13, s = 2.2, o = 0.3) {
  return (
    n.forEach((r, a) => {
      let l = r.length,
        c = r.slice(),
        u = a * 2.1,
        f = o * (a ? -1 : 1),
        h = (m) => (i + s * Math.sin((at * t * m) / l + u) + (a ? 3.1 : 0)) * 0.001 * e,
        p = h(0),
        d = 0;
      for (let m = 0; m < l; m++) {
        (m & 63) === 0 && ((p = h(m)), (d = (h(m + 64) - p) / 64));
        let x = m - p;
        ((p += d), x < 0 && (x += l));
        let v = x | 0,
          y = x - v;
        r[m] = c[m] + f * (c[v] + (c[v + 1 < l ? v + 1 : 0] - c[v]) * y);
      }
    }),
    n
  );
}

function mI(n, e, t, i = 40, s = 120) {
  let o = n.length,
    r = new Float32Array(o),
    a = new Float32Array(o);
  for (let l = 0; l < o; l++) ((r[l] = 0.5 * (n[l] + e[l])), (a[l] = 0.5 * (n[l] - e[l])));
  (xo(r, 'hp', i, 0.707, t, 0.6), xo(a, 'hp', s, 0.707, t), xo(a, 'hp', s, 0.707, t));
  for (let l = 0; l < o; l++) ((n[l] = r[l] + a[l]), (e[l] = r[l] - a[l]));
}

var gI = [0.0297, 0.0371, 0.0411, 0.0437, 0.0533, 0.0617, 0.0683, 0.0741];

function xI(n, e, t = {}, i = 1) {
  let s = e / 2,
    o = n.length,
    r = o >> 1,
    a = new Float32Array(r),
    l = t.rt || 2.4,
    c = t.size || 1,
    u = t.damp ?? 0.3,
    f = Math.round((t.pre ?? 0.018) * e) & -2,
    h = 1 - u,
    p = gI.map((X) => Math.round(X * c * s) | 1),
    d = p.map((X) => Math.pow(10, (-3 * X) / s / l)),
    m = new Float32Array(p[0]),
    x = new Float32Array(p[1]),
    v = new Float32Array(p[2]),
    y = new Float32Array(p[3]),
    b = new Float32Array(p[4]),
    g = new Float32Array(p[5]),
    E = new Float32Array(p[6]),
    M = new Float32Array(p[7]),
    [_, T, w, S, R, z, I, L] = p,
    [U, k, C, A, F, H, N, Z] = d,
    Q = 0,
    W = 0,
    J = 0,
    G = 0,
    te = 0,
    oe = 0,
    ee = 0,
    le = 0,
    xe = 0,
    j = 0,
    O = 0,
    q = 0,
    ue = 0,
    de = 0,
    $ = 0,
    se = 0,
    fe = Math.round(0.0051 * s) | 1,
    me = Math.round(0.0127 * s) | 1,
    ge = new Float32Array(fe),
    ce = new Float32Array(me),
    P = 0,
    D = 0;
  for (let X = 0; X < r; X++) {
    let re = 2 * X - f,
      Y =
        re >= 3 && re < o - 3
          ? (16 * n[re] + 9 * (n[re - 1] + n[re + 1]) - (n[re - 3] + n[re + 3])) * 0.0109375
          : 0;
    {
      let Ge = ge[P],
        _e = Y + 0.6 * Ge;
      ((ge[P] = _e), (Y = Ge - 0.6 * _e), ++P === fe && (P = 0));
    }
    {
      let Ge = ce[D],
        _e = Y + 0.6 * Ge;
      ((ce[D] = _e), (Y = Ge - 0.6 * _e), ++D === me && (D = 0));
    }
    let he = m[Q],
      V = x[W],
      ne = v[J],
      ye = y[G],
      Te = b[te],
      Re = g[oe],
      Ue = E[ee],
      Ve = M[le],
      ze = (he + V + ne + ye + Te + Re + Ue + Ve) * 0.25;
    ((xe += (he - ze - xe) * h),
      (m[Q] = xe * U + Y),
      ++Q === _ && (Q = 0),
      (j += (V - ze - j) * h),
      (x[W] = j * k + Y),
      ++W === T && (W = 0),
      (O += (ne - ze - O) * h),
      (v[J] = O * C + Y),
      ++J === w && (J = 0),
      (q += (ye - ze - q) * h),
      (y[G] = q * A + Y),
      ++G === S && (G = 0),
      (ue += (Te - ze - ue) * h),
      (b[te] = ue * F + Y),
      ++te === R && (te = 0),
      (de += (Re - ze - de) * h),
      (g[oe] = de * H + Y),
      ++oe === z && (oe = 0),
      ($ += (Ue - ze - $) * h),
      (E[ee] = $ * N + Y),
      ++ee === I && (ee = 0),
      (se += (Ve - ze - se) * h),
      (M[le] = se * Z + Y),
      ++le === L && (le = 0),
      (a[X] = (he - V + ne - ye + Te - Re + Ue - Ve) * 0.5));
  }
  kt(a, 'hp', t.hp || 180, 0.707, s);
  let B = i;
  for (let X = 2; X < r - 3; X++)
    ((n[2 * X] += a[X] * B),
      (n[2 * X + 1] +=
        (3 * (a[X - 2] + a[X + 3]) - 25 * (a[X - 1] + a[X + 2]) + 150 * (a[X] + a[X + 1])) * (B / 256)));
  return n;
}

function Yl(n, e, t, i) {
  return xI(n, e, i, t);
}

function gs(n, e, t, i, s, o) {
  let r = n[0].length,
    a = n.length > 1,
    l = o.n || 5,
    c = o.det ?? 8,
    u = o.att ?? 0.5,
    f = o.rel ?? 0.6,
    h = o.rng,
    p = (o.g ?? 1) / Math.sqrt(l),
    d = o.swell ? o.swell[0] : 1,
    m = o.swell ? o.swell[1] : 1,
    x = o.swp || 1,
    v = Math.min(f * 3, o.tail ?? 99),
    y = Math.round((s + v) * e),
    b = ((Math.round(i * e) % r) + r) % r,
    g = a ? (o.width ?? 0.75) : 0,
    E = o.pan || 0,
    M = o.drift ?? 0.0012,
    _ = o.trem,
    T = n[0],
    w = a ? n[1] : null;
  for (let S = 0; S < l; S++) {
    let R = l > 1 ? (S / (l - 1)) * 2 - 1 : 0,
      z = t * Math.pow(2, (R * c + (h() - 0.5) * c * 0.4) / 1200),
      I = l > 1 ? (((S * 3 + 1) % l) / (l - 1)) * 2 - 1 : 0,
      L = pI(E + I * g, -1, 1),
      U = a ? Math.cos(((L + 1) * Math.PI) / 4) * p * Math.SQRT2 : p,
      k = a ? Math.sin(((L + 1) * Math.PI) / 4) * p * Math.SQRT2 : 0,
      C = u * (0.65 + 0.7 * h()),
      A = M * (0.5 + h()),
      F = at * (0.07 + 0.2 * h()),
      H = h() * at,
      N = _ ? at * _.rate * (0.93 + 0.14 * h()) : 0,
      Z = h() * at,
      Q = _ ? _.depth : 0,
      W = (oe) => {
        let ee = oe < C ? 0.5 - 0.5 * Math.cos((Math.PI * oe) / C) : 1;
        if (oe < s) d !== m ? (ee *= d + (m - d) * (x === 1 ? oe / s : Math.pow(oe / s, x))) : (ee *= d);
        else {
          let le = oe - s;
          ee *= m * Math.exp(-le / f) * Math.max(0, 1 - le / v);
        }
        return (Q && (ee *= 1 - Q * (0.5 - 0.5 * Math.cos(N * oe + Z))), ee);
      },
      J = h(),
      G = b,
      te = W(0);
    for (let oe = 0; oe < y; oe += 32) {
      let ee = oe / e,
        le = te;
      te = W((oe + 32) / e);
      let xe = (te - le) / 32,
        j = (z * (1 + A * Math.sin(F * ee + H))) / e,
        O = 1 - j,
        q = Math.min(32, y - oe),
        ue = le;
      if (G + q <= r) {
        if (w)
          for (let de = 0; de < q; de++, G++) {
            ((J += j), J >= 1 && (J -= 1));
            let $ = J + J - 1;
            if (J < j) {
              let se = J / j;
              $ -= se + se - se * se - 1;
            } else if (J > O) {
              let se = (J - 1) / j;
              $ -= se * se + se + se + 1;
            }
            (($ *= ue), (ue += xe), (T[G] += $ * U), (w[G] += $ * k));
          }
        else
          for (let de = 0; de < q; de++, G++) {
            ((J += j), J >= 1 && (J -= 1));
            let $ = J + J - 1;
            if (J < j) {
              let se = J / j;
              $ -= se + se - se * se - 1;
            } else if (J > O) {
              let se = (J - 1) / j;
              $ -= se * se + se + se + 1;
            }
            ((T[G] += $ * ue * U), (ue += xe));
          }
        G === r && (G = 0);
      } else
        for (let de = 0; de < q; de++) {
          ((J += j), J >= 1 && (J -= 1));
          let $ = J + J - 1;
          if (J < j) {
            let se = J / j;
            $ -= se + se - se * se - 1;
          } else if (J > O) {
            let se = (J - 1) / j;
            $ -= se * se + se + se + 1;
          }
          (($ *= ue), (ue += xe), (T[G] += $ * U), w && (w[G] += $ * k), ++G >= r && (G = 0));
        }
    }
  }
}

function mh(n, e) {
  let t = n.length,
    i = new Float32Array(t * 2),
    s = e ? (o) => n[(o + t) % t] : (o) => (o < 0 || o >= t ? 0 : n[o]);
  for (let o = 0; o < t; o++)
    ((i[2 * o] = n[o]),
      (i[2 * o + 1] =
        o >= 2 && o < t - 3
          ? (3 * (n[o - 2] + n[o + 3]) - 25 * (n[o - 1] + n[o + 2]) + 150 * (n[o] + n[o + 1])) / 256
          : (3 * (s(o - 2) + s(o + 3)) - 25 * (s(o - 1) + s(o + 2)) + 150 * (s(o) + s(o + 1))) / 256));
  return i;
}

function Ya(n, e, t, i) {
  let s = e < 400,
    o = s ? n / 2 : n,
    r = i.n || 4,
    a = i.det ?? 7,
    l = i.vel ?? 0.8,
    c = i.att ?? 0.045,
    u = i.rel ?? 0.16,
    f = i.rng,
    h = i.swell || [1, 1],
    p = i.swp || 1.6,
    d = Math.round((t + u * 3.5) * o),
    m = new Float32Array(d),
    x = Math.max(h[0], h[1]),
    v = 1 - Math.exp(-t / c),
    y = Math.ceil(d / 32) + 1,
    b = (U) =>
      U < t
        ? (1 - Math.exp(-U / c)) * (h[0] + (h[1] - h[0]) * Math.pow(U / t, p))
        : v * h[1] * Math.exp(-(U - t) / u),
    g = i.scoop ?? -35,
    E = i.bright ?? 8,
    M = i.vib ?? 1,
    _ = 0.8 / Math.sqrt(r),
    T = new Float32Array(y),
    w = new Float32Array(y);
  for (let U = 0; U < y; U++) {
    let k = (U * 32) / o;
    ((T[U] = b(k)),
      (w[U] =
        Math.pow(2, (g * Math.exp(-k / 0.028)) / 1200) *
        (1 + 0.0035 * M * Math.sin(at * 5.2 * k) * Math.min(1, k / 0.7))));
  }
  for (let U = 0; U < r; U++) {
    let k = (e * Math.pow(2, ((r > 1 ? (U / (r - 1)) * 2 - 1 : 0) * a + (f() - 0.5) * 3) / 1200)) / o,
      C = f();
    for (let A = 0, F = 0; A < d; A += 32, F++) {
      let H = k * w[F],
        N = 1 - H,
        Z = Math.min(d, A + 32);
      for (let Q = A; Q < Z; Q++) {
        ((C += H), C >= 1 && (C -= 1));
        let W = C + C - 1;
        if (C < H) {
          let J = C / H;
          W -= J + J - J * J - 1;
        } else if (C > N) {
          let J = (C - 1) / H;
          W -= J * J + J + J + 1;
        }
        m[Q] += W;
      }
    }
  }
  let S = (U) =>
      mu('lp', Math.min(o * 0.42, e * (1.3 + E * l * Math.pow(T[Math.min(y - 1, U)] / x, 1.4))), 0.9, o),
    R = 0,
    z = 0,
    I = S(0);
  for (let U = 0, k = 0; U < d; U += 32, k++) {
    let C = I;
    I = S(k + 1);
    let A = Math.min(d, U + 32),
      F = (T[Math.min(y - 1, k + 1)] - T[k]) / 32,
      H = (I[0] - C[0]) / 32,
      N = (I[1] - C[1]) / 32,
      Z = (I[2] - C[2]) / 32,
      Q = (I[3] - C[3]) / 32,
      W = (I[4] - C[4]) / 32,
      J = T[k],
      G = C[0],
      te = C[1],
      oe = C[2],
      ee = C[3],
      le = C[4];
    for (let xe = U; xe < A; xe++) {
      let j = m[xe] * _,
        O = G * j + R;
      ((R = te * j - ee * O + z), (z = oe * j - le * O));
      let q = O * J * 1.3;
      ((m[xe] = (q / Math.sqrt(1 + q * q)) * 0.8),
        (J += F),
        (G += H),
        (te += N),
        (oe += Z),
        (ee += Q),
        (le += W));
    }
  }
  Se(m, Jo(o, f, 0.05, 0.014, { bp: Math.min(2400, e * 5), q: 0.8, att: 0.004 }), 0, 0.05 * l, o);
  let L = Math.min(d, Math.round(0.02 * o));
  for (let U = 0; U < L; U++) m[d - 1 - U] *= U / L;
  return s ? mh(m, !1) : m;
}

function H6(n, e, t, i, s = {}) {
  let o = s.dur || 0.5,
    r = Math.round(o * n),
    a = new Float32Array(r),
    l = n / e,
    c = s.damp ?? 0.5 - 0.22 * t,
    u = s.tau || 0.2,
    f = Math.floor(l - c - 0.1),
    h = l - c - f,
    p = (1 - h) / (1 + h),
    d = Math.exp(-l / (n * u * 2.2)),
    m = new Float32Array(f),
    x = 0,
    v = 0,
    y = 0.16 + 0.62 * t;
  for (let S = 0; S < f; S++) ((x += (i() * 2 - 1 - x) * y), (m[S] = x), (v += x));
  v /= f;
  let b = Math.max(1, Math.round(f * 0.19)),
    g = new Float32Array(f);
  for (let S = 0; S < f; S++) g[S] = m[S] - v - 0.55 * (m[(S + b) % f] - v);
  let E = 0,
    M = 0;
  for (let S = 0; S < r; S++) {
    let R = S >= f ? a[S - f] : 0,
      z = S > f ? a[S - f - 1] : 0,
      I = (1 - c) * R + c * z,
      L = p * I + E - p * M;
    ((E = I), (M = L), (a[S] = (S < f ? g[S] : 0) + d * L));
  }
  let _ = s.mute || 0.14;
  for (let S = 0; S < r; S++) {
    let R = S / n;
    a[S] *= Math.exp(-R / _) * Math.min(1, S / (0.0012 * n));
  }
  Se(a, Jo(n, i, 0.03, 0.007, { lp: 500 }), 0, 0.12 * Pr(a) * t, n);
  let T = Pr(a);
  T > 0 && ls(a, 1 / T);
  let w = Math.round(0.02 * n);
  for (let S = 0; S < w; S++) a[r - 1 - S] *= S / w;
  return a;
}

function vI(n, e, t) {
  let i = it(n, e),
    s = 0;
  for (let o of t) s = Math.max(s, o[2]);
  for (let [o, r, a] of t) {
    if (o > n * 0.46 || a < s * 0.001) continue;
    let l = (at * o) / n,
      c = Math.exp(-1 / (r * n)),
      u = 2 * c * Math.cos(l),
      f = c * c,
      h = Math.min(i.length, Math.ceil(Math.log((s * 0.001) / a) / Math.log(c)) + 1),
      p = (-a / c) * Math.sin(l),
      d = 0;
    for (let m = 0; m < h; m++) {
      i[m] += d;
      let x = u * d - f * p;
      ((p = d), (d = x));
    }
  }
  return i;
}

function Xa(n, e, t, i, s) {
  let o = n / 2,
    r = 32e-5 * Math.pow(e / 262, 1.2),
    a = Math.min(8, Math.floor((0.46 * o) / e)),
    l = [];
  for (let h = 1; h <= a; h++) {
    let p = h * e * Math.sqrt(1 + r * h * h),
      d = Math.pow(h, -1.45) * Math.abs(Math.sin((Math.PI * h) / 7.6)) * Math.pow(t, (h - 1) * 0.3),
      m = (i * 0.36) / (1 + 0.33 * (h - 1));
    h <= 2 ? l.push([p * 0.9996, m, d * 0.55], [p * 1.0006, m * 0.82, d * 0.45]) : l.push([p, m, d]);
  }
  let c = vI(o, i, l),
    u = Math.round(0.007 * o);
  for (let h = 0; h < u; h++) c[h] *= h / u;
  Se(c, Jo(o, s, 0.06, 0.014, { lp: 420, att: 0.003 }), 0, 0.1 * t, o);
  let f = Math.round(0.25 * o);
  for (let h = 0; h < f && h < c.length; h++) c[c.length - 1 - h] *= h / f;
  return mh(ls(c, t), !1);
}

function m1(n, e, t, i) {
  let s = it(n, 0.9);
  return (
    Se(s, s5(n, 0.9, t * (1.5 + 0.6 * i), t, 0.016, 0.16 + 0.1 * i, 0.0012), 0, 1, n),
    Se(s, s5(n, 0.35, t * 1.59 * 1.25, t * 1.59, 0.02, 0.07, 0.001), 0, 0.3, n),
    Se(
      s,
      Xt(
        n,
        0.25,
        [
          [t * 2.3, 0.05, 0.16],
          [t * 2.65, 0.04, 0.11],
          [t * 3.16, 0.03, 0.08],
          [t * 3.6, 0.025, 0.05],
        ],
        e,
      ),
      0,
      1,
      n,
    ),
    Se(s, Jo(n, e, 0.14, 0.026, { bp: 520, q: 0.6 }), 0, 0.2 + 0.32 * i, n),
    Se(s, Jo(n, e, 0.012, 0.0022, { hp: 2200 }), 0, 0.1 + 0.2 * i, n),
    Xl(s, 1.2 + 0.5 * i)
  );
}

function yu(n, e, t = 1) {
  let i = it(n, 1.6);
  return (
    Se(i, s5(n, 1.6, 124, 55, 0.045, 0.34 * t, 0.002), 0, 1, n),
    Se(i, Jo(n, e, 0.5, 0.09, { lp: 150 }), 0, 0.7, n),
    Se(i, Jo(n, e, 0.16, 0.03, { bp: 700, q: 0.5 }), 0, 0.3, n),
    Se(i, Jo(n, e, 0.02, 0.004, { hp: 1800 }), 0, 0.12, n),
    Xl(i, 1.5)
  );
}

function gh(n, e, t, i, s = 1) {
  let o = [];
  for (let [l, c] of [
    [1, 1],
    [2.756, 0.7],
    [5.404, 0.5],
    [8.933, 0.32],
    [13.34, 0.2],
  ])
    o.push([
      t * l * (1 + (e() - 0.5) * 0.01),
      (i * 0.3) / (1 + (l - 1) * 0.16),
      c * Math.pow(s, Math.log2(l)),
    ]);
  for (let l = 0; l < 14; l++) {
    let c = 1.2 + 9 * Math.pow(e(), 1.4);
    o.push([t * c, ((i * 0.2) / (1 + (c - 1) * 0.3)) * (0.5 + e()), 0.22 * e() * Math.pow(s, Math.log2(c))]);
  }
  let r = Xt(n, i, o, e);
  Se(r, Jo(n, e, 0.01, 0.0018, { hp: 1500 }), 0, 0.5 * s, n);
  let a = Pr(r);
  return Xl(ls(r, 1 / a), 1.4);
}

function yI(n, e, t) {
  let i = n.length,
    s = Math.round(qt(38) * t) / t,
    o = s / e,
    r = at * o,
    a = 2 * Math.cos(r),
    l = 0,
    c = 1,
    u = 0,
    f = -Math.sin(r);
  for (let h = 0; h < i; h++) {
    (h & 255) === 0 &&
      ((c = 0.8 + 0.2 * Math.sin((at * 4 * h) / i - 1.2)),
      (u = Math.sin(r * h)),
      (f = Math.sin(r * (h - 1))));
    let p = l < 0.25 ? 4 * l : l < 0.75 ? 2 - 4 * l : 4 * l - 4,
      d = (0.8 * u + 0.24 * p) * 1.5 * c;
    n[h] += (d / Math.sqrt(1 + d * d)) * 0.105;
    let m = a * u - f;
    ((f = u), (u = m), (l += o), l >= 1 && (l -= 1));
  }
}

var r5 = (n, e, t = 1) => {
  for (let i = 0; i < n.length; i++) n[i] += e[i] * t;
  return n;
};

function O6(n, e, t) {
  let i = n.length;
  for (let s = 0; s < t.length; s++) {
    let [o, r] = t[s],
      a = (s + 1) * e;
    for (let l = 0; l < i; l++) {
      let c = l - a;
      (c < 0 && (c += i), (n[l] += r * o[c]));
    }
  }
  return n;
}

function* bI(n, e) {
  let t = n / 2,
    i = 16 * Ct,
    s = Math.round(i * t),
    o = new Float32Array(s),
    r = new Float32Array(s),
    a = new Float32Array(s),
    l = [r, a];
  (yI(o, t, i), yield);
  {
    let u = Math.round(4 * Ct * t),
      f = new Float32Array(u),
      h = new Float32Array(u);
    (gs([f], t, qt(38), -0.9, 4 * Ct - 1, {
      n: 3,
      det: 6,
      att: 1.5,
      rel: 0.9,
      g: 0.15,
      swell: [0.8, 1],
      rng: e,
    }),
      yield,
      gs([h], t, qt(50), -0.9, 4 * Ct - 1, {
        n: 3,
        det: 8,
        att: 1.7,
        rel: 0.9,
        g: 0.16,
        swell: [0.85, 1],
        rng: e,
      }),
      yield);
    for (let p = 0; p < 4; p++) (Ni(o, f, p * 4 * Ct, 1, t), Ni(o, h, (p * 4 + 2) * Ct, 1, t));
  }
  (o5(o, (u) => 520 + 150 * Math.sin(at * u - 0.6) + 70 * Math.sin(at * 3 * u + 1), 0.8, t),
    yield,
    gs(l, t, qt(62), -1, 8 * Ct - 0.8, { n: 2, det: 7, att: 2.2, rel: 0.8, g: 0.085, width: 0.5, rng: e }),
    yield);
  for (let u = 0; u < 4; u++) {
    let f = u * 2 * Ct - 0.7;
    (gs(l, t, qt(N6[u]), f, 2 * Ct - 0.1, {
      n: 3,
      det: 9,
      att: 1.4,
      rel: 0.7,
      g: 0.12,
      width: 0.8,
      swell: [0.75, 1],
      rng: e,
    }),
      yield,
      gs(l, t, qt(lI[u]), f + 0.25, 2 * Ct - 0.35, {
        n: 3,
        det: 10,
        att: 1.7,
        rel: 0.75,
        g: 0.095,
        width: 0.9,
        swell: [0.7, 1],
        rng: e,
      }),
      yield);
  }
  for (let u = 0; u < 4; u++)
    (gs(l, t, qt(N6[u]), (8 + u * 2) * Ct - 0.7, 2 * Ct - 0.1, {
      n: 4,
      det: 10,
      att: 1.6,
      rel: 0.75,
      g: 0.16,
      width: 0.85,
      swell: [0.8, 1],
      rng: e,
    }),
      yield);
  (gs(l, t, qt(74), 8 * Ct + 0.5, 6 * Ct, {
    n: 2,
    det: 5,
    att: 3.5,
    rel: 1.2,
    g: 0.045,
    width: 0.9,
    swell: [0.6, 1],
    rng: e,
  }),
    yield,
    gs(l, t, qt(81), 10 * Ct, 3.5 * Ct, { n: 2, det: 4, att: 3, rel: 1.3, g: 0.02, width: 0.9, rng: e }),
    yield,
    gs(l, t, qt(60), 14 * Ct - 0.4, 2 * Ct - 0.4, {
      n: 3,
      det: 9,
      att: 1.5,
      rel: 0.7,
      g: 0.09,
      width: 0.7,
      rng: e,
    }),
    yield,
    gs(l, t, qt(64), 14 * Ct - 0.1, 2 * Ct - 0.7, {
      n: 3,
      det: 9,
      att: 1.7,
      rel: 0.7,
      g: 0.085,
      width: 0.9,
      rng: e,
    }),
    yield);
  for (let u of l)
    (o5(u, (f) => 1250 + 380 * Math.sin(at * 2 * f + 0.5) + 160 * Math.sin(at * 5 * f), 0.75, t),
      yield,
      _u(
        u,
        t,
        [
          [290, 1.3, 0.4],
          [1050, 1.6, 0.3],
        ],
        !0,
      ),
      yield);
  (B6(l, t, 7), yield, r5(r, o), r5(a, o), mI(r, a, t, 42, 120), yield, Mu(l, bu.drone));
  let c = mh(r, !0);
  return (yield, [c, mh(a, !0)]);
}

function* MI(n, e) {
  let t = Math.round(8 * Ct * n),
    i = new Float32Array(t),
    s = new Float32Array(t),
    o = [i, s];
  for (let r = 0; r < 4; r++) {
    let a = r * 2 * Ct - 0.35,
      l = { rate: 12.8, depth: 0.5 };
    (gs(o, n, qt(U6[r]), a, 2 * Ct - 0.15, {
      n: 4,
      det: 10,
      att: 0.9,
      rel: 0.45,
      g: 0.1,
      width: 0.9,
      pan: -0.15,
      swell: [0.5, 1],
      swp: 1.5,
      trem: l,
      rng: e,
    }),
      yield,
      gs(o, n, qt(cI[r]), a + 0.1, 2 * Ct - 0.25, {
        n: 4,
        det: 11,
        att: 1.1,
        rel: 0.45,
        g: 0.085,
        width: 0.9,
        pan: 0.15,
        swell: [0.45, 1],
        swp: 1.5,
        trem: l,
        rng: e,
      }),
      yield,
      gs(o, n, qt(U6[r] - 12), a, 2 * Ct - 0.15, {
        n: 2,
        det: 8,
        att: 1.2,
        rel: 0.5,
        g: 0.05,
        width: 0.6,
        swell: [0.6, 1],
        rng: e,
      }),
      yield);
  }
  (gs(o, n, qt(86), 0.4, 8 * Ct - 2.2, {
    n: 2,
    det: 4,
    att: 3,
    rel: 0.5,
    g: 0.012,
    width: 1,
    swell: [0.7, 1],
    rng: e,
  }),
    yield);
  for (let r of o)
    (o5(r, (a) => 2900 + 800 * Math.sin(at * 4 * a - 1.57) + 300 * Math.sin(at * 3 * a), 0.7, n),
      yield,
      _u(
        r,
        n,
        [
          [480, 1.4, 0.3],
          [1500, 1.8, 0.28],
        ],
        !0,
      ),
      yield);
  return (
    B6(o, n, 5, 11, 1.8, 0.25),
    xo(i, 'hp', 240, 0.707, n),
    xo(s, 'hp', 240, 0.707, n),
    Mu(o, bu.strings)
  );
}

function V6(n, e) {
  let t = (n >> 1) & 3,
    i = n >= 8,
    s = [],
    o = 50 + e,
    r = [1, 0.42, 0.52, 0.86, 0.4, 0.5, 0.8, 0.46, 0.95, 0.4, 0.52, 0.82, 0.42, 0.5, 0.76, 0.5];
  for (let a = 0; a < 16; a++) {
    if (i && (a === 5 || a === 13)) continue;
    let l = o,
      c = r[a];
    (a === 3 || a === 11 ? (l = Zv[t] + e) : (a === 6 || a === 14) && (l = uI[t] + 12 + e),
      i && (a === 6 && (l = 62 + e), a === 14 && (l = Zv[t] + e), a === 8 && (c = 1)),
      n === 15 && (c = Math.min(1, 0.45 + 0.04 * a + (dI.includes(a) ? 0.12 : 0))),
      n % 4 === 3 && a === 15 && (l = Zv[t] + e),
      s.push([a, l, c]));
  }
  return s;
}

function* _I(n, e) {
  let t = Math.round(16 * Ct * n),
    i = new Float32Array(t),
    s = new Float32Array(t),
    o = new Map(),
    r = (u, f) => {
      let h = u * 4 + f,
        p = o.get(h);
      return (p || o.set(h, (p = H6(n, qt(u), [0.4, 0.7, 1][f], e, { mute: 0.12 + 0.05 * f }))), p);
    },
    a = (() => {
      let u = Math.round(0.3 * n),
        f = new Float32Array(u),
        h = qt(38),
        p = 0,
        d = 0;
      for (let x = 0; x < u; x++) {
        let v = x / n,
          y = (v * h) % 1 < 0.5 ? 1 : -1,
          b = 1 - Math.exp((-at * (90 + 380 * Math.exp(-v / 0.05))) / n);
        ((p += (y - p) * b), (d += (p - d) * b), (f[x] = d * Math.exp(-v / 0.11) * Math.min(1, x / 60)));
      }
      let m = Math.round(0.03 * n);
      for (let x = 0; x < m; x++) f[u - 1 - x] *= x / m;
      return f;
    })();
  for (let u = 0; u < 16; u++) {
    for (let [f, h, p] of V6(u, 0)) {
      let d = p * (0.93 + 0.14 * e());
      Ni(i, r(h, d > 0.78 ? 2 : d > 0.55 ? 1 : 0), u * Ct + f * qn, 0.3 * (0.35 + 0.65 * d), n);
    }
    (Ni(s, a, u * Ct, 0.2, n), Ni(s, a, u * Ct + 2 * qa, 0.14, n), yield);
  }
  xo(i, 'hp', 115, 0.707, n);
  let l = i.slice();
  xo(l, 'lp', 1900, 0.7, n);
  let c = l.slice();
  return (
    xo(c, 'lp', 1200, 0.7, n),
    yield,
    O6(i, Math.round(3 * qn * n), [
      [l, 0.27],
      [c, 0.1],
    ]),
    r5(i, s),
    ls(i, 1 / Pr(i)),
    Xl(i, 1.6),
    Mu([i], bu.pulse)[0]
  );
}

function* wI(n, e) {
  let t = Math.round(6 * Ct * n),
    i = new Float32Array(t),
    s = Xt(n, 0.06, [
      [2349.3, 0.011, 1],
      [3520, 0.006, 0.4],
      [5870, 0.004, 0.2],
    ]),
    o = Xt(n, 0.06, [
      [1760, 0.012, 1],
      [2637, 0.007, 0.35],
      [4186, 0.004, 0.15],
    ]);
  (Se(s, Jo(n, e, 0.004, 0.001, { hp: 3e3 }), 0, 0.5, n),
    Se(o, Jo(n, e, 0.004, 0.001, { hp: 2500 }), 0, 0.4, n));
  let r = [];
  for (let c = 0; c < 6; c++)
    r.push(Jo(n, e, 0.07, 0.012 + 0.012 * (c % 3), { hp: 5200 + 900 * (c % 2), att: 0.0012 }));
  let a = gh(n, e, qt(86), 0.5, 0.7),
    l = [
      [0.9, 0.3, 0.45, 0.7, 0.28, 0.4, 0.75, 0.3, 0.85, 0.3, 0.45, 0.7, 0.3, 0.42, 0.72, 0.4],
      [0.9, 0.25, 0.5, 0.65, 0.3, 0.3, 0.8, 0.45, 0.8, 0.25, 0.3, 0.75, 0.35, 0.5, 0.7, 0.55],
      [0.85, 0.35, 0.4, 0.75, 0.25, 0.5, 0.7, 0.25, 0.9, 0.4, 0.5, 0.65, 0.25, 0.35, 0.8, 0.6],
    ];
  for (let c = 0; c < 6; c++) {
    let u = l[c % 3];
    for (let f = 0; f < 16; f++) {
      let h = c * Ct + f * qn;
      f % 4 === 0 ? Ni(i, s, h, f === 0 ? 0.42 : 0.32, n) : f % 4 === 2 && Ni(i, o, h, 0.24, n);
      let p = u[(f + (c >= 3 ? 8 : 0)) % 16] * (0.9 + 0.2 * e());
      Ni(i, r[(f * 5 + c) % 6], h + (f & 1 ? Ci.swing : 0), 0.2 * p, n);
    }
    yield;
  }
  return (
    Ni(i, a, 2 * Ct + 14 * qn, 0.1, n),
    Ni(i, a, 5 * Ct + 11 * qn, 0.08, n),
    xo(i, 'hp', 1100, 0.707, n),
    Mu([i], bu.ticks)[0]
  );
}

var p1 = null,
  jv = 0;

function W6(n) {
  if (p1 && p1.sr === n) {
    let o = p1;
    return (++jv >= 4 && ((p1 = null), (jv = 0)), o);
  }
  let e = as(23063 + n),
    t = (o, r, a, l) => {
      let c = new Float32Array(Math.round(l * n));
      return (c.set(o.subarray(0, Math.min(o.length, c.length))), Yl(c, n, r, a));
    },
    i = { rt: 2.3, size: 1.25, damp: 0.3, pre: 0.022, hp: 170 },
    s = { lo: [], mid: [], hi: [] };
  for (let o of [0.55, 1])
    (s.lo.push(t(m1(n, e, 55, o), 0.3, i, 2)),
      s.mid.push(t(m1(n, e, 73.42, o), 0.28, i, 1.8)),
      s.hi.push(t(m1(n, e, 110, o), 0.26, i, 1.6)));
  return (
    (s.big = t(yu(n, e, 1), 0.55, { rt: 3.2, size: 1.5, damp: 0.35, pre: 0.03, hp: 150 }, 3.6)),
    (s.steel = t(
      gh(n, e, qt(57), 1.6, 0.8),
      0.5,
      { rt: 2.8, size: 1.4, damp: 0.22, pre: 0.025, hp: 250 },
      3,
    )),
    (s.sr = n),
    (p1 = s),
    (jv = 1),
    s
  );
}

function* EI(n, e) {
  let t = Math.round(8 * Ct * n),
    i = new Float32Array(t),
    s = W6(n);
  yield;
  let o = (r, a, l, c) => Ni(i, s[r][a], l, c, n);
  for (let r = 0; r < 8; r++) {
    let a = r * Ct,
      l = r & 1,
      c = r === 7;
    (o('lo', 1, a, 0.62),
      o('lo', 1, a + 8 * qn, c ? 0.4 : 0.5),
      c ||
        (o('mid', 0, a + 3 * qn, 0.3),
        o('mid', 1, a + 6 * qn, 0.4),
        l
          ? (o('hi', 1, a + 12 * qn, 0.36),
            o('hi', 0, a + 13 * qn, 0.2),
            o('mid', 1, a + 14 * qn, 0.44),
            r === 3 && o('lo', 0, a + 15 * qn, 0.3))
          : (o('hi', 0, a + 11 * qn, 0.3), o('mid', 1, a + 14 * qn, 0.42))),
      (r === 0 || r === 4) && Ni(i, s.big, a, r === 0 ? 0.6 : 0.5, n),
      (r === 2 || r === 6) && Ni(i, s.steel, a + 8 * qn, r === 2 ? 0.2 : 0.16, n),
      yield);
  }
  return (xo(i, 'hp', 38, 0.707, n, 0.6), Mu([Xl(i, 1.15)], bu.drums)[0]);
}

function* SI(n, e) {
  let t = Math.round(8 * Ct * n),
    i = new Float32Array(t),
    s = (r, a, l) => {
      let c = (r >> 1) & 3;
      for (let u of fI[c])
        Ni(
          i,
          Ya(n, qt(u), 0.2, { vel: l, att: 0.012, rel: 0.07, n: 3, det: 8, bright: 9, rng: e }),
          r * Ct + a * qn - 0.006,
          0.17 * (0.5 + 0.5 * l) * (u === 38 ? 0.8 : 1),
          n,
        );
    },
    o = (r, a, l, c) => {
      let u = (r >> 1) & 3;
      for (let f of hI[u])
        Ni(
          i,
          Ya(n, qt(f), l, {
            vel: c,
            att: 0.25,
            rel: 0.1,
            swell: [0.12, 1],
            swp: 2.2,
            n: 3,
            det: 9,
            bright: 7,
            rng: e,
          }),
          r * Ct + a * qn,
          0.15,
          n,
        );
    };
  return (
    s(0, 0, 1),
    s(0, 11, 0.6),
    yield,
    o(1, 4, 12 * qn - 0.05, 0.9),
    yield,
    s(2, 0, 0.9),
    s(2, 6, 0.7),
    yield,
    s(3, 3, 0.55),
    s(3, 14, 0.75),
    yield,
    s(4, 0, 1),
    s(4, 8, 0.6),
    yield,
    o(5, 4, 12 * qn - 0.05, 0.9),
    yield,
    s(6, 0, 0.9),
    s(6, 6, 0.7),
    s(6, 11, 0.55),
    yield,
    o(7, 0, 16 * qn - 0.05, 1),
    yield,
    xo(i, 'hp', 60, 0.707, n, 0.5),
    _u(i, n, g1, !0),
    ls(i, 1 / Pr(i)),
    Xl(i, 1.3),
    Mu([i], bu.brass)[0]
  );
}

function* TI(n, e) {
  let t = Math.round(8 * Ct * n),
    i = new Float32Array(t),
    s = new Float32Array(t),
    o = new Map(),
    r = (l, c) => {
      let u = l * 4 + c,
        f = o.get(u);
      return (f || o.set(u, (f = H6(n, qt(l), [0.55, 0.8, 1][c], e, { mute: 0.1 + 0.03 * c, dur: 0.4 }))), f);
    };
  for (let l = 0; l < 8; l++) {
    for (let [c, u, f] of V6(l + (l >= 4 ? 8 : 0), 12)) {
      let h = Math.min(1, f * 1.08 * (0.93 + 0.14 * e()));
      Ni(i, r(u, h > 0.78 ? 2 : h > 0.55 ? 1 : 0), l * Ct + c * qn, 0.22 * (0.4 + 0.6 * h), n);
    }
    yield;
  }
  (xo(i, 'hp', 230, 0.707, n),
    [74, 76, 77, 79, 81, 82, 84, 86].forEach((l, c) => {
      (gs([s], n, qt(l), c * Ct - 0.12, Ct - 0.1, {
        n: 3,
        det: 11,
        att: 0.35,
        rel: 0.3,
        g: 0.1,
        swell: [0.55, 1],
        swp: 1.4,
        trem: { rate: 12.8, depth: 0.4 },
        rng: e,
      }),
        gs([s], n, qt(l - 12), c * Ct - 0.12, Ct - 0.1, {
          n: 2,
          det: 8,
          att: 0.4,
          rel: 0.3,
          g: 0.06,
          swell: [0.6, 1],
          rng: e,
        }));
    }),
    yield,
    o5(s, (l) => 3300 + 900 * Math.sin(at * l - 1.57), 0.7, n),
    xo(s, 'hp', 300, 0.707, n),
    yield);
  let a = i.slice();
  return (xo(a, 'lp', 2600, 0.7, n), O6(i, Math.round(3 * qn * n), [[a, 0.22]]), Mu([r5(i, s)], bu.lift)[0]);
}

var G6 = { rt: 3, size: 1.45, damp: 0.3, pre: 0.03, hp: 200 };

function* AI(n, e, t) {
  let i = it(n, 5.4),
    [s, o] = Ci.cells[t];
  return (
    Se(i, Xa(n, qt(s), 0.62, 3.2, e), 0.002, 0.55, n),
    yield,
    Se(i, Xa(n, qt(o), 0.8, 4.3, e), Ci.cellSecond + 0.002, 0.6, n),
    Se(i, Xa(n, qt(o - 12), 0.5, 4, e), Ci.cellSecond + 0.002, 0.2, n),
    yield,
    Yl(i, n, 0.5, G6),
    i
  );
}

function* RI(n, e, t) {
  let i = it(n, 4.8),
    [s, o] = Ci.cells[t];
  for (let r of [-12, 0])
    (Se(
      i,
      Ya(n, qt(s + r), Ci.cellSecond - 0.1, {
        vel: 0.7,
        att: 0.05,
        rel: 0.09,
        n: 4,
        det: 8,
        bright: 6.5,
        rng: e,
      }),
      0,
      r ? 0.3 : 0.36,
      n,
    ),
      yield,
      Se(
        i,
        Ya(n, qt(o + r), 2.5, {
          vel: 0.9,
          att: 0.07,
          rel: 0.25,
          swell: [0.75, 1],
          swp: 0.7,
          n: 4,
          det: 9,
          bright: 6.5,
          rng: e,
        }),
        Ci.cellSecond,
        r ? 0.34 : 0.4,
        n,
      ),
      yield);
  return (
    kt(i, 'hp', 110, 0.707, n),
    _u(i, n, g1),
    Yl(i, n, 0.3, { rt: 2.4, size: 1.3, damp: 0.3, pre: 0.025, hp: 220 }),
    i
  );
}

function* CI(n, e, t) {
  let i = it(n, Ct + 1.1),
    s = W6(n);
  yield;
  let o = (a, l, c, u) => Se(i, s[a][l], c * qn, u, n);
  t === 0
    ? ([8, 9, 10, 11, 12, 13, 14, 15].forEach((a, l) =>
        o(l < 4 ? 'mid' : 'lo', l % 2 ? 0 : 1, a, 0.28 + 0.06 * l),
      ),
      o('hi', 1, 6, 0.4))
    : t === 1
      ? (o('hi', 1, 0, 0.4),
        o('hi', 0, 2, 0.26),
        o('hi', 1, 3, 0.42),
        o('mid', 1, 6, 0.46),
        o('mid', 0, 8, 0.3),
        o('mid', 1, 9, 0.48),
        o('lo', 1, 12, 0.56),
        o('lo', 0, 14, 0.4),
        o('lo', 1, 15, 0.6))
      : (o('lo', 1, 8, 0.5),
        o('mid', 1, 11, 0.5),
        o('hi', 1, 12, 0.4),
        o('hi', 1, 13, 0.46),
        o('lo', 1, 14, 0.62),
        o('lo', 0, 15, 0.42),
        Se(i, s.steel, 4 * qn, 0.2, n));
  let r = i.length - Math.round(0.35 * n);
  for (let a = r; a < i.length; a++) i[a] *= 1 - (a - r) / (i.length - r);
  return Xl(i, 1.1);
}

function* kI(n, e, t) {
  let i = it(n, 4.6);
  return (
    Se(i, yu(n, e, 1.2), 0.03, t ? 0.5 : 0.9, n),
    yield,
    t &&
      (Se(i, gh(n, e, qt(45), 2.6, 0.55), 0.03, 0.4, n),
      Se(i, gh(n, e, qt(50) * 1.012, 2.2, 0.5), 0.09, 0.22, n),
      yield),
    kt(i, 'lp', t ? 1500 : 500, 0.7, n),
    Yl(i, n, 1.1, { rt: 3.6, size: 1.6, damp: 0.4, pre: 0.045, hp: 120 }),
    i
  );
}

function PI(n, e, t, i, s) {
  let o = n.length,
    r = [s(), s(), s(), s(), s()],
    a = [-11, -5, 0, 6, 12].map((h) => Math.pow(2, h / 1200) / t),
    l = 0,
    c = 0,
    u = 0,
    f = 0;
  for (let h = 0; h < o; h++) {
    if ((h & 15) === 0) {
      let d = h / t,
        m = Math.min(1, d / i);
      ((c = qt(50) * Math.pow(2, Math.pow(m, 1.8))),
        (l += (16 * (3.2 + 9.6 * m * m)) / t),
        (u =
          (d < i ? Math.pow(m, 2.2) : Math.exp(-(d - i) / 0.07)) *
          (1 - 0.3 * (0.5 - 0.5 * Math.cos(at * l)) * m) *
          0.2),
        (f = (d < i ? Math.pow(m, 2.6) : Math.exp(-(d - i) / 0.05)) * 1.6));
    }
    let p = 0;
    for (let d = 0; d < 5; d++) {
      let m = c * a[d],
        x = r[d] + m;
      (x >= 1 && (x -= 1), (r[d] = x));
      let v = x + x - 1;
      if (x < m) {
        let y = x / m;
        v -= y + y - y * y - 1;
      } else if (x > 1 - m) {
        let y = (x - 1) / m;
        v -= y * y + y + y + 1;
      }
      p += v;
    }
    ((n[h] = p * u), (e[h] *= f));
  }
}

function* II(n, e) {
  let t = Ci.riserPeak,
    i = it(n, t + 0.6),
    s = i.length,
    o = e0(n, t + 0.6, e);
  (y0(o, 'bp', (a) => 320 * Math.pow(18, Math.min(1, (a * (t + 0.6)) / t)), 1.3, n), yield);
  let r = new Float32Array(s);
  (PI(r, o, n, t, e),
    yield,
    y0(r, 'lp', (a) => 350 * Math.pow(11, Math.min(1, (a * (t + 0.6)) / t)), 0.9, n),
    kt(r, 'hp', 200, 0.707, n));
  for (let a = 0; a < s; a++) i[a] = r[a] + o[a];
  return i;
}

function* zI(n, e) {
  let t = it(n, 5);
  (Se(t, yu(n, e, 1.25), 0, 1, n),
    Se(t, m1(n, e, 55, 1), 0, 0.7, n),
    yield,
    Se(t, gh(n, e, qt(50), 2.4, 0.9), 0, 0.3, n),
    Se(t, gh(n, e, qt(57) * 0.99, 1.8, 0.8), 0.004, 0.16, n),
    yield);
  let i = it(n, 4);
  for (let [s, o] of [
    [38, 1],
    [45, 0.8],
    [50, 0.9],
    [57, 0.5],
  ])
    (Se(
      i,
      Ya(n, qt(s), 1.3, {
        vel: 1,
        att: 0.02,
        rel: 0.4,
        swell: [1, 0.3],
        swp: 0.5,
        n: 5,
        det: 12,
        bright: 7,
        scoop: -60,
        rng: e,
      }),
      0,
      0.24 * o,
      n,
    ),
      yield);
  return (
    Se(t, _u(i, n, g1), 0, 1, n),
    Yl(t, n, 0.45, { rt: 3.4, size: 1.55, damp: 0.3, pre: 0.03, hp: 160 }),
    Xl(t, 1.3)
  );
}

function* DI(n, e) {
  let t = it(n, 5);
  (Se(t, Xa(n, qt(65), 0.7, 1.6, e), 0.002, 0.6, n),
    Se(t, Xa(n, qt(64), 0.7, 1.6, e), 0.002 + qa / 2, 0.58, n),
    yield,
    Se(t, Xa(n, qt(62), 0.9, 4.2, e), 0.002 + qa, 0.72, n),
    Se(t, Xa(n, qt(50), 0.6, 4, e), 0.002 + qa, 0.3, n),
    Se(t, Xa(n, qt(74), 0.55, 3, e), 0.002 + qa * 2.5, 0.3, n),
    yield);
  let i = it(n, 4.6);
  for (let [s, o] of [
    [50, 1],
    [57, 0.9],
    [62, 0.8],
  ])
    (Se(
      i,
      Ya(n, qt(s), 1.9, {
        vel: 0.55,
        att: 0.3,
        rel: 0.5,
        swell: [0.6, 1],
        swp: 0.8,
        n: 4,
        det: 8,
        bright: 5,
        scoop: 0,
        rng: e,
      }),
      qa - 0.1,
      0.2 * o,
      n,
    ),
      yield);
  return (Se(t, _u(i, n, g1), 0, 1, n), Se(t, yu(n, e, 1), qa, 0.3, n), Yl(t, n, 0.5, G6), t);
}

function LI(n, e, t, i) {
  let s = n.length,
    o = [],
    r = [];
  for (let c = 0; c < t.length * 3; c++)
    (o.push(i()),
      r.push((qt(t[(c / 3) | 0]) * Math.pow(2, (((c % 3) - 1) * 9 + (i() - 0.5) * 4) / 1200)) / e));
  let a = 1,
    l = 0;
  for (let c = 0; c < s; c++) {
    if ((c & 15) === 0) {
      let f = c / e;
      ((a = Math.pow(2, (-16 / 12) * Math.pow(Math.min(1, f / 4.2), 1.35))),
        (l = 0.07 * (1 - Math.exp(-f / 0.03)) * Math.pow(Math.max(0, 1 - f / 4.4), 1.2)));
    }
    let u = 0;
    for (let f = 0; f < o.length; f++) {
      let h = r[f] * a,
        p = o[f] + h;
      (p >= 1 && (p -= 1), (o[f] = p));
      let d = p + p - 1;
      if (p < h) {
        let m = p / h;
        d -= m + m - m * m - 1;
      } else if (p > 1 - h) {
        let m = (p - 1) / h;
        d -= m * m + m + m + 1;
      }
      u += d;
    }
    n[c] = u * l;
  }
}

function* FI(n, e) {
  let t = it(n, 5.2),
    i = it(n / 2, 5.2),
    s = [50, 57, 62, 65];
  return (
    LI(i, n / 2, s, e),
    yield,
    y0(i, 'lp', ei(2400, 140, 0.6), 0.9, n / 2),
    kt(i, 'hp', 60, 0.707, n / 2),
    Se(t, mh(i, !1), 0, 1, n),
    Se(t, yu(n, e, 1.2), 0, 0.75, n),
    Se(t, s5(n, 2.6, 98, 41, 0.9, 0.9, 0.004), 0.02, 0.4, n),
    yield,
    Yl(t, n, 0.5, { rt: 3.4, size: 1.5, damp: 0.4, pre: 0.03, hp: 150 }),
    t
  );
}

function* NI(n, e) {
  let t = it(n, 12.5),
    i = it(n / 2, 12.5),
    s = [i],
    o = (c, u, f, h, p) => {
      for (let d of f)
        gs(s, n / 2, qt(d), c - 0.25, u, {
          n: 3,
          det: 9,
          att: 0.5,
          rel: 0.7,
          g: h * (d < 48 ? 1.1 : 0.8),
          swell: p,
          tail: 2.2,
          rng: e,
        });
    };
  (o(0, Ct, [46, 53, 58, 62], 0.075, [0.7, 1]),
    yield,
    o(Ct, Ct, [48, 55, 60, 64], 0.08, [0.75, 1]),
    yield,
    o(2 * Ct, 2.6 * Ct, [38, 45, 50, 57, 62], 0.085, [1, 0.5]),
    yield,
    y0(i, 'lp', (c) => 1700 - 700 * c, 0.75, n / 2),
    kt(i, 'hp', 45, 0.707, n / 2),
    Se(t, mh(i, !1), 0, 1, n),
    yield);
  let r = it(n, 12.5);
  for (let [c, u] of [
    [46, 0.8],
    [58, 1],
  ])
    Se(
      r,
      Ya(n, qt(c), Ct - 0.2, {
        vel: 0.6,
        att: 0.2,
        rel: 0.2,
        swell: [0.6, 1],
        n: 3,
        det: 8,
        bright: 5,
        scoop: 0,
        rng: e,
      }),
      0,
      0.13 * u,
      n,
    );
  for (let [c, u] of [
    [48, 0.8],
    [60, 1],
  ])
    Se(
      r,
      Ya(n, qt(c), Ct - 0.2, {
        vel: 0.7,
        att: 0.2,
        rel: 0.2,
        swell: [0.65, 1],
        n: 3,
        det: 8,
        bright: 5.5,
        scoop: 0,
        rng: e,
      }),
      Ct,
      0.14 * u,
      n,
    );
  yield;
  for (let [c, u] of [
    [38, 0.9],
    [50, 1],
    [57, 0.8],
  ])
    Se(
      r,
      Ya(n, qt(c), 2 * Ct, {
        vel: 0.7,
        att: 0.1,
        rel: 0.8,
        swell: [1, 0.3],
        swp: 0.8,
        n: 3,
        det: 8,
        bright: 5,
        scoop: -20,
        rng: e,
      }),
      2 * Ct,
      0.15 * u,
      n,
    );
  (Se(t, _u(r, n, g1), 0, 1, n), yield);
  let a = (c, u, f, h, p) => Se(t, Xa(n, qt(u), f, h, e), c + 0.002, p, n);
  (a(0, 65, 0.7, 2.6, 0.5),
    a(2 * qa, 67, 0.72, 2.4, 0.5),
    a(Ct, 69, 0.85, 3.4, 0.6),
    a(Ct, 57, 0.5, 3, 0.2),
    yield,
    a(2 * Ct, 62, 0.9, 5.5, 0.7),
    a(2 * Ct, 50, 0.7, 5.5, 0.4),
    a(2 * Ct + Ci.cellSecond, 69, 0.7, 5, 0.5),
    a(3 * Ct, 74, 0.6, 4.5, 0.4),
    a(3 * Ct + 2 * qa, 78, 0.45, 4.4, 0.3),
    yield,
    Se(t, yu(n, e, 1), 0, 0.35, n),
    Se(t, m1(n, e, 55, 0.8), Ct, 0.3, n),
    Se(t, yu(n, e, 1.25), 2 * Ct, 0.6, n),
    Yl(t, n, 0.5, { rt: 3.6, size: 1.55, damp: 0.3, pre: 0.03, hp: 190 }));
  let l = Math.round(10.4 * n);
  for (let c = l; c < t.length; c++) t[c] *= Math.pow(1 - (c - l) / (t.length - l), 1.5);
  return t;
}

var vu = (n, e) => ({ gen: n, n: 1, sr: e, peak: 0.9, fixed: 1, loop: 1, music: 1 }),
  Ga = (n, e, t, i, s = 2) => ({ gen: n, n: e, sr: t, peak: i, bus: 'music', max: s, pri: 9 }),
  q6 = {
    music_drone: vu(bI, Ko),
    music_strings: vu(MI, Ko),
    music_pulse: vu(_I, i5),
    music_ticks: vu(wI, Ko),
    music_drums: vu(EI, i5),
    music_brass: vu(SI, i5),
    music_lift: vu(TI, Ko),
    mus_cell: Ga(AI, 4, Ko, 0.5),
    mus_horn: Ga(RI, 4, Ko, 0.6),
    mus_fill: Ga(CI, 3, i5, 0.6),
    mus_hit: Ga(kI, 2, Ko, 0.6),
    mus_riser: Ga(II, 1, Ko, 0.6, 1),
    mus_impact: Ga(zI, 1, Ko, 0.8, 1),
    objective: Ga(DI, 1, Ko, 0.7, 1),
    death: Ga(FI, 1, Ko, 0.85, 1),
    complete: Ga(NI, 1, Ko, 0.8, 1),
  },
  $l = Object.keys(Ci.loops);

function UI(n, e, t) {
  let i = it(n, 0.3),
    s = [1, 1.07, 0.94, 1.03][t & 3];
  (Se(i, Gn(n, 0.06, 112 * s, 58 * s, 0.018, 0.02, 0.002), 0, 0.75, n),
    Se(i, xt(n, e, 0.06, 0.016, { lp: 720 * s }), 0, 0.9, n),
    Se(i, xt(n, e, 0.1, 0.028, { bp: 2500 * s, q: 0.7, att: 0.004 }), 0.012, 0.22, n));
  let o = xt(n, e, 0.2, 0.05, { hp: 3800, att: 0.01 }),
    r = 1;
  for (let a = 0; a < o.length; a++) (a % 70 === 0 && (r = 0.3 + e() * 0.7), (o[a] *= r));
  return (Se(i, o, 0.02, 0.16, n), i);
}

function Y6(n, e, t, i) {
  let s = it(n, t),
    o = e0(n, t * 0.9, e);
  (y0(o, 'bp', ei(1500, 520), 0.8, n),
    Se(s, Mn(o, n, ms(0.085 * i, 0.007)), 0, 0.9, n),
    Se(s, xt(n, e, t * 0.8, 0.07 * i, { hp: 3e3, att: 0.012 }), 0.01, 0.25, n));
  let r = Math.round(5 * i);
  for (let a = 0; a < r; a++) {
    let l = Dt(e, 500, 1700);
    Se(s, Va(n, Dt(e, 0.008, 0.02), l, l * Dt(e, 1.3, 1.9)), Dt(e, 0.03, t * 0.6), Dt(e, 0.1, 0.3), n);
  }
  return s;
}

function BI(n, e, t) {
  let i = Y6(n, e, 0.46, 1 + t * 0.08);
  return (Se(i, Gn(n, 0.06, 100, 55, 0.02, 0.02, 0.002), 0, 0.5, n), i);
}

function HI(n, e, t) {
  let i = it(n, 0.38),
    s = [1, 1.08, 0.92][t % 3];
  return (
    Se(i, Gn(n, 0.06, 120, 62, 0.018, 0.02, 0.002), 0, 0.6, n),
    Se(i, xt(n, e, 0.04, 0.008, { lp: 2400 }), 0, 0.6, n),
    Se(
      i,
      Xt(
        n,
        0.36,
        [
          [178 * s, 0.09, 1],
          [412 * s, 0.075, 0.8],
          [733 * s, 0.06, 0.55],
          [1214 * s, 0.045, 0.4],
          [1958 * s, 0.03, 0.3],
          [3130 * s, 0.016, 0.18],
        ],
        e,
      ),
      0.001,
      0.3,
      n,
    ),
    Se(i, xt(n, e, 0.08, 0.02, { bp: 3e3, q: 0.8, att: 0.003 }), 0.01, 0.1, n),
    i
  );
}

function OI(n, e) {
  let t = it(n, 0.45);
  (Se(t, Gn(n, 0.14, 124, 44, 0.03, 0.045, 0.002), 0, 1, n),
    Se(t, xt(n, e, 0.14, 0.035, { lp: 520 }), 0, 1, n),
    Se(t, xt(n, e, 0.2, 0.06, { bp: 1500, q: 0.7, att: 0.01 }), 0.01, 0.16, n));
  for (let i of [0.022, 0.05, 0.088])
    Se(t, xt(n, e, 0.012, 0.003, { bp: Dt(e, 2200, 4200), q: 2 }), i, Dt(e, 0.1, 0.22), n);
  return (Se(t, xt(n, e, 0.2, 0.05, { hp: 3500, att: 0.01 }), 0.015, 0.1, n), fi(t, 1.2));
}

function VI(n, e) {
  let t = it(n, 0.26);
  return (
    Se(t, xt(n, e, 0.2, 0.05, { bp: 900, q: 0.7, att: 0.02 }), 0, 0.6, n),
    Se(t, xt(n, e, 0.1, 0.025, { bp: 2600, q: 0.8, att: 0.004 }), 0.005, 0.35, n),
    Se(t, Gn(n, 0.05, 95, 60, 0.02, 0.018, 0.003), 0, 0.4, n),
    t
  );
}

function WI(n, e) {
  let t = it(n, 0.5);
  return (
    Se(t, Gn(n, 0.25, 92, 38, 0.04, 0.06, 0.0015), 0, 1.1, n),
    Se(t, xt(n, e, 0.2, 0.04, { lp: 320 }), 0, 1.2, n),
    Se(t, xt(n, e, 0.06, 0.01, { bp: 820, q: 1 }), 0, 0.55, n),
    Se(t, xt(n, e, 0.03, 0.004, { hp: 1800, lp: 5e3 }), 0, 0.2, n),
    fi(t, 1.6)
  );
}

function GI(n) {
  let e = it(n, 2.4);
  for (let t = 0; t < e.length; t++) {
    let i = t / n;
    e[t] =
      (Math.sin(at * 3150 * i) + 0.7 * Math.sin(at * 4013 * i + 1) + 0.35 * Math.sin(at * 5310 * i + 2)) *
      (1 - Math.exp(-i / 0.12)) *
      Math.exp(-i / 0.55);
  }
  return e;
}

function qI(n, e, t) {
  let i = it(n, 0.5),
    s = [640, 880, 745][t % 3] * Dt(e, 0.97, 1.03);
  return (
    Se(i, xt(n, e, 0.015, 0.003, { hp: 1500 }), 0, 1, n),
    Se(i, xt(n, e, 0.04, 0.008, { lp: 1800 }), 0, 0.6, n),
    Se(
      i,
      Xt(
        n,
        0.48,
        [1, 1.58, 2.24, 2.92, 3.71, 4.93, 6.31, 8.1].map((r, a) => [
          s * r,
          0.13 / (1 + a * 0.55),
          1 / (1 + a * 0.5),
        ]),
        e,
      ),
      5e-4,
      0.42,
      n,
    ),
    i
  );
}

function XI(n, e, t) {
  let i = it(n, 0.36),
    s = [1, 1.1, 0.9][t % 3];
  return (
    Se(i, xt(n, e, 0.06, 0.013, { lp: 950 * s }), 0, 1.1, n),
    Se(i, Gn(n, 0.05, 150 * s, 70, 0.012, 0.016), 0, 0.6, n),
    Se(i, xt(n, e, 0.012, 0.002, { hp: 2e3 }), 0, 0.6, n),
    Se(i, xt(n, e, 0.12, 0.024, { bp: 3500 * s, q: 0.7 }), 0.003, 0.3, n),
    Se(i, Wa(n, e, 0.34, 16, { from: 0.03, fall: 1.8, hp: 1800, ampFall: 0.1 }), 0, 0.35, n),
    i
  );
}

function YI(n, e, t) {
  let i = it(n, 0.26),
    s = t ? 1.14 : 1;
  return (
    Se(
      i,
      Xt(
        n,
        0.2,
        [
          [238 * s, 0.03, 1],
          [512 * s, 0.022, 0.8],
          [893 * s, 0.016, 0.6],
          [1410 * s, 0.01, 0.4],
        ],
        e,
      ),
      0,
      0.6,
      n,
    ),
    Se(i, xt(n, e, 0.03, 0.006, { lp: 2100 }), 0, 0.8, n),
    Se(i, xt(n, e, 0.01, 0.002, { hp: 3e3 }), 0, 0.5, n),
    Se(i, Wa(n, e, 0.2, 6, { from: 0.01, fall: 2, bp: 2600, q: 1.5 }), 0, 0.3, n),
    i
  );
}

function $I(n, e, t) {
  let i = Y6(n, e, 0.5, 0.8 + t * 0.2);
  return (Se(i, Va(n, 0.035, 420, 1150), 0, 0.5, n), i);
}

function ZI(n, e, t) {
  let i = it(n, 0.3),
    s = [1, 1.12, 0.9][t % 3];
  (Se(i, xt(n, e, 0.03, 0.007, { hp: 4e3 }), 0, 0.9, n),
    Se(
      i,
      Xt(
        n,
        0.12,
        [
          [2920 * s, 0.022, 1],
          [4730 * s, 0.018, 0.8],
          [7310 * s, 0.012, 0.6],
          [1180 * s, 0.03, 0.5],
        ],
        e,
      ),
      0,
      0.4,
      n,
    ),
    Se(i, xt(n, e, 0.05, 0.012, { bp: 320 * s, q: 1.5 }), 0, 0.9, n));
  let o = e0(n, 0.06, e);
  kt(o, 'bp', 2400, 1, n);
  for (let r = 0; r < o.length; r++) {
    let a = r / n;
    o[r] *= (Math.sin(at * 118 * a) > 0.2 ? 1 : 0.1) * Math.exp(-a / 0.02);
  }
  return (
    Se(i, o, 0.004, 0.5, n),
    Se(i, Wa(n, e, 0.28, 10, { from: 0.02, fall: 1.6, hp: 5e3, ampFall: 0.08 }), 0, 0.3, n),
    i
  );
}

function jI(n, e) {
  let t = it(n, 0.45);
  Se(t, xt(n, e, 0.01, 0.002, { hp: 2500 }), 0, 1, n);
  for (let i = 0; i < 9; i++) {
    let s = Dt(e, 3200, 9500);
    Se(
      t,
      Xt(
        n,
        0.1,
        [
          [s, Dt(e, 0.01, 0.03), 1],
          [s * 1.47, 0.01, 0.5],
        ],
        e,
      ),
      Math.pow(e(), 2) * 0.3,
      Dt(e, 0.1, 0.35),
      n,
    );
  }
  return t;
}

function KI(n, e, t) {
  let i = it(n, 0.75),
    s = [3300, 2700, 3900][t % 3],
    o = [820, 1100, 700][t % 3],
    r = 0,
    a = e0(n, 0.75, e);
  for (let l = 0; l < i.length; l++) {
    let c = l / n,
      u = o + (s - o) * Math.exp(-c / 0.16),
      f = 1 + 0.035 * Math.sin(at * (18 + 30 * c) * c);
    ((r += (at * u * f) / n),
      (i[l] = (Math.sin(r) + 0.3 * Math.sin(2 * r)) * (1 - Math.exp(-c / 0.004)) * Math.exp(-c / 0.19)));
  }
  return (
    y0(a, 'bp', (l) => o + (s - o) * Math.exp((-l * 0.75) / 0.16), 6, n),
    Se(i, Mn(a, n, ms(0.15, 0.003)), 0, 1.6, n),
    Se(i, xt(n, e, 0.01, 0.002, { hp: 2500 }), 0, 0.7, n),
    i
  );
}

var Kv = (n, e) => Math.round(n * e) / e;

function* JI(n, e) {
  let i = n * 2,
    s = new Float32Array(i),
    o = [
      [184, 2.5],
      [207.5, 3.5],
      [233, 2],
      [258.5, 4.5],
    ];
  for (let [l, c] of o) {
    let u = Kv(l, 2),
      f = Kv(c, 2),
      h = e() * at,
      p = e() * at;
    for (let d = 0; d < i; d++) {
      let m = d / n,
        x = at * u * m + h;
      s[d] +=
        (Math.sin(x) +
          0.5 * Math.sin(2 * x + 1) +
          0.3 * Math.sin(3 * x + 2) +
          0.16 * Math.sin(4 * x) +
          0.08 * Math.sin(6 * x)) *
        (0.72 + 0.28 * Math.sin(at * f * m + p)) *
        0.25;
    }
    yield;
  }
  let r = gu(
      n,
      2,
      e,
      (l) => {
        (kt(l, 'hp', 1100, 0.7, n), kt(l, 'lp', 5200, 0.7, n));
      },
      0.25,
    ),
    a = Kv(46, 2);
  for (let l = 0; l < i; l++) s[l] += r[l] * (0.55 + 0.45 * Math.sin((at * a * l) / n)) * 0.5;
  return s;
}

function QI(n, e) {
  let i = n * 2,
    s = new Float32Array(i);
  for (let r = 0; r < i; r++) {
    let a = r / n,
      l = 1.1 * Math.sin(at * 0.5 * a) + 0.5 * Math.sin(at * 1.5 * a + 1),
      c = at * 310 * a + l,
      u = 0.7 + 0.3 * Math.sin(at * 1.5 * a),
      f = (Math.sin(c) + 0.45 * Math.sin(2 * c + l) + 0.2 * Math.sin(4 * c + 0.5)) * 0.3 * u,
      h = at * 62 * a;
    ((f += (Math.sin(h) + 0.5 * Math.sin(2 * h) + 0.33 * Math.sin(3 * h) + 0.2 * Math.sin(5 * h)) * 0.28),
      (s[r] = f));
  }
  let o = gu(
    n,
    2,
    e,
    (r) => {
      (kt(r, 'hp', 2800, 0.7, n), kt(r, 'lp', 7e3, 0.7, n));
    },
    0.25,
  );
  for (let r = 0; r < i; r++) s[r] += o[r] * 0.12 * (0.6 + 0.4 * Math.sin((at * 1.5 * r) / n + 2));
  return s;
}

function ez(n, e) {
  let i = n * 2,
    s = new Float32Array(i);
  for (let r = 0; r < i; r++) {
    let a = r / n,
      l = at * 50 * a;
    s[r] =
      (Math.sin(l) * 0.5 +
        Math.sin(2 * l + 0.4) +
        0.5 * Math.sin(3 * l + 1) +
        0.3 * Math.sin(4 * l) +
        0.22 * Math.sin(6 * l + 2) +
        0.12 * Math.sin(10 * l)) *
        0.3 *
        (0.9 + 0.1 * Math.sin(at * 0.5 * a)) +
      Math.sin(at * 4100 * a) * 0.012 * (0.6 + 0.4 * Math.sin(at * 1 * a)) +
      Math.sin(at * 1250 * a + 0.6 * Math.sin(at * 2 * a)) * 0.02;
  }
  let o = gu(n, 2, e, (r) => kt(r, 'bp', 2100, 1.2, n), 0.25);
  for (let r = 0; r < i; r++) s[r] += o[r] * 0.16 * Math.pow(0.5 + 0.5 * Math.sin((at * 100 * r) / n), 3);
  return s;
}

function tz(n, e, t) {
  let i = it(n, 0.42),
    s = [1, 1.07, 0.93][t % 3];
  Se(i, Va(n, 0.035, 920 * s, 610 * s), 0, 0.06, n);
  let o = 0.03;
  return (
    Se(i, Gn(n, 0.2, 84 * s, 41, 0.03, 0.05, 0.002), o, 1.1, n),
    Se(i, xt(n, e, 0.12, 0.03, { lp: 360 }), o, 1.1, n),
    Se(i, xt(n, e, 0.03, 0.006, { lp: 2600, hp: 500 }), o, 0.4, n),
    Se(
      i,
      Xt(
        n,
        0.12,
        [
          [522 * s, 0.026, 1],
          [1133 * s, 0.02, 0.7],
          [1871 * s, 0.014, 0.5],
          [3040 * s, 0.008, 0.3],
        ],
        e,
      ),
      o,
      0.2,
      n,
    ),
    Se(i, xt(n, e, 0.14, 0.04, { hp: 3e3, att: 0.006 }), o + 0.01, 0.06, n),
    fi(i, 1.5)
  );
}

function nz(n, e) {
  let t = it(n, 1.5),
    i = [0, 0, 0, 0];
  Se(t, xt(n, e, 0.02, 0.004, { hp: 2500 }), 0, 0.9, n);
  let s = [184, 207, 233, 258];
  for (let a = 0; a < Math.round(1.1 * n); a++) {
    let l = a / n,
      c = Math.pow(0.16, l / 1) * (1 + 0.06 * Math.sin(at * (9 - 5 * l) * l)),
      u = 0;
    for (let h = 0; h < 4; h++)
      ((i[h] += (at * s[h] * c) / n),
        (u += Math.sin(i[h]) + 0.5 * Math.sin(2 * i[h]) + 0.3 * Math.sin(3 * i[h])));
    let f = 0.6 + 0.4 * Math.sign(Math.sin(at * (26 - 16 * l) * l));
    t[a] += u * 0.16 * f * Math.exp(-l / 0.55) * (1 - Math.exp(-l / 0.01));
  }
  let o = e0(n, 1, e);
  (y0(o, 'bp', ei(3200, 500), 1, n), Se(t, Mn(o, n, ms(0.35, 0.01)), 0, 0.3, n));
  let r = 0.72;
  return (
    Se(t, xt(n, e, 0.2, 0.035, { lp: 3e3 }), r, 1, n),
    Se(t, Gn(n, 0.12, 130, 55, 0.02, 0.035), r, 0.8, n),
    Se(
      t,
      Xt(
        n,
        0.4,
        [
          [705, 0.07, 1],
          [1490, 0.05, 0.7],
          [2610, 0.035, 0.5],
          [4020, 0.02, 0.3],
        ],
        e,
      ),
      r,
      0.28,
      n,
    ),
    Se(t, Wa(n, e, 0.7, 26, { from: 0.02, fall: 1.7, hp: 1500, ampFall: 0.2, maxLen: 0.008 }), r, 0.5, n),
    Se(
      t,
      Xt(
        n,
        0.2,
        [
          [1900, 0.03, 1],
          [3350, 0.02, 0.6],
        ],
        e,
      ),
      r + 0.19,
      0.14,
      n,
    ),
    fi(t, 1.4)
  );
}

function iz(n, e) {
  let t = it(n, 1.9),
    i = 0,
    s = 0,
    o = it(n, 1.3);
  for (let r = 0; r < o.length; r++) {
    let a = r / n,
      l = 30 + 112 * Math.pow(1 - a / 1.3, 1.6);
    ((i += l / n),
      (s += (180 + 1050 * Math.exp(-a / 0.3)) / n),
      (o[r] =
        (2 * (i - Math.floor(i)) - 1) * (1 - Math.exp(-a / 0.02)) * Math.pow(1 - a / 1.3, 0.7) +
        Math.sin(at * s) * 0.25 * Math.exp(-a / 0.4)));
  }
  (y0(o, 'lp', ei(1100, 160), 2.5, n),
    Se(t, o, 0, 0.55, n),
    Se(t, xt(n, e, 0.03, 0.006, { hp: 2e3 }), 0, 0.5, n));
  for (let [r, a, l] of [
    [0.62, 1, 1],
    [0.84, 0.75, 1.22],
    [0.98, 0.5, 0.86],
    [1.17, 0.42, 1.4],
    [1.33, 0.22, 1.1],
  ])
    (Se(t, Gn(n, 0.1, 105 * l, 48, 0.02, 0.035), r, a * 0.9, n),
      Se(t, xt(n, e, 0.08, 0.016, { lp: 2400 }), r, a * 0.8, n),
      Se(
        t,
        Xt(
          n,
          0.3,
          [
            [388 * l, 0.07, 1],
            [861 * l, 0.05, 0.7],
            [1540 * l, 0.035, 0.5],
            [2750 * l, 0.02, 0.35],
          ],
          e,
        ),
        r,
        a * 0.3,
        n,
      ));
  return (
    Se(t, Wa(n, e, 1, 22, { from: 0, fall: 1.2, hp: 1800, ampFall: 0.4, maxLen: 0.007 }), 0.62, 0.3, n),
    fi(ls(t, 0.55), 1.5)
  );
}

function sz(n, e, t) {
  let i = it(n, 0.52),
    s = t ? 622 : 1320,
    o = s * 1.4142,
    r = 0,
    a = (l, c, u, f) => {
      let h = Math.round(c * n),
        p = Math.round(l * n);
      for (let d = 0; d < h; d++) {
        let m = d / h,
          x = d / n;
        r += (at * u * (1 + f * m)) / n;
        let v = Math.sin(r + 1.6 * Math.sin(r * 0.25) + 0.4 * Math.sin(at * 71 * x));
        i[p + d] += Math.tanh(v * 2.2) * Math.min(1, d / (0.004 * n), (h - d) / (0.012 * n));
      }
    };
  return (
    a(0, 0.09, s, 0),
    a(0.12, 0.17, o, -0.05),
    t && a(0.3, 0.2, s * 0.5, 0.5),
    kt(i, 'bp', t ? 1100 : 2100, 0.6, n),
    Se(i, xt(n, e, 0.4, 0.2, { hp: 4e3, att: 0.02 }), 0, 0.03, n),
    i
  );
}

function oz(n, e, t) {
  let i = it(n, 0.6),
    s = i.length,
    o = 0.55,
    r = 0,
    a = 0;
  for (let c = 0; c < s; c++) {
    let u = c / n,
      f = Math.min(1, u / o),
      h = Math.pow(f, 1.4) * (u < o ? 1 : Math.exp(-(u - o) / 0.008));
    if (t) {
      ((r += (170 + 380 * f * f) / n), (a += (680 + 900 * f) / n));
      let p = 2 * (r - Math.floor(r)) - 1;
      i[c] = (p * (0.7 + 0.3 * Math.sin(at * 38 * u)) + 0.35 * Math.sin(at * a)) * h;
    } else
      ((r += (620 + 1900 * f * f * f) / n),
        (a += ((1240 + 3800 * f * f * f) * 1.003) / n),
        (i[c] =
          (Math.sin(at * r) + 0.4 * Math.sin(at * a) + 0.25 * Math.sign(Math.sin(at * r * 0.5))) *
          h *
          (0.8 + 0.2 * Math.sin(at * (20 + 60 * f) * u))));
  }
  (kt(i, 'lp', t ? 2600 : 7e3, 0.7, n), kt(i, 'hp', t ? 120 : 400, 0.7, n));
  let l = t ? 7 : 5;
  for (let c = 0; c < l; c++) {
    let u = o * Math.sqrt(c / l);
    Se(
      i,
      Xt(
        n,
        0.03,
        [
          [t ? 1500 : 3800, 0.004, 1],
          [t ? 2600 : 6100, 0.003, 0.6],
        ],
        e,
      ),
      u,
      0.12 + (0.2 * c) / l,
      n,
    );
  }
  return i;
}

function rz(n, e) {
  let t = it(n, 1.7);
  Se(t, xt(n, e, 0.01, 0.002, { hp: 2500 }), 0, 1, n);
  let i = e0(n, 0.5, e);
  kt(i, 'bp', 3e3, 0.8, n);
  let s = 1;
  for (let l = 0; l < i.length; l++) {
    let c = l / n;
    (l % 220 === 0 && (s = e() < 0.55 + 0.4 * (1 - c / 0.5) ? 1 : 0),
      (i[l] =
        (i[l] * (Math.sin(at * 100 * c) > -0.2 ? 1 : 0.15) +
          0.35 * Math.sign(Math.sin(at * 100 * c)) * (e() - 0.3)) *
        s *
        Math.exp(-c / 0.3)));
  }
  Se(t, i, 0.005, 0.8, n);
  let o = it(n, 1.25),
    r = 0,
    a = 0;
  for (let l = 0; l < o.length; l++) {
    let c = l / n,
      u = Math.pow(0.22, c / 1.2);
    ((r += (at * 100 * u) / n),
      (a += (at * (150 + 1900 * Math.pow(1 - c / 1.25, 2.2))) / n),
      (o[l] =
        ((Math.sin(r) + 0.6 * Math.sin(2 * r) + 0.4 * Math.sin(3 * r) + 0.25 * Math.sin(5 * r)) * 0.5 +
          Math.sin(a) * 0.22) *
        Math.pow(1 - c / 1.25, 1.2) *
        (1 - Math.exp(-c / 0.03))));
  }
  return (Se(t, o, 0.4, 0.8, n), Se(t, Gn(n, 0.12, 140, 60, 0.03, 0.04), 0.4, 0.5, n), fi(t, 1.3));
}

function* az(n, e, t) {
  let i = it(n, 6.5),
    s = e0(n, 6.4, e);
  (yield, y0(s, 'lp', ei(t ? 520 : 380, 70, 0.6), 0.7, n), yield);
  let o = [];
  for (let u = 0; u < 9; u++) o.push([Dt(e, 0.05, 3.6), Dt(e, 0.12, 0.5), Dt(e, 0.4, 1)]);
  let r = 0,
    a = 0,
    l = (u) => {
      let f = 0;
      for (let [h, p, d] of o) {
        let m = (u - h) / p;
        f += d * Math.exp(-m * m);
      }
      return (0.25 + f) * Math.exp(-u / 1.9) * (1 - Math.exp(-u / 0.05));
    };
  for (let u = 0; u < s.length; u++)
    ((u & 31) === 0 && ((r = l(u / n)), (a = (l((u + 32) / n) - r) / 32)), (s[u] *= r), (r += a));
  (Se(i, s, 0, 1, n), yield);
  let c = e0(n, 6, e);
  return (
    kt(c, 'bp', 48, 1.2, n),
    Se(i, Mn(c, n, ms(2, 0.2)), 0.05, 3, n),
    t && Se(i, xt(n, e, 0.3, 0.06, { hp: 300, lp: 2500 }), 0.02, 0.25, n),
    i
  );
}

var X6 = [0, 1, 0.435, 0.268, 0.19, 0.145, 0.116, 0.097];

function lz(n, e) {
  let t = it(n, 5),
    i = t.length;
  for (let s = 0; s < i; s++) {
    let o = s / n,
      r = 0.0025 * Math.sin(at * 4.3 * o),
      a = Math.min(1, o / 0.45) * Math.min(1, (5 - o) / 1.5) * (o < 3.2 ? 1 : Math.exp(-(o - 3.2) / 0.7)),
      l = 0;
    for (let c = 1; c <= 7; c++) l += Math.sin(at * 92.5 * c * o * (1 + r) + c) * X6[c];
    for (let c = 1; c <= 4; c++) l += 0.45 * Math.sin(at * 138.6 * c * o + c * 2) * X6[c];
    t[s] = l * a;
  }
  return (kt(t, 'lp', 520, 0.7, n), t);
}

function cz(n, e, t) {
  let i = it(n, 1.4),
    s = t ? 3 : 4,
    o = 0.02;
  for (let r = 0; r < s; r++) {
    let a = Dt(e, 0.17, 0.26) * (t ? 1.4 : 1),
      l = Math.round(a * n),
      c = Math.round(o * n),
      u = (t ? 1250 : 1550) * (1 - r * 0.04),
      f = 0;
    for (let h = 0; h < l && c + h < i.length; h++) {
      let p = h / l,
        d = u * (1 + 0.55 * Math.sin(Math.PI * Math.pow(p, 0.6)) - 0.25 * p);
      f += (at * d) / n;
      let m = 1 + 0.3 * Math.sin((at * 63 * h) / n);
      i[c + h] +=
        (Math.sin(f) + 0.6 * Math.sin(2 * f + 0.5) + 0.35 * Math.sin(3 * f) + 0.15 * Math.sin(4 * f)) *
        m *
        Math.pow(Math.sin(Math.PI * p), 0.7) *
        (1 - r * 0.14);
    }
    o += a + Dt(e, 0.05, 0.12);
  }
  return (kt(i, 'lp', 4200, 0.7, n), i);
}

function uz(n, e, t) {
  let i = it(n, 1.1),
    s = t ? 1.19 : 1,
    o = 0.01,
    r = t ? 3 : 4;
  for (let a = 0; a < r; a++)
    (Se(
      i,
      Xt(
        n,
        0.5,
        [
          [2310 * s, Dt(e, 0.06, 0.13), 1],
          [3740 * s, 0.07, 0.7],
          [5910 * s, 0.04, 0.5],
          [8130 * s, 0.025, 0.3],
          [1012 * s, 0.03, 0.3],
        ],
        e,
      ),
      o,
      Dt(e, 0.35, 1),
      n,
    ),
      Se(i, xt(n, e, 0.004, 0.001, { hp: 3e3 }), o, 0.3, n),
      (o += Dt(e, 0.09, 0.26)));
  return i;
}

function fz(n, e) {
  let t = it(n, 2.8),
    i = it(n, 2.2);
  return (
    Se(
      i,
      Xt(
        n,
        2.2,
        [
          [47, 0.7, 1],
          [77, 0.55, 0.9],
          [121, 0.4, 0.7],
          [163, 0.3, 0.5],
          [214, 0.22, 0.4],
          [330, 0.12, 0.25],
        ],
        e,
      ),
      0,
      0.5,
      n,
    ),
    Se(i, xt(n, e, 0.5, 0.11, { lp: 420 }), 0, 1, n),
    Se(t, i, 0, 1, n),
    Se(t, i, 0.36, 0.3, n),
    Se(t, i, 0.61, 0.12, n),
    t
  );
}

function hz(n, e) {
  let t = it(n, 0.09);
  return (
    Se(
      t,
      Xt(
        n,
        0.08,
        [
          [1820, 0.009, 1],
          [2730, 0.007, 0.6],
          [640, 0.012, 0.5],
        ],
        e,
      ),
      0,
      1,
      n,
    ),
    Se(t, xt(n, e, 0.004, 0.001, { hp: 2500 }), 0, 0.5, n),
    t
  );
}

function dz(n, e) {
  let t = it(n, 0.06);
  return (
    Se(
      t,
      Xt(
        n,
        0.05,
        [
          [3200, 0.008, 1],
          [4800, 0.005, 0.3],
        ],
        e,
      ),
      0,
      1,
      n,
    ),
    t
  );
}

function* pz(n, e) {
  let i = function* (s) {
    let o = gu(n, 6, s, (u) => {
      (kt(u, 'hp', 900, 0.6, n), kt(u, 'lp', 8500, 0.6, n));
    });
    yield;
    let r = gu(n, 6, s, (u) => {
        kt(u, 'bp', 420, 0.5, n);
      }),
      a = o.length,
      l = qv(a, [o, 0.5], [r, 0.75]),
      c = new Float32Array(a);
    for (let u = 0; u < 1020; u++) {
      let f = Math.floor(s() * a),
        h = Math.round(Dt(s, 6e-4, 0.003) * n),
        p = Math.pow(s(), 3) * 1.6 + 0.15;
      for (let d = 0; d < h; d++) ((c[f] += (s() * 2 - 1) * p * Math.exp((-5 * d) / h)), ++f >= a && (f = 0));
    }
    (yield, y0(c, 'hp', () => 2200, 0.7, n, 2), yield);
    for (let u = 0; u < 30; u++) {
      let f = Dt(s, 700, 2100);
      Ni(c, Va(n, Dt(s, 0.008, 0.02), f, f * 1.7), s() * 6, Dt(s, 0.08, 0.3), n);
    }
    for (let u = 0; u < a; u++) l[u] += c[u] * 0.55;
    return l;
  };
  return [yield* i(as(Math.floor(e() * 1e9))), yield* i(as(Math.floor(e() * 1e9)))];
}

function* mz(n, e) {
  let i = function* (s) {
    let o = gu(n, 6, s, (c) => {
        (kt(c, 'lp', 1300, 0.6, n), kt(c, 'hp', 110, 0.7, n));
      }),
      r = o.length,
      a = new Float32Array(r);
    for (let c = 0; c < 1560; c++) a[Math.floor(s() * r)] += (s() * 2 - 1) * (0.2 + Math.pow(s(), 4) * 3);
    let l = qv(r, [o, 0.8]);
    for (let [c, u, f] of [
      [1820, 14, 1],
      [2740, 16, 0.8],
      [4150, 18, 0.6],
      [6200, 14, 0.35],
      [940, 8, 0.7],
    ]) {
      let h = Float32Array.from(a);
      y0(h, 'bp', () => c, u, n, 2);
      for (let p = 0; p < r; p++) l[p] += h[p] * f * 5;
      yield;
    }
    for (let c = 0; c < 4; c++) {
      let u = Dt(s, 900, 1600);
      Ni(l, Va(n, 0.014, u, u * 1.8), s() * 6, 0.25, n);
    }
    return l;
  };
  return [yield* i(as(Math.floor(e() * 1e9))), yield* i(as(Math.floor(e() * 1e9)))];
}

function gz(n, e) {
  let s = e0(n, 8.5, e),
    o = Float32Array.from(s);
  (y0(
    s,
    'bp',
    (r) => {
      let a = r * 8.5;
      return 380 + 190 * Math.sin((at * a) / 8) + 90 * Math.sin((at * a) / 2.667 + 1);
    },
    1.3,
    n,
  ),
    y0(
      o,
      'bp',
      (r) => {
        let a = r * 8.5;
        return 1350 + 260 * Math.sin((at * a) / 4 + 2);
      },
      9,
      n,
    ));
  for (let r = 0; r < s.length; r++) {
    let a = r / n;
    s[r] =
      s[r] * (0.7 + 0.3 * Math.sin((at * a) / 8 + 0.5)) +
      o[r] * 0.22 * Math.pow(0.5 + 0.5 * Math.sin((at * a) / 4 + 1), 2);
  }
  return t5(s, n * 8, !0);
}

function* xz(n, e) {
  let s = e0(n, 8.5, e),
    o = e0(n, 8 + 0.5, e),
    r = e0(n, 8 + 0.5, e);
  (yield,
    kt(s, 'lp', 1100, 0.6, n),
    kt(s, 'hp', 70, 0.7, n),
    kt(o, 'hp', 2400, 0.7, n),
    kt(r, 'bp', 520, 1.2, n),
    yield);
  for (let a = 0; a < s.length; a++) {
    let l = a / n,
      c = (l % 4) / 4,
      u = Math.pow(0.5 - 0.5 * Math.cos(at * c), 1.5),
      f = Math.exp(-Math.pow((c - 0.5) / 0.05, 2)),
      h = Math.exp(-Math.pow((c - 0.68) / 0.16, 2)),
      p = 0.5 - 0.5 * Math.cos((at * ((l + 1.3) % 2.667)) / 2.667);
    s[a] = s[a] * (0.3 + 0.7 * u + 0.25 * p) + r[a] * f * 1.8 + o[a] * h * 0.35;
  }
  return t5(s, n * 8, !0);
}

function vz(n, e) {
  let t = (i, s) => {
    let o = it(n, 1.4),
      r = [
        [0.062, 0.55],
        [0.089, 0.42],
        [0.118, 0.36],
        [0.151, 0.26],
        [0.178, 0.2],
        [0.243, 0.1],
      ];
    for (let [l, c] of r)
      Se(
        o,
        xt(n, i, 0.01, 0.0018, { hp: 700, lp: 5500 }),
        l * (s ? 1.07 : 0.96) + Dt(i, 0, 0.006),
        c * Dt(i, 0.6, 1.15),
        n,
      );
    let a = e0(n, 1.3, i);
    return (
      kt(a, 'hp', 300, 0.7, n),
      y0(a, 'lp', ei(6e3, 900, 0.6), 0.7, n),
      Se(o, Mn(a, n, ms(0.27, 0.04)), 0.04, 0.045, n),
      o
    );
  };
  return [t(as(Math.floor(e() * 1e9)), 0), t(as(Math.floor(e() * 1e9)), 1)];
}

function yz(n, e) {
  let t = (i, s) => {
    let o = it(n, 2.2),
      r = e0(n, 2.18, i);
    (y0(r, 'lp', ei(5200, 650, 0.5), 0.7, n), Se(o, Mn(r, n, ms(0.33, 0.006)), 0.012, 0.3, n));
    let a = e0(n, 2.1, i);
    (kt(a, 'lp', 260, 0.7, n), Se(o, Mn(a, n, ms(0.4, 0.01)), 0.012, 0.5, n));
    for (let [l, c] of [
      [0.018, 0.7],
      [0.031, 0.55],
      [0.047, 0.45],
      [0.093, 0.3],
      [0.139, 0.2],
    ])
      Se(o, xt(n, i, 0.008, 0.0015, { lp: 4500 }), l * (s ? 1.09 : 0.95), c, n);
    return o;
  };
  return [t(as(Math.floor(e() * 1e9)), 0), t(as(Math.floor(e() * 1e9)), 1)];
}

var hn = 44100,
  _n = 32e3,
  wu = 22050,
  Ir = {
    rifle_shot: { gen: a6, n: 5, sr: hn, peak: 0.97, bus: 'gun', max: 9, pri: 9, boot: 1 },
    pistol_shot: { gen: l6, n: 4, sr: hn, peak: 0.97, bus: 'gun', max: 6, pri: 9 },
    rifle_tail_out: { gen: h6, n: 2, sr: _n, peak: 0.8, fixed: 1, bus: 'tail', max: 4, pri: 8, soft: 1 },
    rifle_tail_in: { gen: d6, n: 2, sr: _n, peak: 0.75, fixed: 1, bus: 'tail', max: 4, pri: 8, soft: 1 },
    pistol_tail_out: { gen: p6, n: 1, sr: _n, peak: 0.62, fixed: 1, bus: 'tail', max: 3, pri: 8, soft: 1 },
    pistol_tail_in: { gen: m6, n: 1, sr: _n, peak: 0.6, fixed: 1, bus: 'tail', max: 3, pri: 8, soft: 1 },
    rifle_dry: { gen: g6, n: 1, sr: hn, peak: 0.5, bus: 'gun', max: 2, pri: 6, boot: 1 },
    pistol_dry: { gen: x6, n: 1, sr: hn, peak: 0.42, bus: 'gun', max: 2, pri: 6 },
    reload_magout: { gen: v6, n: 1, sr: hn, peak: 0.45, bus: 'gun', max: 2, pri: 6 },
    reload_maginsert: { gen: y6, n: 1, sr: hn, peak: 0.36, bus: 'gun', max: 2, pri: 6 },
    reload_magin: { gen: b6, n: 1, sr: hn, peak: 0.64, bus: 'gun', max: 2, pri: 7 },
    reload_boltback: { gen: M6, n: 2, sr: hn, peak: 0.48, bus: 'gun', max: 2, pri: 6 },
    reload_bolt: { gen: _6, n: 1, sr: hn, peak: 0.72, bus: 'gun', max: 2, pri: 7 },
    pistol_magout: { gen: w6, n: 1, sr: hn, peak: 0.38, bus: 'gun', max: 2, pri: 6 },
    pistol_maginsert: { gen: E6, n: 1, sr: hn, peak: 0.3, bus: 'gun', max: 2, pri: 6 },
    pistol_magin: { gen: S6, n: 1, sr: hn, peak: 0.52, bus: 'gun', max: 2, pri: 7 },
    pistol_slide: { gen: T6, n: 1, sr: hn, peak: 0.6, bus: 'gun', max: 2, pri: 7 },
    weapon_holster: { gen: A6, n: 1, sr: _n, peak: 0.32, bus: 'gun', max: 2, pri: 5 },
    weapon_draw: { gen: R6, n: 1, sr: _n, peak: 0.32, bus: 'gun', max: 2, pri: 5 },
    gear_rustle: { gen: C6, n: 2, sr: _n, peak: 0.18, bus: 'gun', max: 2, pri: 3 },
    shell_bounce: { gen: k6, n: 4, sr: hn, peak: 0.3, bus: 'world', max: 4, pri: 1, ref: 2, roll: 1 },
    shell_bounce_metal: { gen: P6, n: 3, sr: hn, peak: 0.32, bus: 'world', max: 4, pri: 1, ref: 2, roll: 1 },
    step_concrete: { gen: UI, n: 4, sr: _n, peak: 0.45, bus: 'near', max: 3, pri: 3, boot: 1 },
    step_water: { gen: BI, n: 3, sr: _n, peak: 0.5, bus: 'near', max: 3, pri: 3, boot: 1 },
    step_metal: { gen: HI, n: 3, sr: _n, peak: 0.5, bus: 'near', max: 3, pri: 3, boot: 1 },
    land: { gen: OI, n: 1, sr: _n, peak: 0.7, bus: 'near', max: 2, pri: 4 },
    jump: { gen: VI, n: 1, sr: _n, peak: 0.35, bus: 'near', max: 2, pri: 3 },
    hurt: { gen: WI, n: 1, sr: _n, peak: 0.85, bus: 'dry', max: 2, pri: 8 },
    ear_ring: { gen: GI, n: 1, sr: wu, peak: 0.2, bus: 'dry', max: 1, pri: 5 },
    impact_metal: { gen: qI, n: 3, sr: hn, peak: 0.7, bus: 'world', max: 4, pri: 4, ref: 4, roll: 0.7 },
    impact_concrete: { gen: XI, n: 3, sr: hn, peak: 0.7, bus: 'world', max: 4, pri: 4, ref: 4, roll: 0.7 },
    impact_wood: { gen: YI, n: 2, sr: hn, peak: 0.7, bus: 'world', max: 3, pri: 4, ref: 4, roll: 0.7 },
    impact_water: { gen: $I, n: 2, sr: _n, peak: 0.6, bus: 'world', max: 3, pri: 4, ref: 4, roll: 0.7 },
    impact_enemy: { gen: ZI, n: 3, sr: hn, peak: 0.75, bus: 'world', max: 4, pri: 5, ref: 5, roll: 0.6 },
    impact_glass: { gen: jI, n: 1, sr: hn, peak: 0.6, bus: 'world', max: 2, pri: 4, ref: 4, roll: 0.7 },
    whiz: { gen: F6, n: 3, sr: hn, peak: 0.5, bus: 'world', max: 3, pri: 5, ref: 2.5, roll: 0.6 },
    ricochet: { gen: KI, n: 3, sr: hn, peak: 0.4, bus: 'world', max: 2, pri: 3, ref: 5, roll: 0.6 },
    gull_fire: { gen: D6, n: 3, sr: hn, peak: 0.7, bus: 'world', max: 5, pri: 7, ref: 7, roll: 0.55 },
    hound_fire: { gen: L6, n: 3, sr: hn, peak: 0.6, bus: 'world', max: 5, pri: 7, ref: 8, roll: 0.5 },
    hound_step: { gen: tz, n: 3, sr: _n, peak: 0.7, bus: 'world', max: 4, pri: 3, ref: 5, roll: 0.8 },
    gull_die: { gen: nz, n: 1, sr: _n, peak: 0.85, bus: 'world', max: 3, pri: 7, ref: 7, roll: 0.5 },
    hound_die: { gen: iz, n: 1, sr: _n, peak: 0.9, bus: 'world', max: 3, pri: 7, ref: 7, roll: 0.5 },
    telegraph: { gen: oz, n: 2, sr: _n, peak: 0.42, bus: 'world', max: 4, pri: 6, ref: 6, roll: 0.6 },
    alert: { gen: sz, n: 2, sr: _n, peak: 0.5, bus: 'world', max: 3, pri: 6, ref: 8, roll: 0.5 },
    explosion: { gen: I6, n: 2, sr: hn, peak: 0.95, bus: 'world', max: 3, pri: 10, ref: 12, roll: 0.5 },
    explosion_big: { gen: z6, n: 2, sr: _n, peak: 0.97, bus: 'world', max: 2, pri: 11, ref: 16, roll: 0.45 },
    relay_cut: { gen: rz, n: 1, sr: _n, peak: 0.75, bus: 'world', max: 2, pri: 8, ref: 6, roll: 0.5 },
    thunder: { gen: az, n: 2, sr: wu, peak: 0.8, bus: 'dry', max: 2, pri: 6 },
    foghorn: { gen: lz, n: 1, sr: wu, peak: 0.5, bus: 'world', max: 1, pri: 2 },
    gull_cry: { gen: cz, n: 2, sr: wu, peak: 0.4, bus: 'world', max: 2, pri: 1 },
    halyard: { gen: uz, n: 2, sr: _n, peak: 0.3, bus: 'world', max: 2, pri: 1 },
    container_bang: { gen: fz, n: 1, sr: wu, peak: 0.6, bus: 'world', max: 1, pri: 2 },
    ui_click: { gen: hz, n: 1, sr: hn, peak: 0.3, bus: 'dry', max: 2, pri: 9 },
    ui_hover: { gen: dz, n: 1, sr: hn, peak: 0.12, bus: 'dry', max: 2, pri: 9 },
    gull_rotor: { gen: JI, n: 1, sr: _n, peak: 0.6, loop: 1, ref: 5, roll: 0.9 },
    hound_servo: { gen: QI, n: 1, sr: _n, peak: 0.42, loop: 1, ref: 4, roll: 1 },
    relay_hum: { gen: ez, n: 1, sr: _n, peak: 0.4, loop: 1, ref: 2.5, roll: 1.4 },
    rain: { gen: pz, n: 1, sr: _n, peak: 0.5, loop: 1 },
    rain_interior: { gen: mz, n: 1, sr: _n, peak: 0.7, loop: 1 },
    wind: { gen: gz, n: 1, sr: wu, peak: 0.5, loop: 1 },
    sea: { gen: xz, n: 1, sr: wu, peak: 0.5, loop: 1, ref: 10, roll: 0.6 },
    ...q6,
    ir_outdoor: { gen: vz, n: 1, sr: hn, peak: 0.9, ir: 1 },
    ir_shed: { gen: yz, n: 1, sr: hn, peak: 0.9, ir: 1 },
  },
  $6 = {
    step: 'step_concrete',
    impact: 'impact_concrete',
    hurt: 'hurt',
    objective_done: 'objective',
    objective_all: 'objective',
    extraction: 'complete',
    enemy_alert: 'alert',
  },
  Z6 = (n) => n && typeof n.next == 'function';

function j6(n, e, t) {
  let i = Array.isArray(e) ? e : [e];
  if (!n.loop) for (let r of i) n6(r, t, n.ir ? 0 : 3e-4, n.ir ? 0.05 : 0.012);
  let s = 0;
  for (let r of i) s = Math.max(s, Pr(r));
  let o = n.fixed ? Math.min(1, n.peak / (s || 1)) : s > 0 ? n.peak / s : 1;
  for (let r of i) ls(r, o);
  return { sr: t, ch: i, loop: !!n.loop };
}

function K6(n, e = 0, t) {
  let i = Ir[n];
  if (!i) return null;
  let s = t || i.sr,
    o = e % i.n,
    r = i.gen(s, as(Gv(n) + o * 7919), o);
  if (Z6(r)) {
    let a;
    do a = r.next();
    while (!a.done);
    r = a.value;
  }
  return j6(i, r, s);
}

function J6(n, e = 0, t) {
  let i = Ir[n];
  if (!i) return null;
  let s = t || i.sr,
    o = e % i.n,
    r = i.gen(s, as(Gv(n) + o * 7919), o),
    a = null;
  return {
    step() {
      if (a) return a;
      if (Z6(r)) {
        let l = r.next();
        if (!l.done) return null;
        r = l.value;
      }
      return (a = j6(i, r, s));
    },
  };
}

var ji = {
  comp: { threshold: -3, knee: 6, ratio: 2, attack: 0.01, release: 0.12 },
  preGain: 1,
  master: 0.9,
  musicBus: 0.73,
  weapon: {
    rifle: {
      shot: 'rifle_shot',
      n: 5,
      gain: 1.12,
      tailOut: 'rifle_tail_out',
      tailIn: 'rifle_tail_in',
      tail: 1.12,
      duck: 0.45,
      shellPitch: 1,
    },
    pistol: {
      shot: 'pistol_shot',
      n: 4,
      gain: 1.12,
      tailOut: 'pistol_tail_out',
      tailIn: 'pistol_tail_in',
      tail: 1.12,
      duck: 0.5,
      shellPitch: 1.22,
    },
  },
  duck: { attack: 0.012, hold: 0.085, release: 0.1 },
  tailBoostAfter: 0.105,
  music: {
    trim: 0.92,
    layers: {
      music_drone: 1,
      music_strings: 1,
      music_pulse: 1,
      music_ticks: 1,
      music_drums: 1,
      music_brass: 1,
      music_lift: 1,
    },
    cell: 0.8,
    horn: 0.7,
    fill: 0.55,
    hit: 0.42,
    riser: 0.9,
    impact: 0.75,
    relay: 0.9,
    death: 0.9,
    complete: 0.9,
    xfade: 0.5,
    relayDuck: 0.4,
    preImpactDip: 0.45,
    riserMin: 1.25,
    riserMinAfterRelay: 2.6,
    riserCooldown: 25,
    cadenceLen: 11.5,
  },
};

function Q6(n) {
  return n >= 0.45 ? 1 : 0.4 + (0.6 * Math.max(0, n)) / 0.45;
}

function bz(n) {
  let e = Math.abs(n);
  return Math.sign(n) * (e <= 0.6 ? e : 0.6 + 0.4 * Math.tanh((e - 0.6) / 0.4));
}

var eE = 4;

function tE(n = 4097) {
  let e = new Float32Array(n);
  for (let t = 0; t < n; t++) e[t] = bz(((t / (n - 1)) * 2 - 1) * eE);
  return e;
}

function Mz(n) {
  let e = (d) => Math.pow(10, d / 20),
    t = (d) => (d > 0 ? 20 * Math.log10(d) : -1e3),
    i = e(n.threshold),
    s = n.threshold + n.knee,
    o = e(s),
    r = 1 / n.ratio,
    a = (d, m) => (d < i ? d : i + (1 - Math.exp(-m * (d - i))) / m),
    l = (d, m) => {
      if (d < i) return 1;
      let x = d * 1.001;
      return (t(a(x, m)) - t(a(d, m))) / (t(x) - t(d));
    },
    c = 0.1,
    u = 1e4,
    f = 5;
  if (n.knee > 0) for (let d = 0; d < 15; d++) (l(o, f) < r ? (u = f) : (c = f), (f = Math.sqrt(c * u)));
  let h = t(a(o, f)),
    p = (d) => (d < o ? a(d, f) : e(h + r * (t(d) - s)));
  return { saturate: p, makeup: Math.pow(1 / p(1), 0.6) };
}

function nE() {
  return ji.preGain / (Mz(ji.comp).makeup * eE);
}

var _z = (n, e, t) => Math.min(t, Math.max(e, n)),
  iE = (n, e, t) => {
    let i = _z((t - n) / (e - n), 0, 1);
    return i * i * (3 - 2 * i);
  },
  Jv = Ci.bar,
  sE = Ci.beat;

var wz = {};

function oE(n, e, t = wz, i = {}) {
  let s = ji.music.layers;
  for (let o of $l) i[o] = 0;
  if (n === 'title' || n === 'intro') i.music_drone = 0.95;
  else if (n === 'dead') i.music_drone = 0.4;
  else if (n === 'complete') i.music_drone = t.after == null || t.after > ji.music.cadenceLen ? 0.7 : 0;
  else {
    let o = iE(0.3, 0.6, e),
      r = iE(0.7, 0.95, e) * (t.gate == null ? 1 : t.gate),
      a = t.final ? r : 0;
    ((i.music_drone = 1 - 0.15 * o - 0.15 * r - 0.2 * a),
      (i.music_strings = o * (0.85 + 0.15 * r)),
      (i.music_pulse = o * (0.8 + 0.2 * r) * (1 - 0.2 * a)),
      (i.music_ticks = o * (0.7 + 0.3 * r)),
      (i.music_drums = r),
      (i.music_brass = r * (1 - 0.15 * a)),
      (i.music_lift = a));
  }
  for (let o of $l) i[o] *= s[o] * ji.music.trim;
  return i;
}

function rE(n) {
  let { ctx: e, out: t, bufs: i, whenReady: s, running: o } = n,
    r = n.rnd || Math.random,
    a = ji.music,
    l = {
      on: !1,
      t0: 0,
      layers: {},
      nextBar: 0,
      live: 'title',
      tier: 0,
      final: !1,
      gate: 1,
      gateT: -1,
      wave: null,
      lastImpact: -99,
      armed: !1,
      plan: 'rest',
      cycle: 0,
      quiet: 0,
      lastFill: -1,
      duckUntil: -1,
      muteUntil: -1,
      completeT: -1,
      lastSting: -99,
      lastRelay: -99,
      voices: [],
      bars: 0,
    },
    c = (R, z = 0) => i.get(R + '#' + z),
    u = () => {};
  function f(R, z) {
    let I = c(R);
    if (!I) return;
    let L = e.createGain();
    ((L.gain.value = 0), L.connect(t));
    let U = e.createBufferSource();
    ((U.buffer = I), (U.loop = !0), U.connect(L));
    let k = z + 0.06,
      C = 0;
    (l.on
      ? (C = (((k - l.t0) % I.duration) + I.duration) % I.duration)
      : ((l.on = !0), (l.t0 = k), (l.nextBar = 0)),
      U.start(k, C),
      (l.layers[R] = { g: L, s: U, t: 0, hold: -1 }));
  }
  function h(R, z, I, L) {
    if (!(I < R.hold) && !(Math.abs(z - R.t) < 0.004 && !(z === 0 && R.t !== 0))) {
      R.t = z;
      try {
        R.g.gain.setTargetAtTime(z, I, L);
      } catch {
        R.g.gain.value = z;
      }
    }
  }
  let p = { gate: 1, final: !1, after: null },
    d = {},
    m = (R, z) => (
      (p.gate = l.gate),
      (p.final = l.final),
      (p.after = l.completeT >= 0 ? z - l.completeT : null),
      oE(l.live, R, p, d)
    );
  function x(R, z, I, L, U = {}) {
    let k = c(R, z);
    if (!k) return (s(R, z, u), null);
    if (!o()) return null;
    let C = e.currentTime;
    ((I = Math.max(I, C)), (L *= a.trim));
    let A = e.createGain(),
      F = e.createBufferSource();
    if (((F.buffer = k), F.connect(A), A.connect(t), U.fadeIn))
      try {
        (A.gain.setValueAtTime(0, I), A.gain.linearRampToValueAtTime(L, I + U.fadeIn));
      } catch {
        A.gain.value = L;
      }
    else A.gain.value = L;
    let H = { s: F, g: A, name: R, kind: U.kind || 'phrase', end: I + k.duration - (U.offset || 0), gain: L };
    return (
      (F.onended = () => {
        try {
          (F.disconnect(), A.disconnect());
        } catch {}
      }),
      F.start(I, U.offset || 0),
      l.voices.push(H),
      H
    );
  }
  function v(R, z) {
    let I = e.currentTime;
    for (let L of l.voices)
      if (!(L.end <= I || (R && !R(L)))) {
        try {
          (L.g.gain.cancelScheduledValues(I), L.g.gain.setTargetAtTime(0, I, z / 3), L.s.stop(I + z));
        } catch {}
        L.end = I + z;
      }
  }
  function y(R, z, I, L) {
    if (c(R)) return x(R, 0, z, I, { kind: L });
    let U = e.currentTime;
    return (
      s(R, 0, () => {
        e.currentTime - U < 1.5 && x(R, 0, e.currentTime + 0.03, I, { kind: L });
      }),
      null
    );
  }
  let b = (R, z, I) => (l.on ? l.t0 + Math.ceil((R + z - l.t0) / I - 1e-9) * I : R + z);
  function g(R, z, I) {
    if (!l.on || !c('mus_impact') || (!I && R - l.lastImpact < a.riserCooldown)) {
      l.gate = 1;
      return;
    }
    let L = R - l.lastRelay < 1.5 ? a.riserMinAfterRelay : a.riserMin,
      U = b(R, L, Jv);
    ((l.gate = 0), (l.gateT = U), (l.lastImpact = U), (l.muteUntil = Math.max(l.muteUntil, U + 0.2)));
    let k = { Ti: U, voices: [] };
    if (c('mus_riser')) {
      let F = Math.max(R + 0.02, U - Ci.riserPeak);
      k.voices.push(
        x('mus_riser', 0, F, a.riser, { offset: Ci.riserPeak - (U - F), fadeIn: 0.1, kind: 'wave' }),
      );
    }
    k.voices.push(x('mus_impact', 0, U, a.impact, { kind: 'wave' }));
    let C = oE('playing', 1, { gate: 1, final: l.final }),
      A = R < l.duckUntil ? a.relayDuck : 1;
    for (let F of $l) {
      let H = l.layers[F];
      if (H) {
        try {
          (H.g.gain.cancelScheduledValues(R),
            A < 1 && H.t > 0.01 && H.g.gain.setTargetAtTime(Math.max(0, H.t) * A, R, 0.2),
            H.t > 0.01 && H.g.gain.setTargetAtTime(H.t * Math.min(A, a.preImpactDip), U - 0.5, 0.12),
            H.g.gain.setTargetAtTime(C[F], U - 0.03, 0.008));
        } catch {}
        ((H.t = C[F]), (H.hold = U + 0.25));
      }
    }
    ((l.wave = k), (l.armed = !0));
  }
  function E(R) {
    if (l.wave) {
      for (let z of l.wave.voices)
        if (z) {
          try {
            (z.g.gain.cancelScheduledValues(R), z.g.gain.setTargetAtTime(0, R, 0.08), z.s.stop(R + 0.3));
          } catch {}
          z.end = R + 0.3;
        }
      for (let z of $l) {
        let I = l.layers[z];
        if (I) {
          try {
            I.g.gain.cancelScheduledValues(R);
          } catch {}
          ((I.hold = -1), (I.t = -1));
        }
      }
      ((l.wave = null), (l.gate = 1), (l.lastImpact = -99), (l.armed = !1));
    }
  }
  function M() {
    ((l.final = !1),
      (l.gate = 1),
      (l.gateT = -1),
      (l.wave = null),
      (l.armed = !1),
      (l.completeT = -1),
      (l.duckUntil = -1),
      (l.muteUntil = -1),
      (l.lastImpact = -99),
      (l.plan = 'rest'),
      (l.quiet = 0));
  }
  let _ = {
      get on() {
        return l.on;
      },
      state(R, z) {
        if (R === 'paused') return;
        let I = l.live;
        if (((l.live = R), z === 'paused' && I === R)) return;
        let L = e.currentTime;
        (R === 'playing' || R === 'intro' || R === 'title') &&
          ((R === 'playing' && I === 'intro') || (E(L), M(), v((U) => U.kind !== 'phrase', 0.5)));
      },
      relay() {
        if (!o()) return;
        let R = e.currentTime;
        if (R - l.lastRelay < 1) return;
        let z = b(R, 0.15, sE);
        ((l.lastRelay = R),
          v((I) => I.kind === 'phrase', 0.4),
          y('objective', z, a.relay, 'sting'),
          (l.duckUntil = z + 3.4),
          (l.muteUntil = Math.max(l.muteUntil, z + 4.2)));
      },
      finalRun() {
        if (l.final || ((l.final = !0), !o() || !l.on)) return;
        let R = e.currentTime;
        (l.wave && E(R), g(R, 1, !0));
      },
      death() {
        if (!o()) return;
        let R = e.currentTime;
        R - l.lastSting < 1 ||
          ((l.lastSting = R), E(R), v(null, 0.25), y('death', R + 0.02, a.death, 'sting'));
      },
      complete() {
        if (!o()) return;
        let R = e.currentTime;
        if (R - l.lastSting < 6) return;
        ((l.lastSting = R), E(R), v(null, 0.35));
        let z = b(R, 0.15, sE);
        ((l.completeT = z), y('complete', z, a.complete, 'sting'));
      },
      snap() {
        ((l.gate = 1), (l.lastImpact = e.currentTime), (l.armed = !0));
      },
      update(R, z, I) {
        if (!o()) return;
        let L = e.currentTime;
        if (!l.on)
          if (c('music_drone')) f('music_drone', L);
          else return;
        for (let H of $l) !l.layers[H] && c(H) && f(H, L);
        let U = l.live === 'playing',
          k = U
            ? I >= 0.8 || (l.tier === 2 && I >= 0.68)
              ? 2
              : I >= 0.4 || (l.tier >= 1 && I >= 0.32)
                ? 1
                : 0
            : 0;
        (k === 2 && l.tier < 2 && !l.wave && l.gate === 1
          ? g(L, z, !1)
          : k < 2 && l.wave && L < l.wave.Ti - 0.6 && !l.final && E(L),
          (l.tier = k),
          l.wave && L >= l.wave.Ti && ((l.gate = 1), (l.wave = null)));
        let C = m(z, L),
          A = L < l.duckUntil ? a.relayDuck : 1,
          F =
            l.live === 'dead' ||
            (l.live === 'complete' && l.completeT >= 0 && L - l.completeT < a.cadenceLen);
        for (let H of $l) {
          let N = l.layers[H];
          N && h(N, C[H] * A, L, F ? 0.22 : A < 1 ? 0.2 : a.xfade);
        }
        for (; l.t0 + l.nextBar * Jv - L < 0.4;) {
          let H = l.t0 + l.nextBar * Jv;
          (H > L + 0.03 && S(l.nextBar, H, k, L), l.nextBar++);
        }
        (l.voices.length > 24 || (l.voices.length && l.voices[0].end < L)) &&
          (l.voices = l.voices.filter((H) => H.end > L));
      },
      debug() {
        let R = {};
        for (let z of $l) R[z] = l.layers[z] ? +l.layers[z].t.toFixed(3) : null;
        return {
          on: l.on,
          t0: l.t0,
          bar: l.nextBar,
          live: l.live,
          tier: l.tier,
          final: l.final,
          gate: l.gate,
          plan: l.plan,
          voices: l.voices.length,
          layers: R,
        };
      },
    },
    T = (R, z, I) => x('mus_cell', R, z, I),
    w = (R, z, I) => x('mus_horn', R, z, I);
  function S(R, z, I, L) {
    let U = R % 8,
      k = l.live;
    if (k === 'dead') return;
    if (z < l.muteUntil) {
      U === 0 && (l.plan = 'rest');
      return;
    }
    if (k === 'complete') {
      if (l.completeT >= 0 && z - l.completeT < a.cadenceLen + 2) return;
      U === 0 && r() < 0.6 && T(0, z, a.cell * 0.8);
      return;
    }
    if (U === 0) {
      let N = r();
      (l.cycle++,
        k === 'title' || k === 'intro'
          ? (l.plan = c('mus_cell', 3) && l.plan !== 'full' ? 'full' : 'rest')
          : I === 0
            ? (l.plan =
                l.quiet >= 1
                  ? N < 0.5
                    ? 'call'
                    : N < 0.8
                      ? 'full call'
                      : 'answer'
                  : N < 0.3
                    ? 'call'
                    : N < 0.48
                      ? 'full call'
                      : N < 0.62
                        ? 'tail'
                        : N < 0.72
                          ? 'answer'
                          : 'rest')
            : I === 1
              ? (l.plan = N < 0.4 ? 'call' : N < 0.55 ? 'tail' : 'rest')
              : l.armed || l.final
                ? ((l.plan = l.armed || l.cycle % 2 ? 'full' : 'call'), (l.armed = !1))
                : (l.plan = ['rest', 'full call', 'rest', 'full'][l.cycle % 4]),
        (l.quiet = l.plan === 'rest' ? l.quiet + 1 : 0));
    }
    let C = l.plan,
      A = U >> 1,
      H =
        (U & 1) === 0 &&
        (C === 'full' ||
          (C === 'call' && A === 0) ||
          (C === 'full call' && A < 2) ||
          (C === 'tail' && A === 3) ||
          (C === 'answer' && A >= 2));
    if (I === 2 && l.gate === 1) {
      H && w(A, z, a.horn);
      let N = l.final ? [0.6, 1] : [0.3, 0.8];
      if ((U === 3 && r() < N[0]) || (U === 7 && r() < N[1])) {
        let Z = Math.floor(r() * 3);
        (Z === l.lastFill && (Z = (Z + 1) % 3),
          (l.lastFill = Z),
          x('mus_fill', Z, z, a.fill, { kind: 'fill' }));
      }
      return;
    }
    I !== 2 &&
      (H && T(A, z, k === 'title' || k === 'intro' ? a.cell : I === 1 ? a.cell * 0.85 : a.cell),
      H ||
        (k === 'title' || k === 'intro'
          ? U === 5 && r() < 0.5 && x('mus_hit', 0, z, a.hit * 0.8, { kind: 'hit' })
          : I === 0
            ? (U === 4 || U === 1) &&
              r() < (U === 4 ? 0.5 : 0.2) &&
              x('mus_hit', r() < 0.5 ? 0 : 1, z, a.hit * (0.7 + 0.3 * r()), { kind: 'hit' })
            : I === 1 &&
              (U === 0 || (U === 4 && r() < 0.4)) &&
              x('mus_hit', U === 0 ? 0 : 1, z, a.hit * 0.85, { kind: 'hit' })));
  }
  return _;
}

var ti = (n, e, t) => Math.min(t, Math.max(e, n));

var aE = {
    metal: 'impact_metal',
    concrete: 'impact_concrete',
    wood: 'impact_wood',
    water: 'impact_water',
    glass: 'impact_glass',
    dirt: 'impact_concrete',
    rubber: 'impact_wood',
  },
  Qv = {
    metal: 'step_metal',
    water: 'step_water',
    concrete: 'step_concrete',
    wood: 'step_concrete',
    dirt: 'step_concrete',
    glass: 'step_concrete',
    rubber: 'step_concrete',
  },
  lE = new Set([
    'thunder',
    'foghorn',
    'objective',
    'complete',
    'death',
    'mus_cell',
    'mus_horn',
    'mus_fill',
    'mus_hit',
    'mus_riser',
    'mus_impact',
    'explosion',
    'explosion_big',
    'rifle_tail_out',
    'rifle_tail_in',
    'pistol_tail_out',
    'pistol_tail_in',
    'gull_die',
    'hound_die',
    'relay_cut',
    'container_bang',
    'ear_ring',
  ]),
  Ez = [
    'rifle_tail_out',
    'rifle_tail_in',
    'ir_outdoor',
    'ir_shed',
    'pistol_shot',
    'pistol_tail_out',
    'pistol_tail_in',
    'reload_magout',
    'reload_maginsert',
    'reload_magin',
    'reload_boltback',
    'reload_bolt',
    'pistol_dry',
    'pistol_magout',
    'pistol_maginsert',
    'pistol_magin',
    'pistol_slide',
    'weapon_holster',
    'weapon_draw',
    'gear_rustle',
    'shell_bounce',
    'shell_bounce_metal',
    'rain',
    'whiz',
    'impact_concrete',
    'impact_metal',
    'land',
    'jump',
    'hurt',
    'explosion',
    'explosion_big',
    'music_drone',
    'mus_cell',
    'wind',
    'impact_enemy',
    'impact_wood',
    'impact_water',
    'impact_glass',
    'ricochet',
    'gull_rotor',
    'hound_servo',
    'alert',
    'telegraph',
    'gull_fire',
    'hound_fire',
    'hound_step',
    'ui_click',
    'ui_hover',
    'sea',
    'rain_interior',
    'relay_hum',
    'gull_die',
    'hound_die',
    'ear_ring',
    'death',
    'mus_hit',
    'music_strings',
    'music_pulse',
    'music_ticks',
    'relay_cut',
    'objective',
    'mus_riser',
    'mus_impact',
    'music_drums',
    'music_brass',
    'mus_fill',
    'mus_horn',
    'thunder',
    'music_lift',
    'complete',
    'gull_cry',
    'halyard',
    'foghorn',
    'container_bang',
  ];

function Sz() {
  let n = () => {},
    e = { setPos: n, setGain: n, setPitch: n, stop: n };
  return {
    silent: !0,
    update: n,
    resume: n,
    play: n,
    loop: () => e,
    setIntensity: n,
    setInterior: n,
    setVolume: n,
    setPaused: n,
    debug: () => ({ state: 'none' }),
    names: Object.keys(Ir),
    ready: Promise.resolve(),
  };
}

async function cE(n) {
  let e = typeof window < 'u' && (window.AudioContext || window.webkitAudioContext),
    t = null;
  try {
    e && (t = new e({ latencyHint: 'interactive' }));
  } catch {
    t = null;
  }
  return t ? uE(n, t, null) : (console.warn('[audio] WebAudio unavailable \u2014 running silent'), Sz());
}

function uE(n, e, t) {
  let i = n.events,
    s = Math.random,
    o = () => (t ? !0 : e.state === 'running'),
    r = t ? t.bufs : new Map(),
    a = new Map(),
    l = 0,
    c = 0,
    u = 0;
  function f(ie, ae) {
    let pe = e.createBuffer(ae.ch.length, ae.ch[0].length, ae.sr);
    for (let Me = 0; Me < ae.ch.length; Me++) pe.getChannelData(Me).set(ae.ch[Me]);
    (r.set(ie, pe), c++);
    let Ee = a.get(ie);
    if (Ee) {
      a.delete(ie);
      for (let Me of Ee)
        try {
          Me(pe);
        } catch (Ie) {
          console.error('[audio] ready callback', Ie);
        }
    }
    return pe;
  }
  let h = (ie) => (Ir[ie].ir ? e.sampleRate : void 0);
  function p(ie, ae) {
    let pe = performance.now(),
      Ee = f(ie + '#' + ae, K6(ie, ae, h(ie)));
    return ((l += performance.now() - pe), Ee);
  }
  let d = [],
    m = new Set();
  for (let ie of [...Ez, ...Object.keys(Ir)]) {
    let ae = Ir[ie];
    if (!(!ae || m.has(ie))) {
      m.add(ie);
      for (let pe = 0; pe < ae.n; pe++)
        r.has(ie + '#' + pe) ||
          (ae.boot ? p(ie, pe) : d.push({ name: ie, v: pe, k: ie + '#' + pe, steps: null }));
    }
  }
  u = l;
  let x,
    v = new Promise((ie) => {
      x = ie;
    });
  function y() {
    let ie = performance.now();
    for (; d.length;) {
      let ae = d[0];
      if (r.has(ae.k)) {
        d.shift();
        continue;
      }
      ae.steps || (ae.steps = J6(ae.name, ae.v, h(ae.name)));
      let pe = null;
      try {
        pe = ae.steps.step();
      } catch (Ee) {
        (console.error('[audio] synthesis failed for ' + ae.k, Ee), d.shift());
        continue;
      }
      if ((pe && (f(ae.k, pe), d.shift(), ae.name, void 0), performance.now() - ie > 6)) break;
    }
    ((l += performance.now() - ie), d.length ? setTimeout(y, 12) : x());
  }
  t ? x() : setTimeout(y, 120);
  function b(ie, ae, pe) {
    let Ee = ie + '#' + ae,
      Me = r.get(Ee);
    if (Me) {
      pe(Me);
      return;
    }
    (a.has(Ee) || a.set(Ee, []), a.get(Ee).push(pe));
    let Ie = d.findIndex((Ce) => Ce.k === Ee);
    if (Ie > 0 && !d[Ie].steps) {
      let [Ce] = d.splice(Ie, 1);
      d.splice(d[0] && d[0].steps ? 1 : 0, 0, Ce);
    }
  }
  let g = (ie) => {
      let ae = e.createGain();
      return ((ae.gain.value = ie), ae);
    },
    E = g(1),
    M = e.createDynamicsCompressor(),
    _ = g(nE()),
    T = e.createWaveShaper(),
    w = g(ji.master);
  ((M.threshold.value = ji.comp.threshold),
    (M.knee.value = ji.comp.knee),
    (M.ratio.value = ji.comp.ratio),
    (M.attack.value = ji.comp.attack),
    (M.release.value = ji.comp.release),
    (T.curve = tE()));
  try {
    T.oversample = '2x';
  } catch {}
  (E.connect(M), M.connect(_), _.connect(T), T.connect(w), w.connect(e.destination));
  let S = e.createBiquadFilter();
  ((S.type = 'lowpass'), (S.frequency.value = 2e4), (S.Q.value = 0.5));
  let R = g(1);
  (S.connect(R), R.connect(E));
  let z = {
    world: g(1.25),
    near: g(1.24),
    gun: g(1),
    tail: g(1),
    amb: g(0.767),
    dry: g(1.3),
    music: g(ji.musicBus),
  };
  (z.world.connect(S), z.near.connect(S), z.gun.connect(S), z.tail.connect(S), z.dry.connect(E));
  let I = g(1),
    L = g(1),
    U = g(1);
  (z.amb.connect(I), I.connect(S), z.music.connect(U), U.connect(L), L.connect(E));
  function k(ie, ae, pe) {
    let Ee = e.currentTime,
      Me = ji.duck;
    for (let Ie of [I.gain, L.gain])
      try {
        (Ie.cancelScheduledValues(Ee),
          Ie.setTargetAtTime(ie, Ee, Me.attack),
          Ie.setTargetAtTime(1, Ee + (ae || Me.hold), pe || Me.release));
      } catch {}
  }
  let C = g(1),
    A = g(1),
    F = g(0),
    H = e.createConvolver(),
    N = e.createConvolver(),
    Z = g(0.75),
    Q = g(0.95),
    W = g(0.9),
    J = g(0.32),
    G = g(0.07),
    te = g(0.2);
  (z.world.connect(W),
    W.connect(C),
    z.near.connect(J),
    J.connect(C),
    z.gun.connect(G),
    G.connect(C),
    C.connect(A),
    C.connect(F),
    A.connect(H),
    F.connect(N),
    H.connect(Z),
    N.connect(Q),
    Z.connect(S),
    Q.connect(S),
    z.music.connect(te),
    te.connect(N),
    b('ir_outdoor', 0, (ie) => {
      H.buffer = ie;
    }),
    b('ir_shed', 0, (ie) => {
      N.buffer = ie;
    }));
  function oe(ie, ae, pe, Ee) {
    ie.positionX
      ? ((ie.positionX.value = ae), (ie.positionY.value = pe), (ie.positionZ.value = Ee))
      : ie.setPosition(ae, pe, Ee);
  }
  function ee(ie) {
    let ae = e.createPanner();
    return (
      (ae.panningModel = ie ? 'HRTF' : 'equalpower'),
      (ae.distanceModel = 'inverse'),
      (ae.refDistance = 3),
      (ae.rolloffFactor = 0.6),
      (ae.maxDistance = 400),
      (ae.coneInnerAngle = 360),
      ae
    );
  }
  let le = { world: [], near: [], gun: [], tail: [], dry: [], music: [] };
  function xe(ie, ae) {
    let pe = { g: g(0), pan: null, src: null, end: 0, start: 0, name: '', pri: 0 };
    (ae ? ((pe.pan = ee(!1)), pe.g.connect(pe.pan), pe.pan.connect(z[ie])) : pe.g.connect(z[ie]),
      le[ie].push(pe));
  }
  for (let ie = 0; ie < 22; ie++) xe('world', !0);
  for (let ie = 0; ie < 12; ie++) xe('near', !1);
  for (let ie = 0; ie < 18; ie++) xe('gun', !1);
  for (let ie = 0; ie < 12; ie++) xe('tail', !1);
  for (let ie = 0; ie < 8; ie++) xe('dry', !1);
  for (let ie = 0; ie < 3; ie++) xe('music', !1);
  let j = { x: 0, y: 1.7, z: 0 },
    O = !1,
    q = !1,
    ue = 0.9,
    de = (n.game && n.game.state) || 'title',
    $ = 0,
    se = 0,
    fe = 0,
    me = 0,
    ge = 0,
    ce = 0,
    P = 1,
    D = 1,
    B = 0,
    X = -9,
    re = -9,
    Y = ji.weapon.rifle,
    he = -9,
    V = -9,
    ne = -9,
    ye = -9,
    Te = -9,
    Re = -9,
    Ue = -9,
    Ve = {},
    ze = { rifle: 0, pistol: 0 },
    Ge = [],
    _e = { autoIntensity: !0 };
  function Ne(ie, ae, pe, Ee) {
    let Me = null,
      Ie = 0,
      Ce = null,
      Ye = null;
    for (let rt = 0; rt < ie.length; rt++) {
      let Be = ie[rt];
      if (Be.end <= Ee) {
        Me || (Me = Be);
        continue;
      }
      (Be.name === ae && (Ie++, (!Ce || Be.start < Ce.start) && (Ce = Be)),
        (!Ye || Be.pri < Ye.pri || (Be.pri === Ye.pri && Be.start < Ye.start)) && (Ye = Be));
    }
    if (Ie >= (pe.max || 4)) {
      if (!pe.soft || !Me) return Ce;
      try {
        (Ce.g.gain.cancelScheduledValues(Ee),
          Ce.g.gain.setTargetAtTime(0, Ee, 0.035),
          Ce.src && Ce.src.stop(Ee + 0.25));
      } catch {}
      ((Ce.end = Ee + 0.25), (Ce.name = ''));
    }
    return Me || (Ye && Ye.pri <= pe.pri ? Ye : null);
  }
  let ke = (ie, ae) => !!je(ie, ae);
  function je(ie, ae) {
    ((ae = ae || {}),
      (ie = $6[ie] || ie),
      ae.surface &&
        (ie === 'impact_concrete'
          ? (ie = aE[ae.surface] || ie)
          : ie === 'step_concrete' && (ie = Qv[ae.surface] || ie)));
    let pe = Ir[ie];
    if (!pe || pe.loop || pe.ir || !o()) return null;
    let Ee = ae.variant;
    Ee == null ? (Ee = Ve[ie] = ((Ve[ie] || 0) + 1 + (pe.n > 2 && s() < 0.3 ? 1 : 0)) % pe.n) : (Ee %= pe.n);
    let Me = r.get(ie + '#' + Ee);
    if (!Me) {
      if (ae.noDefer && lE.has(ie)) return null;
      if (lE.has(ie)) {
        let o0 = e.currentTime;
        return (
          b(ie, Ee, () => {
            e.currentTime - o0 < 2.5 && ke(ie, Object.assign({}, ae, { variant: Ee }));
          }),
          null
        );
      }
      Me = p(ie, Ee);
    }
    let Ie = e.currentTime,
      Ce = ae.pos,
      Ye = !!Ce && pe.bus === 'world',
      rt = Ye ? le.world : le[pe.bus === 'world' ? 'near' : pe.bus],
      Be = Ne(rt, ie, pe, Ie);
    if (!Be) return null;
    let _t = Ie + (ae.delay || 0),
      wt = Be.g.gain;
    if ((wt.cancelScheduledValues(Ie), Be.end > Ie && Be.src)) {
      wt.setTargetAtTime(0, Ie, 0.004);
      try {
        Be.src.stop(Ie + 0.025);
      } catch {}
      _t = Math.max(_t, Ie + 0.025);
    }
    let z0 = ae.jitter != null ? ae.jitter : 0.035,
      Pi = ti((ae.pitch || 1) * (1 + (s() * 2 - 1) * z0), 0.25, 4);
    if ((wt.setValueAtTime((ae.gain != null ? ae.gain : 1) * (1 - s() * 0.08), _t), Ye)) {
      let o0 = Array.isArray(Ce) ? { x: Ce[0], y: Ce[1], z: Ce[2] } : Ce;
      (oe(Be.pan, o0.x || 0, o0.y || 0, o0.z || 0),
        (Be.pan.refDistance = ae.ref || pe.ref || 3),
        (Be.pan.rolloffFactor = ae.roll != null ? ae.roll : pe.roll != null ? pe.roll : 0.6));
    }
    let Lt = e.createBufferSource();
    return (
      (Lt.buffer = Me),
      (Lt.playbackRate.value = Pi),
      Lt.connect(Be.g),
      (Lt.onended = () => {
        try {
          Lt.disconnect();
        } catch {}
      }),
      Lt.start(_t),
      (Be.src = Lt),
      (Be.start = _t),
      (Be.end = _t + Me.duration / Pi + 0.03),
      (Be.name = ie),
      (Be.pri = pe.pri || 0),
      Be
    );
  }
  let Ze = new Set(),
    qe = new Set(),
    Oe = () => {},
    mt = !1,
    $e = { setPos: Oe, setGain: Oe, setPitch: Oe, stop: Oe, alive: !1 };
  function Ke(ie, ae) {
    ae = ae || {};
    let pe = Ir[ie];
    if (!pe || !pe.loop) return $e;
    let Ee = (ie === 'gull_rotor' || ie === 'hound_servo') && !ae._auto;
    Ee && !ae.hrtf && (ae = Object.assign({ hrtf: !0 }, ae));
    let Me = {
        name: ie,
        alive: !0,
        vT: 1,
        vC: 1,
        px: 0,
        py: 0,
        pz: 0,
        gT: ae.gain != null ? ae.gain : 1,
        gC: 0,
        pT: ae.pitch || 1,
        pC: ae.pitch || 1,
        src: null,
        g: g(0),
        pan: null,
        rate: ae.fade || 6,
      },
      Ie = Me.g;
    if (
      (ae.pos &&
        ((Me.pan = ee(!!ae.hrtf)),
        (Me.pan.refDistance = ae.ref || pe.ref || 3),
        (Me.pan.rolloffFactor = ae.roll != null ? ae.roll : pe.roll != null ? pe.roll : 0.6),
        Me.g.connect(Me.pan),
        (Ie = Me.pan)),
      Ie.connect(z[ae.bus || (ae.pos ? 'world' : pe.music ? 'music' : 'amb')]),
      (Me.setPos = (Ce) => {
        Me.pan &&
          Ce &&
          (Array.isArray(Ce)
            ? ((Me.px = Ce[0]), (Me.py = Ce[1]), (Me.pz = Ce[2]))
            : ((Me.px = Ce.x || 0), (Me.py = Ce.y || 0), (Me.pz = Ce.z || 0)),
          Number.isFinite(Me.px + Me.py + Me.pz) && oe(Me.pan, Me.px, Me.py, Me.pz));
      }),
      (Me.setGain = (Ce) => {
        Me.gT = Math.max(0, +Ce || 0);
      }),
      (Me.setPitch = (Ce) => {
        Me.pT = ti(+Ce || 1, 0.25, 4);
      }),
      (Me.stop = (Ce) => {
        if (!Me.alive) return;
        ((Me.alive = !1), Ze.delete(Me), qe.delete(Me));
        let Ye = Ce ?? 0.18,
          rt = e.currentTime;
        try {
          (Me.g.gain.setValueAtTime(Me.gC, rt),
            Me.g.gain.linearRampToValueAtTime(0, rt + Ye),
            Me.src && Me.src.stop(rt + Ye + 0.03));
        } catch {}
        setTimeout(
          () => {
            try {
              (Me.src && Me.src.disconnect(), Me.g.disconnect(), Me.pan && Me.pan.disconnect());
            } catch {}
          },
          (Ye + 0.3) * 1e3,
        );
      }),
      ae.pos && Me.setPos(ae.pos),
      b(ie, 0, (Ce) => {
        if (!Me.alive) return;
        let Ye = e.createBufferSource();
        ((Ye.buffer = Ce),
          (Ye.loop = !0),
          (Ye.playbackRate.value = Me.pC),
          Ye.connect(Me.g),
          Ye.start(0, ae.offset != null ? ae.offset : s() * Ce.duration),
          (Me.src = Ye));
      }),
      Ze.add(Me),
      Ee && (qe.add(Me), !mt))
    ) {
      mt = !0;
      for (let Ce of [...Sn.keys()]) xn(Ce);
    }
    return Me;
  }
  let Bt = rE({ ctx: e, out: z.music, bufs: r, whenReady: b, running: o, rnd: s });
  function Gt() {}
  let vi = {
      rain: Ke('rain', { gain: 0, fade: 2 }),
      rainIn: Ke('rain_interior', { gain: 0, fade: 2 }),
      wind: Ke('wind', { gain: 0, fade: 2 }),
      sea: Ke('sea', { gain: 0, pos: [33, -1, 0], fade: 2, bus: 'amb' }),
    },
    q0 = 0.4,
    yi = 0.4,
    sn = 2,
    P0 = { fog: 14 + s() * 14, gull: 5 + s() * 8, hal: 4 + s() * 6, bang: 20 + s() * 25 };
  function $t(ie, ae) {
    let pe = 1 - 0.7 * se;
    if ((P0.fog -= ie) <= 0) {
      P0.fog = 40 + s() * 30;
      let Ee = j.z + (s() * 2 - 1) * 250;
      ke('foghorn', {
        pos: [j.x + 320, 8, Ee],
        ref: 400,
        gain: 0.34 * ae * pe,
        pitch: s() < 0.3 ? 0.89 : 1,
        jitter: 0.01,
      });
    }
    if ((P0.gull -= ie) <= 0) {
      P0.gull = 9 + s() * 16;
      let Ee = s() * 6.283,
        Me = 35 + s() * 50;
      ke('gull_cry', {
        pos: [j.x + Math.cos(Ee) * Me, 14 + s() * 18, j.z + Math.sin(Ee) * Me],
        ref: Me,
        roll: 1,
        gain: (0.16 + s() * 0.16) * ae * pe,
        jitter: 0.1,
      });
    }
    if (
      ((P0.hal -= ie) <= 0 &&
        ((P0.hal = 6 + s() * 11),
        ke('halyard', {
          pos: [29 + s() * 8, 3 + s() * 6, -8 + s() * 32],
          ref: 16,
          roll: 0.5,
          gain: (0.3 + s() * 0.3) * ae * pe,
          jitter: 0.08,
        })),
      (P0.bang -= ie) <= 0)
    ) {
      P0.bang = 28 + s() * 34;
      let Ee = 1.6 + s() * 3.2;
      ke('container_bang', {
        pos: [j.x + Math.cos(Ee) * 150, 4, j.z + Math.sin(Ee) * 150],
        ref: 150,
        gain: (0.2 + s() * 0.16) * ae * pe,
        jitter: 0.12,
      });
    }
  }
  let Sn = new Map(),
    bi = 0;
  function oi(ie) {
    !ie ||
      mt ||
      ie.type !== 'gull' ||
      Sn.has(ie) ||
      ie.alive === !1 ||
      Sn.set(ie, {
        h: null,
        type: 'gull',
        lx: ie.pos ? ie.pos.x : 0,
        ly: ie.pos ? ie.pos.y : 0,
        lz: ie.pos ? ie.pos.z : 0,
        sp: 0,
        d: 1e9,
        tune: 0.96 + s() * 0.1,
      });
  }
  function xn(ie) {
    let ae = Sn.get(ie);
    ae && (ae.h && ae.h.stop(0.12), Sn.delete(ie));
  }
  let Zt = [];
  function Vs(ie) {
    if (((bi -= ie), bi <= 0 && mt)) {
      ((bi = 0.25), (Zt.length = 0));
      for (let ae of qe) ((ae.d = Math.hypot(ae.px - j.x, ae.py - j.y, ae.pz - j.z)), Zt.push(ae));
      Zt.sort((ae, pe) => ae.d - pe.d);
      for (let ae = 0; ae < Zt.length; ae++) Zt[ae].vT = ae < 6 && Zt[ae].d < 90 ? 1 : 0;
    }
    if (bi <= 0) {
      bi = 0.25;
      let ae = n.enemies && n.enemies.list;
      if (Array.isArray(ae))
        for (let pe = 0; pe < ae.length; pe++) {
          let Ee = ae[pe];
          Ee && Ee.alive !== !1 && !Sn.has(Ee) && oi(Ee);
        }
      Zt.length = 0;
      for (let [pe, Ee] of Sn) {
        if (pe.alive === !1 || (Array.isArray(ae) && ae.indexOf(pe) < 0)) {
          xn(pe);
          continue;
        }
        let Me = pe.pos;
        Me && ((Ee.d = Math.hypot(Me.x - j.x, Me.y - j.y, Me.z - j.z)), Zt.push(Ee));
      }
      Zt.sort((pe, Ee) => pe.d - Ee.d);
      for (let pe = 0; pe < Zt.length; pe++) {
        let Ee = Zt[pe],
          Me = pe < 6 && Ee.d < 90;
        Me && !Ee.h
          ? (Ee.h = Ke(Ee.type === 'gull' ? 'gull_rotor' : 'hound_servo', {
              pos: [Ee.lx, Ee.ly, Ee.lz],
              gain: 0,
              hrtf: !0,
              fade: 5,
              _auto: !0,
            }))
          : !Me && Ee.h && (Ee.h.stop(0.25), (Ee.h = null));
      }
    }
    for (let [ae, pe] of Sn) {
      let Ee = ae.pos;
      if (Ee) {
        if (ie > 0) {
          let Me = Math.hypot(Ee.x - pe.lx, Ee.y - pe.ly, Ee.z - pe.lz) / ie;
          pe.sp += (Math.min(Me, 30) - pe.sp) * Math.min(1, ie * 5);
        }
        if (((pe.lx = Ee.x), (pe.ly = Ee.y), (pe.lz = Ee.z), !!pe.h))
          if ((pe.h.setPos(Ee), pe.type === 'gull'))
            (pe.h.setGain(1), pe.h.setPitch(pe.tune * (0.94 + 0.3 * ti(pe.sp / 10, 0, 1))));
          else {
            let Me = ti(pe.sp / 3, 0, 1);
            (pe.h.setGain(0.3 + 0.5 * Me), pe.h.setPitch(pe.tune * (0.88 + 0.3 * Me)));
          }
      }
    }
  }
  let ws = [];
  function cl() {
    for (let ae of ws) ae.h.stop(0.2);
    ws = [];
    let ie = n.level && n.level.objectives;
    Array.isArray(ie) &&
      ie.forEach((ae, pe) => {
        ae &&
          ae.pos &&
          ws.push({
            id: ae.id,
            index: pe,
            pos: { x: ae.pos.x, y: (ae.pos.y || 0) + 1.2, z: ae.pos.z },
            h: Ke('relay_hum', { pos: [ae.pos.x, (ae.pos.y || 0) + 1.2, ae.pos.z], gain: 0.9 }),
          });
      });
  }
  function I0(ie) {
    ie = ie || {};
    let ae = ws.findIndex((pe) => ie.id != null && pe.id === ie.id);
    if ((ae < 0 && ie.index != null && (ae = ws.findIndex((pe) => pe.index === ie.index)), ae >= 0)) {
      let pe = ws[ae];
      (pe.h.stop(0.08), ws.splice(ae, 1), ke('relay_cut', { pos: pe.pos, gain: 1 }));
    } else ke('relay_cut', { gain: 0.8 });
  }
  let Kt = (ie) => (ie && typeof ie.x == 'number' ? ie : null),
    be = (ie) => (ie && ie.weapon === 'pistol' ? 'pistol' : 'rifle');
  function Le(ie) {
    let ae = ji.weapon[ie],
      pe = e.currentTime;
    ((Y = ae),
      (X = pe),
      (ze[ie] = (ze[ie] + 1 + (s() < 0.25 ? 1 : 0)) % ae.n),
      je(ae.shot, { variant: ze[ie], gain: ae.gain, jitter: 0.012 }));
    for (let Ce of Ge)
      if (Ce.ch.src === Ce.src)
        try {
          Ce.ch.g.gain.cancelScheduledValues(pe);
        } catch {}
    Ge.length = 0;
    let Ee = se,
      Me = Q6(pe - re),
      Ie = (Ce, Ye) => {
        if (Ye < 0.05) return;
        let rt = ae.tail * Ye,
          Be = je(Ce, { gain: rt * Me, jitter: 0.02, noDefer: !0 });
        if (Be && Me < 0.999) {
          try {
            Be.g.gain.setTargetAtTime(rt, Be.start + ji.tailBoostAfter, 0.03);
          } catch {}
          Ge.push({ ch: Be, src: Be.src });
        }
      };
    (Ie(ae.tailOut, Math.cos((Ee * Math.PI) / 2)),
      Ie(ae.tailIn, Math.sin((Ee * Math.PI) / 2)),
      (re = pe),
      k(ae.duck),
      me > 0.3 && (me = Math.min(1, me + 0.015)));
  }
  let Fe = (ie, ae) => {
    i &&
      i.on &&
      i.on(ie, (pe) => {
        try {
          ae(pe || {});
        } catch (Ee) {
          console.error('[audio] ' + ie, Ee);
        }
      });
  };
  (Fe('weapon:fire', (ie) => {
    o() && Le(be(ie));
  }),
    Fe('weapon:dry', (ie) =>
      ke(be(ie) === 'pistol' ? 'pistol_dry' : 'rifle_dry', { gain: 1, jitter: 0.02 }),
    ));
  let He = {
    rifle: {
      magout: 'reload_magout',
      maginsert: 'reload_maginsert',
      magin: 'reload_magin',
      boltback: 'reload_boltback',
      bolt: 'reload_bolt',
      slide: 'reload_bolt',
    },
    pistol: {
      magout: 'pistol_magout',
      maginsert: 'pistol_maginsert',
      magin: 'pistol_magin',
      boltback: 'pistol_slide',
      bolt: 'pistol_slide',
      slide: 'pistol_slide',
    },
  };
  (Fe('weapon:reload', (ie) => {
    let ae = be(ie),
      pe = ie.phase,
      Ee = He[ae][pe];
    pe === 'start'
      ? ke('gear_rustle', { variant: 0, gain: 0.9, pitch: ae === 'pistol' ? 1.12 : 1 })
      : pe === 'done'
        ? ke('gear_rustle', { variant: 1, gain: 0.6, pitch: ae === 'pistol' ? 1.12 : 1 })
        : pe === 'boltback' && ae === 'rifle'
          ? ke(Ee, { variant: ie.partial ? 1 : 0, gain: ie.partial ? 0.6 : 1, jitter: 0.02 })
          : Ee && ke(Ee, { gain: 1, jitter: 0.02 });
  }),
    Fe('weapon:switch', (ie) => {
      let ae = ie.to === 'pistol',
        pe = ie.from === 'pistol';
      ie.phase === 'holster'
        ? ke('weapon_holster', { gain: pe ? 0.75 : 1, pitch: pe ? 1.18 : 1 })
        : ie.phase === 'draw' && ke('weapon_draw', { gain: ae ? 0.8 : 1, pitch: ae ? 1.15 : 1 });
    }),
    Fe('weapon:melee', () => ke('jump', { gain: 0.9, pitch: 1.2 })),
    Fe('shell:bounce', (ie) => {
      let ae = e.currentTime;
      if (ae - ye < 0.04) return;
      ye = ae;
      let pe = Y.shellPitch;
      ie.surface === 'water'
        ? ke('impact_water', { pos: Kt(ie.pos), gain: 0.25, pitch: 1.7 })
        : ie.surface === 'metal' || ie.surface === 'glass'
          ? ke('shell_bounce_metal', { pos: Kt(ie.pos), gain: 1, pitch: pe, jitter: 0.06 })
          : ke('shell_bounce', {
              pos: Kt(ie.pos),
              gain: ie.surface === 'wood' || ie.surface === 'rubber' || ie.surface === 'dirt' ? 0.5 : 0.85,
              pitch: pe * (ie.surface === 'wood' ? 0.9 : 1),
              jitter: 0.06,
            });
    }),
    Fe('impact', (ie) => {
      let ae = e.currentTime;
      if (ae - he < 0.022) return;
      he = ae;
      let pe = Kt(ie.point),
        Ee = ie.surface;
      if (ie.enemy) {
        ke('impact_enemy', {
          pos: pe,
          gain: ie.part === 'weak' ? 1 : 0.85,
          pitch: ie.part === 'weak' ? 1.25 : 1,
        });
        return;
      }
      if (ie.from === 'enemy' && pe && ie.dir && typeof ie.dir.x == 'number' && ae - Ue > 0.09) {
        let Me = ie.dir,
          Ie = Me.x * Me.x + Me.y * Me.y + Me.z * Me.z || 1,
          Ce = ((j.x - pe.x) * Me.x + (j.y - pe.y) * Me.y + (j.z - pe.z) * Me.z) / Ie;
        if (Ce < -1.5) {
          let Ye = pe.x + Me.x * Ce,
            rt = pe.y + Me.y * Ce,
            Be = pe.z + Me.z * Ce,
            _t = Math.hypot(j.x - Ye, j.y - rt, j.z - Be);
          _t < 3.2 &&
            ((Ue = ae),
            ke('whiz', { pos: { x: Ye, y: rt, z: Be }, gain: ti(1.15 - _t / 3.5, 0.3, 1), jitter: 0.1 }));
        }
      }
      (ke(aE[Ee] || 'impact_concrete', {
        pos: pe,
        gain: ie.from === 'enemy' ? 0.8 : 0.9,
        pitch: Ee === 'dirt' ? 0.8 : Ee === 'rubber' ? 0.7 : 1,
        jitter: 0.07,
      }),
        ae - V > 0.22 &&
          ((Ee === 'metal' && s() < 0.24) || (Ee === 'concrete' && s() < 0.07)) &&
          ((V = ae), ke('ricochet', { pos: pe, gain: 0.75, delay: 0.012, jitter: 0.12 })));
    }),
    Fe('player:step', (ie) => {
      let ae = ie.surface || 'concrete';
      try {
        ie.pos && n.ground && n.ground.isPuddle && n.ground.isPuddle(ie.pos.x, ie.pos.z) && (ae = 'water');
      } catch {}
      ke(Qv[ae] || 'step_concrete', {
        gain: (ie.sprint ? 0.8 : 0.55) * (ae === 'water' ? 0.9 : 1),
        pitch: (ie.sprint ? 1.05 : 1) * (ae === 'wood' ? 1.18 : 1),
        jitter: 0.06,
      });
    }),
    Fe('player:jump', () => ke('jump', { gain: 0.8 })),
    Fe('player:land', (ie) => {
      let ae = ti(0.35 + (Math.abs(ie.speed) || 4) / 10, 0.35, 1);
      (ke('land', { gain: ae }),
        (ie.surface === 'water' || ie.surface === 'metal') &&
          ke(Qv[ie.surface], { gain: ae * 0.8, pitch: 0.9 }));
    }),
    Fe('player:hit', (ie) => {
      let ae = +ie.amount || 10,
        pe = e.currentTime;
      (ke('hurt', { gain: ti(0.5 + ae / 40, 0.5, 1), jitter: 0.08 }),
        ae >= 6 && pe - ne > 1.8 && ((ne = pe), ke('ear_ring', { gain: ti(ae / 28, 0.3, 1), jitter: 0.02 })),
        (ce = Math.max(ce, ti(ae / 40, 0.2, 0.7))),
        (me = Math.min(1, Math.max(me, 0.6) + 0.15)));
    }),
    Fe('player:dead', () => {
      (Bt.death(), (ce = 1));
    }),
    Fe('enemy:spawn', (ie) => oi(ie.enemy)),
    Fe('enemy:alert', (ie) => {
      me = Math.max(me, 0.6);
      let ae = e.currentTime;
      if (ae - Te < 0.12) return;
      Te = ae;
      let pe = ie.enemy || {};
      ke('alert', { pos: Kt(pe.pos) || Kt(ie.pos), variant: pe.type === 'hound' ? 1 : 0, gain: 0.9 });
    }),
    Fe('enemy:fire', (ie) => {
      let ae = ie.type || (ie.enemy && ie.enemy.type),
        pe = Kt(ie.pos) || (ie.enemy && Kt(ie.enemy.pos));
      (ke(ae === 'hound' ? 'hound_fire' : 'gull_fire', { pos: pe, gain: 1, jitter: 0.04 }),
        (me = Math.min(1, Math.max(me, 0.6) + 0.05)));
    }),
    Fe('enemy:step', (ie) => {
      if (ie.crash) {
        (ke('hound_step', { pos: Kt(ie.pos), gain: 1, pitch: 0.72 }),
          ke('impact_metal', { pos: Kt(ie.pos), gain: 0.8, pitch: 0.55 }));
        return;
      }
      ie.type !== 'gull' &&
        ke('hound_step', { pos: Kt(ie.pos), gain: ti(0.6 + (+ie.speed || 2) * 0.1, 0.6, 1), jitter: 0.06 });
    }),
    Fe('enemy:telegraph', (ie) => {
      let ae = ie.enemy || {},
        pe = ie.type || ae.type,
        Ee = ti(+ie.time || 0.55, 0.15, 1.5);
      (ke('telegraph', {
        pos: Kt(ie.pos) || Kt(ae.pos),
        variant: pe === 'hound' ? 1 : 0,
        pitch: 0.55 / Ee,
        gain: ie.melee ? 0.7 : 1,
        jitter: 0,
      }),
        (me = Math.max(me, 0.6)));
    }),
    Fe('enemy:melee', (ie) => {
      let ae = Kt(ie.pos) || (ie.enemy && Kt(ie.enemy.pos));
      (ke('hound_step', { pos: ae, gain: 1, pitch: 0.8 }),
        ke('impact_metal', { pos: ae, gain: 0.9, pitch: 0.7 }),
        ke('hurt', { gain: 0.6 }));
    }),
    Fe('enemy:killed', (ie) => {
      let ae = ie.enemy,
        pe = ie.type || (ae && ae.type),
        Ee = Kt(ie.pos) || (ae && Kt(ae.pos));
      (ae && xn(ae), ke(pe === 'hound' ? 'hound_die' : 'gull_die', { pos: Ee, gain: 1, jitter: 0.05 }));
    }),
    Fe('explosion', (ie) => {
      let ae = ti(+ie.size || 1, 0.3, 3),
        pe = Kt(ie.pos),
        Ee = ae >= 1.3,
        Me = () =>
          ke('explosion', {
            pos: pe,
            gain: ti(0.42 + 0.4 * ae, 0.5, 1),
            pitch: ti(1.26 - 0.22 * ae, 0.82, 1.2),
            jitter: 0.04,
          });
      if (
        ((Ee &&
          je('explosion_big', {
            pos: pe,
            gain: ti(0.7 + 0.18 * ae, 0.9, 1.2),
            pitch: ti(1.13 - 0.075 * ae, 0.92, 1.04),
            jitter: 0.03,
            ref: 12 + 3 * ae,
            noDefer: !0,
          })) ||
          Me(),
        pe)
      ) {
        let Ie = Math.hypot(pe.x - j.x, pe.y - j.y, pe.z - j.z);
        ce = Math.max(ce, ti((1 - (Ie - 5) / 10) * (Ee ? 1 : 0.7), 0, 0.8));
      }
      ((me = Math.max(me, 0.6)),
        (P = Math.min(P, Ee ? 0.3 : 0.45)),
        k(Ee ? 0.4 : 0.6, Ee ? 0.4 : 0.15, Ee ? 0.45 : 0.2));
    }),
    Fe('objective:done', (ie) => {
      (I0(ie), Bt.relay());
    }),
    Fe('objective:all', () => Bt.finalRun()));
  let De = () => Bt.complete();
  (Fe('extraction:reached', De),
    Fe('thunder', (ie) => {
      let ae = ti(ie.intensity != null ? +ie.intensity : 0.6, 0.1, 1);
      ke('thunder', {
        variant: ae > 0.6 ? 1 : 0,
        delay: 0.5 + (1 - ae) * 2 + s() * 0.6,
        gain: 0.35 + 0.65 * ae,
        jitter: 0.1,
      });
    }),
    Fe('ui:click', () => ke('ui_click')),
    Fe('ui:hover', () => ke('ui_hover')),
    Fe('game:state', (ie) => {
      let ae = de;
      if (((de = ie.state || de), Bt.state(de, ae), de === 'playing' && ae !== 'paused')) {
        ((me = 0), (ce = 0), cl());
        for (let pe of [...Sn.keys()]) pe.alive === !1 && xn(pe);
      }
      (de === 'complete' && De(), de === 'paused' ? (q = !0) : ae === 'paused' && (q = !1));
    }));
  function ve() {
    if (((O = !0), e.state !== 'running' && e.state !== 'closed'))
      try {
        let ie = e.resume();
        ie && ie.catch && ie.catch(() => {});
      } catch {}
  }
  if (typeof window < 'u' && !t) {
    let ie = () => {
      if ((ve(), o()))
        for (let ae of ['pointerdown', 'keydown', 'touchend', 'mousedown'])
          window.removeEventListener(ae, ie, !0);
    };
    for (let ae of ['pointerdown', 'keydown', 'touchend', 'mousedown'])
      window.addEventListener(ae, ie, { capture: !0, passive: !0 });
    document.addEventListener('visibilitychange', () => {
      try {
        document.hidden ? e.suspend() : O && e.resume();
      } catch {}
    });
  }
  function we(ie) {
    ie = Math.min(Math.max(+ie || 0, 0), 0.25);
    let ae = n.camera,
      pe = e.listener;
    if (ae && ae.matrixWorld) {
      let Be = ae.matrixWorld.elements;
      ((j.x = Be[12]),
        (j.y = Be[13]),
        (j.z = Be[14]),
        Number.isFinite(j.x + j.y + j.z + Be[8] + Be[4]) &&
          (pe.positionX
            ? ((pe.positionX.value = j.x),
              (pe.positionY.value = j.y),
              (pe.positionZ.value = j.z),
              (pe.forwardX.value = -Be[8]),
              (pe.forwardY.value = -Be[9]),
              (pe.forwardZ.value = -Be[10]),
              (pe.upX.value = Be[4]),
              (pe.upY.value = Be[5]),
              (pe.upZ.value = Be[6]))
            : (pe.setPosition(j.x, j.y, j.z),
              pe.setOrientation(-Be[8], -Be[9], -Be[10], Be[4], Be[5], Be[6]))));
    }
    let Ee = n.level && n.level.interiorBoxes;
    if (Array.isArray(Ee) && Ee.length) {
      let Be = 0;
      for (let _t = 0; _t < Ee.length; _t++) {
        let wt = Ee[_t];
        if (
          wt &&
          wt.min &&
          wt.max &&
          j.x > wt.min.x &&
          j.x < wt.max.x &&
          j.y > wt.min.y - 0.5 &&
          j.y < wt.max.y &&
          j.z > wt.min.z &&
          j.z < wt.max.z
        ) {
          Be = 1;
          break;
        }
      }
      $ = Be;
    }
    let Me = (Be) => 1 - Math.exp(-ie * Be);
    if (((se += ($ - se) * Me(3)), (A.gain.value = 1 - 0.9 * se), (F.gain.value = se), !o())) return;
    let Ie = e.currentTime,
      Ce = de === 'playing' || de === 'intro';
    ((B += ((q ? 0 : de === 'title' ? 0.6 : de === 'dead' ? 0.7 : 1) - B) * Me(1.2)),
      (D += ((q ? 0 : 1) - D) * Me(12)),
      (R.gain.value = D),
      (ce += ((de === 'dead' ? 0.85 : 0) - ce) * Me(de === 'dead' ? 3 : 0.9)),
      (S.frequency.value = 2e4 * Math.pow(0.03, ti(ce, 0, 1))),
      (w.gain.value = ue),
      (sn -= ie) <= 0 && ((sn = 3 + s() * 6), (yi = 0.12 + s() * 0.88)),
      (q0 += (yi - q0) * Me(0.5)),
      vi.rain.setGain(B * (1 - 0.93 * se) * 0.95),
      vi.rainIn.setGain(B * se * 0.95),
      vi.wind.setGain(B * (0.3 + 0.7 * q0) * (1 - 0.65 * se) * 0.75),
      vi.wind.setPitch(0.9 + 0.25 * q0),
      vi.sea.setGain(B * (1 - 0.5 * se) * 1),
      vi.sea.setPos([33, -1, ti(j.z, -28, 26)]),
      !q && (Ce || de === 'title' || de === 'complete') && $t(ie, de === 'title' ? 0.7 : 1),
      q || Vs(ie),
      (me = Math.max(0, me - ie * (Sn.size ? 0.045 : 0.14))));
    let rt = Ce || q ? Math.max(fe, _e.autoIntensity ? Math.max(0.15, me) : 0) : 0;
    ((ge += (rt - ge) * Me(2)),
      (P += (1 - P) * Me(3.5)),
      (U.gain.value = P * (q ? 0.45 : 1)),
      Bt.update(ie, ge, rt));
    for (let Be of Ze)
      ((Be.vC += (Be.vT - Be.vC) * Me(4)),
        (Be.gC += (Be.gT * Be.vC - Be.gC) * Me(Be.rate)),
        (Be.g.gain.value = Be.gC),
        Be.src &&
          Math.abs(Be.pT - Be.pC) > 1e-4 &&
          ((Be.pC += (Be.pT - Be.pC) * Me(8)), (Be.src.playbackRate.value = Be.pC)));
  }
  async function Ae(ie) {
    ((ie = ie || {}), await v);
    let ae = e.sampleRate,
      pe = ie.seconds || 10,
      Ee = new OfflineAudioContext(2, ae * pe, ae),
      Me = new Map(),
      Ie = {
        on(Ht, rn) {
          (Me.has(Ht) || Me.set(Ht, []), Me.get(Ht).push(rn));
        },
        emit(Ht, rn) {
          for (let Hi of Me.get(Ht) || []) Hi(rn);
        },
      },
      Ce = new Float32Array(16);
    ((Ce[0] = Ce[5] = Ce[10] = Ce[15] = 1), (Ce[13] = 1.7));
    let Ye = [
        { type: 'gull', alive: !0, pos: { x: 6, y: 4, z: -9 } },
        { type: 'hound', alive: !0, pos: { x: -8, y: 0, z: -14 } },
        { type: 'gull', alive: !0, pos: { x: 0, y: 5, z: -30 } },
      ],
      rt = { min: { x: -99, y: -9, z: -99 }, max: { x: 99, y: 99, z: 99 } },
      Be = {
        events: Ie,
        params: {},
        camera: { matrixWorld: { elements: Ce } },
        enemies: { list: [] },
        level: {
          interiorBoxes: ie.interior
            ? [rt]
            : [{ min: { x: 500, y: 0, z: 500 }, max: { x: 501, y: 1, z: 501 } }],
          objectives: [{ id: 'A', pos: { x: 4, y: 0, z: 3 } }],
        },
      },
      _t = uE(Be, Ee, { bufs: r }),
      wt = 0.02,
      z0 = 0,
      Pi = (Ht) => {
        let rn = Ht * wt;
        if (
          (Ht === 0 &&
            (Ie.emit('game:state', { state: 'playing' }), ie.bare && (_t.setIntensity(1), _t.music.snap())),
          rn < 3 && Ht % 23 === 0 && Ie.emit('player:step', { surface: 'concrete', sprint: !1 }),
          Ht === 150)
        ) {
          for (let Hi of Ye) (Be.enemies.list.push(Hi), Ie.emit('enemy:spawn', { enemy: Hi }));
          (Ie.emit('enemy:alert', { enemy: Ye[0] }), _t.setIntensity(1));
        }
        (Ht >= 150 &&
          Ht < 198 &&
          Ht % 4 === 2 &&
          (Ie.emit('weapon:fire', { weapon: 'rifle' }),
          ie.bare ||
            (Ie.emit('impact', {
              point: { x: 4, y: 1, z: -12 },
              surface: Ht % 8 ? 'metal' : 'concrete',
              from: 'player',
            }),
            Ie.emit('shell:bounce', {
              pos: { x: 0.6, y: 0, z: 0.2 },
              surface: Ht % 3 ? 'concrete' : 'metal',
            }))),
          Ht >= 225 && Ht < 275 && Ht % 10 === 5 && Ie.emit('weapon:fire', { weapon: 'pistol' }),
          Ht === 276 && Ie.emit('weapon:dry', { weapon: 'pistol' }));
        {
          let Hi = ['start', 'magout', 'maginsert', 'magin', 'boltback', 'bolt', 'done'],
            Oi = (Ht - 280) / 4;
          Oi >= 0 &&
            Oi < Hi.length &&
            Oi === Math.floor(Oi) &&
            Ie.emit('weapon:reload', { phase: Hi[Oi], weapon: 'rifle', empty: !0 });
        }
        (Ht === 312 && Ie.emit('weapon:switch', { from: 'rifle', to: 'pistol', phase: 'holster' }),
          Ht === 322 && Ie.emit('weapon:switch', { from: 'rifle', to: 'pistol', phase: 'draw' }),
          rn >= 4 &&
            rn < 6.6 &&
            !ie.bare &&
            (Ht % 13 === 0 && Ie.emit('enemy:fire', { enemy: Ye[0], pos: Ye[0].pos, type: 'gull' }),
            Ht % 17 === 0 && Ie.emit('enemy:fire', { enemy: Ye[1], pos: Ye[1].pos, type: 'hound' }),
            Ht % 25 === 0 && Ie.emit('enemy:step', { pos: Ye[1].pos, type: 'hound' })),
          Ht === 330 && Ie.emit('explosion', { pos: { x: 3, y: 0, z: -7 }, size: 2 }),
          Ht === 345 && Ie.emit('explosion', { pos: { x: -6, y: 3, z: -9 }, size: 0.9 }),
          Ht === 350 && Ie.emit('player:hit', { amount: 20 }),
          Ht === 360 &&
            ((Ye[0].alive = !1), Ie.emit('enemy:killed', { enemy: Ye[0], pos: Ye[0].pos, type: 'gull' })),
          Ht === 400 && (Ie.emit('objective:done', { id: 'A', index: 0, total: 3 }), _t.setIntensity(0.15)));
      };
    for (let Ht = 1; Ht * wt < pe - 0.01; Ht++)
      Ee.suspend(Ht * wt).then(() => {
        (Pi(Ht), _t.update(wt), z0++, Ee.resume());
      });
    (Pi(0), _t.update(wt));
    let Lt = performance.now(),
      o0 = await Ee.startRendering(),
      g0 = performance.now() - Lt,
      M0 = {
        interior: !!ie.interior,
        renderMs: Math.round(g0),
        steps: z0,
        peak: 0,
        over: 0,
        nan: 0,
        rmsDb: [],
        shotPeakDb: [],
        shotRmsDb: [],
        bodyRmsDb: [],
        troughDb: [],
        bedRmsDb: 0,
        inst: _t.debug(),
      },
      on = o0.getChannelData(0),
      Tn = o0.getChannelData(1),
      ri = Math.round(ae / 2);
    for (let Ht = 0; Ht * ri < on.length; Ht++) {
      let rn = 0;
      for (let Hi = Ht * ri; Hi < (Ht + 1) * ri && Hi < on.length; Hi++) {
        let Oi = on[Hi],
          uc = Tn[Hi];
        (!(Math.abs(Oi) < 1e9) || !(Math.abs(uc) < 1e9)) && M0.nan++;
        let Wu = Math.max(Math.abs(Oi), Math.abs(uc));
        (Wu > M0.peak && (M0.peak = Wu), Wu >= 0.999 && M0.over++, (rn += Oi * Oi + uc * uc));
      }
      M0.rmsDb.push(+(10 * Math.log10(rn / (2 * ri) + 1e-12)).toFixed(1));
    }
    for (let Ht = 0; Ht < 12; Ht++) {
      let rn = Math.round((3.004 + Ht * 0.08) * ae),
        Hi = rn + Math.round(0.076 * ae),
        Oi = 0,
        uc = 0;
      for (let Br = rn; Br < Hi && Br < on.length; Br++) {
        let Xh = Math.max(Math.abs(on[Br]), Math.abs(Tn[Br]));
        (Xh > Oi && (Oi = Xh), (uc += on[Br] * on[Br]));
      }
      (M0.shotPeakDb.push(+(20 * Math.log10(Oi + 1e-9)).toFixed(1)),
        M0.shotRmsDb.push(+(10 * Math.log10(uc / (Hi - rn) + 1e-12)).toFixed(1)));
      let Wu = (Br, Xh) => {
        let cb = 0;
        for (let Yh = Br; Yh < Xh && Yh < on.length; Yh++) cb += on[Yh] * on[Yh];
        return +(10 * Math.log10(cb / (Xh - Br) + 1e-12)).toFixed(1);
      };
      (M0.bodyRmsDb.push(Wu(rn, rn + Math.round(0.05 * ae))),
        M0.troughDb.push(Wu(rn + Math.round(0.051 * ae), rn + Math.round(0.076 * ae))));
    }
    {
      let Ht = 0,
        rn = Math.round(2 * ae),
        Hi = Math.round(2.95 * ae);
      for (let Oi = rn; Oi < Hi; Oi++) Ht += on[Oi] * on[Oi];
      M0.bedRmsDb = +(10 * Math.log10(Ht / (Hi - rn) + 1e-12)).toFixed(1);
    }
    return ((M0.peak = +M0.peak.toFixed(3)), M0);
  }
  return (
    Object.assign(_e, {
      ctx: e,
      resume: ve,
      play: ke,
      loop: Ke,
      update: we,
      ready: v,
      selfTest: Ae,
      music: Bt,
      setIntensity(ie) {
        fe = ti(+ie || 0, 0, 1);
      },
      setInterior(ie) {
        $ = ti(+ie || 0, 0, 1);
      },
      setVolume(ie) {
        ((ue = ti(+ie, 0, 1)), Number.isFinite(ue) || (ue = 0.9), (w.gain.value = ue));
      },
      setPaused(ie) {
        q = !!ie;
      },
      names: Object.keys(Ir).filter((ie) => !Ir[ie].ir),
      get intensity() {
        return ge;
      },
      get interior() {
        return se;
      },
      debug() {
        let ie = 0,
          ae = e.currentTime;
        for (let pe in le) for (let Ee of le[pe]) Ee.end > ae && ie++;
        return {
          state: e.state,
          sampleRate: e.sampleRate,
          buffers: c,
          queued: d.length,
          genMs: Math.round(l),
          bootMs: Math.round(u),
          voices: ie,
          loops: Ze.size,
          tracked: Sn.size,
          music: Bt.on,
          score: Bt.debug(),
          intensity: +ge.toFixed(2),
          interior: +se.toFixed(2),
          gameState: de,
          reverb: [!!H.buffer, !!N.buffer],
        };
      },
    }),
    _e
  );
}

export { cE };
