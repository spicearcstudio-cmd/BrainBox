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
  { level: 1,  xpRequired: 0,       title: 'Newbie' },
  { level: 2,  xpRequired: 50,      title: 'Beginner' },
  { level: 3,  xpRequired: 150,     title: 'Learner' },
  { level: 4,  xpRequired: 300,     title: 'Player' },
  { level: 5,  xpRequired: 500,     title: 'Skilled' },
  { level: 6,  xpRequired: 750,     title: 'Strategist' },
  { level: 7,  xpRequired: 1050,    title: 'Tactician' },
  { level: 8,  xpRequired: 1400,    title: 'Competitor' },
  { level: 9,  xpRequired: 1800,    title: 'Expert' },
  { level: 10, xpRequired: 2300,    title: 'Veteran' },
  { level: 11, xpRequired: 2900,    title: 'Elite' },
  { level: 12, xpRequired: 3600,    title: 'Master' },
  { level: 13, xpRequired: 4400,    title: 'Prodigy' },
  { level: 14, xpRequired: 5300,    title: 'Virtuoso' },
  { level: 15, xpRequired: 6300,    title: 'Grandmaster' },
  { level: 16, xpRequired: 7500,    title: 'Sage' },
  { level: 17, xpRequired: 8800,    title: 'Scholar' },
  { level: 18, xpRequired: 10200,   title: 'Genius' },
  { level: 19, xpRequired: 11800,   title: 'Mastermind' },
  { level: 20, xpRequired: 13600,   title: 'Champion' },
  { level: 21, xpRequired: 15500,   title: 'Conqueror' },
  { level: 22, xpRequired: 17600,   title: 'Dominator' },
  { level: 23, xpRequired: 19900,   title: 'Overlord' },
  { level: 24, xpRequired: 22400,   title: 'Titan' },
  { level: 25, xpRequired: 25000,   title: 'Reversi Unlocked!' },
  { level: 26, xpRequired: 27800,   title: 'Phenom' },
  { level: 27, xpRequired: 30800,   title: 'Warlord' },
  { level: 28, xpRequired: 34000,   title: 'Gladiator' },
  { level: 29, xpRequired: 37500,   title: 'Legend' },
  { level: 30, xpRequired: 41200,   title: 'Mythic' },
  { level: 31, xpRequired: 45100,   title: 'Immortal' },
  { level: 32, xpRequired: 49200,   title: 'Oracle' },
  { level: 33, xpRequired: 53500,   title: 'Ascendant' },
  { level: 34, xpRequired: 58000,   title: 'Sovereign' },
  { level: 35, xpRequired: 63000,   title: 'Celestial' },
  { level: 36, xpRequired: 68200,   title: 'Eternal' },
  { level: 37, xpRequired: 73600,   title: 'Archon' },
  { level: 38, xpRequired: 79200,   title: 'Emperor' },
  { level: 39, xpRequired: 85000,   title: 'Transcendent' },
  { level: 40, xpRequired: 91000,   title: 'Apex' },
  { level: 41, xpRequired: 97500,   title: 'Paragon' },
  { level: 42, xpRequired: 104500,  title: 'Infinite' },
  { level: 43, xpRequired: 112000,  title: 'Omega' },
  { level: 44, xpRequired: 120000,  title: 'Stellar' },
  { level: 45, xpRequired: 128500,  title: 'Cosmic' },
  { level: 46, xpRequired: 137500,  title: 'Galactic' },
  { level: 47, xpRequired: 147000,  title: 'Universal' },
  { level: 48, xpRequired: 157000,  title: 'Absolute' },
  { level: 49, xpRequired: 168000,  title: 'Supreme' },
  { level: 50, xpRequired: 180000,  title: '2048 Unlocked!' },
  { level: 51, xpRequired: 195000,  title: 'Brain Lord' },
  { level: 52, xpRequired: 215000,  title: 'Brain God' },
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
