'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DocumentWizard } from "@/components/documents/wizard/DocumentWizard";
import { DocumentVariables } from "@/components/documents/wizard/DocumentVariables";
import { DocumentReviewModal } from "@/components/documents/wizard/DocumentReviewModal";
import { DocumentSettings } from "@/components/documents/wizard/DocumentSettings";
import { useToast } from "@/hooks/use-toast";
import { useDocumentProgress } from "@/hooks/useDocumentProgress";
import { DOCUMENT_TYPES } from '@/lib/utils/documentTypes';
import { DocumentVariables as Variables } from "@/types/document";
import { Dialog } from '@radix-ui/react-dialog';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Pencil, Settings2, AlertCircle, Loader2 } from "lucide-react";

interface DocumentDetailsClientProps {
  initialType: string;
}

const defaultSettings = (type: string) => ({
  cover_page: {
    enabled: true,
    watermark: type === 'service' ? 'SERVICE AGREEMENT' : 'CONFIDENTIAL',
    logo_enabled: false
  },
  header_footer: {
    enabled: true,
    header_text: type === 'service' ? 'SERVICE AGREEMENT' : 'CONFIDENTIAL & PROPRIETARY',
    footer_text: 'Page {page_number} of {total_pages}'
  },
  styling: {
    font_family: 'Arial, sans-serif',
    primary_color: '#000080',
    secondary_color: '#C0C0C0'
  }
});

export function DocumentDetailsClient({ initialType }: DocumentDetailsClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: progressData, updateProgress } = useDocumentProgress();

  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [variables, setVariables] = useState<Partial<Variables>>({});
  const [settings, setSettings] = useState(defaultSettings(initialType));
  const [isSaving, setIsSaving] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [activeView, setActiveView] = useState<'details' | 'settings'>('details');

  // Load and validate initial data
  useEffect(() => {
    async function loadData() {
      if (!DOCUMENT_TYPES.includes(initialType as any)) {
        router.push('/documents/create');
        return;
      }

      if (!progressData) return;

      const hasValidParties = progressData.data?.parties?.length >= 2 && 
                            progressData.data.parties.every(p => 
                              p.name && p.type && p.address);

      if (!hasValidParties) {
        router.push(`/documents/create/${initialType}/parties`);
        return;
      }

      if (progressData.data?.variables) {
        setVariables(progressData.data.variables);
      }
      if (progressData.data?.settings) {
        setSettings(progressData.data.settings);
      }

      setIsLoading(false);
    }

    loadData();
  }, [progressData, initialType, router]);

  const handleSave = async () => {
    if (isSaving || !isValid) return false;

    setIsSaving(true);
    try {
      await updateProgress({
        type: initialType,
        step: 3,
        data: {
          ...progressData?.data,
          variables,
          settings
        }
      });
      setShowReview(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Changes couldn't be saved. Please try again."
      });
    } finally {
      setIsSaving(false);
    }
    return false;
  };

  if (isLoading) {
    return (
      <DocumentWizard currentStepIndex={2} documentType={initialType} allowNext={false}>
        <div className="flex items-center justify-center h-[500px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DocumentWizard>
    );
  }

  return (
    <>
      <DocumentWizard
        currentStepIndex={2}
        onNext={handleSave}
        onBack={() => router.push(`/documents/create/${initialType}/parties`)}
        allowNext={isValid && !isSaving}
        isSaving={isSaving}
        documentType={initialType}
      >
        <div>
          {/* Header Section */}
          <div className="bg-card p-6 space-y-6 border-b">
            <div>
              <h2 className="text-2xl font-semibold">Document Details</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Configure the content and appearance of your {initialType.toUpperCase()}.
              </p>
            </div>

            {/* Section Navigation */}
            <div className="flex gap-4">
              <Button
                variant={activeView === 'details' ? 'default' : 'outline'}
                onClick={() => setActiveView('details')}
                className="flex-1"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Document Content
              </Button>
              <Button
                variant={activeView === 'settings' ? 'default' : 'outline'}
                onClick={() => setActiveView('settings')}
                className="flex-1"
              >
                <Settings2 className="h-4 w-4 mr-2" />
                Appearance Settings
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {activeView === 'details' ? (
              <DocumentVariables
                documentType={initialType}
                variables={variables}
                onChange={setVariables}
                onValidationChange={setIsValid}
              />
            ) : (
              <DocumentSettings
                documentType={initialType}
                settings={settings}
                onChange={setSettings}
              />
            )}

            {/* Validation Message */}
            {!isValid && activeView === 'details' && (
              <Alert className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Fill in all required fields to proceed to document review.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </DocumentWizard>

      <Dialog open={showReview} onOpenChange={setShowReview}>
        <DocumentReviewModal
          isOpen={showReview}
          onClose={() => setShowReview(false)}
          documentType={initialType as any}
          documentData={{
            parties: progressData?.data?.parties || [],
            variables,
            settings
          }}
          isLoading={isSaving}
        />
      </Dialog>
    </>
  );
}