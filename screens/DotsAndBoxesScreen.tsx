import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { DifficultyOption } from '../constants/games';
import { GameState, createInitialState, makeMove, LineKey } from '../logic/dotsandboxes/gameEngine';
import { getAIMove } from '../logic/dotsandboxes/aiPlayer';
import Board from '../components/dotsandboxes/Board';
import GameHeader from '../components/shared/GameHeader';
import ScoreBar from '../components/shared/ScoreBar';
import GameOverModal from '../components/shared/GameOverModal';
import AdBanner from '../components/shared/AdBanner';

interface Props { diff: DifficultyOption; onHome: () => void }

export default function DotsAndBoxesScreen({ diff, onHome }: Props) {
  const { theme: t } = useTheme();
  const [state, setState] = useState<GameState>(() => createInitialState(diff.gridSize));
  const [aiThinking, setAiThinking] = useState(false);
  const proc = useRef(false);

  useEffect(() => {
    if (state.currentPlayer === 'ai' && !state.gameOver && !proc.current) {
      proc.current = true;
      setAiThinking(true);
      const timer = setTimeout(() => {
        const move = getAIMove(state, diff.key);
        proc.current = false;
        setState(prev => makeMove(prev, move));
        const next = makeMove(state, move);
        if (next.currentPlayer !== 'ai' || next.gameOver) setAiThinking(false);
      }, 400 + Math.random() * 400);
      return () => { clearTimeout(timer); proc.current = false; };
    }
  }, [state, diff.key]);

  const handleLine = useCallback((line: LineKey) => {
    if (state.currentPlayer !== 'human' || state.gameOver) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setState(prev => makeMove(prev, line));
  }, [state.currentPlayer, state.gameOver]);

  const restart = () => { proc.current = false; setAiThinking(false); setState(createInitialState(diff.gridSize)); };

  const resultTitle = state.winner === 'human' ? 'You Win!' : state.winner === 'ai' ? 'AI Wins!' : 'Draw!';
  const resultColor = state.winner === 'human' ? t.player : state.winner === 'ai' ? t.ai : t.gold;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      <GameHeader title="Dots & Boxes" onBack={onHome} />
      <ScoreBar humanScore={state.scores.human} aiScore={state.scores.ai} currentPlayer={state.currentPlayer} gameOver={state.gameOver} />
      <View style={styles.boardWrap}>
        <Board gameState={state} onLinePress={handleLine} disabled={state.currentPlayer !== 'human' || state.gameOver} />
      </View>
      <Text style={[styles.status, { color: t.textSec }]}>
        {state.gameOver ? '' : aiThinking ? 'AI thinking\u2026' : 'Your turn \u2014 tap a line'}
      </Text>
      <AdBanner />
      <GameOverModal visible={state.gameOver} title={resultTitle} subtitle={`${state.scores.human} \u2014 ${state.scores.ai}`}
        titleColor={resultColor} gameName="Dots & Boxes" onPlayAgain={restart} onHome={onHome} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  boardWrap: { flex: 1, justifyContent: 'center' },
  status: { fontSize: 14, textAlign: 'center', paddingVertical: 14, minHeight: 50 },
});
