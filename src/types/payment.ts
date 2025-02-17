export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR';

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESSFUL = 'successful',
  FAILED = 'failed'
}

export type PlanType = 'PER_DOCUMENT' | 'BASIC' | 'PROFESSIONAL' | 'ENTERPRISE';

export interface PaymentCreateRequest {
  amount: number;
  currency: string;
  plan_id: string;
  payment_type: 'subscription' | 'one_time';
  payment_metadata?: {
    billing_cycle?: 'monthly' | 'annual';
    currency_rate?: number;
    is_annual?: boolean;
  };
}



export interface SubscriptionDetails {
  id: string;
  status: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  auto_renew: boolean;
}

export interface PaymentMetadata {
  checkout_url?: string;
  stripe_session?: {
    id: string;
    url: string;
  };
  subscription?: SubscriptionDetails;
  billing_cycle?: string;
  is_annual?: boolean;
  product_description?: string;
  verification_data?: {
    status?: string;
    payment_status?: string;
  };
}

export interface PaymentResponse {
  id: string;
  user_id: string;
  user_plan_id: string;
  amount: number;
  currency: string;
  status: string;
  payment_type: string;
  stripe_session_id: string;
  payment_metadata?: PaymentMetadata;
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