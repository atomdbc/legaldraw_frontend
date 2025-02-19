'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { 
  DocumentType, 
  documentTypeUtils,
  DocumentVariables,
  DOCUMENT_FIELDS_CONFIG
} from "@/types/document";
import { Party } from "@/types/party";
import { useRouter } from "next/navigation";
import { documentApi } from "@/lib/api/document";
import { 
  FileText, 
  Users, 
  Building2, 
  Mail, 
  MapPin, 
  CheckCircle,
  Loader2,
  AlertCircle 
} from "lucide-react";
import { UpgradePlanModal } from "@/app/settings/modals/UpgradePlanModal";
import { getJurisdictionById } from "@/lib/config/jurisdictions";

interface DocumentReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: DocumentType;
  documentData: {
    parties: Party[];
    variables: Partial<DocumentVariables>;
  };
  isLoading?: boolean;
}

// Convert frontend document type to backend format
const getBackendDocumentType = (type: string): string => {
  const typeMap: Record<string, string> = {
    'nda': 'NDA',
    'service': 'SERVICE',
    'employment': 'EMPLOYMENT_AGREEMENT',
    'software': 'SOFTWARE_LICENSE'
  };
  return typeMap[type.toLowerCase()] || type.toUpperCase();
};

const formatJurisdiction = (jurisdiction: string | null): string => {
  if (!jurisdiction) return '-';
  // If the jurisdiction is already a label (contains spaces or is longer than an ID typically would be)
  if (jurisdiction.includes(' ') || jurisdiction.length > 20) {
    return jurisdiction;
  }
  // Otherwise, try to get the jurisdiction label from the ID
  const jurisdictionObj = getJurisdictionById(jurisdiction);
  return jurisdictionObj?.label || jurisdiction;
};

const formatValue = (key: string, value: any): string => {
  if (!value) return '-';
  
  if (key.includes('date') && (value instanceof Date || typeof value === 'string')) {
    try {
      const date = value instanceof Date ? value : new Date(value);
      return format(date, 'PPP');
    } catch (e) {
      return value.toString();
    }
  }
  
  return value.toString();
};

const formatAddress = (address: Party['address']): string => {
  if (!address) return '-';
  const { street, city, state, zipCode, country } = address;
  return `${street}, ${city}, ${state} ${zipCode}, ${country}`;
};

export function DocumentReviewModal({
  isOpen,
  onClose,
  documentType,
  documentData,
  isLoading: parentLoading = false
}: DocumentReviewModalProps) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { toast } = useToast();
  const [showSubscriptionError, setShowSubscriptionError] = useState(false);
  const hasParties = documentData.parties && documentData.parties.length > 0;
  const [error, setError] = useState<any>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const validateParties = (parties: Party[]): string[] => {
    const validationErrors: string[] = [];
    
    if (parties.length < 2) {
      validationErrors.push("At least two parties are required");
    }

    parties.forEach((party, index) => {
      if (!party.name) {
        validationErrors.push(`Party ${index + 1}: Name is required`);
      }
      if (party.type !== 'individual' && !party.jurisdiction) {
        validationErrors.push(`Party ${index + 1}: Jurisdiction is required for organizations`);
      }
      if (!party.address?.street || !party.address?.city || !party.address?.state || !party.address?.zipCode) {
        validationErrors.push(`Party ${index + 1}: Complete address is required`);
      }
    });

    return validationErrors;
  };

  const validateVariables = (variables: any): string[] => {
    const validationErrors: string[] = [];
    const docType = documentType.toLowerCase();
    const fields = DOCUMENT_FIELDS_CONFIG[docType] || [];
    
    const requiredFields = fields
      .filter(field => field.required)
      .map(field => field.key);

    const missingFields = requiredFields.filter(field => !variables[field]);

    if (missingFields.length > 0) {
      validationErrors.push(`Required fields missing: ${missingFields.join(', ')}`);
    }

    return validationErrors;
  };

  const getDocumentType = (type: string): string => {
    // Map frontend types to backend enum values exactly
    const typeMap: Record<string, string> = {
      'nda': 'NDA',
      'service': 'SERVICE', // Matching backend enum exactly
      'employment': 'EMPLOYMENT',
      'software': 'SOFTWARE_LICENSE'
    };
    const lowercaseType = type.toLowerCase();
    return lowercaseType in typeMap ? typeMap[lowercaseType] : type.toUpperCase();
  };
  
  const handleGenerate = async () => {
    if (isGenerating || parentLoading) return;
    
    try {
      const partyErrors = validateParties(documentData.parties);
      const variableErrors = validateVariables(documentData.variables);
      const allErrors = [...partyErrors, ...variableErrors];
  
      if (allErrors.length > 0) {
        setErrors(allErrors);
        return;
      }
  
      setIsGenerating(true);
      setShowSubscriptionError(false);
  
      const formattedParties = documentData.parties.map(party => ({
        name: party.name,
        type: party.type.toLowerCase(),
        email: party.email || null,
        phone: party.phone || null,
        jurisdiction: party.jurisdiction || null,
        address: {
          street: party.address.street,
          city: party.address.city,
          state: party.address.state,
          zip_code: party.address.zipCode,
          country: party.address.country
        }
      }));

      const documentSettings = {
        cover_page: {
            enabled: true,  // You can make this configurable
            watermark: documentType === 'SERVICE' ? 'SERVICE AGREEMENT' : 'CONFIDENTIAL',
            logo_enabled: false  // Can be made configurable
        },
        header_footer: {
            enabled: true,
            header_text: documentType === 'SERVICE' ? 'SERVICE AGREEMENT' : 'CONFIDENTIAL & PROPRIETARY',
            footer_text: "Page {page_number} of {total_pages}"
        },
        styling: {
            font_family: "Arial, sans-serif",
            primary_color: "#000080",
            secondary_color: "#C0C0C0"
        }
    };
  
      const payload = {
        template_id: `${documentType.toLowerCase()}_template_v1`,
        document_type: getDocumentType(documentType),
        parties: formattedParties,
        variables: documentData.variables,
        effective_date: documentData.variables.effective_date,
        settings: documentSettings  // Add settings to payload
    };

    console.log('Sending payload:', JSON.stringify(payload, null, 2));

    const response = await documentApi.generateDocument(payload);
      
    if (response?.document_id) {
      toast({
        title: "Success",
        description: "Document generated successfully"
      });
      router.push(`/documents/create/${documentType.toLowerCase()}/preview?documentId=${response.document_id}`);
    }
  } catch (error: any) {
    setError(error);
    const errorMessage = error?.error?.message || error?.message || "Failed to generate document";
    
    if (errorMessage.includes('No active plan') || errorMessage.includes('Monthly generation limit reached')) {
      setShowSubscriptionError(true);
      return;
    }
  
    toast({
      variant: "destructive",
      title: "Generation Failed",
      description: errorMessage
    });
  } finally {
    setIsGenerating(false);
  }
};

