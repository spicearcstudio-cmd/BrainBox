import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { DifficultyOption } from '../constants/games';
import { C4State, createInitialState, makeMove } from '../logic/connectfour/gameEngine';
import { getAIMove } from '../logic/connectfour/aiPlayer';
import Board from '../components/connectfour/Board';
import GameHeader from '../components/shared/GameHeader';
import ScoreBar from '../components/shared/ScoreBar';
import GameOverModal from '../components/shared/GameOverModal';
import AdBanner from '../components/shared/AdBanner';

interface Props { diff: DifficultyOption; onHome: () => void }

export default function ConnectFourScreen({ diff, onHome }: Props) {
  const { theme: t } = useTheme();
  const rows = diff.gridSize;
  const cols = diff.gridCols ?? 7;
  const [state, setState] = useState<C4State>(() => createInitialState(rows, cols));
  const proc = useRef(false);

  useEffect(() => {
    if (state.currentPlayer === 'ai' && !state.gameOver && !proc.current) {
      proc.current = true;
      const timer = setTimeout(() => {
        const col = getAIMove(state, diff.key);
        proc.current = false;
        setState(prev => makeMove(prev, col));
      }, 400 + Math.random() * 400);
      return () => { clearTimeout(timer); proc.current = false; };
    }
  }, [state, diff.key]);

  const handleDrop = useCallback((col: number) => {
    if (state.currentPlayer !== 'human' || state.gameOver) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setState(prev => makeMove(prev, col));
  }, [state.currentPlayer, state.gameOver]);

  const restart = () => { proc.current = false; setState(createInitialState(rows, cols)); };

  const humanDiscs = state.board.filter(v => v === 'human').length;
  const aiDiscs = state.board.filter(v => v === 'ai').length;
  const resultTitle = state.winner === 'human' ? 'You Win!' : state.winner === 'ai' ? 'AI Wins!' : 'Draw!';
  const resultColor = state.winner === 'human' ? t.player : state.winner === 'ai' ? t.ai : t.gold;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      <GameHeader title="Connect Four" onBack={onHome} />
      <ScoreBar humanScore={humanDiscs} aiScore={aiDiscs} currentPlayer={state.currentPlayer} gameOver={state.gameOver} />
      <View style={styles.boardWrap}>
        <Board state={state} onDrop={handleDrop} disabled={state.currentPlayer !== 'human' || state.gameOver} />
      </View>
      <Text style={[styles.status, { color: t.textSec }]}>
        {state.gameOver ? '' : state.currentPlayer === 'ai' ? 'AI thinking\u2026' : 'Tap a column to drop'}
      </Text>
      <AdBanner />
      <GameOverModal visible={state.gameOver} title={resultTitle} subtitle={`${cols}\u00D7${rows} board`}
        titleColor={resultColor} gameName="Connect Four" onPlayAgain={restart} onHome={onHome} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  boardWrap: { flex: 1, justifyContent: 'center' },
  status: { fontSize: 14, textAlign: 'center', paddingVertical: 14, minHeight: 50 },
});
