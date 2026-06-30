import { createInitialState, getAvailableCols, makeMove, C4State } from '../logic/connectfour/gameEngine';

describe('Connect Four Engine', () => {
  it('creates a valid initial state', () => {
    const s = createInitialState(6, 7);
    expect(s.rows).toBe(6);
    expect(s.cols).toBe(7);
    expect(s.board.length).toBe(42);
    expect(s.board.every(c => c === null)).toBe(true);
    expect(s.currentPlayer).toBe('human');
  });

  it('all columns available on empty board', () => {
    const s = createInitialState(6, 7);
    expect(getAvailableCols(s).length).toBe(7);
  });

  it('piece drops to bottom of column', () => {
    const s = makeMove(createInitialState(6, 7), 0);
    // Bottom-left: row 5, col 0 = index 35
    expect(s.board[35]).toBe('human');
    expect(s.currentPlayer).toBe('ai');
  });

  it('pieces stack in same column', () => {
    let s = createInitialState(6, 7);
    s = makeMove(s, 0); // human -> row 5
    s = makeMove(s, 0); // ai    -> row 4
    expect(s.board[35]).toBe('human');
    expect(s.board[28]).toBe('ai');
  });

  it('column becomes unavailable when full', () => {
    let s = createInitialState(6, 7);
    for (let i = 0; i < 6; i++) s = makeMove(s, 0);
    expect(getAvailableCols(s).includes(0)).toBe(false);
  });

  it('detects vertical win', () => {
    let s = createInitialState(6, 7);
    // human: col 0, ai: col 1, repeat 4 times
    for (let i = 0; i < 4; i++) {
      s = makeMove(s, 0); // human
      if (i < 3) s = makeMove(s, 1); // ai
    }
    expect(s.gameOver).toBe(true);
    expect(s.winner).toBe('human');
  });

  it('detects horizontal win', () => {
    let s = createInitialState(6, 7);
    // human: cols 0-3, ai: stacks on col 6
    s = makeMove(s, 0); s = makeMove(s, 6);
    s = makeMove(s, 1); s = makeMove(s, 6);
    s = makeMove(s, 2); s = makeMove(s, 6);
    s = makeMove(s, 3);
    expect(s.gameOver).toBe(true);
    expect(s.winner).toBe('human');
  });
});
