import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { PremiumProvider } from './context/PremiumContext';
import { GameId, getGameById, DifficultyOption } from './constants/games';
import { initSound } from './services/soundManager';
import { markDailyChallengeCompleted } from './services/dailyChallenge';
import { getParentalState, recordGameForParental } from './services/parentalControl';
import AchievementToast from './components/shared/AchievementToast';
import SplashOverlay from './components/shared/SplashOverlay';
import OnboardingOverlay, { shouldShowOnboarding } from './components/shared/OnboardingOverlay';
import HomeScreen from './screens/HomeScreen';
import GamePickerScreen from './screens/GamePickerScreen';
import SettingsScreen from './screens/SettingsScreen';
import StatsScreen from './screens/StatsScreen';
import DailyChallengeScreen from './screens/DailyChallengeScreen';
import AchievementsScreen from './screens/AchievementsScreen';
import HowToPlayScreen from './screens/HowToPlayScreen';
import WeeklyRecapScreen from './screens/WeeklyRecapScreen';
import DotsAndBoxesScreen from './screens/DotsAndBoxesScreen';
import TicTacToeScreen from './screens/TicTacToeScreen';
import ConnectFourScreen from './screens/ConnectFourScreen';
import MemoryMatchScreen from './screens/MemoryMatchScreen';
import ColorFloodScreen from './screens/ColorFloodScreen';
import ReversiScreen from './screens/ReversiScreen';
import Twenty48Screen from './screens/Twenty48Screen';

type Screen =
  | { type: 'home' }
  | { type: 'picker'; gameId: GameId }
  | { type: 'game'; gameId: GameId; diff: DifficultyOption; twoPlayer: boolean; isDaily: boolean; timed?: number }
  | { type: 'settings' }
  | { type: 'stats' }
  | { type: 'daily' }
  | { type: 'achievements' }
  | { type: 'howtoplay'; gameId?: string }
  | { type: 'weekly' };

function Navigator() {
  const { theme } = useTheme();
  const [screen, setScreen] = useState<Screen>({ type: 'home' });
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    initSound();
    shouldShowOnboarding().then(show => {
      if (show) setShowOnboarding(true);
    });
  }, []);

  const goHome = () => setScreen({ type: 'home' });

  const startGame = async (gameId: GameId, diff: DifficultyOption, twoPlayer: boolean, isDaily: boolean, timed?: number) => {
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
    setScreen({ type: 'game', gameId, diff, twoPlayer, isDaily, timed });
  };

  if (screen.type === 'settings') return <SettingsScreen onBack={goHome} />;
  if (screen.type === 'stats') return <StatsScreen onBack={goHome} />;
  if (screen.type === 'achievements') return <AchievementsScreen onBack={goHome} />;
  if (screen.type === 'howtoplay') return <HowToPlayScreen onBack={goHome} initialGameId={screen.gameId} />;
  if (screen.type === 'weekly') return <WeeklyRecapScreen onBack={goHome} />;

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
        onPlay={(diff, twoPlayer, timed) => startGame(screen.gameId, diff, twoPlayer, false, timed)}
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
      case 'reversi':      return <ReversiScreen {...props} />;
      case 'twenty48':     return <Twenty48Screen diff={screen.diff} onHome={handleHome} isDaily={screen.isDaily} />;
    }
  }

  return (
    <>
      <HomeScreen
        onSelectGame={(id) => setScreen({ type: 'picker', gameId: id })}
        onSettings={() => setScreen({ type: 'settings' })}
        onStats={() => setScreen({ type: 'stats' })}
        onDaily={() => setScreen({ type: 'daily' })}
        onAchievements={() => setScreen({ type: 'achievements' })}
        onHowToPlay={() => setScreen({ type: 'howtoplay' })}
        onWeeklyRecap={() => setScreen({ type: 'weekly' })}
      />
      {showSplash && <SplashOverlay onDone={() => setShowSplash(false)} />}
      {!showSplash && showOnboarding && <OnboardingOverlay onComplete={() => setShowOnboarding(false)} />}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PremiumProvider>
        <StatusBar style="auto" />
        <Navigator />
        <AchievementToast />
      </PremiumProvider>
    </ThemeProvider>
  );
}
