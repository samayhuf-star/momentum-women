import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Body, Heading, Photo, SmallButton } from '../../components/ui';
import { matchProgrammes, programmes, type Programme } from '../../data/programmes';
import { usePlan } from '../../context/PlanContext';
import { photos } from '../../lib/photos';
import { color, font } from '../../lib/theme';

export default function Programmes() {
  const router = useRouter();
  const plan = usePlan();
  const matched = matchProgrammes(plan.styles, plan.length);
  const list: Programme[] = matched.length ? matched : programmes;

  const choose = async (id: string) => {
    await plan.chooseProgramme(id);
    router.push(plan.onboarded ? '/(tabs)' : '/onboarding/benefits');
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: color.bg }} testID="programmes">
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 40 }}>
        <View style={{ gap: 6 }}>
          <Heading size={20}>Pick your programme</Heading>
          <Body size={14}>Choose one to finish setup. You can switch at any time.</Body>
        </View>
        {list.map((p, i) => (
          <View key={p.id} style={{ borderRadius: 18, overflow: 'hidden', backgroundColor: color.card }}>
            <Photo source={photos[p.photo]} label={`${p.name} programme`} style={{ height: 230 }} />
            {i === 0 && matched.length ? (
              <View style={{ position: 'absolute', top: 12, right: 12, height: 26, paddingHorizontal: 10, borderRadius: 13, backgroundColor: color.accent, justifyContent: 'center' }}>
                <Text style={{ fontFamily: font.semi, fontSize: 12, color: color.onAccent }}>Your match</Text>
              </View>
            ) : null}
            <View style={{ padding: 18, alignItems: 'center', gap: 8 }}>
              <Text style={{ fontFamily: font.semi, fontSize: 14, color: color.muted }}>{p.tagline} · {p.length} min</Text>
              <Heading size={32} style={{ textAlign: 'center' }}>{p.name}</Heading>
              <Body size={14} style={{ textAlign: 'center' }}>{p.description}</Body>
              <View style={{ flexDirection: 'row', gap: 12, paddingTop: 8 }}>
                <SmallButton ghost label="See week 1" testID={`preview-${p.id}`} onPress={() => router.push({ pathname: '/programme/[id]', params: { id: p.id } })} />
                <SmallButton label="Try it" testID={`choose-${p.id}`} onPress={() => choose(p.id)} />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
