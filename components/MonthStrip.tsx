import { View } from 'react-native';
import { recentDayKeys } from '../lib/sessionMeta';
import { color, space } from '../lib/theme';

type Props = {
  completedDays: string[];
};

export default function MonthStrip({ completedDays }: Props) {
  const keys = recentDayKeys(30);
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.xs }}>
      {keys.map((key) => {
        const done = completedDays.includes(key);
        return (
          <View
            key={key}
            accessibilityLabel={done ? `${key} completed` : key}
            style={{
              width: 14,
              height: 14,
              borderRadius: 4,
              backgroundColor: done ? color.pink : color.track,
            }}
          />
        );
      })}
    </View>
  );
}
