export type Grid = number[][];
export type Direction = 'up' | 'down' | 'left' | 'right';

export function createGrid(size: number): Grid {
  const grid: Grid = Array.from({ length: size }, () => Array(size).fill(0));
  spawnTile(grid);
  spawnTile(grid);
  return grid;
}

export function spawnTile(grid: Grid): boolean {
  const empty: [number, number][] = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === 0) empty.push([r, c]);
    }
  }
  if (empty.length === 0) return false;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  return true;
}

function slideRow(row: number[]): { newRow: number[]; score: number; moved: boolean } {
  const filtered = row.filter(v => v !== 0);
  const merged: number[] = [];
  let score = 0;
  let i = 0;

  while (i < filtered.length) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      const val = filtered[i] * 2;
      merged.push(val);
      score += val;
      i += 2;
    } else {
      merged.push(filtered[i]);
      i++;
    }
  }

  while (merged.length < row.length) merged.push(0);
  const moved = row.some((v, idx) => v !== merged[idx]);
  return { newRow: merged, score, moved };
}

export function move(grid: Grid, dir: Direction): { newGrid: Grid; score: number; moved: boolean } {
  const size = grid.length;
  let totalScore = 0;
  let anyMoved = false;
  const newGrid: Grid = grid.map(r => [...r]);

  if (dir === 'left') {
    for (let r = 0; r < size; r++) {
      const { newRow, score, moved } = slideRow(newGrid[r]);
      newGrid[r] = newRow;
      totalScore += score;
      if (moved) anyMoved = true;
    }
  } else if (dir === 'right') {
    for (let r = 0; r < size; r++) {
      const { newRow, score, moved } = slideRow([...newGrid[r]].reverse());
      newGrid[r] = newRow.reverse();
      totalScore += score;
      if (moved) anyMoved = true;
    }
  } else if (dir === 'up') {
    for (let c = 0; c < size; c++) {
      const col = [];
      for (let r = 0; r < size; r++) col.push(newGrid[r][c]);
      const { newRow, score, moved } = slideRow(col);
      for (let r = 0; r < size; r++) newGrid[r][c] = newRow[r];
      totalScore += score;
      if (moved) anyMoved = true;
    }
  } else {
    for (let c = 0; c < size; c++) {
      const col = [];
      for (let r = 0; r < size; r++) col.push(newGrid[r][c]);
      const { newRow, score, moved } = slideRow(col.reverse());
      const reversed = newRow.reverse();
      for (let r = 0; r < size; r++) newGrid[r][c] = reversed[r];
      totalScore += score;
      if (moved) anyMoved = true;
    }
  }

  return { newGrid, score: totalScore, moved: anyMoved };
}

export function canMove(grid: Grid): boolean {
  const size = grid.length;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === 0) return true;
      if (c + 1 < size && grid[r][c] === grid[r][c + 1]) return true;
      if (r + 1 < size && grid[r][c] === grid[r + 1][c]) return true;
    }
  }
  return false;
}

export function hasWon(grid: Grid): boolean {
  for (const row of grid) {
    for (const cell of row) {
      if (cell >= 2048) return true;
    }
  }
  return false;
}

export function getHighestTile(grid: Grid): number {
  let max = 0;
  for (const row of grid) {
    for (const cell of row) {
      if (cell > max) max = cell;
    }
  }
  return max;
}
