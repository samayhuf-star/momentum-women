import { useState } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CheckLine, IconButton, PrimaryButton, Tick } from '../components/ui';
import { usePlan } from '../context/PlanContext';
import { PRIVACY_URL, TERMS_URL } from '../lib/pro';
import { color, font } from '../lib/theme';

/**
 * Layout preview of the paywall. Prices are the standard plans and are not read from the store here.
 * The shipping paywall is RevenueCat's, wired in at the payments checkpoint; no purchase happens on this screen.
 */
const PLANS = [
  { id: 'annual', name: 'Annual', sub: '7 days free, then $29.99 a year', right: '$2.50/mo', badge: 'Best value' },
  { id: 'monthly', name: 'Monthly', sub: '7 days free, then $5.99 a month', right: '$5.99/mo' },
  { id: 'weekly', name: 'Weekly', sub: '7 days free, then $2.99 a week', right: '$2.99/wk' },
  { id: 'lifetime', name: 'Lifetime', sub: 'One payment of $39.99', right: 'Once' },
];

export default function Paywall() {
  const router = useRouter();
  const plan = usePlan();
  const [picked, setPicked] = useState('annual');

  const leave = async () => {
    if (!plan.onboarded) await plan.finishOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.bg }} testID="paywall">
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, gap: 14, paddingBottom: 12 }}>
        <IconButton name="close" label="Close" bg="transparent" onPress={leave} testID="paywall-close" />
        <Text accessibilityRole="header" style={{ fontFamily: font.head, fontSize: 28, lineHeight: 32, color: color.text }}>Get stronger, without planning a single workout.</Text>
        <View style={{ gap: 8 }}>
          <CheckLine>A plan for every week, day by day</CheckLine>
          <CheckLine>Form cues and timers for every move</CheckLine>
          <CheckLine>Journal to track reps and weights</CheckLine>
          <CheckLine>Switch programme whenever you like</CheckLine>
        </View>
        <View style={{ gap: 8, paddingTop: 4 }}>
          {PLANS.map((p) => {
            const on = picked === p.id;
            return (
              <Pressable key={p.id} accessibilityRole="radio" accessibilityState={{ selected: on }} accessibilityLabel={`${p.name}. ${p.sub}`} testID={`plan-${p.id}`} onPress={() => setPicked(p.id)} style={{ minHeight: 60, borderRadius: 14, borderWidth: on ? 2 : 1.5, borderColor: on ? color.accent : color.line, backgroundColor: color.card, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Tick on={on} size={22} />
                <View style={{ flex: 1, gap: 2 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontFamily: font.semi, fontSize: 16, color: color.text }}>{p.name}</Text>
                    {p.badge ? (
                      <View style={{ height: 20, paddingHorizontal: 8, borderRadius: 10, backgroundColor: color.accent, justifyContent: 'center' }}>
                        <Text style={{ fontFamily: font.semi, fontSize: 11, color: color.onAccent }}>{p.badge}</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={{ fontFamily: font.body, fontSize: 12, color: color.muted }}>{p.sub}</Text>
                </View>
                <Text style={{ fontFamily: font.medium, fontSize: 13, color: color.muted }}>{p.right}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      <View style={{ paddingHorizontal: 20, paddingBottom: 8, gap: 8 }}>
        <Text style={{ textAlign: 'center', fontFamily: font.body, fontSize: 13, color: color.muted }}>Cancel any time in the App Store</Text>
        <PrimaryButton testID="paywall-start" label={picked === 'lifetime' ? 'Continue' : 'Start 7-day free trial'} onPress={() => router.replace(picked === 'lifetime' ? '/plan-active' : '/started')} />
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 18 }}>
          <Text accessibilityRole="button" testID="paywall-restore" onPress={leave} style={{ fontFamily: font.semi, fontSize: 13, color: color.muted, paddingVertical: 12 }}>Restore purchase</Text>
          <Text accessibilityRole="link" onPress={() => Linking.openURL(TERMS_URL)} style={{ fontFamily: font.semi, fontSize: 13, color: color.muted, paddingVertical: 12 }}>Terms</Text>
          <Text accessibilityRole="link" onPress={() => Linking.openURL(PRIVACY_URL)} style={{ fontFamily: font.semi, fontSize: 13, color: color.muted, paddingVertical: 12 }}>Privacy</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
