import { loadData, saveData } from './storage';

const HINTS_KEY = 'rewarded_hints';
const UNDOS_KEY = 'rewarded_undos';

export interface RewardedAdResult {
  type: 'hint' | 'undo';
  granted: boolean;
}

export async function showRewardedAd(rewardType: 'hint' | 'undo'): Promise<RewardedAdResult> {
  // Placeholder: In production, this would show a real AdMob rewarded ad
  // For now, simulate a successful ad view
  const key = rewardType === 'hint' ? HINTS_KEY : UNDOS_KEY;
  const current = parseInt(await loadData(key) ?? '0', 10);
  await saveData(key, String(current + 1));
  return { type: rewardType, granted: true };
}

export async function getRewardedCount(type: 'hint' | 'undo'): Promise<number> {
  const key = type === 'hint' ? HINTS_KEY : UNDOS_KEY;
  return parseInt(await loadData(key) ?? '0', 10);
}

export async function useReward(type: 'hint' | 'undo'): Promise<boolean> {
  const key = type === 'hint' ? HINTS_KEY : UNDOS_KEY;
  const count = parseInt(await loadData(key) ?? '0', 10);
  if (count <= 0) return false;
  await saveData(key, String(count - 1));
  return true;
}

export async function getFreeUndosRemaining(): Promise<number> {
  const key = 'free_undo_today';
  const dateKey = 'free_undo_date';
  const today = new Date().toISOString().slice(0, 10);
  const storedDate = await loadData(dateKey);

  if (storedDate !== today) {
    await saveData(dateKey, today);
    await saveData(key, '1');
    return 1;
  }

  return parseInt(await loadData(key) ?? '0', 10);
}

export async function useFreeUndo(): Promise<boolean> {
  const remaining = await getFreeUndosRemaining();
  if (remaining <= 0) return false;
  const key = 'free_undo_today';
  await saveData(key, String(remaining - 1));
  return true;
}
