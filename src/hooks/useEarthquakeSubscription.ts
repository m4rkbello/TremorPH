import { useEffect, useRef } from 'react';
import { supabase } from '../services/supabase';
import { useEarthquakeStore } from '../stores/earthquakeStore';
import { useAuthStore } from '../stores/authStore';
import { sendLocalPushNotification, sendSMSToEmergencyContacts } from '../services/notificationService';
import { isInPAR } from '../utils/philippineBounds';

export function useEarthquakeSubscription() {
  const subscriptionRef = useRef<any>(null);
  const { setEarthquakes, addEarthquake, setConnectionStatus } = useEarthquakeStore();
  const { user } = useAuthStore();

  useEffect(() => {
    // Initial load
    supabase.from('earthquakes').select('*').order('occurred_at', { ascending: false }).limit(100).then(({ data }) => {
      if (data) setEarthquakes(data);
    });

    // Realtime subscription
    const subscription = supabase
      .channel('earthquake-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'earthquakes' }, (payload) => {
        const newQuake = payload.new;
        if (isInPAR(newQuake.latitude, newQuake.longitude)) {
          addEarthquake(newQuake);
          if (user?.id && newQuake.magnitude >= 4.0) {
            sendLocalPushNotification(newQuake);
            sendSMSToEmergencyContacts(user.id, newQuake);
          }
        }
      })
      .subscribe((status) => setConnectionStatus(status === 'SUBSCRIBED'));

    subscriptionRef.current = subscription;
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user?.id]);
}