export type Player = 'human' | 'ai';
export type GameId = 'dotsandboxes' | 'tictactoe' | 'connectfour' | 'memory' | 'colorflood';

export interface DifficultyOption {
  key: string;
  label: string;
  gridLabel: string;
  gridSize: number;
  gridCols?: number;
  desc: string;
}

export interface GameInfo {
  id: GameId;
  name: string;
  icon: string;
  color: string;
  description: string;
  vsAI: boolean;
  difficulties: DifficultyOption[];
}

export const GAMES: GameInfo[] = [
  {
    id: 'dotsandboxes',
    name: 'Dots & Boxes',
    icon: '\u25A6',
    color: '#5C6BC0',
    description: 'Connect dots to claim boxes',
    vsAI: true,
    difficulties: [
      { key: 'easy', label: 'Easy', gridLabel: '4\u00D74', gridSize: 4, desc: 'Small board, casual AI' },
      { key: 'medium', label: 'Medium', gridLabel: '5\u00D75', gridSize: 5, desc: 'Classic board, smart AI' },
      { key: 'hard', label: 'Hard', gridLabel: '6\u00D76', gridSize: 6, desc: 'Big board, tough AI' },
      { key: 'expert', label: 'Expert', gridLabel: '7\u00D77', gridSize: 7, desc: 'Huge board, ruthless AI' },
    ],
  },
  {
    id: 'tictactoe',
    name: 'Tic Tac Toe',
    icon: '\u2716',
    color: '#EF5350',
    description: 'Get your marks in a row',
    vsAI: true,
    difficulties: [
      { key: 'easy', label: 'Easy', gridLabel: '3\u00D73', gridSize: 3, desc: 'Classic 3\u00D73' },
      { key: 'medium', label: 'Medium', gridLabel: '4\u00D74', gridSize: 4, desc: 'Bigger board, connect 4' },
      { key: 'hard', label: 'Hard', gridLabel: '5\u00D75', gridSize: 5, desc: 'Large board, connect 4' },
    ],
  },
  {
    id: 'connectfour',
    name: 'Connect Four',
    icon: '\u25CF',
    color: '#FDD835',
    description: 'Drop discs, connect four',
    vsAI: true,
    difficulties: [
      { key: 'easy', label: 'Easy', gridLabel: '7\u00D76', gridSize: 6, gridCols: 7, desc: 'Standard, casual AI' },
      { key: 'medium', label: 'Medium', gridLabel: '7\u00D76', gridSize: 6, gridCols: 7, desc: 'Standard, smart AI' },
      { key: 'hard', label: 'Hard', gridLabel: '9\u00D77', gridSize: 7, gridCols: 9, desc: 'Large board, tough AI' },
    ],
  },
  {
    id: 'memory',
    name: 'Memory Match',
    icon: '\u2663',
    color: '#AB47BC',
    description: 'Flip cards, find all pairs',
    vsAI: false,
    difficulties: [
      { key: 'easy', label: 'Easy', gridLabel: '3\u00D74', gridSize: 3, gridCols: 4, desc: '6 pairs' },
      { key: 'medium', label: 'Medium', gridLabel: '4\u00D74', gridSize: 4, gridCols: 4, desc: '8 pairs' },
      { key: 'hard', label: 'Hard', gridLabel: '4\u00D75', gridSize: 4, gridCols: 5, desc: '10 pairs' },
    ],
  },
  {
    id: 'colorflood',
    name: 'Color Flood',
    icon: '\u25D0',
    color: '#26A69A',
    description: 'Flood the board in fewest moves',
    vsAI: false,
    difficulties: [
      { key: 'easy', label: 'Easy', gridLabel: '8\u00D78', gridSize: 8, desc: '20 moves max' },
      { key: 'medium', label: 'Medium', gridLabel: '10\u00D710', gridSize: 10, desc: '24 moves max' },
      { key: 'hard', label: 'Hard', gridLabel: '14\u00D714', gridSize: 14, desc: '30 moves max' },
    ],
  },
];

export function getGameById(id: GameId): GameInfo {
  return GAMES.find(g => g.id === id)!;
}
