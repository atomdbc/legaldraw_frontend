'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { use } from 'react';
import { useDocument } from '@/hooks/useDocument';
import { usePayment } from '@/hooks/usePayment';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

// Components
import { Button } from '@/components/ui/button';

import { Badge } from '@/components/ui/badge';
import DocumentEditor from '@/components/documents/editor/DocumentEditor';
import { UpgradePlanModal } from '@/app/settings/modals/UpgradePlanModal';

// Icons
import { 
  FileText, 
  Download, 
  AlertCircle, 
  Eye, 
  Edit2, 
  ChevronLeft,
  Settings,
  Printer,
  CheckCircle 
} from 'lucide-react';

// Types and Utils
import type { DocumentContentResponse } from '@/types/document';
import { DocumentApiError } from '@/lib/api/document';
import { PlanType, Currency, BillingCycle } from '@/types/enums';
import type { PaymentCreateRequest } from '@/types/payment';
import { cn } from '@/lib/utils';

interface DocumentPageProps {
  params: Promise<{ id: string }>;
}

const LoadingSkeleton = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin h-8 w-8 border-3 border-primary rounded-full border-t-transparent" />
      <p className="text-sm text-muted-foreground">Loading document...</p>
    </div>
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4">
    <FileText className="h-12 w-12 text-gray-400 mb-2" />
    <h1 className="text-lg font-semibold mb-1 text-center">{message}</h1>
    <Button 
      variant="outline" 
      size="sm" 
      onClick={() => window.history.back()}
      className="mt-4"
    >
      <ChevronLeft className="mr-1 h-4 w-4" /> Back
    </Button>
  </div>
);

export default function DocumentPage({ params }: DocumentPageProps) {
  const resolvedParams = use(params);
  const documentId = resolvedParams.id;
  const { toast } = useToast();
  
  // Hooks
  const { createPayment, getPlans } = usePayment();
  const { 
    getDocument, 
    getDocumentContent, 
    isLoading,
    downloadDocument,
    isDownloading,
    clearDownloadError
  } = useDocument();

  // State
  const [document, setDocument] = useState<DocumentContentResponse | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('preview');
  const [error, setError] = useState<DocumentApiError | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [downloadError, setDownloadError] = useState<{
    reason: string;
    message: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const previewIframeRef = useRef<HTMLIFrameElement>(null);

  // Payment Handlers
  const handlePerDocumentPayment = async () => {
    setIsProcessingPayment(true);
    try {
      const plans = await getPlans();
      const perDocumentPlan = plans.find(p => p.name === PlanType.PER_DOCUMENT);
      
      if (!perDocumentPlan) {
        throw new Error('Per-document plan not found');
      }

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
      } else {
        throw new Error('No payment link received');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: error.response?.data?.message || error.message || "Failed to process payment"
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Document Handlers
  const handleDownload = useCallback(async () => {
    if (!documentId) return;
    
    try {
      await downloadDocument(documentId, { suppressToast: true });
    } catch (error: any) {
      const errorResponse = error?.response?.data || error?.error?.detail || error;
      
      if (errorResponse) {
        setDownloadError({
          reason: errorResponse.reason || 'No active plan',
          message: 'Choose an option to access this document:'
        });
      }
    }
  }, [documentId, downloadDocument]);

  const handleSave = async (newContent: string) => {
    setIsSaving(true);
    try {
      setContent(newContent);
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save Error",
        description: "Failed to save document changes"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    if (!content) return;
  
    // Create a new window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Document</title>
            <style>
              @page {
                margin: 0.5in;
                size: auto;
              }
              body {
                margin: 0;
                padding: 0;
                background: white;
                font-family: "Times New Roman", Times, serif;
              }
              .page {
                width: 100%;
                margin: 0 auto;
                padding: 0;
                box-shadow: none;
              }
              @media print {
                body {
                  padding: 0 !important;
                  margin: 0 !important;
                }
                .page {
                  margin: 0 !important;
                  padding: 0 !important;
                  box-shadow: none !important;
                }
                * {
                  -webkit-print-color-adjust: exact !important;
                  color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
              }
            </style>
          </head>
          <body>
            ${content}
          </body>
        </html>
      `);
      printWindow.document.close();
  
      // Wait for content to load before printing
      printWindow.onload = function() {
        printWindow.focus();
        printWindow.print();
        // Close the window after printing
        setTimeout(() => {
          printWindow.close();
        }, 1000);
      };
    }
  };
  // Style iframe content
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
              padding: 24px 32px;
              box-sizing: border-box;
              width: 100%;
              max-width: 100%;
              overflow-x: hidden !important;
              background-color: white;
              scroll-behavior: smooth;
            }
            .page {
              width: 100% !important;
              max-width: 1400px !important;
              margin: 0 auto !important;
              box-shadow: none !important;
              padding: 0 !important;
              margin-bottom: 2rem !important;
              scroll-margin-top: 2rem;
            }
            @media (min-width: 1600px) {
              .page {
                max-width: 1600px !important;
              }
            }
            p, ul, ol {
              line-height: 1.6;
              margin-bottom: 1em;
            }
            @media print {
              @page {
                margin: 0.5in;
              }
              body {
                padding: 0 !important;
                margin: 0 !important;
              }
              .page {
                margin: 0 !important;
                padding: 0 !important;
                box-shadow: none !important;
                max-width: none !important;
              }
              * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          `;
          doc.head.appendChild(style);
        }
      };
    }
  }, [content]);

  // Load document data
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const doc = await getDocument(documentId);
        setDocument(doc ?? null);
        
        const contentResponse = await getDocumentContent(documentId);
        setContent(contentResponse?.content || '');
      } catch (err: any) {
        setError(err);
      }
    };

    if (documentId) {
      fetchDocument();
    }
  }, [documentId]);

  if (isLoading && !document) return <LoadingSkeleton />;

  if (error) {
    return (
      <ErrorDisplay 
        message={error.error.status === 404 ? 'Document Not Found' : 'Error Loading Document'} 
      />
    );
  }

  if (!document) return <LoadingSkeleton />;

  const documentStatus = (document.status?.toLowerCase() || 'draft') as 'draft' | 'pending' | 'completed';
  const statusColors = {
    draft: 'bg-gray-100 text-gray-700',
    pending: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700'
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Smart Template Notice */}
      <div className="bg-primary/5 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-primary">Smart Template</p>
                <p className="text-sm text-muted-foreground">
                  This document adapts to your needs. Review and customize before downloading.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="flex-none bg-white border-b px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="hover:bg-gray-100"
              onClick={() => window.history.back()}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold">{document.document_type}</h1>
              <Badge 
                className={cn(
                  "px-2 py-0.5 text-sm capitalize",
                  statusColors[documentStatus]
                )}
              >
                {documentStatus}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Created {format(new Date(document.generated_at), 'MMM d, yyyy')}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
          {document.document_type?.toLowerCase().includes('quick') ? (
  <Button
    variant="outline"
    size="sm"
    onClick={handlePrint}
    className="min-w-[120px]"
  >
    <Printer className="h-4 w-4 mr-2" />
    Print
  </Button>
) : (
  <Button
    variant="outline"
    size="sm"
    onClick={handleDownload}
    disabled={isDownloading}
    className="min-w-[120px]"
  >
    <Download className="h-4 w-4 mr-2" />
    {isDownloading ? 'Downloading...' : 'Download'}
  </Button>
)}
  <Button
    variant="outline"
    size="sm"
    onClick={() => window.location.href = '/settings'}
  >
    <Settings className="h-4 w-4 mr-2" />
    Settings
  </Button>
