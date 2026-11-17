// @ts-nocheck
import * as THREE from 'three';
import { ENEMY_CONFIG } from '../config.js';
import { ar, su } from './core.js';
import { Ei, Tr, bn, th, vt } from './geometry.js';

var ib = {};

ar(ib, { TUNE: () => Bi, create: () => W5, showcase: () => KD });

var Oh = class {
  constructor() {
    ((this.bones = []), (this.index = {}), (this.slots = {}), (this.order = []));
  }
  bone(e, t, i = 0, s = 0, o = 0) {
    let r = t ? this.bones[this.index[t]] : null;
    if (t && !r) throw new Error('rig: unknown parent bone ' + t);
    let a = {
      name: e,
      parent: r ? r.i : -1,
      local: [i, s, o],
      world: [i + (r ? r.world[0] : 0), s + (r ? r.world[1] : 0), o + (r ? r.world[2] : 0)],
      i: this.bones.length,
    };
    return ((this.index[e] = a.i), this.bones.push(a), a);
  }
  add(e, t, i, s = [1, 1, 1], o = !0) {
    let r = this.bones[this.index[t]];
    if (!r) throw new Error('rig: unknown bone ' + t);
    let a = i;
    a.attributes.normal || a.computeVertexNormals();
    for (let p of Object.keys(a.attributes))
      p !== 'position' && p !== 'normal' && p !== 'uv' && a.deleteAttribute(p);
    let l = a.attributes.position.count;
    (a.attributes.uv || a.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(l * 2), 2)),
      a.translate(r.world[0], r.world[1], r.world[2]));
    let c = new Float32Array(l * 3),
      u = new Uint16Array(l * 4),
      f = new Float32Array(l * 4),
      h = a.attributes.normal;
    for (let p = 0; p < l; p++) {
      let d = o ? 0.74 + 0.26 * (h.getY(p) * 0.5 + 0.5) : 1;
      ((c[p * 3] = s[0] * d),
        (c[p * 3 + 1] = s[1] * d),
        (c[p * 3 + 2] = s[2] * d),
        (u[p * 4] = r.i),
        (f[p * 4] = 1));
    }
    return (
      a.setAttribute('color', new THREE.BufferAttribute(c, 3)),
      a.setAttribute('skinIndex', new THREE.BufferAttribute(u, 4)),
      a.setAttribute('skinWeight', new THREE.BufferAttribute(f, 4)),
      this.slots[e] || ((this.slots[e] = []), this.order.push(e)),
      this.slots[e].push(a),
      this
    );
  }
  build(e) {
    let t = (e || this.order).filter((o) => this.slots[o] && this.slots[o].length),
      i = t.map((o) => {
        let r = this.slots[o],
          l = r.some((u) => !u.index) ? r.map((u) => (u.index ? u.toNonIndexed() : u)) : r,
          c = Tr(l, !1);
        return c.index ? c.toNonIndexed() : c;
      }),
      s = Tr(i, !0);
    return (
      s.computeBoundingSphere(),
      s.computeBoundingBox(),
      { geometry: s, slots: t, bones: this.bones, tris: s.attributes.position.count / 3 }
    );
  }
};

function z5(
  n,
  e,
  {
    castShadow: t = !0,
    receiveShadow: i = !0,
    radius: s = 1.5,
    center: o = [0, 0.5, 0],
    extra: r = null,
  } = {},
) {
  let a = n.bones.map((p) => {
    let d = new THREE.Bone();
    return ((d.name = p.name), d.position.set(p.local[0], p.local[1], p.local[2]), d);
  });
  n.bones.forEach((p, d) => {
    p.parent >= 0 && a[p.parent].add(a[d]);
  });
  let l = new THREE.Group(),
    c = new THREE.SkinnedMesh(
      n.geometry,
      n.slots.map((p) => e[p]),
    );
  ((c.castShadow = t),
    (c.receiveShadow = i),
    l.add(c),
    n.bones.forEach((p, d) => {
      p.parent < 0 && c.add(a[d]);
    }),
    l.updateMatrixWorld(!0));
  let u = new THREE.Skeleton(a);
  (c.bind(u),
    (c.boundingSphere = new THREE.Sphere(new THREE.Vector3(o[0], o[1], o[2]), s)),
    (c.boundingBox = new THREE.Box3(
      new THREE.Vector3(o[0] - s, o[1] - s, o[2] - s),
      new THREE.Vector3(o[0] + s, o[1] + s, o[2] + s),
    )));
  let f = {};
  a.forEach((p) => {
    f[p.name] = p;
  });
  let h = { group: l, mesh: c, bones: f, skeleton: u, extraMesh: null };
  if (r) {
    let p = new THREE.SkinnedMesh(
      r.def.geometry,
      r.def.slots.map((d) => e[d]),
    );
    ((p.castShadow = !1),
      (p.receiveShadow = !1),
      (p.renderOrder = 5),
      l.add(p),
      p.updateMatrixWorld(!0),
      p.bind(u, c.bindMatrix),
      (p.boundingSphere = new THREE.Sphere(new THREE.Vector3(o[0], o[1], o[2]), r.radius || s)),
      (p.boundingBox = new THREE.Box3().setFromCenterAndSize(
        p.boundingSphere.center,
        new THREE.Vector3(1, 1, 1).multiplyScalar(2 * (r.radius || s)),
      )),
      (h.extraMesh = p));
  }
  return h;
}

function US(n, e, t, i, s, o, r, a) {
  let l = e * e + t * t,
    c = Math.sqrt(Math.max(l - o * o, 1e-6));
  ((n.abd = Math.atan2(t, e) - Math.atan2(-c, s * o)),
    n.abd > Math.PI ? (n.abd -= 2 * Math.PI) : n.abd < -Math.PI && (n.abd += 2 * Math.PI));
  let u = Math.hypot(c, i),
    f = (r + a) * 0.995,
    h = Math.abs(r - a) + 0.03;
  ((n.reach = u / (r + a)), u > f ? (u = f) : u < h && (u = h));
  let p = Math.atan2(i, c),
    d = (r * r + u * u - a * a) / (2 * r * u),
    m = (r * r + a * a - u * u) / (2 * r * a),
    x = Math.acos(d < -1 ? -1 : d > 1 ? 1 : d),
    v = Math.acos(m < -1 ? -1 : m > 1 ? 1 : m);
  return ((n.hip = x - p), (n.knee = -(Math.PI - v)), n);
}

var Bs = [1.15, 1.15, 1.15],
  F5 = [0.95, 0.96, 0.97],
  Hs = [1, 0.34, 0.08],
  oc = [0.1, 0.11, 0.12],
  rl = [0.035, 0.035, 0.038],
  V1 = [1, 0.7, 0.07],
  Os = [1, 1, 1],
  Bn = [2.4, 2.5, 2.6],
  k0 = [0.45, 0.46, 0.48],
  HD = [9, 9, 9.6],
  OD = [5.5, 4, 1.6],
  al = Math.PI / 2,
  Tt = (n, e, t, i = 0.008) => Ei(n, e, t, i),
  Xe = (n, e, t, i, s = 0, o = 0, r = 0, a = 1) => th(n, { p: [e, t, i], r: [s, o, r], s: a }),
  Ms = (n, e, t, i = 12) => vt(n, e, t, i),
  Uo = (n, e, t, i = 12) => th(vt(n, e, t, i), { r: [0, 0, -al] }),
  ki = (n, e, t, i = 12) => th(vt(n, e, t, i), { r: [al, 0, 0] }),
  D5 = new THREE.Vector3(),
  L5 = new THREE.Vector3(),
  BS = new THREE.Quaternion(),
  VD = new THREE.Vector3(0, 1, 0),
  HS = new THREE.Matrix4(),
  WD = new THREE.Vector3(1, 1, 1);

function Vh(n, e, t, i = t, s = 8) {
  (D5.set(n[0], n[1], n[2]), L5.set(e[0], e[1], e[2]));
  let o = D5.distanceTo(L5),
    r = vt(i, t, o, s);
  return (
    BS.setFromUnitVectors(VD, L5.clone().sub(D5).normalize()),
    HS.compose(D5.clone().add(L5).multiplyScalar(0.5), BS, WD),
    r.applyMatrix4(HS),
    r
  );
}

var ua = (n, e = 14, t = 10, i = 1, s = 1, o = 1) => {
    let r = new THREE.SphereGeometry(n, e, t);
    return (r.scale(i, s, o), r);
  },
  OS = (n, e, t) => Xe(Uo(0.0075, 0.0075, 0.006, 6), n, e, t),
  jy = (n, e, t) => Xe(Ms(0.0075, 0.0075, 0.006, 6), n, e, t),
  GD = (n, e, t) => Xe(ki(0.0075, 0.0075, 0.006, 6), n, e, t),
  Ky = {
    stand: 0.94,
    L1: 0.43,
    L2: 0.41,
    armL1: 0.27,
    armL2: 0.25,
    hipX: 0.105,
    hipY: -0.04,
    shoulderX: 0.2,
    shoulderY: 0.33,
    muzzle: [0, 0.015, 0.58],
    eye: [0, 0.04, 0.12],
    footR: 0.05,
  };

