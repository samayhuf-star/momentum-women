import { Text, View } from 'react-native';
import { isoDay } from '../lib/sessionMeta';
import { color, space, type } from '../lib/theme';

const LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

type Props = {
  completedDays: string[];
  size?: number;
};

export default function WeekStrip({ completedDays, size = 36 }: Props) {
  const today = new Date().getDay();
  const adjustedToday = today === 0 ? 6 : today - 1;

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      {LABELS.map((label, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (adjustedToday - index));
        const done = completedDays.includes(isoDay(date));
        const isToday = index === adjustedToday;
        return (
          <View key={`${label}-${index}`} style={{ alignItems: 'center', gap: space.xs }}>
            <View
              style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: done ? color.pink : color.blush,
                borderWidth: isToday && !done ? 2 : 0,
                borderColor: color.pinkDeep,
              }}
            >
              <Text style={{ color: color.ink, fontWeight: '700', fontSize: type.caption }}>{label}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
