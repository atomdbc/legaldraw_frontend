// src/lib/api/notification.ts

import { authApi } from './auth';
import type {
  NotificationSettings,
  NotificationSettingsResponse,
  NotificationLog
} from '@/types/notification';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class NotificationApiError extends Error {
  constructor(public error: { status: number; message: string; code?: string }) {
    super(error.message);
    this.name = 'NotificationApiError';
  }

  toJSON() {
    return {
      name: this.name,
      error: this.error
    };
  }
}

export const notificationApi = {
  async getSettings(): Promise<NotificationSettingsResponse> {
    try {
      const response = await authApi.authenticatedRequest<NotificationSettingsResponse>(
        `${API_BASE_URL}/api/notifications/settings`
      );
      return response;
    } catch (error: any) {
      console.error('Get notification settings error:', error);
      throw new NotificationApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to fetch notification settings',
        code: 'GET_NOTIFICATION_SETTINGS_ERROR'
      });
    }
  },

  async updateSettings(settings: Partial<NotificationSettings>): Promise<NotificationSettingsResponse> {
    try {
      const response = await authApi.authenticatedRequest<NotificationSettingsResponse>(
        `${API_BASE_URL}/api/notifications/settings`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings)
        }
      );
      return response;
    } catch (error: any) {
      console.error('Update notification settings error:', error);
      throw new NotificationApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to update notification settings',
        code: 'UPDATE_NOTIFICATION_SETTINGS_ERROR'
      });
    }
  },

  async getNotifications(unreadOnly: boolean = false): Promise<NotificationLog[]> {
    try {
      const response = await authApi.authenticatedRequest<NotificationLog[]>(
        `${API_BASE_URL}/api/notifications/list?unread_only=${unreadOnly}`
      );
      return response;
    } catch (error: any) {
      console.error('Get notifications error:', error);
      throw new NotificationApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to fetch notifications',
        code: 'GET_NOTIFICATIONS_ERROR'
      });
    }
  }
};