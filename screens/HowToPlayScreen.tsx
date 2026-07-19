import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, ScrollView, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { GAMES, GameInfo } from '../constants/games';
import AnimatedScreen from '../components/shared/AnimatedScreen';

interface Props { onBack: () => void; initialGameId?: string }

const RULES: Record<string, { steps: string[]; tips: string[] }> = {
  dotsandboxes: {
    steps: [
      'Tap a line between two dots to claim it.',
      'When you complete the 4th side of a box, you score a point and get another turn.',
      'The player with the most boxes when the grid is full wins.',
    ],
    tips: [
      'Avoid completing the 3rd side of a box \u2014 your opponent will close it.',
      'Create "chains" of boxes to force your opponent into giving you multiple boxes.',
      'Corners are the safest place to start.',
    ],
  },
  tictactoe: {
    steps: [
      'Tap an empty cell to place your mark (X).',
      'Get 3 in a row (horizontal, vertical, or diagonal) to win.',
      'On larger boards (4\u00D74, 5\u00D75), you need 4 in a row.',
    ],
    tips: [
      'Always take the center if it\u2019s available.',
      'Watch for your opponent\u2019s two-in-a-row \u2014 block them!',
      'Try to create a "fork" \u2014 two ways to win at once.',
    ],
  },
  connectfour: {
    steps: [
      'Tap a column to drop your disc.',
      'Discs fall to the lowest available position.',
      'Connect 4 discs in a row (horizontal, vertical, or diagonal) to win.',
    ],
    tips: [
      'Control the center column \u2014 it gives the most winning opportunities.',
      'Try to set up multiple threats at once.',
      'Watch out for diagonal connections \u2014 they\u2019re easy to miss!',
    ],
  },
  memory: {
    steps: [
      'Tap a card to flip it over and reveal its symbol.',
      'Tap a second card to find its match.',
      'If both cards match, they stay face up. If not, they flip back.',
      'Find all pairs to win!',
    ],
    tips: [
      'Focus on remembering positions, not just symbols.',
      'Start from the edges and work inward.',
      'Pay attention when cards flip back \u2014 you\u2019ll need that info later!',
    ],
  },
  colorflood: {
    steps: [
      'The board starts with random colors. You control the top-left corner.',
      'Tap a color button to change your entire region to that color.',
      'Adjacent cells of the same color merge into your region.',
      'Flood the entire board before running out of moves!',
    ],
    tips: [
      'Look ahead \u2014 pick colors that connect the largest groups.',
      'Don\u2019t just chase the nearest cells; think about the whole board.',
      'Count remaining moves and plan your path.',
    ],
  },
  reversi: {
    steps: [
      'Place your piece on the board to capture opponent pieces.',
      'Your piece must "sandwich" opponent pieces between your existing pieces.',
      'All sandwiched pieces flip to your color.',
      'If you can\u2019t make a valid move, your turn is skipped.',
      'The player with the most pieces when the board is full wins.',
    ],
    tips: [
      'Corners are extremely valuable \u2014 they can never be flipped.',
      'Avoid placing next to empty corners early on.',
      'Having fewer pieces early can be an advantage \u2014 it limits your opponent\u2019s options.',
    ],
  },
  twenty48: {
    steps: [
      'Swipe in any direction to slide all tiles.',
      'Tiles with the same number merge when they collide.',
      'A new tile (2 or 4) appears after each move.',
      'Reach the 2048 tile to win!',
    ],
    tips: [
      'Keep your highest tile in a corner.',
      'Build numbers along the edges, not in the center.',
      'Never swipe in the direction that moves your highest tile away from its corner.',
    ],
  },
};

export default function HowToPlayScreen({ onBack, initialGameId }: Props) {
  const { theme: t } = useTheme();
  const [selectedId, setSelectedId] = useState(initialGameId ?? GAMES[0].id);
  const rules = RULES[selectedId];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      <AnimatedScreen>
        <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? 44 : 8 }]}>
          <Pressable onPress={onBack}><Text style={[styles.back, { color: t.textSec }]}>{'\u2190'} Back</Text></Pressable>
          <Text style={[styles.title, { color: t.text }]}>How to Play</Text>
          <View style={{ width: 50 }} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs} contentContainerStyle={styles.tabsContent}>
          {GAMES.map(g => (
            <Pressable
              key={g.id}
              onPress={() => setSelectedId(g.id)}
              style={[styles.tab, { backgroundColor: selectedId === g.id ? t.accent : t.surface, borderColor: t.cardBorder }]}
            >
              <Text style={[styles.tabText, { color: selectedId === g.id ? '#fff' : t.text }]}>{g.icon} {g.name}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={[styles.sectionLabel, { color: t.textSec }]}>HOW IT WORKS</Text>
          {rules?.steps.map((step, i) => (
            <View key={i} style={[styles.stepCard, { backgroundColor: t.surface, borderColor: t.cardBorder }]}>
              <View style={[styles.stepNum, { backgroundColor: t.accent }]}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <Text style={[styles.stepText, { color: t.text }]}>{step}</Text>
            </View>
          ))}

          <Text style={[styles.sectionLabel, { color: t.textSec, marginTop: 24 }]}>PRO TIPS</Text>
          {rules?.tips.map((tip, i) => (
            <View key={i} style={[styles.tipCard, { backgroundColor: t.gold + '15', borderColor: t.gold + '40' }]}>
              <Text style={styles.tipIcon}>{'\uD83D\uDCA1'}</Text>
              <Text style={[styles.tipText, { color: t.text }]}>{tip}</Text>
            </View>
          ))}
          <View style={{ height: 30 }} />
        </ScrollView>
      </AnimatedScreen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 12 },
  back: { fontSize: 16, width: 50 },
  title: { fontSize: 20, fontWeight: '800' },
  tabs: { maxHeight: 48, marginBottom: 16 },
  tabsContent: { paddingHorizontal: 16, gap: 8 },
  tab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 2, borderStyle: 'dashed' as any },
  tabText: { fontSize: 13, fontWeight: '700' },
  content: { paddingHorizontal: 16, gap: 10 },
  sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 3, marginBottom: 8 },
  stepCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 18, borderWidth: 2, borderStyle: 'dashed' as any },
  stepNum: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  stepNumText: { color: '#fff', fontSize: 14, fontWeight: '900' },
  stepText: { flex: 1, fontSize: 14, fontWeight: '500', lineHeight: 20 },
  tipCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 14, borderRadius: 18, borderWidth: 2, borderStyle: 'dashed' as any },
  tipIcon: { fontSize: 18, marginTop: 1 },
  tipText: { flex: 1, fontSize: 14, fontWeight: '500', lineHeight: 20 },
});
