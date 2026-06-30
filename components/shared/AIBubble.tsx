import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
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
  const [displayMsg, setDisplayMsg] = useState<string | null>(null);

  useEffect(() => {
    if (message) {
      setDisplayMsg(message);
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.delay(2500),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => setDisplayMsg(null));
    }
  }, [message]);

  return (
    <View style={styles.container}>
      <View style={styles.avatarRow}>
        <Text style={styles.avatar}>{persona.avatar}</Text>
        <Text style={[styles.name, { color: t.ai }]}>{persona.name}</Text>
        {isThinking && (
          <Text style={[styles.thinking, { color: t.textSec }]}>thinking...</Text>
        )}
      </View>
      {displayMsg && (
        <Animated.View style={[styles.bubble, { backgroundColor: t.ai + '15', borderColor: t.ai + '40', opacity }]}>
          <Text style={[styles.bubbleText, { color: t.text }]}>{displayMsg}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginBottom: 8, minHeight: 54 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  avatar: { fontSize: 22 },
  name: { fontSize: 14, fontWeight: '800' },
  thinking: { fontSize: 11, fontStyle: 'italic' },
  bubble: { marginTop: 4, paddingVertical: 6, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1, maxWidth: '80%' },
  bubbleText: { fontSize: 12, fontWeight: '600', textAlign: 'center' },
});
