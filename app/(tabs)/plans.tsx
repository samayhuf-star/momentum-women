import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { exercises, visiblePlans as plans } from '../../data/exercises';
import { usePro } from '../../context/ProContext';
import { formatSessionLength, planEquipment, planLevel } from '../../lib/sessionMeta';
import { color, hit, space, type } from '../../lib/theme';

const TAB_EDGES = ['top', 'left', 'right'] as const;

export default function PlansScreen() {
  const router = useRouter();
  const { isPro } = usePro();

  const openPlan = (plan: (typeof plans)[number]) => {
    if (plan.isPro && !isPro) {
      router.push('/paywall');
      return;
    }
    router.push({
      pathname: '/workout/[id]',
      params: { id: plan.exerciseIds[0], ids: plan.exerciseIds.join(',') },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={TAB_EDGES}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} testID="plans">
        <Text style={styles.title} accessibilityRole="header">Plans</Text>
        <Text style={styles.subtitle}>One session each, built from the exercise library</Text>
        {plans.map((plan) => {
          const locked = plan.isPro && !isPro;
          const moves = plan.exerciseIds
            .map((id) => exercises.find((item) => item.id === id))
            .filter((item): item is NonNullable<typeof item> => Boolean(item));
          return (
            <Pressable accessibilityRole="button" key={plan.id} style={styles.card} onPress={() => openPlan(plan)} testID={`plan-${plan.id}`}>
              <View style={[styles.band, { backgroundColor: plan.accent }]} />
              <View style={styles.body}>
                <View style={styles.titleRow}>
                  <Text style={styles.name}>{plan.name}</Text>
                  {plan.isPro ? (
                    <View style={styles.badge}>
                      <Ionicons name={locked ? 'lock-closed' : 'checkmark-circle'} size={14} color={color.pinkDeep} />
                      <Text style={styles.badgeText}>{locked ? 'Pro' : 'Unlocked'}</Text>
                    </View>
                  ) : (
                    <View style={styles.freeBadge}>
                      <Text style={styles.freeText}>Free</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.desc}>{plan.description}</Text>
                <Text style={styles.meta}>
                  {formatSessionLength(moves.length)} · {plan.sessions} {plan.sessions === 1 ? 'session' : 'sessions'} · {moves.length} exercises
                </Text>
                <Text style={styles.metaSecondary}>
                  {planLevel(moves.map((move) => move.difficulty))} · {planEquipment(moves.map((move) => move.equipment))}
                </Text>
              </View>
            </Pressable>
          );
        })}
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
  card: {
    backgroundColor: color.card,
    borderRadius: 20,
    marginBottom: space.md,
    flexDirection: 'row',
    overflow: 'hidden',
    minHeight: hit,
  },
  band: { width: 12 },
  body: { flex: 1, padding: space.lg },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.sm },
  name: { flex: 1, fontSize: type.headline, fontWeight: '800', color: color.ink },
  badge: {
    minHeight: 32,
    paddingHorizontal: space.md,
    borderRadius: 999,
    backgroundColor: color.blush,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  badgeText: { color: color.pinkDeep, fontWeight: '700', fontSize: type.caption },
  freeBadge: { minHeight: 32, paddingHorizontal: space.md, borderRadius: 999, backgroundColor: color.bg, justifyContent: 'center' },
  freeText: { color: color.ink, fontWeight: '700', fontSize: type.caption },
  desc: { fontSize: type.label, color: color.muted, marginTop: space.sm, lineHeight: 22 },
  meta: { fontSize: type.label, color: color.ink, fontWeight: '700', marginTop: space.md },
  metaSecondary: { fontSize: type.caption, color: color.muted, marginTop: space.xs, lineHeight: 18 },
});
