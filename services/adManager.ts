import { Platform } from 'react-native';

// Test ad unit IDs from Google (replace with your real IDs before production release)
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

export async function showInterstitialAd(isPremium: boolean): Promise<void> {
  if (isPremium) return;
  if (!shouldShowInterstitial(isPremium)) return;
  try {
    const { InterstitialAd, AdEventType } = await import('react-native-google-mobile-ads');
    const ad = InterstitialAd.createForAdRequest(INTERSTITIAL_ID);
    return new Promise<void>((resolve) => {
      ad.addAdEventListener(AdEventType.LOADED, () => ad.show());
      ad.addAdEventListener(AdEventType.CLOSED, () => resolve());
      ad.addAdEventListener(AdEventType.ERROR, () => resolve());
      ad.load();
      setTimeout(resolve, 5000);
    });
  } catch {
    // Ad SDK not available
  }
}

export async function showRewardedAd(): Promise<boolean> {
  try {
    const { RewardedAd, RewardedAdEventType } = await import('react-native-google-mobile-ads');
    const ad = RewardedAd.createForAdRequest(REWARDED_ID);
    return new Promise<boolean>((resolve) => {
      ad.addAdEventListener(RewardedAdEventType.LOADED, () => ad.show());
      ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => resolve(true));
      ad.addAdEventListener('closed' as any, () => resolve(false));
      ad.load();
      setTimeout(() => resolve(false), 10000);
    });
  } catch {
    return false;
  }
}
