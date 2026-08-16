import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { registerForPushNotifications } from '../services/notificationService';
import { Profile, EmergencyContact } from '../types';

interface AuthState {
  user: any | null;
  profile: Profile | null;
  emergencyContacts: EmergencyContact[];
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, phoneNumber: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
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
  loading: true,

  signUp: async (email, password, fullName, phoneNumber) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, phone_number: phoneNumber } },
    });
    if (error) throw error;
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    set({ user: data.user });
    if (data.user) {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
      set({ profile });
      await registerForPushNotifications(data.user.id);
      await get().loadEmergencyContacts();
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, emergencyContacts: [] });
  },

  resetPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  loadUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      set({ user, profile, loading: false });
      await get().loadEmergencyContacts();
    } else {
      set({ user: null, profile: null, loading: false });
    }
  },

  loadEmergencyContacts: async () => {
    const { user } = get();
    if (!user) return;
    const { data } = await supabase.from('emergency_contacts').select('*').eq('user_id', user.id).order('is_primary', { ascending: false });
    set({ emergencyContacts: data || [] });
  },

  addEmergencyContact: async (contact) => {
    const { user } = get();
    if (!user) return;
    const { data, error } = await supabase.from('emergency_contacts').insert({ ...contact, user_id: user.id }).select().single();
    if (error) throw error;
    set({ emergencyContacts: [...get().emergencyContacts, data] });
  },

  updateEmergencyContact: async (id, updates) => {
    const { error } = await supabase.from('emergency_contacts').update(updates).eq('id', id);
    if (error) throw error;
    set({ emergencyContacts: get().emergencyContacts.map(c => c.id === id ? { ...c, ...updates } : c) });
  },

  deleteEmergencyContact: async (id) => {
    const { error } = await supabase.from('emergency_contacts').delete().eq('id', id);
    if (error) throw error;
    set({ emergencyContacts: get().emergencyContacts.filter(c => c.id !== id) });
  },

  setPrimaryContact: async (id) => {
    const { user } = get();
    if (!user) return;
    await supabase.from('emergency_contacts').update({ is_primary: false }).eq('user_id', user.id);
    await supabase.from('emergency_contacts').update({ is_primary: true }).eq('id', id);
    set({ emergencyContacts: get().emergencyContacts.map(c => ({ ...c, is_primary: c.id === id })) });
  },
}));