import { authApi } from './auth';
import type {
  PaymentResponse,
  PaymentListResponse,
  PaymentCreateRequest,
  PlanResponse,
  UserPlanResponse,
  UserPlanHistoryResponse,
  UsageStatsResponse
} from '@/types/payment';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class PaymentApiError extends Error {
  constructor(public error: { status: number; message: string; code?: string; detail?: any }) {
    super(error.message);
    this.name = 'PaymentApiError';
    console.log('PaymentApiError Details:', {
      status: error.status,
      message: error.message,
      code: error.code
    });
  }

  toJSON() {
    return {
      name: this.name,
      error: this.error
    };
  }
}



export const paymentApi = {
  // Payment Management
  async createPayment(data: PaymentCreateRequest): Promise<PaymentResponse> {
    try {
      console.log('Sending payment data:', data);
      const response = await authApi.authenticatedRequest<PaymentResponse>(
        `${API_BASE_URL}/api/payments/create`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }
      );
      console.log('Payment response:', response);
      return response;
    } catch (error: any) {
      throw new PaymentApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to create payment',
        code: 'CREATE_PAYMENT_ERROR'
      });
    }
  },

  async verifyPayment(sessionId: string): Promise<PaymentResponse> {
    try {
      const response = await authApi.authenticatedRequest<PaymentResponse>(
        `${API_BASE_URL}/api/payments/verify/${sessionId}`
      );
      console.log('Verification response:', response);
      return response;
    } catch (error: any) {
      throw new PaymentApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to verify payment',
        code: 'VERIFY_PAYMENT_ERROR'
      });
    }
  },

  async cancelSubscription(): Promise<{ message: string }> {
    try {
      const response = await authApi.authenticatedRequest<{ message: string }>(
        `${API_BASE_URL}/api/payments/subscription/cancel`,
        {
          method: 'POST'
        }
      );
      return response;
    } catch (error: any) {
      throw new PaymentApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to cancel subscription',
        code: 'CANCEL_SUBSCRIPTION_ERROR'
      });
    }
  },

  async cancelSubscriptionImmediately(): Promise<{ message: string }> {
    try {
      const response = await authApi.authenticatedRequest<{ message: string }>(
        `${API_BASE_URL}/api/payments/subscription/cancel-immediately`,
        {
          method: 'POST'
        }
      );
      return response;
    } catch (error: any) {
      throw new PaymentApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to cancel subscription immediately',
        code: 'CANCEL_SUBSCRIPTION_IMMEDIATE_ERROR'
      });
    }
  },

  async toggleAutoRenewal(): Promise<{ 
    message: string; 
    auto_renew: boolean;
    subscription_status: {
      id: string;
      status: string;
      current_period_end: string;
      cancel_at_period_end: boolean;
      auto_renew: boolean;
    }
  }> {
    try {
      const response = await authApi.authenticatedRequest<{
        message: string;
        auto_renew: boolean;
        subscription_status: {
          id: string;
          status: string;
          current_period_end: string;
          cancel_at_period_end: boolean;
          auto_renew: boolean;
        }
      }>(
        `${API_BASE_URL}/api/payments/subscription/toggle-auto-renew`,
        { method: 'POST' }
      );
      
      console.log('Toggle auto-renewal response:', response);
      return response;
    } catch (error: any) {
      console.error('Toggle auto-renewal error:', error);
      throw new PaymentApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to toggle auto-renewal',
        code: 'TOGGLE_AUTO_RENEWAL_ERROR'
      });
    }
  },

  async updatePaymentMethod(): Promise<{ client_secret: string; setup_intent_id: string }> {
    try {
      const response = await authApi.authenticatedRequest<{ client_secret: string; setup_intent_id: string }>(
        `${API_BASE_URL}/api/payments/subscription/update-payment-method`,
        {
          method: 'POST'
        }
      );
      return response;
    } catch (error: any) {
      throw new PaymentApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to update payment method',
        code: 'UPDATE_PAYMENT_METHOD_ERROR'
      });
    }
  },



  async getPaymentHistory(
    skip: number = 0, 
    limit: number = 10,
    status?: string
  ): Promise<PaymentListResponse> {
    try {
      let url = `${API_BASE_URL}/api/payments/history?limit=${limit}&offset=${skip}`;
      if (status) {
        url += `&status=${status}`;
      }
      const response = await authApi.authenticatedRequest<PaymentListResponse>(url);
      return response;
    } catch (error: any) {
      throw new PaymentApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to fetch payment history',
        code: 'GET_PAYMENT_HISTORY_ERROR'
      });
    }
  },

  async retryPayment(paymentId: string): Promise<PaymentResponse> {
    try {
      const response = await authApi.authenticatedRequest<PaymentResponse>(
        `${API_BASE_URL}/api/payments/retry/${paymentId}`,
        {
          method: 'POST'
        }
      );
      return response;
    } catch (error: any) {
      throw new PaymentApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to retry payment',
        code: 'RETRY_PAYMENT_ERROR'
      });
    }
  },

  // Plan Management
  async getPlans(): Promise<PlanResponse[]> {
    try {
      const response = await authApi.authenticatedRequest<PlanResponse[]>(
        `${API_BASE_URL}/api/payments/plans`
      );
      return response;
    } catch (error: any) {
      throw new PaymentApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to fetch plans',
        code: 'GET_PLANS_ERROR'
      });
    }
  },

  async getPlan(planId: string): Promise<PlanResponse> {
    try {
      const response = await authApi.authenticatedRequest<PlanResponse>(
        `${API_BASE_URL}/api/payments/plans/${planId}`
      );
      return response;
    } catch (error: any) {
      throw new PaymentApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to fetch plan',
        code: 'GET_PLAN_ERROR'
      });
    }
  },

  // User Plan Management
  async getUserPlan(): Promise<UserPlanResponse> {
    try {
      const response = await authApi.authenticatedRequest<UserPlanResponse>(
        `${API_BASE_URL}/api/payments/user-plan`
      );
      return response;
    } catch (error: any) {
      throw new PaymentApiError({
        status: error?.error?.status === 404 ? 404 : 500,
        message: error?.error?.status === 404 ? 'No active plan found' : 'Failed to fetch user plan',
        code: error?.error?.status === 404 ? 'NO_ACTIVE_PLAN' : 'GET_USER_PLAN_ERROR'
      });
    }
  },

  async getPaymentDetails(txRef: string): Promise<PaymentResponse> {
    try {
      const response = await authApi.authenticatedRequest<PaymentResponse>(
        `${API_BASE_URL}/api/payments/details/${txRef}`
      );
      return response;
    } catch (error: any) {
      throw new PaymentApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to fetch payment details',
        code: 'GET_PAYMENT_DETAILS_ERROR'
      });
    }
  },

  async getUserPlanHistory(
    skip: number = 0,
    limit: number = 10
  ): Promise<UserPlanHistoryResponse> {
    try {
      const response = await authApi.authenticatedRequest<UserPlanHistoryResponse>(
        `${API_BASE_URL}/api/payments/user-plan/history?limit=${limit}&offset=${skip}`
      );
      return response;
    } catch (error: any) {
      throw new PaymentApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to fetch plan history',
        code: 'GET_PLAN_HISTORY_ERROR'
      });
    }
  },

  async cancelPlan(): Promise<{ message: string }> {
    try {
      const response = await authApi.authenticatedRequest<{ message: string }>(
        `${API_BASE_URL}/api/payments/user-plan/cancel`,
        {
          method: 'POST'
        }
      );
      return response;
    } catch (error: any) {
      throw new PaymentApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to cancel plan',
        code: 'CANCEL_PLAN_ERROR'
      });
    }
  },

  async getUsageStats(): Promise<UsageStatsResponse> {
    try {
      const response = await authApi.authenticatedRequest<UsageStatsResponse>(
        `${API_BASE_URL}/api/payments/usage-stats`
      );
      return response;
    } catch (error: any) {
      throw new PaymentApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to fetch usage statistics',
        code: 'GET_USAGE_STATS_ERROR'
      });
    }
  }
};