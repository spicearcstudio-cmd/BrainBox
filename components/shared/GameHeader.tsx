import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform, Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  title: string;
  onBack: () => void;
  showConfirmOnBack?: boolean;
}

export default function GameHeader({ title, onBack, showConfirmOnBack = true }: Props) {
  const { theme: t } = useTheme();

  const handleBack = () => {
    if (showConfirmOnBack) {
      Alert.alert(
        'Leave Game?',
        'Your progress will be lost.',
        [
          { text: 'Stay', style: 'cancel' },
          { text: 'Leave', style: 'destructive', onPress: onBack },
        ],
      );
    } else {
      onBack();
    }
  };

  return (
    <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? 44 : 8 }]}>
      <Pressable onPress={handleBack} style={[styles.backBtn, { backgroundColor: t.surface, borderColor: t.cardBorder }]} accessibilityRole="button" accessibilityLabel="Go back">
        <Text style={[styles.backText, { color: t.text }]}>{'\u2190'}</Text>
      </Pressable>
      <View style={[styles.titlePill, { backgroundColor: t.surface, borderColor: t.cardBorder }]}>
        <Text style={[styles.title, { color: t.text }]} accessibilityRole="header">{title}</Text>
      </View>
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  backBtn: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderStyle: 'dashed' as any },
  backText: { fontSize: 20, fontWeight: '700' },
  titlePill: { paddingVertical: 6, paddingHorizontal: 18, borderRadius: 16, borderWidth: 2, borderStyle: 'dashed' as any },
  title: { fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  spacer: { width: 42 },
});
