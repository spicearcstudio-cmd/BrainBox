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
  name: 'Cozy',
  premium: false,
  bg: '#FFF5EC',
  surface: '#FFFAF5',
  surfaceAlt: '#FFF0E3',
  player: '#E8734A',
  playerLight: '#E8734A25',
  ai: '#6C8EBF',
  aiLight: '#6C8EBF25',
  accent: '#E8734A',
  text: '#4A3728',
  textSec: '#9B8574',
  dot: '#6B5344',
  lineEmpty: '#F0D9C8',
  gold: '#F5A623',
  overlay: 'rgba(58,37,20,0.55)',
  card: '#FFFAF5',
  cardBorder: '#F0D9C8',
  statusBar: 'dark',
};

export const OCEAN_THEME: AppTheme = {
  id: 'ocean',
  name: 'Ocean',
  premium: false,
  bg: '#EAF6F8',
  surface: '#F5FBFC',
  surfaceAlt: '#E0F2F1',
  player: '#2E98A3',
  playerLight: '#2E98A325',
  ai: '#E57350',
  aiLight: '#E5735025',
  accent: '#2E98A3',
  text: '#2A4550',
  textSec: '#5D8590',
  dot: '#2A4550',
  lineEmpty: '#BDE3E8',
  gold: '#F5A623',
  overlay: 'rgba(20,45,55,0.55)',
  card: '#F5FBFC',
  cardBorder: '#BDE3E8',
  statusBar: 'dark',
};

export const SUNSET_THEME: AppTheme = {
  id: 'sunset',
  name: 'Sunset',
  premium: false,
  bg: '#FFF0E6',
  surface: '#FFF8F2',
  surfaceAlt: '#FFEBDA',
  player: '#D45D20',
  playerLight: '#D45D2025',
  ai: '#7E4AAD',
  aiLight: '#7E4AAD25',
  accent: '#D45D20',
  text: '#3E2723',
  textSec: '#8B6B5A',
  dot: '#4E342E',
  lineEmpty: '#F5D0BB',
  gold: '#E8952A',
  overlay: 'rgba(40,20,10,0.55)',
  card: '#FFF8F2',
  cardBorder: '#F5D0BB',
  statusBar: 'dark',
};

export const FOREST_THEME: AppTheme = {
  id: 'forest',
  name: 'Forest',
  premium: false,
  bg: '#ECF3E8',
  surface: '#F6FAF4',
  surfaceAlt: '#E8F0E2',
  player: '#3D8B42',
  playerLight: '#3D8B4225',
  ai: '#C25040',
  aiLight: '#C2504025',
  accent: '#3D8B42',
  text: '#2A4A2E',
  textSec: '#6B8B6E',
  dot: '#33691E',
  lineEmpty: '#C8DCC0',
  gold: '#D4943A',
  overlay: 'rgba(20,40,20,0.55)',
  card: '#F6FAF4',
  cardBorder: '#C8DCC0',
  statusBar: 'dark',
};

export const DARK_THEME: AppTheme = {
  id: 'dark',
  name: 'Dark',
  premium: false,
  bg: '#1A1612',
  surface: '#2A231C',
  surfaceAlt: '#362D24',
  player: '#E8956A',
  playerLight: '#E8956A25',
  ai: '#7BAFD4',
  aiLight: '#7BAFD425',
  accent: '#E8956A',
  text: '#EDE0D4',
  textSec: '#A69484',
  dot: '#C4B098',
  lineEmpty: '#3D342B',
  gold: '#E8B44A',
  overlay: 'rgba(10,8,5,0.75)',
  card: '#2A231C',
  cardBorder: '#3D342B',
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
