'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DocumentWizard } from '@/components/documents/wizard/DocumentWizard';
import { DocumentPreviewPanel } from '@/components/documents/preview/DocumentPreviewPanel';
import { useDocumentProgress } from '@/hooks/useDocumentProgress';
import { useToast } from '@/hooks/use-toast';
import { useWizardNavigation } from '@/hooks/useWizardNavigation';

interface PreviewClientProps {
  documentType: string;
  documentId?: string;
}

export function PreviewClient({ documentType, documentId }: PreviewClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: progressData } = useDocumentProgress();
  const { navigateBack } = useWizardNavigation(documentType);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!progressData) return;

    const hasValidData = (progressData?.data?.parties?.length ?? 0) >= 2 && 
                        Object.keys(progressData?.data?.variables || {}).length > 0;
                        
    if (!hasValidData) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please complete previous steps first."
      });
      router.push(`/documents/create/${documentType}`);
    }

    setIsLoading(false);
  }, [progressData, documentType, router, toast]);

  const handleBack = () => {
    const prevRoute = navigateBack('preview');
    if (prevRoute) {
      router.push(prevRoute);
    }
  };

  if (isLoading) {
    return (
      <DocumentWizard
        currentStepIndex={3}
        documentType={documentType}
        allowNext={false}
      >
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent" />
        </div>
      </DocumentWizard>
    );
  }

  return (
    <DocumentWizard
      currentStepIndex={3}
      onBack={handleBack}
      allowNext={false}
      documentType={documentType}
    >
      <DocumentPreviewPanel 
        documentData={progressData?.data}
      />
    </DocumentWizard>
  );
}