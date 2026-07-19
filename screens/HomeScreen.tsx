import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, ScrollView, Platform, Alert, Animated, Easing } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { usePremium } from '../context/PremiumContext';
import { GAMES, GameId, GameInfo } from '../constants/games';
import { getDailyChallenge, isDailyChallengeCompleted, getDailyStreak } from '../services/dailyChallenge';
import { getParentalState } from '../services/parentalControl';
import { getProgression, ProgressionState } from '../services/progressionManager';
import { getUnlockedCount } from '../services/achievementManager';
import { getPlayerProfile } from '../services/avatarManager';
import { claimFreeDailyPowerUp, hasClaimedFreeDailyPowerUp, POWERUPS, PowerUpType } from '../services/powerupManager';
import { getDaysRemaining, getTournamentState } from '../services/weeklyTournament';
import AnimatedScreen from '../components/shared/AnimatedScreen';
import XPBar from '../components/shared/XPBar';

interface Props {
  onSelectGame: (id: GameId) => void;
  onSettings: () => void;
  onStats: () => void;
  onDaily: () => void;
  onAchievements: () => void;
  onHowToPlay: () => void;
  onWeeklyRecap: () => void;
  onAvatar: () => void;
  onBoardSkins: () => void;
  onTournament: () => void;
}

function WobbleCard({ children, delay = 0, style, onPress, accessibilityRole, accessibilityLabel, accessibilityState }: any) {
  const bounce = useRef(new Animated.Value(0)).current;
  const wobble = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.spring(bounce, { toValue: 1, tension: 40, friction: 5, useNativeDriver: true }),
        Animated.sequence([
          Animated.timing(wobble, { toValue: 1, duration: 120, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(wobble, { toValue: -0.5, duration: 100, useNativeDriver: true }),
          Animated.timing(wobble, { toValue: 0, duration: 80, useNativeDriver: true }),
        ]),
      ]).start();
    }, delay);
    return () => clearTimeout(timeout);
  }, []);

  const scale = bounce.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });
  const rotate = wobble.interpolate({ inputRange: [-1, 0, 1], outputRange: ['-2deg', '0deg', '2deg'] });

  if (onPress) {
    return (
      <Animated.View style={[{ transform: [{ scale }, { rotate }] }, style]}>
        <Pressable
          onPress={onPress}
          accessibilityRole={accessibilityRole}
          accessibilityLabel={accessibilityLabel}
          accessibilityState={accessibilityState}
          style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.95 : 1 }] }]}
        >
          {children}
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[{ transform: [{ scale }, { rotate }] }, style]}>
      {children}
    </Animated.View>
  );
}

