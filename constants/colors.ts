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

export const DARK_THEME: AppTheme = {
  id: 'dark',
  name: 'Dark',
  premium: false,
  bg: '#121212',
  surface: '#1E1E1E',
  surfaceAlt: '#2C2C2C',
  player: '#7C4DFF',
  playerLight: '#7C4DFF25',
  ai: '#FF5252',
  aiLight: '#FF525225',
  accent: '#64FFDA',
  text: '#E0E0E0',
  textSec: '#9E9E9E',
  dot: '#BDBDBD',
  lineEmpty: '#424242',
  gold: '#FFD54F',
  overlay: 'rgba(0,0,0,0.7)',
  card: '#1E1E1E',
  cardBorder: '#333333',
  statusBar: 'light',
};

export const CHRISTMAS_THEME: AppTheme = {
  id: 'christmas',
  name: 'Christmas',
  premium: false,
  bg: '#1B5E20',
  surface: '#2E7D32',
  surfaceAlt: '#388E3C',
  player: '#D32F2F',
  playerLight: '#D32F2F25',
  ai: '#FFEB3B',
  aiLight: '#FFEB3B25',
  accent: '#C62828',
  text: '#FFFFFF',
  textSec: '#C8E6C9',
  dot: '#FFFFFF',
  lineEmpty: '#4CAF50',
  gold: '#FFD700',
  overlay: 'rgba(0,0,0,0.55)',
  card: '#2E7D32',
  cardBorder: '#43A047',
  statusBar: 'light',
};

export const HALLOWEEN_THEME: AppTheme = {
  id: 'halloween',
  name: 'Halloween',
  premium: false,
  bg: '#1A1A2E',
  surface: '#16213E',
  surfaceAlt: '#0F3460',
  player: '#FF6F00',
  playerLight: '#FF6F0025',
  ai: '#7B1FA2',
  aiLight: '#7B1FA225',
  accent: '#FF8F00',
  text: '#FFFFFF',
  textSec: '#B0BEC5',
  dot: '#FF9800',
  lineEmpty: '#37474F',
  gold: '#FFC107',
  overlay: 'rgba(0,0,0,0.65)',
  card: '#16213E',
  cardBorder: '#1A237E',
  statusBar: 'light',
};

export const DIWALI_THEME: AppTheme = {
  id: 'diwali',
  name: 'Diwali',
  premium: false,
  bg: '#311B92',
  surface: '#4527A0',
  surfaceAlt: '#512DA8',
  player: '#FFD600',
  playerLight: '#FFD60025',
  ai: '#FF6D00',
  aiLight: '#FF6D0025',
  accent: '#FFD600',
  text: '#FFF9C4',
  textSec: '#CE93D8',
  dot: '#FFD600',
  lineEmpty: '#7C4DFF',
  gold: '#FFD700',
  overlay: 'rgba(0,0,0,0.55)',
  card: '#4527A0',
  cardBorder: '#651FFF',
  statusBar: 'light',
};

export const SUMMER_THEME: AppTheme = {
  id: 'summer',
  name: 'Summer',
  premium: false,
  bg: '#FFFDE7',
  surface: '#FFFFFF',
  surfaceAlt: '#FFF9C4',
  player: '#F57F17',
  playerLight: '#F57F1725',
  ai: '#0277BD',
  aiLight: '#0277BD25',
  accent: '#FF6F00',
  text: '#33691E',
  textSec: '#689F38',
  dot: '#795548',
  lineEmpty: '#FFE082',
  gold: '#FFB300',
  overlay: 'rgba(0,0,0,0.4)',
  card: '#FFFFFF',
  cardBorder: '#FFF176',
  statusBar: 'dark',
};

export const ALL_THEMES: AppTheme[] = [
  DEFAULT_THEME,
  DARK_THEME,
  OCEAN_THEME,
  SUNSET_THEME,
  FOREST_THEME,
];

export const SEASONAL_THEMES: AppTheme[] = [
  CHRISTMAS_THEME,
  HALLOWEEN_THEME,
  DIWALI_THEME,
  SUMMER_THEME,
];

export function getActiveSeasonalTheme(): AppTheme | null {
  const month = new Date().getMonth();
  if (month === 9 || month === 10) return HALLOWEEN_THEME;    // Oct-Nov
  if (month === 11 || month === 0) return CHRISTMAS_THEME;     // Dec-Jan
  if (month === 10) return DIWALI_THEME;                        // Nov (overlaps with Halloween, Diwali takes priority mid-Nov)
  if (month >= 5 && month <= 7) return SUMMER_THEME;           // Jun-Aug
  return null;
}
