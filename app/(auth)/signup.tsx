import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';
import { Ionicons } from '@expo/vector-icons';

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuthStore();

  const handleSignUp = async () => {
    if (!fullName || !email || !password) return Alert.alert('Error', 'Please fill in required fields');
    setLoading(true);
    try {
      await signUp(email, password, fullName, phoneNumber);
      Alert.alert('Success', 'Account created! You can now log in.');
      router.replace('/(auth)/login');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="px-6 pt-8 pb-12 flex-1">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mb-6">
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>

          <Text className="text-3xl font-black text-gray-900 mb-2">Create Account</Text>
          <Text className="text-base text-gray-500 mb-8">Join TremorPH to receive real-time alerts.</Text>

          <View className="space-y-4">
            <TextInput 
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-base text-gray-900 mb-3" 
              placeholder="Full Name" 
              placeholderTextColor="#9ca3af"
              value={fullName} 
              onChangeText={setFullName} 
            />
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
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-base text-gray-900 mb-3" 
              placeholder="Phone Number (+63...)" 
              placeholderTextColor="#9ca3af"
              value={phoneNumber} 
              onChangeText={setPhoneNumber} 
              keyboardType="phone-pad" 
            />
            <TextInput 
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-base text-gray-900 mb-8" 
              placeholder="Password" 
              placeholderTextColor="#9ca3af"
              secureTextEntry 
              value={password} 
              onChangeText={setPassword} 
            />

            <TouchableOpacity 
              className="bg-red-500 rounded-xl py-4 items-center shadow-sm" 
              onPress={handleSignUp} 
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-lg">Create Account</Text>}
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.push('/(auth)/login')} className="mt-8">
            <Text className="text-center text-base text-gray-600">
              Already have an account? <Text className="text-red-500 font-bold">Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}