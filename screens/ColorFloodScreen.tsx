import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { DifficultyOption } from '../constants/games';
import { FloodState, createInitialState, makeMove } from '../logic/colorflood/gameEngine';
import Board from '../components/colorflood/Board';
import GameHeader from '../components/shared/GameHeader';
import GameOverModal from '../components/shared/GameOverModal';
import AdBanner from '../components/shared/AdBanner';
import { playSound, haptic } from '../services/soundManager';

const MAX_MOVES: Record<string, number> = { easy: 20, medium: 24, hard: 30, daily: 24 };

interface Props { diff: DifficultyOption; onHome: () => void; isDaily?: boolean }

export default function ColorFloodScreen({ diff, onHome, isDaily }: Props) {
  const { theme: t } = useTheme();
  const maxM = MAX_MOVES[diff.key] ?? 24;
  const [state, setState] = useState<FloodState>(() => createInitialState(diff.gridSize, maxM));

  const handlePick = useCallback((colorIdx: number) => {
    haptic('light');
    playSound('tap');
    setState(prev => makeMove(prev, colorIdx));
  }, []);

  const restart = () => setState(createInitialState(diff.gridSize, maxM));

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      <GameHeader title="Color Flood" onBack={onHome} />
      <View style={[styles.statsRow, { backgroundColor: t.surface, borderColor: t.cardBorder }]}>
        <View style={styles.stat}>
          <Text style={[styles.statLabel, { color: t.textSec }]}>Moves</Text>
          <Text style={[styles.statVal, { color: state.moves > maxM * 0.75 ? t.ai : t.player }]}>{state.moves}/{maxM}</Text>
        </View>
      </View>
      <View style={styles.boardWrap}>
        <Board state={state} onPickColor={handlePick} disabled={state.gameOver} />
      </View>
      <AdBanner />
      <GameOverModal visible={state.gameOver}
        title={state.won ? 'Flooded!' : 'Out of Moves!'}
        subtitle={state.won ? `Cleared in ${state.moves} moves` : 'Try again'}
        titleColor={state.won ? t.accent : t.ai}
        gameName="Color Flood" gameId="colorflood" result={state.won ? 'win' : 'lose'}
        extraStats={{ score: state.won ? maxM - state.moves : undefined }}
        isDaily={isDaily} onPlayAgain={isDaily ? onHome : restart} onHome={onHome} />
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
