// src/types/auth.ts

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  company?: string;
  role?: string;
  is_active: boolean;
  is_verified: boolean;
  subscription_tier: string;
  documents_generated: number;
  created_at: string;
  updated_at: string;
}



export interface RegisterData {
  email: string;
  full_name: string;  // Changed from fullName
  company?: string;   // Changed from organization
  role?: string;
}

export interface UserUpdateData {
  full_name?: string;
  company?: string;
  role?: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user_id: string;
  email: string;
}

export interface OTPVerificationData {
  email: string;
  otp: string;
}

export interface EmailVerificationData extends OTPVerificationData {}
export interface DeleteAccountData extends OTPVerificationData {}