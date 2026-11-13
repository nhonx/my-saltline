import * as THREE from 'three';
import { clamp, damp, lerp, saturate, smoothstep } from '../../engine/core/math';
import type { EventBus } from '../../engine/core/events';
import type { PhysicsWorld } from '../../engine/physics/world';
import { PLAYER_DIMS, WORLD_BOUNDS } from '../config/world';

export const PLAYER_TUNING = {
  walk: 3.8,
  sprint: 6.4,
  crouch: 1.9,
  ads: 2.4,
  accelGround: 34,
  decelGround: 26,
  accelAir: 9,
  gravity: 21,
  jumpApex: 1,
  coyote: 0.12,
  jumpBuffer: 0.13,
  standHeight: PLAYER_DIMS.height,
  crouchHeight: 1.15,
  eyeRate: 11,
  stride: { walk: 1.55, sprint: 2.1, crouch: 1.05 },
  bobY: 0.024,
  bobX: 0.013,
  bobSprint: 1.9,
  bobAds: 0.22,
  rollStrafe: 0.02,
  landDip: 0.36,
  landDipMax: 0.2,
  fovSprint: 6,
  fovAds: 52,
  adsLook: 0.6,
  regenDelay: 4,
  regenRate: 25,
  recoilKeep: 0.35,
  recoilApply: 34,
  recoilRecover: 6.5,
  recoilHold: 0.09,
  shakeDecay: 1.7,
  shakePitch: 0.03,
  shakeYaw: 0.03,
  shakeRoll: 0.045,
  pitchLimit: 1.5,
};

const JUMP_VEL = Math.sqrt(2 * PLAYER_TUNING.gravity * PLAYER_TUNING.jumpApex);

export interface PlayerController {
  pos: THREE.Vector3;
  eye: THREE.Vector3;
  vel: THREE.Vector3;
  forward: THREE.Vector3;
  yaw: number;
  pitch: number;
  health: number;
  maxHealth: number;
  alive: boolean;
  onGround: boolean;
  sprinting: boolean;
  crouching: boolean;
  ads: number;
  speed: number;
  enabled: boolean;
  invulnerable: boolean;
  baseFov: number;
  hurtPulse: number;
  lookScale: number;
  lastSafe: THREE.Vector3;
  tuning: typeof PLAYER_TUNING;
  reset(spawn?: { pos: THREE.Vector3; yaw?: number }): void;
  damage(amount: number, fromPos: THREE.Vector3 | null): void;
  heal(amount: number): void;
  addRecoil(pitch?: number, yaw?: number): void;
  addShake(amount?: number): void;
  setFov(fov: number): void;
  update(dt: number): void;
}

