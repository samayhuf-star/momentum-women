import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Body, Heading, PrimaryButton } from '../components/ui';
import { usePlan } from '../context/PlanContext';
import { color } from '../lib/theme';

export default function PlanActive() {
  const router = useRouter();
  const plan = usePlan();
  const go = async () => {
    if (!plan.onboarded) await plan.finishOnboarding();
    router.replace('/(tabs)');
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.bg }} testID="plan-active">
      <View style={{ flex: 1, alignItems: 'center', paddingTop: 72, paddingHorizontal: 24, gap: 28 }}>
        <Heading size={36}>You're in</Heading>
        <View style={{ width: 180, height: 180, borderRadius: 90, backgroundColor: color.accent, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="checkmark" size={96} color={color.onAccent} />
        </View>
        <Body muted={false} size={17} style={{ textAlign: 'center', maxWidth: 280 }}>Your plan is active. Welcome to Momentum Women.</Body>
      </View>
      <View style={{ paddingHorizontal: 24, paddingBottom: 12 }}>
        <PrimaryButton label="Continue" testID="plan-active-continue" onPress={go} />
      </View>
    </SafeAreaView>
  );
}
