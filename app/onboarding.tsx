import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { setPushConsent } from '../lib/onesignal';
import { color, hit } from '../lib/theme';

/** Total onboarding screens, including the paywall that ends the flow (read by the panel). */
export const ONBOARDING_SCREENS = 10;
export const ONBOARDING_DONE_KEY = '@momentum_onboarding_done';
const ANSWERS_KEY = '@momentum_onboarding_answers';

type Choice = { key: string; options: string[]; multi?: boolean };
type Step = { title: string; body: string; choice?: Choice; reminders?: boolean };

// Screens 1-9 live here; screen 10 is the paywall.
const STEPS: Step[] = [
  {
    title: 'Welcome to Momentum',
    body: 'Short guided workouts built for women. A timer or rep counter for every move, with form cues. No account needed.',
  },
  {
    title: 'What is your main goal?',
    body: 'We use this to suggest your first plan.',
    choice: { key: 'goal', options: ['Get stronger', 'Tone up', 'Build a habit', 'Feel more energetic'] },
  },
  {
    title: 'How experienced are you?',
    body: 'Be honest, every plan can be scaled.',
    choice: { key: 'level', options: ['New to training', 'Some experience', 'Train regularly'] },
  },
  {
    title: 'Where will you train?',
    body: 'Most sessions need no equipment.',
    choice: { key: 'place', options: ['At home', 'At the gym', 'Both'] },
  },
  {
    title: 'How long per session?',
    body: 'Pick what fits a normal day.',
    choice: { key: 'minutes', options: ['10 minutes', '20 minutes', '30+ minutes'] },
  },
  {
    title: 'How many days a week?',
    body: 'Consistency beats intensity.',
    choice: { key: 'days', options: ['2 days', '3 days', '4 days', '5 days'] },
  },
  {
    title: 'Which areas do you want to focus on?',
    body: 'Choose any that apply.',
    choice: { key: 'focus', options: ['Legs and glutes', 'Core', 'Arms and back', 'Full body'], multi: true },
  },
  {
    title: 'Stay on track with reminders',
    body: 'Get a gentle nudge on your training days. You can change this anytime in Settings.',
    reminders: true,
  },
  {
    title: 'Your plan is ready',
    body: 'Your first session is waiting on the Today tab. Your streak and progress stay on this device.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { user, loginAsGuest } = useAuth();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [busy, setBusy] = useState(false);
  const step = STEPS[index];
  const picked = step.choice ? answers[step.choice.key] ?? [] : [];

  const toggle = (opt: string) => {
    const c = step.choice!;
    setAnswers((prev) => {
      const cur = prev[c.key] ?? [];
      const next = c.multi ? (cur.includes(opt) ? cur.filter((o) => o !== opt) : [...cur, opt]) : [opt];
      return { ...prev, [c.key]: next };
    });
  };

  const finish = async () => {
    setBusy(true);
    try {
      await AsyncStorage.multiSet([
        [ANSWERS_KEY, JSON.stringify(answers)],
        [ONBOARDING_DONE_KEY, 'yes'],
      ]);
    } catch {}
    if (!user) await loginAsGuest();
    router.replace({ pathname: '/paywall', params: { from: 'onboarding' } });
  };

  const next = async (pushYes?: boolean) => {
    if (busy) return;
    if (step.reminders) await setPushConsent(!!pushYes);
    if (index < STEPS.length - 1) setIndex(index + 1);
    else await finish();
  };

  const canContinue = !step.choice || picked.length > 0;

  return (
    <SafeAreaView style={styles.container} testID={`onboarding-${index + 1}`}>
      <View style={styles.progress}>
        {Array.from({ length: ONBOARDING_SCREENS }).map((_, i) => (
          <View key={i} style={[styles.dot, i <= index && styles.dotOn]} />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {index === 0 ? (
          <LinearGradient colors={[color.pink, color.coral]} style={styles.hero}>
            <Text style={styles.heroText}>Momentum</Text>
          </LinearGradient>
        ) : null}
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.body}>{step.body}</Text>

        {step.choice?.options.map((opt) => {
          const on = picked.includes(opt);
          return (
            <Pressable
              key={opt}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              style={[styles.option, on && styles.optionOn]}
              onPress={() => toggle(opt)}
            >
              <Text style={[styles.optionText, on && styles.optionTextOn]}>{opt}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        {step.reminders ? (
          <>
            <Pressable accessibilityRole="button" style={styles.cta} onPress={() => next(true)} testID="reminders-yes">
              <Text style={styles.ctaText}>Turn on reminders</Text>
            </Pressable>
            <Pressable accessibilityRole="button" style={styles.skip} onPress={() => next(false)} testID="reminders-no">
              <Text style={styles.skipText}>Not now</Text>
            </Pressable>
          </>
        ) : (
          <Pressable
            accessibilityRole="button"
            style={[styles.cta, !canContinue && styles.ctaOff]}
            disabled={!canContinue || busy}
            onPress={() => next()}
            testID="onboarding-next"
          >
            <Text style={styles.ctaText}>{index === 0 ? 'Get started' : 'Continue'}</Text>
          </Pressable>
        )}
        {index > 0 ? (
          <Pressable accessibilityRole="button" style={styles.skip} onPress={() => setIndex(index - 1)}>
            <Text style={styles.skipText}>Back</Text>
          </Pressable>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.bg },
  progress: { flexDirection: 'row', gap: 4, paddingHorizontal: 20, paddingTop: 12 },
  dot: { flex: 1, height: 4, borderRadius: 2, backgroundColor: color.track },
  dotOn: { backgroundColor: color.pink },
  content: { padding: 24, paddingTop: 32 },
  hero: { borderRadius: 24, paddingVertical: 48, alignItems: 'center', marginBottom: 28 },
  heroText: { color: '#fff', fontSize: 40, fontWeight: '800' },
  title: { fontSize: 28, fontWeight: '700', color: color.ink },
  body: { fontSize: 17, color: color.muted, marginTop: 10, marginBottom: 24, lineHeight: 24 },
  option: {
    minHeight: hit + 12,
    borderRadius: 16,
    backgroundColor: color.card,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  optionOn: { borderColor: color.pink, backgroundColor: color.blush },
  optionText: { fontSize: 17, color: color.ink },
  optionTextOn: { fontWeight: '700', color: color.pinkDeep },
  footer: { padding: 20, paddingBottom: 12 },
  cta: { backgroundColor: color.pink, borderRadius: 16, minHeight: hit + 12, alignItems: 'center', justifyContent: 'center' },
  ctaOff: { opacity: 0.4 },
  ctaText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  skip: { minHeight: hit, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  skipText: { color: color.pinkDeep, fontSize: 16, fontWeight: '600' },
});
