export interface Profile {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  email: string | null;
}

export interface Earthquake {
  id: string;
  magnitude: number;
  latitude: number;
  longitude: number;
  depth: number | null;
  location: string | null;
  region: string | null;
  occurred_at: string;
}
export interface SafeZone {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: string;
  capacity: number | null;
  is_verified: boolean;
  description: string | null;
  city: string | null;
  distance_from_user?: number;
}
export interface EmergencyContact {
  id: string;
  user_id: string;
  name: string;
  phone_number: string;
  relationship: string | null;
  is_primary: boolean;
}