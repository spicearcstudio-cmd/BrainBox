import React from 'react';
import { View, Pressable, useWindowDimensions } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { GameState, LineKey, lk } from '../../logic/dotsandboxes/gameEngine';

interface Props {
  gameState: GameState;
  onLinePress: (line: LineKey) => void;
  disabled: boolean;
}

const DOT = 14;
const LINE_W = 6;
const TOUCH = 36;

export default function Board({ gameState, onLinePress, disabled }: Props) {
  const { width } = useWindowDimensions();
  const { theme: t } = useTheme();
  const g = gameState.gridSize;
  const bw = Math.min(width - 48, 400);
  const cell = bw / (g - 1);
  const pad = 18;
  const total = bw + pad * 2;

  const els: React.JSX.Element[] = [];

  for (let r = 0; r < g - 1; r++)
    for (let c = 0; c < g - 1; c++) {
      const o = gameState.boxes.get(`box-${r}-${c}`);
      if (o) els.push(
        <View key={`b${r}${c}`} style={{ position: 'absolute', left: pad + c * cell + DOT / 2, top: pad + r * cell + DOT / 2, width: cell - DOT, height: cell - DOT, backgroundColor: o === 'human' ? t.playerLight : t.aiLight, borderRadius: 8, borderWidth: 1, borderColor: o === 'human' ? t.player + '30' : t.ai + '30' }} />
      );
    }

  for (let r = 0; r < g; r++)
    for (let c = 0; c < g - 1; c++) {
      const k = lk({ type: 'h', row: r, col: c });
      const o = gameState.lines.get(k);
      els.push(
        <Pressable key={`h${r}${c}`} disabled={disabled || !!o} onPress={() => onLinePress({ type: 'h', row: r, col: c })}
          style={{ position: 'absolute', left: pad + c * cell + DOT / 2, top: pad + r * cell - TOUCH / 2, width: cell - DOT, height: TOUCH, justifyContent: 'center' }}>
          <View style={{ height: LINE_W, borderRadius: LINE_W / 2, backgroundColor: o ? (o === 'human' ? t.player : t.ai) : t.lineEmpty }} />
        </Pressable>
      );
    }

  for (let r = 0; r < g - 1; r++)
    for (let c = 0; c < g; c++) {
      const k = lk({ type: 'v', row: r, col: c });
      const o = gameState.lines.get(k);
      els.push(
        <Pressable key={`v${r}${c}`} disabled={disabled || !!o} onPress={() => onLinePress({ type: 'v', row: r, col: c })}
          style={{ position: 'absolute', left: pad + c * cell - TOUCH / 2, top: pad + r * cell + DOT / 2, width: TOUCH, height: cell - DOT, alignItems: 'center' }}>
          <View style={{ width: LINE_W, height: '100%', borderRadius: LINE_W / 2, backgroundColor: o ? (o === 'human' ? t.player : t.ai) : t.lineEmpty }} />
        </Pressable>
      );
    }

  for (let r = 0; r < g; r++)
    for (let c = 0; c < g; c++)
      els.push(
        <View key={`d${r}${c}`} style={{ position: 'absolute', left: pad + c * cell - DOT / 2, top: pad + r * cell - DOT / 2, width: DOT, height: DOT, borderRadius: DOT / 2, backgroundColor: t.dot, elevation: 3, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } }} />
      );

  return <View style={{ width: total, height: total, alignSelf: 'center' }}>{els}</View>;
}
