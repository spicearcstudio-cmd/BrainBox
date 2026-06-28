let gamesPlayed = 0;

export function recordGamePlayed(): void {
  gamesPlayed++;
}

export function shouldShowInterstitial(isPremium: boolean): boolean {
  if (isPremium) return false;
  return gamesPlayed > 0 && gamesPlayed % 3 === 0;
}

export function shouldShowBanner(isPremium: boolean): boolean {
  return !isPremium;
}
