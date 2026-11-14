import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgress } from '../../context/ProgressContext';
import { formatProgressDay } from '../../lib/progressDate';
import StreakRing from '../../components/StreakRing';
import WeekStrip from '../../components/WeekStrip';
import { color, space, type } from '../../lib/theme';

const TAB_EDGES = ['top', 'left', 'right'] as const;

export default function ProgressScreen() {
  const { streak, totalWorkouts, completedDays, minutes, loading } = useProgress();

  return (
    <SafeAreaView style={styles.safe} edges={TAB_EDGES}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} testID="progress">
        <Text style={styles.title} accessibilityRole="header">Progress</Text>
        <Text style={styles.subtitle}>Track your strength and consistency</Text>

        <View style={styles.hero}>
          <StreakRing completedDays={completedDays} streak={loading ? 0 : streak} />
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statNum}>{loading ? '-' : totalWorkouts}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNum}>{loading ? '-' : minutes}</Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>This week</Text>
          <WeekStrip completedDays={completedDays} size={40} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent</Text>
          {completedDays.length === 0 ? (
            <Text style={styles.hint}>Complete a workout to start tracking.</Text>
          ) : (
            completedDays.slice(-5).reverse().map((day) => (
              <Text key={day} style={styles.metric}>
                {formatProgressDay(day)}
              </Text>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg },
  container: { flex: 1, backgroundColor: color.bg },
  content: { padding: space.xl, paddingTop: space.lg, paddingBottom: space.xxl },
  title: { fontSize: type.display, fontWeight: '800', color: color.ink },
  subtitle: { fontSize: type.body, color: color.muted, marginTop: space.sm, marginBottom: space.xl, lineHeight: 24 },
  hero: {
    backgroundColor: color.card,
    borderRadius: 24,
    padding: space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  stats: { flex: 1, gap: space.md },
  stat: { backgroundColor: color.bg, borderRadius: 16, padding: space.md },
  statNum: { color: color.ink, fontSize: type.headline, fontWeight: '800' },
  statLabel: { color: color.muted, marginTop: space.xs, fontSize: type.caption, fontWeight: '600' },
  card: { backgroundColor: color.card, marginTop: space.lg, padding: space.lg, borderRadius: 20 },
  cardTitle: { color: color.ink, fontSize: type.headline, fontWeight: '800', marginBottom: space.md },
  metric: { color: color.ink, fontSize: type.body, marginVertical: space.xs },
  hint: { color: color.muted, fontSize: type.label, lineHeight: 22 },
});
