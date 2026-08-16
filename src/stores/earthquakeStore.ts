import { create } from 'zustand';
import { Earthquake } from '../types';
import { isInPhilippines } from '../utils/philippineBounds';

interface EarthquakeState {
  earthquakes: Earthquake[];
  philippineEarthquakes: Earthquake[];
  latestEarthquake: Earthquake | null;
  isConnected: boolean;
  setEarthquakes: (quakes: Earthquake[]) => void;
  addEarthquake: (quake: Earthquake) => void;
  setConnectionStatus: (status: boolean) => void;
}

export const useEarthquakeStore = create<EarthquakeState>((set) => ({
  earthquakes: [],
  philippineEarthquakes: [],
  latestEarthquake: null,
  isConnected: false,

  setEarthquakes: (quakes) => {
    const ph = quakes.filter(q => isInPhilippines(q.latitude, q.longitude));
    set({ earthquakes: quakes, philippineEarthquakes: ph, latestEarthquake: ph[0] || null });
  },

  addEarthquake: (quake) => {
    const isPH = isInPhilippines(quake.latitude, quake.longitude);
    set((state) => ({
      earthquakes: [quake, ...state.earthquakes].slice(0, 100),
      philippineEarthquakes: isPH ? [quake, ...state.philippineEarthquakes].slice(0, 100) : state.philippineEarthquakes,
      latestEarthquake: isPH ? quake : state.latestEarthquake,
    }));
  },

  setConnectionStatus: (status) => set({ isConnected: status }),
}));