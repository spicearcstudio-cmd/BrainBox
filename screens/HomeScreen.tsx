import React from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, ScrollView, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { usePremium } from '../context/PremiumContext';
import { GAMES, GameId } from '../constants/games';

interface Props {
  onSelectGame: (id: GameId) => void;
  onSettings: () => void;
}

export default function HomeScreen({ onSelectGame, onSettings }: Props) {
  const { theme: t } = useTheme();
  const { isPremium } = usePremium();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? 44 : 8 }]}>
        <View style={{ width: 40 }} />
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: t.text }]}>Brain Box</Text>
          {isPremium && <View style={styles.proBadge}><Text style={styles.proText}>PRO</Text></View>}
        </View>
        <Pressable onPress={onSettings} style={styles.gearBtn}>
          <Text style={{ fontSize: 22 }}>{'\u2699'}</Text>
        </Pressable>
      </View>

      <Text style={[styles.subtitle, { color: t.textSec }]}>Classic Strategy Games</Text>

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
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
      </ScrollView>
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
  gearBtn: { width: 40, alignItems: 'center' },
  subtitle: { fontSize: 14, fontWeight: '600', textAlign: 'center', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, paddingBottom: 30, gap: 14, justifyContent: 'center' },
  card: { width: '45%', minWidth: 150, borderRadius: 20, padding: 18, borderWidth: 1.5, elevation: 3, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
  iconWrap: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  icon: { fontSize: 26, fontWeight: '800' },
  gameName: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
  gameDesc: { fontSize: 12, fontWeight: '500', lineHeight: 16 },
});
