import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { useAuthStore } from '../src/stores/authStore';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  const { user, loading, loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="(auth)" />
      ) : (
        <Stack.Screen name="(tabs)" />
      )}
    </Stack>
  );
}