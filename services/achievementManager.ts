import { loadData, saveData } from './storage';
import { GameId } from '../constants/games';

const ACHIEVEMENTS_KEY = 'achievements_unlocked';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: AchievementCheckData) => boolean;
}

export interface AchievementCheckData {
  totalWins: number;
  totalGames: number;
  currentStreak: number;
  bestStreak: number;
  dailyStreak: number;
  gamesPerType: Partial<Record<GameId, { wins: number; played: number }>>;
  stars3Count: number;
  level: number;
}

const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_win',       title: 'First Victory',    description: 'Win your first game',                icon: '\uD83C\uDFC6', condition: d => d.totalWins >= 1 },
  { id: 'ten_wins',        title: 'Getting Good',     description: 'Win 10 games',                       icon: '\uD83D\uDD25', condition: d => d.totalWins >= 10 },
  { id: 'fifty_wins',      title: 'Unstoppable',      description: 'Win 50 games',                       icon: '\u26A1',       condition: d => d.totalWins >= 50 },
  { id: 'hundred_wins',    title: 'Centurion',        description: 'Win 100 games',                      icon: '\uD83D\uDC51', condition: d => d.totalWins >= 100 },
  { id: 'streak_3',        title: 'Hat Trick',        description: 'Win 3 games in a row',               icon: '\uD83C\uDFA9', condition: d => d.bestStreak >= 3 },
  { id: 'streak_5',        title: 'On Fire',          description: 'Win 5 games in a row',               icon: '\uD83D\uDD25', condition: d => d.bestStreak >= 5 },
  { id: 'streak_10',       title: 'Legendary Streak', description: 'Win 10 games in a row',              icon: '\uD83C\uDF1F', condition: d => d.bestStreak >= 10 },
  { id: 'daily_7',         title: 'Dedicated',        description: 'Complete 7 daily challenges in a row', icon: '\uD83D\uDCC5', condition: d => d.dailyStreak >= 7 },
  { id: 'daily_30',        title: 'Monthly Master',   description: '30-day daily challenge streak',      icon: '\uD83D\uDCC6', condition: d => d.dailyStreak >= 30 },
  { id: 'all_games',       title: 'Well Rounded',     description: 'Win at least once in all 5 games',   icon: '\uD83C\uDF10',
    condition: d => {
      const ids: GameId[] = ['dotsandboxes', 'tictactoe', 'connectfour', 'memory', 'colorflood'];
      return ids.every(id => (d.gamesPerType[id]?.wins ?? 0) >= 1);
    }
  },
  { id: 'perfect_3',       title: 'Perfectionist',    description: 'Earn 3 stars on 3 different games',  icon: '\u2B50', condition: d => d.stars3Count >= 3 },
  { id: 'perfect_10',      title: 'Flawless',         description: 'Earn 3 stars 10 times',              icon: '\uD83C\uDF1F', condition: d => d.stars3Count >= 10 },
  { id: 'fifty_games',     title: 'Committed',        description: 'Play 50 games total',                icon: '\uD83C\uDFAE', condition: d => d.totalGames >= 50 },
  { id: 'level_5',         title: 'Rising Star',      description: 'Reach Level 5',                      icon: '\u2B50', condition: d => d.level >= 5 },
  { id: 'level_10',        title: 'Elite',            description: 'Reach Level 10',                     icon: '\uD83D\uDC8E', condition: d => d.level >= 10 },
  { id: 'level_25',        title: 'Reversi Master',   description: 'Reach Level 25 & unlock Reversi',    icon: '\u25D1', condition: d => d.level >= 25 },
  { id: 'level_50',        title: '2048 Legend',      description: 'Reach Level 50 & unlock 2048',       icon: '\u00B2', condition: d => d.level >= 50 },
  { id: 'two_hundred_wins', title: 'Unstoppable Force', description: 'Win 200 games',                    icon: '\uD83D\uDCAA', condition: d => d.totalWins >= 200 },
  { id: 'all_seven',       title: 'Completionist',    description: 'Win at least once in all 7 games',   icon: '\uD83C\uDFC5',
    condition: d => {
      const ids: GameId[] = ['dotsandboxes', 'tictactoe', 'connectfour', 'memory', 'colorflood', 'reversi', 'twenty48'];
      return ids.every(id => (d.gamesPerType[id]?.wins ?? 0) >= 1);
    }
  },
];

let unlockedIds: Set<string> = new Set();
let loaded = false;

async function ensureLoaded() {
  if (loaded) return;
  const raw = await loadData(ACHIEVEMENTS_KEY);
  if (raw) {
    try { unlockedIds = new Set(JSON.parse(raw)); } catch { unlockedIds = new Set(); }
  }
  loaded = true;
}

async function persist() {
  await saveData(ACHIEVEMENTS_KEY, JSON.stringify(Array.from(unlockedIds)));
}

export async function checkAchievements(data: AchievementCheckData): Promise<Achievement[]> {
  await ensureLoaded();
  const newlyUnlocked: Achievement[] = [];

  for (const a of ALL_ACHIEVEMENTS) {
    if (!unlockedIds.has(a.id) && a.condition(data)) {
      unlockedIds.add(a.id);
      newlyUnlocked.push(a);
    }
  }

  if (newlyUnlocked.length > 0) await persist();
  return newlyUnlocked;
}

export async function getAllAchievements(): Promise<{ achievement: Achievement; unlocked: boolean }[]> {
  await ensureLoaded();
  return ALL_ACHIEVEMENTS.map(a => ({ achievement: a, unlocked: unlockedIds.has(a.id) }));
}

export async function getUnlockedCount(): Promise<{ unlocked: number; total: number }> {
  await ensureLoaded();
  return { unlocked: unlockedIds.size, total: ALL_ACHIEVEMENTS.length };
}
