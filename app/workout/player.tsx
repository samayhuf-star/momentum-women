import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ExerciseMedia from '../../components/ExerciseMedia';
import { IconButton, PrimaryButton } from '../../components/ui';
import { useProgress } from '../../context/ProgressContext';
import { findSession, stepsFor } from '../../data/programmes';
import { formatClock } from '../../lib/sessionMeta';
import { color, font } from '../../lib/theme';

function Stepper({ label, value, onChange, step, unit, testID }: { label: string; value: number; onChange: (v: number) => void; step: number; unit: string; testID: string }) {
  return (
    <View style={{ flex: 1, gap: 6 }}>
      <Text style={{ fontFamily: font.medium, fontSize: 12, color: color.muted }}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 14, backgroundColor: color.raised }}>
        <IconButton name="remove" label={`Less ${label}`} bg="transparent" onPress={() => onChange(Math.max(0, value - step))} testID={`${testID}-minus`} />
        <Text style={{ fontFamily: font.semi, fontSize: 16, color: color.text }} testID={`${testID}-value`}>{value} {unit}</Text>
        <IconButton name="add" label={`More ${label}`} bg="transparent" onPress={() => onChange(value + step)} testID={`${testID}-plus`} />
      </View>
    </View>
  );
}

export default function Player() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const session = findSession(String(id));
  const steps = useMemo(() => (session ? stepsFor(session) : []), [session]);
  const { completeWorkout, logSet } = useProgress();

  const [index, setIndex] = useState(0);
  const [left, setLeft] = useState(steps[0]?.move.secs ?? 0);
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [reps, setReps] = useState(steps[0]?.move.reps ?? 0);
  const [weight, setWeight] = useState(0);
  const [journal, setJournal] = useState(false);
  const logged = useRef(0);
  const finished = useRef(false);

  const step = steps[index];
  const timed = !!step?.move.secs;

  const finish = async () => {
    if (finished.current || !session) return;
    finished.current = true;
    await completeWorkout(elapsed, { key: session.key, moves: new Set(steps.map((s) => s.move.id)).size, sets: steps.length });
    router.replace({ pathname: '/workout/done', params: { id: session.key } });
  };

  const goTo = (n: number) => {
    if (n >= steps.length) {
      finish();
      return;
    }
    setIndex(n);
    setLeft(steps[n].move.secs ?? 0);
    setReps(steps[n].move.reps ?? 0);
    setJournal(false);
  };

  const next = async () => {
    if (step && !timed) {
      await logSet(step.move.id, reps, weight);
      logged.current += 1;
    }
    goTo(index + 1);
  };

  useEffect(() => {
    if (paused || !step) return undefined;
    const t = setInterval(() => {
      setElapsed((e) => e + 1);
      if (timed) setLeft((l) => Math.max(0, l - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [paused, timed, step]);

  useEffect(() => {
    if (timed && left === 0 && step) goTo(index + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left, timed]);

  if (!session || !step) return null;

  const blockSteps = steps.map((s, n) => ({ s, n })).filter(({ s }) => s.blockIndex === step.blockIndex && s.round === step.round);
  const percent = Math.round((index / steps.length) * 100);
  const skipSection = () => {
    const n = steps.findIndex((s, i) => i > index && s.blockIndex !== step.blockIndex);
    goTo(n === -1 ? steps.length : n);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.bg }} testID="player">
      <View style={{ paddingHorizontal: 16, gap: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <IconButton name="close" label="End workout" bg="transparent" onPress={() => router.back()} testID="player-close" />
          <Text style={{ fontFamily: font.head, fontSize: 16, color: color.text }} testID="player-progress">{formatClock(elapsed)} · {percent}%</Text>
          <Pressable accessibilityRole="button" testID="player-skip-section" onPress={skipSection} style={{ minHeight: 44, justifyContent: 'center' }}>
            <Text style={{ fontFamily: font.semi, fontSize: 14, color: color.text }}>Skip section</Text>
          </Pressable>
        </View>
        <View style={{ height: 4, borderRadius: 2, backgroundColor: color.line }}>
          <View style={{ height: 4, borderRadius: 2, width: `${percent}%`, backgroundColor: color.accent }} />
        </View>
      </View>

      <View style={{ paddingHorizontal: 20, paddingTop: 14, gap: 6 }}>
        <Text style={{ fontFamily: font.head, fontSize: 20, textTransform: 'uppercase', color: color.text }}>{step.block}</Text>
        <Text style={{ fontFamily: font.medium, fontSize: 12, color: color.muted }}>Round {step.round}</Text>
      </View>
      <View style={{ paddingTop: 8 }}>
        {blockSteps.map(({ s, n }) => {
          const on = n === index;
          return (
            <View key={n} style={{ paddingVertical: 7, paddingHorizontal: 20, backgroundColor: on ? color.accent : 'transparent' }}>
              <Text style={{ fontFamily: font.semi, fontSize: 15, color: on ? color.onAccent : n < index ? color.muted : color.text }}>
                {s.exercise.name} <Text style={{ fontFamily: font.body, fontSize: 13 }}>· {s.move.secs ? `${s.move.secs} sec` : `${s.move.reps} reps`}</Text>
              </Text>
            </View>
          );
        })}
      </View>

      <View style={{ flex: 1, paddingHorizontal: 20, justifyContent: 'center' }}>
        <ExerciseMedia id={step.exercise.id} name={step.exercise.name} muscle={step.exercise.muscles[0]} testID="player-media" />
        <Text style={{ fontFamily: font.body, fontSize: 14, lineHeight: 20, color: color.muted, textAlign: 'center', paddingTop: 10 }}>{step.exercise.description}</Text>
      </View>

      <View style={{ paddingHorizontal: 20, paddingBottom: 12, gap: 12 }}>
        {journal && !timed ? (
          <View style={{ flexDirection: 'row', gap: 12 }} testID="player-journal">
            <Stepper label="Reps" value={reps} onChange={setReps} step={1} unit="" testID="journal-reps" />
            <Stepper label="Weight" value={weight} onChange={setWeight} step={1} unit="kg" testID="journal-weight" />
          </View>
        ) : null}
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <Text style={{ fontFamily: font.head, fontSize: 60, lineHeight: 62, color: color.text }} testID="player-count">{timed ? formatClock(left) : `${reps} reps`}</Text>
          {timed ? (
            <Pressable accessibilityRole="button" accessibilityLabel={paused ? 'Resume' : 'Pause'} testID="player-pause" onPress={() => setPaused((p) => !p)} style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: color.text, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={paused ? 'play' : 'pause'} size={26} color={color.onAccent} />
            </Pressable>
          ) : (
            <Pressable accessibilityRole="button" testID="player-journal-toggle" onPress={() => setJournal((j) => !j)} style={{ minHeight: 48, paddingHorizontal: 16, borderRadius: 24, borderWidth: 1, borderColor: color.line, backgroundColor: color.card, justifyContent: 'center' }}>
              <Text style={{ fontFamily: font.semi, fontSize: 14, color: color.accent }}>{journal ? 'Hide journal' : 'Log reps and weight'}</Text>
            </Pressable>
          )}
        </View>
        <PrimaryButton label={index === steps.length - 1 ? 'Finish workout' : timed ? 'Skip' : 'Done, next'} testID="player-next" onPress={next} />
      </View>
    </SafeAreaView>
  );
}
