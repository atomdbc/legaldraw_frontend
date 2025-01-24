// src/lib/api/auth.ts

import { 
  LoginResponse, 
  RegisterData, 
  UserProfile, 
  UserUpdateData,
  EmailVerificationData,
  DeleteAccountData,
  OTPVerificationData
} from "@/types/auth";
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Cookie expiration times in days
const ACCESS_TOKEN_EXPIRY = 4/24; // 4 hours in days (4/24)
const REFRESH_TOKEN_EXPIRY = 7;   // 7 days

export class AuthError extends Error {
  constructor(public error: { status: number; message: string; code?: string }) {
    super(error.message);
    this.name = 'AuthError';
  }
}

// Track if a token refresh is in progress
let refreshPromise: Promise<LoginResponse> | null = null;

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      detail: response.statusText
    }));

    throw new AuthError({
      status: response.status,
      message: errorData.detail || 'Request failed',
      code: errorData.code
    });
  }

  return response.json();
}

function getAuthHeader(): HeadersInit {
  const token = Cookies.get('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

async function refreshTokenIfNeeded(): Promise<void> {
  const token = Cookies.get('accessToken');
  if (!token && Cookies.get('refreshToken')) {
    if (!refreshPromise) {
      refreshPromise = authApi.refreshToken();
    }
    await refreshPromise;
    refreshPromise = null;
  }
}

export const authApi = {
  async authenticatedRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      // Try to refresh token if needed before making request
      await refreshTokenIfNeeded();

      const headers = {
        ...getAuthHeader(),
        ...options.headers
      };

      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include'
      });

      // If unauthorized, try refreshing token once
      if (response.status === 401) {
        try {
          await authApi.refreshToken();
          // Retry request with new token
          const newHeaders = {
            ...getAuthHeader(),
            ...options.headers
          };
          const retryResponse = await fetch(url, {
            ...options,
            headers: newHeaders,
            credentials: 'include'
          });
          return handleResponse<T>(retryResponse);
        } catch (refreshError) {
          // If refresh fails, clear tokens and throw original error
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
          throw new AuthError({
            status: 401,
            message: 'Session expired, please login again',
            code: 'SESSION_EXPIRED'
          });
        }
      }

      return handleResponse<T>(response);
    } catch (error: any) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError({
        status: 0,
        message: error.message || 'Network error',
        code: 'NETWORK_ERROR'
      });
    }
  },

  async register(userData: RegisterData): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email,
          full_name: userData.full_name,
          company: userData.company,
        }),
        credentials: 'include'
      });

      const data = await handleResponse(response);
      
      // Set tokens from registration response
      if (data.tokens) {
        Cookies.set('accessToken', data.tokens.access_token, {
          expires: ACCESS_TOKEN_EXPIRY,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production'
        });
        
        Cookies.set('refreshToken', data.tokens.refresh_token, {
          expires: REFRESH_TOKEN_EXPIRY,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production'
        });
      }

      return data;
    } catch (error: any) {
      throw new AuthError({
        status: error.status || 500,
        message: error.message || 'Registration failed',
        code: 'REGISTRATION_ERROR'
      });
    }
  },

  async requestEmailVerificationOTP(data: { email: string }): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-email/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      });

      return handleResponse<void>(response);
    } catch (error: any) {
      throw new AuthError({
        status: error.status || 500,
        message: error.message || 'Failed to request verification code',
        code: 'VERIFICATION_REQUEST_ERROR'
      });
    }
  },

  async verifyEmail(data: EmailVerificationData): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      });

      return handleResponse<void>(response);
    } catch (error: any) {
      throw new AuthError({
        status: error.status || 500,
        message: error.message || 'Email verification failed',
        code: 'VERIFICATION_ERROR'
      });
    }
  },

  async requestLoginOTP(email: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include'
      });

      return handleResponse<void>(response);
    } catch (error: any) {
      throw new AuthError({
        status: error.status || 500,
        message: error.message || 'Failed to request OTP',
        code: 'OTP_REQUEST_ERROR'
      });
    }
  },

  async verifyLoginOTP(email: string, otp: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
        credentials: 'include'
      });

      // Add specific handling for 403 status
      if (response.status === 403) {
        const errorData = await response.json();
        throw new AuthError({
          status: 403,
          message: errorData.detail.message,
          code: errorData.detail.code
        });
      }

      const data = await handleResponse<LoginResponse>(response);
      
      Cookies.set('accessToken', data.access_token, { 
        expires: ACCESS_TOKEN_EXPIRY,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      });
      
      Cookies.set('refreshToken', data.refresh_token, {
        expires: REFRESH_TOKEN_EXPIRY,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      });

      return data;
    } catch (error: any) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError({
        status: error.status || 500,
        message: error.message || 'Login failed',
        code: error.code || 'LOGIN_ERROR'
      });
    }
  },

  async getProfile(): Promise<UserProfile> {
    return this.authenticatedRequest<UserProfile>(`${API_BASE_URL}/auth/me`);
  },

  async updateProfile(data: UserUpdateData): Promise<UserProfile> {
    return this.authenticatedRequest<UserProfile>(`${API_BASE_URL}/auth/me`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async logout(): Promise<void> {
    try {
      await this.authenticatedRequest<void>(`${API_BASE_URL}/auth/logout`, {
        method: 'POST'
      });
    } finally {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    }
  },

  async requestDeleteAccountOTP(): Promise<void> {
    return this.authenticatedRequest<void>(`${API_BASE_URL}/auth/delete-account/request-otp`, {
      method: 'POST'
    });
  },

  async deleteAccount(data: OTPVerificationData): Promise<void> {
    try {
      await this.authenticatedRequest<void>(`${API_BASE_URL}/auth/account`, {
        method: 'DELETE',
        body: JSON.stringify(data)
      });
    } finally {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    }
  },

  async refreshToken(): Promise<LoginResponse> {
    const refreshToken = Cookies.get('refreshToken');
    if (!refreshToken) {
      throw new AuthError({
        status: 401,
        message: 'No refresh token available',
        code: 'NO_REFRESH_TOKEN'
      });
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${refreshToken}`,
          'Content-Type': 'application/json' 
        },
        credentials: 'include'
      });

      const data = await handleResponse<LoginResponse>(response);
      
      Cookies.set('accessToken', data.access_token, {
        expires: ACCESS_TOKEN_EXPIRY, // 4 hours
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      });
      
      Cookies.set('refreshToken', data.refresh_token, {
        expires: REFRESH_TOKEN_EXPIRY, // 7 days
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      });

      return data;
    } catch (error: any) {
      // Clear tokens on refresh failure
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      throw new AuthError({
        status: error.status || 401,
        message: error.message || 'Failed to refresh token',
        code: 'REFRESH_TOKEN_ERROR'
      });
    }
  },

  isAuthenticated(): boolean {
    return Boolean(Cookies.get('accessToken'));
  }
};