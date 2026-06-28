import { Player } from '../../constants/games';

export interface C4State {
  rows: number;
  cols: number;
  board: (Player | null)[];
  currentPlayer: Player;
  gameOver: boolean;
  winner: Player | 'draw' | null;
  lastMove: number | null;
}

export function createInitialState(rows: number, cols: number): C4State {
  return {
    rows, cols,
    board: Array(rows * cols).fill(null),
    currentPlayer: 'human',
    gameOver: false,
    winner: null,
    lastMove: null,
  };
}

export function getAvailableCols(s: C4State): number[] {
  const cols: number[] = [];
  for (let c = 0; c < s.cols; c++)
    if (!s.board[c]) cols.push(c);
  return cols;
}

function lowestEmptyRow(s: C4State, col: number): number {
  for (let r = s.rows - 1; r >= 0; r--)
    if (!s.board[r * s.cols + col]) return r;
  return -1;
}

function checkWin(board: (Player | null)[], rows: number, cols: number): Player | null {
  const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const p = board[r * cols + c];
      if (!p) continue;
      for (const [dr, dc] of dirs) {
        let count = 1;
        for (let k = 1; k < 4; k++) {
          const nr = r + dr * k, nc = c + dc * k;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) break;
          if (board[nr * cols + nc] !== p) break;
          count++;
        }
        if (count >= 4) return p;
      }
    }
  }
  return null;
}

export function makeMove(s: C4State, col: number): C4State {
  if (s.gameOver) return s;
  const row = lowestEmptyRow(s, col);
  if (row < 0) return s;

  const board = [...s.board];
  const idx = row * s.cols + col;
  board[idx] = s.currentPlayer;

  const winner = checkWin(board, s.rows, s.cols);
  const full = board.every(Boolean);

  return {
    rows: s.rows, cols: s.cols, board,
    currentPlayer: s.currentPlayer === 'human' ? 'ai' : 'human',
    gameOver: !!winner || full,
    winner: winner ?? (full ? 'draw' : null),
    lastMove: idx,
  };
}
