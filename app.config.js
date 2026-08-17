require('dotenv').config();

module.exports = {
  expo: {
    name: 'TremorPH',
    slug: 'TremorPH',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    scheme: 'com.m4rkbello.TremorPH',

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
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      ['expo-build-properties', { android: { newArchEnabled: false } }],
      'expo-router',
      'expo-status-bar',
    ],

    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
  },
};