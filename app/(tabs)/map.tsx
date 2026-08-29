import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useEarthquakeStore } from '../../src/stores/earthquakeStore';

const INITIAL_REGION = {
  latitude: 12.8797,
  longitude: 121.7740,
  latitudeDelta: 12.0,
  longitudeDelta: 12.0,
};

export default function MapScreen() {
  const { philippineEarthquakes } = useEarthquakeStore();

  const getMarkerColor = (magnitude: number) => {
    if (magnitude >= 6.0) return '#dc2626'; // red
    if (magnitude >= 4.5) return '#f97316'; // orange
    return '#eab308'; // yellow
  };

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={INITIAL_REGION}
      >
        {philippineEarthquakes.map((quake) => (
          <Marker
            key={quake.id}
            coordinate={{
              latitude: Number(quake.latitude),
              longitude: Number(quake.longitude),
            }}
            pinColor={getMarkerColor(quake.magnitude)}
          >
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>
                  M{quake.magnitude.toFixed(1)} - {quake.location || 'Philippine Region'}
                </Text>
                <Text style={styles.calloutSubtitle}>
                  Depth: {quake.depth ?? 0} km
                </Text>
                <Text style={styles.calloutTime}>
                  {new Date(quake.occurred_at).toLocaleString()}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calloutContainer: {
    padding: 6,
    maxWidth: 220,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#111827',
  },
  calloutSubtitle: {
    fontSize: 12,
    color: '#4b5563',
    marginTop: 2,
  },
  calloutTime: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 2,
  },
});