"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sparkles,
  Wand2,
  Rocket,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { PreviewContent } from "./PreviewContent";

const steps = [
  {
    icon: Sparkles,
    title: "Tell Us What You Need",
    description: "No templates to search through. Just tell us what you're trying to accomplish, and we'll handle the rest.",
    preview: "selection",
    accent: "from-[#4361EE] to-blue-400"
  },
  {
    icon: Wand2,
    title: "Watch the Magic Happen",
    description: "Answer a few simple questions while our AI crafts your perfect document in real-time.",
    preview: "customization",
    accent: "from-purple-500 to-pink-500"
  },
  {
    icon: Rocket,
    title: "Perfect in Minutes",
    description: "Your professional document is ready to go - perfectly formatted, error-free, and exactly what you need.",
    preview: "review",
    accent: "from-green-500 to-emerald-400"
  },
  {
    icon: CheckCircle2,
    title: "Share & Succeed",
    description: "Download instantly or share directly with your team. Look professional without the effort.",
    preview: "export",
    accent: "from-orange-500 to-yellow-400"
  }
];

export const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#4361EE]/10 rounded-full text-[#4361EE] text-sm font-medium mb-6">
            <Rocket className="w-4 h-4" />
            Simple as it should be
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            From Idea to Perfect Document
            <span className="block text-2xl md:text-3xl text-gray-500 mt-2">
              In Just a Few Minutes
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            No more complex templates or confusing legal jargon.
            Just tell us what you need, and watch it come to life.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`rounded-xl cursor-pointer transition-all duration-300 ${
                  activeStep === index
                    ? "bg-white shadow-2xl scale-105"
                    : "hover:bg-white hover:shadow-xl"
                }`}
                onClick={() => setActiveStep(index)}
              >
                <div className="p-8">
                  <div className="flex items-start gap-6">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${step.accent} flex items-center justify-center shadow-lg`}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 rounded-full bg-[#4361EE]/10 text-[#4361EE] text-sm flex items-center justify-center font-medium">
                          {index + 1}
                        </span>
                        <h3 className="text-xl font-semibold">{step.title}</h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-8">
              <Button
                size="lg"
                className="w-full bg-[#4361EE] hover:bg-[#3651D4] text-white h-14 rounded-full shadow-lg shadow-blue-500/20"
              >
                <a href="/register">Create Your First Document Free</a>
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <p className="text-center text-gray-500 mt-4 text-sm">
                No credit card required • Free forever plan available
              </p>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-24">
            <Card className="border border-gray-100 shadow-2xl rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="h-12 bg-gray-50 border-b border-gray-100 flex items-center px-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                </div>
                <div className="p-8">
                  <PreviewContent step={steps[activeStep].preview} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};