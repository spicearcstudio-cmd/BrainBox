import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  visible: boolean;
  level: number;
  title: string;
  onDone: () => void;
}

export default function LevelUpOverlay({ visible, level, title, onDone }: Props) {
  const { theme: t } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.3)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    opacity.setValue(0);
    scale.setValue(0.3);
    rotate.setValue(0);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, tension: 80, friction: 6, useNativeDriver: true }),
        Animated.timing(rotate, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.delay(2000),
      Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(onDone);
  }, [visible]);

  if (!visible) return null;

  const spin = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View style={[styles.overlay, { opacity }]}>
      <Animated.View style={[styles.badge, { backgroundColor: t.gold, transform: [{ scale }] }]}>
        <Animated.Text style={[styles.star, { transform: [{ rotate: spin }] }]}>{'\u2B50'}</Animated.Text>
        <Text style={styles.levelUp}>LEVEL UP!</Text>
        <Text style={styles.level}>Level {level}</Text>
        <Text style={styles.title}>{title}</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', zIndex: 300,
  },
  badge: { alignItems: 'center', padding: 32, borderRadius: 24, minWidth: 200 },
  star: { fontSize: 52, marginBottom: 8 },
  levelUp: { color: '#fff', fontSize: 24, fontWeight: '900', letterSpacing: 3 },
  level: { color: 'rgba(255,255,255,0.9)', fontSize: 18, fontWeight: '700', marginTop: 4 },
  title: { color: '#fff', fontSize: 16, fontWeight: '600', marginTop: 2, opacity: 0.85 },
});
