export interface AppTheme {
  id: string;
  name: string;
  premium: boolean;
  bg: string;
  surface: string;
  surfaceAlt: string;
  player: string;
  playerLight: string;
  ai: string;
  aiLight: string;
  accent: string;
  text: string;
  textSec: string;
  dot: string;
  lineEmpty: string;
  gold: string;
  overlay: string;
  card: string;
  cardBorder: string;
  statusBar: 'dark' | 'light';
}

export const DEFAULT_THEME: AppTheme = {
  id: 'default',
  name: 'Cheerful',
  premium: false,
  bg: '#EDE7F6',
  surface: '#FFFFFF',
  surfaceAlt: '#F3EEFF',
  player: '#5C6BC0',
  playerLight: '#5C6BC025',
  ai: '#FF7043',
  aiLight: '#FF704325',
  accent: '#26A69A',
  text: '#2D3436',
  textSec: '#636E72',
  dot: '#37474F',
  lineEmpty: '#D1C4E9',
  gold: '#FFB300',
  overlay: 'rgba(0,0,0,0.45)',
  card: '#FFFFFF',
  cardBorder: '#E0D6F0',
  statusBar: 'dark',
};

export const OCEAN_THEME: AppTheme = {
  id: 'ocean',
  name: 'Ocean',
  premium: true,
  bg: '#E0F7FA',
  surface: '#FFFFFF',
  surfaceAlt: '#E0F2F1',
  player: '#0097A7',
  playerLight: '#0097A725',
  ai: '#F4511E',
  aiLight: '#F4511E25',
  accent: '#00897B',
  text: '#263238',
  textSec: '#546E7A',
  dot: '#263238',
  lineEmpty: '#B2DFDB',
  gold: '#FFB300',
  overlay: 'rgba(0,0,0,0.45)',
  card: '#FFFFFF',
  cardBorder: '#B2EBF2',
  statusBar: 'dark',
};

export const SUNSET_THEME: AppTheme = {
  id: 'sunset',
  name: 'Sunset',
  premium: true,
  bg: '#FFF3E0',
  surface: '#FFFFFF',
  surfaceAlt: '#FFF8E1',
  player: '#E65100',
  playerLight: '#E6510025',
  ai: '#6A1B9A',
  aiLight: '#6A1B9A25',
  accent: '#F57C00',
  text: '#3E2723',
  textSec: '#795548',
  dot: '#4E342E',
  lineEmpty: '#FFCCBC',
  gold: '#FFB300',
  overlay: 'rgba(0,0,0,0.45)',
  card: '#FFFFFF',
  cardBorder: '#FFE0B2',
  statusBar: 'dark',
};

export const FOREST_THEME: AppTheme = {
  id: 'forest',
  name: 'Forest',
  premium: true,
  bg: '#E8F5E9',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F8E9',
  player: '#2E7D32',
  playerLight: '#2E7D3225',
  ai: '#C62828',
  aiLight: '#C6282825',
  accent: '#43A047',
  text: '#1B5E20',
  textSec: '#558B2F',
  dot: '#33691E',
  lineEmpty: '#C8E6C9',
  gold: '#FFB300',
  overlay: 'rgba(0,0,0,0.45)',
  card: '#FFFFFF',
  cardBorder: '#DCEDC8',
  statusBar: 'dark',
};

export const ALL_THEMES: AppTheme[] = [
  DEFAULT_THEME,
  OCEAN_THEME,
  SUNSET_THEME,
  FOREST_THEME,
];
