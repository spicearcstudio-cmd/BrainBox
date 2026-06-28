export const FLOOD_COLORS = ['#EF5350', '#42A5F5', '#66BB6A', '#FFA726', '#AB47BC', '#FFEE58'];

export interface FloodState {
  gridSize: number;
  board: number[];
  moves: number;
  maxMoves: number;
  gameOver: boolean;
  won: boolean;
}

export function createInitialState(gridSize: number, maxMoves: number): FloodState {
  const total = gridSize * gridSize;
  const board = Array.from({ length: total }, () => Math.floor(Math.random() * 6));
  return { gridSize, board, moves: 0, maxMoves, gameOver: false, won: false };
}

function floodFill(board: number[], gridSize: number, newColor: number): number[] {
  const result = [...board];
  const oldColor = result[0];
  if (oldColor === newColor) return result;

  const stack = [0];
  const visited = new Set<number>();
  visited.add(0);

  while (stack.length) {
    const idx = stack.pop()!;
    result[idx] = newColor;
    const r = Math.floor(idx / gridSize), c = idx % gridSize;

    for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= gridSize || nc < 0 || nc >= gridSize) continue;
      const ni = nr * gridSize + nc;
      if (!visited.has(ni) && result[ni] === oldColor) {
        visited.add(ni);
        stack.push(ni);
      }
    }
  }
  return result;
}

export function makeMove(s: FloodState, colorIdx: number): FloodState {
  if (s.gameOver || colorIdx === s.board[0]) return s;

  const board = floodFill(s.board, s.gridSize, colorIdx);
  const moves = s.moves + 1;
  const won = board.every(c => c === board[0]);
  const gameOver = won || moves >= s.maxMoves;

  return { ...s, board, moves, gameOver, won };
}
