import { useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useSafeZoneStore } from '../../src/stores/safeZoneStore';
import { getCurrentLocation } from '../../src/services/safeZoneService';
import SafeZoneCard from '../../src/components/SafeZoneCard';

export default function SafeZonesScreen() {
  const { safeZones, loading, fetchSafeZones } = useSafeZoneStore();

  useEffect(() => {
    (async () => {
      try {
        const { latitude, longitude } = await getCurrentLocation();
        await fetchSafeZones(latitude, longitude);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={safeZones}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SafeZoneCard zone={item} />}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text className="text-center mt-10">Loading safe zones...</Text>}
      />
    </View>
  );
}