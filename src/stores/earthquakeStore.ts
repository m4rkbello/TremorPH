import { create } from 'zustand';
import { Earthquake } from '../types';
import { isInPhilippines, isInPAR } from '../utils/philippineBounds';

interface EarthquakeState {
  earthquakes: Earthquake[];
  philippineEarthquakes: Earthquake[];
  latestEarthquake: Earthquake | null;
  isConnected: boolean;
  filterByPhilippines: boolean;
  
  setEarthquakes: (quakes: Earthquake[]) => void;
  addEarthquake: (quake: Earthquake) => void;
  setConnectionStatus: (status: boolean) => void;
  togglePhilippinesFilter: () => void;
}

export const useEarthquakeStore = create<EarthquakeState>((set) => ({
  earthquakes: [],
  philippineEarthquakes: [],
  latestEarthquake: null,
  isConnected: false,
  filterByPhilippines: true,

  setEarthquakes: (quakes) => {
    const phQuakes = quakes.filter(q => isInPAR(q.latitude, q.longitude));
    set({ 
      earthquakes: quakes, 
      philippineEarthquakes: phQuakes,
      latestEarthquake: phQuakes[0] || quakes[0] || null
    });
  },

  addEarthquake: (quake) => {
    const isPH = isInPhilippines(quake.latitude, quake.longitude);
    set((state) => ({
      earthquakes: [quake, ...state.earthquakes].slice(0, 100),
      philippineEarthquakes: isPH 
        ? [quake, ...state.philippineEarthquakes].slice(0, 100)
        : state.philippineEarthquakes,
      latestEarthquake: isPH ? quake : state.latestEarthquake,
    }));
  },

  setConnectionStatus: (status) => set({ isConnected: status }),

  togglePhilippinesFilter: () => 
    set((state) => ({ filterByPhilippines: !state.filterByPhilippines })),
}));