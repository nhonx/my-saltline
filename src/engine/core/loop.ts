import * as THREE from 'three';
import type { EngineContext } from './context';

export interface ShotOverride {
  pos: THREE.Vector3;
  look: THREE.Vector3;
}

/** Run the phased WebGL animation loop with per-module error isolation and fixed-step support. */
export function startMainLoop(
  ctx: EngineContext,
  getShotOverride: () => ShotOverride | null,
): void {
  const params = ctx.params;
  let lastMs = performance.now();
  let avgDt = 0;
  let wetness = 1;
  let viewFill = 1.1;
  const tmpDir = new THREE.Vector3();

  if (params.step) window.__step = 3;

  const loggedErrors: Record<string, number> = {};
  const updateModule = (name: keyof EngineContext, dt: number) => {
    const mod = ctx[name] as { update?: (dt: number) => void } | undefined;
    if (!mod || !mod.update) return;
    try {
      mod.update(dt);
    } catch (err: any) {
      if (!loggedErrors[name as string]) {
        loggedErrors[name as string] = 1;
        console.error(`[loop] ${String(name)}.update threw: ${err?.stack || err}`);
      }
    }
  };

  ctx.renderer.setAnimationLoop(() => {
    if (params.step) {
      if (!(window.__step! > 0)) return;
      window.__step!--;
    }

    const nowMs = performance.now();
    const rawDt = (nowMs - lastMs) / 1000;
    lastMs = nowMs;
    avgDt = avgDt ? avgDt * 0.95 + rawDt * 0.05 : rawDt;

    let dt = Math.min(rawDt, 0.05);
    if (params.dt) dt = +params.dt;

    ctx.time.dt = dt;
    ctx.time.t += dt;
    ctx.time.real = nowMs / 1000;
    ctx.time.frame++;

    // Phase 1: Input
    updateModule('input', dt);

    // Phase 2: Game state machine
    let runGameplay = false;
    try {
      runGameplay = ctx.game.update(dt) !== false && ctx.game.state !== 'title' && ctx.game.state !== 'paused';
    } catch (err: any) {
      if (!loggedErrors.game) {
        loggedErrors.game = 1;
        console.error('[loop] game.update threw: ' + (err?.stack || err));
      }
    }

    // Phase 3: Gameplay actors (or showcase update)
    if (ctx.showcase) {
      if (ctx.showcaseInfo.update) {
        try {
          ctx.showcaseInfo.update(dt);
        } catch (err: any) {
          if (!loggedErrors.sc) {
            loggedErrors.sc = 1;
            console.error('[loop] showcase update threw: ' + (err?.stack || err));
          }
        }
      }
    } else if (runGameplay) {
      updateModule('player', dt);
      updateModule('weapon', dt);
      updateModule('enemies', dt);
      updateModule('explosives', dt);
    }

    // Interior wetness / viewmodel fill adjustment
    if (ctx.weapon && ctx.weapon.setWetness && ctx.level && ctx.level.interiorBoxes && ctx.level.interiorBoxes[0]) {
      const box = ctx.level.interiorBoxes[0];
      const p = ctx.camera.position;
      const inside =
        p.x > box.min.x && p.x < box.max.x && p.z > box.min.z && p.z < box.max.z && p.y < box.max.y;
      wetness += ((inside ? 0.3 : 1) - wetness) * Math.min(1, dt * (inside ? 0.25 : 0.6));
      try {
        ctx.weapon.setWetness(wetness);
      } catch {
        // ignore
      }
      if (!params.wfill && ctx.render.sunDir) {
        const dir = ctx.camera.getWorldDirection(tmpDir);
        const sunAlign = Math.max(0, dir.x * ctx.render.sunDir.x + dir.z * ctx.render.sunDir.z);
        viewFill += ((inside ? 1.1 : 1.1 + 0.6 * sunAlign * sunAlign) - viewFill) * Math.min(1, dt * 2.5);
        ctx.render.viewFill = viewFill;
      }
    }

    // Phase 4: World / FX / Audio / HUD
    if (ctx.game.state !== 'paused') {
      updateModule('fx', dt);
      updateModule('ground', dt);
      updateModule('level', dt);
      updateModule('backdrop', dt);
      updateModule('mats', dt);
    }
    updateModule('audio', dt);
    updateModule('hud', dt);

    const shot = getShotOverride();
    if (shot) {
      ctx.camera.position.copy(shot.pos);
      ctx.camera.lookAt(shot.look);
    }
    if (ctx.bench) ctx.bench.frame(rawDt);

    // Phase 5: Render
    try {
      ctx.render.frame(dt);
    } catch (err: any) {
      if (!loggedErrors.render) {
        loggedErrors.render = 1;
        console.error('[loop] render.frame threw: ' + (err?.stack || err));
      }
    }

    // Phase 6: End-of-frame input reset
    if (ctx.input.endFrame) ctx.input.endFrame();
    window.__frames++;
    if (window.__frames === 2) window.__ready = true;
  });

  // Expose stats helper referencing avgDt
  window.__stats = () => ({
    ...(ctx.render.stats ? ctx.render.stats() : {}),
    fps: avgDt ? +(1 / avgDt).toFixed(1) : 0,
    state: ctx.game && ctx.game.state,
  });
}