export default function HomeScreen({ onSelectGame, onSettings, onStats, onDaily, onAchievements, onHowToPlay, onWeeklyRecap, onAvatar, onBoardSkins, onTournament }: Props) {
  const { theme: t } = useTheme();
  const { isPremium } = usePremium();
  const [dailyDone, setDailyDone] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [progression, setProgression] = useState<ProgressionState | null>(null);
  const [achievementInfo, setAchievementInfo] = useState({ unlocked: 0, total: 0 });
  const [dailyStreak, setDailyStreak] = useState(0);
  const [playerAvatar, setPlayerAvatar] = useState('\uD83D\uDE0E');
  const [playerName, setPlayerName] = useState('Player');
  const [canClaimPowerUp, setCanClaimPowerUp] = useState(false);
  const [tournamentCompleted, setTournamentCompleted] = useState(0);
  const daily = getDailyChallenge();

  const titleBounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    isDailyChallengeCompleted().then(setDailyDone);
    getParentalState().then(s => { if (s.enabled) setRemaining(s.remaining); });
    getProgression().then(setProgression);
    getUnlockedCount().then(setAchievementInfo);
    getDailyStreak().then(s => setDailyStreak(s.current));
    getPlayerProfile().then(p => { setPlayerAvatar(p.avatar); setPlayerName(p.name); });
    hasClaimedFreeDailyPowerUp().then(claimed => setCanClaimPowerUp(!claimed));
    getTournamentState().then(s => setTournamentCompleted(s.completedCount));

    Animated.spring(titleBounce, { toValue: 1, tension: 50, friction: 4, useNativeDriver: true }).start();
  }, []);

  const handleClaimPowerUp = async () => {
    const type = await claimFreeDailyPowerUp();
    if (type) {
      const pu = POWERUPS.find(p => p.type === type);
      Alert.alert('Daily Power-Up!', `You received: ${pu?.icon} ${pu?.name}!\n\nUse it in your next game.`);
      setCanClaimPowerUp(false);
    }
  };

  const hoursLeft = 23 - new Date().getHours();
  const titleScale = titleBounce.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      <AnimatedScreen>
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? 44 : 8 }]}>
        <Pressable onPress={onAvatar} style={[styles.avatarBtn, { backgroundColor: t.surface, borderColor: t.accent + '50' }]} accessibilityRole="button" accessibilityLabel="Edit your profile">
          <Text style={{ fontSize: 22 }}>{playerAvatar}</Text>
        </Pressable>
        <Animated.View style={[styles.titleRow, { transform: [{ scale: titleScale }] }]}>
          <Text style={[styles.title, { color: t.text }]}>{'\uD83E\uDDE0'} Brainio</Text>
        </Animated.View>
        <Pressable onPress={onSettings} style={[styles.settingsBtn, { backgroundColor: t.surface, borderColor: t.accent + '50' }]} accessibilityRole="button" accessibilityLabel="Settings">
          <Text style={{ fontSize: 18 }}>{'\u2699\uFE0F'}</Text>
        </Pressable>
      </View>

      <Text style={[styles.subtitle, { color: t.textSec }]}>{'\u2728'} Train your brain, have fun! {'\u2728'}</Text>

      {remaining !== null && (
        <View style={[styles.limitBanner, { backgroundColor: t.gold + '18', borderColor: t.gold + '40' }]}>
          <Text style={[styles.limitText, { color: t.gold }]}>{'\uD83D\uDD12'} {remaining} games remaining today</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {progression && (
          <WobbleCard delay={100}>
            <View style={styles.xpSection}>
              <XPBar
                level={progression.level}
                title={progression.title}
                progress={progression.progress}
                xpInLevel={progression.xpInCurrentLevel}
                xpToNext={progression.xpToNextLevel}
                isMax={progression.isMaxLevel}
              />
              <View style={styles.statsRow}>
                <Pressable onPress={onAchievements} style={[styles.miniStat, { backgroundColor: t.surface, borderColor: t.accent + '30' }]} accessibilityRole="button" accessibilityLabel={`Achievements: ${achievementInfo.unlocked} of ${achievementInfo.total} badges unlocked`}>
                  <Text style={{ fontSize: 18, marginBottom: 4 }}>{'\uD83C\uDFC5'}</Text>
                  <Text style={[styles.miniStatNum, { color: t.accent }]}>{achievementInfo.unlocked}/{achievementInfo.total}</Text>
                  <Text style={[styles.miniStatLabel, { color: t.textSec }]}>Badges</Text>
                </Pressable>
                <View style={[styles.miniStat, { backgroundColor: t.surface, borderColor: t.gold + '30' }]}>
                  <Text style={{ fontSize: 18, marginBottom: 4 }}>{'\uD83D\uDD25'}</Text>
                  <Text style={[styles.miniStatNum, { color: t.gold }]}>{dailyStreak}</Text>
                  <Text style={[styles.miniStatLabel, { color: t.textSec }]}>Day Streak</Text>
                </View>
              </View>
              <View style={styles.quickRow}>
                <Pressable onPress={onStats} style={[styles.quickBtn, { backgroundColor: t.surface, borderColor: t.cardBorder }]} accessibilityRole="button" accessibilityLabel="Game statistics">
                  <Text style={styles.quickIcon}>{'\uD83D\uDCCA'}</Text>
                  <Text style={[styles.quickLabel, { color: t.text }]}>Stats</Text>
                </Pressable>
                <Pressable onPress={onHowToPlay} style={[styles.quickBtn, { backgroundColor: t.surface, borderColor: t.cardBorder }]} accessibilityRole="button" accessibilityLabel="How to play">
                  <Text style={styles.quickIcon}>{'\u2753'}</Text>
                  <Text style={[styles.quickLabel, { color: t.text }]}>Rules</Text>
                </Pressable>
                <Pressable onPress={onBoardSkins} style={[styles.quickBtn, { backgroundColor: t.surface, borderColor: t.cardBorder }]} accessibilityRole="button" accessibilityLabel="Board skins">
                  <Text style={styles.quickIcon}>{'\uD83C\uDFA8'}</Text>
                  <Text style={[styles.quickLabel, { color: t.text }]}>Skins</Text>
                </Pressable>
                <Pressable onPress={onWeeklyRecap} style={[styles.quickBtn, { backgroundColor: t.surface, borderColor: t.cardBorder }]} accessibilityRole="button" accessibilityLabel="Weekly recap">
                  <Text style={styles.quickIcon}>{'\uD83D\uDCC5'}</Text>
                  <Text style={[styles.quickLabel, { color: t.text }]}>Recap</Text>
                </Pressable>
              </View>
            </View>
          </WobbleCard>
        )}

        {dailyStreak >= 2 && !dailyDone && (
          <WobbleCard delay={200} onPress={onDaily}>
            <View style={[styles.urgencyBanner, { backgroundColor: '#E85D4A' + '12', borderColor: '#E85D4A' + '60' }]}>
              <Text style={styles.urgencyEmoji}>{'\uD83D\uDD25'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.urgencyTitle, { color: '#D4504A' }]}>Don't lose your {dailyStreak}-day streak!</Text>
                <Text style={[styles.urgencyDesc, { color: t.textSec }]}>~{hoursLeft}h left to complete today's challenge</Text>
              </View>
            </View>
          </WobbleCard>
        )}

        <WobbleCard delay={250} onPress={onTournament} accessibilityRole="button" accessibilityLabel="Weekly tournament">
          <View style={[styles.tournamentCard, { backgroundColor: t.accent + '0D', borderColor: t.accent + '35' }]}>
            <View style={[styles.cardEmoji, { backgroundColor: t.accent + '15' }]}>
              <Text style={{ fontSize: 22 }}>{'\uD83C\uDFC6'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.tournamentTitle, { color: t.accent }]}>Weekly Tournament</Text>
              <Text style={[styles.tournamentDesc, { color: t.textSec }]}>
                {tournamentCompleted}/5 puzzles {'\u2022'} {getDaysRemaining()}d left
              </Text>
            </View>
            <Text style={{ fontSize: 16, color: t.textSec }}>{'\u25B6'}</Text>
          </View>
        </WobbleCard>

        {canClaimPowerUp && (
          <WobbleCard delay={300} onPress={handleClaimPowerUp}>
            <View style={[styles.powerUpClaim, { backgroundColor: t.gold + '12', borderColor: t.gold + '40' }]}>
              <View style={[styles.cardEmoji, { backgroundColor: t.gold + '20' }]}>
                <Text style={{ fontSize: 22 }}>{'\uD83C\uDF81'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.powerUpTitle, { color: t.gold }]}>Free Daily Power-Up!</Text>
                <Text style={[styles.powerUpDesc, { color: t.textSec }]}>Tap to claim a random power-up</Text>
              </View>
            </View>
          </WobbleCard>
        )}

        <WobbleCard delay={350} onPress={onDaily} accessibilityRole="button" accessibilityLabel={dailyDone ? 'Daily challenge completed' : 'Play daily challenge'}>
          <View style={[styles.dailyCard, {
            backgroundColor: dailyDone ? t.accent + '0A' : t.gold + '10',
            borderColor: dailyDone ? t.accent + '40' : t.gold + '40',
          }]}>
            <View style={[styles.cardEmoji, { backgroundColor: dailyDone ? t.accent + '18' : t.gold + '18' }]}>
              <Text style={{ fontSize: 26 }}>{dailyDone ? '\u2705' : '\uD83C\uDFC6'}</Text>
            </View>
            <View style={styles.dailyCenter}>
              <Text style={[styles.dailyTitle, { color: dailyDone ? t.accent : t.gold }]}>
                {dailyDone ? 'Challenge Complete!' : 'Daily Challenge'}
              </Text>
              <Text style={[styles.dailyDesc, { color: t.textSec }]}>{daily.gameName} {'\u2014'} {daily.description}</Text>
            </View>
            {dailyDone && (
              <View style={[styles.dailyCheck, { backgroundColor: t.accent }]}>
                <Text style={styles.dailyCheckText}>{'\u2714'}</Text>
              </View>
            )}
          </View>
        </WobbleCard>

        <View style={styles.sectionRow}>
          <View style={[styles.sectionLine, { backgroundColor: t.cardBorder }]} />
          <Text style={[styles.sectionTitle, { color: t.text }]}>{'\uD83C\uDFAE'} Games</Text>
          <View style={[styles.sectionLine, { backgroundColor: t.cardBorder }]} />
        </View>

        <View style={styles.grid}>
          {GAMES.map((game, idx) => {
            const locked = game.unlockLevel != null && (progression?.level ?? 1) < game.unlockLevel;
            return (
              <WobbleCard
                key={game.id}
                delay={400 + idx * 80}
                onPress={locked ? undefined : () => onSelectGame(game.id)}
                accessibilityRole="button"
                accessibilityLabel={locked ? `${game.name}, locked until level ${game.unlockLevel}` : `Play ${game.name}`}
                accessibilityState={{ disabled: locked }}
                style={styles.cardWrapper}
              >
                <View style={[
                  styles.card,
                  { backgroundColor: t.card, borderColor: locked ? t.gold + '40' : game.color + '30' },
                ]}>
                  <View style={[styles.cardAccent, { backgroundColor: locked ? t.gold + '30' : game.color + '25' }]} />
                  {locked && (
                    <View style={styles.lockOverlay}>
                      <View style={[styles.lockBadge, { backgroundColor: t.gold + '25' }]}>
                        <Text style={styles.lockEmoji}>{'\uD83D\uDD12'}</Text>
                        <Text style={[styles.lockLevel, { color: t.gold }]}>Lv.{game.unlockLevel}</Text>
                      </View>
                    </View>
                  )}
                  <View style={[styles.iconWrap, { backgroundColor: game.color + '12', borderColor: game.color + '25', opacity: locked ? 0.3 : 1 }]}>
                    <Text style={[styles.icon, { color: game.color }]}>{game.icon}</Text>
                  </View>
                  <Text style={[styles.gameName, { color: t.text, opacity: locked ? 0.4 : 1 }]} numberOfLines={1}>{game.name}</Text>
                  <Text style={[styles.gameDesc, { color: t.textSec, opacity: locked ? 0.4 : 1 }]} numberOfLines={2}>{game.description}</Text>
                  {!locked && (
                    <View style={[styles.playChip, { backgroundColor: game.color + '12', borderColor: game.color + '25' }]}>
                      <Text style={[styles.playChipText, { color: game.color }]}>PLAY {'\u25B6'}</Text>
                    </View>
                  )}
                </View>
              </WobbleCard>
            );
          })}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
      </AnimatedScreen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { fontSize: 28, fontWeight: '900', letterSpacing: 0.5 },
  proBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  proText: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  settingsBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderStyle: 'dashed' as any },
  avatarBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderStyle: 'dashed' as any },
  subtitle: { fontSize: 13, fontWeight: '600', textAlign: 'center', marginBottom: 10, letterSpacing: 0.5 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },
  xpSection: { marginBottom: 14 },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  miniStat: { flex: 1, borderRadius: 20, padding: 14, alignItems: 'center', borderWidth: 2, borderStyle: 'dashed' as any },
  miniStatNum: { fontSize: 22, fontWeight: '900' },
  miniStatLabel: { fontSize: 11, fontWeight: '600', marginTop: 2, letterSpacing: 0.5 },
  urgencyBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 20, borderWidth: 2, borderStyle: 'dashed' as any, marginBottom: 10 },
  urgencyEmoji: { fontSize: 24 },
  urgencyTitle: { fontSize: 14, fontWeight: '800' },
  urgencyDesc: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  cardEmoji: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  dailyCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 22, borderWidth: 2, borderStyle: 'dashed' as any, marginBottom: 14 },
  dailyCenter: { flex: 1, marginLeft: 12 },
  dailyTitle: { fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },
  dailyDesc: { fontSize: 12, fontWeight: '500', marginTop: 3 },
  dailyCheck: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  dailyCheckText: { color: '#fff', fontSize: 14, fontWeight: '900' },
  sectionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, marginTop: 8, gap: 12 },
  sectionLine: { flex: 1, height: 2, borderRadius: 1 },
  sectionTitle: { fontSize: 18, fontWeight: '900', letterSpacing: 0.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  cardWrapper: { width: '46%', minWidth: 150 },
  card: { borderRadius: 24, padding: 16, paddingTop: 20, borderWidth: 2, overflow: 'hidden', borderStyle: 'solid' },
  cardAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 6, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  iconWrap: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 2, borderStyle: 'dashed' as any },
  icon: { fontSize: 28, fontWeight: '800' },
  gameName: { fontSize: 15, fontWeight: '800', marginBottom: 3 },
  gameDesc: { fontSize: 11, fontWeight: '500', lineHeight: 15 },
  playChip: { marginTop: 10, paddingVertical: 7, paddingHorizontal: 14, borderRadius: 12, alignSelf: 'flex-start', borderWidth: 1.5 },
  playChipText: { fontSize: 11, fontWeight: '900', letterSpacing: 1.5 },
  lockOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 24 },
  lockBadge: { alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 16 },
  lockEmoji: { fontSize: 24, marginBottom: 4 },
  lockLevel: { fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  quickRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  quickBtn: { flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 10, paddingHorizontal: 6, borderRadius: 16, borderWidth: 2, borderStyle: 'dashed' as any },
  quickIcon: { fontSize: 18 },
  quickLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  limitBanner: { marginHorizontal: 16, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 14, alignItems: 'center', marginBottom: 8, borderWidth: 1.5, borderStyle: 'dashed' as any },
  limitText: { fontSize: 13, fontWeight: '700' },
  tournamentCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 22, borderWidth: 2, borderStyle: 'dashed' as any, marginBottom: 10, gap: 12 },
  tournamentTitle: { fontSize: 14, fontWeight: '800' },
  tournamentDesc: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  powerUpClaim: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 22, borderWidth: 2, borderStyle: 'dashed' as any, marginBottom: 10, gap: 12 },
  powerUpTitle: { fontSize: 14, fontWeight: '800' },
  powerUpDesc: { fontSize: 12, fontWeight: '500', marginTop: 2 },
});
