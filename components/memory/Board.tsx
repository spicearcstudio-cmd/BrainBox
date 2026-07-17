import React from 'react';
import { View, Pressable, Text, useWindowDimensions, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { MemoryState } from '../../logic/memory/gameEngine';

interface Props {
  state: MemoryState;
  onFlip: (idx: number) => void;
}

export default function Board({ state, onFlip }: Props) {
  const { width } = useWindowDimensions();
  const { theme: t } = useTheme();
  const bw = Math.min(width - 32, 400);
  const cell = bw / state.cols;
  const cardSize = cell - 8;

  return (
    <View style={[styles.grid, { width: bw, alignSelf: 'center' }]}>
      {state.cards.map((symbol, i) => {
        const show = state.flipped[i] || state.matched[i];
        return (
          <Pressable
            key={i}
            disabled={state.busy || show}
            onPress={() => onFlip(i)}
            style={[styles.cell, { width: cell, height: cell }]}
          >
            <View style={[styles.card, {
              width: cardSize, height: cardSize,
              backgroundColor: state.matched[i] ? t.playerLight : show ? t.surface : t.player,
              borderColor: state.matched[i] ? t.player : t.cardBorder,
            }]}>
              {show && (
                <Text style={[styles.symbol, { fontSize: cardSize * 0.4, color: state.matched[i] ? t.player : t.text }]}>
                  {symbol}
                </Text>
              )}
              {!show && (
                <Text style={[styles.symbol, { fontSize: cardSize * 0.3, color: '#fff' }]}>?</Text>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  cell: { justifyContent: 'center', alignItems: 'center', padding: 4 },
  card: { borderRadius: 14, borderWidth: 2, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
  symbol: { fontWeight: '700' },
});
