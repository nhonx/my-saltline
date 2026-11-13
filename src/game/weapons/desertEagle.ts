import * as THREE from 'three';
import type { WeaponGeoHelpers } from './ak47';

export const DEAGLE_RAKE = 0.314;
export const DEAGLE_MAG_DIR: [number, number] = [-0.309, -0.951];
export const DEAGLE_MAG_LEN = 0.122;

export const DEAGLE_CONFIG = {
  name: 'Desert Eagle',
  muzzle: [0, 0, -0.172] as [number, number, number],
  eject: [0.017, 0.008, -0.012] as [number, number, number],
  sightY: 0.022,
  rearF: -0.068,
  frontF: 0.148,
  slideTravel: 0.044,
  slideLock: 0.038,
  rake: DEAGLE_RAKE,
  magPos: [0, -0.014, 0.04] as [number, number, number],
  magLen: DEAGLE_MAG_LEN,
  magAxis: [0, DEAGLE_MAG_DIR[1], -DEAGLE_MAG_DIR[0]] as [number, number, number],
  stopPivot: [0, -0.014, -0.004] as [number, number, number],
  barrelPivot: [0, -0.008, 0] as [number, number, number],
  gripFront: [-0.032, -0.042] as [number, number],
  gripBack: [-0.095, -0.042] as [number, number],
};

export const DEAGLE_DEF = {
  magSize: 7,
  reserve: Infinity,
  rpm: 260,
  damage: 58,
  range: 140,
  auto: false,
  adsTime: 0.16,
  inspect: false,
  flashLight: 40,
  flashScale: 0.85,
  smoke: true,
  spread: {
    hip: 0.0115,
    ads: 0.0015,
    moveHip: 0.0075,
    moveAds: 0.0032,
    bloomHip: 0.011,
    bloomAds: 0.004,
    air: 0.02,
    crouch: 0.002,
    shot: 0.36,
    decay: 2.3,
  },
};

/**
 * Builds the procedural Desert Eagle (.50 AE) viewmodel geometry parts.
 * Coordinates: -Z is forward toward muzzle, +Y is up, +X is right.
 */
