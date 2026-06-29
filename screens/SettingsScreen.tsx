import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, Alert, Platform, Switch } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { usePremium } from '../context/PremiumContext';
import { ALL_THEMES } from '../constants/colors';
import { isSoundEnabled, setSoundEnabled, isHapticEnabled, setHapticEnabled, initSound } from '../services/soundManager';

interface Props { onBack: () => void }

export default function SettingsScreen({ onBack }: Props) {
  const { theme: t, themeId, setThemeId } = useTheme();
  const { isPremium, purchase, restore } = usePremium();
  const [sound, setSound] = useState(true);
  const [haptic, setHaptic] = useState(true);

  useEffect(() => {
    initSound().then(() => {
      setSound(isSoundEnabled());
      setHaptic(isHapticEnabled());
    });
  }, []);

  const toggleSound = (val: boolean) => {
    setSound(val);
    setSoundEnabled(val);
  };

  const toggleHaptic = (val: boolean) => {
    setHaptic(val);
    setHapticEnabled(val);
  };

  const handlePurchase = async () => {
    await purchase();
    Alert.alert('Premium Unlocked!', 'Ads removed, offline play enabled, and all themes unlocked.');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? 44 : 8 }]}>
        <Pressable onPress={onBack}><Text style={[styles.back, { color: t.textSec }]}>{'\u2190'} Back</Text></Pressable>
        <Text style={[styles.title, { color: t.text }]}>Settings</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.content}>
        {!isPremium && (
          <View style={[styles.premCard, { backgroundColor: t.surface, borderColor: t.gold }]}>
            <Text style={[styles.premTitle, { color: t.gold }]}>Go Premium</Text>
            <Text style={[styles.premDesc, { color: t.textSec }]}>
              Remove ads {'\u2022'} Play offline {'\u2022'} Exclusive themes
            </Text>
            <Pressable onPress={handlePurchase} style={[styles.premBtn, { backgroundColor: t.gold }]}>
              <Text style={styles.premBtnText}>Unlock for $2.99</Text>
            </Pressable>
            <Pressable onPress={restore}><Text style={[styles.restoreText, { color: t.textSec }]}>Restore purchase</Text></Pressable>
          </View>
        )}

        <Text style={[styles.sectionLabel, { color: t.textSec }]}>SOUND & FEEDBACK</Text>
        <View style={[styles.toggleCard, { backgroundColor: t.surface, borderColor: t.cardBorder }]}>
          <View style={styles.toggleRow}>
            <Text style={[styles.toggleLabel, { color: t.text }]}>{'\uD83D\uDD0A'} Sound Effects</Text>
            <Switch value={sound} onValueChange={toggleSound} trackColor={{ true: t.accent, false: t.surfaceAlt }} />
          </View>
          <View style={[styles.divider, { backgroundColor: t.cardBorder }]} />
          <View style={styles.toggleRow}>
            <Text style={[styles.toggleLabel, { color: t.text }]}>{'\uD83D\uDCF3'} Haptic Feedback</Text>
            <Switch value={haptic} onValueChange={toggleHaptic} trackColor={{ true: t.accent, false: t.surfaceAlt }} />
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: t.textSec }]}>THEME</Text>
        <View style={styles.themeRow}>
          {ALL_THEMES.map(th => {
            const locked = th.premium && !isPremium;
            return (
              <Pressable
                key={th.id}
                disabled={locked}
                onPress={() => setThemeId(th.id)}
                style={[styles.themeBtn, {
                  backgroundColor: th.bg,
                  borderColor: themeId === th.id ? th.player : th.cardBorder,
                  borderWidth: themeId === th.id ? 3 : 1.5,
                  opacity: locked ? 0.4 : 1,
                }]}
              >
                <Text style={[styles.themeName, { color: th.text }]}>{th.name}</Text>
                {locked && <Text style={[styles.lockIcon, { color: th.textSec }]}>{'\uD83D\uDD12'}</Text>}
              </Pressable>
            );
          })}
        </View>

        {isPremium && (
          <View style={[styles.statusCard, { backgroundColor: t.surface, borderColor: t.accent }]}>
            <Text style={[styles.statusTitle, { color: t.accent }]}>Premium Active</Text>
            <Text style={[styles.statusDesc, { color: t.textSec }]}>No ads {'\u2022'} Offline play {'\u2022'} All themes</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 12 },
  back: { fontSize: 16, width: 50 },
  title: { fontSize: 20, fontWeight: '800' },
  content: { flex: 1, paddingHorizontal: 24 },
  premCard: { borderRadius: 20, padding: 24, alignItems: 'center', borderWidth: 2, marginBottom: 28 },
  premTitle: { fontSize: 22, fontWeight: '900', marginBottom: 6 },
  premDesc: { fontSize: 13, marginBottom: 18, textAlign: 'center' },
  premBtn: { paddingVertical: 14, paddingHorizontal: 40, borderRadius: 14 },
  premBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  restoreText: { fontSize: 13, marginTop: 12, textDecorationLine: 'underline' },
  sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 3, marginBottom: 12 },
  toggleCard: { borderRadius: 16, borderWidth: 1.5, marginBottom: 24, overflow: 'hidden' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  toggleLabel: { fontSize: 15, fontWeight: '600' },
  divider: { height: 1 },
  themeRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', marginBottom: 24 },
  themeBtn: { paddingVertical: 16, paddingHorizontal: 20, borderRadius: 16, alignItems: 'center', minWidth: 80 },
  themeName: { fontSize: 14, fontWeight: '700' },
  lockIcon: { fontSize: 12, marginTop: 4 },
  statusCard: { borderRadius: 16, padding: 18, alignItems: 'center', borderWidth: 2 },
  statusTitle: { fontSize: 16, fontWeight: '800' },
  statusDesc: { fontSize: 12, marginTop: 4 },
});
