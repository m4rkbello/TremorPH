import { View, Text, FlatList, SafeAreaView } from 'react-native';
import { useEarthquakeStore } from '../../src/stores/earthquakeStore';
import { useEarthquakeSubscription } from '../../src/hooks/useEarthquakeSubscription';
import EarthquakeCard from '../../src/components/EarthquakeCard';

export default function FeedScreen() {
  const { philippineEarthquakes, isConnected } = useEarthquakeStore();
  useEarthquakeSubscription();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-5 py-4 bg-white border-b border-gray-200 flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-black text-gray-900">TremorPH</Text>
          <Text className="text-xs text-gray-500 font-medium">Philippine Seismic Activity</Text>
        </View>
        <View className="flex-row items-center bg-gray-100 px-3 py-1 rounded-full">
          <View className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'} mr-2`} />
          <Text className="text-xs font-bold text-gray-700">{isConnected ? 'LIVE' : 'OFFLINE'}</Text>
        </View>
      </View>

      <FlatList
        data={philippineEarthquakes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EarthquakeCard earthquake={item} />}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View className="py-20 items-center justify-center">
            <Text className="text-gray-400 font-medium">No earthquakes recorded recently.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}