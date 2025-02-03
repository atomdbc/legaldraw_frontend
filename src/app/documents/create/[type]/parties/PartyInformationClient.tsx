'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
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

export function PartyInformationClient({ 
  documentType, 
  initialPartyId 
}: PartyInformationClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isValid, setIsValid] = useState(false);
  const { data, updateProgress } = useDocumentProgress();
  const { navigateNext, navigateBack } = useWizardNavigation(documentType);
  const [parties, setParties] = useState<Party[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, any>>({});
  const initializedRef = useRef(false);
  const navigationInProgressRef = useRef(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Safe initialization
  useEffect(() => {
    if (!initializedRef.current && initialPartyId && !parties.length) {
      const initialParty = {
        ...INITIAL_PARTY,
        id: initialPartyId
      };
      setParties([initialParty]);
      initializedRef.current = true;
    }
  }, [initialPartyId, parties.length]);

  // Safe navigation
  const safeNavigate = useCallback((route: string | null) => {
    if (!route || navigationInProgressRef.current) return;
    navigationInProgressRef.current = true;
    try {
      router.push(route);
    } catch (error) {
      console.error('Navigation error:', error);
      toast({
        variant: "destructive",
        title: "Navigation Error",
        description: "Failed to navigate. Please try again."
      });
    } finally {
      // Reset after a short delay to prevent double-navigation
      setTimeout(() => {
        navigationInProgressRef.current = false;
      }, 100);
    }
  }, [router, toast]);

  // Process party data safely
  const processPartyData = useCallback((party: Party | null) => {
    if (!party) return null;
    
    try {
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
    } catch (error) {
      console.error('Error processing party data:', error);
      return null;
    }
  }, []);

  // Validate and update status
  const validateAndUpdateStatus = useCallback((currentParties: Party[]) => {
    console.log('Starting validation with parties:', currentParties);
    
    if (!Array.isArray(currentParties)) {
      console.log('Invalid parties array');
      return false;
    }
    
    try {
      const processedParties = currentParties
        .filter(Boolean)
        .map(processPartyData)
        .filter(Boolean) as Party[];
  
      console.log('Processed parties:', processedParties);
  
      const errors = validateParties(processedParties);
      console.log('Validation errors:', errors);
      
      const hasErrors = Object.keys(errors).length > 0;
      const hasEnoughParties = processedParties.length >= 2;
      const isValidForm = !hasErrors && hasEnoughParties;
  
      console.log('Validation results:', {
        hasErrors,
        hasEnoughParties,
        isValidForm
      });
  
      setValidationErrors(errors);
      setIsValid(isValidForm);
      return isValidForm;
    } catch (error) {
      console.error('Error validating parties:', error);
      setValidationErrors({
        general: { message: 'An error occurred while validating the parties.' }
      });
      setIsValid(false);
      return false;
    }
  }, [processPartyData]);

  // Load initial data
  useEffect(() => {
    if (data?.data?.parties && Array.isArray(data.data.parties)) {
      try {
        const processedParties = data.data.parties
          .filter(Boolean)
          .map(processPartyData)
          .filter(Boolean) as Party[];
        
        if (processedParties.length > 0) {
          setParties(processedParties);
          validateAndUpdateStatus(processedParties);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    }
  }, [data, processPartyData, validateAndUpdateStatus]);

  // Save progress with debounce
  const saveProgress = useCallback(async (currentParties: Party[]): Promise<boolean> => {
    if (!Array.isArray(currentParties)) return false;

    try {
      const result = await updateProgress({
        type: documentType as DocumentType,
        step: 2,
        data: {
          ...data?.data,
          parties: currentParties.filter(Boolean)
        }
      });
      return !!result;
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

  // Handle parties changes with debounce
  const handlePartiesChange = useCallback(async (newParties: Party[]) => {
    if (!Array.isArray(newParties)) return;

    try {
      const processedParties = newParties
        .filter(Boolean)
        .map(processPartyData)
        .filter(Boolean) as Party[];

      setParties(processedParties);
      validateAndUpdateStatus(processedParties);

      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set new timeout for saving
      saveTimeoutRef.current = setTimeout(() => {
        saveProgress(processedParties).catch(console.error);
      }, 500);
    } catch (error) {
      console.error('Error handling parties change:', error);
    }
  }, [saveProgress, validateAndUpdateStatus, processPartyData]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleNext = async () => {
    try {
      // Just navigate directly without save check
      console.log('Navigating to details page...');
      router.push(`/documents/create/${documentType}/details`);
      return true;
    } catch (error) {
      console.error('Navigation error:', error);
      return false;
    }
  };

  // Handle back button click
  const handleBack = useCallback(() => {
    if (navigationInProgressRef.current) return;
    const prevRoute = navigateBack('parties');
    if (prevRoute) {
      safeNavigate(prevRoute);
    }
  }, [navigateBack, safeNavigate]);

  // Get validation errors summary
  const getErrorSummary = useCallback(() => {
    try {
      return Object.values(validationErrors)
        .map(error => error?.message)
        .filter(Boolean);
    } catch (error) {
      console.error('Error getting error summary:', error);
      return ['An error occurred while displaying validation errors.'];
    }
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