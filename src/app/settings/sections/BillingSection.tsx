import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { UpgradePlanModal } from '../modals/UpgradePlanModal';
import { useState, useEffect } from 'react';
import { useDownloads } from '@/hooks/useDownloads';
import type { UserPlanResponse, UsageStatsResponse } from '@/types/payment';
import type { RemainingDownloadsResponse } from '@/types/download';

interface BillingSectionProps {
  isLoading: boolean;
  userPlan: UserPlanResponse | null;
  usageStats: UsageStatsResponse | null;
  onRefresh: () => void;
}

export function BillingSection({ 
  isLoading, 
  userPlan, 
  usageStats,
  onRefresh 
}: BillingSectionProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [downloadStats, setDownloadStats] = useState<RemainingDownloadsResponse | null>(null);
  const { getRemainingDownloads } = useDownloads();

  // Debug logs
  console.log('Usage Stats:', usageStats);
  console.log('Current Period:', usageStats?.current_period);
  console.log('Remaining Generations:', usageStats?.current_period?.remaining_generations);

  useEffect(() => {
    const fetchDownloadStats = async () => {
      const stats = await getRemainingDownloads();
      if (stats) {
        setDownloadStats(stats);
      }
    };

    fetchDownloadStats();
  }, [getRemainingDownloads]);

  if (isLoading) {
    return <BillingSectionLoading />;
  }

  // Calculate remaining docs and ensure it's not negative
  const remainingDocs = Math.max(usageStats?.current_period?.remaining_generations || 0, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Plan Details</CardTitle>
            <Button onClick={() => setShowUpgradeModal(true)}>
              {userPlan ? 'Upgrade' : 'Get Started'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {userPlan ? (
            <div className="space-y-6">
              {/* Current Plan Info */}
              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{userPlan.plan.name}</h3>
                    <Badge>{usageStats?.subscription_status}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ${userPlan.plan.price}{' '}
                    {userPlan.plan.billing_cycle === 'monthly' ? '/month' : 'one-time'}
                  </div>
                </div>
                {/* Show expiry date if monthly plan */}
                {userPlan.end_date && userPlan.plan.billing_cycle === 'monthly' && (
                  <div className="text-sm text-muted-foreground">
                    Renews: {format(new Date(userPlan.end_date), 'MMM dd, yyyy')}
                  </div>
                )}
              </div>

             {/* Usage Summary */}
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm font-medium mb-1">Total Downloads</div>
                  <div className="text-2xl font-bold">
                    {downloadStats?.is_unlimited ? 
                      '∞' : 
                      downloadStats?.total_downloads || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">allowed</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm font-medium mb-1">Downloads</div>
                  <div className="text-2xl font-bold">
                    {downloadStats?.is_unlimited ? 
                      '∞' : 
                      downloadStats?.downloads_remaining || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {downloadStats?.is_unlimited ? 'unlimited' : 'remaining'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-6">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">No Active Plan</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose a plan to start using all features
              </p>
              <Button onClick={() => setShowUpgradeModal(true)}>
                View Plans
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <UpgradePlanModal 
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        currentPlan={userPlan}
        onSuccess={() => {
          onRefresh();
          getRemainingDownloads().then(stats => {
            if (stats) setDownloadStats(stats);
          });
        }}
      />
    </div>
  );
}

function BillingSectionLoading() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}