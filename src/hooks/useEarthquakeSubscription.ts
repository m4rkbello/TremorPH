import { useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useEarthquakeStore } from '../stores/earthquakeStore';
import { sendLocalNotification } from '../services/notificationService';
import { isInPAR } from '../utils/philippineBounds';

export function useEarthquakeSubscription() {
  const { setEarthquakes, addEarthquake, setConnectionStatus } = useEarthquakeStore();

  useEffect(() => {
    // 1. Fetch initial records
    supabase
      .from('earthquakes')
      .select('*')
      .order('occurred_at', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (data) setEarthquakes(data);
      });

    // 2. Listen to Realtime Postgres Changes
    const channel = supabase
      .channel('earthquake_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'earthquakes' },
        (payload) => {
          const newQuake = payload.new as any;
          if (isInPAR(newQuake.latitude, newQuake.longitude)) {
            addEarthquake(newQuake);
            if (newQuake.magnitude >= 4.0) {
              sendLocalNotification(newQuake);
            }
          }
        }
      )
      .subscribe((status) => {
        setConnectionStatus(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}