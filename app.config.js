require('dotenv').config();

module.exports = {
  expo: {
    name: 'TremorPH',
    slug: 'TremorPH',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    scheme: 'com.m4rkbello.TremorPH', // This must exactly match your Supabase Redirect URL

    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.m4rkbello.TremorPH',
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/android-icon-foreground.png',
        backgroundImage: './assets/android-icon-background.png',
        monochromeImage: './assets/android-icon-monochrome.png',
      },
      package: 'com.m4rkbello.TremorPH',
      googleServicesFile: './google-services.json', // Connects Firebase FCM
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      ['expo-build-properties', { android: { newArchEnabled: false } }],
      'expo-router',
      'expo-status-bar',
      [
        'expo-notifications',
        {
          icon: './assets/icon.png',
          color: '#ef4444',
          defaultChannel: 'earthquake-emergency',
        },
      ],
    ],
    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
  },
};