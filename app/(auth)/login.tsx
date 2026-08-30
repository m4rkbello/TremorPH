import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Missing Fields', 'Please enter both email and password');
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Sign In Failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Google Sign-In Error', error.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 flex-1 justify-center pb-12">
        <View className="items-center mb-10">
          <View className="w-20 h-20 bg-red-50 rounded-full items-center justify-center mb-4">
            <Ionicons name="pulse" size={40} color="#ef4444" />
          </View>
          <Text className="text-3xl font-black text-gray-900">TremorPH</Text>
          <Text className="text-base text-gray-500 mt-1">Real-time Seismic Monitoring</Text>
        </View>

        <View className="space-y-4">
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-base text-gray-900 mb-3"
            placeholder="Email Address"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-base text-gray-900 mb-2"
            placeholder="Password"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')} className="items-end mb-6">
            <Text className="text-sm font-semibold text-red-500">Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-red-500 rounded-xl py-4 items-center shadow-sm"
            onPress={handleLogin}
            disabled={loading || googleLoading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-lg">Sign In</Text>}
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center my-8">
          <View className="flex-1 h-[1px] bg-gray-200" />
          <Text className="mx-4 text-gray-400 font-medium text-sm">OR</Text>
          <View className="flex-1 h-[1px] bg-gray-200" />
        </View>

        <TouchableOpacity
          className="bg-white border border-gray-300 rounded-xl py-4 flex-row justify-center items-center shadow-sm"
          onPress={handleGoogleLogin}
          disabled={loading || googleLoading}
        >
          {googleLoading ? (
            <ActivityIndicator color="#DB4437" />
          ) : (
            <>
              <Ionicons name="logo-google" size={22} color="#DB4437" style={{ marginRight: 10 }} />
              <Text className="text-gray-700 font-bold text-base">Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/signup')} className="mt-8">
          <Text className="text-center text-base text-gray-600">
            Don't have an account? <Text className="text-red-500 font-bold">Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}