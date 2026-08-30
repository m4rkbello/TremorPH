import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { supabase } from './supabase';

WebBrowser.maybeCompleteAuthSession();

export async function signInWithGoogle() {
  // Use expo-auth-session's redirect URI builder
  const redirectUrl = makeRedirectUri({
    scheme: 'com.m4rkbello.TremorPH'
  });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      skipBrowserRedirect: true, // Crucial for mobile!
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
    // ---------------------------------------------------------
    // BULLETPROOF PARSER: Safely extract tokens without URLSearchParams
    // ---------------------------------------------------------
    const urlString = result.url;
    
    // Supabase attaches tokens after the '#' or '?' symbol
    const hashOrQuery = urlString.split('#')[1] || urlString.split('?')[1];
    
    if (!hashOrQuery) throw new Error('No authentication tokens found in the URL.');

    // Manually split the string into key-value pairs
    const params = hashOrQuery.split('&').reduce((acc, pair) => {
      const [key, value] = pair.split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    // If we successfully grabbed the tokens, establish the session
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