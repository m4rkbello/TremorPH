import { View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useEarthquakeStore } from '../../src/stores/earthquakeStore';

export default function MapScreen() {
  const { philippineEarthquakes } = useEarthquakeStore();

  return (
    <View className="flex-1">
      <MapView
        className="flex-1"
        initialRegion={{
          latitude: 12.8797,
          longitude: 121.7740,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
      >
        {philippineEarthquakes.map((quake) => (
          <Marker
            key={quake.id}
            coordinate={{ latitude: quake.latitude, longitude: quake.longitude }}
            title={`M${quake.magnitude}`}
            description={quake.location}
          />
        ))}
      </MapView>
    </View>
  );
} and import { View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useEarthquakeStore } from '../../src/stores/earthquakeStore';

export default function MapScreen() {
  const { philippineEarthquakes } = useEarthquakeStore();

  return (
    <View className="flex-1">
      <MapView
        className="flex-1"
        initialRegion={{
          latitude: 12.8797,
          longitude: 121.7740,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
      >
        {philippineEarthquakes.map((quake) => (
          <Marker
            key={quake.id}
            coordinate={{ latitude: quake.latitude, longitude: quake.longitude }}
            title={`M${quake.magnitude}`}
            description={quake.location}
          />
        ))}
      </MapView>
    </View>
  );
} and 