function VS() {
  let n = Ky,
    e = new Oh();
  // Humanoid skeleton hierarchy (+Z forward, +Y up, +X left, -X right)
  (e.bone('root', null, 0, 0, 0),
    e.bone('body', 'root', 0, n.stand, 0), // pelvis / hips
    e.bone('torso', 'body', 0, 0.1, 0), // spine / chest
    e.bone('neck', 'torso', 0, 0.42, 0.01),
    e.bone('head', 'neck', 0, 0.1, 0.01),
    e.bone('turret', 'torso', -0.06, 0.23, 0.15), // rifle carrier mount
    e.bone('gun', 'turret', 0, 0, 0), // AK-47 receiver pivot
    e.bone('shoulderL', 'torso', n.shoulderX, n.shoulderY, 0),
    e.bone('forearmL', 'shoulderL', 0, -n.armL1, 0),
    e.bone('handL', 'forearmL', 0, -n.armL2, 0),
    e.bone('shoulderR', 'torso', -n.shoulderX, n.shoulderY, 0),
    e.bone('forearmR', 'shoulderR', 0, -n.armL1, 0),
    e.bone('handR', 'forearmR', 0, -n.armL2, 0),
    e.bone('thighL', 'body', n.hipX, n.hipY, 0),
    e.bone('shinL', 'thighL', 0, -n.L1, 0),
    e.bone('footL', 'shinL', 0, -n.L2, 0),
    e.bone('thighR', 'body', -n.hipX, n.hipY, 0),
    e.bone('shinR', 'thighR', 0, -n.L1, 0),
    e.bone('footR', 'shinR', 0, -n.L2, 0),
    e.bone('antenna', 'torso', 0, 0.35, -0.14),
    e.bone('beacon', 'torso', 0, 0.35, -0.14));

  let t = (i, s, o, r, a) => e.add(i, s, o, r, a),
    cJacket = [0.34, 0.39, 0.27], // olive drab guerrilla field jacket
    cJacketDark = [0.23, 0.27, 0.19], // darker olive folds / patches
    cJacketSeam = [0.18, 0.21, 0.15],
    cVest = [0.16, 0.155, 0.14], // dark tactical plate carrier / chest rig
    cWebbing = [0.22, 0.2, 0.16], // MOLLE webbing strips
    cPouch = [0.31, 0.27, 0.2], // coyote / khaki mag pouches
    cGrenade = [0.24, 0.31, 0.18], // olive drab M67 frag grenade body
    cBelt = [0.11, 0.11, 0.12], // heavy tactical duty belt / polymer
    cSling = [0.26, 0.22, 0.16], // canvas rifle sling
    cPants = [0.47, 0.42, 0.33], // desert khaki cargo trousers
    cPantsFold = [0.39, 0.35, 0.27],
    cBoot = [0.1, 0.095, 0.09], // black leather/nylon combat boots
    cSole = [0.05, 0.05, 0.055],
    cMask = [0.14, 0.15, 0.165], // ribbed dark charcoal balaclava
    cKeffiyeh = [0.74, 0.19, 0.15], // crimson/red keffiyeh headwrap & scarf
    cKeffiyehBand = [0.86, 0.82, 0.75], // woven white/cream keffiyeh pattern folds
    cSkin = [0.85, 0.64, 0.49], // warm human skin tone (driven by SSS skin shader)
    cSkinShade = [0.74, 0.52, 0.39], // shaded facial contours / knuckles
    cSclera = [0.92, 0.91, 0.89], // human eye sclera
    cIris = [0.14, 0.1, 0.07], // dark brown iris/pupil
    cBrow = [0.11, 0.09, 0.08], // dark eyebrows
    cGlove = [0.13, 0.13, 0.14], // fingerless tactical combat gloves
    cGlovePad = [0.22, 0.2, 0.18],
    cAkSteel = [0.32, 0.34, 0.37],
    cAkDark = [0.17, 0.18, 0.21],
    cAkBolt = [1.22, 1.24, 1.28],
    cAkWood = [1.06, 0.64, 0.34], // laminated AK-47 wood
    cAkBake = [0.74, 0.27, 0.11]; // bakelite grip / mag accent

  // --- 1. PELVIS, HIPS & TACTICAL DUTY BELT ('body') ---
  (t('cloth', 'body', Xe(ua(0.156, 16, 12, 1.14, 0.8, 0.88), 0, 0.008, 0), cPants),
    t('cloth', 'body', Xe(Ms(0.152, 0.162, 0.125, 16), 0, 0.048, 0), cPants),
    // Gluteal & hip contour
    t('cloth', 'body', Xe(ua(0.082, 12, 10, 1.05, 0.95, 0.88), -0.068, -0.005, -0.055), cPantsFold),
    t('cloth', 'body', Xe(ua(0.082, 12, 10, 1.05, 0.95, 0.88), 0.068, -0.005, -0.055), cPantsFold),
    // Untucked guerrilla jacket hem overhanging belt
    t('cloth', 'body', Xe(Ms(0.162, 0.156, 0.065, 16), 0, 0.082, 0), cJacket),
    // Heavy Tactical Duty Belt & belt loops
    t('shell', 'body', Xe(Ms(0.161, 0.161, 0.05, 16), 0, 0.065, 0), cBelt),
    t('metal', 'body', Xe(Tt(0.058, 0.054, 0.024, 0.004), 0, 0.065, 0.142), Bn),
    t('metal', 'body', Xe(Tt(0.024, 0.044, 0.028, 0.003), 0, 0.065, 0.145), cAkDark),
    // Right-hip tactical polymer holster + holstered sidearm grip
    t('shell', 'body', Xe(Tt(0.052, 0.135, 0.088, 0.012), -0.168, -0.02, 0.02, 0.08, 0, 0), cBelt),
    t('shell', 'body', Xe(Tt(0.032, 0.075, 0.045, 0.006), -0.168, 0.055, 0.005, -0.28, 0, 0), cGlove),
    t('metal', 'body', Xe(Tt(0.028, 0.035, 0.08, 0.004), -0.168, 0.048, 0.035, 0.08, 0, 0), cAkSteel),
    // Left-hip utility / IFAK pouch & rear dump pouch + canteen
    t('cloth', 'body', Xe(Tt(0.068, 0.115, 0.082, 0.014), 0.164, 0.04, -0.03), cPouch),
    t('cloth', 'body', Xe(Tt(0.11, 0.11, 0.068, 0.014), -0.045, 0.055, -0.148), cPouch),
    t('shell', 'body', Xe(Ms(0.042, 0.042, 0.11, 10), 0.075, 0.045, -0.142), cJacketDark));

  // --- 2. MUSCULAR V-TAPER TORSO, GUERRILLA JACKET & PLATE CARRIER ('torso') ---
  (t('cloth', 'torso', Vh([0, -0.02, 0], [0, 0.37, 0], 0.148, 0.188, 16), cJacket),
    t('cloth', 'torso', Xe(Tt(0.358, 0.365, 0.215, 0.058), 0, 0.195, 0.005), cJacket),
    // Pectoral & latissimus dorsi muscular shaping under jacket
    t('cloth', 'torso', Xe(ua(0.105, 12, 10, 1.15, 0.85, 0.72), -0.078, 0.255, 0.068), cJacket),
    t('cloth', 'torso', Xe(ua(0.105, 12, 10, 1.15, 0.85, 0.72), 0.078, 0.255, 0.068), cJacket),
    // Center jacket storm flap & zipper seam
    t('cloth', 'torso', Xe(Tt(0.028, 0.35, 0.018, 0.004), 0, 0.19, 0.108), cJacketSeam),
    // Broadened anatomical deltoid shoulder caps + epaulet straps
    t('cloth', 'torso', Xe(ua(0.098, 14, 10, 1.28, 0.88, 0.98), -0.175, 0.332, 0), cJacketDark),
    t('cloth', 'torso', Xe(ua(0.098, 14, 10, 1.28, 0.88, 0.98), 0.175, 0.332, 0), cJacketDark),
    t('cloth', 'torso', Xe(Tt(0.085, 0.018, 0.042, 0.005), -0.145, 0.382, 0, 0, 0, 0.18), cPouch),
    t('cloth', 'torso', Xe(Tt(0.085, 0.018, 0.042, 0.005), 0.145, 0.382, 0, 0, 0, -0.18), cPouch),
    // Sculpted multi-fold Keffiyeh / Shemagh scarf draped around collar & upper chest
    t('cloth', 'torso', Xe(new THREE.TorusGeometry(0.126, 0.044, 12, 20), 0, 0.386, 0.015, al + 0.14, 0, 0), cKeffiyeh),
    t('cloth', 'torso', Xe(new THREE.TorusGeometry(0.118, 0.028, 10, 18), 0, 0.358, 0.028, al + 0.22, 0.12, 0), cKeffiyehBand),
    t('cloth', 'torso', Xe(Tt(0.17, 0.125, 0.048, 0.018), 0, 0.315, 0.112, 0.22, 0, 0), cKeffiyeh),
    t('cloth', 'torso', Xe(Tt(0.12, 0.095, 0.038, 0.014), 0.025, 0.285, 0.118, 0.18, 0, -0.15), cKeffiyehBand),
    // Tactical Plate Carrier / Chest Rig (front & back ballistic plates + cummerbund)
    t('cloth', 'torso', Xe(Tt(0.308, 0.285, 0.238, 0.032), 0, 0.175, 0.01), cVest),
    t('shell', 'torso', Xe(Tt(0.25, 0.24, 0.032, 0.012), 0, 0.185, 0.118), cVest),
    // Padded shoulder harness straps
    t('cloth', 'torso', Xe(Tt(0.062, 0.145, 0.225, 0.014), -0.106, 0.322, 0.005), cVest),
    t('cloth', 'torso', Xe(Tt(0.062, 0.145, 0.225, 0.014), 0.106, 0.322, 0.005), cVest),
    // Diagonal canvas rifle sling across torso
    t('cloth', 'torso', Vh([0.135, 0.36, 0.105], [-0.145, 0.04, 0.125], 0.018, 0.018, 6), cSling),
    t('cloth', 'torso', Vh([0.135, 0.36, -0.105], [-0.145, 0.04, -0.115], 0.018, 0.018, 6), cSling));

  // Horizontal MOLLE webbing rows on chest rig
  for (let r = 0; r < 3; r++) {
    t('cloth', 'torso', Xe(Tt(0.24, 0.016, 0.012, 0.003), 0, 0.225 + r * 0.032, 0.132), cWebbing);
  }

  // 3 Front AK-47 Magazine Pouches with exposed curved steel mags & pull-tabs
  for (let i = -1; i <= 1; i++) {
    let px = i * 0.082;
    (t('cloth', 'torso', Xe(Tt(0.068, 0.138, 0.05, 0.01), px, 0.122, 0.14, -0.05, 0, i * 0.04), cPouch),
      t('cloth', 'torso', Xe(Tt(0.072, 0.042, 0.054, 0.008), px, 0.178, 0.142), cJacketDark),
      t('metal', 'torso', Xe(Tt(0.046, 0.034, 0.026, 0.004), px, 0.202, 0.136, 0, 0, i * 0.05), cAkBake),
      t('cloth', 'torso', Xe(Tt(0.016, 0.022, 0.018, 0.003), px, 0.22, 0.138), cBelt));
  }

  // 2 M67 Fragmentation Grenades clipped on upper chest rig
  for (let gSide of [-1, 1]) {
    let gx = gSide * 0.095,
      gy = 0.255,
      gz = 0.142;
    (t('metal', 'torso', Xe(ua(0.026, 10, 8, 0.95, 1.12, 0.95), gx, gy, gz), cGrenade),
      t('metal', 'torso', Xe(Ms(0.01, 0.012, 0.018, 8), gx, gy + 0.03, gz), Bn),
      t('metal', 'torso', Xe(Tt(0.008, 0.038, 0.016, 0.002), gx + gSide * 0.012, gy + 0.012, gz + 0.012, 0.2, 0, 0), cAkSteel),
      t('metal', 'torso', Xe(new THREE.TorusGeometry(0.009, 0.002, 6, 10), gx - gSide * 0.01, gy + 0.032, gz + 0.01), cAkBolt));
  }

  // Angled Combat Knife & Sheath on chest rig + Tactical Radio on left shoulder + Rear Assault Pack
  (t('shell', 'torso', Xe(Tt(0.028, 0.12, 0.018, 0.004), -0.025, 0.265, 0.136, 0, 0, 0.52), cBelt),
    t('shell', 'torso', Xe(Tt(0.024, 0.068, 0.02, 0.004), -0.065, 0.325, 0.138, 0, 0, 0.52), cGlove),
    t('metal', 'torso', Xe(Tt(0.038, 0.01, 0.022, 0.002), -0.046, 0.296, 0.138, 0, 0, 0.52), Bn),
    // Tactical VHF Radio + flexible whip antenna on left shoulder
    t('shell', 'torso', Xe(Tt(0.046, 0.082, 0.034, 0.006), 0.11, 0.285, 0.118), cBelt),
    t('metal', 'torso', Vh([0.118, 0.325, 0.118], [0.132, 0.46, 0.085], 0.0035, 0.0018, 6), cAkDark),
    // Back tactical hydration / assault pack with straps
    t('cloth', 'torso', Xe(Tt(0.245, 0.275, 0.088, 0.024), 0, 0.195, -0.138), cPouch),
    t('cloth', 'torso', Xe(Tt(0.21, 0.12, 0.045, 0.014), 0, 0.145, -0.182), cJacketDark),
    t('shell', 'torso', Xe(Tt(0.22, 0.022, 0.092, 0.004), 0, 0.24, -0.142), cBelt));

  // --- 3. HUMAN NECK & ANATOMICAL HEAD ('neck', 'head') ---
  // Exposed muscular neck skin & sternocleidomastoid contour above balaclava collar
  (t('cloth', 'neck', Vh([0, -0.025, 0], [0, 0.065, 0.008], 0.068, 0.062, 14), cMask),
    t('skin', 'neck', Vh([0, 0.045, 0.006], [0, 0.105, 0.012], 0.061, 0.058, 14), cSkin),
    // Cranium, jaw & chin in dark knitted balaclava
    t('cloth', 'head', Xe(ua(0.108, 18, 14, 0.94, 1.12, 1.03), 0, 0.066, 0), cMask),
    t('cloth', 'head', Xe(Tt(0.142, 0.108, 0.138, 0.036), 0, 0.014, 0.018), cMask),
    t('cloth', 'head', Xe(ua(0.052, 12, 10, 1.15, 0.82, 1.1), 0, -0.018, 0.052), cMask),
    // Balaclava mouth/nose fabric breathing vent relief
    t('cloth', 'head', Xe(Tt(0.068, 0.046, 0.026, 0.008), 0, 0.012, 0.088, 0.12, 0, 0), cBelt),
    // Anatomical Human Face Inside Balaclava Eye-Opening:
    // Forehead / brow ridge, upper cheekbones, and sculpted nose bridge
    t('skin', 'head', Xe(Tt(0.128, 0.046, 0.052, 0.014), 0, 0.068, 0.078), cSkin),
    t('skin', 'head', Xe(Tt(0.132, 0.018, 0.036, 0.007), 0, 0.086, 0.094, 0.12, 0, 0), cSkinShade),
    t('skin', 'head', Xe(ua(0.034, 10, 8, 1.15, 0.65, 0.8), -0.042, 0.052, 0.088), cSkinShade),
    t('skin', 'head', Xe(ua(0.034, 10, 8, 1.15, 0.65, 0.8), 0.042, 0.052, 0.088), cSkinShade),
    t('skin', 'head', Xe(Tt(0.024, 0.04, 0.034, 0.008), 0, 0.062, 0.104, -0.24, 0, 0), cSkin),
    // Realistic Human Eyes (Sclera, Dark Iris/Pupil, Upper Eyelids & Angled Eyebrows)
    t('shell', 'head', Xe(ua(0.0145, 10, 8, 1.25, 0.82, 0.65), -0.034, 0.069, 0.098), cSclera, !1),
    t('shell', 'head', Xe(ua(0.0145, 10, 8, 1.25, 0.82, 0.65), 0.034, 0.069, 0.098), cSclera, !1),
    t('metal', 'head', Xe(ua(0.0078, 8, 6, 1.05, 1.05, 0.55), -0.033, 0.069, 0.1055), cIris, !1),
    t('metal', 'head', Xe(ua(0.0078, 8, 6, 1.05, 1.05, 0.55), 0.033, 0.069, 0.1055), cIris, !1),
    t('skin', 'head', Xe(Tt(0.032, 0.009, 0.018, 0.003), -0.034, 0.076, 0.1, 0.1, 0, -0.08), cSkinShade),
    t('skin', 'head', Xe(Tt(0.032, 0.009, 0.018, 0.003), 0.034, 0.076, 0.1, 0.1, 0, 0.08), cSkinShade),
    t('cloth', 'head', Xe(Tt(0.036, 0.008, 0.014, 0.002), -0.035, 0.083, 0.102, 0, 0, -0.14), cBrow),
    t('cloth', 'head', Xe(Tt(0.036, 0.008, 0.014, 0.002), 0.035, 0.083, 0.102, 0, 0, 0.14), cBrow),
    // Balaclava eye-hole rim trim
    t('cloth', 'head', Xe(Tt(0.136, 0.012, 0.032, 0.004), 0, 0.044, 0.094), cMask),
    // Keffiyeh / Shemagh Headwrap Crown, Forehead Fold & Dual Black Agal Cords
    t('cloth', 'head', Xe(ua(0.118, 18, 14, 0.99, 0.88, 1.08), 0, 0.102, -0.008), cKeffiyeh),
    t('cloth', 'head', Xe(Tt(0.152, 0.034, 0.12, 0.012), 0, 0.102, 0.042, 0.12, 0, 0), cKeffiyehBand),
    t('shell', 'head', Xe(new THREE.TorusGeometry(0.109, 0.016, 10, 20), 0, 0.118, -0.002, al - 0.12, 0, 0), cBelt),
    t('shell', 'head', Xe(new THREE.TorusGeometry(0.111, 0.013, 10, 20), 0, 0.098, 0.002, al - 0.12, 0, 0), cBelt),
    // Heavy Ballistic Goggles pushed up onto Forehead Wrap
    t('shell', 'head', Xe(Tt(0.146, 0.044, 0.036, 0.008), 0, 0.128, 0.086, -0.22, 0, 0), cBelt),
    t('lens', 'head', Xe(Tt(0.056, 0.03, 0.014, 0.004), -0.036, 0.128, 0.101, -0.22, 0, 0), [0.18, 0.2, 0.22], !1),
    t('lens', 'head', Xe(Tt(0.056, 0.03, 0.014, 0.004), 0.036, 0.128, 0.101, -0.22, 0, 0), [0.18, 0.2, 0.22], !1),
    // Draped Keffiyeh side tails & back folds
    t('cloth', 'head', Vh([-0.098, 0.075, -0.015], [-0.116, -0.075, -0.035], 0.038, 0.048, 10), cKeffiyeh),
    t('cloth', 'head', Vh([0.098, 0.075, -0.015], [0.116, -0.075, -0.035], 0.038, 0.048, 10), cKeffiyeh),
    t('cloth', 'head', Xe(Tt(0.16, 0.13, 0.045, 0.016), 0, 0.025, -0.098, 0.18, 0, 0), cKeffiyehBand));

  // --- 4. ARMS, ROLLED SLEEVES, BARE MUSCULAR FOREARMS & 5-FINGERED HANDS ---
  for (let side of [1, -1]) {
    let sKey = side > 0 ? 'L' : 'R',
      sh = 'shoulder' + sKey,
      fa = 'forearm' + sKey,
      ha = 'hand' + sKey;
    // Upper arm jacket sleeve + bicep/tricep + tactical velcro patch + rolled sleeve cuff at elbow
    (t('cloth', sh, Xe(ua(0.064, 12, 10), 0, 0, 0), cJacket),
      t('cloth', sh, Vh([0, 0, 0], [0, -n.armL1 * 0.88, 0], 0.06, 0.052, 14), cJacket),
      t('cloth', sh, Xe(Tt(0.026, 0.095, 0.072, 0.008), side * 0.05, -0.105, 0), cJacketDark),
      t('cloth', sh, Xe(Tt(0.012, 0.055, 0.046, 0.003), side * 0.06, -0.105, 0), cKeffiyeh),
      // Rolled-up guerrilla jacket cuff just above elbow
      t('cloth', sh, Xe(new THREE.TorusGeometry(0.05, 0.018, 10, 16), 0, -n.armL1 * 0.86, 0, al, 0, 0), cJacketDark),
      t('skin', sh, Xe(ua(0.047, 10, 8), 0, -n.armL1, 0), cSkin),
      // Bare muscular human forearm (brachioradialis muscle belly tapering to wrist)
      t('skin', fa, Vh([0, 0, 0], [0, -n.armL2 * 0.52, 0], 0.048, 0.042, 14), cSkin),
      t('skin', fa, Vh([0, -n.armL2 * 0.48, 0], [0, -n.armL2 * 0.88, 0], 0.042, 0.033, 12), cSkin),
      t('skin', fa, Xe(ua(0.032, 10, 8, 0.85, 1.35, 1.05), side * 0.01, -n.armL2 * 0.28, 0.012), cSkinShade));
    // Tactical wristwatch on left wrist
    if (side > 0) {
      (t('shell', fa, Xe(Ms(0.036, 0.036, 0.022, 12), 0, -n.armL2 * 0.8, 0), cBelt),
        t('metal', fa, Xe(Tt(0.028, 0.026, 0.012, 0.003), 0.026, -n.armL2 * 0.8, 0.01, 0, 0, -al), cAkDark));
    }
    // Fingerless tactical glove wrist strap, palm & molded knuckle guard
    (t('cloth', fa, Xe(Ms(0.037, 0.036, 0.034, 12), 0, -n.armL2 + 0.014, 0), cGlove),
      t('cloth', ha, Xe(Tt(0.044, 0.056, 0.072, 0.012), 0, -0.018, 0.014), cGlove),
      t('shell', ha, Xe(Tt(0.046, 0.018, 0.058, 0.005), side * 0.016, -0.022, 0.018), cGlovePad),
      // Exposed human thumb (proximal + distal phalanx wrapped around grip)
      t('skin', ha, Xe(Tt(0.018, 0.028, 0.024, 0.006), -side * 0.022, -0.002, 0.028, 0.35, side * 0.25, 0), cSkin),
      t('skin', ha, Xe(Tt(0.016, 0.024, 0.022, 0.005), -side * 0.018, 0.008, 0.046, 0.65, side * 0.4, 0), cSkinShade));
    // 4 Individual Articulated Human Fingers (Index, Middle, Ring, Little) curled around AK-47
    for (let fIdx = 0; fIdx < 4; fIdx++) {
      let fz = -0.008 + fIdx * 0.016,
        fLen = fIdx === 1 ? 0.032 : fIdx === 3 ? 0.025 : 0.029;
      // Gloved proximal knuckle base + bare proximal/middle/distal curled phalanges
      (t('cloth', ha, Xe(Tt(0.018, 0.02, 0.014, 0.004), side * 0.008, -0.042, fz + 0.02), cGlove),
        t('skin', ha, Xe(Tt(0.016, fLen, 0.014, 0.004), side * 0.004, -0.056, fz + 0.032, -0.55, 0, side * 0.35), cSkin),
        t('skin', ha, Xe(Tt(0.014, fLen * 0.82, 0.013, 0.004), -side * 0.01, -0.06, fz + 0.044, -1.15, 0, side * 0.85), cSkinShade));
    }
  }

  // --- 5. LEGS, BAGGED CARGO TROUSERS, CONTOURED KNEE PADS & LACED COMBAT BOOTS ---
  for (let side of [1, -1]) {
    let sKey = side > 0 ? 'L' : 'R',
      thB = 'thigh' + sKey,
      shB = 'shin' + sKey,
      ftB = 'foot' + sKey;
    // Muscular thigh cargo trousers + bellowed side cargo pocket with flap + thigh tie strap
    (t('cloth', thB, Xe(ua(0.09, 14, 10), 0, 0, 0), cPants),
      t('cloth', thB, Vh([0, 0, 0], [0, -n.L1, 0], 0.09, 0.07, 14), cPants),
      t('cloth', thB, Xe(ua(0.065, 10, 8, 0.9, 1.6, 1.05), 0, -0.18, 0.022), cPants),
      t('cloth', thB, Xe(Tt(0.04, 0.165, 0.125, 0.012), side * 0.078, -0.21, 0.005), cPantsFold),
      t('cloth', thB, Xe(Tt(0.044, 0.042, 0.13, 0.008), side * 0.08, -0.14, 0.005), cJacketDark),
      t('shell', thB, Xe(Ms(0.082, 0.08, 0.024, 12), 0, -0.19, 0), cBelt),
      t('cloth', thB, Xe(ua(0.068, 12, 10), 0, -n.L1, 0), cPants),
      // Shin + contoured hard-shell tactical knee pad with dual elastic straps
      t('cloth', shB, Xe(Tt(0.1, 0.125, 0.052, 0.016), 0, -0.032, 0.042), cPouch),
      t('shell', shB, Xe(Tt(0.088, 0.095, 0.042, 0.014), 0, -0.032, 0.056), cBelt),
      t('shell', shB, Xe(Ms(0.069, 0.068, 0.018, 12), 0, -0.008, 0), cBelt),
      t('shell', shB, Xe(Ms(0.066, 0.065, 0.018, 12), 0, -0.058, 0), cBelt),
      // Baggy bloused lower trouser leg gathered above combat boot
      t('cloth', shB, Vh([0, 0, 0], [0, -n.L2 * 0.72, 0], 0.068, 0.058, 14), cPants),
      t('cloth', shB, Xe(new THREE.TorusGeometry(0.052, 0.016, 8, 14), 0, -n.L2 * 0.7, 0, al, 0, 0), cPantsFold),
      // High-top laced combat boot shaft & padded collar
      t('shell', shB, Vh([0, -n.L2 * 0.68, 0], [0, -n.L2, 0], 0.056, 0.049, 12), cBoot),
      t('cloth', shB, Xe(Tt(0.042, 0.11, 0.025, 0.006), 0, -n.L2 * 0.84, 0.046), cGlovePad),
      // Combat boot foot, reinforced toe cap, heel counter & deep lugged sole
      t('shell', ftB, Xe(Tt(0.098, 0.07, 0.215, 0.022), 0, -0.022, 0.044), cBoot),
      t('shell', ftB, Xe(ua(0.05, 12, 8, 1, 0.74, 1.38), 0, -0.025, 0.118), cBoot),
      t('shell', ftB, Xe(Tt(0.1, 0.058, 0.065, 0.014), 0, -0.02, -0.035), cBoot),
      t('shell', ftB, Xe(Tt(0.104, 0.026, 0.236, 0.006), 0, -0.048, 0.046), cSole));
  }

  // --- 6. HIGH-DETAIL WORLD AK-47 ASSAULT RIFLE ON 'gun' BONE (+Z is forward) ---
  // Stamped steel receiver (-0.09 .. +0.12 in Z) + mag-well dimples + selector lever
  (t('metal', 'gun', Xe(Tt(0.038, 0.052, 0.22, 0.006), 0, -0.004, 0.015), cAkDark),
    t('metal', 'gun', Xe(Tt(0.041, 0.016, 0.048, 0.003), 0, -0.012, 0.062), cAkSteel),
    t('metal', 'gun', Xe(Tt(0.006, 0.014, 0.095, 0.002), -0.021, -0.002, 0.01, -0.08, 0, 0), cAkSteel),
    // Ribbed top dust cover & recoil spring guide button at rear
    t('metal', 'gun', Xe(Tt(0.036, 0.026, 0.2, 0.008), 0, 0.024, 0.01), cAkSteel),
    t('metal', 'gun', Xe(Tt(0.014, 0.014, 0.014, 0.003), 0, 0.02, -0.092), cAkSteel),
    // Polished steel bolt carrier & charging handle on right side (-X)
    t('metal', 'gun', Xe(Tt(0.012, 0.018, 0.075, 0.003), -0.016, 0.016, 0.045), cAkBolt),
    t('metal', 'gun', Xe(Uo(0.006, 0.006, 0.026, 8), -0.028, 0.018, 0.068), cAkBolt),
    // Classic angled laminated wooden AK-47 buttstock (-0.09 .. -0.34 in Z) + steel buttplate & sling loop
    t('wood', 'gun', Vh([0, -0.008, -0.09], [0, -0.058, -0.32], 0.024, 0.036, 10), cAkWood),
    t('wood', 'gun', Xe(Tt(0.034, 0.088, 0.065, 0.008), 0, -0.062, -0.305), cAkWood),
    t('metal', 'gun', Xe(Tt(0.036, 0.092, 0.014, 0.003), 0, -0.062, -0.338), cAkDark),
    t('metal', 'gun', Xe(new THREE.TorusGeometry(0.008, 0.002, 6, 10), 0.019, -0.082, -0.295), cAkSteel),
    // Checkered Bakelite pistol grip at z = -0.048, y = -0.072 (target for right hand!) + grip ferrule
    t('metal', 'gun', Xe(Tt(0.032, 0.014, 0.044, 0.003), 0, -0.028, -0.036), cAkSteel),
    t('shell', 'gun', Xe(Tt(0.03, 0.105, 0.042, 0.008), 0, -0.072, -0.048, -0.28, 0, 0), cAkBake),
    // Trigger guard, mag release paddle & curved steel trigger
    t('metal', 'gun', Xe(Tt(0.018, 0.028, 0.045, 0.003), 0, -0.04, -0.005), cAkDark),
    t('metal', 'gun', Xe(Tt(0.006, 0.022, 0.008, 0.002), 0, -0.038, -0.008, 0.35, 0, 0), cAkBolt),
    t('metal', 'gun', Xe(Tt(0.018, 0.022, 0.01, 0.002), 0, -0.036, 0.024, -0.2, 0, 0), cAkSteel),
    // Iconic curved 30-round AK-47 banana magazine with stamped reinforcing ribs
    t('metal', 'gun', Xe(Tt(0.028, 0.11, 0.058, 0.006), 0, -0.075, 0.072, 0.24, 0, 0), cAkBake),
    t('metal', 'gun', Xe(Tt(0.031, 0.095, 0.012, 0.002), 0, -0.08, 0.085, 0.24, 0, 0), cAkDark),
    t('metal', 'gun', Xe(Tt(0.027, 0.11, 0.056, 0.006), 0, -0.16, 0.112, 0.52, 0, 0), cAkBake),
    t('metal', 'gun', Xe(Tt(0.03, 0.095, 0.012, 0.002), 0, -0.162, 0.125, 0.52, 0, 0), cAkDark),
    t('metal', 'gun', Xe(Tt(0.031, 0.018, 0.062, 0.004), 0, -0.208, 0.142, 0.56, 0, 0), cAkDark),
    // Wooden Lower & Upper Handguards (+0.12 .. +0.29 in Z, target for left hand at z=+0.205!) + vent slots
    t('wood', 'gun', Xe(Tt(0.042, 0.042, 0.175, 0.01), 0, -0.01, 0.208), cAkWood),
    t('wood', 'gun', Xe(Tt(0.034, 0.026, 0.155, 0.008), 0, 0.022, 0.205), cAkWood),
    t('metal', 'gun', Xe(Tt(0.038, 0.01, 0.055, 0.002), 0, 0.01, 0.205), cAkDark),
    t('metal', 'gun', Xe(Tt(0.044, 0.046, 0.014, 0.003), 0, 0.004, 0.298), cAkDark),
    // Rear tangent sight block & leaf
    t('metal', 'gun', Xe(Tt(0.028, 0.024, 0.052, 0.004), 0, 0.034, 0.125), cAkSteel),
    t('metal', 'gun', Xe(Tt(0.022, 0.008, 0.046, 0.002), 0, 0.047, 0.125), cAkBolt),
    // 7.62mm Rifled Barrel (+0.12 .. +0.58 in Z) & Gas Tube (+0.14 .. +0.37 in Z)
    t('metal', 'gun', Xe(ki(0.011, 0.011, 0.46, 12), 0, 0.002, 0.35), cAkSteel),
    t('metal', 'gun', Xe(ki(0.0095, 0.0095, 0.22, 10), 0, 0.024, 0.255), cAkDark),
    // Cleaning rod under barrel
    t('metal', 'gun', Xe(ki(0.0035, 0.0035, 0.38, 6), 0, -0.012, 0.34), cAkDark),
    // 45-degree gas block
    t('metal', 'gun', Xe(Tt(0.022, 0.038, 0.034, 0.004), 0, 0.014, 0.365, -0.35, 0, 0), cAkSteel),
    // Classic AK-47 Triangular Front Sight Post & Protective Ears at z = +0.525
    t('metal', 'gun', Xe(Tt(0.02, 0.048, 0.03, 0.004), 0, 0.022, 0.522, -0.18, 0, 0), cAkDark),
    t('metal', 'gun', Xe(Tt(0.024, 0.018, 0.022, 0.003), 0, 0.046, 0.525), cAkDark),
    // Slant Muzzle Brake at z = +0.57
    t('metal', 'gun', Xe(ki(0.013, 0.013, 0.042, 10), 0, 0.002, 0.568), cAkDark));

  return e.build(['cloth', 'skin', 'shell', 'metal', 'wood', 'glow', 'lens']);
}

