import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, Modal, SafeAreaView, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../../src/stores/authStore';
import { Ionicons } from '@expo/vector-icons';

export default function EmergencyContactsScreen() {
  const { emergencyContacts, addEmergencyContact, updateEmergencyContact, deleteEmergencyContact, setPrimaryContact } = useAuthStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState<any>(null);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [relationship, setRelationship] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !phoneNumber) {
      Alert.alert('Error', 'Name and phone number are required');
      return;
    }

    setLoading(true);
    try {
      if (editingContact) {
        await updateEmergencyContact(editingContact.id, { name, phone_number: phoneNumber, relationship });
      } else {
        await addEmergencyContact({
          name,
          phone_number: phoneNumber,
          relationship,
          email: null,
          is_primary: emergencyContacts.length === 0,
        });
      }
      setModalVisible(false);
      resetForm();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Contact', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteEmergencyContact(id) },
    ]);
  };

  const resetForm = () => {
    setEditingContact(null);
    setName('');
    setPhoneNumber('');
    setRelationship('');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">Emergency Contacts</Text>
        <Text className="text-gray-500 mt-1">Notify these contacts during earthquakes</Text>
      </View>

      <FlatList
        data={emergencyContacts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View className="items-center py-10">
            <Ionicons name="people-outline" size={48} color="#9ca3af" />
            <Text className="text-gray-500 mt-3 text-center">No emergency contacts added</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-200">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className={`w-12 h-12 rounded-full items-center justify-center ${item.is_primary ? 'bg-red-100' : 'bg-gray-100'}`}>
                  <Ionicons name={item.is_primary ? 'star' : 'person'} size={24} color={item.is_primary ? '#ef4444' : '#6b7280'} />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-lg font-semibold">{item.name}</Text>
                  <Text className="text-gray-600">{item.phone_number}</Text>
                  {item.relationship && <Text className="text-gray-500 text-sm">{item.relationship}</Text>}
                </View>
              </View>
              <View className="flex-row">
                {!item.is_primary && (
                  <TouchableOpacity onPress={() => setPrimaryContact(item.id)} className="p-2">
                    <Ionicons name="star-outline" size={20} color="#6b7280" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => { setEditingContact(item); setName(item.name); setPhoneNumber(item.phone_number); setRelationship(item.relationship || ''); setModalVisible(true); }} className="p-2">
                  <Ionicons name="create-outline" size={20} color="#3b82f6" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} className="p-2">
                  <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-red-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => { resetForm(); setModalVisible(true); }}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <Text className="text-xl font-bold mb-4">{editingContact ? 'Edit Contact' : 'Add Contact'}</Text>
            
            <Text className="text-gray-700 font-semibold mb-2">Name *</Text>
            <TextInput className="bg-gray-100 rounded-lg px-4 py-2 mb-3" placeholder="Contact name" value={name} onChangeText={setName} />
            
            <Text className="text-gray-700 font-semibold mb-2">Phone Number *</Text>
            <TextInput className="bg-gray-100 rounded-lg px-4 py-2 mb-3" placeholder="+63 912 345 6789" keyboardType="phone-pad" value={phoneNumber} onChangeText={setPhoneNumber} />
            
            <Text className="text-gray-700 font-semibold mb-2">Relationship</Text>
            <TextInput className="bg-gray-100 rounded-lg px-4 py-2 mb-4" placeholder="Family, Friend, etc." value={relationship} onChangeText={setRelationship} />

            <TouchableOpacity className="bg-red-500 rounded-lg py-3" onPress={handleSave} disabled={loading}>
              {loading ? <ActivityIndicator color="white" /> : <Text className="text-white text-center font-semibold">{editingContact ? 'Update' : 'Add'}</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}