"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, CreditCard, Download, ChevronRight } from 'lucide-react';
import { useDownloads } from '@/hooks/useDownloads';
import { usePayment } from '@/hooks/usePayment';
import type { UserPlanResponse, UsageStatsResponse } from '@/types/payment';
import { formatBytes } from '@/lib/utils';
import { UpgradePlanModal } from '@/app/settings/modals/UpgradePlanModal';

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
 const { getDownloadStats } = useDownloads();
 const [downloadStats, setDownloadStats] = useState<{
   total_downloads: number;
   average_file_size: number;
   total_bytes_downloaded: number;
 } | null>(null);

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

 return (
   <>
     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
       {/* Storage Card */}
       <Card className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
         <CardHeader>
           <CardTitle className="text-lg flex items-center gap-2">
             <Clock className="h-5 w-5" />
             Storage Period
           </CardTitle>
         </CardHeader>
         <CardContent>
           <div className="text-3xl font-bold mb-3">
             {Math.floor(userPlan?.plan.draft_storage_hours / 24) || 1} Days
           </div>
           <div className="text-zinc-300 text-sm">
             Draft storage period: {Math.floor(userPlan?.plan.draft_storage_hours / 24) || 1} days
             <br />
             Completed storage: {userPlan?.plan.completed_storage_days} days
           </div>
         </CardContent>
       </Card>

       {/* Current Plan Card */}
       <Card className="border-2 border-zinc-200">
         <CardHeader>
           <CardTitle className="text-lg flex items-center gap-2">
             <CreditCard className="h-5 w-5" />
             {getPlanDisplayName(userPlan?.plan.name || 'Free')}
           </CardTitle>
         </CardHeader>
         <CardContent>
           <div className="flex items-center gap-2 mb-4">
             <span className="text-3xl font-bold">
               {userPlan?.plan.price === 0 ? 'Free' : `$${userPlan?.plan.price}`}
             </span>
             <Badge className="bg-blue-100 text-blue-700">
               {userPlan?.plan.billing_cycle || 'Free'}
             </Badge>
           </div>
           <div className="space-y-2 text-sm text-zinc-600 mb-4">
             <p>• {`${userPlan?.plan.monthly_generations ?? 0} document generations`}</p>
             <p>• {`${userPlan?.plan.edit_versions_allowed || 0} revisions per document`}</p>
             <p>• {userPlan?.plan.download_limit === -1 ? 'Unlimited downloads' : `${userPlan?.plan.download_limit} downloads`}</p>
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
             Download Statistics
           </CardTitle>
         </CardHeader>
         <CardContent>
           <div className="space-y-3 text-sm">
             {downloadStats && (
               <>
                 <div className="flex items-center justify-between">
                   <span className="text-zinc-600">Average Size</span>
                   <span className="font-medium">{formatBytes(downloadStats.average_file_size)}</span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-zinc-600">Total Downloaded</span>
                   <span className="font-medium">{formatBytes(downloadStats.total_bytes_downloaded)}</span>
                 </div>
               </>
             )}
           </div>
           
           <Button 
             variant="outline" 
             className="w-full mt-6"
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
    case 'per document':
    case 'pay per document': 
      return 'Pay Per Document';
    case 'professional':
      return 'Professional';
    case 'basic':
      return 'Basic';
    case 'enterprise':
      return 'Enterprise';
    default:
      return 'Free';
  }
 }

function QuickStatsLoading() {
 return (
   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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