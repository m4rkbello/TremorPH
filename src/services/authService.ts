import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from './supabase';

WebBrowser.maybeCompleteAuthSession();

// Helper to extract parameters from a URL fragment or query string
const extractParamsFromUrl = (url: string) => {
  const parsedUrl = new URL(url);
  // Supabase often returns tokens in the hash (e.g. #access_token=...)
  const params = new URLSearchParams(parsedUrl.hash.replace('#', '?'));
  return {
    access_token: params.get('access_token'),
    refresh_token: params.get('refresh_token'),
  };
};

export async function signInWithGoogle() {
  const redirectUrl = Linking.createURL('/google-auth', { scheme: 'com.m4rkbello.TremorPH' });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      skipBrowserRedirect: true, // Crucial for mobile apps!
    },
  });

  if (error) throw error;
  if (!data?.url) throw new Error('No OAuth URL returned');

  const result = await WebBrowser.openAuthSessionAsync(
    data.url,
    redirectUrl,
    { showInRecents: true }
  );

  if (result.type === 'success' && result.url) {
    const params = extractParamsFromUrl(result.url);
    
    if (params.access_token && params.refresh_token) {
      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: params.access_token,
        refresh_token: params.refresh_token,
      });
      
      if (sessionError) throw sessionError;
      return sessionData.session;
    }
  }
  
  throw new Error('Google sign-in was cancelled or failed.');
}