import '../global.css';
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../src/stores/authStore';
import { supabase } from '../src/services/supabase';
import LoadingSpinner from '../src/components/LoadingSpinner';

export default function RootLayout() {
  const { init, loading, user } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    init();

    // Listen to real-time auth changes across the entire app
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        useAuthStore.setState({ user: session.user });
      } else {
        useAuthStore.setState({ user: null, profile: null });
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
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