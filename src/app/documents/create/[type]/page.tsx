'use client';

import { use } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DocumentWizard } from '@/components/documents/wizard/DocumentWizard';
import { useWizardNavigation } from '@/hooks/useWizardNavigation';
import { useDocumentProgress } from '@/hooks/useDocumentProgress';
import { DOCUMENT_TYPES } from '@/lib/utils/documentTypes';

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

  useEffect(() => {
    if (!type || !DOCUMENT_TYPES.includes(type)) {
      router.push('/documents/create');
      return;
    }

    const initializeWizard = async () => {
      await initializeProgress({
        type: type,
        step: 1,
        data: {
          created_at: new Date().toISOString(),
          type: type,
        }
      });

      const nextRoute = await navigateNext('type');
      if (nextRoute) {
        router.push(nextRoute);
      }
    };

    initializeWizard();
  }, [type, navigateNext, router, initializeProgress]);

  return (
    <DocumentWizard currentStepIndex={0} documentType={type}>
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          <div className="text-center text-muted-foreground">
            Preparing document wizard...
          </div>
        </div>
      </div>
    </DocumentWizard>
  );
}