import { createBoard, getValidMoves, applyMove, countPieces, isGameOver, getFlips } from '../logic/reversi/gameEngine';
import { getAIMove } from '../logic/reversi/aiPlayer';

describe('Reversi Engine', () => {
  it('creates a valid 8x8 board', () => {
    const board = createBoard(8);
    expect(board.length).toBe(8);
    expect(board[0].length).toBe(8);
    const pieces = countPieces(board);
    expect(pieces.black).toBe(2);
    expect(pieces.white).toBe(2);
  });

  it('initial center pieces are placed correctly', () => {
    const board = createBoard(8);
    expect(board[3][3]).toBe(2); // white
    expect(board[3][4]).toBe(1); // black
    expect(board[4][3]).toBe(1); // black
    expect(board[4][4]).toBe(2); // white
  });

  it('finds valid moves for black on initial board', () => {
    const board = createBoard(8);
    const moves = getValidMoves(board, 1);
    expect(moves.length).toBe(4);
  });

  it('getFlips returns correct flips', () => {
    const board = createBoard(8);
    const flips = getFlips(board, 2, 3, 1); // black places at (2,3)
    expect(flips.length).toBeGreaterThan(0);
  });

  it('applyMove flips opponent pieces', () => {
    const board = createBoard(8);
    const newBoard = applyMove(board, 2, 3, 1);
    expect(newBoard[2][3]).toBe(1);
    expect(newBoard[3][3]).toBe(1); // flipped from white to black
    const pieces = countPieces(newBoard);
    expect(pieces.black).toBe(4);
    expect(pieces.white).toBe(1);
  });

  it('game is not over at start', () => {
    const board = createBoard(8);
    expect(isGameOver(board)).toBe(false);
  });

  it('getFlips returns empty for occupied cell', () => {
    const board = createBoard(8);
    const flips = getFlips(board, 3, 3, 1);
    expect(flips.length).toBe(0);
  });

  it('works with 6x6 board', () => {
    const board = createBoard(6);
    expect(board.length).toBe(6);
    const pieces = countPieces(board);
    expect(pieces.black + pieces.white).toBe(4);
  });
});

describe('Reversi AI', () => {
  it('returns a valid move for all difficulties', () => {
    const board = createBoard(8);
    for (const diff of ['easy', 'medium', 'hard']) {
      const move = getAIMove(board, diff);
      if (move) {
        const [r, c] = move;
        expect(r).toBeGreaterThanOrEqual(0);
        expect(r).toBeLessThan(8);
        expect(c).toBeGreaterThanOrEqual(0);
        expect(c).toBeLessThan(8);
        expect(getFlips(board, r, c, 2).length).toBeGreaterThan(0);
      }
    }
  });
});
