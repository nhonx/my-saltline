import './styles/ui.css';
import * as THREE from 'three';
import { createEngineContext } from './engine/core/context';
import { STUBS } from './engine/core/stubs';
import { createPhysicsWorld } from './engine/physics/world';
import { createInput } from './engine/input/input';
import { makeMesh } from './engine/geometry/primitives';
import { startMainLoop, type ShotOverride } from './engine/core/loop';
import {
  attachBenchmark,
  createShowcaseInputStub,
  createShowcasePlayerStub,
  installErrorHooks,
  reportFatal,
} from './engine/debug/bench';
import { createCombatSystem } from './game/systems/combat';
import { createPlayer } from './game/actors/player';
import { initWeaponSelect } from './game/ui/weaponSelect';

// Legacy recovered modules (incrementally migrating to src/engine & src/game)
import { cv, lv } from './modules/mats.js';
import { Av, fv, hv } from './modules/props.js';
import { Pg, zv } from './modules/level.js';
import { Iv, Lv } from './modules/backdrop.js';
import { Wv, f1 } from './modules/fx.js';
import { explosivesModule, createExplosives } from './modules/explosives.js';
import { zy } from './modules/hands.js';
import { W5, ib } from './modules/enemies.js';
import { ov, rv } from './modules/render.js';
import { Vg } from './modules/ground.js';
import { cE } from './modules/audio.js';
import { I5 } from './modules/weapon.js';
import { sT } from './modules/hud.js';
import { pT } from './modules/game.js';

const SHOWCASE_MODULES: Record<string, any> = {
  mats: cv,
  level: Av,
  backdrop: zv,
  ground: Lv,
  fx: Wv,
  weapon: explosivesModule,
  hands: zy,
  enemies: ib,
  props: hv,
  render: rv,
};

installErrorHooks();

const bootRoot = document.getElementById('boot');
const bootMsg = document.getElementById('boot-msg');
const bootFill = document.getElementById('boot-fill');
const yieldFrame = () => new Promise<void>((r) => setTimeout(r, 0));

async function setBootProgress(label: string, progress: number) {
  if (bootMsg) bootMsg.textContent = label;
  if (bootFill) bootFill.style.width = Math.round(progress * 100) + '%';
  await yieldFrame();
}

