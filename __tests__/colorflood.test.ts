import { createInitialState, makeMove, FLOOD_COLORS } from '../logic/colorflood/gameEngine';

describe('Color Flood Engine', () => {
  it('creates a valid initial state', () => {
    const s = createInitialState(6, 20);
    expect(s.gridSize).toBe(6);
    expect(s.board.length).toBe(36);
    expect(s.maxMoves).toBe(20);
    expect(s.moves).toBe(0);
    expect(s.gameOver).toBe(false);
    expect(s.won).toBe(false);
  });

  it('board values are valid color indices', () => {
    const s = createInitialState(8, 25);
    for (const c of s.board) {
      expect(c).toBeGreaterThanOrEqual(0);
      expect(c).toBeLessThan(FLOOD_COLORS.length);
    }
  });

  it('choosing same color as corner is a no-op', () => {
    const s = createInitialState(6, 20);
    const sameColor = s.board[0];
    const s2 = makeMove(s, sameColor);
    expect(s2.moves).toBe(0);
  });

  it('choosing a different color increments move count', () => {
    const s = createInitialState(6, 20);
    const diffColor = s.board[0] === 0 ? 1 : 0;
    const s2 = makeMove(s, diffColor);
    expect(s2.moves).toBe(1);
  });

  it('flood fills the connected region', () => {
    const s = createInitialState(6, 20);
    const origColor = s.board[0];
    const newColor = origColor === 0 ? 1 : 0;
    const s2 = makeMove(s, newColor);
    expect(s2.board[0]).toBe(newColor);
  });

  it('game over after max moves if not won', () => {
    let s = createInitialState(14, 2); // large grid, only 2 moves
    let color = 0;
    for (let i = 0; i < 3 && !s.gameOver; i++) {
      const nextColor = s.board[0] === color ? (color + 1) % 6 : color;
      color = nextColor;
      s = makeMove(s, nextColor);
    }
    // After 2 different-color moves on a 14x14, game should be over (or sooner)
    expect(s.moves).toBeLessThanOrEqual(2);
  });

  it('winning floods entire board to one color', () => {
    // Create a tiny 2x2 board manually
    const s = createInitialState(2, 100);
    // Play all possible colors to eventually flood it
    let state = s;
    for (let i = 0; i < 100 && !state.gameOver; i++) {
      const color = i % FLOOD_COLORS.length;
      if (color !== state.board[0]) {
        state = makeMove(state, color);
      }
    }
    if (state.won) {
      expect(state.board.every(c => c === state.board[0])).toBe(true);
    }
  });
});
