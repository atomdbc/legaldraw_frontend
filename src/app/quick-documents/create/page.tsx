'use client';

import { useState, useEffect } from 'react';
import { useQuickDocument } from '@/hooks/useQuickDocument';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { StepIndicator } from '@/components/quick-documents/StepIndicator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ArrowLeft, Loader2, Plus, Trash2, AlertCircle, FileText } from 'lucide-react';
import type { QuickDocumentRequest } from '@/types/quickDocument';
import Cookies from 'js-cookie';

interface ProgressData {
  currentStep: number;
  basicInfo: any;
  parties: Array<{
    name: string;
    title: string;
    company: string;
  }>;
  terms: any;
  documentType: string;
  serviceDetails?: any;
  employmentDetails?: any;
}

function getStepsForType(type: string) {
  switch (type) {
    case 'QUICK_SERVICE':
      return ['Basic Info', 'Parties', 'Service Details', 'Terms'];
    case 'QUICK_EMPLOYMENT':
      return ['Basic Info', 'Parties', 'Employment Details', 'Terms'];
    default: // QUICK_NDA
      return ['Basic Info', 'Parties', 'Terms'];
  }
}

function LimitReachedDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Monthly Limit Reached
          </DialogTitle>
          <DialogDescription>
            You've reached your monthly document generation limit. Upgrade your plan to continue generating documents and access more features.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:justify-start">
          <Button variant="default" onClick={() => router.push('/settings')}>
            View Plans
          </Button>
          <Button variant="outline" onClick={onClose}>
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function QuickDocumentCreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawType = searchParams.get('type')?.toLowerCase() || 'nda';
  const documentType = `QUICK_${rawType.toUpperCase()}`;
  const { generateDocument, isLoading } = useQuickDocument();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const STEPS = getStepsForType(documentType);

  // Validate document type
  useEffect(() => {
    const validRawTypes = ['nda', 'service', 'employment'];
    const validTypes = ['QUICK_NDA', 'QUICK_SERVICE', 'QUICK_EMPLOYMENT'];
    
    const rawType = searchParams.get('type')?.toLowerCase();
    if (!rawType || !validRawTypes.includes(rawType)) {
      toast({
        title: "Invalid Document Type",
        description: "Please select a valid document type.",
        variant: "destructive"
      });
      router.push('/documents');
      return;
    }
    
    if (!validTypes.includes(documentType)) {
      console.error(`Invalid document type mapping: ${rawType} -> ${documentType}`);
      router.push('/documents');
    }
  }, [documentType, searchParams, router, toast]);

  // State for different document types
  const [basicInfo, setBasicInfo] = useState({
    effective_date: new Date().toISOString().split('T')[0],
    purpose: ''
  });

  const [parties, setParties] = useState([
    { name: '', title: '', company: '' },
    { name: '', title: '', company: '' }
  ]);

  const [serviceDetails, setServiceDetails] = useState({
    compensation_terms: '',
    payment_terms: '',
    service_description: '',
    service_duration: '',
    deliverables: ''
  });

  const [employmentDetails, setEmploymentDetails] = useState({
    position_title: '',
    salary: '',
    employment_type: 'full-time',
    start_date: '',
    work_location: '',
    reporting_to: '',
    work_hours: '',
    benefits: ''
  });

  const [terms, setTerms] = useState({
    duration: '',
    governing_law: '',
    termination_notice: '',
    dispute_resolution: ''
  });

  // Effects for saving/loading progress
  useEffect(() => {
    const savedProgress = Cookies.get('quick_document_progress');
    if (savedProgress) {
      try {
        const progress: ProgressData = JSON.parse(savedProgress);
        if (progress.documentType === documentType) {
          setCurrentStep(progress.currentStep);
          setBasicInfo(progress.basicInfo);
          setParties(progress.parties);
          setTerms(progress.terms);
          if (documentType === 'QUICK_SERVICE' && progress.serviceDetails) {
            setServiceDetails(progress.serviceDetails);
          }
          if (documentType === 'QUICK_EMPLOYMENT' && progress.employmentDetails) {
            setEmploymentDetails(progress.employmentDetails);
          }
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    }
  }, [documentType]);

  useEffect(() => {
    const progress: ProgressData = {
      currentStep,
      basicInfo,
      parties,
      terms,
      documentType,
      ...(documentType === 'QUICK_SERVICE' && { serviceDetails }),
      ...(documentType === 'QUICK_EMPLOYMENT' && { employmentDetails })
    };
    Cookies.set('quick_document_progress', JSON.stringify(progress), { expires: 7 });
  }, [currentStep, basicInfo, parties, terms, documentType, serviceDetails, employmentDetails]);

  // Helper functions
  const addParty = () => setParties([...parties, { name: '', title: '', company: '' }]);
  const removeParty = (index: number) => {
    if (parties.length > 2) {
      setParties(parties.filter((_, i) => i !== index));
    }
  };
  const updateParty = (index: number, field: string, value: string) => {
    const newParties = [...parties];
    newParties[index] = { ...newParties[index], [field]: value };
    setParties(newParties);
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        if (!basicInfo.effective_date.trim()) {
          toast({
            title: "Required Field",
            description: "Please enter the effective date - this is required for the agreement to be valid",
            variant: "destructive"
          });
          return false;
        }
        break;
  
      case 2:
        const invalidParty = parties.find(p => !p.name.trim() || !p.company.trim());
        if (invalidParty) {
          toast({
            title: "Required Fields",
            description: "Please fill in name and company for all parties",
            variant: "destructive"
          });
          return false;
        }
        break;
  
      case 3:
        if (documentType === 'QUICK_SERVICE') {
          if (!serviceDetails.compensation_terms.trim() || !serviceDetails.service_description.trim()) {
            toast({
              title: "Required Fields",
              description: "Please fill in all service details",
              variant: "destructive"
            });
            return false;
          }
        } else if (documentType === 'QUICK_EMPLOYMENT') {
          if (!employmentDetails.position_title.trim() || 
              !employmentDetails.salary.trim() || 
              !employmentDetails.start_date.trim()) {  // Make start_date required for employment
            toast({
              title: "Required Fields",
              description: "Please fill in all required employment details including start date",
              variant: "destructive"
            });
            return false;
          }
        }
        break;
  
      case 4:
        if (!terms.governing_law.trim()) {
          toast({
            title: "Required Fields",
            description: "Please fill in governing law",
            variant: "destructive"
          });
          return false;
        }
        break;
    }
    return true;
  };
  

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    try {
      let variables = {
        ...basicInfo,
        ...terms,
        parties: parties,
      };

      if (documentType === 'QUICK_SERVICE') {
        variables = { ...variables, ...serviceDetails };
      } else if (documentType === 'QUICK_EMPLOYMENT') {
        variables = { ...variables, ...employmentDetails };
      }

      const documentData: QuickDocumentRequest = {
        template_type: documentType,
        variables,
        country_code: 'US',
        metadata: {
          party_count: parties.length,
          created_at: new Date().toISOString()
        }
      };

      const document = await generateDocument(documentData);
      
      if (document) {
        Cookies.remove('quick_document_progress');
        toast({
          title: "Success",
          description: "Your document has been generated successfully.",
          variant: "default"
        });
        router.push(`/documents/${document.document_id}`);
      }
    } catch (error: any) {
      if (error.message?.includes('Monthly generation limit reached')) {
        setShowLimitDialog(true);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to generate document",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/5">
      <div className="bg-background border-b">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">
                {documentType === 'QUICK_SERVICE' 
                  ? 'Quick Service Agreement Generator'
                  : documentType === 'QUICK_EMPLOYMENT'
                  ? 'Quick Employment Agreement Generator'
                  : 'Quick NDA Generator'}
              </h1>
              <p className="text-sm text-muted-foreground">
                Create your document in minutes
              </p>
            </div>
          </div>
        </div>
      </div>
  
      <div className="container py-8">
        <StepIndicator currentStep={currentStep} steps={STEPS} />
  
        <Card className="max-w-2xl mx-auto p-6">
          {isLoading ? (
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
          ) : (
            <>
              {/* Basic Info Step */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium">Basic Information</h2>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="effective_date">
                          When should this agreement start? <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="effective_date"
                          type="date"
                          required
                          value={basicInfo.effective_date}
                          onChange={(e) => setBasicInfo(prev => ({ 
                            ...prev, 
                            effective_date: e.target.value 
                          }))}
                        />
                      </div>
  
                      {documentType === 'QUICK_SERVICE' ? (
                        <div className="space-y-2">
                          <Label htmlFor="purpose">Describe the services to be provided</Label>
                          <Textarea
                            id="purpose"
                            placeholder="e.g., Development of custom software solution..."
                            value={basicInfo.purpose}
                            onChange={(e) => setBasicInfo(prev => ({ 
                              ...prev, 
                              purpose: e.target.value 
                            }))}
                          />
                        </div>
                      ) : documentType === 'QUICK_EMPLOYMENT' ? (
                        <div className="space-y-2">
                          <Label htmlFor="purpose">Position Description</Label>
                          <Textarea
                            id="purpose"
                            placeholder="e.g., Role responsibilities and requirements..."
                            value={basicInfo.purpose}
                            onChange={(e) => setBasicInfo(prev => ({ 
                              ...prev, 
                              purpose: e.target.value 
                            }))}
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label htmlFor="purpose">What's the purpose of this NDA?</Label>
                          <Textarea
                            id="purpose"
                            placeholder="e.g., Discussing potential business partnership..."
                            value={basicInfo.purpose}
                            onChange={(e) => setBasicInfo(prev => ({ 
                              ...prev, 
                              purpose: e.target.value 
                            }))}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
  
              {/* Parties Step */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium">Who's involved?</h2>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={addParty}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Party
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {parties.map((party, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-4">
                        <div className="flex justify-between">
                          <h3 className="font-medium">Party {index + 1}</h3>
                          {parties.length > 2 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeParty(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input
                              value={party.name}
                              onChange={(e) => updateParty(index, 'name', e.target.value)}
                              placeholder="John Doe"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Title</Label>
                              <Input
                                value={party.title}
                                onChange={(e) => updateParty(index, 'title', e.target.value)}
                                placeholder="CEO"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Company</Label>
                              <Input
                                value={party.company}
                                onChange={(e) => updateParty(index, 'company', e.target.value)}
                                placeholder="Acme Inc."
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
  
              {/* Service Agreement Details Step */}
              {currentStep === 3 && documentType === 'QUICK_SERVICE' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-medium">Service Details</h2>
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <Label>Service Scope</Label>
                      <Textarea
                        value={serviceDetails.service_description}
                        onChange={(e) => setServiceDetails(prev => ({ 
                          ...prev, 
                          service_description: e.target.value 
                        }))}
                        placeholder="Detailed description of services to be provided..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Compensation Terms</Label>
                      <Input
                        value={serviceDetails.compensation_terms}
                        onChange={(e) => setServiceDetails(prev => ({ 
                          ...prev, 
                          compensation_terms: e.target.value 
                        }))}
                        placeholder="e.g., $5,000 per month"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Payment Terms</Label>
                      <Input
                        value={serviceDetails.payment_terms}
                        onChange={(e) => setServiceDetails(prev => ({ 
                          ...prev, 
                          payment_terms: e.target.value 
                        }))}
                        placeholder="e.g., Net 30 days"
                      />
                    </div>
  
                    <div className="space-y-2">
                      <Label>Service Duration</Label>
                      <Input
                        value={serviceDetails.service_duration}
                        onChange={(e) => setServiceDetails(prev => ({ 
                          ...prev, 
                          service_duration: e.target.value 
                        }))}
                        placeholder="e.g., 6 months"
                      />
                    </div>
  
                    <div className="space-y-2">
                      <Label>Deliverables</Label>
                      <Textarea
                        value={serviceDetails.deliverables}
                        onChange={(e) => setServiceDetails(prev => ({ 
                          ...prev, 
                          deliverables: e.target.value 
                        }))}
                        placeholder="List of specific deliverables..."
                      />
                    </div>
                  </div>
                </div>
              )}
  
              {/* Employment Agreement Details Step */}
              {currentStep === 3 && documentType === 'QUICK_EMPLOYMENT' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-medium">Employment Details</h2>
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <Label>Position Title</Label>
                      <Input
                        value={employmentDetails.position_title}
                        onChange={(e) => setEmploymentDetails(prev => ({ 
                          ...prev, 
                          position_title: e.target.value 
                        }))}
                        placeholder="e.g., Senior Software Engineer"
                      />
                    </div>
  
                    <div className="space-y-2">
                      <Label>Employment Type</Label>
                      <Select
                        value={employmentDetails.employment_type}
                        onValueChange={(value) => setEmploymentDetails(prev => ({
                          ...prev,
                          employment_type: value
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full Time</SelectItem>
                          <SelectItem value="part-time">Part Time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
  
                    <div className="space-y-2">
                      <Label>Salary</Label>
                      <Input
                        value={employmentDetails.salary}
                        onChange={(e) => setEmploymentDetails(prev => ({ 
                          ...prev, 
                          salary: e.target.value 
                        }))}
                        placeholder="e.g., $120,000 per year"
                      />
                    </div>
  
                    <div className="space-y-2">
                      <Label>
                        Start Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="date"
                        required
                        value={employmentDetails.start_date}
                        onChange={(e) => setEmploymentDetails(prev => ({ 
                          ...prev, 
                          start_date: e.target.value 
                        }))}
                      />
                    </div>
  
                    <div className="space-y-2">
                      <Label>Work Location</Label>
                      <Input
                        value={employmentDetails.work_location}
                        onChange={(e) => setEmploymentDetails(prev => ({ 
                          ...prev, 
                          work_location: e.target.value 
                        }))}
                        placeholder="e.g., San Francisco, CA"
                      />
                    </div>
  
                    <div className="space-y-2">
                      <Label>Reporting To</Label>
                      <Input
                        value={employmentDetails.reporting_to}
                        onChange={(e) => setEmploymentDetails(prev => ({ 
                          ...prev, 
                          reporting_to: e.target.value 
                        }))}
                        placeholder="e.g., Director of Engineering"
                      />
                    </div>
  
                    <div className="space-y-2">
                      <Label>Work Hours</Label>
                      <Input
                        value={employmentDetails.work_hours}
                        onChange={(e) => setEmploymentDetails(prev => ({ 
                          ...prev, 
                          work_hours: e.target.value 
                        }))}
                        placeholder="e.g., Monday-Friday, 9 AM - 5 PM"
                      />
                    </div>
  
                    <div className="space-y-2">
                      <Label>Benefits</Label>
                      <Textarea
                        value={employmentDetails.benefits}
                        onChange={(e) => setEmploymentDetails(prev => ({ 
                          ...prev, 
                          benefits: e.target.value 
                        }))}
                        placeholder="List of benefits provided..."
                      />
                    </div>
                  </div>
                </div>
              )}
  
              {/* Terms Step */}
              {(currentStep === 3 || currentStep === 4) && (
                <div className="space-y-6">
                  <h2 className="text-lg font-medium">Terms & Conditions</h2>
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Input
                      value={terms.duration}
                      onChange={(e) => setTerms(prev => ({ 
                        ...prev, 
                        duration: e.target.value 
                      }))}
                      placeholder="e.g., 2 years"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Governing Law</Label>
                    <Input
                      value={terms.governing_law}
                      onChange={(e) => setTerms(prev => ({ 
                        ...prev, 
                        governing_law: e.target.value 
                      }))}
                      placeholder="e.g., California, United States"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Termination Notice Period</Label>
                    <Input
                      value={terms.termination_notice}
                      onChange={(e) => setTerms(prev => ({ 
                        ...prev, 
                        termination_notice: e.target.value 
                      }))}
                      placeholder="e.g., 30 days"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Dispute Resolution</Label>
                    <Textarea
                      value={terms.dispute_resolution}
                      onChange={(e) => setTerms(prev => ({ 
                        ...prev, 
                        dispute_resolution: e.target.value 
                      }))}
                      placeholder="Specify how disputes will be resolved..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={isLoading}
              >
                {currentStep === STEPS.length ? 'Generate Document' : 'Continue'}
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>

    <LimitReachedDialog 
      isOpen={showLimitDialog} 
      onClose={() => setShowLimitDialog(false)} 
    />
  </div>
);
}