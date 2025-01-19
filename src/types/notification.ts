// src/types/notification.ts

export interface NotificationSettings {
    document_completion: boolean;
    document_expiration: boolean;
    usage_alerts: boolean;
    email_updates: boolean;
  }
  
  export interface NotificationLog {
    id: string;
    user_id: string;
    type: 'completion' | 'expiration' | 'usage' | 'email';
    document_id?: string;
    message: string;
    notification_metadata?: Record<string, any>;
    is_read: boolean;
    created_at: string;
  }
  
  export interface NotificationSettingsResponse extends NotificationSettings {
    id: string;
    user_id: string;
    created_at: string;
    updated_at: string;
  }