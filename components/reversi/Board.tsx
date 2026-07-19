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
  const boardBg = isDark ? '#1E3328' : '#3D8B42';
  const cellBorder = isDark ? '#152B1E' : '#2E7D32';
  const darkPiece = isDark ? '#2A1F18' : '#3D2B1F';
  const lightPiece = isDark ? '#E8DDD0' : '#FFF5EC';
  const hintColor = isDark ? 'rgba(200,230,200,0.2)' : 'rgba(255,255,255,0.3)';

  return (
    <View style={[styles.board, { width: boardSize, height: boardSize, backgroundColor: boardBg, borderColor: cellBorder }]}>
      {board.map((row, r) =>
        row.map((cell, c) => {
          const isValid = validSet.has(`${r},${c}`);
          return (
            <Pressable
              key={`${r}-${c}`}
              onPress={() => isValid && !disabled && onPress(r, c)}
              style={[styles.cell, { width: cellSize, height: cellSize, borderColor: cellBorder }]}
            >
              {cell !== 0 && (
                <View style={[styles.piece, {
                  width: cellSize * 0.78,
                  height: cellSize * 0.78,
                  borderRadius: cellSize * 0.39,
                  backgroundColor: cell === 1 ? darkPiece : lightPiece,
                  borderColor: cell === 1 ? '#1A0F08' : (isDark ? '#C4B098' : '#E8D4C0'),
                }]} />
              )}
              {isValid && cell === 0 && (
                <View style={{
                  width: cellSize * 0.3,
                  height: cellSize * 0.3,
                  borderRadius: cellSize * 0.15,
                  backgroundColor: hintColor,
                }} />
              )}
            </Pressable>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  board: { flexDirection: 'row', flexWrap: 'wrap', borderRadius: 16, overflow: 'hidden', alignSelf: 'center', borderWidth: 3, borderStyle: 'solid' },
  cell: { borderWidth: 0.5, justifyContent: 'center', alignItems: 'center' },
  piece: { borderWidth: 2 },
});
