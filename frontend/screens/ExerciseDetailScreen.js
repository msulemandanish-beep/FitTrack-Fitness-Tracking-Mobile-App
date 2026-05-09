import React, { useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { progressService } from '../services/services';
import { COLORS, SPACING, RADIUS, CATEGORY_CONFIG } from '../assets/theme';

export default function ExerciseDetailScreen({ route, navigation }) {
  const { workout } = route.params;
  const [logging, setLogging] = useState(false);
  const [logged, setLogged] = useState(false);

  const catConfig = CATEGORY_CONFIG[workout.category] || {};

  const difficultyColor = (d) => {
    if (d === 'elite') return COLORS.crimsonLight;
    if (d === 'intermediate') return COLORS.primary;
    return COLORS.oliveLight;
  };

  const estimateCalories = () => {
    const base = { beginner: 4, intermediate: 6, elite: 8 };
    return Math.round((base[workout.difficulty] || 6) * workout.duration);
  };

  const logWorkout = async () => {
    setLogging(true);
    try {
      await progressService.log({
        workoutName: workout.name,
        category: workout.category,
        duration: workout.duration,
        caloriesBurned: estimateCalories(),
      });
      setLogged(true);
      Alert.alert(
        'MISSION COMPLETE 🔥',
        `${workout.name} logged to your combat record. ${estimateCalories()} calories earned.`,
        [{ text: 'ACKNOWLEDGED', style: 'default' }]
      );
    } catch (e) {
      Alert.alert('Log Failed', e.message);
    } finally {
      setLogging(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>

    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[catConfig.color ? catConfig.color + '33' : '#1A1200', '#0A0A0A']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.categoryLabel}>
            {catConfig.emoji} {catConfig.label?.toUpperCase() || workout.category.toUpperCase()}
          </Text>
          <Text style={styles.workoutName}>{workout.name}</Text>
          <Text style={styles.workoutDesc}>{workout.description}</Text>

          {/* Meta badges */}
          <View style={styles.metaRow}>
            <View style={[styles.badge, { borderColor: difficultyColor(workout.difficulty) + '66' }]}>
              <Text style={[styles.badgeText, { color: difficultyColor(workout.difficulty) }]}>
                {workout.difficulty?.toUpperCase()}
              </Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="time-outline" size={12} color={COLORS.textSecondary} />
              <Text style={styles.badgeText}>{workout.duration} MIN</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="flame-outline" size={12} color={COLORS.primary} />
              <Text style={styles.badgeText}>~{estimateCalories()} KCAL</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Exercises List */}
      <ScrollView style={styles.exerciseList} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>
          EXERCISE PROTOCOL ({workout.exercises?.length} MOVEMENTS)
        </Text>

        {workout.exercises?.map((exercise, index) => (
          <View key={index} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <View style={styles.exerciseNumberBadge}>
                <Text style={styles.exerciseNumber}>{String(index + 1).padStart(2, '0')}</Text>
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.muscleGroup}>{exercise.muscleGroup}</Text>
              </View>
              <View style={styles.exerciseStats}>
                <Text style={styles.exerciseSets}>{exercise.sets}×</Text>
                <Text style={styles.exerciseReps}>{exercise.reps}</Text>
              </View>
            </View>

            {exercise.instructions && (
              <View style={styles.instructionsBox}>
                <Ionicons name="information-circle-outline" size={14} color={COLORS.primary} />
                <Text style={styles.instructions}>{exercise.instructions}</Text>
              </View>
            )}

            {exercise.restTime && (
              <View style={styles.restRow}>
                <Ionicons name="timer-outline" size={13} color={COLORS.textMuted} />
                <Text style={styles.restText}>Rest: {exercise.restTime}s</Text>
              </View>
            )}
          </View>
        ))}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Log Button */}
      <View style={styles.logContainer}>
        <TouchableOpacity
          style={[styles.logButton, logged && styles.logButtonDone]}
          onPress={logged ? () => navigation.goBack() : logWorkout}
          disabled={logging}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={logged ? [COLORS.oliveLight, '#2A3A1A'] : [COLORS.primary, COLORS.primaryDark]}
            style={styles.logGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {logging ? (
              <ActivityIndicator color="#0A0A0A" />
            ) : logged ? (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#0A0A0A" />
                <Text style={styles.logButtonText}>MISSION COMPLETE</Text>
              </>
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color="#0A0A0A" />
                <Text style={styles.logButtonText}>LOG WORKOUT</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 60, paddingHorizontal: SPACING.xl, paddingBottom: SPACING.xl },
  backButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.card + 'CC',
    alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md,
  },
  headerContent: { gap: SPACING.sm },
  categoryLabel: { fontSize: 11, fontWeight: '700', color: COLORS.primary, letterSpacing: 3 },
  workoutName: { fontSize: 26, fontWeight: '900', color: COLORS.textPrimary, lineHeight: 32 },
  workoutDesc: { fontSize: 13, color: COLORS.textMuted, lineHeight: 20 },
  metaRow: { flexDirection: 'row', gap: SPACING.sm, flexWrap: 'wrap' },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: SPACING.sm, paddingVertical: 4,
    backgroundColor: COLORS.card, borderRadius: RADIUS.full,
    borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  badgeText: { fontSize: 10, fontWeight: '700', color: COLORS.textSecondary, letterSpacing: 1 },
  exerciseList: { flex: 1, paddingHorizontal: SPACING.xl },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: COLORS.primary, letterSpacing: 3, marginBottom: SPACING.md, marginTop: SPACING.lg },
  exerciseCard: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.cardBorder,
    padding: SPACING.md, marginBottom: SPACING.sm, gap: SPACING.sm,
  },
  exerciseHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  exerciseNumberBadge: {
    width: 40, height: 40, borderRadius: RADIUS.sm,
    backgroundColor: '#1A1200', borderWidth: 1, borderColor: COLORS.primary + '40',
    alignItems: 'center', justifyContent: 'center',
  },
  exerciseNumber: { fontSize: 13, fontWeight: '900', color: COLORS.primary },
  exerciseInfo: { flex: 1, gap: 2 },
  exerciseName: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary },
  muscleGroup: { fontSize: 11, color: COLORS.textMuted },
  exerciseStats: { alignItems: 'center' },
  exerciseSets: { fontSize: 20, fontWeight: '900', color: COLORS.primary },
  exerciseReps: { fontSize: 10, color: COLORS.textSecondary, fontWeight: '700' },
  instructionsBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.xs,
    backgroundColor: '#111111', borderRadius: RADIUS.sm, padding: SPACING.sm,
  },
  instructions: { flex: 1, fontSize: 12, color: COLORS.textSecondary, lineHeight: 18, fontStyle: 'italic' },
  restRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  restText: { fontSize: 11, color: COLORS.textMuted },
  logContainer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: SPACING.xl, backgroundColor: COLORS.background + 'EE',
    borderTopWidth: 1, borderTopColor: COLORS.cardBorder,
  },
  logButton: { borderRadius: RADIUS.md, overflow: 'hidden' },
  logButtonDone: {},
  logGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: SPACING.sm },
  logButtonText: { color: '#0A0A0A', fontSize: 15, fontWeight: '800', letterSpacing: 3 },
});
