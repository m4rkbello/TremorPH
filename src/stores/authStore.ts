import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { registerForPushNotifications } from '../services/notificationService';
import { signInWithGoogle as googleAuthService } from '../services/authService';
import { Profile, EmergencyContact } from '../types';

interface AuthState {
  user: any | null;
  profile: Profile | null;
  emergencyContacts: EmergencyContact[];
  loading: boolean;
  init: () => Promise<void>;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, name: string, phone: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
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
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
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

  signUp: async (email, password, full_name, phone_number) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (data.user) {
      await supabase.from('profiles').insert({ id: data.user.id, full_name, phone_number, email });
    }
  },

  signInWithGoogle: async () => {
    const session = await googleAuthService();
    
    if (session?.user) {
      set({ user: session.user });
      
      const fullName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'Google User';
      
      // Upsert profile for Google users
      const { data: profile } = await supabase
        .from('profiles')
        .upsert({ 
          id: session.user.id,
          email: session.user.email,
          full_name: fullName,
        })
        .select('*')
        .single();
        
      if (profile) set({ profile });
      
      await registerForPushNotifications(session.user.id);
      await get().fetchContacts();
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, emergencyContacts: [] });
  },

  fetchContacts: async () => {
    const user = get().user;
    if (!user) return;
    const { data } = await supabase.from('emergency_contacts').select('*').eq('user_id', user.id);
    if (data) set({ emergencyContacts: data });
  },

  addContact: async (contact) => {
    const user = get().user;
    if (!user) return;
    const { data, error } = await supabase.from('emergency_contacts').insert({ ...contact, user_id: user.id }).select().single();
    if (!error && data) set({ emergencyContacts: [...get().emergencyContacts, data] });
  },

  deleteContact: async (id) => {
    await supabase.from('emergency_contacts').delete().eq('id', id);
    set({ emergencyContacts: get().emergencyContacts.filter((c) => c.id !== id) });
  },
}));