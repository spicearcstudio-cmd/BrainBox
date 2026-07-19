import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
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
  const humanPulse = useRef(new Animated.Value(1)).current;
  const aiPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (gameOver) return;
    const target = currentPlayer === 'human' ? humanPulse : aiPulse;
    const other = currentPlayer === 'human' ? aiPulse : humanPulse;
    other.setValue(1);
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(target, { toValue: 1.03, duration: 600, useNativeDriver: true }),
        Animated.timing(target, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [currentPlayer, gameOver]);

  return (
    <View style={styles.row}>
      <Animated.View style={[styles.card, {
        backgroundColor: t.surface,
        borderColor: currentPlayer === 'human' && !gameOver ? t.player + '60' : t.cardBorder,
        transform: [{ scale: humanPulse }],
      }]}>
        <Text style={{ fontSize: 16, marginBottom: 2 }}>{'\uD83D\uDE0E'}</Text>
        <Text style={[styles.label, { color: t.player }]}>{humanLabel}</Text>
        <Text style={[styles.score, { color: t.player }]}>{humanScore}</Text>
      </Animated.View>
      <View style={[styles.vsCircle, { backgroundColor: t.surface, borderColor: t.cardBorder }]}>
        <Text style={[styles.vs, { color: t.textSec }]}>VS</Text>
      </View>
      <Animated.View style={[styles.card, {
        backgroundColor: t.surface,
        borderColor: currentPlayer === 'ai' && !gameOver ? t.ai + '60' : t.cardBorder,
        transform: [{ scale: aiPulse }],
      }]}>
        <Text style={{ fontSize: 16, marginBottom: 2 }}>{'\uD83E\uDD16'}</Text>
        <Text style={[styles.label, { color: t.ai }]}>{aiLabel}</Text>
        <Text style={[styles.score, { color: t.ai }]}>{aiScore}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 12, gap: 10 },
  card: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 22, borderWidth: 2, borderStyle: 'dashed' as any },
  label: { fontSize: 11, fontWeight: '900', letterSpacing: 2.5 },
  score: { fontSize: 36, fontWeight: '900', marginTop: 2 },
  vsCircle: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderStyle: 'dashed' as any },
  vs: { fontSize: 10, fontWeight: '900', letterSpacing: 1 },
});
