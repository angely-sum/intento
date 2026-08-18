import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, radius } from '../utils/theme';

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Badge({ children }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{children}</Text>
    </View>
  );
}

export function ProgressBar({ percent = 0 }) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${clamped}%` }]} />
    </View>
  );
}

export function PrimaryButton({ title, onPress, small, disabled, secondary }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.btn,
        secondary && styles.btnSecondary,
        small && styles.btnSmall,
        disabled && { opacity: 0.5 },
      ]}
    >
      <Text style={[styles.btnText, secondary && styles.btnTextSecondary]}>{title}</Text>
    </TouchableOpacity>
  );
}

export function Chip({ label, selected, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.chip, selected && styles.chipSelected]}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: spacing.md,
  },
  badge: {
    backgroundColor: colors.warm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#6d604c', letterSpacing: 0.5 },
  progressTrack: {
    height: 8, backgroundColor: '#edf0eb', borderRadius: radius.pill,
    overflow: 'hidden', marginVertical: spacing.sm,
  },
  progressFill: { height: '100%', backgroundColor: colors.accent, borderRadius: radius.pill },
  btn: {
    backgroundColor: colors.accent, borderRadius: radius.md,
    paddingVertical: 13, paddingHorizontal: spacing.md, alignItems: 'center',
  },
  btnSmall: { paddingVertical: 9, paddingHorizontal: spacing.sm },
  btnSecondary: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  btnText: { color: colors.white, fontWeight: '700' },
  btnTextSecondary: { color: colors.accent },
  chip: {
    borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white,
    borderRadius: radius.pill, paddingVertical: 8, paddingHorizontal: spacing.sm,
    marginRight: spacing.xs, marginBottom: spacing.xs,
  },
  chipSelected: { backgroundColor: colors.accent2, borderColor: '#b8cdb4' },
  chipText: { fontSize: 13, color: colors.ink },
  chipTextSelected: { color: '#3f5d45', fontWeight: '600' },
});
