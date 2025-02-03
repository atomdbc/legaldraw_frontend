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
  const [parties, setParties] = useState<Party[]>([{
    ...INITIAL_PARTY,
    id: initialPartyId
  }]);
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, any>>({});

  // Helper function to process party data
  const processPartyData = useCallback((party: Party) => {
    return {
      ...party,
      type: party.type || 'individual',
      address: {
        ...party.address,
        zipCode: party.address?.postalCode || party.address?.zipCode || '',
        street: party.address?.street || '',
        city: party.address?.city || '',
        state: party.address?.state || '',
        country: party.address?.country || ''
      }
    };
  }, []);

  // Main validation function
  const validateAndUpdateStatus = useCallback((currentParties: Party[]) => {
    // Process all parties
    const processedParties = currentParties.map(processPartyData);

    // Run validation
    const errors = validateParties(processedParties);
    const hasErrors = Object.keys(errors).length > 0;
    const hasEnoughParties = processedParties.length >= 2;
    const isValidForm = !hasErrors && hasEnoughParties;

    setValidationErrors(errors);
    setIsValid(isValidForm);
    return isValidForm;
  }, [processPartyData]);

  // Load initial data
  useEffect(() => {
    if (data?.data?.parties && data.data.parties.length > 0) {
      const processedParties = data.data.parties.map(processPartyData);
      setParties(processedParties);
      validateAndUpdateStatus(processedParties);
    }
  }, [data, processPartyData, validateAndUpdateStatus]);

  // Save progress
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

  // Handle parties changes
  const handlePartiesChange = useCallback(async (newParties: Party[]) => {
    const processedParties = newParties.map(processPartyData);
    setParties(processedParties);
    validateAndUpdateStatus(processedParties);
    await saveProgress(processedParties);
  }, [saveProgress, validateAndUpdateStatus, processPartyData]);

  // Handle next button click
  const handleNext = async () => {
    if (isSaving) return false;
    setIsSaving(true);

    try {
      const processedParties = parties.map(processPartyData);
      const isValidNow = validateAndUpdateStatus(processedParties);

      if (!isValidNow) {
        const errorMessages = Object.values(validationErrors)
          .map(error => error.message)
          .filter(Boolean)
          .join(', ');

        toast({
          variant: "destructive",
          title: "Invalid Party Information",
          description: errorMessages || "Please fix all validation errors before proceeding."
        });
        return false;
      }

      const saved = await saveProgress(processedParties);
      if (!saved) return false;

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
        description: "Failed to save progress. Please try again."
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Handle back button click
  const handleBack = () => {
    const prevRoute = navigateBack('parties');
    if (prevRoute) {
      router.push(prevRoute);
    }
  };

  // Get validation errors summary
  const getErrorSummary = useCallback(() => {
    return Object.values(validationErrors)
      .map(error => error.message)
      .filter(Boolean);
  }, [validationErrors]);

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
            validationErrors={validationErrors}
          />
        </Card>

        {Object.keys(validationErrors).length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Validation Errors</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-4">
                {getErrorSummary().map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

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