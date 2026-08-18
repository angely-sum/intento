import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { useData } from '../utils/DataContext';
import { Card, Chip, PrimaryButton } from '../components/UI';
import { colors, spacing } from '../utils/theme';

const OBSTACLES = ['Time', 'Nervousness', 'No partner', 'Motivation'];

export default function JournalScreen({ navigation }) {
  const { todayEntry, profile, saveJournalEntry } = useData();
  const [goal, setGoal] = useState('');
  const [why, setWhy] = useState('');
  const [action, setAction] = useState('');
  const [obstacles, setObstacles] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (todayEntry) {
      setGoal(todayEntry.goal || '');
      setWhy(todayEntry.why || '');
      setAction(todayEntry.action || '');
      setObstacles(todayEntry.obstacles || []);
    }
  }, [todayEntry]);

  const toggleObstacle = (label) => {
    setObstacles((prev) =>
      prev.includes(label) ? prev.filter((o) => o !== label) : [...prev, label]
    );
  };

  const handleSave = async () => {
    if (!goal.trim()) {
      Alert.alert('Lengkapi dulu', 'Tulis intention (goal) hari ini.');
      return;
    }
    setSaving(true);
    try {
      await saveJournalEntry({ goal: goal.trim(), why: why.trim(), action: action.trim(), obstacles });
      navigation.navigate('Home');
    } catch (e) {
      Alert.alert('Gagal menyimpan', 'Coba lagi sebentar lagi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.flex} contentContainerStyle={{ padding: spacing.lg }}>
      <Text style={styles.h1}>Daily Intentionality Journal</Text>
      <Text style={styles.sub}>Pause. Notice. Intend. Act.</Text>

      <Card>
        <View style={styles.question}>
          <Text style={styles.label}>1. What do you want to achieve today?</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Speak for 10 minutes about something I enjoy."
            value={goal}
            onChangeText={setGoal}
            multiline
          />
        </View>
        <View style={styles.question}>
          <Text style={styles.label}>2. Why does this matter to you?</Text>
          <TextInput
            style={styles.input}
            placeholder="Connect the goal to something meaningful."
            value={why}
            onChangeText={setWhy}
            multiline
          />
        </View>
        <View style={styles.question}>
          <Text style={styles.label}>3. What will you actually do?</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. record a 2-minute monologue after dinner."
            value={action}
            onChangeText={setAction}
            multiline
          />
        </View>
        <View style={styles.question}>
          <Text style={styles.label}>4. What might get in your way?</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
            {OBSTACLES.map((label) => (
              <Chip
                key={label}
                label={label}
                selected={obstacles.includes(label)}
                onPress={() => toggleObstacle(label)}
              />
            ))}
          </View>
        </View>
        <PrimaryButton title={saving ? 'Menyimpan...' : "Save today's intention"} onPress={handleSave} disabled={saving} />
      </Card>

      <Card>
        <Text style={styles.cardTitle}>💡 Intento reflection</Text>
        <Text style={styles.muted}>
          Your intention is stronger when it is specific, meaningful, and connected to an action.
        </Text>
        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            Try turning "I want to improve my speaking" into "I will record myself speaking for 5 minutes after dinner."
          </Text>
        </View>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Your streak</Text>
        <Text style={styles.stat}>{profile.streak ?? 0} days 🔥</Text>
        <Text style={styles.muted}>Keep the intention → action → reflection loop going.</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  h1: { fontSize: 24, fontWeight: '800', color: colors.ink },
  sub: { color: colors.muted, marginTop: 4, marginBottom: spacing.lg },
  question: { paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.line },
  label: { fontWeight: '700', color: colors.ink, marginBottom: 8 },
  input: {
    borderWidth: 1, borderColor: colors.line, borderRadius: 12, padding: 12,
    backgroundColor: '#fbfcfa', color: colors.ink, minHeight: 60, textAlignVertical: 'top',
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.ink, marginBottom: 4 },
  muted: { color: colors.muted, fontSize: 13 },
  notice: { backgroundColor: colors.warm, borderRadius: 14, padding: spacing.sm, marginTop: spacing.sm },
  noticeText: { fontSize: 13, lineHeight: 20, color: '#655b4a' },
  stat: { fontSize: 26, fontWeight: '800', color: colors.ink, marginVertical: 6 },
});
