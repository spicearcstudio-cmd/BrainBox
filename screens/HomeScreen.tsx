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

  useEffect(() => {
    isDailyChallengeCompleted().then(setDailyDone);
    getParentalState().then(s => { if (s.enabled) setRemaining(s.remaining); });
    getProgression().then(setProgression);
    getUnlockedCount().then(setAchievementInfo);
    getDailyStreak().then(s => setDailyStreak(s.current));
    getPlayerProfile().then(p => { setPlayerAvatar(p.avatar); setPlayerName(p.name); });
    hasClaimedFreeDailyPowerUp().then(claimed => setCanClaimPowerUp(!claimed));
    getTournamentState().then(s => setTournamentCompleted(s.completedCount));
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

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      <AnimatedScreen>
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? 44 : 8 }]}>
        <Pressable onPress={onAvatar} style={[styles.avatarBtn, { backgroundColor: t.surface, borderColor: t.cardBorder }]} accessibilityRole="button" accessibilityLabel="Edit your profile">
          <Text style={{ fontSize: 22 }}>{playerAvatar}</Text>
        </Pressable>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: t.text }]} accessibilityRole="header">{'\uD83E\uDDE0'} Brainio</Text>
          {isPremium && <View style={styles.proBadge}><Text style={styles.proText}>PRO</Text></View>}
        </View>
        <Pressable onPress={onSettings} style={[styles.settingsBtn, { backgroundColor: t.surface, borderColor: t.cardBorder }]} accessibilityRole="button" accessibilityLabel="Settings">
          <Text style={{ fontSize: 18 }}>{'\u2699\uFE0F'}</Text>
        </Pressable>
      </View>

      <Text style={[styles.subtitle, { color: t.textSec }]}>Classic Strategy Games</Text>

      {remaining !== null && (
        <View style={[styles.limitBanner, { backgroundColor: t.gold + '20' }]}>
          <Text style={[styles.limitText, { color: t.gold }]}>{'\uD83D\uDD12'} {remaining} games remaining today</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {progression && (
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
              <Pressable onPress={onAchievements} style={[styles.miniStat, { backgroundColor: t.surface, borderColor: t.cardBorder }]} accessibilityRole="button" accessibilityLabel={`Achievements: ${achievementInfo.unlocked} of ${achievementInfo.total} badges unlocked`}>
                <Text style={[styles.miniStatNum, { color: t.accent }]}>{achievementInfo.unlocked}/{achievementInfo.total}</Text>
                <Text style={[styles.miniStatLabel, { color: t.textSec }]}>Badges</Text>
              </Pressable>
              <View style={[styles.miniStat, { backgroundColor: t.surface, borderColor: t.cardBorder }]}>
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
        )}

        {/* Streak urgency: if user has a streak and hasn't done today's challenge */}
        {dailyStreak >= 2 && !dailyDone && (
          <Pressable onPress={onDaily} style={[styles.urgencyBanner, { backgroundColor: '#FF6B6B' + '18', borderColor: '#FF6B6B' }]}>
            <Text style={styles.urgencyEmoji}>{'\uD83D\uDD25'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.urgencyTitle, { color: '#FF6B6B' }]}>Don't lose your {dailyStreak}-day streak!</Text>
              <Text style={[styles.urgencyDesc, { color: t.textSec }]}>~{hoursLeft}h left to complete today's challenge</Text>
            </View>
          </Pressable>
        )}

        <Pressable
          onPress={onTournament}
          accessibilityRole="button"
          accessibilityLabel="Weekly tournament"
          style={({ pressed }) => [styles.tournamentCard, {
            backgroundColor: t.player + '12',
            borderColor: t.player,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          }]}
        >
          <Text style={{ fontSize: 24 }}>{'\uD83C\uDFC6'}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.tournamentTitle, { color: t.player }]}>Weekly Tournament</Text>
            <Text style={[styles.tournamentDesc, { color: t.textSec }]}>
              {tournamentCompleted}/5 puzzles {'\u2022'} {getDaysRemaining()}d left
            </Text>
          </View>
          <Text style={{ fontSize: 16, color: t.textSec }}>{'\u25B6'}</Text>
        </Pressable>

        {canClaimPowerUp && (
          <Pressable
            onPress={handleClaimPowerUp}
            style={({ pressed }) => [styles.powerUpClaim, {
              backgroundColor: t.gold + '18',
              borderColor: t.gold,
              transform: [{ scale: pressed ? 0.96 : 1 }],
            }]}
          >
            <Text style={{ fontSize: 22 }}>{'\uD83C\uDF81'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.powerUpTitle, { color: t.gold }]}>Free Daily Power-Up!</Text>
              <Text style={[styles.powerUpDesc, { color: t.textSec }]}>Tap to claim a random power-up</Text>
            </View>
          </Pressable>
        )}

        <Pressable
          onPress={onDaily}
          accessibilityRole="button"
          accessibilityLabel={dailyDone ? 'Daily challenge completed' : 'Play daily challenge'}
          style={({ pressed }) => [styles.dailyCard, {
            backgroundColor: dailyDone ? t.accent + '10' : t.gold + '15',
            borderColor: dailyDone ? t.accent : t.gold,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          }]}
        >
          <View style={styles.dailyLeft}>
            <Text style={{ fontSize: 28 }}>{dailyDone ? '\u2705' : '\uD83C\uDFC6'}</Text>
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
        </Pressable>

        <Text style={[styles.sectionTitle, { color: t.text }]}>{'\uD83C\uDFAE'} Games</Text>
        <View style={styles.grid}>
          {GAMES.map((game, idx) => {
            const locked = game.unlockLevel != null && (progression?.level ?? 1) < game.unlockLevel;
            return (
              <Pressable
                key={game.id}
                onPress={() => {
                  if (locked) {
                    return;
                  }
                  onSelectGame(game.id);
                }}
                accessibilityRole="button"
                accessibilityLabel={locked ? `${game.name}, locked until level ${game.unlockLevel}` : `Play ${game.name}`}
                accessibilityState={{ disabled: locked }}
                style={({ pressed }) => [
                  styles.card,
                  { backgroundColor: t.card, borderColor: locked ? t.gold + '60' : t.cardBorder, transform: [{ scale: pressed && !locked ? 0.95 : 1 }] },
                ]}
              >
                <View style={[styles.cardAccent, { backgroundColor: locked ? t.gold + '40' : game.color }]} />
                {locked && (
                  <View style={styles.lockOverlay}>
                    <View style={[styles.lockBadge, { backgroundColor: t.gold + '30' }]}>
                      <Text style={styles.lockEmoji}>{'\uD83D\uDD12'}</Text>
                      <Text style={[styles.lockLevel, { color: t.gold }]}>Lv.{game.unlockLevel}</Text>
                    </View>
                  </View>
                )}
                <View style={[styles.iconWrap, { backgroundColor: game.color + '15', borderColor: game.color + '30', opacity: locked ? 0.3 : 1 }]}>
                  <Text style={[styles.icon, { color: game.color }]}>{game.icon}</Text>
                </View>
                <Text style={[styles.gameName, { color: t.text, opacity: locked ? 0.4 : 1 }]} numberOfLines={1}>{game.name}</Text>
                <Text style={[styles.gameDesc, { color: t.textSec, opacity: locked ? 0.4 : 1 }]} numberOfLines={2}>{game.description}</Text>
                {!locked && (
                  <View style={[styles.playChip, { backgroundColor: game.color + '15' }]}>
                    <Text style={[styles.playChipText, { color: game.color }]}>PLAY {'\u25B6'}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      </AnimatedScreen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { fontSize: 26, fontWeight: '900', letterSpacing: 0.5 },
  proBadge: { backgroundColor: '#FFB300', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  proText: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  settingsBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  avatarBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  subtitle: { fontSize: 13, fontWeight: '600', textAlign: 'center', marginBottom: 8, letterSpacing: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },
  xpSection: { marginBottom: 14 },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  miniStat: { flex: 1, borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 1, elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  miniStatNum: { fontSize: 20, fontWeight: '900' },
  miniStatLabel: { fontSize: 11, fontWeight: '600', marginTop: 2, letterSpacing: 0.5 },
  urgencyBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 16, borderWidth: 1.5, marginBottom: 12 },
  urgencyEmoji: { fontSize: 24 },
  urgencyTitle: { fontSize: 14, fontWeight: '800' },
  urgencyDesc: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  dailyCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 18, borderWidth: 2, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
  dailyLeft: { marginRight: 12 },
  dailyCenter: { flex: 1 },
  dailyTitle: { fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  dailyDesc: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  dailyCheck: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  dailyCheckText: { color: '#fff', fontSize: 14, fontWeight: '900' },
  sectionTitle: { fontSize: 18, fontWeight: '900', marginBottom: 14, marginTop: 6, letterSpacing: 0.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  card: { width: '46%', minWidth: 150, borderRadius: 20, padding: 16, paddingTop: 20, borderWidth: 1, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
  cardAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 4, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  iconWrap: { width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 1.5 },
  icon: { fontSize: 28, fontWeight: '800' },
  gameName: { fontSize: 15, fontWeight: '800', marginBottom: 3 },
  gameDesc: { fontSize: 11, fontWeight: '500', lineHeight: 15 },
  playChip: { marginTop: 10, paddingVertical: 6, paddingHorizontal: 14, borderRadius: 10, alignSelf: 'flex-start' },
  playChipText: { fontSize: 11, fontWeight: '900', letterSpacing: 1.5 },
  lockOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 20 },
  lockBadge: { alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 14 },
  lockEmoji: { fontSize: 24, marginBottom: 4 },
  lockLevel: { fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  quickRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  quickBtn: { flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 10, paddingHorizontal: 6, borderRadius: 14, borderWidth: 1, elevation: 1, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  quickIcon: { fontSize: 18 },
  quickLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  limitBanner: { marginHorizontal: 16, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12, alignItems: 'center', marginBottom: 8 },
  limitText: { fontSize: 13, fontWeight: '700' },
  tournamentCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16, borderWidth: 1.5, marginBottom: 10, gap: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  tournamentTitle: { fontSize: 14, fontWeight: '800' },
  tournamentDesc: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  powerUpClaim: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16, borderWidth: 1.5, marginBottom: 10, gap: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  powerUpTitle: { fontSize: 14, fontWeight: '800' },
  powerUpDesc: { fontSize: 12, fontWeight: '500', marginTop: 2 },
});
