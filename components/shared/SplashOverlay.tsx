import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface Props {
  onDone: () => void;
}

export default function SplashOverlay({ onDone }: Props) {
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.timing(subtitleOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(800),
      Animated.timing(containerOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(onDone);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
      <Animated.View style={{ transform: [{ scale: logoScale }], opacity: logoOpacity }}>
        <Text style={styles.icon}>{'\uD83E\uDDE0'}</Text>
        <Text style={styles.title}>Brainio</Text>
      </Animated.View>
      <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
        Classic Strategy Games
      </Animated.Text>
      <View style={styles.dots}>
        {[0, 1, 2].map(i => (
          <View key={i} style={[styles.dot, { opacity: 0.3 + i * 0.3 }]} />
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', top: 0, left: 0, width, height,
    backgroundColor: '#EDE7F6', justifyContent: 'center', alignItems: 'center', zIndex: 9999,
  },
  icon: { fontSize: 72, textAlign: 'center', marginBottom: 8 },
  title: { fontSize: 42, fontWeight: '900', color: '#5C6BC0', letterSpacing: 2, textAlign: 'center' },
  subtitle: { fontSize: 16, fontWeight: '600', color: '#9575CD', marginTop: 8, letterSpacing: 3 },
  dots: { flexDirection: 'row', gap: 8, position: 'absolute', bottom: 80 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#5C6BC0' },
});
