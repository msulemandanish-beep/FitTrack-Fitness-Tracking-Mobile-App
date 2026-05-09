import React, { useState, useEffect } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { waterService } from '../services/services';
import { COLORS, SPACING, RADIUS } from '../assets/theme';

const { width } = Dimensions.get('window');

const QUICK_AMOUNTS = [150, 250, 350, 500];

export default function WaterTrackerScreen({ navigation }) {
  const [water, setWater] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadWater();
  }, []);

  const loadWater = async () => {
    try {
      const res = await waterService.getToday();
      setWater(res.data);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const addWater = async (amount) => {
    setAdding(true);
    try {
      const res = await waterService.add(amount);
      setWater(res.data);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setAdding(false);
    }
  };

  const resetWater = async () => {
    Alert.alert('Reset Intake', 'Clear today\'s hydration log?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'RESET',
        style: 'destructive',
        onPress: async () => {
          await waterService.reset();
          loadWater();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90D9" />
        </View>
      </SafeAreaView>
    );
  }

  const percent = water ? Math.min((water.intakeMl / water.goalMl) * 100, 100) : 0;
  const remaining = water ? Math.max(water.goalMl - water.intakeMl, 0) : 0;
  const cupsFilled = water ? Math.floor(water.intakeMl / 250) : 0;
  const totalCups = water ? Math.ceil(water.goalMl / 250) : 10;

  const getHydrationStatus = () => {
    if (percent >= 100) return { text: 'MISSION COMPLETE — FULLY HYDRATED', color: COLORS.oliveLight };
    if (percent >= 75) return { text: 'STRONG — ALMOST THERE', color: COLORS.primary };
    if (percent >= 50) return { text: 'HALFWAY — DON\'T STOP NOW', color: '#4A90D9' };
    if (percent >= 25) return { text: 'WEAK — DRINK MORE', color: COLORS.warning };
    return { text: 'CRITICAL — HYDRATE NOW', color: COLORS.crimsonLight };
  };

  const status = getHydrationStatus();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={['#001020', '#0A0A0A']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerSub}>DAILY PROTOCOL</Text>
        <Text style={styles.headerTitle}>HYDRATION</Text>
      </LinearGradient>

      {/* Big Circular Progress */}
      <View style={styles.circleSection}>
        <View style={styles.circleContainer}>
          {/* Outer ring */}
          <View style={styles.outerRing}>
            <View style={styles.innerCircle}>
              <Ionicons name="water" size={32} color="#4A90D9" />
              <Text style={styles.circleValue}>{water?.intakeMl || 0}</Text>
              <Text style={styles.circleUnit}>ml consumed</Text>
            </View>
          </View>
          {/* Progress Arc (visual approximation with colored border) */}
          <View style={[styles.progressArc, { borderTopColor: '#4A90D9', borderRightColor: percent > 25 ? '#4A90D9' : COLORS.cardBorder, borderBottomColor: percent > 50 ? '#4A90D9' : COLORS.cardBorder, borderLeftColor: percent > 75 ? '#4A90D9' : COLORS.cardBorder }]} />
        </View>

        <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
        <Text style={styles.remainingText}>
          {remaining > 0 ? `${remaining}ml remaining` : 'Daily goal achieved!'}
        </Text>
        <Text style={styles.percentText}>{Math.round(percent)}%</Text>
      </View>

      {/* Cups visualization */}
      <View style={styles.cupsSection}>
        <Text style={styles.sectionLabel}>HYDRATION CUPS (250ml each)</Text>
        <View style={styles.cupsGrid}>
          {Array.from({ length: totalCups }).map((_, i) => (
            <View
              key={i}
              style={[styles.cup, i < cupsFilled && styles.cupFilled]}
            >
              <Ionicons
                name={i < cupsFilled ? 'water' : 'water-outline'}
                size={20}
                color={i < cupsFilled ? '#4A90D9' : COLORS.cardBorder}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Quick Add Buttons */}
      <View style={styles.quickAddSection}>
        <Text style={styles.sectionLabel}>QUICK ADD</Text>
        <View style={styles.quickAddGrid}>
          {QUICK_AMOUNTS.map((amount) => (
            <TouchableOpacity
              key={amount}
              style={styles.quickAddButton}
              onPress={() => addWater(amount)}
              disabled={adding}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle" size={20} color="#4A90D9" />
              <Text style={styles.quickAddText}>{amount}ml</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Today's Log */}
      {water?.logs?.length > 0 && (
        <View style={styles.logSection}>
          <Text style={styles.sectionLabel}>TODAY'S LOG</Text>
          {water.logs.slice(-8).reverse().map((log, i) => (
            <View key={i} style={styles.logItem}>
              <Ionicons name="water" size={14} color="#4A90D9" />
              <Text style={styles.logAmount}>+{log.amount}ml</Text>
              <Text style={styles.logTime}>
                {new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{water?.goalMl || 2500}</Text>
          <Text style={styles.statLabel}>DAILY GOAL (ML)</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{water?.logs?.length || 0}</Text>
          <Text style={styles.statLabel}>LOG ENTRIES</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{Math.round(percent)}%</Text>
          <Text style={styles.statLabel}>COMPLETED</Text>
        </View>
      </View>

      {/* Reset */}
      <TouchableOpacity style={styles.resetButton} onPress={resetWater}>
        <Text style={styles.resetText}>RESET TODAY'S INTAKE</Text>
      </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: SPACING.xxl },
  loadingContainer: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' },
  header: { paddingHorizontal: SPACING.xl, paddingTop: 60, paddingBottom: SPACING.xl },
  backButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.card + 'CC',
    alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md,
  },
  headerSub: { fontSize: 11, fontWeight: '700', color: '#4A90D9', letterSpacing: 4, marginBottom: 4 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: COLORS.textPrimary, letterSpacing: 4 },
  circleSection: { alignItems: 'center', paddingVertical: SPACING.xl, gap: SPACING.sm },
  circleContainer: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  outerRing: {
    width: 160, height: 160, borderRadius: 80,
    borderWidth: 4, borderColor: COLORS.cardBorder,
    backgroundColor: COLORS.card, alignItems: 'center', justifyContent: 'center',
  },
  innerCircle: { alignItems: 'center', gap: 4 },
  circleValue: { fontSize: 28, fontWeight: '900', color: '#4A90D9' },
  circleUnit: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600' },
  progressArc: {
    position: 'absolute', width: 172, height: 172, borderRadius: 86,
    borderWidth: 4, borderColor: COLORS.cardBorder,
  },
  statusText: { fontSize: 12, fontWeight: '800', letterSpacing: 2, textAlign: 'center' },
  remainingText: { fontSize: 13, color: COLORS.textMuted },
  percentText: { fontSize: 36, fontWeight: '900', color: '#4A90D9' },
  cupsSection: { paddingHorizontal: SPACING.xl, gap: SPACING.sm, marginBottom: SPACING.md },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 3 },
  cupsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  cup: {
    width: 40, height: 40, borderRadius: RADIUS.sm,
    backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.cardBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  cupFilled: { backgroundColor: '#001020', borderColor: '#4A90D944' },
  quickAddSection: { paddingHorizontal: SPACING.xl, gap: SPACING.sm, marginBottom: SPACING.lg },
  quickAddGrid: { flexDirection: 'row', gap: SPACING.sm },
  quickAddButton: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    backgroundColor: COLORS.card, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: '#4A90D933',
    paddingVertical: SPACING.md,
  },
  quickAddText: { fontSize: 12, fontWeight: '700', color: '#4A90D9' },
  logSection: { paddingHorizontal: SPACING.xl, gap: SPACING.sm, marginBottom: SPACING.lg },
  logItem: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.card, borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  logAmount: { flex: 1, fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  logTime: { fontSize: 11, color: COLORS.textMuted },
  statsRow: { flexDirection: 'row', gap: SPACING.sm, paddingHorizontal: SPACING.xl, marginBottom: SPACING.lg },
  statCard: {
    flex: 1, backgroundColor: COLORS.card, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.cardBorder,
    padding: SPACING.md, alignItems: 'center', gap: 4,
  },
  statValue: { fontSize: 18, fontWeight: '900', color: '#4A90D9' },
  statLabel: { fontSize: 9, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 1, textAlign: 'center' },
  resetButton: {
    marginHorizontal: SPACING.xl, borderWidth: 1, borderColor: COLORS.crimson + '44',
    borderRadius: RADIUS.md, paddingVertical: 14, alignItems: 'center',
  },
  resetText: { color: COLORS.crimson, fontSize: 12, fontWeight: '700', letterSpacing: 2 },
});
