import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuthStore();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      Alert.alert('Check Your Email', 'Password reset instructions have been sent.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-20">
        <View className="items-center mb-10">
          <View className="w-16 h-16 bg-blue-500 rounded-full items-center justify-center mb-3">
            <Ionicons name="key" size={32} color="white" />
          </View>
          <Text className="text-2xl font-bold text-gray-800">Reset Password</Text>
          <Text className="text-gray-500 mt-2 text-center">
            Enter your email and we'll send you reset instructions
          </Text>
        </View>

        <View>
          <Text className="text-gray-700 font-semibold mb-2">Email</Text>
          <View className="flex-row items-center bg-gray-100 rounded-lg px-4">
            <Ionicons name="mail" size={20} color="#6B7280" />
            <TextInput
              className="flex-1 py-3 px-3 text-gray-800"
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        <TouchableOpacity
          className="bg-blue-500 rounded-lg py-3 mt-6"
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-semibold text-lg">Send Reset Link</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}