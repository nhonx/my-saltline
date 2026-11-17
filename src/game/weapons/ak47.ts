import * as THREE from 'three';
import { WEAPONS_CONFIG } from '../../config.js';

export interface WeaponGeoHelpers {
  Mt: (
    sx: number,
    sy: number,
    sz: number,
    bevel: number,
    x: number,
    y: number,
    z: number,
    color: number[],
    opts?: Record<string, unknown>,
    rot?: number[] | null,
  ) => THREE.BufferGeometry;
  Q0: (
    pts: number[][],
    x0: number,
    x1: number,
    bevel: number,
    color: number[],
    opts?: Record<string, unknown>,
  ) => THREE.BufferGeometry;
  Nn: (
    pts: number[][],
    z0: number,
    z1: number,
    bevel: number,
    color: number[],
    opts?: Record<string, unknown>,
  ) => THREE.BufferGeometry;
  h0: (
    profile: number[][],
    segs: number,
    color: number[],
    opts?: Record<string, unknown>,
  ) => THREE.BufferGeometry;
  m0: (
    r: number,
    len: number,
    x: number,
    y: number,
    z: number,
    color: number[],
    segs?: number,
    opts?: Record<string, unknown>,
  ) => THREE.BufferGeometry;
  Eu: (
    rings: number[][][],
    color: number[],
    opts?: Record<string, unknown>,
  ) => THREE.BufferGeometry;
  Su: (x0: number, y0: number, x1: number, y1: number, r: number, segs?: number) => number[][];
  $a: (hw: number, y0: number, y1: number, rTop: number, rBot: number, segs?: number) => number[][];
  kn: (pts: number[][], z: number, opts?: Record<string, unknown>) => number[][];
  b0: (pts: number[][], radii: number | number[], segs?: number) => number[][];
  Fs: (geos: Array<THREE.BufferGeometry | null | undefined>) => THREE.BufferGeometry;
  sy: (
    parts: Array<{ key: string; g: THREE.BufferGeometry; off?: number[] | null; rx?: number }>,
    occFn?: ((x: number, y: number, z: number, key: string) => number) | null,
    voxel?: number,
  ) => void;
  Zl: (
    x: number,
    y: number,
    z: number,
    x0: number,
    x1: number,
    y0: number,
    y1: number,
    z0: number,
    z1: number,
    pad: number,
  ) => number;
}

export const AK47_CONFIG = {
  name: 'AK-47',
  muzzle: [0, 0, -0.575] as [number, number, number],
  eject: [0.022, 0.008, -0.028] as [number, number, number],
  sightY: 0.0445,
  lensF: 0.025,
  window: null as number[][] | null,
  magPos: [0, -0.024, -0.095] as [number, number, number],
  boltTravel: 0.072,
  railTop: 0.028,
  grip: [0, -0.095, 0.074] as [number, number, number],
  handguard: [0, -0.006, -0.24] as [number, number, number],
  handguardR: 0.022,
  handlePos: [-0.024, 0.006, -0.072] as [number, number, number],
  squeeze: 0.88,
};

export const AK47_DEF = WEAPONS_CONFIG.ak47;

/**
 * Builds the procedural AK-47 viewmodel geometry parts.
 * Coordinates: -Z is forward toward muzzle, +Y is up, +X is right.
 */
