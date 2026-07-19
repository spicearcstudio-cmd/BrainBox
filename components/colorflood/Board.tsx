import React from 'react';
import { View, Pressable, useWindowDimensions, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { FloodState, FLOOD_COLORS } from '../../logic/colorflood/gameEngine';

interface Props {
  state: FloodState;
  onPickColor: (idx: number) => void;
  disabled: boolean;
}

export default function Board({ state, onPickColor, disabled }: Props) {
  const { width } = useWindowDimensions();
  const { theme: t } = useTheme();
  const bw = Math.min(width - 32, 400);
  const cell = bw / state.gridSize;

  return (
    <View style={{ alignSelf: 'center' }}>
      <View style={[styles.grid, { width: bw, height: bw, borderRadius: 18, overflow: 'hidden', borderWidth: 2, borderColor: t.cardBorder, borderStyle: 'dashed' as any }]}>
        {state.board.map((c, i) => (
          <View key={i} style={{ width: cell, height: cell, backgroundColor: FLOOD_COLORS[c] }} />
        ))}
      </View>

      <View style={styles.palette}>
        {FLOOD_COLORS.map((color, i) => (
          <Pressable
            key={i}
            disabled={disabled || i === state.board[0]}
            onPress={() => onPickColor(i)}
            style={[styles.colorBtn, {
              backgroundColor: color,
              opacity: i === state.board[0] ? 0.3 : 1,
              borderColor: i === state.board[0] ? t.text : color + '60',
              borderWidth: 2,
              borderStyle: i === state.board[0] ? ('dashed' as any) : 'solid',
            }]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  palette: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 20, paddingHorizontal: 8 },
  colorBtn: { width: 44, height: 44, borderRadius: 22 },
});