async function boot() {
  const params = Object.fromEntries(new URLSearchParams(location.search));
  const isBench = !!params.bench || location.hash === '#bench';
  if (isBench) {
    params.noaudio = '1';
    params.autostart = '1';
  }

  const ctx = createEngineContext(params);
  window.__G = ctx;

  const showcaseName = params.show && SHOWCASE_MODULES[params.show] ? params.show : null;
  ctx.showcase = showcaseName;

  let shotOverride: ShotOverride | null = null;
  const setShot = (opts: { cam?: string; fov?: string | number; exposure?: string | number }) => {
    if (opts.cam) {
      const c = String(opts.cam).split(',').map(Number);
      shotOverride = {
        pos: new THREE.Vector3(c[0], c[1], c[2]),
        look: new THREE.Vector3(c[3] ?? 0, c[4] ?? 1, c[5] ?? 0),
      };
    }
    if (opts.cam === '') shotOverride = null;
    if (opts.fov) {
      ctx.camera.fov = +opts.fov;
      ctx.camera.updateProjectionMatrix();
    }
    if (opts.exposure) ctx.render.exposure = +opts.exposure;
  };
  window.__setShot = setShot;

  async function initModule<K extends keyof typeof ctx>(
    key: K,
    factory: () => Promise<any> | any,
    required = false,
  ) {
    const t0 = performance.now();
    try {
      (ctx as any)[key] = await factory();
    } catch (err: any) {
      console.error(`[boot] module "${String(key)}" failed: ${err?.stack || err}`);
      const stubFactory = (STUBS as Record<string, () => any>)[key as string];
      if (required || !stubFactory) throw err;
      (ctx as any)[key] = stubFactory();
    }
    const ms = performance.now() - t0;
    if (ms > 150) console.log(`[boot] ${String(key)} ${ms.toFixed(0)}ms`);
  }

  await setBootProgress('Waking the renderer', 0.04);
  await initModule('render', () => ov(ctx), true);
  ctx.renderer = ctx.render.renderer;
  ctx.scene = ctx.render.scene;
  ctx.camera = ctx.render.camera;
  ctx.viewCamera = ctx.render.viewCamera;

  await setBootProgress('Mixing paint, rust and rain', 0.12);
  await initModule('mats', () => lv(ctx));
  ctx.physics = createPhysicsWorld(ctx);
  ctx.props = fv(ctx);
  ctx.input = showcaseName ? createShowcaseInputStub() : createInput(ctx);

  if (showcaseName) {
    const floor = makeMesh(
      new THREE.PlaneGeometry(80, 80).rotateX(-Math.PI / 2),
      ctx.mats.get('concrete'),
      { cast: false },
    );
    ctx.scene.add(floor);
    ctx.level = {
      stub: true,
      playerStart: { pos: new THREE.Vector3(0, 0, 4), yaw: 0 },
      objectives: [],
      enemySpawns: [],
      zones: [],
      interiorBoxes: [],
      cinematicPath: [],
      extraction: { pos: new THREE.Vector3(), radius: 2 },
      groundSurfaceAt: () => 'concrete',
      update() {},
    };
    ctx.backdrop = STUBS.backdrop();
    ctx.ground = STUBS.ground();
    ctx.physics.build();
    if (showcaseName === 'fx') {
      await initModule('fx', () => f1(ctx));
    } else {
      try {
        ctx.fx = await f1(ctx);
      } catch {
        ctx.fx = STUBS.fx();
      }
    }
    ctx.audio = STUBS.audio();
    ctx.hud = STUBS.hud();
    ctx.player = createShowcasePlayerStub();
    ctx.combat = createCombatSystem(ctx);
    ctx.weapon = STUBS.weapon();
    ctx.enemies = STUBS.enemies();
    ctx.game = { state: 'showcase', update: () => false, start() {} };

    let info: any = null;
    try {
      info = await SHOWCASE_MODULES[showcaseName].showcase(ctx);
    } catch (err: any) {
      reportFatal(`showcase "${showcaseName}" threw: ${err?.stack || err}`);
    }
    ctx.showcaseInfo = info || {};
    if (info && info.cam) {
      setShot({ cam: [...info.cam, ...(info.target || [0, 1, 0])].join(',') });
    }
  } else {
    await setBootProgress('Stacking containers', 0.34);
    await initModule('level', () => Pg(ctx), true);
    await setBootProgress('Raising the cranes', 0.5);
    await initModule('backdrop', () => Iv(ctx));
    await setBootProgress('Flooding the apron', 0.58);
    await initModule('ground', () => Vg(ctx));

    if (ctx.ground.stub) {
      const fallbackGround = makeMesh(
        new THREE.PlaneGeometry(400, 400).rotateX(-Math.PI / 2),
        ctx.mats.get('asphalt'),
        { cast: false },
      );
      ctx.scene.add(fallbackGround);
    }

    ctx.physics.build();
    await setBootProgress('Loading tracers and smoke', 0.66);
    await initModule('fx', () => f1(ctx));
    await initModule('audio', () => (params.noaudio ? Promise.resolve(STUBS.audio()) : cE(ctx)));
    ctx.player = createPlayer(ctx);
    ctx.combat = createCombatSystem(ctx);

    try {
      ctx.explosives = createExplosives(ctx);
    } catch (err: any) {
      console.error('[boot] explosives failed: ' + (err?.stack || err));
      ctx.explosives = { items: [], reset() {}, update() {} };
    }

    await setBootProgress('Checking the rifle', 0.74);
    await initModule('weapon', () => I5(ctx));
    await setBootProgress('Waking the Harbormaster', 0.82);
    await initModule('enemies', () => W5(ctx));
    await initModule('hud', () => sT(ctx));
    ctx.game = pT(ctx);
    initWeaponSelect(ctx);
  }

  await setBootProgress('Waiting for first light', 0.92);
  try {
    await ctx.render.onLevelReady();
  } catch (err: any) {
    console.error('[boot] render.onLevelReady failed: ' + (err?.stack || err));
  }

  if (params.cam) setShot(params);
  if (params.fov) setShot({ fov: params.fov });
  if (!showcaseName && (params.shot || params.autostart)) {
    try {
      ctx.game.start({ skipIntro: true });
    } catch (err) {
      console.error('[boot] game.start failed', err);
    }
  }
  if (params.noweapon && ctx.weapon.setVisible) ctx.weapon.setVisible(false);
  if (isBench) attachBenchmark(ctx);

  await setBootProgress('Ready', 1);
  if (bootRoot) {
    bootRoot.classList.add('done');
    setTimeout(() => {
      bootRoot.hidden = true;
    }, 700);
  }

  startMainLoop(ctx, () => shotOverride);
}

boot().catch((err) => reportFatal(err?.stack || err));
