import { createAudioPlayer, AudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { loadData, saveData } from './storage';

type SoundName = 'tap' | 'move' | 'match' | 'win' | 'lose' | 'drop';

const SOUND_FILES: Record<SoundName, any> = {
  tap: require('../assets/sounds/tap.wav'),
  move: require('../assets/sounds/move.wav'),
  match: require('../assets/sounds/match.wav'),
  win: require('../assets/sounds/win.wav'),
  lose: require('../assets/sounds/lose.wav'),
  drop: require('../assets/sounds/drop.wav'),
};

const players: Map<SoundName, AudioPlayer> = new Map();

let soundEnabled = true;
let hapticEnabled = true;
let loaded = false;

export async function initSound() {
  if (loaded) return;
  loaded = true;
  const sVal = await loadData('soundEnabled');
  const hVal = await loadData('hapticEnabled');
  if (sVal !== null) soundEnabled = sVal === 'true';
  if (hVal !== null) hapticEnabled = hVal === 'true';
}

export function isSoundEnabled() { return soundEnabled; }
export function isHapticEnabled() { return hapticEnabled; }

export async function setSoundEnabled(val: boolean) {
  soundEnabled = val;
  await saveData('soundEnabled', String(val));
}

export async function setHapticEnabled(val: boolean) {
  hapticEnabled = val;
  await saveData('hapticEnabled', String(val));
}

export async function playSound(name: SoundName) {
  if (!soundEnabled) return;
  try {
    let player = players.get(name);
    if (!player) {
      player = createAudioPlayer(SOUND_FILES[name]);
      players.set(name, player);
    }
    player.seekTo(0);
    player.play();
  } catch {
    // Silently fail if audio not available
  }
}

export function haptic(style: 'light' | 'medium' | 'heavy' = 'light') {
  if (!hapticEnabled) return;
  const map = {
    light: Haptics.ImpactFeedbackStyle.Light,
    medium: Haptics.ImpactFeedbackStyle.Medium,
    heavy: Haptics.ImpactFeedbackStyle.Heavy,
  };
  Haptics.impactAsync(map[style]).catch(() => {});
}

export function hapticNotification(type: 'success' | 'warning' | 'error' = 'success') {
  if (!hapticEnabled) return;
  const map = {
    success: Haptics.NotificationFeedbackType.Success,
    warning: Haptics.NotificationFeedbackType.Warning,
    error: Haptics.NotificationFeedbackType.Error,
  };
  Haptics.notificationAsync(map[type]).catch(() => {});
}
