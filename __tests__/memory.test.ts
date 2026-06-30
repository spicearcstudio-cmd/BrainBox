import { createInitialState, flipCard, resetFlipped } from '../logic/memory/gameEngine';

describe('Memory Match Engine', () => {
  it('creates a valid initial state', () => {
    const s = createInitialState(4, 4);
    expect(s.rows).toBe(4);
    expect(s.cols).toBe(4);
    expect(s.cards.length).toBe(16);
    expect(s.flipped.every(f => !f)).toBe(true);
    expect(s.matched.every(m => !m)).toBe(true);
    expect(s.turns).toBe(0);
    expect(s.gameOver).toBe(false);
  });

  it('each symbol appears exactly twice', () => {
    const s = createInitialState(4, 4);
    const counts = new Map<string, number>();
    for (const c of s.cards) counts.set(c, (counts.get(c) || 0) + 1);
    for (const [, count] of counts) expect(count).toBe(2);
  });

  it('flipping first card sets firstPick', () => {
    const s = createInitialState(4, 4);
    const s2 = flipCard(s, 0);
    expect(s2.flipped[0]).toBe(true);
    expect(s2.firstPick).toBe(0);
    expect(s2.turns).toBe(0);
  });

  it('flipping matching pair marks them matched', () => {
    const s = createInitialState(4, 4);
    const sym = s.cards[0];
    const pairIdx = s.cards.indexOf(sym, 1);
    let s2 = flipCard(s, 0);
    s2 = flipCard(s2, pairIdx);
    expect(s2.matched[0]).toBe(true);
    expect(s2.matched[pairIdx]).toBe(true);
    expect(s2.turns).toBe(1);
    expect(s2.busy).toBe(false);
  });

  it('flipping non-matching pair sets busy', () => {
    const s = createInitialState(4, 4);
    let firstSym = s.cards[0];
    let nonMatchIdx = s.cards.findIndex((c, i) => i > 0 && c !== firstSym);
    if (nonMatchIdx === -1) nonMatchIdx = 1;
    let s2 = flipCard(s, 0);
    s2 = flipCard(s2, nonMatchIdx);
    if (s.cards[nonMatchIdx] !== firstSym) {
      expect(s2.busy).toBe(true);
    }
  });

  it('resetFlipped clears non-matched flips', () => {
    const s = createInitialState(4, 4);
    let s2 = flipCard(s, 0);
    const nonMatch = s.cards.findIndex((c, i) => i > 0 && c !== s.cards[0]);
    if (nonMatch >= 0) {
      s2 = flipCard(s2, nonMatch);
      s2 = resetFlipped(s2);
      expect(s2.flipped[0]).toBe(false);
      expect(s2.busy).toBe(false);
    }
  });

  it('prevents flipping already flipped card', () => {
    const s = createInitialState(4, 4);
    const s2 = flipCard(s, 0);
    const s3 = flipCard(s2, 0);
    expect(s3.firstPick).toBe(0); // unchanged
  });

  it('game ends when all matched', () => {
    let s = createInitialState(2, 2); // 4 cards, 2 pairs
    const sym0 = s.cards[0];
    const pair0 = s.cards.indexOf(sym0, 1);
    s = flipCard(s, 0);
    s = flipCard(s, pair0);

    const remaining = s.cards.findIndex((_, i) => !s.matched[i]);
    if (remaining >= 0) {
      const sym1 = s.cards[remaining];
      const pair1 = s.cards.findIndex((c, i) => i !== remaining && c === sym1 && !s.matched[i]);
      if (pair1 >= 0) {
        s = flipCard(s, remaining);
        s = flipCard(s, pair1);
      }
    }
    expect(s.gameOver).toBe(true);
  });
});
