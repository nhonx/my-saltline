import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export { mergeGeometries };

export type PivotOrigin = 'center' | 'bottom';

export interface GeometryTransform {
  p?: [number, number, number];
  r?: [number, number, number];
  s?: number | [number, number, number];
}

const _tmpVec = new THREE.Vector3();
const _mat4 = new THREE.Matrix4();
const _quat = new THREE.Quaternion();
const _euler = new THREE.Euler();
const _pos = new THREE.Vector3();
const _scale = new THREE.Vector3();

/** Create a box geometry with world-space planar UVs. */
export function box(w: number, h: number, d: number, origin: PivotOrigin = 'center'): THREE.BoxGeometry {
  const geo = new THREE.BoxGeometry(w, h, d);
  const uv = geo.attributes.uv;
  const pos = geo.attributes.position;
  const norm = geo.attributes.normal;
  for (let i = 0; i < uv.count; i++) {
    const nx = Math.abs(norm.getX(i));
    const ny = Math.abs(norm.getY(i));
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    if (nx > 0.5) uv.setXY(i, z, y);
    else if (ny > 0.5) uv.setXY(i, x, z);
    else uv.setXY(i, x, y);
  }
  if (origin === 'bottom') geo.translate(0, h / 2, 0);
  return geo;
}

/** Create a rounded box geometry with world-space planar UVs. */
export function roundedBox(
  w: number,
  h: number,
  d: number,
  radius = 0.02,
  origin: PivotOrigin = 'center',
): THREE.BoxGeometry {
  const r = Math.min(radius, w / 2 - 1e-4, h / 2 - 1e-4, d / 2 - 1e-4);
  const geo = new THREE.BoxGeometry(w, h, d, 3, 3, 3);
  const pos = geo.attributes.position;
  const norm = geo.attributes.normal;
  const uv = geo.attributes.uv;
  const hw = w / 2;
  const hh = h / 2;
  const hd = d / 2;

  const snap = (val: number, half: number) => {
    const abs = Math.abs(val);
    const sgn = Math.sign(val);
    return abs > half - 1e-5 ? sgn * half : sgn * (half - r);
  };

  for (let i = 0; i < pos.count; i++) {
    let x = snap(pos.getX(i), hw);
    let y = snap(pos.getY(i), hh);
    let z = snap(pos.getZ(i), hd);
    const cx = Math.max(-(hw - r), Math.min(hw - r, x));
    const cy = Math.max(-(hh - r), Math.min(hh - r, y));
    const cz = Math.max(-(hd - r), Math.min(hd - r, z));
    _tmpVec.set(x - cx, y - cy, z - cz);
    if (_tmpVec.lengthSq() > 1e-10) {
      _tmpVec.normalize();
      const ox = norm.getX(i);
      const oy = norm.getY(i);
      const oz = norm.getZ(i);
      const edges =
        (Math.abs(x) > hw - 1e-5 ? 1 : 0) +
        (Math.abs(y) > hh - 1e-5 ? 1 : 0) +
        (Math.abs(z) > hd - 1e-5 ? 1 : 0);
      if (edges >= 2) {
        x = cx + _tmpVec.x * r;
        y = cy + _tmpVec.y * r;
        z = cz + _tmpVec.z * r;
        norm.setXYZ(i, _tmpVec.x, _tmpVec.y, _tmpVec.z);
      } else {
        norm.setXYZ(i, ox, oy, oz);
      }
    }
    pos.setXYZ(i, x, y, z);
    const nx = Math.abs(norm.getX(i));
    const ny = Math.abs(norm.getY(i));
    const nz = Math.abs(norm.getZ(i));
    if (nx >= ny && nx >= nz) uv.setXY(i, z, y);
    else if (ny >= nx && ny >= nz) uv.setXY(i, x, z);
    else uv.setXY(i, x, y);
  }
  if (origin === 'bottom') geo.translate(0, h / 2, 0);
  return geo;
}

/** Create a cylinder geometry with world-scaled cylindrical/planar UVs. */
export function cylinder(
  rTop: number,
  rBottom: number,
  height: number,
  radialSegments = 16,
  openEnded = false,
  origin: PivotOrigin = 'center',
): THREE.CylinderGeometry {
  const geo = new THREE.CylinderGeometry(rTop, rBottom, height, radialSegments, 1, openEnded);
  const uv = geo.attributes.uv;
  const pos = geo.attributes.position;
  const norm = geo.attributes.normal;
  const circ = Math.PI * (rTop + rBottom);
  for (let i = 0; i < uv.count; i++) {
    if (Math.abs(norm.getY(i)) > 0.9) {
      uv.setXY(i, pos.getX(i), pos.getZ(i));
    } else {
      uv.setXY(i, uv.getX(i) * circ, pos.getY(i));
    }
  }
  if (origin === 'bottom') geo.translate(0, height / 2, 0);
  return geo;
}

/** Create a tube geometry along control points with arc-length UVs. */
export function tube(
  points: Array<THREE.Vector3 | [number, number, number]>,
  radius = 0.03,
  radialSegments = 8,
  closed = false,
  tension = 0,
): THREE.TubeGeometry {
  const vecs = points.map((p) => (p instanceof THREE.Vector3 ? p : new THREE.Vector3(p[0], p[1], p[2])));
  const curve = new THREE.CatmullRomCurve3(vecs, closed, 'catmullrom', tension);
  const len = curve.getLength();
  const tubularSegments = Math.max(2, Math.ceil(len / Math.max(0.08, radius * 3)));
  const geo = new THREE.TubeGeometry(curve, Math.min(tubularSegments, 400), radius, radialSegments, closed);
  const uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(i, uv.getX(i) * len, uv.getY(i) * Math.PI * 2 * radius);
  }
  return geo;
}

