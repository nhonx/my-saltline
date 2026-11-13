// @ts-nocheck
import * as THREE from 'three';

function Tr(n, e = !1) {
  let t = n[0].index !== null,
    i = new Set(Object.keys(n[0].attributes)),
    s = new Set(Object.keys(n[0].morphAttributes)),
    o = {},
    r = {},
    a = n[0].morphTargetsRelative,
    l = new THREE.BufferGeometry(),
    c = 0;
  for (let u = 0; u < n.length; ++u) {
    let f = n[u],
      h = 0;
    if (t !== (f.index !== null))
      return (
        console.error(
          'THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ' +
            u +
            '. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.',
        ),
        null
      );
    for (let p in f.attributes) {
      if (!i.has(p))
        return (
          console.error(
            'THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ' +
              u +
              '. All geometries must have compatible attributes; make sure "' +
              p +
              '" attribute exists among all geometries, or in none of them.',
          ),
          null
        );
      (o[p] === void 0 && (o[p] = []), o[p].push(f.attributes[p]), h++);
    }
    if (h !== i.size)
      return (
        console.error(
          'THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ' +
            u +
            '. Make sure all geometries have the same number of attributes.',
        ),
        null
      );
    if (a !== f.morphTargetsRelative)
      return (
        console.error(
          'THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ' +
            u +
            '. .morphTargetsRelative must be consistent throughout all geometries.',
        ),
        null
      );
    for (let p in f.morphAttributes) {
      if (!s.has(p))
        return (
          console.error(
            'THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ' +
              u +
              '.  .morphAttributes must be consistent throughout all geometries.',
          ),
          null
        );
      (r[p] === void 0 && (r[p] = []), r[p].push(f.morphAttributes[p]));
    }
    if (e) {
      let p;
      if (t) p = f.index.count;
      else if (f.attributes.position !== void 0) p = f.attributes.position.count;
      else
        return (
          console.error(
            'THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ' +
              u +
              '. The geometry must have either an index or a position attribute',
          ),
          null
        );
      (l.addGroup(c, p, u), (c += p));
    }
  }
  if (t) {
    let u = 0,
      f = [];
    for (let h = 0; h < n.length; ++h) {
      let p = n[h].index;
      for (let d = 0; d < p.count; ++d) f.push(p.getX(d) + u);
      u += n[h].attributes.position.count;
    }
    l.setIndex(f);
  }
  for (let u in o) {
    let f = HM(o[u]);
    if (!f)
      return (
        console.error(
          'THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the ' +
            u +
            ' attribute.',
        ),
        null
      );
    l.setAttribute(u, f);
  }
  for (let u in r) {
    let f = r[u][0].length;
    if (f === 0) break;
    ((l.morphAttributes = l.morphAttributes || {}), (l.morphAttributes[u] = []));
    for (let h = 0; h < f; ++h) {
      let p = [];
      for (let m = 0; m < r[u].length; ++m) p.push(r[u][m][h]);
      let d = HM(p);
      if (!d)
        return (
          console.error(
            'THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the ' +
              u +
              ' morphAttribute.',
          ),
          null
        );
      l.morphAttributes[u].push(d);
    }
  }
  return l;
}

function HM(n) {
  let e,
    t,
    i,
    s = -1,
    o = 0;
  for (let c = 0; c < n.length; ++c) {
    let u = n[c];
    if ((e === void 0 && (e = u.array.constructor), e !== u.array.constructor))
      return (
        console.error(
          'THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.',
        ),
        null
      );
    if ((t === void 0 && (t = u.itemSize), t !== u.itemSize))
      return (
        console.error(
          'THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.',
        ),
        null
      );
    if ((i === void 0 && (i = u.normalized), i !== u.normalized))
      return (
        console.error(
          'THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.',
        ),
        null
      );
    if ((s === -1 && (s = u.gpuType), s !== u.gpuType))
      return (
        console.error(
          'THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.',
        ),
        null
      );
    o += u.count * t;
  }
  let r = new e(o),
    a = new THREE.BufferAttribute(r, t, i),
    l = 0;
  for (let c = 0; c < n.length; ++c) {
    let u = n[c];
    if (u.isInterleavedBufferAttribute) {
      let f = l / t;
      for (let h = 0, p = u.count; h < p; h++)
        for (let d = 0; d < t; d++) {
          let m = u.getComponent(h, d);
          a.setComponent(h + f, d, m);
        }
    } else r.set(u.array, l);
    l += u.count * t;
  }
  return (s !== void 0 && (a.gpuType = s), a);
}

