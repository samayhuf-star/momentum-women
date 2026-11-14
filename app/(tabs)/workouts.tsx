import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { visibleExercises, categories } from '../../data/exercises';
import { useState } from 'react';
import { useRouter } from 'expo-router';

const TAB_EDGES = ['top', 'left', 'right'] as const;

export default function WorkoutsScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  const filtered = selected ? visibleExercises.filter((e) => e.category === selected) : visibleExercises;

  return (
    <SafeAreaView style={styles.safe} edges={TAB_EDGES}>
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Library</Text>
      <Text style={styles.subtitle}>Browse exercises and start one at a time</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
        <Pressable accessibilityRole="button" style={[styles.chip, !selected && styles.chipActive]} onPress={() => setSelected(null)}>
          <Text style={[styles.chipText, !selected && styles.chipTextActive]}>All</Text>
        </Pressable>
        {categories.map((cat) => (
          <Pressable accessibilityRole="button"
            key={cat}
            style={[styles.chip, selected === cat && styles.chipActive]}
            onPress={() => setSelected(cat)}
          >
            <Text style={[styles.chipText, selected === cat && styles.chipTextActive]}>{cat}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.count}>{filtered.length} exercises</Text>

      {filtered.map((ex) => (
        <Pressable accessibilityRole="button" key={ex.id} style={styles.card} onPress={() => router.push(`/workout/${ex.id}`)}>
          <View style={styles.cardHeader}>
            <Text style={styles.name}>{ex.name}</Text>
            <Text style={styles.difficulty}>{ex.difficulty}</Text>
          </View>
          <Text style={styles.muscles}>{ex.muscles.join(' · ')}</Text>
          <Text style={styles.meta}>{ex.equipment} · {ex.category}</Text>
          <Text style={styles.desc}>{ex.description}</Text>
        </Pressable>
      ))}
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF5F8' },
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  content: { padding: 20, paddingTop: 16, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', color: '#1A1A1A' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 4, marginBottom: 16 },
  filters: { marginBottom: 12 },
  chip: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#FFE0EB',
  },
  chipActive: { backgroundColor: '#FF6B9D', borderColor: '#FF6B9D' },
  chipText: { color: '#FF6B9D', fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  count: { fontSize: 14, color: '#888', marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 17, fontWeight: '700', color: '#1A1A1A', flex: 1 },
  difficulty: { fontSize: 12, color: '#FF6B9D', fontWeight: '600' },
  muscles: { fontSize: 13, color: '#FF6B9D', marginTop: 4 },
  meta: { fontSize: 12, color: '#888', marginTop: 2 },
  desc: { fontSize: 14, color: '#444', marginTop: 8, lineHeight: 20 },
});
