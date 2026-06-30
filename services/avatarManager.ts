import { loadData, saveData } from './storage';

const AVATAR_KEY = 'player_avatar';
const NAME_KEY = 'player_name';

export const AVATARS = [
  '\uD83D\uDE0E', '\uD83E\uDDD1\u200D\uD83D\uDE80', '\uD83E\uDDB8',
  '\uD83E\uDDD9', '\uD83E\uDDDA', '\uD83E\uDDB9', '\uD83D\uDC31',
  '\uD83D\uDC36', '\uD83E\uDD8A', '\uD83D\uDC3C', '\uD83E\uDD81',
  '\uD83D\uDC32', '\uD83E\uDD84', '\uD83D\uDC7D', '\uD83E\uDD16',
  '\uD83D\uDC7B', '\uD83D\uDC26', '\uD83E\uDD89', '\uD83D\uDC1D',
  '\uD83C\uDF1F', '\uD83D\uDD25', '\uD83C\uDF08', '\uD83D\uDC8E',
  '\uD83C\uDFAE', '\u26A1',
];

const DEFAULT_AVATAR = '\uD83D\uDE0E';
const DEFAULT_NAME = 'Player';

export async function getAvatar(): Promise<string> {
  return (await loadData(AVATAR_KEY)) || DEFAULT_AVATAR;
}

export async function setAvatar(avatar: string): Promise<void> {
  await saveData(AVATAR_KEY, avatar);
}

export async function getPlayerName(): Promise<string> {
  return (await loadData(NAME_KEY)) || DEFAULT_NAME;
}

export async function setPlayerName(name: string): Promise<void> {
  await saveData(NAME_KEY, name.trim().slice(0, 20) || DEFAULT_NAME);
}

export async function getPlayerProfile(): Promise<{ avatar: string; name: string }> {
  const [avatar, name] = await Promise.all([getAvatar(), getPlayerName()]);
  return { avatar, name };
}
