'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

const wizardSteps = [
  { id: 'type', title: 'Document Type', description: 'Select type', icon: '1' },
  { id: 'parties', title: 'Parties', description: 'Add parties', icon: '2' },
  { id: 'details', title: 'Details', description: 'Fill details', icon: '3' },
  { id: 'preview', title: 'Preview', description: 'Review', icon: '4' }
];

interface DocumentWizardProps {
  children: React.ReactNode;
  currentStepIndex: number;
  onNext?: () => Promise<boolean>;
  onBack?: () => void;
  allowNext?: boolean;
  isSaving?: boolean;
  documentType: string;
}

export function DocumentWizard(props: DocumentWizardProps) {
  const { 
    children, 
    currentStepIndex, 
    onNext, 
    onBack, 
    allowNext = true, 
    isSaving = false,
    documentType 
  } = props;
  
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [navigationError, setNavigationError] = useState<string | null>(null);

  const isLastStep = currentStepIndex === wizardSteps.length - 1;
  const isDisabled = (!allowNext && currentStepIndex !== 0) || isProcessing || isSaving;

  const handleNavigateNext = async () => {
    console.log('DocumentWizard handleNavigateNext started', {
      isProcessing,
      allowNext,
      hasOnNext: !!onNext,
      currentStepIndex
    });
  
    if (isProcessing || !allowNext || !onNext) {
      console.log('Navigation blocked at start');
      return;
    }
      
    try {
      setIsProcessing(true);
      const shouldProceed = await onNext();
      console.log('onNext result:', shouldProceed);
  
      // If onNext returns true, navigation has already been handled
      if (!shouldProceed) {
        console.log('Navigation halted by onNext returning false');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      toast({
        variant: "destructive",
        description: "Failed to proceed. Please try again."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Debug current state
  console.log('Wizard State:', {
    currentStepIndex,
    isLastStep,
    isDisabled,
    isProcessing,
    isSaving,
    hasError: !!navigationError
  });

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      {/* Progress bar */}
      <div className="border-b bg-white">
        <div className="container py-4">
          <div className="mx-auto max-w-5xl">
            <nav aria-label="Progress">
              <ol className="flex items-center gap-2">
                {wizardSteps.map((step, index) => {
                  const isActive = currentStepIndex === index;
                  const isCompleted = currentStepIndex > index;
                  return (
                    <li key={step.id} className="flex-1">
                      {/* ... rest of the step rendering code ... */}
                    </li>
                  );
                })}
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 container py-8 overflow-auto">
        <div className="mx-auto max-w-5xl">
          {navigationError && (
            <div className="mb-4 p-4 border border-red-500 rounded bg-red-50">
              <h4 className="font-semibold text-red-700">Error</h4>
              <p className="text-sm text-red-600">{navigationError}</p>
            </div>
          )}
          {children}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="border-t py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky bottom-0">
        <div className="container">
          <div className="mx-auto max-w-5xl flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => {
                console.log('Back button clicked');
                onBack?.();
              }}
              disabled={currentStepIndex === 0 || isDisabled}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button
              onClick={handleNavigateNext}
              disabled={isDisabled}
              className="min-w-[140px]"
            >
              {isProcessing || isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Processing...</span>
                </div>
              ) : (
                <>
                  {isLastStep ? "Finish" : (
                    <>
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}