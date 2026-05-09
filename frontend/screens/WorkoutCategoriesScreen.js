import React, { useState, useEffect } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { workoutService } from '../services/services';
import { COLORS, SPACING, RADIUS, CATEGORY_CONFIG } from '../assets/theme';

const { width } = Dimensions.get('window');

const CATEGORY_ORDER = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio', 'full_body'];

export default function WorkoutCategoriesScreen({ navigation }) {
  const [workouts, setWorkouts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryWorkouts, setCategoryWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [catLoading, setCatLoading] = useState(false);

  useEffect(() => {
    // Load all workouts from all categories for initial display
    loadAllCategories();
  }, []);

  const loadAllCategories = async () => {
    setLoading(true);
    try {
      // Just get categories to display; workouts loaded per category
    } catch (e) {
      Alert.alert('Error', 'Could not load training data. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const selectCategory = async (cat) => {
    setSelectedCategory(cat);
    setCatLoading(true);
    try {
      const res = await workoutService.getByCategory(cat);
      setCategoryWorkouts(res.data);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setCatLoading(false);
    }
  };

  const difficultyColor = (d) => {
    if (d === 'elite') return COLORS.crimsonLight;
    if (d === 'intermediate') return COLORS.primary;
    return COLORS.oliveLight;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#1A1200', '#0A0A0A']} style={styles.header}>
        <Text style={styles.headerSub}>SELECT YOUR</Text>
        <Text style={styles.headerTitle}>TRAINING ZONE</Text>
      </LinearGradient>

      {/* Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
        style={styles.categoryRow}
      >
        {CATEGORY_ORDER.map((cat) => {
          const config = CATEGORY_CONFIG[cat];
          const isActive = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryPill, isActive && styles.categoryPillActive]}
              onPress={() => selectCategory(cat)}
              activeOpacity={0.8}
            >
              <Text style={styles.categoryEmoji}>{config.emoji}</Text>
              <Text style={[styles.categoryPillText, isActive && styles.categoryPillTextActive]}>
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Content */}
      <ScrollView
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {!selectedCategory ? (
          // Show category grid when none selected
          <View>
            <Text style={styles.promptText}>SELECT A TRAINING ZONE ABOVE</Text>
            <View style={styles.categoryGrid}>
              {CATEGORY_ORDER.map((cat) => {
                const config = CATEGORY_CONFIG[cat];
                return (
                  <TouchableOpacity
                    key={cat}
                    style={styles.categoryCard}
                    onPress={() => selectCategory(cat)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={[config.color + '22', config.color + '08']}
                      style={styles.categoryCardGradient}
                    >
                      <Text style={styles.categoryCardEmoji}>{config.emoji}</Text>
                      <Text style={styles.categoryCardLabel}>{config.label}</Text>
                      <View style={[styles.categoryCardDot, { backgroundColor: config.color }]} />
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : catLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 60 }} />
        ) : (
          <View>
            <Text style={styles.sectionLabel}>
              {CATEGORY_CONFIG[selectedCategory]?.label?.toUpperCase()} PROTOCOLS
            </Text>
            {categoryWorkouts.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="barbell-outline" size={48} color={COLORS.textMuted} />
                <Text style={styles.emptyText}>No workouts seeded yet.</Text>
                <Text style={styles.emptySubtext}>Run POST /api/workouts/seed to populate.</Text>
              </View>
            ) : (
              categoryWorkouts.map((workout) => (
                <TouchableOpacity
                  key={workout._id}
                  style={styles.workoutCard}
                  onPress={() => navigation.navigate('ExerciseDetail', { workout })}
                  activeOpacity={0.8}
                >
                  <View style={styles.workoutCardContent}>
                    <View style={styles.workoutInfo}>
                      <View style={styles.workoutNameRow}>
                        <Text style={styles.workoutName}>{workout.name}</Text>
                        <View style={[styles.diffBadge, { backgroundColor: difficultyColor(workout.difficulty) + '22', borderColor: difficultyColor(workout.difficulty) + '66' }]}>
                          <Text style={[styles.diffText, { color: difficultyColor(workout.difficulty) }]}>
                            {workout.difficulty?.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.workoutDesc} numberOfLines={2}>{workout.description}</Text>
                      <View style={styles.workoutMeta}>
                        <View style={styles.metaItem}>
                          <Ionicons name="time-outline" size={13} color={COLORS.textMuted} />
                          <Text style={styles.metaText}>{workout.duration} min</Text>
                        </View>
                        <View style={styles.metaItem}>
                          <Ionicons name="list-outline" size={13} color={COLORS.textMuted} />
                          <Text style={styles.metaText}>{workout.exercises?.length} exercises</Text>
                        </View>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.xl, paddingTop: 60, paddingBottom: SPACING.lg },
  headerSub: { fontSize: 11, fontWeight: '700', color: COLORS.primary, letterSpacing: 4, marginBottom: 4 },
  headerTitle: { fontSize: 28, fontWeight: '900', color: COLORS.textPrimary, letterSpacing: 4 },
  categoryRow: { maxHeight: 70, borderBottomWidth: 1, borderBottomColor: COLORS.cardBorder },
  categoryScroll: { paddingHorizontal: SPACING.xl, paddingVertical: SPACING.sm, gap: SPACING.sm, alignItems: 'center' },
  categoryPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    backgroundColor: COLORS.card, borderRadius: RADIUS.full,
    borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  categoryPillActive: { backgroundColor: '#1A1200', borderColor: COLORS.primary },
  categoryEmoji: { fontSize: 14 },
  categoryPillText: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 1 },
  categoryPillTextActive: { color: COLORS.primary },
  listContainer: { flex: 1 },
  listContent: { padding: SPACING.xl, paddingBottom: SPACING.xxl },
  promptText: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 3, textAlign: 'center', marginBottom: SPACING.lg },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  categoryCard: {
    width: (width - SPACING.xl * 2 - SPACING.sm * 3) / 4,
    borderRadius: RADIUS.md, overflow: 'hidden',
    borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  categoryCardGradient: { padding: SPACING.sm, alignItems: 'center', gap: 4 },
  categoryCardEmoji: { fontSize: 24 },
  categoryCardLabel: { fontSize: 9, fontWeight: '800', color: COLORS.textSecondary, letterSpacing: 1, textAlign: 'center' },
  categoryCardDot: { width: 6, height: 6, borderRadius: 3 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: COLORS.primary, letterSpacing: 3, marginBottom: SPACING.md },
  workoutCard: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.cardBorder,
    marginBottom: SPACING.sm,
  },
  workoutCardContent: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, gap: SPACING.sm },
  workoutInfo: { flex: 1, gap: SPACING.xs },
  workoutNameRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flexWrap: 'wrap' },
  workoutName: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary, flex: 1 },
  diffBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: RADIUS.full, borderWidth: 1 },
  diffText: { fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  workoutDesc: { fontSize: 12, color: COLORS.textMuted, lineHeight: 18 },
  workoutMeta: { flexDirection: 'row', gap: SPACING.md },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: COLORS.textMuted },
  emptyState: { alignItems: 'center', paddingVertical: SPACING.xxl, gap: SPACING.sm },
  emptyText: { fontSize: 15, color: COLORS.textSecondary, fontWeight: '700' },
  emptySubtext: { fontSize: 12, color: COLORS.textMuted },
});