export function buildAk47Geometry(geo: WeaponGeoHelpers) {
  const { Mt, Q0, Nn, h0, m0, Eu, Su, $a, kn, b0, Fs, sy, Zl } = geo;

  const colSteelDark = [0.95, 0.96, 1.0];
  const colSteelMid = [1.05, 1.05, 1.08];
  const colBolt = [1.32, 1.32, 1.34];
  const colWood = [1.0, 0.95, 0.9];
  const colWoodDark = [0.78, 0.72, 0.66];
  const colBakelite = [1.02, 0.94, 0.88];
  const colMagSteel = [0.85, 0.86, 0.9];
  const colSightDot = [0.95, 0.98, 0.95];
  const colBrass = [1.0, 0.92, 0.78];

  const ano: THREE.BufferGeometry[] = [];
  const gun: THREE.BufferGeometry[] = [];
  const wood: THREE.BufferGeometry[] = [];
  const poly: THREE.BufferGeometry[] = [];
  const plain: THREE.BufferGeometry[] = [];
  const bolt: THREE.BufferGeometry[] = [];
  const mag: THREE.BufferGeometry[] = [];
  const round: THREE.BufferGeometry[] = [];

  // 1. Stamped Steel Receiver (-0.095 .. +0.165 in z-forward, i.e., z = -0.165 .. +0.095)
  // Remember: Mt(sx, sy, sz, bevel, x, y, z_fwd) places center at (x, y, -z_fwd)
  ano.push(
    // Main lower receiver box
    Mt(0.032, 0.04, 0.25, 0.0018, 0, -0.011, 0.03, colSteelDark, { wear: 0.9 }),
    // Front trunnion reinforcement block
    Mt(0.034, 0.036, 0.05, 0.0015, 0, -0.008, 0.132, colSteelDark, { wear: 1.0 }),
    // Rear trunnion / stock tang
    Mt(0.03, 0.022, 0.03, 0.0015, 0, -0.014, -0.1, colSteelDark, { wear: 0.8 }),
    // Magazine well dimple / reinforcement plates
    Mt(0.035, 0.016, 0.068, 0.001, 0, -0.024, 0.095, colSteelDark, { wear: 0.9 }),
    // Trigger guard loop
    Q0(
      b0(
        [
          [0.018, -0.03],
          [0.018, -0.056],
          [-0.032, -0.056],
          [-0.038, -0.03],
          [-0.032, -0.03],
          [-0.028, -0.051],
          [0.013, -0.051],
          [0.013, -0.03],
        ],
        0.002,
      ),
      -0.0055,
      0.0055,
      0.0008,
      colSteelDark,
      { wear: 0.8 },
    ),
    // Magazine release paddle
    Mt(0.008, 0.02, 0.008, 0.001, 0, -0.038, 0.054, colSteelMid, { wear: 0.9 }),
    // Selector lever on right side
    Mt(0.003, 0.011, 0.088, 0.0008, 0.018, -0.005, 0.022, colSteelMid, { wear: 1.0 }, [0.06, 0, 0]),
    // Cleaning rod under barrel
    h0(
      [
        [0, 0.175],
        [0.0025, 0.175],
        [0.0025, 0.49],
        [0.004, 0.495],
        [0, 0.502],
      ],
      8,
      colSteelDark,
      { wear: 0.7, oy: -0.019 },
    ),
  );

  // Ribbed Top Dust Cover (curved lofted profile)
  const dustCoverRings: number[][][] = [];
  const dcZ = [-0.092, -0.04, 0.02, 0.08, 0.125];
  for (let i = 0; i < dcZ.length; i++) {
    const z = dcZ[i];
    const hw = i === 0 ? 0.0145 : 0.0155;
    const topY = i === 0 ? 0.021 : 0.0265;
    dustCoverRings.push(
      kn(
        [
          [-hw, 0.007],
          [hw, 0.007],
          [hw * 0.92, topY - 0.004],
          [hw * 0.45, topY],
          [-hw * 0.45, topY],
          [-hw * 0.92, topY - 0.004],
        ],
        z,
      ),
    );
  }
  ano.push(Eu(dustCoverRings, colSteelDark, { wear: 0.85 }));
  // Dust cover stiffening ribs
  for (const rz of [-0.045, -0.015, 0.015, 0.045]) {
    ano.push(Mt(0.024, 0.0035, 0.007, 0.001, 0, 0.0265, rz, colSteelMid, { wear: 1.0 }));
  }

  // 2. Barrel, Gas Block, Gas Tube, Slant Muzzle Brake & Iron Sights (gun -> steel)
  gun.push(
    // Main 7.62 barrel
    h0(
      [
        [0, 0.14],
        [0.011, 0.14],
        [0.0105, 0.34],
        [0.009, 0.345],
        [0.0086, 0.535],
        [0.0072, 0.54],
        [0.0072, 0.555],
        [0.0042, 0.555],
      ],
      14,
      colSteelMid,
      { wear: 0.8 },
    ),
    // Slant muzzle brake (classic AKM/AK-47)
    h0(
      [
        [0.0072, 0.545],
        [0.0096, 0.547],
        [0.0096, 0.578],
        [0.005, 0.578],
      ],
      14,
      colSteelDark,
      { wear: 1.1 },
    ),
    // Gas tube above barrel
    h0(
      [
        [0, 0.16],
        [0.0092, 0.16],
        [0.0092, 0.335],
        [0, 0.335],
      ],
      12,
      colSteelDark,
      { wear: 0.8, oy: 0.02 },
    ),
    // 45-degree gas block
    Q0(
      b0(
        [
          [0.322, -0.009],
          [0.352, -0.009],
          [0.352, 0.012],
          [0.338, 0.027],
          [0.318, 0.027],
          [0.322, 0.011],
        ],
        0.0012,
      ),
      -0.0105,
      0.0105,
      0.001,
      colSteelMid,
      { wear: 1.0 },
    ),
    // Front sight base & protective ears
    Mt(0.019, 0.032, 0.022, 0.0012, 0, 0.01, 0.522, colSteelMid, { wear: 0.9 }),
    Mt(0.0032, 0.022, 0.014, 0.0008, -0.0085, 0.034, 0.522, colSteelMid, { wear: 1.1 }),
    Mt(0.0032, 0.022, 0.014, 0.0008, 0.0085, 0.034, 0.522, colSteelMid, { wear: 1.1 }),
    // Front sight post
    Mt(0.0022, 0.02, 0.0024, 0.0005, 0, 0.0345, 0.522, colSteelDark, { wear: 0.7 }),
    // Rear tangent sight block & notched leaf (aligned to sightY = 0.0445)
    Mt(0.022, 0.014, 0.048, 0.0012, 0, 0.029, 0.148, colSteelMid, { wear: 0.9 }),
    // Rear sight left & right notch walls (leaving center notch open at y=0.040..0.0445)
    Mt(0.0068, 0.01, 0.014, 0.0008, -0.0052, 0.041, 0.132, colSteelDark, { wear: 1.0 }),
    Mt(0.0068, 0.01, 0.014, 0.0008, 0.0052, 0.041, 0.132, colSteelDark, { wear: 1.0 }),
    Mt(0.016, 0.005, 0.014, 0.0006, 0, 0.0385, 0.132, colSteelDark, { wear: 0.8 }),
    // Curved steel trigger (located around z_fwd = 0.004, y = -0.038 for ID triggerAt)
    Q0(
      b0(
        [
          [0.006, -0.028],
          [0.01, -0.028],
          [0.005, -0.04],
          [0.012, -0.05],
          [0.007, -0.051],
          [-0.001, -0.04],
        ],
        0.001,
      ),
      -0.0026,
      0.0026,
      0.0006,
      colSteelMid,
      { wear: 0.7 },
    ),
    // Receiver rivets & cross-pins
    m0(0.0028, 0.035, 0, -0.004, 0.14, colSteelMid, 8),
    m0(0.0028, 0.035, 0, -0.02, 0.128, colSteelMid, 8),
    m0(0.0024, 0.034, 0, -0.022, 0.028, colSteelMid, 8),
    m0(0.0024, 0.034, 0, -0.022, 0.004, colSteelMid, 8),
  );

  // Sight alignment dots (plain -> matte phosphor)
  plain.push(
    Mt(0.0018, 0.003, 0.0015, 0.0004, 0, 0.0435, 0.521, colSightDot, { wear: 0 }),
    Mt(0.002, 0.0025, 0.0015, 0.0004, -0.0045, 0.0425, 0.125, colSightDot, { wear: 0 }),
    Mt(0.002, 0.0025, 0.0015, 0.0004, 0.0045, 0.0425, 0.125, colSightDot, { wear: 0 }),
  );

  // 3. Bolt Carrier & Charging Handle (moving bolt group)
  bolt.push(
    // Exposed polished steel bolt carrier visible in right-side ejection port
    Mt(0.01, 0.014, 0.072, 0.0012, 0.013, 0.006, 0.045, colBolt, { wear: 0.4 }),
    // Classic right-side upturned AK charging handle
    Mt(0.018, 0.006, 0.012, 0.0012, 0.023, 0.005, 0.068, colBolt, { wear: 0.8 }),
    Mt(0.007, 0.012, 0.01, 0.0015, 0.031, 0.009, 0.068, colBolt, { wear: 0.9 }),
    // Left-side tactical charging knob so left-hand rack animation in wS/ID has a valid target
    h0(
      [
        [0, 0],
        [0.0045, 0.001],
        [0.0055, 0.016],
        [0.004, 0.018],
        [0, 0.018],
      ],
      10,
      colBolt,
      { wear: 0.7 },
    )
      .rotateY(Math.PI / 2)
      .translate(-0.015, 0.006, -0.072),
  );

  // 4. Wooden Furniture: Buttstock + Lower & Upper Handguards (wood -> warm laminated wood)
  // Classic AK-47 angled wooden buttstock (extends backward to z = +0.34, i.e., z_fwd = -0.34)
  wood.push(
    Q0(
      b0(
        [
          [-0.095, 0.002],
          [-0.095, -0.028],
          [-0.335, -0.098],
          [-0.345, -0.018],
          [-0.145, -0.002],
        ],
        [0.003, 0.003, 0.008, 0.008, 0.004],
      ),
      -0.0145,
      0.0145,
      0.0025,
      colWood,
      { wear: 0.5 },
    ),
  );
  // Steel buttplate
  ano.push(
    Q0(
      b0(
        [
          [-0.338, -0.098],
          [-0.349, -0.098],
          [-0.355, -0.018],
          [-0.344, -0.018],
        ],
        0.002,
      ),
      -0.015,
      0.015,
      0.001,
      colSteelDark,
      { wear: 0.9 },
    ),
  );

  // Wooden Lower Handguard (z_fwd = 0.165 .. 0.318) - contoured belly for left support hand
  const lhgRings: number[][][] = [];
  const lhgSteps = [
    { z: 0.162, hw: 0.0185, yTop: 0.006, yBot: -0.028 },
    { z: 0.21, hw: 0.0205, yTop: 0.006, yBot: -0.032 },
    { z: 0.265, hw: 0.02, yTop: 0.006, yBot: -0.03 },
    { z: 0.315, hw: 0.0175, yTop: 0.005, yBot: -0.024 },
  ];
  for (const s of lhgSteps) {
    lhgRings.push(kn($a(s.hw, s.yBot, s.yTop, 0.005, 0.009, 3), s.z));
  }
  wood.push(Eu(lhgRings, colWood, { wear: 0.55 }));

  // Wooden Upper Handguard around gas tube
  wood.push(
    Eu(
      [
        kn($a(0.0145, 0.007, 0.029, 0.006, 0.003, 3), 0.166),
        kn($a(0.0155, 0.007, 0.03, 0.006, 0.003, 3), 0.24),
        kn($a(0.014, 0.007, 0.028, 0.005, 0.003, 3), 0.312),
      ],
      colWoodDark,
      { wear: 0.5 },
    ),
  );
  // Handguard retaining cap & sling loop
  ano.push(Mt(0.034, 0.036, 0.01, 0.0012, 0, -0.005, 0.318, colSteelDark, { wear: 0.9 }));

  // 5. Bakelite / Polymer Pistol Grip (poly -> bakelite)
  // Positioned around AK47_CONFIG.grip = [0, -0.095, 0.074] (so z_fwd = -0.074)
  const gripRings: number[][][] = [];
  const gripBase = $a(0.0145, -0.019, 0.019, 0.007, 0.007, 3);
  for (let i = 0; i <= 4; i++) {
    const t = i / 4;
    const y = -0.028 - t * 0.098;
    const zCenter = 0.036 + t * 0.044; // raked back toward stock (+Z)
    const sx = 1 + 0.08 * Math.sin(t * Math.PI);
    const syScale = 1 + 0.1 * t;
    gripRings.push(
      gripBase.map(([gx, gy]) => [gx * sx, y, zCenter - gy * syScale]),
    );
  }
  poly.push(Eu(gripRings, colBakelite, { wear: 0.6 }));

  // 6. Iconic Curved 30-Round AK-47 Magazine (relative to AK47_CONFIG.magPos = [0, -0.024, -0.095])
  const magRings: number[][][] = [];
  const magProfile = $a(0.0125, -0.034, 0.034, 0.004, 0.004, 2);
  const segs = 10;
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const angle = t * 0.52; // strong classic AK-47 banana curve forward!
    const radius = 0.34;
    const y = -radius * Math.sin(angle);
    const zOffset = -radius * (1 - Math.cos(angle)); // curves forward (-Z)
    const taper = 1 - 0.06 * t;
    magRings.push(
      magProfile.map(([mx, my]) => [
        mx * taper,
        y - my * Math.sin(angle),
        zOffset - my * Math.cos(angle),
      ]),
    );
  }
  mag.push(Eu(magRings, colMagSteel, { wear: 0.9 }));
  // Stamped vertical magazine ribs & floorplate
  mag.push(
    Mt(0.028, 0.01, 0.074, 0.0015, 0, -0.172, 0.046, colSteelDark, { wear: 1.0 }, [0.52, 0, 0]),
  );

  // Visible 7.62x39 brass cartridge at top of magazine
  round.push(
    h0(
      [
        [0, -0.022],
        [0.0052, -0.022],
        [0.0054, -0.02],
        [0.0052, 0.008],
        [0.0038, 0.015],
        [0.0032, 0.025],
        [0.0016, 0.034],
        [0, 0.037],
      ],
      12,
      colBrass,
      { wear: 0, ox: 0.0015, oy: 0.004 },
    ),
  );

  const parts = {
    ano: Fs(ano),
    gun: Fs(gun),
    wood: Fs(wood),
    poly: Fs(poly),
    plain: Fs(plain),
    bolt: Fs(bolt),
    mag: Fs(mag),
    round: Fs(round),
  };

  const occ = (x: number, y: number, z: number, key: string) =>
    key === 'poly' || key === 'plain' || key === 'round' || key === 'mag'
      ? 0
      : Math.max(
          Zl(x, y, z, -0.03, 0.03, -0.1, -0.07, 0.03, 0.1, 0.014),
          0.5 * Zl(x, y, z, -0.03, 0.03, -0.03, -0.014, -0.12, 0.1, 0.005),
        );

  sy(
    Object.entries(parts).map(([key, g]) => ({
      key,
      g,
      off: key === 'mag' || key === 'round' ? AK47_CONFIG.magPos : null,
    })),
    occ,
  );

  for (const g of Object.values(parts)) g.computeBoundingSphere();
  return parts;
}

