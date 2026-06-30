import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { DifficultyOption } from '../constants/games';
import { GameState, createInitialState, makeMove, LineKey } from '../logic/dotsandboxes/gameEngine';
import { getAIMove } from '../logic/dotsandboxes/aiPlayer';
import Board from '../components/dotsandboxes/Board';
import GameHeader from '../components/shared/GameHeader';
import ScoreBar from '../components/shared/ScoreBar';
import GameOverModal from '../components/shared/GameOverModal';
import AdBanner from '../components/shared/AdBanner';
import AIBubble from '../components/shared/AIBubble';
import { playSound, haptic } from '../services/soundManager';
import { getPersona, getRandomMessage } from '../services/aiPersonality';

interface Props {
  diff: DifficultyOption;
  onHome: () => void;
  twoPlayer?: boolean;
  isDaily?: boolean;
}

export default function DotsAndBoxesScreen({ diff, onHome, twoPlayer = false, isDaily }: Props) {
  const { theme: t } = useTheme();
  const [state, setState] = useState<GameState>(() => createInitialState(diff.gridSize));
  const [aiThinking, setAiThinking] = useState(false);
  const proc = useRef(false);
  const persona = getPersona(diff.key);
  const [aiMsg, setAiMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!twoPlayer && state.currentPlayer === 'ai' && !state.gameOver && !proc.current) {
      proc.current = true;
      setAiThinking(true);
      const timer = setTimeout(() => {
        const move = getAIMove(state, diff.key);
        proc.current = false;
        const next = makeMove(state, move);
        setState(next);
        playSound('move');
        if (next.currentPlayer !== 'ai' || next.gameOver) setAiThinking(false);
        if (Math.random() < 0.25) setAiMsg(getRandomMessage(persona.tauntOnMove));
      }, 400 + Math.random() * 400);
      return () => { clearTimeout(timer); proc.current = false; };
    }
    if (state.gameOver && state.winner && !twoPlayer) {
      setTimeout(() => {
        setAiMsg(getRandomMessage(state.winner === 'ai' ? persona.tauntOnWin : persona.tauntOnLose));
      }, 300);
    }
  }, [state, diff.key, twoPlayer]);

  const handleLine = useCallback((line: LineKey) => {
    if (twoPlayer) {
      if (state.gameOver) return;
    } else {
      if (state.currentPlayer !== 'human' || state.gameOver) return;
    }
    haptic('light');
    playSound('tap');
    setState(prev => makeMove(prev, line));
  }, [state.currentPlayer, state.gameOver, twoPlayer]);

  const restart = () => { proc.current = false; setAiThinking(false); setState(createInitialState(diff.gridSize)); };

  const p1Label = twoPlayer ? 'P1' : 'You';
  const p2Label = twoPlayer ? 'P2' : 'AI';
  const winner = state.winner;
  const resultTitle = winner === 'human'
    ? (twoPlayer ? 'Player 1 Wins!' : 'You Win!')
    : winner === 'ai'
      ? (twoPlayer ? 'Player 2 Wins!' : 'AI Wins!')
      : 'Draw!';
  const result = winner === 'human' ? 'win' : winner === 'ai' ? 'lose' : winner === 'draw' ? 'draw' : undefined;
  const resultColor = winner === 'human' ? t.player : winner === 'ai' ? t.ai : t.gold;

  const statusText = state.gameOver
    ? ''
    : aiThinking
      ? 'AI thinking\u2026'
      : twoPlayer
        ? `${state.currentPlayer === 'human' ? 'Player 1' : 'Player 2'}'s turn`
        : 'Your turn \u2014 tap a line';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      <GameHeader title="Dots & Boxes" onBack={onHome} />
      <ScoreBar humanScore={state.scores.human} aiScore={state.scores.ai} currentPlayer={state.currentPlayer}
        gameOver={state.gameOver} humanLabel={p1Label} aiLabel={p2Label} />
      {!twoPlayer && <AIBubble persona={persona} message={aiMsg} isThinking={aiThinking} />}
      <View style={styles.boardWrap}>
        <Board gameState={state} onLinePress={handleLine}
          disabled={!twoPlayer && (state.currentPlayer !== 'human' || state.gameOver)} />
      </View>
      <Text style={[styles.status, { color: t.textSec }]}>{statusText}</Text>
      <AdBanner />
      <GameOverModal visible={state.gameOver} title={resultTitle} subtitle={`${state.scores.human} \u2014 ${state.scores.ai}`}
        titleColor={resultColor} gameName="Dots & Boxes" gameId="dotsandboxes" result={twoPlayer ? undefined : result}
        isDaily={isDaily} onPlayAgain={isDaily ? onHome : restart} onHome={onHome} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  boardWrap: { flex: 1, justifyContent: 'center' },
  status: { fontSize: 14, textAlign: 'center', paddingVertical: 14, minHeight: 50 },
});
