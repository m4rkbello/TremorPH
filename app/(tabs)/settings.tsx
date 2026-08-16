import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useAuthStore } from '../../src/stores/authStore';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const { profile, signOut } = useAuthStore();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <View className="bg-white rounded-lg p-4 mb-4">
        <Text className="text-lg font-semibold">Profile</Text>
        <Text>{profile?.full_name || 'No name'}</Text>
        <Text>{profile?.email}</Text>
        {profile?.phone_number && <Text>{profile.phone_number}</Text>}
      </View>
      <TouchableOpacity className="bg-red-500 rounded py-3" onPress={handleSignOut}>
        <Text className="text-white text-center font-semibold">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}