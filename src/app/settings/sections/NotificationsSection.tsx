'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bell, Mail, FileText, CreditCard, AlertTriangle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationPreference {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  category: string;
  icon: typeof Bell;
  required?: boolean;
}

interface NotificationCategory {
  id: string;
  title: string;
  description: string;
  preferences: NotificationPreference[];
}

interface NotificationsSectionProps {
  isLoading: boolean;
}

export function NotificationsSection({ isLoading }: NotificationsSectionProps) {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<NotificationCategory[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load notification preferences
  useEffect(() => {
    const loadPreferences = async () => {
      // Replace with actual API call
      const defaultPreferences: NotificationCategory[] = [
        {
          id: 'documents',
          title: 'DOCUMENT NOTIFICATIONS',
          description: 'Notifications related to your documents',
          preferences: [
            {
              id: 'doc_completion',
              title: 'Document Completion',
              description: 'Receive notifications when your document is ready',
              enabled: true,
              category: 'documents',
              icon: FileText
            },
            {
              id: 'doc_expiry',
              title: 'Document Expiry',
              description: 'Get notified before your documents expire',
              enabled: true,
              category: 'documents',
              icon: Clock
            },
            {
              id: 'doc_updates',
              title: 'Document Updates',
              description: 'Get notified about changes to your documents',
              enabled: false,
              category: 'documents',
              icon: Bell
            }
          ]
        },
        {
          id: 'account',
          title: 'ACCOUNT NOTIFICATIONS',
          description: 'Important updates about your account',
          preferences: [
            {
              id: 'payment_confirm',
              title: 'Payment Confirmations',
              description: 'Receive receipts and payment confirmations',
              enabled: true,
              category: 'account',
              icon: CreditCard,
              required: true
            },
            {
              id: 'usage_alerts',
              title: 'Usage Alerts',
              description: 'Get notified when approaching document limits',
              enabled: true,
              category: 'account',
              icon: AlertTriangle
            },
            {
              id: 'security_alerts',
              title: 'Security Alerts',
              description: 'Important security-related notifications',
              enabled: true,
              category: 'account',
              icon: Bell,
              required: true
            }
          ]
        }
      ];

      setPreferences(defaultPreferences);
    };

    loadPreferences();
  }, []);

  const handleToggle = async (categoryId: string, preferenceId: string) => {
    try {
      setIsUpdating(true);
      
      // Find and update the specific preference
      const updatedPreferences = preferences.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            preferences: category.preferences.map(pref => {
              if (pref.id === preferenceId) {
                return { ...pref, enabled: !pref.enabled };
              }
              return pref;
            })
          };
        }
        return category;
      });

      setPreferences(updatedPreferences);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      toast({
        title: "Preferences Updated",
        description: "Your notification settings have been saved"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update notification preferences"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <NotificationsSectionLoading />;
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Choose what updates you want to receive and how</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Verification Alert */}
          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription>
              Notifications will be sent to your verified email address. You can update your email in profile settings.
            </AlertDescription>
          </Alert>

          {/* Notification Categories */}
          {preferences.map((category) => (
            <div key={category.id} className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-medium text-sm text-zinc-500">{category.title}</h4>
                <p className="text-sm text-zinc-500">{category.description}</p>
              </div>

              <div className="space-y-4">
                {category.preferences.map((preference, index) => {
                  const PreferenceIcon = preference.icon;
                  
                  return (
                    <div key={preference.id}>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5 flex-1">
                          <div className="flex items-center gap-2">
                            <PreferenceIcon className="h-4 w-4 text-zinc-500" />
                            <Label className="font-medium cursor-pointer">
                              {preference.title}
                              {preference.required && (
                                <Badge variant="outline" className="ml-2">Required</Badge>
                              )}
                            </Label>
                          </div>
                          <div className="text-sm text-zinc-500 pl-6">
                            {preference.description}
                          </div>
                        </div>
                        <Switch
                          checked={preference.enabled}
                          onCheckedChange={() => {
                            if (!preference.required) {
                              handleToggle(category.id, preference.id);
                            }
                          }}
                          disabled={preference.required || isUpdating}
                        />
                      </div>
                      {index < category.preferences.length - 1 && (
                        <Separator className="my-4" />
                      )}
                    </div>
                  );
                })}
              </div>
              {preferences.indexOf(category) < preferences.length - 1 && (
                <Separator className="my-6" />
              )}
            </div>
          ))}

          {/* Coming Soon Features */}
          <div className="bg-zinc-50 rounded-lg p-4 mt-6">
            <h4 className="font-medium mb-2">Coming Soon Features</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm">Custom Notification Schedules</span>
                </div>
                <Badge variant="outline">Soon</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm">SMS Notifications</span>
                </div>
                <Badge variant="outline">Soon</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function NotificationsSectionLoading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-6">
        {[1, 2].map((category) => (
          <div key={category} className="space-y-4">
            <Skeleton className="h-5 w-32" />
            {[1, 2, 3].map((pref) => (
              <div key={pref}>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-72" />
                  </div>
                  <Skeleton className="h-6 w-11" />
                </div>
                <Separator className="my-4" />
              </div>
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}