var N5 = {
  rotors: [
    [0.33, 0.035, 0.3],
    [-0.33, 0.035, 0.3],
    [0.33, 0.035, -0.3],
    [-0.33, 0.035, -0.3],
  ],
  gimbal: [0, -0.095, 0.275],
  ball: [0, -0.072, 0],
  gun: [0, -0.085, -0.1],
  muzzle: [0, -0.032, 0.27],
  lamp: [0, -0.066, 0.025],
};

function qD() {
  let n = [
    [0.176, -0.036],
    [0.196, -0.032],
    [0.206, 0],
    [0.202, 0.03],
    [0.19, 0.04],
    [0.178, 0.032],
    [0.173, 0],
    [0.176, -0.036],
  ].map((e) => new THREE.Vector2(e[0], e[1]));
  return new THREE.LatheGeometry(n, 28);
}

function WS() {
  let n = N5,
    e = new Oh(),
    t = new Oh(),
    i = (l, c, u, f, h) => {
      (e.bone(l, c, u, f, h), t.bone(l, c, u, f, h));
    };
  (i('root', null, 0, 0, 0), i('body', 'root', 0, 0, 0));
  for (let l = 0; l < 4; l++) i('rotor' + l, 'body', n.rotors[l][0], n.rotors[l][1], n.rotors[l][2]);
  (i('gimbalYaw', 'body', n.gimbal[0], n.gimbal[1], n.gimbal[2]),
    i('ball', 'gimbalYaw', n.ball[0], n.ball[1], n.ball[2]),
    i('lamp', 'ball', n.lamp[0], n.lamp[1], n.lamp[2]),
    i('gun', 'body', n.gun[0], n.gun[1], n.gun[2]),
    i('strobeG', 'body', 0, 0, 0),
    i('strobeR', 'body', 0, 0, 0),
    i('strobeW', 'body', 0, 0, 0));
  let s = (l, c, u, f, h) => e.add(l, c, u, f, h);
  (s('shell', 'body', Xe(ua(1, 20, 12, 0.118, 0.074, 0.27), 0, 0.02, 0), Bs),
    s('shell', 'body', Xe(vt(1, 0.9, 1, 20), 0, 0.02, 0.165, al, 0, 0, [0.094, 0.05, 0.06]), Hs),
    s('shell', 'body', Xe(vt(1, 1, 1, 20), 0, 0.02, -0.02, al, 0, 0, [0.121, 0.012, 0.0765]), oc),
    s('shell', 'body', Xe(Tt(0.118, 0.014, 0.2, 0.005), 0, 0.089, -0.03), F5),
    s('shell', 'body', Xe(Tt(0.03, 0.006, 0.2, 0.002), 0, 0.0975, -0.03), Hs));
  for (let l of [-0.05, 0.05]) for (let c of [-0.12, 0.06]) s('metal', 'body', jy(l, 0.097, c), Bn);
  (s('metal', 'body', Xe(Tt(0.175, 0.06, 0.37, 0.016), 0, -0.035, -0.005), k0),
    s('metal', 'body', Xe(Tt(0.12, 0.075, 0.11, 0.014), 0, 0.005, -0.265), Os),
    s('shell', 'body', Xe(Tt(0.124, 0.02, 0.03, 0.005), 0, 0.03, -0.3), Hs),
    s('glow', 'body', Xe(Tt(0.05, 0.006, 0.003, 0.001), 0, 0, -0.321), [0.3, 1.6, 0.4], !1));
  for (let l of [1, -1]) {
    for (let c = 0; c < 4; c++)
      s(
        'metal',
        'body',
        Xe(Tt(0.004, 0.01, 0.06, 0.001), l * 0.0885, -0.045 + c * 0.016, -0.06),
        [0.2, 0.2, 0.2],
      );
    s(
      'metal',
      'body',
      bn(
        [
          [l * 0.075, -0.055, 0.13],
          [l * 0.135, -0.175, 0.16],
          [l * 0.135, -0.192, 0.11],
          [l * 0.135, -0.192, -0.14],
          [l * 0.135, -0.175, -0.19],
          [l * 0.075, -0.055, -0.15],
        ],
        0.0085,
        6,
        !1,
        0.5,
      ),
      Bn,
    );
    for (let c of [0.07, -0.1]) s('shell', 'body', Xe(ki(0.0135, 0.0135, 0.07, 8), l * 0.135, -0.192, c), rl);
    (s('metal', 'body', Vh([l * 0.04, 0.07, -0.17], [l * 0.085, 0.37, -0.27], 0.004, 0.002, 5), k0),
      s('metal', 'body', Xe(Ms(0.008, 0.01, 0.025, 6), l * 0.04, 0.078, -0.17), Bn));
  }
  (s('metal', 'body', Xe(Ms(0.007, 0.007, 0.04, 6), 0, 0.105, 0.1), Bn),
    s('shell', 'body', Xe(Ms(0.034, 0.036, 0.018, 14), 0, 0.132, 0.1), Bs),
    s('metal', 'body', Xe(Tt(0.07, 0.03, 0.09, 0.008), 0, -0.075, 0.235), Os));
  let o = qD();
  for (let l = 0; l < 4; l++) {
    let [c, u, f] = n.rotors[l],
      h = Math.sign(c),
      p = Math.sign(f);
    (s('metal', 'body', Vh([h * 0.07, 0, p * 0.09], [c, u - 0.05, f], 0.017, 0.015, 8), k0),
      s('shell', 'body', Xe(Tt(0.07, 0.045, 0.07, 0.014), h * 0.085, 0, p * 0.1, 0, h * p * 0.74, 0), Bs),
      s(
        'shell',
        'body',
        bn(
          [
            [h * 0.09, 0.02, p * 0.12],
            [h * 0.18, 0.012, p * 0.19],
            [c - h * 0.05, u - 0.03, f - p * 0.04],
          ],
          0.005,
          5,
        ),
        rl,
      ),
      s('metal', 'body', Xe(Ms(0.04, 0.03, 0.075, 12), c, u - 0.05, f), k0),
      s('metal', 'body', Xe(Ms(0.042, 0.042, 0.012, 12), c, u - 0.02, f), Bn),
      s('shell', 'body', Xe(o.clone(), c, u, f), Bs),
      s('shell', 'body', Xe(new THREE.TorusGeometry(0.196, 0.0085, 6, 28), c, u + 0.036, f, al, 0, 0), Hs));
    for (let m = 0; m < 3; m++) {
      let x = m * 2.094 + 0.5 + l;
      s(
        'metal',
        'body',
        Xe(
          Tt(0.145, 0.007, 0.016, 0.002),
          c + Math.cos(x) * 0.105,
          u - 0.022,
          f - Math.sin(x) * 0.105,
          0,
          x,
          0,
        ),
        k0,
      );
    }
    for (let m = -1; m <= 1; m++) {
      let x = Math.atan2(p, h) + m * 0.2;
      s(
        'shell',
        'body',
        Xe(Tt(0.012, 0.05, 0.036, 0.003), c + Math.cos(x) * 0.205, u, f + Math.sin(x) * 0.205, 0, -x, 0),
        m === 0 ? oc : V1,
      );
    }
    (s('metal', 'rotor' + l, Xe(Ms(0.017, 0.02, 0.03, 8), 0, -0.002, 0), Bn),
      s('metal', 'rotor' + l, Xe(Tt(0.158, 0.0035, 0.03, 0.001), 0.088, 0.008, 0, 0.22, 0, 0), k0),
      s('metal', 'rotor' + l, Xe(Tt(0.158, 0.0035, 0.03, 0.001), -0.088, 0.008, 0, -0.22, 0, 0), k0),
      s('shell', 'rotor' + l, Xe(Tt(0.02, 0.004, 0.031, 0.001), 0.158, 0.008, 0, 0.22, 0, 0), V1),
      s('shell', 'rotor' + l, Xe(Tt(0.02, 0.004, 0.031, 0.001), -0.158, 0.008, 0, -0.22, 0, 0), V1));
    let d = new THREE.RingGeometry(0.03, 0.168, 24, 1);
    (d.rotateX(-al), t.add('disc', 'body', Xe(d, c, u + 0.008, f), [1, 1, 1], !1));
  }
  (s('glow', 'strobeR', Xe(ua(0.012, 8, 6), 0.33 + 0.215, 0.035, 0.3), [10, 0.4, 0.2], !1),
    s('glow', 'strobeR', Xe(ua(0.012, 8, 6), 0.33 + 0.215, 0.035, -0.3), [10, 0.4, 0.2], !1),
    s('glow', 'strobeG', Xe(ua(0.012, 8, 6), -0.33 - 0.215, 0.035, 0.3), [0.3, 9, 1], !1),
    s('glow', 'strobeG', Xe(ua(0.012, 8, 6), -0.33 - 0.215, 0.035, -0.3), [0.3, 9, 1], !1),
    s('glow', 'strobeW', Xe(ua(0.011, 8, 6), 0, 0.05, -0.325), [9, 9, 9], !1),
    s('metal', 'gimbalYaw', Xe(Ms(0.036, 0.036, 0.014, 12), 0, -0.004, 0), k0),
    s('metal', 'gimbalYaw', Xe(Tt(0.156, 0.01, 0.03, 0.003), 0, -0.014, 0), Os));
  for (let l of [1, -1]) s('metal', 'gimbalYaw', Xe(Tt(0.009, 0.075, 0.03, 0.003), l * 0.0735, -0.05, 0), Os);
  (s('metal', 'ball', Xe(ua(0.06, 18, 12), 0, 0, 0), k0),
    s('metal', 'ball', Xe(Uo(0.013, 0.013, 0.142, 8), 0, 0, 0), Bn),
    s('metal', 'ball', Xe(ki(0.031, 0.036, 0.03, 14), 0, 0.004, 0.048), Os),
    s('lens', 'ball', Xe(ki(0.025, 0.025, 0.004, 14), 0, 0.004, 0.0645), [1, 1, 1], !1),
    s('metal', 'ball', Xe(ki(0.012, 0.012, 0.01, 8), 0.03, 0.036, 0.04), [0.1, 0.12, 0.2]),
    s('metal', 'ball', Xe(ki(0.019, 0.023, 0.045, 10), n.lamp[0], n.lamp[1], n.lamp[2] - 0.022), k0),
    s('glow', 'lamp', Xe(ki(0.016, 0.016, 0.003, 10), 0, 0, 0.001), [11, 9.8, 7.6], !1));
  {
    let u = new THREE.ConeGeometry(1.25, 9, 20, 6, !0);
    (u.translate(0, -9 / 2, 0), u.rotateX(-al), t.add('cone', 'lamp', u, [1, 1, 1], !1));
  }
  (s('metal', 'gun', Xe(Tt(0.05, 0.03, 0.05, 0.006), 0, 0.012, 0), Os),
    s('metal', 'gun', Xe(Uo(0.012, 0.012, 0.07, 8), 0, -0.005, 0), Bn),
    s('metal', 'gun', Xe(Tt(0.052, 0.046, 0.13, 0.008), 0, -0.032, 0), Os),
    s('shell', 'gun', Xe(Tt(0.054, 0.012, 0.05, 0.003), 0, -0.02, -0.03), Hs));
  for (let l of [-0.014, 0.014])
    (s('metal', 'gun', Xe(ki(0.0085, 0.0085, 0.2, 8), l, -0.032, 0.16), k0),
      s('metal', 'gun', Xe(ki(0.012, 0.012, 0.03, 8), l, -0.032, 0.255), Os));
  (s('metal', 'gun', Xe(Tt(0.045, 0.012, 0.012, 0.002), 0, -0.032, 0.2), Bn),
    s('metal', 'gun', Xe(Tt(0.03, 0.05, 0.05, 0.006), 0.04, -0.035, -0.02), k0));
  let r = e.build(['shell', 'metal', 'glow', 'lens']),
    a = t.build(['disc', 'cone']);
  return ((r.extra = a), r);
}

var Jy = {
    hp: 45,
    boltDamage: 7,
    boltSpeed: 70,
    burst: 3,
    burstGap: 0.12,
    telegraph: 0.55,
    cooldown: [1.9, 3.3],
    rangeMin: 12,
    rangeMax: 25,
    altMin: 4,
    altMax: 8,
    maxSpeed: 8,
    patrolSpeed: 3,
    accel: 11,
    spreadFar: 0.065,
    spreadNear: 0.018,
    fireRange: 42,
    explodeRadius: 3,
    explodeDamage: 30,
  },
  gn = Jy,
  rr = new THREE.Vector3(),
  yB = new THREE.Vector3(),
  Qs = new THREE.Vector3(),
  Bo = new THREE.Vector3(),
  bB = new THREE.Vector3(),
  Wh = new THREE.Vector3(),
  W1 = new THREE.Vector3(0, 1, 0),
  GS = new THREE.Vector3(0, -1, 0),
  U5 = [8, 4, 0.7],
  XD = [14, 1, 0.35],
  qS = (n, e) => {
    let t = (n - e) % (Math.PI * 2);
    return (t > Math.PI ? (t -= Math.PI * 2) : t < -Math.PI && (t += Math.PI * 2), t);
  },
  Ou = (n, e, t) => (n < e ? e : n > t ? t : n);

