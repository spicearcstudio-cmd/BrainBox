import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { PremiumProvider } from './context/PremiumContext';
import { GameId, getGameById, DifficultyOption } from './constants/games';
import HomeScreen from './screens/HomeScreen';
import GamePickerScreen from './screens/GamePickerScreen';
import SettingsScreen from './screens/SettingsScreen';
import DotsAndBoxesScreen from './screens/DotsAndBoxesScreen';
import TicTacToeScreen from './screens/TicTacToeScreen';
import ConnectFourScreen from './screens/ConnectFourScreen';
import MemoryMatchScreen from './screens/MemoryMatchScreen';
import ColorFloodScreen from './screens/ColorFloodScreen';

type Screen =
  | { type: 'home' }
  | { type: 'picker'; gameId: GameId }
  | { type: 'game'; gameId: GameId; diff: DifficultyOption }
  | { type: 'settings' };

function Navigator() {
  const { theme } = useTheme();
  const [screen, setScreen] = useState<Screen>({ type: 'home' });

  const goHome = () => setScreen({ type: 'home' });

  if (screen.type === 'settings') {
    return <SettingsScreen onBack={goHome} />;
  }

  if (screen.type === 'picker') {
    const game = getGameById(screen.gameId);
    return (
      <GamePickerScreen
        game={game}
        onPlay={(diff) => setScreen({ type: 'game', gameId: screen.gameId, diff })}
        onBack={goHome}
      />
    );
  }

  if (screen.type === 'game') {
    const props = { diff: screen.diff, onHome: goHome };
    switch (screen.gameId) {
      case 'dotsandboxes': return <DotsAndBoxesScreen {...props} />;
      case 'tictactoe':    return <TicTacToeScreen {...props} />;
      case 'connectfour':  return <ConnectFourScreen {...props} />;
      case 'memory':       return <MemoryMatchScreen {...props} />;
      case 'colorflood':   return <ColorFloodScreen {...props} />;
    }
  }

  return (
    <HomeScreen
      onSelectGame={(id) => setScreen({ type: 'picker', gameId: id })}
      onSettings={() => setScreen({ type: 'settings' })}
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
