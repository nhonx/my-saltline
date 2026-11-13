import type { EngineContext } from '../../engine/core/context';

interface WeaponCardMeta {
  id: 'rifle' | 'pistol';
  hotkey: string;
  role: string;
  caliber: string;
  mode: string;
}

const WEAPON_META: WeaponCardMeta[] = [
  {
    id: 'rifle',
    hotkey: '1',
    role: 'Primary Rifle',
    caliber: '7.62×39mm',
    mode: 'Full-Auto',
  },
  {
    id: 'pistol',
    hotkey: '2',
    role: 'Sidearm',
    caliber: '.50 Action Express',
    mode: 'Semi-Auto',
  },
];

/**
 * Installs the in-game Weapon Selection overlay toggled by pressing `B`.
 * Allows picking between the primary rifle (AK-47) and sidearm (Desert Eagle).
 */
export function initWeaponSelect(ctx: EngineContext): { isOpen: () => boolean; close: () => void } {
  const root = document.createElement('div');
  root.id = 'weapon-select';
  root.className = 'ws-overlay';
  root.hidden = true;
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', 'Weapon Selection');

  root.innerHTML = `
    <div class="ws-modal">
      <div class="ws-head">
        <div>
          <div class="ws-kicker">Armoury Loadout</div>
          <h2 class="ws-title">Select Weapon</h2>
        </div>
        <button type="button" class="ws-close" data-ws-close aria-label="Close weapon selection">ESC / B</button>
      </div>
      <div class="ws-grid" data-ws-grid></div>
      <div class="ws-foot">Click a weapon or press <kbd>1</kbd> / <kbd>2</kbd> to equip · <kbd>B</kbd> or <kbd>Esc</kbd> to close</div>
    </div>
  `;

  document.body.appendChild(root);

  const grid = root.querySelector('[data-ws-grid]') as HTMLElement;
  const closeBtn = root.querySelector('[data-ws-close]') as HTMLButtonElement;
  let open = false;

  const getActiveId = (): string => {
    const w = ctx.weapon as any;
    if (!w) return 'rifle';
    const match = Array.isArray(w.slots) ? w.slots.find((s: any) => s.name === w.name) : null;
    return match ? match.id : 'rifle';
  };

  const renderCards = () => {
    const w = ctx.weapon as any;
    if (!w || !w.rigs || !grid) return;
    const activeId = getActiveId();
    grid.innerHTML = WEAPON_META.map((meta) => {
      const rig = w.rigs[meta.id];
      const slot = rig?.slot;
      const def = rig?.def;
      const name = slot?.name || (meta.id === 'rifle' ? 'AK-47' : 'Desert Eagle');
      const ammo = slot ? slot.ammo : def?.magSize ?? 0;
      const magSize = slot ? slot.magSize : def?.magSize ?? 0;
      const reserve = slot ? (Number.isFinite(slot.reserve) ? String(slot.reserve) : '∞') : '∞';
      const dmg = def?.damage ?? 0;
      const rpm = def?.rpm ?? 0;
      const isEquipped = activeId === meta.id;

      return `
        <button type="button" class="ws-card${isEquipped ? ' is-equipped' : ''}" data-ws-id="${meta.id}">
          <div class="ws-card-top">
            <span class="ws-key">${meta.hotkey}</span>
            <span class="ws-role">${meta.role}</span>
            ${isEquipped ? '<span class="ws-badge">Equipped</span>' : ''}
          </div>
          <div class="ws-name">${name}</div>
          <div class="ws-cal">${meta.caliber} · ${meta.mode}</div>
          <div class="ws-stats">
            <div><span>DMG</span><strong>${dmg}</strong></div>
            <div><span>RPM</span><strong>${rpm}</strong></div>
            <div><span>MAG</span><strong>${ammo} / ${magSize}</strong></div>
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

  const selectWeapon = (id: 'rifle' | 'pistol') => {
    const w = ctx.weapon as any;
    if (w && typeof w.switchTo === 'function' && getActiveId() !== id) {
      w.switchTo(id);
    }
    close(true);
  };

  grid.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement | null)?.closest('[data-ws-id]') as HTMLElement | null;
    if (!btn) return;
    const id = btn.dataset.wsId as 'rifle' | 'pistol';
    if (id === 'rifle' || id === 'pistol') selectWeapon(id);
  });

  closeBtn.addEventListener('click', () => close(true));
  root.addEventListener('click', (e) => {
    if (e.target === root) close(true);
  });

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
      } else if (e.code === 'Digit1' || e.code === 'Numpad1') {
        e.preventDefault();
        e.stopPropagation();
        selectWeapon('rifle');
      } else if (e.code === 'Digit2' || e.code === 'Numpad2') {
        e.preventDefault();
        e.stopPropagation();
        selectWeapon('pistol');
      }
    },
    true,
  );

  return {
    isOpen: () => open,
    close: () => close(false),
  };
}

