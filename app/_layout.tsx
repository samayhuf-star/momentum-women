import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Archivo_800ExtraBold } from '@expo-google-fonts/archivo';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { AuthProvider } from '../context/AuthContext';
import { ProgressProvider } from '../context/ProgressContext';
import { ProProvider } from '../context/ProContext';
import { PlanProvider } from '../context/PlanContext';
import { initPush } from '../lib/push';
import { color } from '../lib/theme';

export default function RootLayout() {
  useEffect(() => {
    initPush();
  }, []);
  const [loaded, error] = useFonts({ Archivo_800ExtraBold, Inter_400Regular, Inter_500Medium, Inter_600SemiBold });
  if (!loaded && !error) return <View style={{ flex: 1, backgroundColor: color.bg }} />;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: color.bg }}>
      <SafeAreaProvider>
        <AuthProvider>
          <PlanProvider>
            <ProgressProvider>
              <ProProvider>
                <StatusBar style="light" />
                <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: color.bg }, animation: 'slide_from_right' }}>
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="workout/player" options={{ gestureEnabled: false }} />
                </Stack>
              </ProProvider>
            </ProgressProvider>
          </PlanProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
