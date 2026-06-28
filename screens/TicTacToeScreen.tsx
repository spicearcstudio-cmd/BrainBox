import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { DifficultyOption } from '../constants/games';
import { TTTState, createInitialState, makeMove } from '../logic/tictactoe/gameEngine';
import { getAIMove } from '../logic/tictactoe/aiPlayer';
import Board from '../components/tictactoe/Board';
import GameHeader from '../components/shared/GameHeader';
import ScoreBar from '../components/shared/ScoreBar';
import GameOverModal from '../components/shared/GameOverModal';
import AdBanner from '../components/shared/AdBanner';

interface Props { diff: DifficultyOption; onHome: () => void }

export default function TicTacToeScreen({ diff, onHome }: Props) {
  const { theme: t } = useTheme();
  const [state, setState] = useState<TTTState>(() => createInitialState(diff.gridSize));
  const proc = useRef(false);

  useEffect(() => {
    if (state.currentPlayer === 'ai' && !state.gameOver && !proc.current) {
      proc.current = true;
      const timer = setTimeout(() => {
        const move = getAIMove(state, diff.key);
        proc.current = false;
        setState(prev => makeMove(prev, move));
      }, 400 + Math.random() * 300);
      return () => { clearTimeout(timer); proc.current = false; };
    }
  }, [state, diff.key]);

  const handlePress = useCallback((idx: number) => {
    if (state.currentPlayer !== 'human' || state.gameOver) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setState(prev => makeMove(prev, idx));
  }, [state.currentPlayer, state.gameOver]);

  const restart = () => { proc.current = false; setState(createInitialState(diff.gridSize)); };

  const humanMarks = state.board.filter(v => v === 'human').length;
  const aiMarks = state.board.filter(v => v === 'ai').length;
  const resultTitle = state.winner === 'human' ? 'You Win!' : state.winner === 'ai' ? 'AI Wins!' : 'Draw!';
  const resultColor = state.winner === 'human' ? t.player : state.winner === 'ai' ? t.ai : t.gold;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      <GameHeader title="Tic Tac Toe" onBack={onHome} />
      <ScoreBar humanScore={humanMarks} aiScore={aiMarks} currentPlayer={state.currentPlayer} gameOver={state.gameOver} />
      <View style={styles.boardWrap}>
        <Board state={state} onPress={handlePress} disabled={state.currentPlayer !== 'human' || state.gameOver} />
      </View>
      <Text style={[styles.status, { color: t.textSec }]}>
        {state.gameOver ? '' : state.currentPlayer === 'ai' ? 'AI thinking\u2026' : 'Your turn \u2014 tap a cell'}
      </Text>
      <AdBanner />
      <GameOverModal visible={state.gameOver} title={resultTitle} subtitle={state.winner === 'draw' ? 'Nobody wins' : `${state.gridSize}\u00D7${state.gridSize} board`}
        titleColor={resultColor} gameName="Tic Tac Toe" onPlayAgain={restart} onHome={onHome} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  boardWrap: { flex: 1, justifyContent: 'center' },
  status: { fontSize: 14, textAlign: 'center', paddingVertical: 14, minHeight: 50 },
});
