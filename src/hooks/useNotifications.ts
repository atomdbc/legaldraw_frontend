import { useState, useCallback } from 'react';
import { notificationApi } from '@/lib/api/notification';
import { useToast } from '@/hooks/use-toast';
import type { NotificationSettings, NotificationLog } from '@/types/notification';

export const useNotifications = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [updatingSettings, setUpdatingSettings] = useState<Set<keyof NotificationSettings>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<NotificationSettings>({
    document_completion: false,
    document_expiration: false,
    usage_alerts: false,
    email_updates: false
  });
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const { toast } = useToast();

  const clearError = useCallback(() => setError(null), []);

  const getSettings = useCallback(async () => {
    if (isLoading) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await notificationApi.getSettings();
      
      if (response && typeof response === 'object') {
        setSettings(response);
        return response;
      } else {
        throw new Error('Invalid settings response');
      }
    } catch (err: any) {
      const errorMessage = err.error?.message || 'Failed to fetch notification settings';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Settings Error",
        description: errorMessage
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, toast]);

  const updateSettings = useCallback(async (
    newSettings: Partial<NotificationSettings>,
    key: keyof NotificationSettings
  ) => {
    if (updatingSettings.has(key)) return null;
    
    setError(null);
    setUpdatingSettings(prev => new Set([...prev, key]));
    
    try {
      // First, update the setting optimistically
      setSettings(prev => ({
        ...prev,
        [key]: newSettings[key]
      }));

      const response = await notificationApi.updateSettings(newSettings);
      
      if (response && typeof response === 'object') {
        // After successful update, get the latest settings
        await getSettings();
        
        toast({
          title: "Settings Updated",
          description: "Your notification preferences have been saved."
        });
        return response;
      } else {
        // If update fails, revert the optimistic update
        setSettings(prev => ({
          ...prev,
          [key]: !newSettings[key]
        }));
        throw new Error('Invalid update response');
      }
    } catch (err: any) {
      // Revert optimistic update on error
      setSettings(prev => ({
        ...prev,
        [key]: !newSettings[key]
      }));
      
      const errorMessage = err.error?.message || 'Failed to update notification settings';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Update Error",
        description: errorMessage
      });
      return null;
    } finally {
      setUpdatingSettings(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }
  }, [toast, updatingSettings, getSettings]);

  return {
    isLoading,
    error,
    settings,
    notifications,
    getSettings,
    updateSettings,
    clearError,
    updatingSettings
  };
};