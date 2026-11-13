import { PLAYER_DIMS } from './world';
import { DIFFICULTIES, GAME_MODES, VIEW_PRESETS } from './modes';

export interface GameSettings {
  quality: string;
  sens: number;
  invertY: boolean;
  volume: number;
  fov: number;
  difficulty: string;
  mode: string;
  view: number;
}

const STORAGE_KEY = 'saltline.settings.v1';
const QUALITY_OPTIONS = ['low', 'medium', 'high', 'ultra'];

export const DEFAULT_SETTINGS: GameSettings = {
  quality: 'auto',
  sens: 1,
  invertY: false,
  volume: 0.8,
  fov: PLAYER_DIMS.fov,
  difficulty: 'hard',
  mode: 'mission',
  view: 1,
};

export function loadSettings(): GameSettings {
  const out: GameSettings = { ...DEFAULT_SETTINGS };
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (raw && typeof raw === 'object') {
      if (raw.quality === 'auto' || QUALITY_OPTIONS.includes(raw.quality)) out.quality = raw.quality;
      if (Number.isFinite(raw.sens)) out.sens = Math.min(3, Math.max(0.2, raw.sens));
      out.invertY = !!raw.invertY;
      if (Number.isFinite(raw.volume)) out.volume = Math.min(1, Math.max(0, raw.volume));
      if (Number.isFinite(raw.fov)) out.fov = Math.min(95, Math.max(60, raw.fov));
      if (DIFFICULTIES.some((d) => d[0] === raw.difficulty)) out.difficulty = raw.difficulty;
      if (GAME_MODES.some((m) => m[0] === raw.mode)) out.mode = raw.mode;
      if (VIEW_PRESETS.some((v) => v[0] === raw.view)) out.view = raw.view;
    }
  } catch {
    // ignore storage errors
  }
  return out;
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore storage errors
  }
}