function XS(n, e, t, i) {
  let s = n.G,
    o = n.rng,
    r = t.lensBase.clone(),
    a = z5(
      e,
      { shell: t.shell, metal: t.metal, glow: t.glow, lens: r, disc: t.disc, cone: t.cone },
      { radius: 0.9, center: [0, 0, 0], extra: { def: e.extra, radius: 10 } },
    ),
    l = a.bones;
  ((a.group.rotation.order = 'YXZ'), (a.group.visible = !1));
  let c = s.mats.label('G-' + String(i + 11), { color: 'black', font: 'stencil', distress: 0.35 }),
    u = 0.105,
    f = Math.min(0.045, u / (c.aspect || 3)),
    h = new THREE.PlaneGeometry(u, f);
  (h.rotateX(-Math.PI / 2), h.rotateY(Math.PI));
  let p = new THREE.Mesh(h, c.material);
  (p.position.set(0, 0.0985, -0.085), (p.castShadow = !1), (p.receiveShadow = !0), l.body.add(p));
  let d = {
    id: 0,
    type: 'gull',
    pos: a.group.position,
    alive: !1,
    hp: gn.hp,
    active: !1,
    rig: a,
    lens: r,
    vel: new THREE.Vector3(),
    yaw: 0,
    pitch: 0,
    roll: 0,
    home: new THREE.Vector3(),
    lastKnown: new THREE.Vector3(),
    sensor: new THREE.Vector3(),
    fwd: new THREE.Vector3(0, 0, 1),
    muzzle: new THREE.Vector3(),
    mode: 'patrol',
    los: !1,
    seeT: 0,
    noSeeT: 0,
    senseT: 0,
    exposure: 0,
    modeT: 0,
    passive: !1,
    hasToken: !1,
    orbitA: 0,
    orbitDir: 1,
    orbitR: 16,
    alt: 6,
    hoverY: 0,
    phase: 0,
    ceil: 1e9,
    ceilT: 0,
    flipT: 0,
    avoid: new THREE.Vector3(),
    atk: 'idle',
    atkT: 0,
    cool: 1,
    shots: 0,
    smokeT: 0,
    feeler: 0,
    strobeT: 0,
    flare: 0,
    lensC: [U5[0], U5[1], U5[2]],
    dieT: 0,
    spin: 0,
    lostRotor: 0,
    gy: 0,
    gp: 0,
    loop: null,
    sweep: 0,
    thr: 1,
    damage(y, b, g, E) {
      return d.alive
        ? ((d.hp -= y),
          s.events.emit('enemy:hit', { enemy: d, point: b, part: E || 'body' }),
          g &&
            (d.vel.addScaledVector(g, Math.min(3, y * 0.09)),
            (d.roll += (o() - 0.5) * 0.5),
            (d.pitch += (o() - 0.5) * 0.4)),
          n.provoke(d),
          d.hp <= 0 ? (m(g), !0) : !1)
        : !1;
    },
    _activate(y, b = {}) {
      ((d.active = !0),
        (d.alive = !0),
        (d.hp = gn.hp),
        (d.passive = !!b.passive),
        d.pos.copy(y),
        d.home.copy(y),
        d.vel.set(0, 0, 0),
        (d.yaw = b.yaw ?? o() * 6.283),
        (d.pitch = d.roll = 0),
        (d.mode = b.state === 'alert' ? 'investigate' : 'patrol'),
        (d.modeT = 8),
        d.lastKnown.copy(b.target || (s.player ? s.player.pos : y)),
        (d.los = !1),
        (d.seeT = d.noSeeT = 0),
        (d.exposure = 0),
        (d.senseT = o() * 0.2),
        (d.hasToken = !1),
        (d.orbitDir = o() < 0.5 ? 1 : -1),
        (d.orbitR = gn.rangeMin + 2 + o() * (gn.rangeMax - gn.rangeMin - 5)),
        (d.alt = b.hover ?? gn.altMin + 0.8 + o() * (gn.altMax - gn.altMin - 1.6)),
        (d.hoverFixed = b.hover != null),
        (d.patrolR = b.patrolRadius ?? 4 + o() * 5),
        (d.phase = o() * 6.283),
        (d.orbitA = o() * 6.283),
        (d.ceil = 1e9),
        (d.flipT = 3 + o() * 4),
        (d.atk = 'idle'),
        (d.cool = 1 + o() * 1.5),
        (d.dieT = 0),
        (d.spin = 0),
        (d.lostRotor = -1),
        (d.flare = 0),
        (d.thr = 1));
      for (let g = 0; g < 4; g++) l['rotor' + g].scale.setScalar(1);
      if (
        (l.lamp.scale.setScalar(1),
        l.body.rotation.set(0, 0, 0),
        (a.group.visible = !0),
        a.group.rotation.set(0, d.yaw, 0),
        s.audio && s.audio.loop && !d.loop)
      )
        try {
          d.loop = s.audio.loop('gull_rotor', { pos: d.pos, gain: 0.5 });
        } catch {
          d.loop = null;
        }
    },
    _deactivate() {
      if (((d.active = !1), (d.alive = !1), (a.group.visible = !1), n.releaseToken(d), d.loop)) {
        try {
          d.loop.stop();
        } catch {}
        d.loop = null;
      }
    },
    _raycast(y, b, g, E) {
      let T = y.x - d.pos.x,
        w = (y.y - d.pos.y + 0.03) * 2.3,
        S = y.z - d.pos.z,
        R = b.x,
        z = b.y * 2.3,
        I = b.z,
        L = R * R + z * z + I * I,
        U = T * R + w * z + S * I,
        k = T * T + w * w + S * S - 0.5 * 0.5,
        C = U * U - L * k;
      if (C < 0) return !1;
      let A = (-U - Math.sqrt(C)) / L;
      return A < 0 || A > g || A >= E.dist
        ? !1
        : ((E.dist = A),
          (E.part = 'body'),
          (E.enemy = d),
          E.point.copy(y).addScaledVector(b, A),
          E.normal.copy(E.point).sub(d.pos),
          (E.normal.y *= 2.3),
          E.normal.normalize(),
          !0);
    },
    _update(y) {
      d.alive ? v(y) : x(y);
    },
  };
  function m(y) {
    ((d.alive = !1),
      n.releaseToken(d),
      (d.dieT = 0),
      (d.lostRotor = Math.floor(o() * 4)),
      l['rotor' + d.lostRotor].scale.setScalar(1e-4),
      rr.set(N5.rotors[d.lostRotor][0], 0.05, N5.rotors[d.lostRotor][2]).applyAxisAngle(W1, d.yaw).add(d.pos),
      s.fx.sparks(rr, W1, 14),
      s.fx.debris(rr, { count: 3 }),
      s.fx.smoke(rr, { size: 0.5, life: 1 }),
      (d.spin = (o() < 0.5 ? -1 : 1) * (5 + o() * 3)),
      (d.vel.y += 1.5),
      y && d.vel.addScaledVector(y, 2.5),
      l.lamp.scale.setScalar(1e-4),
      l.strobeG.scale.setScalar(1e-4),
      l.strobeR.scale.setScalar(1e-4),
      l.strobeW.scale.setScalar(1e-4),
      r.color.setRGB(0.3, 0.05, 0.02),
      s.events.emit('enemy:killed', { enemy: d, pos: d.pos, type: 'gull' }));
  }
  function x(y) {
    ((d.dieT += y),
      (d.vel.y -= 9.5 * y),
      (d.vel.x *= 1 - 0.4 * y),
      (d.vel.z *= 1 - 0.4 * y),
      (d.spin += Math.sign(d.spin) * 7 * y),
      (d.yaw += d.spin * y),
      (d.roll += d.spin * 0.35 * y),
      (d.pitch += 0.9 * y));
    let b = d.vel.length(),
      g = b * y,
      E = d.dieT > 5 || d.pos.y < -3;
    if (!E && b > 0.01) {
      Qs.copy(d.vel).multiplyScalar(1 / b);
      let M = s.physics.raycast(d.pos, Qs, g + 0.3);
      M && (d.pos.copy(M.point).addScaledVector(M.normal, 0.2), (E = !0));
    }
    (E || d.pos.addScaledVector(d.vel, y), a.group.rotation.set(d.pitch, d.yaw, d.roll));
    for (let M = 0; M < 4; M++)
      M !== d.lostRotor &&
        (l['rotor' + M].rotation.y += (M % 3 === 0 ? 1 : -1) * 30 * Math.max(0.2, 1 - d.dieT * 0.5) * y);
    ((d.smokeT -= y),
      d.smokeT <= 0 &&
        ((d.smokeT = 0.045),
        s.fx.smoke(d.pos, { size: 0.45, life: 1.3, color: 1381914, rise: 0.6 }),
        o() < 0.5 && (rr.set(o() - 0.5, o(), o() - 0.5).normalize(), s.fx.sparks(d.pos, rr, 3))),
      d.loop &&
        (d.loop.setPos(d.pos), d.loop.setPitch(Math.max(0.4, 1.25 - d.dieT * 0.4)), d.loop.setGain(0.5)),
      E &&
        (s.fx.explosion(d.pos, 1.2),
        s.combat && s.combat.explode && s.combat.explode(d.pos, gn.explodeRadius, gn.explodeDamage, 'enemy'),
        n.retire(d)));
  }
  function v(y) {
    let b = s.player,
      g = n.t;
    (d.fwd.set(Math.sin(d.yaw), 0, Math.cos(d.yaw)),
      d.sensor.set(0, -0.17, 0.27).applyAxisAngle(W1, d.yaw).add(d.pos),
      n.think(d, y, 0.4));
    let E = d.mode === 'engage',
      M = d.hp < gn.hp * 0.5,
      _ = gn.patrolSpeed,
      T,
      w,
      S;
    if (E && b) {
      _ = gn.maxSpeed;
      let q = d.atk !== 'idle';
      ((d.flipT -= y),
        d.flipT <= 0 &&
          ((d.flipT = 3 + o() * 5),
          o() < 0.6 && (d.orbitDir = -d.orbitDir),
          (d.orbitR = Ou(d.orbitR + (o() - 0.5) * 6, gn.rangeMin + 1, gn.rangeMax - 2))),
        d.noSeeT > 1.5
          ? ((T = d.lastKnown.x),
            (S = d.lastKnown.z),
            (w = d.lastKnown.y + d.alt + 1),
            (d.orbitA = Math.atan2(d.pos.z - d.lastKnown.z, d.pos.x - d.lastKnown.x)))
          : ((d.orbitA += ((d.orbitDir * (q ? 0.9 : 3.6)) / d.orbitR) * y),
            (T = b.pos.x + Math.cos(d.orbitA) * d.orbitR),
            (S = b.pos.z + Math.sin(d.orbitA) * d.orbitR),
            (w = b.pos.y + d.alt)));
    } else
      d.mode === 'investigate' || d.mode === 'search'
        ? ((_ = 5.5),
          (d.orbitA += 0.5 * y),
          (T = d.lastKnown.x + Math.cos(d.orbitA) * 4.5),
          (S = d.lastKnown.z + Math.sin(d.orbitA) * 4.5),
          (w = d.lastKnown.y + Math.min(d.alt, 5.5)))
        : ((d.orbitA += 0.28 * y * d.orbitDir),
          (T = d.home.x + Math.cos(d.orbitA) * d.patrolR),
          (S = d.home.z + Math.sin(d.orbitA) * d.patrolR),
          (w = d.hoverFixed ? d.alt : d.home.y));
    (w > d.ceil && (w = d.ceil),
      !d.hoverFixed && w < 2.2 && (w = 2.2),
      Bo.set(
        (T - d.pos.x) * 2.2 - d.vel.x * 2.4,
        (w - d.pos.y) * 5 - d.vel.y * 3.6,
        (S - d.pos.z) * 2.2 - d.vel.z * 2.4,
      ),
      (d.feeler = (d.feeler + 1) % 3));
    let R = Math.hypot(d.vel.x, d.vel.z);
    if (d.feeler === 0 && R > 0.6) {
      Qs.set(d.vel.x / R, 0, d.vel.z / R);
      let q = 2.2 + R * 0.5,
        ue = s.physics.raycast(d.pos, Qs, q);
      if (ue) {
        let de = 1 - ue.dist / q;
        (d.avoid.copy(ue.normal).multiplyScalar(26 * de),
          (d.avoid.y += 9 * de),
          de > 0.5 && ((d.orbitDir = -d.orbitDir), (d.flipT = 2.5)));
      }
    } else if (d.feeler === 1) {
      let q = s.physics.raycast(d.pos, GS, 2.4);
      q && !d.hoverFixed && (d.avoid.y += (2.4 - q.dist) * 10);
    } else if (d.feeler === 2 && ((d.ceilT -= y * 3), d.ceilT <= 0)) {
      d.ceilT = 0.35;
      let q = s.physics.raycast(d.pos, W1, 4);
      d.ceil = q ? d.pos.y + q.dist - 1.3 : 1e9;
    }
    (Bo.add(d.avoid),
      d.avoid.multiplyScalar(Math.exp(-6 * y)),
      M &&
        ((Bo.x += Math.sin(g * 7.3 + d.phase) * 5),
        (Bo.z += Math.cos(g * 6.1 + d.phase) * 5),
        (Bo.y += Math.sin(g * 9.7) * 3)));
    let z = Bo.length();
    (z > gn.accel && Bo.multiplyScalar(gn.accel / z), d.vel.addScaledVector(Bo, y));
    let I = d.vel.length();
    I > _ && (d.vel.multiplyScalar(_ / I), (I = _));
    for (let q = 0; q < 3; q++) {
      let ue = q === 0 ? d.vel.x : q === 1 ? d.vel.y : d.vel.z;
      if (Math.abs(ue) < 0.02) continue;
      let de = ue > 0 ? 1 : -1,
        $ = q === 1 ? 0.35 : 0.62;
      Qs.set(q === 0 ? de : 0, q === 1 ? de : 0, q === 2 ? de : 0);
      let se = s.physics.raycast(d.pos, Qs, Math.abs(ue) * y + $);
      se &&
        (d.vel.setComponent(q, -ue * 0.25),
        d.avoid.setComponent(q, d.avoid.getComponent(q) - de * 8),
        se.dist < $ && d.pos.setComponent(q, d.pos.getComponent(q) - de * ($ - se.dist)));
    }
    if ((d.pos.addScaledVector(d.vel, y), !d.hoverFixed)) {
      let q = s.physics.groundHeight(d.pos.x, d.pos.z, d.pos.y + 0.5) + 1.1;
      d.pos.y < q && ((d.pos.y = q), d.vel.y < 0 && (d.vel.y = 0));
    }
    let L = d.yaw;
    if ((E || d.mode === 'search' || d.mode === 'investigate') && b) {
      let q = E && d.noSeeT < 1.5 ? b.pos : d.lastKnown;
      L = Math.atan2(q.x - d.pos.x, q.z - d.pos.z);
    } else R > 0.4 && (L = Math.atan2(d.vel.x, d.vel.z));
    let U = qS(L, d.yaw);
    d.yaw += Ou(U, -3.2 * y, 3.2 * y);
    let k = Math.cos(d.yaw),
      C = Math.sin(d.yaw),
      A = Bo.x * C + Bo.z * k,
      F = Bo.x * k - Bo.z * C,
      H = Ou(A * 0.04, -0.42, 0.42),
      N = Ou(-F * 0.04, -0.42, 0.42);
    M && ((H += Math.sin(g * 11 + d.phase) * 0.1), (N += Math.cos(g * 8.7 + d.phase * 2) * 0.13));
    let Z = 1 - Math.exp(-7 * y);
    ((d.pitch += (H - d.pitch) * Z),
      (d.roll += (N - d.roll) * Z),
      a.group.rotation.set(d.pitch, d.yaw, d.roll),
      (l.body.position.y = Math.sin(g * 2.1 + d.phase) * 0.045 + Math.sin(g * 3.7 + d.phase * 1.7) * 0.018),
      (d.thr += (1 + Ou(Bo.y * 0.03, -0.25, 0.4) + R * 0.02 - d.thr) * Z));
    let Q = 41 * d.thr * y;
    ((l.rotor0.rotation.y += Q),
      (l.rotor1.rotation.y -= Q * 1.03),
      (l.rotor2.rotation.y -= Q * 0.98),
      (l.rotor3.rotation.y += Q * 1.01));
    let W = (g * 0.9 + d.phase * 0.1) % 1,
      J = W < 0.05 || (W > 0.13 && W < 0.18) ? 1 : 1e-4;
    if (
      (l.strobeR.scale.setScalar(J),
      l.strobeG.scale.setScalar(J),
      l.strobeW.scale.setScalar(W > 0.5 && W < 0.56 ? 1 : 1e-4),
      E && b)
    )
      Wh.set(b.pos.x, b.pos.y + 1.1, b.pos.z);
    else if (d.mode !== 'patrol')
      ((d.sweep += y),
        Wh.set(
          d.lastKnown.x + Math.sin(d.sweep * 0.9) * 3,
          d.lastKnown.y,
          d.lastKnown.z + Math.cos(d.sweep * 0.7) * 3,
        ));
    else {
      d.sweep += y;
      let q = d.yaw + Math.sin(d.sweep * 0.5 + d.phase) * 0.9;
      Wh.set(d.pos.x + Math.sin(q) * 5, d.pos.y - (d.hoverFixed ? 1.6 : 5), d.pos.z + Math.cos(q) * 5);
    }
    rr.copy(Wh).sub(d.sensor);
    let G = rr.x * k - rr.z * C,
      te = rr.x * C + rr.z * k,
      oe = rr.y,
      ee = Math.atan2(G, te),
      le = Ou(Math.atan2(-oe, Math.hypot(G, te)), -0.5, 1.5),
      xe = 1 - Math.exp(-9 * y);
    ((d.gy += qS(ee, d.gy) * xe),
      (d.gp += (le - d.gp) * xe),
      (l.gimbalYaw.rotation.y = d.gy),
      (l.ball.rotation.x = d.gp - d.pitch),
      (l.gun.rotation.x = Ou(d.gp, -0.2, 1.3) - d.pitch));
    let j = E ? XD : U5,
      O = 1 + d.flare * 3.2 + (E ? 0 : Math.sin(g * 3 + d.phase) * 0.15);
    for (let q = 0; q < 3; q++) d.lensC[q] += (j[q] - d.lensC[q]) * (1 - Math.exp(-8 * y));
    if (
      (r.color.setRGB(d.lensC[0] * O, d.lensC[1] * O, d.lensC[2] * O),
      (d.flare = Math.max(0, d.flare - y * 1.5)),
      d.muzzle.set(0, -0.12, 0.17).applyAxisAngle(W1, d.yaw).add(d.pos),
      (d.cool -= y),
      d.atk === 'idle')
    )
      E &&
        d.los &&
        d.cool <= 0 &&
        b &&
        b.alive &&
        Math.abs(U) < 0.35 &&
        d.pos.distanceTo(b.pos) < gn.fireRange &&
        n.requestToken(d) &&
        ((d.atk = 'tele'),
        (d.atkT = gn.telegraph),
        s.events.emit('enemy:telegraph', { enemy: d, type: 'gull', time: gn.telegraph, pos: d.pos }));
    else if (d.atk === 'tele')
      ((d.atkT -= y),
        (d.flare = Math.min(1, d.flare + y * 4.5)),
        E
          ? d.atkT <= 0 &&
            ((d.atk = 'burst'), (d.shots = gn.burst), (d.atkT = 0), (d.lead = 0.2 + o() * 0.65))
          : ((d.atk = 'idle'), n.releaseToken(d)));
    else if (d.atk === 'burst' && ((d.atkT -= y), (d.flare = 1), d.atkT <= 0)) {
      if (((d.atkT = gn.burstGap), d.shots--, b)) {
        let q = d.muzzle.distanceTo(b.pos),
          ue = q / gn.boltSpeed;
        (Wh.set(b.pos.x + b.vel.x * ue * d.lead, b.pos.y + 1.05, b.pos.z + b.vel.z * ue * d.lead),
          Qs.copy(Wh).sub(d.muzzle).normalize());
        let de =
          (gn.spreadFar + (gn.spreadNear - gn.spreadFar) * d.exposure) *
          (1 + n.playerSpeed * 0.45) *
          (M ? 1.5 : 1);
        ((Qs.x += (o() - 0.5) * 2 * de),
          (Qs.y += (o() - 0.5) * 2 * de),
          (Qs.z += (o() - 0.5) * 2 * de),
          Qs.normalize(),
          n.fireBolt(d.muzzle, Qs, d),
          s.fx.muzzleFlash(d.muzzle, Qs, { scale: 0.55 }),
          s.events.emit('enemy:fire', { enemy: d, pos: d.muzzle, dir: Qs, type: 'gull' }),
          d.vel.addScaledVector(Qs, -0.35));
      }
      d.shots <= 0 &&
        ((d.atk = 'idle'),
        (d.cool = gn.cooldown[0] + o() * (gn.cooldown[1] - gn.cooldown[0])),
        n.releaseToken(d));
    }
    (M &&
      ((d.smokeT -= y),
      d.smokeT <= 0 &&
        ((d.smokeT = 0.16),
        s.fx.smoke(d.pos, { size: 0.3, life: 1.1, color: 2500652, rise: 0.8 }),
        o() < 0.15 && s.fx.sparks(d.pos, GS, 2))),
      d.loop &&
        (d.loop.setPos(d.pos), d.loop.setPitch(0.85 + d.thr * 0.2 + (M ? Math.sin(g * 13) * 0.05 : 0))));
  }
  return d;
}

