'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PartyForm } from "@/components/documents/forms/PartyForm";
import { DocumentWizard } from "@/components/documents/wizard/DocumentWizard";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Party, INITIAL_PARTY } from "@/types/party";
import { DocumentType } from "@/types/document";
import { validateParties } from "@/lib/validations/party";
import { useDocumentProgress } from "@/hooks/useDocumentProgress";
import { useWizardNavigation } from '@/hooks/useWizardNavigation';
import { AlertCircle, Info, AlertTriangle, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

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
  const [parties, setParties] = useState<Party[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, any>>({});
  const [isErrorsOpen, setIsErrorsOpen] = useState(false);
  const initializedRef = useRef(false);
  const navigationInProgressRef = useRef(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Safe initialization
  useEffect(() => {
    if (!initializedRef.current && initialPartyId && !parties.length) {
      const initialParty = {
        ...INITIAL_PARTY,
        id: initialPartyId,
        type: 'individual',
        role: 'First Party'
      };
      setParties([initialParty]);
      initializedRef.current = true;
    }
  }, [initialPartyId, parties.length]);

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
    if (!Array.isArray(currentParties)) {
      return false;
    }
    
    try {
      const processedParties = currentParties
        .filter(Boolean)
        .map(processPartyData)
        .filter(Boolean) as Party[];
      
      const errors = validateParties(processedParties);
      const hasErrors = Object.keys(errors).length > 0;
      const hasEnoughParties = processedParties.length >= 2;
      const isValidForm = !hasErrors && hasEnoughParties;
      
      setValidationErrors(errors);
      setIsValid(isValidForm);

      // Auto-open errors panel if there are errors
      if (hasErrors) {
        setIsErrorsOpen(true);
      }

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
      setTimeout(() => {
        navigationInProgressRef.current = false;
      }, 100);
    }
  }, [router, toast]);

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
      saveTimeoutRef.current = setTimeout(async () => {
        setIsSaving(true);
        try {
          await updateProgress({
            type: documentType as DocumentType,
            step: 2,
            data: {
              ...data?.data,
              parties: processedParties
            }
          });
        } catch (error) {
          console.error('Save error:', error);
          toast({
            variant: "destructive",
            title: "Auto-save Failed",
            description: "Your changes may not be saved. Please try again."
          });
        } finally {
          setIsSaving(false);
        }
      }, 500);
    } catch (error) {
      console.error('Error handling parties change:', error);
    }
  }, [data?.data, documentType, processPartyData, updateProgress, validateAndUpdateStatus, toast]);

  // Navigation handlers
  const handleNext = useCallback(async () => {
    if (!isValid) return false;
    try {
      router.push(`/documents/create/${documentType}/details`);
      return true;
    } catch (error) {
      console.error('Navigation error:', error);
      return false;
    }
  }, [isValid, router, documentType]);

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
      return ['An error occurred while processing validation errors.'];
    }
  }, [validationErrors]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const hasErrors = Object.keys(validationErrors).length > 0;
  const errorMessages = getErrorSummary();

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
        {/* Header with Validation Panel */}
        <div className="bg-card p-6 rounded-lg border space-y-4">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold">
              Add Parties to Your {documentType}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Fill in the details for each party involved in this agreement. You'll need at least two parties to proceed.
            </p>
          </div>

          {/* Expanded Validation Panel */}
          {hasErrors && (
            <Collapsible 
              open={isErrorsOpen} 
              onOpenChange={setIsErrorsOpen}
              className="bg-destructive/5 rounded-md"
            >
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">
                      {errorMessages.length} validation {errorMessages.length === 1 ? 'issue' : 'issues'} to fix
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4">
                <ul className="list-disc ml-9 space-y-2">
                  {errorMessages.map((error, index) => (
                    <li key={index} className="text-sm text-destructive">
                      {error}
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>

        {/* Main Form */}
        <div className="bg-background">
          <PartyForm
            parties={parties}
            onChange={handlePartiesChange}
            onValidationChange={setIsValid}
            validationErrors={validationErrors}
            prefilledFirstParty={true}
          />
        </div>

        {/* Context-Aware Guidance */}
        {parties.length < 2 && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Click "Add Party" to add the second party to your {documentType.toLowerCase()}.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </DocumentWizard>
  );
}

export default PartyInformationClient;