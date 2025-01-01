'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { use } from 'react';
import { useDocument } from '@/hooks/useDocument';
import type { DocumentContentResponse } from '@/types/document';
import { 
  FileText, 
  ArrowLeft, 
  Download, 
  Share2, 
  MoreVertical,
  Clock,
  Calendar,
  Users,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit3,
  Maximize2
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DocumentApiError } from '@/lib/api/document';
import { cn } from '@/lib/utils';
import DocumentEditor from '@/components/documents/editor/DocumentEditor';
import { Separator } from '@radix-ui/react-dropdown-menu';

interface DocumentPageProps {
  params: Promise<{ id: string }>;
}

const LoadingSkeleton = () => (
  <div className="w-full h-screen flex flex-col">
    <div className="flex-none bg-white border-b p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    </div>
    <div className="flex-1 p-6">
      <Card className="h-full">
        <div className="p-4 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-[calc(100vh-16rem)] w-full" />
        </div>
      </Card>
    </div>
  </div>
);

const DocumentInfo = ({ document }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-gray-500" />
      <div>
        <p className="text-sm font-medium">Created</p>
        <p className="text-sm text-gray-500">
          {format(new Date(document.generated_at), 'MMM d, yyyy')}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <Clock className="h-4 w-4 text-gray-500" />
      <div>
        <p className="text-sm font-medium">Last Modified</p>
        <p className="text-sm text-gray-500">
          {format(new Date(), 'MMM d, yyyy')}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <BookOpen className="h-4 w-4 text-gray-500" />
      <div>
        <p className="text-sm font-medium">Version</p>
        <p className="text-sm text-gray-500">{document.version || '1.0'}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <Users className="h-4 w-4 text-gray-500" />
      <div>
        <p className="text-sm font-medium">Shared With</p>
        <p className="text-sm text-gray-500">3 People</p>
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const statusConfig = {
    draft: {
      icon: AlertCircle,
      className: 'bg-gray-100 text-gray-700 border-gray-200',
      label: 'Draft'
    },
    pending: {
      icon: Clock,
      className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      label: 'Pending'
    },
    completed: {
      icon: CheckCircle2,
      className: 'bg-green-50 text-green-700 border-green-200',
      label: 'Completed'
    }
  };

  const config = statusConfig[status] || statusConfig.draft;
  const Icon = config.icon;

  return (
    <Badge 
      className={cn(
        "px-2.5 py-0.5 flex items-center gap-1.5 capitalize border",
        config.className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </Badge>
  );
};

export default function DocumentPage({ params }: DocumentPageProps) {
  const resolvedParams = use(params);
  const documentId = resolvedParams.id;
  
  const { getDocument, getDocumentContent, isLoading } = useDocument();
  const [document, setDocument] = useState<DocumentContentResponse | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('preview');
  const [error, setError] = useState<DocumentApiError | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);

  const handleDownload = useCallback(() => {
    if (!content) return;

    try {
      // Create a full HTML document with proper structure
      const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${document?.document_type || 'Document'}</title>
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            line-height: 1.5;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
        }
    </style>
</head>
<body>
    <div class="document-content">
        ${content}
    </div>
</body>
</html>`;

      const blob = new Blob([fullHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `${document?.document_type?.toLowerCase() || 'document'}-${documentId}.html`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  }, [content, documentId, document?.document_type]);

  const handleSave = async (newContent: string) => {
    setContent(newContent);
    // Add your save logic here
  };

  const fetchDocument = async () => {
    try {
      const doc = await getDocument(documentId);
      setDocument(doc);
      
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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <Card className="max-w-md w-full p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-red-50 rounded-full">
              <FileText className="h-8 w-8 text-red-500" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-semibold">
                {error.error.status === 404 ? 'Document Not Found' : 'Error Loading Document'}
              </h1>
              <p className="text-gray-500">
                {error.error.status === 404 
                  ? "We couldn't find the document you're looking for. It might have been moved or deleted."
                  : "We encountered an error while loading this document. Please try again later."}
              </p>
            </div>
            <Button asChild variant="default" className="w-full mt-4">
              <a href="/documents">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Documents
              </a>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const documentStatus = document.status?.toLowerCase() || 'draft';

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Keep existing header */}
      <header className="flex-none bg-white border-b px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full" asChild>
                      <a href="/documents">
                        <ArrowLeft className="h-5 w-5" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Back to Documents</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold text-gray-900">
                  {document.document_type}
                </h1>
                <StatusBadge status={documentStatus} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => {}}
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Document Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Make a Copy</DropdownMenuItem>
                  <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                  <DropdownMenuItem>Print</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    Delete Document
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <DocumentInfo document={document} />
        </div>
      </header>

      {/* Enhanced main content area */}
      <div className="flex-1 overflow-hidden p-6">
        <Card className="h-full rounded-lg border shadow-sm overflow-hidden">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="h-full flex flex-col"
          >
            {/* Enhanced tabs header */}
            <div className="flex-none border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
              <div className="px-6 pt-2 flex items-center justify-between">
                <TabsList className="relative h-12 p-1 bg-gray-100/80 rounded-xl">
                  <div
                    className={cn(
                      "absolute inset-y-1 transition-all duration-200 rounded-lg bg-white shadow-sm",
                      activeTab === 'preview' ? "left-1 right-[50%]" : "left-[50%] right-1"
                    )}
                  />
                  <TabsTrigger 
                    value="preview"
                    className={cn(
                      "relative rounded-lg px-8 h-10 transition-colors duration-200",
                      "data-[state=active]:text-gray-900 data-[state=inactive]:text-gray-600",
                      "data-[state=active]:font-medium"
                    )}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="edit"
                    className={cn(
                      "relative rounded-lg px-8 h-10 transition-colors duration-200",
                      "data-[state=active]:text-gray-900 data-[state=inactive]:text-gray-600",
                      "data-[state=active]:font-medium"
                    )}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-9 px-3">
                          <Eye className="h-4 w-4 mr-2" />
                          View Changes
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Compare document versions</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Separator orientation="vertical" className="h-6" />

                  <Button size="sm" variant="ghost" className="h-9 w-9 p-0">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Content area */}
            <div className="flex-1 min-h-0 relative">
              <TabsContent value="preview" className="absolute inset-0 !m-0 !p-0">
                {content ? (
                  <iframe
                    ref={previewIframeRef}
                    srcDoc={content}
                    title="Document Preview"
                    className="w-full h-full border-0 bg-white"
                    sandbox="allow-same-origin"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <div className="p-4 bg-gray-50 rounded-full">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500 font-medium">No content to preview</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Switch to Edit mode to add content
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="edit" className="absolute inset-0 !m-0">
                {isSaving && (
                  <Alert className="fixed top-4 right-4 w-auto z-50">
                    <AlertTitle>Saving Changes</AlertTitle>
                    <AlertDescription>
                      <Progress value={33} className="w-48 mt-2" />
                    </AlertDescription>
                  </Alert>
                )}
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