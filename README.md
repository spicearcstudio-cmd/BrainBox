# Dots & Boxes

A classic strategy game built with React Native and Expo. Play against an AI opponent with three difficulty levels.

## How to Play

1. Take turns tapping lines between dots
2. Complete a box (all 4 sides) to score a point and earn a bonus turn
3. The player with the most boxes wins

## Development

```bash
npm start        # Start Expo dev server
npm run android  # Run on Android emulator
npm run web      # Run in web browser
```

## Build for Play Store

```bash
eas build --platform android --profile production
```

## Tech Stack

- React Native + Expo SDK 56
- TypeScript
- EAS Build for Android App Bundle (.aab)
