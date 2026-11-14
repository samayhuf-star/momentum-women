import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useProgress } from '../../context/ProgressContext';
import { usePro } from '../../context/ProContext';
import { exercises, visiblePlans as plans } from '../../data/exercises';
import WeekStrip from '../../components/WeekStrip';
import MonthStrip from '../../components/MonthStrip';
import { formatSessionLength, planEquipment, planLevel } from '../../lib/sessionMeta';
import { color, hit, space, type } from '../../lib/theme';

const TAB_EDGES = ['top', 'left', 'right'] as const;

export default function TodayScreen() {
  const router = useRouter();
  const { streak, totalWorkouts, completedDays, loading } = useProgress();
  const { isPro } = usePro();
  const todayPlan = plans.find((p) => p.id === 'beginner') ?? plans[0];
  const moves = todayPlan.exerciseIds
    .map((id) => exercises.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const dayNumber = totalWorkouts + 1;

  const startToday = () => {
    if (!todayPlan) return;
    router.push({
      pathname: '/workout/[id]',
      params: { id: todayPlan.exerciseIds[0], ids: todayPlan.exerciseIds.join(',') },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={TAB_EDGES}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} testID="home">
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.greeting}>Welcome back</Text>
            <Text style={styles.title} accessibilityRole="header">Today</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isPro ? 'Momentum Pro is active' : 'Momentum Pro'}
            style={styles.proPill}
            onPress={() => router.push('/paywall')}
            testID="open-paywall"
          >
            <Ionicons name={isPro ? 'checkmark-circle' : 'lock-closed'} size={16} color={color.pinkDeep} />
            <Text style={styles.proText}>{isPro ? 'Pro on' : 'Pro'}</Text>
          </Pressable>
        </View>

        <View style={styles.hero}>
          <View style={[styles.band, { backgroundColor: todayPlan.accent }]} />
          <View style={styles.heroBody}>
            <Text style={styles.dayLabel}>{loading ? 'Today' : `Day ${dayNumber}`}</Text>
            <Text style={styles.heroTitle}>{todayPlan.name}</Text>
            <Text style={styles.heroMeta}>
              {formatSessionLength(moves.length)} · {moves.length} exercises
            </Text>
            <Text style={styles.heroSub}>
              {planLevel(moves.map((move) => move.difficulty))} · {planEquipment(moves.map((move) => move.equipment))}
            </Text>
            <Pressable accessibilityRole="button" style={styles.startBtn} onPress={startToday} testID="start-workout">
              <Ionicons name="play" size={22} color={color.ink} />
              <Text style={styles.startText}>Start</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.section}>This week</Text>
        <View style={styles.card}>
          <WeekStrip completedDays={completedDays} size={40} />
          <Text style={styles.caption}>
            {loading ? 'Loading history' : `${streak} day streak · ${totalWorkouts} ${totalWorkouts === 1 ? 'workout' : 'workouts'} on this iPhone`}
          </Text>
        </View>

        <Text style={styles.section}>Last 30 days</Text>
        <View style={styles.card}>
          <MonthStrip completedDays={completedDays} />
        </View>

        <Text style={styles.section}>Quick actions</Text>
        <View style={styles.actions}>
          <Pressable accessibilityRole="button" style={styles.action} onPress={() => router.push('/(tabs)/workouts')}>
            <Ionicons name="barbell" size={22} color={color.pinkDeep} />
            <Text style={styles.actionText}>Browse</Text>
          </Pressable>
          <Pressable accessibilityRole="button" style={styles.action} onPress={() => router.push('/(tabs)/plans')}>
            <Ionicons name="calendar" size={22} color={color.pinkDeep} />
            <Text style={styles.actionText}>Plans</Text>
          </Pressable>
          <Pressable accessibilityRole="button" style={styles.action} onPress={() => router.push('/(tabs)/progress')}>
            <Ionicons name="stats-chart" size={22} color={color.pinkDeep} />
            <Text style={styles.actionText}>Progress</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg },
  container: { flex: 1, backgroundColor: color.bg },
  content: { padding: space.xl, paddingTop: space.lg, paddingBottom: space.xxl },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: space.md },
  headerCopy: { flex: 1 },
  greeting: { fontSize: type.body, color: color.muted },
  title: { fontSize: type.display, fontWeight: '800', color: color.ink, marginTop: space.xs },
  proPill: {
    minHeight: hit,
    paddingHorizontal: space.lg,
    borderRadius: 999,
    backgroundColor: color.card,
    borderWidth: 1,
    borderColor: color.blush,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  proText: { color: color.pinkDeep, fontWeight: '700', fontSize: type.label },
  hero: {
    marginTop: space.xl,
    backgroundColor: color.card,
    borderRadius: 24,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  band: { width: 10 },
  heroBody: { flex: 1, padding: space.xl },
  dayLabel: { color: color.pinkDeep, fontWeight: '700', fontSize: type.label },
  heroTitle: { color: color.ink, fontSize: type.headline, fontWeight: '800', marginTop: space.xs },
  heroMeta: { color: color.ink, fontSize: type.body, fontWeight: '600', marginTop: space.sm },
  heroSub: { color: color.muted, fontSize: type.label, marginTop: space.xs, lineHeight: 22 },
  startBtn: {
    marginTop: space.lg,
    minHeight: 56,
    borderRadius: 16,
    backgroundColor: color.pink,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
  },
  startText: { color: color.ink, fontWeight: '800', fontSize: type.body },
  section: { fontSize: type.headline, fontWeight: '800', color: color.ink, marginTop: space.xxl, marginBottom: space.md },
  card: { backgroundColor: color.card, borderRadius: 20, padding: space.lg },
  caption: { color: color.muted, fontSize: type.caption, marginTop: space.md, lineHeight: 18 },
  actions: { flexDirection: 'row', gap: space.md },
  action: {
    flex: 1,
    minHeight: 72,
    backgroundColor: color.card,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    padding: space.md,
  },
  actionText: { fontWeight: '700', color: color.ink, fontSize: type.caption },
});
