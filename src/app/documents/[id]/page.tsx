'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  Info,
  Code,
  Edit,
  Loader2
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
import { DocumentEditor } from '@/components/documents/editor/DocumentEditor';

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
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [hasCoverPage, setHasCoverPage] = useState(false);
  const [coverPageText, setCoverPageText] = useState('');
  const [coverPageLogo, setCoverPageLogo] = useState<File | null>(null);
  const [hasWatermark, setHasWatermark] = useState(false);
  const [watermarkText, setWatermarkText] = useState('');
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [draftContent, setDraftContent] = useState<string | null>(null);

  const isMounted = useRef(true);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchTime = useRef<number>(0);
  const MIN_FETCH_INTERVAL = 5000;

  // Handle settings changes
  const handleSettingsChange = useCallback(({ 
    hasCoverPage: newHasCoverPage, 
    coverPageText: newCoverPageText, 
    hasWatermark: newHasWatermark, 
    watermarkText: newWatermarkText 
  }) => {
    requestAnimationFrame(() => {
      if (newHasCoverPage !== undefined) setHasCoverPage(newHasCoverPage);
      if (newCoverPageText !== undefined) setCoverPageText(newCoverPageText);
      if (newHasWatermark !== undefined) setHasWatermark(newHasWatermark);
      if (newWatermarkText !== undefined) setWatermarkText(newWatermarkText);
      setActiveTab('preview'); // Auto switch to preview

      toast({
        title: "View changes in Preview",
        description: "Switch to Preview tab to see your changes",
        duration: 3000
      });
    });
  }, [toast]);

  // Handle logo upload
  const handleLogoUpload = useCallback((file: File) => {
    requestAnimationFrame(() => {
      setCoverPageLogo(file);
      setActiveTab('preview');
      toast({
        title: "Logo uploaded",
        description: "Switch to Preview tab to see the changes",
        duration: 3000
      });
    });
  }, [toast]);

  // Handle logo remove
  const handleLogoRemove = useCallback(() => {
    requestAnimationFrame(() => {
      setCoverPageLogo(null);
      setActiveTab('preview');
      toast({
        title: "Logo removed",
        description: "Switch to Preview tab to see the changes",
        duration: 3000
      });
    });
  }, [toast]);

  // Handle save draft
  const saveDraft = useCallback(async (content: string) => {
    try {
      setIsDraftSaving(true);
      // TODO: Add API call to save draft
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastSaved(new Date());
      toast({
        title: "Draft saved",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Failed to save draft",
        description: "Your changes could not be saved. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDraftSaving(false);
    }
  }, [toast]);
  
  // Handle publish changes
  const handlePublishChanges = async () => {
    try {
      setIsDraftSaving(true);
      // TODO: Add API call to publish changes
      await new Promise(resolve => setTimeout(resolve, 1500)); // Temporary for testing
      
      toast({
        title: "Changes published",
        description: "Your document has been updated.",
      });
      
      // Reset draft state
      setDraftContent(null);
      setLastSaved(null);
      setActiveTab('preview');
    } catch (error) {
      toast({
        title: "Failed to publish",
        description: "Your changes could not be published. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDraftSaving(false);
    }
  };
  
  // Handle discard changes
  const handleDiscardChanges = () => {
    setDraftContent(null);
    setLastSaved(null);
    setActiveTab('preview');
    toast({
      title: "Changes discarded",
      description: "Your draft has been discarded.",
    });
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
  
      const baseContent = contentResponse?.content || '';
  
      // Add watermark and cover page styles
      const styles = `
  <style>
    ${hasWatermark ? `
      /* First, set base styles for all pages */
      .page {
        position: relative !important;
        overflow: hidden !important;
      }
      
      /* Then add watermark to all pages except cover page */
      body > div:not(.cover-page).page::before {
        content: "${watermarkText || 'DRAFT'}";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        font-size: 72px;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.08);
        white-space: nowrap;
        pointer-events: none;
        z-index: 1000;
        width: 100%;
        text-align: center;
        font-family: system-ui, -apple-system, sans-serif;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
      }
    ` : ''}w
          ${hasCoverPage ? `
            body {
  margin: 0;
  padding: 0;
  min-width: 100%;
  min-height: 100%;
  overflow-x: hidden;
}
            .cover-page {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              padding: 4rem;
              page-break-after: always;
              background: white;
              font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
            }
            .logo-container {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 3rem;
              max-height: 200px;
            }
            .logo-container img {
              max-width: 180px;
              max-height: 180px;
              object-fit: contain;
            }
            .title-container {
              width: 100%;
              max-width: 600px;
              text-align: center;
              margin: 0 auto;
            }
            .cover-title {
              font-size: 32px;
              font-weight: 600;
              color: #171717;
              line-height: 1.4;
              margin: 0;
              padding: 0;
              word-wrap: break-word;
              overflow-wrap: break-word;
              hyphens: auto;
              display: -webkit-box;
              -webkit-line-clamp: 4;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
            .document-type {
              font-size: 16px;
              color: #666;
              margin-top: 1rem;
              font-weight: 500;
            }
            .document-date {
              font-size: 14px;
              color: #888;
              margin-top: 0.5rem;
            }
          ` : ''}
        </style>
      `;
  
      // Generate cover page HTML
      const coverPageHtml = hasCoverPage ? `
        <div class="page cover-page">
          ${coverPageLogo ? 
            `<div class="logo-container">
              <img src="${URL.createObjectURL(coverPageLogo)}" alt="Cover Logo" />
            </div>` 
            : ''
          }
          <div class="title-container">
            <h1 class="cover-title">${coverPageText || 'Cover Page'}</h1>
            <div class="document-type">${document?.document_type || ''}</div>
            <div class="document-date">
              ${format(new Date(document?.generated_at || new Date()), 'MMMM d, yyyy')}
            </div>
          </div>
        </div>
      ` : '';
  
      // Check if content has HTML structure
      const hasHtmlStructure = baseContent.includes('<!DOCTYPE html>') || baseContent.includes('<html');
  
      let fullContent;
      if (hasHtmlStructure) {
        // Insert styles and cover page into existing HTML
        fullContent = baseContent
          .replace('<head>', `<head>${styles}`)
          .replace('<body', `<body>${hasCoverPage ? coverPageHtml : ''}`);
      } else {
        // Wrap content in new HTML structure
        fullContent = `
          <!DOCTYPE html>
          <html>
            <head>
              ${styles}
            </head>
            <body>
              ${hasCoverPage ? coverPageHtml : ''}
              ${baseContent}
            </body>
          </html>
        `;
      }
  
      setContent(fullContent);
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
    return () => {
      isMounted.current = false;
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, []);
  
  // Add this useEffect to handle all document updates
  useEffect(() => {
    fetchDocument();
  }, [documentId, hasCoverPage, coverPageText, coverPageLogo, hasWatermark, watermarkText]);
  
  useEffect(() => {
    fetchDocument();
  }, [documentId, hasCoverPage, coverPageText, coverPageLogo]);
  
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
              <Button 
  size="sm" 
  className="hidden sm:flex"
  onClick={() => setSettingsOpen(true)}
>
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
            <Card className="h-full w-full rounded-none border-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <div className="flex-none flex items-center justify-between border-b px-4">
                  <TabsList>
                    <TabsTrigger value="preview" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Preview
                    </TabsTrigger>
                    <TabsTrigger value="edit" className="gap-2">
                      <Edit className="h-4 w-4" />
                      {isDraftSaving && <Loader2 className="ml-2 h-3 w-3 animate-spin" />}
                    </TabsTrigger>
                    <TabsTrigger value="code" className="gap-2">
                      <Code className="h-4 w-4" />
                      Source
                    </TabsTrigger>
                  </TabsList>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4 mr-1.5" />
                    Export
                  </Button>
                </div>

                <div className="flex-1 min-h-0 h-full relative"> 
                <TabsContent value="preview" className="absolute inset-0 !m-0 !p-0">
                    {content ? (
                      <iframe
                        ref={previewIframeRef}
                        srcDoc={content}
                        title="Document Preview"
                        className="w-full h-full border-0 absolute inset-0"
                        sandbox="allow-same-origin"
                        style={{ minWidth: '100%', minHeight: '100%' }}
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
  <div className="h-full overflow-auto bg-zinc-50 p-4">
    <pre className="text-sm font-mono whitespace-pre-wrap break-words max-w-full">
      <code className="block w-full">{content || 'No content available'}</code>
    </pre>
  </div>
</TabsContent>
<TabsContent value="edit" className="absolute inset-0 !m-0">
<DocumentEditor 
                      content={content || ''}
                      documentId={documentId}
                      documentType={document.document_type}
                      version={document.version}
                      onSave={saveDraft}
                      settings={{
                        hasCoverPage,
                        coverPageText,
                        hasWatermark,
                        watermarkText,
                        coverPageLogo
                      }}
                      onSettingsChange={handleSettingsChange}
                      onLogoUpload={handleLogoUpload}
                      onLogoRemove={handleLogoRemove}
                    />
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