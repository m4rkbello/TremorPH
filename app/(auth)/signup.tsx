import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';
import { Ionicons } from '@expo/vector-icons';

export default function SignUpScreen() {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [birthdate, setBirthdate] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuthStore();

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password) {
      return Alert.alert('Error', 'First Name, Last Name, Email, and Password are required.');
    }

    setLoading(true);
    try {
      await signUp({
        email: email.trim(),
        password,
        first_name: firstName.trim(),
        middle_name: middleName.trim() || undefined,
        last_name: lastName.trim(),
        age: age ? parseInt(age, 10) : undefined,
        sex,
        birthdate: birthdate || undefined,
        contact_number: contactNumber.trim() || undefined,
      });

      Alert.alert('Success', 'Account registered successfully!');
      router.replace('/(tabs)');
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
              placeholder="First Name *"
              placeholderTextColor="#9ca3af"
              value={firstName}
              onChangeText={setFirstName}
            />

            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-base text-gray-900 mb-3"
              placeholder="Middle Name (Optional)"
              placeholderTextColor="#9ca3af"
              value={middleName}
              onChangeText={setMiddleName}
            />
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-base text-gray-900 mb-3"
              placeholder="Last Name *"
              placeholderTextColor="#9ca3af"
              value={lastName}
              onChangeText={setLastName}
            />

            <View className="flex-row gap-3 mb-3">
              <TextInput
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-base text-gray-900"
                placeholder="Age"
                placeholderTextColor="#9ca3af"
                value={age}
                keyboardType="numeric"
                onChangeText={setAge}
              />
              <TextInput
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-base text-gray-900"
                placeholder="Birthdate (YYYY-MM-DD)"
                placeholderTextColor="#9ca3af"
                value={birthdate}
                onChangeText={setBirthdate}
              />
            </View>

            <View className="flex-row gap-2 mb-3">
              {(['Male', 'Female', 'Other'] as const).map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => setSex(option)}
                  className={`flex-1 py-3 rounded-xl items-center border ${
                    sex === option ? 'bg-red-500 border-red-500' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <Text className={`font-bold ${sex === option ? 'text-white' : 'text-gray-700'}`}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-base text-gray-900 mb-3"
              placeholder="Contact Number (+63...)"
              placeholderTextColor="#9ca3af"
              value={contactNumber}
              onChangeText={setContactNumber}
              keyboardType="phone-pad"
            />
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-base text-gray-900 mb-3"
              placeholder="Email Address *"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-base text-gray-900 mb-8"
              placeholder="Password *"
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