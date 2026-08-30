import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { supabase } from './supabase';

WebBrowser.maybeCompleteAuthSession();

export async function signInWithGoogle() {

  const redirectUrl = makeRedirectUri();
  
  console.log("Redirecting to:", redirectUrl);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      skipBrowserRedirect: true, 
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
    const urlString = result.url;
    
    const hashOrQuery = urlString.split('#')[1] || urlString.split('?')[1];
    
    if (!hashOrQuery) throw new Error('No authentication tokens found in the URL.');

    const params = hashOrQuery.split('&').reduce((acc, pair) => {
      const [key, value] = pair.split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

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