export function buildDesertEagleGeometry(geo: WeaponGeoHelpers) {
  const { Mt, Q0, Nn, h0, m0, Eu, $a, kn, b0, Fs, sy, Zl } = geo;

  const colChrome = [1.0, 1.0, 1.03];
  const colSteel = [0.95, 0.96, 1.0];
  const colRubber = [0.92, 0.92, 0.95];
  const colDot = [1.0, 1.0, 1.0];
  const colBrass = [1.0, 0.92, 0.78];

  const frame: THREE.BufferGeometry[] = [];
  const grip: THREE.BufferGeometry[] = [];
  const steel: THREE.BufferGeometry[] = [];
  const plain: THREE.BufferGeometry[] = [];
  const barrel: THREE.BufferGeometry[] = [];
  const slide: THREE.BufferGeometry[] = [];
  const stop: THREE.BufferGeometry[] = [];
  const mag: THREE.BufferGeometry[] = [];
  const round: THREE.BufferGeometry[] = [];
  const dots: THREE.BufferGeometry[] = [];

  // 1. Heavy Stainless Frame + Full-Length Dust Cover + Pronounced Beaver Tail
  frame.push(
    // Upper frame rails & full-length under-barrel dust cover (z_fwd = -0.072 .. +0.162)
    Mt(0.031, 0.016, 0.232, 0.0016, 0, -0.013, 0.045, colChrome, { wear: 0.6 }),
    // Lower dust cover under barrel (distinctive Desert Eagle squared front)
    Mt(0.028, 0.012, 0.125, 0.0015, 0, -0.021, 0.095, colChrome, { wear: 0.6 }),
    // Beaver tail tang extending rearwards
    Q0(
      b0(
        [
          [-0.052, -0.004],
          [-0.098, -0.002],
          [-0.104, -0.009],
          [-0.088, -0.018],
          [-0.05, -0.018],
        ],
        0.002,
      ),
      -0.0145,
      0.0145,
      0.0012,
      colChrome,
      { wear: 0.5 },
    ),
    // Large squared Combat Trigger Guard
    Q0(
      b0(
        [
          [0.026, -0.02],
          [0.028, -0.048],
          [-0.018, -0.048],
          [-0.024, -0.02],
          [-0.017, -0.02],
          [-0.013, -0.042],
          [0.021, -0.042],
          [0.02, -0.02],
        ],
        0.0018,
      ),
      -0.0065,
      0.0065,
      0.0008,
      colChrome,
      { wear: 0.7 },
    ),
  );

  // Structural grip spine inside frame (so FD(n) frame bounding checks still work cleanly)
  const gripTan = Math.tan(DEAGLE_RAKE);
  const gripRings: number[][][] = [];
  const gripBase = $a(0.0155, -0.029, 0.029, 0.008, 0.008, 3);
  for (let i = 0; i <= 4; i++) {
    const t = i / 4;
    const y = -0.018 - t * 0.096;
    const zCenter = 0.062 + (-0.018 - y) * gripTan;
    const hwScale = 1 + 0.05 * Math.sin(t * Math.PI);
    gripRings.push(gripBase.map(([gx, gy]) => [gx * hwScale, y, zCenter - gy]));
  }
  // Black wrap-around rubberized Desert Eagle grip
  grip.push(Eu(gripRings, colRubber, { wear: 0.4 }));
  // Subtle frame tang/backstrap visible at top of grip
  frame.push(
    Eu(
      [
        kn($a(0.0145, -0.027, 0.027, 0.007, 0.007, 3), -0.052),
        kn($a(0.0145, -0.027, 0.027, 0.007, 0.007, 3), -0.056),
      ],
      colChrome,
      { wear: 0.5 },
    ),
  );

  // 2. Iconic Triangular-Profile Desert Eagle Fixed Barrel + Top Rib
  const barrelProfile = b0(
    [
      [-0.0145, -0.008],
      [0.0145, -0.008],
      [0.0145, 0.003],
      [0.0095, 0.0135],
      [-0.0095, 0.0135],
      [-0.0145, 0.003],
    ],
    0.0014,
  );
  barrel.push(
    // Main heavy 6-inch triangular barrel shroud (z_fwd = +0.022 .. +0.168)
    Nn(barrelProfile, 0.022, 0.168, 0.0012, colChrome, { wear: 0.6 }),
    // Inner bore / muzzle crown
    h0(
      [
        [0.0063, 0.164],
        [0.0085, 0.164],
        [0.0085, 0.171],
        [0.0063, 0.171],
      ],
      16,
      colSteel,
      { wear: 0.4 },
    ),
    // Top Picatinny / ventilated rib slots on barrel
    Mt(0.015, 0.0035, 0.132, 0.0006, 0, 0.015, 0.095, colChrome, { wear: 0.7 }),
    // Front blade sight (tall, aligned to sightY = 0.022)
    Mt(0.0034, 0.0085, 0.012, 0.0006, 0, 0.0185, 0.148, colSteel, { wear: 0.8 }),
  );
  // Front tritium dot
  dots.push(
    Mt(0.0022, 0.0022, 0.0015, 0.0004, 0, 0.0205, 0.1415, colDot, { wear: 0 }),
  );

  // 3. Heavy Reciprocating Rear Slide (z_fwd = -0.075 .. +0.026)
  const slideProfile = b0(
    [
      [-0.016, -0.006],
      [0.016, -0.006],
      [0.016, 0.004],
      [0.011, 0.0145],
      [-0.011, 0.0145],
      [-0.016, 0.004],
    ],
    0.0014,
  );
  slide.push(
    // Main rear slide body
    Nn(slideProfile, -0.075, 0.024, 0.0012, colChrome, { wear: 0.65 }),
    // Rear sight base (left & right wings leaving center notch open at y=0.017..0.022)
    Mt(0.0065, 0.0085, 0.012, 0.0006, -0.0056, 0.0185, -0.068, colSteel, { wear: 0.8 }),
    Mt(0.0065, 0.0085, 0.012, 0.0006, 0.0056, 0.0185, -0.068, colSteel, { wear: 0.8 }),
    Mt(0.018, 0.004, 0.012, 0.0005, 0, 0.0155, -0.068, colSteel, { wear: 0.7 }),
    // Ambidextrous slide-mounted thumb safety levers
    Mt(0.0045, 0.008, 0.018, 0.001, -0.0175, 0.004, -0.056, colSteel, { wear: 0.9 }),
    Mt(0.0045, 0.008, 0.018, 0.001, 0.0175, 0.004, -0.056, colSteel, { wear: 0.9 }),
  );
  // Rear slide cocking serrations
  for (let i = 0; i < 6; i++) {
    const sz = -0.064 + i * 0.0055;
    slide.push(
      Mt(0.0335, 0.012, 0.0022, 0.0004, 0, 0.001, sz, colSteel, { wear: 0.8 }),
    );
  }
  // Rear 2 tritium dots
  dots.push(
    Mt(0.0022, 0.0022, 0.0015, 0.0004, -0.0054, 0.0205, -0.0745, colDot, { wear: 0 }),
    Mt(0.0022, 0.0022, 0.0015, 0.0004, 0.0054, 0.0205, -0.0745, colDot, { wear: 0 }),
  );

  // 4. Controls & Hardware (steel)
  steel.push(
    // Curved combat trigger
    Q0(
      b0(
        [
          [0.004, -0.018],
          [0.009, -0.018],
          [0.003, -0.03],
          [0.011, -0.04],
          [0.006, -0.041],
          [-0.002, -0.03],
        ],
        0.001,
      ),
      -0.0028,
      0.0028,
      0.0006,
      colSteel,
      { wear: 0.7 },
    ),
    // Exposed Desert Eagle hammer
    Q0(
      b0(
        [
          [-0.076, -0.004],
          [-0.088, 0.003],
          [-0.094, -0.002],
          [-0.084, -0.012],
        ],
        0.0012,
      ),
      -0.0035,
      0.0035,
      0.0006,
      colSteel,
      { wear: 0.8 },
    ),
    // Magazine release button & takedown pin
    m0(0.0035, 0.033, 0, -0.024, -0.022, colSteel, 8),
    m0(0.0026, 0.032, 0, -0.014, 0.025, colSteel, 8),
  );

  // Slide stop lever (relative to DEAGLE_CONFIG.stopPivot = [0, -0.014, -0.004])
  stop.push(
    Mt(0.004, 0.0065, 0.026, 0.0008, -0.0165, 0.002, 0.01, colSteel, { wear: 0.9 }),
  );

  // 5. Heavy .50 AE 7-Round Magazine (relative to DEAGLE_CONFIG.magPos, rotated by -DEAGLE_RAKE)
  const magProfile = $a(0.0112, -0.022, 0.022, 0.0035, 0.0035, 2);
  mag.push(
    Eu(
      [
        magProfile.map(([mx, my]) => [mx * 0.96, 0, -my]),
        magProfile.map(([mx, my]) => [mx, -0.106, -my]),
      ],
      colSteel,
      { wear: 0.8 },
    ),
    // Thick Desert Eagle magazine floorplate
    Mt(0.026, 0.011, 0.052, 0.0015, 0, -0.111, 0, colSteel, { wear: 0.9 }),
  );

  // Big .50 AE brass cartridge at top of magazine
  round.push(
    h0(
      [
        [0, -0.016],
        [0.0066, -0.016],
        [0.0068, -0.014],
        [0.0064, 0.012],
        [0.0052, 0.02],
        [0.0026, 0.024],
        [0, 0.025],
      ],
      12,
      colBrass,
      { wear: 0, ox: 0, oy: 0.004 },
    ),
  );

  const parts = {
    frame: Fs(frame),
    grip: Fs(grip),
    steel: Fs(steel),
    plain: Fs(plain),
    barrel: Fs(barrel),
    slide: Fs(slide),
    stop: Fs(stop),
    mag: Fs(mag),
    round: Fs(round),
    dots: Fs(dots),
  };

  const occ = (x: number, y: number, z: number, key: string) =>
    key === 'plain' || key === 'round' || key === 'mag' || key === 'dots'
      ? 0
      : Math.max(
          Zl(x, y, z, -0.025, 0.025, -0.095, -0.06, -0.02, 0.03, 0.012),
          0.5 * Zl(x, y, z, -0.025, 0.025, -0.025, -0.01, -0.06, 0.06, 0.004),
        );

  sy(
    Object.entries(parts)
      .filter(([key, g]) => key !== 'dots' && Boolean(g.attributes.position))
      .map(([key, g]) => ({
        key,
        g,
        off: key === 'mag' || key === 'round' ? DEAGLE_CONFIG.magPos : key === 'stop' ? DEAGLE_CONFIG.stopPivot : null,
        rx: key === 'mag' || key === 'round' ? -DEAGLE_RAKE : 0,
      })),
    occ,
    0.0013,
  );

  for (const g of Object.values(parts)) g.computeBoundingSphere();
  return parts;
}

