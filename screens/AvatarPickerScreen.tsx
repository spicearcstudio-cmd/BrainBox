import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet, SafeAreaView, ScrollView, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { AVATARS, getPlayerProfile, setAvatar, setPlayerName } from '../services/avatarManager';
import GameHeader from '../components/shared/GameHeader';

interface Props {
  onBack: () => void;
}

export default function AvatarPickerScreen({ onBack }: Props) {
  const { theme: t } = useTheme();
  const [selected, setSelected] = useState('\uD83D\uDE0E');
  const [name, setName] = useState('Player');

  useEffect(() => {
    getPlayerProfile().then(p => {
      setSelected(p.avatar);
      setName(p.name);
    });
  }, []);

  const handleSave = async () => {
    await setAvatar(selected);
    await setPlayerName(name);
    onBack();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      <GameHeader title="Your Profile" onBack={onBack} showConfirmOnBack={false} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.preview, { backgroundColor: t.surface, borderColor: t.cardBorder }]}>
          <Text style={styles.previewEmoji}>{selected}</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={[styles.nameInput, { color: t.text, borderColor: t.cardBorder }]}
            placeholder="Your name"
            placeholderTextColor={t.textSec}
            maxLength={20}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: t.textSec }]}>CHOOSE YOUR AVATAR</Text>

        <View style={styles.grid}>
          {AVATARS.map((emoji, i) => (
            <Pressable
              key={i}
              onPress={() => setSelected(emoji)}
              style={[
                styles.avatarBtn,
                {
                  backgroundColor: selected === emoji ? t.accent + '20' : t.surface,
                  borderColor: selected === emoji ? t.accent : t.cardBorder,
                },
              ]}
            >
              <Text style={styles.avatarEmoji}>{emoji}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={handleSave}
          style={({ pressed }) => [styles.saveBtn, { backgroundColor: t.accent, opacity: pressed ? 0.85 : 1 }]}
        >
          <Text style={styles.saveBtnText}>Save Profile</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 20, alignItems: 'center' },
  preview: { alignItems: 'center', padding: 24, borderRadius: 24, borderWidth: 2, borderStyle: 'dashed' as any, width: '100%', marginBottom: 24 },
  previewEmoji: { fontSize: 64, marginBottom: 12 },
  nameInput: { fontSize: 20, fontWeight: '800', textAlign: 'center', borderBottomWidth: 2, borderStyle: 'dashed' as any, paddingBottom: 6, minWidth: 180 },
  sectionTitle: { fontSize: 12, fontWeight: '800', letterSpacing: 3, marginBottom: 16, alignSelf: 'flex-start' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 30 },
  avatarBtn: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderStyle: 'dashed' as any },
  avatarEmoji: { fontSize: 28 },
  saveBtn: { paddingVertical: 16, paddingHorizontal: 60, borderRadius: 22 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
