import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

let supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
let supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// If the URL is missing or doesn't start with http, force the fallback so it NEVER crashes
if (!supabaseUrl.startsWith('http')) {
  console.error('🚨 CRITICAL: Invalid EXPO_PUBLIC_SUPABASE_URL found. It must start with https://');
  supabaseUrl = 'https://placeholder.supabase.co';
}

if (!supabaseAnonKey) {
  console.error('🚨 CRITICAL: Missing EXPO_PUBLIC_SUPABASE_ANON_KEY');
  supabaseAnonKey = 'placeholder';
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: SecureStore,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});