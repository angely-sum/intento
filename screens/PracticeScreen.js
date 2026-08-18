import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { useData } from '../utils/DataContext';
import { Card, Badge, PrimaryButton } from '../components/UI';
import { colors, spacing } from '../utils/theme';

function formatTime(totalSeconds) {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export default function PracticeScreen({ navigation }) {
  const { savePracticeSession } = useData();
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [reflection, setReflection] = useState('');
  const [saving, setSaving] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [running]);

  const toggleTimer = () => setRunning((r) => !r);

  const handleFinish = async () => {
    if (seconds < 5) {
      Alert.alert('Belum cukup', 'Latihan minimal beberapa detik sebelum diselesaikan.');
      return;
    }
    setRunning(false);
    setSaving(true);
    try {
      await savePracticeSession({ seconds, reflection: reflection.trim() });
      navigation.navigate('Home');
    } catch (e) {
      Alert.alert('Gagal menyimpan', 'Coba lagi sebentar lagi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.flex} contentContainerStyle={{ padding: spacing.lg }}>
      <Text style={styles.h1}>Speaking Practice</Text>
      <Text style={styles.sub}>Choose a prompt and turn today's intention into action.</Text>

      <Card>
        <Badge>TODAY'S PROMPT</Badge>
        <View style={styles.topic}>
          <Text style={styles.topicTitle}>Talk about something you genuinely enjoy.</Text>
          <Text style={styles.muted}>Try to speak naturally for 2–10 minutes. Don't restart when you make a mistake.</Text>
        </View>
        <View style={styles.practiceRow}>
          <View>
            <Text style={styles.timer}>{formatTime(seconds)}</Text>
            <Text style={styles.muted}>Practice time</Text>
          </View>
          <PrimaryButton
            title={running ? 'Pause timer' : seconds > 0 ? 'Resume timer' : 'Start timer'}
            onPress={toggleTimer}
          />
        </View>
      </Card>

      <View style={styles.reflection}>
        <Text style={styles.reflTitle}>After practice, pause for a moment.</Text>
        <Text style={styles.muted}>What did you notice about yourself while speaking?</Text>
        <TextInput
          style={styles.input}
          placeholder="I noticed that..."
          value={reflection}
          onChangeText={setReflection}
          multiline
        />
        <PrimaryButton
          title={saving ? 'Menyimpan...' : 'Complete practice'}
          onPress={handleFinish}
          disabled={saving}
          small
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  h1: { fontSize: 24, fontWeight: '800', color: colors.ink },
  sub: { color: colors.muted, marginTop: 4, marginBottom: spacing.lg },
  topic: { backgroundColor: '#f1f4ed', padding: spacing.md, borderRadius: 14, marginVertical: spacing.sm },
  topicTitle: { fontWeight: '700', color: colors.ink, marginBottom: 4 },
  muted: { color: colors.muted, fontSize: 13 },
  practiceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm },
  timer: { fontSize: 34, fontWeight: '800', color: colors.ink, letterSpacing: 1 },
  reflection: { backgroundColor: '#edf4eb', borderRadius: 17, padding: spacing.lg, marginTop: spacing.md },
  reflTitle: { fontWeight: '700', color: colors.ink, marginBottom: 2 },
  input: {
    borderWidth: 1, borderColor: colors.line, borderRadius: 12, padding: 12,
    backgroundColor: '#fbfcfa', color: colors.ink, minHeight: 70, textAlignVertical: 'top',
    marginTop: spacing.sm, marginBottom: spacing.sm,
  },
});
