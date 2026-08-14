export interface Profile {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  emergency_contact: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Earthquake {
  id: string;
  magnitude: number;
  latitude: number;
  longitude: number;
  depth: number | null;
  location: string | null;
  region: string | null;
  is_philippines: boolean;
  is_par: boolean;
  source: string;
  source_id: string | null;
  occurred_at: string;
  created_at: string;
}

export interface SafeZone {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: 'open_field' | 'evacuation_center' | 'park' | 'plaza' | 'school_ground' | 'gymnasium' | 'church';
  capacity: number | null;
  is_verified: boolean;
  description: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  distance_from_user?: number;
  created_at?: string;
  updated_at?: string;
}

export interface EmergencyContact {
  id: string;
  user_id: string;
  name: string;
  phone_number: string;
  email: string | null;
  relationship: string | null;
  is_primary: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface NotificationSettings {
  user_id: string;
  enable_push: boolean;
  enable_sms: boolean;
  min_magnitude: number;
  phone_number: string | null;
}