import { Alert, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Heading } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { usePlan } from '../../context/PlanContext';
import { useProgress } from '../../context/ProgressContext';
import { usePro } from '../../context/ProContext';
import { programmeById } from '../../data/programmes';
import { askForPush } from '../../lib/push';
import { color, font } from '../../lib/theme';

type Store = typeof import('../../lib/purchases');
const store = (): Store | null => {
  try {
    return require('../../lib/purchases') as Store;
  } catch {
    return null;
  }
};

const SUPPORT_URL = 'https://samayhuf-star.github.io/app-legal/momentum-women/support.html';

function Row({ label, value, onPress, testID, danger }: { label: string; value?: string; onPress: () => void; testID: string; danger?: boolean }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={value ? `${label}, ${value}` : label} testID={testID} onPress={onPress} style={{ minHeight: 54, borderRadius: 14, backgroundColor: color.card, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Text style={{ fontFamily: font.semi, fontSize: 15, color: danger ? '#FF9B9B' : color.text }}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {value ? <Text style={{ fontFamily: font.medium, fontSize: 13, color: color.muted }}>{value}</Text> : null}
        <Ionicons name="chevron-forward" size={18} color={color.text} />
      </View>
    </Pressable>
  );
}

export default function Profile() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const plan = usePlan();
  const progress = useProgress();
  const { isPro, refresh } = usePro();
  const programme = programmeById(plan.programmeId);

  const erase = () =>
    Alert.alert('Delete my data', 'This removes your programme, progress and journal from this device and signs you out. It cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await progress.resetProgress();
          await plan.reset();
          await logout();
          router.replace('/welcome');
        },
      },
    ]);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: color.bg }} testID="profile">
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingTop: 12 }}>
          <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: color.raised, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="person-outline" size={26} color={color.muted} />
          </View>
          <View style={{ gap: 4 }}>
            <Heading size={20}>{user?.name ?? 'Guest'}</Heading>
            <Text style={{ fontFamily: font.body, fontSize: 13, color: color.muted }}>{isPro ? 'Momentum Premium' : 'Not subscribed'}</Text>
          </View>
        </View>
        {!isPro ? (
          <View style={{ borderRadius: 16, backgroundColor: color.accent, padding: 16, gap: 10, alignItems: 'flex-start' }}>
            <Text style={{ fontFamily: font.semi, fontSize: 12, color: color.onAccent }}>Upgrade</Text>
            <Text style={{ fontFamily: font.head, fontSize: 22, lineHeight: 25, color: color.onAccent }}>We do the planning.{'\n'}You just press play.</Text>
            <Pressable accessibilityRole="button" testID="profile-choose-plan" onPress={() => router.push('/paywall')} style={{ minHeight: 44, paddingHorizontal: 18, borderRadius: 22, backgroundColor: color.onAccent, justifyContent: 'center' }}>
              <Text style={{ fontFamily: font.head, fontSize: 12, letterSpacing: 0.5, textTransform: 'uppercase', color: color.text }}>Choose plan</Text>
            </Pressable>
          </View>
        ) : null}
        <View style={{ gap: 8 }}>
          <Row label="My programme" value={programme?.name} testID="profile-programme" onPress={() => router.push('/onboarding/programmes')} />
          <Row label="Workout reminders" value={plan.reminders ? 'On' : 'Off'} testID="profile-reminders" onPress={async () => { const on = !plan.reminders; await plan.setReminders(on); if (on) await askForPush(); }} />
          {isPro ? <Row label="Manage subscription" testID="profile-manage" onPress={() => store()?.openCustomerCenter()} /> : null}
          <Row label="Restore purchases" testID="profile-restore" onPress={async () => { const ok = await store()?.restore(); await refresh(); Alert.alert(ok ? 'Restored' : 'Nothing to restore', ok ? 'Your subscription is active again.' : 'We could not find an active purchase for this Apple ID.'); }} />
          <Row label="Exercise library" testID="profile-library" onPress={() => router.push('/library')} />
          <Row label="Help and support" testID="profile-support" onPress={() => Linking.openURL(SUPPORT_URL)} />
          <Row label="About and credits" testID="profile-credits" onPress={() => router.push('/credits')} />
          <Row label="Sign out" testID="profile-signout" onPress={async () => { await logout(); router.replace('/welcome'); }} />
          <Row label="Delete my data" danger testID="profile-delete" onPress={erase} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