function DocumentGenerationState() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-6 md:py-12">
      <div className="relative mb-6 md:mb-8">
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
        <div className="relative rounded-full bg-primary/10 p-6 md:p-8">
          <FileText className="h-8 w-8 md:h-12 md:w-12 text-primary animate-pulse" />
        </div>
      </div>

      <div className="space-y-4 md:space-y-6 w-full max-w-sm px-4 md:px-0">
        <h3 className="text-center font-medium text-base md:text-lg mb-4 md:mb-6">
          Generating Your Document
        </h3>

        <div className="space-y-3 md:space-y-4">
          {[
            { label: "Processing party information", delay: "0s" },
            { label: "Applying document variables", delay: "1s" },
            { label: "Formatting content", delay: "2s" },
            { label: "Generating final document", delay: "3s" }
          ].map((step, index) => (
            <div
              key={index}
              className="flex items-center gap-2 md:gap-3 animate-fadeIn"
              style={{ animationDelay: step.delay }}
            >
              <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-primary animate-ping" />
              </div>
              <span className="text-xs md:text-sm text-muted-foreground">
                {step.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 md:mt-8">
          <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full w-0 animate-progress" />
          </div>
        </div>
      </div>
    </div>
  );
}

  const isDisabled = isGenerating || parentLoading;

  return (
    <>
      <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[95vh] p-0 mx-4">
        <DialogTitle className="sr-only">
          {isGenerating ? 'Document Generation' : 'Document Review'}
        </DialogTitle>
        
        {showSubscriptionError ? (
          <div className="h-full flex items-center justify-center p-4 md:p-8 bg-gradient-to-b from-gray-50/80 to-white/80 backdrop-blur-sm">
            <div className="max-w-md w-full">
              <div className="bg-white/70 backdrop-blur-md rounded-lg shadow-lg border border-gray-200/60 p-4 md:p-8 text-center">
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-black/5 backdrop-blur-sm flex items-center justify-center mb-3 md:mb-4 mx-auto">
                  <AlertCircle className="h-5 w-5 md:h-6 md:w-6 text-gray-900" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">
                  {error?.error?.message?.includes('Monthly generation limit reached') 
                    ? 'Monthly Limit Reached'
                    : 'Subscription Required'}
                </h3>
                <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                  {error?.error?.message?.includes('Monthly generation limit reached')
                    ? 'You have reached your monthly document generation limit. Upgrade your plan to generate more documents.'
                    : 'You need an active subscription to generate documents. Upgrade your plan to continue.'}
                </p>
                <div className="flex flex-col md:flex-row gap-2 md:gap-3 items-stretch md:items-center justify-center">
                  <Button
                    size="lg"
                    className="bg-gray-900 hover:bg-gray-800 text-white shadow-sm backdrop-blur-sm"
                    onClick={() => setShowUpgradeModal(true)}
                  >
                    Upgrade Now
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="text-gray-600 hover:text-gray-800 hover:bg-gray-100/50"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader className="p-4 md:p-6 pb-0">
              <DialogTitle className="text-lg md:text-xl flex items-center gap-2">
                <FileText className="h-4 w-4 md:h-5 md:w-5" />
                {isGenerating ? 'Generating Document' : 'Document Review'}
              </DialogTitle>
            </DialogHeader>

            {isGenerating ? (
              <DocumentGenerationState />
            ) : (
              <>
                <div className="flex-1 px-4 md:px-6 py-3 md:py-4 overflow-y-auto" style={{ height: 'calc(95vh - 180px)' }}>
                  {errors.length > 0 && (
                    <div className="mb-4 md:mb-6">
                      <Card className="bg-red-50 border-red-200 p-3 md:p-4">
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertCircle className="h-4 w-4 md:h-5 md:w-5" />
                          <h4 className="font-medium text-sm md:text-base">Please fix the following issues:</h4>
                        </div>
                        <ul className="mt-2 space-y-1 text-xs md:text-sm text-red-600 list-disc pl-4 md:pl-5">
                          {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </Card>
                    </div>
                  )}

                  <section className="space-y-6 md:space-y-8">
                    <div>
                      <h3 className="text-base md:text-lg font-medium mb-3 md:mb-4">Basic Information</h3>
                      <Card className="p-3 md:p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <span className="text-sm md:text-base font-medium">Document Type:</span>
                          <Badge variant="secondary" className="text-sm md:text-base w-fit">
                            {documentTypeUtils.toDisplayName(documentType)}
                          </Badge>
                        </div>
                      </Card>
                    </div>

                    {hasParties && (
                      <div>
                        <h3 className="text-base md:text-lg font-medium mb-3 md:mb-4 flex items-center gap-2">
                          <Users className="h-4 w-4 md:h-5 md:w-5" />
                          Parties
                        </h3>
                        <div className="grid gap-3 md:gap-4">
                          {documentData.parties.map((party, index) => (
                            <Card key={party.id || index} className="p-3 md:p-4 space-y-3 md:space-y-4">
                              <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                                <div>
                                  <h4 className="font-medium text-sm md:text-base">
                                    {party.name || `Party ${index + 1}`}
                                  </h4>
                                  {party.email && (
                                    <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-muted-foreground mt-1">
                                      <Mail className="h-3 w-3 md:h-4 md:w-4" />
                                      {party.email}
                                    </div>
                                  )}
                                </div>
                                <Badge variant="outline" className="text-xs md:text-sm w-fit">
                                  <Building2 className="h-3 w-3 mr-1" />
                                  {party.type}
                                </Badge>
                              </div>
                              <Separator />
                              <div className="space-y-2">
                                <div className="flex items-start gap-1.5 md:gap-2">
                                  <MapPin className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground mt-1" />
                                  <div className="flex-1 text-xs md:text-sm">
                                    {formatAddress(party.address)}
                                  </div>
                                </div>
                                {party.jurisdiction && (
                                  <div className="text-xs md:text-sm pl-5 md:pl-6">
                                    <span className="text-muted-foreground">Jurisdiction:</span>{' '}
                                    {formatJurisdiction(party.jurisdiction)}
                                  </div>
                                )}
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-base md:text-lg font-medium mb-3 md:mb-4 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 md:h-5 md:w-5" />
                        Document Details
                      </h3>
                      <Card className="divide-y">
                        {Object.entries(documentData.variables).map(([key, value]) => (
                          <div key={key} className="p-3 md:p-4">
                            <div className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
                              {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </div>
                            <div className="text-xs md:text-sm">{formatValue(key, value)}</div>
                          </div>
                        ))}
                      </Card>
                    </div>
                  </section>
                </div>

                <DialogFooter className="p-4 md:p-6 border-t mt-auto">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-3 md:gap-4">
                    <span className="text-xs md:text-sm text-muted-foreground order-2 md:order-1">
                      Review your document details before generation
                    </span>
                    <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto order-1 md:order-2">
                      <Button 
                        variant="outline" 
                        onClick={onClose} 
                        disabled={isDisabled}
                        className="flex-1 md:flex-none text-sm"
                      >
                        Back to Edit
                      </Button>
                      <Button 
                        onClick={handleGenerate} 
                        disabled={isDisabled || errors.length > 0}
                        className="flex-1 md:flex-none min-w-0 md:min-w-[140px] text-sm"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="h-3 w-3 md:h-4 md:w-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          'Generate Document'
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogFooter>
              </>
            )}
          </>
        )}
      </DialogContent>

      <UpgradePlanModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        currentPlan={null}
        onSuccess={() => {
          setShowSubscriptionError(false);
          window.location.reload();
        }}
      />
    </>
  );
}