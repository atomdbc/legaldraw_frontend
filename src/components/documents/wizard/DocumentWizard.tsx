'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WizardSteps, Step } from '@/components/documents/ui/WizardSteps';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Save, Sparkles } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const wizardSteps: Omit<Step, 'status'>[] = [
  { id: 'type', title: 'Document Type', description: 'Select type' },
  { id: 'parties', title: 'Parties', description: 'Add parties' },
  { id: 'details', title: 'Details', description: 'Fill details' },
  { id: 'preview', title: 'Preview', description: 'Review' }
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
  const { children, currentStepIndex, onNext, onBack, allowNext = true, isSaving = false, documentType } = props;
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const isLastStep = currentStepIndex === wizardSteps.length - 1;
  const isDisabled = !allowNext || isProcessing || isSaving;

  const handleNavigateNext = async () => {
    if (isProcessing || !allowNext || !onNext) return;
    setIsProcessing(true);

    try {
      const shouldProceed = await onNext();
      if (shouldProceed && isLastStep) {
        router.push('/documents');
        return;
      }
      if (!shouldProceed) {
        setIsProcessing(false);
        return;
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

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      <WizardSteps steps={wizardSteps} currentStep={currentStepIndex} />
      
      <div className="flex-1 container py-8 overflow-auto">
        <div className="mx-auto max-w-5xl">
          {children}
        </div>
      </div>

      <div className="border-t py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container">
          <div className="mx-auto max-w-5xl flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
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
                  {isLastStep ? (
                    <>Finish</>
                  ) : (
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