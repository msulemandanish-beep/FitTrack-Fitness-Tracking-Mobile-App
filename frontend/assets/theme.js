// FitTrack Design System — Dark Cinematic Aesthetic

export const COLORS = {
  // Base
  background: '#0A0A0A',
  surface: '#111111',
  card: '#161616',
  cardBorder: '#222222',

  // Primary accent - metallic bronze/gold
  primary: '#C8963E',
  primaryLight: '#E0B060',
  primaryDark: '#9A7030',

  // Secondary - gunmetal
  gunmetal: '#2A2E35',
  gunmetalLight: '#3A3F48',

  // Accent - crimson
  crimson: '#8B1A1A',
  crimsonLight: '#C0392B',

  // Text
  textPrimary: '#F0EDE8',
  textSecondary: '#9A9590',
  textMuted: '#5A5550',

  // Olive
  olive: '#4A4A2A',
  oliveLight: '#6A6A3A',

  // Status
  success: '#2ECC71',
  warning: '#F39C12',
  danger: '#E74C3C',

  // Gradients (used with LinearGradient)
  gradientDark: ['#0A0A0A', '#161616'],
  gradientBronze: ['#C8963E', '#9A7030'],
  gradientCrimson: ['#8B1A1A', '#4A0A0A'],
  gradientCard: ['#1A1A1A', '#111111'],
};

export const FONTS = {
  // Use system fonts for lightweight approach
  bold: 'System',
  regular: 'System',
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    hero: 32,
    mega: 42,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 6,
  md: 12,
  lg: 18,
  xl: 24,
  full: 999,
};

export const SHADOWS = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  glow: {
    shadowColor: '#C8963E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
};

export const QUOTES = [
  "Weakness is just a skill you haven't trained.",
  "The iron doesn't negotiate. Neither do I.",
  "Pain is a messenger. Train hard enough and it stops showing up.",
  "Every rep is a statement. Make yours count.",
  "You don't rise to the occasion. You fall to your training.",
  "The body achieves what the mind believes — so believe in destruction.",
  "Soft men build nothing. Hard training builds empires.",
  "Rest when you're dead. Today, we earn our keep.",
  "Discipline is the only currency that never devalues.",
  "Nobody remembers who almost made it.",
];

export const CATEGORY_CONFIG = {
  chest: { label: 'Chest', icon: 'fitness-center', color: '#C8963E', emoji: '💪' },
  back: { label: 'Back', icon: 'fitness-center', color: '#8B6020', emoji: '🏋️' },
  legs: { label: 'Legs', icon: 'directions-run', color: '#C0392B', emoji: '🦵' },
  shoulders: { label: 'Shoulders', icon: 'fitness-center', color: '#9A7030', emoji: '🎯' },
  arms: { label: 'Arms', icon: 'fitness-center', color: '#7A5020', emoji: '⚔️' },
  core: { label: 'Core', icon: 'fitness-center', color: '#4A4A2A', emoji: '🔥' },
  cardio: { label: 'Cardio', icon: 'directions-run', color: '#8B1A1A', emoji: '⚡' },
  full_body: { label: 'Full Body', icon: 'fitness-center', color: '#2A2E35', emoji: '🏆' },
};
