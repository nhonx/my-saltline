import * as THREE from 'three';
import { WORLD_BOUNDS } from '../../game/config/world';

export type Vec3Like = THREE.Vector3 | [number, number, number];

export interface ColliderBox {
  min: THREE.Vector3;
  max: THREE.Vector3;
  surface: string;
  tag: string;
  noNav: boolean;
  bulletOnly: boolean;
  playerOnly: boolean;
}

export interface AddBoxOptions {
  surface?: string;
  tag?: string;
  noNav?: boolean;
  bulletOnly?: boolean;
  playerOnly?: boolean;
}

export interface RaycastHit {
  dist: number;
  point: THREE.Vector3;
  normal: THREE.Vector3;
  surface: string;
  box: ColliderBox | null;
}

export interface MoveCapsuleResult {
  onGround: boolean;
  hitWall: boolean;
  hitCeil: boolean;
  surface: string;
}

export interface NavGrid {
  readonly cell: number;
  isWalkable(x: number, z: number): boolean;
  findPath(from: THREE.Vector3, to: THREE.Vector3): THREE.Vector3[] | null;
  randomPoint(center: THREE.Vector3, radius: number): THREE.Vector3;
  clearLine(from: THREE.Vector3, to: THREE.Vector3): boolean;
  _grid(): { blocked: Uint8Array; w: number; h: number; minX: number; minZ: number; cell: number };
}

export interface PhysicsWorld {
  boxes: ColliderBox[];
  bounds: { min: THREE.Vector3; max: THREE.Vector3 };
  addBox(min: Vec3Like, max: Vec3Like, opts?: AddBoxOptions): ColliderBox;
  removeBox(box: ColliderBox): void;
  build(): void;
  raycast(origin: THREE.Vector3, dir: THREE.Vector3, maxDist?: number): RaycastHit | null;
  lineOfSight(a: THREE.Vector3, b: THREE.Vector3): boolean;
  groundHeight(x: number, z: number, maxY?: number): number;
  moveCapsule(
    pos: THREE.Vector3,
    vel: THREE.Vector3,
    dt: number,
    radius?: number,
    height?: number,
    stepUp?: boolean,
  ): MoveCapsuleResult;
  nav: NavGrid;
}

const STEP_HEIGHT = 0.42;
const NAV_CELL = 0.5;
const NAV_MIN_X = -40;
const NAV_MAX_X = 31;
const NAV_MIN_Z = -32;
const NAV_MAX_Z = 30;
const GRID_W = Math.round((NAV_MAX_X - NAV_MIN_X) / NAV_CELL);
const GRID_H = Math.round((NAV_MAX_Z - NAV_MIN_Z) / NAV_CELL);
const NAV_AGENT_PAD = 0.5;

function toVec3(v: Vec3Like): THREE.Vector3 {
  return (v as THREE.Vector3).isVector3
    ? (v as THREE.Vector3).clone()
    : new THREE.Vector3((v as [number, number, number])[0], (v as [number, number, number])[1], (v as [number, number, number])[2]);
}

