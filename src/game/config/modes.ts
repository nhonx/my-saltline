export const VIEW_PRESETS: Array<[number, string]> = [
  [1, 'Close'],
  [2, 'Three-quarter'],
  [3, 'Compact'],
];

export const GAME_MODES: Array<[string, string]> = [
  ['mission', 'Mission'],
  ['holdout', 'Holdout'],
];

export const MODE_DESCRIPTIONS: Record<string, string> = {
  mission: 'Cut three relays and reach the boat. About five minutes.',
  holdout: 'Endless waves that keep growing. Resupply between waves. How long can you hold?',
};

export const DIFFICULTIES: Array<[string, string]> = [
  ['standard', 'Standard'],
  ['hard', 'Hard'],
  ['brutal', 'Brutal'],
];

