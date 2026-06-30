import { loadData, saveData } from './storage';
import { loadStats, AllStats } from './statsManager';
import { getProgression } from './progressionManager';

const WEEKLY_SNAPSHOT_KEY = 'weekly_snapshot';
const WEEKLY_DATE_KEY = 'weekly_date';

export interface WeeklyRecap {
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
  xpEarned: number;
  levelsGained: number;
  currentLevel: number;
  currentTitle: string;
  bestStreak: number;
  favoriteGame: string;
  hasData: boolean;
}

function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().slice(0, 10);
}

export async function getWeeklyRecap(): Promise<WeeklyRecap> {
  const currentStats = await loadStats();
  const progression = await getProgression();
  const weekStart = getWeekStart();
  const storedWeek = await loadData(WEEKLY_DATE_KEY);
  const snapshotRaw = await loadData(WEEKLY_SNAPSHOT_KEY);

  let snapshot: { totalPlayed: number; totalWon: number; xp: number; level: number } | null = null;
  if (snapshotRaw && storedWeek === weekStart) {
    try { snapshot = JSON.parse(snapshotRaw); } catch {}
  }

  if (!snapshot) {
    snapshot = {
      totalPlayed: currentStats.totalPlayed,
      totalWon: currentStats.totalWon,
      xp: progression.totalXP,
      level: progression.level,
    };
    await saveData(WEEKLY_DATE_KEY, weekStart);
    await saveData(WEEKLY_SNAPSHOT_KEY, JSON.stringify(snapshot));
  }

  const gamesPlayed = currentStats.totalPlayed - snapshot.totalPlayed;
  const gamesWon = currentStats.totalWon - snapshot.totalWon;
  const xpEarned = progression.totalXP - snapshot.xp;
  const levelsGained = progression.level - snapshot.level;

  let favGame = 'None';
  let maxPlayed = 0;
  for (const [id, gs] of Object.entries(currentStats.games)) {
    if (gs.played > maxPlayed) {
      maxPlayed = gs.played;
      favGame = id;
    }
  }

  const GAME_DISPLAY: Record<string, string> = {
    dotsandboxes: 'Dots & Boxes',
    tictactoe: 'Tic Tac Toe',
    connectfour: 'Connect Four',
    memory: 'Memory Match',
    colorflood: 'Color Flood',
    reversi: 'Reversi',
    twenty48: '2048',
  };

  return {
    gamesPlayed,
    gamesWon,
    winRate: gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0,
    xpEarned,
    levelsGained,
    currentLevel: progression.level,
    currentTitle: progression.title,
    bestStreak: currentStats.overallBestStreak,
    favoriteGame: GAME_DISPLAY[favGame] ?? favGame,
    hasData: gamesPlayed > 0,
  };
}
