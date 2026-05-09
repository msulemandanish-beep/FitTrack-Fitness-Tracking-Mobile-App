import React, { useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../assets/theme';

const { width } = Dimensions.get('window');

const BMI_RANGES = [
  { label: 'UNDERWEIGHT', range: '< 18.5', min: 0, max: 18.5, color: '#4A90D9', verdict: 'Train harder. Eat more. You need mass.' },
  { label: 'OPTIMAL', range: '18.5 – 24.9', min: 18.5, max: 24.9, color: COLORS.oliveLight, verdict: 'Solid baseline. Now build the armor.' },
  { label: 'OVERWEIGHT', range: '25 – 29.9', min: 25, max: 29.9, color: COLORS.primary, verdict: 'Cut the excess. Reveal the weapon.' },
  { label: 'OBESE', range: '≥ 30', min: 30, max: 999, color: COLORS.crimsonLight, verdict: 'Weakness exposed. Time to change everything.' },
];

export default function BMICalculatorScreen({ navigation }) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (!w || !h || h <= 0) return;
    const result = w / (h * h);
    setBmi(result.toFixed(1));
    const cat = BMI_RANGES.find((r) => result >= r.min && result < r.max);
    setCategory(cat || BMI_RANGES[BMI_RANGES.length - 1]);
  };

  const reset = () => {
    setWeight('');
    setHeight('');
    setBmi(null);
    setCategory(null);
  };

  // Calculate needle position for gauge (0-100 mapped to 10-50 BMI range)
  const getNeedleAngle = () => {
    if (!bmi) return -90;
    const clamped = Math.max(10, Math.min(50, parseFloat(bmi)));
    return -90 + ((clamped - 10) / 40) * 180;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>

    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={['#001020', '#0A0A0A']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerSub}>BODY ASSESSMENT</Text>
        <Text style={styles.headerTitle}>BMI CALCULATOR</Text>
        <Text style={styles.headerDesc}>No hiding from the numbers. Know your status.</Text>
      </LinearGradient>

      {/* Inputs */}
      <View style={styles.inputSection}>
        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>WEIGHT</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                placeholder="80"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="numeric"
              />
              <Text style={styles.unit}>KG</Text>
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>HEIGHT</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={height}
                onChangeText={setHeight}
                placeholder="180"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="numeric"
              />
              <Text style={styles.unit}>CM</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.calcButton} onPress={calculate} activeOpacity={0.85}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            style={styles.calcGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.calcButtonText}>ASSESS STATUS</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* BMI Result */}
      {bmi && category && (
        <View style={styles.resultSection}>
          {/* Big BMI number */}
          <View style={styles.bmiDisplay}>
            <Text style={styles.bmiLabel}>YOUR BMI</Text>
            <Text style={[styles.bmiNumber, { color: category.color }]}>{bmi}</Text>
            <View style={[styles.categoryBadge, { backgroundColor: category.color + '22', borderColor: category.color + '55' }]}>
              <Text style={[styles.categoryLabel, { color: category.color }]}>{category.label}</Text>
            </View>
          </View>

          {/* Verdict */}
          <View style={styles.verdictCard}>
            <Ionicons name="alert-circle" size={18} color={category.color} />
            <Text style={[styles.verdictText, { color: category.color }]}>{category.verdict}</Text>
          </View>

          {/* BMI Scale */}
          <Text style={styles.scaleTitle}>BMI SCALE</Text>
          <View style={styles.scaleBar}>
            {BMI_RANGES.map((r, i) => (
              <View key={i} style={[styles.scaleSegment, { backgroundColor: r.color + (category.label === r.label ? 'FF' : '44') }]}>
                <Text style={styles.scaleRangeText}>{r.range}</Text>
                <Text style={styles.scaleLabelText}>{r.label}</Text>
              </View>
            ))}
          </View>

          {/* Info Cards */}
          <View style={styles.infoGrid}>
            {[
              { label: 'HEALTHY WEIGHT', value: `${(18.5 * (parseFloat(height) / 100) ** 2).toFixed(1)} – ${(24.9 * (parseFloat(height) / 100) ** 2).toFixed(1)} kg` },
              { label: 'CURRENT STATUS', value: category.label },
              { label: 'YOUR BMI', value: bmi },
              { label: 'TARGET BMI', value: '18.5 – 24.9' },
            ].map((item) => (
              <View key={item.label} style={styles.infoCard}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.resetButton} onPress={reset}>
            <Text style={styles.resetText}>RECALCULATE</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* BMI Info */}
      {!bmi && (
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>WHAT IS BMI?</Text>
          <Text style={styles.infoDescription}>
            Body Mass Index (BMI) is a screening tool that measures body fat using height and weight.
            It's not perfect, but it's a useful starting point for assessing your physical status.
          </Text>
          <View style={styles.rangeList}>
            {BMI_RANGES.map((r, i) => (
              <View key={i} style={styles.rangeItem}>
                <View style={[styles.rangeDot, { backgroundColor: r.color }]} />
                <Text style={styles.rangeLabel}>{r.label}</Text>
                <Text style={styles.rangeValue}>{r.range}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
    </SafeAreaView>

  );

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: SPACING.xxl },
  header: { paddingHorizontal: SPACING.xl, paddingTop: 60, paddingBottom: SPACING.xl },
  backButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.card + 'CC',
    alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md,
  },
  headerSub: { fontSize: 11, fontWeight: '700', color: '#4A90D9', letterSpacing: 4, marginBottom: 4 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: COLORS.textPrimary, letterSpacing: 4 },
  headerDesc: { fontSize: 13, color: COLORS.textMuted, marginTop: 4 },
  inputSection: { padding: SPACING.xl, gap: SPACING.md },
  inputRow: { flexDirection: 'row', gap: SPACING.md },
  inputGroup: { flex: 1, gap: SPACING.xs },
  label: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 2 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.card, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.cardBorder,
    paddingHorizontal: SPACING.md, paddingVertical: 14,
  },
  input: { flex: 1, color: COLORS.textPrimary, fontSize: 18, fontWeight: '700' },
  unit: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 1 },
  calcButton: { borderRadius: RADIUS.md, overflow: 'hidden' },
  calcGradient: { alignItems: 'center', justifyContent: 'center', paddingVertical: 16 },
  calcButtonText: { color: '#0A0A0A', fontSize: 15, fontWeight: '800', letterSpacing: 3 },
  resultSection: { paddingHorizontal: SPACING.xl, gap: SPACING.lg },
  bmiDisplay: { alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.lg },
  bmiLabel: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 4 },
  bmiNumber: { fontSize: 72, fontWeight: '900', lineHeight: 80 },
  categoryBadge: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: RADIUS.full, borderWidth: 1 },
  categoryLabel: { fontSize: 13, fontWeight: '800', letterSpacing: 3 },
  verdictCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm,
    backgroundColor: COLORS.card, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.cardBorder, padding: SPACING.md,
  },
  verdictText: { flex: 1, fontSize: 14, fontWeight: '700', lineHeight: 22, fontStyle: 'italic' },
  scaleTitle: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 3 },
  scaleBar: { flexDirection: 'row', borderRadius: RADIUS.sm, overflow: 'hidden', height: 56 },
  scaleSegment: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 4 },
  scaleRangeText: { fontSize: 8, color: '#0A0A0A', fontWeight: '700' },
  scaleLabelText: { fontSize: 7, color: '#0A0A0A', fontWeight: '700' },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  infoCard: {
    flex: 1, minWidth: '45%', backgroundColor: COLORS.card,
    borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.cardBorder,
    padding: SPACING.md, gap: 4,
  },
  infoLabel: { fontSize: 10, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 1.5 },
  infoValue: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary },
  resetButton: {
    borderWidth: 1, borderColor: COLORS.cardBorder, borderRadius: RADIUS.md,
    paddingVertical: 14, alignItems: 'center',
  },
  resetText: { color: COLORS.textMuted, fontSize: 13, fontWeight: '700', letterSpacing: 2 },
  infoSection: { paddingHorizontal: SPACING.xl, gap: SPACING.md },
  infoTitle: { fontSize: 13, fontWeight: '800', color: COLORS.primary, letterSpacing: 3 },
  infoDescription: { fontSize: 13, color: COLORS.textMuted, lineHeight: 22 },
  rangeList: { gap: SPACING.sm },
  rangeItem: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.card, borderRadius: RADIUS.sm, padding: SPACING.md,
    borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  rangeDot: { width: 10, height: 10, borderRadius: 5 },
  rangeLabel: { flex: 1, fontSize: 12, fontWeight: '700', color: COLORS.textSecondary, letterSpacing: 1 },
  rangeValue: { fontSize: 12, color: COLORS.textMuted },
});