var tb = {
    hp: ENEMY_CONFIG.hp,
    shotDamage: ENEMY_CONFIG.shotDamage,
    burst: ENEMY_CONFIG.burst,
    burstGap: ENEMY_CONFIG.burstGap,
    telegraph: ENEMY_CONFIG.telegraph,
    cooldown: ENEMY_CONFIG.cooldown,
    runSpeed: ENEMY_CONFIG.runSpeed,
    stalkSpeed: ENEMY_CONFIG.stalkSpeed,
    patrolSpeed: ENEMY_CONFIG.patrolSpeed,
    accel: ENEMY_CONFIG.accel,
    turnRate: ENEMY_CONFIG.turnRate,
    rangeMin: ENEMY_CONFIG.rangeMin,
    rangeMax: ENEMY_CONFIG.rangeMax,
    spreadFar: ENEMY_CONFIG.spreadFar,
    spreadNear: ENEMY_CONFIG.spreadNear,
    lungeRange: 0,
    lungeDamage: 15,
    lungeCooldown: 3.5,
    lungeSpeed: 9.5,
    replan: ENEMY_CONFIG.replan ?? 0.55,
    smokeBelow: 0,
  },
  c0 = tb,
  Yn = Ky,
  _s = new THREE.Vector3(),
  Gh = new THREE.Vector3(),
  Ho = new THREE.Vector3(),
  Oo = new THREE.Vector3(),
  YS = new THREE.Vector3(),
  G1 = new THREE.Vector3(),
  shellPos = new THREE.Vector3(),
  shellVel = new THREE.Vector3(),
  Qy = new THREE.Vector3(0, 1, 0),
  ikD = new THREE.Vector3(),
  ikU = new THREE.Vector3(),
  ikP = new THREE.Vector3(),
  ikE = new THREE.Vector3(),
  ikF = new THREE.Vector3(),
  ikX = new THREE.Vector3(),
  ikY = new THREE.Vector3(),
  ikM = new THREE.Matrix4(),
  ikGripR = new THREE.Vector3(),
  ikGripL = new THREE.Vector3(),
  ikShR = new THREE.Vector3(-Yn.shoulderX, Yn.shoulderY, 0),
  ikShL = new THREE.Vector3(Yn.shoulderX, Yn.shoulderY, 0),
  ikPoleR = new THREE.Vector3(-0.26, -0.32, -0.18),
  ikPoleL = new THREE.Vector3(0.24, -0.34, -0.1),
  gunEuler = new THREE.Euler(0, 0, 0, 'YXZ'),
  gunQuat = new THREE.Quaternion(),
  H5 = [0.22, 0.2, 0.18],
  YD = [0.35, 0.22, 0.16],
  O5 = (n, e) => {
    let t = (n - e) % (Math.PI * 2);
    return (t > Math.PI ? (t -= Math.PI * 2) : t < -Math.PI && (t += Math.PI * 2), t);
  },
  bo = (n, e, t) => (n < e ? e : n > t ? t : n);

function ll(n, e, t, i, s) {
  return ((n.v += ((e - n.x) * t - n.v * i) * s), (n.x += n.v * s), n.x);
}

/**
 * Custom Subsurface Scattering (SSS) & Pore Micro-Relief Shader for Human Skin.
 * Adds warm sub-dermal blood scatter across light terminators, subtle skin pore grain,
 * and natural sebaceous skin sheen at grazing angles so faces/forearms/hands look organic.
 */
function createHumanSkinMaterial() {
  let mat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.54,
    metalness: 0.02,
    vertexColors: !0,
  });
  mat.name = 'human_skin_sss';
  mat.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
