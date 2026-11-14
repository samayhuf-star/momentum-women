import { Text, View } from 'react-native';
import { isoDay } from '../lib/sessionMeta';
import { color, type } from '../lib/theme';

const LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

type Props = {
  completedDays: string[];
  streak: number;
};

export default function StreakRing({ completedDays, streak }: Props) {
  const today = new Date().getDay();
  const adjustedToday = today === 0 ? 6 : today - 1;
  const size = 168;
  const radius = 64;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {LABELS.map((label, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (adjustedToday - index));
        const done = completedDays.includes(isoDay(date));
        const angle = (index / LABELS.length) * Math.PI * 2 - Math.PI / 2;
        const dot = 22;
        const left = size / 2 + radius * Math.cos(angle) - dot / 2;
        const top = size / 2 + radius * Math.sin(angle) - dot / 2;
        return (
          <View
            key={`${label}-${index}`}
            style={{
              position: 'absolute',
              left,
              top,
              width: dot,
              height: dot,
              borderRadius: dot / 2,
              backgroundColor: done ? color.pink : color.blush,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: color.ink, fontSize: 10, fontWeight: '700' }}>{label}</Text>
          </View>
        );
      })}
      <Text style={{ fontSize: type.display, fontWeight: '800', color: color.ink }} maxFontSizeMultiplier={1.4}>
        {streak}
      </Text>
      <Text style={{ fontSize: type.caption, color: color.muted, fontWeight: '600' }}>day streak</Text>
    </View>
  );
}
