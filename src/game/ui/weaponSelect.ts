import type { EngineContext } from '../../engine/core/context';

type WeaponKey = 'ak47' | 'pac9' | 'deagle' | 'pac4';

interface WeaponBuyItem {
  key: WeaponKey;
  hotkey: string;
  slot: 'rifle' | 'pistol';
  role: string;
  caliber: string;
  mode: string;
  tag: string;
}

const WEAPON_ITEMS: WeaponBuyItem[] = [
  {
    key: 'ak47',
    hotkey: '1',
    slot: 'rifle',
    role: 'Primary Rifle',
    caliber: '7.62×39mm',
    mode: 'Full-Auto',
    tag: 'NEW',
  },
  {
    key: 'pac9',
    hotkey: '2',
    slot: 'rifle',
    role: 'Primary Rifle',
    caliber: '5.8×40mm · HX-2 Reflex',
    mode: 'Full-Auto',
    tag: 'CLASSIC',
  },
  {
    key: 'deagle',
    hotkey: '3',
    slot: 'pistol',
    role: 'Sidearm',
    caliber: '.50 Action Express',
    mode: 'Semi-Auto',
    tag: 'NEW',
  },
  {
    key: 'pac4',
    hotkey: '4',
    slot: 'pistol',
    role: 'Sidearm',
    caliber: '9×19mm · PA-SVC',
    mode: 'Semi-Auto',
    tag: 'CLASSIC',
  },
];

/**
 * Installs the in-game Weapon Buy overlay toggled by pressing `B`.
 * Allows buying/equipping both new weapons (AK-47, Desert Eagle) and classic weapons (PAC-9 Longshore, PAC-4 Bosun).
 */
export function initWeaponSelect(ctx: EngineContext): { isOpen: () => boolean; close: () => void } {
  const root = document.createElement('div');
  root.id = 'weapon-select';
  root.className = 'ws-overlay';
  root.hidden = true;
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', 'Weapon Buy');

  root.innerHTML = `
    <div class="ws-modal">
      <div class="ws-head">
        <div>
          <div class="ws-kicker">Armoury Buy Menu</div>
          <h2 class="ws-title">Select Weapon</h2>
        </div>
        <button type="button" class="ws-close" data-ws-close aria-label="Close weapon buy">ESC / B</button>
      </div>
      <div class="ws-grid" data-ws-grid></div>
      <div class="ws-foot">Click a weapon or press <kbd>1</kbd>–<kbd>4</kbd> to equip · <kbd>B</kbd> or <kbd>Esc</kbd> to close</div>
    </div>
  `;

  document.body.appendChild(root);

  const grid = root.querySelector('[data-ws-grid]') as HTMLElement;
  const closeBtn = root.querySelector('[data-ws-close]') as HTMLButtonElement;
  let open = false;

  const renderCards = () => {
    const w = ctx.weapon as any;
    if (!w || !grid) return;
    const activeName = w.name;
    const equippedNames = new Set(Array.isArray(w.slots) ? w.slots.map((s: any) => s.name) : []);

    grid.innerHTML = WEAPON_ITEMS.map((item) => {
      const catEntry = w.catalog?.[item.key];
      const rig = catEntry?.rig || w.rigs?.[item.slot];
      const slot = rig?.slot;
      const def = rig?.def;
      const name = slot?.name || item.key.toUpperCase();
      const magSize = slot?.magSize ?? def?.magSize ?? 0;
      const reserve = def ? (Number.isFinite(def.reserve) ? String(def.reserve) : '∞') : '∞';
      const dmg = def?.damage ?? 0;
      const rpm = def?.rpm ?? 0;
      const isActive = activeName === name;
      const isInSlot = !isActive && equippedNames.has(name);

      return `
        <button type="button" class="ws-card${isActive ? ' is-equipped' : ''}" data-ws-key="${item.key}">
          <div class="ws-card-top">
            <span class="ws-key">${item.hotkey}</span>
            <span class="ws-role">${item.role} · ${item.tag}</span>
            ${isActive ? '<span class="ws-badge">Equipped</span>' : isInSlot ? '<span class="ws-badge ws-badge-dim">In Slot</span>' : ''}
          </div>
          <div class="ws-name">${name}</div>
          <div class="ws-cal">${item.caliber} · ${item.mode}</div>
          <div class="ws-stats">
            <div><span>DMG</span><strong>${dmg}</strong></div>
            <div><span>RPM</span><strong>${rpm}</strong></div>
            <div><span>MAG</span><strong>${magSize}</strong></div>
            <div><span>RES</span><strong>${reserve}</strong></div>
          </div>
        </button>
      `;
    }).join('');
  };

  const close = (relock = true) => {
    if (!open) return;
    open = false;
    root.hidden = true;
    const input = ctx.input as any;
    if (input?.setGameplay) input.setGameplay(true);
    if (relock && ctx.game?.state === 'playing' && input?.requestLock) {
      input.requestLock();
    }
  };

  const show = () => {
    if (open) return;
    open = true;
    renderCards();
    root.hidden = false;
    const input = ctx.input as any;
    if (input?.setGameplay) input.setGameplay(false);
    if (input?.exitLock) input.exitLock();
  };

  const buyWeapon = (key: WeaponKey) => {
    const w = ctx.weapon as any;
    if (w && typeof w.buyWeapon === 'function') {
      w.buyWeapon(key);
    }
    close(true);
  };

  grid.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement | null)?.closest('[data-ws-key]') as HTMLElement | null;
    if (!btn) return;
    const key = btn.dataset.wsKey as WeaponKey;
    if (key === 'ak47' || key === 'pac9' || key === 'deagle' || key === 'pac4') {
      buyWeapon(key);
    }
  });

  closeBtn.addEventListener('click', () => close(true));
  root.addEventListener('click', (e) => {
    if (e.target === root) close(true);
  });

  const HOTKEY_MAP: Record<string, WeaponKey> = {
    Digit1: 'ak47',
    Numpad1: 'ak47',
    Digit2: 'pac9',
    Numpad2: 'pac9',
    Digit3: 'deagle',
    Numpad3: 'deagle',
    Digit4: 'pac4',
    Numpad4: 'pac4',
  };

  window.addEventListener(
    'keydown',
    (e) => {
      if (e.repeat) return;
      if (e.code === 'KeyB') {
        if (open) {
          e.preventDefault();
          e.stopPropagation();
          close(true);
          return;
        }
        if (ctx.game?.state === 'playing') {
          e.preventDefault();
          e.stopPropagation();
          show();
        }
        return;
      }
      if (!open) return;
      if (e.code === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        close(true);
      } else if (HOTKEY_MAP[e.code]) {
        e.preventDefault();
        e.stopPropagation();
        buyWeapon(HOTKEY_MAP[e.code]);
      }
    },
    true,
  );

  return {
    isOpen: () => open,
    close: () => close(false),
  };
}
