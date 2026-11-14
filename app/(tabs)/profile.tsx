import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { usePro } from '../../context/ProContext';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { isPro } = usePro();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.card}>
        <Text style={styles.name}>{user?.name || 'Guest'}</Text>
        <Text style={styles.badge}>Guest mode</Text>
        <Text style={styles.email}>Progress is saved on this device. There is no account sign-in.</Text>
      </View>

      <Pressable style={styles.proButton} onPress={() => router.push('/paywall')} testID="open-paywall">
        <Text style={styles.proText}>{isPro ? 'Momentum Pro is active' : 'Unlock Momentum Pro'}</Text>
      </Pressable>

      <Pressable style={styles.creditsButton} onPress={() => router.push('/credits')} testID="open-credits">
        <Text style={styles.creditsText}>About and Credits</Text>
      </Pressable>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8', padding: 24, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 24 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 24 },
  name: { fontSize: 22, fontWeight: '700', color: '#1A1A1A' },
  badge: { marginTop: 8, color: '#FF6B9D', fontWeight: '600', fontSize: 14 },
  email: { marginTop: 6, color: '#888', fontSize: 14, lineHeight: 20 },
  proButton: { backgroundColor: '#1A1A1A', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  proText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  creditsButton: { backgroundColor: '#fff', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  creditsText: { color: '#1A1A1A', fontWeight: '700', fontSize: 16 },
  logoutButton: { backgroundColor: '#fff', borderRadius: 12, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: '#FF6B9D' },
  logoutText: { color: '#FF6B9D', fontWeight: '700', fontSize: 16 },
});
