import { loadData, saveData } from './storage';
import { GameId } from '../constants/games';

export interface GameStats {
  played: number;
  won: number;
  lost: number;
  drawn: number;
  currentStreak: number;
  bestStreak: number;
  bestScore?: number;
  bestTurns?: number;
}

export interface AllStats {
  games: Partial<Record<GameId, GameStats>>;
  totalPlayed: number;
  totalWon: number;
  overallStreak: number;
  overallBestStreak: number;
}

const STATS_KEY = 'stats_v1';

function emptyStats(): GameStats {
  return { played: 0, won: 0, lost: 0, drawn: 0, currentStreak: 0, bestStreak: 0 };
}

function emptyAllStats(): AllStats {
  return { games: {}, totalPlayed: 0, totalWon: 0, overallStreak: 0, overallBestStreak: 0 };
}

let cachedStats: AllStats | null = null;

export async function loadStats(): Promise<AllStats> {
  if (cachedStats) return cachedStats;
  const raw = await loadData(STATS_KEY);
  cachedStats = raw ? JSON.parse(raw) : emptyAllStats();
  return cachedStats!;
}

async function persist() {
  if (cachedStats) await saveData(STATS_KEY, JSON.stringify(cachedStats));
}

export async function recordResult(
  gameId: GameId,
  result: 'win' | 'lose' | 'draw',
  extra?: { score?: number; turns?: number }
): Promise<AllStats> {
  const stats = await loadStats();
  if (!stats.games[gameId]) stats.games[gameId] = emptyStats();
  const g = stats.games[gameId]!;

  g.played++;
  stats.totalPlayed++;

  if (result === 'win') {
    g.won++;
    stats.totalWon++;
    g.currentStreak++;
    stats.overallStreak++;
    if (g.currentStreak > g.bestStreak) g.bestStreak = g.currentStreak;
    if (stats.overallStreak > stats.overallBestStreak) stats.overallBestStreak = stats.overallStreak;
  } else if (result === 'lose') {
    g.lost++;
    g.currentStreak = 0;
    stats.overallStreak = 0;
  } else {
    g.drawn++;
    g.currentStreak = 0;
    stats.overallStreak = 0;
  }

  if (extra?.score !== undefined) {
    if (g.bestScore === undefined || extra.score > g.bestScore) g.bestScore = extra.score;
  }
  if (extra?.turns !== undefined) {
    if (g.bestTurns === undefined || extra.turns < g.bestTurns) g.bestTurns = extra.turns;
  }

  await persist();
  return stats;
}

export async function getGameStats(gameId: GameId): Promise<GameStats> {
  const stats = await loadStats();
  return stats.games[gameId] ?? emptyStats();
}

export async function shouldPromptRating(): Promise<boolean> {
  const stats = await loadStats();
  return stats.totalWon >= 3 && stats.totalWon % 5 === 0;
}
