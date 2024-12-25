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
  const hasParties = documentData.parties && documentData.parties.length > 0;

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
    const typeMap = {
      'nda': 'NDA',
      'service': 'SERVICE', // Matching backend enum exactly
      'employment': 'EMPLOYMENT',
      'software': 'SOFTWARE_LICENSE'
    };
    return typeMap[type.toLowerCase()] || type.toUpperCase();
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
  
      const payload = {
        template_id: `${documentType.toLowerCase()}_template_v1`,
        document_type: getDocumentType(documentType), // Will return 'SERVICE' for service docs
        parties: formattedParties,
        variables: documentData.variables,
        effective_date: documentData.variables.effective_date
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
      console.error('Document generation failed:', error);
      
      const errorMessage = error?.error?.message 
        || error?.message 
        || "Failed to generate document";
  
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: errorMessage
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const isDisabled = isGenerating || parentLoading;

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] p-0">
      <DialogHeader className="p-6 pb-0">
        <DialogTitle className="text-xl flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Document Review
        </DialogTitle>
      </DialogHeader>

      <div className="flex-1 px-6 py-4 overflow-y-auto" style={{ height: 'calc(90vh - 200px)' }}>
        {errors.length > 0 && (
          <div className="mb-6">
            <Card className="bg-red-50 border-red-200 p-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <h4 className="font-medium">Please fix the following issues:</h4>
              </div>
              <ul className="mt-2 space-y-1 text-sm text-red-600 list-disc pl-5">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </Card>
          </div>
        )}

        <section className="space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-4">Basic Information</h3>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Document Type:</span>
                <Badge variant="secondary" className="text-base">
                  {documentTypeUtils.toDisplayName(documentType)}
                </Badge>
              </div>
            </Card>
          </div>

          {hasParties && (
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Parties
              </h3>
              <div className="grid gap-4">
                {documentData.parties.map((party, index) => (
                  <Card key={party.id || index} className="p-4 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">
                          {party.name || `Party ${index + 1}`}
                        </h4>
                        {party.email && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Mail className="h-4 w-4" />
                            {party.email}
                          </div>
                        )}
                      </div>
                      <Badge variant="outline">
                        <Building2 className="h-3 w-3 mr-1" />
                        {party.type}
                      </Badge>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                        <div className="flex-1 text-sm">
                          {formatAddress(party.address)}
                        </div>
                      </div>
                      {party.jurisdiction && (
                        <div className="text-sm pl-6">
                          <span className="text-muted-foreground">Jurisdiction:</span>{' '}
                          {party.jurisdiction}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Document Details
            </h3>
            <Card className="divide-y">
              {Object.entries(documentData.variables).map(([key, value]) => (
                <div key={key} className="p-4">
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                  <div className="text-sm">
                    {formatValue(key, value)}
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </section>
      </div>

      <DialogFooter className="p-6 border-t mt-auto">
        <div className="flex items-center justify-between w-full gap-4">
          <span className="text-sm text-muted-foreground">
            Review your document details before generation
          </span>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose} disabled={isDisabled}>
              Back to Edit
            </Button>
            <Button 
              onClick={handleGenerate} 
              disabled={isDisabled || errors.length > 0}
              className="min-w-[140px]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Document'
              )}
            </Button>
          </div>
        </div>
      </DialogFooter>
    </DialogContent>
  );
}