import '../global.css';
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../src/stores/authStore';
import LoadingSpinner from '../src/components/LoadingSpinner';

export default function RootLayout() {
  const { init, loading, user } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // 1. Check for an existing session when the app opens
  useEffect(() => {
    init();
  }, []);

  // 2. The Magic Redirect: Watch the 'user' state and auto-route
  useEffect(() => {
    if (loading) return; // Do nothing while checking the session

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // If there is NO user, force them to the Login screen
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // If there IS a user and they are on the Login/Signup screen, force them to the Dashboard
      router.replace('/(tabs)');
    }
  }, [user, loading, segments]);

  // Show your LoadingSpinner while checking auth state
  if (loading) return <LoadingSpinner />;

  // Render the actual screens once auth is determined
  return <Stack screenOptions={{ headerShown: false }} />;
}