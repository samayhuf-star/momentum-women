import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CheckLine, Heading, PrimaryButton } from '../components/ui';
import { usePlan } from '../context/PlanContext';
import { color, font } from '../lib/theme';

export default function Started() {
  const router = useRouter();
  const plan = usePlan();
  const finish = async (reminders: boolean) => {
    await plan.setReminders(reminders);
    await plan.finishOnboarding();
    router.replace('/(tabs)');
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.bg }} testID="started">
      <View style={{ flex: 1, padding: 24, paddingTop: 40, gap: 30 }}>
        <View style={{ height: 196, borderRadius: 18, backgroundColor: color.accent, padding: 20, justifyContent: 'space-between' }}>
          <Text style={{ fontFamily: font.head, fontSize: 14, letterSpacing: 2, color: color.onAccent }}>MOMENTUM WOMEN</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <Heading size={26} style={{ color: color.onAccent }}>Free pass</Heading>
            <Text style={{ fontFamily: font.semi, fontSize: 14, color: color.onAccent }}>7 days</Text>
          </View>
        </View>
        <Text accessibilityRole="header" style={{ textAlign: 'center', fontFamily: font.head, fontSize: 30, lineHeight: 35, color: color.text }}>
          Your trial has started.{'\n'}<Text style={{ color: color.accent }}>Free for 7 days.</Text>
        </Text>
        <View style={{ gap: 12, paddingHorizontal: 8 }}>
          <CheckLine>Get a reminder before your trial ends</CheckLine>
          <CheckLine>Get a nudge on your training days</CheckLine>
          <CheckLine>Know when a new week starts</CheckLine>
        </View>
      </View>
      <View style={{ paddingHorizontal: 24, paddingBottom: 12, gap: 8 }}>
        <Pressable accessibilityRole="button" testID="started-later" onPress={() => finish(false)} style={{ minHeight: 48, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: font.head, fontSize: 13, letterSpacing: 0.8, textTransform: 'uppercase', color: color.muted }}>Maybe later</Text>
        </Pressable>
        <PrimaryButton label="Yes, remind me" testID="started-remind" onPress={() => finish(true)} />
      </View>
    </SafeAreaView>
  );
}
