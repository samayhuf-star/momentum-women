import { Share, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { Body, Heading, IconButton, Photo, PrimaryButton } from '../../components/ui';
import { usePro } from '../../context/ProContext';
import { findSession } from '../../data/programmes';
import { photos } from '../../lib/photos';
import { color, font } from '../../lib/theme';

function Action({ icon, label, onPress, testID }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void; testID: string }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} testID={testID} onPress={onPress} style={{ flex: 1, minHeight: 56, alignItems: 'center', justifyContent: 'center', gap: 6 }}>
      <Ionicons name={icon} size={22} color={color.text} />
      <Text style={{ fontFamily: font.medium, fontSize: 12, color: color.muted }}>{label}</Text>
    </Pressable>
  );
}

export default function WorkoutIntro() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { canTrain, loading } = usePro();
  const session = findSession(String(id));
  if (!session) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: color.bg, padding: 24, gap: 16 }} testID="workout-missing">
        <Heading size={24}>Workout not found</Heading>
        <PrimaryButton label="Back" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }
  const overview = () => router.push({ pathname: '/workout/overview', params: { id: session.key } });
  return (
    <View style={{ flex: 1, backgroundColor: color.bg }} testID="workout-intro">
      <Photo source={photos[session.photo]} label={session.title} style={{ flex: 1.3 }} />
      <SafeAreaView edges={['top']} style={{ position: 'absolute', top: 0, left: 16 }}>
        <IconButton name="close" label="Close" onPress={() => router.back()} testID="workout-close" />
      </SafeAreaView>
      <SafeAreaView edges={['bottom']} style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20, gap: 8 }}>
        <Heading size={34}>{session.title}</Heading>
        <Body muted size={15}>{session.equipment} · {session.minutes} minutes · {session.focus}</Body>
        <View style={{ flexDirection: 'row', paddingTop: 6 }}>
          <Action icon="list-outline" label="Moves" onPress={overview} testID="workout-moves" />
          <Action icon="share-outline" label="Share" testID="workout-share" onPress={() => Share.share({ message: `I'm doing ${session.title} in Momentum Women.` })} />
        </View>
        <View style={{ flex: 1 }} />
        <PrimaryButton label="Start workout" testID="workout-start" onPress={() => (canTrain || loading ? router.push({ pathname: '/workout/player', params: { id: session.key } }) : router.push('/paywall'))} />
        <View style={{ height: 8 }} />
      </SafeAreaView>
    </View>
  );
}
