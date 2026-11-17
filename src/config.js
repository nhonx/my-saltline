/**
 * Central Game & Simulation Configuration (`src/config.js`)
 * Edit the constants below to manually tune enemy spawning, AI behavior, and realistic weapon ballistics.
 */

export const SPAWN_CONFIG = {
  /** Maximum number of enemies alive on the ship at the same time */
  maxAlive: 3,

  /** Time in seconds to spawn/replenish a patrolling enemy (1 min = 60s) */
  spawnIntervalSeconds: 60,

  /** Number of patrolling enemies spawned immediately when the mission starts */
  initialPatrolCount: 3,

  /** Minimum distance (meters) from the player for a new enemy spawn point */
  minSpawnDistance: 20,

  /** Minimum spacing (meters) preferred between active/queued enemies when choosing a spawn point */
  enemySpacingDistance: 16,

  /** Stagger delay (seconds) when multiple enemies are queued together */
  waveSpawnStagger: 1.0,
};

export const ENEMY_CONFIG = {
  /** Human terrorist health points */
  hp: 120,

  /** Damage per AK-47 hit from an enemy terrorist */
  shotDamage: 7,

  /** Shots fired per enemy AK-47 burst */
  burst: 4,

  /** Seconds between shots in an enemy burst (0.1s = 10 shots/sec = 600 RPM AK-47 cyclic rate) */
  burstGap: 0.1,

  /** Aim reaction / telegraph time (seconds) before opening fire */
  telegraph: 0.4,

  /** Cooldown range [min, max] in seconds between bursts */
  cooldown: [1.5, 2.6],

  /** Human movement speeds (m/s) */
  patrolSpeed: 1.85,
  stalkSpeed: 2.75,
  runSpeed: 4.65,
  accel: 8.5,
  turnRate: 3.6,
  replan: 0.55,

  /** Preferred combat engagement distance (meters) */
  rangeMin: 8,
  rangeMax: 24,

  /** Enemy aiming dispersion (radians) */
  spreadFar: 0.105,
  spreadNear: 0.038,

  /** Perception & AI coordination */
  sightRange: 45,
  sightCone: 200,
  hearRadius: 45,
  loseSight: 4.5,
  searchTime: 8.5,
};

/**
 * Realistic Life-Simulation Weapon Specifications
 * - `bulletsPerSecond`: cyclic rate of fire in rounds/second (`rpm` is `bulletsPerSecond * 60`)
 * - `damage`: base ballistic damage per hit (headshots multiply by 2.2x)
 * - `recoil`: realistic physical kick applied to player camera and 3D viewmodel springs
 * - `spread`: hipfire, ADS, movement, and per-shot bloom dispersion (radians)
 */
