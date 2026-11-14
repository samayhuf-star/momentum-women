import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function CreditsScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container} testID="credits">
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.back()} testID="credits-back">
          <Text style={styles.back}>Back</Text>
        </Pressable>
        <Text style={styles.title}>About and Credits</Text>
        <Text style={styles.body}>
          Momentum – Women's Workout is published by Samay Vashsht, 2026.
        </Text>
        <Text style={styles.heading}>Exercise illustrations</Text>
        <Text style={styles.body}>
          Exercise illustrations are from the Open Exercise Illustrations project
          (https://github.com/hitmanrepo/open-exercise-illustrations), dedicated to the
          public domain under CC0 1.0. Attribution is not required. This credit is included
          as a courtesy. Illustrations may not show every variation of an exercise.
        </Text>
        <Text style={styles.heading}>Wikimedia Commons photographs</Text>
        <Text style={styles.body}>
          Pilates Hundred (File:Pilates-hundred-sata.jpg) is by Helisusa, Wikimedia
          Commons, licensed under CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/).
          https://commons.wikimedia.org/wiki/File:Pilates-hundred-sata.jpg. Used unmodified.
        </Text>
        <Text style={styles.heading}>Privacy and terms</Text>
        <Text style={styles.body}>
          Privacy policy: https://samayhuf-star.github.io/app-legal/momentum-women/privacy.html
        </Text>
        <Text style={styles.body}>
          Terms of use: https://samayhuf-star.github.io/app-legal/momentum-women/terms.html
        </Text>
        <Text style={styles.body}>
          Support: https://samayhuf-star.github.io/app-legal/momentum-women/support.html
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  content: { padding: 20, paddingBottom: 40 },
  back: { color: '#FF6B9D', fontSize: 16, fontWeight: '600', marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '700', color: '#1A1A1A', marginBottom: 16 },
  heading: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginTop: 20, marginBottom: 8 },
  body: { color: '#666', fontSize: 15, lineHeight: 22, marginBottom: 8 },
});
