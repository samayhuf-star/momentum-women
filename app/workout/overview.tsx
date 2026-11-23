import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Heading, IconButton, PrimaryButton } from '../../components/ui';
import Thumb from '../../components/Thumb';
import { exerciseById, findSession } from '../../data/programmes';
import { color, font } from '../../lib/theme';

export default function Overview() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const session = findSession(String(id));
  if (!session) return null;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.bg }} testID="workout-overview">
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 }}>
        <IconButton name="close" label="Close" onPress={() => router.back()} testID="overview-close" />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="timer-outline" size={18} color={color.text} />
          <Text style={{ fontFamily: font.semi, fontSize: 15, color: color.text }}>{session.minutes} min</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>
        {session.blocks.map((b) => (
          <View key={b.name} style={{ gap: 14 }}>
            <Heading size={18} style={{ paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: color.line }}>{b.name}</Heading>
            {b.moves.map((m) => {
              const ex = exerciseById(m.id);
              if (!ex) return null;
              return (
                <View key={m.id} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                  <Thumb id={m.id} name={ex.name} />
                  <View style={{ flex: 1, gap: 6 }}>
                    <Text style={{ fontFamily: font.semi, fontSize: 15, color: color.text }}><Text style={{ color: color.accent }}>{m.sets}x</Text> {ex.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <View style={{ height: 24, paddingHorizontal: 8, borderRadius: 6, backgroundColor: color.raised, justifyContent: 'center' }}>
                        <Text style={{ fontFamily: font.medium, fontSize: 12, color: color.text }}>{ex.equipment === 'None' ? 'Bodyweight' : ex.equipment}</Text>
                      </View>
                      <Text style={{ fontFamily: font.body, fontSize: 12, color: color.muted }}>{m.secs ? `${m.secs} sec` : `${m.reps} reps`}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
      <View style={{ paddingHorizontal: 20, paddingBottom: 12, paddingTop: 8 }}>
        <PrimaryButton label="Start workout" testID="overview-start" onPress={() => router.replace({ pathname: '/workout/player', params: { id: session.key } })} />
      </View>
    </SafeAreaView>
  );
}
