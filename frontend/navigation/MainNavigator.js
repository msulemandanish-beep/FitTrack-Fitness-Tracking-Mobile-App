import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '../assets/theme';

import HomeScreen from '../screens/HomeScreen';
import WorkoutCategoriesScreen from '../screens/WorkoutCategoriesScreen';
import ExerciseDetailScreen from '../screens/ExerciseDetailScreen';
import BMICalculatorScreen from '../screens/BMICalculatorScreen';
import WaterTrackerScreen from '../screens/WaterTrackerScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Workout Stack
function WorkoutStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WorkoutCategories" component={WorkoutCategoriesScreen} />
      <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
    </Stack.Navigator>
  );
}

// Home Stack
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="BMICalculator" component={BMICalculatorScreen} />
      <Stack.Screen name="WaterTracker" component={WaterTrackerScreen} />
    </Stack.Navigator>
  );
}

export default function MainNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle: {
          backgroundColor: '#111111',
          borderTopColor: '#222',
          borderTopWidth: 1,

          height: 60 + (Platform.OS === 'android' ? 10 : insets.bottom),
          paddingBottom: Platform.OS === 'android' ? 10 : insets.bottom,

          paddingTop: 8,
          position: 'absolute',
        },

        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },

        tabBarIcon: ({ focused, color }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Workouts: focused ? 'barbell' : 'barbell-outline',
            Progress: focused ? 'trending-up' : 'trending-up-outline',
            Profile: focused ? 'person' : 'person-outline',
          };

          return <Ionicons name={icons[route.name]} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Workouts" component={WorkoutStack} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}