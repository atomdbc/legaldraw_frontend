"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { 
  Check,
  Sparkles,
  Building2,
  Rocket,
  Calculator,
  CreditCard,
  ArrowRight
} from "lucide-react";

// Updated currencies
const currencies = [
  { code: "USD", symbol: "$", rate: 1 },
  { code: "EUR", symbol: "€", rate: 0.92 },
  { code: "GBP", symbol: "£", rate: 0.79 },
  { code: "INR", symbol: "₹", rate: 83 },
];

const features = {
  basic: [
    "5 Documents/month",
    "Essential templates",
    "PDF export",
    "Email support",
    "Basic AI assistance",
    "Document editor",
    "Secure storage",
    "Mobile access"
  ],
  pro: [
    "15 Documents/month",
    "Premium templates",
    "All file formats",
    "Priority support",
    "Advanced AI features",
    "Team collaboration",
    "Custom branding",
    "API access"
  ],
  enterprise: [
    "Unlimited documents",
    "Custom templates",
    "Dedicated support",
    "Enterprise AI",
    "Advanced security",
    "Custom integrations",
    "SLA guarantee",
    "Training & onboarding"
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
    <section id="pricing" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#4361EE]/10 rounded-full text-[#4361EE] text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Flexible Plans for Everyone
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
            <span className="block text-2xl text-gray-500 mt-2">
              Start free, upgrade when you need
            </span>
          </h2>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 my-8">
            <span className={!isAnnual ? "font-semibold" : "text-gray-600"}>
              Monthly
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-[#4361EE]"
            />
            <span className={isAnnual ? "font-semibold" : "text-gray-600"}>
              Annual
              <Badge className="ml-2 bg-[#4361EE]/10 text-[#4361EE] border-0">
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
                className={currency.code === cur.code ? 
                  "bg-[#4361EE] hover:bg-[#3651D4] text-white" : 
                  "border-gray-200 hover:border-[#4361EE] hover:text-[#4361EE]"}
              >
                {cur.code}
              </Button>
            ))}
          </div>
        </div>

        {/* Pay Per Use Card */}
        <Card className="max-w-lg mx-auto mb-16 border border-dashed border-[#4361EE]/30 hover:border-[#4361EE]/50 transition-colors">
          <CardContent className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold">Pay As You Go</h3>
                <p className="text-gray-600">Perfect for occasional use</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#4361EE]/10 flex items-center justify-center">
                <Calculator className="w-6 h-6 text-[#4361EE]" />
              </div>
            </div>
            <div className="mb-6">
              <div className="text-3xl font-bold text-gray-900">
                {currency.symbol}{getPrice(1)}
              </div>
              <div className="text-gray-600">per document</div>
            </div>
            <ul className="space-y-3">
              {[
                "No subscription needed",
                "All essential templates",
                "Basic AI assistance",
                "Pay only when you use"
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#4361EE]/10 flex items-center justify-center">
                    <Check className="w-3 h-3 text-[#4361EE]" />
                  </div>
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="p-8 pt-0">
            <Link href="/register" className="w-full">
              <Button variant="outline" className="w-full border-[#4361EE] text-[#4361EE] hover:bg-[#4361EE]/10">
                Start Creating
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Subscription Plans */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Basic Plan */}
          <Card className="border border-gray-200 hover:border-[#4361EE]/50 transition-all">
            <CardContent className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-semibold">Basic</h3>
                  <p className="text-gray-600">For individuals</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#4361EE]/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[#4361EE]" />
                </div>
              </div>
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900">
                  {currency.symbol}{getPrice(isAnnual ? 15 : 19)}
                </div>
                <div className="text-gray-600">per month</div>
              </div>
              <ul className="space-y-3 mb-8">
                {features.basic.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#4361EE]/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-[#4361EE]" />
                    </div>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register" className="w-full">
                <Button className="w-full bg-[#4361EE] hover:bg-[#3651D4]">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border-2 border-[#4361EE] shadow-lg relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="bg-[#4361EE] text-white border-0 px-4 py-1">
                Most Popular
              </Badge>
            </div>
            <CardContent className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-semibold">Professional</h3>
                  <p className="text-gray-600">For teams</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#4361EE]/10 flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-[#4361EE]" />
                </div>
              </div>
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900">
                  {currency.symbol}{getPrice(isAnnual ? 28 : 35)}
                </div>
                <div className="text-gray-600">per month</div>
              </div>
              <ul className="space-y-3 mb-8">
                {features.pro.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#4361EE]/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-[#4361EE]" />
                    </div>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register" className="w-full">
                <Button className="w-full bg-[#4361EE] hover:bg-[#3651D4]">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="border border-gray-200 hover:border-[#4361EE]/50 transition-all">
            <CardContent className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-semibold">Enterprise</h3>
                  <p className="text-gray-600">For large teams</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#4361EE]/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-[#4361EE]" />
                </div>
              </div>
              <div className="mb-6">
                <div className="text-2xl font-bold text-gray-900">Custom</div>
                <div className="text-gray-600">tailored for you</div>
              </div>
              <ul className="space-y-3 mb-8">
                {features.enterprise.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#4361EE]/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-[#4361EE]" />
                    </div>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-[#4361EE] hover:bg-[#3651D4]">
                Contact Sales
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#4361EE]/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-[#4361EE]" />
            </div>
            <span className="text-gray-600">
              Secure payment powered by Stripe
            </span>
          </div>
          <p className="text-gray-600 mb-4">
            All plans include automatic updates and basic support.
            Need a custom solution?
          </p>
          <Button variant="link" className="text-[#4361EE] hover:text-[#3651D4]">
            Contact our sales team →
          </Button>
        </div>
      </div>
    </section>
  );
};