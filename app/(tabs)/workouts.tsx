import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { exercises, categories } from '../../data/exercises';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function WorkoutsScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  const filtered = selected ? exercises.filter((e) => e.category === selected) : exercises;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Library</Text>
      <Text style={styles.subtitle}>Browse exercises and start one at a time</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
        <Pressable style={[styles.chip, !selected && styles.chipActive]} onPress={() => setSelected(null)}>
          <Text style={[styles.chipText, !selected && styles.chipTextActive]}>All</Text>
        </Pressable>
        {categories.map((cat) => (
          <Pressable
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
        <Pressable key={ex.id} style={styles.card} onPress={() => router.push(`/workout/${ex.id}`)}>
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
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
