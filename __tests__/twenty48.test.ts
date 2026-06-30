import { createGrid, move, canMove, hasWon, getHighestTile, spawnTile, Grid } from '../logic/twenty48/gameEngine';

describe('2048 Engine', () => {
  it('creates a 4x4 grid with 2 tiles', () => {
    const grid = createGrid(4);
    expect(grid.length).toBe(4);
    expect(grid[0].length).toBe(4);
    let filled = 0;
    for (const row of grid) for (const cell of row) if (cell > 0) filled++;
    expect(filled).toBe(2);
  });

  it('initial tiles are 2 or 4', () => {
    const grid = createGrid(4);
    for (const row of grid) {
      for (const cell of row) {
        if (cell > 0) expect([2, 4]).toContain(cell);
      }
    }
  });

  it('slide left merges matching tiles', () => {
    const grid: Grid = [
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { newGrid, score, moved } = move(grid, 'left');
    expect(newGrid[0][0]).toBe(4);
    expect(newGrid[0][1]).toBe(0);
    expect(score).toBe(4);
    expect(moved).toBe(true);
  });

  it('slide right pushes tiles right', () => {
    const grid: Grid = [
      [2, 0, 0, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { newGrid, score } = move(grid, 'right');
    expect(newGrid[0][3]).toBe(4);
    expect(score).toBe(4);
  });

  it('slide up merges vertically', () => {
    const grid: Grid = [
      [2, 0, 0, 0],
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { newGrid, score } = move(grid, 'up');
    expect(newGrid[0][0]).toBe(4);
    expect(newGrid[1][0]).toBe(0);
    expect(score).toBe(4);
  });

  it('slide down merges vertically', () => {
    const grid: Grid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [4, 0, 0, 0],
      [4, 0, 0, 0],
    ];
    const { newGrid, score } = move(grid, 'down');
    expect(newGrid[3][0]).toBe(8);
    expect(score).toBe(8);
  });

  it('no move when nothing can slide', () => {
    const grid: Grid = [
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { moved } = move(grid, 'left');
    expect(moved).toBe(false);
  });

  it('canMove detects available moves', () => {
    const grid: Grid = [
      [2, 4, 8, 16],
      [16, 8, 4, 2],
      [2, 4, 8, 16],
      [16, 8, 4, 2],
    ];
    expect(canMove(grid)).toBe(false);
  });

  it('canMove true when empty cell exists', () => {
    const grid: Grid = [
      [2, 4, 8, 16],
      [16, 8, 4, 2],
      [2, 4, 8, 16],
      [16, 8, 4, 0],
    ];
    expect(canMove(grid)).toBe(true);
  });

  it('canMove true when adjacent match exists', () => {
    const grid: Grid = [
      [2, 4, 8, 16],
      [16, 8, 4, 2],
      [2, 4, 8, 16],
      [16, 8, 4, 4],
    ];
    expect(canMove(grid)).toBe(true);
  });

  it('hasWon detects 2048 tile', () => {
    const grid: Grid = [
      [2048, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    expect(hasWon(grid)).toBe(true);
  });

  it('hasWon returns false without 2048', () => {
    const grid: Grid = [
      [1024, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    expect(hasWon(grid)).toBe(false);
  });

  it('getHighestTile returns max value', () => {
    const grid: Grid = [
      [2, 8, 0, 0],
      [0, 32, 0, 0],
      [0, 0, 512, 0],
      [0, 0, 0, 4],
    ];
    expect(getHighestTile(grid)).toBe(512);
  });

  it('spawnTile adds a tile to empty grid cell', () => {
    const grid: Grid = [
      [0, 0],
      [0, 0],
    ];
    const result = spawnTile(grid);
    expect(result).toBe(true);
    let filled = 0;
    for (const row of grid) for (const cell of row) if (cell > 0) filled++;
    expect(filled).toBe(1);
  });

  it('spawnTile returns false on full grid', () => {
    const grid: Grid = [
      [2, 4],
      [8, 16],
    ];
    expect(spawnTile(grid)).toBe(false);
  });
});
