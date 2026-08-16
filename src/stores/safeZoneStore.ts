import { create } from 'zustand';
import { SafeZone } from '../types';
import { findNearbySafeZones } from '../services/safeZoneService';

interface SafeZoneState {
  safeZones: SafeZone[];
  loading: boolean;
  fetchSafeZones: (lat: number, lon: number) => Promise<void>;
}

export const useSafeZoneStore = create<SafeZoneState>((set) => ({
  safeZones: [],
  loading: false,
  fetchSafeZones: async (lat, lon) => {
    set({ loading: true });
    try {
      const zones = await findNearbySafeZones(lat, lon);
      set({ safeZones: zones });
    } finally {
      set({ loading: false });
    }
  },
}));