'use client';

import { createElement, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Check,
  Sparkles,
  Building2,
  Rocket,
  Calculator,
  CreditCard,
  Loader2
} from 'lucide-react';
import { usePayment } from '@/hooks/usePayment';
import { useToast } from '@/hooks/use-toast';
import { PlanType, Currency, BillingCycle } from '@/types/enums';
import type { PlanResponse, UserPlanResponse, PaymentCreate } from '@/types/payment';
import { useRouter } from 'next/navigation';

const currencies = [
  { code: "USD", symbol: "$", rate: 1 },
  { code: "EUR", symbol: "€", rate: 0.92 },
  { code: "GBP", symbol: "£", rate: 0.79 },
  { code: "NGN", symbol: "₦", rate: 1500 },
];

interface PlanPricing {
  type: PlanType;
  basePrice: number;
  features: string[];
  description: string;
  icon: typeof Sparkles;
}

const planConfigs: PlanPricing[] = [
  {
    type: PlanType.PER_DOCUMENT,
    basePrice: 2,
    features: [
      "No subscription required",
      "All basic templates",
      "Basic AI assistance",
      "Cover Page"
    ],
    description: "Perfect for occasional needs",
    icon: Calculator
  },
  {
    type: PlanType.BASIC,
    basePrice: 15,
    features: [
      "5 Documents/month",
      "Basic templates",
      "PDF export",
      "Email support",
      "Basic AI assistance",
      "Cover Page",
      "Basic document analytics",
      "Secure storage"
    ],
    description: "For individuals",
    icon: Sparkles
  },
  {
    type: PlanType.PROFESSIONAL,
    basePrice: 28,
    features: [
      "Everything in Basic plan",
      "15 Documents/month",
      "Advanced templates",
      "All file formats",
      "Priority support",
      "Advanced AI features",
      "Team collaboration",
      "Custom branding"
    ],
    description: "For growing teams",
    icon: Rocket
  },
  {
    type: PlanType.ENTERPRISE,
    basePrice: 0,
    features: [
      "Everything in Professional plan",
      "Unlimited documents",
      "Custom templates",
      "Dedicated support",
      "Enterprise AI",
      "Advanced security",
      "Custom integrations",
      "SLA guarantee"
    ],
    description: "For large organizations",
    icon: Building2
  }
];

interface UpgradePlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: UserPlanResponse | null;
  onSuccess: () => void;
}

