import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Body, Heading, IconButton, Photo, PrimaryButton } from '../../components/ui';
import { usePlan } from '../../context/PlanContext';
import { programmeById } from '../../data/programmes';
import { photos } from '../../lib/photos';
import { DAY_SHORT } from '../../lib/week';
import { color, font } from '../../lib/theme';

export default function ProgrammeDetail() {
  const router = useRouter();
  const plan = usePlan();
  const { id } = useLocalSearchParams<{ id: string }>();
  const p = programmeById(id);
  if (!p) return null;
  const choose = async () => {
    await plan.chooseProgramme(p.id);
    router.replace(plan.onboarded ? '/(tabs)' : '/onboarding/benefits');
  };
  return (
    <View style={{ flex: 1, backgroundColor: color.bg }} testID="programme-detail">
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Photo source={photos[p.photo]} label={`${p.name} programme`} style={{ height: 300 }} />
        <View style={{ padding: 20, gap: 12 }}>
          <Text style={{ fontFamily: font.semi, fontSize: 13, color: color.accent }}>{p.tagline} · {p.length} min · 4 weeks</Text>
          <Heading size={34}>{p.name}</Heading>
          <Body>{p.description}</Body>
          <Text style={{ fontFamily: font.semi, fontSize: 15, color: color.text, paddingTop: 8 }}>Week 1</Text>
          {p.weeks[0].map((d, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: color.line }}>
              <Text style={{ width: 40, fontFamily: font.semi, fontSize: 13, color: color.muted }}>{DAY_SHORT[i]}</Text>
              <Text style={{ flex: 1, fontFamily: font.medium, fontSize: 15, color: color.text }}>{d.rest ? 'Rest day' : d.session.title}</Text>
              {d.rest ? null : <Text style={{ fontFamily: font.body, fontSize: 13, color: color.muted }}>{d.session.minutes} min</Text>}
            </View>
          ))}
        </View>
      </ScrollView>
      <SafeAreaView edges={['top']} style={{ position: 'absolute', top: 0, left: 16 }}>
        <IconButton name="chevron-back" label="Back" onPress={() => router.back()} testID="programme-back" />
      </SafeAreaView>
      <SafeAreaView edges={['bottom']} style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 }}>
        <PrimaryButton label={`Choose ${p.name}`} testID="programme-choose" onPress={choose} />
      </SafeAreaView>
    </View>
  );
}
