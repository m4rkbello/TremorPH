import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as SMS from 'expo-sms';
import { Platform } from 'react-native';
import { supabase } from './supabase';
import { Earthquake } from '../types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotifications(userId: string) {
  if (!Device.isDevice) return null;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return null;

  const token = (await Notifications.getExpoPushTokenAsync()).data;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('earthquake-alerts', {
      name: 'Earthquake Alerts',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  await supabase.from('user_device_tokens').upsert({
    user_id: userId,
    expo_push_token: token,
    device_type: Platform.OS,
    is_active: true,
  });
  return token;
}

export async function sendLocalPushNotification(earthquake: Earthquake) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `🚨 Earthquake Alert M${earthquake.magnitude}`,
      body: `${earthquake.location} - Depth: ${earthquake.depth}km`,
      data: { earthquake },
      sound: 'default',
    },
    trigger: null,
  });
}

export async function sendSMSToEmergencyContacts(userId: string, earthquake: Earthquake) {
  const isAvailable = await SMS.isAvailableAsync();
  if (!isAvailable) return;

  const { data: contacts } = await supabase
    .from('emergency_contacts')
    .select('*')
    .eq('user_id', userId);

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', userId)
    .single();

  if (!contacts?.length) return;

  for (const contact of contacts) {
    const message = `EMERGENCY: Earthquake M${earthquake.magnitude} at ${earthquake.location}. Please check on ${profile?.full_name || 'your contact'}!`;
    try {
      await SMS.sendSMSAsync([contact.phone_number], message);
      await supabase.from('emergency_notifications').insert({
        user_id: userId,
        earthquake_id: earthquake.id,
        contact_id: contact.id,
        notification_type: 'sms',
        status: 'sent',
      });
    } catch (error) {
      console.error(`SMS failed for ${contact.name}:`, error);
    }
  }
}