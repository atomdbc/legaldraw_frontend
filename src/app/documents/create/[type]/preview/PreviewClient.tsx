"use client"
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { documentApi } from '@/lib/api/document';
import { useDocument } from '@/hooks/useDocument';
import { usePayment } from '@/hooks/usePayment';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { AlertCircle, Download, ChevronLeft } from 'lucide-react';
import { PlanType, Currency, BillingCycle } from '@/types/enums';
import type { PaymentCreateRequest } from '@/types/payment';

interface PreviewClientProps {
  documentType: string;
  documentId?: string;
}

export function PreviewClient({ documentType, documentId }: PreviewClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [documentContent, setDocumentContent] = useState<any>(null);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const { downloadDocument, isDownloading, downloadError, clearDownloadError } = useDocument();
  const { createPayment, getPlans } = usePayment();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Payment handler
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
        if (typeof window !== 'undefined') {
          window.location.href = response.payment_metadata.payment_link;
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: error.message || "Failed to process payment"
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Load document
  useEffect(() => {
    const loadDocument = async () => {
      if (!documentId) {
        setIsLoading(false);
        return;
      }

      try {
        const doc = await documentApi.getDocumentContent(documentId);
        setDocumentContent(doc);
        
        if (typeof window !== 'undefined') {
          // Count pages by checking div.page elements in content
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = doc.content;
          const pageCount = tempDiv.querySelectorAll('.page').length;
          setTotalPages(pageCount || 1);
        }
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

  // Style iframe content and add page navigation
  useEffect(() => {
    const iframe = previewIframeRef.current;
    if (iframe?.contentWindow) {
      iframe.onload = () => {
        const doc = iframe.contentDocument;
        if (doc) {
          // Add styles
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
          `;
          doc.head.appendChild(style);

          // Add page IDs for navigation
          const pages = doc.querySelectorAll('.page');
          pages.forEach((page, index) => {
            page.id = `page-${index + 1}`;
          });
        }
      };
    }
  }, [documentContent]);

  // Handle page navigation
  const handlePageChange = (pageNum: number) => {
    const iframe = previewIframeRef.current;
    if (iframe?.contentDocument) {
      const targetPage = iframe.contentDocument.getElementById(`page-${pageNum}`);
      if (targetPage) {
        targetPage.scrollIntoView({ behavior: 'smooth' });
        setCurrentPage(pageNum);
      }
    }
  };

  // Handlers
  const handleBack = () => router.back();
  
  const handleDownload = async () => {
    if (!documentId) return;
    try {
      await downloadDocument(documentId, { suppressToast: true });
    } catch (error) {
      return;
    }
  };

  // Thumbnail component
  const Thumbnail = ({ pageNum }: { pageNum: number }) => (
    <button
      onClick={() => handlePageChange(pageNum)}
      className={`w-full p-2 rounded-lg transition-all ${
        currentPage === pageNum 
          ? 'bg-primary/10 ring-1 ring-primary/20' 
          : 'hover:bg-gray-100'
      }`}
    >
      <div className="aspect-[8.5/11] rounded-md border bg-white shadow-sm overflow-hidden">
        <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
          Page {pageNum}
        </div>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Payment Alert */}
      {downloadError && (
        <div className="fixed inset-x-0 top-0 z-50">
          <div className="bg-white border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between gap-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Access Required</h3>
                    <p className="text-sm text-muted-foreground">{downloadError.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handlePerDocumentPayment}
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment ? 'Processing...' : 'Pay $2 for this document'}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.location.href = '/settings';
                      }
                    }}
                  >
                    Upgrade Plan
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearDownloadError}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div className="flex items-center gap-2">
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex min-h-[calc(100vh-4rem)]">
        {/* Thumbnails Sidebar */}
        <aside className="w-32 border-r bg-background">
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="p-2 space-y-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <Thumbnail key={i + 1} pageNum={i + 1} />
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Document Preview */}
        <div className="flex-1 bg-white">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-3 border-primary rounded-full border-t-transparent" />
            </div>
          ) : (
            <iframe
              ref={previewIframeRef}
              srcDoc={documentContent?.content}
              className="w-full h-full border-0"
              title="Document Preview"
            />
          )}
        </div>
      </main>
    </div>
  );
}