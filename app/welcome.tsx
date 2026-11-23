import { useEffect, useState } from 'react';
import { Linking, Platform, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useAuth } from '../context/AuthContext';
import { Body, Heading, Photo, Pill, Wordmark } from '../components/ui';
import { photos } from '../lib/photos';
import { color, font } from '../lib/theme';
import { TERMS_URL } from '../lib/pro';

const SUPPORT_URL = 'https://samayhuf-star.github.io/app-legal/momentum-women/support.html';

export default function Welcome() {
  const { loginAsGuest, loginWithApple } = useAuth();
  const router = useRouter();
  const [apple, setApple] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS === 'ios') AppleAuthentication.isAvailableAsync().then(setApple).catch(() => setApple(false));
  }, []);

  const next = () => router.replace('/onboarding/intro');

  const signInApple = async () => {
    if (busy) return;
    setBusy(true);
    setNote(null);
    try {
      const cred = await AppleAuthentication.signInAsync({ requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME] });
      await loginWithApple(cred.user, cred.fullName?.givenName ?? null);
      next();
    } catch (e: any) {
      if (e?.code !== 'ERR_REQUEST_CANCELED') setNote('Sign in with Apple did not complete. You can continue as a guest.');
    } finally {
      setBusy(false);
    }
  };

  const guest = async () => {
    if (busy) return;
    setBusy(true);
    await loginAsGuest();
    next();
  };

  return (
    <View style={{ flex: 1, backgroundColor: color.bg }} testID="welcome">
      <Photo source={photos.welcome} label="A woman standing with two dumbbells in a dark studio" style={{ flex: 1.25 }} />
      <SafeAreaView edges={['top']} style={{ position: 'absolute', top: 0, right: 20 }}>
        <Pill label="Get help" onPress={() => Linking.openURL(SUPPORT_URL)} testID="welcome-help" />
      </SafeAreaView>
      <SafeAreaView edges={['bottom']} style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24, gap: 12 }}>
        <Wordmark />
        <Heading size={32}>Sign in to get your free plan</Heading>
        <View style={{ flex: 1 }} />
        {apple ? (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
            cornerRadius={28}
            style={{ height: 56 }}
            onPress={signInApple}
          />
        ) : null}
        <Pressable accessibilityRole="button" testID="continue-as-guest" onPress={guest} style={{ minHeight: 52, borderRadius: 26, borderWidth: 1.5, borderColor: color.line, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: font.semi, fontSize: 16, color: color.text }}>Continue as guest</Text>
        </Pressable>
        {note ? <Body style={{ textAlign: 'center' }} size={13}>{note}</Body> : null}
        <Text style={{ textAlign: 'center', fontFamily: font.medium, fontSize: 14, color: color.accent }}>Free for 7 days · Cancel anytime</Text>
        <Text style={{ textAlign: 'center', fontFamily: font.body, fontSize: 12, color: color.muted, paddingBottom: 8 }}>
          By continuing you agree to our{' '}
          <Text accessibilityRole="link" style={{ color: color.accent }} onPress={() => Linking.openURL(TERMS_URL)}>Terms and Conditions</Text>.
        </Text>
      </SafeAreaView>
    </View>
  );
}
