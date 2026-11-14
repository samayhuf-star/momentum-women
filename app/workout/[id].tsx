import { View, Text, StyleSheet, Pressable, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState, useEffect } from 'react';
import { visibleExercises } from '../../data/exercises';
import { useProgress } from '../../context/ProgressContext';
import ExerciseMedia from '../../components/ExerciseMedia';
import { formatClock, SECONDS_PER_MOVE, sessionSeconds } from '../../lib/sessionMeta';
import { color, hit, space, type } from '../../lib/theme';

export default function WorkoutPlayer() {
  const { id, ids } = useLocalSearchParams<{ id: string; ids?: string }>();
  const router = useRouter();
  const { completeWorkout } = useProgress();

  const list = useMemo(() => {
    const ordered = ids ? ids.split(',').filter(Boolean) : id ? [id] : [];
    const found = ordered
      .map((item) => visibleExercises.find((exercise) => exercise.id === item))
      .filter((exercise): exercise is NonNullable<typeof exercise> => Boolean(exercise));
    return found.length ? found : visibleExercises.slice(0, 1);
  }, [id, ids]);

  const [index, setIndex] = useState(0);
  const exercise = list[index] ?? list[0];
  const upcoming = list[index + 1];
  const [mode, setMode] = useState<'timer' | 'reps'>('timer');
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_MOVE);
  const [reps, setReps] = useState(12);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setTimeLeft(SECONDS_PER_MOVE);
    setReps(12);
    setIsRunning(false);
  }, [index]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isRunning && mode === 'timer' && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((value) => value - 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, mode, timeLeft]);

  const remainingSeconds = mode === 'timer'
    ? timeLeft + Math.max(0, list.length - index - 1) * SECONDS_PER_MOVE
    : Math.max(1, list.length - index) * SECONDS_PER_MOVE;

  const goNext = async () => {
    if (index + 1 < list.length) {
      setIndex(index + 1);
      return;
    }
    await completeWorkout(sessionSeconds(list.length));
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
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.progressLabel}>Exercise {index + 1} of {list.length}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Close" style={styles.close} onPress={() => router.back()} testID="close-workout">
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
        <Text style={styles.timeLeft}>{formatClock(remainingSeconds)} left in this session</Text>

        <View style={styles.segments} accessibilityLabel={`Move ${index + 1} of ${list.length}`}>
          {list.map((item, itemIndex) => (
            <View
              key={item.id}
              style={[styles.segment, itemIndex <= index ? styles.segmentOn : styles.segmentOff]}
            />
          ))}
        </View>

        <Text style={styles.cue}>{exercise.description}</Text>
        <ExerciseMedia id={exercise.id} name={exercise.name} muscle={exercise.category} large />

        <View style={styles.nextUp}>
          <Text style={styles.nextLabel}>{upcoming ? 'Next up' : 'Last move'}</Text>
          <Text style={styles.nextName}>{upcoming ? upcoming.name : exercise.name}</Text>
        </View>

        <View style={styles.modeRow}>
          <Pressable accessibilityRole="button" style={[styles.modeBtn, mode === 'timer' && styles.modeActive]} onPress={() => setMode('timer')}>
            <Text style={[styles.modeText, mode === 'timer' && styles.modeTextActive]}>Timer</Text>
          </Pressable>
          <Pressable accessibilityRole="button" style={[styles.modeBtn, mode === 'reps' && styles.modeActive]} onPress={() => setMode('reps')}>
            <Text style={[styles.modeText, mode === 'reps' && styles.modeTextActive]}>Reps</Text>
          </Pressable>
        </View>

        {mode === 'timer' ? (
          <Text style={styles.timer} maxFontSizeMultiplier={1.3}>
            {formatClock(timeLeft)}
          </Text>
        ) : (
          <View style={styles.repRow}>
            <Pressable accessibilityRole="button" accessibilityLabel="Fewer reps" style={styles.repHit} onPress={() => setReps((value) => Math.max(1, value - 1))}>
              <Text style={styles.repBtn}>−</Text>
            </Pressable>
            <Text style={styles.reps} maxFontSizeMultiplier={1.3}>{reps}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="More reps" style={styles.repHit} onPress={() => setReps((value) => value + 1)}>
              <Text style={styles.repBtn}>+</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.controls}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Previous exercise"
            style={[styles.sideBtn, index === 0 && styles.sideDisabled]}
            disabled={index === 0}
            onPress={() => setIndex((value) => Math.max(0, value - 1))}
          >
            <Ionicons name="play-skip-back" size={26} color={color.ink} />
            <Text style={styles.sideText}>Previous</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            style={styles.primaryBtn}
            onPress={() => setIsRunning((value) => !value)}
          >
            <Ionicons name={isRunning ? 'pause' : 'play'} size={28} color={color.ink} />
            <Text style={styles.primaryText}>{isRunning ? 'Pause' : 'Start'}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" style={styles.sideBtn} onPress={goNext}>
            <Ionicons name={index + 1 < list.length ? 'play-skip-forward' : 'checkmark'} size={26} color={color.ink} />
            <Text style={styles.sideText}>{index + 1 < list.length ? 'Next' : 'Finish'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.bg },
  content: { padding: space.lg, paddingBottom: space.xxl },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.md },
  progressLabel: { flex: 1, color: color.ink, fontSize: type.headline, fontWeight: '800' },
  close: { minHeight: hit, minWidth: hit, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.sm },
  closeText: { fontSize: type.label, color: color.pinkDeep, fontWeight: '700' },
  timeLeft: { color: color.muted, fontSize: type.label, marginTop: space.xs },
  segments: { flexDirection: 'row', gap: space.xs, marginTop: space.md },
  segment: { flex: 1, height: 8, borderRadius: 4 },
  segmentOn: { backgroundColor: color.pink },
  segmentOff: { backgroundColor: color.track },
  cue: { color: color.ink, marginTop: space.lg, fontSize: type.body, lineHeight: 24 },
  nextUp: { marginTop: space.md, backgroundColor: color.card, borderRadius: 16, padding: space.md },
  nextLabel: { color: color.pinkDeep, fontWeight: '700', fontSize: type.caption },
  nextName: { color: color.ink, fontWeight: '800', fontSize: type.body, marginTop: space.xs },
  modeRow: { flexDirection: 'row', marginTop: space.lg, gap: space.md },
  modeBtn: { flex: 1, minHeight: hit, borderRadius: 14, backgroundColor: color.card, alignItems: 'center', justifyContent: 'center' },
  modeActive: { backgroundColor: color.pink },
  modeText: { color: color.ink, fontWeight: '700', fontSize: type.label },
  modeTextActive: { color: color.ink },
  timer: { color: color.ink, fontSize: 56, fontWeight: '800', textAlign: 'center', marginVertical: space.md },
  repRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: space.md, gap: space.xl },
  reps: { color: color.ink, fontSize: 48, fontWeight: '800', minWidth: 72, textAlign: 'center' },
  repHit: { minWidth: hit, minHeight: hit, alignItems: 'center', justifyContent: 'center' },
  repBtn: { color: color.pinkDeep, fontSize: 40, fontWeight: '700' },
  controls: { flexDirection: 'row', alignItems: 'stretch', gap: space.sm, marginTop: space.sm },
  sideBtn: {
    width: 92,
    minHeight: 72,
    borderRadius: 18,
    backgroundColor: color.card,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs,
    padding: space.sm,
  },
  sideDisabled: { opacity: 0.4 },
  sideText: { color: color.ink, fontWeight: '700', fontSize: type.caption },
  primaryBtn: {
    flex: 1,
    minHeight: 72,
    borderRadius: 18,
    backgroundColor: color.pink,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: space.sm,
  },
  primaryText: { color: color.ink, fontWeight: '800', fontSize: type.headline },
});
