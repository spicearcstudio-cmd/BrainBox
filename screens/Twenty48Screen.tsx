import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, PanResponder } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { DifficultyOption } from '../constants/games';
import { createGrid, move, spawnTile, canMove, hasWon, getHighestTile, Grid, Direction } from '../logic/twenty48/gameEngine';
import { playSound, haptic } from '../services/soundManager';
import Twenty48Board from '../components/twenty48/Board';
import GameHeader from '../components/shared/GameHeader';
import GameOverModal from '../components/shared/GameOverModal';

interface Props {
  diff: DifficultyOption;
  onHome: () => void;
  isDaily: boolean;
}

export default function Twenty48Screen({ diff, onHome, isDaily }: Props) {
  const { theme: t } = useTheme();
  const [grid, setGrid] = useState<Grid>(() => createGrid(diff.gridSize));
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [continueAfterWin, setContinueAfterWin] = useState(false);
  const processing = useRef(false);

  const handleSwipe = useCallback((dir: Direction) => {
    if (gameOver || processing.current) return;
    if (won && !continueAfterWin) return;
    processing.current = true;

    const { newGrid, score: gained, moved } = move(grid, dir);
    if (!moved) { processing.current = false; return; }

    haptic();
    if (gained > 0) playSound('match');
    else playSound('tap');

    spawnTile(newGrid);
    const newScore = score + gained;
    setGrid([...newGrid.map(r => [...r])]);
    setScore(newScore);
    if (newScore > bestScore) setBestScore(newScore);

    if (!won && hasWon(newGrid)) {
      setWon(true);
      setGameOver(true);
    } else if (!canMove(newGrid)) {
      setGameOver(true);
    }

    processing.current = false;
  }, [grid, score, bestScore, gameOver, won, continueAfterWin]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dx) > 10 || Math.abs(gs.dy) > 10,
      onPanResponderRelease: (_, gs) => {
        const { dx, dy } = gs;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);
        if (absDx < 20 && absDy < 20) return;

        if (absDx > absDy) {
          handleSwipe(dx > 0 ? 'right' : 'left');
        } else {
          handleSwipe(dy > 0 ? 'down' : 'up');
        }
      },
    })
  ).current;

  const handlePlayAgain = () => {
    setGrid(createGrid(diff.gridSize));
    setScore(0);
    setGameOver(false);
    setWon(false);
    setContinueAfterWin(false);
    processing.current = false;
  };

  const highest = getHighestTile(grid);
  const result = won ? 'win' : 'lose';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      <GameHeader title="2048" onBack={onHome} />

      <View style={styles.scoreRow}>
        <View style={[styles.scoreBox, { backgroundColor: '#BBADA0' }]}>
          <Text style={styles.scoreBoxLabel}>SCORE</Text>
          <Text style={styles.scoreBoxNum}>{score}</Text>
        </View>
        <View style={[styles.scoreBox, { backgroundColor: '#BBADA0' }]}>
          <Text style={styles.scoreBoxLabel}>BEST</Text>
          <Text style={styles.scoreBoxNum}>{bestScore}</Text>
        </View>
        <View style={[styles.scoreBox, { backgroundColor: '#BBADA0' }]}>
          <Text style={styles.scoreBoxLabel}>HIGHEST</Text>
          <Text style={styles.scoreBoxNum}>{highest}</Text>
        </View>
      </View>

      <Text style={[styles.hint, { color: t.textSec }]}>Swipe to move tiles</Text>

      <View {...panResponder.panHandlers} style={styles.swipeArea}>
        <Twenty48Board grid={grid} />
      </View>

      <GameOverModal
        visible={gameOver}
        title={won ? 'You reached 2048!' : 'Game Over!'}
        subtitle={`Score: ${score} \u2022 Best tile: ${highest}`}
        titleColor={won ? t.gold : t.ai}
        gameName="2048"
        gameId="twenty48"
        result={result}
        extraStats={{ score }}
        isDaily={isDaily}
        onPlayAgain={isDaily ? onHome : handlePlayAgain}
        onHome={onHome}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scoreRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, paddingHorizontal: 20, marginBottom: 12 },
  scoreBox: { flex: 1, alignItems: 'center', padding: 10, borderRadius: 8 },
  scoreBoxLabel: { color: '#EEE4DA', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  scoreBoxNum: { color: '#FFFFFF', fontSize: 20, fontWeight: '900' },
  hint: { fontSize: 13, textAlign: 'center', marginBottom: 12, fontWeight: '600' },
  swipeArea: { flex: 1, justifyContent: 'center' },
});
