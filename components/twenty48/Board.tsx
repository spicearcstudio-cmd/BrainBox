import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Grid } from '../../logic/twenty48/gameEngine';
import { useTheme } from '../../context/ThemeContext';

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

const DARK_TILE_COLORS: Record<number, { bg: string; text: string }> = {
  0:    { bg: '#3A3A3A', text: '#666' },
  2:    { bg: '#4A4A5A', text: '#E0E0E0' },
  4:    { bg: '#5A5A6A', text: '#E0E0E0' },
  8:    { bg: '#7C4DFF', text: '#FFFFFF' },
  16:   { bg: '#651FFF', text: '#FFFFFF' },
  32:   { bg: '#D500F9', text: '#FFFFFF' },
  64:   { bg: '#FF1744', text: '#FFFFFF' },
  128:  { bg: '#FFD600', text: '#1A1A1A' },
  256:  { bg: '#FFAB00', text: '#1A1A1A' },
  512:  { bg: '#FF6D00', text: '#FFFFFF' },
  1024: { bg: '#00E676', text: '#1A1A1A' },
  2048: { bg: '#00BFA5', text: '#FFFFFF' },
};

function getTileStyle(value: number, isDark: boolean) {
  const palette = isDark ? DARK_TILE_COLORS : TILE_COLORS;
  return palette[value] || { bg: isDark ? '#1A1A2E' : '#3C3A32', text: '#F9F6F2' };
}

interface Props {
  grid: Grid;
}

export default function Twenty48Board({ grid }: Props) {
  const { theme: t } = useTheme();
  const isDark = t.statusBar === 'light';
  const size = grid.length;
  const screenWidth = Dimensions.get('window').width;
  const boardSize = Math.min(screenWidth - 32, 400);
  const gap = size <= 4 ? 8 : 5;
  const tileSize = (boardSize - gap * (size + 1)) / size;
  const fontSize = tileSize * (size <= 4 ? 0.35 : 0.3);
  const boardBg = isDark ? '#2A2A2A' : '#BBADA0';

  return (
    <View style={[styles.board, { width: boardSize, height: boardSize, padding: gap, borderRadius: 14, backgroundColor: boardBg }]}>
      {grid.map((row, r) =>
        row.map((cell, c) => {
          const ts = getTileStyle(cell, isDark);
          return (
            <View
              key={`${r}-${c}`}
              style={[
                styles.tile,
                {
                  width: tileSize, height: tileSize,
                  backgroundColor: ts.bg,
                  margin: gap / 2,
                  borderRadius: size <= 4 ? 10 : 6,
                  ...(cell > 0 ? { elevation: 2, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } } : {}),
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
  board: { flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  tile: { justifyContent: 'center', alignItems: 'center' },
  tileText: { fontWeight: '900' },
});
