import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Linking,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { buy, loadPlans, restore, type Plan } from '../lib/purchases';
import { ctaText, planLine, renewalDisclosure } from '../lib/introOffer';
import { APPLE_EULA_URL, FREE_FEATURES, PRIVACY_URL, PRO_FEATURES, TERMS_URL } from '../lib/pro';
import { usePro } from '../context/ProContext';

export default function PaywallScreen() {
  const router = useRouter();
  const { isPro, refresh } = usePro();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const reload = async () => {
    setLoading(true);
    const result = await loadPlans();
    setPlans(result.plans);
    setError(result.error);
    setLoading(false);
  };

  useEffect(() => {
    reload();
  }, []);

  const onBuy = async (plan: Plan) => {
    if (busy) return;
    setBusy(true);
    const result = await buy(plan);
    setBusy(false);
    if (result === 'purchased') {
      await refresh();
      Alert.alert('Unlocked', 'Momentum Pro is now active on this Apple ID.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else if (result === 'cancelled') {
      return;
    } else if (result === 'pending') {
      Alert.alert('Pending', 'This purchase is waiting for approval. Pro will unlock when it completes.');
    } else {
      Alert.alert('Purchase failed', 'Please try again. If you already paid, use Restore.');
    }
  };

  const onRestore = async () => {
    if (busy) return;
    setBusy(true);
    const ok = await restore();
    setBusy(false);
    if (ok) {
      await refresh();
      Alert.alert('Restored', 'Your Momentum Pro purchase is active.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('No purchase found', 'No Momentum Pro purchase was found for this Apple ID.');
    }
  };

  const hasTrial = plans.some((p) => p.trialDays && p.trialDays > 0);
  const canBuy = plans.length > 0 && !busy;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} testID="paywall">
      <Pressable accessibilityRole="button" style={styles.close} onPress={() => router.back()} testID="close-paywall">
        <Text style={styles.closeText}>Close</Text>
      </Pressable>

      <Text style={styles.title}>Momentum Pro</Text>
      <Text style={styles.subtitle}>Unlock every training plan</Text>

      {isPro ? <Text style={styles.active}>Pro is already active on this Apple ID.</Text> : null}

      {FREE_FEATURES.map((item) => (
        <Text key={item} style={styles.benefit}>Free: {item}</Text>
      ))}
      {PRO_FEATURES.map((item) => (
        <Text key={item} style={styles.benefit}>Pro: {item}</Text>
      ))}

      {loading ? <ActivityIndicator color="#FF6B9D" style={{ marginTop: 24 }} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {plans.map((plan) => (
        <Pressable accessibilityRole="button"
          key={plan.id}
          style={[styles.offer, plan.kind === 'yearly' && styles.offerYear]}
          onPress={() => onBuy(plan)}
          disabled={!canBuy}
          testID={`buy-${plan.kind}`}
        >
          <Text style={styles.offerLabel}>{plan.label}</Text>
          <Text style={styles.offerLine}>{planLine(plan)}</Text>
          <Text style={styles.cta}>{ctaText(plan)}</Text>
        </Pressable>
      ))}

      <Pressable accessibilityRole="button" onPress={onRestore} disabled={busy} testID="restore">
        <Text style={styles.restore}>Restore purchases</Text>
      </Pressable>

      <Text style={styles.footer}>{renewalDisclosure(hasTrial)}</Text>
      <View style={styles.links}>
        <Text accessibilityRole="link" style={styles.link} onPress={() => Linking.openURL(TERMS_URL)}>Terms</Text>
        <Text style={styles.sep}> · </Text>
        <Text accessibilityRole="link" style={styles.link} onPress={() => Linking.openURL(PRIVACY_URL)}>Privacy</Text>
        <Text style={styles.sep}> · </Text>
        <Text accessibilityRole="link" style={styles.link} onPress={() => Linking.openURL(APPLE_EULA_URL)}>Apple EULA</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  close: { alignSelf: 'flex-end', padding: 8 },
  closeText: { fontSize: 16, color: '#FF6B9D', fontWeight: '600' },
  title: { fontSize: 32, fontWeight: '700', textAlign: 'center', marginTop: 8, color: '#1A1A1A' },
  subtitle: { textAlign: 'center', color: '#666', marginTop: 8, marginBottom: 16 },
  active: { textAlign: 'center', color: '#FF6B9D', marginBottom: 12 },
  benefit: { fontSize: 15, marginVertical: 4, color: '#1A1A1A' },
  error: { color: '#b91c1c', marginTop: 16, textAlign: 'center' },
  offer: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginTop: 12, alignItems: 'center' },
  offerYear: { borderWidth: 2, borderColor: '#FF6B9D' },
  offerLabel: { color: '#666', fontWeight: '600' },
  offerLine: { color: '#1A1A1A', fontSize: 16, marginTop: 6, textAlign: 'center' },
  cta: { color: '#FF6B9D', fontWeight: '700', marginTop: 8 },
  restore: { textAlign: 'center', color: '#FF6B9D', marginTop: 20, fontWeight: '600' },
  footer: { textAlign: 'center', color: '#888', marginTop: 16, fontSize: 12, lineHeight: 18 },
  links: { flexDirection: 'row', justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' },
  link: { color: '#FF6B9D', fontSize: 13 },
  sep: { color: '#888' },
});
