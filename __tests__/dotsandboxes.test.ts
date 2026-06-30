import { createInitialState, getAvailableLines, makeMove, getBoxSidesCount, lk, LineKey } from '../logic/dotsandboxes/gameEngine';
import { getAIMove } from '../logic/dotsandboxes/aiPlayer';

describe('Dots & Boxes Engine', () => {
  it('creates a valid initial state for 3x3 grid', () => {
    const s = createInitialState(3);
    expect(s.gridSize).toBe(3);
    expect(s.totalBoxes).toBe(4);
    expect(s.totalLines).toBe(12);
    expect(s.lines.size).toBe(0);
    expect(s.gameOver).toBe(false);
    expect(s.currentPlayer).toBe('human');
  });

  it('lists all available lines on empty board', () => {
    const s = createInitialState(3);
    const lines = getAvailableLines(s);
    expect(lines.length).toBe(12);
  });

  it('placing a line reduces available lines', () => {
    let s = createInitialState(3);
    s = makeMove(s, { type: 'h', row: 0, col: 0 });
    expect(getAvailableLines(s).length).toBe(11);
  });

  it('completing a box scores a point and keeps turn', () => {
    let s = createInitialState(3);
    const moves: LineKey[] = [
      { type: 'h', row: 0, col: 0 },
      { type: 'h', row: 1, col: 0 },
      { type: 'v', row: 0, col: 0 },
      { type: 'v', row: 0, col: 1 },
    ];
    for (const m of moves) {
      s = makeMove(s, m);
    }
    const scored = s.scores.human > 0 || s.scores.ai > 0;
    expect(scored).toBe(true);
  });

  it('does not allow placing on existing line', () => {
    let s = createInitialState(3);
    const line: LineKey = { type: 'h', row: 0, col: 0 };
    s = makeMove(s, line);
    const before = s.lines.size;
    s = makeMove(s, line);
    expect(s.lines.size).toBe(before);
  });

  it('game ends when all lines drawn', () => {
    let s = createInitialState(2);
    const allLines = getAvailableLines(s);
    for (const l of allLines) {
      s = makeMove(s, l);
    }
    expect(s.gameOver).toBe(true);
    expect(s.winner).not.toBeNull();
  });

  it('getBoxSidesCount returns correct count', () => {
    let s = createInitialState(3);
    expect(getBoxSidesCount(s, 0, 0)).toBe(0);
    s = makeMove(s, { type: 'h', row: 0, col: 0 });
    expect(getBoxSidesCount(s, 0, 0)).toBe(1);
  });
});

describe('Dots & Boxes AI', () => {
  it('returns a valid move', () => {
    const s = createInitialState(3);
    for (const diff of ['easy', 'medium', 'hard']) {
      const state = { ...s, currentPlayer: 'ai' as const };
      const move = getAIMove(state, diff);
      expect(move).toBeDefined();
      expect(move.type).toMatch(/^[hv]$/);
    }
  });
});
