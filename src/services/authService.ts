import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from './supabase';

WebBrowser.maybeCompleteAuthSession();

export async function signInWithGoogle() {
  // 1. Auto-generate the correct redirect URL based on the environment
  const redirectUrl = Linking.createURL('/auth/callback');
  
  console.log('\n🚨 COPY THIS EXACT URL TO SUPABASE REDIRECT URLS:');
  console.log(redirectUrl, '\n');

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      skipBrowserRedirect: true,
    },
  });

  if (error) throw error;
  if (!data?.url) throw new Error('No OAuth URL returned');

  // 2. Open the browser
  const result = await WebBrowser.openAuthSessionAsync(
    data.url,
    redirectUrl,
    { showInRecents: true }
  );

  // 3. Process the result when the browser snaps closed
  if (result.type === 'success' && result.url) {
    const urlString = result.url;
    
    const hashOrQuery = urlString.includes('#') 
      ? urlString.split('#')[1] 
      : urlString.includes('?') 
      ? urlString.split('?')[1] 
      : '';

    if (!hashOrQuery) throw new Error('No authentication tokens found.');

    const params = hashOrQuery.split('&').reduce((acc, pair) => {
      const [key, value] = pair.split('=');
      if (key && value) acc[decodeURIComponent(key)] = decodeURIComponent(value);
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