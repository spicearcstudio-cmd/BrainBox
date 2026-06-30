import { loadData, saveData } from './storage';

export interface BoardSkin {
  id: string;
  name: string;
  icon: string;
  unlockLevel: number;
  cellBg: string;
  cellBorder: string;
  cellText: string;
  boardBg: string;
  accentColor: string;
}

export const BOARD_SKINS: BoardSkin[] = [
  {
    id: 'default',
    name: 'Classic',
    icon: '\u2B50',
    unlockLevel: 1,
    cellBg: '#FFFFFF',
    cellBorder: '#E0D6F0',
    cellText: '#2D3436',
    boardBg: 'transparent',
    accentColor: '#5C6BC0',
  },
  {
    id: 'neon',
    name: 'Neon Glow',
    icon: '\uD83D\uDCA0',
    unlockLevel: 5,
    cellBg: '#0D0D0D',
    cellBorder: '#00FF88',
    cellText: '#00FF88',
    boardBg: '#0A0A1A',
    accentColor: '#00FF88',
  },
  {
    id: 'wood',
    name: 'Wooden',
    icon: '\uD83C\uDF33',
    unlockLevel: 10,
    cellBg: '#DEB887',
    cellBorder: '#8B4513',
    cellText: '#3E2723',
    boardBg: '#D2B48C',
    accentColor: '#8B4513',
  },
  {
    id: 'chalk',
    name: 'Chalkboard',
    icon: '\u270F\uFE0F',
    unlockLevel: 15,
    cellBg: '#2E4057',
    cellBorder: '#ECEFF1',
    cellText: '#ECEFF1',
    boardBg: '#1A2A3A',
    accentColor: '#FFD54F',
  },
  {
    id: 'pixel',
    name: 'Pixel Art',
    icon: '\uD83D\uDC7E',
    unlockLevel: 20,
    cellBg: '#1A1A2E',
    cellBorder: '#E94560',
    cellText: '#E94560',
    boardBg: '#16213E',
    accentColor: '#0F3460',
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    icon: '\uD83C\uDF0A',
    unlockLevel: 30,
    cellBg: '#0D47A1',
    cellBorder: '#64B5F6',
    cellText: '#E3F2FD',
    boardBg: '#0A2647',
    accentColor: '#42A5F5',
  },
  {
    id: 'lava',
    name: 'Lava',
    icon: '\uD83C\uDF0B',
    unlockLevel: 40,
    cellBg: '#BF360C',
    cellBorder: '#FF6E40',
    cellText: '#FFF3E0',
    boardBg: '#3E2723',
    accentColor: '#FF3D00',
  },
  {
    id: 'galaxy',
    name: 'Galaxy',
    icon: '\uD83C\uDF0C',
    unlockLevel: 50,
    cellBg: '#1A0033',
    cellBorder: '#CE93D8',
    cellText: '#E1BEE7',
    boardBg: '#0D001A',
    accentColor: '#AB47BC',
  },
];

const SKIN_KEY = 'active_board_skin';

export async function getActiveSkin(): Promise<BoardSkin> {
  const id = await loadData(SKIN_KEY);
  return BOARD_SKINS.find(s => s.id === id) || BOARD_SKINS[0];
}

export async function setActiveSkin(id: string): Promise<void> {
  await saveData(SKIN_KEY, id);
}

export function getUnlockedSkins(level: number): BoardSkin[] {
  return BOARD_SKINS.filter(s => level >= s.unlockLevel);
}

export function getLockedSkins(level: number): BoardSkin[] {
  return BOARD_SKINS.filter(s => level < s.unlockLevel);
}
