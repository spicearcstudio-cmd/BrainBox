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
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 12, gap: 14 },
  card: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 18, borderWidth: 2.5, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
  label: { fontSize: 11, fontWeight: '900', letterSpacing: 2.5 },
  score: { fontSize: 36, fontWeight: '900', marginTop: 2 },
  vs: { fontSize: 12, fontWeight: '800', letterSpacing: 1.5 },
});
