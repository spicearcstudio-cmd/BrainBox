import { Platform } from 'react-native';

const BANNER_ID = Platform.select({
  android: 'ca-app-pub-3940256099942544/6300978111',
  ios: 'ca-app-pub-3940256099942544/2934735716',
}) ?? '';

const INTERSTITIAL_ID = Platform.select({
  android: 'ca-app-pub-3940256099942544/1033173712',
  ios: 'ca-app-pub-3940256099942544/4411468910',
}) ?? '';

const REWARDED_ID = Platform.select({
  android: 'ca-app-pub-3940256099942544/5224354917',
  ios: 'ca-app-pub-3940256099942544/1712485313',
}) ?? '';

export { BANNER_ID, INTERSTITIAL_ID, REWARDED_ID };

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

function loadGMA(): any | null {
  try { return require('react-native-google-mobile-ads'); } catch { return null; }
}

export async function showInterstitialAd(isPremium: boolean): Promise<void> {
  if (isPremium || !shouldShowInterstitial(isPremium)) return;
  const gma = loadGMA();
  if (!gma) return;
  try {
    const ad = gma.InterstitialAd.createForAdRequest(INTERSTITIAL_ID);
    return new Promise<void>((resolve) => {
      ad.addAdEventListener(gma.AdEventType.LOADED, () => ad.show());
      ad.addAdEventListener(gma.AdEventType.CLOSED, () => resolve());
      ad.addAdEventListener(gma.AdEventType.ERROR, () => resolve());
      ad.load();
      setTimeout(resolve, 5000);
    });
  } catch { /* Ad SDK error */ }
}

export async function showRewardedAd(): Promise<boolean> {
  const gma = loadGMA();
  if (!gma) return false;
  try {
    const ad = gma.RewardedAd.createForAdRequest(REWARDED_ID);
    return new Promise<boolean>((resolve) => {
      ad.addAdEventListener(gma.RewardedAdEventType.LOADED, () => ad.show());
      ad.addAdEventListener(gma.RewardedAdEventType.EARNED_REWARD, () => resolve(true));
      ad.addAdEventListener('closed', () => resolve(false));
      ad.load();
      setTimeout(() => resolve(false), 10000);
    });
  } catch {
    return false;
  }
}
