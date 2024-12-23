// src/lib/api/auth.ts

import { 
  LoginResponse, 
  RegisterData, 
  UserProfile, 
  UserUpdateData,
  PasswordChangeData,
  EmailVerificationData,
  PasswordResetData,
  DeleteAccountData
} from "@/types/auth";
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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
      // Handle network errors
      throw new AuthError({
        status: 0,
        message: error.message || 'Network error',
        code: 'NETWORK_ERROR'
      });
    }
  },

  async register(userData: RegisterData): Promise<UserProfile> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        credentials: 'include'
      });

      return handleResponse<UserProfile>(response);
    } catch (error: any) {
      throw new AuthError({
        status: error.status || 500,
        message: error.message || 'Registration failed',
        code: 'REGISTRATION_ERROR'
      });
    }
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: email,
          password: password
        }),
        credentials: 'include'
      });

      const data = await handleResponse<LoginResponse>(response);
      
      Cookies.set('accessToken', data.access_token, { 
        expires: 1/48, // 30 minutes
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      });
      
      Cookies.set('refreshToken', data.refresh_token, {
        expires: 7, // 7 days
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      });

      return data;
    } catch (error: any) {
      throw new AuthError({
        status: error.status || 500,
        message: error.message || 'Login failed',
        code: 'LOGIN_ERROR'
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

  async changePassword(data: PasswordChangeData): Promise<void> {
    return this.authenticatedRequest<void>(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      body: JSON.stringify({
        old_password: data.oldPassword,
        new_password: data.newPassword
      })
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

  async deleteAccount(data: DeleteAccountData): Promise<void> {
    try {
      await this.authenticatedRequest<void>(`${API_BASE_URL}/auth/account`, {
        method: 'DELETE',
        body: JSON.stringify({ password: data.password })
      });
    } finally {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    }
  },

  async verifyEmail(data: EmailVerificationData): Promise<void> {
    return this.authenticatedRequest<void>(`${API_BASE_URL}/auth/verify-email`, {
      method: 'POST',
      body: JSON.stringify({ token: data.token })
    });
  },

  async resendVerification(): Promise<void> {
    return this.authenticatedRequest<void>(`${API_BASE_URL}/auth/resend-verification`, {
      method: 'POST'
    });
  },

  async requestPasswordReset(email: string): Promise<void> {
    return fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      credentials: 'include'
    }).then(handleResponse);
  },

  async resetPassword(data: PasswordResetData): Promise<void> {
    return fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: data.token,
        new_password: data.newPassword
      }),
      credentials: 'include'
    }).then(handleResponse);
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
        expires: 1/48, // 30 minutes
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      });
      
      Cookies.set('refreshToken', data.refresh_token, {
        expires: 7, // 7 days
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