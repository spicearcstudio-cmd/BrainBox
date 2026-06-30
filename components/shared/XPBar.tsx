import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  level: number;
  title: string;
  progress: number;
  xpInLevel: number;
  xpToNext: number;
  isMax: boolean;
}

export default function XPBar({ level, title, progress, xpInLevel, xpToNext, isMax }: Props) {
  const { theme: t } = useTheme();
  const width = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(width, { toValue: progress, tension: 30, friction: 10, useNativeDriver: false }).start();
  }, [progress]);

  const barWidth = width.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={[styles.container, { backgroundColor: t.surface, borderColor: t.cardBorder }]}>
      <View style={styles.header}>
        <Text style={[styles.level, { color: t.gold }]}>Lv.{level}</Text>
        <Text style={[styles.title, { color: t.text }]}>{title}</Text>
        {!isMax && <Text style={[styles.xp, { color: t.textSec }]}>{xpInLevel}/{xpToNext} XP</Text>}
        {isMax && <Text style={[styles.xp, { color: t.gold }]}>MAX</Text>}
      </View>
      <View style={[styles.track, { backgroundColor: t.surfaceAlt }]}>
        <Animated.View style={[styles.fill, { backgroundColor: t.gold, width: barWidth }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 14, padding: 12, borderWidth: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  level: { fontSize: 16, fontWeight: '900' },
  title: { fontSize: 14, fontWeight: '700', flex: 1 },
  xp: { fontSize: 12, fontWeight: '600' },
  track: { height: 8, borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4 },
});
