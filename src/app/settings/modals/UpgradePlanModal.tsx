import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Check,
  Building2,
  FileText,
  CreditCard,
  Loader2,
  Star,
  Zap,
  Shield,
  Mail,
  Sparkles
} from 'lucide-react';
import { usePayment } from '@/hooks/usePayment';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { PaymentCreateRequest } from '@/types/payment';

export enum PlanType {
  PER_DOCUMENT = "per document",
  BASIC = "basic",
  PROFESSIONAL = "professional", 
  ENTERPRISE = "enterprise"
}

export enum Currency {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  INR = "INR"
}

export enum BillingCycle {
  MONTHLY = "monthly",
  ANNUAL = "annual"
}

// Types
interface Plan {
  id: string;
  name: PlanType;
  price: number;
}

interface UserPlan {
  id: string;
  plan: Plan;
}

// Updated currencies to match exact prices
const currencies = [
  { code: Currency.USD, symbol: "$", monthlyPrices: [2, 15, 29] },
  { code: Currency.INR, symbol: "₹", monthlyPrices: [169, 1299, 2399] },
  { code: Currency.EUR, symbol: "€", monthlyPrices: [2, 14, 26] },
  { code: Currency.GBP, symbol: "£", monthlyPrices: [2, 12, 22] }
];

const features = {
  [PlanType.PER_DOCUMENT]: [
    "Single document generation",
    "Basic templates access",
    "48-hour editing window",
    "PDF export",
    "Basic AI assistance"
  ],
  [PlanType.BASIC]: [
    "5 documents per month",
    "All basic templates",
    "7-day editing window",
    "Email support",
    "Document storage (30 days)",
    "Basic AI features"
  ],
  [PlanType.PROFESSIONAL]: [
    "15 documents per month",
    "All premium templates",
    "30-day editing window",
    "Priority support",
    "Document storage (90 days)",
    "Advanced AI features",
    "Team sharing (coming soon)",
    "Custom branding (coming soon)"
  ],
  [PlanType.ENTERPRISE]: [
    "Unlimited documents",
    "Custom templates",
    "Unlimited editing",
    "Dedicated support",
    "Permanent storage",
    "Enterprise AI features",
    "Advanced security",
    "Custom integrations"
  ]
};

interface PriceConfig {
  type: PlanType;
  baseIndex: number;
  description: string;
  icon: React.ComponentType;
  highlight?: boolean;
}

const priceConfig: PriceConfig[] = [
  {
    type: PlanType.PER_DOCUMENT,
    baseIndex: 0,
    description: "Pay as you go",
    icon: FileText
  },
  {
    type: PlanType.BASIC,
    baseIndex: 1,
    description: "For individuals",
    icon: Star
  },
  {
    type: PlanType.PROFESSIONAL,
    baseIndex: 2,
    description: "For growing teams",
    icon: Zap,
    highlight: true
  },
  {
    type: PlanType.ENTERPRISE,
    baseIndex: -1,
    description: "For large organizations",
    icon: Building2
  }
];

interface UpgradePlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: UserPlan | null;
}

