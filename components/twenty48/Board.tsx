import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Grid } from '../../logic/twenty48/gameEngine';
import { useTheme } from '../../context/ThemeContext';

const TILE_COLORS: Record<number, { bg: string; text: string }> = {
  0:    { bg: '#E8D4C0', text: '#B09880' },
  2:    { bg: '#FFF0E3', text: '#7A6354' },
  4:    { bg: '#FFE4CC', text: '#7A6354' },
  8:    { bg: '#E8956A', text: '#FFFAF5' },
  16:   { bg: '#E8734A', text: '#FFFAF5' },
  32:   { bg: '#D4605A', text: '#FFFAF5' },
  64:   { bg: '#C24A3A', text: '#FFFAF5' },
  128:  { bg: '#E8B44A', text: '#FFFAF5' },
  256:  { bg: '#D4A030', text: '#FFFAF5' },
  512:  { bg: '#C28C20', text: '#FFFAF5' },
  1024: { bg: '#B07818', text: '#FFFAF5' },
  2048: { bg: '#F5A623', text: '#FFFAF5' },
};

const DARK_TILE_COLORS: Record<number, { bg: string; text: string }> = {
  0:    { bg: '#362D24', text: '#5A4A3A' },
  2:    { bg: '#4A3D30', text: '#E8DDD0' },
  4:    { bg: '#5A4A38', text: '#E8DDD0' },
  8:    { bg: '#8A5A3A', text: '#FFFFFF' },
  16:   { bg: '#A06030', text: '#FFFFFF' },
  32:   { bg: '#B04A3A', text: '#FFFFFF' },
  64:   { bg: '#C0382A', text: '#FFFFFF' },
  128:  { bg: '#D49A30', text: '#1A1612' },
  256:  { bg: '#C08820', text: '#1A1612' },
  512:  { bg: '#B07A18', text: '#FFFFFF' },
  1024: { bg: '#5DAD9E', text: '#1A1612' },
  2048: { bg: '#E8B44A', text: '#1A1612' },
};

function getTileStyle(value: number, isDark: boolean) {
  const palette = isDark ? DARK_TILE_COLORS : TILE_COLORS;
  return palette[value] || { bg: isDark ? '#2A231C' : '#6B5344', text: '#FFFAF5' };
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
  const boardBg = isDark ? '#2A231C' : '#D4B896';

  return (
    <View style={[styles.board, { width: boardSize, height: boardSize, padding: gap, borderRadius: 18, backgroundColor: boardBg, borderColor: isDark ? '#3D342B' : '#C4A880' }]}>
      {grid.map((row, r) =>
        row.map((cell, c) => {
          const ts = getTileStyle(cell, isDark);
          return (
            <View
              key={`${r}-${c}`}
              style={[styles.tile, {
                width: tileSize, height: tileSize,
                backgroundColor: ts.bg,
                margin: gap / 2,
                borderRadius: size <= 4 ? 12 : 8,
                borderWidth: cell > 0 ? 2 : 1,
                borderColor: cell > 0 ? ts.bg + '80' : (isDark ? '#3D342B' : '#C4A880' + '60'),
                borderStyle: cell > 0 ? 'solid' : ('dashed' as any),
              }]}
            >
              {cell > 0 && (
                <Text style={[styles.tileText, {
                  color: ts.text,
                  fontSize: cell >= 1000 ? fontSize * 0.75 : fontSize,
                }]}>
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
  board: { flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'center', borderWidth: 3, borderStyle: 'dashed' as any },
  tile: { justifyContent: 'center', alignItems: 'center' },
  tileText: { fontWeight: '900' },
});
