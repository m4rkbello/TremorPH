import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 px-6 pt-20">
          <View className="items-center mb-10">
            <View className="w-20 h-20 bg-red-500 rounded-full items-center justify-center mb-4">
              <Ionicons name="pulse" size={40} color="white" />
            </View>
            <Text className="text-3xl font-bold text-gray-800">Earthquake Monitor PH</Text>
            <Text className="text-gray-500 mt-2">Sign in to your account</Text>
          </View>

          <View className="space-y-4">
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

            <View>
              <Text className="text-gray-700 font-semibold mb-2">Password</Text>
              <View className="flex-row items-center bg-gray-100 rounded-lg px-4">
                <Ionicons name="lock-closed" size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 py-3 px-3 text-gray-800"
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={() => router.push('/forgot-password')}>
              <Text className="text-blue-600 text-right">Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-red-500 rounded-lg py-3 mt-4"
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-semibold text-lg">Sign In</Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-600">Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/signup')}>
                <Text className="text-red-500 font-semibold">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}