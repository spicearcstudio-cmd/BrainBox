import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, ScrollView, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { AllStats, loadStats } from '../services/statsManager';
import { GAMES, GameId } from '../constants/games';

interface Props { onBack: () => void }

export default function StatsScreen({ onBack }: Props) {
  const { theme: t } = useTheme();
  const [stats, setStats] = useState<AllStats | null>(null);

  useEffect(() => { loadStats().then(setStats); }, []);

  if (!stats) return null;

  const winRate = stats.totalPlayed > 0 ? Math.round((stats.totalWon / stats.totalPlayed) * 100) : 0;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? 44 : 8 }]}>
        <Pressable onPress={onBack} style={[styles.backBtn, { backgroundColor: t.surface, borderColor: t.cardBorder }]}>
          <Text style={[styles.backText, { color: t.text }]}>{'\u2190'}</Text>
        </Pressable>
        <View style={[styles.titlePill, { backgroundColor: t.surface, borderColor: t.cardBorder }]}>
          <Text style={[styles.title, { color: t.text }]}>{'\uD83D\uDCCA'} Stats</Text>
        </View>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.overviewCard, { backgroundColor: t.surface, borderColor: t.cardBorder }]}>
          <View style={styles.overviewRow}>
            <StatBubble label="Played" value={stats.totalPlayed} color={t.accent} bg={t.accent + '12'} textColor={t.textSec} />
            <StatBubble label="Won" value={stats.totalWon} color={t.player} bg={t.player + '12'} textColor={t.textSec} />
            <StatBubble label="Win %" value={`${winRate}%`} color={t.gold} bg={t.gold + '12'} textColor={t.textSec} />
          </View>
          <View style={styles.overviewRow}>
            <StatBubble label="Streak" value={stats.overallStreak} color={t.ai} bg={t.ai + '12'} textColor={t.textSec} />
            <StatBubble label="Best" value={stats.overallBestStreak} color={t.accent} bg={t.accent + '12'} textColor={t.textSec} />
          </View>
        </View>

        <View style={styles.sectionRow}>
          <View style={[styles.sectionLine, { backgroundColor: t.cardBorder }]} />
          <Text style={[styles.sectionLabel, { color: t.textSec }]}>PER GAME</Text>
          <View style={[styles.sectionLine, { backgroundColor: t.cardBorder }]} />
        </View>

        {GAMES.map(game => {
          const g = stats.games[game.id as GameId];
          if (!g || g.played === 0) return (
            <View key={game.id} style={[styles.gameCard, { backgroundColor: t.surface, borderColor: t.cardBorder }]}>
              <View style={styles.gameHeader}>
                <View style={[styles.gameIconWrap, { backgroundColor: game.color + '12', borderColor: game.color + '25' }]}>
                  <Text style={[styles.gameIcon, { color: game.color }]}>{game.icon}</Text>
                </View>
                <Text style={[styles.gameName, { color: t.text }]}>{game.name}</Text>
              </View>
              <Text style={[styles.noData, { color: t.textSec }]}>No games played yet</Text>
            </View>
          );
          const rate = Math.round((g.won / g.played) * 100);
          return (
            <View key={game.id} style={[styles.gameCard, { backgroundColor: t.surface, borderColor: t.cardBorder }]}>
              <View style={styles.gameHeader}>
                <View style={[styles.gameIconWrap, { backgroundColor: game.color + '12', borderColor: game.color + '25' }]}>
                  <Text style={[styles.gameIcon, { color: game.color }]}>{game.icon}</Text>
                </View>
                <Text style={[styles.gameName, { color: t.text }]}>{game.name}</Text>
                <Text style={[styles.gameRate, { color: game.color }]}>{rate}%</Text>
              </View>
              <View style={styles.gameStatsRow}>
                <MiniStat label="Played" value={g.played} color={t.textSec} />
                <MiniStat label="Won" value={g.won} color={t.player} />
                <MiniStat label="Lost" value={g.lost} color={t.ai} />
                <MiniStat label="Streak" value={g.bestStreak} color={t.gold} />
                {g.bestTurns !== undefined && <MiniStat label="Best" value={`${g.bestTurns}t`} color={t.accent} />}
              </View>
              <View style={[styles.progressBar, { backgroundColor: t.surfaceAlt, borderColor: t.cardBorder }]}>
                <View style={[styles.progressFill, { width: `${rate}%`, backgroundColor: game.color }]} />
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBubble({ label, value, color, bg, textColor }: { label: string; value: number | string; color: string; bg: string; textColor: string }) {
  return (
    <View style={[styles.bubble, { backgroundColor: bg, borderColor: color + '25' }]}>
      <Text style={[styles.bubbleVal, { color }]}>{value}</Text>
      <Text style={[styles.bubbleLabel, { color: textColor }]}>{label}</Text>
    </View>
  );
}

function MiniStat({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <View style={styles.miniStat}>
      <Text style={[styles.miniVal, { color }]}>{value}</Text>
      <Text style={[styles.miniLabel, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 12 },
  backBtn: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderStyle: 'dashed' as any },
  backText: { fontSize: 20, fontWeight: '700' },
  titlePill: { paddingVertical: 6, paddingHorizontal: 18, borderRadius: 16, borderWidth: 2, borderStyle: 'dashed' as any },
  title: { fontSize: 18, fontWeight: '800' },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  overviewCard: { borderRadius: 22, padding: 20, borderWidth: 2, borderStyle: 'dashed' as any, marginBottom: 24 },
  overviewRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 10 },
  bubble: { alignItems: 'center', paddingVertical: 14, paddingHorizontal: 18, borderRadius: 18, minWidth: 80, borderWidth: 1.5 },
  bubbleVal: { fontSize: 28, fontWeight: '900' },
  bubbleLabel: { fontSize: 11, fontWeight: '700', marginTop: 2, letterSpacing: 0.5 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 10 },
  sectionLine: { flex: 1, height: 2, borderRadius: 1 },
  sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 3 },
  gameCard: { borderRadius: 20, padding: 16, borderWidth: 2, borderStyle: 'dashed' as any, marginBottom: 12 },
  gameHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  gameIconWrap: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5 },
  gameIcon: { fontSize: 18, fontWeight: '800' },
  gameName: { fontSize: 16, fontWeight: '700', flex: 1 },
  gameRate: { fontSize: 18, fontWeight: '900' },
  gameStatsRow: { flexDirection: 'row', gap: 16, marginBottom: 10 },
  miniStat: { alignItems: 'center' },
  miniVal: { fontSize: 16, fontWeight: '800' },
  miniLabel: { fontSize: 10, fontWeight: '600', marginTop: 1 },
  noData: { fontSize: 13, fontStyle: 'italic' },
  progressBar: { height: 8, borderRadius: 4, overflow: 'hidden', borderWidth: 1 },
  progressFill: { height: '100%', borderRadius: 4 },
});
