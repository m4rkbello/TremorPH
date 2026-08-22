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
    setLoading(true);
    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message);
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
      <View className="px-6 pt-20">
        <View className="items-center mb-10">
          <Ionicons name="pulse" size={48} color="#ef4444" />
          <Text className="text-2xl font-bold mt-2">TremorPH</Text>
        </View>

        <TextInput
          className="bg-gray-100 rounded-lg px-4 py-3 mb-3"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          className="bg-gray-100 rounded-lg px-4 py-3 mb-4"
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity className="bg-red-500 rounded-lg py-3" onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text className="text-white text-center font-semibold">Sign In</Text>}
        </TouchableOpacity>

        <View className="flex-row items-center my-5">
          <View className="flex-1 h-px bg-gray-200" />
          <Text className="mx-3 text-gray-400 text-xs">OR</Text>
          <View className="flex-1 h-px bg-gray-200" />
        </View>

        <TouchableOpacity
          className="bg-white border border-gray-300 rounded-lg py-3 flex-row justify-center items-center"
          onPress={handleGoogleLogin}
          disabled={googleLoading}
        >
          {googleLoading ? (
            <ActivityIndicator color="#DB4437" />
          ) : (
            <>
              <Ionicons name="logo-google" size={20} color="#DB4437" style={{ marginRight: 8 }} />
              <Text className="text-gray-700 font-semibold">Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/signup')} className="mt-6">
          <Text className="text-center text-gray-600">Don't have an account? Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/forgot-password')} className="mt-2">
          <Text className="text-center text-blue-600">Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
