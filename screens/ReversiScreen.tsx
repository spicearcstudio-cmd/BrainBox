import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { DifficultyOption } from '../constants/games';
import { createBoard, applyMove, getValidMoves, countPieces, isGameOver, Cell, Board } from '../logic/reversi/gameEngine';
import { getAIMove } from '../logic/reversi/aiPlayer';
import { playSound, haptic } from '../services/soundManager';
import ReversiBoard from '../components/reversi/Board';
import GameHeader from '../components/shared/GameHeader';
import GameOverModal from '../components/shared/GameOverModal';

interface Props {
  diff: DifficultyOption;
  onHome: () => void;
  twoPlayer: boolean;
  isDaily: boolean;
}

export default function ReversiScreen({ diff, onHome, twoPlayer, isDaily }: Props) {
  const { theme: t } = useTheme();
  const [board, setBoard] = useState<Board>(() => createBoard(diff.gridSize));
  const [currentPlayer, setCurrentPlayer] = useState<Cell>(1);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'human' | 'ai' | 'draw' | null>(null);
  const aiThinking = useRef(false);

  const pieces = countPieces(board);

  const checkGameEnd = useCallback((b: Board) => {
    if (isGameOver(b)) {
      const p = countPieces(b);
      setGameOver(true);
      if (p.black > p.white) setWinner('human');
      else if (p.white > p.black) setWinner('ai');
      else setWinner('draw');
      return true;
    }
    return false;
  }, []);

  const switchTurn = useCallback((b: Board, nextPlayer: Cell) => {
    const moves = getValidMoves(b, nextPlayer);
    if (moves.length > 0) {
      setCurrentPlayer(nextPlayer);
    } else {
      const otherPlayer: Cell = nextPlayer === 1 ? 2 : 1;
      const otherMoves = getValidMoves(b, otherPlayer);
      if (otherMoves.length > 0) {
        setCurrentPlayer(otherPlayer);
      }
    }
  }, []);

  const handlePress = useCallback((row: number, col: number) => {
    if (gameOver || aiThinking.current) return;
    if (currentPlayer !== 1 && !twoPlayer) return;

    const flips = getValidMoves(board, currentPlayer);
    const isValid = flips.some(([r, c]) => r === row && c === col);
    if (!isValid) return;

    haptic();
    playSound('tap');
    const newBoard = applyMove(board, row, col, currentPlayer);
    setBoard(newBoard);

    if (!checkGameEnd(newBoard)) {
      const next: Cell = currentPlayer === 1 ? 2 : 1;
      switchTurn(newBoard, next);
    }
  }, [board, currentPlayer, gameOver, twoPlayer, checkGameEnd, switchTurn]);

  useEffect(() => {
    if (gameOver || twoPlayer || currentPlayer !== 2) return;
    aiThinking.current = true;
    const timer = setTimeout(() => {
      const move = getAIMove(board, diff.key);
      if (move) {
        playSound('move');
        const newBoard = applyMove(board, move[0], move[1], 2);
        setBoard(newBoard);
        if (!checkGameEnd(newBoard)) {
          switchTurn(newBoard, 1);
        }
      }
      aiThinking.current = false;
    }, 400);
    return () => clearTimeout(timer);
  }, [currentPlayer, gameOver, twoPlayer]);

  const handlePlayAgain = () => {
    setBoard(createBoard(diff.gridSize));
    setCurrentPlayer(1);
    setGameOver(false);
    setWinner(null);
    aiThinking.current = false;
  };

  const result = winner === 'human' ? 'win' : winner === 'ai' ? 'lose' : 'draw';
  const p1Label = twoPlayer ? 'Black' : 'You';
  const p2Label = twoPlayer ? 'White' : 'AI';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      <GameHeader title="Reversi" onBack={onHome} />

      <View style={styles.scoreRow}>
        <View style={[styles.scoreCard, currentPlayer === 1 && styles.activeCard, { backgroundColor: t.surface, borderColor: currentPlayer === 1 ? t.accent : t.cardBorder }]}>
          <View style={[styles.dot, { backgroundColor: '#212121' }]} />
          <Text style={[styles.scoreLabel, { color: t.textSec }]}>{p1Label}</Text>
          <Text style={[styles.scoreNum, { color: t.text }]}>{pieces.black}</Text>
        </View>
        <View style={[styles.scoreCard, currentPlayer === 2 && styles.activeCard, { backgroundColor: t.surface, borderColor: currentPlayer === 2 ? t.accent : t.cardBorder }]}>
          <View style={[styles.dot, { backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#CCC' }]} />
          <Text style={[styles.scoreLabel, { color: t.textSec }]}>{p2Label}</Text>
          <Text style={[styles.scoreNum, { color: t.text }]}>{pieces.white}</Text>
        </View>
      </View>

      <ReversiBoard board={board} currentPlayer={currentPlayer} onPress={handlePress} disabled={gameOver || (!twoPlayer && currentPlayer === 2)} />

      <GameOverModal
        visible={gameOver}
        title={winner === 'draw' ? 'Draw!' : winner === 'human' ? 'You Win!' : (twoPlayer ? 'White Wins!' : 'You Lost!')}
        subtitle={`${pieces.black} - ${pieces.white}`}
        titleColor={winner === 'human' ? t.player : winner === 'ai' ? t.ai : t.textSec}
        gameName="Reversi"
        gameId="reversi"
        result={twoPlayer ? (winner === 'draw' ? 'draw' : 'win') : result}
        extraStats={{ score: pieces.black, opponentScore: pieces.white }}
        isDaily={isDaily}
        onPlayAgain={isDaily ? onHome : handlePlayAgain}
        onHome={onHome}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scoreRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, paddingHorizontal: 20, marginBottom: 16 },
  scoreCard: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 14, borderWidth: 1.5 },
  activeCard: { borderWidth: 2 },
  dot: { width: 20, height: 20, borderRadius: 10 },
  scoreLabel: { fontSize: 13, fontWeight: '600' },
  scoreNum: { fontSize: 20, fontWeight: '900', marginLeft: 'auto' },
});
