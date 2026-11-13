import * as THREE from 'three';

export interface ExplosivePreset {
  hp: number;
  fuse: number;
  size: number;
  radius: number;
  damage: number;
  chain: number;
}

export const EXPLOSIVE_PRESETS: Record<'barrel' | 'gas_cylinders', ExplosivePreset> = {
  barrel: { hp: 50, fuse: 1.6, size: 1.9, radius: 6.5, damage: 170, chain: 5.2 },
  gas_cylinders: { hp: 70, fuse: 1.1, size: 2.3, radius: 7.5, damage: 210, chain: 6 },
};

/** Default XZ coordinates for explosive props in the port terminal level. */
export const EXPLOSIVE_SPAWNS: Array<[number, number]> = [
  [-12, 6.5],
  [-5, 1.5],
  [9, 7],
  [13, 13],
  [-14, 13],
  [1, 20],
  [11, 21],
  [-20, 19],
  [19, 9],
  [21, -6],
  [24, 11],
  [-21, -5],
  [0, -14.5],
  [-11, -21],
  [9, -24.5],
];

export const ExplosiveVec3 = THREE.Vector3;

