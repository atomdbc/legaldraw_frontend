// src/components/landing/HowItWorks.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  Sparkles, 
  CheckCircle, 
  Download,
  ArrowRight
} from "lucide-react";
import { PreviewContent } from "./PreviewContent";

const steps = [
  {
    icon: FileText,
    title: "Select Your Document",
    description: "Choose from our extensive library of legal templates or start from scratch with AI assistance.",
    preview: "selection"
  },
  {
    icon: Sparkles,
    title: "AI-Powered Customization",
    description: "Our AI helps you customize the document by asking relevant questions and suggesting appropriate clauses.",
    preview: "customization"
  },
  {
    icon: CheckCircle,
    title: "Review & Collaborate",
    description: "Review the generated document, collaborate with team members, and make any necessary adjustments.",
    preview: "review"
  },
  {
    icon: Download,
    title: "Export & Sign",
    description: "Export your document in multiple formats or send it directly for electronic signatures.",
    preview: "export"
  }
];

export const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Creating Legal Documents Has Never Been Easier
          </h2>
          <p className="text-xl text-gray-600">
            Experience a streamlined document creation process powered by AI
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg cursor-pointer transition-all ${
                  activeStep === index
                    ? "bg-black text-white"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setActiveStep(index)}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white/10 rounded">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className={activeStep === index ? "text-gray-200" : "text-gray-600"}>
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <Button 
              size="lg" 
              className="w-full bg-black text-white hover:bg-black/90 mt-8"
            >
             
              <a href="/login"> Start Creating Now</a>
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-24">
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <PreviewContent step={steps[activeStep].preview} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};