import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconButton, PrimaryButton, Tick } from '../../components/ui';
import { LENGTHS, STYLES, matchProgrammes } from '../../data/programmes';
import { usePlan } from '../../context/PlanContext';
import { color, font } from '../../lib/theme';

function Row({ label, on, onPress, testID }: { label: string; on: boolean; onPress: () => void; testID: string }) {
  return (
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: on }} accessibilityLabel={label} testID={testID} onPress={onPress} style={{ minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Text style={{ fontFamily: font.medium, fontSize: 16, color: color.text }}>{label}</Text>
      <Tick on={on} />
    </Pressable>
  );
}

function Section({ title, hint }: { title: string; hint: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, paddingTop: 16, paddingBottom: 6 }}>
      <Text style={{ fontFamily: font.semi, fontSize: 17, color: color.text }}>{title}</Text>
      <Text style={{ fontFamily: font.body, fontSize: 12, color: color.muted }}>{hint}</Text>
    </View>
  );
}

export default function Filter() {
  const router = useRouter();
  const plan = usePlan();
  const [styles, setStyles] = useState<string[]>(plan.styles);
  const [length, setLength] = useState<number | null>(plan.length);
  const count = matchProgrammes(styles, length).length;

  const toggle = (s: string) =>
    setStyles((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : cur.length >= 3 ? cur : [...cur, s]));

  const apply = () => {
    plan.setFilters(styles, length);
    router.push('/onboarding/programmes');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.bg }} testID="filter">
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: color.line }}>
        <IconButton name="close" label="Close" onPress={() => router.back()} bg="transparent" testID="filter-close" />
        <Text style={{ fontFamily: font.semi, fontSize: 16, color: color.text }}>Filter</Text>
        <Pressable accessibilityRole="button" testID="filter-reset" onPress={() => { setStyles([]); setLength(null); }} style={{ minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 }}>
          <Text style={{ fontFamily: font.semi, fontSize: 14, color: color.accent }}>Reset</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16 }}>
        <Section title="Training style" hint="select up to 3" />
        {STYLES.map((s) => <Row key={s} label={s} on={styles.includes(s)} onPress={() => toggle(s)} testID={`style-${s}`} />)}
        <View style={{ height: 1, backgroundColor: color.line, marginTop: 8 }} />
        <Section title="Workout length" hint="select 1" />
        {LENGTHS.map((l) => <Row key={l} label={`${l} minutes`} on={length === l} onPress={() => setLength(length === l ? null : l)} testID={`length-${l}`} />)}
      </ScrollView>
      <View style={{ paddingHorizontal: 20, paddingBottom: 12, paddingTop: 8 }}>
        <PrimaryButton testID="filter-apply" label={count === 0 ? 'No match, show all programmes' : `Show ${count} programme${count === 1 ? '' : 's'}`} onPress={apply} />
      </View>
    </SafeAreaView>
  );
}
