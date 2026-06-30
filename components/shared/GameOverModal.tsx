import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Share, Linking } from 'react-native';
import * as StoreReview from 'expo-store-review';
import { useTheme } from '../../context/ThemeContext';
import { usePremium } from '../../context/PremiumContext';
import { recordGamePlayed, shouldShowInterstitial } from '../../services/adManager';
import { playSound, hapticNotification } from '../../services/soundManager';
import { recordResult, shouldPromptRating } from '../../services/statsManager';
import { awardXP, getProgression, XPGain } from '../../services/progressionManager';
import { calculateStars, recordStars, getThreeStarCount } from '../../services/starRating';
import { checkAchievements, AchievementCheckData } from '../../services/achievementManager';
import { getDailyChallenge } from '../../services/dailyChallenge';
import { GameId } from '../../constants/games';
import ConfettiOverlay from './ConfettiOverlay';
import StarRatingDisplay from './StarRatingDisplay';
import LevelUpOverlay from './LevelUpOverlay';
import { triggerAchievementToast } from './AchievementToast';

const STORE_URL = 'https://play.google.com/store/apps/details?id=com.brainbox.games';

const CLOSE_LOSS_MESSAGES = [
  'So close! One more try?',
  'Almost had it! Go again?',
  'That was tight! Rematch?',
  'Nearly there! Try once more?',
  'You were THIS close!',
];

interface Props {
  visible: boolean;
  title: string;
  subtitle: string;
  titleColor?: string;
  gameName: string;
  gameId?: GameId;
  result?: 'win' | 'lose' | 'draw';
  extraStats?: { score?: number; opponentScore?: number; turns?: number; maxTurns?: number; movesLeft?: number };
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

  const [stars, setStars] = useState(0);
  const [xpGain, setXpGain] = useState<XPGain | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [closeLossMsg, setCloseLossMsg] = useState<string | null>(null);

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

      // Star rating
      let earnedStars = 0;
      if (gameId && result) {
        earnedStars = calculateStars(gameId, result, extraStats);
        setStars(earnedStars);
      }

      // Close loss detection
      if (result === 'lose' && extraStats?.score !== undefined && extraStats?.opponentScore !== undefined) {
        const margin = extraStats.opponentScore - extraStats.score;
        if (margin <= 2) {
          setCloseLossMsg(CLOSE_LOSS_MESSAGES[Math.floor(Math.random() * CLOSE_LOSS_MESSAGES.length)]);
        }
      }

