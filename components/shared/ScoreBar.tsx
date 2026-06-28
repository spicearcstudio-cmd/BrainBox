import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Player } from '../../constants/games';

interface Props {
  humanScore: number;
  aiScore: number;
  currentPlayer: Player;
  gameOver: boolean;
  humanLabel?: string;
  aiLabel?: string;
}

export default function ScoreBar({ humanScore, aiScore, currentPlayer, gameOver, humanLabel = 'YOU', aiLabel = 'AI' }: Props) {
  const { theme: t } = useTheme();

  return (
    <View style={styles.row}>
      <View style={[styles.card, { backgroundColor: t.surface, borderColor: currentPlayer === 'human' && !gameOver ? t.player : t.cardBorder }]}>
        <Text style={[styles.label, { color: t.player }]}>{humanLabel}</Text>
        <Text style={[styles.score, { color: t.player }]}>{humanScore}</Text>
      </View>
      <Text style={[styles.vs, { color: t.textSec }]}>VS</Text>
      <View style={[styles.card, { backgroundColor: t.surface, borderColor: currentPlayer === 'ai' && !gameOver ? t.ai : t.cardBorder }]}>
        <Text style={[styles.label, { color: t.ai }]}>{aiLabel}</Text>
        <Text style={[styles.score, { color: t.ai }]}>{aiScore}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 12, gap: 12 },
  card: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 16, borderWidth: 2, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  label: { fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  score: { fontSize: 32, fontWeight: '900' },
  vs: { fontSize: 13, fontWeight: '700', letterSpacing: 1 },
});
