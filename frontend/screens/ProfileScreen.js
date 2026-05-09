import React, { useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, RADIUS } from '../assets/theme';

const GOALS = [
  { key: 'strength', label: 'STRENGTH', icon: 'barbell' },
  { key: 'muscle_gain', label: 'MUSCLE GAIN', icon: 'body' },
  { key: 'weight_loss', label: 'FAT LOSS', icon: 'flame' },
  { key: 'endurance', label: 'ENDURANCE', icon: 'heart' },
];

export default function ProfileScreen() {
  const { user, updateUser, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    age: user?.age?.toString() || '',
    weight: user?.weight?.toString() || '',
    height: user?.height?.toString() || '',
    fitnessGoal: user?.fitnessGoal || 'strength',
  });

  const update = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const getBMI = () => {
    if (!user?.weight || !user?.height) return null;
    const h = user.height / 100;
    return (user.weight / (h * h)).toFixed(1);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUser({
        name: form.name,
        age: form.age ? Number(form.age) : undefined,
        weight: form.weight ? Number(form.weight) : undefined,
        height: form.height ? Number(form.height) : undefined,
        fitnessGoal: form.fitnessGoal,
      });
      setEditing(false);
      Alert.alert('Profile Updated', 'Your combat stats have been saved.');
    } catch (e) {
      Alert.alert('Update Failed', e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'STAND DOWN?',
      'You sure you want to leave your post?',
      [
        { text: 'STAY IN', style: 'cancel' },
        { text: 'WITHDRAW', style: 'destructive', onPress: logout },
      ]
    );
  };

  const bmi = getBMI();
  const currentGoal = GOALS.find((g) => g.key === user?.fitnessGoal);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
      {/* Header */}
      <LinearGradient colors={['#1A1200', '#0A0A0A']} style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerSub}>OPERATIVE DOSSIER</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => (editing ? handleSave() : setEditing(true))}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <>
                <Ionicons name={editing ? 'checkmark' : 'create-outline'} size={16} color={COLORS.primary} />
                <Text style={styles.editButtonText}>{editing ? 'SAVE' : 'EDIT'}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() || 'W'}
            </Text>
          </View>
          <View style={styles.nameSection}>
            <Text style={styles.userName}>{user?.name?.toUpperCase()}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            {currentGoal && (
              <View style={styles.goalBadge}>
                <Ionicons name={currentGoal.icon} size={12} color={COLORS.primary} />
                <Text style={styles.goalBadgeText}>{currentGoal.label}</Text>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        {[
          { label: 'AGE', value: user?.age || '—', unit: 'yrs' },
          { label: 'WEIGHT', value: user?.weight || '—', unit: 'kg' },
          { label: 'HEIGHT', value: user?.height || '—', unit: 'cm' },
          { label: 'BMI', value: bmi || '—', unit: '' },
        ].map((s) => (
          <View key={s.label} style={styles.quickStatCard}>
            <Text style={styles.quickStatValue}>
              {s.value}
              {s.unit ? <Text style={styles.quickStatUnit}> {s.unit}</Text> : null}
            </Text>
            <Text style={styles.quickStatLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Edit Form */}
      {editing && (
        <View style={styles.editSection}>
          <Text style={styles.sectionLabel}>EDIT PROFILE</Text>

          {[
            { label: 'NAME', key: 'name', placeholder: 'Your name', keyboard: 'default' },
            { label: 'AGE', key: 'age', placeholder: '25', keyboard: 'numeric' },
            { label: 'WEIGHT (KG)', key: 'weight', placeholder: '80', keyboard: 'numeric' },
            { label: 'HEIGHT (CM)', key: 'height', placeholder: '180', keyboard: 'numeric' },
          ].map((field) => (
            <View key={field.key} style={styles.inputGroup}>
              <Text style={styles.label}>{field.label}</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={form[field.key]}
                  onChangeText={(val) => update(field.key, val)}
                  placeholder={field.placeholder}
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType={field.keyboard}
                  autoCapitalize={field.key === 'name' ? 'words' : 'none'}
                />
              </View>
            </View>
          ))}

          {/* Fitness Goal */}
          <Text style={styles.label}>PRIMARY MISSION</Text>
          <View style={styles.goalGrid}>
            {GOALS.map((g) => (
              <TouchableOpacity
                key={g.key}
                style={[styles.goalChip, form.fitnessGoal === g.key && styles.goalChipActive]}
                onPress={() => update('fitnessGoal', g.key)}
              >
                <Ionicons name={g.icon} size={14} color={form.fitnessGoal === g.key ? COLORS.primary : COLORS.textMuted} />
                <Text style={[styles.goalChipText, form.fitnessGoal === g.key && styles.goalChipTextActive]}>
                  {g.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.cancelButton} onPress={() => setEditing(false)}>
            <Text style={styles.cancelText}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Info Cards */}
      {!editing && (
        <View style={styles.infoSection}>
          <Text style={styles.sectionLabel}>OPERATIVE INFO</Text>

          {[
            { icon: 'person-outline', label: 'Full Name', value: user?.name || 'Not set' },
            { icon: 'mail-outline', label: 'Email', value: user?.email || 'Not set' },
            { icon: 'fitness-center', label: 'Mission Goal', value: currentGoal?.label || 'Not set' },
            { icon: 'calendar-outline', label: 'Age', value: user?.age ? `${user.age} years` : 'Not set' },
            { icon: 'scale-outline', label: 'Weight', value: user?.weight ? `${user.weight} kg` : 'Not set' },
            { icon: 'resize-outline', label: 'Height', value: user?.height ? `${user.height} cm` : 'Not set' },
          ].map((item) => (
            <View key={item.label} style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name={item.icon} size={18} color={COLORS.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* About Section */}
      {!editing && (
        <View style={styles.aboutSection}>
          <Text style={styles.sectionLabel}>ABOUT FITTRACK</Text>
          <View style={styles.aboutCard}>
            <Ionicons name="flame" size={24} color={COLORS.primary} />
            <View style={styles.aboutText}>
              <Text style={styles.aboutTitle}>FitTrack v1.0</Text>
              <Text style={styles.aboutDesc}>Discipline. Strength. Domination.</Text>
              <Text style={styles.aboutDesc}>Built for warriors. Not for the weak.</Text>
            </View>
          </View>
        </View>
      )}

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
        <Ionicons name="log-out-outline" size={18} color={COLORS.crimsonLight} />
        <Text style={styles.logoutText}>STAND DOWN</Text>
      </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: SPACING.xxl },
  header: { paddingHorizontal: SPACING.xl, paddingTop: 60, paddingBottom: SPACING.xl },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  headerSub: { fontSize: 11, fontWeight: '700', color: COLORS.primary, letterSpacing: 4 },
  editButton: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#1A1200', borderWidth: 1, borderColor: COLORS.primary + '40',
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: RADIUS.full,
  },
  editButtonText: { fontSize: 11, fontWeight: '700', color: COLORS.primary, letterSpacing: 2 },
  avatarSection: { flexDirection: 'row', alignItems: 'center', gap: SPACING.lg },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#1A1200', borderWidth: 2, borderColor: COLORS.primary + '60',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 30, fontWeight: '900', color: COLORS.primary },
  nameSection: { flex: 1, gap: SPACING.xs },
  userName: { fontSize: 20, fontWeight: '900', color: COLORS.textPrimary, letterSpacing: 2 },
  userEmail: { fontSize: 12, color: COLORS.textMuted },
  goalBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start',
    backgroundColor: '#1A1200', borderWidth: 1, borderColor: COLORS.primary + '40',
    paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: RADIUS.full,
  },
  goalBadgeText: { fontSize: 10, fontWeight: '700', color: COLORS.primary, letterSpacing: 1.5 },
  quickStats: { flexDirection: 'row', gap: SPACING.sm, paddingHorizontal: SPACING.xl, marginVertical: SPACING.lg },
  quickStatCard: {
    flex: 1, backgroundColor: COLORS.card, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.cardBorder,
    padding: SPACING.sm, alignItems: 'center', gap: 2,
  },
  quickStatValue: { fontSize: 18, fontWeight: '900', color: COLORS.primary },
  quickStatUnit: { fontSize: 10, fontWeight: '600', color: COLORS.textMuted },
  quickStatLabel: { fontSize: 9, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 1 },
  editSection: { paddingHorizontal: SPACING.xl, gap: SPACING.md },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: COLORS.primary, letterSpacing: 3, paddingHorizontal: SPACING.xl, marginBottom: SPACING.sm },
  inputGroup: { gap: SPACING.xs },
  label: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 1.5 },
  inputContainer: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.cardBorder,
    paddingHorizontal: SPACING.md, paddingVertical: 14,
  },
  input: { color: COLORS.textPrimary, fontSize: 15 },
  goalGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginTop: SPACING.xs },
  goalChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    backgroundColor: COLORS.card, borderRadius: RADIUS.sm,
    borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  goalChipActive: { borderColor: COLORS.primary, backgroundColor: '#1A1200' },
  goalChipText: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 1 },
  goalChipTextActive: { color: COLORS.primary },
  cancelButton: {
    borderWidth: 1, borderColor: COLORS.cardBorder, borderRadius: RADIUS.md,
    paddingVertical: 12, alignItems: 'center', marginTop: SPACING.sm,
  },
  cancelText: { color: COLORS.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 2 },
  infoSection: { gap: SPACING.sm, marginBottom: SPACING.lg },
  infoRow: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    paddingHorizontal: SPACING.xl,
    backgroundColor: COLORS.card, marginHorizontal: SPACING.xl,
    borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.cardBorder,
    padding: SPACING.md,
  },
  infoIcon: {
    width: 36, height: 36, borderRadius: RADIUS.sm,
    backgroundColor: '#1A1200', alignItems: 'center', justifyContent: 'center',
  },
  infoContent: { flex: 1, gap: 2 },
  infoLabel: { fontSize: 10, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 1.5 },
  infoValue: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  aboutSection: { marginBottom: SPACING.lg },
  aboutCard: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    backgroundColor: COLORS.card, marginHorizontal: SPACING.xl,
    borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.cardBorder,
    padding: SPACING.md,
  },
  aboutText: { gap: 2 },
  aboutTitle: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary },
  aboutDesc: { fontSize: 12, color: COLORS.textMuted },
  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm,
    marginHorizontal: SPACING.xl, borderWidth: 1,
    borderColor: COLORS.crimson + '44', borderRadius: RADIUS.md,
    paddingVertical: 14,
  },
  logoutText: { color: COLORS.crimsonLight, fontSize: 13, fontWeight: '700', letterSpacing: 3 },
});
