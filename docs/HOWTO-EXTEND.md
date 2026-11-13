# Extending the Saltline Game Kit

## 1. Adding a New Prop

Register a procedural prop builder via `hv.register(name, builderFn)` (from `src/modules/props.js`) and add its bounding size to `PROP_SIZES`:

```ts
import { hv } from '../modules/props.js';
import { box, makeMesh } from '../engine/geometry/primitives';

hv.register('my_crate', (ctx, opts = {}) => {
  const group = new ctx.THREE.Group();
  group.add(makeMesh(box(1.2, 1.0, 1.2, 'bottom'), ctx.mats.get('wood_pallet')));
  group.userData.colliders = [
    { min: [-0.6, 0, -0.6], max: [0.6, 1.0, 0.6], surface: 'wood' },
  ];
  group.userData.size = [1.2, 1.0, 1.2];
  return group;
});
```

Preview it immediately with `?show=props&names=my_crate`.

## 2. Using the Generic `ContentRegistry<T>`

For new game systems (levels, weapons, enemy archetypes, game modes), use `ContentRegistry<T>` from `src/engine/core/registry.ts`:

```ts
import { ContentRegistry } from '../engine/core/registry';

export interface LevelDef {
  id: string;
  build: (ctx: EngineContext) => Promise<void>;
}

export const levelRegistry = new ContentRegistry<LevelDef>();
```

## 3. Subscribing to Engine Events

Use `ctx.events.on(eventName, handler)` (`src/engine/core/events.ts`). Core events include:
- `weapon:fire`, `weapon:reload`, `weapon:switch`, `weapon:dry`
- `impact`, `explosion`, `explosive:lit`, `explosive:blast`
- `enemy:spawn`, `enemy:alert`, `enemy:hit`, `enemy:killed`, `enemy:fire`, `enemy:melee`
- `player:step`, `player:land`, `player:jump`, `player:hit`, `player:dead`, `player:rescued`
- `objective:progress`, `objective:done`, `objective:all`, `extraction:reached`
- `game:state`, `holdout:wave`, `radio:line`, `input:device`, `input:lock`, `input:pad`

## 4. Creating a Forked Deterministic RNG Stream

When adding new procedural generation without disturbing existing world layouts, fork a dedicated stream:

```ts
const myRng = ctx.rng.fork('my-feature');
```

