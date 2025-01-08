'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DocumentWizard } from '@/components/documents/wizard/DocumentWizard';
import { useWizardNavigation } from '@/hooks/useWizardNavigation';
import { useDocumentProgress } from '@/hooks/useDocumentProgress';
import { useToast } from "@/hooks/use-toast";
import { DOCUMENT_TYPES } from '@/lib/utils/documentTypes';
import { FileText, ArrowRight, Sparkles } from 'lucide-react';

interface DocumentTypePageProps {
  params: Promise<{
    type: string;
  }>;
}

export default function DocumentTypePage({ params }: DocumentTypePageProps) {
  const { type } = use(params);
  const router = useRouter();
  const { navigateNext } = useWizardNavigation(type);
  const { initializeProgress } = useDocumentProgress();
  const { toast } = useToast();

  useEffect(() => {
    // Validate document type
    if (!type || !DOCUMENT_TYPES.includes(type)) {
      toast({
        variant: "destructive",
        title: "Invalid Document Type",
        description: "Redirecting to document selection..."
      });
      router.push('/documents/create');
      return;
    }

    const initializeWizard = async () => {
      try {
        // Initialize document progress
        await initializeProgress({
          type: type,
          step: 1,
          data: {
            created_at: new Date().toISOString(),
            type: type,
            status: 'draft'
          }
        });

        // Navigate to next step
        const nextRoute = await navigateNext('type');
        if (nextRoute) {
          router.push(nextRoute);
        }
      } catch (error) {
        console.error('Failed to initialize document:', error);
        toast({
          variant: "destructive",
          title: "Initialization Failed",
          description: "Failed to start the document wizard. Please try again."
        });
        router.push('/documents/create');
      }
    };

    initializeWizard();
  }, [type, navigateNext, router, initializeProgress, toast]);

  const getDocumentTypeDisplay = (type: string) => {
    return type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <DocumentWizard 
      currentStepIndex={0} 
      documentType={getDocumentTypeDisplay(type)}
    >
      <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <div className="w-full max-w-md mx-auto">
          <div className="relative">
            {/* Loading Card */}
            <div className="bg-card rounded-lg border p-8 shadow-sm">
              <div className="flex flex-col items-center gap-6">
                {/* Icon Animation */}
                <div className="relative">
                  <div className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
                  <div className="relative rounded-full bg-primary/10 p-4">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                </div>

                {/* Loading Text */}
                <div className="space-y-2 text-center">
                  <h3 className="text-lg font-semibold">
                    Preparing Your Document
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Setting up {getDocumentTypeDisplay(type)}
                  </p>
                </div>

                {/* Loading Steps */}
                <div className="w-full space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-muted rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Pattern */}
            <div 
              className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
              aria-hidden="true"
            >
              <div
                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-primary-foreground opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </DocumentWizard>
  );
}