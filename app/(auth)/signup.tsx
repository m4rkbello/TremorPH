import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuthStore();

  const handleSignUp = async () => {
    setLoading(true);
    try {
      await signUp(email, password, fullName, phoneNumber);
      Alert.alert('Success', 'Account created! Check your email to verify.');
      router.replace('/login');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 pt-16">
        <Text className="text-2xl font-bold mb-6">Create Account</Text>
        <TextInput className="bg-gray-100 rounded-lg px-4 py-3 mb-3" placeholder="Full Name" value={fullName} onChangeText={setFullName} />
        <TextInput className="bg-gray-100 rounded-lg px-4 py-3 mb-3" placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
        <TextInput className="bg-gray-100 rounded-lg px-4 py-3 mb-3" placeholder="Phone Number (+63...)" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />
        <TextInput className="bg-gray-100 rounded-lg px-4 py-3 mb-4" placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
        <TouchableOpacity className="bg-red-500 rounded-lg py-3" onPress={handleSignUp} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text className="text-white text-center font-semibold">Sign Up</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}