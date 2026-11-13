import * as THREE from 'three';

export const WORLD_BOUNDS = {
  min: new THREE.Vector3(-40, 0, -30),
  max: new THREE.Vector3(40, 30, 30),
  groundY: 0,
  seaY: -1.6,
  quayX: 30,
};

export const SUN_CONFIG = {
  dir: new THREE.Vector3(0.916, 0.225, 0.331).normalize(),
  color: new THREE.Color(1, 0.72, 0.42),
  intensity: 9,
};

export const SKY_COLORS = {
  zenith: new THREE.Color(0.055, 0.085, 0.13),
  horizon: new THREE.Color(0.95, 0.55, 0.28),
  horizonAway: new THREE.Color(0.16, 0.22, 0.3),
  fog: new THREE.Color(0.42, 0.47, 0.52),
};

export const PLAYER_DIMS = {
  eye: 1.68,
  crouchEye: 1.05,
  radius: 0.32,
  height: 1.8,
  fov: 74,
  viewFov: 54,
};

export const LAYER_WORLD = 0;
export const LAYER_VIEWMODEL = 1;

