const SYMBOLS = [
  '\u2660', '\u2665', '\u2666', '\u2663',
  '\u2605', '\u263A', '\u266B', '\u2602',
  '\u2708', '\u269B', '\u2618', '\u2764',
];

export interface MemoryState {
  rows: number;
  cols: number;
  cards: string[];
  flipped: boolean[];
  matched: boolean[];
  firstPick: number | null;
  turns: number;
  gameOver: boolean;
  busy: boolean;
}

export function createInitialState(rows: number, cols: number): MemoryState {
  const total = rows * cols;
  const pairs = total / 2;
  const symbols = SYMBOLS.slice(0, pairs);
  const deck = [...symbols, ...symbols];

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return {
    rows, cols,
    cards: deck,
    flipped: Array(total).fill(false),
    matched: Array(total).fill(false),
    firstPick: null,
    turns: 0,
    gameOver: false,
    busy: false,
  };
}

export function flipCard(s: MemoryState, idx: number): MemoryState {
  if (s.flipped[idx] || s.matched[idx] || s.busy || s.gameOver) return s;

  const flipped = [...s.flipped];
  flipped[idx] = true;

  if (s.firstPick === null) {
    return { ...s, flipped, firstPick: idx };
  }

  const first = s.firstPick;
  const isMatch = s.cards[first] === s.cards[idx];
  const matched = [...s.matched];
  if (isMatch) {
    matched[first] = true;
    matched[idx] = true;
  }

  const allMatched = matched.every(Boolean);

  return {
    ...s,
    flipped,
    matched,
    firstPick: null,
    turns: s.turns + 1,
    gameOver: allMatched,
    busy: !isMatch,
  };
}

export function resetFlipped(s: MemoryState): MemoryState {
  const flipped = s.matched.map(m => m);
  return { ...s, flipped, busy: false };
}
