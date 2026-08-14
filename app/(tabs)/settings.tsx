import { View, Text, TouchableOpacity, Alert, SafeAreaView, ScrollView } from 'react-native';
import { useAuthStore } from '../../src/stores/authStore';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { user, profile, signOut } = useAuthStore();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => {
        await signOut();
        router.replace('/(auth)/login');
      }},
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">Settings</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold mb-2">Profile</Text>
          <Text className="text-gray-700">{profile?.full_name || 'No name'}</Text>
          <Text className="text-gray-600">{user?.email}</Text>
          {profile?.phone_number && <Text className="text-gray-600">{profile.phone_number}</Text>}
        </View>

        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold mb-2">Emergency Contacts</Text>
          <TouchableOpacity className="flex-row items-center py-2" onPress={() => router.push('/emergency-contacts')}>
            <Ionicons name="people" size={24} color="#ef4444" />
            <Text className="ml-2">Manage Emergency Contacts</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity className="bg-red-500 rounded-lg py-3" onPress={handleSignOut}>
          <Text className="text-white text-center font-semibold text-lg">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}