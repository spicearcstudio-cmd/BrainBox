import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { GameInfo, DifficultyOption } from '../constants/games';

const TIMED_OPTIONS = [
  { label: 'Off', value: 0 },
  { label: '30s', value: 30 },
  { label: '60s', value: 60 },
  { label: '90s', value: 90 },
];

interface Props {
  game: GameInfo;
  onPlay: (diff: DifficultyOption, twoPlayer: boolean, timed?: number) => void;
  onBack: () => void;
}

export default function GamePickerScreen({ game, onPlay, onBack }: Props) {
  const { theme: t } = useTheme();
  const [selected, setSelected] = useState(0);
  const [twoPlayer, setTwoPlayer] = useState(false);
  const [timedIdx, setTimedIdx] = useState(0);

  const diff = game.difficulties[selected];
  const timedValue = TIMED_OPTIONS[timedIdx].value;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? 44 : 8 }]}>
        <Pressable onPress={onBack}><Text style={[styles.back, { color: t.textSec }]}>{'\u2190'} Back</Text></Pressable>
      </View>

      <View style={styles.center}>
        <View style={[styles.iconWrap, { backgroundColor: game.color + '18' }]}>
          <Text style={{ fontSize: 48, color: game.color }}>{game.icon}</Text>
        </View>
        <Text style={[styles.name, { color: t.text }]}>{game.name}</Text>

        {game.vsAI && (
          <>
            <Text style={[styles.sectionLabel, { color: t.textSec }]}>GAME MODE</Text>
            <View style={styles.modeRow}>
              <Pressable
                onPress={() => setTwoPlayer(false)}
                style={[styles.modeBtn, { backgroundColor: !twoPlayer ? game.color : t.surface, borderColor: !twoPlayer ? game.color : t.cardBorder }]}
              >
                <Text style={[styles.modeIcon, { color: !twoPlayer ? '#fff' : t.text }]}>{'\uD83E\uDD16'}</Text>
                <Text style={[styles.modeLabel, { color: !twoPlayer ? '#fff' : t.text }]}>vs AI</Text>
              </Pressable>
              <Pressable
                onPress={() => setTwoPlayer(true)}
                style={[styles.modeBtn, { backgroundColor: twoPlayer ? game.color : t.surface, borderColor: twoPlayer ? game.color : t.cardBorder }]}
              >
                <Text style={[styles.modeIcon, { color: twoPlayer ? '#fff' : t.text }]}>{'\uD83D\uDC65'}</Text>
                <Text style={[styles.modeLabel, { color: twoPlayer ? '#fff' : t.text }]}>2 Players</Text>
              </Pressable>
            </View>
          </>
        )}

        <Text style={[styles.sectionLabel, { color: t.textSec }]}>
          {twoPlayer ? 'SELECT BOARD SIZE' : 'SELECT DIFFICULTY'}
        </Text>
        <View style={styles.diffRow}>
          {game.difficulties.map((d, i) => (
            <Pressable
              key={d.key}
              onPress={() => setSelected(i)}
              style={[styles.diffBtn, { backgroundColor: selected === i ? game.color : t.surface, borderColor: selected === i ? game.color : t.cardBorder }]}
            >
              <Text style={[styles.diffLabel, { color: selected === i ? '#fff' : t.text }]}>{d.label}</Text>
              <Text style={[styles.diffGrid, { color: selected === i ? '#ffffffcc' : t.textSec }]}>{d.gridLabel}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={[styles.desc, { color: t.textSec }]}>{diff.desc}</Text>

        {game.vsAI && !twoPlayer && (
          <>
            <Text style={[styles.sectionLabel, { color: t.textSec }]}>{'\u23F1'} SPEED MODE</Text>
            <View style={styles.timedRow}>
              {TIMED_OPTIONS.map((opt, i) => (
                <Pressable
                  key={opt.label}
                  onPress={() => setTimedIdx(i)}
                  style={[styles.timedBtn, {
                    backgroundColor: timedIdx === i ? t.gold : t.surface,
                    borderColor: timedIdx === i ? t.gold : t.cardBorder,
                  }]}
                >
                  <Text style={[styles.timedLabel, { color: timedIdx === i ? '#fff' : t.text }]}>{opt.label}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        <Pressable
          onPress={() => onPlay(diff, twoPlayer, timedValue || undefined)}
          style={({ pressed }) => [styles.playBtn, { backgroundColor: game.color, opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }]}
        >
          <Text style={styles.playText}>PLAY</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 8 },
  back: { fontSize: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  iconWrap: { width: 96, height: 96, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 18, elevation: 4, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
  name: { fontSize: 30, fontWeight: '900', marginBottom: 6, letterSpacing: 0.5 },
  sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 3, marginBottom: 12, marginTop: 18 },
  modeRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  modeBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 22, borderRadius: 16, borderWidth: 2, gap: 8, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  modeIcon: { fontSize: 20 },
  modeLabel: { fontSize: 14, fontWeight: '700' },
  diffRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', justifyContent: 'center' },
  diffBtn: { paddingVertical: 14, paddingHorizontal: 22, borderRadius: 16, borderWidth: 2, alignItems: 'center', minWidth: 80, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  diffLabel: { fontSize: 14, fontWeight: '800' },
  diffGrid: { fontSize: 11, fontWeight: '600', marginTop: 3 },
  desc: { fontSize: 13, marginTop: 12, marginBottom: 10, fontWeight: '500' },
  timedRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  timedBtn: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 12, borderWidth: 1.5 },
  timedLabel: { fontSize: 14, fontWeight: '700' },
  playBtn: { paddingVertical: 18, paddingHorizontal: 80, borderRadius: 22, marginTop: 10, elevation: 6, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 14, shadowOffset: { width: 0, height: 6 } },
  playText: { fontSize: 20, fontWeight: '900', color: '#fff', letterSpacing: 4 },
});
