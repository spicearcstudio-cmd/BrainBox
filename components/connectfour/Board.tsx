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

  return (
    <View style={[styles.board, { width: bw, backgroundColor: t.player + '20', borderColor: t.cardBorder, alignSelf: 'center' }]}>
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
                  borderColor: isLast ? t.gold : 'transparent',
                  borderWidth: isLast ? 3 : 0,
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
  board: { flexDirection: 'row', borderRadius: 18, borderWidth: 2, padding: 6, overflow: 'hidden', elevation: 6, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
  slot: { justifyContent: 'center', alignItems: 'center' },
  disc: { borderRadius: 999, elevation: 3, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
});
