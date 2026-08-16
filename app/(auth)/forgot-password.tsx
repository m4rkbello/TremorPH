import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuthStore();

  const handleReset = async () => {
    setLoading(true);
    try {
      await resetPassword(email);
      Alert.alert('Success', 'Password reset email sent.');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 pt-20">
        <Text className="text-2xl font-bold mb-6">Reset Password</Text>
        <TextInput className="bg-gray-100 rounded-lg px-4 py-3 mb-4" placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
        <TouchableOpacity className="bg-blue-500 rounded-lg py-3" onPress={handleReset} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text className="text-white text-center font-semibold">Send Reset Link</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}