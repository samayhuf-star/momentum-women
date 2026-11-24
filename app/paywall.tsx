import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconButton } from '../components/ui';
import { usePlan } from '../context/PlanContext';
import { usePro } from '../context/ProContext';
import { color, font } from '../lib/theme';

type Ui = typeof import('react-native-purchases-ui').default;

/** RevenueCat's native paywall is missing in Expo Go; load it lazily. */
function loadUi(): Ui | null {
  try {
    return (require('react-native-purchases-ui') as { default: Ui }).default;
  } catch {
    return null;
  }
}

/**
 * The paywall is RevenueCat's own, designed in the RevenueCat dashboard and attached to the `default` offering.
 * Price, trial, renewal text, Terms, Privacy and Restore all come from that paywall.
 */
export default function Paywall() {
  const router = useRouter();
  const plan = usePlan();
  const { refresh } = usePro();
  const Ui = loadUi();

  const leave = async (purchased: boolean) => {
    await refresh();
    if (!plan.onboarded) await plan.finishOnboarding();
    router.replace(purchased ? '/started' : '/(tabs)');
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: color.bg }} testID="paywall">
      {Ui ? (
        <Ui.Paywall
          style={{ flex: 1 }}
          options={{ displayCloseButton: true }}
          onPurchaseCompleted={() => leave(true)}
          onRestoreCompleted={() => leave(true)}
          onDismiss={() => leave(false)}
        />
      ) : (
        <View style={{ flex: 1, padding: 24, gap: 16, justifyContent: 'center' }}>
          <IconButton name="close" label="Close" bg="transparent" onPress={() => leave(false)} testID="paywall-close" />
          <Text style={{ fontFamily: font.body, fontSize: 15, color: color.muted, textAlign: 'center' }}>
            Plans open in the full app build. Expo Go cannot show them.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