/** First-person player controller: movement, coyote/buffered jump, crouch, bob, recoil, shake, and health. */
export function createPlayer(ctx: {
  camera: THREE.PerspectiveCamera;
  render?: { post?: Record<string, number> };
  events: EventBus;
  physics: PhysicsWorld;
  input: any;
  weapon?: any;
  level?: { playerStart?: { pos: THREE.Vector3; yaw?: number }; groundSurfaceAt?: (x: number, z: number) => string };
  ground?: { isPuddle?: (x: number, z: number) => boolean };
  params?: Record<string, string>;
}): PlayerController {
  const camera = ctx.camera;
  const fallbackPost: Record<string, number> = {};
  const getPost = () => (ctx.render && ctx.render.post) || fallbackPost;

  let eyeH = PLAYER_DIMS.eye;
  let colHeight = PLAYER_TUNING.standHeight;
  let coyoteT = 0;
  let jumpBufT = 0;
  let wasGround = true;
  let airTime = 0;
  let maxFallVel = 0;
  let stridePhase = 0;
  let bobAmp = 0;
  let bobX = 0;
  let bobY = 0;
  const dip = { x: 0, v: 0 };
  let recoilPitchTarget = 0;
  let recoilYawTarget = 0;
  let recoilPitch = 0;
  let recoilYaw = 0;
  let recoilHoldT = 0;
  let shake = 0;
  let shakeTime = 0;
  let timeSinceHit = 99;
  let hurtPulse = 0;
  let lowHealthBlend = 0;
  let deathTime = 0;
  let curFov = PLAYER_DIMS.fov;
  let adsFallback = 0;
  let curSurface = 'concrete';

  const wishDir = new THREE.Vector3();
  const aimEuler = new THREE.Euler(0, 0, 0, 'YXZ');
  const lastSafe = new THREE.Vector3();

  const player: PlayerController = {
    pos: new THREE.Vector3(),
    eye: new THREE.Vector3(),
    vel: new THREE.Vector3(),
    forward: new THREE.Vector3(0, 0, -1),
    yaw: 0,
    pitch: 0,
    health: 100,
    maxHealth: 100,
    alive: true,
    onGround: true,
    sprinting: false,
    crouching: false,
    ads: 0,
    speed: 0,
    enabled: true,
    invulnerable: false,
    baseFov: PLAYER_DIMS.fov,
    hurtPulse: 0,
    lookScale: 1,
    lastSafe,
    tuning: PLAYER_TUNING,

    reset(spawn) {
      const start = spawn || (ctx.level && ctx.level.playerStart) || { pos: new THREE.Vector3(), yaw: 0 };
      player.pos.copy(start.pos);
      player.yaw = start.yaw || 0;
      player.pitch = 0;
      player.vel.set(0, 0, 0);
      player.health = player.maxHealth;
      player.alive = true;
      player.onGround = true;
      player.sprinting = false;
      player.crouching = false;
      player.invulnerable = false;
      player.speed = 0;
      eyeH = PLAYER_DIMS.eye;
      colHeight = PLAYER_TUNING.standHeight;
      coyoteT = 0;
      jumpBufT = 0;
      wasGround = true;
      airTime = 0;
      maxFallVel = 0;
      stridePhase = 0;
      bobAmp = 0;
      bobX = bobY = 0;
      dip.x = dip.v = 0;
      recoilPitchTarget = recoilYawTarget = recoilPitch = recoilYaw = 0;
      recoilHoldT = 0;
      shake = 0;
      timeSinceHit = 99;
      hurtPulse = 0;
      lowHealthBlend = 0;
      deathTime = 0;
      player.hurtPulse = 0;
      lastSafe.copy(player.pos);

      const post = getPost();
      post.damage = 0;
      post.lowHealth = 0;
      post.ads = 0;
      applyCamera(0);
    },

    damage(amount, fromPos) {
      if (!player.alive || player.invulnerable || !(amount > 0)) return;
      player.health = Math.max(0, player.health - amount);
      timeSinceHit = 0;
      hurtPulse = Math.min(1, hurtPulse + 0.35 + amount / 40);
      player.addShake(0.22 + amount / 70);
      ctx.events.emit('player:hit', { amount, fromPos });
      if (player.health <= 0) {
        player.alive = false;
        deathTime = 0;
        player.sprinting = false;
        ctx.events.emit('player:dead', {});
      }
    },

    heal(amount) {
      if (player.alive) player.health = Math.min(player.maxHealth, player.health + amount);
    },

    addRecoil(pitch = 0, yaw = 0) {
      const keep = PLAYER_TUNING.recoilKeep;
      player.pitch = clamp(player.pitch + pitch * keep, -PLAYER_TUNING.pitchLimit, PLAYER_TUNING.pitchLimit);
      player.yaw += yaw * keep;
      recoilPitchTarget = clamp(recoilPitchTarget + pitch * (1 - keep), -0.3, 0.3);
      recoilYawTarget = clamp(recoilYawTarget + yaw * (1 - keep), -0.2, 0.2);
      recoilHoldT = PLAYER_TUNING.recoilHold;
    },

    addShake(amount = 0.3) {
      shake = Math.min(1, shake + amount);
    },

    setFov(fov) {
      player.baseFov = clamp(+fov || PLAYER_DIMS.fov, 55, 100);
    },

    update,
  };

  ctx.events.on('explosion', (ev: { pos?: THREE.Vector3; size?: number }) => {
    if (!ev || !ev.pos) return;
    const dist = player.eye.distanceTo(ev.pos);
    const size = ev.size || 1;
    const amt = saturate(1 - dist / (14 + size * 10)) * (0.35 + 0.35 * size);
    if (amt > 0.01) player.addShake(amt);
  });

  function canStand(): boolean {
    const boxes = ctx.physics && ctx.physics.boxes;
    if (!boxes) return true;
    const r = PLAYER_DIMS.radius * 0.9;
    const minY = player.pos.y + PLAYER_TUNING.crouchHeight - 0.05;
    const maxY = player.pos.y + PLAYER_TUNING.standHeight;
    for (let i = 0; i < boxes.length; i++) {
      const b = boxes[i];
      if (
        !b.bulletOnly &&
        !(player.pos.x + r < b.min.x || player.pos.x - r > b.max.x || player.pos.z + r < b.min.z || player.pos.z - r > b.max.z) &&
        b.min.y < maxY &&
        b.max.y > minY
      ) {
        return false;
      }
    }
    return true;
  }

  function currentSurface(): string {
    const x = player.pos.x;
    const z = player.pos.z;
    try {
      if (ctx.ground && ctx.ground.isPuddle && player.pos.y < 0.05 && ctx.ground.isPuddle(x, z)) return 'water';
    } catch {
      // ignore
    }
    if (curSurface && curSurface !== 'concrete') return curSurface;
    try {
      return (ctx.level && ctx.level.groundSurfaceAt && ctx.level.groundSurfaceAt(x, z)) || curSurface || 'concrete';
    } catch {
      return curSurface || 'concrete';
    }
  }

  function update(dt: number) {
    const input = ctx.input;
    const weapon = ctx.weapon || {};
    if (weapon.stub || typeof weapon.ads !== 'number') {
      adsFallback = damp(adsFallback, player.enabled && input.ads ? 1 : 0, 14, dt);
      player.ads = adsFallback;
    } else {
      player.ads = saturate(weapon.ads);
    }

    if (!player.alive) {
      deathTime += dt;
      updateDead(dt);
      applyCamera(dt);
      updatePost(dt);
      return;
    }

    const active = player.enabled;
    player.lookScale = lerp(1, PLAYER_TUNING.adsLook, player.ads);
    if (active) {
      player.yaw -= input.look.dx * player.lookScale;
      player.pitch = clamp(player.pitch - input.look.dy * player.lookScale, -PLAYER_TUNING.pitchLimit, PLAYER_TUNING.pitchLimit);
      if (player.yaw > Math.PI * 4 || player.yaw < -Math.PI * 4) {
        player.yaw = player.yaw % (Math.PI * 2);
      }
    }

    if (active && input.crouch) player.crouching = true;
    else if (player.crouching && canStand()) player.crouching = false;
    colHeight = player.crouching ? PLAYER_TUNING.crouchHeight : PLAYER_TUNING.standHeight;

    const mx = active ? input.move.x : 0;
    const my = active ? input.move.y : 0;
    const moving = mx * mx + my * my > 0.01;
    const wantSprint = active && input.sprint && my > 0.55 && Math.abs(mx) < 0.6 && !player.crouching && player.ads < 0.35 && !input.fire;
    player.sprinting = (wantSprint && player.onGround && player.speed > PLAYER_TUNING.walk * 0.6) || (wantSprint && !player.onGround && player.sprinting);

    let maxSpeed = PLAYER_TUNING.walk;
    if (player.crouching) maxSpeed = PLAYER_TUNING.crouch;
    else if (wantSprint) maxSpeed = PLAYER_TUNING.sprint;
    maxSpeed = lerp(maxSpeed, Math.min(maxSpeed, PLAYER_TUNING.ads), player.ads);
    if (my < 0) maxSpeed *= lerp(1, 0.82, -my);

    const sinY = Math.sin(player.yaw);
    const cosY = Math.cos(player.yaw);
    wishDir.set(mx * cosY - my * sinY, 0, -mx * sinY - my * cosY).multiplyScalar(maxSpeed);

    const accel = player.onGround ? (moving ? PLAYER_TUNING.accelGround : PLAYER_TUNING.decelGround) : moving ? PLAYER_TUNING.accelAir : 0.6;
    let dvx = wishDir.x - player.vel.x;
    let dvz = wishDir.z - player.vel.z;
    if (!player.onGround && !moving) {
      dvx = -player.vel.x;
      dvz = -player.vel.z;
    }
    const dvLen = Math.hypot(dvx, dvz);
    const maxDv = accel * dt;
    if (dvLen <= maxDv || dvLen < 1e-6) {
      if (player.onGround || moving) {
        player.vel.x = wishDir.x;
        player.vel.z = wishDir.z;
      }
    } else {
      player.vel.x += (dvx / dvLen) * maxDv;
      player.vel.z += (dvz / dvLen) * maxDv;
    }

    coyoteT = player.onGround ? PLAYER_TUNING.coyote : Math.max(0, coyoteT - dt);
    jumpBufT = active && input.pressed('jump') ? PLAYER_TUNING.jumpBuffer : Math.max(0, jumpBufT - dt);
    if (jumpBufT > 0 && coyoteT > 0 && (!player.crouching || canStand())) {
      player.vel.y = JUMP_VEL;
      jumpBufT = 0;
      coyoteT = 0;
      player.onGround = false;
      player.crouching = false;
      colHeight = PLAYER_TUNING.standHeight;
      ctx.events.emit('player:jump', { pos: player.pos });
    }

    player.vel.y = Math.max(-40, player.vel.y - PLAYER_TUNING.gravity * dt * 0.5);
    const preVy = player.vel.y;
    const hit = ctx.physics.moveCapsule(player.pos, player.vel, dt, PLAYER_DIMS.radius, colHeight, wasGround);
    if (!hit.onGround) player.vel.y -= PLAYER_TUNING.gravity * dt * 0.5;

    const bounds = ctx.physics.bounds;
    if (bounds) {
      player.pos.x = clamp(player.pos.x, bounds.min.x + 0.4, bounds.max.x - 0.4);
      player.pos.z = clamp(player.pos.z, bounds.min.z + 0.4, bounds.max.z - 0.4);
    }

    player.onGround = !!hit.onGround;
    if (hit.surface) curSurface = hit.surface;

    if (player.onGround) {
      if (!wasGround && airTime > 0.12) {
        const impactSpeed = Math.max(0, -preVy, maxFallVel);
        dip.v -= Math.min(impactSpeed * PLAYER_TUNING.landDip, 3.2);
        if (impactSpeed > 7.5) player.addShake(Math.min(0.5, (impactSpeed - 7.5) * 0.06));
        ctx.events.emit('player:land', { speed: impactSpeed, surface: currentSurface(), pos: player.pos });
        if (impactSpeed > 13) player.damage((impactSpeed - 13) * 7, null);
        stridePhase = 0.35;
      }
      airTime = 0;
      maxFallVel = 0;
      if (player.pos.x <= WORLD_BOUNDS.quayX - 1.2 && player.pos.y > -0.5) lastSafe.copy(player.pos);
    } else {
      airTime += dt;
      maxFallVel = Math.max(maxFallVel, -player.vel.y);
    }
    wasGround = player.onGround;

    if (player.pos.y < WORLD_BOUNDS.seaY - 2.2) {
      player.pos.copy(lastSafe);
      player.vel.set(0, 0, 0);
      player.onGround = true;
      wasGround = true;
      shake = 0.6;
      player.yaw += Math.PI;
      player.damage(12, null);
      ctx.events.emit('player:rescued', {});
    }

    player.speed = Math.hypot(player.vel.x, player.vel.z);
    const strideLen = player.crouching
      ? PLAYER_TUNING.stride.crouch
      : player.sprinting
        ? PLAYER_TUNING.stride.sprint
        : PLAYER_TUNING.stride.walk;
    if (player.onGround && player.speed > 0.5) {
      const prevPhase = stridePhase;
      stridePhase += (player.speed * dt) / strideLen;
      if (Math.floor(stridePhase) > Math.floor(prevPhase)) {
        ctx.events.emit('player:step', { surface: currentSurface(), sprint: player.sprinting, pos: player.pos });
      }
    } else if (player.onGround) {
      stridePhase = damp(stridePhase, Math.round(stridePhase), 8, dt);
    }

    const targetBob = player.onGround
      ? saturate(player.speed / PLAYER_TUNING.walk) *
        (player.sprinting ? PLAYER_TUNING.bobSprint : 1) *
        lerp(1, PLAYER_TUNING.bobAds, player.ads) *
        (player.crouching ? 0.7 : 1)
      : 0;
    bobAmp = damp(bobAmp, targetBob, 9, dt);
    bobY = -Math.cos(stridePhase * Math.PI * 2) * PLAYER_TUNING.bobY * bobAmp;
    bobX = Math.sin(stridePhase * Math.PI) * PLAYER_TUNING.bobX * bobAmp;

    const strafeVel = player.vel.x * cosY - player.vel.z * sinY;
    // Note: roll variable was `m` in original
    rollTarget = damp(rollTarget, (-strafeVel / PLAYER_TUNING.sprint) * PLAYER_TUNING.rollStrafe * lerp(1, 0.4, player.ads), 8, dt);

    timeSinceHit += dt;
    if (timeSinceHit > PLAYER_TUNING.regenDelay && player.health < player.maxHealth) {
      player.health = Math.min(player.maxHealth, player.health + PLAYER_TUNING.regenRate * dt);
    }

    applyCamera(dt);
    updatePost(dt);
  }

  let rollTarget = 0;

  function updateDead(dt: number) {
    player.vel.x = damp(player.vel.x, 0, 5, dt);
    player.vel.z = damp(player.vel.z, 0, 5, dt);
    player.vel.y -= PLAYER_TUNING.gravity * dt;
    try {
      const hit = ctx.physics.moveCapsule(player.pos, player.vel, dt, PLAYER_DIMS.radius, 0.6, wasGround);
      wasGround = !!(hit && hit.onGround);
    } catch {
      // ignore
    }
    if (player.pos.y < WORLD_BOUNDS.seaY - 1) {
      player.pos.y = WORLD_BOUNDS.seaY - 1;
      player.vel.y = 0;
    }
    player.speed = 0;
    player.sprinting = false;
    bobAmp = damp(bobAmp, 0, 10, dt);
    bobX *= 0.9;
    bobY *= 0.9;
  }

  function applyCamera(dt: number) {
    let targetEye = player.crouching ? PLAYER_DIMS.crouchEye : PLAYER_DIMS.eye;
    let deathRoll = 0;
    let deathPitch = 0;
    if (player.alive) {
      eyeH = dt > 0 ? damp(eyeH, targetEye, PLAYER_TUNING.eyeRate, dt) : targetEye;
    } else {
      const t = smoothstep(0, 0.85, deathTime);
      const t2 = t * t;
      targetEye = lerp(PLAYER_DIMS.eye, 0.22, t2);
      eyeH = damp(eyeH, targetEye, 18, dt);
      deathRoll = 1.15 * t2;
      deathPitch = -0.25 * t + 0.12 * Math.sin(t * Math.PI);
    }

    if (dt > 0) {
      const dipAcc = -dip.x * 150 - dip.v * 17;
      dip.v += dipAcc * dt;
      dip.x = clamp(dip.x + dip.v * dt, -PLAYER_TUNING.landDipMax, 0.05);
      recoilHoldT -= dt;
      if (recoilHoldT <= 0) {
        recoilPitchTarget = damp(recoilPitchTarget, 0, PLAYER_TUNING.recoilRecover, dt);
        recoilYawTarget = damp(recoilYawTarget, 0, PLAYER_TUNING.recoilRecover, dt);
      }
      recoilPitch = damp(recoilPitch, recoilPitchTarget, PLAYER_TUNING.recoilApply, dt);
      recoilYaw = damp(recoilYaw, recoilYawTarget, PLAYER_TUNING.recoilApply, dt);
      shake = Math.max(0, shake - PLAYER_TUNING.shakeDecay * dt);
      shakeTime += dt;
    }

    const sinY = Math.sin(player.yaw);
    const cosY = Math.cos(player.yaw);
    player.eye.set(player.pos.x + bobX * cosY, player.pos.y + eyeH + bobY + dip.x, player.pos.z - bobX * sinY);

    const effPitch = clamp(player.pitch + recoilPitch, -1.55, 1.55);
    const effYaw = player.yaw + recoilYaw;
    aimEuler.set(effPitch, effYaw, 0, 'YXZ');
    player.forward.set(0, 0, -1).applyEuler(aimEuler);

    const s2 = shake * shake;
    const st = shakeTime;
    const shakeP = s2 * PLAYER_TUNING.shakePitch * (Math.sin(st * 43.1) + 0.6 * Math.sin(st * 71.7 + 1.3));
    const shakeY = s2 * PLAYER_TUNING.shakeYaw * (Math.sin(st * 37.3 + 2.1) + 0.6 * Math.sin(st * 83.9));
    const shakeR = s2 * PLAYER_TUNING.shakeRoll * (Math.sin(st * 29.7 + 0.7) + 0.5 * Math.sin(st * 61.3 + 4));

    camera.position.copy(player.eye);
    camera.rotation.set(effPitch + shakeP + deathPitch + dip.x * 0.12, effYaw + shakeY, rollTarget + shakeR + deathRoll + bobX * 0.35, 'YXZ');

    if (!ctx.params || !ctx.params.fov) {
      const targetFov = lerp(player.baseFov + (player.sprinting ? PLAYER_TUNING.fovSprint : 0), PLAYER_TUNING.fovAds, player.ads);
      curFov = dt > 0 ? damp(curFov, targetFov, player.ads > 0.02 && player.ads < 0.98 ? 30 : 7, dt) : targetFov;
      if (Math.abs(camera.fov - curFov) > 0.01) {
        camera.fov = curFov;
        camera.updateProjectionMatrix();
      }
    }
  }

  function updatePost(dt: number) {
    hurtPulse = Math.max(0, hurtPulse - dt * 1.9);
    player.hurtPulse = hurtPulse;
    const targetLow = player.alive ? smoothstep(0.55, 0.12, player.health / player.maxHealth) : 1;
    lowHealthBlend = damp(lowHealthBlend, targetLow, 4, dt);
    const post = getPost();
    post.damage = hurtPulse;
    post.lowHealth = lowHealthBlend;
    post.ads = player.ads;
  }

  return player;
}

