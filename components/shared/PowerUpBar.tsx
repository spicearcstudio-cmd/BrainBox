import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { PowerUpInfo, PowerUpInventory } from '../../services/powerupManager';

interface Props {
  available: PowerUpInfo[];
  inventory: PowerUpInventory;
  onUse: (type: PowerUpInfo['type']) => void;
  disabled?: boolean;
}

export default function PowerUpBar({ available, inventory, onUse, disabled }: Props) {
  const { theme: t } = useTheme();

  if (available.length === 0) return null;

  return (
    <View style={styles.container}>
      {available.map(pu => {
        const count = inventory[pu.type];
        const canUse = count > 0 && !disabled;
        return (
          <Pressable
            key={pu.type}
            onPress={() => canUse && onUse(pu.type)}
            disabled={!canUse}
            accessibilityRole="button"
            accessibilityLabel={`${pu.name}: ${count} remaining`}
            style={[styles.btn, {
              backgroundColor: canUse ? t.gold + '15' : t.surfaceAlt,
              borderColor: canUse ? t.gold + '40' : t.cardBorder,
              opacity: canUse ? 1 : 0.4,
            }]}
          >
            <Text style={styles.icon}>{pu.icon}</Text>
            <Text style={[styles.label, { color: t.text }]}>{pu.name}</Text>
            <View style={[styles.badge, { backgroundColor: canUse ? t.gold : t.textSec }]}>
              <Text style={styles.badgeText}>{count}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingHorizontal: 12, marginBottom: 8 },
  btn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 7, paddingHorizontal: 12, borderRadius: 14, borderWidth: 2, borderStyle: 'dashed' as any },
  icon: { fontSize: 16 },
  label: { fontSize: 11, fontWeight: '700' },
  badge: { width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 2 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '900' },
});
