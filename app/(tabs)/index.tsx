import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Body, Heading, IconButton, Photo, SmallButton, Tick } from '../../components/ui';
import { usePlan } from '../../context/PlanContext';
import { useProgress } from '../../context/ProgressContext';
import { usePro } from '../../context/ProContext';
import { photos } from '../../lib/photos';
import { todayFor } from '../../lib/today';
import { DAY_LONG, DAY_SHORT, dayKey, weekDates } from '../../lib/week';
import { color, font } from '../../lib/theme';

export default function Home() {
  const router = useRouter();
  const plan = usePlan();
  const progress = useProgress();
  const { isPro } = usePro();
  const today = todayFor(plan.programmeId, plan.startKey, progress.totalWorkouts, progress.completedSessions);
  if (!today) return <Redirect href="/onboarding/find" />;

  const dates = weekDates();
  const todayKey = dayKey();
  const { session } = today;
  const open = () => session && router.push({ pathname: '/workout/[id]', params: { id: session.key } });

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: color.bg }} testID="home">
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable accessibilityRole="button" accessibilityLabel={`${today.programme.name}. Change programme`} testID="change-programme" onPress={() => router.push('/onboarding/programmes')} style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Heading size={24} upper={false}>{today.programme.name}</Heading>
            <Ionicons name="chevron-down" size={18} color={color.text} />
          </Pressable>
          <IconButton name="person-outline" label="Profile" onPress={() => router.push('/(tabs)/profile')} testID="home-profile" />
        </View>

        {!isPro ? (
          <View style={{ borderRadius: 14, backgroundColor: color.card, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={{ fontFamily: font.semi, fontSize: 14, color: color.text }}>Try every programme <Text style={{ color: color.accent }}>free for 7 days</Text></Text>
              <Body size={12}>Then from $2.50 a month on the annual plan.</Body>
            </View>
            <SmallButton label="View plans" testID="home-view-plans" onPress={() => router.push('/paywall')} style={{ minHeight: 44, paddingHorizontal: 14 }} />
          </View>
        ) : null}

        <View style={{ flexDirection: 'row' }}>
          {dates.map((d, i) => {
            const key = dayKey(d);
            const done = progress.completedDays.includes(key);
            const isToday = key === todayKey;
            return (
              <View key={key} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
                <Text style={{ fontFamily: font.semi, fontSize: 12, color: isToday ? color.text : color.muted }}>{DAY_SHORT[i]}</Text>
                {done ? <Tick on size={28} /> : (
                  <View style={{ width: 28, height: 28, borderRadius: 14, borderWidth: isToday ? 1.5 : 0, borderColor: color.accent, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: font.semi, fontSize: 14, color: isToday ? color.text : color.muted }}>{d.getDate()}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {session ? (
          <View style={{ borderRadius: 18, overflow: 'hidden', backgroundColor: color.card }}>
            <Photo source={photos[session.photo]} label={session.title} style={{ height: 250 }} />
            <View style={{ position: 'absolute', top: 12, left: 12, height: 26, paddingHorizontal: 10, borderRadius: 13, backgroundColor: color.bg, justifyContent: 'center' }}>
              <Text style={{ fontFamily: font.semi, fontSize: 12, color: color.text }}>{DAY_LONG[today.day]}</Text>
            </View>
            <View style={{ position: 'absolute', top: 12, right: 12, height: 26, paddingHorizontal: 10, borderRadius: 13, backgroundColor: color.accent, justifyContent: 'center' }}>
              <Text style={{ fontFamily: font.semi, fontSize: 12, color: color.onAccent }}>{today.isWelcome ? 'Start here' : today.rest ? 'Up next' : `Week ${today.week + 1}`}</Text>
            </View>
            <View style={{ padding: 16, alignItems: 'center', gap: 6 }}>
              <Heading size={26} style={{ textAlign: 'center' }}>{session.title}</Heading>
              <Body size={13}>{session.minutes} min · {session.focus} · {session.equipment}</Body>
              <View style={{ flexDirection: 'row', gap: 12, paddingTop: 6 }}>
                <SmallButton ghost label="Preview" testID="home-preview" onPress={() => router.push({ pathname: '/workout/overview', params: { id: session.key } })} />
                <SmallButton label="Start" testID="home-start" onPress={open} />
              </View>
            </View>
          </View>
        ) : (
          <View style={{ borderRadius: 18, backgroundColor: color.card, padding: 24, gap: 8, alignItems: 'center' }} testID="home-rest">
            <Heading size={24}>Rest day</Heading>
            <Body style={{ textAlign: 'center' }}>This week's sessions are done. Walk, stretch, and come back when the new week starts.</Body>
          </View>
        )}

        {progress.totalWorkouts === 0 ? (
          <Pressable accessibilityRole="button" testID="home-get-started" onPress={open} style={{ minHeight: 56, borderRadius: 28, borderWidth: 1, borderColor: color.line, backgroundColor: color.card, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Ionicons name="flag-outline" size={22} color={color.accent} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: font.semi, fontSize: 14, color: color.text }}>Get started</Text>
              <Text style={{ fontFamily: font.body, fontSize: 12, color: color.accent }}>Complete your welcome workout</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={color.text} />
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
