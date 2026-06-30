import { loadData, saveData } from './storage';

const ENABLED_KEY = 'parental_enabled';
const LIMIT_KEY = 'parental_limit';
const PENDING_LIMIT_KEY = 'parental_pending_limit';
const TODAY_COUNT_KEY = 'parental_today_count';
const TODAY_DATE_KEY = 'parental_today_date';

const MIN_GAMES = 10;

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export interface ParentalState {
  enabled: boolean;
  dailyLimit: number;
  pendingLimit: number | null;
  gamesPlayedToday: number;
  canPlay: boolean;
  remaining: number;
}

export async function getParentalState(): Promise<ParentalState> {
  const enabled = (await loadData(ENABLED_KEY)) === 'true';
  const limit = parseInt(await loadData(LIMIT_KEY) ?? '10', 10);
  const pendingRaw = await loadData(PENDING_LIMIT_KEY);
  const pendingLimit = pendingRaw ? parseInt(pendingRaw, 10) : null;

  const storedDate = await loadData(TODAY_DATE_KEY);
  const today = todayKey();
  let count = 0;

  if (storedDate === today) {
    count = parseInt(await loadData(TODAY_COUNT_KEY) ?? '0', 10);
  } else {
    // New day: reset count and apply pending limit
    await saveData(TODAY_DATE_KEY, today);
    await saveData(TODAY_COUNT_KEY, '0');
    if (pendingLimit !== null) {
      await saveData(LIMIT_KEY, String(pendingLimit));
      await saveData(PENDING_LIMIT_KEY, '');
      return {
        enabled,
        dailyLimit: pendingLimit,
        pendingLimit: null,
        gamesPlayedToday: 0,
        canPlay: !enabled || 0 < pendingLimit,
        remaining: enabled ? pendingLimit : Infinity,
      };
    }
  }

  const remaining = enabled ? Math.max(0, limit - count) : Infinity;
  return {
    enabled,
    dailyLimit: limit,
    pendingLimit,
    gamesPlayedToday: count,
    canPlay: !enabled || count < limit,
    remaining,
  };
}

export async function recordGameForParental(): Promise<ParentalState> {
  const storedDate = await loadData(TODAY_DATE_KEY);
  const today = todayKey();
  let count = 0;

  if (storedDate === today) {
    count = parseInt(await loadData(TODAY_COUNT_KEY) ?? '0', 10);
  } else {
    await saveData(TODAY_DATE_KEY, today);
  }

  count++;
  await saveData(TODAY_COUNT_KEY, String(count));
  return getParentalState();
}

export async function setParentalEnabled(val: boolean): Promise<void> {
  await saveData(ENABLED_KEY, String(val));
  if (val) {
    const existing = await loadData(LIMIT_KEY);
    if (!existing) await saveData(LIMIT_KEY, String(MIN_GAMES));
  }
}

export async function setDailyLimit(limit: number): Promise<void> {
  const safeLimit = Math.max(MIN_GAMES, limit);
  // Changes take effect from next day
  await saveData(PENDING_LIMIT_KEY, String(safeLimit));
}

export async function setDailyLimitImmediate(limit: number): Promise<void> {
  const safeLimit = Math.max(MIN_GAMES, limit);
  await saveData(LIMIT_KEY, String(safeLimit));
  await saveData(PENDING_LIMIT_KEY, '');
}

export const PARENTAL_MIN_GAMES = MIN_GAMES;
