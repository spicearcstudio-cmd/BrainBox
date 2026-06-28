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
      <Pressable onPress={handleBack} style={styles.backBtn}>
        <Text style={[styles.backText, { color: t.textSec }]}>{'\u2190'}</Text>
      </Pressable>
      <Text style={[styles.title, { color: t.text }]}>{title}</Text>
      <View style={styles.backBtn} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  backText: { fontSize: 24, fontWeight: '600' },
  title: { fontSize: 17, fontWeight: '800', letterSpacing: 2 },
});
