import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { usePremium } from '../../context/PremiumContext';
import { useTheme } from '../../context/ThemeContext';

export default function AdBanner() {
  const { isPremium } = usePremium();
  const { theme: t } = useTheme();

  if (isPremium) return null;

  return (
    <View style={[styles.banner, { backgroundColor: t.surfaceAlt, borderColor: t.cardBorder }]}>
      <Text style={[styles.text, { color: t.textSec }]}>Ad Space \u2014 Go Premium to remove</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { height: 50, justifyContent: 'center', alignItems: 'center', borderTopWidth: 1 },
  text: { fontSize: 12, fontWeight: '600' },
});