</div>
        </div>
      </header>

      {/* Payment Alert */}
      {downloadError && (
        <div className="border-b bg-white/90 backdrop-blur-sm shadow-sm">
          <div className="max-w-7xl mx-auto p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Payment Required</h3>
                  <p className="text-sm text-muted-foreground">{downloadError.message}</p>
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
                  onClick={() => window.location.href = '/settings'}
                  className="bg-primary hover:bg-primary/90"
                >
                  Upgrade Plan
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => clearDownloadError?.()}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    {/* View/Edit Navigation */}
<div className="bg-white border-b px-6 py-3">
  <div className="max-w-7xl mx-auto flex items-center justify-between">
    <div className="flex items-center gap-4">
      <Button
        variant={activeTab === 'preview' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setActiveTab('preview')}
        className="gap-2"
      >
        <Eye className="h-4 w-4" />
        Preview
      </Button>
      <Button
        variant={activeTab === 'edit' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setActiveTab('edit')}
        className="gap-2"
      >
        <Edit2 className="h-4 w-4" />
        Edit Document
      </Button>
      {activeTab === 'edit' && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-white rounded-lg shadow-lg border p-4 max-w-sm animate-in fade-in slide-in-from-right-5 duration-300">
            <div className="flex items-center gap-2 mb-3">
              <Edit2 className="h-4 w-4 text-primary" />
              <h4 className="font-medium text-sm">How to Edit</h4>
            </div>
            <ul className="text-sm text-muted-foreground space-y-3">
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 mt-1">
                  <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full"></span>
                </span>
                <span>Click directly on any text in the document body to edit content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 mt-1">
                  <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full"></span>
                </span>
                <span>Click anywhere in the cover page area to modify the document title</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 mt-1">
                  <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full"></span>
                </span>
                <span>All changes are saved automatically as you type</span>
              </li>
            </ul>
            {showSaveSuccess && (
              <div className="mt-3 pt-3 border-t flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                Changes saved successfully
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  </div>
</div>
      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'preview' ? (
          <div className="absolute inset-0">
            {content ? (
              <iframe
              ref={previewIframeRef}
              srcDoc={content}
              title="Document Preview"
              className="w-full h-full border-0 bg-white"
              sandbox="allow-same-origin allow-modals allow-popups allow-scripts"
            />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No content available</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="absolute inset-0">
            <DocumentEditor
              content={content || ''}
              documentId={documentId}
              documentType={document?.document_type}
              version={document?.version}
              onSave={handleSave}
            />
          </div>
        )}
      </div>

      {/* Floating Edit Button in Preview Mode */}
      {activeTab === 'preview' && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="flex flex-col items-end gap-3">
            <div className="bg-white rounded-lg shadow-lg border p-4 max-w-xs">
              <h4 className="font-medium mb-2 flex items-center text-sm">
                <span className="inline-block w-2 h-2 bg-primary rounded-full mr-2"></span>
                Smart Template
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                This document can be customized to match your specific requirements.
              </p>
              <Button
                size="sm"
                className="w-full gap-2"
                onClick={() => setActiveTab('edit')}
              >
                <Edit2 className="h-4 w-4" />
                Customize Document
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      <UpgradePlanModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        currentPlan={null}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
}