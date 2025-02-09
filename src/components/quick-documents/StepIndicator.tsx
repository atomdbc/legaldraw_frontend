import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div className="flex items-center">
              <div
                className={`rounded-full h-8 w-8 flex items-center justify-center border-2 
                  ${index + 1 === currentStep 
                    ? 'border-primary bg-primary text-white' 
                    : index + 1 < currentStep 
                    ? 'border-primary bg-primary/10 text-primary' 
                    : 'border-gray-300 text-gray-300'
                  }`}
              >
                {index + 1 < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-[2px] mx-2 ${
                index + 1 < currentStep ? 'bg-primary' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}