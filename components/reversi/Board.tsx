import React from 'react';
import { View, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Board as BoardType, getValidMoves, Cell } from '../../logic/reversi/gameEngine';

interface Props {
  board: BoardType;
  currentPlayer: Cell;
  onPress: (row: number, col: number) => void;
  disabled: boolean;
}

export default function ReversiBoard({ board, currentPlayer, onPress, disabled }: Props) {
  const { theme: t } = useTheme();
  const size = board.length;
  const screenWidth = Dimensions.get('window').width;
  const boardSize = Math.min(screenWidth - 32, 400);
  const cellSize = boardSize / size;

  const validMoves = disabled ? [] : getValidMoves(board, currentPlayer);
  const validSet = new Set(validMoves.map(([r, c]) => `${r},${c}`));

  const isDark = t.statusBar === 'light';
  const boardBg = isDark ? '#1A3A1A' : '#2E7D32';
  const cellBorder = isDark ? '#0D2B0D' : '#1B5E20';
  const darkPiece = isDark ? '#1A1A1A' : '#212121';
  const lightPiece = isDark ? '#E8E8E8' : '#FAFAFA';
  const hintColor = isDark ? 'rgba(100,255,100,0.25)' : 'rgba(255,255,255,0.3)';

  return (
    <View style={[styles.board, { width: boardSize, height: boardSize, backgroundColor: boardBg }]}>
      {board.map((row, r) =>
        row.map((cell, c) => {
          const isValid = validSet.has(`${r},${c}`);
          return (
            <Pressable
              key={`${r}-${c}`}
              onPress={() => isValid && !disabled && onPress(r, c)}
              style={[
                styles.cell,
                {
                  width: cellSize, height: cellSize,
                  borderColor: cellBorder,
                },
              ]}
            >
              {cell !== 0 && (
                <View style={[
                  styles.piece,
                  {
                    width: cellSize * 0.78,
                    height: cellSize * 0.78,
                    borderRadius: cellSize * 0.39,
                    backgroundColor: cell === 1 ? darkPiece : lightPiece,
                    borderColor: cell === 1 ? '#000' : (isDark ? '#AAA' : '#CCC'),
                  },
                ]} />
              )}
              {isValid && cell === 0 && (
                <View style={[
                  {
                    width: cellSize * 0.3,
                    height: cellSize * 0.3,
                    borderRadius: cellSize * 0.15,
                    backgroundColor: hintColor,
                  },
                ]} />
              )}
            </Pressable>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  board: { flexDirection: 'row', flexWrap: 'wrap', borderRadius: 12, overflow: 'hidden', alignSelf: 'center', elevation: 6, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 5 } },
  cell: { borderWidth: 0.5, justifyContent: 'center', alignItems: 'center' },
  piece: { borderWidth: 2, elevation: 4, shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
});
