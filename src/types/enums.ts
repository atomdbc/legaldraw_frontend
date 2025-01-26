// types.ts
export enum PlanType {
  PER_DOCUMENT = "Pay Per Document",
  BASIC = "Basic",  
  PROFESSIONAL = "Professional",
  ENTERPRISE = "Enterprise" 
}
  
  export enum Currency {
    USD = "USD",
    NGN = "NGN",
    EUR = "EUR",
    GBP = "GBP"
  }
  
  export enum BillingCycle {
    MONTHLY = "monthly",
    ANNUAL = "annual"
  }
  
  export interface Plan {
    id: string;
    name: PlanType;
    price: number;
    description: string;
    features: string[];
  }
  
  export interface UserPlan {
    id: string;
    plan: Plan;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
  }
  
  export interface PaymentCreate {
    amount: number;
    currency: Currency;
    plan_id: string;
    payment_type: string;
    payment_metadata?: Record<string, any>;
  }
  