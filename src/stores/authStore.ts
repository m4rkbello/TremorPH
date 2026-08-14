import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { registerForPushNotifications } from '../services/notificationService';
import { Profile, EmergencyContact } from '../types';

interface AuthState {
  user: any | null;
  profile: Profile | null;
  emergencyContacts: EmergencyContact[];
  pushToken: string | null;
  loading: boolean;
  
  signUp: (email: string, password: string, fullName: string, phoneNumber: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  loadUser: () => Promise<void>;
  loadEmergencyContacts: () => Promise<void>;
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id' | 'user_id'>) => Promise<void>;
  updateEmergencyContact: (id: string, updates: Partial<EmergencyContact>) => Promise<void>;
  deleteEmergencyContact: (id: string) => Promise<void>;
  setPrimaryContact: (id: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  emergencyContacts: [],
  pushToken: null,
  loading: true,

  signUp: async (email, password, fullName, phoneNumber) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, phone_number: phoneNumber } },
    });

    if (authError) throw authError;

    if (authData.user) {
      await supabase.from('profiles').update({
        phone_number: phoneNumber,
      }).eq('id', authData.user.id);
    }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    set({ user: data.user });

    if (data.user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      set({ profile: profileData });

      const token = await registerForPushNotifications(data.user.id);
      set({ pushToken: token });

      await get().loadEmergencyContacts();
    }
  },

  signOut: async () => {
    const { user, pushToken } = get();
    if (user && pushToken) {
      await supabase
        .from('user_device_tokens')
        .update({ is_active: false })
        .eq('user_id', user.id)
        .eq('expo_push_token', pushToken);
    }

    await supabase.auth.signOut();
    set({ user: null, profile: null, emergencyContacts: [], pushToken: null });
  },

  resetPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'earthquakeph://reset-password',
    });
    if (error) throw error;
  },

  updateProfile: async (updates) => {
    const { user } = get();
    if (!user) throw new Error('No user logged in');

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) throw error;

    set((state) => ({
      profile: { ...state.profile, ...updates } as Profile,
    }));
  },

  loadUser: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        set({ user, profile: profileData, loading: false });

        const token = await registerForPushNotifications(user.id);
        set({ pushToken: token });

        await get().loadEmergencyContacts();
      } else {
        set({ user: null, profile: null, loading: false });
      }
    } catch (error) {
      console.error('Error loading user:', error);
      set({ loading: false });
    }
  },

  loadEmergencyContacts: async () => {
    const { user } = get();
    if (!user) return;

    const { data, error } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', user.id)
      .order('is_primary', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    set({ emergencyContacts: data || [] });
  },

  addEmergencyContact: async (contact) => {
    const { user } = get();
    if (!user) throw new Error('No user logged in');

    const { data, error } = await supabase
      .from('emergency_contacts')
      .insert({ ...contact, user_id: user.id })
      .select()
      .single();

    if (error) throw error;

    set((state) => ({
      emergencyContacts: [...state.emergencyContacts, data],
    }));
  },

  updateEmergencyContact: async (id, updates) => {
    const { error } = await supabase
      .from('emergency_contacts')
      .update(updates)
      .eq('id', id);

    if (error) throw error;

    set((state) => ({
      emergencyContacts: state.emergencyContacts.map((contact) =>
        contact.id === id ? { ...contact, ...updates } : contact
      ),
    }));
  },

  deleteEmergencyContact: async (id) => {
    const { error } = await supabase
      .from('emergency_contacts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    set((state) => ({
      emergencyContacts: state.emergencyContacts.filter(
        (contact) => contact.id !== id
      ),
    }));
  },

  setPrimaryContact: async (id) => {
    const { user } = get();
    if (!user) throw new Error('No user logged in');

    await supabase
      .from('emergency_contacts')
      .update({ is_primary: false })
      .eq('user_id', user.id);

    await supabase
      .from('emergency_contacts')
      .update({ is_primary: true })
      .eq('id', id);

    set((state) => ({
      emergencyContacts: state.emergencyContacts.map((contact) => ({
        ...contact,
        is_primary: contact.id === id,
      })),
    }));
  },
}));