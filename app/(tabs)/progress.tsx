import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Body, Heading } from '../../components/ui';
import { useProgress } from '../../context/ProgressContext';
import { exerciseById } from '../../data/programmes';
import { DAY_SHORT, dayKey, weekDates } from '../../lib/week';
import { color, font } from '../../lib/theme';

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={{ flex: 1, borderRadius: 16, backgroundColor: color.card, padding: 14, gap: 4 }}>
      <Text style={{ fontFamily: font.head, fontSize: 28, color: color.text }}>{value}</Text>
      <Text style={{ fontFamily: font.body, fontSize: 12, color: color.muted }}>{label}</Text>
    </View>
  );
}

export default function Progress() {
  const p = useProgress();
  const dates = weekDates();
  const perDay = dates.map((d) => p.minutesByDay[dayKey(d)] ?? 0);
  const thisWeek = dates.filter((d) => p.completedDays.includes(dayKey(d))).length;
  const top = Math.max(1, ...perDay);

  const bests = Object.entries(p.journal)
    .map(([id, entries]) => {
      const best = entries.reduce((a, b) => (b.weight > a.weight || (b.weight === a.weight && b.reps > a.reps) ? b : a), entries[0]);
      return { id, name: exerciseById(id)?.name ?? id, best, count: entries.length };
    })
    .filter((b) => b.best)
    .sort((a, b) => b.best.weight - a.best.weight)
    .slice(0, 6);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: color.bg }} testID="progress">
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 24 }}>
        <Heading size={30} style={{ paddingTop: 12 }}>Progress</Heading>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Stat value={String(thisWeek)} label="Workouts this week" />
          <Stat value={String(p.streak)} label="Day streak" />
          <Stat value={String(p.minutes)} label="Minutes trained" />
        </View>
        <View style={{ borderRadius: 16, backgroundColor: color.card, padding: 16, gap: 14 }}>
          <Text style={{ fontFamily: font.semi, fontSize: 15, color: color.text }}>Minutes per day</Text>
          <View style={{ height: 120, flexDirection: 'row', alignItems: 'flex-end', gap: 4 }} accessible accessibilityLabel={`Minutes this week: ${perDay.map((m, i) => `${DAY_SHORT[i]} ${m}`).join(', ')}`}>
            {perDay.map((m, i) => (
              <View key={i} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
                <View style={{ width: 22, height: m > 0 ? Math.max(8, Math.round((m / top) * 90)) : 6, borderRadius: 6, backgroundColor: m > 0 ? color.accent : color.raised }} />
                <Text style={{ fontFamily: font.semi, fontSize: 11, color: color.muted }}>{DAY_SHORT[i][0]}</Text>
              </View>
            ))}
          </View>
        </View>
        <View>
          <Text style={{ fontFamily: font.semi, fontSize: 15, color: color.text, paddingBottom: 4 }}>Personal bests</Text>
          {bests.length === 0 ? (
            <Body size={14} testID="progress-empty">Log reps and weight during a workout and your bests show up here.</Body>
          ) : (
            bests.map((b) => (
              <View key={b.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: color.line }}>
                <View style={{ gap: 2 }}>
                  <Text style={{ fontFamily: font.semi, fontSize: 15, color: color.text }}>{b.name}</Text>
                  <Text style={{ fontFamily: font.body, fontSize: 12, color: color.muted }}>{b.count} set{b.count === 1 ? '' : 's'} logged</Text>
                </View>
                <Text style={{ fontFamily: font.semi, fontSize: 15, color: color.accent }}>{b.best.weight > 0 ? `${b.best.weight} kg × ${b.best.reps}` : `${b.best.reps} reps`}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
