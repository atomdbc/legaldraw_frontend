import { useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, AlertTriangle, Mail, Clock, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNotifications } from '@/hooks/useNotifications';
import type { NotificationSettings } from '@/types/notification';

const NOTIFICATION_CONFIGS = [
  {
    key: 'document_completion' as keyof NotificationSettings,
    title: 'Document Completion',
    description: 'Get notified when your document is ready',
    icon: FileText
  },
  {
    key: 'document_expiration' as keyof NotificationSettings,
    title: 'Document Expiration',
    description: 'Alerts before your documents expire',
    icon: Clock
  },
  {
    key: 'usage_alerts' as keyof NotificationSettings,
    title: 'Usage Alerts',
    description: 'Notifications when approaching limits',
    icon: AlertTriangle
  },
  {
    key: 'email_updates' as keyof NotificationSettings,
    title: 'Email Updates',
    description: 'Important account and security updates',
    icon: Mail
  }
] as const;

export function NotificationsSection() {
  const { 
    settings, 
    isLoading, 
    getSettings, 
    updateSettings, 
    updatingSettings 
  } = useNotifications();

  // Load settings only once on mount
  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      if (mounted) {
        await getSettings();
      }
    };

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []); // Empty dependency array

  const handleClick = useCallback(async (key: keyof NotificationSettings) => {
    if (!settings) return;
    
    const newValue = !settings[key];
    await updateSettings({ [key]: newValue }, key);
  }, [settings, updateSettings]);

  const handleRefresh = useCallback(async () => {
    await getSettings();
  }, [getSettings]);

  if (isLoading && !settings) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between space-x-4">
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-64" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Notifications</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {NOTIFICATION_CONFIGS.map((config, index) => {
          const Icon = config.icon;
          const isEnabled = settings?.[config.key] ?? false;
          const isUpdating = updatingSettings.has(config.key);

          return (
            <div key={config.key}>
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="rounded-lg border p-2">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <Label>{config.title}</Label>
                    <p className="text-sm text-gray-500">
                      {config.description}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => handleClick(config.key)}
                  variant={isEnabled ? "default" : "outline"}
                  size="sm"
                  disabled={isUpdating}
                  className="min-w-[100px]"
                >
                  {isUpdating ? 'Updating...' : isEnabled ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
              {index < NOTIFICATION_CONFIGS.length - 1 && (
                <Separator className="my-4" />
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}