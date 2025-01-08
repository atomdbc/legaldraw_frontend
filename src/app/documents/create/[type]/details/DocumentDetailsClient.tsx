'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DocumentWizard } from "@/components/documents/wizard/DocumentWizard";
import { DocumentVariables } from "@/components/documents/wizard/DocumentVariables";
import { DocumentReviewModal } from "@/components/documents/wizard/DocumentReviewModal";
import { DocumentSettings } from "@/components/documents/wizard/DocumentSettings"; // New component
import { useToast } from "@/hooks/use-toast";
import { useDocumentProgress } from "@/hooks/useDocumentProgress";
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DOCUMENT_TYPES } from '@/lib/utils/documentTypes';
import { DocumentVariables as Variables } from "@/types/document";
import { Dialog } from '@radix-ui/react-dialog';

interface DocumentDetailsClientProps {
  initialType: string;
}

// Default document settings
const getDefaultSettings = (documentType: string) => ({
  cover_page: {
    enabled: true,
    watermark: documentType === 'service' ? 'SERVICE AGREEMENT' : 'CONFIDENTIAL',
    logo_enabled: false
  },
  header_footer: {
    enabled: true,
    header_text: documentType === 'service' ? 'SERVICE AGREEMENT' : 'CONFIDENTIAL & PROPRIETARY',
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
  const [documentSettings, setDocumentSettings] = useState(getDefaultSettings(initialType));
  const [hasParties, setHasParties] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const loadInitialData = async () => {
      if (!DOCUMENT_TYPES.includes(initialType as any)) {
        router.push('/documents/create');
        return;
      }

      if (!progressData) return;
      
      const validParties = progressData.data?.parties && 
                          progressData.data.parties.length >= 2 && 
                          progressData.data.parties.every(party => 
                            party.name && party.type && party.address);

      if (!validParties) {
        router.push(`/documents/create/${initialType}/parties`);
        return;
      }

      setHasParties(!!validParties);

      if (progressData.data?.variables) {
        setVariables(progressData.data.variables);
      }

      // Load saved settings if they exist
      if (progressData.data?.settings) {
        setDocumentSettings(progressData.data.settings);
      }
      
      setIsLoading(false);
    };

    loadInitialData();
  }, [progressData, initialType, router]);

  const handleVariablesChange = (newVariables: Partial<Variables>) => {
    setVariables(newVariables);
  };

  const handleSettingsChange = (newSettings: any) => {
    setDocumentSettings(newSettings);
  };

  const handleValidationChange = (validationState: boolean) => {
    setIsValid(validationState);
  };

  const handleNext = async () => {
    if (isSaving || !isValid) return false;

    setIsSaving(true);
    try {
      await updateProgress({
        type: initialType,
        step: 3,
        data: {
          ...progressData?.data,
          variables,
          settings: documentSettings // Save settings with progress
        }
      });
      
      setShowReview(true);
      return false;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save document details."
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DocumentWizard currentStepIndex={2} documentType={initialType} allowNext={false}>
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent" />
        </div>
      </DocumentWizard>
    );
  }

  return (
    <>
      <DocumentWizard
        currentStepIndex={2}
        onNext={handleNext}
        onBack={() => router.push(`/documents/create/${initialType}/parties`)}
        allowNext={isValid && !isSaving}
        isSaving={isSaving}
        documentType={initialType}
      >
        <div className="space-y-6 p-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Document Configuration</h2>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Configure your {initialType.toUpperCase()} document details and appearance.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="details">Document Details</TabsTrigger>
              <TabsTrigger value="appearance">Appearance & Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card className="pt-6 overflow-hidden">
                <DocumentVariables
                  documentType={initialType}
                  variables={variables}
                  onChange={handleVariablesChange}
                  onValidationChange={handleValidationChange}
                />
              </Card>
            </TabsContent>

            <TabsContent value="appearance">
              <Card className="pt-6 overflow-hidden">
                <DocumentSettings
                  documentType={initialType}
                  settings={documentSettings}
                  onChange={handleSettingsChange}
                />
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DocumentWizard>

      <Dialog open={showReview} onOpenChange={setShowReview}>
        <DocumentReviewModal
          isOpen={showReview}
          onClose={() => setShowReview(false)}
          documentType={initialType as any}
          documentData={{
            parties: progressData?.data?.parties || [],
            variables: variables,
            settings: documentSettings // Pass settings to review modal
          }}
          isLoading={isSaving}
        />
      </Dialog>
    </>
  );
}