var za = new THREE.Vector3();

function ot(n, e, t, i = 'center') {
  let s = new THREE.BoxGeometry(n, e, t),
    o = s.attributes.uv,
    r = s.attributes.position,
    a = s.attributes.normal;
  for (let l = 0; l < o.count; l++) {
    let c = Math.abs(a.getX(l)),
      u = Math.abs(a.getY(l)),
      f = r.getX(l),
      h = r.getY(l),
      p = r.getZ(l);
    c > 0.5 ? o.setXY(l, p, h) : u > 0.5 ? o.setXY(l, f, p) : o.setXY(l, f, h);
  }
  return (i === 'bottom' && s.translate(0, e / 2, 0), s);
}

function Ei(n, e, t, i = 0.02, s = 'center') {
  i = Math.min(i, n / 2 - 1e-4, e / 2 - 1e-4, t / 2 - 1e-4);
  let o = new THREE.BoxGeometry(n, e, t, 3, 3, 3),
    r = o.attributes.position,
    a = o.attributes.normal,
    l = o.attributes.uv,
    c = n / 2,
    u = e / 2,
    f = t / 2,
    h = (p, d) => {
      let m = Math.abs(p),
        x = Math.sign(p);
      return m > d - 1e-5 ? x * d : x * (d - i);
    };
  for (let p = 0; p < r.count; p++) {
    let d = h(r.getX(p), c),
      m = h(r.getY(p), u),
      x = h(r.getZ(p), f),
      v = Math.max(-(c - i), Math.min(c - i, d)),
      y = Math.max(-(u - i), Math.min(u - i, m)),
      b = Math.max(-(f - i), Math.min(f - i, x));
    if ((za.set(d - v, m - y, x - b), za.lengthSq() > 1e-10)) {
      za.normalize();
      let _ = a.getX(p),
        T = a.getY(p),
        w = a.getZ(p);
      (Math.abs(d) > c - 1e-5 ? 1 : 0) +
        (Math.abs(m) > u - 1e-5 ? 1 : 0) +
        (Math.abs(x) > f - 1e-5 ? 1 : 0) >=
      2
        ? ((d = v + za.x * i), (m = y + za.y * i), (x = b + za.z * i), a.setXYZ(p, za.x, za.y, za.z))
        : a.setXYZ(p, _, T, w);
    }
    r.setXYZ(p, d, m, x);
    let g = Math.abs(a.getX(p)),
      E = Math.abs(a.getY(p)),
      M = Math.abs(a.getZ(p));
    g >= E && g >= M ? l.setXY(p, x, m) : E >= g && E >= M ? l.setXY(p, d, x) : l.setXY(p, d, m);
  }
  return (s === 'bottom' && o.translate(0, e / 2, 0), o);
}

function vt(n, e, t, i = 16, s = !1, o = 'center') {
  let r = new THREE.CylinderGeometry(n, e, t, i, 1, s),
    a = r.attributes.uv,
    l = r.attributes.position,
    c = r.attributes.normal,
    u = Math.PI * (n + e);
  for (let f = 0; f < a.count; f++)
    Math.abs(c.getY(f)) > 0.9 ? a.setXY(f, l.getX(f), l.getZ(f)) : a.setXY(f, a.getX(f) * u, l.getY(f));
  return (o === 'bottom' && r.translate(0, t / 2, 0), r);
}

function bn(n, e = 0.03, t = 8, i = !1, s = 0) {
  let o = n.map((f) => (f.isVector3 ? f : new THREE.Vector3(f[0], f[1], f[2]))),
    r = new THREE.CatmullRomCurve3(o, i, 'catmullrom', s),
    a = r.getLength(),
    l = Math.max(2, Math.ceil(a / Math.max(0.08, e * 3))),
    c = new THREE.TubeGeometry(r, Math.min(l, 400), e, t, i),
    u = c.attributes.uv;
  for (let f = 0; f < u.count; f++) u.setXY(f, u.getX(f) * a, u.getY(f) * Math.PI * 2 * e);
  return c;
}

