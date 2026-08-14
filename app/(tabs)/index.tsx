import { useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEarthquakeStore } from '../../src/stores/earthquakeStore';
import { useEarthquakeSubscription } from '../../src/hooks/useEarthquakeSubscription';
import EarthquakeCard from '../../src/components/EarthquakeCard';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function HomeScreen() {
  const { earthquakes, philippineEarthquakes, latestEarthquake, isConnected, filterByPhilippines } = useEarthquakeStore();
  const [refreshing, setRefreshing] = useState(false);
  
  useEarthquakeSubscription();

  const displayedEarthquakes = filterByPhilippines ? philippineEarthquakes : earthquakes;

  const onRefresh = () => {
    setRefreshing(true);
    // Reload logic here
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-gray-800">Earthquake Monitor PH</Text>
          <View className={`px-2 py-1 rounded-full ${isConnected ? 'bg-green-100' : 'bg-red-100'}`}>
            <View className="flex-row items-center">
              <View className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <Text className={`ml-1 text-xs ${isConnected ? 'text-green-700' : 'text-red-700'}`}>
                {isConnected ? 'Live' : 'Offline'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {latestEarthquake && latestEarthquake.magnitude >= 4.0 && (
        <View className="bg-red-500 px-4 py-3">
          <Text className="text-white font-bold text-lg">🚨 Latest Alert</Text>
          <Text className="text-white">M{latestEarthquake.magnitude} - {latestEarthquake.location}</Text>
        </View>
      )}

      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="py-4">
          <Text className="text-lg font-semibold text-gray-700 mb-3">
            {filterByPhilippines ? 'Philippine Earthquakes' : 'All Earthquakes'}
          </Text>
          
          {displayedEarthquakes.length === 0 ? (
            <View className="items-center py-10">
              <Ionicons name="pulse" size={48} color="#9CA3AF" />
              <Text className="text-gray-500 mt-3">No earthquakes detected</Text>
            </View>
          ) : (
            displayedEarthquakes.map((quake) => (
              <EarthquakeCard key={quake.id} earthquake={quake} />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}