import { Share } from 'react-native';
import { GameId } from '../constants/games';
import { loadData, saveData } from './storage';

const TOURNAMENT_KEY = 'weekly_tournament';
const TOURNAMENT_SCORES_KEY = 'weekly_tournament_scores';

export interface TournamentPuzzle {
  gameId: GameId;
  difficulty: string;
  seed: number;
  description: string;
}

export interface TournamentWeek {
  weekId: string;
  startDate: string;
  endDate: string;
  puzzles: TournamentPuzzle[];
}

export interface TournamentScore {
  puzzleIndex: number;
  score: number;
  stars: number;
  timeMs: number;
  completed: boolean;
}

export interface TournamentState {
  weekId: string;
  scores: TournamentScore[];
  totalScore: number;
  totalStars: number;
  completedCount: number;
}

function getWeekId(): string {
  const now = new Date();
  const jan1 = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - jan1.getTime()) / 86400000);
  const week = Math.ceil((days + jan1.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(week).padStart(2, '0')}`;
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

const TOURNAMENT_GAMES: { gameId: GameId; difficulty: string; desc: string }[] = [
  { gameId: 'tictactoe', difficulty: 'hard', desc: 'Tic Tac Toe 5x5 Hard' },
  { gameId: 'connectfour', difficulty: 'medium', desc: 'Connect Four Medium' },
  { gameId: 'memory', difficulty: 'hard', desc: 'Memory Match 4x5' },
  { gameId: 'colorflood', difficulty: 'medium', desc: 'Color Flood 10x10' },
  { gameId: 'dotsandboxes', difficulty: 'hard', desc: 'Dots & Boxes 6x6 Hard' },
  { gameId: 'reversi', difficulty: 'medium', desc: 'Reversi 8x8' },
  { gameId: 'twenty48', difficulty: 'medium', desc: '2048 Classic 4x4' },
];

export function getCurrentTournament(): TournamentWeek {
  const weekId = getWeekId();
  const seed = hashString(weekId);
  const rng = seededRandom(seed);

  const shuffled = [...TOURNAMENT_GAMES].sort(() => rng() - 0.5);
  const selected = shuffled.slice(0, 5);

  const puzzles: TournamentPuzzle[] = selected.map((g, i) => ({
    gameId: g.gameId,
    difficulty: g.difficulty,
    seed: Math.floor(rng() * 999999),
    description: g.desc,
  }));

  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return {
    weekId,
    startDate: monday.toISOString().split('T')[0],
    endDate: sunday.toISOString().split('T')[0],
    puzzles,
  };
}

export async function getTournamentState(): Promise<TournamentState> {
  const weekId = getWeekId();
  const raw = await loadData(TOURNAMENT_SCORES_KEY);
  if (raw) {
    try {
      const state: TournamentState = JSON.parse(raw);
      if (state.weekId === weekId) return state;
    } catch {}
  }
  return {
    weekId,
    scores: Array.from({ length: 5 }, (_, i) => ({
      puzzleIndex: i,
      score: 0,
      stars: 0,
      timeMs: 0,
      completed: false,
    })),
    totalScore: 0,
    totalStars: 0,
    completedCount: 0,
  };
}

export async function recordTournamentResult(
  puzzleIndex: number,
  score: number,
  stars: number,
  timeMs: number
): Promise<TournamentState> {
  const state = await getTournamentState();
  const existing = state.scores[puzzleIndex];

  if (!existing.completed || score > existing.score) {
    state.scores[puzzleIndex] = { puzzleIndex, score, stars, timeMs, completed: true };
  }

  state.totalScore = state.scores.reduce((sum, s) => sum + s.score, 0);
  state.totalStars = state.scores.reduce((sum, s) => sum + s.stars, 0);
  state.completedCount = state.scores.filter(s => s.completed).length;

  await saveData(TOURNAMENT_SCORES_KEY, JSON.stringify(state));
  return state;
}

export function getDaysRemaining(): number {
  const now = new Date();
  const dayOfWeek = now.getDay();
  return dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
}

export async function shareTournamentResults(): Promise<void> {
  const state = await getTournamentState();
  const tournament = getCurrentTournament();

  const starStr = state.scores.map(s =>
    s.completed ? '\u2B50'.repeat(s.stars) + '\u2606'.repeat(3 - s.stars) : '\u2796\u2796\u2796'
  ).join('\n');

  const message = `\uD83C\uDFC6 Brainio Weekly Tournament\nWeek: ${tournament.startDate} to ${tournament.endDate}\n\n${starStr}\n\nTotal: ${state.totalStars}/15 stars | ${state.completedCount}/5 completed\n\nCan you beat my score? Download Brainio!`;

  try {
    await Share.share({ message });
  } catch {}
}
