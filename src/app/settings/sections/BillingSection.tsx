import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Loader2 } from 'lucide-react';
import { format, isValid } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { UpgradePlanModal } from '../modals/UpgradePlanModal';
import { useDownloads } from '@/hooks/useDownloads';
import { usePayment } from "@/hooks/usePayment";
import { useToast } from '@/hooks/use-toast';
import type { 
  UserPlanResponse, 
  UsageStatsResponse,
  PlanType
} from '@/types/payment';
import type { RemainingDownloadsResponse } from '@/types/download';
import { cn } from '@/lib/utils';

interface BillingSectionProps {
  isLoading: boolean;
  userPlan: UserPlanResponse | null;
  usageStats: UsageStatsResponse | null;
  onRefresh: () => Promise<void>;
}

const formatDate = (dateString: string | null | undefined, formatStr: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return isValid(date) ? format(date, formatStr) : 'N/A';
};

export function BillingSection({ 
  isLoading: parentLoading, 
  userPlan: initialUserPlan, 
  usageStats,
  onRefresh 
}: BillingSectionProps) {
  const [userPlan, setUserPlan] = useState(initialUserPlan);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [downloadStats, setDownloadStats] = useState<RemainingDownloadsResponse | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const { toast } = useToast();
  const { getRemainingDownloads } = useDownloads();
  const { 
    cancelSubscription, 
    cancelSubscriptionImmediately,
    toggleAutoRenewal,
    updatePaymentMethod,
    isLoading: isActionLoading 
  } = usePayment();

  useEffect(() => {
    setUserPlan(initialUserPlan);
  }, [initialUserPlan]);

  useEffect(() => {
    const fetchDownloadStats = async () => {
      try {
        const stats = await getRemainingDownloads();
        if (stats) {
          setDownloadStats(stats);
        }
      } catch (error) {
        console.error('Error fetching download stats:', error);
      }
    };

    fetchDownloadStats();
  }, [getRemainingDownloads]);

  
  const handleToggleAutoRenewal = async () => {
    setIsUpdating(true);
    try {
      await toggleAutoRenewal();
      await onRefresh();
    } catch (error) {
      console.error('Error toggling auto-renewal:', error);
    } finally {
      setIsUpdating(false);
    }
  };


  const handleCancelSubscription = async (immediately: boolean) => {
    setIsUpdating(true);
    try {
      if (immediately) {
        await cancelSubscriptionImmediately();
      } else {
        await cancelSubscription();
      }
      await onRefresh();
      setShowCancelDialog(false);
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel subscription. Please try again."
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePaymentMethod = async () => {
    setIsUpdating(true);
    try {
      const { client_secret } = await updatePaymentMethod();
      // Here you would integrate with Stripe Elements
      toast({
        title: "Success",
        description: "Payment method update initiated."
      });
    } catch (error) {
      console.error('Error updating payment method:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update payment method. Please try again."
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (parentLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const getPlanName = (planType: PlanType) => {
    const names = {
      'PER_DOCUMENT': 'Pay Per Document',
      'BASIC': 'Basic',
      'PROFESSIONAL': 'Professional',
      'ENTERPRISE': 'Enterprise'
    };
    return names[planType] || planType;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Plan Details</CardTitle>
            <Button 
              onClick={() => setShowUpgradeModal(true)}
              disabled={isUpdating}
            >
              {userPlan ? 'Upgrade' : 'Get Started'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {userPlan ? (
            <div className="space-y-6">
              <div className="flex justify-between items-start p-4 bg-muted rounded-lg">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{getPlanName(userPlan.plan.name)}</h3>
                    <Badge variant="secondary">
                      {userPlan.plan_metadata?.subscription_status || usageStats?.subscription_status}
                    </Badge>
                    {userPlan.plan_metadata?.auto_renew && (
                      <Badge variant="outline">Auto-renewal on</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ${userPlan.plan.price}{' '}
                    {userPlan.plan.billing_cycle === 'monthly' ? '/month' : '/year'}
                  </div>
                </div>
                {userPlan.plan_metadata?.current_period_end && (
                  <div className="text-sm text-muted-foreground">
                    {userPlan.plan_metadata?.auto_renew ? 'Renews' : 'Expires'}: {
                      formatDate(userPlan.plan_metadata.current_period_end, 'MMM dd, yyyy')
                    }
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm font-medium mb-1">Downloads Limit</div>
                  <div className="text-2xl font-bold">
                    {userPlan.plan.download_limit}
                  </div>
                  <div className="text-sm text-muted-foreground">per period</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm font-medium mb-1">Remaining</div>
                  <div className="text-2xl font-bold">
                    {usageStats?.current_period.remaining_generations || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">downloads</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm font-medium mb-1">Used This Period</div>
                  <div className="text-2xl font-bold">
                    {usageStats?.current_period.documents_generated || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">downloads</div>
                </div>
              </div>

              {userPlan.plan.billing_cycle === 'monthly' && (
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-semibold">Subscription Management</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
  <CardHeader className="pb-2">
    <CardTitle className="text-base">Auto-Renewal</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="flex items-center justify-between">
      <div>
        <span className="text-sm text-muted-foreground">
          {userPlan.plan_metadata?.auto_renew === true ? 'Enabled' : 'Disabled'}
        </span>
        {userPlan.plan_metadata?.current_period_end && (
          <div className="text-xs text-muted-foreground mt-1">
            Next billing: {
              formatDate(userPlan.plan_metadata.current_period_end, 'MMM dd, yyyy')
            }
          </div>
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleToggleAutoRenewal}
        disabled={isUpdating}
        className={cn(
          "min-w-[80px]",
          isUpdating && "opacity-50 cursor-not-allowed"
        )}
      >
        {isUpdating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : userPlan.plan_metadata?.auto_renew === true ? 'Disable' : 'Enable'}
      </Button>
    </div>
  </CardContent>
</Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Payment Method</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Update card information
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleUpdatePaymentMethod}
                            disabled={isUpdating}
                            className={cn(
                              "min-w-[80px]",
                              isUpdating && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            {isUpdating ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : 'Update'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="pt-4">
                    <Button 
                      variant="destructive"
                      onClick={() => setShowCancelDialog(true)}
                      disabled={isUpdating}
                      className={cn(isUpdating && "opacity-50 cursor-not-allowed")}
                    >
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Cancel Subscription
                    </Button>
                  </div>
                </div>
              )}
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

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              How would you like to cancel your subscription?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => handleCancelSubscription(false)}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Cancel at end of billing period
            </Button>
            <Button
              className="w-full"
              variant="destructive"
              onClick={() => handleCancelSubscription(true)}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Cancel immediately
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <UpgradePlanModal 
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        currentPlan={userPlan}
        onSuccess={async () => {
          await onRefresh();
          const stats = await getRemainingDownloads();
          if (stats) setDownloadStats(stats);
        }}
      />
    </div>
  );
}