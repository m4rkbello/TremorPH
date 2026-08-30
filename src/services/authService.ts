import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { supabase } from './supabase';

// Required for web browser to close automatically on mobile
WebBrowser.maybeCompleteAuthSession();

export async function signInWithGoogle() {
  // This automatically uses exp:// in Expo Go, and com.m4rkbello.TremorPH:// in the final APK
  const redirectUrl = makeRedirectUri();
  
  console.log("🚨 EXPECTED REDIRECT URL ->", redirectUrl);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      skipBrowserRedirect: true, 
    },
  });

  if (error) throw error;
  if (!data?.url) throw new Error('No OAuth URL returned');

  // Open the secure browser to log in
  const result = await WebBrowser.openAuthSessionAsync(
    data.url,
    redirectUrl,
    { showInRecents: true }
  );

  // When the browser redirects back to the app...
  if (result.type === 'success' && result.url) {
    const urlString = result.url;
    
    // Safely extract the tokens from the URL hash
    const hashOrQuery = urlString.split('#')[1] || urlString.split('?')[1];
    
    if (!hashOrQuery) throw new Error('No authentication tokens found in the URL.');

    const params = hashOrQuery.split('&').reduce((acc, pair) => {
      const [key, value] = pair.split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    if (params.access_token && params.refresh_token) {
      // Set the session inside Supabase
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