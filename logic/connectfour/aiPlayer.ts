import { C4State, getAvailableCols, makeMove } from './gameEngine';

function pick<T>(a: T[]): T { return a[Math.floor(Math.random() * a.length)]; }

export function getAIMove(s: C4State, difficulty: string): number {
  const cols = getAvailableCols(s);
  if (cols.length <= 1) return cols[0];

  // Always take winning move
  for (const c of cols) {
    const next = makeMove({ ...s, currentPlayer: 'ai' }, c);
    if (next.winner === 'ai') return c;
  }

  if (difficulty === 'easy' && Math.random() < 0.5) return pick(cols);

  // Block opponent's winning move
  for (const c of cols) {
    const next = makeMove({ ...s, currentPlayer: 'human' }, c);
    if (next.winner === 'human') return c;
  }

  if (difficulty === 'easy') return pick(cols);

  // Avoid moves that let opponent win next turn
  const safe = cols.filter(c => {
    const after = makeMove({ ...s, currentPlayer: 'ai' }, c);
    const oppCols = getAvailableCols(after);
    return !oppCols.some(oc => {
      const opp = makeMove({ ...after, currentPlayer: 'human' }, oc);
      return opp.winner === 'human';
    });
  });

  const pool = safe.length > 0 ? safe : cols;

  // Prefer center columns
  const center = Math.floor(s.cols / 2);
  pool.sort((a, b) => Math.abs(a - center) - Math.abs(b - center));

  if (difficulty === 'medium') {
    return pool.length > 2 ? pick(pool.slice(0, 3)) : pool[0];
  }

  return pool[0];
}
