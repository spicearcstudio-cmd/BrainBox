import { Player } from '../../constants/games';
import { GameState, LineKey, getAvailableLines, getBoxSidesCount, makeMove } from './gameEngine';

function adjacentBoxes(line: LineKey, gridSize: number): [number, number][] {
  const r: [number, number][] = [];
  if (line.type === 'h') {
    if (line.row > 0) r.push([line.row - 1, line.col]);
    if (line.row < gridSize - 1) r.push([line.row, line.col]);
  } else {
    if (line.col > 0) r.push([line.row, line.col - 1]);
    if (line.col < gridSize - 1) r.push([line.row, line.col]);
  }
  return r;
}

function completing(s: GameState, avail: LineKey[]): LineKey[] {
  return avail.filter(l =>
    adjacentBoxes(l, s.gridSize).some(([r, c]) => getBoxSidesCount(s, r, c) === 3));
}

function wouldGive(s: GameState, l: LineKey): boolean {
  return adjacentBoxes(l, s.gridSize).some(([r, c]) => getBoxSidesCount(s, r, c) === 2);
}

function pick<T>(a: T[]): T { return a[Math.floor(Math.random() * a.length)]; }

function chainCapture(s: GameState, p: Player): number {
  let n = 0, cur = s;
  for (;;) {
    const av = getAvailableLines(cur);
    const cm = completing(cur, av);
    if (!cm.length) break;
    cur = makeMove({ ...cur, currentPlayer: p }, cm[0]);
    n++;
  }
  return n;
}

export function getAIMove(s: GameState, difficulty: string): LineKey {
  const avail = getAvailableLines(s);
  if (avail.length <= 1) return avail[0];

  const comp = completing(s, avail);

  if (difficulty === 'easy') {
    if (comp.length && Math.random() < 0.35) return pick(comp);
    return pick(avail);
  }

  if (comp.length) return pick(comp);
  const safe = avail.filter(l => !wouldGive(s, l));

  if (difficulty === 'medium') {
    return safe.length && Math.random() < 0.75 ? pick(safe) : pick(avail);
  }

  if (safe.length) return pick(safe);

  let best = avail[0], least = Infinity;
  for (const l of avail) {
    const after = makeMove({ ...s, currentPlayer: 'ai' }, l);
    const dmg = chainCapture(after, 'human');
    if (dmg < least) { least = dmg; best = l; }
  }
  return best;
}
