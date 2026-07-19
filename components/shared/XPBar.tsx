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
  const starPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(width, { toValue: progress, tension: 30, friction: 10, useNativeDriver: false }).start();
  }, [progress]);

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(starPulse, { toValue: 1.15, duration: 1000, useNativeDriver: true }),
        Animated.timing(starPulse, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const barWidth = width.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={[styles.container, { backgroundColor: t.surface, borderColor: t.cardBorder }]}>
      <View style={styles.header}>
        <Animated.View style={[styles.levelBadge, { backgroundColor: t.gold + '20', borderColor: t.gold + '40', transform: [{ scale: starPulse }] }]}>
          <Text style={[styles.level, { color: t.gold }]}>{'\u2B50'} Lv.{level}</Text>
        </Animated.View>
        <Text style={[styles.title, { color: t.text }]}>{title}</Text>
        {!isMax && <Text style={[styles.xp, { color: t.textSec }]}>{xpInLevel}/{xpToNext}</Text>}
        {isMax && <Text style={[styles.xp, { color: t.gold }]}>{'\uD83C\uDF1F'} MAX</Text>}
      </View>
      <View style={[styles.track, { backgroundColor: t.surfaceAlt, borderColor: t.cardBorder }]}>
        <Animated.View style={[styles.fill, { backgroundColor: t.gold, width: barWidth }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 20, padding: 14, borderWidth: 2, borderStyle: 'dashed' as any },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  levelBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1.5 },
  level: { fontSize: 14, fontWeight: '900' },
  title: { fontSize: 14, fontWeight: '700', flex: 1 },
  xp: { fontSize: 12, fontWeight: '600' },
  track: { height: 10, borderRadius: 5, overflow: 'hidden', borderWidth: 1 },
  fill: { height: '100%', borderRadius: 5 },
});
