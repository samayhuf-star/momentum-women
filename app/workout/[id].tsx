import { View, Text, StyleSheet, Pressable, SafeAreaView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState, useEffect } from 'react';
import { exercises, visibleExercises } from '../../data/exercises';
import { useProgress } from '../../context/ProgressContext';
import ExerciseMedia from '../../components/ExerciseMedia';

export default function WorkoutPlayer() {
  const { id, ids } = useLocalSearchParams<{ id: string; ids?: string }>();
  const router = useRouter();
  const { completeWorkout } = useProgress();

  const list = useMemo(() => {
    const ordered = ids ? ids.split(',').filter(Boolean) : id ? [id] : [];
    const found = ordered
      .map((item) => visibleExercises.find((e) => e.id === item))
      .filter((e): e is NonNullable<typeof e> => Boolean(e));
    return found.length ? found : visibleExercises.slice(0, 1);
  }, [id, ids]);

  const [index, setIndex] = useState(0);
  const exercise = list[index] ?? list[0];
  const [mode, setMode] = useState<'timer' | 'reps'>('timer');
  const [timeLeft, setTimeLeft] = useState(40);
  const [reps, setReps] = useState(12);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setTimeLeft(40);
    setReps(12);
    setIsRunning(false);
  }, [index]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isRunning && mode === 'timer' && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, mode, timeLeft]);

  const finish = async () => {
    if (index + 1 < list.length) {
      setIndex(index + 1);
      return;
    }
    await completeWorkout();
    Alert.alert('Done', 'Workout complete. Progress saved on this device.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  if (!exercise) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.cue}>No exercises in this session.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} testID="workout">
      <Pressable style={styles.close} onPress={() => router.back()}>
        <Text style={styles.closeText}>Close</Text>
      </Pressable>

      <Text style={styles.category}>{exercise.category} · {index + 1} / {list.length}</Text>
      <Text style={styles.cue}>{exercise.description}</Text>

      <ExerciseMedia id={exercise.id} name={exercise.name} muscle={exercise.category} />

      <View style={styles.modeRow}>
        <Pressable style={[styles.modeBtn, mode === 'timer' && styles.modeActive]} onPress={() => setMode('timer')}>
          <Text style={[styles.modeText, mode === 'timer' && styles.modeTextActive]}>Timer</Text>
        </Pressable>
        <Pressable style={[styles.modeBtn, mode === 'reps' && styles.modeActive]} onPress={() => setMode('reps')}>
          <Text style={[styles.modeText, mode === 'reps' && styles.modeTextActive]}>Reps</Text>
        </Pressable>
      </View>

      {mode === 'timer' ? (
        <Text style={styles.timer}>
          {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
        </Text>
      ) : (
        <View style={styles.repRow}>
          <Pressable onPress={() => setReps((r) => Math.max(1, r - 1))}>
            <Text style={styles.repBtn}>−</Text>
          </Pressable>
          <Text style={styles.reps}>{reps}</Text>
          <Pressable onPress={() => setReps((r) => r + 1)}>
            <Text style={styles.repBtn}>+</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.btnRow}>
        <Pressable style={styles.skipBtn} onPress={() => setIsRunning(!isRunning)}>
          <Text style={styles.skipText}>{isRunning ? 'PAUSE' : 'START'}</Text>
        </Pressable>
        <Pressable style={styles.nextBtn} onPress={finish}>
          <Text style={styles.nextText}>{index + 1 < list.length ? 'NEXT' : 'FINISH'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8', padding: 20 },
  close: { alignSelf: 'flex-end', padding: 8 },
  closeText: { fontSize: 16, color: '#FF6B9D', fontWeight: '600' },
  category: { color: '#FF6B9D', fontWeight: '600' },
  cue: { color: '#666', marginTop: 12, fontSize: 15, lineHeight: 22 },
  modeRow: { flexDirection: 'row', marginTop: 16, gap: 12 },
  modeBtn: { flex: 1, padding: 12, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center' },
  modeActive: { backgroundColor: '#FF6B9D' },
  modeText: { color: '#1A1A1A', fontWeight: '600' },
  modeTextActive: { color: '#fff' },
  timer: { color: '#1A1A1A', fontSize: 56, fontWeight: '700', textAlign: 'center', marginVertical: 12 },
  repRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 12, gap: 24 },
  reps: { color: '#1A1A1A', fontSize: 48, fontWeight: '700' },
  repBtn: { color: '#FF6B9D', fontSize: 40, fontWeight: '700' },
  btnRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  skipBtn: { flex: 1, padding: 16, borderRadius: 16, backgroundColor: '#fff', alignItems: 'center' },
  skipText: { color: '#1A1A1A', fontWeight: '700' },
  nextBtn: { flex: 1, padding: 16, borderRadius: 16, backgroundColor: '#FF6B9D', alignItems: 'center' },
  nextText: { color: '#fff', fontWeight: '700' },
});
