import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { visibleExercises, categories } from '../../data/exercises';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { color, hit, space, type } from '../../lib/theme';

const TAB_EDGES = ['top', 'left', 'right'] as const;

const BAND: Record<string, string> = {
  'Lower Body': color.pink,
  'Upper Body': color.coral,
  Core: color.pinkDeep,
  'Full Body': '#E56B8A',
};

export default function WorkoutsScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();
  const filtered = selected ? visibleExercises.filter((exercise) => exercise.category === selected) : visibleExercises;

  return (
    <SafeAreaView style={styles.safe} edges={TAB_EDGES}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} testID="library">
        <Text style={styles.title} accessibilityRole="header">Library</Text>
        <Text style={styles.subtitle}>Pick a move. The cue and the illustration are on the next screen.</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          <Pressable accessibilityRole="button" style={[styles.chip, !selected && styles.chipActive]} onPress={() => setSelected(null)}>
            <Text style={[styles.chipText, !selected && styles.chipTextActive]}>All</Text>
          </Pressable>
          {categories.map((cat) => (
            <Pressable
              accessibilityRole="button"
              key={cat}
              style={[styles.chip, selected === cat && styles.chipActive]}
              onPress={() => setSelected(cat)}
            >
              <Text style={[styles.chipText, selected === cat && styles.chipTextActive]}>{cat}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.count}>{filtered.length} exercises</Text>

        {filtered.map((exercise) => (
          <Pressable
            accessibilityRole="button"
            key={exercise.id}
            style={styles.card}
            onPress={() => router.push(`/workout/${exercise.id}`)}
          >
            <View style={[styles.band, { backgroundColor: BAND[exercise.category] || color.pink }]} />
            <View style={styles.body}>
              <View style={styles.cardHeader}>
                <Text style={styles.name}>{exercise.name}</Text>
                <Text style={styles.difficulty}>{exercise.difficulty}</Text>
              </View>
              <Text style={styles.cue}>{exercise.description}</Text>
              <Text style={styles.meta}>{exercise.equipment} · {exercise.category}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg },
  container: { flex: 1, backgroundColor: color.bg },
  content: { padding: space.xl, paddingTop: space.lg, paddingBottom: space.xxl },
  title: { fontSize: type.display, fontWeight: '800', color: color.ink },
  subtitle: { fontSize: type.body, color: color.muted, marginTop: space.sm, marginBottom: space.lg, lineHeight: 24 },
  filters: { paddingBottom: space.md, gap: space.sm },
  chip: {
    minHeight: hit,
    backgroundColor: color.card,
    paddingHorizontal: space.lg,
    borderRadius: 999,
    marginRight: space.sm,
    borderWidth: 1,
    borderColor: color.blush,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: color.pink, borderColor: color.pink },
  chipText: { color: color.pinkDeep, fontWeight: '700', fontSize: type.label },
  chipTextActive: { color: color.ink },
  count: { fontSize: type.caption, color: color.muted, marginBottom: space.md, fontWeight: '600' },
  card: {
    backgroundColor: color.card,
    borderRadius: 18,
    marginBottom: space.md,
    flexDirection: 'row',
    overflow: 'hidden',
    minHeight: 88,
  },
  band: { width: 8 },
  body: { flex: 1, padding: space.lg },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: space.sm },
  name: { fontSize: type.body, fontWeight: '800', color: color.ink, flex: 1 },
  difficulty: { fontSize: type.caption, color: color.pinkDeep, fontWeight: '700' },
  cue: { fontSize: type.label, color: color.ink, marginTop: space.sm, lineHeight: 22 },
  meta: { fontSize: type.caption, color: color.muted, marginTop: space.sm },
});
