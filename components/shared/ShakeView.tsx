import React, { useImperativeHandle, useRef, forwardRef } from 'react';
import { Animated, ViewStyle, StyleProp } from 'react-native';

export interface ShakeRef {
  shake: () => void;
}

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const ShakeView = forwardRef<ShakeRef, Props>(({ children, style }, ref) => {
  const translateX = useRef(new Animated.Value(0)).current;

  useImperativeHandle(ref, () => ({
    shake: () => {
      Animated.sequence([
        Animated.timing(translateX, { toValue: 8, duration: 50, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: -8, duration: 50, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: 6, duration: 50, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: -6, duration: 50, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    },
  }));

  return (
    <Animated.View style={[style, { transform: [{ translateX }] }]}>
      {children}
    </Animated.View>
  );
});

export default ShakeView;
