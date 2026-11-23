import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Heading, Tick } from '../../components/ui';
import { usePlan } from '../../context/PlanContext';
import { useProgress } from '../../context/ProgressContext';
import { WEEKS, programmeById } from '../../data/programmes';
import { DAY_SHORT, dayIndex, weekDates, weekIndex } from '../../lib/week';
import { color, font } from '../../lib/theme';

export default function Plan() {
  const router = useRouter();
  const plan = usePlan();
  const { completedSessions } = useProgress();
  const programme = programmeById(plan.programmeId);
  if (!programme) return <Redirect href="/onboarding/find" />;

  const week = weekIndex(plan.startKey, WEEKS);
  const today = dayIndex();
  const dates = weekDates();

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: color.bg }} testID="plan">
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 24 }}>
        <View style={{ gap: 4, paddingTop: 12 }}>
          <Text style={{ fontFamily: font.semi, fontSize: 13, color: color.accent }}>{programme.name} · Week {week + 1} of {WEEKS}</Text>
          <Heading size={30}>This week</Heading>
        </View>
        <View style={{ gap: 8 }}>
          {programme.weeks[week].map((d, i) => {
            const done = !d.rest && completedSessions.includes(d.session.key);
            const body = (
              <View style={{ minHeight: 68, borderRadius: 16, backgroundColor: color.card, borderWidth: 1.5, borderColor: i === today ? color.accent : color.card, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <View style={{ width: 40, alignItems: 'center' }}>
                  <Text style={{ fontFamily: font.semi, fontSize: 11, color: color.muted }}>{DAY_SHORT[i].toUpperCase()}</Text>
                  <Text style={{ fontFamily: font.semi, fontSize: 17, color: color.text }}>{dates[i].getDate()}</Text>
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={{ fontFamily: font.semi, fontSize: 15, color: color.text }}>{d.rest ? 'Rest day' : d.session.title}</Text>
                  <Text style={{ fontFamily: font.body, fontSize: 12, color: color.muted }}>{d.rest ? d.note : `${d.session.equipment} · ${d.session.minutes} min`}</Text>
                </View>
                {d.rest ? null : done ? <Tick on size={28} /> : <Ionicons name="chevron-forward" size={18} color={color.text} />}
              </View>
            );
            return d.rest ? (
              <View key={i} testID={`plan-day-${i}`}>{body}</View>
            ) : (
              <Pressable key={i} accessibilityRole="button" accessibilityLabel={`${DAY_SHORT[i]}. ${d.session.title}`} testID={`plan-day-${i}`} onPress={() => router.push({ pathname: '/workout/[id]', params: { id: d.session.key } })}>
                {body}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
