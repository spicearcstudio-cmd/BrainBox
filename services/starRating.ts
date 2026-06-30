import { GameId } from '../constants/games';
import { loadData, saveData } from './storage';

const STARS_KEY = 'star_ratings';

export function calculateStars(
  gameId: GameId,
  result: 'win' | 'lose' | 'draw',
  extra?: { score?: number; opponentScore?: number; turns?: number; maxTurns?: number; movesLeft?: number }
): number {
  if (result === 'lose') return 0;
  if (result === 'draw') return 1;

  switch (gameId) {
    case 'dotsandboxes': {
      if (!extra?.score || !extra?.opponentScore) return 2;
      const margin = extra.score - extra.opponentScore;
      const total = extra.score + extra.opponentScore;
      return (margin / total) >= 0.5 ? 3 : 2;
    }
    case 'tictactoe':
      return 3; // winning tic-tac-toe against AI is always impressive
    case 'connectfour': {
      if (!extra?.turns) return 2;
      return extra.turns <= 10 ? 3 : 2;
    }
    case 'memory': {
      if (!extra?.turns || !extra?.maxTurns) return 2;
      const efficiency = extra.turns / extra.maxTurns;
      return efficiency <= 0.5 ? 3 : efficiency <= 0.75 ? 2 : 1;
    }
    case 'colorflood': {
      if (!extra?.movesLeft) return extra?.movesLeft === 0 ? 1 : 2;
      return extra.movesLeft >= 5 ? 3 : extra.movesLeft >= 2 ? 2 : 1;
    }
    default:
      return 2;
  }
}

export async function recordStars(stars: number): Promise<number> {
  if (stars < 3) return await getThreeStarCount();
  const current = await getThreeStarCount();
  const newCount = current + 1;
  await saveData(STARS_KEY, String(newCount));
  return newCount;
}

export async function getThreeStarCount(): Promise<number> {
  return parseInt(await loadData(STARS_KEY) ?? '0', 10);
}
