import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useData } from '../utils/DataContext';
import { Card, ProgressBar } from '../components/UI';
import { colors, spacing } from '../utils/theme';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function JourneyScreen() {
  const { weekSessions, profile } = useData();

  const maxMinutes = Math.max(1, ...weekSessions.map((s) => s.minutes || 0));
  const goalClarity = Math.min(100, (profile.streak ?? 0) * 12);
  const consistency = Math.min(100, weekSessions.length * 15);
  const reflectionRate = weekSessions.length
    ? Math.round((weekSessions.filter((s) => s.reflection).length / weekSessions.length) * 100)
    : 0;
  // Agency: seberapa sering user menyelesaikan aksi (praktik) setelah menetapkan intention,
  // menggambarkan rasa kendali/pilihan atas tindakan sendiri.
  const agency = Math.min(100, Math.round(((profile.score ?? 0) / 100) * 100));

  return (
    <ScrollView style={styles.flex} contentContainerStyle={{ padding: spacing.lg }}>
      <Text style={styles.h1}>My Journey</Text>
      <Text style={styles.sub}>Your progress is more than minutes. It is the way your intentions become actions.</Text>

      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Text style={styles.cardTitle}>Goal clarity</Text>
          <Text style={styles.stat}>{goalClarity}%</Text>
          <ProgressBar percent={goalClarity} />
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.cardTitle}>Consistency</Text>
          <Text style={styles.stat}>{consistency}%</Text>
          <ProgressBar percent={consistency} />
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.cardTitle}>Reflection</Text>
          <Text style={styles.stat}>{reflectionRate}%</Text>
          <ProgressBar percent={reflectionRate} />
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.cardTitle}>Agency</Text>
          <Text style={styles.stat}>{agency}%</Text>
          <ProgressBar percent={agency} />
        </Card>
      </View>

      <Card>
        <Text style={styles.cardTitle}>Speaking practice this week</Text>
        {weekSessions.length === 0 ? (
          <Text style={styles.muted}>Belum ada sesi latihan minggu ini.</Text>
        ) : (
          <View style={styles.chart}>
            {weekSessions.map((s) => {
              const dayLabel = s.date ? DAY_LABELS[new Date(s.date).getDay()] : '-';
              const heightPct = Math.max(8, ((s.minutes || 0) / maxMinutes) * 100);
              return (
                <View key={s.id} style={styles.barWrap}>
                  <View style={[styles.bar, { height: `${heightPct}%` }]} />
                  <Text style={styles.barLabel}>{dayLabel}</Text>
                </View>
              );
            })}
          </View>
        )}
      </Card>

      <Card>
        <Text style={styles.cardTitle}>🌱 You are becoming more intentional.</Text>
        <Text style={styles.muted}>
          Your goals are getting more specific, and your reflections increasingly explain how you adapt.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  h1: { fontSize: 24, fontWeight: '800', color: colors.ink },
  sub: { color: colors.muted, marginTop: 4, marginBottom: spacing.lg },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'space-between' },
  statCard: { width: '48%' },
  cardTitle: { fontSize: 14, fontWeight: '700', color: colors.ink, marginBottom: 4 },
  stat: { fontSize: 24, fontWeight: '800', color: colors.ink, marginBottom: 4 },
  muted: { color: colors.muted, fontSize: 13 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', height: 140, marginTop: spacing.sm, gap: 8 },
  barWrap: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  bar: { width: '100%', backgroundColor: '#9db49f', borderRadius: 6, minHeight: 10 },
  barLabel: { fontSize: 10, color: colors.muted, marginTop: 4 },
});
