import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { visiblePlans as plans } from '../../data/exercises';
import { usePro } from '../../context/ProContext';

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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Plans</Text>
      <Text style={styles.subtitle}>Sessions built from the exercise library</Text>
      {plans.map((plan) => {
        const locked = plan.isPro && !isPro;
        return (
          <Pressable accessibilityRole="button" key={plan.id} style={styles.card} onPress={() => openPlan(plan)} testID={`plan-${plan.id}`}>
            <Text style={styles.name}>{plan.name}{locked ? ' · Pro' : ''}</Text>
            <Text style={styles.desc}>{plan.description}</Text>
            <Text style={styles.meta}>{plan.exerciseIds.length} exercises</Text>
          </Pressable>
        );
      })}
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF5F8' },
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  content: { padding: 24, paddingTop: 16, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 8, marginBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12 },
  name: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  desc: { fontSize: 14, color: '#666', marginTop: 6, lineHeight: 20 },
  meta: { fontSize: 13, color: '#FF6B9D', marginTop: 8, fontWeight: '600' },
});