      // Record stats, XP, achievements
      if (gameId && result) {
        (async () => {
          const allStats = await recordResult(gameId, result, extraStats);
          await recordStars(earnedStars);

          const gameStats = allStats.games[gameId];
          const currentStreak = gameStats?.currentStreak ?? 0;

          const xp = await awardXP(result, {
            winStreak: currentStreak,
            isDaily: isDaily,
            stars: earnedStars,
          });
          setXpGain(xp);

          if (xp.leveledUp) {
            setTimeout(() => setShowLevelUp(true), 800);
          }

          // Check achievements
          const prog = await getProgression();
          const stars3 = await getThreeStarCount();
          const gamesPerType: AchievementCheckData['gamesPerType'] = {};
          for (const [id, gs] of Object.entries(allStats.games)) {
            gamesPerType[id as GameId] = { wins: gs.won, played: gs.played };
          }
          const daily = getDailyChallenge();
          const checkData: AchievementCheckData = {
            totalWins: Object.values(allStats.games).reduce((s, g) => s + g.won, 0),
            totalGames: Object.values(allStats.games).reduce((s, g) => s + g.played, 0),
            currentStreak,
            bestStreak: gameStats?.bestStreak ?? 0,
            dailyStreak: 0,
            gamesPerType,
            stars3Count: stars3,
            level: prog.level,
          };
          const newAchievements = await checkAchievements(checkData);
          for (const a of newAchievements) {
            setTimeout(() => triggerAchievementToast(a.icon, a.title, a.description), 1200);
          }

          if (result === 'win' && await shouldPromptRating()) {
            try {
              if (await StoreReview.hasAction()) {
                setTimeout(() => StoreReview.requestReview(), 3000);
              }
            } catch { /* not available */ }
          }
        })();
      }

      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
      ]).start(() => {
        Animated.spring(emojiScale, { toValue: 1, tension: 100, friction: 6, useNativeDriver: true }).start();
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
      setStars(0);
      setXpGain(null);
      setShowLevelUp(false);
      setCloseLossMsg(null);
    }
  }, [visible]);

  if (!visible) return null;

  const isWin = result === 'win';
  const shareMsg = isWin && stars === 3
    ? `\u2B50\u2B50\u2B50 Perfect game in ${gameName}! Can you beat that?\n${STORE_URL}`
    : `${title} ${subtitle} in ${gameName} on Brain Box! Can you beat me?\n${STORE_URL}`;

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
  const displaySubtitle = closeLossMsg ?? subtitle;

  return (
    <>
      <ConfettiOverlay visible={isWin} />
      <LevelUpOverlay
        visible={showLevelUp}
        level={xpGain?.newLevel ?? 1}
        title={xpGain?.newTitle ?? ''}
        onDone={() => setShowLevelUp(false)}
      />
      <Animated.View style={[styles.overlay, { backgroundColor: t.overlay, opacity }]}>
        <Animated.View style={[styles.card, { backgroundColor: t.surface, borderColor: t.cardBorder, transform: [{ scale }, { translateX: shakeX }] }]}>
          <Animated.Text style={[styles.emoji, { transform: [{ scale: emojiScale }] }]}>{resultEmoji}</Animated.Text>
          {isDaily && <Text style={[styles.dailyBadge, { color: t.gold }]}>{'\uD83C\uDFC6'} DAILY CHALLENGE</Text>}
          <Text style={[styles.title, { color }]}>{title}</Text>
          <Text style={[styles.sub, { color: closeLossMsg ? t.accent : t.textSec }]}>{displaySubtitle}</Text>

          {stars > 0 && (
            <View style={styles.starRow}>
              <StarRatingDisplay stars={stars} size={28} />
            </View>
          )}

          {xpGain && (
            <View style={[styles.xpPill, { backgroundColor: t.gold + '20' }]}>
              <Text style={[styles.xpText, { color: t.gold }]}>
                +{xpGain.total} XP
                {xpGain.streakBonus > 0 ? ` (streak +${xpGain.streakBonus})` : ''}
                {xpGain.dailyBonus > 0 ? ' (daily +25)' : ''}
              </Text>
            </View>
          )}

          <Text style={[styles.shareLabel, { color: t.textSec }]}>Challenge a friend</Text>
          <View style={styles.socialRow}>
            <Pressable onPress={handleShare} style={[styles.socialBtn, { backgroundColor: t.surfaceAlt }]} accessibilityRole="button" accessibilityLabel="Share result">
              <Text style={styles.socialIcon}>{'\uD83D\uDD17'}</Text>
              <Text style={[styles.socialText, { color: t.text }]}>Share</Text>
            </Pressable>
            <Pressable onPress={handleWhatsApp} style={[styles.socialBtn, { backgroundColor: '#25D366' }]} accessibilityRole="button" accessibilityLabel="Share on WhatsApp">
              <Text style={styles.socialIcon}>{'\uD83D\uDCAC'}</Text>
              <Text style={[styles.socialText, { color: '#fff' }]}>WhatsApp</Text>
            </Pressable>
            <Pressable onPress={handleTwitter} style={[styles.socialBtn, { backgroundColor: '#1DA1F2' }]} accessibilityRole="button" accessibilityLabel="Share on Twitter">
              <Text style={styles.socialIcon}>{'\uD83D\uDC26'}</Text>
              <Text style={[styles.socialText, { color: '#fff' }]}>Twitter</Text>
            </Pressable>
          </View>

          <View style={styles.btns}>
            <Pressable onPress={onPlayAgain} style={[styles.btn, { backgroundColor: t.accent }]} accessibilityRole="button" accessibilityLabel={isDaily ? 'Go home' : 'Play again'}>
              <Text style={[styles.btnTxt, { color: '#fff' }]}>{isDaily ? 'Home' : (closeLossMsg ? 'Try Again!' : 'Play Again')}</Text>
            </Pressable>
            {!isDaily && (
              <Pressable onPress={onHome} style={[styles.btn, { backgroundColor: t.surfaceAlt }]} accessibilityRole="button" accessibilityLabel="Go to home screen">
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
  sub: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  starRow: { marginBottom: 10 },
  xpPill: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20, marginBottom: 16 },
  xpText: { fontSize: 13, fontWeight: '800' },
  shareLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 2, marginBottom: 10, textTransform: 'uppercase' },
  socialRow: { flexDirection: 'row', gap: 8, marginBottom: 22 },
  socialBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 12, gap: 4 },
  socialIcon: { fontSize: 16 },
  socialText: { fontSize: 12, fontWeight: '700' },
  btns: { width: '100%', gap: 10 },
  btn: { paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  btnTxt: { fontSize: 15, fontWeight: '700', letterSpacing: 0.5 },
});
