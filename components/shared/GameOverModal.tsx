import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Share, Linking } from 'react-native';
import * as StoreReview from 'expo-store-review';
import { useTheme } from '../../context/ThemeContext';
import { usePremium } from '../../context/PremiumContext';
import { recordGamePlayed, shouldShowInterstitial } from '../../services/adManager';
import { playSound, hapticNotification } from '../../services/soundManager';
import { recordResult, shouldPromptRating } from '../../services/statsManager';
import { GameId } from '../../constants/games';
import ConfettiOverlay from './ConfettiOverlay';

const STORE_URL = 'https://play.google.com/store/apps/details?id=com.brainbox.games';

interface Props {
  visible: boolean;
  title: string;
  subtitle: string;
  titleColor?: string;
  gameName: string;
  gameId?: GameId;
  result?: 'win' | 'lose' | 'draw';
  extraStats?: { score?: number; turns?: number };
  isDaily?: boolean;
  onPlayAgain: () => void;
  onHome: () => void;
}

export default function GameOverModal({
  visible, title, subtitle, titleColor, gameName, gameId, result, extraStats, isDaily, onPlayAgain, onHome,
}: Props) {
  const { theme: t } = useTheme();
  const { isPremium } = usePremium();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;
  const shakeX = useRef(new Animated.Value(0)).current;
  const emojiScale = useRef(new Animated.Value(0)).current;
  const processed = useRef(false);

  useEffect(() => {
    if (visible && !processed.current) {
      processed.current = true;
      recordGamePlayed();
      if (shouldShowInterstitial(isPremium)) { /* interstitial ad placeholder */ }

      if (result === 'win') {
        playSound('win');
        hapticNotification('success');
      } else if (result === 'lose') {
        playSound('lose');
        hapticNotification('error');
      } else {
        hapticNotification('warning');
      }

      if (gameId && result) {
        recordResult(gameId, result, extraStats).then(async () => {
          if (result === 'win' && await shouldPromptRating()) {
            try {
              if (await StoreReview.hasAction()) {
                setTimeout(() => StoreReview.requestReview(), 1500);
              }
            } catch { /* not available */ }
          }
        });
      }

      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
      ]).start(() => {
        // Emoji bounce-in after card appears
        Animated.spring(emojiScale, { toValue: 1, tension: 100, friction: 6, useNativeDriver: true }).start();

        // Shake on loss
        if (result === 'lose') {
          Animated.sequence([
            Animated.timing(shakeX, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeX, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeX, { toValue: 8, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeX, { toValue: -8, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeX, { toValue: 0, duration: 50, useNativeDriver: true }),
          ]).start();
        }
      });
    } else if (!visible) {
      processed.current = false;
      opacity.setValue(0);
      scale.setValue(0.85);
      shakeX.setValue(0);
      emojiScale.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  const isWin = result === 'win';
  const shareMsg = `${title} ${subtitle} in ${gameName} on Brain Box! Can you beat me?\n${STORE_URL}`;

  const handleShare = async () => {
    try { await Share.share({ message: shareMsg }); } catch { /* cancelled */ }
  };
  const handleWhatsApp = () => {
    Linking.openURL(`whatsapp://send?text=${encodeURIComponent(shareMsg)}`).catch(handleShare);
  };
  const handleTwitter = () => {
    Linking.openURL(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMsg)}`).catch(handleShare);
  };

  const color = titleColor ?? t.accent;

  const resultEmoji = result === 'win' ? '\uD83C\uDF89' : result === 'lose' ? '\uD83D\uDE14' : '\uD83E\uDD1D';

  return (
    <>
      <ConfettiOverlay visible={isWin} />
      <Animated.View style={[styles.overlay, { backgroundColor: t.overlay, opacity }]}>
        <Animated.View style={[styles.card, { backgroundColor: t.surface, borderColor: t.cardBorder, transform: [{ scale }, { translateX: shakeX }] }]}>
          <Animated.Text style={[styles.emoji, { transform: [{ scale: emojiScale }] }]}>{resultEmoji}</Animated.Text>
          {isDaily && <Text style={[styles.dailyBadge, { color: t.gold }]}>{'\uD83C\uDFC6'} DAILY CHALLENGE</Text>}
          <Text style={[styles.title, { color }]}>{title}</Text>
          <Text style={[styles.sub, { color: t.textSec }]}>{subtitle}</Text>

          <Text style={[styles.shareLabel, { color: t.textSec }]}>Challenge a friend</Text>
          <View style={styles.socialRow}>
            <Pressable onPress={handleShare} style={[styles.socialBtn, { backgroundColor: t.surfaceAlt }]}>
              <Text style={styles.socialIcon}>{'\uD83D\uDD17'}</Text>
              <Text style={[styles.socialText, { color: t.text }]}>Share</Text>
            </Pressable>
            <Pressable onPress={handleWhatsApp} style={[styles.socialBtn, { backgroundColor: '#25D366' }]}>
              <Text style={styles.socialIcon}>{'\uD83D\uDCAC'}</Text>
              <Text style={[styles.socialText, { color: '#fff' }]}>WhatsApp</Text>
            </Pressable>
            <Pressable onPress={handleTwitter} style={[styles.socialBtn, { backgroundColor: '#1DA1F2' }]}>
              <Text style={styles.socialIcon}>{'\uD83D\uDC26'}</Text>
              <Text style={[styles.socialText, { color: '#fff' }]}>Twitter</Text>
            </Pressable>
          </View>

          <View style={styles.btns}>
            <Pressable onPress={onPlayAgain} style={[styles.btn, { backgroundColor: t.accent }]}>
              <Text style={[styles.btnTxt, { color: '#fff' }]}>{isDaily ? 'Home' : 'Play Again'}</Text>
            </Pressable>
            {!isDaily && (
              <Pressable onPress={onHome} style={[styles.btn, { backgroundColor: t.surfaceAlt }]}>
                <Text style={[styles.btnTxt, { color: t.textSec }]}>Home</Text>
              </Pressable>
            )}
          </View>
        </Animated.View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  card: { borderRadius: 24, padding: 28, alignItems: 'center', width: '85%', borderWidth: 1, elevation: 8, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 20, shadowOffset: { width: 0, height: 8 } },
  emoji: { fontSize: 48, marginBottom: 8 },
  dailyBadge: { fontSize: 13, fontWeight: '900', letterSpacing: 2, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '900', marginBottom: 4 },
  sub: { fontSize: 18, fontWeight: '600', marginBottom: 20 },
  shareLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 2, marginBottom: 10, textTransform: 'uppercase' },
  socialRow: { flexDirection: 'row', gap: 8, marginBottom: 22 },
  socialBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 12, gap: 4 },
  socialIcon: { fontSize: 16 },
  socialText: { fontSize: 12, fontWeight: '700' },
  btns: { width: '100%', gap: 10 },
  btn: { paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  btnTxt: { fontSize: 15, fontWeight: '700', letterSpacing: 0.5 },
});
