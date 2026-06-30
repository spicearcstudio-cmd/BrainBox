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

  return (
    <View style={[styles.board, { width: boardSize, height: boardSize, backgroundColor: '#2E7D32' }]}>
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
                  borderColor: '#1B5E20',
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
                    backgroundColor: cell === 1 ? '#212121' : '#FAFAFA',
                    borderColor: cell === 1 ? '#000' : '#CCC',
                  },
                ]} />
              )}
              {isValid && cell === 0 && (
                <View style={[
                  styles.hint,
                  {
                    width: cellSize * 0.3,
                    height: cellSize * 0.3,
                    borderRadius: cellSize * 0.15,
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
  board: { flexDirection: 'row', flexWrap: 'wrap', borderRadius: 8, overflow: 'hidden', alignSelf: 'center' },
  cell: { borderWidth: 0.5, justifyContent: 'center', alignItems: 'center' },
  piece: { borderWidth: 2, elevation: 3, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 3, shadowOffset: { width: 0, height: 2 } },
  hint: { backgroundColor: 'rgba(255,255,255,0.3)' },
});
