import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { mediaFor } from '../lib/exerciseMediaMap';

const ICONS: Record<string, { letter: string; bg: string; fg: string }> = {
  chest: { letter: 'CH', bg: '#3B4C6B', fg: '#FFFFFF' },
  back: { letter: 'BK', bg: '#2F5D50', fg: '#FFFFFF' },
  shoulders: { letter: 'SH', bg: '#6B4A2F', fg: '#FFFFFF' },
  core: { letter: 'CO', bg: '#5A3B6B', fg: '#FFFFFF' },
  'lower body': { letter: 'LB', bg: '#3D5A80', fg: '#FFFFFF' },
  'upper body': { letter: 'UB', bg: '#4A6741', fg: '#FFFFFF' },
  'full body': { letter: 'FB', bg: '#6B3B4C', fg: '#FFFFFF' },
};

type Props = {
  id?: string;
  name: string;
  muscle?: string;
  testID?: string;
  dark?: boolean;
  large?: boolean;
};

export default function ExerciseMedia({ id, name, muscle, testID = 'exercise-detail', dark = false, large = false }: Props) {
  const media = id ? mediaFor(id) : null;
  const start = media?.start || media?.hold || null;
  const end = media?.end || null;
  const fade = useRef(new Animated.Value(0)).current;
  const styles = dark ? darkStyles : lightStyles;
  const frameHeight = large ? 240 : 200;
  const key = (muscle || '').toLowerCase();
  const icon = ICONS[key] || { letter: (muscle || 'EX').slice(0, 2).toUpperCase(), bg: '#4A5568', fg: '#FFFFFF' };

  useEffect(() => {
    fade.setValue(0);
    if (!start || !end) {
      return undefined;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(1000),
        Animated.timing(fade, { toValue: 1, duration: 650, useNativeDriver: true }),
        Animated.delay(1000),
        Animated.timing(fade, { toValue: 0, duration: 650, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [id, start, end, fade]);

  return (
    <View style={styles.wrap} testID={testID} accessible accessibilityRole="image" accessibilityLabel={`${name}${muscle ? `, ${muscle}` : ''}`}>
      {start ? (
        <View style={[styles.frame, { height: frameHeight }]}>
          <Image source={start} style={[styles.image, { height: frameHeight }]} resizeMode="contain" />
          {end ? (
            <Animated.Image source={end} style={[styles.image, styles.overlay, { height: frameHeight, opacity: fade }]} resizeMode="contain" />
          ) : null}
        </View>
      ) : (
        <View style={[styles.badge, { backgroundColor: icon.bg }]}>
          <Text style={[styles.letter, { color: icon.fg }]}>{icon.letter}</Text>
        </View>
      )}
      <Text style={styles.name}>{name}</Text>
      {muscle ? <Text style={styles.muscle}>{muscle}</Text> : null}
    </View>
  );
}

const wrapBase = {
  width: '100%' as const,
  minHeight: 200,
  marginTop: 16,
  borderRadius: 16,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  padding: 20,
};

const darkStyles = StyleSheet.create({
  wrap: { ...wrapBase, backgroundColor: '#18181b' },
  frame: { width: '100%', height: 200, alignItems: 'center', justifyContent: 'center' },
  image: { width: '100%', height: 200 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  badge: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  letter: { fontSize: 22, fontWeight: '700' },
  name: { marginTop: 16, fontSize: 18, fontWeight: '700', color: '#fff', textAlign: 'center' },
  muscle: { marginTop: 4, fontSize: 14, color: '#a1a1aa', textTransform: 'capitalize' },
});

const lightStyles = StyleSheet.create({
  wrap: { ...wrapBase, backgroundColor: '#fff' },
  frame: { width: '100%', height: 200, alignItems: 'center', justifyContent: 'center' },
  image: { width: '100%', height: 200 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  badge: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  letter: { fontSize: 22, fontWeight: '700' },
  name: { marginTop: 16, fontSize: 18, fontWeight: '700', color: '#1A1A1A', textAlign: 'center' },
  muscle: { marginTop: 4, fontSize: 14, color: '#666', textTransform: 'capitalize' },
});
