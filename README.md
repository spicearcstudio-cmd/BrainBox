# Brain Box - Classic Strategy Games

A collection of 7 classic strategy and puzzle games in one app, built with React Native and Expo. Features AI opponents, daily challenges, XP progression, achievements, and more.

## Games

1. **Dots & Boxes** - Connect dots to claim boxes
2. **Tic Tac Toe** - Classic X and O with scalable grids
3. **Connect Four** - Drop pieces to connect four in a row
4. **Memory Match** - Flip cards and find matching pairs
5. **Color Flood** - Flood-fill the board in limited moves
6. **Reversi** - Flip opponent pieces with strategic placement (unlocks at Level 25)
7. **2048** - Slide and merge tiles to reach 2048 (unlocks at Level 50)

## Features

- 3 difficulty levels per game (Easy, Medium, Hard)
- AI opponents with minimax, alpha-beta pruning, and heuristic strategies
- XP & leveling system (52 levels)
- 18 unlockable achievements
- Daily challenges with streak tracking
- Local 2-player pass-and-play mode
- Speed mode (timed games)
- 9 themes including seasonal themes
- Dark mode (auto-detects system preference)
- Parental controls (daily game limits)
- Sound effects and haptic feedback
- Push notifications for daily reminders
- Weekly recap with shareable stats
- Onboarding tutorial for new players

## Development

```bash
npm start              # Start Expo dev server
npm test               # Run unit tests
npm run typecheck       # TypeScript type checking
npm run build:android   # Production build
npm run build:preview   # Preview APK build
```

## Tech Stack

- React Native + Expo SDK 56
- TypeScript
- EAS Build for Android App Bundle (.aab)
- Google AdMob for ads
- Google Play Billing for premium
- Sentry for crash reporting
- expo-updates for OTA updates

## Project Structure

```
logic/          # Pure game engines and AI players
components/     # React Native UI components
screens/        # App screens
services/       # Storage, sound, stats, notifications, etc.
constants/      # Themes, game definitions
context/        # React Context providers
__tests__/      # Jest unit tests for game engines
```

## Version

2.0.0
