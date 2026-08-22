import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { registerForPushNotifications } from '../services/notificationService';
import { Profile, EmergencyContact } from '../types';
// 1. Import your Google Auth service
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
  loadUser: () => Promise<void>;
  loadEmergencyContacts: () => Promise<void>;
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id' | 'user_id'>) => Promise<void>;
  updateEmergencyContact: (id: string, updates: Partial<EmergencyContact>) => Promise<void>;
  deleteEmergencyContact: (id: string) => Promise<void>;
  setPrimaryContact: (id: string) => Promise<void>;
  // 2. Add this to the interface
  signInWithGoogle: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  emergencyContacts: [],
  loading: true,

  // ... (keep your existing signUp, signIn, signOut, resetPassword, loadUser, etc. exactly the same) ...

  // 3. Add the Google Sign In Implementation
  signInWithGoogle: async () => {
    const session = await googleAuthService();
    
    if (session?.user) {
      set({ user: session.user });
      
      // Extract Google metadata (Name)
      const fullName = session.user.user_metadata?.full_name || session.user.user_metadata?.name;
      
      // Upsert profile (Creates it if it doesn't exist, updates it if it does)
      const { data: profile, error } = await supabase
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

  // ... (keep your existing emergency contact functions here)
}));