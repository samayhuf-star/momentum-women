import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function CreditsScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container} testID="credits">
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable accessibilityRole="button" onPress={() => router.back()} testID="credits-back">
          <Text style={styles.back}>Back</Text>
        </Pressable>
        <Text style={styles.title}>About and Credits</Text>
        <Text style={styles.body}>
          Momentum – Women's Workout is published by Samay Vashsht, 2026.
        </Text>
        <Text style={styles.heading}>Exercise illustrations</Text>
        <Text style={styles.body}>
          The exercise illustrations in this app are AI-generated images of a model. Illustrations may not show every variation of an exercise.
        </Text>
        <Text style={styles.heading}>Photographs</Text>
        <Text style={styles.body}>
          The photographs of people in this app are AI-generated images of models. They do not show real coaches.
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
  container: { flex: 1, backgroundColor: '#140D12' },
  content: { padding: 20, paddingBottom: 40 },
  back: { color: '#BCA6FF', fontSize: 16, fontWeight: '600', marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '700', color: '#FFF6F2', marginBottom: 16 },
  heading: { fontSize: 18, fontWeight: '700', color: '#FFF6F2', marginTop: 20, marginBottom: 8 },
  body: { color: '#CDBDC4', fontSize: 15, lineHeight: 22, marginBottom: 8 },
});
