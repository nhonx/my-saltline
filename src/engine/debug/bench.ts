import * as THREE from 'three';
import type { EngineContext } from '../core/context';
import { PLAYER_DIMS } from '../../game/config/world';

declare global {
  interface Window {
    __frames: number;
    __ready: boolean;
    __fatal: string | null;
    __errors: string[];
    __G: EngineContext;
    __stats: () => Record<string, unknown>;
    __setShot: (opts: { cam?: string; fov?: string | number; exposure?: string | number }) => void;
    __step?: number;
  }
}

export function installErrorHooks(): void {
  window.__frames = 0;
  window.__ready = false;
  window.__fatal = null;
  window.__errors = [];

  window.addEventListener('error', (ev) => {
    window.__errors.push(String(ev.message));
  });

  const origError = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    try {
      window.__errors.push(
        args
          .map((a) => ((a as Error)?.stack) || String(a))
          .join(' ')
          .slice(0, 400),
      );
    } catch {
      // ignore
    }
    origError(...args);
  };
}

export function reportFatal(err: unknown): void {
  window.__fatal = String(err);
  console.error('[fatal] ' + err);
  let el = document.getElementById('fatal');
  if (!el) {
    el = document.createElement('div');
    el.id = 'fatal';
    document.getElementById('app')?.appendChild(el);
  }
  el.textContent = 'Saltline could not start: ' + err;
}

export function attachBenchmark(ctx: EngineContext): void {
  const pre = document.createElement('pre');
  pre.id = 'bench';
  pre.style.cssText =
    'position:absolute;left:12px;top:12px;z-index:90;margin:0;padding:10px 12px;font:12px/1.45 "IBM Plex Mono",ui-monospace,monospace;color:#d8f0d0;background:rgba(0,0,0,.72);white-space:pre-wrap;max-width:min(560px,90vw);pointer-events:none';
  document.getElementById('app')?.appendChild(pre);

  let gpuName = 'unknown';
  try {
    const gl = ctx.renderer.getContext();
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    gpuName = String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
  } catch {
    // ignore
  }

  const path =
    ctx.level.cinematicPath && ctx.level.cinematicPath.length >= 2
      ? ctx.level.cinematicPath
      : [
          { pos: [-32, 1.7, 6], look: [0, 2, 5] },
          { pos: [10, 1.7, 6], look: [30, 6, 0] },
        ];

  const samples: number[] = [];
  let elapsed = 0;
  let lastPrint = 0;
  const period = 30;
  const p0 = new THREE.Vector3();
  const p1 = new THREE.Vector3();
  const l0 = new THREE.Vector3();
  const l1 = new THREE.Vector3();
  const bufSize = new THREE.Vector2();

  if (ctx.player) ctx.player.enabled = false;

  ctx.bench = {
    frame(rawDt: number) {
      elapsed += rawDt;
      const u = ((elapsed / period) % 1) * (path.length - 1);
      const idx = Math.min(path.length - 2, Math.floor(u));
      const t = u - idx;
      const s = t * t * (3 - 2 * t);

      p0.fromArray(path[idx].pos);
      p1.fromArray(path[idx + 1].pos);
      l0.fromArray(path[idx].look);
      l1.fromArray(path[idx + 1].look);
      ctx.camera.position.lerpVectors(p0, p1, s);
      ctx.camera.lookAt(l0.lerp(l1, s));

      if (elapsed > 2) samples.push(rawDt * 1000);
      if (samples.length > 3000) samples.shift();

      if (elapsed - lastPrint > 1 && samples.length > 10) {
        lastPrint = elapsed;
        const sorted = samples.slice().sort((a, b) => a - b);
        const avg = sorted.reduce((a, b) => a + b, 0) / sorted.length;
        const p99 = sorted[Math.floor(sorted.length * 0.99)];
        const med = sorted[sorted.length >> 1];
        const stats = ctx.render.stats ? ctx.render.stats() : {};
        ctx.renderer.getDrawingBufferSize(bufSize);
        pre.textContent = `SALTLINE BENCH  t=${elapsed.toFixed(0)}s
GPU: ${gpuName}
buffer ${bufSize.x}x${bufSize.y}  quality ${ctx.quality.name}  dpr ${window.devicePixelRatio}
frame ms avg ${avg.toFixed(1)}  median ${med.toFixed(1)}  p99 ${p99.toFixed(1)}  => ${(1000 / avg).toFixed(0)} fps
stats ${JSON.stringify(stats)}
errors ${window.__errors.length}${
          window.__errors.length ? '\n - ' + window.__errors.slice(0, 6).join('\n - ') : ''
        }`;
      }
    },
  };
}

export function createShowcaseInputStub() {
  const noop = () => {};
  return {
    move: { x: 0, y: 0 },
    look: { dx: 0, dy: 0 },
    fire: false,
    ads: false,
    sprint: false,
    crouch: false,
    locked: false,
    touch: false,
    sensitivity: 1,
    down: () => false,
    pressed: () => false,
    update: noop,
    endFrame: noop,
    requestLock: noop,
    exitLock: noop,
  };
}

export function createShowcasePlayerStub() {
  return {
    pos: new THREE.Vector3(0, 0, 4),
    vel: new THREE.Vector3(),
    yaw: 0,
    pitch: 0,
    health: 100,
    maxHealth: 100,
    alive: true,
    onGround: true,
    sprinting: false,
    crouching: false,
    ads: 0,
    speed: 0,
    eye: new THREE.Vector3(0, PLAYER_DIMS.eye, 4),
    forward: new THREE.Vector3(0, 0, -1),
    enabled: false,
    reset() {},
    damage() {},
    heal() {},
    addRecoil() {},
    addShake() {},
    update() {},
  };
}
