import * as THREE from 'three';
import type { WeaponGeoHelpers } from './ak47';
import { WEAPONS_CONFIG } from '../../config.js';

export const MP5_CONFIG = {
  name: WEAPONS_CONFIG.mp5.name,
  muzzle: [0, 0.002, -0.435] as [number, number, number],
  eject: [0.02, 0.008, -0.035] as [number, number, number],
  sightY: 0.042,
  lensF: 0.025,
  window: null as number[][] | null,
  magPos: [0, -0.024, -0.092] as [number, number, number],
  boltTravel: 0.064,
  railTop: 0.028,
  grip: [0, -0.095, 0.074] as [number, number, number],
  handguard: [0, -0.006, -0.235] as [number, number, number],
  handguardR: 0.021,
  handlePos: [-0.024, 0.006, -0.072] as [number, number, number],
  squeeze: 0.88,
};

export const MP5_DEF = WEAPONS_CONFIG.mp5;

/**
 * Builds the procedural HK MP5A3 (9×19mm) viewmodel geometry parts.
 * Coordinates: -Z is forward toward muzzle, +Y is up, +X is right.
 */
export function buildMp5Geometry(geo: WeaponGeoHelpers) {
  const { Mt, Q0, h0, m0, Eu, $a, kn, b0, Fs, sy, Zl } = geo;

  const colSteelDark = [0.88, 0.9, 0.95];
  const colSteelMid = [1.02, 1.04, 1.08];
  const colBolt = [1.18, 1.2, 1.24];
  const colPoly = [0.76, 0.78, 0.82];
  const colMagSteel = [0.84, 0.86, 0.9];
  const colSightDot = [0.95, 0.99, 0.95];
  const colRed = [1.35, 0.25, 0.2];
  const colBrass = [1.0, 0.92, 0.78];

  const ano: THREE.BufferGeometry[] = [];
  const gun: THREE.BufferGeometry[] = [];
  const poly: THREE.BufferGeometry[] = [];
  const plain: THREE.BufferGeometry[] = [];
  const bolt: THREE.BufferGeometry[] = [];
  const mag: THREE.BufferGeometry[] = [];
  const round: THREE.BufferGeometry[] = [];

  // 1. Stamped Steel Upper Receiver & Fluted Cylindrical Top Tube
  ano.push(
    // Lower receiver & trigger housing block
    Mt(0.031, 0.038, 0.23, 0.0018, 0, -0.011, 0.025, colSteelDark, { wear: 0.75 }),
    // Fluted cylindrical upper receiver spine (iconic MP5 rolled sheet-metal tube)
    h0(
      [
        [0, -0.095],
        [0.0155, -0.095],
        [0.0155, 0.145],
        [0, 0.145],
      ],
      14,
      colSteelDark,
      { wear: 0.7, oy: 0.012 },
    ),
    // Cocking tube above barrel (z_fwd = 0.14 .. 0.34)
    h0(
      [
        [0, 0.14],
        [0.0108, 0.14],
        [0.0108, 0.345],
        [0, 0.345],
      ],
      12,
      colSteelDark,
      { wear: 0.75, oy: 0.016 },
    ),
    // Flared MP5 magazine well with reinforcing ribs
    Mt(0.034, 0.032, 0.058, 0.0015, 0, -0.022, 0.092, colSteelDark, { wear: 0.85 }),
    Mt(0.036, 0.005, 0.054, 0.001, 0, -0.016, 0.092, colSteelMid, { wear: 0.9 }),
    Mt(0.036, 0.005, 0.054, 0.001, 0, -0.028, 0.092, colSteelMid, { wear: 0.9 }),
    // Rear receiver endcap & stock tang (required by ID tang solver)
    Mt(0.03, 0.022, 0.03, 0.0015, 0, -0.014, -0.1, colSteelDark, { wear: 0.75 }),
    Mt(0.033, 0.044, 0.024, 0.002, 0, 0.004, -0.1, colSteelMid, { wear: 0.8 }),
    // Low-profile claw optic rail on top of receiver
    Mt(0.021, 0.006, 0.11, 0.001, 0, 0.028, 0.02, colSteelMid, { wear: 0.8 }),
    // Trigger guard loop
    Q0(
      b0(
        [
          [0.018, -0.03],
          [0.016, -0.056],
          [-0.03, -0.056],
          [-0.036, -0.03],
          [-0.03, -0.03],
          [-0.026, -0.051],
          [0.011, -0.051],
          [0.012, -0.03],
        ],
        0.002,
      ),
      -0.0055,
      0.0055,
      0.0008,
      colSteelDark,
      { wear: 0.7 },
    ),
    // MP5A3 Collapsible Dual-Rail Steel Buttstock Rails
    Mt(0.004, 0.009, 0.22, 0.001, -0.0175, 0.002, -0.2, colSteelMid, { wear: 0.85 }),
    Mt(0.004, 0.009, 0.22, 0.001, 0.0175, 0.002, -0.2, colSteelMid, { wear: 0.85 }),
  );

  // 2. 9mm Barrel, Tri-Lug Muzzle, Hooded Front Sight & HK Diopter Drum Rear Sight
  gun.push(
    // 9×19mm barrel with navy tri-lug adapter & knurled thread protector
    h0(
      [
        [0, 0.14],
        [0.0095, 0.14],
        [0.0092, 0.365],
        [0.0112, 0.368],
        [0.0112, 0.392],
        [0.0086, 0.395],
        [0.0086, 0.432],
        [0.0048, 0.432],
      ],
      14,
      colSteelMid,
      { wear: 0.75, oy: 0.002 },
    ),
    // Iconic MP5 Front Sight Tower & Circular Protective Hood (aligned to sightY = 0.042)
    Mt(0.018, 0.034, 0.022, 0.0015, 0, 0.016, 0.352, colSteelMid, { wear: 0.85 }),
    // Circular front sight hood (left/right/top arch around sightY = 0.042)
    Mt(0.0032, 0.018, 0.016, 0.0008, -0.0088, 0.042, 0.352, colSteelDark, { wear: 0.9 }),
    Mt(0.0032, 0.018, 0.016, 0.0008, 0.0088, 0.042, 0.352, colSteelDark, { wear: 0.9 }),
    Mt(0.018, 0.0032, 0.016, 0.0008, 0, 0.0505, 0.352, colSteelDark, { wear: 0.9 }),
    // Front sight post inside hood
    Mt(0.0022, 0.014, 0.0024, 0.0004, 0, 0.0365, 0.352, colSteelDark, { wear: 0.6 }),
    // Iconic HK Rotary Diopter Drum Rear Sight (at z_fwd = -0.072)
    Mt(0.024, 0.012, 0.028, 0.0012, 0, 0.028, -0.072, colSteelMid, { wear: 0.8 }),
    // Drum left & right aperture walls leaving sight notch at y = 0.042
    Mt(0.0072, 0.014, 0.018, 0.001, -0.0055, 0.04, -0.072, colSteelDark, { wear: 0.9 }),
    Mt(0.0072, 0.014, 0.018, 0.001, 0.0055, 0.04, -0.072, colSteelDark, { wear: 0.9 }),
    Mt(0.018, 0.006, 0.018, 0.0008, 0, 0.0355, -0.072, colSteelDark, { wear: 0.85 }),
    // Curved steel trigger (for ID triggerAt)
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
      { wear: 0.65 },
    ),
    // Ambidextrous Navy SEF Fire Selector Lever + red fire indicator
    Mt(0.036, 0.007, 0.022, 0.001, 0, -0.022, -0.035, colSteelMid, { wear: 0.8 }),
    m0(0.003, 0.035, 0, -0.012, 0.115, colSteelMid, 8),
    m0(0.003, 0.034, 0, -0.016, -0.088, colSteelMid, 8),
  );

  // Sight alignment tritium dots & red selector marking
  plain.push(
    Mt(0.0018, 0.0028, 0.0015, 0.0004, 0, 0.0415, 0.351, colSightDot, { wear: 0 }),
    Mt(0.002, 0.0024, 0.0015, 0.0004, -0.0046, 0.041, -0.08, colSightDot, { wear: 0 }),
    Mt(0.002, 0.0024, 0.0015, 0.0004, 0.0046, 0.041, -0.08, colSightDot, { wear: 0 }),
    Mt(0.035, 0.003, 0.003, 0.0005, 0, -0.016, -0.028, colRed, { wear: 0 }),
  );

  // 3. Bolt Carrier & HK Cocking Handle (bolt group)
  bolt.push(
    // Ejection port bolt carrier
    Mt(0.01, 0.013, 0.062, 0.001, 0.012, 0.005, 0.048, colBolt, { wear: 0.35 }),
    // Left-side charging knob for left-hand rack animation (at handlePos = [-0.024, 0.006, -0.072])
    h0(
      [
        [0, 0],
        [0.0048, 0.001],
        [0.0058, 0.016],
        [0.0042, 0.0185],
        [0, 0.0185],
      ],
      10,
      colBolt,
      { wear: 0.6 },
    )
      .rotateY(Math.PI / 2)
      .translate(-0.015, 0.006, -0.072),
  );

  // 4. Polymer Furniture: Wide Tropical Handguard, Ergonomic Pistol Grip & A3 Buttpad
  const lhgRings: number[][][] = [];
  const lhgSteps = [
    { z: 0.155, hw: 0.019, yTop: 0.006, yBot: -0.028 },
    { z: 0.205, hw: 0.0225, yTop: 0.007, yBot: -0.032 },
    { z: 0.265, hw: 0.0215, yTop: 0.007, yBot: -0.03 },
    { z: 0.325, hw: 0.0175, yTop: 0.005, yBot: -0.022 },
  ];
  for (const s of lhgSteps) {
    lhgRings.push(kn($a(s.hw, s.yBot, s.yTop, 0.005, 0.01, 3), s.z));
  }
  poly.push(
    Eu(lhgRings, colPoly, { wear: 0.5 }),
    // MP5A3 curved rubberized buttpad at rear of collapsible rails (z_fwd = -0.31)
    Q0(
      b0(
        [
          [-0.295, 0.014],
          [-0.295, -0.035],
          [-0.312, -0.095],
          [-0.328, -0.092],
          [-0.325, 0.012],
        ],
        0.003,
      ),
      -0.016,
      0.016,
      0.002,
      colPoly,
      { wear: 0.6 },
    ),
  );

  // Contoured HK Navy Polymer Pistol Grip (around MP5_CONFIG.grip = [0, -0.095, 0.074])
  const gripRings: number[][][] = [];
  const gripBase = $a(0.0145, -0.019, 0.019, 0.007, 0.007, 3);
  for (let i = 0; i <= 4; i++) {
    const t = i / 4;
    const y = -0.028 - t * 0.098;
    const zCenter = 0.036 + t * 0.042;
    const sx = 1 + 0.08 * Math.sin(t * Math.PI);
    const syScale = 1 + 0.08 * t;
    gripRings.push(gripBase.map(([gx, gy]) => [gx * sx, y, zCenter - gy * syScale]));
  }
  poly.push(Eu(gripRings, colPoly, { wear: 0.5 }));

  // 5. Curved 30-Round 9×19mm MP5 Steel Magazine (relative to MP5_CONFIG.magPos)
  const magRings: number[][][] = [];
  const magProfile = $a(0.0105, -0.022, 0.022, 0.0035, 0.0035, 2);
  const segs = 10;
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const angle = t * 0.34; // Authentic 9mm MP5 gentle forward curve
    const radius = 0.48;
    const y = -radius * Math.sin(angle);
    const zOffset = -radius * (1 - Math.cos(angle));
    magRings.push(
      magProfile.map(([mx, my]) => [
        mx,
        y - my * Math.sin(angle),
        zOffset - my * Math.cos(angle),
      ]),
    );
  }
  mag.push(
    Eu(magRings, colMagSteel, { wear: 0.8 }),
    Mt(0.023, 0.009, 0.048, 0.0012, 0, -0.162, 0.028, colSteelDark, { wear: 0.9 }, [0.34, 0, 0]),
  );

  // 9×19mm Parabellum brass cartridge at top of magazine
  round.push(
    h0(
      [
        [0, -0.014],
        [0.0048, -0.014],
        [0.0049, -0.012],
        [0.0047, 0.006],
        [0.0044, 0.012],
        [0.0022, 0.018],
        [0, 0.019],
      ],
      12,
      colBrass,
      { wear: 0, ox: 0.001, oy: 0.003 },
    ),
  );

  const parts = {
    ano: Fs(ano),
    gun: Fs(gun),
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
      off: key === 'mag' || key === 'round' ? MP5_CONFIG.magPos : null,
    })),
    occ,
  );

  for (const g of Object.values(parts)) g.computeBoundingSphere();
  return parts;
}
