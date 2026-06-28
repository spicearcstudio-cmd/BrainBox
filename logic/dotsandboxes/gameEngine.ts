import { Player } from '../../constants/games';

export interface LineKey { type: 'h' | 'v'; row: number; col: number }
export const lk = (k: LineKey) => `${k.type}-${k.row}-${k.col}`;

export interface GameState {
  gridSize: number;
  lines: Map<string, Player>;
  boxes: Map<string, Player>;
  currentPlayer: Player;
  scores: { human: number; ai: number };
  gameOver: boolean;
  winner: Player | 'draw' | null;
  totalBoxes: number;
  totalLines: number;
}

export function createInitialState(gridSize: number): GameState {
  return {
    gridSize,
    lines: new Map(),
    boxes: new Map(),
    currentPlayer: 'human',
    scores: { human: 0, ai: 0 },
    gameOver: false,
    winner: null,
    totalBoxes: (gridSize - 1) ** 2,
    totalLines: gridSize * (gridSize - 1) * 2,
  };
}

export function getAvailableLines(s: GameState): LineKey[] {
  const a: LineKey[] = [];
  const g = s.gridSize;
  for (let r = 0; r < g; r++)
    for (let c = 0; c < g - 1; c++)
      if (!s.lines.has(lk({ type: 'h', row: r, col: c })))
        a.push({ type: 'h', row: r, col: c });
  for (let r = 0; r < g - 1; r++)
    for (let c = 0; c < g; c++)
      if (!s.lines.has(lk({ type: 'v', row: r, col: c })))
        a.push({ type: 'v', row: r, col: c });
  return a;
}

export function getBoxSidesCount(s: GameState, r: number, c: number): number {
  let n = 0;
  if (s.lines.has(lk({ type: 'h', row: r, col: c }))) n++;
  if (s.lines.has(lk({ type: 'h', row: r + 1, col: c }))) n++;
  if (s.lines.has(lk({ type: 'v', row: r, col: c }))) n++;
  if (s.lines.has(lk({ type: 'v', row: r, col: c + 1 }))) n++;
  return n;
}

function adjacentBoxes(line: LineKey, gridSize: number): [number, number][] {
  const res: [number, number][] = [];
  if (line.type === 'h') {
    if (line.row > 0) res.push([line.row - 1, line.col]);
    if (line.row < gridSize - 1) res.push([line.row, line.col]);
  } else {
    if (line.col > 0) res.push([line.row, line.col - 1]);
    if (line.col < gridSize - 1) res.push([line.row, line.col]);
  }
  return res;
}

export function makeMove(s: GameState, line: LineKey): GameState {
  const key = lk(line);
  if (s.lines.has(key) || s.gameOver) return s;

  const nl = new Map(s.lines);
  nl.set(key, s.currentPlayer);
  const nb = new Map(s.boxes);
  const ns = { ...s.scores };
  const tmp = { ...s, lines: nl };
  let completed = 0;

  for (const [br, bc] of adjacentBoxes(line, s.gridSize)) {
    const bk = `box-${br}-${bc}`;
    if (!s.boxes.has(bk) && getBoxSidesCount(tmp, br, bc) === 4) {
      nb.set(bk, s.currentPlayer);
      ns[s.currentPlayer]++;
      completed++;
    }
  }

  const allDrawn = nl.size === s.totalLines;
  let winner: Player | 'draw' | null = null;
  if (allDrawn) {
    winner = ns.human > ns.ai ? 'human' : ns.ai > ns.human ? 'ai' : 'draw';
  }

  return {
    gridSize: s.gridSize,
    lines: nl,
    boxes: nb,
    currentPlayer: completed > 0 ? s.currentPlayer : (s.currentPlayer === 'human' ? 'ai' : 'human'),
    scores: ns,
    gameOver: allDrawn,
    winner,
    totalBoxes: s.totalBoxes,
    totalLines: s.totalLines,
  };
}
