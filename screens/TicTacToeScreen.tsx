import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { DifficultyOption } from '../constants/games';
import { TTTState, createInitialState, makeMove } from '../logic/tictactoe/gameEngine';
import { getAIMove } from '../logic/tictactoe/aiPlayer';
import Board from '../components/tictactoe/Board';
import GameHeader from '../components/shared/GameHeader';
import ScoreBar from '../components/shared/ScoreBar';
import GameOverModal from '../components/shared/GameOverModal';
import AdBanner from '../components/shared/AdBanner';
import { playSound, haptic } from '../services/soundManager';

interface Props {
  diff: DifficultyOption;
  onHome: () => void;
  twoPlayer?: boolean;
  isDaily?: boolean;
}

export default function TicTacToeScreen({ diff, onHome, twoPlayer = false, isDaily }: Props) {
  const { theme: t } = useTheme();
  const [state, setState] = useState<TTTState>(() => createInitialState(diff.gridSize));
  const proc = useRef(false);

  useEffect(() => {
    if (!twoPlayer && state.currentPlayer === 'ai' && !state.gameOver && !proc.current) {
      proc.current = true;
      const timer = setTimeout(() => {
        const move = getAIMove(state, diff.key);
        proc.current = false;
        setState(prev => makeMove(prev, move));
        playSound('move');
      }, 400 + Math.random() * 300);
      return () => { clearTimeout(timer); proc.current = false; };
    }
  }, [state, diff.key, twoPlayer]);

  const handlePress = useCallback((idx: number) => {
    if (twoPlayer) {
      if (state.gameOver || state.board[idx] !== null) return;
    } else {
      if (state.currentPlayer !== 'human' || state.gameOver) return;
    }
    haptic('light');
    playSound('tap');
    setState(prev => makeMove(prev, idx));
  }, [state.currentPlayer, state.gameOver, state.board, twoPlayer]);

  const restart = () => { proc.current = false; setState(createInitialState(diff.gridSize)); };

  const p1Label = twoPlayer ? 'P1' : 'You';
  const p2Label = twoPlayer ? 'P2' : 'AI';
  const humanMarks = state.board.filter(v => v === 'human').length;
  const aiMarks = state.board.filter(v => v === 'ai').length;
  const winner = state.winner;
  const resultTitle = winner === 'human'
    ? (twoPlayer ? 'Player 1 Wins!' : 'You Win!')
    : winner === 'ai'
      ? (twoPlayer ? 'Player 2 Wins!' : 'AI Wins!')
      : 'Draw!';
  const result = winner === 'human' ? 'win' as const : winner === 'ai' ? 'lose' as const : winner === 'draw' ? 'draw' as const : undefined;
  const resultColor = winner === 'human' ? t.player : winner === 'ai' ? t.ai : t.gold;

  const statusText = state.gameOver
    ? ''
    : twoPlayer
      ? `${state.currentPlayer === 'human' ? 'Player 1' : 'Player 2'}'s turn`
      : state.currentPlayer === 'ai'
        ? 'AI thinking\u2026'
        : 'Your turn \u2014 tap a cell';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      <GameHeader title="Tic Tac Toe" onBack={onHome} />
      <ScoreBar humanScore={humanMarks} aiScore={aiMarks} currentPlayer={state.currentPlayer}
        gameOver={state.gameOver} humanLabel={p1Label} aiLabel={p2Label} />
      <View style={styles.boardWrap}>
        <Board state={state} onPress={handlePress}
          disabled={!twoPlayer && (state.currentPlayer !== 'human' || state.gameOver)} />
      </View>
      <Text style={[styles.status, { color: t.textSec }]}>{statusText}</Text>
      <AdBanner />
      <GameOverModal visible={state.gameOver} title={resultTitle}
        subtitle={winner === 'draw' ? 'Nobody wins' : `${state.gridSize}\u00D7${state.gridSize} board`}
        titleColor={resultColor} gameName="Tic Tac Toe" gameId="tictactoe" result={twoPlayer ? undefined : result}
        isDaily={isDaily} onPlayAgain={isDaily ? onHome : restart} onHome={onHome} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  boardWrap: { flex: 1, justifyContent: 'center' },
  status: { fontSize: 14, textAlign: 'center', paddingVertical: 14, minHeight: 50 },
});
