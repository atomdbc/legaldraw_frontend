// src/components/documents/ui/WizardSteps.tsx

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface Step {
  id: string;
  title: string;
  description: string;
  status: 'upcoming' | 'current' | 'completed';
}

interface WizardStepsProps {
  steps: Step[];
  currentStep: number;
}

export function WizardSteps({ steps, currentStep }: WizardStepsProps) {
  return (
    <div className="py-4 px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="mx-auto max-w-5xl">
        <nav aria-label="Progress" className="relative">
          {/* Progress bar */}
          <div className="absolute left-0 top-[22px] h-0.5 w-full bg-muted">
            <div
              className="absolute left-0 top-0 h-full bg-primary transition-all duration-500 ease-in-out"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {/* Steps */}
          <ol className="flex items-center justify-between">
            {steps.map((step, index) => (
              <li key={step.id} className="relative flex flex-col items-center">
                <div 
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-full border-2 bg-background transition-colors duration-200",
                    step.status === 'completed' ? 'border-primary' : 'border-muted',
                    step.status === 'current' ? 'border-primary ring-4 ring-primary/20' : ''
                  )}
                >
                  {step.status === 'completed' ? (
                    <Check className="h-5 w-5 text-primary" />
                  ) : (
                    <span 
                      className={cn(
                        "text-sm font-medium",
                        step.status === 'current' ? 'text-primary' : 'text-muted-foreground'
                      )}
                    >
                      {index + 1}
                    </span>
                  )}
                </div>
                <div className="mt-4 flex flex-col items-center">
                  <span 
                    className={cn(
                      "text-sm font-medium",
                      step.status === 'current' ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {step.title}
                  </span>
                  <span className="text-xs text-muted-foreground mt-0.5">
                    {step.description}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}