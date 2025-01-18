'use client';

import { useState, useEffect, useRef } from 'react';
import { DocumentWizard } from '@/components/documents/wizard/DocumentWizard';
import { DocumentPreviewPanel } from '@/components/documents/preview/DocumentPreviewPanel';
import { ShareModal } from '@/components/documents/preview/ShareModal';
import { useToast } from '@/hooks/use-toast';
import { useWizardNavigation } from '@/hooks/useWizardNavigation';
import { useDocumentProgress } from '@/hooks/useDocumentProgress';
import { useDocument } from '@/hooks/useDocument';
import { useRouter } from 'next/navigation';
import { documentApi } from '@/lib/api/document';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Download } from 'lucide-react';
import { usePayment } from '@/hooks/usePayment';
import { PlanType, Currency, BillingCycle } from '@/types/enums';
import type { PaymentCreateRequest } from '@/types/payment';


interface PreviewClientProps {
  documentType: string;
  documentId?: string;
}

export function PreviewClient({ documentType, documentId }: PreviewClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: progressData } = useDocumentProgress();
  const { navigateBack } = useWizardNavigation(documentType);
  const [isLoading, setIsLoading] = useState(true);
  const [documentContent, setDocumentContent] = useState<any>(null);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const { downloadDocument, isDownloading, downloadError, clearDownloadError } = useDocument();
  const { createPayment, getPlans } = usePayment();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  const handlePerDocumentPayment = async () => {
    setIsProcessingPayment(true);
    try {
      const plans = await getPlans();
      const perDocumentPlan = plans.find(p => p.name === PlanType.PER_DOCUMENT);
      
      if (!perDocumentPlan) throw new Error('Per-document plan not found');
  
      const paymentData: PaymentCreateRequest = {
        amount: 2,
        currency: Currency.USD,
        plan_id: perDocumentPlan.id,
        payment_type: 'one_time',
        payment_metadata: {
          document_id: documentId,
          plan_name: PlanType.PER_DOCUMENT,
          billing_cycle: BillingCycle.PER_DOCUMENT,
          currency_code: Currency.USD,
          original_amount: 2
        }
      };
  
      const response = await createPayment(paymentData);
      if (response?.payment_metadata?.payment_link) {
        toast({
          title: "Payment Initiated",
          description: "Redirecting to payment gateway..."
        });
        window.location.href = response.payment_metadata.payment_link;
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: error.message || "Failed to process payment"
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };
  
  const handleUsagePayment = async () => {
    setIsProcessingPayment(true);
    try {
      const plans = await getPlans();
      const usagePlan = plans.find(p => p.name === PlanType.USAGE_BASED);
      
      if (!usagePlan) throw new Error('Usage plan not found');
  
      const paymentData: PaymentCreateRequest = {
        amount: 2,
        currency: Currency.USD,
        plan_id: usagePlan.id,
        payment_type: 'one_time',
        payment_metadata: {
          document_id: documentId,
          plan_name: PlanType.USAGE_BASED,
          billing_cycle: BillingCycle.USAGE_BASED,
          currency_code: Currency.USD,
          original_amount: 2
        }
      };
  
      const response = await createPayment(paymentData);
      if (response?.payment_metadata?.payment_link) {
        toast({
          title: "Payment Initiated",
          description: "Redirecting to payment gateway..."
        });
        window.location.href = response.payment_metadata.payment_link;
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: error.message || "Failed to process payment"
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  
  useEffect(() => {
    const loadDocument = async () => {
      if (!documentId) {
        setIsLoading(false);
        return;
      }

      try {
        const doc = await documentApi.getDocumentContent(documentId);
        setDocumentContent(doc);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load document content"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDocument();
  }, [documentId, toast]);

  useEffect(() => {
    const iframe = previewIframeRef.current;
    if (iframe?.contentWindow) {
      iframe.onload = () => {
        const doc = iframe.contentDocument;
        if (doc) {
          const style = doc.createElement('style');
          style.textContent = `
            body {
              margin: 0;
              padding: 24px;
              box-sizing: border-box;
              max-width: 1000px; /* Increased from 800px */
              margin: 0 auto;
              overflow-x: hidden !important;
            }
            .page {
              width: 100% !important;
              margin: 0 auto !important;
              box-shadow: none !important;
              padding: 0 !important;
            }
            /* Add better typography */
            p, ul, ol {
              line-height: 1.6;
              margin-bottom: 1em;
            }
          `;
          doc.head.appendChild(style);
        }
      };
    }
  }, [documentContent]);

  const handleBack = () => {
    const prevRoute = navigateBack('preview');
    if (prevRoute) {
      router.push(prevRoute);
    }
  };

  const handleDownload = async () => {
    if (!documentId) return;
    
    try {
        // Pass suppressToast to prevent toast error
        await downloadDocument(documentId, { suppressToast: true });
    } catch (error: any) {
        // The hook will handle setting the download error state
        // No need for additional error handling here since we're using the hook's state
        return;
    }
};

  return (
    <DocumentWizard
      currentStepIndex={3}
      onBack={handleBack}
      allowNext={false}
      documentType={documentType}
    >
      {downloadError && (
  <div className="border-b bg-white/80 backdrop-blur-sm">
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-black/5 flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-gray-900" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Access Required</h3>
            <p className="text-sm text-gray-600">{downloadError.message}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handlePerDocumentPayment}
            disabled={isProcessingPayment}
            className="min-w-[160px]"
          >
            {isProcessingPayment ? 'Processing...' : 'Pay $2 for this document'}
          </Button>
  
          <Button
            size="sm"
            className="bg-black hover:bg-black/90 text-white"
            onClick={() => window.location.href = '/settings'}
          >
            Upgrade Plan
          </Button>
          <Button variant="ghost" size="sm" onClick={() => clearDownloadError?.()}>
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  </div>
)}
      <div className="h-full grid grid-cols-[160px_1fr] gap-2">
        <DocumentPreviewPanel
          content={documentContent?.content || progressData?.data?.content || ''}
          onPageChange={(pageNumber) => console.log(`Page ${pageNumber}`)}
          previewIframeRef={previewIframeRef}
        />
        <div className="flex flex-col">
          <div className="flex items-center justify-end gap-2 mb-2">
            <ShareModal documentId={documentId || ''} />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownload}
              disabled={isDownloading}
            >
              <Download className="h-4 w-4 mr-2" />
              {isDownloading ? 'Downloading...' : 'Download'}
            </Button>
          </div>
          <Card className="flex-1 h-full overflow-hidden bg-white">
            <iframe
              ref={previewIframeRef}
              srcDoc={documentContent?.content || progressData?.data?.content}
              className="w-full h-full border-0"
              title="Document Preview"
              style={{
                display: 'block',
                backgroundColor: 'white'
              }}
            />
          </Card>
        </div>
      </div>
    </DocumentWizard>
  );
}