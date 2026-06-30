import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getGameById, GameId, DifficultyOption } from '../constants/games';
import {
  getCurrentTournament, getTournamentState, getDaysRemaining,
  shareTournamentResults, TournamentWeek, TournamentState,
} from '../services/weeklyTournament';
import GameHeader from '../components/shared/GameHeader';

interface Props {
  onBack: () => void;
  onPlay: (gameId: GameId, diff: DifficultyOption, isTournament: boolean) => void;
}

export default function WeeklyTournamentScreen({ onBack, onPlay }: Props) {
  const { theme: t } = useTheme();
  const [tournament, setTournament] = useState<TournamentWeek | null>(null);
  const [state, setState] = useState<TournamentState | null>(null);
  const daysLeft = getDaysRemaining();

  useEffect(() => {
    setTournament(getCurrentTournament());
    getTournamentState().then(setState);
  }, []);

  if (!tournament || !state) return null;

  const handlePlay = (puzzleIndex: number) => {
    const puzzle = tournament.puzzles[puzzleIndex];
    const game = getGameById(puzzle.gameId);
    const diff = game.difficulties.find(d => d.key === puzzle.difficulty) || game.difficulties[0];
    onPlay(puzzle.gameId, diff, true);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      <GameHeader title="Weekly Tournament" onBack={onBack} showConfirmOnBack={false} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.headerCard, { backgroundColor: t.gold + '15', borderColor: t.gold }]}>
          <Text style={styles.trophyEmoji}>{'\uD83C\uDFC6'}</Text>
          <Text style={[styles.weekLabel, { color: t.gold }]}>
            {tournament.startDate} to {tournament.endDate}
          </Text>
          <Text style={[styles.daysLeft, { color: t.textSec }]}>
            {daysLeft === 0 ? 'Last day!' : `${daysLeft} day${daysLeft > 1 ? 's' : ''} remaining`}
          </Text>
        </View>

        <View style={[styles.scoreCard, { backgroundColor: t.surface, borderColor: t.cardBorder }]}>
          <View style={styles.scoreItem}>
            <Text style={[styles.scoreNum, { color: t.accent }]}>{state.completedCount}/5</Text>
            <Text style={[styles.scoreLabel, { color: t.textSec }]}>Completed</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: t.cardBorder }]} />
          <View style={styles.scoreItem}>
            <Text style={[styles.scoreNum, { color: t.gold }]}>{state.totalStars}/15</Text>
            <Text style={[styles.scoreLabel, { color: t.textSec }]}>Stars</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: t.cardBorder }]} />
          <View style={styles.scoreItem}>
            <Text style={[styles.scoreNum, { color: t.player }]}>{state.totalScore}</Text>
            <Text style={[styles.scoreLabel, { color: t.textSec }]}>Score</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: t.textSec }]}>PUZZLES</Text>

        {tournament.puzzles.map((puzzle, i) => {
          const game = getGameById(puzzle.gameId);
          const score = state.scores[i];
          return (
            <Pressable
              key={i}
              onPress={() => handlePlay(i)}
              style={({ pressed }) => [
                styles.puzzleCard,
                {
                  backgroundColor: score.completed ? t.accent + '10' : t.surface,
                  borderColor: score.completed ? t.accent : t.cardBorder,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
            >
              <View style={[styles.puzzleIcon, { backgroundColor: game.color + '18' }]}>
                <Text style={{ fontSize: 22, color: game.color }}>{game.icon}</Text>
              </View>
              <View style={styles.puzzleInfo}>
                <Text style={[styles.puzzleName, { color: t.text }]}>{puzzle.description}</Text>
                {score.completed ? (
                  <View style={styles.starsRow}>
                    {[1, 2, 3].map(s => (
                      <Text key={s} style={styles.star}>
                        {s <= score.stars ? '\u2B50' : '\u2606'}
                      </Text>
                    ))}
                    <Text style={[styles.puzzleScore, { color: t.textSec }]}> Score: {score.score}</Text>
                  </View>
                ) : (
                  <Text style={[styles.notPlayed, { color: t.textSec }]}>Not played yet</Text>
                )}
              </View>
              <Text style={styles.playArrow}>{score.completed ? '\u21BB' : '\u25B6'}</Text>
            </Pressable>
          );
        })}

        <Pressable
          onPress={shareTournamentResults}
          style={({ pressed }) => [styles.shareBtn, { backgroundColor: t.accent, opacity: pressed ? 0.85 : 1 }]}
        >
          <Text style={styles.shareBtnText}>{'\uD83D\uDD17'} Share Results</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 16 },
  headerCard: { alignItems: 'center', padding: 20, borderRadius: 18, borderWidth: 2, marginBottom: 16 },
  trophyEmoji: { fontSize: 40, marginBottom: 8 },
  weekLabel: { fontSize: 14, fontWeight: '800', letterSpacing: 1 },
  daysLeft: { fontSize: 12, fontWeight: '600', marginTop: 4 },
  scoreCard: { flexDirection: 'row', borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 20, alignItems: 'center' },
  scoreItem: { flex: 1, alignItems: 'center' },
  scoreNum: { fontSize: 22, fontWeight: '900' },
  scoreLabel: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  divider: { width: 1, height: 36, marginHorizontal: 4 },
  sectionTitle: { fontSize: 12, fontWeight: '800', letterSpacing: 3, marginBottom: 12 },
  puzzleCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 1.5, padding: 14, marginBottom: 10, gap: 12 },
  puzzleIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  puzzleInfo: { flex: 1 },
  puzzleName: { fontSize: 14, fontWeight: '800' },
  starsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  star: { fontSize: 14 },
  puzzleScore: { fontSize: 11, fontWeight: '600' },
  notPlayed: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  playArrow: { fontSize: 18, color: '#999' },
  shareBtn: { marginTop: 14, paddingVertical: 14, borderRadius: 16, alignItems: 'center' },
  shareBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
