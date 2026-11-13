export interface Rng {
  (): number;
  range(min: number, max: number): number;
  int(min: number, max: number): number;
  pick<T>(arr: readonly T[]): T;
  sign(): -1 | 1;
  fork(label?: string): Rng;
}

/** Deterministic Mulberry32-style PRNG with helper methods and child forks. */
export function createRng(seed = 1337): Rng {
  let state = seed >>> 0;
  const next = (() => {
    state |= 0;
    state = (state + 1831565813) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }) as Rng;

  next.range = (min: number, max: number) => min + (max - min) * next();
  next.int = (min: number, max: number) => Math.floor(min + (max - min + 1) * next());
  next.pick = <T>(arr: readonly T[]): T => arr[Math.floor(next() * arr.length)];
  next.sign = () => (next() < 0.5 ? -1 : 1);
  next.fork = () => createRng(Math.floor(next() * 4294967296));
  return next;
}

