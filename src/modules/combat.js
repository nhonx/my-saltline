// @ts-nocheck
import * as THREE from 'three';

function ey(n) {
  let e = { shots: 0, hits: 0, kills: 0 };
  return (
    n.events.on('enemy:killed', () => {
      e.kills++;
    }),
    {
      stats: e,
      reset() {
        e.shots = e.hits = e.kills = 0;
      },
      playerShot(i, s, { damage: o = 28, range: r = 300, impulse: a = 1 } = {}) {
        e.shots++;
        let l = n.physics.raycast(i, s, r),
          c = n.enemies.raycast(i, s, l ? l.dist : r);
        if (c) {
          e.hits++;
          let u = c.part === 'weak' ? 2.2 : 1,
            f = c.enemy.damage(o * u, c.point, s, c.part) === !0,
            h = {
              point: c.point,
              normal: c.normal || s.clone().negate(),
              dist: c.dist,
              surface: 'enemy',
              enemy: c.enemy,
              part: c.part,
              dir: s,
              from: 'player',
              killed: f,
            };
          return (
            n.events.emit('impact', h),
            n.events.emit('player:hitEnemy', {
              enemy: c.enemy,
              part: c.part,
              killed: f,
              weak: c.part === 'weak',
            }),
            h
          );
        }
        if (l) {
          let u = {
            point: l.point,
            normal: l.normal,
            dist: l.dist,
            surface: l.surface,
            enemy: null,
            dir: s,
            from: 'player',
            box: l.box,
          };
          return (n.events.emit('impact', u), u);
        }
        return null;
      },
      enemyShot(i, s, { damage: o = 6, range: r = 200 } = {}) {
        let a = n.physics.raycast(i, s, r),
          l = a ? a.dist : r,
          c = n.player;
        if (c && c.alive) {
          let u = a5.copy(c.pos);
          u.y += 1;
          let f = u.sub(i).dot(s);
          if (f > 0 && f < l) {
            v1.copy(i).addScaledVector(s, f);
            let h = Math.abs(v1.y - (c.pos.y + 0.95));
            if (Math.hypot(v1.x - c.pos.x, v1.z - c.pos.z) < 0.38 && h < 0.95) return (c.damage(o, i), !0);
          }
        }
        return (
          a &&
            n.events.emit('impact', {
              point: a.point,
              normal: a.normal,
              dist: a.dist,
              surface: a.surface,
              enemy: null,
              dir: s,
              from: 'enemy',
              box: a.box,
            }),
          !1
        );
      },
      explode(i, s = 5, o = 80, r = 'player') {
        for (let l of n.enemies.list) {
          if (!l.alive) continue;
          let c = l.pos.distanceTo(i);
          c < s &&
            n.physics.lineOfSight(i, a5.copy(l.pos).setY(l.pos.y + 0.5)) &&
            l.damage(o * (1 - c / s), l.pos, v1.copy(l.pos).sub(i).normalize(), 'body');
        }
        let a = n.player;
        if (a && a.alive) {
          let l = a5
            .copy(a.pos)
            .setY(a.pos.y + 1)
            .distanceTo(i);
          l < s &&
            n.physics.lineOfSight(i, a5.copy(a.pos).setY(a.pos.y + 1)) &&
            a.damage(o * 0.5 * (1 - l / s), i);
        }
        r === 'explosive' && (e.blasts = (e.blasts || 0) + 1);
      },
    }
  );
}

var a5 = new THREE.Vector3(),
  v1 = new THREE.Vector3();

var vE = {
    barrel: { hp: 50, fuse: 1.6, size: 1.9, radius: 6.5, damage: 170, chain: 5.2 },
    gas_cylinders: { hp: 70, fuse: 1.1, size: 2.3, radius: 7.5, damage: 210, chain: 6 },
  },
  Dz = [
    [-12, 6.5],
    [-5, 1.5],
    [9, 7],
    [13, 13],
    [-14, 13],
    [1, 20],
    [11, 21],
    [-20, 19],
    [19, 9],
    [21, -6],
    [24, 11],
    [-21, -5],
    [0, -14.5],
    [-11, -21],
    [9, -24.5],
  ],
  xh = THREE.Vector3;

export { Dz, ey, vE, xh };
