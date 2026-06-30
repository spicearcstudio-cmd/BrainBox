import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, ScrollView, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { usePremium } from '../context/PremiumContext';
import { GAMES, GameId } from '../constants/games';
import { getDailyChallenge, isDailyChallengeCompleted } from '../services/dailyChallenge';
import { getParentalState } from '../services/parentalControl';
import AnimatedScreen from '../components/shared/AnimatedScreen';

interface Props {
  onSelectGame: (id: GameId) => void;
  onSettings: () => void;
  onStats: () => void;
  onDaily: () => void;
}

export default function HomeScreen({ onSelectGame, onSettings, onStats, onDaily }: Props) {
  const { theme: t } = useTheme();
  const { isPremium } = usePremium();
  const [dailyDone, setDailyDone] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const daily = getDailyChallenge();

  useEffect(() => {
    isDailyChallengeCompleted().then(setDailyDone);
    getParentalState().then(s => { if (s.enabled) setRemaining(s.remaining); });
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      <AnimatedScreen>
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? 44 : 8 }]}>
        <Pressable onPress={onStats} style={styles.iconBtn}>
          <Text style={{ fontSize: 22 }}>{'\uD83D\uDCCA'}</Text>
        </Pressable>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: t.text }]}>Brain Box</Text>
          {isPremium && <View style={styles.proBadge}><Text style={styles.proText}>PRO</Text></View>}
        </View>
        <Pressable onPress={onSettings} style={styles.iconBtn}>
          <Text style={{ fontSize: 22 }}>{'\u2699'}</Text>
        </Pressable>
      </View>

      <Text style={[styles.subtitle, { color: t.textSec }]}>Classic Strategy Games</Text>

      {remaining !== null && (
        <View style={[styles.limitBanner, { backgroundColor: t.gold + '20' }]}>
          <Text style={[styles.limitText, { color: t.gold }]}>{'\uD83D\uDD12'} {remaining} games remaining today</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Pressable
          onPress={onDaily}
          style={({ pressed }) => [styles.dailyCard, {
            backgroundColor: t.gold + '15',
            borderColor: t.gold,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          }]}
        >
          <View style={styles.dailyLeft}>
            <Text style={{ fontSize: 28 }}>{'\uD83C\uDFC6'}</Text>
          </View>
          <View style={styles.dailyCenter}>
            <Text style={[styles.dailyTitle, { color: t.gold }]}>Daily Challenge</Text>
            <Text style={[styles.dailyDesc, { color: t.textSec }]}>{daily.gameName} \u2014 {daily.description}</Text>
          </View>
          {dailyDone && (
            <View style={[styles.dailyCheck, { backgroundColor: t.accent }]}>
              <Text style={styles.dailyCheckText}>{'\u2714'}</Text>
            </View>
          )}
        </Pressable>

        <View style={styles.grid}>
          {GAMES.map(game => (
            <Pressable
              key={game.id}
              onPress={() => onSelectGame(game.id)}
              style={({ pressed }) => [
                styles.card,
                { backgroundColor: t.card, borderColor: t.cardBorder, transform: [{ scale: pressed ? 0.96 : 1 }] },
              ]}
            >
              <View style={[styles.iconWrap, { backgroundColor: game.color + '18' }]}>
                <Text style={[styles.icon, { color: game.color }]}>{game.icon}</Text>
              </View>
              <Text style={[styles.gameName, { color: t.text }]}>{game.name}</Text>
              <Text style={[styles.gameDesc, { color: t.textSec }]}>{game.description}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      </AnimatedScreen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 28, fontWeight: '900', letterSpacing: 1 },
  proBadge: { backgroundColor: '#FFB300', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  proText: { color: '#fff', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  iconBtn: { width: 40, alignItems: 'center' },
  subtitle: { fontSize: 14, fontWeight: '600', textAlign: 'center', marginBottom: 12 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 30 },
  dailyCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 18, borderWidth: 2, marginBottom: 16 },
  dailyLeft: { marginRight: 12 },
  dailyCenter: { flex: 1 },
  dailyTitle: { fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  dailyDesc: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  dailyCheck: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  dailyCheckText: { color: '#fff', fontSize: 14, fontWeight: '900' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'center' },
  card: { width: '45%', minWidth: 150, borderRadius: 20, padding: 18, borderWidth: 1.5, elevation: 3, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
  iconWrap: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  icon: { fontSize: 26, fontWeight: '800' },
  gameName: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
  gameDesc: { fontSize: 12, fontWeight: '500', lineHeight: 16 },
  limitBanner: { marginHorizontal: 16, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12, alignItems: 'center', marginBottom: 8 },
  limitText: { fontSize: 13, fontWeight: '700' },
});
