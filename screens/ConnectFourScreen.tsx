import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { DifficultyOption } from '../constants/games';
import { C4State, createInitialState, makeMove } from '../logic/connectfour/gameEngine';
import { getAIMove } from '../logic/connectfour/aiPlayer';
import Board from '../components/connectfour/Board';
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

export default function ConnectFourScreen({ diff, onHome, twoPlayer = false, isDaily }: Props) {
  const { theme: t } = useTheme();
  const rows = diff.gridSize;
  const cols = diff.gridCols ?? 7;
  const [state, setState] = useState<C4State>(() => createInitialState(rows, cols));
  const proc = useRef(false);

  useEffect(() => {
    if (!twoPlayer && state.currentPlayer === 'ai' && !state.gameOver && !proc.current) {
      proc.current = true;
      const timer = setTimeout(() => {
        const col = getAIMove(state, diff.key);
        proc.current = false;
        setState(prev => makeMove(prev, col));
        playSound('drop');
      }, 400 + Math.random() * 400);
      return () => { clearTimeout(timer); proc.current = false; };
    }
  }, [state, diff.key, twoPlayer]);

  const handleDrop = useCallback((col: number) => {
    if (twoPlayer) {
      if (state.gameOver) return;
    } else {
      if (state.currentPlayer !== 'human' || state.gameOver) return;
    }
    haptic('medium');
    playSound('drop');
    setState(prev => makeMove(prev, col));
  }, [state.currentPlayer, state.gameOver, twoPlayer]);

  const restart = () => { proc.current = false; setState(createInitialState(rows, cols)); };

  const p1Label = twoPlayer ? 'P1' : 'You';
  const p2Label = twoPlayer ? 'P2' : 'AI';
  const humanDiscs = state.board.filter(v => v === 'human').length;
  const aiDiscs = state.board.filter(v => v === 'ai').length;
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
        : 'Tap a column to drop';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      <GameHeader title="Connect Four" onBack={onHome} />
      <ScoreBar humanScore={humanDiscs} aiScore={aiDiscs} currentPlayer={state.currentPlayer}
        gameOver={state.gameOver} humanLabel={p1Label} aiLabel={p2Label} />
      <View style={styles.boardWrap}>
        <Board state={state} onDrop={handleDrop}
          disabled={!twoPlayer && (state.currentPlayer !== 'human' || state.gameOver)} />
      </View>
      <Text style={[styles.status, { color: t.textSec }]}>{statusText}</Text>
      <AdBanner />
      <GameOverModal visible={state.gameOver} title={resultTitle} subtitle={`${cols}\u00D7${rows} board`}
        titleColor={resultColor} gameName="Connect Four" gameId="connectfour" result={twoPlayer ? undefined : result}
        isDaily={isDaily} onPlayAgain={isDaily ? onHome : restart} onHome={onHome} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  boardWrap: { flex: 1, justifyContent: 'center' },
  status: { fontSize: 14, textAlign: 'center', paddingVertical: 14, minHeight: 50 },
});
