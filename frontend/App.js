import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/AuthContext';
import RootNavigator from './navigation/RootNavigator';
import { SafeAreaProvider } from "react-native-safe-area-context"

export default function App() {
  return (
    <SafeAreaProvider>
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor="#0A0A0A" />
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
    </SafeAreaProvider>
  );
}
