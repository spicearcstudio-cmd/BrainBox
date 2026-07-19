import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, ScrollView, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getAllAchievements, Achievement } from '../services/achievementManager';
import AnimatedScreen from '../components/shared/AnimatedScreen';

interface Props { onBack: () => void }

export default function AchievementsScreen({ onBack }: Props) {
  const { theme: t } = useTheme();
  const [badges, setBadges] = useState<{ achievement: Achievement; unlocked: boolean }[]>([]);

  useEffect(() => { getAllAchievements().then(setBadges); }, []);

  const unlocked = badges.filter(b => b.unlocked).length;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      <AnimatedScreen>
        <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? 44 : 8 }]}>
          <Pressable onPress={onBack} style={[styles.backBtn, { backgroundColor: t.surface, borderColor: t.cardBorder }]}>
            <Text style={[styles.backText, { color: t.text }]}>{'\u2190'}</Text>
          </Pressable>
          <View style={[styles.titlePill, { backgroundColor: t.surface, borderColor: t.cardBorder }]}>
            <Text style={[styles.title, { color: t.text }]}>{'\uD83C\uDFC5'} Achievements</Text>
          </View>
          <View style={{ width: 42 }} />
        </View>

        <View style={[styles.summary, { backgroundColor: t.surface, borderColor: t.cardBorder }]}>
          <Text style={{ fontSize: 28, marginBottom: 6 }}>{'\u2B50'}</Text>
          <Text style={[styles.summaryNum, { color: t.gold }]}>{unlocked}</Text>
          <Text style={[styles.summaryLabel, { color: t.textSec }]}>of {badges.length} unlocked</Text>
          <View style={[styles.progressTrack, { backgroundColor: t.surfaceAlt, borderColor: t.cardBorder }]}>
            <View style={[styles.progressFill, { backgroundColor: t.gold, width: `${badges.length ? (unlocked / badges.length) * 100 : 0}%` }]} />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {badges.map(({ achievement: a, unlocked: u }) => (
            <View key={a.id} style={[styles.badgeCard, {
              backgroundColor: t.surface,
              borderColor: u ? t.gold + '50' : t.cardBorder,
              opacity: u ? 1 : 0.5,
            }]}>
              <View style={[styles.badgeIconWrap, { backgroundColor: u ? t.gold + '15' : t.surfaceAlt }]}>
                <Text style={styles.badgeIcon}>{a.icon}</Text>
              </View>
              <View style={styles.badgeText}>
                <Text style={[styles.badgeTitle, { color: u ? t.text : t.textSec }]}>{a.title}</Text>
                <Text style={[styles.badgeDesc, { color: t.textSec }]}>{a.description}</Text>
              </View>
              {u && <Text style={styles.checkmark}>{'\u2705'}</Text>}
              {!u && <Text style={[styles.locked, { color: t.textSec }]}>{'\uD83D\uDD12'}</Text>}
            </View>
          ))}
        </ScrollView>
      </AnimatedScreen>
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
  summary: { marginHorizontal: 16, padding: 20, borderRadius: 22, alignItems: 'center', borderWidth: 2, borderStyle: 'dashed' as any, marginBottom: 16 },
  summaryNum: { fontSize: 36, fontWeight: '900' },
  summaryLabel: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
  progressTrack: { width: '100%', height: 10, borderRadius: 5, overflow: 'hidden', borderWidth: 1 },
  progressFill: { height: '100%', borderRadius: 5 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 30, gap: 10 },
  badgeCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, borderWidth: 2, borderStyle: 'dashed' as any, gap: 12 },
  badgeIconWrap: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  badgeIcon: { fontSize: 24 },
  badgeText: { flex: 1 },
  badgeTitle: { fontSize: 15, fontWeight: '800' },
  badgeDesc: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  checkmark: { fontSize: 18 },
  locked: { fontSize: 18 },
});
