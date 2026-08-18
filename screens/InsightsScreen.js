import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useData } from '../utils/DataContext';
import { Card, Badge, PrimaryButton } from '../components/UI';
import { colors, spacing } from '../utils/theme';

export default function InsightsScreen({ navigation }) {
  const { weekSessions, todayEntry, profile } = useData();

  const withReflection = weekSessions.filter((s) => s.reflection).length;
  const totalScore = Math.min(100, profile.score ?? 0);
  const persistedDespiteObstacle = weekSessions.length > 0 && !!todayEntry?.obstacles?.length;

  return (
    <ScrollView style={styles.flex} contentContainerStyle={{ padding: spacing.lg }}>
      <Text style={styles.h1}>Intentionality Insights ✦</Text>
      <Text style={styles.sub}>Intento looks for patterns in your goals, actions, and reflections.</Text>

      <Card>
        <Badge>THIS WEEK</Badge>
        <Text style={styles.scoreDisplay}>{totalScore} / 100</Text>
        <Text style={styles.muted}>Your intentionality pattern is becoming more consistent.</Text>
      </Card>

      <Card>
        <View style={styles.insight}>
          <Text style={styles.icon}>🎯</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.insightTitle}>Specificity → action</Text>
            <Text style={styles.muted}>When you name a concrete speaking activity, you are more likely to complete it.</Text>
          </View>
        </View>
        <View style={styles.insight}>
          <Text style={styles.icon}>🧠</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.insightTitle}>Awareness → adaptation</Text>
            <Text style={styles.muted}>
              You've reflected after {withReflection} of {weekSessions.length || 0} recent practice sessions.
            </Text>
          </View>
        </View>
        <View style={styles.insight}>
          <Text style={styles.icon}>🤝</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.insightTitle}>Interaction-seeking</Text>
            <Text style={styles.muted}>
              {todayEntry?.obstacles?.includes('No partner')
                ? "You mentioned looking for a speaking partner. That may be becoming part of your intentional practice strategy."
                : 'Keep journaling so Intento can surface more patterns here.'}
            </Text>
          </View>
        </View>
        <View style={[styles.insight, { borderBottomWidth: 0 }]}>
          <Text style={styles.icon}>↗</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.insightTitle}>Persistence</Text>
            <Text style={styles.muted}>
              {persistedDespiteObstacle
                ? 'You continued practicing despite noting obstacles in your way.'
                : 'Keep practicing through setbacks — Intento will track your persistence here.'}
            </Text>
          </View>
        </View>
      </Card>

      <View style={styles.reflection}>
        <Text style={styles.reflTitle}>Your next small step</Text>
        <Text style={styles.muted}>
          Tomorrow, set one intention that includes what you will practice, when you will do it, and why it matters.
        </Text>
        <View style={{ marginTop: spacing.sm, alignSelf: 'flex-start' }}>
          <PrimaryButton title="Set tomorrow's intention →" onPress={() => navigation.navigate('Journal')} small />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  h1: { fontSize: 24, fontWeight: '800', color: colors.ink },
  sub: { color: colors.muted, marginTop: 4, marginBottom: spacing.lg },
  insight: {
    flexDirection: 'row', gap: spacing.sm, paddingVertical: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: colors.line,
  },
  icon: { fontSize: 20 },
  scoreDisplay: { fontSize: 34, fontWeight: '800', color: colors.ink, marginVertical: 6 },
  insightTitle: { fontWeight: '700', color: colors.ink, marginBottom: 2 },
  muted: { color: colors.muted, fontSize: 13 },
  reflection: { backgroundColor: '#edf4eb', borderRadius: 17, padding: spacing.lg, marginTop: spacing.md },
  reflTitle: { fontWeight: '700', color: colors.ink, fontSize: 16, marginBottom: 4 },
});

My Device
Android
iOS
Web


package.json (11:5) Failed to resolve dependency 'firebase@^10.12.4' (Load failed) Retry
