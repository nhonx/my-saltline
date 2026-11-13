import type { EventBus } from '../core/events';

export type InputDevice = 'kbm' | 'touch' | 'pad';
export type LookMode = 'lock' | 'drag' | 'touch';

export interface InputSystem {
  move: { x: number; y: number };
  look: { dx: number; dy: number };
  fire: boolean;
  ads: boolean;
  sprint: boolean;
  crouch: boolean;
  locked: boolean;
  touch: boolean;
  gamepad: boolean;
  sensitivity: number;
  invertY: boolean;
  mode: LookMode;
  device: InputDevice;
  assist: number;
  padName: string;
  uiPressed(action: string): boolean;
  rumble(strong?: number, weak?: number, durationMs?: number): void;
  down(action: string): boolean;
  pressed(action: string): boolean;
  update(dt: number): void;
  endFrame(): void;
  requestLock(): void;
  exitLock(): void;
  setGameplay(enabled: boolean): void;
  setPrompt(visible: boolean): void;
  onModeChange(cb: (mode: LookMode) => void): void;
  describeMode(): string;
}

const DEFAULT_KEYMAP: Record<string, string> = {
  KeyW: 'forward',
  KeyS: 'back',
  KeyA: 'left',
  KeyD: 'right',
  Space: 'jump',
  ShiftLeft: 'sprint',
  ShiftRight: 'sprint',
  KeyC: 'crouch',
  ControlLeft: 'crouch',
  ControlRight: 'crouch',
  KeyR: 'reload',
  KeyE: 'interact',
  KeyF: 'melee',
  KeyV: 'melee',
  Escape: 'pause',
  KeyP: 'pause',
  KeyQ: 'swap',
  Digit1: 'weapon1',
  Digit2: 'weapon2',
  Numpad1: 'weapon1',
  Numpad2: 'weapon2',
  Enter: 'fire',
  NumpadEnter: 'fire',
  ArrowLeft: 'turnL',
  ArrowRight: 'turnR',
  ArrowUp: 'turnU',
  ArrowDown: 'turnD',
  KeyJ: 'turnL',
  KeyL: 'turnR',
  KeyI: 'turnU',
  KeyK: 'turnD',
};

const MOUSE_SENS = 0.0021;
const TOUCH_LOOK_SENS = 0.0052;
const KEY_TURN_RATE = 2.1;
const PAD_TURN_BASE = 2.9;
const PAD_TURN_BOOST = 1.75;
const PAD_BOOST_RAMP = 0.45;
const STICK_RADIUS = 58;
const MENU_ACTIONS: Record<string, number> = { pause: 1 };

const PAD_ACTION_MAP: Record<string, number[]> = {
  jump: [0],
  crouch: [1, 4],
  swap: [3, 12, 13],
  melee: [5, 11],
  ads: [6],
  fire: [7],
  pause: [9],
  weapon1: [14],
  weapon2: [15],
};

const PAD_UI_MAP: Record<number, string> = {
  0: 'accept',
  1: 'back',
  9: 'start',
  12: 'up',
  13: 'down',
  14: 'left',
  15: 'right',
};

