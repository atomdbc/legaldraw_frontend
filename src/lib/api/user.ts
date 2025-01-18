// src/lib/api/user.ts
import { authApi } from './auth';
import type { User, UserUpdateRequest } from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class UserApiError extends Error {
  constructor(public error: { status: number; message: string; code?: string }) {
    super(error.message);
    this.name = 'UserApiError';
  }
}

export const userApi = {
  async getProfile(): Promise<User> {
    try {
      return await authApi.authenticatedRequest<User>(
        `${API_BASE_URL}/auth/me`
      );
    } catch (error: any) {
      throw new UserApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to fetch profile',
        code: 'GET_PROFILE_ERROR'
      });
    }
  },

  async updateProfile(data: UserUpdateRequest): Promise<User> {
    try {
      return await authApi.authenticatedRequest<User>(
        `${API_BASE_URL}/auth/me`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }
      );
    } catch (error: any) {
      throw new UserApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to update profile',
        code: 'UPDATE_PROFILE_ERROR'
      });
    }
  },

  async uploadAvatar(file: File): Promise<{ url: string }> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      return await authApi.authenticatedRequest<{ url: string }>(
        `${API_BASE_URL}/auth/me/avatar`,
        {
          method: 'POST',
          body: formData
        }
      );
    } catch (error: any) {
      throw new UserApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to upload avatar',
        code: 'UPLOAD_AVATAR_ERROR'
      });
    }
  },

  async deleteAccount(password: string): Promise<void> {
    try {
      await authApi.authenticatedRequest(
        `${API_BASE_URL}/auth/account`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        }
      );
    } catch (error: any) {
      throw new UserApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to delete account',
        code: 'DELETE_ACCOUNT_ERROR'
      });
    }
  }
};