import { createInitialState, getAvailableMoves, makeMove, TTTState } from '../logic/tictactoe/gameEngine';
import { getAIMove } from '../logic/tictactoe/aiPlayer';

describe('Tic Tac Toe Engine', () => {
  it('creates a valid 3x3 initial state', () => {
    const s = createInitialState(3);
    expect(s.gridSize).toBe(3);
    expect(s.board.length).toBe(9);
    expect(s.board.every(c => c === null)).toBe(true);
    expect(s.currentPlayer).toBe('human');
    expect(s.gameOver).toBe(false);
  });

  it('lists all moves on empty board', () => {
    const s = createInitialState(3);
    expect(getAvailableMoves(s).length).toBe(9);
  });

  it('placing a piece removes it from available moves', () => {
    const s = makeMove(createInitialState(3), 0);
    expect(getAvailableMoves(s).length).toBe(8);
    expect(s.board[0]).toBe('human');
    expect(s.currentPlayer).toBe('ai');
  });

  it('does not allow placing on occupied cell', () => {
    const s = makeMove(createInitialState(3), 0);
    const s2 = makeMove(s, 0);
    expect(s2.board[0]).toBe('human');
  });

  it('detects a row win', () => {
    let s = createInitialState(3);
    // Human: 0,1,2 (top row) - AI: 3,4
    s = makeMove(s, 0); // human
    s = makeMove(s, 3); // ai
    s = makeMove(s, 1); // human
    s = makeMove(s, 4); // ai
    s = makeMove(s, 2); // human wins
    expect(s.gameOver).toBe(true);
    expect(s.winner).toBe('human');
  });

  it('detects a draw', () => {
    let s = createInitialState(3);
    // X O X / X O O / O X X  -> draw
    const moves = [0, 1, 2, 4, 3, 5, 7, 6, 8];
    for (const m of moves) s = makeMove(s, m);
    expect(s.gameOver).toBe(true);
    expect(s.winner).toBe('draw');
  });

  it('works with 5x5 grid', () => {
    const s = createInitialState(5);
    expect(s.board.length).toBe(25);
    expect(s.winLength).toBe(4);
  });
});

describe('Tic Tac Toe AI', () => {
  it('returns a valid move for all difficulties', () => {
    const s = { ...createInitialState(3), currentPlayer: 'ai' as const };
    for (const diff of ['easy', 'medium', 'hard']) {
      const move = getAIMove(s, diff);
      expect(move).toBeGreaterThanOrEqual(0);
      expect(move).toBeLessThan(9);
    }
  });

  it('blocks an obvious win on hard', () => {
    let s = createInitialState(3);
    s = makeMove(s, 0); // human top-left
    s = makeMove(s, 4); // ai center
    s = makeMove(s, 1); // human top-mid
    // AI must block 2 (top-right)
    const aiMove = getAIMove(s, 'hard');
    expect(aiMove).toBe(2);
  });
});