/** Unified keyboard/mouse, pointer-lock/drag, touch, and gamepad input system. */
export function createInput(ctx: {
  renderer?: { domElement?: HTMLElement };
  events: EventBus;
}): InputSystem {
  const canvas = (ctx.renderer && ctx.renderer.domElement) || document.getElementById('view')!;
  const uiRoot = document.getElementById('ui')!;

  const heldActions = new Set<string>();
  const justPressed = new Set<string>();
  const sources: Record<'key' | 'mouse' | 'touch' | 'pad', Set<string>> = {
    key: new Set(),
    mouse: new Set(),
    touch: new Set(),
    pad: new Set(),
  };

  let gameplayEnabled = false;
  let lockSucceededOnce = false;
  let lockRequestAt = 0;
  let lockFailCount = 0;
  let mouseButtons = 0;
  const modeListeners: Array<(mode: LookMode) => void> = [];
  const uiPressedSet = new Set<string>();
  let promptVisible = false;

  function setDevice(device: InputDevice) {
    if (input.device !== device) {
      input.device = device;
      try {
        document.documentElement.dataset.device = device;
      } catch {
        // ignore
      }
      ctx.events.emit('input:device', { device });
    }
  }

  const input: InputSystem = {
    move: { x: 0, y: 0 },
    look: { dx: 0, dy: 0 },
    fire: false,
    ads: false,
    sprint: false,
    crouch: false,
    locked: false,
    touch: false,
    gamepad: false,
    sensitivity: 1,
    invertY: false,
    mode: 'lock',
    device: 'kbm',
    assist: 1,
    padName: '',
    uiPressed(action) {
      return uiPressedSet.has(action);
    },
    rumble,
    down(action) {
      return heldActions.has(action) && (gameplayEnabled || MENU_ACTIONS[action] === 1);
    },
    pressed(action) {
      return justPressed.has(action) && (gameplayEnabled || MENU_ACTIONS[action] === 1);
    },
    update,
    endFrame,
    requestLock,
    exitLock,
    setGameplay(enabled) {
      const next = !!enabled;
      if (next !== gameplayEnabled) {
        gameplayEnabled = next;
        if (!next) clearAllInputs();
        if (touchUi) touchUi.root.classList.toggle('on', next && input.touch);
      }
    },
    setPrompt(visible) {
      promptVisible = !!visible;
      if (touchUi) touchUi.btn.interact.classList.toggle('on', !!visible);
    },
    onModeChange(cb) {
      modeListeners.push(cb);
    },
    describeMode() {
      if (input.mode === 'touch') return 'Touch controls active';
      if (input.device === 'pad') return 'Controller active';
      if (input.mode === 'drag') {
        return 'Mouse capture unavailable — move the mouse to look, rest it at a screen edge to keep turning · click fires · arrows or IJKL also turn';
      }
      return input.locked ? 'Mouse captured — Esc releases it' : 'Click once to capture the mouse';
    },
  };

  function setMode(mode: LookMode) {
    if (input.mode !== mode) {
      input.mode = mode;
      for (const cb of modeListeners) {
        try {
          cb(mode);
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  function setAction(source: 'key' | 'mouse' | 'touch' | 'pad', action: string | undefined | null, down: boolean) {
    if (!action) return;
    const set = sources[source];
    if (down) {
      if (set.has(action)) return;
      set.add(action);
      if (!heldActions.has(action)) {
        heldActions.add(action);
        justPressed.add(action);
      }
    } else {
      if (!set.delete(action)) return;
      if (!sources.key.has(action) && !sources.mouse.has(action) && !sources.touch.has(action) && !sources.pad.has(action)) {
        heldActions.delete(action);
      }
    }
  }

  function clearAllInputs() {
    for (const k of Object.keys(sources) as Array<keyof typeof sources>) sources[k].clear();
    heldActions.clear();
    mouseButtons = 0;
    adsToggleTouch = false;
    if (touchUi) {
      touchUi.btn.ads.classList.remove('active');
      resetStick();
      lookTouchId = -1;
      fireTouchId = -1;
    }
  }

  addEventListener('keydown', (e) => {
    const action = DEFAULT_KEYMAP[e.code];
    if (!action) return;
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA')) return;
    if (target && target.tagName === 'BUTTON' && (e.code === 'Space' || e.code === 'Enter' || e.code === 'NumpadEnter')) {
      return;
    }
    if (gameplayEnabled && (e.code === 'Space' || e.code.startsWith('Arrow') || e.code === 'ControlLeft')) {
      e.preventDefault();
    }
    if (!e.repeat) {
      setDevice('kbm');
      setAction('key', action, true);
    }
  });

  addEventListener('keyup', (e) => {
    setAction('key', DEFAULT_KEYMAP[e.code], false);
  });

  addEventListener('blur', () => {
    clearAllInputs();
  });

  const mouseButtonToAction = (btn: number) => (btn === 0 ? 'fire' : btn === 2 ? 'ads' : btn === 1 ? 'melee' : null);

  canvas.addEventListener('mousedown', (e) => {
    if (input.touch && performance.now() - lastTouchAt < 800) return;
    if (!gameplayEnabled) return;
    setDevice('kbm');
    if (!input.locked && input.mode === 'lock') requestLock();
    mouseButtons |= 1 << e.button;
    setAction('mouse', mouseButtonToAction(e.button), true);
    e.preventDefault();
  });

  addEventListener('mouseup', (e) => {
    mouseButtons &= ~(1 << e.button);
    setAction('mouse', mouseButtonToAction(e.button), false);
  });

  let lastWheelAt = 0;
  canvas.addEventListener(
    'wheel',
    (e) => {
      if (!gameplayEnabled) return;
      e.preventDefault();
      const now = performance.now();
      if (now - lastWheelAt < 280 || Math.abs(e.deltaY) < 1) return;
      lastWheelAt = now;
      justPressed.add('swap');
    },
    { passive: false },
  );

  addEventListener('contextmenu', (e) => {
    if (e.target === canvas || gameplayEnabled) e.preventDefault();
  });

  let mouseNormX = 0.5;
  let mouseNormY = 0.5;
  let mouseInside = false;

  addEventListener('mousemove', (e) => {
    if (!gameplayEnabled) return;
    if (!input.locked) {
      mouseNormX = e.clientX / Math.max(1, innerWidth);
      mouseNormY = e.clientY / Math.max(1, innerHeight);
      mouseInside = true;
    }
    if (!input.touch || input.locked) {
      const mx = e.movementX || 0;
      const my = e.movementY || 0;
      if (Math.abs(mx) > 400 || Math.abs(my) > 400) return;
      if (mx || my) setDevice('kbm');
      input.look.dx += mx * MOUSE_SENS * input.sensitivity;
      input.look.dy += my * MOUSE_SENS * input.sensitivity * (input.invertY ? -1 : 1);
    }
  });

  document.addEventListener('pointerlockchange', () => {
    input.locked = document.pointerLockElement === canvas;
    if (input.locked) {
      lockSucceededOnce = true;
      lockRequestAt = 0;
      lockFailCount = 0;
      if (!input.touch) setMode('lock');
    } else {
      sources.mouse.clear();
      heldActions.delete('fire');
      heldActions.delete('ads');
      for (const act of sources.key) heldActions.add(act);
      mouseButtons = 0;
    }
    ctx.events.emit('input:lock', { locked: input.locked });
  });

  document.addEventListener('pointerlockerror', () => onLockFail());

  document.addEventListener('mouseleave', () => {
    mouseInside = false;
  });

  function onLockFail() {
    lockRequestAt = 0;
    if (!(input.locked || input.touch)) {
      lockFailCount++;
      if (!lockSucceededOnce) setMode('drag');
    }
  }

  function requestLock() {
    if (input.touch || input.locked) return;
    if (!canvas.requestPointerLock) {
      onLockFail();
      return;
    }
    try {
      lockRequestAt = performance.now();
      const maybePromise = canvas.requestPointerLock() as unknown as Promise<void> | undefined;
      if (maybePromise && maybePromise.catch) maybePromise.catch(() => onLockFail());
    } catch {
      onLockFail();
    }
    try {
      canvas.focus({ preventScroll: true });
    } catch {
      // ignore
    }
  }

  function exitLock() {
    try {
      if (document.pointerLockElement) document.exitPointerLock();
    } catch {
      // ignore
    }
  }

  interface TouchUi {
    root: HTMLDivElement;
    stick: HTMLElement;
    nub: HTMLElement;
    btn: Record<string, HTMLElement>;
  }

  let touchUi: TouchUi | null = null;
  let lastTouchAt = 0;
  let stickTouchId = -1;
  let stickOriginX = 0;
  let stickOriginY = 0;
  let stickX = 0;
  let stickY = 0;
  let lookTouchId = -1;
  let lookPrevX = 0;
  let lookPrevY = 0;
  let fireTouchId = -1;
  let firePrevX = 0;
  let firePrevY = 0;
  let adsToggleTouch = false;

  function createTouchUi(): TouchUi {
    const root = document.createElement('div');
    root.className = 'touch';
    root.innerHTML =
      '<div class="t-stick"><i class="t-ring"></i><i class="t-nub"></i></div>' +
      '<button class="t-btn t-fire" data-a="fire" aria-label="Fire"><span>FIRE</span></button>' +
      '<button class="t-btn t-ads" data-a="ads" aria-label="Aim"><span>AIM</span></button>' +
      '<button class="t-btn t-reload" data-a="reload" aria-label="Reload"><span>RLD</span></button>' +
      '<button class="t-btn t-swap" data-a="swap" aria-label="Swap weapon"><span>SWAP</span></button>' +
      '<button class="t-btn t-jump" data-a="jump" aria-label="Jump"><span>JUMP</span></button>' +
      '<button class="t-btn t-interact" data-a="interact" aria-label="Interact"><span>USE</span></button>' +
      '<button class="t-btn t-pause" data-a="pause" aria-label="Pause"><span>II</span></button>';
    uiRoot.appendChild(root);

    const q = (sel: string) => root.querySelector(sel) as HTMLElement;
    const ui: TouchUi = {
      root,
      stick: q('.t-stick'),
      nub: q('.t-nub'),
      btn: {
        fire: q('.t-fire'),
        ads: q('.t-ads'),
        reload: q('.t-reload'),
        swap: q('.t-swap'),
        jump: q('.t-jump'),
        interact: q('.t-interact'),
        pause: q('.t-pause'),
      },
    };

    for (const action of Object.keys(ui.btn)) {
      const btn = ui.btn[action];
      btn.addEventListener(
        'touchstart',
        (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          lastTouchAt = performance.now();
          const touch = ev.changedTouches[0];
          if (action === 'ads') {
            adsToggleTouch = !adsToggleTouch;
            btn.classList.toggle('active', adsToggleTouch);
            return;
          }
          if (action === 'fire') {
            fireTouchId = touch.identifier;
            firePrevX = touch.clientX;
            firePrevY = touch.clientY;
          }
          btn.classList.add('active');
          setAction('touch', action, true);
        },
        { passive: false },
      );

      const onEnd = (ev: TouchEvent) => {
        ev.preventDefault();
        ev.stopPropagation();
        if (action === 'ads') return;
        if (action === 'fire') {
          let found = false;
          for (const t of Array.from(ev.changedTouches)) {
            if (t.identifier === fireTouchId) found = true;
          }
          if (!found) return;
          fireTouchId = -1;
        }
        btn.classList.remove('active');
        setAction('touch', action, false);
      };

      btn.addEventListener('touchend', onEnd, { passive: false });
      btn.addEventListener('touchcancel', onEnd, { passive: false });
      btn.addEventListener(
        'touchmove',
        (ev) => {
          ev.preventDefault();
          if (action === 'fire') {
            for (const t of Array.from(ev.changedTouches)) {
              if (t.identifier === fireTouchId) {
                addTouchLook(t.clientX - firePrevX, t.clientY - firePrevY);
                firePrevX = t.clientX;
                firePrevY = t.clientY;
              }
            }
          }
        },
        { passive: false },
      );
      btn.addEventListener('contextmenu', (ev) => ev.preventDefault());
    }

    return ui;
  }

  function addTouchLook(dx: number, dy: number) {
    input.look.dx += dx * TOUCH_LOOK_SENS * input.sensitivity;
    input.look.dy += dy * TOUCH_LOOK_SENS * input.sensitivity * (input.invertY ? -1 : 1);
  }

  function enableTouch() {
    if (input.touch) return;
    input.touch = true;
    exitLock();
    if (!touchUi) touchUi = createTouchUi();
    touchUi.root.classList.toggle('on', gameplayEnabled);
    document.documentElement.classList.add('is-touch');
    setMode('touch');
    setDevice('touch');
  }

  function resetStick() {
    stickTouchId = -1;
    stickX = stickY = 0;
    if (touchUi) touchUi.stick.classList.remove('on');
  }

  addEventListener(
    'touchstart',
    () => {
      lastTouchAt = performance.now();
      enableTouch();
    },
    { passive: true, capture: true },
  );

  canvas.addEventListener(
    'touchstart',
    (ev) => {
      ev.preventDefault();
      if (!gameplayEnabled) return;
      for (const t of Array.from(ev.changedTouches)) {
        if (t.clientX < innerWidth * 0.45 && stickTouchId < 0) {
          stickTouchId = t.identifier;
          stickOriginX = t.clientX;
          stickOriginY = t.clientY;
          stickX = stickY = 0;
          if (touchUi) {
            touchUi.stick.style.transform = `translate3d(${stickOriginX}px,${stickOriginY}px,0)`;
            touchUi.nub.style.transform = 'translate3d(0,0,0)';
            touchUi.stick.classList.add('on');
          }
        } else if (lookTouchId < 0) {
          lookTouchId = t.identifier;
          lookPrevX = t.clientX;
          lookPrevY = t.clientY;
        }
      }
    },
    { passive: false },
  );

  canvas.addEventListener(
    'touchmove',
    (ev) => {
      ev.preventDefault();
      if (!gameplayEnabled) return;
      for (const t of Array.from(ev.changedTouches)) {
        if (t.identifier === stickTouchId) {
          let dx = t.clientX - stickOriginX;
          let dy = t.clientY - stickOriginY;
          const dist = Math.hypot(dx, dy);
          if (dist > STICK_RADIUS) {
            dx *= STICK_RADIUS / dist;
            dy *= STICK_RADIUS / dist;
          }
          stickX = dx / STICK_RADIUS;
          stickY = -dy / STICK_RADIUS;
          if (touchUi) {
            touchUi.nub.style.transform = `translate3d(${dx.toFixed(1)}px,${dy.toFixed(1)}px,0)`;
          }
        } else if (t.identifier === lookTouchId) {
          addTouchLook(t.clientX - lookPrevX, t.clientY - lookPrevY);
          lookPrevX = t.clientX;
          lookPrevY = t.clientY;
        }
      }
    },
    { passive: false },
  );

  const onCanvasTouchEnd = (ev: TouchEvent) => {
    for (const t of Array.from(ev.changedTouches)) {
      if (t.identifier === stickTouchId) resetStick();
      else if (t.identifier === lookTouchId) lookTouchId = -1;
    }
  };
  canvas.addEventListener('touchend', onCanvasTouchEnd, { passive: false });
  canvas.addEventListener('touchcancel', onCanvasTouchEnd, { passive: false });

  // Gamepad polling
  let hasGamepadApi = typeof navigator !== 'undefined' && !!navigator.getGamepads;
  let padMoveX = 0;
  let padMoveY = 0;
  let activePad: Gamepad | null = null;
  let padBoost = 0;
  let padSprint = false;
  let padInteractAction = '';
  const padPrevButtons = new Uint8Array(20);
  let menuNavDirY = 0;
  let menuNavRepeatAt = 0;
  let menuNavDirX = 0;

  const deadzone = (val: number, dz = 0.14) => {
    const a = Math.abs(val);
    return a < dz ? 0 : (Math.sign(val) * (a - dz)) / (1 - dz);
  };
  const btnDown = (b: GamepadButton | undefined) => !!b && (b.pressed || b.value > 0.35);

  addEventListener('gamepadconnected', (ev) => {
    hasGamepadApi = true;
    input.padName = (ev.gamepad && ev.gamepad.id) || 'gamepad';
    ctx.events.emit('input:pad', { connected: true, name: input.padName });
  });
  addEventListener('gamepaddisconnected', () => {
    ctx.events.emit('input:pad', { connected: false });
  });

  function pickGamepad(): Gamepad | null {
    let pads: (Gamepad | null)[];
    try {
      pads = navigator.getGamepads();
    } catch {
      hasGamepadApi = false;
      return null;
    }
    let fallback: Gamepad | null = null;
    for (let i = 0; pads && i < pads.length; i++) {
      const p = pads[i];
      if (!p || !p.connected || p.buttons.length < 10 || p.axes.length < 4) continue;
      if (p.mapping === 'standard') return p;
      if (!fallback) fallback = p;
    }
    return fallback;
  }

  function resetGamepad() {
    input.gamepad = false;
    activePad = null;
    padSprint = false;
    padInteractAction = '';
    padPrevButtons.fill(0);
    for (const act of [...sources.pad]) setAction('pad', act, false);
    if (input.device === 'pad') setDevice('kbm');
  }

  function pollGamepad(dt: number) {
    padMoveX = padMoveY = 0;
    uiPressedSet.clear();
    if (!hasGamepadApi) return;
    const pad = pickGamepad();
    if (!pad) {
      if (input.gamepad) resetGamepad();
      return;
    }
    activePad = pad;
    input.gamepad = true;

    const lx = deadzone(pad.axes[0] || 0);
    const ly = deadzone(pad.axes[1] || 0);
    const rx = deadzone(pad.axes[2] || 0);
    const ry = deadzone(pad.axes[3] || 0);
    let anyActivity = !!(lx || ly || rx || ry);
    padMoveX = lx;
    padMoveY = -ly;

    if (gameplayEnabled) {
      const mag = Math.min(1, Math.hypot(rx, ry));
      padBoost = mag > 0.92 ? Math.min(1, padBoost + dt / PAD_BOOST_RAMP) : Math.max(0, padBoost - dt * 6);
      const curve = mag > 0 ? (0.25 * mag + 0.75 * mag * mag * mag) / mag : 0;
      const gain = PAD_TURN_BASE * (1 + (PAD_TURN_BOOST - 1) * padBoost) * curve * input.assist * input.sensitivity * dt;
      input.look.dx += rx * gain;
      input.look.dy += ry * gain * 0.62 * (input.invertY ? -1 : 1);
      if (btnDown(pad.buttons[10])) padSprint = true;
      if (padMoveY < 0.55) padSprint = false;
    } else {
      padSprint = false;
    }

    for (let i = 0; i < pad.buttons.length && i < 20; i++) {
      const down = btnDown(pad.buttons[i]) ? 1 : 0;
      if (down && !padPrevButtons[i]) {
        anyActivity = true;
        if (!gameplayEnabled && PAD_UI_MAP[i]) uiPressedSet.add(PAD_UI_MAP[i]);
      }
      padPrevButtons[i] = down;
    }

    const xBtn = btnDown(pad.buttons[2]);
    if (xBtn && !padInteractAction) padInteractAction = promptVisible ? 'interact' : 'reload';
    setAction('pad', 'interact', xBtn && padInteractAction === 'interact');
    setAction('pad', 'reload', xBtn && padInteractAction === 'reload');
    if (!xBtn) padInteractAction = '';

    for (const act of Object.keys(PAD_ACTION_MAP)) {
      const btns = PAD_ACTION_MAP[act];
      let down = false;
      for (let i = 0; i < btns.length; i++) {
        if (btnDown(pad.buttons[btns[i]])) down = true;
      }
      setAction('pad', act, down);
    }
    setAction('pad', 'sprint', padSprint);

    if (!gameplayEnabled) {
      const dirY = Math.abs(ly) > 0.6 ? Math.sign(ly) : 0;
      const now = performance.now();
      if (dirY !== menuNavDirY) {
        menuNavDirY = dirY;
        menuNavRepeatAt = now + 380;
        if (dirY) uiPressedSet.add(dirY < 0 ? 'up' : 'down');
      } else if (dirY && now > menuNavRepeatAt) {
        menuNavRepeatAt = now + 170;
        uiPressedSet.add(dirY < 0 ? 'up' : 'down');
      }
      const dirX = Math.abs(lx) > 0.6 ? Math.sign(lx) : 0;
      if (dirX !== menuNavDirX) {
        menuNavDirX = dirX;
        if (dirX) uiPressedSet.add(dirX < 0 ? 'left' : 'right');
      }
    }

    if (anyActivity) setDevice('pad');
  }

  function rumble(strong = 0.5, weak = 0.5, durationMs = 80) {
    if (input.device !== 'pad' || !activePad) return;
    try {
      const actuator = activePad.vibrationActuator as any;
      if (actuator && actuator.playEffect) {
        const p = actuator.playEffect('dual-rumble', {
          startDelay: 0,
          duration: durationMs,
          strongMagnitude: Math.min(1, strong),
          weakMagnitude: Math.min(1, weak),
        });
        if (p && p.catch) p.catch(() => {});
      }
    } catch {
      // ignore
    }
  }

  function update(dt: number) {
    pollGamepad(dt);
    if (lockRequestAt && performance.now() - lockRequestAt > 1200 && !input.locked) onLockFail();
    if (gameplayEnabled && mouseInside && !input.locked && !input.touch && input.device === 'kbm' && (input.mode === 'drag' || lockRequestAt === 0)) {
      const edgeX = mouseNormX < 0.12 ? -(0.12 - mouseNormX) / 0.12 : mouseNormX > 0.88 ? (mouseNormX - 0.88) / 0.12 : 0;
      const edgeY = mouseNormY < 0.1 ? -(0.1 - mouseNormY) / 0.1 : mouseNormY > 0.9 ? (mouseNormY - 0.9) / 0.1 : 0;
      input.look.dx += edgeX * 2.4 * dt * input.sensitivity;
      input.look.dy += edgeY * 1.2 * dt * input.sensitivity * (input.invertY ? -1 : 1);
    }

    let mx = 0;
    let my = 0;
    let sprint = false;
    if (gameplayEnabled) {
      mx = (heldActions.has('right') ? 1 : 0) - (heldActions.has('left') ? 1 : 0);
      my = (heldActions.has('forward') ? 1 : 0) - (heldActions.has('back') ? 1 : 0);
      sprint = heldActions.has('sprint');
      if (stickTouchId >= 0) {
        mx += stickX;
        my += stickY;
        if (Math.hypot(stickX, stickY) > 0.93 && stickY > 0.8) sprint = true;
      }
      mx += padMoveX;
      my += padMoveY;
      const len = Math.hypot(mx, my);
      if (len > 1) {
        mx /= len;
        my /= len;
      }
      const turnH = (heldActions.has('turnR') ? 1 : 0) - (heldActions.has('turnL') ? 1 : 0);
      const turnV = (heldActions.has('turnD') ? 1 : 0) - (heldActions.has('turnU') ? 1 : 0);
      if (turnH) input.look.dx += turnH * KEY_TURN_RATE * dt;
      if (turnV) input.look.dy += turnV * KEY_TURN_RATE * 0.6 * dt;
    }

    input.move.x = mx;
    input.move.y = my;
    input.fire = gameplayEnabled && heldActions.has('fire');
    input.ads = gameplayEnabled && (heldActions.has('ads') || adsToggleTouch);
    input.sprint = gameplayEnabled && sprint;
    input.crouch = gameplayEnabled && heldActions.has('crouch');
  }

  function endFrame() {
    justPressed.clear();
    input.look.dx = 0;
    input.look.dy = 0;
  }

  return input;
}

