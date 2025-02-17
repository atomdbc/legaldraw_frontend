// src/hooks/usePayment.ts
import { useState, useCallback } from 'react';
import { paymentApi } from '@/lib/api/payment';
import { useToast } from '@/hooks/use-toast';
import type {
  PaymentCreateRequest,
  PaymentResponse,
  PlanResponse,
  UserPlanResponse,
  UsageStatsResponse,
  PaymentStatus
} from '@/types/payment';

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const createPayment = useCallback(async (data: PaymentCreateRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await paymentApi.createPayment(data);
      toast({
        title: "Payment Initiated",
        description: "You will be redirected to complete your payment"
      });
      return response;
    } catch (err: any) {
      const errorMessage = err.error?.message || 'Failed to create payment';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: errorMessage
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const verifyPayment = useCallback(async (sessionId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await paymentApi.verifyPayment(sessionId);
      return response;
    } catch (err: any) {
      const errorMessage = err.error?.message || 'Failed to verify payment';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelSubscription = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await paymentApi.cancelSubscription();
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription will be cancelled at the end of the billing period."
      });
      return response;
    } catch (err: any) {
      const errorMessage = err.error?.message || 'Failed to cancel subscription';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const cancelSubscriptionImmediately = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await paymentApi.cancelSubscriptionImmediately();
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled immediately."
      });
      return response;
    } catch (err: any) {
      const errorMessage = err.error?.message || 'Failed to cancel subscription';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const toggleAutoRenewal = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Starting toggle auto-renewal');
      const response = await paymentApi.toggleAutoRenewal();
      console.log('Got response:', response);
      
      // Add explicit console.log for toast
      console.log('Showing toast...');
      toast({
        variant: "default",  // Make sure toast is visible
        title: response.message || "Auto-Renewal Updated",
        description: `Auto-renewal has been ${response.auto_renew ? 'enabled' : 'disabled'}.`,
        duration: 5000  // Show longer for testing
      });
      console.log('Toast shown');
      
      return response;
    } catch (err: any) {
      console.error('Toggle error:', err);
      const errorMessage = err.error?.message || 'Failed to toggle auto-renewal';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
        duration: 5000
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const updatePaymentMethod = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await paymentApi.updatePaymentMethod();
      toast({
        title: "Payment Method",
        description: "Please complete the payment method update."
      });
      return response;
    } catch (err: any) {
      const errorMessage = err.error?.message || 'Failed to update payment method';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);



  const retryPayment = useCallback(async (paymentId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await paymentApi.retryPayment(paymentId);
      toast({
        title: "Payment Retry Initiated",
        description: "You will be redirected to complete your payment"
      });
      return response;
    } catch (err: any) {
      const errorMessage = err.error?.message || 'Failed to retry payment';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Retry Error",
        description: errorMessage
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getPaymentHistory = useCallback(async (
    skip: number = 0,
    limit: number = 10,
    status?: PaymentStatus
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      return await paymentApi.getPaymentHistory(skip, limit, status);
    } catch (err: any) {
      const errorMessage = err.error?.message || 'Failed to fetch payment history';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Plan Management
  const getPlans = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      return await paymentApi.getPlans();
    } catch (err: any) {
      const errorMessage = err.error?.message || 'Failed to fetch plans';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPlan = useCallback(async (planId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      return await paymentApi.getPlan(planId);
    } catch (err: any) {
      const errorMessage = err.error?.message || 'Failed to fetch plan details';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // User Plan Management
  const getUserPlan = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      return await paymentApi.getUserPlan();
    } catch (err: any) {
      const errorMessage = err.error?.message || 'Failed to fetch user plan';
      setError(errorMessage);
      if (err.error?.status !== 404) { // Don't show toast for "no plan" case
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage
        });
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getUserPlanHistory = useCallback(async (
    skip: number = 0,
    limit: number = 10
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      return await paymentApi.getUserPlanHistory(skip, limit);
    } catch (err: any) {
      const errorMessage = err.error?.message || 'Failed to fetch plan history';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelPlan = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await paymentApi.cancelPlan();
      toast({
        title: "Plan Cancelled",
        description: "Your plan has been cancelled successfully"
      });
      return response;
    } catch (err: any) {
      const errorMessage = err.error?.message || 'Failed to cancel plan';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getPaymentDetails = useCallback(async (txRef: string) => {
    setIsLoading(true);
    setError(null);
    try {
      return await paymentApi.getPaymentDetails(txRef);
    } catch (err: any) {
      const errorMessage = err.error?.message || 'Failed to fetch payment details';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getUsageStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      return await paymentApi.getUsageStats();
    } catch (err: any) {
      const errorMessage = err.error?.message || 'Failed to fetch usage statistics';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    createPayment,
    verifyPayment,
    cancelSubscription,
    cancelSubscriptionImmediately,
    toggleAutoRenewal,
    updatePaymentMethod,
    retryPayment,
    getPaymentHistory,
    getPlans,
    getPlan,
    getUserPlan,
    getUserPlanHistory,
    cancelPlan,
    getUsageStats,
    getPaymentDetails  // Add this
  };
};