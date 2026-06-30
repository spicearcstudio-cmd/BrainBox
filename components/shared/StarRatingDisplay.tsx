import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

interface Props {
  stars: number;
  size?: number;
  animate?: boolean;
}

export default function StarRatingDisplay({ stars, size = 32, animate = true }: Props) {
  const scales = [
    useRef(new Animated.Value(animate ? 0 : 1)).current,
    useRef(new Animated.Value(animate ? 0 : 1)).current,
    useRef(new Animated.Value(animate ? 0 : 1)).current,
  ];

  useEffect(() => {
    if (!animate) return;
    const anims = [];
    for (let i = 0; i < 3; i++) {
      anims.push(Animated.delay(i * 300));
      if (i < stars) {
        anims.push(
          Animated.spring(scales[i], { toValue: 1, tension: 120, friction: 5, useNativeDriver: true })
        );
      } else {
        anims.push(
          Animated.timing(scales[i], { toValue: 1, duration: 200, useNativeDriver: true })
        );
      }
    }
    Animated.sequence(anims).start();
  }, [stars]);

  return (
    <View style={styles.row}>
      {[0, 1, 2].map(i => (
        <Animated.Text
          key={i}
          style={[
            { fontSize: size, transform: [{ scale: scales[i] }] },
            i >= stars && styles.empty,
          ]}
        >
          {i < stars ? '\u2B50' : '\u2606'}
        </Animated.Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 4, justifyContent: 'center', alignItems: 'center' },
  empty: { opacity: 0.3 },
});
