import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, Platform, Animated, Easing } from 'react-native';
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

  const iconBounce = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(30)).current;
  const contentOp = useRef(new Animated.Value(0)).current;
  const playPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(iconBounce, { toValue: 1, tension: 50, friction: 4, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(contentSlide, { toValue: 0, duration: 300, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
        Animated.timing(contentOp, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]),
    ]).start();

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(playPulse, { toValue: 1.04, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(playPulse, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const diff = game.difficulties[selected];
  const timedValue = TIMED_OPTIONS[timedIdx].value;
  const iconScale = iconBounce.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] });

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? 44 : 8 }]}>
        <Pressable onPress={onBack} style={[styles.backBtn, { backgroundColor: t.surface, borderColor: t.cardBorder }]}>
          <Text style={[styles.backText, { color: t.text }]}>{'\u2190'}</Text>
        </Pressable>
      </View>

      <View style={styles.center}>
        <Animated.View style={[styles.iconWrap, { backgroundColor: game.color + '15', borderColor: game.color + '30', transform: [{ scale: iconScale }] }]}>
          <Text style={{ fontSize: 48, color: game.color }}>{game.icon}</Text>
        </Animated.View>
        <Text style={[styles.name, { color: t.text }]}>{game.name}</Text>

        <Animated.View style={{ transform: [{ translateY: contentSlide }], opacity: contentOp, width: '100%', alignItems: 'center' }}>
          {game.vsAI && (
            <>
              <Text style={[styles.sectionLabel, { color: t.textSec }]}>GAME MODE</Text>
              <View style={styles.modeRow}>
                <Pressable
                  onPress={() => setTwoPlayer(false)}
                  style={[styles.modeBtn, {
                    backgroundColor: !twoPlayer ? game.color + '18' : t.surface,
                    borderColor: !twoPlayer ? game.color + '50' : t.cardBorder,
                  }]}
                >
                  <Text style={styles.modeIcon}>{'\uD83E\uDD16'}</Text>
                  <Text style={[styles.modeLabel, { color: !twoPlayer ? game.color : t.text }]}>vs AI</Text>
                </Pressable>
                <Pressable
                  onPress={() => setTwoPlayer(true)}
                  style={[styles.modeBtn, {
                    backgroundColor: twoPlayer ? game.color + '18' : t.surface,
                    borderColor: twoPlayer ? game.color + '50' : t.cardBorder,
                  }]}
                >
                  <Text style={styles.modeIcon}>{'\uD83D\uDC65'}</Text>
                  <Text style={[styles.modeLabel, { color: twoPlayer ? game.color : t.text }]}>2 Players</Text>
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
                style={[styles.diffBtn, {
                  backgroundColor: selected === i ? game.color + '18' : t.surface,
                  borderColor: selected === i ? game.color + '50' : t.cardBorder,
                }]}
              >
                <Text style={[styles.diffLabel, { color: selected === i ? game.color : t.text }]}>{d.label}</Text>
                <Text style={[styles.diffGrid, { color: selected === i ? game.color + 'AA' : t.textSec }]}>{d.gridLabel}</Text>
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
                      backgroundColor: timedIdx === i ? t.gold + '20' : t.surface,
                      borderColor: timedIdx === i ? t.gold + '50' : t.cardBorder,
                    }]}
                  >
                    <Text style={[styles.timedLabel, { color: timedIdx === i ? t.gold : t.text }]}>{opt.label}</Text>
                  </Pressable>
                ))}
              </View>
            </>
          )}

          <Animated.View style={{ transform: [{ scale: playPulse }] }}>
            <Pressable
              onPress={() => onPlay(diff, twoPlayer, timedValue || undefined)}
              style={({ pressed }) => [styles.playBtn, {
                backgroundColor: game.color,
                opacity: pressed ? 0.85 : 1,
                transform: [{ scale: pressed ? 0.95 : 1 }],
              }]}
            >
              <Text style={styles.playText}>{'\u25B6'} PLAY</Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 8 },
  backBtn: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderStyle: 'dashed' as any },
  backText: { fontSize: 20, fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  iconWrap: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 18, borderWidth: 3, borderStyle: 'dashed' as any },
  name: { fontSize: 30, fontWeight: '900', marginBottom: 6, letterSpacing: 0.5 },
  sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 3, marginBottom: 12, marginTop: 18 },
  modeRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  modeBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 22, borderRadius: 18, borderWidth: 2, gap: 8, borderStyle: 'dashed' as any },
  modeIcon: { fontSize: 20 },
  modeLabel: { fontSize: 14, fontWeight: '700' },
  diffRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', justifyContent: 'center' },
  diffBtn: { paddingVertical: 14, paddingHorizontal: 22, borderRadius: 18, borderWidth: 2, alignItems: 'center', minWidth: 80, borderStyle: 'dashed' as any },
  diffLabel: { fontSize: 14, fontWeight: '800' },
  diffGrid: { fontSize: 11, fontWeight: '600', marginTop: 3 },
  desc: { fontSize: 13, marginTop: 12, marginBottom: 10, fontWeight: '500' },
  timedRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  timedBtn: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 14, borderWidth: 2, borderStyle: 'dashed' as any },
  timedLabel: { fontSize: 14, fontWeight: '700' },
  playBtn: { paddingVertical: 18, paddingHorizontal: 80, borderRadius: 28, marginTop: 14 },
  playText: { fontSize: 20, fontWeight: '900', color: '#fff', letterSpacing: 4 },
});
