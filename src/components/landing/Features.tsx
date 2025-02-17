"use client";

import { Card, CardContent } from "@/components/ui/card";
import { 
  Clock, 
  Shield, 
  Sparkles, 
  HandHeart,
  Brain,
  Zap
} from "lucide-react";
import { FeatureShowcase } from "./FeatureShowcase";

const features = [
  {
    icon: Brain,
    title: "Your AI Writing Partner",
    description: "Like having a personal assistant who knows exactly what you need. Perfect documents, written in your style, every single time."
  },
  {
    icon: Clock,
    title: "From Hours to Minutes",
    description: "Stop spending late nights on paperwork. What used to take hours now takes minutes, giving you back precious time for what matters."
  },
  {
    icon: HandHeart,
    title: "Peace of Mind",
    description: "No more worrying about missing crucial details. Every document is complete, accurate, and ready for action when you need it."
  },
  {
    icon: Shield,
    title: "Always Up to Date",
    description: "Never stress about outdated templates again. Your documents are always current with the latest requirements and best practices."
  },
  {
    icon: Zap,
    title: "Works Like Magic",
    description: "Just answer a few simple questions and watch as your perfect document appears. No complex forms or confusing legal jargon."
  },
  {
    icon: Sparkles,
    title: "Makes You Look Pro",
    description: "Deliver polished, professional documents that impress clients and partners. Stand out with perfect formatting every time."
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Finally, Document Creation That Just Works
          </h2>
          <p className="text-xl text-gray-600">
            Skip the stress, save time, and create perfect documents without the hassle.
            It's like having a professional document team at your fingertips.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-full bg-[#4361EE]/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-[#4361EE]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Showcase */}
        <div className="mt-24 bg-white rounded-2xl shadow-xl p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#4361EE]/10 rounded-full text-[#4361EE] text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                See it in action
              </div>
              <h3 className="text-2xl font-bold mb-6">
                Create Your Next Document in 3 Minutes
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                No more wrestling with complex templates or spending hours on formatting. 
                Just answer a few questions, and watch as your professional document comes to life.
              </p>
              <ul className="space-y-5">
                {[
                  "Smart questions that understand your needs",
                  "Perfect formatting, every single time",
                  "Professional language that impresses",
                  "Ready to use in minutes, not hours",
                  "100% error-free guaranteed"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <svg 
                        className="w-3 h-3 text-green-600" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M5 13l4 4L19 7" 
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <FeatureShowcase />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};