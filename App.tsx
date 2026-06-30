import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { PremiumProvider } from './context/PremiumContext';
import { GameId, getGameById, DifficultyOption } from './constants/games';
import { initSound } from './services/soundManager';
import { markDailyChallengeCompleted } from './services/dailyChallenge';
import { getParentalState, recordGameForParental } from './services/parentalControl';
import HomeScreen from './screens/HomeScreen';
import GamePickerScreen from './screens/GamePickerScreen';
import SettingsScreen from './screens/SettingsScreen';
import StatsScreen from './screens/StatsScreen';
import DailyChallengeScreen from './screens/DailyChallengeScreen';
import DotsAndBoxesScreen from './screens/DotsAndBoxesScreen';
import TicTacToeScreen from './screens/TicTacToeScreen';
import ConnectFourScreen from './screens/ConnectFourScreen';
import MemoryMatchScreen from './screens/MemoryMatchScreen';
import ColorFloodScreen from './screens/ColorFloodScreen';

type Screen =
  | { type: 'home' }
  | { type: 'picker'; gameId: GameId }
  | { type: 'game'; gameId: GameId; diff: DifficultyOption; twoPlayer: boolean; isDaily: boolean }
  | { type: 'settings' }
  | { type: 'stats' }
  | { type: 'daily' };

function Navigator() {
  const { theme } = useTheme();
  const [screen, setScreen] = useState<Screen>({ type: 'home' });

  useEffect(() => { initSound(); }, []);

  const goHome = () => setScreen({ type: 'home' });

  const startGame = async (gameId: GameId, diff: DifficultyOption, twoPlayer: boolean, isDaily: boolean) => {
    const state = await getParentalState();
    if (!state.canPlay) {
      Alert.alert(
        'Daily Limit Reached',
        `You\u2019ve played ${state.gamesPlayedToday} games today. The limit is ${state.dailyLimit}.\n\nCome back tomorrow!`,
        [{ text: 'OK' }]
      );
      return;
    }
    await recordGameForParental();
    setScreen({ type: 'game', gameId, diff, twoPlayer, isDaily });
  };

  if (screen.type === 'settings') {
    return <SettingsScreen onBack={goHome} />;
  }

  if (screen.type === 'stats') {
    return <StatsScreen onBack={goHome} />;
  }

  if (screen.type === 'daily') {
    return (
      <DailyChallengeScreen
        onPlay={(gameId, diff, isDaily) => startGame(gameId as GameId, diff, false, isDaily)}
        onBack={goHome}
      />
    );
  }

  if (screen.type === 'picker') {
    const game = getGameById(screen.gameId);
    return (
      <GamePickerScreen
        game={game}
        onPlay={(diff, twoPlayer) => startGame(screen.gameId, diff, twoPlayer, false)}
        onBack={goHome}
      />
    );
  }

  if (screen.type === 'game') {
    const handleHome = () => {
      if (screen.isDaily) markDailyChallengeCompleted();
      goHome();
    };
    const props = { diff: screen.diff, onHome: handleHome, twoPlayer: screen.twoPlayer, isDaily: screen.isDaily };
    switch (screen.gameId) {
      case 'dotsandboxes': return <DotsAndBoxesScreen {...props} />;
      case 'tictactoe':    return <TicTacToeScreen {...props} />;
      case 'connectfour':  return <ConnectFourScreen {...props} />;
      case 'memory':       return <MemoryMatchScreen diff={screen.diff} onHome={handleHome} isDaily={screen.isDaily} />;
      case 'colorflood':   return <ColorFloodScreen diff={screen.diff} onHome={handleHome} isDaily={screen.isDaily} />;
    }
  }

  return (
    <HomeScreen
      onSelectGame={(id) => setScreen({ type: 'picker', gameId: id })}
      onSettings={() => setScreen({ type: 'settings' })}
      onStats={() => setScreen({ type: 'stats' })}
      onDaily={() => setScreen({ type: 'daily' })}
    />
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PremiumProvider>
        <StatusBar style="dark" />
        <Navigator />
      </PremiumProvider>
    </ThemeProvider>
  );
}
