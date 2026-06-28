import React from 'react';
import { View, Pressable, Text, useWindowDimensions, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { TTTState } from '../../logic/tictactoe/gameEngine';

interface Props {
  state: TTTState;
  onPress: (idx: number) => void;
  disabled: boolean;
}

export default function Board({ state, onPress, disabled }: Props) {
  const { width } = useWindowDimensions();
  const { theme: t } = useTheme();
  const g = state.gridSize;
  const bw = Math.min(width - 48, 380);
  const cell = bw / g;

  return (
    <View style={[styles.grid, { width: bw, alignSelf: 'center' }]}>
      {state.board.map((v, i) => {
        const r = Math.floor(i / g), c = i % g;
        return (
          <Pressable
            key={i}
            disabled={disabled || !!v}
            onPress={() => onPress(i)}
            style={[styles.cell, {
              width: cell, height: cell,
              backgroundColor: t.surface,
              borderColor: t.cardBorder,
              borderRightWidth: c < g - 1 ? 2 : 0,
              borderBottomWidth: r < g - 1 ? 2 : 0,
            }]}
          >
            <Text style={[styles.mark, { color: v === 'human' ? t.player : t.ai, fontSize: cell * 0.5 }]}>
              {v === 'human' ? '\u2716' : v === 'ai' ? '\u25CF' : ''}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { justifyContent: 'center', alignItems: 'center' },
  mark: { fontWeight: '900' },
});
