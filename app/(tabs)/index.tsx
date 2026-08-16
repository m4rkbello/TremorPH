import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { useEarthquakeStore } from '../../src/stores/earthquakeStore';
import { useEarthquakeSubscription } from '../../src/hooks/useEarthquakeSubscription';
import EarthquakeCard from '../../src/components/EarthquakeCard';

export default function HomeScreen() {
  const { philippineEarthquakes, isConnected } = useEarthquakeStore();
  useEarthquakeSubscription();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-white p-4 border-b border-gray-200">
        <Text className="text-2xl font-bold">TremorPH</Text>
        <Text className={isConnected ? 'text-green-600' : 'text-red-600'}>
          {isConnected ? 'Live Monitoring' : 'Disconnected'}
        </Text>
      </View>
      <ScrollView className="px-4 pt-4">
        {philippineEarthquakes.map((quake) => (
          <EarthquakeCard key={quake.id} earthquake={quake} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}