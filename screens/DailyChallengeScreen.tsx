import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { DailyChallenge, getDailyChallenge, isDailyChallengeCompleted, getDailyStreak } from '../services/dailyChallenge';
import { DifficultyOption } from '../constants/games';

interface Props {
  onPlay: (gameId: string, diff: DifficultyOption, isDaily: boolean) => void;
  onBack: () => void;
}

export default function DailyChallengeScreen({ onPlay, onBack }: Props) {
  const { theme: t } = useTheme();
  const [challenge] = useState<DailyChallenge>(getDailyChallenge);
  const [completed, setCompleted] = useState(false);
  const [streak, setStreak] = useState({ current: 0, best: 0 });

  useEffect(() => {
    isDailyChallengeCompleted().then(setCompleted);
    getDailyStreak().then(setStreak);
  }, []);

  const diff: DifficultyOption = {
    key: 'daily',
    label: 'Daily',
    gridLabel: challenge.gridCols
      ? `${challenge.gridCols}\u00D7${challenge.gridSize}`
      : `${challenge.gridSize}\u00D7${challenge.gridSize}`,
    gridSize: challenge.gridSize,
    gridCols: challenge.gridCols,
    desc: challenge.description,
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? 44 : 8 }]}>
        <Pressable onPress={onBack}><Text style={[styles.back, { color: t.textSec }]}>{'\u2190'} Back</Text></Pressable>
        <Text style={[styles.title, { color: t.text }]}>Daily Challenge</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.center}>
        <View style={[styles.streakCard, { backgroundColor: t.surface, borderColor: t.gold }]}>
          <Text style={{ fontSize: 32 }}>{'\uD83D\uDD25'}</Text>
          <Text style={[styles.streakVal, { color: t.gold }]}>{streak.current}</Text>
          <Text style={[styles.streakLabel, { color: t.textSec }]}>Day Streak</Text>
          <Text style={[styles.bestStreak, { color: t.textSec }]}>Best: {streak.best}</Text>
        </View>

        <Text style={[styles.dateText, { color: t.textSec }]}>{challenge.dateKey}</Text>

        <View style={[styles.challengeCard, { backgroundColor: t.surface, borderColor: t.cardBorder }]}>
          <Text style={[styles.gameName, { color: t.text }]}>{challenge.gameName}</Text>
          <Text style={[styles.desc, { color: t.textSec }]}>{challenge.description}</Text>

          {completed ? (
            <View style={[styles.completedBadge, { backgroundColor: t.accent + '20' }]}>
              <Text style={[styles.completedText, { color: t.accent }]}>{'\u2714'} Completed Today!</Text>
            </View>
          ) : (
            <Pressable
              onPress={() => onPlay(challenge.gameId, diff, true)}
              style={({ pressed }) => [styles.playBtn, { backgroundColor: t.gold, opacity: pressed ? 0.85 : 1 }]}
            >
              <Text style={styles.playText}>TAKE ON THE CHALLENGE</Text>
            </Pressable>
          )}
        </View>

        {completed && (
          <Text style={[styles.comeback, { color: t.textSec }]}>
            Come back tomorrow for a new challenge!
          </Text>
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
  center: { flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 20 },
  streakCard: { alignItems: 'center', padding: 20, borderRadius: 20, borderWidth: 2, marginBottom: 20, width: '60%' },
  streakVal: { fontSize: 40, fontWeight: '900', marginTop: 4 },
  streakLabel: { fontSize: 13, fontWeight: '700', letterSpacing: 1 },
  bestStreak: { fontSize: 12, marginTop: 4 },
  dateText: { fontSize: 13, fontWeight: '600', marginBottom: 16 },
  challengeCard: { width: '100%', borderRadius: 20, padding: 24, borderWidth: 1.5, alignItems: 'center' },
  gameName: { fontSize: 24, fontWeight: '900', marginBottom: 8 },
  desc: { fontSize: 14, fontWeight: '500', textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  completedBadge: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 14 },
  completedText: { fontSize: 16, fontWeight: '800' },
  playBtn: { paddingVertical: 16, paddingHorizontal: 40, borderRadius: 18 },
  playText: { fontSize: 15, fontWeight: '900', color: '#fff', letterSpacing: 2 },
  comeback: { fontSize: 14, marginTop: 24, fontStyle: 'italic' },
});
