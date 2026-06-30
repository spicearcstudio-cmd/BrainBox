import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface ToastItem {
  icon: string;
  title: string;
  description: string;
}

let showQueue: ((item: ToastItem) => void) | null = null;

export function triggerAchievementToast(icon: string, title: string, description: string) {
  showQueue?.({ icon, title, description });
}

export default function AchievementToast() {
  const { theme: t } = useTheme();
  const [item, setItem] = useState<ToastItem | null>(null);
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const queue = useRef<ToastItem[]>([]);
  const showing = useRef(false);

  useEffect(() => {
    showQueue = (newItem) => {
      queue.current.push(newItem);
      if (!showing.current) showNext();
    };
    return () => { showQueue = null; };
  }, []);

  const showNext = () => {
    const next = queue.current.shift();
    if (!next) { showing.current = false; return; }
    showing.current = true;
    setItem(next);
    translateY.setValue(-120);
    opacity.setValue(0);

    Animated.sequence([
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]),
      Animated.delay(2500),
      Animated.parallel([
        Animated.timing(translateY, { toValue: -120, duration: 250, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]),
    ]).start(() => {
      setItem(null);
      showNext();
    });
  };

  if (!item) return null;

  return (
    <Animated.View style={[styles.container, { backgroundColor: t.gold, transform: [{ translateY }], opacity }]}>
      <Text style={styles.icon}>{item.icon}</Text>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.desc}>{item.description}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', top: 50, left: 20, right: 20,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 14, paddingHorizontal: 18, borderRadius: 16,
    elevation: 10, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
    zIndex: 500,
  },
  icon: { fontSize: 28 },
  textWrap: { flex: 1 },
  title: { color: '#fff', fontSize: 15, fontWeight: '900' },
  desc: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '600', marginTop: 1 },
});