/** Create an AABB physics + 2D A* navigation world. */
export function createPhysicsWorld(ctx: { level?: { groundSurfaceAt?: (x: number, z: number) => string } }): PhysicsWorld {
  const boxes: ColliderBox[] = [];
  let navDirty = true;
  let blocked = new Uint8Array(GRID_W * GRID_H);
  const tmpLos = new THREE.Vector3();

  // A* scratch buffers
  const gScore = new Float32Array(GRID_W * GRID_H);
  const parent = new Int32Array(GRID_W * GRID_H);
  const seenStamp = new Uint32Array(GRID_W * GRID_H);
  const closedStamp = new Uint32Array(GRID_W * GRID_H);
  let stamp = 0;
  const heapNodes: number[] = [];
  const heapF: number[] = [];

  function ensureNav() {
    if (navDirty) buildNav();
  }

  function buildNav() {
    blocked = new Uint8Array(GRID_W * GRID_H);
    navDirty = false;
    for (const b of boxes) {
      if (b.noNav || b.bulletOnly || b.max.y < STEP_HEIGHT + 0.05 || b.min.y > 1.5) continue;
      const x0 = Math.max(0, Math.floor((b.min.x - NAV_AGENT_PAD - NAV_MIN_X) / NAV_CELL));
      const x1 = Math.min(GRID_W - 1, Math.floor((b.max.x + NAV_AGENT_PAD - NAV_MIN_X) / NAV_CELL));
      const z0 = Math.max(0, Math.floor((b.min.z - NAV_AGENT_PAD - NAV_MIN_Z) / NAV_CELL));
      const z1 = Math.min(GRID_H - 1, Math.floor((b.max.z + NAV_AGENT_PAD - NAV_MIN_Z) / NAV_CELL));
      for (let gz = z0; gz <= z1; gz++) {
        for (let gx = x0; gx <= x1; gx++) {
          blocked[gz * GRID_W + gx] = 1;
        }
      }
    }
    for (let gz = 0; gz < GRID_H; gz++) {
      for (let gx = 0; gx < GRID_W; gx++) {
        if (
          NAV_MIN_X + (gx + 0.5) * NAV_CELL > WORLD_BOUNDS.quayX - NAV_AGENT_PAD ||
          gx === 0 ||
          gz === 0 ||
          gx === GRID_W - 1 ||
          gz === GRID_H - 1
        ) {
          blocked[gz * GRID_W + gx] = 1;
        }
      }
    }
  }

  function worldToCell(x: number, z: number): number {
    const gx = Math.floor((x - NAV_MIN_X) / NAV_CELL);
    const gz = Math.floor((z - NAV_MIN_Z) / NAV_CELL);
    return gx < 0 || gz < 0 || gx >= GRID_W || gz >= GRID_H ? -1 : gz * GRID_W + gx;
  }

  function cellToWorld(idx: number): THREE.Vector3 {
    return new THREE.Vector3(
      NAV_MIN_X + ((idx % GRID_W) + 0.5) * NAV_CELL,
      0,
      NAV_MIN_Z + (Math.floor(idx / GRID_W) + 0.5) * NAV_CELL,
    );
  }

  function nearestWalkableCell(x: number, z: number): number {
    const gx = Math.max(0, Math.min(GRID_W - 1, Math.floor((x - NAV_MIN_X) / NAV_CELL)));
    const gz = Math.max(0, Math.min(GRID_H - 1, Math.floor((z - NAV_MIN_Z) / NAV_CELL)));
    if (!blocked[gz * GRID_W + gx]) return gz * GRID_W + gx;

    for (let r = 1; r <= 12; r++) {
      let best = -1;
      let bestDistSq = 1e9;
      for (let dz = -r; dz <= r; dz++) {
        for (let dx = -r; dx <= r; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dz)) !== r) continue;
          const nx = gx + dx;
          const nz = gz + dz;
          if (nx < 0 || nz < 0 || nx >= GRID_W || nz >= GRID_H) continue;
          const idx = nz * GRID_W + nx;
          if (!blocked[idx]) {
            const d2 = dx * dx + dz * dz;
            if (d2 < bestDistSq) {
              bestDistSq = d2;
              best = idx;
            }
          }
        }
      }
      if (best >= 0) return best;
    }
    return -1;
  }

  function bresenhamClear(a: number, b: number): boolean {
    let x0 = a % GRID_W;
    let z0 = Math.floor(a / GRID_W);
    const x1 = b % GRID_W;
    const z1 = Math.floor(b / GRID_W);
    const dx = Math.abs(x1 - x0);
    const dz = Math.abs(z1 - z0);
    const sx = x0 < x1 ? 1 : -1;
    const sz = z0 < z1 ? 1 : -1;
    let err = dx - dz;
    for (let step = 0; step < 600; step++) {
      if (blocked[z0 * GRID_W + x0]) return false;
      if (x0 === x1 && z0 === z1) return true;
      const e2 = 2 * err;
      if (e2 > -dz && e2 < dx) {
        if (blocked[z0 * GRID_W + x0 + sx] || blocked[(z0 + sz) * GRID_W + x0]) return false;
        err += dx - dz;
        x0 += sx;
        z0 += sz;
      } else if (e2 > -dz) {
        err -= dz;
        x0 += sx;
      } else {
        err += dx;
        z0 += sz;
      }
    }
    return false;
  }

  function heapPush(node: number, f: number) {
    let idx = heapNodes.length;
    heapNodes.push(node);
    heapF.push(f);
    while (idx > 0) {
      const p = (idx - 1) >> 1;
      if (heapF[p] <= f) break;
      heapNodes[idx] = heapNodes[p];
      heapF[idx] = heapF[p];
      idx = p;
    }
    heapNodes[idx] = node;
    heapF[idx] = f;
  }

  function heapPop(): number {
    const top = heapNodes[0];
    const lastNode = heapNodes.pop()!;
    const lastF = heapF.pop()!;
    const len = heapNodes.length;
    if (len) {
      let idx = 0;
      for (;;) {
        let child = 2 * idx + 1;
        if (child >= len) break;
        if (child + 1 < len && heapF[child + 1] < heapF[child]) child++;
        if (heapF[child] >= lastF) break;
        heapNodes[idx] = heapNodes[child];
        heapF[idx] = heapF[child];
        idx = child;
      }
      heapNodes[idx] = lastNode;
      heapF[idx] = lastF;
    }
    return top;
  }

  function astar(start: number, goal: number): number[] | null {
    stamp++;
    heapNodes.length = 0;
    heapF.length = 0;
    const gxGoal = goal % GRID_W;
    const gzGoal = Math.floor(goal / GRID_W);
    const heuristic = (idx: number) => {
      const dx = Math.abs((idx % GRID_W) - gxGoal);
      const dz = Math.abs(Math.floor(idx / GRID_W) - gzGoal);
      return dx + dz + (1.4142 - 2) * Math.min(dx, dz);
    };

    gScore[start] = 0;
    seenStamp[start] = stamp;
    parent[start] = -1;
    heapPush(start, heuristic(start));

    let expanded = 0;
    while (heapNodes.length) {
      const cur = heapPop();
      if (cur === goal) break;
      if (closedStamp[cur] === stamp) continue;
      closedStamp[cur] = stamp;
      if (++expanded > 9000) return null;

      const cx = cur % GRID_W;
      const cz = Math.floor(cur / GRID_W);
      for (let dz = -1; dz <= 1; dz++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dz) continue;
          const nx = cx + dx;
          const nz = cz + dz;
          if (nx < 0 || nz < 0 || nx >= GRID_W || nz >= GRID_H) continue;
          const next = nz * GRID_W + nx;
          if (blocked[next] || closedStamp[next] === stamp) continue;
          if (dx && dz && (blocked[cz * GRID_W + nx] || blocked[nz * GRID_W + cx])) continue;

          const tentative = gScore[cur] + (dx && dz ? 1.4142 : 1);
          if (seenStamp[next] !== stamp || tentative < gScore[next]) {
            gScore[next] = tentative;
            seenStamp[next] = stamp;
            parent[next] = cur;
            heapPush(next, tentative + heuristic(next));
          }
        }
      }
    }

    if (seenStamp[goal] !== stamp) return null;
    const path: number[] = [];
    for (let cur = goal; cur !== -1; cur = parent[cur]) path.push(cur);
    path.reverse();
    return path;
  }

  const world: PhysicsWorld = {
    boxes,
    bounds: { min: WORLD_BOUNDS.min.clone(), max: WORLD_BOUNDS.max.clone() },

    addBox(minVec, maxVec, opts = {}) {
      const a = toVec3(minVec);
      const b = toVec3(maxVec);
      const box: ColliderBox = {
        min: new THREE.Vector3(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z)),
        max: new THREE.Vector3(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z)),
        surface: opts.surface || 'concrete',
        tag: opts.tag || '',
        noNav: !!opts.noNav,
        bulletOnly: !!opts.bulletOnly,
        playerOnly: !!opts.playerOnly,
      };
      boxes.push(box);
      navDirty = true;
      return box;
    },

    removeBox(box) {
      const idx = boxes.indexOf(box);
      if (idx >= 0) {
        boxes.splice(idx, 1);
        navDirty = true;
      }
    },

    build() {
      buildNav();
    },

    raycast(origin, dir, maxDist = 500) {
      let bestT = maxDist;
      let hitBox: ColliderBox | null = null;
      let hitAxis = -1;
      let hitSign = 0;
      let planeHit = 0; // 1 = ground, 2 = sea

      const ox = origin.x;
      const oy = origin.y;
      const oz = origin.z;
      const dx = dir.x;
      const dy = dir.y;
      const dz = dir.z;

      if (dy < -1e-6) {
        const tGround = (WORLD_BOUNDS.groundY - oy) / dy;
        if (tGround > 0 && tGround < bestT) {
          if (ox + dx * tGround <= WORLD_BOUNDS.quayX) {
            bestT = tGround;
            planeHit = 1;
          } else {
            const tSea = (WORLD_BOUNDS.seaY - oy) / dy;
            if (tSea > 0 && tSea < bestT) {
              bestT = tSea;
              planeHit = 2;
            }
          }
        }
      }

      const invX = dx === 0 ? Infinity : 1 / dx;
      const invY = dy === 0 ? Infinity : 1 / dy;
      const invZ = dz === 0 ? Infinity : 1 / dz;

      for (let i = 0; i < boxes.length; i++) {
        const b = boxes[i];
        if (b.playerOnly) continue;

        let tMin = 0;
        let tMax = bestT;
        let axis = -1;
        let sign = 0;

        if (dx !== 0) {
          let t1 = (b.min.x - ox) * invX;
          let t2 = (b.max.x - ox) * invX;
          let s = -1;
          if (t1 > t2) {
            [t1, t2] = [t2, t1];
            s = 1;
          }
          if (t1 > tMin) {
            tMin = t1;
            axis = 0;
            sign = s;
          }
          if (t2 < tMax) tMax = t2;
          if (tMin > tMax) continue;
        } else if (ox < b.min.x || ox > b.max.x) continue;

        if (dy !== 0) {
          let t1 = (b.min.y - oy) * invY;
          let t2 = (b.max.y - oy) * invY;
          let s = -1;
          if (t1 > t2) {
            [t1, t2] = [t2, t1];
            s = 1;
          }
          if (t1 > tMin) {
            tMin = t1;
            axis = 1;
            sign = s;
          }
          if (t2 < tMax) tMax = t2;
          if (tMin > tMax) continue;
        } else if (oy < b.min.y || oy > b.max.y) continue;

        if (dz !== 0) {
          let t1 = (b.min.z - oz) * invZ;
          let t2 = (b.max.z - oz) * invZ;
          let s = -1;
          if (t1 > t2) {
            [t1, t2] = [t2, t1];
            s = 1;
          }
          if (t1 > tMin) {
            tMin = t1;
            axis = 2;
            sign = s;
          }
          if (t2 < tMax) tMax = t2;
          if (tMin > tMax) continue;
        } else if (oz < b.min.z || oz > b.max.z) continue;

        if (axis >= 0) {
          bestT = tMin;
          hitBox = b;
          hitAxis = axis;
          hitSign = sign;
          planeHit = 0;
        }
      }

      if (!hitBox && !planeHit) return null;
      const point = new THREE.Vector3(ox + dx * bestT, oy + dy * bestT, oz + dz * bestT);
      if (planeHit) {
        return {
          dist: bestT,
          point,
          normal: new THREE.Vector3(0, 1, 0),
          surface:
            planeHit === 2
              ? 'water'
              : ctx.level && ctx.level.groundSurfaceAt
                ? ctx.level.groundSurfaceAt(point.x, point.z)
                : 'concrete',
          box: null,
        };
      }
      const normal = new THREE.Vector3();
      normal.setComponent(hitAxis, hitSign);
      return { dist: bestT, point, normal, surface: hitBox!.surface, box: hitBox };
    },

    lineOfSight(a, b) {
      tmpLos.subVectors(b, a);
      const len = tmpLos.length();
      if (len < 1e-4) return true;
      tmpLos.multiplyScalar(1 / len);
      return !world.raycast(a, tmpLos, len - 0.05);
    },

    groundHeight(x, z, maxY = 50) {
      let y = x <= WORLD_BOUNDS.quayX ? WORLD_BOUNDS.groundY : WORLD_BOUNDS.seaY;
      for (let i = 0; i < boxes.length; i++) {
        const b = boxes[i];
        if (b.bulletOnly) continue;
        if (x >= b.min.x && x <= b.max.x && z >= b.min.z && z <= b.max.z && b.max.y <= maxY && b.max.y > y) {
          y = b.max.y;
        }
      }
      return y;
    },

    moveCapsule(pos, vel, dt, radius = 0.32, height = 1.8, stepUp = true) {
      const res: MoveCapsuleResult = { onGround: false, hitWall: false, hitCeil: false, surface: 'concrete' };
      const moveX = vel.x * dt;
      const moveZ = vel.z * dt;
      const substeps = Math.max(1, Math.ceil(Math.hypot(moveX, moveZ) / (radius * 0.6)));
      const startY = pos.y;

      for (let s = 0; s < substeps; s++) {
        pos.x += moveX / substeps;
        pos.z += moveZ / substeps;
        for (let iter = 0; iter < 3; iter++) {
          let pushed = false;
          for (let i = 0; i < boxes.length; i++) {
            const b = boxes[i];
            if (b.bulletOnly || b.max.y <= pos.y + (stepUp ? STEP_HEIGHT : 0.08) || b.min.y >= pos.y + height) {
              continue;
            }
            const cx = Math.max(b.min.x, Math.min(b.max.x, pos.x));
            const cz = Math.max(b.min.z, Math.min(b.max.z, pos.z));
            let dx = pos.x - cx;
            let dz = pos.z - cz;
            const d2 = dx * dx + dz * dz;
            if (d2 >= radius * radius) continue;

            if (d2 > 1e-10) {
              const d = Math.sqrt(d2);
              const pen = radius - d;
              dx /= d;
              dz /= d;
              pos.x += dx * pen;
              pos.z += dz * pen;
              const vn = vel.x * dx + vel.z * dz;
              if (vn < 0) {
                vel.x -= dx * vn;
                vel.z -= dz * vn;
              }
            } else {
              const dMinX = pos.x - b.min.x;
              const dMaxX = b.max.x - pos.x;
              const dMinZ = pos.z - b.min.z;
              const dMaxZ = b.max.z - pos.z;
              const m = Math.min(dMinX, dMaxX, dMinZ, dMaxZ);
              if (m === dMinX) {
                pos.x = b.min.x - radius;
                if (vel.x > 0) vel.x = 0;
              } else if (m === dMaxX) {
                pos.x = b.max.x + radius;
                if (vel.x < 0) vel.x = 0;
              } else if (m === dMinZ) {
                pos.z = b.min.z - radius;
                if (vel.z > 0) vel.z = 0;
              } else {
                pos.z = b.max.z + radius;
                if (vel.z < 0) vel.z = 0;
              }
            }
            pushed = true;
            res.hitWall = true;
          }
          if (!pushed) break;
        }
      }

      const nextY = pos.y + vel.y * dt;
      const footR = radius * 0.7;
      let floorY = pos.x <= WORLD_BOUNDS.quayX + footR ? WORLD_BOUNDS.groundY : -50;
      let floorSurf: string | null = null;
      let ceilY = Infinity;
      const stepCeil = startY + (stepUp ? STEP_HEIGHT : 0.08) + 1e-4;

      for (let i = 0; i < boxes.length; i++) {
        const b = boxes[i];
        if (b.bulletOnly) continue;
        if (
          pos.x + footR < b.min.x ||
          pos.x - footR > b.max.x ||
          pos.z + footR < b.min.z ||
          pos.z - footR > b.max.z
        ) {
          continue;
        }
        if (b.max.y <= stepCeil && b.max.y > floorY) {
          floorY = b.max.y;
          floorSurf = b.surface;
        }
        if (b.min.y >= startY + height - 0.05 && b.min.y < ceilY) {
          ceilY = b.min.y;
        }
      }

      if (vel.y > 0 && nextY + height > ceilY) {
        pos.y = ceilY - height;
        vel.y = 0;
        res.hitCeil = true;
      } else if (nextY <= floorY) {
        pos.y = floorY;
        if (vel.y < 0) vel.y = 0;
        res.onGround = true;
      } else if (stepUp && vel.y <= 0 && nextY - floorY < STEP_HEIGHT) {
        pos.y = floorY;
        vel.y = 0;
        res.onGround = true;
      } else {
        pos.y = nextY;
      }

      if (res.onGround) {
        res.surface =
          floorSurf ||
          (ctx.level && ctx.level.groundSurfaceAt ? ctx.level.groundSurfaceAt(pos.x, pos.z) : 'concrete');
      }
      return res;
    },

    nav: {
      cell: NAV_CELL,
      isWalkable(x, z) {
        ensureNav();
        const idx = worldToCell(x, z);
        return idx >= 0 && !blocked[idx];
      },
      findPath(from, to) {
        ensureNav();
        const start = nearestWalkableCell(from.x, from.z);
        const goal = nearestWalkableCell(to.x, to.z);
        if (start < 0 || goal < 0) return null;
        if (start === goal) return [new THREE.Vector3(to.x, 0, to.z)];
        const cells = astar(start, goal);
        if (!cells) return null;
        const out: THREE.Vector3[] = [];
        let i = 0;
        while (i < cells.length - 1) {
          let next = i + 1;
          for (let j = cells.length - 1; j > i + 1; j--) {
            if (bresenhamClear(cells[i], cells[j])) {
              next = j;
              break;
            }
          }
          out.push(cellToWorld(cells[next]));
          i = next;
        }
        if (worldToCell(to.x, to.z) === goal && out.length) {
          out[out.length - 1].set(to.x, 0, to.z);
        }
        return out;
      },
      randomPoint(center, radius) {
        ensureNav();
        for (let attempt = 0; attempt < 24; attempt++) {
          const ang = Math.random() * 6.2832;
          const r = Math.sqrt(Math.random()) * radius;
          const x = center.x + Math.cos(ang) * r;
          const z = center.z + Math.sin(ang) * r;
          const idx = worldToCell(x, z);
          if (idx >= 0 && !blocked[idx]) return new THREE.Vector3(x, 0, z);
        }
        const fallback = nearestWalkableCell(center.x, center.z);
        return fallback >= 0 ? cellToWorld(fallback) : new THREE.Vector3(center.x, 0, center.z);
      },
      clearLine(from, to) {
        ensureNav();
        const a = worldToCell(from.x, from.z);
        const b = worldToCell(to.x, to.z);
        return a >= 0 && b >= 0 && bresenhamClear(a, b);
      },
      _grid: () => (ensureNav(), { blocked, w: GRID_W, h: GRID_H, minX: NAV_MIN_X, minZ: NAV_MIN_Z, cell: NAV_CELL }),
    },
  };

  return world;
}

