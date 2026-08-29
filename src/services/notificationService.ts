import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabase } from './supabase';
import { Earthquake } from '../types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
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

  const pushTokenData = await Notifications.getExpoPushTokenAsync();
  const token = pushTokenData.data;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('earthquake-alerts', {
      name: 'Earthquake Alerts',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 500, 250, 500],
      sound: 'default',
    });
  }

  await supabase.from('user_device_tokens').upsert({
    user_id: userId,
    expo_push_token: token,
    device_type: Platform.OS,
    is_active: true,
    updated_at: new Date().toISOString(),
  });

  return token;
}

export async function sendLocalNotification(earthquake: Earthquake) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `🚨 Earthquake Alert: M${earthquake.magnitude.toFixed(1)}`,
      body: `${earthquake.location} - Depth: ${earthquake.depth ?? 0}km`,
      data: { earthquakeId: earthquake.id },
      sound: 'default',
    },
    trigger: null,
  });
}