export function UpgradePlanModal({
  open,
  onOpenChange,
  currentPlan
}: UpgradePlanModalProps) {
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [billingCycle, setBillingCycle] = useState(BillingCycle.ANNUAL);
  const [loading, setLoading] = useState<PlanType | null>(null);
  const { createPayment } = usePayment();
  const { toast } = useToast();

  useEffect(() => {
    if (!open) {
      setLoading(null);
    }
  }, [open]);

  // Get display price (monthly amount, with annual discount if applicable)
  const getDisplayPrice = (type: PlanType, config: PriceConfig) => {
    if (config.baseIndex === -1) return "Custom";
    
    const basePrice = selectedCurrency.monthlyPrices[config.baseIndex];
    
    // For per-document pricing, just show the base price
    if (type === PlanType.PER_DOCUMENT) {
      return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(basePrice);
    }
    
    // For subscription plans, show monthly price (with annual discount if applicable)
    const displayPrice = billingCycle === BillingCycle.ANNUAL 
      ? basePrice * 0.8  // Show 20% discounted monthly price for annual
      : basePrice;      // Show regular monthly price

    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(displayPrice);
  };

  // Get actual payment amount for backend
  const getActualPaymentAmount = (type: PlanType, config: PriceConfig) => {
    if (config.baseIndex === -1) return 0;
    
    const basePrice = selectedCurrency.monthlyPrices[config.baseIndex];
    
    // For per-document, just charge the base price
    if (type === PlanType.PER_DOCUMENT) {
      return basePrice;
    }
    
    // For subscription plans, calculate actual annual/monthly charge
    return billingCycle === BillingCycle.ANNUAL 
      ? basePrice * 12 * 0.8  // Full annual amount with discount
      : basePrice;            // Monthly amount
  };

  const handleUpgrade = async (type: PlanType, config: PriceConfig) => {
    try {
      setLoading(type);
      
      if (config.baseIndex === -1) {
        window.location.href = "mailto:sales@Docwelo.com";
        return;
      }

      const paymentAmount = getActualPaymentAmount(type, config);
      
      const paymentData: PaymentCreateRequest = {
        amount: paymentAmount,
        currency: selectedCurrency.code,
        plan_id: type,
        payment_type: type === PlanType.PER_DOCUMENT ? 'one_time' : 'subscription',
        payment_metadata: {
          billing_cycle: billingCycle,
          price_index: config.baseIndex,
          is_annual: billingCycle === BillingCycle.ANNUAL
        }
      };
  
      const response = await createPayment(paymentData);
      
      if (response?.payment_metadata?.checkout_url) {
        window.location.href = response.payment_metadata.checkout_url;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: "Failed to initiate payment. Please try again."
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] lg:max-w-6xl max-h-[90vh] p-0 gap-0 overflow-y-auto">
        <DialogHeader className="p-4 md:p-6 space-y-2 text-center sticky top-0 bg-background z-10 border-b">
          <Badge className="inline-flex bg-black/5 text-black hover:bg-black/10 transition-colors text-xs md:text-sm">
            Choose Your Plan
          </Badge>
          <DialogTitle className="text-xl md:text-2xl font-semibold">
            Simple, Transparent Pricing
          </DialogTitle>
          <p className="text-sm md:text-base text-gray-600">
            Start with pay-per-document or save with a subscription
          </p>
        </DialogHeader>

        <div className="p-4 md:p-6 pt-0 space-y-6 md:space-y-8">
          {/* Currency and Billing Selector */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Tabs 
              defaultValue={selectedCurrency.code}
              className="w-full sm:w-[300px]"
              onValueChange={(value) => {
                const currency = currencies.find(c => c.code === value as Currency);
                if (currency) setSelectedCurrency(currency);
              }}
            >
              <TabsList className="grid grid-cols-4 w-full bg-black/5">
                {currencies.map((cur) => (
                  <TabsTrigger
                    key={cur.code}
                    value={cur.code}
                    className="text-xs md:text-sm data-[state=active]:bg-black data-[state=active]:text-white px-2 py-1.5"
                  >
                    {cur.code}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg w-full sm:w-auto">
              <span className={cn(
                "text-xs md:text-sm transition-colors whitespace-nowrap",
                billingCycle === BillingCycle.MONTHLY ? "text-black" : "text-gray-500"
              )}>
                Monthly
              </span>
              <Switch
                checked={billingCycle === BillingCycle.ANNUAL}
                onCheckedChange={(checked) => 
                  setBillingCycle(checked ? BillingCycle.ANNUAL : BillingCycle.MONTHLY)
                }
                className="data-[state=checked]:bg-black"
              />
              <div className={cn(
                "flex items-center text-xs md:text-sm transition-colors whitespace-nowrap",
                billingCycle === BillingCycle.ANNUAL ? "text-black" : "text-gray-500"
              )}>
                Annual
                <Badge variant="outline" className="ml-2 bg-emerald-50 text-emerald-700 border-emerald-200/50 text-xs">
                  Save 20%
                </Badge>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {priceConfig.map((config) => (
              <Card 
                key={config.type}
                className={cn(
                  "relative transition-all hover:shadow-lg",
                  config.highlight 
                    ? 'border-2 border-black shadow-lg' 
                    : 'border border-gray-200'
                )}
              >
                {config.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-black text-white border-0 text-xs whitespace-nowrap">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardContent className="p-4 md:p-6 flex flex-col h-full">
                  <div className="space-y-4 md:space-y-6 flex-grow">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-semibold text-base md:text-lg">
                          {config.type}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600">
                          {config.description}
                        </p>
                      </div>
                      <div className={cn(
                        "p-2 rounded-lg flex-shrink-0",
                        config.highlight ? "bg-black/5" : "bg-gray-50"
                      )}>
                        <config.icon className="w-4 h-4 md:w-5 md:h-5" />
                      </div>
                    </div>

                    <div>
                      {config.baseIndex === -1 ? (
                        <div className="text-xl md:text-2xl font-bold">Custom</div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-baseline gap-1 flex-wrap">
                            <span className="text-2xl md:text-3xl font-bold">
                              {selectedCurrency.symbol}
                              {getDisplayPrice(config.type, config)}
                            </span>
                            <span className="text-xs md:text-sm text-gray-500">
                              {config.type === PlanType.PER_DOCUMENT 
                                ? '/document'
                                : '/month'}
                            </span>
                          </div>
                          {config.type !== PlanType.PER_DOCUMENT && 
                           billingCycle === BillingCycle.ANNUAL && (
                            <div className="text-xs md:text-sm text-emerald-600">
                              Billed annually
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <ul className="space-y-2 md:space-y-3">
                      {features[config.type].map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="text-xs md:text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 md:mt-6">
                    <Button
                      variant={config.highlight ? "default" : "outline"}
                      className={cn(
                        "w-full text-xs md:text-sm h-9 md:h-10",
                        config.highlight && "bg-black hover:bg-black/90 text-white"
                      )}
                      disabled={loading === config.type || currentPlan?.plan.name === config.type}
                      onClick={() => handleUpgrade(config.type, config)}
                    >
                      {loading === config.type ? (
                        <>
                          <Loader2 className="w-3 h-3 md:w-4 md:h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : currentPlan?.plan.name === config.type ? (
                        "Current Plan"
                      ) : config.type === PlanType.ENTERPRISE ? (
                        "Contact Sales"
                      ) : (
                        <>
                          Get Started
                          <Sparkles className="w-3 h-3 md:w-4 md:h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Footer */}
          <div className="flex flex-col items-center gap-3 md:gap-4 pt-4 border-t text-center">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="text-xs md:text-sm text-gray-500">
                Secure payment powered by Stripe
              </span>
            </div>
            
            <Button variant="link" className="h-auto p-0 text-xs md:text-sm" asChild>
              <a 
                href="mailto:sales@Docwelo.com"
                className="inline-flex items-center gap-2 text-black hover:text-gray-600"
              >
                <Mail className="w-3 h-3 md:w-4 md:h-4" />
                Contact our sales team
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}