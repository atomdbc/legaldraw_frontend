'use client';

import { useState, useEffect } from 'react';
import { usePayment } from '@/hooks/usePayment';
import { useToast } from '@/hooks/use-toast';
import { QuickStats } from './QuickStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, CreditCard, Bell } from 'lucide-react';
import type { UserPlanResponse, UsageStatsResponse } from '@/types/payment';
import { BillingSection } from './sections/BillingSection';
import { ProfileSection } from './sections/ProfileSection';
import { NotificationsSection } from './sections/NotificationsSection';

export function SettingsClient() {
  const { getUserPlan, getUsageStats, isLoading } = usePayment();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [userPlan, setUserPlan] = useState<UserPlanResponse | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStatsResponse | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [planData, statsData] = await Promise.all([
        getUserPlan().catch(() => null),
        getUsageStats().catch(() => null)
      ]);
      
      setUserPlan(planData);
      setUsageStats(statsData);
    } catch (error) {
      console.error('Error loading settings data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load settings data"
      });
    }
  };

  const handleDataRefresh = () => {
    loadData();
  };

  return (
    <div className="pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Account Settings</h1>
        <p className="text-sm text-zinc-500">Manage your account preferences and settings</p>
      </div>

      <QuickStats 
        isLoading={isLoading}
        userPlan={userPlan}
        usageStats={usageStats}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="w-full justify-start border-b rounded-none p-0 h-auto">
          <div className="container flex gap-6 border-b">
            <TabsTrigger
              value="profile"
              className="relative h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-zinc-900"
            >
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="relative h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-zinc-900"
            >
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Billing
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="relative h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-zinc-900"
            >
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </div>
            </TabsTrigger>
          </div>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSection onRefresh={handleDataRefresh} />
        </TabsContent>

        <TabsContent value="billing">
          <BillingSection 
            isLoading={isLoading}
            userPlan={userPlan}
            usageStats={usageStats}
            onRefresh={handleDataRefresh}
          />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsSection onRefresh={handleDataRefresh} />
        </TabsContent>
      </Tabs>
    </div>
  );
}