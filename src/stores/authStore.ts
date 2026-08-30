import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { registerForPushNotifications } from '../services/notificationService';
import { signInWithGoogle as googleAuthService } from '../services/authService';
import { Profile, EmergencyContact, UserStatus } from '../types';

export interface SignUpPayload {
  email: string;
  password: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  age?: number;
  sex?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  birthdate?: string;
  contact_number?: string;
}

interface AuthState {
  user: any | null;
  profile: Profile | null;
  emergencyContacts: EmergencyContact[];
  loading: boolean;
  init: () => Promise<void>;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (payload: SignUpPayload) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserStatus: (status: UserStatus) => Promise<void>;
  fetchContacts: () => Promise<void>;
  addContact: (contact: Omit<EmergencyContact, 'id' | 'user_id'>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  emergencyContacts: [],
  loading: true,

  init: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        set({ user: session.user });

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) set({ profile });

        await registerForPushNotifications(session.user.id);
        await get().fetchContacts();
      }
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    set({ user: data.user });
    await get().init();
  },

  signUp: async (payload) => {
    const { email, password, first_name, middle_name, last_name, age, sex, birthdate, contact_number } = payload;
    const full_name = `${first_name} ${middle_name ? middle_name + ' ' : ''}${last_name}`.trim();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name, first_name, last_name },
      },
    });

    if (error) throw error;

    if (data.user) {
      const { data: updatedProfile, error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          first_name,
          middle_name: middle_name || null,
          last_name,
          full_name,
          age: age || null,
          sex: sex || null,
          birthdate: birthdate || null,
          contact_number: contact_number || null,
          email,
          status: 'safe',
          updated_at: new Date().toISOString(),
        })
        .select('*')
        .single();

      if (profileError) throw profileError;

      set({ user: data.user, profile: updatedProfile });
      await registerForPushNotifications(data.user.id);
    }
  },

  signInWithGoogle: async () => {
    const session = await googleAuthService();

    if (session?.user) {
      const googleUser = session.user;
      const metadata = googleUser.user_metadata || {};

      const fullName = metadata.full_name || metadata.name || 'Google User';
      const givenName = metadata.given_name || fullName.split(' ')[0] || 'User';
      const familyName = metadata.family_name || fullName.split(' ').slice(1).join(' ') || '';
      const avatarUrl = metadata.avatar_url || metadata.picture || null;

      // Upsert Google user profile into Supabase
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: googleUser.id,
          email: googleUser.email,
          first_name: givenName,
          last_name: familyName,
          full_name: fullName,
          avatar_url: avatarUrl,
          status: 'safe',
          updated_at: new Date().toISOString(),
        })
        .select('*')
        .single();

      if (profileError) throw profileError;

      set({ user: googleUser, profile });

      await registerForPushNotifications(googleUser.id);
      await get().fetchContacts();
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, emergencyContacts: [] });
  },

  updateUserStatus: async (status: UserStatus) => {
    const user = get().user;
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single();

    if (data) set({ profile: data });
  },

  fetchContacts: async () => {
    const user = get().user;
    if (!user) return;
    const { data } = await supabase.from('emergency_contacts').select('*').eq('user_id', user.id);
    if (data) set({ emergencyContacts: data || [] });
  },

  addContact: async (contact) => {
    const user = get().user;
    if (!user) return;
    const { data, error } = await supabase
      .from('emergency_contacts')
      .insert({ ...contact, user_id: user.id })
      .select()
      .single();

    if (!error && data) set({ emergencyContacts: [...get().emergencyContacts, data] });
  },

  deleteContact: async (id) => {
    await supabase.from('emergency_contacts').delete().eq('id', id);
    set({ emergencyContacts: get().emergencyContacts.filter((c) => c.id !== id) });
  },
}));