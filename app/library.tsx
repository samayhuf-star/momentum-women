import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Heading, IconButton } from '../components/ui';
import Thumb from '../components/Thumb';
import { categories, visibleExercises } from '../data/exercises';
import { hasMedia } from '../lib/exerciseMediaMap';
import { color, font } from '../lib/theme';

export default function Library() {
  const router = useRouter();
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: color.bg }} testID="library">
      <View style={{ paddingHorizontal: 16 }}>
        <IconButton name="chevron-back" label="Back" onPress={() => router.back()} testID="library-back" />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 32 }}>
        <Heading size={30}>Exercise library</Heading>
        {categories.map((c) => (
          <View key={c} style={{ gap: 12 }}>
            <Heading size={18} style={{ paddingTop: 8, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: color.line }}>{c}</Heading>
            {visibleExercises.filter((e) => hasMedia(e.id) && e.category === c).map((e) => (
              <View key={e.id} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                <Thumb id={e.id} name={e.name} />
                <View style={{ flex: 1, gap: 3 }}>
                  <Text style={{ fontFamily: font.semi, fontSize: 15, color: color.text }}>{e.name}</Text>
                  <Text style={{ fontFamily: font.body, fontSize: 12, lineHeight: 17, color: color.muted }}>{e.description}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
