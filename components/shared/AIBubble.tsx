import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { AIPersona } from '../../services/aiPersonality';

interface Props {
  persona: AIPersona;
  message: string | null;
  isThinking: boolean;
}

export default function AIBubble({ persona, message, isThinking }: Props) {
  const { theme: t } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const bubbleScale = useRef(new Animated.Value(0.8)).current;
  const [displayMsg, setDisplayMsg] = useState<string | null>(null);

  useEffect(() => {
    if (message) {
      setDisplayMsg(message);
      Animated.sequence([
        Animated.parallel([
          Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
          Animated.spring(bubbleScale, { toValue: 1, tension: 80, friction: 6, useNativeDriver: true }),
        ]),
        Animated.delay(2500),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => {
        setDisplayMsg(null);
        bubbleScale.setValue(0.8);
      });
    }
  }, [message]);

  return (
    <View style={styles.container}>
      <View style={[styles.avatarRow, { backgroundColor: t.surface, borderColor: t.ai + '30' }]}>
        <Text style={styles.avatar}>{persona.avatar}</Text>
        <Text style={[styles.name, { color: t.ai }]}>{persona.name}</Text>
        {isThinking && (
          <Text style={[styles.thinking, { color: t.textSec }]}>thinking...</Text>
        )}
      </View>
      {displayMsg && (
        <Animated.View style={[styles.bubble, { backgroundColor: t.ai + '10', borderColor: t.ai + '30', opacity, transform: [{ scale: bubbleScale }] }]}>
          <Text style={[styles.bubbleText, { color: t.text }]}>{displayMsg}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginBottom: 8, minHeight: 54 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 5, paddingHorizontal: 12, borderRadius: 16, borderWidth: 2, borderStyle: 'dashed' as any },
  avatar: { fontSize: 22 },
  name: { fontSize: 14, fontWeight: '800' },
  thinking: { fontSize: 11, fontStyle: 'italic' },
  bubble: { marginTop: 6, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 16, borderWidth: 1.5, maxWidth: '80%' },
  bubbleText: { fontSize: 12, fontWeight: '600', textAlign: 'center' },
});
