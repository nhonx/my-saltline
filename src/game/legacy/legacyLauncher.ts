import type { EngineContext } from '../../engine/core/context';

/** Whether the embedded legacy v8 build is available. */
export function hasLegacyBuild(): boolean {
  return true;
}

/** Tear down the current WebGL/Audio session and navigate to the legacy v8 build. */
export function launchLegacyBuild(ctx: EngineContext): boolean {
  ctx.dead = true;
  try {
    ctx.renderer.setAnimationLoop(null);
  } catch {
    // ignore
  }
  try {
    ctx.audio?.ctx?.close?.();
  } catch {
    // ignore
  }
  try {
    if (document.pointerLockElement) document.exitPointerLock();
  } catch {
    // ignore
  }
  try {
    ctx.renderer.forceContextLoss();
  } catch {
    // ignore
  }
  location.href = '/legacy/v8.html';
  return true;
}

