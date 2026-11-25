import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../context/AuthContext';
import { ProgressProvider } from '../context/ProgressContext';
import { ProProvider } from '../context/ProContext';
import { initOneSignal } from '../lib/onesignal';

export default function RootLayout() {
  useEffect(() => {
    initOneSignal();
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <ProgressProvider>
            <ProProvider>
              <StatusBar style="dark" />
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: '#FFF5F8' },
                  animation: 'slide_from_right',
                }}
              >
                <Stack.Screen name="login" />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="workout/[id]" options={{ presentation: 'modal' }} />
                <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
                <Stack.Screen name="credits" />
              </Stack>
            </ProProvider>
          </ProgressProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
