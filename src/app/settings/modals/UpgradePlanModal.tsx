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
  NGN = "NGN"
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

interface PaymentCreate {
  amount: number;
  currency: Currency;
  plan_id: string | PlanType;
  payment_type: "subscription" | "one_time";
  payment_metadata?: Record<string, any>;
}

// Constants
const currencies = [
  { code: Currency.USD, symbol: "$", rate: 1 },
  { code: Currency.EUR, symbol: "€", rate: 0.92 },
  { code: Currency.GBP, symbol: "£", rate: 0.79 },
  { code: Currency.NGN, symbol: "₦", rate: 1500 }
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
  basePrice: number;
  description: string;
  icon: React.ComponentType;
  highlight?: boolean;
}

const priceConfig: PriceConfig[] = [
  {
    type: PlanType.PER_DOCUMENT,
    basePrice: 2,
    description: "Pay as you go",
    icon: FileText
  },
  {
    type: PlanType.BASIC,
    basePrice: 15,
    description: "For individuals",
    icon: Star
  },
  {
    type: PlanType.PROFESSIONAL,
    basePrice: 28,
    description: "For growing teams",
    icon: Zap,
    highlight: true
  },
  {
    type: PlanType.ENTERPRISE,
    basePrice: 0,
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

  const getPrice = (basePrice: number, type: PlanType) => {
    let price = basePrice * selectedCurrency.rate;
    if (type !== PlanType.PER_DOCUMENT && billingCycle === BillingCycle.ANNUAL) {
      price = price * 12 * 0.8; // 20% annual discount
    }
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleUpgrade = async (type: PlanType, basePrice: number) => {
    try {
      setLoading(type);
      
      const finalPrice = basePrice * selectedCurrency.rate;
      const isSubscription = type !== PlanType.PER_DOCUMENT;
      
      const paymentData: PaymentCreate = {
        amount: isSubscription && billingCycle === BillingCycle.ANNUAL 
          ? finalPrice * 12 * 0.8 
          : finalPrice,
        currency: selectedCurrency.code,
        plan_id: type,
        payment_type: isSubscription ? "subscription" : "one_time",
        payment_metadata: {
          billing_cycle: billingCycle,
          currency_rate: selectedCurrency.rate
        }
      };

      const response = await createPayment(paymentData);
      if (response?.payment_metadata?.payment_link) {
        window.location.href = response.payment_metadata.payment_link;
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
      <DialogContent className="max-w-6xl p-0 gap-0">
        <DialogHeader className="p-6 space-y-2 text-center">
          <Badge className="inline-flex bg-black/5 text-black hover:bg-black/10 transition-colors">
            Choose Your Plan
          </Badge>
          <DialogTitle className="text-2xl font-semibold">
            Simple, Transparent Pricing
          </DialogTitle>
          <p className="text-gray-600">
            Start with pay-per-document or save with a subscription
          </p>
        </DialogHeader>

        <div className="p-6 pt-0 space-y-8">
          {/* Currency and Billing Selector */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Tabs 
              defaultValue={selectedCurrency.code}
              className="w-[300px]"
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
                    className="data-[state=active]:bg-black data-[state=active]:text-white"
                  >
                    {cur.code}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
              <span className={cn(
                "text-sm transition-colors",
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
                "flex items-center text-sm transition-colors",
                billingCycle === BillingCycle.ANNUAL ? "text-black" : "text-gray-500"
              )}>
                Annual
                <Badge variant="outline" className="ml-2 bg-emerald-50 text-emerald-700 border-emerald-200/50">
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
        "relative transition-all hover:shadow-lg flex flex-col", // Added flex flex-col
        config.highlight 
          ? 'border-2 border-black shadow-lg' 
          : 'border border-gray-200'
      )}
    >
      {config.highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-black text-white border-0">
            Most Popular
          </Badge>
        </div>
      )}
      
      <CardContent className="p-6 flex flex-col flex-1">
        <div className="space-y-6 flex-1"> {/* Added flex-1 */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">
                {config.type}
              </h3>
              <p className="text-sm text-gray-600">
                {config.description}
              </p>
            </div>
            <div className={cn(
              "p-2 rounded-lg",
              config.highlight ? "bg-black/5" : "bg-gray-50"
            )}>
              <config.icon className="w-5 h-5" />
            </div>
          </div>

          <div>
            {config.type === PlanType.ENTERPRISE ? (
              <div className="text-2xl font-bold">Custom</div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">
                    {selectedCurrency.symbol}
                    {getPrice(config.basePrice, config.type)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {config.type === PlanType.PER_DOCUMENT 
                      ? '/document'
                      : billingCycle === BillingCycle.ANNUAL ? '/year' : '/month'}
                  </span>
                </div>
                {config.type !== PlanType.PER_DOCUMENT && billingCycle === BillingCycle.ANNUAL && (
                  <div className="text-sm text-emerald-600">
                    {selectedCurrency.symbol}{getPrice(config.basePrice * 0.1, config.type)} per month
                  </div>
                )}
              </div>
            )}
          </div>

          <ul className="space-y-3">
            {features[config.type].map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                <span className="text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Button now outside the flex-1 container */}
        <div className="mt-6">
          <Button
            variant={config.highlight ? "default" : "outline"}
            className={cn(
              "w-full",
              config.highlight && "bg-black hover:bg-black/90 text-white"
            )}
            disabled={loading === config.type || currentPlan?.plan.name === config.type}
            onClick={() => config.type === PlanType.ENTERPRISE 
              ? window.location.href = "mailto:sales@legaldraw.com"
              : handleUpgrade(config.type, config.basePrice)
            }
          >
            {loading === config.type ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : currentPlan?.plan.name === config.type ? (
              "Current Plan"
            ) : config.type === PlanType.ENTERPRISE ? (
              "Contact Sales"
            ) : (
              <>
                Get Started
                <Sparkles className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  ))}
</div>

          {/* Footer */}
          <div className="flex flex-col items-center gap-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Secure payment powered by Flutterwave</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Button variant="link" className="h-auto p-0" asChild>
                <a 
                  href="mailto:sales@legaldraw.com"
                  className="inline-flex items-center gap-2 text-black hover:text-gray-600"
                >
                  <Mail className="w-4 h-4" />
                  Contact our sales team
                </a>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}