import * as Location from 'expo-location';
import { supabase } from './supabase';
import { SafeZone } from '../types';

export async function getCurrentLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') throw new Error('Location permission denied');
  const location = await Location.getCurrentPositionAsync({});
  return { latitude: location.coords.latitude, longitude: location.coords.longitude };
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export async function findNearbySafeZones(lat: number, lon: number, radiusKm = 10): Promise<SafeZone[]> {
  const { data } = await supabase.from('safe_zones').select('*').eq('is_verified', true);
  if (!data) return [];
  return data
    .map((zone: SafeZone) => ({
      ...zone,
      distance_from_user: calculateDistance(lat, lon, zone.latitude, zone.longitude)
    }))
    .filter((zone: SafeZone) => zone.distance_from_user! <= radiusKm)
    .sort((a, b) => a.distance_from_user! - b.distance_from_user!);
}