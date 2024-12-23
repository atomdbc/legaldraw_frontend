'use client';

import React, { useEffect, useRef, useState } from 'react';
import { use } from 'react';
import { useDocument } from '@/hooks/useDocument';
import type { DocumentContentResponse } from '@/types/document';
import { 
  FileText, 
  Download, 
  Share2, 
  Calendar,
  Clock,
  ArrowLeft,
  Settings,
  Users,
  History,
  RefreshCcw,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentApiError } from '@/lib/api/document';
import { useToast } from '@/hooks/use-toast';
import { DocumentPreviewPanel } from '@/components/documents/preview/DocumentPreviewPanel';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetTitle,
  SheetHeader,
  SheetDescription,
  SheetClose
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';

interface DocumentPageProps {
  params: Promise<{ id: string }>;
}

const LoadingSkeleton = () => (
  <div className="w-full p-4 space-y-4">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>
      <Skeleton className="h-8 w-20" />
    </div>
    <Skeleton className="h-[calc(100vh-12rem)] w-full" />
  </div>
);

const MobileNavDrawer = ({ 
  children, 
  title,
  isOpen,
  onClose
}: { 
  children: React.ReactNode;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center justify-between">
            <span>{title}</span>
            <SheetClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto max-h-[calc(100vh-5rem)]">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
};

const InfoPanel = ({ 
  title, 
  children,
  className 
}: { 
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) => (
  <Card className={cn("shadow-none bg-white", className)}>
    <CardContent className="p-4">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-1">
        {title}
      </h3>
      {children}
    </CardContent>
  </Card>
);

export default function DocumentPage({ params }: DocumentPageProps) {
  const resolvedParams = use(params);
  const documentId = resolvedParams.id;
  
  const { getDocument, getDocumentContent, isLoading } = useDocument();
  const { toast } = useToast();
  const [document, setDocument] = useState<DocumentContentResponse | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('preview');
  const [error, setError] = useState<DocumentApiError | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const [isInfoOpen, setInfoOpen] = useState(false);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);

  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  const isMounted = useRef(true);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchTime = useRef<number>(0);
  const MIN_FETCH_INTERVAL = 5000;

  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, []);
  
  const handleError = (err: unknown) => {
    if (err instanceof DocumentApiError) {
      setError(err);
      if (err.error.status === 429 && retryCount < 3) {
        toast({
          variant: "warning",
          title: "Too Many Requests",
          description: "Please wait a moment, retrying..."
        });
        return true;
      } else {
        toast({
          variant: "destructive",
          title: err.error.status === 404 ? "Not Found" : "Error",
          description: err.error.message
        });
      }
    } else {
      setError(new DocumentApiError({
        status: 500,
        message: 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR'
      }));
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load document"
      });
    }
    return false;
  };
  
  const fetchDocument = async (retry = false) => {
    if (!documentId || isRetrying) return;
  
    const now = Date.now();
    if (retry && now - lastFetchTime.current < MIN_FETCH_INTERVAL) {
      const delay = MIN_FETCH_INTERVAL - (now - lastFetchTime.current);
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
      fetchTimeoutRef.current = setTimeout(() => {
        if (isMounted.current) {
          fetchDocument(true);
        }
      }, delay);
      return;
    }
  
    try {
      setIsRetrying(retry);
      const doc = await getDocument(documentId);
      
      if (!isMounted.current) return;
      
      setDocument(doc);
      setError(null);
      lastFetchTime.current = now;
  
      const contentResponse = await getDocumentContent(documentId);
      if (!isMounted.current) return;
      
      setContent(contentResponse?.content || null);
      setRetryCount(0);
    } catch (err) {
      if (!isMounted.current) return;
      
      const shouldRetry = handleError(err);
      if (shouldRetry) {
        setRetryCount(prev => prev + 1);
        fetchDocument(true);
      }
    } finally {
      if (isMounted.current) {
        setIsRetrying(false);
      }
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
        <p className="text-sm text-muted-foreground mb-4 text-center">{error.error.message}</p>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <a href="/documents"><ArrowLeft className="mr-1 h-4 w-4" /> Back</a>
          </Button>
          {error.error.status === 429 && (
            <Button onClick={() => fetchDocument(true)} disabled={isRetrying} size="sm">
              <RefreshCcw className={`mr-1 h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Retrying...' : 'Retry'}
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (!document) return <LoadingSkeleton />;

  const documentStatus = document.status?.toLowerCase() || 'draft';
  const statusColors = {
    draft: 'bg-gray-100 text-gray-700',
    pending: 'bg-yellow-100 text-yellow-700',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700'
  };

  const DocumentInfo = () => (
    <div className="space-y-4">
      {/* Parties Section */}
      <InfoPanel title={<div className="flex items-center gap-2"><Users className="h-4 w-4" /> Parties</div>}>
        <div className="space-y-3">
          {document.parties?.map((party, index) => (
            <div key={party.id || index} className="flex items-start justify-between gap-2 pb-3 last:pb-0 last:border-0 border-b border-gray-100">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{party.name}</p>
                <p className="text-xs text-muted-foreground truncate">{party.email}</p>
                <p className="text-xs text-muted-foreground truncate">{party.jurisdiction}</p>
              </div>
              <Badge variant="outline" className="text-xs whitespace-nowrap">{party.type}</Badge>
            </div>
          ))}
        </div>
      </InfoPanel>

      {/* History Section */}
      <InfoPanel 
        title={<div className="flex items-center gap-2"><History className="h-4 w-4" /> History</div>}
      >
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium">Document Created</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(document.generated_at), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
          </div>
        </div>
      </InfoPanel>
    </div>
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50/50">
      {/* Header */}
      <header className="flex-none bg-white border-b">
        {/* Top Header */}
        <div className="px-4 py-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              {/* Mobile Navigation Toggle */}
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileNavOpen(true)}
                  className="flex-shrink-0"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              )}

              {/* Back Button - Hidden on Small Mobile */}
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hidden sm:flex flex-shrink-0"
              >
                <a href="/documents">
                  <ArrowLeft className="h-4 w-4" />
                </a>
              </Button>

              {/* Document Info */}
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-8 w-8 rounded bg-blue-500/10 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-lg font-semibold truncate">
                      {document.document_type}
                    </h1>
                    <Badge 
                      className={cn(
                        "flex-shrink-0",
                        statusColors[documentStatus]
                      )} 
                      variant="secondary"
                    >
                      {documentStatus.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1 whitespace-nowrap">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(document.generated_at), 'MMM d, yyyy')}
                    </span>
                    <span className="flex items-center gap-1 whitespace-nowrap">
                      <Clock className="h-3 w-3" />
                      v{document.version}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Share2 className="mr-1.5 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
                <span className="ml-1.5 hidden sm:inline">Download</span>
              </Button>
              <Button size="sm" className="hidden sm:flex">
                <Settings className="mr-1.5 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Left Navigation Panel - Desktop Only */}
          {!isMobile && (
            <div className="w-48 flex-none overflow-y-auto border-r bg-white">
              <DocumentPreviewPanel 
                content={content || ''} 
                onPageChange={(pageNumber) => {
                  console.log(`Navigating to page ${pageNumber}`);
                }}
                previewIframeRef={previewIframeRef}
              />
            </div>
          )}

          {/* Document Preview */}
          <div className="flex-1 min-w-0 bg-white">
            <Card className="h-full rounded-none border-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <div className="flex-none flex items-center justify-between border-b px-4">
                  <TabsList>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="code">HTML Code</TabsTrigger>
                  </TabsList>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4 mr-1.5" />
                    Export
                  </Button>
                </div>

                <div className="flex-1 min-h-0">
                  <TabsContent value="preview" className="h-full m-0 p-0">
                    {content ? (
                      <iframe
                        ref={previewIframeRef}
                        srcDoc={content}
                        title="Document Preview"
                        className="w-full h-full border-0"
                        sandbox="allow-same-origin"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full bg-gray-50">
                        <FileText className="h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Preview not available
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="code" className="h-full m-0">
                    <pre className="h-full overflow-auto bg-gray-50 p-4 text-sm">
                      {content || 'No content available'}
                    </pre>
                  </TabsContent>
                </div>
              </Tabs>
            </Card>
          </div>

          {/* Right Sidebar - Desktop */}
          {!isTablet && (
            <div className="w-64 flex-none overflow-y-auto border-l bg-white">
              <div className="p-4">
                <DocumentInfo />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <MobileNavDrawer
        title="Document Navigation"
        isOpen={isMobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      >
        <div className="p-4">
          <DocumentPreviewPanel 
            content={content || ''} 
            onPageChange={(pageNumber) => {
              console.log(`Navigating to page ${pageNumber}`);
              setMobileNavOpen(false);
            }}
            previewIframeRef={previewIframeRef}
          />
        </div>
      </MobileNavDrawer>

      {/* Mobile Info Sheet */}
      {isTablet && (
        <Sheet open={isInfoOpen} onOpenChange={setInfoOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg"
            >
              <Info className="h-4 w-4 mr-1.5" />
              Info
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-md p-0">
            <SheetHeader className="p-4 border-b">
              <SheetTitle>Document Information</SheetTitle>
              <SheetDescription>
                View document details and history
              </SheetDescription>
            </SheetHeader>
            <div className="overflow-y-auto p-4 max-h-[calc(100vh-8rem)]">
              <DocumentInfo />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}