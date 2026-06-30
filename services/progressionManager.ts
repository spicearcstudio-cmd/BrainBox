import { loadData, saveData } from './storage';

const XP_KEY = 'progression_xp';
const LEVEL_KEY = 'progression_level';

const XP_PER_WIN = 30;
const XP_PER_DRAW = 15;
const XP_PER_LOSS = 8;
const XP_BONUS_STREAK = 10;
const XP_BONUS_DAILY = 25;
const XP_BONUS_STARS_3 = 15;
const XP_BONUS_STARS_2 = 5;

const LEVELS: { level: number; xpRequired: number; title: string }[] = [
  { level: 1,  xpRequired: 0,     title: 'Newbie' },
  { level: 2,  xpRequired: 50,    title: 'Beginner' },
  { level: 3,  xpRequired: 150,   title: 'Learner' },
  { level: 4,  xpRequired: 300,   title: 'Player' },
  { level: 5,  xpRequired: 500,   title: 'Skilled' },
  { level: 6,  xpRequired: 800,   title: 'Strategist' },
  { level: 7,  xpRequired: 1200,  title: 'Tactician' },
  { level: 8,  xpRequired: 1800,  title: 'Expert' },
  { level: 9,  xpRequired: 2500,  title: 'Master' },
  { level: 10, xpRequired: 3500,  title: 'Grandmaster' },
  { level: 11, xpRequired: 5000,  title: 'Champion' },
  { level: 12, xpRequired: 7000,  title: 'Legend' },
  { level: 13, xpRequired: 10000, title: 'Brain Lord' },
];

export interface ProgressionState {
  totalXP: number;
  level: number;
  title: string;
  xpInCurrentLevel: number;
  xpToNextLevel: number;
  progress: number; // 0..1
  isMaxLevel: boolean;
}

export interface XPGain {
  base: number;
  streakBonus: number;
  dailyBonus: number;
  starBonus: number;
  total: number;
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
  newTitle: string;
}

function getLevelInfo(xp: number) {
  let current = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.xpRequired) current = l;
    else break;
  }
  return current;
}

export async function getProgression(): Promise<ProgressionState> {
  const totalXP = parseInt(await loadData(XP_KEY) ?? '0', 10);
  const current = getLevelInfo(totalXP);
  const nextIdx = LEVELS.findIndex(l => l.level === current.level) + 1;
  const isMaxLevel = nextIdx >= LEVELS.length;
  const nextXP = isMaxLevel ? current.xpRequired : LEVELS[nextIdx].xpRequired;
  const levelRange = nextXP - current.xpRequired;
  const xpInCurrentLevel = totalXP - current.xpRequired;

  return {
    totalXP,
    level: current.level,
    title: current.title,
    xpInCurrentLevel,
    xpToNextLevel: levelRange,
    progress: levelRange > 0 ? Math.min(1, xpInCurrentLevel / levelRange) : 1,
    isMaxLevel,
  };
}

export async function awardXP(
  result: 'win' | 'lose' | 'draw',
  options?: { winStreak?: number; isDaily?: boolean; stars?: number }
): Promise<XPGain> {
  const oldXP = parseInt(await loadData(XP_KEY) ?? '0', 10);
  const oldLevel = getLevelInfo(oldXP).level;

  let base = result === 'win' ? XP_PER_WIN : result === 'draw' ? XP_PER_DRAW : XP_PER_LOSS;
  let streakBonus = 0;
  let dailyBonus = 0;
  let starBonus = 0;

  if (options?.winStreak && options.winStreak >= 3) {
    streakBonus = XP_BONUS_STREAK * Math.min(options.winStreak - 2, 5);
  }
  if (options?.isDaily) dailyBonus = XP_BONUS_DAILY;
  if (options?.stars === 3) starBonus = XP_BONUS_STARS_3;
  else if (options?.stars === 2) starBonus = XP_BONUS_STARS_2;

  const total = base + streakBonus + dailyBonus + starBonus;
  const newXP = oldXP + total;
  await saveData(XP_KEY, String(newXP));

  const newLevelInfo = getLevelInfo(newXP);
  return {
    base,
    streakBonus,
    dailyBonus,
    starBonus,
    total,
    leveledUp: newLevelInfo.level > oldLevel,
    oldLevel,
    newLevel: newLevelInfo.level,
    newTitle: newLevelInfo.title,
  };
}
