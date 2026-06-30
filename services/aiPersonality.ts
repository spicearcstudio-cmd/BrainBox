import { GameId } from '../constants/games';

export interface AIPersona {
  name: string;
  avatar: string;
  difficulty: string;
  tauntOnWin: string[];
  tauntOnLose: string[];
  tauntOnMove: string[];
  encouragePlayer: string[];
}

const PERSONAS: Record<string, AIPersona> = {
  easy: {
    name: 'Buddy',
    avatar: '\uD83D\uDE0A',
    difficulty: 'easy',
    tauntOnWin: [
      'Good game! I got lucky that time.',
      'Hehe, I won! Want a rematch?',
      'That was fun! Let\'s play again!',
    ],
    tauntOnLose: [
      'Well played! You\'re really good!',
      'Wow, you beat me! Impressive!',
      'I\'ll get you next time... maybe!',
    ],
    tauntOnMove: [
      'Hmm, interesting move!',
      'Ooh, didn\'t see that coming!',
      'Nice one!',
      'Let me think...',
    ],
    encouragePlayer: [
      'You\'re doing great!',
      'Keep it up!',
      'Good strategy!',
    ],
  },
  medium: {
    name: 'Nova',
    avatar: '\uD83E\uDD16',
    difficulty: 'medium',
    tauntOnWin: [
      'Better luck next time!',
      'I had to work for that one.',
      'Close game, but I pulled ahead!',
    ],
    tauntOnLose: [
      'You outplayed me. Respect.',
      'Okay, you\'re legit good.',
      'I need to rethink my strategy...',
    ],
    tauntOnMove: [
      'Calculated.',
      'Hmm, bold move.',
      'Okay, I see your plan...',
      'Processing...',
    ],
    encouragePlayer: [
      'Not bad at all!',
      'You\'re improving!',
      'Solid play.',
    ],
  },
  hard: {
    name: 'Apex',
    avatar: '\uD83D\uDC7E',
    difficulty: 'hard',
    tauntOnWin: [
      'As expected.',
      'You never had a chance.',
      'Too easy. Try again?',
      'Bow before Apex.',
    ],
    tauntOnLose: [
      '...Impossible. Recalculating.',
      'You got lucky. It won\'t happen again.',
      'Error 404: defeat not found. Wait...',
    ],
    tauntOnMove: [
      'Pathetic.',
      'Is that your best move?',
      'I already know your next 5 moves.',
      'Interesting... but futile.',
      '*yawns*',
    ],
    encouragePlayer: [
      'Not terrible... for a human.',
      'Hmm, you might survive a few more turns.',
      'Lucky move.',
    ],
  },
  expert: {
    name: 'Omega',
    avatar: '\uD83D\uDC80',
    difficulty: 'expert',
    tauntOnWin: [
      'Resistance is futile.',
      'Another victory for the machine.',
      'You should try Easy mode.',
    ],
    tauntOnLose: [
      '...System error. This doesn\'t happen.',
      'Congratulations. You\'ve earned my respect.',
      'Impossible. I demand a rematch.',
    ],
    tauntOnMove: [
      'Foolish.',
      'Every move you make brings you closer to defeat.',
      'I\'ve already won. You just don\'t know it yet.',
    ],
    encouragePlayer: [
      'You\'re brave. I\'ll give you that.',
      'Most humans give up by now.',
    ],
  },
};

export function getPersona(difficulty: string): AIPersona {
  return PERSONAS[difficulty] || PERSONAS.medium;
}

export function getRandomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

const GAME_SPECIFIC_TAUNTS: Partial<Record<GameId, Record<string, string[]>>> = {
  dotsandboxes: {
    steal: ['I just stole that box!', 'That box is mine now!', 'Thanks for setting that up for me!'],
    chain: ['Chain reaction! More boxes for me!', 'Keep \'em coming!'],
  },
  tictactoe: {
    block: ['Blocked!', 'Nice try, but no.', 'Did you think I wouldn\'t see that?'],
    center: ['Center control is key.', 'Classic opening.'],
  },
  connectfour: {
    drop: ['Dropping in!', 'Column secured.', 'Building my wall...'],
    block: ['Not on my watch!', 'Denied!'],
  },
  reversi: {
    flip: ['Watch them flip!', 'The board is turning my color.', 'Domination.'],
    corner: ['Corner secured. Game over for you.', 'Corners win games.'],
  },
};

export function getGameSpecificTaunt(gameId: GameId, event: string): string | null {
  const taunts = GAME_SPECIFIC_TAUNTS[gameId]?.[event];
  if (!taunts || taunts.length === 0) return null;
  if (Math.random() > 0.4) return null;
  return getRandomMessage(taunts);
}
