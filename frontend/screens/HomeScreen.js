import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { progressService, waterService } from '../services/services';
import { COLORS, SPACING, RADIUS, QUOTES } from '../assets/theme';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [water, setWater] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [quote] = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  const loadData = useCallback(async () => {
    try {
      const [statsRes, waterRes] = await Promise.all([
        progressService.getStats(),
        waterService.getToday(),
      ]);
      setStats(statsRes.data);
      setWater(waterRes.data);
    } catch (e) {
      // silent fail for now
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const waterPercent = water ? Math.min((water.intakeMl / water.goalMl) * 100, 100) : 0;
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'MORNING STRIKE';
    if (hour < 17) return 'MIDDAY ASSAULT';
    return 'NIGHT PROTOCOL';
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
      {/* Header */}
      <LinearGradient colors={['#1A1200', '#0A0A0A']} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{greeting()}</Text>
            <Text style={styles.userName}>{user?.name?.toUpperCase() || 'WARRIOR'}</Text>
          </View>
          <View style={styles.streakBadge}>
            <Ionicons name="flame" size={16} color={COLORS.primary} />
            <Text style={styles.streakText}>{stats?.thisWeekCount || 0}</Text>
          </View>
        </View>

        {/* Quote */}
        <View style={styles.quoteCard}>
          <Ionicons name="chatbubble-ellipses" size={14} color={COLORS.primary} />
          <Text style={styles.quoteText} numberOfLines={2}>{quote}</Text>
        </View>
      </LinearGradient>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        {[
          { label: 'SESSIONS', value: stats?.totalWorkouts || 0, icon: 'barbell', color: COLORS.primary },
          { label: 'MINUTES', value: stats?.totalMinutes || 0, icon: 'time', color: COLORS.crimsonLight },
          { label: 'THIS WEEK', value: stats?.thisWeekCount || 0, icon: 'calendar', color: COLORS.oliveLight },
        ].map((s) => (
          <View key={s.label} style={styles.statCard}>
            <Ionicons name={s.icon} size={20} color={s.color} />
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
      <View style={styles.actionGrid}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Workouts')}
          activeOpacity={0.8}
        >
          <LinearGradient colors={['#1A1200', '#110E00']} style={styles.actionGradient}>
            <Ionicons name="barbell" size={28} color={COLORS.primary} />
            <Text style={styles.actionTitle}>WORKOUTS</Text>
            <Text style={styles.actionSubtitle}>Choose your mission</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('WaterTracker')}
          activeOpacity={0.8}
        >
          <LinearGradient colors={['#001020', '#000A16']} style={styles.actionGradient}>
            <Ionicons name="water" size={28} color="#4A90D9" />
            <Text style={styles.actionTitle}>HYDRATION</Text>
            <Text style={styles.actionSubtitle}>
              {water ? `${water.intakeMl}ml / ${water.goalMl}ml` : 'Track intake'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('BMICalculator')}
          activeOpacity={0.8}
        >
          <LinearGradient colors={['#0A1A00', '#061200']} style={styles.actionGradient}>
            <Ionicons name="body" size={28} color={COLORS.oliveLight} />
            <Text style={styles.actionTitle}>BMI CHECK</Text>
            <Text style={styles.actionSubtitle}>Assess your status</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Progress')}
          activeOpacity={0.8}
        >
          <LinearGradient colors={['#1A0A0A', '#110606']} style={styles.actionGradient}>
            <Ionicons name="trending-up" size={28} color={COLORS.crimsonLight} />
            <Text style={styles.actionTitle}>PROGRESS</Text>
            <Text style={styles.actionSubtitle}>Combat record</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Water Progress Bar */}
      {water && (
        <View style={styles.waterSection}>
          <View style={styles.waterHeader}>
            <View style={styles.waterTitleRow}>
              <Ionicons name="water" size={16} color="#4A90D9" />
              <Text style={styles.waterTitle}>DAILY HYDRATION</Text>
            </View>
            <Text style={styles.waterValue}>
              {water.intakeMl}ml / {water.goalMl}ml
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${waterPercent}%` }]} />
          </View>
          <Text style={styles.waterPercent}>{Math.round(waterPercent)}% of daily target</Text>
        </View>
      )}

      {/* Mission Ready CTA */}
      <TouchableOpacity
        style={styles.ctaBanner}
        onPress={() => navigation.navigate('Workouts')}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          style={styles.ctaGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View>
            <Text style={styles.ctaTitle}>MISSION READY?</Text>
            <Text style={styles.ctaSubtitle}>Select your training protocol</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#0A0A0A" />
        </LinearGradient>
      </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: SPACING.xl },
  header: { paddingHorizontal: SPACING.xl, paddingTop: 60, paddingBottom: SPACING.xl },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.md },
  greeting: { fontSize: 11, fontWeight: '700', color: COLORS.primary, letterSpacing: 3, marginBottom: SPACING.xs },
  userName: { fontSize: 26, fontWeight: '900', color: COLORS.textPrimary, letterSpacing: 2 },
  streakBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#1A1200', borderWidth: 1, borderColor: COLORS.primary + '40',
    paddingHorizontal: SPACING.sm, paddingVertical: 6, borderRadius: RADIUS.full,
  },
  streakText: { fontSize: 14, fontWeight: '800', color: COLORS.primary },
  quoteCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm,
    backgroundColor: '#161616', borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.cardBorder,
    padding: SPACING.md,
  },
  quoteText: { flex: 1, fontSize: 12, color: COLORS.textSecondary, fontStyle: 'italic', lineHeight: 18 },
  statsRow: { flexDirection: 'row', gap: SPACING.sm, paddingHorizontal: SPACING.xl, marginTop: SPACING.lg, marginBottom: SPACING.md },
  statCard: {
    flex: 1, alignItems: 'center', gap: 4,
    backgroundColor: COLORS.card, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.cardBorder,
    paddingVertical: SPACING.md,
  },
  statValue: { fontSize: 22, fontWeight: '900' },
  statLabel: { fontSize: 9, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 1.5 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: COLORS.primary, letterSpacing: 3, paddingHorizontal: SPACING.xl, marginBottom: SPACING.sm },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, paddingHorizontal: SPACING.xl, marginBottom: SPACING.lg },
  actionCard: {
    width: (width - SPACING.xl * 2 - SPACING.sm) / 2,
    borderRadius: RADIUS.md, overflow: 'hidden',
    borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  actionGradient: { padding: SPACING.md, gap: SPACING.xs },
  actionTitle: { fontSize: 13, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: 1.5, marginTop: SPACING.xs },
  actionSubtitle: { fontSize: 11, color: COLORS.textMuted },
  waterSection: {
    marginHorizontal: SPACING.xl, backgroundColor: COLORS.card,
    borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.cardBorder,
    padding: SPACING.md, marginBottom: SPACING.lg, gap: SPACING.sm,
  },
  waterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  waterTitleRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  waterTitle: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary, letterSpacing: 2 },
  waterValue: { fontSize: 12, fontWeight: '700', color: '#4A90D9' },
  progressBarBg: { height: 6, backgroundColor: COLORS.cardBorder, borderRadius: 3 },
  progressBarFill: { height: 6, backgroundColor: '#4A90D9', borderRadius: 3 },
  waterPercent: { fontSize: 11, color: COLORS.textMuted },
  ctaBanner: { marginHorizontal: SPACING.xl, borderRadius: RADIUS.md, overflow: 'hidden' },
  ctaGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: SPACING.lg,
  },
  ctaTitle: { fontSize: 16, fontWeight: '900', color: '#0A0A0A', letterSpacing: 2 },
  ctaSubtitle: { fontSize: 11, color: '#0A0A0A' + 'CC', marginTop: 2 },
});
