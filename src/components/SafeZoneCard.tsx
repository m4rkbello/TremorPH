import { View, Text } from 'react-native';
import { SafeZone } from '../types';
import { Ionicons } from '@expo/vector-icons';

export default function SafeZoneCard({ zone }: { zone: SafeZone }) {
  return (
    <View className="bg-white rounded-xl p-4 mb-3 border border-gray-100 shadow-sm flex-row justify-between items-center">
      <View className="flex-1 pr-2">
        <Text className="text-base font-bold text-gray-900">{zone.name}</Text>
        <Text className="text-xs text-gray-500 mt-0.5">{zone.city || 'Designated Area'}</Text>
        {zone.distance_from_user !== undefined && (
          <Text className="text-xs font-semibold text-blue-600 mt-2">
            📍 {zone.distance_from_user.toFixed(1)} km away
          </Text>
        )}
      </View>
      <View className="bg-emerald-50 w-10 h-10 rounded-full items-center justify-center">
        <Ionicons name="shield-checkmark" size={20} color="#059669" />
      </View>
    </View>
  );
}