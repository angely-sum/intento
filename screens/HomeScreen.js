import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../utils/AuthContext';
import { useData } from '../utils/DataContext';
import { Card, Badge, ProgressBar, PrimaryButton } from '../components/UI';
import { colors, spacing } from '../utils/theme';
import { formatHourMinute } from '../utils/reminders';

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { profile, todayEntry, todayPractice, interactionCount, saveReminderSettings } = useData();
  const [showPicker, setShowPicker] = useState(false);
  const [savingReminder, setSavingReminder] = useState(false);

  const firstName = (profile.name || user?.displayName || 'there').split(' ')[0];
  const hour = new Date().getHours();
  const greeting = hour < 11 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const practiceMinutes = todayPractice?.minutes || 0;
  const practicePercent = Math.min(100, (practiceMinutes / 10) * 100);
  const reflectionPercent = todayPractice ? 100 : todayEntry ? 25 : 0;
  const interactionPercent = Math.min(100, interactionCount * 20);

  const reminderHour = profile.reminderHour ?? 19;
  const reminderMinute = profile.reminderMinute ?? 0;
  const reminderEnabled = profile.reminderEnabled ?? true;

  const toggleReminder = async () => {
    setSavingReminder(true);
    try {
      await saveReminderSettings({ enabled: !reminderEnabled, hour: reminderHour, minute: reminderMinute });
    } finally {
      setSavingReminder(false);
    }
  };

  const onTimeChange = async (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios');
    if (event.type === 'dismissed' || !selectedDate) return;
    const h = selectedDate.getHours();
    const m = selectedDate.getMinutes();
    setSavingReminder(true);
    try {
      await saveReminderSettings({ enabled: true, hour: h, minute: m });
    } finally {
      setSavingReminder(false);
    }
  };

  const pickerValue = new Date();
  pickerValue.setHours(reminderHour, reminderMinute, 0, 0);

  return (
    <ScrollView style={styles.flex} contentContainerStyle={{ padding: spacing.lg }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.h1}>{greeting}, {firstName} 👋</Text>
          <Text style={styles.sub}>Let's make your intention visible today.</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.hero}>
        <View style={{ flex: 1 }}>
          <Badge>TODAY'S INTENTION</Badge>
          <Text style={styles.heroGoal}>
            {todayEntry?.goal || 'Set an intention for today in your journal.'}
          </Text>
          <Text style={styles.heroDesc}>
            Your intention becomes meaningful when it turns into action. Ready to practice?
          </Text>
          <PrimaryButton title="Start speaking →" onPress={() => navigation.navigate('Practice')} />
          <View style={styles.miniRow}>
            <View style={styles.miniBox}>
              <Text style={styles.miniStat}>{profile.score ?? 0}</Text>
              <Text style={styles.miniLabel}>intentionality</Text>
            </View>
            <View style={styles.miniBox}>
              <Text style={styles.miniStat}>{profile.streak ?? 0} 🔥</Text>
              <Text style={styles.miniLabel}>day streak</Text>
            </View>
            <View style={styles.miniBox}>
              <Text style={styles.miniStat}>{practiceMinutes}/10</Text>
              <Text style={styles.miniLabel}>minutes</Text>
            </View>
          </View>
        </View>
      </View>

      <Card style={{ backgroundColor: '#edf4eb' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>⏰ Daily speaking reminder</Text>
            <Text style={styles.muted}>Keep your intention alive with a gentle daily reminder.</Text>
          </View>
          <TouchableOpacity
            onPress={toggleReminder}
            disabled={savingReminder}
            style={[styles.toggleBtn, { backgroundColor: reminderEnabled ? colors.accent : '#8a9189' }]}
          >
            <Text style={styles.toggleBtnText}>{reminderEnabled ? 'On ✓' : 'Off'}</Text>
          </TouchableOpacity>
        </View>

        {reminderEnabled && (
          <View style={{ marginTop: spacing.sm }}>
            <TouchableOpacity style={styles.timeInput} onPress={() => setShowPicker(true)}>
              <Text style={styles.timeInputText}>{formatHourMinute(reminderHour, reminderMinute)}</Text>
            </TouchableOpacity>
            <Text style={[styles.muted, { marginTop: spacing.sm }]}>
              You'll be reminded every day at {formatHourMinute(reminderHour, reminderMinute)}.
            </Text>
          </View>
        )}

        {showPicker && (
          <DateTimePicker
            value={pickerValue}
            mode="time"
            is24Hour={false}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onTimeChange}
          />
        )}
      </Card>

      <Text style={styles.sectionTitle}>Today at a glance</Text>

      <View style={styles.grid}>
        <Card style={styles.gridCard}>
          <Text style={styles.cardTitle}>🎯 Intention</Text>
          <ProgressBar percent={todayEntry ? 100 : 0} />
          <Text style={styles.muted}>{todayEntry ? 'Set ✓' : 'Not set'}</Text>
        </Card>

        <Card style={styles.gridCard}>
          <Text style={styles.cardTitle}>🎙️ Speaking</Text>
          <ProgressBar percent={practicePercent} />
          <Text style={styles.muted}>{practiceMinutes} min</Text>
        </Card>

        <Card style={styles.gridCard}>
          <Text style={styles.cardTitle}>✍️ Reflection</Text>
          <ProgressBar percent={reflectionPercent} />
          <Text style={styles.muted}>
            {todayPractice ? 'Completed ✓' : todayEntry ? 'Intention saved ✓' : 'Not yet'}
          </Text>
        </Card>

        <Card style={styles.gridCard}>
          <Text style={styles.cardTitle}>💬 Interaction</Text>
          <ProgressBar percent={interactionPercent} />
          <Text style={styles.muted}>{interactionCount} activities</Text>
        </Card>
      </View>

      <Text style={styles.sectionTitle}>Your recent pattern</Text>
      <Card>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontSize: 20, marginRight: spacing.sm }}>✦</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.insightTitle}>Specific goals help you act.</Text>
            <Text style={styles.muted}>
              Streak so far: {profile.streak ?? 0} day{(profile.streak ?? 0) === 1 ? '' : 's'} of journaling.
            </Text>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  h1: { fontSize: 26, fontWeight: '800', color: colors.ink, letterSpacing: -0.5 },
  sub: { color: colors.muted, marginTop: 4, marginBottom: spacing.lg },
  hero: {
    backgroundColor: colors.accent2, borderRadius: 24,
    padding: spacing.lg, marginBottom: spacing.md,
  },
  heroGoal: { fontSize: 18, fontWeight: '700', color: colors.ink, marginTop: 10, marginBottom: 8 },
  heroDesc: { color: '#586258', marginBottom: spacing.md },
  miniRow: { flexDirection: 'row', gap: spacing.xs, marginTop: spacing.md },
  miniBox: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 13,
    padding: spacing.sm, alignItems: 'center',
  },
  miniStat: { fontSize: 16, fontWeight: '800', color: colors.ink },
  miniLabel: { fontSize: 9, color: colors.muted, marginTop: 2, textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.ink, marginTop: spacing.md, marginBottom: spacing.sm },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.ink, marginBottom: 4 },
  muted: { color: colors.muted, fontSize: 13 },
  insightTitle: { fontWeight: '700', color: colors.ink, marginBottom: 2 },
  logoutBtn: { paddingVertical: 6, paddingHorizontal: 10 },
  logoutText: { color: colors.muted, fontSize: 12, fontWeight: '600' },
  toggleBtn: { paddingVertical: 9, paddingHorizontal: 12, borderRadius: 12 },
  toggleBtnText: { color: colors.white, fontWeight: '700', fontSize: 12 },
  timeInput: {
    borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white,
    borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, alignSelf: 'flex-start',
  },
  timeInputText: { color: colors.ink, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'space-between' },
  gridCard: { width: '48%' },
});
