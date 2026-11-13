import * as THREE from 'three';

export const NOOP = (): void => {};

/** Fallback stub implementations for optional or failed engine/game modules. */
export const STUBS = {
  ground: () => ({ stub: true, update: NOOP, wetnessAt: () => 0.5, isPuddle: () => false }),
  backdrop: () => ({ stub: true, update: NOOP }),
  fx: () => ({
    stub: true,
    update: NOOP,
    muzzleFlash: NOOP,
    tracer: NOOP,
    impact: NOOP,
    sparks: NOOP,
    smoke: NOOP,
    explosion: NOOP,
    debris: NOOP,
    shell: NOOP,
    decal: NOOP,
    dust: NOOP,
    clear: NOOP,
    splash: NOOP,
    addEmitter: () => ({ stop: NOOP, setPos: NOOP }),
  }),
  audio: () => {
    const loopHandle = { setPos: NOOP, setGain: NOOP, setPitch: NOOP, stop: NOOP };
    return {
      stub: true,
      update: NOOP,
      resume: NOOP,
      play: NOOP,
      loop: () => loopHandle,
      setIntensity: NOOP,
      setInterior: NOOP,
      setVolume: NOOP,
      setPaused: NOOP,
    };
  },
  weapon: () => ({
    stub: true,
    update: NOOP,
    reset: NOOP,
    setVisible: NOOP,
    ammo: 30,
    magSize: 30,
    reserve: 120,
    state: 'idle',
    name: 'KR-7',
    ads: 0,
    spread: 0.01,
  }),
  enemies: () => ({
    stub: true,
    list: [] as any[],
    update: NOOP,
    spawn: () => null,
    raycast: () => null,
    aliveCount: () => 0,
    clear: NOOP,
    alert: NOOP,
  }),
  hud: () => ({ stub: true, update: NOOP, show: NOOP, setObjective: NOOP, message: NOOP, hitmarker: NOOP }),
  mats: () => {
    const cache = new Map<string, THREE.MeshStandardMaterial>();
    return {
      stub: true,
      get: (name: string) => {
        if (!cache.has(name)) {
          cache.set(name, new THREE.MeshStandardMaterial({ color: 0x777777, roughness: 0.7 }));
        }
        return cache.get(name)!;
      },
      emissive: (color = 0xffffff, intensity = 4) =>
        new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity) }),
      names: [] as string[],
      decal: () => ({ material: new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }), aspect: 1 }),
      label: () => ({ material: new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }), aspect: 4 }),
      uniforms: { wet: { value: 1 } },
      update: NOOP,
    };
  },
};

