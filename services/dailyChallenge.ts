import { GameId } from '../constants/games';
import { loadData, saveData } from './storage';

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function dateToSeed(date: Date): number {
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();
  return y * 10000 + m * 100 + d;
}

export function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const DAILY_GAMES: GameId[] = ['dotsandboxes', 'tictactoe', 'connectfour', 'memory', 'colorflood'];

export interface DailyChallenge {
  dateKey: string;
  gameId: GameId;
  gameName: string;
  gridSize: number;
  gridCols?: number;
  seed: number;
  targetScore?: number;
  targetTurns?: number;
  description: string;
}

const GAME_NAMES: Record<GameId, string> = {
  dotsandboxes: 'Dots & Boxes',
  tictactoe: 'Tic Tac Toe',
  connectfour: 'Connect Four',
  memory: 'Memory Match',
  colorflood: 'Color Flood',
  reversi: 'Reversi',
  twenty48: '2048',
};

export function getDailyChallenge(): DailyChallenge {
  const dateKey = getTodayKey();
  const seed = dateToSeed(new Date());
  const rng = seededRandom(seed);

  const gameIdx = Math.floor(rng() * DAILY_GAMES.length);
  const gameId = DAILY_GAMES[gameIdx];

  let gridSize: number;
  let gridCols: number | undefined;
  let description: string;
  let targetScore: number | undefined;
  let targetTurns: number | undefined;

  switch (gameId) {
    case 'dotsandboxes':
      gridSize = 4 + Math.floor(rng() * 3);
      description = `Win on a ${gridSize}\u00D7${gridSize} board against Hard AI`;
      break;
    case 'tictactoe':
      gridSize = 3 + Math.floor(rng() * 2);
      description = `Beat the AI on a ${gridSize}\u00D7${gridSize} board`;
      break;
    case 'connectfour':
      gridSize = 6;
      gridCols = 7;
      description = `Win Connect Four against Medium AI`;
      break;
    case 'memory':
      gridSize = 3 + Math.floor(rng() * 2);
      gridCols = 4;
      targetTurns = gridSize * gridCols;
      description = `Match all pairs in under ${targetTurns} turns`;
      break;
    case 'colorflood':
      gridSize = 8 + Math.floor(rng() * 4);
      const maxMoves = Math.floor(gridSize * 1.8);
      targetScore = maxMoves;
      description = `Flood a ${gridSize}\u00D7${gridSize} board in ${maxMoves} moves`;
      break;
    default:
      gridSize = 4;
      description = 'Complete the daily challenge!';
  }

  return { dateKey, gameId, gameName: GAME_NAMES[gameId], gridSize, gridCols, seed, targetScore, targetTurns, description };
}

const DAILY_COMPLETED_KEY = 'daily_completed';

export async function isDailyChallengeCompleted(): Promise<boolean> {
  const val = await loadData(DAILY_COMPLETED_KEY);
  return val === getTodayKey();
}

export async function markDailyChallengeCompleted(): Promise<void> {
  await saveData(DAILY_COMPLETED_KEY, getTodayKey());
}

const DAILY_STREAK_KEY = 'daily_streak';
const DAILY_BEST_STREAK_KEY = 'daily_best_streak';

export async function getDailyStreak(): Promise<{ current: number; best: number }> {
  const cur = parseInt(await loadData(DAILY_STREAK_KEY) ?? '0', 10);
  const best = parseInt(await loadData(DAILY_BEST_STREAK_KEY) ?? '0', 10);
  return { current: cur, best };
}

export async function incrementDailyStreak(): Promise<void> {
  const { current, best } = await getDailyStreak();
  const newCur = current + 1;
  await saveData(DAILY_STREAK_KEY, String(newCur));
  if (newCur > best) await saveData(DAILY_BEST_STREAK_KEY, String(newCur));
}
