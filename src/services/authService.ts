// src/services/authService.ts
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from './supabase';

WebBrowser.maybeCompleteAuthSession();

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: AuthSession.makeRedirectUri({
        scheme: 'com.m4rkbello.TremorPH', // Make sure this matches your app.json scheme!
      }),
    },
  });

  if (error) throw error;

  if (data?.url) {
    const result = await WebBrowser.openAuthSessionAsync(
      data.url,
      AuthSession.makeRedirectUri({ scheme: 'com.m4rkbello.TremorPH' })
    );

    if (result.type === 'success' && result.url) {
      const { code } = AuthSession.parse(result.url).params;
      const { data: session, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
      if (sessionError) throw sessionError;
      return session;
    }
  }
  throw new Error('Google sign-in failed');
}