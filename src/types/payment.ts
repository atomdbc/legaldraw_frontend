export type Currency = 'NGN' | 'USD';
export type PaymentStatus = 'pending' | 'successful' | 'failed';
export type PlanType = 'PER_DOCUMENT' | 'BASIC' | 'PROFESSIONAL';

export interface PaymentCreateRequest {
  amount: number;
  currency: Currency;
  user_plan_id: string;
  payment_type?: string;
  payment_metadata?: Record<string, any>;
}


export interface PaymentCreate {
  amount: number;
  currency: Currency;
  plan_id: string;
  payment_type?: string;
  payment_metadata?: {
      upgrade_from?: string;
      plan_name?: string;
      billing_cycle?: string;
      is_annual?: boolean;
      currency_rate?: number;
      original_price?: number;
      currency_code?: string;
  };
}

export interface PaymentResponse {
  id: string;
  tx_ref: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  payment_type?: string;
  flw_transaction_id?: string;
  payment_metadata?: Record<string, any>;
  created_at: string;
  updated_at?: string;
}

export interface PaymentListResponse {
  data: PaymentResponse[];
  total: number;
}

export interface PlanResponse {
  id: string;
  name: PlanType;
  price: number;
  billing_cycle: 'one-time' | 'monthly';
  monthly_generations: number;
  edit_versions_allowed: number;
  draft_storage_hours: number;
  completed_storage_days: number;
  download_limit: number;
  features: {
    expiry_reminders: boolean;
    priority_support: boolean;
    custom_branding: boolean;
    api_access: boolean;
  };
  created_at: string;
  updated_at?: string;
}

export interface UserPlanResponse {
  id: string;
  user_id: string;
  plan_id: string;
  is_active: boolean;
  has_used_trial: boolean;
  current_generation_count: number;
  start_date: string;
  end_date?: string;
  plan_metadata: Record<string, any>;
  plan: PlanResponse;
  created_at: string;
  updated_at?: string;
  last_generated_at?: string;
}

export interface UserPlanHistoryResponse {
  data: UserPlanResponse[];
  total: number;
}

export interface UsageStatsResponse {
  total_documents: number;
  current_period: {
    documents_generated: number;
    remaining_generations: number;
  };
  subscription_status: 'active' | 'inactive';
  plan_details: {
    name: PlanType;
    expires_at?: string;
    auto_renew: boolean;
  };
}