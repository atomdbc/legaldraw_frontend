import { useState, useCallback } from 'react';
import { EditorContent } from './EditorContent';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { 
  Save, 
  RotateCcw, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  History,
  Maximize2,
  Minimize2,
  FileText
} from 'lucide-react';
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import useDocument from '@/hooks/useDocument';
import { cn } from '@/lib/utils';

interface DocumentEditorProps {
  content: string;
  documentId: string;
  documentType: string;
  version: string;
  onSave: (content: string) => Promise<void>;
}

export default function DocumentEditor({
  content,
  documentId,
  version,
  onSave,
}: DocumentEditorProps) {
  const { toast } = useToast();
  const [editorContent, setEditorContent] = useState(content);
  const [isDirty, setIsDirty] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { publishDraft } = useDocument();

  const handleContentChange = useCallback((newContent: string, newDocumentId?: string) => {
    setEditorContent(newContent);
    setIsDirty(true);
  }, []);

  const handlePublish = async () => {
    if (!isDirty) return;

    try {
      setIsPublishing(true);
      setPublishProgress(25);

      const progressInterval = setInterval(() => {
        setPublishProgress(prev => Math.min(prev + 15, 90));
      }, 500);

      const publishedDoc = await publishDraft(documentId, editorContent, version);
      
      clearInterval(progressInterval);
      setPublishProgress(100);

      if (publishedDoc?.document_id) {
        toast({
          title: "Successfully Published",
          description: "Your document has been published and is now live.",
          icon: <CheckCircle2 className="h-4 w-4 text-green-500" />
        });
        setTimeout(() => {
          window.location.href = `/documents/${publishedDoc.document_id}`;
        }, 1000);
      }

    } catch (error: any) {
      console.error('Publishing failed:', error);
      toast({
        variant: "destructive",
        title: "Publishing Failed",
        description: error.error?.message || "Failed to publish document changes"
      });
    } finally {
      setIsPublishing(false);
      setPublishProgress(0);
    }
  };

  const handleDiscard = useCallback(() => {
    setEditorContent(content);
    setIsDirty(false);
    toast({
      title: "Changes Discarded",
      description: "Your changes have been discarded successfully",
      icon: <RotateCcw className="h-4 w-4 text-gray-500" />
    });
  }, [content]);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className={cn(
      "h-full w-full flex flex-col bg-gray-50/50",
      isFullScreen && "fixed inset-0 z-50 bg-white"
    )}>
      <div className="sticky top-0 z-20 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-3">
                {isDirty ? (
                  <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-full">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Unsaved changes</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-medium">All changes saved</span>
                  </div>
                )}
              </div>

              <Separator orientation="vertical" className="h-6" />

              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <History className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Version History</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={toggleFullScreen}
                      >
                        {isFullScreen ? (
                          <Minimize2 className="h-4 w-4" />
                        ) : (
                          <Maximize2 className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {isDirty && (
                <>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleDiscard}
                          className="gap-2 text-gray-500 hover:text-gray-700"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Discard
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Discard all changes</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Button
                    onClick={handlePublish}
                    disabled={isPublishing || !isDirty}
                    size="sm"
                    className={cn(
                      "gap-2 bg-green-600 hover:bg-green-700 text-white",
                      "transition-all duration-200 ease-in-out",
                      "shadow-sm hover:shadow-md",
                      isPublishing && "opacity-80"
                    )}
                  >
                    <Save className="h-4 w-4" />
                    {isPublishing ? 'Publishing...' : 'Publish'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {isPublishing && (
        <div className="fixed top-4 right-4 z-50">
          <Alert className="border-blue-100 bg-blue-50/95 backdrop-blur-sm shadow-lg w-80">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="ml-2">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-blue-800">
                  Publishing document...
                </span>
                <Progress 
                  value={publishProgress} 
                  className="h-1.5 bg-blue-100" 
                />
                <span className="text-xs text-blue-600">
                  This may take a few moments
                </span>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="flex-1 relative">
        <div className={cn(
          "absolute inset-0",
          isFullScreen ? "p-0" : "p-6"
        )}>
          <div className={cn(
            "bg-white h-full overflow-hidden",
            isFullScreen ? "rounded-none border-0" : "rounded-lg shadow-sm border"
          )}>
            {editorContent ? (
              <EditorContent
                content={editorContent}
                documentId={documentId}
                onChange={handleContentChange}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <FileText className="h-12 w-12 mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">No Content Yet</h3>
                <p className="text-sm text-gray-400">
                  Start typing to create your document
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}