import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle, StyleProp } from 'react-native';

interface Props {
  children: React.ReactNode;
  active: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function PulseView({ children, active, style }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const anim = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (active) {
      anim.current = Animated.loop(
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.05, duration: 600, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      );
      anim.current.start();
    } else {
      anim.current?.stop();
      scale.setValue(1);
    }
    return () => { anim.current?.stop(); };
  }, [active]);

  return (
    <Animated.View style={[style, { transform: [{ scale }] }]}>
      {children}
    </Animated.View>
  );
}
