'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PartyForm } from "@/components/documents/forms/PartyForm";
import { DocumentWizard } from "@/components/documents/wizard/DocumentWizard";
import { Card } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Party, INITIAL_PARTY } from "@/types/party";
import { DocumentType } from "@/types/document";
import { validateParties } from "@/lib/validations/party";
import { useDocumentProgress } from "@/hooks/useDocumentProgress";
import { AlertCircle } from 'lucide-react';
import { useWizardNavigation } from '@/hooks/useWizardNavigation';

interface PartyInformationClientProps {
  documentType: string;
  initialPartyId: string;
}

export function PartyInformationClient({ documentType, initialPartyId }: PartyInformationClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isValid, setIsValid] = useState(false);
  const { data, updateProgress } = useDocumentProgress();
  const { navigateNext, navigateBack } = useWizardNavigation(documentType);
  const [parties, setParties] = useState<Party[]>([{ ...INITIAL_PARTY, id: initialPartyId }]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (data?.data?.parties && data.data.parties.length > 0) {
      setParties(data.data.parties);
      const errors = validateParties(data.data.parties);
      setIsValid(Object.keys(errors).length === 0 && data.data.parties.length >= 2);
    }
  }, [data]);

  const saveProgress = useCallback(async (currentParties: Party[]): Promise<boolean> => {
    try {
      await updateProgress({
        type: documentType as DocumentType,
        step: 2,
        data: {
          ...data?.data,
          parties: currentParties
        }
      });
      return true;
    } catch (error) {
      console.error('Error saving progress:', error);
      toast({
        variant: "destructive",
        title: "Auto-save Failed",
        description: "Your changes may not be saved. Please try again."
      });
      return false;
    }
  }, [documentType, data?.data, updateProgress, toast]);

  const handlePartiesChange = useCallback(async (newParties: Party[]) => {
    setParties(newParties);
    
    const errors = validateParties(newParties);
    const isValidNow = Object.keys(errors).length === 0 && newParties.length >= 2;
    setIsValid(isValidNow);
    
    await saveProgress(newParties);
  }, [saveProgress]);

  const handleNext = async () => {
    if (isSaving) return false;
    setIsSaving(true);

    try {
      const errors = validateParties(parties);
      const isValidNow = Object.keys(errors).length === 0 && parties.length >= 2;

      if (!isValidNow) {
        toast({
          variant: "destructive",
          title: "Invalid Party Information",
          description: "Please fix the errors before proceeding."
        });
        return false;
      }

      const saved = await saveProgress(parties);
      if (!saved) {
        return false;
      }

      const nextRoute = await navigateNext('parties');
      if (nextRoute) {
        router.push(nextRoute);
        return true;
      }
      return false;

    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save progress."
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    const prevRoute = navigateBack('parties');
    if (prevRoute) {
      router.push(prevRoute);
    }
  };

  return (
    <DocumentWizard
      currentStepIndex={1}
      onNext={handleNext}
      onBack={handleBack}
      allowNext={isValid}
      isSaving={isSaving}
      documentType={documentType}
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Party Information
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Add all parties involved in this document. A {documentType.toUpperCase()} requires at least two parties to be valid.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            <strong>Organization:</strong> The company or entity being represented<br />
            <strong>Title:</strong> Role of the person signing (e.g., CEO, Director, Manager)<br />
            <strong>Address:</strong> Official business or registered address of the organization
          </p>
        </div>

        <Card className="pt-6 overflow-hidden">
          <PartyForm
            parties={parties}
            onChange={handlePartiesChange}
          />
        </Card>

        {parties.length < 2 && (
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>More Parties Required</AlertTitle>
            <AlertDescription>
              At least one more party is required. Click "Add Party" above to add
              another party to the document.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </DocumentWizard>
  );
}