import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { BOARD_SKINS, BoardSkin, getActiveSkin, setActiveSkin } from '../services/boardSkinManager';
import { getProgression } from '../services/progressionManager';
import GameHeader from '../components/shared/GameHeader';

interface Props {
  onBack: () => void;
}

export default function BoardSkinScreen({ onBack }: Props) {
  const { theme: t } = useTheme();
  const [active, setActive] = useState('default');
  const [level, setLevel] = useState(1);

  useEffect(() => {
    getActiveSkin().then(s => setActive(s.id));
    getProgression().then(p => setLevel(p.level));
  }, []);

  const handleSelect = async (skin: BoardSkin) => {
    if (level < skin.unlockLevel) return;
    setActive(skin.id);
    await setActiveSkin(skin.id);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      <GameHeader title="Board Skins" onBack={onBack} showConfirmOnBack={false} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.subtitle, { color: t.textSec }]}>Unlock new skins by leveling up!</Text>

        {BOARD_SKINS.map(skin => {
          const locked = level < skin.unlockLevel;
          const isActive = active === skin.id;
          return (
            <Pressable
              key={skin.id}
              onPress={() => handleSelect(skin)}
              disabled={locked}
              style={[
                styles.card,
                {
                  backgroundColor: isActive ? t.accent + '15' : t.surface,
                  borderColor: isActive ? t.accent : locked ? t.cardBorder : t.cardBorder,
                  opacity: locked ? 0.5 : 1,
                },
              ]}
            >
              <View style={[styles.preview, { backgroundColor: skin.boardBg }]}>
                <View style={styles.miniGrid}>
                  {[0, 1, 2, 3].map(i => (
                    <View
                      key={i}
                      style={[styles.miniCell, { backgroundColor: skin.cellBg, borderColor: skin.cellBorder }]}
                    >
                      <Text style={{ color: skin.cellText, fontSize: 10, fontWeight: '900' }}>
                        {i % 2 === 0 ? '\u2716' : '\u25CF'}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.info}>
                <View style={styles.nameRow}>
                  <Text style={styles.skinIcon}>{skin.icon}</Text>
                  <Text style={[styles.skinName, { color: t.text }]}>{skin.name}</Text>
                  {isActive && (
                    <View style={[styles.activeBadge, { backgroundColor: t.accent }]}>
                      <Text style={styles.activeText}>ACTIVE</Text>
                    </View>
                  )}
                </View>
                {locked ? (
                  <Text style={[styles.lockText, { color: t.gold }]}>
                    {'\uD83D\uDD12'} Unlocks at Level {skin.unlockLevel}
                  </Text>
                ) : (
                  <Text style={[styles.unlocked, { color: t.accent }]}>{'\u2705'} Unlocked</Text>
                )}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 16 },
  subtitle: { fontSize: 13, fontWeight: '600', textAlign: 'center', marginBottom: 16 },
  card: { flexDirection: 'row', borderRadius: 16, borderWidth: 1.5, padding: 12, marginBottom: 12, gap: 14, alignItems: 'center' },
  preview: { width: 72, height: 72, borderRadius: 12, justifyContent: 'center', alignItems: 'center', padding: 4 },
  miniGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 2, width: 48 },
  miniCell: { width: 22, height: 22, borderRadius: 4, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  skinIcon: { fontSize: 18 },
  skinName: { fontSize: 16, fontWeight: '800' },
  activeBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginLeft: 'auto' },
  activeText: { color: '#fff', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  lockText: { fontSize: 12, fontWeight: '700' },
  unlocked: { fontSize: 12, fontWeight: '700' },
});
