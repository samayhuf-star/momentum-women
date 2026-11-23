import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { usePlan } from '../context/PlanContext';
import { color } from '../lib/theme';

export default function Index() {
  const { user, loading } = useAuth();
  const plan = usePlan();

  if (loading || plan.loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: color.bg }}>
        <ActivityIndicator size="large" color={color.accent} />
      </View>
    );
  }
  if (!user) return <Redirect href="/welcome" />;
  if (!plan.programmeId || !plan.onboarded) return <Redirect href="/onboarding/intro" />;
  return <Redirect href="/(tabs)" />;
}
