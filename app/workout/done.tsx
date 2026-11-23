import { Share, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Heading, PrimaryButton, SmallButton } from '../../components/ui';
import { useProgress } from '../../context/ProgressContext';
import { findSession } from '../../data/programmes';
import { formatClock } from '../../lib/sessionMeta';
import { color, font } from '../../lib/theme';

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={{ flex: 1, gap: 4 }}>
      <Text style={{ fontFamily: font.head, fontSize: 28, color: color.text }}>{value}</Text>
      <Text style={{ fontFamily: font.body, fontSize: 12, color: color.muted }}>{label}</Text>
    </View>
  );
}

export default function Done() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const session = findSession(String(id));
  const { last } = useProgress();
  const title = session?.title ?? 'Workout';
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.bg }} testID="workout-done">
      <View style={{ flex: 1, padding: 24, paddingTop: 48, alignItems: 'center', gap: 22 }}>
        <View style={{ width: 168, height: 168, borderRadius: 84, borderWidth: 10, borderColor: color.raised, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 116, height: 116, borderRadius: 58, backgroundColor: color.accent, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="checkmark" size={64} color={color.onAccent} />
          </View>
        </View>
        <SmallButton ghost label="Share" testID="done-share" onPress={() => Share.share({ message: `I finished ${title} in Momentum Women.` })} />
        <View style={{ alignSelf: 'stretch', gap: 6 }}>
          <Text style={{ fontFamily: font.semi, fontSize: 13, color: color.accent }}>{title}</Text>
          <Heading size={30}>Workout complete</Heading>
        </View>
        <View style={{ alignSelf: 'stretch', flexDirection: 'row', gap: 12, borderTopWidth: 1, borderTopColor: color.line, paddingTop: 18 }}>
          <Stat value={formatClock(last?.seconds ?? 0)} label="Total time" />
          <Stat value={String(last?.moves ?? 0)} label="Moves done" />
          <Stat value={String(last?.sets ?? 0)} label="Sets done" />
        </View>
      </View>
      <View style={{ paddingHorizontal: 24, paddingBottom: 12 }}>
        <PrimaryButton label="Continue" testID="done-continue" onPress={() => router.replace('/(tabs)')} />
      </View>
    </SafeAreaView>
  );
}
