import React, { useEffect, useRef } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../assets/theme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(60)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={['#0A0A0A', '#111111', '#0A0A0A']} style={styles.container}>
      {/* Background decorative elements */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      {/* Logo Area */}
      <Animated.View
        style={[
          styles.logoSection,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] },
        ]}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="flame" size={52} color={COLORS.primary} />
        </View>
        <Text style={styles.appName}>FITTRACK</Text>
        <View style={styles.divider} />
        <Text style={styles.tagline}>EARN YOUR STRENGTH</Text>
      </Animated.View>

      {/* Quote */}
      <Animated.View style={[styles.quoteSection, { opacity: fadeAnim }]}>
        <Text style={styles.quote}>
          "The iron doesn't negotiate.{'\n'}Neither do I."
        </Text>
      </Animated.View>

      {/* CTA Buttons */}
      <Animated.View style={[styles.buttonSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.primaryButtonText}>ENTER TRAINING</Text>
            <Ionicons name="arrow-forward" size={18} color="#0A0A0A" />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Signup')}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryButtonText}>ENLIST NOW</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Bottom tagline */}
      <Animated.Text style={[styles.bottomText, { opacity: fadeAnim }]}>
        MISSION READY · COMBAT TESTED
      </Animated.Text>
    </LinearGradient>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  bgCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: COLORS.primary,
    opacity: 0.04,
    top: -50,
    right: -80,
  },
  bgCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.crimson,
    opacity: 0.06,
    bottom: 100,
    left: -60,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: '#1A1500',
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  appName: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 12,
    marginBottom: SPACING.sm,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: COLORS.primary,
    marginVertical: SPACING.sm,
  },
  tagline: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 6,
  },
  quoteSection: {
    marginBottom: SPACING.xxl,
    paddingHorizontal: SPACING.md,
  },
  quote: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  buttonSection: {
    width: '100%',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  primaryButton: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: SPACING.sm,
  },
  primaryButtonText: {
    color: '#0A0A0A',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 3,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: COLORS.gunmetalLight,
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 3,
  },
  bottomText: {
    position: 'absolute',
    bottom: 40,
    fontSize: 10,
    color: COLORS.textMuted,
    letterSpacing: 4,
    fontWeight: '600',
  },
});
