import { TTTState, getAvailableMoves, makeMove } from './gameEngine';

function pick<T>(a: T[]): T { return a[Math.floor(Math.random() * a.length)]; }

function minimax(s: TTTState, depth: number, isMax: boolean, alpha: number, beta: number): number {
  if (s.winner === 'ai') return 10 - depth;
  if (s.winner === 'human') return depth - 10;
  if (s.gameOver) return 0;
  if (depth > 6) return 0;

  const moves = getAvailableMoves(s);
  if (isMax) {
    let best = -Infinity;
    for (const m of moves) {
      const next = makeMove({ ...s, currentPlayer: 'ai' }, m);
      best = Math.max(best, minimax(next, depth + 1, false, alpha, beta));
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const m of moves) {
      const next = makeMove({ ...s, currentPlayer: 'human' }, m);
      best = Math.min(best, minimax(next, depth + 1, true, alpha, beta));
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return best;
  }
}

export function getAIMove(s: TTTState, difficulty: string): number {
  const moves = getAvailableMoves(s);
  if (moves.length <= 1) return moves[0];

  if (difficulty === 'easy') return pick(moves);

  if (s.gridSize <= 3 && difficulty === 'hard') {
    let bestScore = -Infinity, bestMove = moves[0];
    for (const m of moves) {
      const next = makeMove({ ...s, currentPlayer: 'ai' }, m);
      const score = minimax(next, 0, false, -Infinity, Infinity);
      if (score > bestScore) { bestScore = score; bestMove = m; }
    }
    return bestMove;
  }

  // Heuristic for medium and large boards: win > block > center > random
  const g = s.gridSize;
  for (const m of moves) {
    const next = makeMove({ ...s, currentPlayer: 'ai' }, m);
    if (next.winner === 'ai') return m;
  }
  for (const m of moves) {
    const next = makeMove({ ...s, currentPlayer: 'human' }, m);
    if (next.winner === 'human') return m;
  }
  const center = Math.floor(g / 2) * g + Math.floor(g / 2);
  if (moves.includes(center)) return center;
  return pick(moves);
}
