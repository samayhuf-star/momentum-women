import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function LoginScreen() {
  const { loginAsGuest } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const handleGuest = async () => {
    if (busy) return;
    setBusy(true);
    await loginAsGuest();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#FF6B9D', '#FF8E53']} style={styles.header}>
        <Text style={styles.logo}>Momentum</Text>
        <Text style={styles.tagline}>Women's Workout</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>
          Guided workouts with a timer or a rep counter. Progress stays on this device. No account is required.
        </Text>

        <Pressable accessibilityRole="button" style={styles.guestButton} onPress={handleGuest} testID="continue-as-guest">
          <Text style={styles.guestButtonText}>Continue as Guest</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  header: { paddingTop: 56, paddingBottom: 60, alignItems: 'center' },
  logo: { color: '#fff', fontSize: 42, fontWeight: '800' },
  tagline: { color: 'rgba(255,255,255,0.9)', fontSize: 20, marginTop: 4 },
  content: { flex: 1, padding: 32, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: '#1A1A1A', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 8, marginBottom: 40, lineHeight: 22 },
  guestButton: { backgroundColor: '#FF6B9D', borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  guestButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
