import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../../src/services/authService';
import LoadingSpinner from '../../src/components/LoadingSpinner';

export default function RootLayout() {
  const { init, loading, user } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, loading, segments]);

  if (loading) return <LoadingSpinner />;

  return <Stack screenOptions={{ headerShown: false }} />;
}