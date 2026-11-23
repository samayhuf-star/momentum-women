import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Body, Heading, Label, Photo } from '../../components/ui';
import { photos } from '../../lib/photos';
import { color } from '../../lib/theme';

export default function Find() {
  const router = useRouter();
  const go = () => router.push('/onboarding/filter');
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.bg }} testID="find">
      <View style={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: 16, gap: 6 }}>
        <Heading size={20}>Let's find your programme</Heading>
        <Body size={14}>Pick a programme to finish setup. You can switch at any time.</Body>
      </View>
      <Photo source={photos.duo} label="Two women standing side by side with arms crossed" style={{ height: 300 }} />
      <View style={{ flex: 1, padding: 24, gap: 12 }}>
        <Heading size={30} upper={false}>Let's find the programme for you.</Heading>
        <Body>Tell us how you like to train and we'll match you to the plan that fits. Want to try more than one? Switch whenever you like.</Body>
        <View style={{ flex: 1 }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 16 }}>
          <Label>Get started</Label>
          <Pressable accessibilityRole="button" accessibilityLabel="Get started" testID="find-start" onPress={go} style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: color.accent, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="arrow-forward" size={26} color={color.onAccent} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
