import { Platform } from 'react-native';
import { loadData, saveData } from './storage';

const NOTIF_ENABLED_KEY = 'notifications_enabled';
const NOTIF_SCHEDULED_KEY = 'notifications_scheduled_date';

export async function isNotificationsEnabled(): Promise<boolean> {
  return (await loadData(NOTIF_ENABLED_KEY)) === 'true';
}

export async function setNotificationsEnabled(val: boolean): Promise<void> {
  await saveData(NOTIF_ENABLED_KEY, String(val));
  if (val) {
    await scheduleDailyReminder();
  } else {
    await cancelScheduledNotifications();
  }
}

export async function scheduleDailyReminder(): Promise<void> {
  try {
    const Notifications = await import('expo-notifications');

    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') return;
    }

    await Notifications.cancelAllScheduledNotificationsAsync();

    // Daily challenge reminder at 9 AM
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '\uD83E\uDDE0 Daily Challenge Waiting!',
        body: 'Your daily brain puzzle is ready. Keep your streak alive!',
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 9,
        minute: 0,
      },
    });

    // Evening reminder at 8 PM
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '\uD83D\uDD25 Don\'t Break Your Streak!',
        body: 'You haven\'t played today. A quick game keeps the streak going!',
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 20,
        minute: 0,
      },
    });

    await saveData(NOTIF_SCHEDULED_KEY, new Date().toISOString());
  } catch {
    // expo-notifications not available (e.g. web)
  }
}

export async function cancelScheduledNotifications(): Promise<void> {
  try {
    const Notifications = await import('expo-notifications');
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {}
}

export async function requestPermissions(): Promise<boolean> {
  try {
    const Notifications = await import('expo-notifications');
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}
