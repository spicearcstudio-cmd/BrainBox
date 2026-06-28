import { Player } from '../../constants/games';

export interface TTTState {
  gridSize: number;
  winLength: number;
  board: (Player | null)[];
  currentPlayer: Player;
  gameOver: boolean;
  winner: Player | 'draw' | null;
}

export function createInitialState(gridSize: number): TTTState {
  return {
    gridSize,
    winLength: gridSize <= 3 ? 3 : 4,
    board: Array(gridSize * gridSize).fill(null),
    currentPlayer: 'human',
    gameOver: false,
    winner: null,
  };
}

export function getAvailableMoves(s: TTTState): number[] {
  return s.board.reduce<number[]>((acc, v, i) => { if (!v) acc.push(i); return acc; }, []);
}

function checkWinner(board: (Player | null)[], gridSize: number, winLen: number): Player | null {
  const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const p = board[r * gridSize + c];
      if (!p) continue;
      for (const [dr, dc] of dirs) {
        let count = 1;
        for (let k = 1; k < winLen; k++) {
          const nr = r + dr * k, nc = c + dc * k;
          if (nr < 0 || nr >= gridSize || nc < 0 || nc >= gridSize) break;
          if (board[nr * gridSize + nc] !== p) break;
          count++;
        }
        if (count >= winLen) return p;
      }
    }
  }
  return null;
}

export function makeMove(s: TTTState, idx: number): TTTState {
  if (s.board[idx] || s.gameOver) return s;
  const board = [...s.board];
  board[idx] = s.currentPlayer;

  const winner = checkWinner(board, s.gridSize, s.winLength);
  const full = board.every(Boolean);

  return {
    gridSize: s.gridSize,
    winLength: s.winLength,
    board,
    currentPlayer: s.currentPlayer === 'human' ? 'ai' : 'human',
    gameOver: !!winner || full,
    winner: winner ?? (full ? 'draw' : null),
  };
}
