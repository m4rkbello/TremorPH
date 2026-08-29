import { View, Text } from 'react-native';
import { Earthquake } from '../types';

export default function EarthquakeCard({ earthquake }: { earthquake: Earthquake }) {
  const getBadgeColor = (mag: number) => {
    if (mag >= 6.0) return 'bg-red-600';
    if (mag >= 4.5) return 'bg-orange-500';
    return 'bg-amber-500';
  };

  return (
    <View className="bg-white rounded-xl p-4 mb-3 border border-gray-100 shadow-sm flex-row items-center">
      <View className={`w-14 h-14 rounded-2xl ${getBadgeColor(earthquake.magnitude)} items-center justify-center`}>
        <Text className="text-white font-black text-xl">{earthquake.magnitude.toFixed(1)}</Text>
        <Text className="text-white text-[10px] uppercase font-bold">Mag</Text>
      </View>
      <View className="flex-1 ml-4">
        <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
          {earthquake.location || 'Philippine Region'}
        </Text>
        <Text className="text-xs text-gray-500 mt-1">
          Depth: {earthquake.depth ?? 0} km • {new Date(earthquake.occurred_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
}