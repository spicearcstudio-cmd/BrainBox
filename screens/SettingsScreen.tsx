import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, Alert, Platform, Switch, TextInput, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { usePremium } from '../context/PremiumContext';
import { ALL_THEMES, SEASONAL_THEMES, getActiveSeasonalTheme } from '../constants/colors';
import { isSoundEnabled, setSoundEnabled, isHapticEnabled, setHapticEnabled, initSound } from '../services/soundManager';
import { ParentalState, getParentalState, setParentalEnabled, setDailyLimit, PARENTAL_MIN_GAMES } from '../services/parentalControl';
import { isNotificationsEnabled, setNotificationsEnabled } from '../services/notifications';

interface Props { onBack: () => void }

export default function SettingsScreen({ onBack }: Props) {
  const { theme: t, themeId, setThemeId } = useTheme();
  const { isPremium, purchase, restore } = usePremium();
  const [sound, setSound] = useState(true);
  const [haptic, setHaptic] = useState(true);
  const [parental, setParental] = useState<ParentalState | null>(null);
  const [limitInput, setLimitInput] = useState('');
  const [notif, setNotif] = useState(false);
  const seasonalTheme = getActiveSeasonalTheme();

  useEffect(() => {
    initSound().then(() => {
      setSound(isSoundEnabled());
      setHaptic(isHapticEnabled());
    });
    getParentalState().then(s => {
      setParental(s);
      setLimitInput(String(s.dailyLimit));
    });
    isNotificationsEnabled().then(setNotif);
  }, []);

  const toggleSound = (val: boolean) => { setSound(val); setSoundEnabled(val); };
  const toggleHaptic = (val: boolean) => { setHaptic(val); setHapticEnabled(val); };
  const toggleNotif = async (val: boolean) => { setNotif(val); await setNotificationsEnabled(val); };

  const toggleParental = async (val: boolean) => {
    await setParentalEnabled(val);
    const s = await getParentalState();
    setParental(s);
    setLimitInput(String(s.dailyLimit));
  };

  const handleLimitChange = async () => {
    const num = parseInt(limitInput, 10);
    if (isNaN(num) || num < PARENTAL_MIN_GAMES) {
      Alert.alert('Invalid Limit', `Minimum is ${PARENTAL_MIN_GAMES} games per day.`);
      setLimitInput(String(parental?.dailyLimit ?? PARENTAL_MIN_GAMES));
      return;
    }
    await setDailyLimit(num);
    const s = await getParentalState();
    setParental(s);
    Alert.alert('Limit Updated', `New limit of ${num} games will take effect from tomorrow.`);
  };

  const handlePurchase = async () => {
    await purchase();
    Alert.alert('Premium Unlocked!', 'Ads removed, offline play enabled, and all themes unlocked.');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? 44 : 8 }]}>
        <Pressable onPress={onBack} style={[styles.backBtn, { backgroundColor: t.surface, borderColor: t.cardBorder }]}>
          <Text style={[styles.backText, { color: t.text }]}>{'\u2190'}</Text>
        </Pressable>
        <View style={[styles.titlePill, { backgroundColor: t.surface, borderColor: t.cardBorder }]}>
          <Text style={[styles.title, { color: t.text }]}>{'\u2699\uFE0F'} Settings</Text>
        </View>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!isPremium && (
          <View style={[styles.premCard, { backgroundColor: t.gold + '0D', borderColor: t.gold + '40' }]}>
            <Text style={{ fontSize: 28, marginBottom: 8 }}>{'\u2B50'}</Text>
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

        <Text style={[styles.sectionLabel, { color: t.textSec }]}>{'\uD83D\uDD0A'} SOUND & FEEDBACK</Text>
        <View style={[styles.toggleCard, { backgroundColor: t.surface, borderColor: t.cardBorder }]}>
          <View style={styles.toggleRow}>
            <Text style={[styles.toggleLabel, { color: t.text }]}>Sound Effects</Text>
            <Switch value={sound} onValueChange={toggleSound} trackColor={{ true: t.accent, false: t.surfaceAlt }} />
          </View>
          <View style={[styles.divider, { backgroundColor: t.cardBorder }]} />
          <View style={styles.toggleRow}>
            <Text style={[styles.toggleLabel, { color: t.text }]}>Haptic Feedback</Text>
            <Switch value={haptic} onValueChange={toggleHaptic} trackColor={{ true: t.accent, false: t.surfaceAlt }} />
          </View>
          <View style={[styles.divider, { backgroundColor: t.cardBorder }]} />
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.toggleLabel, { color: t.text }]}>Notifications</Text>
              <Text style={[styles.toggleHint, { color: t.textSec }]}>Daily challenge & streak reminders</Text>
            </View>
            <Switch value={notif} onValueChange={toggleNotif} trackColor={{ true: t.accent, false: t.surfaceAlt }} />
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: t.textSec }]}>{'\uD83D\uDD12'} PARENTAL CONTROLS</Text>
        <View style={[styles.toggleCard, { backgroundColor: t.surface, borderColor: t.cardBorder }]}>
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.toggleLabel, { color: t.text }]}>Daily Game Limit</Text>
              <Text style={[styles.toggleHint, { color: t.textSec }]}>Restrict games per day</Text>
            </View>
            <Switch value={parental?.enabled ?? false} onValueChange={toggleParental} trackColor={{ true: t.accent, false: t.surfaceAlt }} />
          </View>
          {parental?.enabled && (
            <>
              <View style={[styles.divider, { backgroundColor: t.cardBorder }]} />
              <View style={styles.limitSection}>
                <Text style={[styles.limitLabel, { color: t.text }]}>Max games per day (min {PARENTAL_MIN_GAMES})</Text>
                <View style={styles.limitRow}>
                  <TextInput
                    style={[styles.limitInput, { color: t.text, borderColor: t.cardBorder, backgroundColor: t.surfaceAlt }]}
                    value={limitInput}
                    onChangeText={setLimitInput}
                    keyboardType="number-pad"
                    maxLength={4}
                  />
                  <Pressable onPress={handleLimitChange} style={[styles.limitBtn, { backgroundColor: t.accent }]}>
                    <Text style={styles.limitBtnText}>Set</Text>
                  </Pressable>
                </View>
                <Text style={[styles.limitNote, { color: t.textSec }]}>
                  Today: {parental.gamesPlayedToday}/{parental.dailyLimit} games played
                  {parental.pendingLimit !== null ? `\nNew limit of ${parental.pendingLimit} starts tomorrow` : ''}
                </Text>
              </View>
            </>
          )}
        </View>

        <Text style={[styles.sectionLabel, { color: t.textSec }]}>{'\uD83C\uDFA8'} THEME</Text>
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
                  borderColor: themeId === th.id ? th.accent : th.cardBorder,
                  borderWidth: themeId === th.id ? 3 : 2,
                  opacity: locked ? 0.4 : 1,
                }]}
              >
                <Text style={[styles.themeName, { color: th.text }]}>{th.name}</Text>
                {locked && <Text style={[styles.lockIcon, { color: th.textSec }]}>{'\uD83D\uDD12'}</Text>}
              </Pressable>
            );
          })}
        </View>

        {seasonalTheme && (
          <>
            <Text style={[styles.sectionLabel, { color: t.textSec }]}>SEASONAL THEME</Text>
            <Pressable
              onPress={() => setThemeId(seasonalTheme.id)}
              style={[styles.seasonalCard, {
                backgroundColor: seasonalTheme.bg,
                borderColor: themeId === seasonalTheme.id ? seasonalTheme.accent : seasonalTheme.cardBorder,
                borderWidth: themeId === seasonalTheme.id ? 3 : 2,
              }]}
            >
              <Text style={[styles.seasonalName, { color: seasonalTheme.text }]}>{'\uD83C\uDF89'} {seasonalTheme.name}</Text>
              <Text style={[styles.seasonalDesc, { color: seasonalTheme.textSec }]}>Limited time theme!</Text>
            </Pressable>
          </>
        )}

        {SEASONAL_THEMES.length > 0 && !seasonalTheme && (
          <>
            <Text style={[styles.sectionLabel, { color: t.textSec }]}>SEASONAL THEMES</Text>
            <View style={[styles.seasonalLocked, { backgroundColor: t.surface, borderColor: t.cardBorder }]}>
              <Text style={styles.seasonalLockedEmoji}>{'\uD83D\uDD12'}</Text>
              <Text style={[styles.seasonalLockedText, { color: t.textSec }]}>Seasonal themes appear during holidays!</Text>
            </View>
          </>
        )}

        {isPremium && (
          <View style={[styles.statusCard, { backgroundColor: t.accent + '0D', borderColor: t.accent + '40' }]}>
            <Text style={[styles.statusTitle, { color: t.accent }]}>{'\u2728'} Premium Active</Text>
            <Text style={[styles.statusDesc, { color: t.textSec }]}>No ads {'\u2022'} Offline play {'\u2022'} All themes</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 12 },
  backBtn: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderStyle: 'dashed' as any },
  backText: { fontSize: 20, fontWeight: '700' },
  titlePill: { paddingVertical: 6, paddingHorizontal: 18, borderRadius: 16, borderWidth: 2, borderStyle: 'dashed' as any },
  title: { fontSize: 18, fontWeight: '800' },
  content: { flex: 1, paddingHorizontal: 24 },
  premCard: { borderRadius: 24, padding: 24, alignItems: 'center', borderWidth: 2, borderStyle: 'dashed' as any, marginBottom: 28 },
  premTitle: { fontSize: 22, fontWeight: '900', marginBottom: 6 },
  premDesc: { fontSize: 13, marginBottom: 18, textAlign: 'center' },
  premBtn: { paddingVertical: 14, paddingHorizontal: 40, borderRadius: 18 },
  premBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  restoreText: { fontSize: 13, marginTop: 12, textDecorationLine: 'underline' },
  sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 3, marginBottom: 12 },
  toggleCard: { borderRadius: 20, borderWidth: 2, borderStyle: 'dashed' as any, marginBottom: 24, overflow: 'hidden' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  toggleLabel: { fontSize: 15, fontWeight: '600' },
  toggleHint: { fontSize: 12, marginTop: 2 },
  divider: { height: 1, marginHorizontal: 12 },
  limitSection: { paddingHorizontal: 16, paddingVertical: 14 },
  limitLabel: { fontSize: 14, fontWeight: '600', marginBottom: 10 },
  limitRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  limitInput: { flex: 1, borderWidth: 2, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, fontSize: 18, fontWeight: '700', textAlign: 'center', borderStyle: 'dashed' as any },
  limitBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 14 },
  limitBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  limitNote: { fontSize: 12, marginTop: 10, lineHeight: 18 },
  themeRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', marginBottom: 24 },
  themeBtn: { paddingVertical: 16, paddingHorizontal: 20, borderRadius: 18, alignItems: 'center', minWidth: 80, borderStyle: 'dashed' as any },
  themeName: { fontSize: 14, fontWeight: '700' },
  lockIcon: { fontSize: 12, marginTop: 4 },
  statusCard: { borderRadius: 20, padding: 18, alignItems: 'center', borderWidth: 2, borderStyle: 'dashed' as any },
  statusTitle: { fontSize: 16, fontWeight: '800' },
  statusDesc: { fontSize: 12, marginTop: 4 },
  seasonalCard: { borderRadius: 20, padding: 18, alignItems: 'center', marginBottom: 24, borderStyle: 'dashed' as any },
  seasonalName: { fontSize: 18, fontWeight: '800' },
  seasonalDesc: { fontSize: 12, fontWeight: '500', marginTop: 4 },
  seasonalLocked: { borderRadius: 20, padding: 18, alignItems: 'center', borderWidth: 2, marginBottom: 24, borderStyle: 'dashed' as any },
  seasonalLockedEmoji: { fontSize: 24, marginBottom: 6 },
  seasonalLockedText: { fontSize: 13, fontWeight: '500' },
});
