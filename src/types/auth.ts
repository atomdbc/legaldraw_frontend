// src/types/auth.ts

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at?: string;
  last_login?: string;
  settings?: Record<string, any>;
}

export interface UserUpdateData {
  full_name?: string;
  settings?: Record<string, any>;
}

export interface PasswordChangeData {
  oldPassword: string;
  newPassword: string;
}

export interface EmailVerificationData {
  token: string;
}

export interface PasswordResetData {
  token: string;
  newPassword: string;
}

export interface DeleteAccountData {
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
}