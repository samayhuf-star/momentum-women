import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Body, Heading, PrimaryButton, Wordmark } from '../../components/ui';
import { color, font } from '../../lib/theme';

const ITEMS: [keyof typeof Ionicons.glyphMap, string, string][] = [
  ['calendar-outline', 'A plan for every week', 'Four programmes, each with four weeks laid out day by day.'],
  ['play-circle-outline', 'Every move shown', 'Start and finish positions with a form cue and built-in timers.'],
  ['home-outline', 'Home or gym', 'Dumbbell and bodyweight sessions you can do anywhere.'],
  ['trending-up-outline', 'Progress journal', 'Log reps and weights and see your personal bests.'],
  ['notifications-outline', 'Reminders', 'A nudge on your training days, if you want one.'],
];

export default function Benefits() {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.bg }} testID="benefits">
      <ScrollView contentContainerStyle={{ padding: 24, gap: 24 }}>
        <View style={{ gap: 10, paddingTop: 16 }}>
          <Wordmark />
          <Heading size={34}>What you get</Heading>
        </View>
        {ITEMS.map(([icon, title, text]) => (
          <View key={title} style={{ flexDirection: 'row', gap: 14 }}>
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: color.card, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={icon} size={22} color={color.accent} />
            </View>
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={{ fontFamily: font.semi, fontSize: 16, color: color.text }}>{title}</Text>
              <Body size={14}>{text}</Body>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={{ paddingHorizontal: 24, paddingBottom: 12 }}>
        <PrimaryButton label="Continue" testID="benefits-continue" onPress={() => router.push('/onboarding/trial')} />
      </View>
    </SafeAreaView>
  );
}
