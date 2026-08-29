// src/stores/authStore.ts
import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { registerForPushNotifications } from '../services/notificationService';
import { Profile, EmergencyContact } from '../types';
import { signInWithGoogle as googleAuthService } from '../services/authService';

interface AuthState {
  user: any | null;
  profile: Profile | null;
  emergencyContacts: EmergencyContact[];
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, phoneNumber: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  init: () => Promise<void>;
  loadUser: () => Promise<void>;
  loadEmergencyContacts: () => Promise<void>;
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id' | 'user_id'>) => Promise<void>;
  deleteEmergencyContact: (id: string) => Promise<void>;
  setPrimaryContact: (id: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  emergencyContacts: [],
  loading: true,

  init: async () => {
    // Add your initialization logic here (e.g. checking active session)
    const { data: { session } } = await supabase.auth.getSession();
    set({ user: session?.user || null, loading: false });
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    set({ user: data.user });
  },

  signUp: async (email, password, fullName, phoneNumber) => {
     const { data, error } = await supabase.auth.signUp({ email, password });
     if (error) throw error;
     // Handle profile creation here...
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, emergencyContacts: [] });
  },

  resetPassword: async (email) => {
      // Implement reset password
  },
  
  loadUser: async () => { /* implement */ },
  loadEmergencyContacts: async () => { /* implement */ },
  addEmergencyContact: async (contact) => { /* implement */ },
  deleteEmergencyContact: async (id) => { /* implement */ },
  setPrimaryContact: async (id) => { /* implement */ },

  signInWithGoogle: async () => {
    const session = await googleAuthService();
    
    if (session?.user) {
      set({ user: session.user });
      
      const fullName = session.user.user_metadata?.full_name || session.user.user_metadata?.name;
      
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
      await get().loadEmergencyContacts();
    }
  },
}));