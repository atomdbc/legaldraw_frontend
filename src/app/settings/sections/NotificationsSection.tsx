import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, AlertTriangle, Mail, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationPreference {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  icon: any;
}

export function NotificationsSection({ isLoading }: { isLoading: boolean }) {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      id: 'doc_completion',
      title: 'Document Completion',
      description: 'Get notified when your document is ready',
      enabled: true,
      icon: FileText
    },
    {
      id: 'doc_expiration',
      title: 'Document Expiration',
      description: 'Alerts before your documents expire',
      enabled: true,
      icon: Clock
    },
    {
      id: 'usage_alerts',
      title: 'Usage Alerts',
      description: 'Notifications when approaching limits',
      enabled: true,
      icon: AlertTriangle
    },
    {
      id: 'email_updates',
      title: 'Email Updates',
      description: 'Important account and security updates',
      enabled: true,
      icon: Mail
    }
  ]);

  const handleToggle = async (prefId: string) => {
    try {
      const updatedPrefs = preferences.map(pref => 
        pref.id === prefId ? { ...pref, enabled: !pref.enabled } : pref
      );
      setPreferences(updatedPrefs);
      
      toast({
        title: "Updated",
        description: "Notification settings saved"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save settings"
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-10" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {preferences.map((pref, index) => {
            const Icon = pref.icon;
            return (
              <div key={pref.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="space-y-1">
                      <Label className="font-medium">{pref.title}</Label>
                      <p className="text-sm text-muted-foreground">{pref.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={pref.enabled}
                    onCheckedChange={() => handleToggle(pref.id)}
                  />
                </div>
                {index < preferences.length - 1 && <Separator className="my-4" />}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}