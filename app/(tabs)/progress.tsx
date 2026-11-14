import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgress } from '../../context/ProgressContext';
import { formatProgressDay } from '../../lib/progressDate';

const TAB_EDGES = ['top', 'left', 'right'] as const;

export default function ProgressScreen() {
  const { streak, totalWorkouts, completedDays, loading } = useProgress();

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const today = new Date().getDay();
  const adjustedToday = today === 0 ? 6 : today - 1;

  return (
    <SafeAreaView style={styles.safe} edges={TAB_EDGES}>
    <ScrollView style={styles.container} contentContainerStyle={styles.content} testID="progress">
      <Text style={styles.title}>Progress</Text>
      <Text style={styles.subtitle}>Track your strength and consistency</Text>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statNum}>{loading ? '-' : streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNum}>{loading ? '-' : totalWorkouts}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>This Week</Text>
        <View style={styles.weekRow}>
          {weekDays.map((d, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (adjustedToday - i));
            const key = date.toISOString().split('T')[0];
            const done = completedDays.includes(key);
            return (
              <View key={i} style={[styles.day, done && styles.dayDone]}>
                <Text style={[styles.dayText, done && styles.dayTextDone]}>{d}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent</Text>
        {completedDays.length === 0 ? (
          <Text style={styles.hint}>Complete a workout to start tracking.</Text>
        ) : (
          completedDays.slice(-5).reverse().map((d) => (
            <Text key={d} style={styles.metric}>
              {formatProgressDay(d)}
            </Text>
          ))
        )}
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF5F8' },
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  content: { padding: 24, paddingTop: 16, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', color: '#1A1A1A' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 8, marginBottom: 24 },
  statsRow: { flexDirection: 'row', gap: 12 },
  stat: { flex: 1, backgroundColor: '#fff', padding: 20, borderRadius: 16, alignItems: 'center' },
  statNum: { color: '#FF6B9D', fontSize: 28, fontWeight: '700' },
  statLabel: { color: '#888', marginTop: 4 },
  card: { backgroundColor: '#fff', marginTop: 20, padding: 16, borderRadius: 16 },
  cardTitle: { color: '#1A1A1A', fontSize: 18, fontWeight: '700', marginBottom: 12 },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
  day: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF5F8', alignItems: 'center', justifyContent: 'center' },
  dayDone: { backgroundColor: '#FF6B9D' },
  dayText: { color: '#888', fontWeight: '600' },
  dayTextDone: { color: '#fff' },
  metric: { color: '#1A1A1A', marginVertical: 4 },
  hint: { color: '#888', marginTop: 4, fontSize: 14 },
});
