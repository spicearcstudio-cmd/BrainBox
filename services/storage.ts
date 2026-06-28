import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = '@brainbox:';

export async function saveData(key: string, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(PREFIX + key, value);
  } catch { /* ignore */ }
}

export async function loadData(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

export async function removeData(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(PREFIX + key);
  } catch { /* ignore */ }
}
