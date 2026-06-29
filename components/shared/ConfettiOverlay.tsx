import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions, StyleSheet } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');
const PARTICLE_COUNT = 40;
const COLORS = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6FB5', '#C97BDB', '#00D2FF', '#FF9A3C'];

interface Particle {
  x: Animated.Value;
  y: Animated.Value;
  rotate: Animated.Value;
  scale: Animated.Value;
  opacity: Animated.Value;
  color: string;
  size: number;
  shape: 'square' | 'circle';
}

export default function ConfettiOverlay({ visible }: { visible: boolean }) {
  const particles = useRef<Particle[]>([]);

  if (particles.current.length === 0) {
    particles.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      rotate: new Animated.Value(0),
      scale: new Animated.Value(1),
      opacity: new Animated.Value(0),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 8,
      shape: Math.random() > 0.5 ? 'square' : 'circle',
    }));
  }

  useEffect(() => {
    if (!visible) return;

    const anims = particles.current.map((p) => {
      const startX = W * 0.2 + Math.random() * W * 0.6;
      const endX = startX + (Math.random() - 0.5) * W * 0.8;
      const dur = 1200 + Math.random() * 800;
      const delay = Math.random() * 400;

      p.x.setValue(startX);
      p.y.setValue(-20);
      p.rotate.setValue(0);
      p.opacity.setValue(1);
      p.scale.setValue(0.5 + Math.random() * 0.8);

      return Animated.parallel([
        Animated.timing(p.y, { toValue: H + 40, duration: dur, delay, useNativeDriver: true }),
        Animated.timing(p.x, { toValue: endX, duration: dur, delay, useNativeDriver: true }),
        Animated.timing(p.rotate, { toValue: 4 + Math.random() * 8, duration: dur, delay, useNativeDriver: true }),
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(p.opacity, { toValue: 1, duration: 100, useNativeDriver: true }),
          Animated.delay(dur * 0.6),
          Animated.timing(p.opacity, { toValue: 0, duration: dur * 0.3, useNativeDriver: true }),
        ]),
      ]);
    });

    Animated.parallel(anims).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.current.map((p, i) => (
        <Animated.View
          key={i}
          style={[
            styles.particle,
            {
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: p.shape === 'circle' ? p.size / 2 : 2,
              opacity: p.opacity,
              transform: [
                { translateX: p.x },
                { translateY: p.y },
                { rotate: p.rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) },
                { scale: p.scale },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 200 },
  particle: { position: 'absolute' },
});
