import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { progressService } from '../services/services';
import { COLORS, SPACING, RADIUS, CATEGORY_CONFIG } from '../assets/theme';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [statsRes, historyRes] = await Promise.all([
        progressService.getStats(),
        progressService.getAll(),
      ]);
      setStats(statsRes.data);
      setHistory(historyRes.data);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const deleteEntry = (id) => {
    Alert.alert('Remove Entry', 'Delete this record from your combat log?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'DELETE',
        style: 'destructive',
        onPress: async () => {
          await progressService.delete(id);
          load();
        },
      },
    ]);
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // Category breakdown for mini bar chart
  const categoryEntries = stats?.categoryBreakdown
    ? Object.entries(stats.categoryBreakdown).sort((a, b) => b[1] - a[1])
    : [];
  const maxCat = categoryEntries.length > 0 ? categoryEntries[0][1] : 1;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
      {/* Header */}
      <LinearGradient colors={['#1A0A0A', '#0A0A0A']} style={styles.header}>
        <Text style={styles.headerSub}>YOUR</Text>
        <Text style={styles.headerTitle}>COMBAT RECORD</Text>
      </LinearGradient>

      {/* Stats Grid */}
      {stats && (
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            {[
              { label: 'TOTAL SESSIONS', value: stats.totalWorkouts, icon: 'barbell', color: COLORS.primary },
              { label: 'TOTAL MINUTES', value: stats.totalMinutes, icon: 'time', color: COLORS.crimsonLight },
              { label: 'CALORIES BURNED', value: stats.totalCalories, icon: 'flame', color: COLORS.primary },
              { label: 'THIS WEEK', value: stats.thisWeekCount, icon: 'calendar', color: COLORS.oliveLight },
            ].map((s) => (
              <View key={s.label} style={styles.statCard}>
                <Ionicons name={s.icon} size={22} color={s.color} />
                <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Category Breakdown */}
      {categoryEntries.length > 0 && (
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>MUSCLE GROUP BREAKDOWN</Text>
          {categoryEntries.map(([cat, count]) => {
            const config = CATEGORY_CONFIG[cat] || {};
            const barWidth = (count / maxCat) * (width - SPACING.xl * 2 - 100);
            return (
              <View key={cat} style={styles.barRow}>
                <Text style={styles.barLabel}>{config.label || cat}</Text>
                <View style={styles.barContainer}>
                  <View style={[styles.barFill, { width: barWidth, backgroundColor: config.color || COLORS.primary }]} />
                </View>
                <Text style={styles.barCount}>{count}</Text>
              </View>
            );
          })}
        </View>
      )}

      {/* History */}
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>RECENT SESSIONS</Text>
        {history.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="barbell-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>NO SESSIONS LOGGED</Text>
            <Text style={styles.emptySubtitle}>Complete a workout to start your combat record</Text>
          </View>
        ) : (
          history.map((entry) => {
            const config = CATEGORY_CONFIG[entry.category] || {};
            return (
              <View key={entry._id} style={styles.historyCard}>
                <View style={styles.historyLeft}>
                  <View style={[styles.historyIcon, { backgroundColor: (config.color || COLORS.primary) + '22' }]}>
                    <Text style={styles.historyEmoji}>{config.emoji || '💪'}</Text>
                  </View>
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyName}>{entry.workoutName}</Text>
                    <Text style={styles.historyDate}>{formatDate(entry.completedAt)}</Text>
                    <View style={styles.historyMeta}>
                      <View style={styles.metaChip}>
                        <Ionicons name="time-outline" size={11} color={COLORS.textMuted} />
                        <Text style={styles.metaChipText}>{entry.duration}m</Text>
                      </View>
                      {entry.caloriesBurned > 0 && (
                        <View style={styles.metaChip}>
                          <Ionicons name="flame-outline" size={11} color={COLORS.primary} />
                          <Text style={styles.metaChipText}>{entry.caloriesBurned} kcal</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
                <TouchableOpacity onPress={() => deleteEntry(entry._id)} style={styles.deleteButton}>
                  <Ionicons name="trash-outline" size={16} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: SPACING.xxl },
  loadingContainer: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' },
  header: { paddingHorizontal: SPACING.xl, paddingTop: 60, paddingBottom: SPACING.xl },
  headerSub: { fontSize: 11, fontWeight: '700', color: COLORS.crimsonLight, letterSpacing: 4, marginBottom: 4 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: COLORS.textPrimary, letterSpacing: 4 },
  statsSection: { padding: SPACING.xl },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  statCard: {
    width: (width - SPACING.xl * 2 - SPACING.sm) / 2,
    backgroundColor: COLORS.card, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.cardBorder,
    padding: SPACING.md, gap: SPACING.xs, alignItems: 'flex-start',
  },
  statValue: { fontSize: 28, fontWeight: '900' },
  statLabel: { fontSize: 10, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 1.5 },
  chartSection: { paddingHorizontal: SPACING.xl, marginBottom: SPACING.lg },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: COLORS.primary, letterSpacing: 3, marginBottom: SPACING.md },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  barLabel: { width: 72, fontSize: 10, fontWeight: '700', color: COLORS.textSecondary, letterSpacing: 1 },
  barContainer: { flex: 1, height: 8, backgroundColor: COLORS.cardBorder, borderRadius: 4 },
  barFill: { height: 8, borderRadius: 4 },
  barCount: { width: 24, fontSize: 11, fontWeight: '800', color: COLORS.textSecondary, textAlign: 'right' },
  historySection: { paddingHorizontal: SPACING.xl },
  emptyState: { alignItems: 'center', paddingVertical: SPACING.xxl, gap: SPACING.sm },
  emptyTitle: { fontSize: 14, fontWeight: '800', color: COLORS.textSecondary, letterSpacing: 2 },
  emptySubtitle: { fontSize: 12, color: COLORS.textMuted, textAlign: 'center' },
  historyCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.card, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.cardBorder,
    padding: SPACING.md, marginBottom: SPACING.sm,
  },
  historyLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flex: 1 },
  historyIcon: { width: 44, height: 44, borderRadius: RADIUS.sm, alignItems: 'center', justifyContent: 'center' },
  historyEmoji: { fontSize: 22 },
  historyInfo: { flex: 1, gap: 3 },
  historyName: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary },
  historyDate: { fontSize: 11, color: COLORS.textMuted },
  historyMeta: { flexDirection: 'row', gap: SPACING.sm },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaChipText: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },
  deleteButton: { padding: SPACING.xs },
});
