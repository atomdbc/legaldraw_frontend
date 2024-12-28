// src/components/landing/Pricing.tsx
"use client";

import { useState } from "react";
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
  CreditCard
} from "lucide-react";

// We'll integrate with a currency API in production
const currencies = [
  { code: "USD", symbol: "$", rate: 1 },
  { code: "EUR", symbol: "€", rate: 0.92 },
  { code: "GBP", symbol: "£", rate: 0.79 },
  { code: "NGN", symbol: "₦", rate: 1500 },
];

const features = {
  basic: [
    "5 Documents/month",
    "Basic templates",
    "PDF export",
    "Email support",
    "Basic AI assistance",
    "Cover Page",
  "Basic document analytics",
  "Secure storage",
  ],
  pro: [
    "Everything in Basic plan",
    "15 Documents/month",
    "Advanced templates",
    "All file formats",
    "Priority support",
    "Advanced AI features",
    "Team collaboration",
    "Custom branding",
  ],
  enterprise: [
    "Everything in Pro plan",
    "Unlimited documents",
    "Custom templates",
    "Dedicated support",
    "Enterprise AI",
    "Advanced security",
    "Custom integrations",
    "SLA guarantee",
  ]
};

export const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [currency, setCurrency] = useState(currencies[0]);
  
  const getPrice = (basePrice: number) => {
    const price = basePrice * currency.rate;
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <Badge variant="outline" className="mb-4">
            Simple, Transparent Pricing
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose the Perfect Plan for Your Needs
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start with pay-per-use or save with a subscription
          </p>

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
          <div className="flex justify-center gap-2">
            {currencies.map((cur) => (
              <Button
                key={cur.code}
                variant={currency.code === cur.code ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrency(cur)}
                className={currency.code === cur.code ? "bg-black text-white" : ""}
              >
                {cur.code}
              </Button>
            ))}
          </div>
        </div>

        {/* Pay Per Use Card */}
        <Card className="max-w-lg mx-auto mb-12 border-2 border-dashed">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-semibold">Pay Per Use</h3>
                <p className="text-gray-600">Perfect for occasional needs</p>
              </div>
              <Calculator className="w-8 h-8" />
            </div>
            <div className="mb-4">
              <div className="text-3xl font-bold">
                {currency.symbol}{getPrice(2)}
              </div>
              <div className="text-gray-600">per document</div>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                No subscription required
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                All basic templates
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                Basic AI assistance
              </li>
            </ul>
          </CardContent>
          <CardFooter className="p-6 pt-0">
            <Button variant="outline" className="w-full">
              <a href="/login"> Start Creating </a>
            </Button>
          </CardFooter>
        </Card>

        {/* Subscription Plans */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Basic Plan */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-semibold">Basic</h3>
                  <p className="text-gray-600">For individuals</p>
                </div>
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="mb-6">
                <div className="text-3xl font-bold">
                  {currency.symbol}{getPrice(isAnnual ? 15 : 23)}
                </div>
                <div className="text-gray-600">per month</div>
              </div>
              <ul className="space-y-2 mb-6">
                {features.basic.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-black text-white hover:bg-black/90">
                
                <a href="/login"> Get Started </a>
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border-2 border-black shadow-xl relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="bg-black text-white">Most Popular</Badge>
            </div>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-semibold">Professional</h3>
                  <p className="text-gray-600">For growing teams</p>
                </div>
                <Rocket className="w-8 h-8" />
              </div>
              <div className="mb-6">
                <div className="text-3xl font-bold">
                  {currency.symbol}{getPrice(isAnnual ? 28 : 36)}
                </div>
                <div className="text-gray-600">per month</div>
              </div>
              <ul className="space-y-2 mb-6">
                {features.pro.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-black text-white hover:bg-black/90">
              <a href="/login"> Get Started </a>
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-semibold">Enterprise</h3>
                  <p className="text-gray-600">For large organizations</p>
                </div>
                <Building2 className="w-8 h-8" />
              </div>
              <div className="mb-6">
                <div className="text-2xl font-bold">Custom Pricing</div>
                <div className="text-gray-600">tailored to your needs</div>
              </div>
              <ul className="space-y-2 mb-6">
                {features.enterprise.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-black text-white hover:bg-black/90">
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <CreditCard className="w-6 h-6 text-gray-400" />
            <span className="text-gray-600">
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
    </section>
  );
};