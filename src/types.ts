export type CityCode = 'TYO_JP' | 'LIS_PT' | 'DPS_ID';

export type PlanCategory = 'dining' | 'cafe_cowork' | 'cultural_sight' | 'outdoor_walk' | 'nightlife';

export type PlanStatus = 'open' | 'filled' | 'in_progress' | 'completed' | 'cancelled';

export type RsvpStatus = 'pending_approval' | 'confirmed' | 'declined' | 'cancelled_by_user';

export type DepositStatus = 'held' | 'released' | 'captured';

export type UserGender = 'female' | 'male' | 'non_binary' | 'prefer_not_to_say';

export interface User {
  id: string;
  email: string;
  phone_number: string;
  full_name: string; // From verified ID
  display_name: string; // First name + last initial (e.g. "Elena R.")
  gender: UserGender;
  date_of_birth: string; // YYYY-MM-DD
  bio: string;
  profile_photo_url: string;
  is_verified: boolean;
  verified_at: string | null;
  verification_provider_ref: string | null;
  has_paid_pass: boolean;
  reliability_score: number; // Starts at 100, -25 for no-show
  origin_country: string;
  origin_flag: string;
  native_language: string;
  code_of_conduct_signed: boolean;
  social_link?: string;
  meetups_completed_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Trip {
  id: string;
  user_id: string;
  city_code: CityCode;
  arrival_date: string; // YYYY-MM-DD
  departure_date: string; // YYYY-MM-DD
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  created_at: string;
}

export interface CommercialVenue {
  place_id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  category: 'Food & Drink' | 'Transit Station' | 'Museum' | 'Park' | 'Landmark' | 'Nightlife';
  city_code: CityCode;
}

export interface MicroPlan {
  id: string;
  host_user_id: string;
  city_code: CityCode;
  category: PlanCategory;
  title: string; // max 60 chars
  description: string; // max 300 chars
  venue_name: string;
  venue_address: string;
  venue_lat: number;
  venue_lng: number;
  venue_place_id: string;
  start_time: string; // ISO string
  end_time: string; // ISO string <= start_time + 4 hours
  max_participants: number; // 2 - 4
  female_only: boolean;
  photo_url?: string;
  status: PlanStatus;
  qr_checkin_token: string;
  created_at: string;
}

export interface PlanParticipant {
  id: string;
  plan_id: string;
  user_id: string;
  role: 'host' | 'guest';
  rsvp_status: RsvpStatus;
  deposit_payment_intent_id: string;
  deposit_status: DepositStatus;
  checked_in_at: string | null;
  created_at: string;
}

export interface ChatRoom {
  id: string;
  plan_id: string;
  is_active: boolean;
  expires_at: string; // plan.end_time + 24 hours
  created_at: string;
}

export interface ChatMessage {
  id: string;
  chat_room_id: string;
  sender_user_id: string;
  sender_name: string;
  sender_avatar: string;
  content: string; // max 500 chars
  created_at: string;
}

export type SafetyReportType = 'harassment' | 'unwanted_flirting' | 'no_show' | 'fake_profile' | 'unsafe_behavior';

export interface SafetyReport {
  id: string;
  reporter_user_id: string;
  reported_user_id: string;
  plan_id: string | null;
  reason: SafetyReportType;
  details: string;
  status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed';
  created_at: string;
}

export interface CityHubInfo {
  code: CityCode;
  name: string;
  country: string;
  flag: string;
  tagline: string;
  lat: number;
  lng: number;
  is_live: boolean;
}

export interface WaitlistRegion {
  id: string;
  city_name: string;
  country: string;
  flag: string;
  registered_count: number;
  threshold: number; // 200
  target_month: string;
}
