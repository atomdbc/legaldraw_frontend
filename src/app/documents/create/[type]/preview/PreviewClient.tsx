'use client';

import { useState, useEffect, useRef } from 'react';
import { DocumentWizard } from '@/components/documents/wizard/DocumentWizard';
import { DocumentPreviewPanel } from '@/components/documents/preview/DocumentPreviewPanel';
import { ShareModal } from '@/components/documents/preview/ShareModal';
import { useToast } from '@/hooks/use-toast';
import { useWizardNavigation } from '@/hooks/useWizardNavigation';
import { useDocumentProgress } from '@/hooks/useDocumentProgress';
import { useRouter } from 'next/navigation';
import { documentApi } from '@/lib/api/document';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

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
    // Add style to iframe once loaded
    const iframe = previewIframeRef.current;
    if (iframe?.contentWindow) {
      iframe.onload = () => {
        const doc = iframe.contentDocument;
        if (doc) {
          // Add styles to ensure content fits and scrolls properly
          const style = doc.createElement('style');
          style.textContent = `
            body {
              margin: 0;
              padding: 16px;
              box-sizing: border-box;
              max-width: 800px;
              margin: 0 auto;
              overflow-x: hidden !important;
            }
            .page {
              width: 100% !important;
              margin: 0 auto !important;
              box-shadow: none !important;
              padding: 0 !important;
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
    // Download logic here
    console.log("Downloading document...");
  };


  return (
    <DocumentWizard
      currentStepIndex={3}
      onBack={handleBack}
      allowNext={false}
      documentType={documentType}
    >
      <div className="h-full grid grid-cols-[160px_1fr] gap-2">
        <DocumentPreviewPanel
          content={documentContent?.content || progressData?.data?.content || ''}
          onPageChange={(pageNumber) => console.log(`Page ${pageNumber}`)}
          previewIframeRef={previewIframeRef}
        />
        <div className="flex flex-col">
          <div className="flex items-center justify-end gap-2 mb-2">
            <ShareModal documentId={documentId || ''} />
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
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