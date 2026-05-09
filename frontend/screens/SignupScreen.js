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
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, RADIUS } from '../assets/theme';

const GOALS = [
  { key: 'strength', label: 'STRENGTH' },
  { key: 'muscle_gain', label: 'MUSCLE GAIN' },
  { key: 'weight_loss', label: 'FAT LOSS' },
  { key: 'endurance', label: 'ENDURANCE' },
];

export default function SignupScreen({ navigation }) {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    weight: '',
    height: '',
    fitnessGoal: 'strength',
  });

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      Alert.alert('Incomplete Dossier', 'Name, email and password are required.');
      return;
    }
    if (form.password.length < 6) {
      Alert.alert('Weak Clearance', 'Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await register({
        ...form,
        age: form.age ? Number(form.age) : undefined,
        weight: form.weight ? Number(form.weight) : undefined,
        height: form.height ? Number(form.height) : undefined,
      });
    } catch (err) {
      Alert.alert('Enlistment Denied', err.message);
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, icon, field, placeholder, keyboard, secure }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <Ionicons name={icon} size={18} color={COLORS.textMuted} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={form[field]}
          onChangeText={(val) => update(field, val)}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          keyboardType={keyboard || 'default'}
          autoCapitalize={field === 'email' ? 'none' : 'words'}
          autoCorrect={false}
          secureTextEntry={secure && !showPassword}
        />
        {secure && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: COLORS.background }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.title}>ENLIST NOW</Text>
          <Text style={styles.subtitle}>Build your combat profile. No weakness tolerated.</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <InputField label="OPERATIVE NAME" icon="person-outline" field="name" placeholder="Your name" />
          <InputField label="CALLSIGN (EMAIL)" icon="mail-outline" field="email" placeholder="your@email.com" keyboard="email-address" />
          <InputField label="CLEARANCE CODE" icon="lock-closed-outline" field="password" placeholder="Min 6 characters" secure />

          {/* Optional stats row */}
          <Text style={styles.sectionLabel}>COMBAT STATS (Optional)</Text>
          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>AGE</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={form.age}
                  onChangeText={(val) => update('age', val)}
                  placeholder="25"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>WEIGHT (KG)</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={form.weight}
                  onChangeText={(val) => update('weight', val)}
                  placeholder="80"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>HEIGHT (CM)</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={form.height}
                  onChangeText={(val) => update('height', val)}
                  placeholder="180"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Mission Goal */}
          <Text style={styles.sectionLabel}>PRIMARY MISSION</Text>
          <View style={styles.goalGrid}>
            {GOALS.map((g) => (
              <TouchableOpacity
                key={g.key}
                style={[styles.goalChip, form.fitnessGoal === g.key && styles.goalChipActive]}
                onPress={() => update('fitnessGoal', g.key)}
              >
                <Text style={[styles.goalText, form.fitnessGoal === g.key && styles.goalTextActive]}>
                  {g.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryDark]}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {loading ? (
                <ActivityIndicator color="#0A0A0A" />
              ) : (
                <Text style={styles.registerButtonText}>BEGIN TRAINING</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLinkText}>Already enlisted? ENTER TRAINING →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: SPACING.xl, paddingTop: 60, paddingBottom: SPACING.xl },
  header: { marginBottom: SPACING.xl },
  backButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.card,
    alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.lg,
  },
  title: { fontSize: 26, fontWeight: '900', color: COLORS.textPrimary, letterSpacing: 6, marginBottom: SPACING.xs },
  subtitle: { fontSize: 13, color: COLORS.textMuted, lineHeight: 20 },
  form: { gap: SPACING.md },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: COLORS.primary, letterSpacing: 2, marginTop: SPACING.sm },
  inputGroup: { gap: SPACING.xs },
  label: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 1.5 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card,
    borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.cardBorder,
    paddingHorizontal: SPACING.md, paddingVertical: 14,
  },
  inputIcon: { marginRight: SPACING.sm },
  input: { flex: 1, color: COLORS.textPrimary, fontSize: 15 },
  rowInputs: { flexDirection: 'row', gap: SPACING.sm },
  goalGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  goalChip: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm, borderWidth: 1, borderColor: COLORS.cardBorder, backgroundColor: COLORS.card,
  },
  goalChipActive: { borderColor: COLORS.primary, backgroundColor: '#1A1500' },
  goalText: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 1.5 },
  goalTextActive: { color: COLORS.primary },
  registerButton: {
    borderRadius: RADIUS.md, overflow: 'hidden', marginTop: SPACING.sm,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  buttonGradient: { alignItems: 'center', justifyContent: 'center', paddingVertical: 16 },
  registerButtonText: { color: '#0A0A0A', fontSize: 15, fontWeight: '800', letterSpacing: 3 },
  loginLink: { alignItems: 'center', paddingVertical: SPACING.sm },
  loginLinkText: { color: COLORS.textMuted, fontSize: 12, letterSpacing: 1 },
});
