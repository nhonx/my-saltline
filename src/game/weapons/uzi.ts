import * as THREE from 'three';
import type { WeaponGeoHelpers } from './ak47';
import { WEAPONS_CONFIG } from '../../config.js';

export const UZI_CONFIG = {
  name: WEAPONS_CONFIG.uzi.name,
  muzzle: [0, 0.003, -0.365] as [number, number, number],
  eject: [0.02, 0.01, -0.02] as [number, number, number],
  sightY: 0.04,
  lensF: 0.025,
  window: null as number[][] | null,
  magPos: [0, -0.024, -0.088] as [number, number, number],
  boltTravel: 0.058,
  railTop: 0.028,
  grip: [0, -0.095, 0.074] as [number, number, number],
  handguard: [0, -0.006, -0.215] as [number, number, number],
  handguardR: 0.021,
  handlePos: [-0.024, 0.006, -0.072] as [number, number, number],
  squeeze: 0.88,
};

export const UZI_DEF = WEAPONS_CONFIG.uzi;

/**
 * Builds the procedural IMI Uzi (9×19mm) submachine gun viewmodel geometry parts.
 * Coordinates: -Z is forward toward muzzle, +Y is up, +X is right.
 */
export function buildUziGeometry(geo: WeaponGeoHelpers) {
  const { Mt, Q0, h0, m0, Eu, $a, kn, b0, Fs, sy, Zl } = geo;

  const colParkerized = [0.82, 0.85, 0.84];
  const colSteelMid = [1.0, 1.02, 1.04];
  const colBolt = [1.2, 1.22, 1.24];
  const colPoly = [0.68, 0.7, 0.68];
  const colMagSteel = [0.8, 0.82, 0.84];
  const colSightDot = [0.95, 0.99, 0.95];
  const colBrass = [1.0, 0.92, 0.78];

  const ano: THREE.BufferGeometry[] = [];
  const gun: THREE.BufferGeometry[] = [];
  const poly: THREE.BufferGeometry[] = [];
  const plain: THREE.BufferGeometry[] = [];
  const bolt: THREE.BufferGeometry[] = [];
  const mag: THREE.BufferGeometry[] = [];
  const round: THREE.BufferGeometry[] = [];

  // 1. Iconic Boxy Stamped-Steel IMI Uzi Receiver & Horizontal Reinforcing Ribs
  ano.push(
    // Main rectangular stamped Uzi receiver body (z_fwd = -0.105 .. +0.275)
    Mt(0.036, 0.044, 0.375, 0.0022, 0, 0.003, 0.085, colParkerized, { wear: 0.95 }),
    // Lower receiver / grip mount block (required by ID receiver bounds)
    Mt(0.032, 0.036, 0.24, 0.0018, 0, -0.011, 0.03, colParkerized, { wear: 0.9 }),
    // Rear trunnion & folding stock hinge block (required by ID tang solver)
    Mt(0.031, 0.024, 0.032, 0.0015, 0, -0.014, -0.1, colParkerized, { wear: 0.85 }),
    // Top flat dust cover with central cocking slot
    Mt(0.034, 0.006, 0.34, 0.0012, 0, 0.026, 0.08, colSteelMid, { wear: 0.9 }),
    // Signature horizontal stamped strengthening ribs along both sides of Uzi receiver
    Mt(0.039, 0.0045, 0.31, 0.001, 0, 0.011, 0.085, colSteelMid, { wear: 1.05 }),
    Mt(0.039, 0.0045, 0.31, 0.001, 0, -0.002, 0.085, colSteelMid, { wear: 1.05 }),
    // Forward magwell / tactical lower mag housing
    Mt(0.034, 0.024, 0.056, 0.0012, 0, -0.024, 0.088, colParkerized, { wear: 0.9 }),
    // Trigger guard loop
    Q0(
      b0(
        [
          [0.018, -0.03],
          [0.017, -0.056],
          [-0.03, -0.056],
          [-0.036, -0.03],
          [-0.03, -0.03],
          [-0.026, -0.051],
          [0.012, -0.051],
          [0.012, -0.03],
        ],
        0.002,
      ),
      -0.0055,
      0.0055,
      0.0008,
      colParkerized,
      { wear: 0.85 },
    ),
    // Folding metal skeletal stock struts extending rearward
    Mt(0.005, 0.014, 0.19, 0.001, -0.013, -0.012, -0.195, colSteelMid, { wear: 0.95 }, [0.08, 0, 0]),
    Mt(0.005, 0.014, 0.19, 0.001, 0.013, -0.012, -0.195, colSteelMid, { wear: 0.95 }, [0.08, 0, 0]),
    Mt(0.032, 0.072, 0.012, 0.0015, 0, -0.038, -0.29, colParkerized, { wear: 1.0 }),
  );

  // 2. Knurled Barrel Nut Collar, Short 9mm Barrel & Protective Sight Ears
  gun.push(
    // Iconic Uzi knurled/ribbed barrel retaining nut at front of receiver (z_fwd = 0.272 .. 0.305)
    h0(
      [
        [0, 0.27],
        [0.0165, 0.27],
        [0.0165, 0.282],
        [0.0148, 0.284],
        [0.0165, 0.288],
        [0.0165, 0.302],
        [0.012, 0.304],
      ],
      16,
      colSteelMid,
      { wear: 0.95, oy: 0.003 },
    ),
    // Short protruding 9mm SMG barrel (z_fwd = 0.302 .. 0.365)
    h0(
      [
        [0.0048, 0.3],
        [0.0088, 0.3],
        [0.0086, 0.364],
        [0.0048, 0.364],
      ],
      14,
      colSteelMid,
      { wear: 0.85, oy: 0.003 },
    ),
    // Uzi Front Sight Post & Heavy Curved Protective Ears (aligned to sightY = 0.04)
    Mt(0.024, 0.012, 0.024, 0.0012, 0, 0.03, 0.252, colParkerized, { wear: 0.9 }),
    Mt(0.0035, 0.016, 0.018, 0.0008, -0.0095, 0.039, 0.252, colSteelMid, { wear: 1.0 }),
    Mt(0.0035, 0.016, 0.018, 0.0008, 0.0095, 0.039, 0.252, colSteelMid, { wear: 1.0 }),
    Mt(0.0022, 0.012, 0.0024, 0.0004, 0, 0.036, 0.252, colParkerized, { wear: 0.7 }),
    // Uzi Rear L-Flip Peep Sight & Protective Ears (at z_fwd = -0.082)
    Mt(0.026, 0.012, 0.026, 0.0012, 0, 0.03, -0.082, colParkerized, { wear: 0.9 }),
    Mt(0.0075, 0.014, 0.016, 0.0008, -0.0056, 0.039, -0.082, colSteelMid, { wear: 1.0 }),
    Mt(0.0075, 0.014, 0.016, 0.0008, 0.0056, 0.039, -0.082, colSteelMid, { wear: 1.0 }),
    Mt(0.018, 0.005, 0.016, 0.0006, 0, 0.0345, -0.082, colSteelMid, { wear: 0.85 }),
    // Curved steel trigger
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
    m0(0.0028, 0.038, 0, -0.014, 0.02, colSteelMid, 8),
  );

  // Sight alignment tritium dots
  plain.push(
    Mt(0.0018, 0.0026, 0.0015, 0.0004, 0, 0.0395, 0.251, colSightDot, { wear: 0 }),
    Mt(0.002, 0.0024, 0.0015, 0.0004, -0.0046, 0.039, -0.089, colSightDot, { wear: 0 }),
    Mt(0.002, 0.0024, 0.0015, 0.0004, 0.0046, 0.039, -0.089, colSightDot, { wear: 0 }),
  );

  // 3. Open-Bolt Telescoping Bolt & Top/Side Charging Knob (bolt group)
  bolt.push(
    // Exposed steel bolt face in right ejection port
    Mt(0.011, 0.015, 0.068, 0.001, 0.014, 0.006, 0.04, colBolt, { wear: 0.4 }),
    // Slotted top Uzi cocking knob
    Mt(0.022, 0.012, 0.022, 0.002, 0, 0.033, 0.065, colBolt, { wear: 0.85 }),
    // Left-side tactical charging knob for left-hand rack animation
    h0(
      [
        [0, 0],
        [0.0046, 0.001],
        [0.0056, 0.016],
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

  // 4. Ribbed Black Polymer Foregrip / Front Handguard & Pistol Grip Panels
  const lhgRings: number[][][] = [];
  const lhgSteps = [
    { z: 0.15, hw: 0.019, yTop: 0.005, yBot: -0.028 },
    { z: 0.195, hw: 0.021, yTop: 0.005, yBot: -0.032 },
    { z: 0.235, hw: 0.0205, yTop: 0.005, yBot: -0.03 },
    { z: 0.27, hw: 0.018, yTop: 0.004, yBot: -0.024 },
  ];
  for (const s of lhgSteps) {
    lhgRings.push(kn($a(s.hw, s.yBot, s.yTop, 0.004, 0.008, 3), s.z));
  }
  poly.push(Eu(lhgRings, colPoly, { wear: 0.6 }));

  // Uzi vertical ribbed pistol grip (around UZI_CONFIG.grip = [0, -0.095, 0.074])
  const gripRings: number[][][] = [];
  const gripBase = $a(0.015, -0.02, 0.02, 0.006, 0.006, 3);
  for (let i = 0; i <= 4; i++) {
    const t = i / 4;
    const y = -0.028 - t * 0.098;
    const zCenter = 0.036 + t * 0.032; // More upright Uzi grip angle
    const sx = 1 + 0.06 * Math.sin(t * Math.PI);
    gripRings.push(gripBase.map(([gx, gy]) => [gx * sx, y, zCenter - gy]));
  }
  poly.push(Eu(gripRings, colPoly, { wear: 0.6 }));

  // 5. Straight 32-Round 9×19mm Uzi Steel Box Magazine
  const magRings: number[][][] = [];
  const magProfile = $a(0.0108, -0.021, 0.021, 0.003, 0.003, 2);
  const segs = 10;
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const angle = t * 0.08; // Nearly straight stick magazine
    const radius = 1.9;
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
    Eu(magRings, colMagSteel, { wear: 0.85 }),
    Mt(0.024, 0.009, 0.046, 0.0012, 0, -0.155, 0.006, colParkerized, { wear: 0.95 }),
  );

  // 9×19mm brass cartridge at top of magazine
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
      off: key === 'mag' || key === 'round' ? UZI_CONFIG.magPos : null,
    })),
    occ,
  );

  for (const g of Object.values(parts)) g.computeBoundingSphere();
  return parts;
}
