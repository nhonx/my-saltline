import * as THREE from 'three';
import { createEventBus, type EventBus } from './events';
import { createRng, type Rng } from './rng';
import { detectQuality, type QualityPreset } from '../platform/quality';

export interface EngineTime {
  t: number;
  dt: number;
  frame: number;
  real: number;
}

/** Shared runtime context passed to all engine and game modules. */
export interface EngineContext {
  THREE: typeof THREE;
  params: Record<string, string>;
  events: EventBus;
  rng: Rng;
  time: EngineTime;
  quality: QualityPreset;
  showcase: string | null;
  showcaseInfo: { cam?: number[]; target?: number[]; update?: (dt: number) => void };
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  viewCamera: THREE.PerspectiveCamera;
  render: any;
  mats: any;
  physics: any;
  props: any;
  input: any;
  level: any;
  backdrop: any;
  ground: any;
  fx: any;
  audio: any;
  player: any;
  combat: any;
  explosives: any;
  weapon: any;
  enemies: any;
  hud: any;
  game: any;
  bench?: { frame: (rawDt: number) => void };
  dead?: boolean;
}

export function createEngineContext(params: Record<string, string>): EngineContext {
  const seed = +(params.seed || 4207);
  return {
    THREE,
    params,
    events: createEventBus(),
    rng: createRng(seed),
    time: { t: 0, dt: 0, frame: 0, real: 0 },
    quality: detectQuality(params.q || (params.shot ? 'test' : '')),
    showcase: null,
    showcaseInfo: {},
  } as EngineContext;
}

