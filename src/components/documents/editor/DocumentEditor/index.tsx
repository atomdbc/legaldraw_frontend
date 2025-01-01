import { useState, useCallback } from 'react';
import { EditorContent } from './EditorContent';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { 
  Save, 
  RotateCcw, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import useDocument from '@/hooks/useDocument';

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

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setPublishProgress(prev => Math.min(prev + 15, 90));
      }, 500);

      const publishedDoc = await publishDraft(documentId, editorContent, version);
      
      clearInterval(progressInterval);
      setPublishProgress(100);

      if (publishedDoc?.document_id) {
        toast({
          title: "Success",
          description: "Document published successfully",
        });
        setTimeout(() => {
          window.location.href = `/documents/${publishedDoc.document_id}`;
        }, 1000);
      }

    } catch (error: any) {
      console.error('Publishing failed:', {
        error,
        message: error.message,
        details: error.error,
        content: editorContent.substring(0, 100)
      });

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
      title: "Changes discarded",
      description: "Your changes have been discarded"
    });
  }, [content]);

  return (
    <div className="h-full w-full flex flex-col bg-gray-50/50">
      <div className="w-full border-b bg-white px-6 py-3 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            {isDirty && (
              <div className="flex items-center gap-2 text-yellow-600">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Unsaved changes</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {isDirty && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDiscard}
                  className="gap-2 text-gray-500 hover:text-gray-700"
                >
                  <RotateCcw className="h-4 w-4" />
                  Discard
                </Button>
                <Button
                  onClick={handlePublish}
                  disabled={isPublishing || !isDirty}
                  size="sm"
                  className="gap-2 bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4" />
                  {isPublishing ? 'Publishing...' : 'Publish'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {isPublishing && (
        <div className="absolute top-4 right-4 z-50 w-80">
          <Alert className="border-blue-100 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="ml-2">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-blue-800">
                  Publishing document...
                </span>
                <Progress value={publishProgress} className="h-1.5" />
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="flex-1 relative">
        <div className="absolute inset-0 p-6">
          <div className="bg-white h-full rounded-lg shadow-sm border">
            <EditorContent
              content={editorContent}
              documentId={documentId}
              onChange={handleContentChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}