export type Cell = 0 | 1 | 2; // 0=empty, 1=black(human), 2=white(ai)
export type Board = Cell[][];

const DIRS = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];

export function createBoard(size: number): Board {
  const board: Board = Array.from({ length: size }, () => Array(size).fill(0));
  const mid = Math.floor(size / 2);
  board[mid - 1][mid - 1] = 2;
  board[mid - 1][mid] = 1;
  board[mid][mid - 1] = 1;
  board[mid][mid] = 2;
  return board;
}

export function getFlips(board: Board, row: number, col: number, player: Cell): [number, number][] {
  if (board[row][col] !== 0) return [];
  const size = board.length;
  const opp: Cell = player === 1 ? 2 : 1;
  const allFlips: [number, number][] = [];

  for (const [dr, dc] of DIRS) {
    const lineFlips: [number, number][] = [];
    let r = row + dr, c = col + dc;
    while (r >= 0 && r < size && c >= 0 && c < size && board[r][c] === opp) {
      lineFlips.push([r, c]);
      r += dr;
      c += dc;
    }
    if (lineFlips.length > 0 && r >= 0 && r < size && c >= 0 && c < size && board[r][c] === player) {
      allFlips.push(...lineFlips);
    }
  }
  return allFlips;
}

export function getValidMoves(board: Board, player: Cell): [number, number][] {
  const moves: [number, number][] = [];
  const size = board.length;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (getFlips(board, r, c, player).length > 0) {
        moves.push([r, c]);
      }
    }
  }
  return moves;
}

export function applyMove(board: Board, row: number, col: number, player: Cell): Board {
  const newBoard = board.map(r => [...r]);
  const flips = getFlips(board, row, col, player);
  newBoard[row][col] = player;
  for (const [fr, fc] of flips) {
    newBoard[fr][fc] = player;
  }
  return newBoard;
}

export function countPieces(board: Board): { black: number; white: number } {
  let black = 0, white = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell === 1) black++;
      else if (cell === 2) white++;
    }
  }
  return { black, white };
}

export function isGameOver(board: Board): boolean {
  return getValidMoves(board, 1).length === 0 && getValidMoves(board, 2).length === 0;
}
