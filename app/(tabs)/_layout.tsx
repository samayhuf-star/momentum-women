import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { color, font } from '../../lib/theme';

const TABS: [string, string, keyof typeof Ionicons.glyphMap][] = [
  ['index', 'Workout', 'barbell-outline'],
  ['plan', 'Plan', 'calendar-outline'],
  ['progress', 'Progress', 'trending-up-outline'],
  ['profile', 'Profile', 'person-outline'],
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: color.accent,
        tabBarInactiveTintColor: color.muted,
        tabBarLabelStyle: { fontFamily: font.semi, fontSize: 11 },
        tabBarStyle: { backgroundColor: color.card, borderTopWidth: 0, height: 88, paddingTop: 8 },
        sceneStyle: { backgroundColor: color.bg },
      }}
    >
      {TABS.map(([name, title, icon]) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{ title, tabBarButtonTestID: `${title.toLowerCase()}-tab`, tabBarIcon: ({ color: c, size }) => <Ionicons name={icon} size={size} color={c as string} /> }}
        />
      ))}
    </Tabs>
  );
}
