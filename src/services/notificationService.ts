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
  if (!Device.isDevice) {
    console.log('Must use physical device for Push Notifications');
    return null;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token');
      return null;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('earthquake-alerts', {
        name: 'Earthquake Alerts',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: 'default',
      });
    }

    await supabase.from('user_device_tokens').upsert({
      user_id: userId,
      expo_push_token: token,
      device_type: Platform.OS,
      is_active: true,
    });

    return token;
  } catch (error) {
    console.error('Error registering for notifications:', error);
    return null;
  }
}

export async function sendLocalPushNotification(earthquake: Earthquake) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `🚨 Earthquake Alert M${earthquake.magnitude}`,
        body: `${earthquake.location} - Depth: ${earthquake.depth}km`,
        data: { earthquake },
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: null,
    });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

export async function sendSMSToEmergencyContacts(userId: string, earthquake: Earthquake) {
  try {
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

    if (!contacts || contacts.length === 0) return;

    for (const contact of contacts) {
      const message = `EMERGENCY ALERT from ${profile?.full_name || 'Earthquake Monitor PH'}:\n` +
        `🚨 Earthquake Detected!\n` +
        `Magnitude: ${earthquake.magnitude}\n` +
        `Location: ${earthquake.location}\n` +
        `Depth: ${earthquake.depth}km\n` +
        `Time: ${new Date(earthquake.occurred_at).toLocaleString()}\n` +
        `Please check on them immediately!`;

      try {
        await SMS.sendSMSAsync([contact.phone_number], message);
        
        await supabase.from('emergency_notifications').insert({
          user_id: userId,
          earthquake_id: earthquake.id,
          contact_id: contact.id,
          notification_type: 'sms',
          status: 'sent',
          sent_at: new Date().toISOString(),
        });
      } catch (smsError) {
        console.error(`Error sending SMS to ${contact.name}:`, smsError);
      }
    }
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
}