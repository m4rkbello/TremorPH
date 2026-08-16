import { View, Text } from 'react-native';
import { Earthquake } from '../types';

export default function EarthquakeCard({ earthquake }: { earthquake: Earthquake }) {
  const magnitudeColor = earthquake.magnitude >= 7 ? 'bg-red-700' :
                         earthquake.magnitude >= 5 ? 'bg-orange-500' : 'bg-yellow-500';

  return (
    <View className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-200">
      <View className="flex-row items-center">
        <View className={`w-12 h-12 rounded-lg ${magnitudeColor} items-center justify-center`}>
          <Text className="text-white font-bold text-lg">{earthquake.magnitude.toFixed(1)}</Text>
        </View>
        <View className="flex-1 ml-3">
          <Text className="font-semibold text-gray-800">{earthquake.location}</Text>
          <Text className="text-xs text-gray-500">Depth: {earthquake.depth} km</Text>
        </View>
      </View>
      <Text className="text-xs text-gray-400 mt-2">
        {new Date(earthquake.occurred_at).toLocaleString()}
      </Text>
    </View>
  );
}