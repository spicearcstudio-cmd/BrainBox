import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Grid } from '../../logic/twenty48/gameEngine';

const TILE_COLORS: Record<number, { bg: string; text: string }> = {
  0:    { bg: '#CDC1B4', text: '#776E65' },
  2:    { bg: '#EEE4DA', text: '#776E65' },
  4:    { bg: '#EDE0C8', text: '#776E65' },
  8:    { bg: '#F2B179', text: '#F9F6F2' },
  16:   { bg: '#F59563', text: '#F9F6F2' },
  32:   { bg: '#F67C5F', text: '#F9F6F2' },
  64:   { bg: '#F65E3B', text: '#F9F6F2' },
  128:  { bg: '#EDCF72', text: '#F9F6F2' },
  256:  { bg: '#EDCC61', text: '#F9F6F2' },
  512:  { bg: '#EDC850', text: '#F9F6F2' },
  1024: { bg: '#EDC53F', text: '#F9F6F2' },
  2048: { bg: '#EDC22E', text: '#F9F6F2' },
};

function getTileStyle(value: number) {
  return TILE_COLORS[value] || { bg: '#3C3A32', text: '#F9F6F2' };
}

interface Props {
  grid: Grid;
}

export default function Twenty48Board({ grid }: Props) {
  const size = grid.length;
  const screenWidth = Dimensions.get('window').width;
  const boardSize = Math.min(screenWidth - 32, 400);
  const gap = size <= 4 ? 8 : 4;
  const tileSize = (boardSize - gap * (size + 1)) / size;
  const fontSize = tileSize * (size <= 4 ? 0.35 : 0.3);

  return (
    <View style={[styles.board, { width: boardSize, height: boardSize, padding: gap, borderRadius: 12 }]}>
      {grid.map((row, r) =>
        row.map((cell, c) => {
          const ts = getTileStyle(cell);
          return (
            <View
              key={`${r}-${c}`}
              style={[
                styles.tile,
                {
                  width: tileSize, height: tileSize,
                  backgroundColor: ts.bg,
                  margin: gap / 2,
                  borderRadius: size <= 4 ? 8 : 4,
                },
              ]}
            >
              {cell > 0 && (
                <Text style={[
                  styles.tileText,
                  { color: ts.text, fontSize: cell >= 1000 ? fontSize * 0.75 : fontSize },
                ]}>
                  {cell}
                </Text>
              )}
            </View>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  board: { backgroundColor: '#BBADA0', flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'center' },
  tile: { justifyContent: 'center', alignItems: 'center' },
  tileText: { fontWeight: '900' },
});
