import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../assets/theme';

export default function StatCard({ label, value, icon, color = COLORS.primary, unit }) {
  return (
    <View style={styles.card}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={[styles.value, { color }]}>
        {value}
        {unit && <Text style={styles.unit}> {unit}</Text>}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: SPACING.md,
    alignItems: 'center',
    gap: SPACING.xs,
  },
  value: {
    fontSize: 24,
    fontWeight: '900',
  },
  unit: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
});
