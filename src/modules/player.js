// @ts-nocheck
import * as THREE from 'three';
import { Hn, Is, Kn, j0, ou, u0, zi } from './core.js';

var Nt = {
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
    standHeight: zi.height,
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
  },
  Pz = Math.sqrt(2 * Nt.gravity * Nt.jumpApex);

function xE(n) {
  let e = n.camera,
    t = () => (n.render && n.render.post) || i,
    i = {},
    s = zi.eye,
    o = Nt.standHeight,
    r = 0,
    a = 0,
    l = !0,
    c = 0,
    u = 0,
    f = 0,
    h = 0,
    p = 0,
    d = 0,
    m = 0,
    x = { x: 0, v: 0 },
    v = 0,
    y = 0,
    b = 0,
    g = 0,
    E = 0,
    M = 0,
    _ = 0,
    T = 99,
    w = 0,
    S = 0,
    R = 0,
    z = zi.fov,
    I = 0,
    L = 'concrete',
    U = new THREE.Vector3(),
    k = new THREE.Euler(0, 0, 0, 'YXZ'),
    C = new THREE.Vector3(),
    A = {
      pos: new THREE.Vector3(),
      eye: new THREE.Vector3(),
      vel: new THREE.Vector3(),
      forward: new THREE.Vector3(0, 0, -1),
      yaw: 0,
      pitch: 0,
      health: 100,
      maxHealth: 100,
      alive: !0,
      onGround: !0,
      sprinting: !1,
      crouching: !1,
      ads: 0,
      speed: 0,
      enabled: !0,
      invulnerable: !1,
      baseFov: zi.fov,
      hurtPulse: 0,
      lookScale: 1,
      lastSafe: C,
      tuning: Nt,
      reset(J) {
        let G = J || (n.level && n.level.playerStart) || { pos: new THREE.Vector3(), yaw: 0 };
        (A.pos.copy(G.pos),
          (A.yaw = G.yaw || 0),
          (A.pitch = 0),
          A.vel.set(0, 0, 0),
          (A.health = A.maxHealth),
          (A.alive = !0),
          (A.onGround = !0),
          (A.sprinting = !1),
          (A.crouching = !1),
          (A.invulnerable = !1),
          (A.speed = 0),
          (s = zi.eye),
          (o = Nt.standHeight),
          (r = 0),
          (a = 0),
          (l = !0),
          (c = 0),
          (u = 0),
          (f = 0),
          (h = 0),
          (p = d = 0),
          (m = 0),
          (x.x = x.v = 0),
          (v = y = b = g = 0),
          (E = 0),
          (M = 0),
          (T = 99),
          (w = 0),
          (S = 0),
          (R = 0),
          (A.hurtPulse = 0),
          C.copy(A.pos));
        let te = t();
        ((te.damage = 0), (te.lowHealth = 0), (te.ads = 0), Q(0));
      },
      damage(J, G) {
        !A.alive ||
          A.invulnerable ||
          !(J > 0) ||
          ((A.health = Math.max(0, A.health - J)),
          (T = 0),
          (w = Math.min(1, w + 0.35 + J / 40)),
          A.addShake(0.22 + J / 70),
          n.events.emit('player:hit', { amount: J, fromPos: G }),
          A.health <= 0 && ((A.alive = !1), (R = 0), (A.sprinting = !1), n.events.emit('player:dead', {})));
      },
      heal(J) {
        A.alive && (A.health = Math.min(A.maxHealth, A.health + J));
      },
      addRecoil(J = 0, G = 0) {
        let te = Nt.recoilKeep;
        ((A.pitch = Hn(A.pitch + J * te, -Nt.pitchLimit, Nt.pitchLimit)),
          (A.yaw += G * te),
          (v += J * (1 - te)),
          (y += G * (1 - te)),
          (v = Hn(v, -0.3, 0.3)),
          (y = Hn(y, -0.2, 0.2)),
          (E = Nt.recoilHold));
      },
      addShake(J = 0.3) {
        M = Math.min(1, M + J);
      },
      setFov(J) {
        A.baseFov = Hn(+J || zi.fov, 55, 100);
      },
      update: N,
    };
  n.events.on('explosion', (J) => {
    if (!J || !J.pos) return;
    let G = A.eye.distanceTo(J.pos),
      te = J.size || 1,
      oe = Is(1 - G / (14 + te * 10)) * (0.35 + 0.35 * te);
    oe > 0.01 && A.addShake(oe);
  });
  function F() {
    let J = n.physics && n.physics.boxes;
    if (!J) return !0;
    let G = zi.radius * 0.9,
      te = A.pos.y + Nt.crouchHeight - 0.05,
      oe = A.pos.y + Nt.standHeight;
    for (let ee = 0; ee < J.length; ee++) {
      let le = J[ee];
      if (
        !le.bulletOnly &&
        !(
          A.pos.x + G < le.min.x ||
          A.pos.x - G > le.max.x ||
          A.pos.z + G < le.min.z ||
          A.pos.z - G > le.max.z
        ) &&
        le.min.y < oe &&
        le.max.y > te
      )
        return !1;
    }
    return !0;
  }
  function H() {
    let J = A.pos.x,
      G = A.pos.z;
    try {
      if (n.ground && n.ground.isPuddle && A.pos.y < 0.05 && n.ground.isPuddle(J, G)) return 'water';
    } catch {}
    if (L && L !== 'concrete') return L;
    try {
      return (n.level && n.level.groundSurfaceAt && n.level.groundSurfaceAt(J, G)) || L || 'concrete';
    } catch {
      return L || 'concrete';
    }
  }
  function N(J) {
    let G = n.input,
      te = n.weapon || {};
    if (
      (te.stub || typeof te.ads != 'number'
        ? ((I = j0(I, A.enabled && G.ads ? 1 : 0, 14, J)), (A.ads = I))
        : (A.ads = Is(te.ads)),
      !A.alive)
    ) {
      ((R += J), Z(J), Q(J), W(J));
      return;
    }
    let oe = A.enabled;
    ((A.lookScale = u0(1, Nt.adsLook, A.ads)),
      oe &&
        ((A.yaw -= G.look.dx * A.lookScale),
        (A.pitch = Hn(A.pitch - G.look.dy * A.lookScale, -Nt.pitchLimit, Nt.pitchLimit)),
        (A.yaw > Math.PI * 4 || A.yaw < -Math.PI * 4) && (A.yaw = A.yaw % (Math.PI * 2))),
      oe && G.crouch ? (A.crouching = !0) : A.crouching && F() && (A.crouching = !1),
      (o = A.crouching ? Nt.crouchHeight : Nt.standHeight));
    let le = oe ? G.move.x : 0,
      xe = oe ? G.move.y : 0,
      j = le * le + xe * xe > 0.01,
      O = oe && G.sprint && xe > 0.55 && Math.abs(le) < 0.6 && !A.crouching && A.ads < 0.35 && !G.fire;
    A.sprinting = (O && A.onGround && A.speed > Nt.walk * 0.6) || (O && !A.onGround && A.sprinting);
    let q = Nt.walk;
    (A.crouching ? (q = Nt.crouch) : O && (q = Nt.sprint),
      (q = u0(q, Math.min(q, Nt.ads), A.ads)),
      xe < 0 && (q *= u0(1, 0.82, -xe)));
    let ue = Math.sin(A.yaw),
      de = Math.cos(A.yaw);
    U.set(le * de - xe * ue, 0, -le * ue - xe * de).multiplyScalar(q);
    let $ = A.onGround ? (j ? Nt.accelGround : Nt.decelGround) : j ? Nt.accelAir : 0.6,
      se = U.x - A.vel.x,
      fe = U.z - A.vel.z;
    !A.onGround && !j && ((se = -A.vel.x), (fe = -A.vel.z));
    let me = Math.hypot(se, fe),
      ge = $ * J;
    (me <= ge || me < 1e-6
      ? (A.onGround || j) && ((A.vel.x = U.x), (A.vel.z = U.z))
      : ((A.vel.x += (se / me) * ge), (A.vel.z += (fe / me) * ge)),
      (r = A.onGround ? Nt.coyote : Math.max(0, r - J)),
      (a = oe && G.pressed('jump') ? Nt.jumpBuffer : Math.max(0, a - J)),
      a > 0 &&
        r > 0 &&
        (!A.crouching || F()) &&
        ((A.vel.y = Pz),
        (a = 0),
        (r = 0),
        (A.onGround = !1),
        (A.crouching = !1),
        (o = Nt.standHeight),
        n.events.emit('player:jump', { pos: A.pos })),
      (A.vel.y -= Nt.gravity * J * 0.5),
      A.vel.y < -40 && (A.vel.y = -40));
    let ce = A.vel.y,
      P = n.physics.moveCapsule(A.pos, A.vel, J, zi.radius, o, l) || {};
    P.onGround || (A.vel.y -= Nt.gravity * J * 0.5);
    let D = n.physics.bounds;
    if (
      (D &&
        ((A.pos.x = Hn(A.pos.x, D.min.x + 0.4, D.max.x - 0.4)),
        (A.pos.z = Hn(A.pos.z, D.min.z + 0.4, D.max.z - 0.4))),
      (A.onGround = !!P.onGround),
      P.surface && (L = P.surface),
      A.onGround)
    ) {
      if (!l && c > 0.12) {
        let Y = Math.max(0, -ce, u);
        ((x.v -= Math.min(Y * Nt.landDip, 3.2)),
          Y > 7.5 && A.addShake(Math.min(0.5, (Y - 7.5) * 0.06)),
          n.events.emit('player:land', { speed: Y, surface: H(), pos: A.pos }),
          Y > 13 && A.damage((Y - 13) * 7, null),
          (f = 0.35));
      }
      ((c = 0), (u = 0), A.pos.x <= Kn.quayX - 1.2 && A.pos.y > -0.5 && C.copy(A.pos));
    } else ((c += J), (u = Math.max(u, -A.vel.y)));
    ((l = A.onGround),
      A.pos.y < Kn.seaY - 2.2 &&
        (A.pos.copy(C),
        A.vel.set(0, 0, 0),
        (A.onGround = !0),
        (l = !0),
        (M = 0.6),
        (A.yaw += Math.PI),
        A.damage(12, null),
        n.events.emit('player:rescued', {})),
      (A.speed = Math.hypot(A.vel.x, A.vel.z)));
    let B = A.crouching ? Nt.stride.crouch : A.sprinting ? Nt.stride.sprint : Nt.stride.walk;
    if (A.onGround && A.speed > 0.5) {
      let Y = f;
      ((f += (A.speed * J) / B),
        Math.floor(f) > Math.floor(Y) &&
          n.events.emit('player:step', { surface: H(), sprint: A.sprinting, pos: A.pos }));
    } else A.onGround && (f = j0(f, Math.round(f), 8, J));
    let X = A.onGround
      ? Is(A.speed / Nt.walk) *
        (A.sprinting ? Nt.bobSprint : 1) *
        u0(1, Nt.bobAds, A.ads) *
        (A.crouching ? 0.7 : 1)
      : 0;
    ((h = j0(h, X, 9, J)),
      (d = -Math.cos(f * Math.PI * 2) * Nt.bobY * h),
      (p = Math.sin(f * Math.PI) * Nt.bobX * h));
    let re = A.vel.x * de - A.vel.z * ue;
    ((m = j0(m, (-re / Nt.sprint) * Nt.rollStrafe * u0(1, 0.4, A.ads), 8, J)),
      (T += J),
      T > Nt.regenDelay &&
        A.health < A.maxHealth &&
        (A.health = Math.min(A.maxHealth, A.health + Nt.regenRate * J)),
      Q(J),
      W(J));
  }
  function Z(J) {
    ((A.vel.x = j0(A.vel.x, 0, 5, J)), (A.vel.z = j0(A.vel.z, 0, 5, J)), (A.vel.y -= Nt.gravity * J));
    try {
      let G = n.physics.moveCapsule(A.pos, A.vel, J, zi.radius, 0.6, l);
      l = !!(G && G.onGround);
    } catch {}
    (A.pos.y < Kn.seaY - 1 && ((A.pos.y = Kn.seaY - 1), (A.vel.y = 0)),
      (A.speed = 0),
      (A.sprinting = !1),
      (h = j0(h, 0, 10, J)),
      (p *= 0.9),
      (d *= 0.9));
  }
  function Q(J) {
    let G = A.crouching ? zi.crouchEye : zi.eye,
      te = 0,
      oe = 0;
    if (A.alive) J > 0 ? (s = j0(s, G, Nt.eyeRate, J)) : (s = G);
    else {
      let se = ou(0, 0.85, R),
        fe = se * se;
      ((G = u0(zi.eye, 0.22, fe)),
        (s = j0(s, G, 18, J)),
        (te = 1.15 * fe),
        (oe = -0.25 * se + 0.12 * Math.sin(se * Math.PI)));
    }
    if (J > 0) {
      let se = -x.x * 150 - x.v * 17;
      ((x.v += se * J),
        (x.x += x.v * J),
        (x.x = Hn(x.x, -Nt.landDipMax, 0.05)),
        (E -= J),
        E <= 0 && ((v = j0(v, 0, Nt.recoilRecover, J)), (y = j0(y, 0, Nt.recoilRecover, J))),
        (b = j0(b, v, Nt.recoilApply, J)),
        (g = j0(g, y, Nt.recoilApply, J)),
        (M = Math.max(0, M - Nt.shakeDecay * J)),
        (_ += J));
    }
    let ee = Math.sin(A.yaw),
      le = Math.cos(A.yaw);
    A.eye.set(A.pos.x + p * le, A.pos.y + s + d + x.x, A.pos.z - p * ee);
    let xe = Hn(A.pitch + b, -1.55, 1.55),
      j = A.yaw + g;
    (k.set(xe, j, 0, 'YXZ'), A.forward.set(0, 0, -1).applyEuler(k));
    let O = M * M,
      q = _,
      ue = O * Nt.shakePitch * (Math.sin(q * 43.1) + 0.6 * Math.sin(q * 71.7 + 1.3)),
      de = O * Nt.shakeYaw * (Math.sin(q * 37.3 + 2.1) + 0.6 * Math.sin(q * 83.9)),
      $ = O * Nt.shakeRoll * (Math.sin(q * 29.7 + 0.7) + 0.5 * Math.sin(q * 61.3 + 4));
    if (
      (e.position.copy(A.eye),
      e.rotation.set(xe + ue + oe + x.x * 0.12, j + de, m + $ + te + p * 0.35, 'YXZ'),
      !n.params || !n.params.fov)
    ) {
      let se = u0(A.baseFov + (A.sprinting ? Nt.fovSprint : 0), Nt.fovAds, A.ads);
      ((z = J > 0 ? j0(z, se, A.ads > 0.02 && A.ads < 0.98 ? 30 : 7, J) : se),
        Math.abs(e.fov - z) > 0.01 && ((e.fov = z), e.updateProjectionMatrix()));
    }
  }
  function W(J) {
    ((w = Math.max(0, w - J * 1.9)), (A.hurtPulse = w));
    let G = A.alive ? ou(0.55, 0.12, A.health / A.maxHealth) : 1;
    S = j0(S, G, 4, J);
    let te = t();
    ((te.damage = w), (te.lowHealth = S), (te.ads = A.ads));
  }
  return A;
}

export { xE };
