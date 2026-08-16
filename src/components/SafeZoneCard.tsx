import { View, Text, TouchableOpacity } from 'react-native';
import { SafeZone } from '../types';
import { Ionicons } from '@expo/vector-icons';

export default function SafeZoneCard({ zone }: { zone: SafeZone }) {
  return (
    <View className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-200">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="font-semibold text-gray-800">{zone.name}</Text>
          <Text className="text-xs text-gray-500">{zone.city}</Text>
          {zone.distance_from_user && (
            <Text className="text-xs text-blue-600 mt-1">{zone.distance_from_user.toFixed(1)} km away</Text>
          )}
        </View>
        <Ionicons name="shield-checkmark" size={24} color="#10b981" />
      </View>
    </View>
  );
}