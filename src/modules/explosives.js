// @ts-nocheck
import * as THREE from 'three';
import { EXPLOSIVE_SPAWNS, EXPLOSIVE_PRESETS, Vec3 } from './combat.js';
import { ig } from './geometry.js';

function createExplosives(ctx) {
  let root = new THREE.Group();
  ((root.name = 'explosives'), ctx.scene.add(root));
  let items = [],
    itemByBox = new Map(),
    random = ctx.rng && ctx.rng.fork ? ctx.rng.fork() : Math.random,
    worldBounds = new THREE.Box3(),
    colliderBounds = new THREE.Box3(),
    tmpVec = new Vec3(),
    blastPos = new Vec3(),
    upAxis = new Vec3(0, 1, 0);
  function spawnItem(def) {
    let obj = null;
    try {
      obj = ctx.props.build(def.name, { ...(def.opts || {}), ...(def.name === 'barrel' ? { color: 'red' } : {}) });
    } catch (err) {
      return (console.warn('[explosives] build failed: ' + err), null);
    }
    (obj.position.set(def.x, def.y || 0, def.z),
      (obj.rotation.y = def.yaw || 0),
      root.add(obj),
      obj.updateMatrixWorld(!0),
      worldBounds.makeEmpty());
    let colliders = obj.userData.colliders || [];
    for (let collider of colliders)
      (colliderBounds.min.fromArray(collider.min), colliderBounds.max.fromArray(collider.max), colliderBounds.applyMatrix4(obj.matrixWorld), worldBounds.union(colliderBounds));
    if (worldBounds.isEmpty()) {
      let size = obj.userData.size || [0.6, 0.9, 0.6];
      (worldBounds.min.set(def.x - size[0] / 2, def.y || 0, def.z - size[2] / 2),
        worldBounds.max.set(def.x + size[0] / 2, (def.y || 0) + size[1], def.z + size[2] / 2));
    }
    let spec = EXPLOSIVE_PRESETS[def.name] || EXPLOSIVE_PRESETS.barrel,
      item = {
        def: def,
        obj: obj,
        inst: null,
        kind: def.name,
        spec: spec,
        min: worldBounds.min.clone(),
        max: worldBounds.max.clone(),
        pos: worldBounds.getCenter(new Vec3()),
        hp: spec.hp,
        fuse: -1,
        alive: !0,
        box: null,
        leak: new Vec3(),
        leakDir: new Vec3(0, 1, 0),
        tick: 0,
      };
    return (items.push(item), registerCollider(item), item);
  }
  function registerCollider(item) {
    item.box ||
      ((item.box = ctx.physics.addBox(item.min, item.max, { surface: 'metal', tag: 'explosive' })), itemByBox.set(item.box, item));
  }
  for (let v of (ctx.level && ctx.level.explosives) || []) spawnItem(v);
  try {
    let nav = ctx.physics.nav,
      playerStartPos = ctx.level && ctx.level.playerStart && ctx.level.playerStart.pos,
      isOpenCell = (M, _) =>
        nav.isWalkable(M, _) &&
        nav.isWalkable(M + 0.3, _) &&
        nav.isWalkable(M - 0.3, _) &&
        nav.isWalkable(M, _ + 0.3) &&
        nav.isWalkable(M, _ - 0.3),
      isNearWall = (M, _) =>
        M < 28 &&
        M > -37 &&
        Math.abs(_) < 27 &&
        (!nav.isWalkable(M + 0.6, _) ||
          !nav.isWalkable(M - 0.6, _) ||
          !nav.isWalkable(M, _ + 0.6) ||
          !nav.isWalkable(M, _ - 0.6)),
      placed = 0;
    for (let [M, _] of EXPLOSIVE_SPAWNS) {
      let T = null,
        w = 1e9;
      for (let I = -3; I <= 3; I += 0.5)
        for (let L = -3; L <= 3; L += 0.5) {
          let U = M + L,
            k = _ + I,
            C = L * L + I * I;
          if (C >= w || !isOpenCell(U, k) || !isNearWall(U, k) || (playerStartPos && Math.hypot(U - playerStartPos.x, k - playerStartPos.z) < 7)) continue;
          let A = !1;
          for (let F of items)
            if (Math.hypot(F.pos.x - U, F.pos.z - k) < 1.1) {
              A = !0;
              break;
            }
          for (let F of (ctx.level && ctx.level.objectives) || [])
            F.pos && Math.hypot(F.pos.x - U, F.pos.z - k) < 2.2 && (A = !0);
          A || ((T = [U, k]), (w = C));
        }
      if (!T) continue;
      let [S, R] = T;
      nav.isWalkable(S + 0.6, R)
        ? nav.isWalkable(S - 0.6, R)
          ? nav.isWalkable(S, R + 0.6)
            ? (R -= 0.2)
            : (R += 0.2)
          : (S -= 0.2)
        : (S += 0.2);
      let z =
        ctx.level &&
        ctx.level.interiorBoxes &&
        ctx.level.interiorBoxes[0] &&
        S > ctx.level.interiorBoxes[0].min.x &&
        S < ctx.level.interiorBoxes[0].max.x &&
        R > ctx.level.interiorBoxes[0].min.z &&
        R < ctx.level.interiorBoxes[0].max.z
          ? 0.03
          : 0;
      (spawnItem({ name: 'barrel', x: S, y: z, z: R, yaw: random() * 6.28, opts: { seed: 100 + (placed % 2) } }), placed++);
    }
  } catch (err) {
    console.warn('[explosives] extra barrels skipped: ' + ((err && err.message) || err));
  }
  let hiddenMatrix = new THREE.Matrix4().makeScale(0, 0, 0);
  try {
    let instanceGroups = new Map();
    for (let item of items) {
      if ((item.obj.updateMatrixWorld(!0), item.kind !== 'barrel')) {
        let merged = ig(item.obj);
        (root.remove(item.obj), root.add(merged), (item.obj = merged));
        continue;
      }
      ((item.inst = []),
        item.obj.traverse((b) => {
          if (!b.isMesh || Array.isArray(b.material)) return;
          let g = b.geometry.uuid + '|' + b.material.uuid,
            E = instanceGroups.get(g);
          (E ||
            instanceGroups.set(
              g,
              (E = { geo: b.geometry, mat: b.material, cast: b.castShadow, recv: b.receiveShadow, list: [] }),
            ),
            E.list.push({ it: item, m: b.matrixWorld.clone() }));
        }),
        root.remove(item.obj));
    }
    for (let group of instanceGroups.values()) {
      let instancedMesh = new THREE.InstancedMesh(group.geo, group.mat, group.list.length);
      ((instancedMesh.castShadow = group.cast),
        (instancedMesh.receiveShadow = group.recv),
        (instancedMesh.frustumCulled = !1),
        group.list.forEach((g, E) => {
          (instancedMesh.setMatrixAt(E, g.m), g.it.inst.push({ im: instancedMesh, i: E, m: g.m }));
        }),
        (instancedMesh.instanceMatrix.needsUpdate = !0),
        root.add(instancedMesh));
    }
  } catch (err) {
    console.error('[explosives] instancing failed, barrels stay as plain meshes: ' + ((err && err.stack) || err));
    for (let y of items) y.inst && ((y.inst = null), y.obj.parent || root.add(y.obj));
  }
  function setItemVisible(item, visible) {
    if (!item.inst) {
      item.obj.visible = visible;
      return;
    }
    for (let instance of item.inst) (instance.im.setMatrixAt(instance.i, visible ? instance.m : hiddenMatrix), (instance.im.instanceMatrix.needsUpdate = !0));
  }
  function damageItem(item, damage, hitPoint, hitDir) {
    if (item.alive) {
      if (((item.hp -= damage), item.hp <= 0)) {
        item.fuse = item.fuse < 0 ? 0.06 : Math.min(item.fuse, 0.06);
        return;
      }
      item.fuse < 0 &&
        ((item.fuse = item.spec.fuse),
        hitPoint
          ? (item.leak.copy(hitPoint), item.leakDir.set(hitPoint.x - item.pos.x, 0.35, hitPoint.z - item.pos.z).normalize())
          : (item.leak.copy(item.pos), (item.leak.y = item.max.y), item.leakDir.copy(upAxis)),
        ctx.events.emit('explosive:lit', { pos: item.pos, kind: item.kind }));
    }
  }
  (ctx.events.on('impact', (v) => {
    let y = v && v.box && itemByBox.get(v.box);
    y && damageItem(y, v.from === 'player' ? (ctx.weapon && ctx.weapon.damage) || 26 : 9, v.point, v.dir);
  }),
    ctx.events.on('explosion', (v) => {
      if (!v || !v.pos) return;
      let y = 2.2 + (v.size || 1) * 1.6;
      for (let b of items) {
        if (!b.alive) continue;
        let g = b.pos.distanceTo(v.pos);
        if (g > y || g < 0.05) continue;
        let E = 0.14 + random() * 0.3 + g * 0.03;
        b.fuse = b.fuse < 0 ? E : Math.min(b.fuse, E);
      }
    }));
  function detonate(item) {
    ((item.alive = !1),
      (item.fuse = -1),
      setItemVisible(item, !1),
      item.box && (ctx.physics.removeBox(item.box), itemByBox.delete(item.box), (item.box = null)));
    let spec = item.spec;
    blastPos.copy(item.pos);
    try {
      ctx.fx.explosion(blastPos, spec.size);
    } catch (err) {
      console.error('[explosives] fx.explosion threw', err);
    }
    try {
      ctx.fx.debris(blastPos, {
        count: 14,
        color: item.kind === 'barrel' ? 3804938 : 3159098,
        size: 0.09,
        speed: 9,
        spread: 1.4,
      });
    } catch {}
    try {
      ctx.combat.explode(blastPos, spec.radius, spec.damage, 'explosive');
    } catch (err) {
      console.error('[explosives] combat.explode threw', err);
    }
    let player = ctx.player;
    if (player && player.addShake) {
      let shakeAmount = Math.max(0, 1 - player.pos.distanceTo(blastPos) / 28);
      shakeAmount > 0 && player.addShake(0.15 + 0.9 * shakeAmount * shakeAmount);
    }
    try {
      ctx.enemies.alert && ctx.enemies.alert(blastPos, 60);
    } catch {}
    ctx.events.emit('explosive:blast', { pos: blastPos, kind: item.kind });
  }
  return {
    items: items,
    root: root,
    count() {
      let alive = 0;
      for (let item of items) item.alive && alive++;
      return alive;
    },
    reset() {
      for (let item of items) ((item.alive = !0), (item.hp = item.spec.hp), (item.fuse = -1), setItemVisible(item, !0), registerCollider(item));
    },
    debugBlast(index = 0, detonateNow = !0) {
      let alive = items.filter((E) => E.alive),
        target = alive[index % Math.max(1, alive.length)];
      return (target && (detonateNow ? detonate(target) : damageItem(target, 1, null, null)), target ? target.pos.clone() : null);
    },
    update(dt) {
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (!(!item.alive || item.fuse < 0)) {
          if (((item.fuse -= dt), item.fuse <= 0)) {
            detonate(item);
            continue;
          }
          if (((item.tick -= dt), item.tick <= 0)) {
            item.tick = 0.07;
            try {
              (ctx.fx.sparks(item.leak, item.leakDir, 3),
                ctx.fx.smoke(item.leak, {
                  size: 0.3,
                  life: 0.9,
                  rise: 1.4,
                  count: 1,
                  color: 1381653,
                  vel: tmpVec.copy(item.leakDir).multiplyScalar(1.5),
                }),
                ctx.render && ctx.render.lightPool && ctx.render.lightPool.flash(item.leak, 16742944, 5, 4, 0.09));
            } catch {}
          }
        }
      }
    },
  };
}

var explosivesModule = {};

export { explosivesModule, createExplosives };
