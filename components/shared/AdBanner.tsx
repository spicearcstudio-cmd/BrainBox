import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { usePremium } from '../../context/PremiumContext';
import { useTheme } from '../../context/ThemeContext';
import { BANNER_ID } from '../../services/adManager';

let BannerAd: any = null;
let BannerAdSize: any = null;
try {
  const gma = require('react-native-google-mobile-ads');
  BannerAd = gma.BannerAd;
  BannerAdSize = gma.BannerAdSize;
} catch {}

export default function AdBanner() {
  const { isPremium } = usePremium();
  const { theme: t } = useTheme();

  if (isPremium) return null;

  if (BannerAd && BannerAdSize) {
    return (
      <View style={styles.banner}>
        <BannerAd unitId={BANNER_ID} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
      </View>
    );
  }

  return (
    <View style={[styles.banner, { backgroundColor: t.surfaceAlt, borderColor: t.cardBorder, borderTopWidth: 1 }]}>
      <Text style={[styles.text, { color: t.textSec }]}>Ad Space {'\u2014'} Go Premium to remove</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { minHeight: 50, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 12, fontWeight: '600' },
});
