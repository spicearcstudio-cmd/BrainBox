import React, { useState, useEffect, useCallback } from 'react';
import { Alert, BackHandler, View, Text, Pressable, StyleSheet } from 'react-native';
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
import AvatarPickerScreen from './screens/AvatarPickerScreen';
import BoardSkinScreen from './screens/BoardSkinScreen';
import WeeklyTournamentScreen from './screens/WeeklyTournamentScreen';
import DotsAndBoxesScreen from './screens/DotsAndBoxesScreen';
import TicTacToeScreen from './screens/TicTacToeScreen';
import ConnectFourScreen from './screens/ConnectFourScreen';
import MemoryMatchScreen from './screens/MemoryMatchScreen';
import ColorFloodScreen from './screens/ColorFloodScreen';
import ReversiScreen from './screens/ReversiScreen';
import Twenty48Screen from './screens/Twenty48Screen';

let Sentry: any = null;
try {
  Sentry = require('@sentry/react-native');
  Sentry.init({
    dsn: '', // Set your Sentry DSN here before production release
    enabled: !__DEV__,
    tracesSampleRate: 0.2,
  });
} catch {
  // Sentry not available in Expo Go
}

// --- Error Boundary ---
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    Sentry?.captureException?.(error, { extra: { componentStack: info.componentStack } });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={ebStyles.container}>
          <Text style={ebStyles.emoji}>{'\uD83D\uDE35'}</Text>
          <Text style={ebStyles.title}>Something went wrong</Text>
          <Text style={ebStyles.subtitle}>The app ran into an unexpected error.</Text>
          <Pressable onPress={() => this.setState({ hasError: false })} style={ebStyles.btn}>
            <Text style={ebStyles.btnText}>Try Again</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

const ebStyles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EDE7F6', padding: 32 },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '900', color: '#2D3436', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#636E72', textAlign: 'center', marginBottom: 32 },
  btn: { backgroundColor: '#5C6BC0', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 14 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

// --- Navigator ---
type Screen =
  | { type: 'home' }
  | { type: 'picker'; gameId: GameId }
  | { type: 'game'; gameId: GameId; diff: DifficultyOption; twoPlayer: boolean; isDaily: boolean; timed?: number }
  | { type: 'settings' }
  | { type: 'stats' }
  | { type: 'daily' }
  | { type: 'achievements' }
  | { type: 'howtoplay'; gameId?: string }
  | { type: 'weekly' }
  | { type: 'avatar' }
  | { type: 'boardskins' }
  | { type: 'tournament' };

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

  const goHome = useCallback(() => setScreen({ type: 'home' }), []);

  // Android hardware back button
  useEffect(() => {
    const handler = () => {
      if (screen.type === 'home') return false; // Let system handle (exit app)
      if (screen.type === 'game') {
        Alert.alert('Leave Game?', 'Your progress will be lost.', [
          { text: 'Stay', style: 'cancel' },
          { text: 'Leave', style: 'destructive', onPress: goHome },
        ]);
        return true;
      }
      goHome();
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', handler);
    return () => sub.remove();
  }, [screen, goHome]);

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
  if (screen.type === 'avatar') return <AvatarPickerScreen onBack={goHome} />;
  if (screen.type === 'boardskins') return <BoardSkinScreen onBack={goHome} />;
  if (screen.type === 'tournament') {
    return (
      <WeeklyTournamentScreen
        onBack={goHome}
        onPlay={(gameId, diff) => startGame(gameId, diff, false, false)}
      />
    );
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
        onAvatar={() => setScreen({ type: 'avatar' })}
        onBoardSkins={() => setScreen({ type: 'boardskins' })}
        onTournament={() => setScreen({ type: 'tournament' })}
      />
      {showSplash && <SplashOverlay onDone={() => setShowSplash(false)} />}
      {!showSplash && showOnboarding && <OnboardingOverlay onComplete={() => setShowOnboarding(false)} />}
    </>
  );
}

function AppRoot() {
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

function App() {
  return (
    <ErrorBoundary>
      <AppRoot />
    </ErrorBoundary>
  );
}

export default Sentry?.wrap ? Sentry.wrap(App) : App;