export const WEAPONS_CONFIG = {
  ak47: {
    name: 'AK-47',
    role: 'Assault Rifle',
    caliber: '7.62×39mm M43',
    mode: 'Full-Auto',
    slot: 'rifle',
    magSize: 30,
    reserve: 150,
    bulletsPerSecond: 10.0, // 600 RPM real-world cyclic rate
    rpm: 600,
    damage: 38, // Heavy 7.62×39mm stopping power
    range: 300,
    auto: true,
    adsTime: 0.2,
    inspect: true,
    flashLight: 48,
    flashScale: 1.08,
    smoke: true,
    recoil: {
      pitchKick: 0.0112, // Strong 7.62mm vertical muzzle climb
      yawKick: 0.0046, // Horizontal gas-piston oscillation
      firstShotMult: 1.35,
      sustainedMult: 0.55,
      cameraShake: 0.16,
      viewBack: 1.05,
      viewRise: 1.95,
      viewYaw: 1.15,
      viewRoll: 2.1,
      viewUp: 0.13,
      viewSide: 0.1,
    },
    spread: {
      hip: 0.0155,
      ads: 0.0015,
      moveHip: 0.016,
      moveAds: 0.005,
      bloomHip: 0.0085,
      bloomAds: 0.003,
      air: 0.026,
      crouch: 0.0025,
      shot: 0.21,
      decay: 1.4,
    },
  },

  mp5: {
    name: 'HK MP5A3',
    role: 'Submachine Gun',
    caliber: '9×19mm Parabellum',
    mode: 'Full-Auto',
    slot: 'rifle',
    magSize: 30,
    reserve: 180,
    bulletsPerSecond: 13.33, // 800 RPM real-world HK MP5 cyclic rate
    rpm: 800,
    damage: 24, // 9×19mm closed-bolt roller-delayed SMG
    range: 180,
    auto: true,
    adsTime: 0.15,
    inspect: true,
    flashLight: 36,
    flashScale: 0.78,
    smoke: true,
    recoil: {
      pitchKick: 0.0052, // Smooth roller-delayed blowback with low muzzle rise
      yawKick: 0.0024,
      firstShotMult: 1.15,
      sustainedMult: 0.42,
      cameraShake: 0.085,
      viewBack: 0.62,
      viewRise: 0.95,
      viewYaw: 0.65,
      viewRoll: 1.15,
      viewUp: 0.075,
      viewSide: 0.06,
    },
    spread: {
      hip: 0.0095,
      ads: 0.0011,
      moveHip: 0.009,
      moveAds: 0.0028,
      bloomHip: 0.005,
      bloomAds: 0.0018,
      air: 0.018,
      crouch: 0.0018,
      shot: 0.13,
      decay: 1.85,
    },
  },

  uzi: {
    name: 'IMI Uzi',
    role: 'Compact SMG',
    caliber: '9×19mm Parabellum',
    mode: 'Full-Auto',
    slot: 'rifle',
    magSize: 32, // Standard 32-round Uzi box magazine
    reserve: 192,
    bulletsPerSecond: 15.83, // 950 RPM high-speed open-bolt / tactical SMG rate
    rpm: 950,
    damage: 21, // Short-barrel 9×19mm close-quarters shredder
    range: 140,
    auto: true,
    adsTime: 0.13,
    inspect: true,
    flashLight: 38,
    flashScale: 0.85,
    smoke: true,
    recoil: {
      pitchKick: 0.0068, // Snappy open-bolt vertical & horizontal chatter
      yawKick: 0.0056,
      firstShotMult: 1.25,
      sustainedMult: 0.48,
      cameraShake: 0.11,
      viewBack: 0.76,
      viewRise: 1.42,
      viewYaw: 1.35,
      viewRoll: 2.25,
      viewUp: 0.095,
      viewSide: 0.11,
    },
    spread: {
      hip: 0.011,
      ads: 0.002,
      moveHip: 0.008,
      moveAds: 0.0032,
      bloomHip: 0.0072,
      bloomAds: 0.0028,
      air: 0.019,
      crouch: 0.002,
      shot: 0.16,
      decay: 1.7,
    },
  },

  pac9: {
    name: 'PAC-9 Longshore',
    role: 'Tactical Carbine',
    caliber: '5.8×40mm · HX-2 Reflex',
    mode: 'Full-Auto',
    slot: 'rifle',
    magSize: 30,
    reserve: 150,
    bulletsPerSecond: 12.0, // 720 RPM
    rpm: 720,
    damage: 28,
    range: 300,
    auto: true,
    adsTime: 0.18,
    inspect: true,
    flashLight: 45,
    flashScale: 1.0,
    smoke: true,
    recoil: {
      pitchKick: 0.0068,
      yawKick: 0.003,
      firstShotMult: 1.25,
      sustainedMult: 0.42,
      cameraShake: 0.11,
      viewBack: 0.8,
      viewRise: 1.4,
      viewYaw: 0.9,
      viewRoll: 1.6,
      viewUp: 0.1,
      viewSide: 0.08,
    },
    spread: {
      hip: 0.0125,
      ads: 0.0012,
      moveHip: 0.013,
      moveAds: 0.004,
      bloomHip: 0.0065,
      bloomAds: 0.0022,
      air: 0.022,
      crouch: 0.002,
      shot: 0.17,
      decay: 1.5,
    },
  },

  deagle: {
    name: 'Desert Eagle',
    role: 'Heavy Sidearm',
    caliber: '.50 Action Express',
    mode: 'Semi-Auto',
    slot: 'pistol',
    magSize: 7,
    reserve: Infinity,
    bulletsPerSecond: 4.0, // 240 RPM heavy magnum cadence
    rpm: 240,
    damage: 68, // Massive .50 AE magnum stopping power
    range: 150,
    auto: false,
    adsTime: 0.17,
    inspect: false,
    flashLight: 44,
    flashScale: 0.92,
    smoke: true,
    recoil: {
      pitchKick: 0.022, // Heavy .50 AE hand-cannon muzzle flip
      yawKick: 0.0085,
      firstShotMult: 1.0,
      sustainedMult: 1.0,
      cameraShake: 0.25,
      viewBack: 0.85,
      viewRise: 9.2,
      viewYaw: 1.9,
      viewRoll: 3.4,
      viewUp: 0.28,
      viewSide: 0.14,
    },
    spread: {
      hip: 0.012,
      ads: 0.0015,
      moveHip: 0.0085,
      moveAds: 0.0035,
      bloomHip: 0.014,
      bloomAds: 0.005,
      air: 0.022,
      crouch: 0.002,
      shot: 0.42,
      decay: 2.1,
    },
  },

  pac4: {
    name: 'PAC-4 Bosun',
    role: 'Service Sidearm',
    caliber: '9×19mm · PA-SVC',
    mode: 'Semi-Auto',
    slot: 'pistol',
    magSize: 15,
    reserve: Infinity,
    bulletsPerSecond: 7.0, // 420 RPM fast semi-auto trigger
    rpm: 420,
    damage: 30,
    range: 120,
    auto: false,
    adsTime: 0.14,
    inspect: false,
    flashLight: 30,
    flashScale: 0.55,
    smoke: false,
    recoil: {
      pitchKick: 0.0085,
      yawKick: 0.0038,
      firstShotMult: 1.0,
      sustainedMult: 1.0,
      cameraShake: 0.11,
      viewBack: 0.5,
      viewRise: 5.6,
      viewYaw: 1.1,
      viewRoll: 1.9,
      viewUp: 0.16,
      viewSide: 0.08,
    },
    spread: {
      hip: 0.0105,
      ads: 0.0017,
      moveHip: 0.0065,
      moveAds: 0.003,
      bloomHip: 0.0085,
      bloomAds: 0.003,
      air: 0.018,
      crouch: 0.002,
      shot: 0.3,
      decay: 2.8,
    },
  },
};

export const CONFIG = {
  spawn: SPAWN_CONFIG,
  enemy: ENEMY_CONFIG,
  weapons: WEAPONS_CONFIG,
};

export default CONFIG;
