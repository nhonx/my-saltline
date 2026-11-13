/** Clamp `x` to `[min, max]`. */
export const clamp = (x: number, min: number, max: number): number => Math.min(max, Math.max(min, x));

/** Linearly interpolate between `a` and `b` by `t`. */
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Clamp `x` to `[0, 1]`. */
export const saturate = (x: number): number => Math.min(1, Math.max(0, x));

/** Hermite smoothstep between `edge0` and `edge1`. */
export const smoothstep = (edge0: number, edge1: number, x: number): number => {
  const t = saturate((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

/** Frame-rate independent exponential damping toward `target`. */
export const damp = (current: number, target: number, lambda: number, dt: number): number =>
  target + (current - target) * Math.exp(-lambda * dt);

