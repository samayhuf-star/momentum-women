import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { ONBOARDING_DONE_KEY } from './onboarding';

export default function Index() {
  const { user, loading } = useAuth();
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_DONE_KEY)
      .then((v) => setOnboarded(v === 'yes'))
      .catch(() => setOnboarded(false));
  }, []);

  if (loading || onboarded === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF5F8' }}>
        <ActivityIndicator size="large" color="#FF6B9D" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href={onboarded ? '/login' : '/onboarding'} />;
  }

  return <Redirect href="/(tabs)" />;
}
