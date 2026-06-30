import { Board, Cell, getValidMoves, applyMove, countPieces, getFlips } from './gameEngine';

const CORNER_BONUS = 25;
const EDGE_BONUS = 5;
const CORNER_ADJ_PENALTY = -10;

function positionScore(row: number, col: number, size: number): number {
  const isCorner = (row === 0 || row === size - 1) && (col === 0 || col === size - 1);
  if (isCorner) return CORNER_BONUS;

  const isEdge = row === 0 || row === size - 1 || col === 0 || col === size - 1;
  if (isEdge) return EDGE_BONUS;

  const adjCorner =
    (row <= 1 && col <= 1) || (row <= 1 && col >= size - 2) ||
    (row >= size - 2 && col <= 1) || (row >= size - 2 && col >= size - 2);
  if (adjCorner) return CORNER_ADJ_PENALTY;

  return 0;
}

function evaluate(board: Board, aiPlayer: Cell): number {
  const size = board.length;
  const opp: Cell = aiPlayer === 1 ? 2 : 1;
  const pieces = countPieces(board);
  const myPieces = aiPlayer === 1 ? pieces.black : pieces.white;
  const oppPieces = aiPlayer === 1 ? pieces.white : pieces.black;

  let score = (myPieces - oppPieces) * 2;

  const myMoves = getValidMoves(board, aiPlayer).length;
  const oppMoves = getValidMoves(board, opp).length;
  score += (myMoves - oppMoves) * 3;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === aiPlayer) score += positionScore(r, c, size);
      else if (board[r][c] === opp) score -= positionScore(r, c, size);
    }
  }

  return score;
}

function minimax(board: Board, depth: number, alpha: number, beta: number, maximizing: boolean, aiPlayer: Cell): number {
  const opp: Cell = aiPlayer === 1 ? 2 : 1;
  const current = maximizing ? aiPlayer : opp;
  const moves = getValidMoves(board, current);

  if (depth === 0 || moves.length === 0) {
    if (moves.length === 0) {
      const otherMoves = getValidMoves(board, maximizing ? opp : aiPlayer);
      if (otherMoves.length === 0) {
        const pieces = countPieces(board);
        const my = aiPlayer === 1 ? pieces.black : pieces.white;
        const op = aiPlayer === 1 ? pieces.white : pieces.black;
        return my > op ? 1000 : my < op ? -1000 : 0;
      }
      return minimax(board, depth, alpha, beta, !maximizing, aiPlayer);
    }
    return evaluate(board, aiPlayer);
  }

  if (maximizing) {
    let best = -Infinity;
    for (const [r, c] of moves) {
      const nb = applyMove(board, r, c, current);
      best = Math.max(best, minimax(nb, depth - 1, alpha, beta, false, aiPlayer));
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const [r, c] of moves) {
      const nb = applyMove(board, r, c, current);
      best = Math.min(best, minimax(nb, depth - 1, alpha, beta, true, aiPlayer));
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return best;
  }
}

export function getAIMove(board: Board, difficulty: string): [number, number] | null {
  const aiPlayer: Cell = 2;
  const moves = getValidMoves(board, aiPlayer);
  if (moves.length === 0) return null;

  if (difficulty === 'easy') {
    // Greedy: pick move with most flips, some randomness
    if (Math.random() < 0.3) return moves[Math.floor(Math.random() * moves.length)];
    let best = moves[0], bestFlips = 0;
    for (const [r, c] of moves) {
      const flips = getFlips(board, r, c, aiPlayer).length;
      if (flips > bestFlips) { bestFlips = flips; best = [r, c]; }
    }
    return best;
  }

  const depth = difficulty === 'hard' ? 5 : 3;
  let bestMove = moves[0];
  let bestScore = -Infinity;

  for (const [r, c] of moves) {
    const nb = applyMove(board, r, c, aiPlayer);
    const score = minimax(nb, depth - 1, -Infinity, Infinity, false, aiPlayer);
    if (score > bestScore) {
      bestScore = score;
      bestMove = [r, c];
    }
  }

  return bestMove;
}
