import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useProgress } from '../../context/ProgressContext';
import { usePro } from '../../context/ProContext';
import { visiblePlans as plans } from '../../data/exercises';

export default function TodayScreen() {
  const router = useRouter();
  const { streak, totalWorkouts, loading } = useProgress();
  const { isPro } = usePro();
  const todayPlan = plans.find((p) => p.id === 'beginner') ?? plans[0];

  const startToday = () => {
    if (!todayPlan) return;
    router.push({
      pathname: '/workout/[id]',
      params: { id: todayPlan.exerciseIds[0], ids: todayPlan.exerciseIds.join(',') },
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} testID="home">
      <Text style={styles.greeting}>Welcome back</Text>
      <Text style={styles.title}>Today</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{todayPlan.name}</Text>
        <Text style={styles.cardSub}>{todayPlan.exerciseIds.length} exercises · {todayPlan.description}</Text>
        <Pressable style={styles.startBtn} onPress={startToday} testID="start-workout">
          <Ionicons name="play" size={18} color="#FF6B9D" />
          <Text style={styles.startText}>Start</Text>
        </Pressable>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statNum}>{loading ? '--' : String(totalWorkouts)}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNum}>{loading ? '--' : String(streak)}</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
      </View>
      {totalWorkouts === 0 && !loading ? (
        <Text style={styles.empty}>Complete a session to start your on-device history.</Text>
      ) : null}

      <Text style={styles.section}>Quick actions</Text>
      <View style={styles.actions}>
        <Pressable style={styles.action} onPress={() => router.push('/(tabs)/workouts')}>
          <Ionicons name="barbell" size={24} color="#FF6B9D" />
          <Text style={styles.actionText}>Browse</Text>
        </Pressable>
        <Pressable style={styles.action} onPress={() => router.push('/(tabs)/plans')}>
          <Ionicons name="calendar" size={24} color="#FF6B9D" />
          <Text style={styles.actionText}>Plans</Text>
        </Pressable>
        <Pressable style={styles.action} onPress={() => router.push('/(tabs)/progress')}>
          <Ionicons name="stats-chart" size={24} color="#FF6B9D" />
          <Text style={styles.actionText}>Progress</Text>
        </Pressable>
      </View>

      <Pressable style={styles.proBtn} onPress={() => router.push('/paywall')} testID="open-paywall">
        <Text style={styles.proText}>{isPro ? 'Momentum Pro is active' : 'Unlock Pro'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  greeting: { fontSize: 16, color: '#666' },
  title: { fontSize: 32, fontWeight: '700', color: '#1A1A1A', marginTop: 4 },
  card: { backgroundColor: '#FF6B9D', borderRadius: 20, padding: 20, marginTop: 24 },
  cardTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  cardSub: { color: '#fff', opacity: 0.9, marginTop: 4 },
  startBtn: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
    gap: 6,
  },
  startText: { color: '#FF6B9D', fontWeight: '700' },
  stats: { flexDirection: 'row', marginTop: 24 },
  stat: { backgroundColor: '#fff', flex: 1, marginHorizontal: 4, borderRadius: 16, padding: 16, alignItems: 'center' },
  statNum: { fontSize: 24, fontWeight: '700', color: '#1A1A1A' },
  statLabel: { fontSize: 13, color: '#888', marginTop: 4 },
  empty: { color: '#888', marginTop: 12, textAlign: 'center' },
  section: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginTop: 28, marginBottom: 12 },
  actions: { flexDirection: 'row', gap: 12 },
  action: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 16, alignItems: 'center' },
  actionText: { marginTop: 8, fontWeight: '600', color: '#1A1A1A' },
  proBtn: { backgroundColor: '#1A1A1A', marginTop: 28, padding: 16, borderRadius: 16, alignItems: 'center' },
  proText: { color: '#fff', fontWeight: '700' },
});
