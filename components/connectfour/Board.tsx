import React from 'react';
import { View, Pressable, useWindowDimensions, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { C4State } from '../../logic/connectfour/gameEngine';

interface Props {
  state: C4State;
  onDrop: (col: number) => void;
  disabled: boolean;
}

export default function Board({ state, onDrop, disabled }: Props) {
  const { width } = useWindowDimensions();
  const { theme: t } = useTheme();
  const bw = Math.min(width - 32, 420);
  const cell = bw / state.cols;

  const isDark = t.statusBar === 'light';
  const boardBg = isDark ? '#2E2520' : t.player + '15';

  return (
    <View style={[styles.board, { width: bw, backgroundColor: boardBg, borderColor: t.player + '30', alignSelf: 'center' }]}>
      {Array.from({ length: state.cols }, (_, c) => (
        <Pressable key={c} disabled={disabled || !!state.board[c]} onPress={() => onDrop(c)} style={{ width: cell }}>
          {Array.from({ length: state.rows }, (_, r) => {
            const v = state.board[r * state.cols + c];
            const isLast = state.lastMove === r * state.cols + c;
            return (
              <View key={r} style={[styles.slot, { width: cell, height: cell }]}>
                <View style={[styles.disc, {
                  width: cell * 0.78, height: cell * 0.78,
                  backgroundColor: v === 'human' ? t.player : v === 'ai' ? t.ai : t.surface,
                  borderColor: isLast ? t.gold : (v ? t.cardBorder : t.cardBorder + '60'),
                  borderWidth: isLast ? 3 : 2,
                  borderStyle: v ? 'solid' : ('dashed' as any),
                }]} />
              </View>
            );
          })}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: { flexDirection: 'row', borderRadius: 20, borderWidth: 2, padding: 6, overflow: 'hidden', borderStyle: 'dashed' as any },
  slot: { justifyContent: 'center', alignItems: 'center' },
  disc: { borderRadius: 999 },
});
