export {
  clamp as Hn,
  lerp as u0,
  saturate as Is,
  smoothstep as ou,
  damp as j0,
} from '../engine/core/math';
export { createRng as su } from '../engine/core/rng';
export { createEventBus as BM } from '../engine/core/events';
export { QUALITY_PRESETS as jr, detectQuality as UM } from '../engine/platform/quality';
export { STUBS as Sr } from '../engine/core/stubs';
export {
  WORLD_BOUNDS as Kn,
  SUN_CONFIG as Z0,
  SKY_COLORS as T0,
  PLAYER_DIMS as zi,
  LAYER_WORLD as Ia,
  LAYER_VIEWMODEL as Ro,
} from '../game/config/world';

export const ar = (n, e) => {
  for (const t in e) Object.defineProperty(n, t, { get: e[t], enumerable: true });
};