varying vec3 vSkinBindPos;`,
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
vSkinBindPos = position;`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
varying vec3 vSkinBindPos;
float skinHash(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.71, 0.113, 0.419));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float skinNoise(vec3 x) {
  vec3 i = floor(x), f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(skinHash(i), skinHash(i + vec3(1, 0, 0)), f.x), mix(skinHash(i + vec3(0, 1, 0)), skinHash(i + vec3(1, 1, 0)), f.x), f.y),
    mix(mix(skinHash(i + vec3(0, 0, 1)), skinHash(i + vec3(1, 0, 1)), f.x), mix(skinHash(i + vec3(0, 1, 1)), skinHash(i + vec3(1, 1, 1)), f.x), f.y),
    f.z
  );
}`,
      )
      .replace(
        '#include <map_fragment>',
        `#include <map_fragment>
  float skMacro = skinNoise(vSkinBindPos * 28.0);
  float skPore = skinNoise(vSkinBindPos * 380.0);
  vec3 skSubdermal = vec3(0.94, 0.29, 0.18);
  diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * skSubdermal * 1.25, 0.12 + 0.08 * (1.0 - skMacro));
  diffuseColor.rgb *= 0.94 + 0.12 * skMacro + 0.05 * (skPore - 0.5);`,
      )
      .replace(
        '#include <roughnessmap_fragment>',
        `#include <roughnessmap_fragment>
  roughnessFactor = clamp(roughnessFactor + (skPore - 0.5) * 0.12 - (1.0 - skMacro) * 0.06, 0.32, 0.78);`,
      )
      .replace(
        '#include <lights_fragment_end>',
        `#include <lights_fragment_end>
  {
    vec3 skV = normalize(geometryViewDir);
    vec3 skN = normalize(geometryNormal);
    float skNdotV = clamp(dot(skN, skV), 0.0, 1.0);
    float skFresnel = pow(1.0 - skNdotV, 3.0);
    // Warm sub-dermal blood scatter in shadow terminator & grazing edges
    vec3 skBlood = vec3(0.88, 0.22, 0.11) * diffuseColor.rgb;
    float skDirectLum = dot(reflectedLight.directDiffuse, vec3(0.333));
    float skTerminator = smoothstep(0.0, 0.45, skDirectLum) * (1.0 - smoothstep(0.35, 0.95, skDirectLum));
    reflectedLight.directDiffuse += skBlood * (skTerminator * 0.42 + skDirectLum * 0.12);
    reflectedLight.indirectDiffuse += skBlood * (0.14 + 0.22 * skFresnel);
    reflectedLight.indirectSpecular += vec3(1.0, 0.92, 0.86) * (skFresnel * 0.045);
  }`,
      );
  };
  mat.customProgramCacheKey = () => 'human-skin-sss-v1';
  return mat;
}

/**
 * Enhances the tactical fabric material ('cloth') with procedural ripstop/twill micro-weave
 * and cotton/velvet Fresnel rim-sheen so guerrilla clothing looks like woven fabric.
 */
function enhanceHumanClothShader(clothMat) {
  if (!clothMat) return clothMat;
  let prevCompile = clothMat.onBeforeCompile;
  clothMat.onBeforeCompile = (shader, renderer) => {
    if (prevCompile) prevCompile(shader, renderer);
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <lights_fragment_end>',
      `#include <lights_fragment_end>
  {
    vec3 clV = normalize(geometryViewDir);
    vec3 clN = normalize(geometryNormal);
    float clNdotV = clamp(dot(clN, clV), 0.0, 1.0);
    // Cotton / canvas microfiber velvet rim-sheen at grazing angles
    float clSheen = pow(1.0 - clNdotV, 2.8);
    reflectedLight.indirectDiffuse += diffuseColor.rgb * (clSheen * 0.28);
    reflectedLight.directDiffuse += diffuseColor.rgb * (clSheen * 0.14);
  }`,
    );
  };
  let prevKey = clothMat.customProgramCacheKey ? clothMat.customProgramCacheKey.bind(clothMat) : null;
  clothMat.customProgramCacheKey = () => (prevKey ? prevKey() : 'cloth') + '-velvet-v1';
  return clothMat;
}

/**
 * Analytical 3D 2-bone arm IK solver in torso space.
 * Positions shoulderBone & forearmBone so the wrist at (0, -L2, 0) in forearm space
 * reaches targetPos, with the elbow pointing toward poleDir.
 */
function solveArmIK(shoulderBone, forearmBone, handBone, shoulderPos, targetPos, poleDir, L1, L2, side) {
  ikD.subVectors(targetPos, shoulderPos);
  let rawDist = ikD.length(),
    minDist = Math.abs(L1 - L2) + 0.015,
    maxDist = (L1 + L2) * 0.996,
    d = bo(rawDist, minDist, maxDist);
  if (rawDist > 1e-5) ikU.copy(ikD).multiplyScalar(1 / rawDist);
  else ikU.set(0, -1, 0);

  let cosAlpha = bo((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1),
    sinAlpha = Math.sqrt(Math.max(0, 1 - cosAlpha * cosAlpha)),
    cosBeta = bo((L1 * L1 + L2 * L2 - d * d) / (2 * L1 * L2), -1, 1),
    thetaElbow = Math.PI - Math.acos(cosBeta);

  // Project poleDir perpendicular to ikU
  ikP.copy(poleDir).addScaledVector(ikU, -poleDir.dot(ikU));
  let pLen = ikP.length();
  if (pLen > 1e-5) ikP.multiplyScalar(1 / pLen);
  else ikP.set(side, 0, -1).normalize();

  // Unit vector from shoulder to elbow (ikE) and perpendicular in bend plane toward wrist (ikF)
  ikE.copy(ikU).multiplyScalar(cosAlpha).addScaledVector(ikP, sinAlpha).normalize();
  ikF.copy(ikU).multiplyScalar(sinAlpha).addScaledVector(ikP, -cosAlpha).normalize();

  // In shoulderBone rest frame, bone extends along -Y, and forearm (-thetaElbow around X) bends toward +Z
  ikY.copy(ikE).negate();
  ikX.crossVectors(ikY, ikF).normalize();
  ikF.crossVectors(ikX, ikY).normalize();
  ikM.makeBasis(ikX, ikY, ikF);
  shoulderBone.quaternion.setFromRotationMatrix(ikM);
  forearmBone.rotation.set(-thetaElbow, 0, 0);
  if (handBone) {
    handBone.rotation.set(0.15, side * -0.18, side * 0.12);
  }
}

function jS(n, e, t, i) {
  let s = n.G,
    o = n.rng,
    r = t.lensBase.clone(),
    a = z5(
      e,
      { cloth: t.cloth, skin: t.skin, shell: t.shell, metal: t.metal, wood: t.wood, glow: t.glow, lens: r },
      { radius: 2.1, center: [0, 0.95, 0] },
    ),
    l = a.bones;
  a.group.visible = !1;
  let b = [0, 1].map(() => ({
      p: new THREE.Vector3(),
      from: new THREE.Vector3(),
      to: new THREE.Vector3(),
      slide: new THREE.Vector3(),
    })),
    g = {
      id: 0,
      type: 'hound',
      pos: a.group.position,
      alive: !1,
      hp: c0.hp,
      active: !1,
      rig: a,
      lens: r,
      feet: b,
      yaw: 0,
      speed: 0,
      yawRate: 0,
      home: new THREE.Vector3(),
      lastKnown: new THREE.Vector3(),
      goal: new THREE.Vector3(),
      firePos: new THREE.Vector3(),
      firePlayer: new THREE.Vector3(),
      sensor: new THREE.Vector3(),
      fwd: new THREE.Vector3(0, 0, 1),
      muzzle: new THREE.Vector3(),
      headPos: new THREE.Vector3(),
      push: new THREE.Vector3(),
      mode: 'patrol',
      los: !1,
      seeT: 0,
      noSeeT: 0,
      senseT: 0,
      exposure: 0,
      modeT: 0,
      passive: !1,
      hasToken: !1,
      es: 'move',
      esT: 0,
      cool: 1,
      shots: 0,
      bursts: 0,
      lungeCd: 0,
      path: null,
      wp: 0,
      planT: 0,
      hasGoal: !1,
      waitT: 0,
      moveT: 0,
      stuckT: 0,
      walkPhase: 0,
      strideAmp: 0,
      aimBlend: 0,
      gunRecoil: 0,
      barrelHeat: 0,
      barrelSmokeT: 0,
      strafeDir: 1,
      strafeT: 0,
      strafeVel: 0,
      stepSide: 1,
      idleT: 0,
      sY: { x: 0, v: 0 },
      sP: { x: 0, v: 0 },
      sR: { x: 0, v: 0 },
      sL: { x: 0, v: 0 },
      sA: { x: 0, v: 0 },
      sA2: { x: 0, v: 0 },
      crouch: 0,
      tyaw: 0,
      tpitch: 0,
      hyaw: 0,
      hpitch: 0,
      flare: 0,
      lensC: [H5[0], H5[1], H5[2]],
      smokeT: 0,
      phase: 0,
      scan: 0,
      dieT: 0,
      vy: 0,
      dieRoll: 0,
      diePitch: 0,
      dieDir: 1,
      wreck: !1,
      sink: 0,
      loop: null,
      prevSpeed: 0,
      maxSpeed: c0.patrolSpeed,
      damage(k, C, A, F) {
        if (!g.alive) return !1;
        if (((g.hp -= k), s.events.emit('enemy:hit', { enemy: g, point: C, part: F || 'body' }), A)) {
          let H = Math.cos(g.yaw),
            N = Math.sin(g.yaw),
            Z = Math.min(1.65, k / 26),
            Q = A.x * N + A.z * H,
            W = A.x * H - A.z * N;
          // Realistic anatomical hit-flinch impulse on torso, head & pelvis
          ((g.sL.v += W * 0.95 * Z),
            (g.sR.v += -W * 2.35 * Z),
            (g.sP.v += Q * 2.25 * Z * (F === 'weak' ? 1.55 : 1)),
            (g.sY.v -= 0.38 * Z),
            (g.hpitch += Q * 0.22 * Z));
        }
        return (n.provoke(g), g.hp <= 0 ? (L(A), !0) : !1);
      },
      _activate(k, C = {}) {
        ((g.active = !0),
          (g.alive = !0),
          (g.wreck = !1),
          (g.hp = c0.hp),
          (g.passive = !!C.passive),
          (g.sink = 0),
          g.pos.copy(k),
          (g.pos.y = s.physics.groundHeight(k.x, k.z, k.y + 1)),
          g.home.copy(g.pos),
          (g.yaw = C.yaw ?? o() * 6.283),
          (g.speed = 0),
          (g.yawRate = 0),
          g.push.set(0, 0, 0),
          (g.mode = C.state === 'alert' ? 'investigate' : 'patrol'),
          (g.modeT = 10),
          (g.modeSeen = g.mode),
          g.lastKnown.copy(C.target || (s.player ? s.player.pos : k)),
          (g.los = !1),
          (g.seeT = g.noSeeT = 0),
          (g.exposure = 0),
          (g.senseT = o() * 0.2),
          (g.hasToken = !1),
          (g.patrolR = C.patrolRadius ?? 24),
          (g.patrolLine = C.patrolLine || null),
          (g.patrolI = 0),
          (g.es = 'move'),
          (g.cool = 0.5 + o() * 0.8),
          (g.lungeCd = 0.3),
          (g.path = null),
          (g.hasGoal = !1),
          (g.waitT = o() * 0.4),
          (g.planT = 0),
          (g.walkPhase = o() * 6.283),
          (g.strideAmp = 0),
          (g.aimBlend = C.state === 'alert' ? 0.65 : 0),
          (g.gunRecoil = 0),
          (g.barrelHeat = 0),
          (g.barrelSmokeT = 0),
          (g.strafeDir = o() < 0.5 ? 1 : -1),
          (g.strafeT = 1 + o() * 1.5),
          (g.strafeVel = 0),
          (g.stepSide = 1),
          (g.idleT = 0),
          (g.crouch = 0),
          (g.feelT = 0),
          (g.blocked = !1),
          (g.flare = 0),
          (g.phase = o() * 6.283),
          (g.dieT = 0),
          (g.tyaw = g.hyaw = 0),
          (g.tpitch = g.hpitch = 0));
        for (let A of [g.sY, g.sP, g.sR, g.sL, g.sA, g.sA2]) ((A.x = 0), (A.v = 0));
        (b[0].p.set(g.pos.x, g.pos.y, g.pos.z),
          b[1].p.set(g.pos.x, g.pos.y, g.pos.z),
          l.neck.rotation.set(0, 0, 0),
          l.torso.rotation.set(0, 0, 0),
          l.gun.rotation.set(0, 0, 0),
          l.beacon.scale.setScalar(1e-4),
          (a.group.visible = !0),
          I(0.016));
      },
      _deactivate() {
        if (
          ((g.active = !1), (g.alive = !1), (g.wreck = !1), (a.group.visible = !1), n.releaseToken(g), g.loop)
        ) {
          try {
            g.loop.stop();
          } catch {}
          g.loop = null;
        }
      },
      _raycast(k, C, A, F) {
        let H = !1;
        // Headshot sphere ('weak' part = 2.2x damage)
        KS(k, C, g.headPos, 0.165, A, F) && ((F.part = 'weak'), (F.enemy = g), (H = !0));
        let hipY = g.pos.y + Yn.stand + g.sY.x - g.crouch * 0.38;
        // Upper torso & chest capsule
        (_s.set(g.pos.x, hipY - 0.05, g.pos.z),
          Gh.set(g.pos.x, hipY + 0.48, g.pos.z),
          ZS(k, C, _s, Gh, 0.25, A, F) && ((F.part = 'body'), (F.enemy = g), (H = !0)));
        // Lower body / legs capsule
        (_s.set(g.pos.x, g.pos.y + 0.08, g.pos.z),
          Gh.set(g.pos.x, hipY, g.pos.z),
          ZS(k, C, _s, Gh, 0.22, A, F) && ((F.part = 'body'), (F.enemy = g), (H = !0)));
        return H;
      },
      _update(k) {
        g.alive ? S(k) : U(k);
      },
    };
  function pickPatrolPoint() {
    // If a custom small patrolRadius was explicitly requested (e.g. showcase), stay within it
    if (g.patrolR < 4) {
      return s.physics.nav.randomPoint(g.home, g.patrolR);
    }
    let spawns = (s.level && s.level.enemySpawns) || [],
      covers = (s.level && s.level.coverPoints) || [],
      best = null,
      bestScore = -1e9;
    // Sample waypoints across the whole ship/map so enemies patrol all over the ship
    for (let i = 0; i < 10; i++) {
      let cand = null;
      if (spawns.length && o() < 0.6) {
        let sp = spawns[Math.floor(o() * spawns.length)];
        if (sp && sp.type === 'ground' && sp.pos) cand = sp.pos;
      }
      if (!cand && covers.length && o() < 0.75) {
        cand = covers[Math.floor(o() * covers.length)];
      }
      if (!cand) {
        cand = s.physics.nav.randomPoint(g.pos, g.patrolR);
      }
      if (!cand) continue;
      let dist = Math.hypot(cand.x - g.pos.x, cand.z - g.pos.z);
      if (dist < 6) continue;
      let score = (dist > 10 && dist < 42 ? 12 : 4) + o() * 6;
      // Avoid crowding the exact same patrol destination as other patrolling terrorists
      for (let other of n.list) {
        if (other !== g && other.alive && other.hasGoal) {
          let dOther = Math.hypot(cand.x - other.goal.x, cand.z - other.goal.z);
          if (dOther < 8) score -= (8 - dOther) * 2.5;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        best = cand;
      }
    }
    if (best) {
      Oo.copy(best);
      g.home.copy(Oo);
      return Oo;
    }
    return s.physics.nav.randomPoint(g.pos, g.patrolR);
  }
  function M(k, C) {
    (!C && g.hasGoal && g.goal.distanceToSquared(k) < 0.25) ||
      (g.goal.copy(k), (g.hasGoal = !0), (g.planT = 0), (g.stuckT = 0));
  }
  function _() {
    g.planT = c0.replan + o() * 0.15;
    let k = null;
    try {
      k = s.physics.nav.findPath(g.pos, g.goal);
    } catch {
      k = null;
    }
    ((g.path = k && k.length ? k : null),
      (g.wp = 0),
      g.path && g.path.length > 1 && g.path[0].distanceToSquared(g.pos) < 0.36 && (g.wp = 1));
  }
  function T(k, C) {
    if (!g.hasGoal) return ((g.maxSpeed = 0), !0);
    ((g.planT -= k), g.planT <= 0 && _());
    let A = g.goal;
    if (g.path) {
      for (
        ;
        g.wp < g.path.length - 1 && Math.hypot(g.path[g.wp].x - g.pos.x, g.path[g.wp].z - g.pos.z) < 0.55;
      )
        g.wp++;
      A = g.path[Math.min(g.wp, g.path.length - 1)];
    }
    let F = g.goal.x - g.pos.x,
      H = g.goal.z - g.pos.z,
      N = Math.hypot(F, H);
    if (N < 0.45) return ((g.hasGoal = !1), (g.maxSpeed = 0), !0);
    let Z = A.x - g.pos.x,
      Q = A.z - g.pos.z;
    g.wantYaw = Math.atan2(Z, Q);
    let W = Math.abs(O5(g.wantYaw, g.yaw));
    return ((g.maxSpeed = W > 1.25 ? 0.2 : Math.min(C * (1 - W * 0.38), 0.45 + N * 2.6)), !1);
  }
  function w() {
    let k = s.player;
    if (!k) return;
    let C = 1 / 0,
      A = k.eye || k.pos,
      F = (Z, Q) => {
        let W = Math.hypot(Z.x - k.pos.x, Z.z - k.pos.z);
        if (
          W < c0.rangeMin ||
          W > c0.rangeMax ||
          (s.physics.nav.isWalkable && !s.physics.nav.isWalkable(Z.x, Z.z))
        )
          return;
        let J = Math.hypot(Z.x - g.pos.x, Z.z - g.pos.z) * 0.9 + Q + o() * 3,
          G = Z.x - k.pos.x,
          te = Z.z - k.pos.z;
        for (let oe of n.list) {
          if (oe === g || !oe.alive || oe.type !== 'hound' || oe.mode !== 'engage') continue;
          let ee = oe.es === 'move' ? oe.firePos : oe.pos,
            le = ee.x - k.pos.x,
            xe = ee.z - k.pos.z,
            j = (G * le + te * xe) / (Math.hypot(G, te) * Math.hypot(le, xe) + 1e-4);
          (j > 0.86 && (J += (14 * (j - 0.86)) / 0.14), Math.hypot(Z.x - ee.x, Z.z - ee.z) < 3 && (J += 16));
        }
        J >= C ||
          (G1.set(Z.x, Z.y + 1.45, Z.z),
          s.physics.lineOfSight(G1, A) || (J += 22),
          J < C && ((C = J), g.firePos.set(Z.x, Z.y, Z.z)));
      },
      H = s.level && s.level.coverPoints;
    if (H) for (let Z = 0; Z < H.length; Z++) F(H[Z], -2);
    for (let Z = 0; Z < 7; Z++) {
      let Q = s.physics.nav.randomPoint(k.pos, c0.rangeMax);
      Q && F(Q, 0);
    }
    let N = Math.atan2(g.pos.z - k.pos.z, g.pos.x - k.pos.x);
    for (let Z = 0; Z < 5; Z++) {
      let Q = N + (o() - 0.5) * 2.6,
        W = c0.rangeMin + 1 + o() * (c0.rangeMax - c0.rangeMin - 2);
      (Oo.set(k.pos.x + Math.cos(Q) * W, k.pos.y, k.pos.z + Math.sin(Q) * W),
        (Oo.y = s.physics.groundHeight(Oo.x, Oo.z, k.pos.y + 1)),
        F(Oo, 1));
    }
    (C === 1 / 0 && g.firePos.copy(g.pos),
      g.firePlayer.copy(k.pos),
      M(g.firePos, !0),
      (g.es = 'move'),
      (g.esT = 0),
      (g.moveT = 0),
      (g.bursts = 0));
  }
  function S(k) {
    let C = s.player;
    (g.fwd.set(Math.sin(g.yaw), 0, Math.cos(g.yaw)),
      g.sensor.copy(g.headPos),
      n.think(g, k, 0.5),
      g.mode !== g.modeSeen &&
        ((g.modeSeen = g.mode),
        (g.hasGoal = !1),
        (g.path = null),
        (g.waitT = 0),
        g.mode === 'engage'
          ? w()
          : (g.es === 'tele' || g.es === 'burst') && (n.releaseToken(g), (g.es = 'move'))),
      (g.wantYaw = g.yaw),
      (g.maxSpeed = 0),
      (g.cool -= k),
      (g.lungeCd -= k));
    let F = null,
      H = null,
      N = 0,
      wantStrafe = 0,
      Q = C ? Math.hypot(C.pos.x - g.pos.x, C.pos.z - g.pos.z) : 1e9;
    if (g.mode === 'patrol') {
      if (g.hasGoal) T(k, c0.patrolSpeed) && (g.waitT = 0.35 + o() * 0.85);
      else if (((g.waitT -= k), g.waitT <= 0))
        if (g.patrolLine)
          ((g.patrolI = (g.patrolI + 1) % g.patrolLine.length), M(g.patrolLine[g.patrolI], !0));
        else {
          let D = pickPatrolPoint();
          D ? M(D, !0) : (g.waitT = 0.5);
        }
    } else if (g.mode === 'investigate' || g.mode === 'search') {
      H = g.lastKnown;
      let D = Math.hypot(g.lastKnown.x - g.pos.x, g.lastKnown.z - g.pos.z);
      D > 2.2
        ? (M(g.lastKnown), T(k, D < 8 ? c0.stalkSpeed : c0.runSpeed))
        : ((g.hasGoal = !1), (g.scan += k), (g.wantYaw = g.yaw + Math.sin(g.scan * 0.8) * 0.9), (H = null));
    } else if (C) {
      ((F = C.pos), (H = C.pos));
      let D = Math.atan2(C.pos.x - g.pos.x, C.pos.z - g.pos.z);
      switch (g.es) {
        case 'move': {
          g.moveT += k;
          let B = T(k, c0.runSpeed),
            X = Q > c0.rangeMin - 2 && Q < c0.rangeMax + 3;
          B || (g.moveT > 1.1 && g.los && X && o() < k * 0.85) || (g.los && Q < 8) || g.moveT > 6.5
            ? ((g.es = 'aim'), (g.esT = 0), (g.hasGoal = !1))
            : C.pos.distanceToSquared(g.firePlayer) > 49 && w();
          break;
        }
        case 'aim':
        case 'cool': {
          ((g.wantYaw = D),
            (g.esT += k),
            (N = 0.08),
            (g.strafeT -= k),
            g.strafeT <= 0 && ((g.strafeT = 1.1 + o() * 1.4), (g.strafeDir = o() < 0.65 ? -g.strafeDir : g.strafeDir)),
            (wantStrafe = g.strafeDir * 0.62),
            g.los
              ? Q < c0.rangeMin - 4.5 && g.esT > 1.1 && g.cool > 0.3
                ? w()
                : g.cool <= 0 &&
                  C.alive &&
                  Math.abs(O5(D - g.yaw, g.tyaw)) < 0.22 &&
                  n.requestToken(g) &&
                  ((g.es = 'tele'),
                  (g.esT = c0.telegraph),
                  s.events.emit('enemy:telegraph', {
                    enemy: g,
                    type: 'hound',
                    time: c0.telegraph,
                    pos: g.pos,
                  }))
              : (g.noSeeT > 1.1 || g.esT > 3) && w());
          break;
        }
        case 'tele': {
          ((g.wantYaw = D),
            (g.esT -= k),
            (g.flare = Math.min(1, g.flare + k * 5)),
            (N = 0.14),
            (wantStrafe = g.strafeDir * 0.25),
            g.esT <= 0 && ((g.es = 'burst'), (g.shots = c0.burst), (g.esT = 0)));
          break;
        }
        case 'burst': {
          ((g.wantYaw = D),
            (g.esT -= k),
            (g.flare = 1),
            (N = 0.16),
            g.esT <= 0 && ((g.esT = c0.burstGap), g.shots--, R(C)),
            g.shots <= 0 &&
              (n.releaseToken(g),
              (g.cool = c0.cooldown[0] + o() * (c0.cooldown[1] - c0.cooldown[0])),
              g.bursts++,
              g.bursts >= 1 + (o() < 0.45 ? 1 : 0) ? w() : ((g.es = 'cool'), (g.esT = 0))));
          break;
        }
        default: {
          w();
          break;
        }
      }
    }
    let W = O5(g.wantYaw, g.yaw),
      J = bo(W * 6.5, -c0.turnRate, c0.turnRate);
    ((g.yawRate += (J - g.yawRate) * (1 - Math.exp(-11 * k))), (g.yaw += g.yawRate * k));
    let G = g.maxSpeed > g.speed ? c0.accel : -c0.accel * 1.5;
    ((g.prevSpeed = g.speed),
      (g.speed = bo(g.speed + G * k, 0, Math.max(g.maxSpeed, 0))),
      G < 0 && g.speed < g.maxSpeed && (g.speed = g.maxSpeed),
      (g.strafeVel += (wantStrafe - g.strafeVel) * (1 - Math.exp(-7 * k))));
    let te = Math.sin(g.yaw),
      oe = Math.cos(g.yaw);
    for (let D of n.list) {
      if (D === g || D.type !== 'hound' || !D.active) continue;
      let B = g.pos.x - D.pos.x,
        X = g.pos.z - D.pos.z,
        re = Math.hypot(B, X);
      if (re < 1.5 && re > 0.001) {
        let Y = ((1.5 - re) * 2.2) / re;
        ((g.push.x += B * Y * k * 6), (g.push.z += X * Y * k * 6));
      }
    }
    if (C && Q < 1.2 && Q > 0.001) {
      let D = ((1.2 - Q) * 3) / Q;
      ((g.push.x += (g.pos.x - C.pos.x) * D * k * 6), (g.push.z += (g.pos.z - C.pos.z) * D * k * 6));
    }
    g.push.multiplyScalar(Math.exp(-5 * k));
    let ee = g.pos.x + (te * g.speed + oe * g.strafeVel + g.push.x) * k,
      le = g.pos.z + (oe * g.speed - te * g.strafeVel + g.push.z) * k,
      xe = s.physics.nav;
    if (((g.feelT -= k), g.feelT <= 0 && g.speed > 0.3)) {
      ((g.feelT = 0.12), Oo.set(g.pos.x, g.pos.y + 0.85, g.pos.z), Ho.set(te, 0, oe));
      let D = s.physics.raycast(Oo, Ho, 0.7 + g.speed * 0.12);
      g.blocked = !!D;
    } else g.speed <= 0.3 && (g.blocked = !1);
    (((xe.isWalkable && !xe.isWalkable(ee, le)) || g.blocked) &&
      (g.blocked
        ? ((ee = g.pos.x + g.push.x * k),
          (le = g.pos.z + g.push.z * k),
          (g.yawRate += (g.phase > 3.14 ? 1 : -1) * 4 * k))
        : xe.isWalkable(ee, g.pos.z)
          ? (le = g.pos.z)
          : xe.isWalkable(g.pos.x, le)
            ? (ee = g.pos.x)
            : ((ee = g.pos.x), (le = g.pos.z)),
      (g.speed *= 0.6),
      (g.strafeDir = -g.strafeDir),
      (g.strafeVel = 0),
      (g.stuckT += k),
      g.stuckT > 0.5 &&
        ((g.stuckT = 0),
        (g.planT = 0),
        g.mode === 'engage' && g.es === 'move' ? w() : g.mode === 'patrol' && (g.hasGoal = !1))),
      (g.pos.x = ee),
      (g.pos.z = le),
      (g.pos.y += (s.physics.groundHeight(ee, le, g.pos.y + 0.6) - g.pos.y) * (1 - Math.exp(-12 * k))),
      z(k),
      (g.crouch += (N - g.crouch) * (1 - Math.exp(-10 * k))));

    // Barrel heat dissipation & post-burst gunsmoke wisps from AK-47 muzzle
    if (g.barrelHeat > 0.05) {
      g.barrelHeat = Math.max(0, g.barrelHeat - k * 0.32);
      g.barrelSmokeT -= k;
      if (g.barrelSmokeT <= 0 && g.es !== 'burst' && s.fx && s.fx.smoke) {
        g.barrelSmokeT = 0.14 + o() * 0.12;
        s.fx.smoke(g.muzzle, { size: 0.11, life: 0.65, color: 6908265, rise: 0.45 });
      }
    }

    let j = Math.cos(g.yaw),
      O = Math.sin(g.yaw),
      q = 0,
      ue = 0,
      de = 0,
      $ = 0.02,
      se = g.pos.y + Yn.stand + g.sY.x - g.crouch * 0.35;
    if (F) {
      let D = F.x - g.pos.x,
        B = F.z - g.pos.z,
        X = F.y + 1.05 - (se + 0.38);
      ((q = bo(Math.atan2(D * j - B * O, D * O + B * j), -1.1, 1.1)),
        (ue = bo(Math.atan2(-X, Math.hypot(D, B)), -0.75, 0.55)));
    } else ((g.scan += k * 0.45), (q = Math.sin(g.scan * 0.85 + g.phase) * 0.25));
    if (H) {
      let D = H.x - g.pos.x,
        B = H.z - g.pos.z,
        X = H.y + 1.2 - (se + 0.55);
      ((de = bo(Math.atan2(D * j - B * O, D * O + B * j), -1.05, 1.05)),
        ($ = bo(Math.atan2(-X, Math.hypot(D, B)), -0.5, 0.45)));
    } else de = Math.sin(n.t * 0.65 + g.phase) * 0.38 + bo(g.yawRate * 0.25, -0.55, 0.55);
    let fe = bo(6.5 * k, 0, 1);
    ((g.tyaw += bo(O5(q, g.tyaw), -fe, fe)), (g.tpitch += (ue - g.tpitch) * (1 - Math.exp(-11 * k))));
    // Gaze-led human head tracking (head responds faster than torso)
    let me = 1 - Math.exp(-10 * k);
    ((g.hyaw += (de - g.hyaw) * me), (g.hpitch += ($ - g.hpitch) * me), I(k));
    let ce = g.mode === 'engage' ? YD : H5,
      P = 1 + g.flare * 0.8;
    for (let D = 0; D < 3; D++) g.lensC[D] += (ce[D] - g.lensC[D]) * (1 - Math.exp(-8 * k));
    (r.color.setRGB(g.lensC[0] * P, g.lensC[1] * P, g.lensC[2] * P),
      (g.flare = Math.max(0, g.flare - k * 2)));
  }
  function R(k) {
    (Oo.setFromMatrixPosition(l.gun.matrixWorld),
      (Oo.lengthSq() < 1e-6 || Math.abs(Oo.x - g.pos.x) > 2) &&
        Oo.set(g.pos.x, g.pos.y + 1.32, g.pos.z),
      G1.set(k.pos.x, k.pos.y + 1, k.pos.z),
      Ho.copy(G1).sub(Oo).normalize(),
      g.muzzle.copy(Oo).addScaledVector(Ho, 0.56));
    let F = (c0.spreadFar + (c0.spreadNear - c0.spreadFar) * g.exposure) * (1 + n.playerSpeed * 0.3);
    ((Ho.x += (o() - 0.5) * 2 * F),
      (Ho.y += (o() - 0.5) * 2 * F),
      (Ho.z += (o() - 0.5) * 2 * F),
      Ho.normalize());
    let H = s.physics.raycast(g.muzzle, Ho, 200),
      Z = s.combat.enemyShot(g.muzzle, Ho, { damage: c0.shotDamage, range: 200 })
        ? g.muzzle.distanceTo(G1)
        : H
          ? H.dist
          : 90;
    (YS.copy(g.muzzle).addScaledVector(Ho, Z),
      s.fx.tracer(g.muzzle, YS, { color: 16760944, speed: 260, width: 0.035 }),
      s.fx.muzzleFlash(g.muzzle, Ho, { scale: 0.95 }),
      s.render && s.render.lightPool && s.render.lightPool.flash(g.muzzle, 16756832, 22, 7, 0.05),
      s.events.emit('enemy:fire', { enemy: g, pos: g.muzzle, dir: Ho, type: 'hound' }));
    // Eject spinning 7.62x39mm brass shell casing to the shooter's right-up-forward
    if (s.fx && s.fx.shell) {
      let aimYawWorld = g.yaw + g.tyaw,
        rightX = -Math.cos(aimYawWorld),
        rightZ = Math.sin(aimYawWorld),
        fwdX = Math.sin(aimYawWorld),
        fwdZ = Math.cos(aimYawWorld);
      shellPos.copy(Oo).addScaledVector(Ho, 0.06);
      shellPos.x += rightX * 0.04;
      shellPos.y += 0.025;
      shellPos.z += rightZ * 0.04;
      shellVel.set(
        rightX * (1.7 + o() * 0.7) + fwdX * (0.4 + o() * 0.4),
        1.45 + o() * 0.65,
        rightZ * (1.7 + o() * 0.7) + fwdZ * (0.4 + o() * 0.4),
      );
      s.fx.shell(shellPos, shellVel);
    }
    // Realistic AK-47 recoil kick on rifle, barrel heat & shooter's upper body
    ((g.gunRecoil = Math.min(0.068, g.gunRecoil + 0.04)),
      (g.barrelHeat = Math.min(1, g.barrelHeat + 0.28)),
      (g.sP.v -= 1.05),
      (g.sR.v += (o() - 0.5) * 0.55),
      (g.sY.v -= 0.12));
  }
  function z(k) {
    // Smooth continuous human bipedal locomotion phase & footstep trigger
    let moveMag = Math.hypot(g.speed, g.strafeVel) + Math.abs(g.yawRate) * 0.22,
      moving = moveMag > 0.08,
      targetAmp = moving ? bo(moveMag / c0.runSpeed, 0.18, 1.15) : 0;
    g.strideAmp += (targetAmp - g.strideAmp) * (1 - Math.exp(-10 * k));
    if (moving) {
      let prevSin = Math.sin(g.walkPhase),
        freq = 2.6 + moveMag * 1.48;
      g.walkPhase = (g.walkPhase + freq * k) % (Math.PI * 2);
      let curSin = Math.sin(g.walkPhase);
      // Trigger synchronized human footstep sound & surface puddle/dust FX on each heel-strike
      if ((prevSin < 0 && curSin >= 0) || (prevSin > 0 && curSin <= 0)) {
        let footIdx = curSin >= 0 ? 0 : 1,
          side = footIdx === 0 ? 1 : -1;
        b[footIdx].p.set(
          g.pos.x + Math.cos(g.yaw) * side * Yn.hipX,
          g.pos.y,
          g.pos.z - Math.sin(g.yaw) * side * Yn.hipX,
        );
        s.events.emit('enemy:step', { pos: b[footIdx].p, type: 'hound', enemy: g, speed: moveMag });
        if (s.fx) {
          let inWater = !1;
          try {
            inWater = !!(s.ground && s.ground.isPuddle && s.ground.isPuddle(b[footIdx].p.x, b[footIdx].p.z));
          } catch {}
          if (inWater && s.fx.splash) {
            s.fx.splash(b[footIdx].p, moveMag > 3.2 ? 0.48 : 0.32);
          } else if (moveMag > 3.2 && o() < 0.45 && s.fx.dust) {
            s.fx.dust(b[footIdx].p, Qy);
          }
        }
        g.sY.v -= 0.06 + moveMag * 0.018;
      }
    } else {
      // Smoothly relax phase toward neutral standing posture when stopped
      let rem = O5(0, g.walkPhase);
      g.walkPhase += rem * (1 - Math.exp(-6 * k));
    }
  }
  function I(k) {
    let accel = k > 0 ? (g.speed - g.prevSpeed) / k : 0,
      amp = g.strideAmp,
      ph = g.walkPhase,
      sinP = Math.sin(ph),
      cosP = Math.cos(ph),
      sin2P = Math.sin(ph * 2),
      cos2P = Math.cos(ph * 2);

    // Target aimBlend: 0 = relaxed patrol carry, 0.58 = alert search, 1.0 = shouldered ADS firing
    let wantAim =
      !g.alive
        ? 0.12
        : g.mode === 'engage'
          ? g.es === 'move' && g.speed > 2.8
            ? 0.65
            : 1
          : g.mode === 'investigate' || g.mode === 'search'
            ? 0.58
            : 0.08;
    g.aimBlend += (wantAim - g.aimBlend) * (1 - Math.exp(-8 * k));
    g.gunRecoil *= Math.exp(-16 * k);

    if (g.alive) {
      let targetP = bo(accel * 0.012, -0.06, 0.08),
        targetR = bo(-g.yawRate * g.speed * 0.022 - g.strafeVel * 0.065, -0.12, 0.12);
      ll(g.sY, 0, 150, 16, k);
      ll(g.sP, targetP, 120, 14, k);
      ll(g.sR, targetR, 120, 14, k);
      ll(g.sL, 0, 110, 13, k);
    }

    let breathRate = g.mode === 'engage' ? 3.1 : 2.1,
      breath = g.alive ? Math.sin(n.t * breathRate + g.phase) : 0,
      idleShift = g.alive && amp < 0.25 ? Math.sin(n.t * 0.85 + g.phase * 1.7) * (1 - amp * 4) : 0,
      crouchAmt = g.crouch,
      // Natural human pelvis vertical bounce (double-frequency per stride) & lateral weight shift
      bobY = g.alive ? (-Math.abs(cosP) * 0.044 + sin2P * 0.013) * amp : 0,
      swayX = g.alive ? -sinP * 0.028 * amp + idleShift * 0.016 + g.sL.x : g.sL.x,
      pelvisY = Yn.stand + g.sY.x - crouchAmt * 0.34 + bobY + breath * 0.0035,
      pelvisYaw = g.alive ? sinP * 0.09 * amp + g.tyaw * 0.12 : 0,
      pelvisRoll = g.alive ? sinP * 0.046 * amp + idleShift * 0.022 + g.sR.x : g.sR.x,
      pelvisPitch = g.sP.x + crouchAmt * 0.18;

    a.group.rotation.y = g.yaw;
    l.body.position.set(swayX, pelvisY, 0);
    l.body.rotation.set(pelvisPitch, pelvisYaw, pelvisRoll);

    // --- LEGS: Smooth Human Hip, Knee & Ankle Gait Kinematics ---
    let hipSwingAmp = 0.58 * amp,
      kneeSwingAmp = 0.95 * amp,
      strafeBank = bo(g.strafeVel * 0.12, -0.12, 0.12);
    for (let leg = 0; leg < 2; leg++) {
      let isL = leg === 0,
        side = isL ? 1 : -1,
        legPh = isL ? ph : ph + Math.PI,
        sL = Math.sin(legPh),
        cL = Math.cos(legPh),
        swing = Math.max(0, cL), // > 0 when leg is swinging forward
        stance = Math.max(0, -cL), // > 0 when foot is planted pushing back
        thighBone = isL ? l.thighL : l.thighR,
        shinBone = isL ? l.shinL : l.shinR,
        footBone = isL ? l.footL : l.footR;

      if (g.alive) {
        // Negative X rotation swings thigh forward (+Z); positive X rotation bends knee backward (-Z)
        let kneeFlex =
            Math.pow(Math.max(0, Math.sin(legPh - 0.38)), 1.25) * kneeSwingAmp +
            stance * Math.max(0, Math.sin(legPh + 0.9)) * 0.15 * amp +
            crouchAmt * 1.55 +
            0.06,
          hipFlex =
            -sL * hipSwingAmp -
            swing * 0.19 * amp -
            crouchAmt * 0.82 -
            0.03,
          // Ankle: heel-strike dorsiflexion when swinging forward, plantarflexion push-off at end of stance
          footPitch =
            -Math.sin(legPh + 0.4) * 0.23 * amp -
            (hipFlex + kneeFlex) * (0.65 - 0.35 * swing);
        thighBone.rotation.set(
          hipFlex,
          side * -0.035,
          side * (-0.025 - 0.02 * crouchAmt) - pelvisRoll * 0.65 + sL * strafeBank,
        );
        shinBone.rotation.set(kneeFlex, 0, 0);
        footBone.rotation.set(bo(footPitch, -0.45, 0.55), 0, 0);
      } else {
        // Multi-stage human death collapse: knees buckle first, then relax as torso hits ground
        let buckle = bo(g.dieT * 3.2, 0, 1) * (1 - bo((g.dieT - 0.45) * 1.4, 0, 0.55)),
          settle = bo(g.dieT * 1.6, 0, 1);
        thighBone.rotation.set(
          -0.55 * buckle - 0.18 * settle + side * 0.14 * settle,
          side * 0.18 * settle,
          side * -0.08 * settle,
        );
        shinBone.rotation.set(1.15 * buckle + 0.38 * settle, 0, 0);
        footBone.rotation.set(0.25 * settle, 0, 0);
      }
    }

    // --- TORSO, NECK & HEAD (Gaze-Led Multi-Segment Spine) ---
    let aim = g.aimBlend,
      leanForward = g.alive
        ? g.speed * 0.04 + crouchAmt * 0.28 + aim * 0.09 + breath * 0.01 - g.sP.x * 0.6
        : 0.18 * bo(g.dieT * 2, 0, 1),
      torsoYaw = g.alive ? O5(g.tyaw, pelvisYaw) * (0.42 + 0.34 * aim) - sinP * 0.095 * amp * (1 - aim * 0.5) : 0,
      torsoRoll = g.alive ? -pelvisRoll * 0.55 + g.sR.x * 0.45 + strafeBank * 0.35 : 0;
    l.torso.rotation.set(leanForward, torsoYaw, torsoRoll);

    let neckPitch = g.alive ? g.hpitch * 0.42 - leanForward * 0.45 + breath * 0.014 : 0.28,
      headPitch = g.alive ? g.hpitch * 0.58 - leanForward * 0.35 : 0.32,
      headYaw = g.alive ? O5(g.hyaw, pelvisYaw + torsoYaw) : g.hyaw * 0.45,
      headRoll = g.alive ? -0.11 * aim + bo(headYaw * 0.12, -0.08, 0.08) : g.dieRoll * 0.28; // natural cheek-weld tilt onto AK stock
    l.neck.rotation.set(neckPitch, headYaw * 0.38, 0);
    l.head.rotation.set(headPitch, headYaw * 0.62, headRoll);

    // --- AK-47 RIFLE POSITION & ORIENTATION + 2-BONE ARM IK ---
    // Blend smoothly between low-ready patrol carry across chest and shouldered ADS firing pose
    let walkSwayX = g.alive ? cosP * 0.025 * amp * (1 - aim * 0.72) : 0,
      walkSwayY = g.alive ? -Math.abs(sinP) * 0.02 * amp * (1 - aim * 0.72) : 0,
      walkSwayYaw = g.alive ? -sinP * 0.082 * amp * (1 - aim * 0.75) : 0,
      gunPosX = -0.035 * (1 - aim) + -0.095 * aim + walkSwayX,
      gunPosY = 0.175 * (1 - aim) + 0.265 * aim + walkSwayY + breath * 0.0045,
      gunPosZ = 0.185 * (1 - aim) + 0.205 * aim - g.gunRecoil,
      patrolPitch = 0.26 + Math.sin(n.t * 1.5 + g.phase) * 0.025,
      patrolYaw = 0.44 + walkSwayYaw,
      patrolRoll = -0.22,
      aimYawLocal = O5(g.tyaw, pelvisYaw + torsoYaw),
      aimPitchLocal = g.tpitch - (pelvisPitch + leanForward) * 0.75 - g.gunRecoil * 1.45,
      gunPitch = patrolPitch * (1 - aim) + aimPitchLocal * aim,
      gunYaw = patrolYaw * (1 - aim) + aimYawLocal * aim,
      gunRoll = patrolRoll * (1 - aim) + -0.04 * aim;

    l.turret.position.set(gunPosX, gunPosY, gunPosZ);
    l.turret.rotation.set(0, gunYaw, 0);
    l.gun.rotation.set(gunPitch, 0, gunRoll);

    // Compute exact world-in-torso positions of AK-47 pistol grip (R hand) and wooden handguard (L hand)
    gunEuler.set(gunPitch, gunYaw, gunRoll, 'YXZ');
    gunQuat.setFromEuler(gunEuler);
    ikGripR.set(0, -0.072, -0.048).applyQuaternion(gunQuat).add(l.turret.position);
    ikGripL.set(0.012, -0.024, 0.205).applyQuaternion(gunQuat).add(l.turret.position);

    solveArmIK(l.shoulderR, l.forearmR, l.handR, ikShR, ikGripR, ikPoleR, Yn.armL1, Yn.armL2, -1);
    solveArmIK(l.shoulderL, l.forearmL, l.handL, ikShL, ikGripL, ikPoleL, Yn.armL1, Yn.armL2, 1);

    (a.group.updateMatrixWorld(!0), g.headPos.setFromMatrixPosition(l.head.matrixWorld));
  }
  function L(k) {
    ((g.alive = !1),
      n.releaseToken(g),
      (g.dieT = 0),
      (g.vy = 0),
      (g.es = 'move'),
      l.beacon.scale.setScalar(1e-4));
    // Determine natural human fall direction from hit impulse (backward or forward/sideways collapse)
    let fallBack = !0;
    if (k) {
      let fwdDot = k.x * Math.sin(g.yaw) + k.z * Math.cos(g.yaw);
      fallBack = fwdDot >= -0.1;
    }
    ((g.dieDir = fallBack ? -1 : 1),
      (g.diePitch = g.dieDir * (1.44 + o() * 0.12)),
      (g.dieRoll = (o() < 0.5 ? -1 : 1) * (0.2 + o() * 0.26)),
      (g.sP.v += g.dieDir * 2.8),
      (g.sR.v += g.dieRoll * 2.4),
      (g.speed *= 0.25),
      (g.strafeVel = 0),
      _s.copy(g.headPos),
      s.fx.dust(_s, Qy),
      s.events.emit('enemy:killed', { enemy: g, pos: g.pos, type: 'hound' }),
      n.addWreck(g));
  }
  function U(k) {
    if (g.sink > 0) {
      ((g.sink += k), (g.pos.y -= 0.22 * k), g.sink > 3.2 && n.retire(g));
      return;
    }
    g.dieT += k;
    let C = g.dieT;
    if (C < 1.8) {
      let groundOffset = 0.15 - Yn.stand,
        fallK = bo(C / 0.62, 0, 1),
        smoothFall = fallK * fallK * (3 - 2 * fallK);
      ((g.vy -= 9.8 * k * (C < 0.16 ? 0.5 : 1)),
        (g.sY.x += g.vy * k),
        g.sY.x < groundOffset &&
          ((g.sY.x = groundOffset),
          g.vy < -1.1 &&
            (s.events.emit('enemy:step', { pos: g.pos, type: 'hound', enemy: g, speed: 4, crash: !0 }),
            s.fx.dust(g.pos, Qy)),
          (g.vy = -g.vy * 0.15)),
        ll(g.sP, g.diePitch * smoothFall, 55, 9, k),
        ll(g.sR, g.dieRoll * smoothFall, 55, 9, k),
        ll(g.sL, 0, 40, 8, k),
        (g.pos.x += Math.sin(g.yaw) * g.speed * k),
        (g.pos.z += Math.cos(g.yaw) * g.speed * k),
        (g.speed *= Math.exp(-5 * k)),
        (g.hpitch += (0.35 - g.hpitch) * (1 - Math.exp(-5 * k))),
        (g.hyaw += (g.dieRoll * 0.6 - g.hyaw) * (1 - Math.exp(-4 * k))),
        (g.tpitch += (0.35 - g.tpitch) * (1 - Math.exp(-4 * k))),
        I(k));
    } else if (!g.wreck && ((g.wreck = !0), g.loop)) {
      try {
        g.loop.stop();
      } catch {}
      g.loop = null;
    }
  }
  return g;
}

function KS(n, e, t, i, s, o) {
  let r = n.x - t.x,
    a = n.y - t.y,
    l = n.z - t.z,
    c = r * e.x + a * e.y + l * e.z,
    u = r * r + a * a + l * l - i * i,
    f = c * c - u;
  if (f < 0) return !1;
  let h = -c - Math.sqrt(f);
  return h < 0 || h > s || h >= o.dist
    ? !1
    : ((o.dist = h), o.point.copy(n).addScaledVector(e, h), o.normal.copy(o.point).sub(t).normalize(), !0);
}

var qh = new THREE.Vector3(),
  eb = new THREE.Vector3(),
  $S = new THREE.Vector3();

function ZS(n, e, t, i, s, o, r) {
  (qh.copy(i).sub(t), eb.copy(n).sub(t));
  let a = qh.dot(qh),
    l = qh.dot(e),
    c = qh.dot(eb),
    u = e.dot(eb),
    f = a - l * l,
    h = f > 1e-8 ? (c - l * u) / f : 0;
  return ((h = h < 0 ? 0 : h > 1 ? 1 : h), $S.copy(t).addScaledVector(qh, h), KS(n, e, $S, s, o, r));
}

var Bi = {
    gull: Jy,
    hound: tb,
    sightRange: ENEMY_CONFIG.sightRange,
    sightCone: ENEMY_CONFIG.sightCone,
    loseSight: ENEMY_CONFIG.loseSight,
    searchTime: ENEMY_CONFIG.searchTime,
    hearRadius: ENEMY_CONFIG.hearRadius,
    maxTokens: 2,
    maxTokensCrowd: 3,
    tokenGap: 1.25,
    exposureUp: 0.1,
    exposureDown: 0.45,
    poolGulls: 10,
    poolHounds: 10,
    maxWrecks: 5,
    maxBolts: 32,
  },
  $D = Math.cos(((Bi.sightCone / 2) * Math.PI) / 180),
  JS = new THREE.Vector3(),
  kB = new THREE.Vector3(),
  nb = new THREE.Vector3(),
  QS = new THREE.Quaternion(),
  eT = new THREE.Matrix4(),
  tT = new THREE.Vector3(1, 1, 1),
  ZD = new THREE.Vector3(0, 0, 1),
  PB = new THREE.Vector3(0, -1, 0),
  nT = new THREE.Vector3(),
  iT = new THREE.Vector3();

async function W5(n) {
  let e = su(+((n.params && n.params.eseed) || 9001)),
    t = [],
    i = [],
    s = new THREE.Group();
  ((s.name = 'enemies'), n.scene.add(s));
  let o = n.mats.emissive(16777215, 1),
    r = o && o.isMeshBasicMaterial ? o.clone() : new THREE.MeshBasicMaterial();
  (r.color.setRGB(1, 1, 1), (r.vertexColors = !0), (r.needsUpdate = !0));
  let a = n.mats.emissive(16752704, 6),
    l = a && a.isMeshBasicMaterial ? a : new THREE.MeshBasicMaterial({ color: 16752704 }),
    c = o && o.toneMapped !== void 0 ? o.toneMapped : !0,
    u = {
      cloth: enhanceHumanClothShader(
        n.mats.get('glove_fabric', { color: 12895424, triplanar: !0, vertexColors: !0 }),
      ),
      skin: createHumanSkinMaterial(),
      shell: n.mats.get('armor_white', { triplanar: !0, vertexColors: !0 }),
      metal: n.mats.get('gunmetal', { triplanar: !0, vertexColors: !0 }),
      wood: n.mats.get('wood_dark', { triplanar: !0, vertexColors: !0 }),
      glow: r,
      lensBase: l,
      disc: new THREE.MeshBasicMaterial({
        color: 789775,
        transparent: !0,
        opacity: 0.42,
        depthWrite: !1,
        side: THREE.DoubleSide,
        toneMapped: c,
      }),
      cone: new THREE.ShaderMaterial({
        uniforms: { uColor: { value: new THREE.Color(1, 0.9, 0.74) }, uGain: { value: 0.085 } },
        vertexShader: `
        #include <common>
        #include <skinning_pars_vertex>
        varying float vT; varying vec3 vN; varying vec3 vV;
        void main() {
          #include <beginnormal_vertex>
          #include <skinbase_vertex>
          #include <skinnormal_vertex>
          #include <begin_vertex>
          #include <skinning_vertex>
          vec4 mv = modelViewMatrix * vec4(transformed, 1.0);
          vN = normalMatrix * objectNormal; vV = -mv.xyz; vT = 1.0 - uv.y;
          gl_Position = projectionMatrix * mv;
        }`,
        fragmentShader: `
        uniform vec3 uColor; uniform float uGain;
        varying float vT; varying vec3 vN; varying vec3 vV;
        void main() {
          float f = abs(dot(normalize(vN), normalize(vV)));
          f = f * f * (3.0 - 2.0 * f);
          float t = clamp(vT, 0.0, 1.0);
          float k = pow(1.0 - t, 1.7) * (0.35 + 0.65 * smoothstep(0.0, 0.06, t));
          gl_FragColor = vec4(uColor * (uGain * f * k), 1.0);
        }`,
        transparent: !0,
        blending: THREE.AdditiveBlending,
        depthWrite: !1,
        side: THREE.DoubleSide,
        fog: !1,
      }),
    },
    f = {
      G: n,
      rng: e,
      list: t,
      t: 0,
      playerSpeed: 0,
      tokens: 0,
      tokenT: -9,
      lastType: '',
      wantT: { gull: -9, hound: -9 },
      mergeSimple: (k) => Tr(k, !1),
      requestToken(k) {
        if (k.hasToken) return !0;
        let C = 0;
        for (let Z of t) Z.alive && C++;
        let A = C > 5 ? Bi.maxTokensCrowd : Bi.maxTokens,
          F = f.t - f.tokenT,
          H = k.type === 'gull' ? 'hound' : 'gull',
          N = f.lastType === k.type && f.t - f.wantT[H] < 0.5 && F < Bi.tokenGap * 2.2;
        return f.tokens >= A || F < Bi.tokenGap || N
          ? ((f.wantT[k.type] = f.t), !1)
          : (f.tokens++, (f.tokenT = f.t), (f.lastType = k.type), (k.hasToken = !0), !0);
      },
      releaseToken(k) {
        k.hasToken && ((k.hasToken = !1), (f.tokens = Math.max(0, f.tokens - 1)));
      },
      think(k, C, A) {
        let F = n.player;
        if (k.passive || !F) {
          k.los = !1;
          return;
        }
        if (((k.senseT -= C), k.senseT <= 0)) {
          k.senseT = 0.11 + e() * 0.08;
          let H = !1;
          if (F.alive !== !1) {
            let N = F.eye || F.pos,
              Z = N.x - k.sensor.x,
              Q = N.y - k.sensor.y,
              W = N.z - k.sensor.z,
              J = Math.hypot(Z, Q, W);
            if (J < Bi.sightRange) {
              let G = Math.hypot(Z, W) || 1e-4,
                te = (Z * k.fwd.x + W * k.fwd.z) / G;
              (k.mode === 'engage' || te > $D || J < 3.5) && (H = n.physics.lineOfSight(k.sensor, N));
            }
          }
          k.los = H;
        }
        (k.los
          ? ((k.seeT += C),
            (k.noSeeT = 0),
            k.lastKnown.copy(F.pos),
            (k.exposure = Math.min(1, k.exposure + C * Bi.exposureUp)))
          : ((k.noSeeT += C),
            (k.seeT = Math.max(0, k.seeT - C * 0.6)),
            (k.exposure = Math.max(0, k.exposure - C * Bi.exposureDown))),
          k.mode === 'engage'
            ? (k.noSeeT > Bi.loseSight || F.alive === !1) &&
              ((k.mode = 'search'), (k.modeT = Bi.searchTime + e() * 3), f.releaseToken(k))
            : k.los && k.seeT > (k.mode === 'patrol' ? A : A * 0.45)
              ? ((k.mode = 'engage'),
                (k.noSeeT = 0),
                n.events.emit('enemy:alert', { enemy: k }),
                f.rally(k.pos, 18, F.pos, k))
              : k.mode !== 'patrol' &&
                ((k.modeT -= C),
                k.modeT <= 0 && ((k.mode = 'patrol'), (k.home.x = k.pos.x), (k.home.z = k.pos.z))));
      },
      rally(k, C, A, F) {
        for (let H of t)
          H === F ||
            !H.alive ||
            H.passive ||
            H.mode === 'engage' ||
            H.pos.distanceToSquared(k) > C * C ||
            (H.lastKnown.copy(A), (H.mode = 'investigate'), (H.modeT = 9 + e() * 4));
      },
      provoke(k) {
        let C = n.player;
        !C ||
          k.passive ||
          !k.alive ||
          (k.mode !== 'engage' &&
            (k.lastKnown.copy(C.pos), (k.mode = 'investigate'), (k.modeT = 10), (k.seeT = 1), (k.senseT = 0)),
          f.rally(k.pos, 20, C.pos, k));
      },
      fireBolt(k, C, A) {
        let F = null;
        for (let H = 0; H < x.length; H++)
          if (!x[H].on) {
            F = x[H];
            break;
          }
        F && ((F.on = !0), (F.life = 1.3), F.pos.copy(k), F.dir.copy(C), F.from.copy(k), (F.len = 0));
      },
      addWreck(k) {
        for (i.push(k); i.length > Bi.maxWrecks;) {
          let C = i.shift();
          C.active && (C.sink = 0.001);
        }
      },
      retire(k) {
        k._deactivate();
        let C = t.indexOf(k);
        (C >= 0 && t.splice(C, 1), (C = i.indexOf(k)), C >= 0 && i.splice(C, 1));
      },
    },
    h = WS(),
    p = VS(),
    d = [],
    m = [];
  for (let k = 0; k < Bi.poolGulls; k++) {
    let C = XS(f, h, u, k);
    (d.push(C), s.add(C.rig.group));
  }
  for (let k = 0; k < Bi.poolHounds; k++) {
    let C = jS(f, p, u, k);
    (m.push(C), s.add(C.rig.group));
  }
  let x = [];
  for (let k = 0; k < Bi.maxBolts; k++)
    x.push({
      on: !1,
      life: 0,
      len: 0,
      pos: new THREE.Vector3(),
      dir: new THREE.Vector3(),
      from: new THREE.Vector3(),
    });
  let v = new THREE.CylinderGeometry(0.016, 0.03, 1, 6, 1);
  (v.rotateX(Math.PI / 2), v.translate(0, 0, -0.5));
  let y = n.mats.emissive(16738858, 14),
    b =
      y && y.isMeshBasicMaterial
        ? y
        : new THREE.MeshBasicMaterial({ color: new THREE.Color(16738858).multiplyScalar(14) }),
    g = new THREE.InstancedMesh(v, b, Bi.maxBolts);
  ((g.frustumCulled = !1),
    (g.castShadow = !1),
    (g.receiveShadow = !1),
    (g.count = 0),
    g.instanceMatrix.setUsage(THREE.DynamicDrawUsage),
    s.add(g));
  let E = {
    point: new THREE.Vector3(),
    normal: new THREE.Vector3(),
    dist: 0,
    surface: 'concrete',
    enemy: null,
    part: null,
    dir: new THREE.Vector3(),
    from: 'enemy',
  };
  function M(k) {
    let C = n.player,
      A = 0;
    for (let F = 0; F < x.length; F++) {
      let H = x[F];
      if (!H.on) continue;
      let N = Bi.gull.boltSpeed * k;
      H.life -= k;
      let Z = n.physics.raycast(H.pos, H.dir, N),
        Q = Z ? Z.dist : N,
        W = !1;
      if (
        (C &&
          C.alive !== !1 &&
          (JS.copy(H.pos).addScaledVector(H.dir, Q),
          nT.set(C.pos.x, C.pos.y + 0.35, C.pos.z),
          iT.set(C.pos.x, C.pos.y + (C.crouching ? 1 : 1.5), C.pos.z),
          jD(H.pos, JS, nT, iT) < 0.36 * 0.36 && (W = !0)),
        W)
      ) {
        (C.damage(Bi.gull.boltDamage, H.from), (H.on = !1));
        continue;
      }
      if (Z) {
        (E.point.copy(Z.point),
          E.normal.copy(Z.normal),
          (E.dist = Z.dist),
          (E.surface = Z.surface),
          E.dir.copy(H.dir),
          n.events.emit('impact', E),
          (H.on = !1));
        continue;
      }
      if (H.life <= 0) {
        H.on = !1;
        continue;
      }
      (H.pos.addScaledVector(H.dir, N),
        (H.len = Math.min(1.5, H.len + N)),
        QS.setFromUnitVectors(ZD, H.dir),
        tT.set(1, 1, Math.max(0.2, H.len)),
        eT.compose(H.pos, QS, tT),
        g.setMatrixAt(A++, eT));
    }
    (A || g.count) && ((g.count = A), (g.instanceMatrix.needsUpdate = !0));
  }
  let _ = null,
    T = !1,
    w = 0,
    S = new THREE.Vector3(),
    R = 0;
  function z(k) {
    if (!T) {
      T = !0;
      try {
        _ =
          n.render && n.render.lightPool && n.render.lightPool.acquire ? n.render.lightPool.acquire() : null;
      } catch {
        _ = null;
      }
      _ && _.light && (_.light.color.setRGB(1, 0.9, 0.75), (_.light.distance = 9));
    }
    if (!_ || !_.light) return;
    let C = null,
      A = 3600,
      F = n.camera ? n.camera.position : null;
    for (let N of t) {
      if (N.type !== 'gull' || !N.alive) continue;
      let Z = F ? N.pos.distanceToSquared(F) : 0;
      Z < A && ((A = Z), (C = N));
    }
    let H = 0;
    if (C) {
      if (((w -= k), w <= 0)) {
        w = 0.1;
        let N = C.yaw + C.gy,
          Z = Math.cos(C.gp);
        nb.set(Math.sin(N) * Z, -Math.sin(C.gp), Math.cos(N) * Z).normalize();
        let Q = n.physics.raycast(C.sensor, nb, 14);
        (S.copy(C.sensor).addScaledVector(nb, (Q ? Q.dist : 8) - 0.6), (R = Q ? 1 : 0.3));
      }
      ((H = 26 * R), _.light.position.lerp(S, 1 - Math.exp(-12 * k)));
    }
    _.light.intensity += (H - _.light.intensity) * (1 - Math.exp(-8 * k));
  }
  let I = 1,
    L = 0,
    U = {
      list: t,
      TUNE: Bi,
      spawn(k, C, A = {}) {
        let isGround = k === 'hound' || k === 'terrorist',
          F = k === 'gull' ? d : isGround ? m : null;
        if (!F) return null;
        let H = null;
        for (let N of F)
          if (!N.active) {
            H = N;
            break;
          }
        if (!H && isGround && i.length) {
          let N = i[0];
          (f.retire(N), (H = N));
        }
        return H
          ? ((H.id = I++), t.push(H), H._activate(C, A), n.events.emit('enemy:spawn', { enemy: H }), H)
          : null;
      },
      raycast(k, C, A = 300) {
        let F = null;
        for (let H = 0; H < t.length; H++) {
          let N = t[H];
          if (!N.alive) continue;
          let Z = N.pos.x - k.x,
            Q = N.pos.y + (N.type === 'hound' ? 0.9 : 0) - k.y,
            W = N.pos.z - k.z,
            J = Z * C.x + Q * C.y + W * C.z;
          J < -1.8 ||
            J > A + 1.8 ||
            Z * Z + Q * Q + W * W - J * J > 2.25 ||
            (F ||
              (F = {
                dist: 1 / 0,
                point: new THREE.Vector3(),
                normal: new THREE.Vector3(),
                enemy: null,
                part: 'body',
              }),
            N._raycast(k, C, A, F));
        }
        return F && F.enemy ? F : null;
      },
      aliveCount() {
        let k = 0;
        for (let C of t) C.alive && k++;
        return k;
      },
      clear() {
        for (let k of d) k.active && k._deactivate();
        for (let k of m) k.active && k._deactivate();
        ((t.length = 0), (i.length = 0), (f.tokens = 0));
        for (let k of x) k.on = !1;
        ((g.count = 0), _ && _.light && (_.light.intensity = 0));
      },
      alert(k, C = 40) {
        for (let A of t)
          !A.alive ||
            A.passive ||
            A.mode === 'engage' ||
            A.pos.distanceToSquared(k) > C * C ||
            (A.lastKnown.copy(k),
            (A.lastKnown.y = Math.max(0, k.y - 1.6)),
            A.mode === 'patrol' && n.events.emit('enemy:alert', { enemy: A, noise: !0 }),
            (A.mode = 'investigate'),
            (A.modeT = 9 + e() * 4));
      },
      update(k) {
        if (k <= 0) return;
        (k > 0.05 && (k = 0.05), (f.t += k), (L -= k));
        let C = n.player;
        if (C) {
          let A = C.vel ? Math.hypot(C.vel.x, C.vel.z) : C.speed || 0;
          f.playerSpeed += (A - f.playerSpeed) * (1 - Math.exp(-6 * k));
        }
        for (let A = t.length - 1; A >= 0; A--) t[A]._update(k);
        (M(k), z(k));
      },
      debug: {
        ctx: f,
        gulls: d,
        hounds: m,
        wrecks: i,
        bolts: x,
        mats: u,
        tris: { gull: h.tris + h.extra.tris, hound: p.tris },
      },
    };
  return (
    n.events.on('weapon:fire', (k) => {
      if (L > 0) return;
      L = 0.3;
      let C = (k && (k.origin || k.muzzle)) || (n.player && n.player.pos);
      C && U.alert(C, Bi.hearRadius);
    }),
    n.events.on('explosion', (k) => {
      k && k.pos && U.alert(k.pos, 30);
    }),
    n.events.on('game:state', (k) => {
      k && k.state === 'title' && U.clear();
    }),
    U
  );
}

var rc = new THREE.Vector3(),
  ac = new THREE.Vector3(),
  lc = new THREE.Vector3();

function jD(n, e, t, i) {
  (rc.copy(e).sub(n), ac.copy(i).sub(t), lc.copy(n).sub(t));
  let s = rc.dot(rc),
    o = ac.dot(ac),
    r = ac.dot(lc),
    a,
    l;
  if (s <= 1e-9 && o <= 1e-9) return lc.dot(lc);
  if (s <= 1e-9) ((a = 0), (l = Math.min(1, Math.max(0, r / o))));
  else {
    let h = rc.dot(lc);
    if (o <= 1e-9) ((l = 0), (a = Math.min(1, Math.max(0, -h / s))));
    else {
      let p = rc.dot(ac),
        d = s * o - p * p;
      ((a = d > 1e-9 ? Math.min(1, Math.max(0, (p * r - h * o) / d)) : 0),
        (l = (p * a + r) / o),
        l < 0
          ? ((l = 0), (a = Math.min(1, Math.max(0, -h / s))))
          : l > 1 && ((l = 1), (a = Math.min(1, Math.max(0, (p - h) / s)))));
    }
  }
  let c = lc.x + rc.x * a - ac.x * l,
    u = lc.y + rc.y * a - ac.y * l,
    f = lc.z + rc.z * a - ac.z * l;
  return c * c + u * u + f * f;
}

async function KD(n) {
  let e = await W5(n);
  n.enemies = e;
  let t = (l, c, u) => new THREE.Vector3(l, c, u),
    i = n.params.eshow || 'both',
    s = [2.4, 1.55, 3.1],
    o = [0.2, 1.05, 0.2],
    r = 2.6;
  if (i === 'gull')
    (e.spawn('gull', t(0, 1.6, 0), { passive: !0, hover: 1.6, patrolRadius: 0.02, yaw: 0.7 }),
      (s = [1.25, 1.95, 1.45]),
      (o = [0, 1.52, 0]),
      (r = 1.2));
  else if (i === 'hound' || i === 'terrorist')
    (e.spawn('hound', t(0, 0, 0), { passive: !0, yaw: 0.65, patrolLine: [t(1.6, 0, 1.3), t(-1.6, 0, -1.3)] }),
      (s = [1.9, 1.35, 2.2]),
      (o = [0.3, 1.05, 0.3]),
      (r = 1.25));
  else if (i === 'fight')
    (e.spawn('hound', t(-7, 0, -9), { state: 'alert' }),
      e.spawn('hound', t(8, 0, -7), { state: 'alert' }),
      e.spawn('hound', t(0, 0, -14), { state: 'alert' }),
      e.spawn('hound', t(-4, 0, -12), { state: 'alert' }),
      e.spawn('hound', t(5, 0, -11), { state: 'alert' }),
      (s = [5, 2.6, 10]),
      (o = [0, 1.6, -5]),
      (r = 7));
  else if (i === 'dead') {
    let l = e.spawn('hound', t(0, 0, 0), { passive: !0, yaw: 0.8 });
    e.spawn('hound', t(2.2, 0, -1.6), {
      passive: !0,
      yaw: -0.6,
      patrolLine: [t(2.2, 0, -1.6), t(3.4, 0, -3)],
    });
    for (let u = 0; u < 30; u++) e.update(1 / 60);
    l.damage(999, l.pos, t(0.6, 0, -0.8), 'body');
    for (let u = 0; u < 110; u++) e.update(1 / 60);
    ((s = [2.6, 1.3, 3.2]), (o = [0, 0.7, 0]), (r = 0.42));
  } else
    (e.spawn('hound', t(-1.1, 0, -0.4), {
      passive: !0,
      state: 'alert',
      yaw: 0.45,
      patrolRadius: 0.2,
    }),
      e.spawn('hound', t(0.4, 0, 0.5), {
        passive: !0,
        yaw: 1.1,
        patrolLine: [t(2.4, 0, 1.2), t(-1.6, 0, 0.2)],
      }));
  n.params.epre != null && (r = +n.params.epre);
  for (let l = 0, c = Math.round(r * 60); l < c; l++) e.update(1 / 60);
  let a = !!n.params.efreeze;
  return {
    cam: s,
    target: o,
    update(l) {
      a || e.update(l);
    },
  };
}

export { W5, ib };
