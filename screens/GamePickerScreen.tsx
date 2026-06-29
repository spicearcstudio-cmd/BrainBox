import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { GameInfo, DifficultyOption } from '../constants/games';

interface Props {
  game: GameInfo;
  onPlay: (diff: DifficultyOption, twoPlayer: boolean) => void;
  onBack: () => void;
}

export default function GamePickerScreen({ game, onPlay, onBack }: Props) {
  const { theme: t } = useTheme();
  const [selected, setSelected] = useState(0);
  const [twoPlayer, setTwoPlayer] = useState(false);

  const diff = game.difficulties[selected];

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

        <Pressable
          onPress={() => onPlay(diff, twoPlayer)}
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
  iconWrap: { width: 88, height: 88, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  name: { fontSize: 28, fontWeight: '900', marginBottom: 24 },
  sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 3, marginBottom: 12 },
  modeRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  modeBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 14, borderWidth: 2, gap: 8 },
  modeIcon: { fontSize: 18 },
  modeLabel: { fontSize: 14, fontWeight: '700' },
  diffRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', justifyContent: 'center' },
  diffBtn: { paddingVertical: 14, paddingHorizontal: 20, borderRadius: 14, borderWidth: 2, alignItems: 'center', minWidth: 75 },
  diffLabel: { fontSize: 14, fontWeight: '700' },
  diffGrid: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  desc: { fontSize: 13, marginTop: 12, marginBottom: 36 },
  playBtn: { paddingVertical: 16, paddingHorizontal: 70, borderRadius: 18 },
  playText: { fontSize: 18, fontWeight: '900', color: '#fff', letterSpacing: 3 },
});
