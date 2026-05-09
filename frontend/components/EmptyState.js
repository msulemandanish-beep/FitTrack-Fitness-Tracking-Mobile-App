import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../assets/theme';

export default function EmptyState({ icon = 'barbell-outline', title, subtitle }) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={52} color={COLORS.textMuted} />
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
    gap: SPACING.sm,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 2,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: SPACING.xl,
  },
});
