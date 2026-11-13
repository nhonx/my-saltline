import * as THREE from 'three';
import type { EventBus } from '../../engine/core/events';
import type { PhysicsWorld } from '../../engine/physics/world';

export interface CombatStats {
  shots: number;
  hits: number;
  kills: number;
  blasts?: number;
}

export interface CombatSystem {
  stats: CombatStats;
  reset(): void;
  playerShot(
    origin: THREE.Vector3,
    dir: THREE.Vector3,
    opts?: { damage?: number; range?: number; impulse?: number },
  ): any;
  enemyShot(
    origin: THREE.Vector3,
    dir: THREE.Vector3,
    opts?: { damage?: number; range?: number },
  ): boolean;
  explode(center: THREE.Vector3, radius?: number, damage?: number, source?: string): void;
}

const _tmpA = new THREE.Vector3();
const _tmpB = new THREE.Vector3();

/** Hitscan, projectile-raycast, and radial explosion damage resolution. */
export function createCombatSystem(ctx: {
  events: EventBus;
  physics: PhysicsWorld;
  enemies: { raycast: (o: THREE.Vector3, d: THREE.Vector3, max: number) => any; list: any[] };
  player: { pos: THREE.Vector3; alive: boolean; damage: (amt: number, from: THREE.Vector3 | null) => void };
}): CombatSystem {
  const stats: CombatStats = { shots: 0, hits: 0, kills: 0 };

  ctx.events.on('enemy:killed', () => {
    stats.kills++;
  });

  return {
    stats,
    reset() {
      stats.shots = stats.hits = stats.kills = 0;
    },
    playerShot(origin, dir, { damage = 28, range = 300 } = {}) {
      stats.shots++;
      const worldHit = ctx.physics.raycast(origin, dir, range);
      const enemyHit = ctx.enemies.raycast(origin, dir, worldHit ? worldHit.dist : range);

      if (enemyHit) {
        stats.hits++;
        const mult = enemyHit.part === 'weak' ? 2.2 : 1;
        const killed = enemyHit.enemy.damage(damage * mult, enemyHit.point, dir, enemyHit.part) === true;
        const payload = {
          point: enemyHit.point,
          normal: enemyHit.normal || dir.clone().negate(),
          dist: enemyHit.dist,
          surface: 'enemy',
          enemy: enemyHit.enemy,
          part: enemyHit.part,
          dir,
          from: 'player',
          killed,
        };
        ctx.events.emit('impact', payload);
        ctx.events.emit('player:hitEnemy', {
          enemy: enemyHit.enemy,
          part: enemyHit.part,
          killed,
          weak: enemyHit.part === 'weak',
        });
        return payload;
      }

      if (worldHit) {
        const payload = {
          point: worldHit.point,
          normal: worldHit.normal,
          dist: worldHit.dist,
          surface: worldHit.surface,
          enemy: null,
          dir,
          from: 'player',
          box: worldHit.box,
        };
        ctx.events.emit('impact', payload);
        return payload;
      }
      return null;
    },

    enemyShot(origin, dir, { damage = 6, range = 200 } = {}) {
      const worldHit = ctx.physics.raycast(origin, dir, range);
      const maxDist = worldHit ? worldHit.dist : range;
      const player = ctx.player;

      if (player && player.alive) {
        const toPlayer = _tmpA.copy(player.pos);
        toPlayer.y += 1;
        const proj = toPlayer.sub(origin).dot(dir);
        if (proj > 0 && proj < maxDist) {
          _tmpB.copy(origin).addScaledVector(dir, proj);
          const dy = Math.abs(_tmpB.y - (player.pos.y + 0.95));
          if (Math.hypot(_tmpB.x - player.pos.x, _tmpB.z - player.pos.z) < 0.38 && dy < 0.95) {
            player.damage(damage, origin);
            return true;
          }
        }
      }

      if (worldHit) {
        ctx.events.emit('impact', {
          point: worldHit.point,
          normal: worldHit.normal,
          dist: worldHit.dist,
          surface: worldHit.surface,
          enemy: null,
          dir,
          from: 'enemy',
          box: worldHit.box,
        });
      }
      return false;
    },

    explode(center, radius = 5, damage = 80, source = 'player') {
      for (const enemy of ctx.enemies.list) {
        if (!enemy.alive) continue;
        const dist = enemy.pos.distanceTo(center);
        if (dist < radius && ctx.physics.lineOfSight(center, _tmpA.copy(enemy.pos).setY(enemy.pos.y + 0.5))) {
          enemy.damage(damage * (1 - dist / radius), enemy.pos, _tmpB.copy(enemy.pos).sub(center).normalize(), 'body');
        }
      }
      const player = ctx.player;
      if (player && player.alive) {
        const dist = _tmpA.copy(player.pos).setY(player.pos.y + 1).distanceTo(center);
        if (dist < radius && ctx.physics.lineOfSight(center, _tmpA.copy(player.pos).setY(player.pos.y + 1))) {
          player.damage(damage * 0.5 * (1 - dist / radius), center);
        }
      }
      if (source === 'explosive') {
        stats.blasts = (stats.blasts || 0) + 1;
      }
    },
  };
}