/** Apply position, euler rotation, and scale transform in-place to a BufferGeometry. */
export function transformGeometry<T extends THREE.BufferGeometry>(
  geo: T,
  { p = [0, 0, 0], r = [0, 0, 0], s = 1 }: GeometryTransform = {},
): T {
  _euler.set(r[0], r[1], r[2]);
  _quat.setFromEuler(_euler);
  _pos.set(p[0], p[1], p[2]);
  if (typeof s === 'number') _scale.set(s, s, s);
  else _scale.set(s[0], s[1], s[2]);
  _mat4.compose(_pos, _quat, _scale);
  geo.applyMatrix4(_mat4);
  return geo;
}

/** Bake a constant or position-dependent RGB vertex color attribute onto a BufferGeometry. */
export function paintVertexColors<T extends THREE.BufferGeometry>(
  geo: T,
  colorOrFn: [number, number, number] | ((x: number, y: number, z: number) => [number, number, number]),
): T {
  const pos = geo.attributes.position;
  const count = pos.count;
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const c = typeof colorOrFn === 'function' ? colorOrFn(pos.getX(i), pos.getY(i), pos.getZ(i)) : colorOrFn;
    colors[i * 3] = c[0];
    colors[i * 3 + 1] = c[1];
    colors[i * 3 + 2] = c[2];
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return geo;
}

/** Normalize attributes and merge multiple BufferGeometries into one. */
export function mergeGeometriesSafe(geos: Array<THREE.BufferGeometry | null | undefined>): THREE.BufferGeometry {
  const valid = geos.filter((g): g is THREE.BufferGeometry => Boolean(g)).map((g) => {
    if (!g.attributes.uv) {
      g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
    }
    if (!g.attributes.normal) g.computeVertexNormals();
    return g;
  });
  if (!valid.length) return new THREE.BufferGeometry();

  const hasColor = valid.some((g) => Boolean(g.attributes.color));
  const normalized = valid.map((g) => {
    if (hasColor && !g.attributes.color) {
      const white = new Float32Array(g.attributes.position.count * 3).fill(1);
      g.setAttribute('color', new THREE.BufferAttribute(white, 3));
    }
    for (const attr of Object.keys(g.attributes)) {
      if (!['position', 'normal', 'uv', 'color'].includes(attr)) {
        g.deleteAttribute(attr);
      }
    }
    return g;
  });

  const allIndexed = normalized.every((g) => Boolean(g.index));
  const noneIndexed = normalized.every((g) => !g.index);
  const ready = allIndexed || noneIndexed ? normalized : normalized.map((g) => (g.index ? g.toNonIndexed() : g));
  return mergeGeometries(ready, false) || new THREE.BufferGeometry();
}

/** Merge static meshes in a Group by material/shadow/layer while preserving `userData.noMerge` subtrees. */
export function mergeGroup(
  group: THREE.Object3D,
  { castShadow = true, receiveShadow = true }: { castShadow?: boolean; receiveShadow?: boolean } = {},
): THREE.Group {
  group.updateMatrixWorld(true);
  const buckets = new Map<
    string,
    { mat: THREE.Material; geos: THREE.BufferGeometry[]; cast: boolean; recv: boolean; layers: number }
  >();
  const kept: THREE.Object3D[] = [];

  group.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;
    let cur: THREE.Object3D | null = mesh;
    let skip = false;
    while (cur) {
      if (cur.userData && cur.userData.noMerge) {
        skip = true;
        break;
      }
      cur = cur.parent;
    }
    if (skip || (mesh as any).isSkinnedMesh || (mesh as any).isInstancedMesh || Array.isArray(mesh.material)) {
      kept.push(mesh);
      return;
    }
    const key =
      mesh.material.uuid +
      (mesh.castShadow ? 'c' : 'n') +
      (mesh.receiveShadow ? 'r' : 'n') +
      ':' +
      mesh.layers.mask;
    if (!buckets.has(key)) {
      buckets.set(key, {
        mat: mesh.material,
        geos: [],
        cast: mesh.castShadow,
        recv: mesh.receiveShadow,
        layers: mesh.layers.mask,
      });
    }
    const cloned = mesh.geometry.clone();
    cloned.applyMatrix4(mesh.matrixWorld);
    buckets.get(key)!.geos.push(cloned);
  });

  const out = new THREE.Group();
  for (const b of buckets.values()) {
    const merged = new THREE.Mesh(mergeGeometriesSafe(b.geos), b.mat);
    merged.castShadow = b.cast && castShadow;
    merged.receiveShadow = b.recv && receiveShadow;
    merged.layers.mask = b.layers;
    out.add(merged);
  }
  for (const obj of kept) {
    obj.updateMatrixWorld(true);
    const worldMat = obj.matrixWorld.clone();
    out.add(obj);
    obj.matrix.copy(worldMat);
    obj.matrix.decompose(obj.position, obj.quaternion, obj.scale);
  }
  return out;
}

/** Convenience wrapper to create a Mesh with shadow flags. */
export function makeMesh(
  geo: THREE.BufferGeometry,
  mat: THREE.Material | THREE.Material[],
  { cast = true, recv = true }: { cast?: boolean; recv?: boolean } = {},
): THREE.Mesh {
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = cast;
  mesh.receiveShadow = recv;
  return mesh;
}

