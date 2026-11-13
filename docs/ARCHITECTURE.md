# Saltline Game Kit — Architecture

This project is structured as a two-layer HTML5/WebGL FPS kit built on **Three.js `0.180.0`**, **TypeScript**, and **Vite**.

## Directory Layout

- `src/main.ts` — Application entry point, boot progress, showcase routing, and main loop startup.
- `src/engine/` — Reusable, game-agnostic FPS engine kit:
  - `core/` — `EngineContext`, `createEventBus`, `createRng`, `ContentRegistry`, `startMainLoop`, `STUBS`, math helpers.
  - `platform/` — `detectQuality` & `QUALITY_PRESETS` (`test`, `low`, `medium`, `high`, `ultra`).
  - `geometry/` — World-UV procedural geometry primitives (`box`, `roundedBox`, `cylinder`, `tube`, `transformGeometry`, `paintVertexColors`, `mergeGeometriesSafe`, `mergeGroup`, `makeMesh`).
  - `physics/` — `createPhysicsWorld`: AABB collision, capsule movement with step-up, raycasting, line-of-sight, and 2D A* navgrid with string-pulling.
  - `input/` — `createInput`: unified Keyboard/Mouse (pointer lock + edge-pan drag fallback), Touch (virtual stick + buttons), and Gamepad (with menu navigation and rumble).
  - `debug/` — `attachBenchmark`, `installErrorHooks`, `reportFatal`, showcase stubs, and `window.__G` / `window.__stats` / `window.__setShot` hooks.
- `src/game/` — Saltline game content, configuration, actors, and rules:
  - `config/` — `world.ts`, `modes.ts`, `settings.ts`, `explosives.ts`.
  - `actors/` — `player.ts` (FPS controller, recoil, shake, bob, health/regen).
  - `systems/` — `combat.ts` (hitscan, enemy shot, radial explosion damage).
  - `legacy/` — `legacyLauncher.ts` (launches the embedded first build at `/legacy/v8.html`).
- `src/modules/` — Recovered ES modules from the original bundle (`render.js`, `mats.js`, `props.js`, `level.js`, `backdrop.js`, `ground.js`, `fx.js`, `audio.js`, `weapon.js`, `hands.js`, `enemies.js`, `hud.js`, `menus.js`, `game.js`, `explosives.js`) wired to the TypeScript `engine/` and `game/` core.
- `public/legacy/v8.html` — Preserved first build (opaque artifact).
- `reference/original.html` — Untouched original single-file game for parity verification.
- `tools/` — `parity.mjs` (Playwright 14-shot visual & error parity suite), `analyze-bundle.mjs`, `split-bundle.mjs`.

## Update Loop Phases (`src/engine/core/loop.ts`)

1. `input` — Poll keyboard/mouse/touch/gamepad.
2. `game` — Advance game state machine (`title`, `playing`, `paused`, `dead`, `complete`).
3. `gameplay` (active play only) — `player`, `weapon`, `enemies`, `explosives` (or `showcaseInfo.update`).
4. `world` (when not paused) — `fx`, `ground`, `level`, `backdrop`, `mats`.
5. `audio` & `hud`.
6. `render` — `render.frame(dt)`.
7. `endFrame` — Clear per-frame input deltas (`justPressed`, `look.dx/dy`).

## Commands

- `npm run dev` — Start Vite dev server.
- `npm run build` — Run `tsc --noEmit` and build production bundle to `dist/`.
- `npm run typecheck` — Run TypeScript type check.
- `node tools/parity.mjs --mode=verify` — Run the 14-shot Playwright visual & runtime-error parity check against `reference/original.html`.

## URL Debug & Showcase Parameters

All original URL parameters are preserved:
`?seed=`, `?eseed=`, `?q=low|medium|high|ultra|test`, `?shot=1`, `?autostart=1`, `?noaudio=1`, `?bench=1` / `#bench`, `?show=mats|level|backdrop|ground|fx|weapon|hands|enemies|props|render`, `?cam=x,y,z,lx,ly,lz`, `?fov=`, `?dt=`, `?step=1`, `?noweapon=1`, `?wfill=`.

