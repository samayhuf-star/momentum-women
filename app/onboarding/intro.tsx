import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Body, Heading, Photo, Pill, PrimaryButton } from '../../components/ui';
import { photos } from '../../lib/photos';
import { color } from '../../lib/theme';

const SLIDES = [
  { photo: photos.intro, alt: 'A coach talking to camera in a gym', title: 'Train with purpose, week after week', text: 'A fresh weekly plan, built for home or the gym.' },
  { photo: photos.explain, alt: 'A coach explaining a workout', title: 'Every move shown, every set timed', text: 'Follow along with form cues, timers and a journal for your reps and weights.' },
  { photo: photos.duo, alt: 'Two women standing side by side with arms crossed', title: "Let's find your programme", text: 'Tell us how you like to train and we match you to a plan that fits.' },
] as const;

export default function Intro() {
  const router = useRouter();
  const [i, setI] = useState(0);
  const slide = SLIDES[i];
  const done = () => router.replace('/onboarding/find');
  const next = () => (i < SLIDES.length - 1 ? setI(i + 1) : done());

  return (
    <Pressable accessible={false} onPress={next} style={{ flex: 1, backgroundColor: color.bg }} testID="intro">
      <Photo source={slide.photo} label={slide.alt} style={{ flex: 2 }} />
      <SafeAreaView edges={['top']} style={{ position: 'absolute', top: 0, left: 20, right: 20, gap: 12 }}>
        <View style={{ flexDirection: 'row', gap: 6, paddingTop: 8 }}>
          {SLIDES.map((_, n) => (
            <View key={n} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: n <= i ? color.text : color.line }} />
          ))}
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Pill label="Skip" onPress={done} testID="intro-skip" />
        </View>
      </SafeAreaView>
      <SafeAreaView edges={['bottom']} style={{ flex: 1, paddingHorizontal: 28, paddingTop: 24, gap: 12, alignItems: 'center' }}>
        <Heading size={26} style={{ textAlign: 'center' }}>{slide.title}</Heading>
        <Body size={16} style={{ textAlign: 'center' }}>{slide.text}</Body>
        <View style={{ flex: 1 }} />
        <PrimaryButton label={i < SLIDES.length - 1 ? 'Next' : 'Find my programme'} onPress={next} testID="intro-next" style={{ alignSelf: 'stretch' }} />
        <View style={{ height: 8 }} />
      </SafeAreaView>
    </Pressable>
  );
}
