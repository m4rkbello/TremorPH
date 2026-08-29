import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please fill in all fields');
    setLoading(true);
    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Sign In Failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 pt-16">
        <View className="items-center mb-8">
          <View className="w-16 h-16 bg-red-100 rounded-3xl items-center justify-center">
            <Ionicons name="pulse" size={32} color="#ef4444" />
          </View>
          <Text className="text-3xl font-black text-gray-900 mt-3">TremorPH</Text>
          <Text className="text-sm text-gray-500">Real-time Philippine Seismic Warning</Text>
        </View>

        <TextInput
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 mb-3 text-base text-gray-900"
          placeholder="Email Address"
          placeholderTextColor="#9ca3af"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 mb-4 text-base text-gray-900"
          placeholder="Password"
          placeholderTextColor="#9ca3af"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity className="bg-red-500 rounded-xl py-4 items-center" onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-base">Sign In</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/signup')} className="mt-6">
          <Text className="text-center text-sm text-gray-600">
            Don't have an account? <Text className="text-red-500 font-bold">Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}