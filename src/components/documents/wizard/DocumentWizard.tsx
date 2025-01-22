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
  const { children, currentStepIndex, onNext, onBack, allowNext = true, isSaving = false } = props;
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

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
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
                      <div className="flex flex-col md:flex-row items-center gap-2">
                        <div 
                          className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors",
                            isCompleted && "bg-primary text-primary-foreground",
                            isActive && "bg-primary/10 text-primary border-2 border-primary",
                            !isActive && !isCompleted && "bg-muted text-muted-foreground"
                          )}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            step.icon
                          )}
                        </div>
                        <div className="hidden md:block flex-1">
                          <div className="text-sm font-medium">{step.title}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{step.description}</div>
                        </div>
                        {index < wizardSteps.length - 1 && (
                          <div className="flex-1 hidden md:block">
                            <div 
                              className={cn(
                                "h-0.5 w-full",
                                isCompleted ? "bg-primary" : "bg-muted"
                              )}
                            />
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="flex-1 container py-8 overflow-auto">
        <div className="mx-auto max-w-5xl">
          {children}
        </div>
      </div>

      <div className="border-t py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky bottom-0">
        <div className="container">
          <div className="mx-auto max-w-5xl flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
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