var OM = new THREE.Matrix4(),
  VM = new THREE.Quaternion(),
  WM = new THREE.Euler(),
  GM = new THREE.Vector3(),
  ev = new THREE.Vector3();

function th(n, { p: e = [0, 0, 0], r: t = [0, 0, 0], s: i = 1 } = {}) {
  return (
    WM.set(t[0], t[1], t[2]),
    VM.setFromEuler(WM),
    GM.set(e[0], e[1], e[2]),
    typeof i == 'number' ? ev.set(i, i, i) : ev.set(i[0], i[1], i[2]),
    OM.compose(GM, VM, ev),
    n.applyMatrix4(OM),
    n
  );
}

function Kr(n, e) {
  let t = n.attributes.position,
    i = t.count,
    s = new Float32Array(i * 3);
  for (let o = 0; o < i; o++) {
    let r = typeof e == 'function' ? e(t.getX(o), t.getY(o), t.getZ(o)) : e;
    ((s[o * 3] = r[0]), (s[o * 3 + 1] = r[1]), (s[o * 3 + 2] = r[2]));
  }
  return (n.setAttribute('color', new THREE.BufferAttribute(s, 3)), n);
}

function Jr(n) {
  let e = n
    .filter(Boolean)
    .map(
      (l) => (
        l.attributes.uv ||
          l.setAttribute(
            'uv',
            new THREE.BufferAttribute(new Float32Array(l.attributes.position.count * 2), 2),
          ),
        l.attributes.normal || l.computeVertexNormals(),
        l
      ),
    );
  if (!e.length) return new THREE.BufferGeometry();
  let t = e.some((l) => l.attributes.color),
    i = e.map((l) => {
      let c = (l.index, l);
      if (t && !c.attributes.color) {
        let u = new Float32Array(c.attributes.position.count * 3).fill(1);
        c.setAttribute('color', new THREE.BufferAttribute(u, 3));
      }
      for (let u of Object.keys(c.attributes))
        ['position', 'normal', 'uv', 'color'].includes(u) || c.deleteAttribute(u);
      return c;
    }),
    s = i.every((l) => l.index),
    o = i.every((l) => !l.index),
    r = s || o ? i : i.map((l) => (l.index ? l.toNonIndexed() : l));
  return Tr(r, !1) || new THREE.BufferGeometry();
}

function ig(n, { castShadow: e = !0, receiveShadow: t = !0 } = {}) {
  n.updateMatrixWorld(!0);
  let i = new Map(),
    s = [];
  n.traverse((r) => {
    if (!r.isMesh) return;
    let a = r,
      l = !1;
    for (; a;) {
      if (a.userData && a.userData.noMerge) {
        l = !0;
        break;
      }
      a = a.parent;
    }
    if (l || r.isSkinnedMesh || r.isInstancedMesh || Array.isArray(r.material)) {
      s.push(r);
      return;
    }
    let c =
      r.material.uuid + (r.castShadow ? 'c' : 'n') + (r.receiveShadow ? 'r' : 'n') + ':' + r.layers.mask;
    i.has(c) ||
      i.set(c, {
        mat: r.material,
        geos: [],
        cast: r.castShadow,
        recv: r.receiveShadow,
        layers: r.layers.mask,
      });
    let u = r.geometry.clone();
    (u.applyMatrix4(r.matrixWorld), i.get(c).geos.push(u));
  });
  let o = new THREE.Group();
  for (let r of i.values()) {
    let a = new THREE.Mesh(Jr(r.geos), r.mat);
    ((a.castShadow = r.cast && e), (a.receiveShadow = r.recv && t), (a.layers.mask = r.layers), o.add(a));
  }
  for (let r of s) {
    r.updateMatrixWorld(!0);
    let a = r.matrixWorld.clone();
    (o.add(r), r.matrix.copy(a), r.matrix.decompose(r.position, r.quaternion, r.scale));
  }
  return o;
}

function ns(n, e, { cast: t = !0, recv: i = !0 } = {}) {
  let s = new THREE.Mesh(n, e);
  return ((s.castShadow = t), (s.receiveShadow = i), s);
}

export { Ei, Jr, Kr, Tr, bn, ig, ns, ot, th, vt };
