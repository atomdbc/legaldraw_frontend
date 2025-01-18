// src/app/settings/QuickStats.tsx
'use client';

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, CreditCard, Download, FileDown, AlertCircle, ChevronRight } from 'lucide-react';
import { UpgradePlanModal } from '@/app/settings/modals/UpgradePlanModal';
import { usePayment } from '@/hooks/usePayment';
import { useDownloads } from '@/hooks/useDownloads';
import type { UserPlanResponse, UsageStatsResponse } from '@/types/payment';
import { formatBytes, formatDate } from '@/lib/utils';

interface QuickStatsProps {
  isLoading: boolean;
  userPlan: UserPlanResponse | null;
  usageStats: UsageStatsResponse | null;
}

export function QuickStats({ 
  isLoading, 
  userPlan, 
  usageStats
}: QuickStatsProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { getUsageStats } = usePayment();
  const { getDownloadStats, isLoading: isLoadingDownloads } = useDownloads();
  const [downloadStats, setDownloadStats] = useState<{
    total_downloads: number;
    average_file_size: number;
    total_bytes_downloaded: number;
  } | null>(null);

  // Fetch download statistics
  useEffect(() => {
    const fetchDownloadStats = async () => {
      const stats = await getDownloadStats('all');
      if (stats) {
        setDownloadStats(stats);
      }
    };
    fetchDownloadStats();
  }, [getDownloadStats]);

  if (isLoading) {
    return <QuickStatsLoading />;
  }

  const totalDownloadsRemaining = userPlan?.plan_metadata?.total_downloads_remaining ?? 0;
  const isUnlimitedDownloads = userPlan?.plan.download_limit === -1;
  const downloadLimit = userPlan?.plan.download_limit || 0;
  const downloadPercentage = isUnlimitedDownloads ? 100 : 
    ((downloadLimit - totalDownloadsRemaining) / downloadLimit) * 100;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Storage Card */}
        <Card className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Storage Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">
              {Math.floor(userPlan?.plan.draft_storage_hours / 24) || 1} days
            </div>
            <div className="text-zinc-300 text-sm mb-2">Draft storage period</div>
            <div className="text-zinc-300 text-sm">
              {userPlan?.plan.completed_storage_days} days completed storage
            </div>
          </CardContent>
        </Card>

        {/* Current Plan Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {getPlanDisplayName(userPlan?.plan.name || 'Free')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold">
                {userPlan?.plan.price === 0 ? 'Free' : `$${userPlan?.plan.price}`}
              </span>
              <Badge className="bg-blue-100 text-blue-700">
                {userPlan?.plan.billing_cycle || 'Free'}
              </Badge>
            </div>
            <div className="space-y-2 mb-4 text-sm text-zinc-600">
              <p>• {`${userPlan?.plan.monthly_generations || 1} document generations`}</p>
              <p>• {`${userPlan?.plan.edit_versions_allowed || 0} revisions per document`}</p>
            </div>
            <Button 
              className="w-full"
              onClick={() => setShowUpgradeModal(true)}
            >
              {userPlan?.plan.name === 'FREE' ? 'Upgrade Now' : 'Change Plan'}
            </Button>
          </CardContent>
        </Card>

        {/* Downloads Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Download className="h-5 w-5" />
              Downloads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold">
                {isUnlimitedDownloads ? '∞' : totalDownloadsRemaining}
              </span>
              {downloadStats && (
                <span className="text-sm text-zinc-500">
                  Total: {downloadStats.total_downloads}
                </span>
              )}
            </div>

            {!isUnlimitedDownloads && (
              <Progress
                value={downloadPercentage}
                className="h-2 mb-3"
              />
            )}

            <div className="space-y-1 text-sm text-zinc-600 mb-3">
              {downloadStats && (
                <>
                  <div className="flex items-center justify-between">
                    <span>Average size:</span>
                    <span>{formatBytes(downloadStats.average_file_size)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total downloaded:</span>
                    <span>{formatBytes(downloadStats.total_bytes_downloaded)}</span>
                  </div>
                </>
              )}
            </div>

            {!isUnlimitedDownloads && totalDownloadsRemaining <= 1 && (
              <Alert variant="warning" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {userPlan?.plan.name === 'PER_DOCUMENT'
                    ? 'Running low on downloads. Purchase another document ($2) to get 2 more downloads.'
                    : 'Low on downloads. Consider upgrading your plan for more downloads.'}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => window.location.href = '/settings/downloads'}
            >
              View Download History
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <UpgradePlanModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        currentPlan={userPlan}
        onSuccess={() => {
          getUsageStats();
          window.location.reload();
        }}
      />
    </>
  );
}

function getPlanDisplayName(name: string) {
  switch (name.toLowerCase()) {
    case 'per_document':
      return 'Pay Per Document';
    case 'professional':
      return 'Professional Plan';
    case 'basic':
      return 'Basic Plan';
    default:
      return 'Free Plan';
  }
}

function QuickStatsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-8 w-full mt-4" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}