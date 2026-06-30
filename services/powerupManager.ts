import { loadData, saveData } from './storage';

export type PowerUpType = 'peek' | 'extraMove' | 'undo' | 'freeze';

export interface PowerUpInfo {
  type: PowerUpType;
  name: string;
  icon: string;
  description: string;
  games: string[];
}

export const POWERUPS: PowerUpInfo[] = [
  { type: 'peek', name: 'Peek', icon: '\uD83D\uDC41', description: 'Briefly reveal all memory cards', games: ['memory'] },
  { type: 'extraMove', name: 'Extra Move', icon: '\u2795', description: '+3 extra moves in Color Flood', games: ['colorflood'] },
  { type: 'undo', name: 'Undo', icon: '\u21A9\uFE0F', description: 'Undo your last move', games: ['tictactoe', 'connectfour', 'dotsandboxes', 'reversi', 'twenty48'] },
  { type: 'freeze', name: 'Freeze Timer', icon: '\u2744\uFE0F', description: 'Pause speed mode timer for 10s', games: ['tictactoe', 'connectfour', 'dotsandboxes', 'reversi'] },
];

const INVENTORY_KEY = 'powerup_inventory';
const FREE_DAILY_KEY = 'powerup_free_daily';

export interface PowerUpInventory {
  peek: number;
  extraMove: number;
  undo: number;
  freeze: number;
}

const DEFAULT_INVENTORY: PowerUpInventory = { peek: 0, extraMove: 0, undo: 0, freeze: 0 };

export async function getInventory(): Promise<PowerUpInventory> {
  const raw = await loadData(INVENTORY_KEY);
  if (!raw) return { ...DEFAULT_INVENTORY };
  try {
    return { ...DEFAULT_INVENTORY, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_INVENTORY };
  }
}

export async function usePowerUp(type: PowerUpType): Promise<boolean> {
  const inv = await getInventory();
  if (inv[type] <= 0) return false;
  inv[type]--;
  await saveData(INVENTORY_KEY, JSON.stringify(inv));
  return true;
}

export async function addPowerUp(type: PowerUpType, count: number = 1): Promise<void> {
  const inv = await getInventory();
  inv[type] += count;
  await saveData(INVENTORY_KEY, JSON.stringify(inv));
}

export async function claimFreeDailyPowerUp(): Promise<PowerUpType | null> {
  const today = new Date().toISOString().split('T')[0];
  const lastClaim = await loadData(FREE_DAILY_KEY);
  if (lastClaim === today) return null;

  const types: PowerUpType[] = ['peek', 'extraMove', 'undo', 'freeze'];
  const randomType = types[Math.floor(Math.random() * types.length)];
  await addPowerUp(randomType);
  await saveData(FREE_DAILY_KEY, today);
  return randomType;
}

export async function hasClaimedFreeDailyPowerUp(): Promise<boolean> {
  const today = new Date().toISOString().split('T')[0];
  const lastClaim = await loadData(FREE_DAILY_KEY);
  return lastClaim === today;
}

export function getPowerUpForGame(gameId: string): PowerUpInfo[] {
  return POWERUPS.filter(p => p.games.includes(gameId));
}
