import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Body, PrimaryButton } from '../../components/ui';
import { color, font } from '../../lib/theme';

const STEPS = [
  ["Today: you're in", 'Your programme is chosen and your first week is ready.'],
  ['Now: welcome workout', 'A short first session so you can feel how the programme trains.'],
  ['Day 5: reminder', 'We remind you before your trial ends, if notifications are on.'],
  ['Day 7: trial ends', 'Your chosen plan starts. Cancel any time before then and you pay nothing.'],
];

export default function Trial() {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.bg }} testID="trial">
      <View style={{ flex: 1, padding: 24, paddingTop: 40, gap: 28 }}>
        <Text accessibilityRole="header" style={{ fontFamily: font.head, fontSize: 30, lineHeight: 34, color: color.text }}>
          How your <Text style={{ color: color.accent }}>free trial</Text> works
        </Text>
        <View>
          {STEPS.map(([title, text], i) => (
            <View key={title} style={{ flexDirection: 'row', gap: 16 }}>
              <View style={{ alignItems: 'center' }}>
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: i === 0 ? color.accent : color.raised, borderWidth: i === 0 ? 0 : 1.5, borderColor: color.line, alignItems: 'center', justifyContent: 'center' }}>
                  {i === 0 ? <Ionicons name="checkmark" size={18} color={color.onAccent} /> : null}
                </View>
                {i < STEPS.length - 1 ? <View style={{ flex: 1, width: 2, backgroundColor: color.line, marginVertical: 6 }} /> : null}
              </View>
              <View style={{ flex: 1, gap: 4, paddingBottom: 26 }}>
                <Text style={{ fontFamily: font.semi, fontSize: 17, color: color.text }}>{title}</Text>
                <Body size={14}>{text}</Body>
              </View>
            </View>
          ))}
        </View>
      </View>
      <View style={{ paddingHorizontal: 24, paddingBottom: 12 }}>
        <PrimaryButton label="Continue" testID="trial-continue" onPress={() => router.push('/paywall')} />
      </View>
    </SafeAreaView>
  );
}
