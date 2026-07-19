import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions, Easing } from 'react-native';

const { width, height } = Dimensions.get('window');

interface Props {
  onDone: () => void;
}

export default function SplashOverlay({ onDone }: Props) {
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, tension: 50, friction: 5, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.sequence([
          Animated.timing(logoRotate, { toValue: 1, duration: 150, useNativeDriver: true }),
          Animated.timing(logoRotate, { toValue: -0.5, duration: 120, useNativeDriver: true }),
          Animated.timing(logoRotate, { toValue: 0, duration: 100, useNativeDriver: true }),
        ]),
      ]),
      Animated.timing(subtitleOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(800),
      Animated.timing(containerOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(onDone);
  }, []);

  const rotate = logoRotate.interpolate({ inputRange: [-1, 0, 1], outputRange: ['-10deg', '0deg', '10deg'] });

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
      <Animated.View style={{ transform: [{ scale: logoScale }, { rotate }], opacity: logoOpacity }}>
        <Text style={styles.icon}>{'\uD83E\uDDE0'}</Text>
        <Text style={styles.title}>Brainio</Text>
      </Animated.View>
      <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
        {'\u2728'} Train your brain, have fun! {'\u2728'}
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
    backgroundColor: '#FFF5EC', justifyContent: 'center', alignItems: 'center', zIndex: 9999,
  },
  icon: { fontSize: 80, textAlign: 'center', marginBottom: 8 },
  title: { fontSize: 44, fontWeight: '900', color: '#E8734A', letterSpacing: 2, textAlign: 'center' },
  subtitle: { fontSize: 15, fontWeight: '600', color: '#9B8574', marginTop: 10, letterSpacing: 2 },
  dots: { flexDirection: 'row', gap: 10, position: 'absolute', bottom: 80 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E8734A' },
});
