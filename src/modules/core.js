// @ts-nocheck
import * as THREE from 'three';

export const ar = (n, e) => {
  for (const t in e) Object.defineProperty(n, t, { get: e[t], enumerable: true });
};

var Kn = {
    min: new THREE.Vector3(-40, 0, -30),
    max: new THREE.Vector3(40, 30, 30),
    groundY: 0,
    seaY: -1.6,
    quayX: 30,
  },
  Z0 = {
    dir: new THREE.Vector3(0.916, 0.225, 0.331).normalize(),
    color: new THREE.Color(1, 0.72, 0.42),
    intensity: 9,
  },
  T0 = {
    zenith: new THREE.Color(0.055, 0.085, 0.13),
    horizon: new THREE.Color(0.95, 0.55, 0.28),
    horizonAway: new THREE.Color(0.16, 0.22, 0.3),
    fog: new THREE.Color(0.42, 0.47, 0.52),
  },
  zi = { eye: 1.68, crouchEye: 1.05, radius: 0.32, height: 1.8, fov: 74, viewFov: 54 },
  Ia = 0,
  Ro = 1,
  jr = {
    test: {
      name: 'test',
      scale: 1,
      msaa: 0,
      shadow: 1024,
      tex: 256,
      volSteps: 10,
      ao: !0,
      planar: 0.5,
      bloom: !0,
      motionBlur: !1,
      rain: 0.4,
    },
    low: {
      name: 'low',
      scale: 0.7,
      msaa: 0,
      shadow: 2048,
      tex: 512,
      volSteps: 12,
      ao: !1,
      planar: 0,
      bloom: !0,
      motionBlur: !1,
      rain: 0.5,
    },
    medium: {
      name: 'medium',
      scale: 0.85,
      msaa: 2,
      shadow: 2048,
      tex: 1024,
      volSteps: 16,
      ao: !0,
      planar: 0.5,
      bloom: !0,
      motionBlur: !1,
      rain: 0.8,
    },
    high: {
      name: 'high',
      scale: 1,
      msaa: 4,
      shadow: 4096,
      tex: 1024,
      volSteps: 24,
      ao: !0,
      planar: 0.5,
      bloom: !0,
      motionBlur: !0,
      rain: 1,
    },
    ultra: {
      name: 'ultra',
      scale: 1,
      msaa: 4,
      shadow: 4096,
      tex: 2048,
      volSteps: 40,
      ao: !0,
      planar: 1,
      bloom: !0,
      motionBlur: !0,
      rain: 1,
    },
  };

function UM(n) {
  if (n && jr[n]) return { ...jr[n] };
  if (
    /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && Math.min(screen.width, screen.height) < 900)
  )
    return { ...jr.low };
  let t = '';
  try {
    let s = document.createElement('canvas'),
      o = s.getContext('webgl2') || s.getContext('webgl');
    if (o) {
      let r = o.getExtension('WEBGL_debug_renderer_info');
      t = String(r ? o.getParameter(r.UNMASKED_RENDERER_WEBGL) : o.getParameter(o.RENDERER));
      let a = o.getExtension('WEBGL_lose_context');
      a && a.loseContext();
    }
  } catch {}
  return {
    ...(/SwiftShader|llvmpipe|Software|Mali|Adreno|PowerVR/i.test(t) || (/Intel/i.test(t) && !/Arc/i.test(t))
      ? jr.medium
      : jr.high),
  };
}

function BM() {
  let n = new Map();
  return {
    on(e, t) {
      return (n.has(e) || n.set(e, []), n.get(e).push(t), () => this.off(e, t));
    },
    off(e, t) {
      let i = n.get(e);
      if (i) {
        let s = i.indexOf(t);
        s >= 0 && i.splice(s, 1);
      }
    },
    emit(e, t) {
      let i = n.get(e);
      if (i)
        for (let s = 0; s < i.length; s++)
          try {
            i[s](t);
          } catch (o) {
            console.error(`[events] handler for "${e}" threw`, o);
          }
    },
  };
}

function su(n = 1337) {
  let e = n >>> 0,
    t = () => {
      ((e |= 0), (e = (e + 1831565813) | 0));
      let i = Math.imul(e ^ (e >>> 15), 1 | e);
      return ((i = (i + Math.imul(i ^ (i >>> 7), 61 | i)) ^ i), ((i ^ (i >>> 14)) >>> 0) / 4294967296);
    };
  return (
    (t.range = (i, s) => i + (s - i) * t()),
    (t.int = (i, s) => Math.floor(i + (s - i + 1) * t())),
    (t.pick = (i) => i[Math.floor(t() * i.length)]),
    (t.sign = () => (t() < 0.5 ? -1 : 1)),
    (t.fork = () => su(Math.floor(t() * 4294967296))),
    t
  );
}

var Hn = (n, e, t) => Math.min(t, Math.max(e, n)),
  u0 = (n, e, t) => n + (e - n) * t,
  Is = (n) => Math.min(1, Math.max(0, n)),
  ou = (n, e, t) => {
    let i = Is((t - n) / (e - n));
    return i * i * (3 - 2 * i);
  },
  j0 = (n, e, t, i) => e + (n - e) * Math.exp(-t * i);

var a0 = () => {},
  Sr = {
    ground: () => ({ stub: !0, update: a0, wetnessAt: () => 0.5, isPuddle: () => !1 }),
    backdrop: () => ({ stub: !0, update: a0 }),
    fx: () => ({
      stub: !0,
      update: a0,
      muzzleFlash: a0,
      tracer: a0,
      impact: a0,
      sparks: a0,
      smoke: a0,
      explosion: a0,
      debris: a0,
      shell: a0,
      decal: a0,
      dust: a0,
      clear: a0,
      splash: a0,
      addEmitter: () => ({ stop: a0, setPos: a0 }),
    }),
    audio: () => {
      let n = { setPos: a0, setGain: a0, setPitch: a0, stop: a0 };
      return {
        stub: !0,
        update: a0,
        resume: a0,
        play: a0,
        loop: () => n,
        setIntensity: a0,
        setInterior: a0,
        setVolume: a0,
        setPaused: a0,
      };
    },
    weapon: () => ({
      stub: !0,
      update: a0,
      reset: a0,
      setVisible: a0,
      ammo: 30,
      magSize: 30,
      reserve: 120,
      state: 'idle',
      name: 'KR-7',
      ads: 0,
      spread: 0.01,
    }),
    enemies: () => ({
      stub: !0,
      list: [],
      update: a0,
      spawn: () => null,
      raycast: () => null,
      aliveCount: () => 0,
      clear: a0,
      alert: a0,
    }),
    hud: () => ({ stub: !0, update: a0, show: a0, setObjective: a0, message: a0, hitmarker: a0 }),
    mats: () => {
      let n = new Map();
      return {
        stub: !0,
        get: (t) => (
          n.has(t) || n.set(t, new THREE.MeshStandardMaterial({ color: 7829367, roughness: 0.7 })),
          n.get(t)
        ),
        emissive: (t = 16777215, i = 4) =>
          new THREE.MeshBasicMaterial({ color: new THREE.Color(t).multiplyScalar(i) }),
        names: [],
        decal: () => ({ material: new THREE.MeshBasicMaterial({ transparent: !0, opacity: 0 }), aspect: 1 }),
        label: () => ({ material: new THREE.MeshBasicMaterial({ transparent: !0, opacity: 0 }), aspect: 4 }),
        uniforms: { wet: { value: 1 } },
        update: a0,
      };
    },
  };

export { BM, Hn, Ia, Is, Kn, Ro, Sr, T0, UM, Z0, j0, jr, ou, su, u0, zi };
