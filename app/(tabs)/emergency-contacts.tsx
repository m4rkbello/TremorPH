import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useAuthStore } from '../../src/stores/authStore';
import { Ionicons } from '@expo/vector-icons';

export default function EmergencyContactsScreen() {
  const { emergencyContacts, addEmergencyContact, deleteEmergencyContact, setPrimaryContact } = useAuthStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');

  const handleAdd = async () => {
    if (!name || !phone) {
      Alert.alert('Error', 'Name and phone are required');
      return;
    }
    await addEmergencyContact({
      name,
      phone_number: phone,
      relationship,
      is_primary: emergencyContacts.length === 0,
    });
    setName('');
    setPhone('');
    setRelationship('');
  };

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Text className="text-xl font-bold mb-4">Emergency Contacts</Text>
      <View className="bg-white rounded-lg p-4 mb-4">
        <TextInput className="bg-gray-100 rounded px-3 py-2 mb-2" placeholder="Name" value={name} onChangeText={setName} />
        <TextInput className="bg-gray-100 rounded px-3 py-2 mb-2" placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <TextInput className="bg-gray-100 rounded px-3 py-2 mb-3" placeholder="Relationship" value={relationship} onChangeText={setRelationship} />
        <TouchableOpacity className="bg-red-500 rounded py-2" onPress={handleAdd}>
          <Text className="text-white text-center">Add Contact</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={emergencyContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-white rounded p-3 mb-2 flex-row justify-between items-center">
            <View>
              <Text className="font-semibold">{item.name} {item.is_primary && '⭐'}</Text>
              <Text className="text-gray-600">{item.phone_number}</Text>
              {item.relationship && <Text className="text-xs text-gray-500">{item.relationship}</Text>}
            </View>
            <View className="flex-row">
              {!item.is_primary && (
                <TouchableOpacity onPress={() => setPrimaryContact(item.id)}>
                  <Ionicons name="star-outline" size={20} className="mr-3" />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => deleteEmergencyContact(item.id)}>
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}