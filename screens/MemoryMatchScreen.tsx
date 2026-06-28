import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { DifficultyOption } from '../constants/games';
import { MemoryState, createInitialState, flipCard, resetFlipped } from '../logic/memory/gameEngine';
import Board from '../components/memory/Board';
import GameHeader from '../components/shared/GameHeader';
import GameOverModal from '../components/shared/GameOverModal';
import AdBanner from '../components/shared/AdBanner';

interface Props { diff: DifficultyOption; onHome: () => void }

export default function MemoryMatchScreen({ diff, onHome }: Props) {
  const { theme: t } = useTheme();
  const rows = diff.gridSize;
  const cols = diff.gridCols ?? 4;
  const [state, setState] = useState<MemoryState>(() => createInitialState(rows, cols));

  useEffect(() => {
    if (state.busy) {
      const timer = setTimeout(() => setState(prev => resetFlipped(prev)), 800);
      return () => clearTimeout(timer);
    }
  }, [state.busy]);

  const handleFlip = useCallback((idx: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setState(prev => flipCard(prev, idx));
  }, []);

  const restart = () => setState(createInitialState(rows, cols));
  const matched = state.matched.filter(Boolean).length / 2;
  const totalPairs = state.cards.length / 2;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      <GameHeader title="Memory Match" onBack={onHome} />
      <View style={[styles.statsRow, { backgroundColor: t.surface, borderColor: t.cardBorder }]}>
        <View style={styles.stat}>
          <Text style={[styles.statLabel, { color: t.textSec }]}>Pairs</Text>
          <Text style={[styles.statVal, { color: t.player }]}>{matched}/{totalPairs}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statLabel, { color: t.textSec }]}>Turns</Text>
          <Text style={[styles.statVal, { color: t.ai }]}>{state.turns}</Text>
        </View>
      </View>
      <View style={styles.boardWrap}>
        <Board state={state} onFlip={handleFlip} />
      </View>
      <AdBanner />
      <GameOverModal visible={state.gameOver} title="Well Done!" subtitle={`Matched in ${state.turns} turns`}
        titleColor={t.accent} gameName="Memory Match" onPlayAgain={restart} onHome={onHome} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  statsRow: { flexDirection: 'row', marginHorizontal: 24, borderRadius: 16, borderWidth: 1.5, overflow: 'hidden', marginBottom: 8 },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  statLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  statVal: { fontSize: 24, fontWeight: '900' },
  boardWrap: { flex: 1, justifyContent: 'center' },
});
