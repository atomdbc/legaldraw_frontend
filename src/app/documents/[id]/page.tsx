'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { use } from 'react';
import { useDocument } from '@/hooks/useDocument';
import type { DocumentContentResponse } from '@/types/document';
import { FileText, ArrowLeft, Download, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentApiError } from '@/lib/api/document';
import { cn } from '@/lib/utils';
import DocumentEditor from '@/components/documents/editor/DocumentEditor';



interface DocumentPageProps {
  params: Promise<{ id: string }>;
}

const LoadingSkeleton = () => (
  <div className="w-full p-4 space-y-4">
    <Skeleton className="h-[calc(100vh-12rem)] w-full" />
  </div>
);

export default function DocumentPage({ params }: DocumentPageProps) {
  const resolvedParams = use(params);
  const documentId = resolvedParams.id;
  
  const { 
    getDocument, 
    getDocumentContent, 
    isLoading,
    downloadDocument, // Add the download hook
    isDownloading ,
    clearDownloadError
  } = useDocument();
  const [document, setDocument] = useState<DocumentContentResponse | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('preview');
  const [error, setError] = useState<DocumentApiError | null>(null);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const [downloadError, setDownloadError] = useState<{
    reason: string;
    message: string;
  } | null>(null);

  const handleDownload = useCallback(async () => {
    if (!documentId) return;
    
    try {
        // We'll pass a flag to indicate we don't want toast errors
        await downloadDocument(documentId, { suppressToast: true });
    } catch (error: any) {
        // No need to log error to console to keep things clean
        const errorResponse = error?.response?.data || error?.error?.detail || error;
        
        // Only set the banner error
        if (errorResponse) {
            setDownloadError({
                reason: errorResponse.reason || 'No active plan',
                message: errorResponse.message || 'Unable to download document. Please check your plan limits.'
            });
        }
    }
 }, [documentId, downloadDocument]);
  

  const handleSave = async (newContent: string) => {
    setContent(newContent);
    // Add your save logic here
  };

  const fetchDocument = async () => {
    try {
      const doc = await getDocument(documentId);
      setDocument(doc ?? null);
      
      const contentResponse = await getDocumentContent(documentId);
      const baseContent = contentResponse?.content || '';
      setContent(baseContent);
    } catch (err: any) {
      setError(err);
    }
  };

  useEffect(() => {
    fetchDocument();
  }, [documentId]);

  if (isLoading && !document) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <FileText className="h-12 w-12 text-gray-400 mb-2" />
        <h1 className="text-lg font-semibold mb-1 text-center">
          {error.error.status === 404 ? 'Document Not Found' : 'Error Loading Document'}
        </h1>
        <Button asChild variant="outline" size="sm">
          <a href="/documents"><ArrowLeft className="mr-1 h-4 w-4" /> Back</a>
        </Button>
      </div>
    );
  }

  if (!document) return <LoadingSkeleton />;

  type DocumentStatus = 'draft' | 'pending' | 'completed';
  const documentStatus = (document.status?.toLowerCase() || 'draft') as DocumentStatus;
  const statusColors: Record<DocumentStatus, string> = {
    draft: 'bg-gray-100 text-gray-700',
    pending: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700'
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50/50">
      <header className="flex-none bg-white border-b px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <a href="/documents"><ArrowLeft className="h-4 w-4" /></a>
            </Button>
            <div className="flex items-center gap-2 min-w-0">
              <h1 className="text-lg font-semibold truncate">{document.document_type}</h1>
              <Badge className={cn("flex-shrink-0", statusColors[documentStatus])} variant="secondary">
                {documentStatus}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {format(new Date(document.generated_at), 'MMM d, yyyy')}
              </span>
            </div>
          </div>
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
      </header>
      {downloadError && (
  <div className="fixed inset-x-0 top-16 z-50">
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-medium text-red-600">
                Subscription Required
              </h3>
              <p className="text-sm text-gray-600">
                {downloadError.message}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => window.location.href = '/settings'}
            >
              Upgrade Plan
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDownloadError(null)}
            >
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
      <div className="flex-1 overflow-hidden">
        <Card className="h-full w-full rounded-none border-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="flex-none border-b px-4">
              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="edit">Edit</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 min-h-0 relative">
              <TabsContent value="preview" className="absolute inset-0 !m-0 !p-0">
                {content ? (
                  <iframe
                    ref={previewIframeRef}
                    srcDoc={content}
                    title="Document Preview"
                    className="w-full h-full border-0"
                    sandbox="allow-same-origin"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FileText className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="edit" className="absolute inset-0 !m-0">
                <DocumentEditor
                  content={content || ''}
                  documentId={documentId}
                  documentType={document.document_type}
                  version={document.version}
                  onSave={handleSave}
                />
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}