export function UpgradePlanModal({
  open,
  onOpenChange,
  currentPlan,
  onSuccess
}: UpgradePlanModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanResponse | null>(null);
  const [processingPlanType, setProcessingPlanType] = useState<PlanType | null>(null);
  const [plans, setPlans] = useState<PlanResponse[]>([]);
  const [isAnnual, setIsAnnual] = useState(true);
  const [currency, setCurrency] = useState(currencies[0]);
  const { getPlans, createPayment, isLoading } = usePayment();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setSelectedPlan(null);
      setProcessingPlanType(null);
      loadPlans();
    }
  }, [open]);

  const loadPlans = async () => {
    try {
      const availablePlans = await getPlans();
      const sortedPlans = availablePlans.sort((a, b) => a.price - b.price);
      setPlans(sortedPlans);
    } catch (error) {
      console.error('Error loading plans:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load available plans"
      });
      onOpenChange(false);
    }
  };

  const getPrice = (basePrice: number, planType?: PlanType) => {
    let price = basePrice * currency.rate;
    
    // Only apply annual discount for subscription plans
    if (planType && planType !== PlanType.PER_DOCUMENT && isAnnual) {
      price = price * 12 * 0.8; // 20% annual discount
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleUpgrade = async (planType: PlanType, basePrice: number) => {
    try {
      setProcessingPlanType(planType);
      
      const plan = plans.find(p => p.name === planType);
      if (!plan) {
        throw new Error('Selected plan not found');
      }

      // Calculate final price based on plan type
      let finalPrice = basePrice * currency.rate;
      if (planType !== PlanType.PER_DOCUMENT && isAnnual) {
        finalPrice = finalPrice * 12 * 0.8;
      }

      const paymentData: PaymentCreate = {
        amount: finalPrice,
        currency: currency.code as Currency,
        plan_id: plan.id,
        payment_type: planType === PlanType.PER_DOCUMENT ? "one_time" : "subscription",
        payment_metadata: {
          upgrade_from: currentPlan?.plan.id,
          plan_name: planType,
          billing_cycle: planType === PlanType.PER_DOCUMENT ? BillingCycle.PER_DOCUMENT : (isAnnual ? BillingCycle.ANNUAL : BillingCycle.MONTHLY),
          is_annual: planType !== PlanType.PER_DOCUMENT && isAnnual,
          currency_rate: currency.rate,
          original_price: basePrice,
          currency_code: currency.code
        }
      };

      const response = await createPayment(paymentData);
      const paymentLink = response?.payment_metadata?.payment_link;
      
      if (paymentLink) {
        toast({
          title: "Payment Initiated",
          description: "Redirecting to payment gateway..."
        });
        window.location.href = paymentLink;
      } else {
        throw new Error('Payment initialization failed - No payment link received');
      }
    } catch (error: any) {
      console.error('Payment error details:', error);
      setSelectedPlan(null);
      setProcessingPlanType(null);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: error.message || "Failed to initiate payment"
      });
    }
  };

  const renderFeatureCheck = (feature: string, index: number) => (
    <li key={`feature-${index}`} className="flex items-center gap-1.5">
      <Check className="w-4 h-4 text-green-500" />
      <span className="text-sm">{feature}</span>
    </li>
  );

  const renderPlanButton = (planType: PlanType, basePrice: number) => {
    const isProcessing = processingPlanType === planType && isLoading;
    const isCurrentPlan = currentPlan?.plan.name === planType;
    const isPro = planType === PlanType.PROFESSIONAL;

    if (planType === PlanType.ENTERPRISE) {
      return (
        <Button className="w-full bg-black text-white hover:bg-black/90">
          Contact Sales
        </Button>
      );
    }

    return (
      <Button
        variant={planType === PlanType.PER_DOCUMENT ? "outline" : "default"}
        size="sm"
        className={`w-full ${isPro ? 'bg-black text-white hover:bg-black/90' : ''}`}
        onClick={() => handleUpgrade(planType, basePrice)}
        disabled={isProcessing || isCurrentPlan}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : isCurrentPlan ? (
          "Current Plan"
        ) : (
          "Get Started"
        )}
      </Button>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <div className="py-8">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center mb-8">
            <Badge variant="outline" className="mb-2">
              Simple, Transparent Pricing
            </Badge>
            <DialogTitle className="text-2xl font-bold mb-2">
              Choose the Perfect Plan
            </DialogTitle>
            <DialogDescription className="text-lg text-gray-600 mb-6">
              Start with pay-per-use or save with a subscription
            </DialogDescription>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={!isAnnual ? "font-semibold" : "text-gray-600"}>
                Monthly
              </span>
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
              />
              <span className={isAnnual ? "font-semibold" : "text-gray-600"}>
                Annual
                <Badge variant="outline" className="ml-2 bg-green-50 text-green-600 border-green-200">
                  Save 20%
                </Badge>
              </span>
            </div>

            {/* Currency Selector */}
            <div className="flex justify-center gap-1.5">
              {currencies.map((cur) => (
                <Button
                  key={cur.code}
                  variant={currency.code === cur.code ? "default" : "outline"}
                  size="xs"
                  onClick={() => setCurrency(cur)}
                  className={currency.code === cur.code ? "bg-black text-white" : ""}
                >
                  {cur.code}
                </Button>
              ))}
            </div>
          </div>

          {isLoading && plans.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Pay Per Use Card */}
              <Card className="max-w-lg mx-auto border-2 border-dashed">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h3 className="text-lg font-semibold">{planConfigs[0].type}</h3>
                      <p className="text-sm text-gray-600">{planConfigs[0].description}</p>
                    </div>
                    <Calculator className="w-6 h-6" />
                  </div>
                  <div className="mb-4">
                    <div className="text-3xl font-bold">
                      {currency.symbol}{getPrice(planConfigs[0].basePrice, PlanType.PER_DOCUMENT)}
                    </div>
                    <div className="text-gray-600">per document</div>
                  </div>
                  <ul className="space-y-1.5 text-sm">
                    {planConfigs[0].features.map((feature, index) => renderFeatureCheck(feature, index))}
                  </ul>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  {renderPlanButton(PlanType.PER_DOCUMENT, planConfigs[0].basePrice)}
                </CardFooter>
              </Card>

              {/* Subscription Plans */}
              <div className="grid md:grid-cols-3 gap-4">
                {planConfigs.slice(1).map((config, idx) => {
                  const isPro = config.type === PlanType.PROFESSIONAL;
                  return (
                    <Card 
                      key={config.type}
                      className={`border-0 ${
                        isPro ? 'border-2 border-black shadow-xl relative' : 'shadow-lg'
                      }`}
                    >
                      {isPro && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                          <Badge className="bg-black text-white">Most Popular</Badge>
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h3 className="text-xl font-semibold">{config.type}</h3>
                            <p className="text-gray-600">{config.description}</p>
                          </div>
                          {createElement(config.icon, { className: "w-8 h-8" })}
                        </div>
                        <div className="mb-6">
                          {config.type === PlanType.ENTERPRISE ? (
                            <>
                              <div className="text-2xl font-bold">Custom Pricing</div>
                              <div className="text-gray-600">tailored to your needs</div>
                            </>
                          ) : (
                            <>
                              <div className="text-3xl font-bold">
                                {currency.symbol}{getPrice(config.basePrice, config.type)}
                              </div>
                              <div className="text-gray-600">
                                {isAnnual ? 'per year' : 'per month'}
                              </div>
                            </>
                          )}
                        </div>
                        <ul className="space-y-2 mb-6">
                          {config.features.map((feature, index) => renderFeatureCheck(feature, index))}
                        </ul>
                        {renderPlanButton(config.type, config.basePrice)}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="mt-8 max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                Secure payment powered by Flutterwaves
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              All plans include automatic updates and basic customer support. Need a custom plan?
            </p>
            <Button variant="link" className="text-black hover:text-gray-600">
              Contact our sales team →
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}