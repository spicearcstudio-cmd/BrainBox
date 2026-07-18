import React, { useState, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Dimensions } from 'react-native';
import { loadData, saveData } from '../../services/storage';

const { width } = Dimensions.get('window');
const ONBOARDING_KEY = 'onboarding_completed';

const SLIDES = [
  { emoji: '\uD83E\uDDE0', title: 'Welcome to Brainio!', desc: '7 classic strategy games, all in one app. Play solo against AI or challenge a friend!' },
  { emoji: '\uD83C\uDFC6', title: 'Daily Challenges', desc: 'A new unique puzzle every day. Build your streak and never miss a day!' },
  { emoji: '\u2B50', title: 'Level Up & Earn XP', desc: 'Every game earns XP. Level up from Newbie to Brain God and unlock bonus games along the way!' },
  { emoji: '\uD83C\uDFC5', title: 'Unlock Achievements', desc: 'Collect 18 badges by hitting milestones, perfecting games, and building streaks.' },
  { emoji: '\uD83C\uDF89', title: 'Ready to play?', desc: 'Start with any game and have fun! Your Brainio journey begins now.' },
];

interface Props {
  onComplete: () => void;
}

export default function OnboardingOverlay({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const opacity = useRef(new Animated.Value(1)).current;

  const goNext = () => {
    if (step >= SLIDES.length - 1) {
      saveData(ONBOARDING_KEY, 'true');
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(onComplete);
      return;
    }
    Animated.sequence([
      Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    setStep(s => s + 1);
  };

  const skip = () => {
    saveData(ONBOARDING_KEY, 'true');
    Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(onComplete);
  };

  const slide = SLIDES[step];

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Pressable onPress={skip} style={styles.skipBtn}>
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      <View style={styles.content}>
        <Text style={styles.emoji}>{slide.emoji}</Text>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.desc}>{slide.desc}</Text>
      </View>

      <View style={styles.bottom}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
          ))}
        </View>
        <Pressable onPress={goNext} style={styles.nextBtn}>
          <Text style={styles.nextText}>{step === SLIDES.length - 1 ? "Let's Go!" : 'Next'}</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

export async function shouldShowOnboarding(): Promise<boolean> {
  const done = await loadData(ONBOARDING_KEY);
  return done !== 'true';
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#5C6BC0', justifyContent: 'center', alignItems: 'center', zIndex: 10000,
  },
  skipBtn: { position: 'absolute', top: 60, right: 24, zIndex: 10 },
  skipText: { color: 'rgba(255,255,255,0.6)', fontSize: 16, fontWeight: '600' },
  content: { alignItems: 'center', paddingHorizontal: 40, flex: 1, justifyContent: 'center' },
  emoji: { fontSize: 80, marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '900', color: '#fff', textAlign: 'center', marginBottom: 16 },
  desc: { fontSize: 16, fontWeight: '500', color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 24 },
  bottom: { paddingBottom: 60, alignItems: 'center', gap: 24 },
  dots: { flexDirection: 'row', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)' },
  dotActive: { backgroundColor: '#fff', width: 24 },
  nextBtn: { backgroundColor: '#fff', paddingVertical: 16, paddingHorizontal: 48, borderRadius: 16 },
  nextText: { color: '#5C6BC0', fontSize: 18, fontWeight: '900' },
});
