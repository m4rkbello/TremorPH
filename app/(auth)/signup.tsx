import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';
import { Ionicons } from '@expo/vector-icons';

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuthStore();

  const validatePhone = (phone: string) => {
    const phoneRegex = /^(\+63|0)[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (phoneNumber && !validatePhone(phoneNumber)) {
      Alert.alert('Error', 'Please enter a valid Philippine phone number (+63...)');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, fullName, phoneNumber);
      Alert.alert('Success', 'Account created! Please check your email to verify.', [
        { text: 'OK', onPress: () => router.replace('/login') }
      ]);
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message);
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
        <ScrollView className="flex-1 px-6 pt-16">
          <View className="items-center mb-8">
            <Text className="text-2xl font-bold text-gray-800">Create Account</Text>
            <Text className="text-gray-500 mt-1">Join Earthquake Monitor PH</Text>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-gray-700 font-semibold mb-2">Full Name *</Text>
              <View className="flex-row items-center bg-gray-100 rounded-lg px-4">
                <Ionicons name="person" size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 py-3 px-3 text-gray-800"
                  placeholder="Juan Dela Cruz"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
            </View>

            <View>
              <Text className="text-gray-700 font-semibold mb-2">Email *</Text>
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
              <Text className="text-gray-700 font-semibold mb-2">Phone Number</Text>
              <View className="flex-row items-center bg-gray-100 rounded-lg px-4">
                <Ionicons name="call" size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 py-3 px-3 text-gray-800"
                  placeholder="+63 912 345 6789"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </View>
            </View>

            <View>
              <Text className="text-gray-700 font-semibold mb-2">Password *</Text>
              <View className="flex-row items-center bg-gray-100 rounded-lg px-4">
                <Ionicons name="lock-closed" size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 py-3 px-3 text-gray-800"
                  placeholder="Minimum 6 characters"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text className="text-gray-700 font-semibold mb-2">Confirm Password *</Text>
              <View className="flex-row items-center bg-gray-100 rounded-lg px-4">
                <Ionicons name="lock-closed" size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 py-3 px-3 text-gray-800"
                  placeholder="Confirm your password"
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>
            </View>

            <TouchableOpacity
              className="bg-red-500 rounded-lg py-3 mt-4"
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-semibold text-lg">Create Account</Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center mt-4 mb-8">
              <Text className="text-gray-600">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text className="text-red-500 font-semibold">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}