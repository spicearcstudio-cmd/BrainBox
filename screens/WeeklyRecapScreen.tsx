import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, Share, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getWeeklyRecap, WeeklyRecap } from '../services/weeklyRecap';
import AnimatedScreen from '../components/shared/AnimatedScreen';

interface Props { onBack: () => void }

export default function WeeklyRecapScreen({ onBack }: Props) {
  const { theme: t } = useTheme();
  const [recap, setRecap] = useState<WeeklyRecap | null>(null);

  useEffect(() => { getWeeklyRecap().then(setRecap); }, []);

  if (!recap) return null;

  const shareRecap = async () => {
    const msg = [
      '\uD83E\uDDE0 My Brainio Weekly Recap:',
      `\uD83C\uDFAE ${recap.gamesPlayed} games played`,
      `\uD83C\uDFC6 ${recap.gamesWon} wins (${recap.winRate}% win rate)`,
      `\u2B50 +${recap.xpEarned} XP earned`,
      `\uD83D\uDCCA Level ${recap.currentLevel} ${recap.currentTitle}`,
      '',
      'Can you beat my stats? Download Brainio!',
      'https://play.google.com/store/apps/details?id=com.brainbox.games',
    ].join('\n');
    try { await Share.share({ message: msg }); } catch {}
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      <AnimatedScreen>
        <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? 44 : 8 }]}>
          <Pressable onPress={onBack}><Text style={[styles.back, { color: t.textSec }]}>{'\u2190'} Back</Text></Pressable>
          <Text style={[styles.title, { color: t.text }]}>Weekly Recap</Text>
          <View style={{ width: 50 }} />
        </View>

        <View style={styles.content}>
          <Text style={[styles.week, { color: t.textSec }]}>This Week So Far</Text>

          {!recap.hasData ? (
            <View style={[styles.emptyCard, { backgroundColor: t.surface, borderColor: t.cardBorder }]}>
              <Text style={styles.emptyEmoji}>{'\uD83C\uDFAE'}</Text>
              <Text style={[styles.emptyText, { color: t.textSec }]}>No games played this week yet. Start playing to see your recap!</Text>
            </View>
          ) : (
            <>
              <View style={[styles.bigCard, { backgroundColor: t.accent }]}>
                <Text style={styles.bigNum}>{recap.gamesPlayed}</Text>
                <Text style={styles.bigLabel}>Games Played</Text>
              </View>

              <View style={styles.row}>
                <View style={[styles.statCard, { backgroundColor: t.surface, borderColor: t.cardBorder }]}>
                  <Text style={[styles.statNum, { color: t.player }]}>{recap.gamesWon}</Text>
                  <Text style={[styles.statLabel, { color: t.textSec }]}>Wins</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: t.surface, borderColor: t.cardBorder }]}>
                  <Text style={[styles.statNum, { color: t.gold }]}>{recap.winRate}%</Text>
                  <Text style={[styles.statLabel, { color: t.textSec }]}>Win Rate</Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.statCard, { backgroundColor: t.surface, borderColor: t.cardBorder }]}>
                  <Text style={[styles.statNum, { color: t.gold }]}>+{recap.xpEarned}</Text>
                  <Text style={[styles.statLabel, { color: t.textSec }]}>XP Earned</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: t.surface, borderColor: t.cardBorder }]}>
                  <Text style={[styles.statNum, { color: t.accent }]}>{recap.levelsGained > 0 ? `+${recap.levelsGained}` : '\u2014'}</Text>
                  <Text style={[styles.statLabel, { color: t.textSec }]}>Levels Up</Text>
                </View>
              </View>

              <View style={[styles.favCard, { backgroundColor: t.gold + '15', borderColor: t.gold }]}>
                <Text style={[styles.favLabel, { color: t.textSec }]}>Most Played</Text>
                <Text style={[styles.favGame, { color: t.gold }]}>{recap.favoriteGame}</Text>
              </View>

              <Pressable onPress={shareRecap} style={[styles.shareBtn, { backgroundColor: t.accent }]}>
                <Text style={styles.shareBtnText}>{'\uD83D\uDCE4'} Share My Recap</Text>
              </Pressable>
            </>
          )}
        </View>
      </AnimatedScreen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 12 },
  back: { fontSize: 16, width: 50 },
  title: { fontSize: 20, fontWeight: '800' },
  content: { flex: 1, paddingHorizontal: 20 },
  week: { fontSize: 14, fontWeight: '700', textAlign: 'center', marginBottom: 16 },
  bigCard: { borderRadius: 20, padding: 28, alignItems: 'center', marginBottom: 16 },
  bigNum: { fontSize: 52, fontWeight: '900', color: '#fff' },
  bigLabel: { fontSize: 16, fontWeight: '700', color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  statCard: { flex: 1, borderRadius: 16, padding: 18, alignItems: 'center', borderWidth: 1 },
  statNum: { fontSize: 28, fontWeight: '900' },
  statLabel: { fontSize: 12, fontWeight: '600', marginTop: 4 },
  favCard: { borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1.5, marginBottom: 20 },
  favLabel: { fontSize: 12, fontWeight: '600' },
  favGame: { fontSize: 20, fontWeight: '900', marginTop: 4 },
  shareBtn: { paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  shareBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  emptyCard: { borderRadius: 20, padding: 32, alignItems: 'center', borderWidth: 1 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 14, fontWeight: '500', textAlign: 'center', lineHeight: 20 },
});
